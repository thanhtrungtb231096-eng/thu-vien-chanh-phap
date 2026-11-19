import Foundation
import AVFoundation
import MediaPlayer
import CryptoKit
#if canImport(UIKit)
import UIKit
#endif

public struct QueueSegmentItem {
    public let index: Int
    public let block: String
    public let heading: String
    public let chapterIndex: Int
    public let chapterCount: Int
    public let chapterTitle: String
    public let baseSeconds: Double
    public let pauseBefore: Int
    public let sourceOffset: Int
    public let text: String

    public init(
        index: Int,
        block: String,
        heading: String,
        chapterIndex: Int = -1,
        chapterCount: Int = 0,
        chapterTitle: String = "",
        baseSeconds: Double = 0.0,
        pauseBefore: Int = 0,
        sourceOffset: Int,
        text: String
    ) {
        self.index = index
        self.block = block
        self.heading = heading
        self.chapterIndex = chapterIndex
        self.chapterCount = chapterCount
        self.chapterTitle = chapterTitle
        self.baseSeconds = baseSeconds
        self.pauseBefore = pauseBefore
        self.sourceOffset = sourceOffset
        self.text = text
    }
}

private struct ChapterSection {
    let chapterIndex: Int
    let title: String
    let startIndex: Int
    let endIndex: Int
}

private struct PreloadedSegment {
    let index: Int
    let player: AVAudioPlayer
    let isLocalAi: Bool
    let label: String
}

public final class ChanhPhapAudioPlayer: NSObject, AVAudioPlayerDelegate, AVSpeechSynthesizerDelegate {
    public static let shared = ChanhPhapAudioPlayer()

    public var onStateChanged: (([String: Any]) -> Void)?

    private let mainQueue = DispatchQueue.main
    private let foregroundSynthQueue = DispatchQueue(label: "org.chanhphap.engine.audio-fg", qos: .userInitiated)
    private let prefetchQueue = DispatchQueue(label: "org.chanhphap.engine.audio-prefetch", qos: .utility, attributes: .concurrent)

    private let inFlightCondition = NSCondition()
    private var inFlightKeys: Set<String> = []
    private var resolvedCache: [String: (URL, Bool, String, Double)] = [:]

    private var bookKey: String = ""
    private var bookTitle: String = "Thư viện Chánh Pháp"
    private var remoteBaseUrl: String = "https://thuvienchanhphap.duckdns.org"
    private var rawVoice: String = "vieneu-thien-tam-duc"
    private var voice: String = "vieneu-thien-tam-duc"
    private var voiceLabel: String = "Thiền Tâm Đức · AI Chánh Pháp"
    private var rate: Double = 0.95
    private var segments: [QueueSegmentItem] = []
    private var chapters: [ChapterSection] = []
    private var actualDurations: [Int: Double] = [:]
    private var smoothedChapterId: String = ""
    private var smoothedChapterDur: Double = 0.0

    private var currentIndex: Int = 0
    private var status: String = "idle"
    private var message: String = ""
    private var packActive: Bool = false
    private var onDeviceAiActive: Bool = false
    private var sessionGeneration: UInt64 = 0

    private var repeatMode: String = "off"
    private var repeatTarget: Int = 0
    private var repeatCount: Int = 0
    private var repeatA: Int = -1
    private var repeatB: Int = -1
    private var sleepDeadlineMs: Double = 0

    private var audioPlayer: AVAudioPlayer?
    private var preloadedNext: PreloadedSegment?
    private var keepAlivePlayer: AVAudioPlayer?
    private lazy var silentWavData: Data = Self.makeSilentWavData()

    #if canImport(UIKit)
    private var bgTaskId: UIBackgroundTaskIdentifier = .invalid
    #endif

    private let speechSynth = AVSpeechSynthesizer()
    private var usingSystemSpeech = false
    private var systemSpeechDurationEst: Double = 1.0
    private var systemSpeechStartedAt: TimeInterval = 0

    private var tickTimer: DispatchSourceTimer?
    private var remoteCommandsConfigured = false
    private var wasPlayingBeforeInterruption = false

    private override init() {
        super.init()
        speechSynth.delegate = self
        setupNotifications()
        setupTickTimer()
    }

    private static func makeSilentWavData() -> Data {
        let sampleRate: UInt32 = 8000
        let seconds: UInt32 = 2
        let dataBytes: UInt32 = sampleRate * seconds * 2
        let riffSize: UInt32 = 36 + dataBytes
        let byteRate: UInt32 = sampleRate * 2
        var d = Data(capacity: Int(44 + dataBytes))
        d.append(contentsOf: "RIFF".utf8)
        withUnsafeBytes(of: riffSize.littleEndian) { d.append(contentsOf: $0) }
        d.append(contentsOf: "WAVEfmt ".utf8)
        withUnsafeBytes(of: UInt32(16).littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: UInt16(1).littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: UInt16(1).littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: sampleRate.littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: byteRate.littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: UInt16(2).littleEndian) { d.append(contentsOf: $0) }
        withUnsafeBytes(of: UInt16(16).littleEndian) { d.append(contentsOf: $0) }
        d.append(contentsOf: "data".utf8)
        withUnsafeBytes(of: dataBytes.littleEndian) { d.append(contentsOf: $0) }
        d.append(Data(count: Int(dataBytes)))
        return d
    }

