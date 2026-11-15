package org.chanhphap.engine

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.os.StatFs
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.text.Normalizer
import java.util.zip.GZIPInputStream
import java.util.zip.Inflater

class ChanhPhapVault private constructor(context: Context) {

    val rootDir: File = File(context.noBackupFilesDir, "ChanhPhapVault")
    val packsDir: File = File(rootDir, "text-packs")
    val ttsDir: File = File(rootDir, "tts/vieneu-nano-mobile-v1")
    val cacheDir: File = File(rootDir, "tts-cache")
    private val userCacheDbFile: File = File(rootDir, "online-manuscripts.sqlite3")
    private val appContext: Context = context.applicationContext
    private val dbLock = Any()

    private val packFileMap = mapOf(
        "core-bundled" to "core-bundled.pack.db",
        "daithua" to "daithua.pack.db",
        "ebooks" to "namtong-ebooks.pack.db",
        "daitang" to "daitanghan.pack.db"
    )

    init {
        listOf(rootDir, packsDir, ttsDir, cacheDir).forEach { it.mkdirs() }
        initUserCacheDb()
        ensureBundledCoreExtracted()
    }

    private fun initUserCacheDb() {
        synchronized(dbLock) {
            SQLiteDatabase.openOrCreateDatabase(userCacheDbFile, null).use { db ->
                db.execSQL("CREATE TABLE IF NOT EXISTS cached_docs (url TEXT PRIMARY KEY, content TEXT, updated_at REAL);")
            }
        }
    }

    private fun ensureBundledCoreExtracted() {
        val dest = File(packsDir, "core-bundled.pack.db")
        if (dest.isFile && dest.length() > 1024L) return
        try {
            appContext.assets.open("public/packs/core-bundled.pack.db").use { input ->
                val tmp = File(packsDir, "core-bundled.pack.db.tmp")
                FileOutputStream(tmp).use { output ->
                    input.copyTo(output, bufferSize = 65536)
                }
                if (dest.exists()) dest.delete()
                tmp.renameTo(dest)
            }
        } catch (_: Exception) {
            // Optional if running dev server without bundled pack
        }
    }

    fun activePackFiles(): List<Pair<String, File>> {
        ensureBundledCoreExtracted()
        val list = mutableListOf<Pair<String, File>>()
        for (id in listOf("core-bundled", "daithua", "ebooks", "daitang")) {
            val fname = packFileMap[id] ?: continue
            val f = File(packsDir, fname)
            if (f.isFile && f.length() > 1024L) {
                list.add(id to f)
            }
        }
        return list
    }

    fun isTtsInstalled(): Boolean {
        val required = listOf(
            "duration_predictor.onnx",
            "text_encoder.onnx",
            "vector_estimator.onnx",
            "codec_decoder.onnx",
            "vi_lexicon.json.gz",
            "voices_constants.json.gz"
        )
        return required.all { File(ttsDir, it).isFile }
    }

    fun vaultStatus(): JSONObject {
        val packsArr = JSONArray()
        activePackFiles().forEach { packsArr.put(it.first) }
        val stat = StatFs(rootDir.absolutePath)
        val freeMiB = (stat.availableBytes.toDouble() / (1024.0 * 1024.0)).toInt()
        return JSONObject().apply {
            put("packs", packsArr)
            put("ttsInstalled", isTtsInstalled())
            put("freeDiskMiB", freeMiB)
        }
    }

    data class ManuscriptHit(val found: Boolean, val content: String? = null, val packId: String? = null)

    fun getManuscript(url: String): ManuscriptHit {
        for ((packId, dbFile) in activePackFiles()) {
            try {
                SQLiteDatabase.openDatabase(dbFile.absolutePath, null, SQLiteDatabase.OPEN_READONLY).use { db ->
                    db.rawQuery(
                        "SELECT raw_zlib, raw_bytes FROM manuscripts WHERE url = ? LIMIT 1",
                        arrayOf(url)
                    ).use { cursor ->
                        if (cursor.moveToFirst()) {
                            val blob = cursor.getBlob(0)
                            val rawLen = cursor.getInt(1)
                            if (blob != null && blob.isNotEmpty()) {
                                val text = inflateZlibUtf8(blob, rawLen)
                                if (text != null) {
                                    return ManuscriptHit(true, text, packId)
                                }
                            }
                        }
                    }
                }
            } catch (_: Exception) {
                // Continue next pack
            }
        }

        synchronized(dbLock) {
            if (userCacheDbFile.isFile) {
                try {
                    SQLiteDatabase.openDatabase(userCacheDbFile.absolutePath, null, SQLiteDatabase.OPEN_READONLY).use { db ->
                        db.rawQuery("SELECT content FROM cached_docs WHERE url = ? LIMIT 1", arrayOf(url)).use { c ->
                            if (c.moveToFirst()) {
                                return ManuscriptHit(true, c.getString(0), "online-cache")
                            }
                        }
                    }
                } catch (_: Exception) {}
            }
        }
        return ManuscriptHit(false)
    }

