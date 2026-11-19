import Foundation
import Capacitor
import UserNotifications
import CryptoKit

@objc(ChanhPhapEnginePlugin)
public class ChanhPhapEnginePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ChanhPhapEnginePlugin"
    public let jsName = "ChanhPhapEngine"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getVaultStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getManuscript", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cacheManuscript", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cacheAudioSegment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "searchVault", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "downloadPack", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removePack", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startQueue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pauseQueue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopQueue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "seekQueue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateQueueOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getQueueState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "scheduleDailyPracticeReminder", returnType: CAPPluginReturnPromise)
    ]

    public override func load() {
        ChanhPhapAudioPlayer.shared.onStateChanged = { [weak self] state in
            self?.notifyListeners("playbackState", data: state)
        }
    }

    @objc func getVaultStatus(_ call: CAPPluginCall) {
        DispatchQueue.global(qos: .userInitiated).async {
            let status = ChanhPhapVault.shared.vaultStatus()
            call.resolve(status)
        }
    }

    @objc func getManuscript(_ call: CAPPluginCall) {
        guard let url = call.getString("url"), !url.isEmpty else {
            call.resolve(["found": false])
            return
        }
        DispatchQueue.global(qos: .userInitiated).async {
            let hit = ChanhPhapVault.shared.getManuscript(url: url)
            if hit.found, let content = hit.content {
                call.resolve([
                    "found": true,
                    "content": content,
                    "packId": hit.packId ?? "vault"
                ])
            } else {
                call.resolve(["found": false])
            }
        }
    }

    @objc func cacheManuscript(_ call: CAPPluginCall) {
        guard let url = call.getString("url"),
              let content = call.getString("content"),
              !url.isEmpty else {
            call.resolve()
            return
        }
        DispatchQueue.global(qos: .utility).async {
            ChanhPhapVault.shared.cacheManuscript(url: url, content: content)
            call.resolve()
        }
    }

    @objc func cacheAudioSegment(_ call: CAPPluginCall) {
        let rawVoice = call.getString("voice") ?? "vieneu-thien-tam-duc"
        let rawText = (call.getString("text") ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        let b64 = call.getString("audioBase64") ?? ""
        guard !rawText.isEmpty, !b64.isEmpty, let audioData = Data(base64Encoded: b64), audioData.count > 256 else {
            call.resolve(["cached": false])
            return
        }
        let voice = rawVoice.contains("thuc-doan") ? "vieneu-thuc-doan" : "vieneu-thien-tam-duc"
        DispatchQueue.global(qos: .utility).async {
            let digest = SHA256.hash(data: Data("mp3|\(voice)|\(rawText)".utf8))
                .map { String(format: "%02x", $0) }
                .joined()
            let dest = ChanhPhapVault.shared.cacheDir.appendingPathComponent("\(digest).mp3")
            do {
                try audioData.write(to: dest, options: .atomic)
                call.resolve(["cached": true])
            } catch {
                call.resolve(["cached": false])
            }
        }
    }

    @objc func searchVault(_ call: CAPPluginCall) {
        let q = call.getString("q") ?? ""
        let collection = call.getString("collection") ?? ""
        let mode = call.getString("mode") ?? ""
        let offset = call.getInt("offset") ?? 0
        DispatchQueue.global(qos: .userInitiated).async {
            let res = ChanhPhapVault.shared.searchVault(query: q, collection: collection, mode: mode, offset: offset)
            call.resolve(res)
        }
    }

    @objc func downloadPack(_ call: CAPPluginCall) {
        guard let id = call.getString("id"),
              let kind = call.getString("kind") else {
            call.reject("Thiếu thông tin gói dữ liệu cần tải.")
            return
        }
        let remoteBase = call.getString("remoteBaseUrl") ?? "https://thuvienchanhphap.duckdns.org"
        Task {
            do {
                try await ChanhPhapVault.shared.downloadPack(
                    id: id,
                    kind: kind,
                    remoteBaseUrl: remoteBase
                ) { [weak self] pct in
                    self?.notifyListeners("downloadProgress", data: ["id": id, "percent": pct])
                }
                call.resolve(["installed": true])
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func removePack(_ call: CAPPluginCall) {
        guard let id = call.getString("id"),
              let kind = call.getString("kind") else {
            call.resolve()
            return
        }
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try ChanhPhapVault.shared.removePack(id: id, kind: kind)
                call.resolve()
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func startQueue(_ call: CAPPluginCall) {
        let bookKey = call.getString("bookKey") ?? ""
        let bookTitle = call.getString("bookTitle") ?? "Thư viện Chánh Pháp"
        let remoteBaseUrl = call.getString("remoteBaseUrl") ?? "https://thuvienchanhphap.duckdns.org"
        let voice = call.getString("voice") ?? "vieneu-thien-tam-duc"
        let rate = call.getDouble("rate") ?? 0.95
        let startIndex = call.getInt("startIndex") ?? 0
        let startSeconds = call.getDouble("startSeconds") ?? 0.0
        let repeatMode = call.getString("repeatMode") ?? "off"
        let repeatTarget = call.getInt("repeatTarget") ?? 0
        let repeatA = call.getInt("repeatA") ?? -1
        let repeatB = call.getInt("repeatB") ?? -1
        let sleepDeadlineMs = call.getDouble("sleepDeadlineMs") ?? 0.0

        let rawSegments = call.getArray("segments") ?? []
        let parsedSegments: [QueueSegmentItem] = rawSegments.enumerated().compactMap { idx, rawItem in
            guard let obj = rawItem as? JSObject else { return nil }
            let segIdx = (obj["index"] as? NSNumber)?.intValue ?? idx
            let srcOff = (obj["sourceOffset"] as? NSNumber)?.intValue ?? 0
            let chIdx = (obj["chapterIndex"] as? NSNumber)?.intValue ?? -1
            let chCnt = (obj["chapterCount"] as? NSNumber)?.intValue ?? 0
            let chTitle = (obj["chapterTitle"] as? String) ?? ""
            let baseSec = (obj["baseSeconds"] as? NSNumber)?.doubleValue ?? 0.0
            let pauseMs = (obj["pauseBefore"] as? NSNumber)?.intValue ?? 0
            return QueueSegmentItem(
                index: segIdx,
                block: (obj["block"] as? String) ?? "",
                heading: (obj["heading"] as? String) ?? "",
                chapterIndex: chIdx,
                chapterCount: chCnt,
                chapterTitle: chTitle,
                baseSeconds: baseSec,
                pauseBefore: pauseMs,
                sourceOffset: srcOff,
                text: (obj["text"] as? String) ?? ""
            )
        }

        ChanhPhapAudioPlayer.shared.startQueue(
            bookKey: bookKey,
            bookTitle: bookTitle,
            remoteBaseUrl: remoteBaseUrl,
            voice: voice,
            rate: rate,
            startIndex: startIndex,
            startSeconds: startSeconds,
            repeatMode: repeatMode,
            repeatTarget: repeatTarget,
            repeatA: repeatA,
            repeatB: repeatB,
            sleepDeadlineMs: sleepDeadlineMs,
            segments: parsedSegments
        )
        call.resolve()
    }

    @objc func pauseQueue(_ call: CAPPluginCall) {
        ChanhPhapAudioPlayer.shared.pause()
        call.resolve()
    }

    @objc func stopQueue(_ call: CAPPluginCall) {
        ChanhPhapAudioPlayer.shared.stop()
        call.resolve()
    }

    @objc func seekQueue(_ call: CAPPluginCall) {
        let index = call.getInt("index") ?? 0
        let seconds = call.getDouble("seconds") ?? 0.0
        let resume = call.getBool("resume") ?? true
        ChanhPhapAudioPlayer.shared.seek(index: index, seconds: seconds, resume: resume)
        call.resolve()
    }

    @objc func updateQueueOptions(_ call: CAPPluginCall) {
        ChanhPhapAudioPlayer.shared.updateOptions(
            repeatMode: call.getString("repeatMode"),
            repeatTarget: call.getInt("repeatTarget"),
            repeatA: call.getInt("repeatA"),
            repeatB: call.getInt("repeatB"),
            sleepDeadlineMs: call.getDouble("sleepDeadlineMs"),
            rate: call.getDouble("rate")
        )
        call.resolve()
    }

    @objc func getQueueState(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve(ChanhPhapAudioPlayer.shared.currentStateSnapshot())
        }
    }

    @objc func scheduleDailyPracticeReminder(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled") ?? false
        let hour = min(23, max(0, call.getInt("hour") ?? 5))
        let minute = min(59, max(0, call.getInt("minute") ?? 30))
        let center = UNUserNotificationCenter.current()
        let reqId = "chanh-phap-daily-practice"

        center.removePendingNotificationRequests(withIdentifiers: [reqId])
        if !enabled {
            call.resolve()
            return
        }

        center.requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }
            guard granted else {
                call.reject("Hãy cho phép quyền Thông báo cho ứng dụng Chánh Pháp trong phần Cài đặt iPhone.")
                return
            }

            let content = UNMutableNotificationContent()
            content.title = "Thời Khóa Chánh Pháp Hằng Ngày"
            content.body = "Đã đến giờ tĩnh tâm đọc & lắng nghe lời Phật dạy. An trú trong chánh niệm."
            content.sound = .default

            var comps = DateComponents()
            comps.hour = hour
            comps.minute = minute
            let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
            let request = UNNotificationRequest(identifier: reqId, content: content, trigger: trigger)
            center.add(request) { addErr in
                if let addErr = addErr {
                    call.reject(addErr.localizedDescription)
                } else {
                    call.resolve()
                }
            }
        }
    }
}
