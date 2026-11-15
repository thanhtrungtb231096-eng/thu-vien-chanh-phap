import Foundation
import CryptoKit
#if canImport(onnxruntime_objc)
import onnxruntime_objc
#endif

public final class VieNeuNanoMobile {
    public static let shared = VieNeuNanoMobile()

    private let synthLock = NSLock()
    private var loaded = false
    private var lastUsedTime: TimeInterval = 0
    private var idleTimer: DispatchSourceTimer?

    private var words: [String: String] = [:]
    private var charFallback: [String: String] = [:]
    private var vocab: [String: Int64] = [:]
    private var bosId: Int64 = 0
    private var eosId: Int64 = 1
    private var padId: Int64 = 2
    private var flowFps: Double = 15.625
    private var sampleRate: Int = 24000

    private var nullSpk: [Float] = []
    private var nullStyle: [Float] = []
    private var nullStyleShape: [NSNumber] = [1, 50, 256]
    private var voices: [String: (spk: [Float], style: [Float], styleShape: [NSNumber])] = [:]

    #if canImport(onnxruntime_objc)
    private var ortEnv: ORTEnv?
    private var sText: ORTSession?
    private var sDur: ORTSession?
    private var sVe: ORTSession?
    private var sDec: ORTSession?
    private var nullCtxValue: ORTValue?
    private var nullMaskData: NSMutableData?
    #endif