    fun cacheManuscript(url: String, content: String) {
        synchronized(dbLock) {
            try {
                SQLiteDatabase.openOrCreateDatabase(userCacheDbFile, null).use { db ->
                    db.execSQL(
                        "INSERT OR REPLACE INTO cached_docs(url, content, updated_at) VALUES(?, ?, ?)",
                        arrayOf<Any>(url, content, System.currentTimeMillis() / 1000.0)
                    )
                }
            } catch (_: Exception) {}
        }
    }

    fun searchVault(query: String, collection: String, mode: String, offset: Int): JSONObject {
        val norm = normalizeSearchVi(query.replace("\"", ""))
        val tokens = norm.split(" ").filter { it.isNotBlank() }.take(10)
        if (tokens.isEmpty()) {
            return JSONObject().put("results", JSONArray()).put("total", 0)
        }
        val ftsExpr = tokens.joinToString(" AND ") { "\"$it\"*" }
        val allResults = mutableListOf<JSONObject>()
        val seenKeys = HashSet<String>()

        for ((_, dbFile) in activePackFiles()) {
            try {
                SQLiteDatabase.openDatabase(dbFile.absolutePath, null, SQLiteDatabase.OPEN_READONLY).use { db ->
                    val sb = StringBuilder(
                        """
                        SELECT m.meta, s.block, s.chapter, s.page, s.preview
                        FROM fulltext f
                        JOIN sections s ON s.sid = f.rowid
                        JOIN manuscripts m ON m.doc = s.doc
                        WHERE fulltext MATCH ?
                        """.trimIndent()
                    )
                    val args = mutableListOf(ftsExpr)
                    if (mode.isNotEmpty()) {
                        sb.append(" AND m.mode = ?")
                        args.add(mode)
                    }
                    if (collection.isNotEmpty()) {
                        sb.append(" AND m.book_key LIKE ?")
                        args.add("$collection:%")
                    }
                    sb.append(" LIMIT 40")

                    db.rawQuery(sb.toString(), args.toTypedArray()).use { c ->
                        while (c.moveToNext()) {
                            val metaStr = c.getString(0) ?: continue
                            val metaObj = JSONObject(metaStr)
                            val block = c.getString(1) ?: ""
                            val chapter = c.getString(2) ?: ""
                            val preview = c.getString(4) ?: ""
                            val dedup = "${metaObj.optString("key")}|$block"
                            if (!seenKeys.add(dedup)) continue

                            metaObj.put("block", block)
                            metaObj.put("chapter", chapter)
                            if (!c.isNull(3)) {
                                metaObj.put("page", c.getInt(3))
                            }
                            metaObj.put("excerpt", preview)
                            allResults.add(metaObj)
                            if (allResults.size >= 60) break
                        }
                    }
                }
            } catch (_: Exception) {}
        }

        val sliced = JSONArray()
        allResults.drop(offset.coerceAtLeast(0)).take(30).forEach { sliced.put(it) }
        return JSONObject()
            .put("results", sliced)
            .put("total", allResults.size)
            .put("offset", offset)
    }

    fun removePack(id: String, kind: String) {
        if (kind == "tts") {
            VieNeuNanoMobile.getInstance(appContext).unload()
            ttsDir.deleteRecursively()
            ttsDir.mkdirs()
            return
        }
        if (id == "core-bundled") return
        val fname = packFileMap[id] ?: return
        val target = File(packsDir, fname)
        if (target.exists()) target.delete()
    }

    fun downloadPack(id: String, kind: String, remoteBaseUrl: String, onProgress: (Double) -> Unit) {
        val base = remoteBaseUrl.trimEnd('/')
        if (kind == "tts") {
            val manifestText = httpGetText("$base/mobile-packs/tts/vieneu-nano-mobile-v1/manifest.json")
            val manifest = JSONObject(manifestText)
            val files = manifest.getJSONArray("files")
            val totalBytes = manifest.optDouble("totalBytes", 1.0).coerceAtLeast(1.0)
            var doneBytes = 0.0

            for (i in 0 until files.length()) {
                val f = files.getJSONObject(i)
                val name = f.getString("name")
                val expectedSha = f.optString("sha256", "")
                val fBytes = f.optDouble("mobileBytes", 0.0)
                val dest = File(ttsDir, name)
                if (dest.isFile && expectedSha.isNotEmpty() && sha256Hex(dest) == expectedSha) {
                    doneBytes += fBytes
                    onProgress((doneBytes / totalBytes) * 100.0)
                    continue
                }
                downloadVerifiedFile(
                    "$base/mobile-packs/tts/vieneu-nano-mobile-v1/$name",
                    dest,
                    expectedSha
                ) { fileFraction ->
                    onProgress(((doneBytes + fBytes * fileFraction) / totalBytes) * 100.0)
                }
                doneBytes += fBytes
                onProgress((doneBytes / totalBytes) * 100.0)
            }
            File(ttsDir, "manifest.json").writeText(manifestText, Charsets.UTF_8)
            onProgress(100.0)
            return
        }

        val fname = packFileMap[id] ?: throw IllegalArgumentException("Mã gói kinh không hợp lệ.")
        val manifestText = httpGetText("$base/mobile-packs/text-packs/manifest.json")
        val packs = JSONObject(manifestText).optJSONArray("packs") ?: JSONArray()
        var expectedSha = ""
        for (i in 0 until packs.length()) {
            val p = packs.getJSONObject(i)
            if (p.optString("id") == id) {
                expectedSha = p.optString("sha256", "")
                break
            }
        }
        val dest = File(packsDir, fname)
        downloadVerifiedFile("$base/mobile-packs/text-packs/$fname", dest, expectedSha) { frac ->
            onProgress(frac * 100.0)
        }
        onProgress(100.0)
    }

