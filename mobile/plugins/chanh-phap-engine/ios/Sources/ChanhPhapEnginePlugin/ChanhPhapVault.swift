import Foundation
import SQLite3
import CryptoKit
import zlib

public final class ChanhPhapVault {
    public static let shared = ChanhPhapVault()

    public let rootDir: URL
    public let packsDir: URL
    public let ttsDir: URL
    public let cacheDir: URL
    private let userCacheDbURL: URL
    private let lock = NSLock()

    private let packFileMap: [String: String] = [
        "core-bundled": "core-bundled.pack.db",
        "daithua": "daithua.pack.db",
        "ebooks": "namtong-ebooks.pack.db",
        "daitang": "daitanghan.pack.db"
    ]

    private init() {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        rootDir = appSupport.appendingPathComponent("ChanhPhapVault", isDirectory: true)
        packsDir = rootDir.appendingPathComponent("text-packs", isDirectory: true)
        ttsDir = rootDir.appendingPathComponent("tts/vieneu-nano-mobile-v1", isDirectory: true)
        cacheDir = rootDir.appendingPathComponent("tts-cache", isDirectory: true)
        userCacheDbURL = rootDir.appendingPathComponent("online-manuscripts.sqlite3")

        for folder in [rootDir, packsDir, ttsDir, cacheDir] {
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        }
        // Apple App Store Guideline 2.23: Exclude re-downloadable content from user's iCloud backup
        var values = URLResourceValues()
        values.isExcludedFromBackup = true
        var mutableRoot = rootDir
        try? mutableRoot.setResourceValues(values)

        initUserCacheDb()
    }

    private func initUserCacheDb() {
        var db: OpaquePointer?
        if sqlite3_open(userCacheDbURL.path, &db) == SQLITE_OK {
            let sql = "CREATE TABLE IF NOT EXISTS cached_docs (url TEXT PRIMARY KEY, content TEXT, updated_at REAL);"
            sqlite3_exec(db, sql, nil, nil, nil)
        }
        if db != nil { sqlite3_close(db) }
    }

    private func bundledCorePackURL() -> URL? {
        if let bundlePublic = Bundle.main.resourceURL?.appendingPathComponent("public/packs/core-bundled.pack.db"),
           FileManager.default.fileExists(atPath: bundlePublic.path) {
            return bundlePublic
        }
        let downloaded = packsDir.appendingPathComponent("core-bundled.pack.db")
        return FileManager.default.fileExists(atPath: downloaded.path) ? downloaded : nil
    }

    public func activePackURLs() -> [(id: String, url: URL)] {
        var list: [(String, URL)] = []
        if let core = bundledCorePackURL() {
            list.append(("core-bundled", core))
        }
        for id in ["daithua", "ebooks", "daitang"] {
            if let fname = packFileMap[id] {
                let candidate = packsDir.appendingPathComponent(fname)
                if FileManager.default.fileExists(atPath: candidate.path) {
                    list.append((id, candidate))
                }
            }
        }
        return list
    }

    public func isTtsInstalled() -> Bool {
        let required = [
            "duration_predictor.onnx",
            "text_encoder.onnx",
            "vector_estimator.onnx",
            "codec_decoder.onnx",
            "vi_lexicon.json.gz",
            "voices_constants.json.gz"
        ]
        return required.allSatisfy { FileManager.default.fileExists(atPath: ttsDir.appendingPathComponent($0).path) }
    }

    public func vaultStatus() -> [String: Any] {
        let installedPacks = activePackURLs().map { $0.id }
        var freeMiB: Double = 0
        if let attrs = try? FileManager.default.attributesOfFileSystem(forPath: rootDir.path),
           let freeBytes = attrs[.systemFreeSize] as? NSNumber {
            freeMiB = freeBytes.doubleValue / (1024.0 * 1024.0)
        }
        return [
            "packs": installedPacks,
            "ttsInstalled": isTtsInstalled(),
            "freeDiskMiB": Int(freeMiB.rounded())
        ]
    }

    public static func inflateZlib(_ compressed: Data, expectedSize: Int) -> Data? {
        let capacity = max(expectedSize, compressed.count * 4, 4096)
        var out = Data(count: capacity)
        var destLen = uLongf(capacity)
        let status: Int32 = compressed.withUnsafeBytes { srcRaw in
            out.withUnsafeMutableBytes { dstRaw in
                guard let srcPtr = srcRaw.bindMemory(to: Bytef.self).baseAddress,
                      let dstPtr = dstRaw.bindMemory(to: Bytef.self).baseAddress else {
                    return Z_MEM_ERROR
                }
                return uncompress(dstPtr, &destLen, srcPtr, uLong(compressed.count))
            }
        }
        guard status == Z_OK else { return nil }
        out.count = Int(destLen)
        return out
    }