    private static func estimateSegmentSeconds(_ seg: QueueSegmentItem) -> Double {
        if seg.baseSeconds > 0.2 { return seg.baseSeconds }
        let clean = seg.text.trimmingCharacters(in: .whitespacesAndNewlines)
        if clean.isEmpty { return 0.8 }
        let words = Double(max(1, clean.split(whereSeparator: { $0.isWhitespace }).count))
        let commas = Double(clean.filter { ",;，；:：".contains($0) }.count)
        let stops = Double(clean.filter { ".!?。！？…".contains($0) }.count)
        let pause = Double(max(0, seg.pauseBefore)) / 1000.0
        return max(0.8, words / 3.15 + commas * 0.20 + stops * 0.38 + 0.35 + pause)
    }

    private static func buildChapterSections(from segments: [QueueSegmentItem], bookTitle: String) -> [ChapterSection] {
        guard !segments.isEmpty else { return [] }
        if segments.allSatisfy({ $0.chapterIndex >= 0 && $0.chapterCount > 0 }) {
            var grouped: [Int: (title: String, start: Int, end: Int)] = [:]
            for seg in segments {
                let ci = seg.chapterIndex
                if let existing = grouped[ci] {
                    grouped[ci] = (
                        title: existing.title.isEmpty ? seg.chapterTitle : existing.title,
                        start: min(existing.start, seg.index),
                        end: max(existing.end, seg.index)
                    )
                } else {
                    grouped[ci] = (
                        title: seg.chapterTitle.isEmpty ? (seg.heading.isEmpty ? bookTitle : seg.heading) : seg.chapterTitle,
                        start: seg.index,
                        end: seg.index
                    )
                }
            }
            let sortedKeys = grouped.keys.sorted()
            return sortedKeys.enumerated().compactMap { pos, k in
                guard let g = grouped[k] else { return nil }
                return ChapterSection(
                    chapterIndex: pos,
                    title: g.title.isEmpty ? "Phần \(pos + 1)" : g.title,
                    startIndex: g.start,
                    endIndex: g.end
                )
            }
        }

        // Fallback structural grouping if segments arrived without precomputed chapterIndex
        var starts: [(Int, String)] = []
        for (i, seg) in segments.enumerated() {
            let h = seg.heading.trimmingCharacters(in: .whitespacesAndNewlines)
            if !h.isEmpty { starts.append((i, h)) }
        }
        if starts.isEmpty || starts[0].0 > 0 {
            if let first = starts.first, first.0 <= 4 {
                starts[0] = (0, first.1)
            } else {
                starts.insert((0, bookTitle), at: 0)
            }
        }
        return starts.enumerated().map { idx, pair in
            let endIdx = idx + 1 < starts.count ? starts[idx + 1].0 - 1 : segments.count - 1
            return ChapterSection(chapterIndex: idx, title: pair.1, startIndex: pair.0, endIndex: endIdx)
        }
    }

    private func segmentMediaDuration(at idx: Int) -> Double {
        guard idx >= 0 && idx < segments.count else { return 1.0 }
        if idx == currentIndex && !usingSystemSpeech, let p = audioPlayer, p.duration > 0.1 {
            return p.duration
        }
        if let exact = actualDurations[idx], exact > 0.1 {
            return exact
        }
        return Self.estimateSegmentSeconds(segments[idx])
    }

    private func currentChapterProgress() -> (chapterIndex: Int, chapterCount: Int, title: String, startIndex: Int, endIndex: Int, time: Double, duration: Double, estimated: Bool) {
        guard !segments.isEmpty else {
            return (0, 0, bookTitle, 0, 0, 0, 1.0, false)
        }
        let chList = chapters.isEmpty ? Self.buildChapterSections(from: segments, bookTitle: bookTitle) : chapters
        let clamped = min(max(0, currentIndex), segments.count - 1)
        let active = chList.first(where: { $0.startIndex <= clamped && clamped <= $0.endIndex }) ?? chList[0]

        var elapsedBefore = 0.0
        var total = 0.0
        var allExact = true
        for i in active.startIndex...active.endIndex {
            let hasExact = (actualDurations[i] ?? 0) > 0.1 || (i == currentIndex && (audioPlayer?.duration ?? 0) > 0.1)
            if !hasExact { allExact = false }
            let d = segmentMediaDuration(at: i)
            if i < clamped { elapsedBefore += d }
            total += d
        }
        let curDur = segmentMediaDuration(at: clamped)
        let inSeg = min(curDur, max(0, currentPositionSeconds()))
        let rawTotal = max(0.5, total)
        let chId = "\(bookKey)|\(voice)|\(active.chapterIndex)"
        var stableTotal = rawTotal
        if !allExact {
            if smoothedChapterId == chId && smoothedChapterDur > 0 {
                if abs(rawTotal - smoothedChapterDur) >= 4.0 {
                    smoothedChapterDur = rawTotal
                } else {
                    stableTotal = smoothedChapterDur
                }
            } else {
                smoothedChapterId = chId
                smoothedChapterDur = rawTotal
            }
        } else {
            smoothedChapterId = chId
            smoothedChapterDur = rawTotal
        }
        let chapterTime = min(stableTotal, max(0, elapsedBefore + inSeg))
        let finalTotal = max(stableTotal, chapterTime + (clamped < active.endIndex ? 0.5 : 0.0))
        return (active.chapterIndex, chList.count, active.title, active.startIndex, active.endIndex, chapterTime, finalTotal, !allExact)
    }