    companion object {
        @Volatile
        private var instance: ChanhPhapVault? = null

        fun getInstance(context: Context): ChanhPhapVault {
            return instance ?: synchronized(this) {
                instance ?: ChanhPhapVault(context.applicationContext).also { instance = it }
            }
        }

        fun inflateZlibUtf8(compressed: ByteArray, expectedSize: Int): String? {
            val inflater = Inflater()
            return try {
                inflater.setInput(compressed)
                val out = ByteArrayOutputStream(expectedSize.coerceAtLeast(4096))
                val buf = ByteArray(16384)
                while (!inflater.finished()) {
                    val count = inflater.inflate(buf)
                    if (count == 0 && inflater.needsInput()) break
                    out.write(buf, 0, count)
                }
                out.toByteArray().toString(Charsets.UTF_8)
            } catch (_: Exception) {
                null
            } finally {
                inflater.end()
            }
        }

        fun gunzipUtf8(file: File): String {
            GZIPInputStream(FileInputStream(file), 65536).use { gz ->
                return gz.bufferedReader(Charsets.UTF_8).readText()
            }
        }

        fun normalizeSearchVi(raw: String): String {
            val folded = Normalizer.normalize(
                raw.replace('đ', 'd').replace('Đ', 'd').lowercase(),
                Normalizer.Form.NFD
            ).replace(Regex("\\p{InCombiningDiacriticalMarks}+"), "")
            return folded.replace(Regex("[^\\p{L}\\p{Nd}]+"), " ").trim()
        }

        private fun httpGetText(urlStr: String): String {
            val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
                connectTimeout = 15000
                readTimeout = 30000
                requestMethod = "GET"
            }
            if (conn.responseCode != 200) {
                throw IllegalStateException("Không tải được thông tin gói dữ liệu (HTTP ${conn.responseCode}).")
            }
            return conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
        }

        private fun sha256Hex(file: File): String {
            val md = MessageDigest.getInstance("SHA-256")
            FileInputStream(file).use { fis ->
                val buf = ByteArray(65536)
                while (true) {
                    val n = fis.read(buf)
                    if (n <= 0) break
                    md.update(buf, 0, n)
                }
            }
            return md.digest().joinToString("") { "%02x".format(it) }
        }

        private fun downloadVerifiedFile(
            urlStr: String,
            dest: File,
            expectedSha: String,
            onFraction: (Double) -> Unit
        ) {
            dest.parentFile?.mkdirs()
            val part = File(dest.parentFile, "${dest.name}.part")
            val existingLen = if (part.isFile) part.length() else 0L

            val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
                connectTimeout = 20000
                readTimeout = 60000
                requestMethod = "GET"
                if (existingLen > 0L) {
                    setRequestProperty("Range", "bytes=$existingLen-")
                }
            }

            val code = conn.responseCode
            val append = (code == 206 && existingLen > 0L)
            if (code != 200 && code != 206) {
                throw IllegalStateException("Tải tệp thất bại (HTTP $code).")
            }

            val contentLen = conn.contentLengthLong
            val totalExpected = if (append && contentLen > 0) existingLen + contentLen else contentLen
            var written = if (append) existingLen else 0L

            conn.inputStream.use { input ->
                FileOutputStream(part, append).use { output ->
                    val buf = ByteArray(65536)
                    while (true) {
                        val n = input.read(buf)
                        if (n <= 0) break
                        output.write(buf, 0, n)
                        written += n
                        if (totalExpected > 0) {
                            onFraction((written.toDouble() / totalExpected.toDouble()).coerceIn(0.0, 1.0))
                        }
                    }
                }
            }

            if (expectedSha.isNotEmpty()) {
                val actual = sha256Hex(part)
                if (!actual.equals(expectedSha, ignoreCase = true)) {
                    part.delete()
                    throw IllegalStateException("Mã kiểm tra toàn vẹn SHA-256 không khớp. Vui lòng thử tải lại.")
                }
            }
            if (dest.exists()) dest.delete()
            if (!part.renameTo(dest)) {
                part.copyTo(dest, overwrite = true)
                part.delete()
            }
        }
    }
}