    private static let digitsVi = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]

    private init() {
        let timer = DispatchSource.makeTimerSource(queue: DispatchQueue.global(qos: .utility))
        timer.schedule(deadline: .now() + 60, repeating: 60)
        timer.setEventHandler { [weak self] in
            self?.unloadIfIdle(maxIdleSeconds: 180)
        }
        timer.resume()
        self.idleTimer = timer
    }

    public func isAvailable() -> Bool {
        #if canImport(onnxruntime_objc)
        return ChanhPhapVault.shared.isTtsInstalled()
        #else
        return false
        #endif
    }

    public func unload() {
        synthLock.lock()
        defer { synthLock.unlock() }
        unloadLocked()
    }

    private func unloadIfIdle(maxIdleSeconds: TimeInterval) {
        guard loaded else { return }
        if synthLock.try() {
            defer { synthLock.unlock() }
            if loaded && (Date().timeIntervalSince1970 - lastUsedTime) >= maxIdleSeconds {
                unloadLocked()
            }
        }
    }

    private func unloadLocked() {
        loaded = false
        words.removeAll(keepingCapacity: false)
        voices.removeAll(keepingCapacity: false)
        #if canImport(onnxruntime_objc)
        nullCtxValue = nil
        nullMaskData = nil
        sText = nil
        sDur = nil
        sVe = nil
        sDec = nil
        ortEnv = nil
        #endif
    }

    public static func numberToVietnamese(_ n: Int) -> String {
        if n < 0 { return "âm " + numberToVietnamese(-n) }
        if n < 10 { return digitsVi[n] }
        func readTriple(_ val: Int, full: Bool) -> [String] {
            let h = val / 100
            let rem = val % 100
            let t = rem / 10
            let u = rem % 10
            var out: [String] = []
            if full || h > 0 {
                out += [digitsVi[h], "trăm"]
                if t == 0 && u > 0 { out.append("lẻ") }
            }
            if t == 1 {
                out.append("mười")
                if u == 5 { out.append("lăm") }
                else if u > 0 { out.append(digitsVi[u]) }
            } else if t > 1 {
                out += [digitsVi[t], "mươi"]
                if u == 1 { out.append("mốt") }
                else if u == 4 { out.append("tư") }
                else if u == 5 { out.append("lăm") }
                else if u > 0 { out.append(digitsVi[u]) }
            } else if u > 0 {
                out.append(digitsVi[u])
            }
            return out
        }
        if n >= 1_000_000_000 {
            return String(n).compactMap { $0.wholeNumberValue.map { digitsVi[$0] } }.joined(separator: " ")
        }
        let millions = n / 1_000_000
        let thousands = (n % 1_000_000) / 1_000
        let units = n % 1_000
        var parts: [String] = []
        if millions > 0 { parts += readTriple(millions, full: false) + ["triệu"] }
        if thousands > 0 { parts += readTriple(thousands, full: millions > 0) + ["nghìn"] }
        if units > 0 { parts += readTriple(units, full: millions > 0 || thousands > 0) }
        return parts.joined(separator: " ")
    }

    private func phonemize(_ raw: String) -> String {
        var text = raw.precomposedStringWithCanonicalMapping
            .replacingOccurrences(of: "[-–—/]+", with: " ", options: .regularExpression)
            .replacingOccurrences(of: "[:;]+", with: ",", options: .regularExpression)
            .replacingOccurrences(of: "[“”\"'‘’«»()\\[\\]{}*#_~`<>|]+", with: " ", options: .regularExpression)

        if let numRegex = try? NSRegularExpression(pattern: "\\d+") {
            let ns = text as NSString
            let matches = numRegex.matches(in: text, range: NSRange(location: 0, length: ns.length)).reversed()
            for m in matches {
                if let val = Int(ns.substring(with: m.range)) {
                    text = (text as NSString).replacingCharacters(in: m.range, with: " \(Self.numberToVietnamese(val)) ")
                }
            }
        }

        text = text.lowercased()
            .replacingOccurrences(of: "\\s+([.,!?…])", with: "$1", options: .regularExpression)
            .replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)

        guard let tokRegex = try? NSRegularExpression(pattern: "[\\p{L}]+|[.,!?]") else { return "" }
        let nsText = text as NSString
        let tokens = tokRegex.matches(in: text, range: NSRange(location: 0, length: nsText.length))
            .map { nsText.substring(with: $0.range) }

        var out: [String] = []
        var wordCount = 0
        for tok in tokens {
            if ".,!?".contains(tok) {
                if !out.isEmpty { out[out.count - 1] += tok }
                continue
            }
            wordCount += 1
            if let ph = words[tok] {
                out.append(ph)
            } else {
                let fb = tok.map { charFallback[String($0)] ?? "" }.joined()
                out.append(fb.isEmpty ? tok : fb)
            }
        }
        guard !out.isEmpty else { return "" }
        var joined = out.joined(separator: " ")
            .trimmingCharacters(in: CharacterSet(charactersIn: " .,!?"))
        if wordCount < 5 || !(".,!?".contains(joined.last ?? " ")) {
            joined += "."
        }
        return joined
    }

    private func ensureLoadedLocked() throws {
        if loaded { return }
        #if canImport(onnxruntime_objc)
        let dir = ChanhPhapVault.shared.ttsDir
        guard let lexGz = try? Data(contentsOf: dir.appendingPathComponent("vi_lexicon.json.gz")),
              let lexRaw = ChanhPhapVault.gunzip(lexGz),
              let lexJson = try JSONSerialization.jsonObject(with: lexRaw) as? [String: Any],
              let vcGz = try? Data(contentsOf: dir.appendingPathComponent("voices_constants.json.gz")),
              let vcRaw = ChanhPhapVault.gunzip(vcGz),
              let vcJson = try JSONSerialization.jsonObject(with: vcRaw) as? [String: Any] else {
            throw NSError(domain: "VieNeuNanoMobile", code: 404, userInfo: [NSLocalizedDescriptionKey: "Chưa cài đặt gói Giọng Đọc AI Nội Bộ."])
        }

        self.words = (lexJson["words"] as? [String: String]) ?? [:]
        self.charFallback = (lexJson["charFallback"] as? [String: String]) ?? [:]
        if let rawVocab = lexJson["vocab"] as? [String: NSNumber] {
            self.vocab = rawVocab.mapValues { $0.int64Value }
        }
        self.bosId = (vcJson["bosId"] as? NSNumber)?.int64Value ?? 0
        self.eosId = (vcJson["eosId"] as? NSNumber)?.int64Value ?? 1
        self.padId = (vcJson["padId"] as? NSNumber)?.int64Value ?? 2
        self.flowFps = (vcJson["flowFps"] as? NSNumber)?.doubleValue ?? 15.625
        self.sampleRate = (vcJson["sampleRate"] as? NSNumber)?.intValue ?? 24000
        self.nullSpk = ((vcJson["nullSpk"] as? [NSNumber]) ?? []).map { $0.floatValue }
        self.nullStyle = ((vcJson["nullStyle"] as? [NSNumber]) ?? []).map { $0.floatValue }
        let nsDims = ((vcJson["nullStyleShape"] as? [NSNumber]) ?? [50, 256]).map { $0.intValue }
        self.nullStyleShape = [1] + nsDims.map { NSNumber(value: $0) }

        if let vMap = vcJson["voices"] as? [String: [String: Any]] {
            for (vid, entry) in vMap {
                let spk = ((entry["speakerEmb"] as? [NSNumber]) ?? []).map { $0.floatValue }
                let sty = ((entry["style"] as? [NSNumber]) ?? []).map { $0.floatValue }
                let sDims = ((entry["styleShape"] as? [NSNumber]) ?? [50, 256]).map { $0.intValue }
                self.voices[vid] = (spk, sty, [1] + sDims.map { NSNumber(value: $0) })
            }
        }

        let env = try ORTEnv(loggingLevel: .warning)
        let opts = try ORTSessionOptions()
        try opts.setIntraOpNumThreads(2)
        try opts.setGraphOptimizationLevel(.all)

        let textSess = try ORTSession(env: env, modelPath: dir.appendingPathComponent("text_encoder.onnx").path, sessionOptions: opts)
        let durSess = try ORTSession(env: env, modelPath: dir.appendingPathComponent("duration_predictor.onnx").path, sessionOptions: opts)
        let veSess = try ORTSession(env: env, modelPath: dir.appendingPathComponent("vector_estimator.onnx").path, sessionOptions: opts)
        let decSess = try ORTSession(env: env, modelPath: dir.appendingPathComponent("codec_decoder.onnx").path, sessionOptions: opts)

        var nullIdsArr: [Int64] = [bosId, eosId]
        let nullIdsData = NSMutableData(bytes: &nullIdsArr, length: nullIdsArr.count * MemoryLayout<Int64>.size)
        let nullIdsVal = try ORTValue(tensorData: nullIdsData, elementType: .int64, shape: [1, 2])

        var nullStyleCopy = self.nullStyle
        let nullStyleData = NSMutableData(bytes: &nullStyleCopy, length: nullStyleCopy.count * MemoryLayout<Float>.size)
        let nullStyleVal = try ORTValue(tensorData: nullStyleData, elementType: .float, shape: self.nullStyleShape)

        let nullOut = try textSess.run(withInputs: ["ids": nullIdsVal, "style": nullStyleVal], outputNames: ["ctx"], runOptions: nil)
        var nullMaskBytes: [UInt8] = [bosId != padId ? 1 : 0, eosId != padId ? 1 : 0]
        self.nullMaskData = NSMutableData(bytes: &nullMaskBytes, length: 2)
        self.nullCtxValue = nullOut["ctx"] ?? nullOut.values.first

        self.ortEnv = env
        self.sText = textSess
        self.sDur = durSess
        self.sVe = veSess
        self.sDec = decSess
        self.loaded = true
        #else
        throw NSError(domain: "VieNeuNanoMobile", code: 501, userInfo: [NSLocalizedDescriptionKey: "ONNX Runtime framework not linked."])
        #endif
    }

    public func synthesizeToWavFile(text: String, voiceId: String, speed: Double = 1.0) throws -> URL {
        let cleanVoice = voiceId.contains("thuc-doan") ? "vieneu-thuc-doan" : "vieneu-thien-tam-duc"
        let cacheKeyInput = "\(cleanVoice)|\(String(format: "%.2f", speed))|\(text)"
        let digest = SHA256.hash(data: Data(cacheKeyInput.utf8)).map { String(format: "%02x", $0) }.joined()
        let outURL = ChanhPhapVault.shared.cacheDir.appendingPathComponent("\(digest).wav")
        if FileManager.default.fileExists(atPath: outURL.path) {
            return outURL
        }

        // Split long paragraphs into <= 170-char clauses just like NANO_MAX_CHARS on desktop
        let clauses = Self.splitClauses(text, maxChars: 170)
        var allSamples: [Float] = []

        synthLock.lock()
        defer { synthLock.unlock() }
        try ensureLoadedLocked()
        lastUsedTime = Date().timeIntervalSince1970

        for (idx, clause) in clauses.enumerated() {
            let pcm = try inferSingleClauseLocked(clause, voiceId: cleanVoice, speed: speed)
            allSamples.append(contentsOf: pcm)
            if idx + 1 < clauses.count {
                // Natural 140ms breath between clauses
                allSamples.append(contentsOf: [Float](repeating: 0, count: Int(0.14 * Double(sampleRate))))
            }
        }
        lastUsedTime = Date().timeIntervalSince1970

        let wavData = Self.encodeWav16Mono(samples: allSamples, sampleRate: sampleRate)
        try wavData.write(to: outURL, options: .atomic)
        return outURL
    }

    private func inferSingleClauseLocked(_ clause: String, voiceId: String, speed: Double) throws -> [Float] {
        #if canImport(onnxruntime_objc)
        guard let sText = sText, let sDur = sDur, let sVe = sVe, let sDec = sDec,
              let nullCtx = nullCtxValue, let nullMaskData = nullMaskData,
              let preset = voices[voiceId] else {
            return []
        }

        let phones = phonemize(clause)
        var seq: [Int64] = [bosId]
        for ch in phones {
            if let id = vocab[String(ch)] { seq.append(id) }
        }
        seq.append(eosId)
        let seqLen = seq.count

        let idsData = NSMutableData(bytes: &seq, length: seqLen * MemoryLayout<Int64>.size)
        let idsVal = try ORTValue(tensorData: idsData, elementType: .int64, shape: [1, NSNumber(value: seqLen)])

        var maskBytes = seq.map { UInt8($0 != padId ? 1 : 0) }
        let maskData = NSMutableData(bytes: &maskBytes, length: seqLen)
        let maskVal = try ORTValue(tensorData: maskData, elementType: .bool, shape: [1, NSNumber(value: seqLen)])

        var spkArr = preset.spk
        let spkData = NSMutableData(bytes: &spkArr, length: spkArr.count * MemoryLayout<Float>.size)
        let spkVal = try ORTValue(tensorData: spkData, elementType: .float, shape: [1, NSNumber(value: spkArr.count)])

        var styleArr = preset.style
        let styleData = NSMutableData(bytes: &styleArr, length: styleArr.count * MemoryLayout<Float>.size)
        let styleVal = try ORTValue(tensorData: styleData, elementType: .float, shape: preset.styleShape)

        let textOut = try sText.run(withInputs: ["ids": idsVal, "style": styleVal], outputNames: ["ctx"], runOptions: nil)
        guard let ctxVal = textOut["ctx"] ?? textOut.values.first else { return [] }

        let durOut = try sDur.run(withInputs: ["ctx": ctxVal, "ctx_mask": maskVal, "spk": spkVal], outputNames: ["log_s"], runOptions: nil)
        guard let durVal = durOut.values.first,
              let durTensorData = try? durVal.tensorData() as Data,
              durTensorData.count >= 4 else { return [] }
        let logS = durTensorData.withUnsafeBytes { $0.load(as: Float.self) }

        let secs = min(exp(Double(logS)) / max(speed, 0.25), 15.0)
        let frames = max(2, Int((secs * flowFps).rounded()))
        let latentCount = 144 * frames

        // Box-Muller standard normal initialization
        var x = [Float](repeating: 0, count: latentCount)
        var rngState: UInt64 = 0x5DEECE66D
        func nextUniform() -> Double {
            rngState = rngState &* 6364136223846793005 &+ 1442695040888963407
            return Double((rngState >> 11) & 0x1FFFFFFFFFFFFF) / Double(1 << 53)
        }
        var i = 0
        while i < latentCount {
            let u1 = max(1e-7, nextUniform())
            let u2 = nextUniform()
            let r = sqrt(-2.0 * log(u1))
            let theta = 2.0 * Double.pi * u2
            x[i] = Float(r * cos(theta))
            if i + 1 < latentCount { x[i + 1] = Float(r * sin(theta)) }
            i += 2
        }

        var nullSpkCopy = self.nullSpk
        let nullSpkData = NSMutableData(bytes: &nullSpkCopy, length: nullSpkCopy.count * MemoryLayout<Float>.size)
        let nullSpkVal = try ORTValue(tensorData: nullSpkData, elementType: .float, shape: [1, NSNumber(value: nullSpkCopy.count)])

        var nullStyleCopy = self.nullStyle
        let nullStyleData = NSMutableData(bytes: &nullStyleCopy, length: nullStyleCopy.count * MemoryLayout<Float>.size)
        let nullStyleVal = try ORTValue(tensorData: nullStyleData, elementType: .float, shape: self.nullStyleShape)
        let nullMaskVal = try ORTValue(tensorData: nullMaskData, elementType: .bool, shape: [1, 2])

        let steps = 8
        let cfgLimit = 6
        let cfgScale: Float = 3.0
        let sway = -1.0
        let tg: [Float] = (0...steps).map { k in
            let u = Double(k) / Double(steps)
            return Float(u + sway * (cos(Double.pi / 2.0 * u) - 1.0 + u))
        }
        let xShape: [NSNumber] = [1, 144, NSNumber(value: frames)]

        for step in 0..<steps {
            var tScalar = [tg[step]]
            let tData = NSMutableData(bytes: &tScalar, length: MemoryLayout<Float>.size)
            let tVal = try ORTValue(tensorData: tData, elementType: .float, shape: [1])

            let xData = NSMutableData(bytes: &x, length: latentCount * MemoryLayout<Float>.size)
            let xVal = try ORTValue(tensorData: xData, elementType: .float, shape: xShape)

            let condOut = try sVe.run(
                withInputs: ["x": xVal, "t": tVal, "ctx": ctxVal, "ctx_mask": maskVal, "spk": spkVal, "style": styleVal],
                outputNames: ["v"],
                runOptions: nil
            )
            guard let vCondData = try? condOut.values.first?.tensorData() as Data else { break }
            var vel = vCondData.withUnsafeBytes { Array($0.bindMemory(to: Float.self)) }

            if step < cfgLimit {
                let uncondOut = try sVe.run(
                    withInputs: ["x": xVal, "t": tVal, "ctx": nullCtx, "ctx_mask": nullMaskVal, "spk": nullSpkVal, "style": nullStyleVal],
                    outputNames: ["v"],
                    runOptions: nil
                )
                if let vUncondData = try? uncondOut.values.first?.tensorData() as Data {
                    vUncondData.withUnsafeBytes { rawU in
                        let vu = rawU.bindMemory(to: Float.self)
                        for j in 0..<min(vel.count, vu.count) {
                            vel[j] = vu[j] + cfgScale * (vel[j] - vu[j])
                        }
                    }
                }
            }

            let dt = tg[step + 1] - tg[step]
            for j in 0..<min(x.count, vel.count) {
                x[j] += dt * vel[j]
            }
        }

        let finalXData = NSMutableData(bytes: &x, length: latentCount * MemoryLayout<Float>.size)
        let finalXVal = try ORTValue(tensorData: finalXData, elementType: .float, shape: xShape)
        let decOut = try sDec.run(withInputs: ["x": finalXVal], outputNames: ["wav"], runOptions: nil)
        guard let wavData = try? decOut.values.first?.tensorData() as Data else { return [] }
        let rawSamples = wavData.withUnsafeBytes { Array($0.bindMemory(to: Float.self)) }
        return Self.trimAndFade(rawSamples, sampleRate: sampleRate)
        #else
        return []
        #endif
    }

    private static func splitClauses(_ text: String, maxChars: Int) -> [String] {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.count <= maxChars { return trimmed.isEmpty ? [] : [trimmed] }
        var parts: [String] = []
        var remaining = trimmed
        while remaining.count > maxChars {
            let prefix = String(remaining.prefix(maxChars))
            let cutIdx = prefix.lastIndex(where: { ".;!?,".contains($0) })
                ?? prefix.lastIndex(of: " ")
                ?? prefix.endIndex
            let head = String(remaining[..<cutIdx]).trimmingCharacters(in: .whitespacesAndNewlines)
            if !head.isEmpty { parts.append(head) }
            let nextStart = cutIdx < remaining.endIndex ? remaining.index(after: cutIdx) : cutIdx
            remaining = String(remaining[nextStart...]).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if !remaining.isEmpty { parts.append(remaining) }
        return parts
    }

    private static func trimAndFade(_ samples: [Float], sampleRate: Int) -> [Float] {
        guard !samples.isEmpty else { return [] }
        var out = samples
        let peak = out.reduce(Float(0)) { max($0, abs($1)) }
        if peak > 1e-4 {
            let thr = max(Float(0.004), peak * 0.012)
            if let first = out.firstIndex(where: { abs($0) >= thr }),
               let last = out.lastIndex(where: { abs($0) >= thr }) {
                let lo = max(0, first - Int(0.025 * Double(sampleRate)))
                let hi = min(out.count, last + Int(0.080 * Double(sampleRate)))
                out = Array(out[lo..<hi])
            }
        }
        let fade = min(Int(0.015 * Double(sampleRate)), out.count / 4)
        if fade > 1 {
            for k in 0..<fade {
                let g = Float(0.5 - 0.5 * cos(Double.pi * Double(k) / Double(fade)))
                out[k] *= g
                out[out.count - 1 - k] *= g
            }
        }
        return out.map { min(1.0, max(-1.0, $0)) }
    }

    private static func encodeWav16Mono(samples: [Float], sampleRate: Int) -> Data {
        let dataBytes = samples.count * 2
        var header = Data(capacity: 44 + dataBytes)
        func appendASCII(_ s: String) { header.append(contentsOf: s.utf8) }
        func appendU32(_ v: UInt32) { var le = v.littleEndian; withUnsafeBytes(of: &le) { header.append(contentsOf: $0) } }
        func appendU16(_ v: UInt16) { var le = v.littleEndian; withUnsafeBytes(of: &le) { header.append(contentsOf: $0) } }

        appendASCII("RIFF")
        appendU32(UInt32(36 + dataBytes))
        appendASCII("WAVE")
        appendASCII("fmt ")
        appendU32(16)
        appendU16(1) // PCM
        appendU16(1) // Mono
        appendU32(UInt32(sampleRate))
        appendU32(UInt32(sampleRate * 2))
        appendU16(2)
        appendU16(16)
        appendASCII("data")
        appendU32(UInt32(dataBytes))

        var pcm = samples.map { Int16(clamping: Int(($0 * 32767.0).rounded())).littleEndian }
        pcm.withUnsafeBufferPointer { ptr in
            header.append(UnsafeBufferPointer(start: UnsafeRawPointer(ptr.baseAddress)?.assumingMemoryBound(to: UInt8.self), count: dataBytes))
        }
        return header
    }
}