    public static func gunzip(_ data: Data) -> Data? {
        guard !data.isEmpty else { return Data() }
        var stream = z_stream()
        let initStatus: Int32 = data.withUnsafeBytes { raw in
            stream.next_in = UnsafeMutablePointer<Bytef>(mutating: raw.bindMemory(to: Bytef.self).baseAddress)
            stream.avail_in = uint(data.count)
            return inflateInit2_(&stream, 15 + 32, ZLIB_VERSION, Int32(MemoryLayout<z_stream>.size))
        }
        guard initStatus == Z_OK else { return nil }
        defer { inflateEnd(&stream) }

        var output = Data(capacity: data.count * 3)
        let chunkSize = 65536
        var buffer = [UInt8](repeating: 0, count: chunkSize)
        repeat {
            let status: Int32 = buffer.withUnsafeMutableBytes { dstRaw in
                stream.next_out = dstRaw.bindMemory(to: Bytef.self).baseAddress
                stream.avail_out = uint(chunkSize)
                return inflate(&stream, Z_NO_FLUSH)
            }
            let produced = chunkSize - Int(stream.avail_out)
            if produced > 0 {
                output.append(buffer, count: produced)
            }
            if status == Z_STREAM_END { break }
            if status != Z_OK { return nil }
        } while stream.avail_out == 0
        return output
    }

    public func getManuscript(url: String) -> (found: Bool, content: String?, packId: String?) {
        for (packId, dbURL) in activePackURLs() {
            var db: OpaquePointer?
            guard sqlite3_open_v2(dbURL.path, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
                if db != nil { sqlite3_close(db) }
                continue
            }
            defer { sqlite3_close(db) }

            var stmt: OpaquePointer?
            let sql = "SELECT raw_zlib, raw_bytes FROM manuscripts WHERE url = ? LIMIT 1"
            if sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK {
                defer { sqlite3_finalize(stmt) }
                sqlite3_bind_text(stmt, 1, (url as NSString).utf8String, -1, nil)
                if sqlite3_step(stmt) == SQLITE_ROW {
                    let blobLen = Int(sqlite3_column_bytes(stmt, 0))
                    let rawLen = Int(sqlite3_column_int64(stmt, 1))
                    if let blobPtr = sqlite3_column_blob(stmt, 0), blobLen > 0 {
                        let compressed = Data(bytes: blobPtr, count: blobLen)
                        if let rawData = Self.inflateZlib(compressed, expectedSize: rawLen),
                           let str = String(data: rawData, encoding: .utf8) {
                            return (true, str, packId)
                        }
                    }
                }
            }
        }

        // Fallback to single-file online cache DB
        lock.lock()
        defer { lock.unlock() }
        var cdb: OpaquePointer?
        if sqlite3_open_v2(userCacheDbURL.path, &cdb, SQLITE_OPEN_READONLY, nil) == SQLITE_OK {
            defer { sqlite3_close(cdb) }
            var stmt: OpaquePointer?
            if sqlite3_prepare_v2(cdb, "SELECT content FROM cached_docs WHERE url = ? LIMIT 1", -1, &stmt, nil) == SQLITE_OK {
                defer { sqlite3_finalize(stmt) }
                sqlite3_bind_text(stmt, 1, (url as NSString).utf8String, -1, nil)
                if sqlite3_step(stmt) == SQLITE_ROW, let cStr = sqlite3_column_text(stmt, 0) {
                    return (true, String(cString: cStr), "online-cache")
                }
            }
        }
        return (false, nil, nil)
    }

    public func cacheManuscript(url: String, content: String) {
        lock.lock()
        defer { lock.unlock() }
        var db: OpaquePointer?
        guard sqlite3_open(userCacheDbURL.path, &db) == SQLITE_OK else {
            if db != nil { sqlite3_close(db) }
            return
        }
        defer { sqlite3_close(db) }
        var stmt: OpaquePointer?
        if sqlite3_prepare_v2(db, "INSERT OR REPLACE INTO cached_docs(url, content, updated_at) VALUES(?,?,?)", -1, &stmt, nil) == SQLITE_OK {
            defer { sqlite3_finalize(stmt) }
            sqlite3_bind_text(stmt, 1, (url as NSString).utf8String, -1, nil)
            sqlite3_bind_text(stmt, 2, (content as NSString).utf8String, -1, nil)
            sqlite3_bind_double(stmt, 3, Date().timeIntervalSince1970)
            sqlite3_step(stmt)
        }
    }