    private func locateInCurrentChapter(targetChapterSeconds: Double) -> (index: Int, seconds: Double) {
        guard !segments.isEmpty else { return (0, 0) }
        let ch = currentChapterProgress()
        var rem = max(0, targetChapterSeconds)
        for i in ch.startIndex...ch.endIndex {
            let d = segmentMediaDuration(at: i)
            if rem < d || i == ch.endIndex {
                return (i, min(max(0, d - 0.05), rem))
            }
            rem -= d
        }
        return (ch.endIndex, 0)
    }

    private func locateByDeltaSeconds(_ delta: Double) -> (index: Int, seconds: Double) {
        guard !segments.isEmpty else { return (0, 0) }
        var idx = min(max(0, currentIndex), segments.count - 1)
        var pos = max(0, currentPositionSeconds()) + delta
        while pos < 0 && idx > 0 {
            idx -= 1
            pos += segmentMediaDuration(at: idx)
        }
        if pos < 0 { return (0, 0) }
        while idx < segments.count - 1 {
            let d = segmentMediaDuration(at: idx)
            if pos < d { break }
            pos -= d
            idx += 1
        }
        let finalDur = segmentMediaDuration(at: idx)
        return (idx, min(max(0, finalDur - 0.05), pos))
    }

    private func beginBackgroundGuard() {
        #if canImport(UIKit)
        if bgTaskId == .invalid {
            bgTaskId = UIApplication.shared.beginBackgroundTask(withName: "ChanhPhapAudioTransition") { [weak self] in
                self?.endBackgroundGuard()
            }
        }
        #endif
    }

    private func endBackgroundGuard() {
        #if canImport(UIKit)
        if bgTaskId != .invalid {
            let id = bgTaskId
            bgTaskId = .invalid
            UIApplication.shared.endBackgroundTask(id)
        }
        #endif
    }

    private func startSilentKeepAlive() {
        guard keepAlivePlayer?.isPlaying != true else { return }
        if let p = try? AVAudioPlayer(data: silentWavData) {
            p.numberOfLoops = -1
            p.volume = 0.005
            p.prepareToPlay()
            p.play()
            keepAlivePlayer = p
        }
    }

    private func stopSilentKeepAlive() {
        keepAlivePlayer?.stop()
        keepAlivePlayer = nil
    }

