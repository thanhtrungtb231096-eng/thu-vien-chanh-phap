import Foundation
import AVFoundation
import MediaPlayer
import CryptoKit

public struct QueueSegmentItem {
    public let index: Int
    public let block: String
    public let heading: String
    public let sourceOffset: Int
    public let text: String
}

public final class ChanhPhapAudioPlayer: NSObject, AVAudioPlayerDelegate, AVSpeechSynthesizerDelegate {
    public static let shared = ChanhPhapAudioPlayer()

    public var onStateChanged: (([String: Any]) -> Void)?

    private let mainQueue = DispatchQueue.main
    private let synthWorkerQueue = DispatchQueue(label: "org.chanhphap.engine.audio-worker", qos: .userInitiated)

    private var bookKey: String = ""
    private var bookTitle: String = "Thư viện Chánh Pháp"
    private var remoteBaseUrl: String = "https://thuvienchanhphap.duckdns.org"
    private var voice: String = "vieneu-thien-tam-duc"
    private var voiceLabel: String = "Thiền Tâm Đức · AI Chánh Pháp"
    private var rate: Double = 0.95
    private var segments: [QueueSegmentItem] = []

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
            // Keep running even if simulator lacks full audio hardware options
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

        cc.nextTrackCommand.isEnabled = true
        cc.nextTrackCommand.addTarget { [weak self] _ in
            guard let self = self else { return .commandFailed }
            let nextIdx = min(max(0, self.segments.count - 1), self.currentIndex + 1)
            self.seek(index: nextIdx, seconds: 0, resume: true)
            return .success
        }

        cc.previousTrackCommand.isEnabled = true
        cc.previousTrackCommand.addTarget { [weak self] _ in
            guard let self = self else { return .commandFailed }
            if self.currentPositionSeconds() > 4.0 {
                self.seek(index: self.currentIndex, seconds: 0, resume: true)
            } else {
                let prevIdx = max(0, self.currentIndex - 1)
                self.seek(index: prevIdx, seconds: 0, resume: true)
            }
            return .success
        }

        cc.skipForwardCommand.isEnabled = true
        cc.skipForwardCommand.preferredIntervals = [15]
        cc.skipForwardCommand.addTarget { [weak self] event in
            guard let self = self else { return .commandFailed }
            let step = (event as? MPSkipIntervalCommandEvent)?.interval ?? 15.0
            let target = self.currentPositionSeconds() + step
            if target >= self.currentDurationSeconds() - 0.25, self.currentIndex + 1 < self.segments.count {
                self.seek(index: self.currentIndex + 1, seconds: 0, resume: self.status == "playing")
            } else {
                self.seek(index: self.currentIndex, seconds: target, resume: self.status == "playing")
            }
            return .success
        }

        cc.skipBackwardCommand.isEnabled = true
        cc.skipBackwardCommand.preferredIntervals = [15]
        cc.skipBackwardCommand.addTarget { [weak self] event in
            guard let self = self else { return .commandFailed }
            let step = (event as? MPSkipIntervalCommandEvent)?.interval ?? 15.0
            let target = max(0, self.currentPositionSeconds() - step)
            self.seek(index: self.currentIndex, seconds: target, resume: self.status == "playing")
            return .success
        }