    public static func normalizeSearchVi(_ raw: String) -> String {
        let replaced = raw
            .replacingOccurrences(of: "đ", with: "d")
            .replacingOccurrences(of: "Đ", with: "d")
            .folding(options: [.diacriticInsensitive, .caseInsensitive], locale: Locale(identifier: "vi_VN"))
        let scalars = replaced.unicodeScalars.map { CharacterSet.alphanumerics.contains($0) ? Character($0) : " " }
        return String(scalars).split(separator: " ").joined(separator: " ")
    }

    public func searchVault(query: String, collection: String, mode: String, offset: Int) -> [String: Any] {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        let norm = Self.normalizeSearchVi(trimmed.replacingOccurrences(of: "\"", with: ""))
        let tokens = norm.split(separator: " ").prefix(10).map(String.init)
        guard !tokens.isEmpty else { return ["results": [], "total": 0] }

        let ftsExpr = tokens.map { "\"\($0)\"*" }.joined(separator: " AND ")
        var allResults: [[String: Any]] = []
        var seenSectionKeys = Set<String>()

        for (_, dbURL) in activePackURLs() {
            var db: OpaquePointer?
            guard sqlite3_open_v2(dbURL.path, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
                if db != nil { sqlite3_close(db) }
                continue
            }
            defer { sqlite3_close(db) }

            var sql = """
                SELECT m.meta, s.block, s.chapter, s.page, s.preview
                FROM fulltext f
                JOIN sections s ON s.sid = f.rowid
                JOIN manuscripts m ON m.doc = s.doc
                WHERE fulltext MATCH ?
            """
            if !mode.isEmpty { sql += " AND m.mode = ?" }
            if !collection.isEmpty { sql += " AND m.book_key LIKE ?" }
            sql += " LIMIT 40"

            var stmt: OpaquePointer?
            if sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK {
                defer { sqlite3_finalize(stmt) }
                var paramIdx: Int32 = 1
                sqlite3_bind_text(stmt, paramIdx, (ftsExpr as NSString).utf8String, -1, nil)
                paramIdx += 1
                if !mode.isEmpty {
                    sqlite3_bind_text(stmt, paramIdx, (mode as NSString).utf8String, -1, nil)
                    paramIdx += 1
                }
                if !collection.isEmpty {
                    let pattern = "\(collection):%"
                    sqlite3_bind_text(stmt, paramIdx, (pattern as NSString).utf8String, -1, nil)
                }

                while sqlite3_step(stmt) == SQLITE_ROW {
                    guard let metaCStr = sqlite3_column_text(stmt, 0) else { continue }
                    let metaData = Data(String(cString: metaCStr).utf8)
                    guard var metaObj = (try? JSONSerialization.jsonObject(with: metaData)) as? [String: Any] else { continue }
                    let block = sqlite3_column_text(stmt, 1).map { String(cString: $0) } ?? ""
                    let chapter = sqlite3_column_text(stmt, 2).map { String(cString: $0) } ?? ""
                    let preview = sqlite3_column_text(stmt, 4).map { String(cString: $0) } ?? ""
                    let dedupKey = "\(metaObj["key"] ?? "")|\(block)"
                    if seenSectionKeys.contains(dedupKey) { continue }
                    seenSectionKeys.insert(dedupKey)

                    metaObj["block"] = block
                    metaObj["chapter"] = chapter
                    if sqlite3_column_type(stmt, 3) != SQLITE_NULL {
                        metaObj["page"] = Int(sqlite3_column_int(stmt, 3))
                    }
                    metaObj["excerpt"] = preview
                    allResults.append(metaObj)
                    if allResults.count >= 60 { break }
                }
            }
        }

        let sliced = Array(allResults.dropFirst(max(0, offset)).prefix(30))
        return ["results": sliced, "total": allResults.count, "offset": offset]
    }

    public func removePack(id: String, kind: String) throws {
        if kind == "tts" {
            VieNeuNanoMobile.shared.unload()
            if FileManager.default.fileExists(atPath: ttsDir.path) {
                try FileManager.default.removeItem(at: ttsDir)
                try FileManager.default.createDirectory(at: ttsDir, withIntermediateDirectories: true)
            }
            return
        }
        guard id != "core-bundled", let fname = packFileMap[id] else { return }
        let target = packsDir.appendingPathComponent(fname)
        if FileManager.default.fileExists(atPath: target.path) {
            try FileManager.default.removeItem(at: target)
        }
    }