    private func setupNotifications() {
        let nc = NotificationCenter.default
        nc.addObserver(
            self,
            selector: #selector(handleAudioInterruption(_:)),
            name: AVAudioSession.interruptionNotification,
            object: AVAudioSession.sharedInstance()
        )
        nc.addObserver(
            self,
            selector: #selector(handleRouteChange(_:)),
            name: AVAudioSession.routeChangeNotification,
            object: AVAudioSession.sharedInstance()
        )
    }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(
                .playback,
                mode: .spokenAudio,
                options: [.allowBluetooth, .allowBluetoothA2DP, .allowAirPlay]
            )
            try session.setActive(true)
        } catch {
            try? session.setCategory(.playback, mode: .default)
            try? session.setActive(true)
        }
        configureRemoteCommandsIfNeeded()
    }

    private func configureRemoteCommandsIfNeeded() {
        guard !remoteCommandsConfigured else { return }
        remoteCommandsConfigured = true
        let cc = MPRemoteCommandCenter.shared()

        cc.playCommand.isEnabled = true
        cc.playCommand.addTarget { [weak self] _ in
            self?.resumeOrStart()
            return .success
        }

        cc.pauseCommand.isEnabled = true
        cc.pauseCommand.addTarget { [weak self] _ in
            self?.pause()
            return .success
        }

        cc.togglePlayPauseCommand.isEnabled = true
        cc.togglePlayPauseCommand.addTarget { [weak self] _ in
            guard let self = self else { return .commandFailed }
            if self.status == "playing" || self.status == "loading" {
                self.pause()
            } else {
                self.resumeOrStart()
            }
            return .success
        }

        // Next Track on Lock Screen / AirPods -> Jump to NEXT CHAPTER (Phần kinh tiếp theo)
        cc.nextTrackCommand.isEnabled = true
        cc.nextTrackCommand.addTarget { [weak self] _ in
            guard let self = self, !self.segments.isEmpty else { return .commandFailed }
            let ch = self.currentChapterProgress()
            if ch.chapterIndex + 1 < self.chapters.count {
                let nextCh = self.chapters[ch.chapterIndex + 1]
                self.seek(index: nextCh.startIndex, seconds: 0, resume: true)
            } else {
                self.emitState(finished: false, nextBookRequested: true)
            }
            return .success
        }

        // Previous Track on Lock Screen / AirPods -> Restart current Chapter if > 5s, else Previous Chapter
        cc.previousTrackCommand.isEnabled = true
        cc.previousTrackCommand.addTarget { [weak self] _ in
            guard let self = self, !self.segments.isEmpty else { return .commandFailed }
            let ch = self.currentChapterProgress()
            if ch.time > 5.0 || ch.chapterIndex == 0 {
                self.seek(index: ch.startIndex, seconds: 0, resume: true)
            } else {
                let prevCh = self.chapters[ch.chapterIndex - 1]
                self.seek(index: prevCh.startIndex, seconds: 0, resume: true)
            }
            return .success
        }

        // +15s / -15s on Lock Screen -> Smooth cross-segment skip!
        cc.skipForwardCommand.isEnabled = true
        cc.skipForwardCommand.preferredIntervals = [15]
        cc.skipForwardCommand.addTarget { [weak self] event in
            guard let self = self, !self.segments.isEmpty else { return .commandFailed }
            let step = (event as? MPSkipIntervalCommandEvent)?.interval ?? 15.0
            let target = self.locateByDeltaSeconds(step)
            self.seek(index: target.index, seconds: target.seconds, resume: self.status == "playing" || self.status == "loading")
            return .success
        }

        cc.skipBackwardCommand.isEnabled = true
        cc.skipBackwardCommand.preferredIntervals = [15]
        cc.skipBackwardCommand.addTarget { [weak self] event in
            guard let self = self, !self.segments.isEmpty else { return .commandFailed }
            let step = (event as? MPSkipIntervalCommandEvent)?.interval ?? 15.0
            let target = self.locateByDeltaSeconds(-step)
            self.seek(index: target.index, seconds: target.seconds, resume: self.status == "playing" || self.status == "loading")
            return .success
        }

        // Scrub bar on iPhone Lock Screen -> Full-Chapter scrub!
        cc.changePlaybackPositionCommand.isEnabled = true
        cc.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let self = self, let posEvent = event as? MPChangePlaybackPositionCommandEvent else {
                return .commandFailed
            }
            let target = self.locateInCurrentChapter(targetChapterSeconds: max(0, posEvent.positionTime))
            self.seek(index: target.index, seconds: target.seconds, resume: self.status == "playing" || self.status == "loading")
            return .success
        }
    }

    private func setupTickTimer() {
        let timer = DispatchSource.makeTimerSource(queue: mainQueue)
        timer.schedule(deadline: .now() + 0.5, repeating: 0.5)
        timer.setEventHandler { [weak self] in
            self?.onPeriodicTick()
        }
        timer.resume()
        self.tickTimer = timer
    }

    private func onPeriodicTick() {
        guard status == "playing" else { return }
        if sleepDeadlineMs > 0 {
            let nowMs = Date().timeIntervalSince1970 * 1000.0
            if nowMs >= sleepDeadlineMs {
                sleepDeadlineMs = 0
                fadeOutAndPauseForSleep()
                return
            }
        }
        if !usingSystemSpeech, let p = audioPlayer, p.duration > 0.1 {
            actualDurations[currentIndex] = p.duration
        }
        updateNowPlayingInfo()
        emitState()
    }

    private func fadeOutAndPauseForSleep() {
        guard let player = audioPlayer, player.isPlaying else {
            message = "Đã dừng theo hẹn giờ ngủ."
            pause()
            return
        }
        player.setVolume(0.0, fadeDuration: 2.0)
        mainQueue.asyncAfter(deadline: .now() + 2.05) { [weak self] in
            guard let self = self else { return }
            self.audioPlayer?.volume = 1.0
            self.message = "Đã dừng theo hẹn giờ ngủ."
            self.pause()
        }
    }

    @objc private func handleAudioInterruption(_ notification: Notification) {
        guard let info = notification.userInfo,
              let typeRaw = info[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeRaw) else { return }

        mainQueue.async { [weak self] in
            guard let self = self else { return }
            switch type {
            case .began:
                self.wasPlayingBeforeInterruption = (self.status == "playing" || self.status == "loading")
                if self.wasPlayingBeforeInterruption {
                    self.pause()
                }
            case .ended:
                let optsRaw = (info[AVAudioSessionInterruptionOptionKey] as? UInt) ?? 0
                let opts = AVAudioSession.InterruptionOptions(rawValue: optsRaw)
                if self.wasPlayingBeforeInterruption && opts.contains(.shouldResume) {
                    self.wasPlayingBeforeInterruption = false
                    self.resumeOrStart()
                }
            @unknown default:
                break
            }
        }
    }

    @objc private func handleRouteChange(_ notification: Notification) {
        guard let info = notification.userInfo,
              let reasonRaw = info[AVAudioSessionRouteChangeReasonKey] as? UInt,
              let reason = AVAudioSession.RouteChangeReason(rawValue: reasonRaw) else { return }
        if reason == .oldDeviceUnavailable {
            mainQueue.async { [weak self] in
                if self?.status == "playing" {
                    self?.pause()
                }
            }
        }
    }

    public func startQueue(
        bookKey: String,
        bookTitle: String,
        remoteBaseUrl: String,
        voice: String,
        rate: Double,
        startIndex: Int,
        startSeconds: Double,
        repeatMode: String,
        repeatTarget: Int,
        repeatA: Int,
        repeatB: Int,
        sleepDeadlineMs: Double,
        segments: [QueueSegmentItem]
    ) {
        mainQueue.async { [weak self] in
            guard let self = self, !segments.isEmpty else { return }
            let cleanNextVoice = voice.contains("thuc-doan") ? "vieneu-thuc-doan" : "vieneu-thien-tam-duc"
            let sameSession = (self.bookKey == bookKey && self.voice == cleanNextVoice && self.segments.count == segments.count)
            self.stopInternal(emitIdle: false)
            if !sameSession {
                self.actualDurations.removeAll()
                self.smoothedChapterId = ""
                self.smoothedChapterDur = 0
                self.inFlightCondition.lock()
                self.resolvedCache.removeAll()
                self.inFlightCondition.unlock()
            }
            self.bookKey = bookKey
            self.bookTitle = bookTitle
            self.remoteBaseUrl = remoteBaseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
            self.rawVoice = voice
            self.voice = cleanNextVoice
            self.voiceLabel = self.voice == "vieneu-thuc-doan"
                ? "Thục Đoan · Nữ (AI Chánh Pháp)"
                : "Thiền Tâm Đức · Nam (AI Chánh Pháp)"
            self.rate = min(2.0, max(0.5, rate))
            self.segments = segments
            self.chapters = Self.buildChapterSections(from: segments, bookTitle: bookTitle)
            self.currentIndex = min(max(0, startIndex), segments.count - 1)
            self.repeatMode = repeatMode
            self.repeatTarget = max(0, repeatTarget)
            self.repeatCount = 0
            self.repeatA = repeatA
            self.repeatB = repeatB
            self.sleepDeadlineMs = sleepDeadlineMs

            self.configureAudioSession()
            self.playSegment(at: self.currentIndex, startSeconds: max(0, startSeconds))
        }
    }

    public func resumeOrStart() {
        mainQueue.async { [weak self] in
            guard let self = self, !self.segments.isEmpty else { return }
            self.configureAudioSession()
            if self.usingSystemSpeech, self.speechSynth.isPaused {
                self.speechSynth.continueSpeaking()
                self.status = "playing"
                self.updateNowPlayingInfo()
                self.emitState()
                return
            }
            if let player = self.audioPlayer, self.status == "paused" {
                player.enableRate = true
                player.rate = Float(self.rate)
                player.play()
                self.status = "playing"
                self.updateNowPlayingInfo()
                self.emitState()
                self.prefetchUpcomingSegments(after: self.currentIndex, generation: self.sessionGeneration, voice: self.voice, remoteBaseUrl: self.remoteBaseUrl)
                return
            }
            self.playSegment(at: self.currentIndex, startSeconds: self.currentPositionSeconds())
        }
    }

    public func pause() {
        mainQueue.async { [weak self] in
            guard let self = self else { return }
            self.sessionGeneration &+= 1
            self.stopSilentKeepAlive()
            self.endBackgroundGuard()
            if self.usingSystemSpeech && self.speechSynth.isSpeaking {
                self.speechSynth.pauseSpeaking(at: .word)
            }
            self.audioPlayer?.pause()
            if self.status != "idle" {
                self.status = "paused"
                self.updateNowPlayingInfo()
                self.emitState()
            }
        }
    }

    public func stop() {
        mainQueue.async { [weak self] in
            self?.stopInternal(emitIdle: true)
        }
    }

    private func stopInternal(emitIdle: Bool) {
        sessionGeneration &+= 1
        stopSilentKeepAlive()
        endBackgroundGuard()
        preloadedNext?.player.stop()
        preloadedNext = nil
        audioPlayer?.stop()
        audioPlayer = nil
        if speechSynth.isSpeaking || speechSynth.isPaused {
            speechSynth.stopSpeaking(at: .immediate)
        }
        usingSystemSpeech = false
        status = "idle"
        if emitIdle {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            emitState()
        }
    }

    public func seek(index: Int, seconds: Double, resume: Bool) {
        mainQueue.async { [weak self] in
            guard let self = self, !self.segments.isEmpty else { return }
            let clampedIdx = min(max(0, index), self.segments.count - 1)
            if clampedIdx == self.currentIndex, let player = self.audioPlayer, !self.usingSystemSpeech {
                let clampedSec = min(max(0, seconds), max(0, player.duration - 0.05))
                player.currentTime = clampedSec
                if resume && !player.isPlaying {
                    self.configureAudioSession()
                    player.enableRate = true
                    player.rate = Float(self.rate)
                    player.play()
                    self.status = "playing"
                } else if !resume && player.isPlaying {
                    player.pause()
                    self.status = "paused"
                }
                self.updateNowPlayingInfo()
                self.emitState()
                return
            }
            self.currentIndex = clampedIdx
            if resume {
                self.configureAudioSession()
                self.playSegment(at: clampedIdx, startSeconds: max(0, seconds))
            } else {
                self.sessionGeneration &+= 1
                self.stopSilentKeepAlive()
                self.endBackgroundGuard()
                self.preloadedNext = nil
                self.audioPlayer?.stop()
                self.audioPlayer = nil
                self.status = "paused"
                self.updateNowPlayingInfo()
                self.emitState()
            }
        }
    }

    public func updateOptions(
        repeatMode: String?,
        repeatTarget: Int?,
        repeatA: Int?,
        repeatB: Int?,
        sleepDeadlineMs: Double?,
        rate: Double?
    ) {
        mainQueue.async { [weak self] in
            guard let self = self else { return }
            if let rm = repeatMode { self.repeatMode = rm; self.repeatCount = 0 }
            if let rt = repeatTarget { self.repeatTarget = max(0, rt); self.repeatCount = 0 }
            if let ra = repeatA { self.repeatA = ra }
            if let rb = repeatB { self.repeatB = rb }
            if let sd = sleepDeadlineMs { self.sleepDeadlineMs = max(0, sd) }
            if let r = rate {
                self.rate = min(2.0, max(0.5, r))
                if let player = self.audioPlayer {
                    player.enableRate = true
                    player.rate = Float(self.rate)
                }
            }
            self.updateNowPlayingInfo()
            self.emitState()
        }
    }

    public func currentStateSnapshot(finished: Bool = false, nextBookRequested: Bool = false) -> [String: Any] {
        let ch = currentChapterProgress()
        return [
            "bookKey": bookKey,
            "status": status,
            "index": currentIndex,
            "currentTime": currentPositionSeconds(),
            "duration": currentDurationSeconds(),
            "chapterIndex": ch.chapterIndex,
            "chapterCount": ch.chapterCount,
            "chapterTitle": ch.title,
            "chapterTime": ch.time,
            "chapterDuration": ch.duration,
            "chapterEstimated": ch.estimated,
            "voice": voice,
            "voiceLabel": voiceLabel,
            "packActive": packActive,
            "onDeviceAiActive": onDeviceAiActive,
            "finished": finished,
            "nextBookRequested": nextBookRequested,
            "message": message
        ]
    }

    private func currentPositionSeconds() -> Double {
        if usingSystemSpeech {
            if status == "playing" {
                return min(systemSpeechDurationEst, max(0, Date().timeIntervalSince1970 - systemSpeechStartedAt))
            }
            return 0
        }
        return audioPlayer?.currentTime ?? 0
    }

    private func currentDurationSeconds() -> Double {
        if usingSystemSpeech {
            return max(1.0, systemSpeechDurationEst)
        }
        if let d = audioPlayer?.duration, d > 0.05 {
            return d
        }
        if let exact = actualDurations[currentIndex], exact > 0.05 {
            return exact
        }
        if currentIndex >= 0 && currentIndex < segments.count {
            return Self.estimateSegmentSeconds(segments[currentIndex])
        }
        return 1.0
    }

    private func emitState(finished: Bool = false, nextBookRequested: Bool = false) {
        let snap = currentStateSnapshot(finished: finished, nextBookRequested: nextBookRequested)
        onStateChanged?(snap)
    }

    private func updateNowPlayingInfo() {
        guard !segments.isEmpty, currentIndex < segments.count else { return }
        let ch = currentChapterProgress()
        let displayTitle = (ch.chapterCount > 1 && !ch.title.isEmpty && ch.title.lowercased() != bookTitle.lowercased())
            ? "\(ch.title) — \(bookTitle)"
            : bookTitle
        let partPrefix = ch.chapterCount > 1 ? "Phần \(ch.chapterIndex + 1)/\(ch.chapterCount)" : "Trọn bản kinh"
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: displayTitle,
            MPMediaItemPropertyArtist: "\(partPrefix) · \(voiceLabel)",
            MPMediaItemPropertyAlbumTitle: "Đại Thư Viện Chánh Pháp",
            MPMediaItemPropertyPlaybackDuration: ch.duration,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: ch.time,
            MPNowPlayingInfoPropertyPlaybackRate: (status == "playing" || status == "loading") ? rate : 0.0,
            MPNowPlayingInfoPropertyDefaultPlaybackRate: 1.0,
            MPNowPlayingInfoPropertyPlaybackQueueIndex: ch.chapterIndex,
            MPNowPlayingInfoPropertyPlaybackQueueCount: max(1, ch.chapterCount)
        ]
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    private func mountPlayerAndStart(
        player: AVAudioPlayer,
        index: Int,
        startSeconds: Double,
        isAiLocal: Bool,
        label: String,
        cleanText: String,
        generation: UInt64
    ) {
        stopSilentKeepAlive()
        endBackgroundGuard()
        player.delegate = self
        player.enableRate = true
        player.rate = Float(self.rate)
        if player.duration > 0.1 {
            actualDurations[index] = player.duration
        }
        if startSeconds > 0.05 {
            player.currentTime = min(startSeconds, max(0, player.duration - 0.1))
        }
        player.play()
        self.audioPlayer = player
        self.onDeviceAiActive = isAiLocal
        self.packActive = isAiLocal
        self.voiceLabel = label
        self.status = "playing"
        self.message = "Đang đọc · " + String(cleanText.prefix(68))
        self.updateNowPlayingInfo()
        self.emitState()
        self.prefetchUpcomingSegments(after: index, generation: generation, voice: self.voice, remoteBaseUrl: self.remoteBaseUrl)
    }

    private func playSegment(at index: Int, startSeconds: Double) {
        guard index >= 0 && index < segments.count else { return }
        sessionGeneration &+= 1
        let gen = sessionGeneration
        currentIndex = index
        audioPlayer?.stop()
        audioPlayer = nil
        if speechSynth.isSpeaking || speechSynth.isPaused {
            speechSynth.stopSpeaking(at: .immediate)
        }
        usingSystemSpeech = false

        let seg = segments[index]
        let cleanText = seg.text.trimmingCharacters(in: .whitespacesAndNewlines)
        if cleanText.isEmpty {
            advanceToNextSegment()
            return
        }

        // Ultra-fast <1ms zero-gap handoff when next segment was already preloaded in RAM!
        if let ready = preloadedNext, ready.index == index {
            preloadedNext = nil
            mountPlayerAndStart(
                player: ready.player,
                index: index,
                startSeconds: startSeconds,
                isAiLocal: ready.isLocalAi,
                label: ready.label,
                cleanText: cleanText,
                generation: gen
            )
            return
        }
        preloadedNext = nil

        // Keep iOS AVAudioSession & CPU alive across network/ONNX synthesis while screen is locked
        beginBackgroundGuard()
        startSilentKeepAlive()
        status = "loading"
        message = "Đang chuẩn bị giọng đọc…"
        updateNowPlayingInfo()
        emitState()

        let activeVoice = self.voice
        let remoteBase = self.remoteBaseUrl
        let allowSystemDevice = self.rawVoice.hasPrefix("device:")

        foregroundSynthQueue.async { [weak self] in
            guard let self = self else { return }
            let resolved = self.resolveSegmentAudioFile(
                segIndex: index,
                text: cleanText,
                voice: activeVoice,
                remoteBaseUrl: remoteBase,
                maxRetries: 4
            )

            self.mainQueue.async {
                guard self.sessionGeneration == gen else { return }
                if let (fileURL, isAiLocal, label, fileDur) = resolved {
                    if fileDur > 0.1 { self.actualDurations[index] = fileDur }
                    if let player = try? AVAudioPlayer(contentsOf: fileURL) {
                        player.prepareToPlay()
                        self.mountPlayerAndStart(
                            player: player,
                            index: index,
                            startSeconds: startSeconds,
                            isAiLocal: isAiLocal,
                            label: label,
                            cleanText: cleanText,
                            generation: gen
                        )
                        return
                    }
                }

                self.stopSilentKeepAlive()
                self.endBackgroundGuard()
                if allowSystemDevice {
                    self.playWithSystemSpeech(text: cleanText)
                } else {
                    // Preserve warm AI voice 100%; pause cleanly at exact position instead of switching to robotic Siri
                    self.status = "error"
                    self.message = "Kết nối giọng đọc gián đoạn. Nhấn Nghe tiếp hoặc tải Gói Giọng AI Nội Bộ để nghe không cần mạng."
                    self.updateNowPlayingInfo()
                    self.emitState()
                }
            }
        }
    }

    private func prefetchUpcomingSegments(after index: Int, generation: UInt64, voice: String, remoteBaseUrl: String) {
        guard index + 1 < segments.count else { return }
        var candidates: [(Int, String)] = []
        var estTotal = 0.0
        let upperBound = min(segments.count - 1, repeatB >= index + 1 ? repeatB : segments.count - 1)
        if index + 1 <= upperBound {
            for i in (index + 1)...upperBound {
                let txt = segments[i].text.trimmingCharacters(in: .whitespacesAndNewlines)
                if txt.isEmpty { continue }
                candidates.append((i, txt))
                estTotal += Self.estimateSegmentSeconds(segments[i])
                if candidates.count >= 14 || (candidates.count >= 4 && estTotal >= 110.0) {
                    break
                }
            }
        }
        guard !candidates.isEmpty else { return }

        // 1. Immediately resolve & preload index + 1 onto AVAudioPlayer for <1ms gapless transition
        let immediateNext = candidates[0]
        foregroundSynthQueue.async { [weak self] in
            guard let self = self, self.sessionGeneration == generation else { return }
            if let (url, isLocal, label, dur) = self.resolveSegmentAudioFile(
                segIndex: immediateNext.0,
                text: immediateNext.1,
                voice: voice,
                remoteBaseUrl: remoteBaseUrl,
                maxRetries: 3
            ) {
                let preparedPlayer = try? AVAudioPlayer(contentsOf: url)
                preparedPlayer?.prepareToPlay()
                self.mainQueue.async {
                    guard self.sessionGeneration == generation else { return }
                    if dur > 0.1 { self.actualDurations[immediateNext.0] = dur }
                    if let p = preparedPlayer, self.currentIndex == index {
                        self.preloadedNext = PreloadedSegment(index: immediateNext.0, player: p, isLocalAi: isLocal, label: label)
                    }
                }
            }
        }

        // 2. Prefetch remaining lookahead window (~90-110s ahead) without blocking foreground queue
        let rest = Array(candidates.dropFirst())
        guard !rest.isEmpty else { return }
        prefetchQueue.async { [weak self] in
            guard let self = self else { return }
            for (segIdx, txt) in rest {
                if self.sessionGeneration != generation { break }
                if let (_, _, _, dur) = self.resolveSegmentAudioFile(
                    segIndex: segIdx,
                    text: txt,
                    voice: voice,
                    remoteBaseUrl: remoteBaseUrl,
                    maxRetries: 2
                ), dur > 0.1 {
                    self.mainQueue.async {
                        if self.sessionGeneration == generation {
                            self.actualDurations[segIdx] = dur
                        }
                    }
                }
            }
        }
    }

    private static func measureAudioDuration(url: URL) -> Double {
        if let p = try? AVAudioPlayer(contentsOf: url), p.duration > 0.05 {
            return p.duration
        }
        return 0.0
    }

    private func resolveSegmentAudioFile(
        segIndex: Int,
        text: String,
        voice: String,
        remoteBaseUrl: String,
        maxRetries: Int
    ) -> (URL, Bool, String, Double)? {
        let dedupKey = "\(voice)|\(text)"
        inFlightCondition.lock()
        if let hit = resolvedCache[dedupKey], FileManager.default.fileExists(atPath: hit.0.path) {
            inFlightCondition.unlock()
            return hit
        }
        while inFlightKeys.contains(dedupKey) {
            inFlightCondition.wait()
            if let hit = resolvedCache[dedupKey], FileManager.default.fileExists(atPath: hit.0.path) {
                inFlightCondition.unlock()
                return hit
            }
        }
        inFlightKeys.insert(dedupKey)
        inFlightCondition.unlock()

        defer {
            inFlightCondition.lock()
            inFlightKeys.remove(dedupKey)
            inFlightCondition.broadcast()
            inFlightCondition.unlock()
        }

        // Tier 1: On-Device Neural AI (VieNeu-TTS-v3-Nano ONNX) — 100% offline in Airplane Mode
        if VieNeuNanoMobile.shared.isAvailable() {
            if let wavURL = try? VieNeuNanoMobile.shared.synthesizeToWavFile(text: text, voiceId: voice, speed: 1.0) {
                let label = voice == "vieneu-thuc-doan"
                    ? "Thục Đoan · AI Nội Bộ"
                    : "Thiền Tâm Đức · AI Nội Bộ"
                let dur = Self.measureAudioDuration(url: wavURL)
                let res = (wavURL, true, label, dur)
                cacheResolved(dedupKey, value: res)
                return res
            }
        }

        // Tier 2: Existing local MP3 cache from prior online TTS or downloaded chapter
        let mp3Digest = SHA256.hash(data: Data("mp3|\(voice)|\(text)".utf8)).map { String(format: "%02x", $0) }.joined()
        let cachedMp3 = ChanhPhapVault.shared.cacheDir.appendingPathComponent("\(mp3Digest).mp3")
        if FileManager.default.fileExists(atPath: cachedMp3.path) {
            let attrs = try? FileManager.default.attributesOfItem(atPath: cachedMp3.path)
            if ((attrs?[.size] as? NSNumber)?.intValue ?? 0) > 256 {
                let label = voice == "vieneu-thuc-doan" ? "Thục Đoan · Đã lưu đệm" : "Thiền Tâm Đức · Đã lưu đệm"
                let dur = Self.measureAudioDuration(url: cachedMp3)
                let res = (cachedMp3, false, label, dur)
                cacheResolved(dedupKey, value: res)
                return res
            }
        }

        // Tier 3: Remote Server /api/tts with exponential backoff retries to preserve warm AI voice over 4G
        guard let ttsURL = URL(string: "\(remoteBaseUrl)/api/tts") else { return nil }
        let attempts = max(1, maxRetries)
        let backoffs: [TimeInterval] = [0.8, 1.8, 3.5, 6.0]

        for attempt in 0..<attempts {
            var req = URLRequest(url: ttsURL, timeoutInterval: 28)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            let bodyObj: [String: Any] = ["text": text, "voice": voice, "stream": false]
            req.httpBody = try? JSONSerialization.data(withJSONObject: bodyObj)

            let sem = DispatchSemaphore(value: 0)
            var fetchedData: Data?
            var statusCode = 0
            let task = URLSession.shared.dataTask(with: req) { data, resp, _ in
                statusCode = (resp as? HTTPURLResponse)?.statusCode ?? 0
                fetchedData = data
                sem.signal()
            }
            task.resume()
            _ = sem.wait(timeout: .now() + 30)

            if statusCode == 200, let data = fetchedData, data.count > 256 {
                try? data.write(to: cachedMp3, options: .atomic)
                let label = voice == "vieneu-thuc-doan" ? "Thục Đoan · Máy chủ AI" : "Thiền Tâm Đức · Máy chủ AI"
                let dur = Self.measureAudioDuration(url: cachedMp3)
                let res = (cachedMp3, false, label, dur)
                cacheResolved(dedupKey, value: res)
                return res
            }
            if statusCode >= 400 && statusCode < 500 && statusCode != 429 {
                break
            }
            if attempt + 1 < attempts {
                Thread.sleep(forTimeInterval: backoffs[min(attempt, backoffs.count - 1)])
            }
        }
        return nil
    }

    private func cacheResolved(_ key: String, value: (URL, Bool, String, Double)) {
        inFlightCondition.lock()
        if resolvedCache.count > 64 {
            resolvedCache.removeAll(keepingCapacity: true)
        }
        resolvedCache[key] = value
        inFlightCondition.unlock()
    }

    private func playWithSystemSpeech(text: String) {
        usingSystemSpeech = true
        onDeviceAiActive = false
        voiceLabel = "Giọng tiếng Việt iOS (Thiết bị)"
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "vi-VN")
        let mappedRate = AVSpeechUtteranceDefaultSpeechRate * Float(rate)
        utterance.rate = min(AVSpeechUtteranceMaximumSpeechRate, max(AVSpeechUtteranceMinimumSpeechRate, mappedRate))
        let wordCount = max(1, text.split(separator: " ").count)
        systemSpeechDurationEst = max(1.5, Double(wordCount) / (3.1 * rate))
        systemSpeechStartedAt = Date().timeIntervalSince1970
        status = "playing"
        message = "Đang đọc (Giọng thiết bị) · " + String(text.prefix(60))
        speechSynth.speak(utterance)
        updateNowPlayingInfo()
        emitState()
    }

    private func advanceToNextSegment() {
        // Check A-B segment loop first
        if repeatA >= 0 && repeatB >= repeatA && currentIndex >= repeatB {
            repeatCount += 1
            if repeatTarget > 0 && repeatCount >= repeatTarget {
                message = "Đã hoàn tất \(repeatTarget) biến tụng đã chọn."
                pause()
                return
            }
            playSegment(at: min(repeatA, segments.count - 1), startSeconds: 0)
            return
        }

        if currentIndex + 1 < segments.count {
            playSegment(at: currentIndex + 1, startSeconds: 0)
            return
        }

        // End of sutra reached
        if repeatMode == "one" || repeatMode == "all" {
            repeatCount += 1
            if repeatTarget > 0 && repeatCount >= repeatTarget {
                status = "paused"
                message = "Đã hoàn tất \(repeatTarget) biến tụng."
                updateNowPlayingInfo()
                emitState(finished: false)
                return
            }
            playSegment(at: 0, startSeconds: 0)
            return
        }

        stopSilentKeepAlive()
        endBackgroundGuard()
        status = "paused"
        message = "Đã nghe trọn bản kinh."
        updateNowPlayingInfo()
        emitState(finished: true)
    }

    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        mainQueue.async { [weak self] in
            guard let self = self, self.audioPlayer === player else { return }
            self.advanceToNextSegment()
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        mainQueue.async { [weak self] in
            guard let self = self, self.usingSystemSpeech, self.status == "playing" else { return }
            self.advanceToNextSegment()
        }
    }
}