        cc.changePlaybackPositionCommand.isEnabled = true
        cc.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let self = self, let posEvent = event as? MPChangePlaybackPositionCommandEvent else {
                return .commandFailed
            }
            self.seek(index: self.currentIndex, seconds: max(0, posEvent.positionTime), resume: self.status == "playing")
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
            self.stopInternal(emitIdle: false)
            self.bookKey = bookKey
            self.bookTitle = bookTitle
            self.remoteBaseUrl = remoteBaseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
            self.voice = voice.contains("thuc-doan") ? "vieneu-thuc-doan" : "vieneu-thien-tam-duc"
            self.voiceLabel = self.voice == "vieneu-thuc-doan"
                ? "Thục Đoan · Nữ (AI Chánh Pháp)"
                : "Thiền Tâm Đức · Nam (AI Chánh Pháp)"
            self.rate = min(2.0, max(0.5, rate))
            self.segments = segments
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
                player.rate = Float(self.rate)
                player.play()
                self.status = "playing"
                self.updateNowPlayingInfo()
                self.emitState()
                return
            }
            self.playSegment(at: self.currentIndex, startSeconds: self.currentPositionSeconds())
        }
    }

    public func pause() {
        mainQueue.async { [weak self] in
            guard let self = self else { return }
            self.sessionGeneration &+= 1
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

    public func currentStateSnapshot(finished: Bool = false) -> [String: Any] {
        return [
            "bookKey": bookKey,
            "status": status,
            "index": currentIndex,
            "currentTime": currentPositionSeconds(),
            "duration": currentDurationSeconds(),
            "voice": voice,
            "voiceLabel": voiceLabel,
            "packActive": packActive,
            "onDeviceAiActive": onDeviceAiActive,
            "finished": finished,
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
        let d = audioPlayer?.duration ?? 0
        return d > 0.05 ? d : 1.0
    }

    private func emitState(finished: Bool = false) {
        let snap = currentStateSnapshot(finished: finished)
        onStateChanged?(snap)
    }

    private func updateNowPlayingInfo() {
        guard !segments.isEmpty, currentIndex < segments.count else { return }
        let seg = segments[currentIndex]
        let chapterLabel = seg.heading.isEmpty ? "Đoạn \(currentIndex + 1)/\(segments.count)" : seg.heading
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: bookTitle,
            MPMediaItemPropertyArtist: "Thư viện Chánh Pháp · \(chapterLabel)",
            MPMediaItemPropertyAlbumTitle: voiceLabel,
            MPMediaItemPropertyPlaybackDuration: currentDurationSeconds(),
            MPNowPlayingInfoPropertyElapsedPlaybackTime: currentPositionSeconds(),
            MPNowPlayingInfoPropertyPlaybackRate: status == "playing" ? rate : 0.0,
            MPNowPlayingInfoPropertyDefaultPlaybackRate: 1.0
        ]
        info[MPNowPlayingInfoPropertyPlaybackQueueIndex] = currentIndex
        info[MPNowPlayingInfoPropertyPlaybackQueueCount] = segments.count
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
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

        status = "loading"
        message = "Đang chuẩn bị giọng đọc…"
        updateNowPlayingInfo()
        emitState()

        let activeVoice = self.voice
        let remoteBase = self.remoteBaseUrl

        synthWorkerQueue.async { [weak self] in
            guard let self = self else { return }
            let resolved = self.resolveSegmentAudioFile(text: cleanText, voice: activeVoice, remoteBaseUrl: remoteBase)

            self.mainQueue.async {
                guard self.sessionGeneration == gen else { return }
                if let (fileURL, isAiLocal, label) = resolved {
                    do {
                        let player = try AVAudioPlayer(contentsOf: fileURL)
                        player.delegate = self
                        player.enableRate = true
                        player.rate = Float(self.rate)
                        player.prepareToPlay()
                        if startSeconds > 0.05 {
                            player.currentTime = min(startSeconds, max(0, player.duration - 0.1))
                        }
                        player.play()
                        self.audioPlayer = player
                        self.onDeviceAiActive = isAiLocal
                        self.packActive = false
                        self.voiceLabel = label
                        self.status = "playing"
                        self.message = "Đang đọc · " + String(cleanText.prefix(68))
                        self.updateNowPlayingInfo()
                        self.emitState()

                        // Background 2-segment lookahead pre-synthesis for zero-gap lock-screen transitions
                        self.prefetchUpcomingSegments(after: index, generation: gen, voice: activeVoice, remoteBaseUrl: remoteBase)
                        return
                    } catch {
                        // Fall through to system speech synthesizer
                    }
                }

                // Tier 4 Fallback: Offline Apple Vietnamese System Speech
                self.playWithSystemSpeech(text: cleanText)
            }
        }
    }

    private func prefetchUpcomingSegments(after index: Int, generation: UInt64, voice: String, remoteBaseUrl: String) {
        let candidates = [index + 1, index + 2].filter { $0 >= 0 && $0 < segments.count }
        guard !candidates.isEmpty else { return }
        let texts = candidates.map { segments[$0].text.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }

        synthWorkerQueue.async { [weak self] in
            guard let self = self else { return }
            for txt in texts {
                if self.sessionGeneration != generation { break }
                _ = self.resolveSegmentAudioFile(text: txt, voice: voice, remoteBaseUrl: remoteBaseUrl)
            }
        }
    }

    private func resolveSegmentAudioFile(text: String, voice: String, remoteBaseUrl: String) -> (URL, Bool, String)? {
        // Tier 1 & 2: On-Device Neural AI (VieNeu-TTS-v3-Nano ONNX) — works 100% in Airplane Mode
        if VieNeuNanoMobile.shared.isAvailable() {
            if let wavURL = try? VieNeuNanoMobile.shared.synthesizeToWavFile(text: text, voiceId: voice, speed: 1.0) {
                let label = voice == "vieneu-thuc-doan"
                    ? "Thục Đoan · AI Nội Bộ (Ngoại tuyến)"
                    : "Thiền Tâm Đức · AI Nội Bộ (Ngoại tuyến)"
                return (wavURL, true, label)
            }
        }

        // Check existing MP3 cache from prior online TTS session
        let mp3Digest = SHA256.hash(data: Data("mp3|\(voice)|\(text)".utf8)).map { String(format: "%02x", $0) }.joined()
        let cachedMp3 = ChanhPhapVault.shared.cacheDir.appendingPathComponent("\(mp3Digest).mp3")
        if FileManager.default.fileExists(atPath: cachedMp3.path) {
            let label = voice == "vieneu-thuc-doan" ? "Thục Đoan · Đã lưu đệm" : "Thiền Tâm Đức · Đã lưu đệm"
            return (cachedMp3, false, label)
        }

        // Tier 3: Remote Server /api/tts when online
        if let ttsURL = URL(string: "\(remoteBaseUrl)/api/tts") {
            var req = URLRequest(url: ttsURL, timeoutInterval: 25)
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
            _ = sem.wait(timeout: .now() + 26)

            if statusCode == 200, let data = fetchedData, data.count > 256 {
                try? data.write(to: cachedMp3, options: .atomic)
                let label = voice == "vieneu-thuc-doan" ? "Thục Đoan · Máy chủ AI" : "Thiền Tâm Đức · Máy chủ AI"
                return (cachedMp3, false, label)
            }
        }
        return nil
    }

    private func playWithSystemSpeech(text: String) {
        usingSystemSpeech = true
        onDeviceAiActive = false
        voiceLabel = "Giọng tiếng Việt iOS (Dự phòng ngoại tuyến)"
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