    public func downloadPack(id: String, kind: String, remoteBaseUrl: String, onProgress: @escaping (Double) -> Void) async throws {
        let base = remoteBaseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        if kind == "tts" {
            let manifestURL = URL(string: "\(base)/mobile-packs/tts/vieneu-nano-mobile-v1/manifest.json")!
            let (mData, mResp) = try await URLSession.shared.data(from: manifestURL)
            guard (mResp as? HTTPURLResponse)?.statusCode == 200,
                  let manifest = try JSONSerialization.jsonObject(with: mData) as? [String: Any],
                  let files = manifest["files"] as? [[String: Any]] else {
                throw NSError(domain: "ChanhPhapVault", code: 404, userInfo: [NSLocalizedDescriptionKey: "Chưa tìm thấy gói Giọng Đọc AI trên máy chủ."])
            }
            let totalBytes = max(1.0, (manifest["totalBytes"] as? NSNumber)?.doubleValue ?? 1.0)
            var doneBytes = 0.0
            for f in files {
                guard let name = f["name"] as? String,
                      let expectedSha = f["sha256"] as? String else { continue }
                let size = (f["mobileBytes"] as? NSNumber)?.doubleValue ?? 0
                let dest = ttsDir.appendingPathComponent(name)
                if FileManager.default.fileExists(atPath: dest.path),
                   Self.sha256Hex(of: dest) == expectedSha {
                    doneBytes += size
                    onProgress((doneBytes / totalBytes) * 100.0)
                    continue
                }
                let fileURL = URL(string: "\(base)/mobile-packs/tts/vieneu-nano-mobile-v1/\(name)")!
                try await Self.downloadVerifiedFile(from: fileURL, to: dest, expectedSha256: expectedSha)
                doneBytes += size
                onProgress((doneBytes / totalBytes) * 100.0)
            }
            try mData.write(to: ttsDir.appendingPathComponent("manifest.json"), options: .atomic)
            onProgress(100.0)
            return
        }

        guard let fname = packFileMap[id] else {
            throw NSError(domain: "ChanhPhapVault", code: 400, userInfo: [NSLocalizedDescriptionKey: "Mã gói kinh không hợp lệ."])
        }
        let manifestURL = URL(string: "\(base)/mobile-packs/text-packs/manifest.json")!
        let (mData, _) = try await URLSession.shared.data(from: manifestURL)
        let manifest = try JSONSerialization.jsonObject(with: mData) as? [String: Any]
        let packs = manifest?["packs"] as? [[String: Any]] ?? []
        let expectedSha = packs.first(where: { ($0["id"] as? String) == id })?["sha256"] as? String ?? ""

        let packURL = URL(string: "\(base)/mobile-packs/text-packs/\(fname)")!
        let dest = packsDir.appendingPathComponent(fname)
        onProgress(15.0)
        try await Self.downloadVerifiedFile(from: packURL, to: dest, expectedSha256: expectedSha)
        onProgress(100.0)
    }

    private static func sha256Hex(of fileURL: URL) -> String? {
        guard let handle = try? FileHandle(forReadingFrom: fileURL) else { return nil }
        defer { try? handle.close() }
        var hasher = SHA256()
        while autoreleasepool(invoking: {
            let chunk = handle.readData(ofLength: 1024 * 1024)
            if chunk.isEmpty { return false }
            hasher.update(data: chunk)
            return true
        }) {}
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }

    private static func downloadVerifiedFile(from url: URL, to dest: URL, expectedSha256: String) async throws {
        let (tmpURL, response) = try await URLSession.shared.download(from: url)
        guard (response as? HTTPURLResponse)?.statusCode == 200 else {
            throw NSError(domain: "ChanhPhapVault", code: 502, userInfo: [NSLocalizedDescriptionKey: "Tải gói dữ liệu không thành công."])
        }
        if !expectedSha256.isEmpty {
            guard let actual = sha256Hex(of: tmpURL), actual == expectedSha256 else {
                try? FileManager.default.removeItem(at: tmpURL)
                throw NSError(domain: "ChanhPhapVault", code: 422, userInfo: [NSLocalizedDescriptionKey: "Mã kiểm tra toàn vẹn SHA-256 không khớp. Vui lòng tải lại."])
            }
        }
        try? FileManager.default.createDirectory(at: dest.deletingLastPathComponent(), withIntermediateDirectories: true)
        if FileManager.default.fileExists(atPath: dest.path) {
            try FileManager.default.removeItem(at: dest)
        }
        try FileManager.default.moveItem(at: tmpURL, to: dest)
    }
}

