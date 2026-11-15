package org.chanhphap.engine

import ai.onnxruntime.OnnxJavaType
import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.LongBuffer
import java.security.MessageDigest
import java.text.Normalizer
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.exp
import kotlin.math.ln
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sin
import kotlin.math.sqrt

class VieNeuNanoMobile private constructor(private val appContext: Context) {

    private val synthLock = Any()
    @Volatile
    private var loaded = false
    @Volatile
    private var lastUsedMs: Long = 0L

    private val words = HashMap<String, String>()
    private val charFallback = HashMap<String, String>()
    private val vocab = HashMap<String, Long>()
    private var bosId: Long = 0L
    private var eosId: Long = 1L
    private var padId: Long = 2L
    private var flowFps: Double = 15.625
    private var sampleRate: Int = 24000

    private var nullSpk = FloatArray(0)
    private var nullStyle = FloatArray(0)
    private var nullStyleShape = longArrayOf(1L, 50L, 256L)
    private var nullCtxFlat = FloatArray(0)
    private var nullCtxShape = longArrayOf(1L, 2L, 256L)

    data class VoicePreset(val spk: FloatArray, val style: FloatArray, val styleShape: LongArray)
    private val voices = HashMap<String, VoicePreset>()

    private var ortEnv: OrtEnvironment? = null
    private var sText: OrtSession? = null
    private var sDur: OrtSession? = null
    private var sVe: OrtSession? = null
    private var sDec: OrtSession? = null

    private val idleJanitor = Executors.newSingleThreadScheduledExecutor { r ->
        Thread(r, "vieneu-idle-janitor").apply { isDaemon = true }
    }

    init {
        idleJanitor.scheduleWithFixedDelay({
            unloadIfIdle(180_000L)
        }, 60L, 60L, TimeUnit.SECONDS)
    }

    fun isAvailable(): Boolean {
        return ChanhPhapVault.getInstance(appContext).isTtsInstalled()
    }

    fun unload() {
        synchronized(synthLock) {
            unloadLocked()
        }
    }

    private fun unloadIfIdle(maxIdleMs: Long) {
        if (!loaded) return
        synchronized(synthLock) {
            if (loaded && (System.currentTimeMillis() - lastUsedMs) >= maxIdleMs) {
                unloadLocked()
            }
        }
    }

    private fun unloadLocked() {
        loaded = false
        words.clear()
        voices.clear()
        try { sText?.close() } catch (_: Exception) {}
        try { sDur?.close() } catch (_: Exception) {}
        try { sVe?.close() } catch (_: Exception) {}
        try { sDec?.close() } catch (_: Exception) {}
        sText = null
        sDur = null
        sVe = null
        sDec = null
    }

    private fun ensureLoadedLocked() {
        if (loaded) return
        val vault = ChanhPhapVault.getInstance(appContext)
        val dir = vault.ttsDir
        if (!vault.isTtsInstalled()) {
            throw IllegalStateException("Chưa cài đặt gói Giọng Đọc AI Nội Bộ.")
        }

        val lexJson = JSONObject(ChanhPhapVault.gunzipUtf8(File(dir, "vi_lexicon.json.gz")))
        val vcJson = JSONObject(ChanhPhapVault.gunzipUtf8(File(dir, "voices_constants.json.gz")))

        words.clear()
        lexJson.optJSONObject("words")?.let { wObj ->
            val keys = wObj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                words[k] = wObj.optString(k, "")
            }
        }

        charFallback.clear()
        lexJson.optJSONObject("charFallback")?.let { cfObj ->
            val keys = cfObj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                charFallback[k] = cfObj.optString(k, "")
            }
        }

        vocab.clear()
        lexJson.optJSONObject("vocab")?.let { vObj ->
            val keys = vObj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                vocab[k] = vObj.optLong(k, 0L)
            }
        }

        bosId = vcJson.optLong("bosId", 0L)
        eosId = vcJson.optLong("eosId", 1L)
        padId = vcJson.optLong("padId", 2L)
        flowFps = vcJson.optDouble("flowFps", 15.625)
        sampleRate = vcJson.optInt("sampleRate", 24000)

        nullSpk = jsonFloatArray(vcJson.getJSONArray("nullSpk"))
        nullStyle = jsonFloatArray(vcJson.getJSONArray("nullStyle"))
        val nsShapeArr = vcJson.getJSONArray("nullStyleShape")
        nullStyleShape = longArrayOf(1L, nsShapeArr.getLong(0), nsShapeArr.getLong(1))

        voices.clear()
        vcJson.optJSONObject("voices")?.let { vMap ->
            val keys = vMap.keys()
            while (keys.hasNext()) {
                val vid = keys.next()
                val entry = vMap.getJSONObject(vid)
                val spk = jsonFloatArray(entry.getJSONArray("speakerEmb"))
                val sty = jsonFloatArray(entry.getJSONArray("style"))
                val sDims = entry.getJSONArray("styleShape")
                voices[vid] = VoicePreset(spk, sty, longArrayOf(1L, sDims.getLong(0), sDims.getLong(1)))
            }
        }

        val env = OrtEnvironment.getEnvironment()
        val opts = OrtSession.SessionOptions().apply {
            setIntraOpNumThreads(2)
            setOptimizationLevel(OrtSession.SessionOptions.OptLevel.ALL_OPT)
        }

        val textSess = env.createSession(File(dir, "text_encoder.onnx").absolutePath, opts)
        val durSess = env.createSession(File(dir, "duration_predictor.onnx").absolutePath, opts)
        val veSess = env.createSession(File(dir, "vector_estimator.onnx").absolutePath, opts)
        val decSess = env.createSession(File(dir, "codec_decoder.onnx").absolutePath, opts)

        val nullIds = OnnxTensor.createTensor(env, LongBuffer.wrap(longArrayOf(bosId, eosId)), longArrayOf(1L, 2L))
        val nullStyleTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(nullStyle), nullStyleShape)
        nullIds.use { nIds ->
            nullStyleTensor.use { nSty ->
                textSess.run(mapOf("ids" to nIds, "style" to nSty)).use { res ->
                    val ctxTensor = res[0] as OnnxTensor
                    nullCtxShape = ctxTensor.info.shape
                    val fb = ctxTensor.floatBuffer
                    nullCtxFlat = FloatArray(fb.remaining())
                    fb.get(nullCtxFlat)
                }
            }
        }

        ortEnv = env
        sText = textSess
        sDur = durSess
        sVe = veSess
        sDec = decSess
        loaded = true
    }

    fun synthesizeToWavFile(text: String, voiceId: String, speed: Double = 1.0): File {
        val cleanVoice = if (voiceId.contains("thuc-doan")) "vieneu-thuc-doan" else "vieneu-thien-tam-duc"
        val keyInput = "$cleanVoice|%.2f|$text".format(speed)
        val digest = MessageDigest.getInstance("SHA-256")
            .digest(keyInput.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }

        val vault = ChanhPhapVault.getInstance(appContext)
        val outFile = File(vault.cacheDir, "$digest.wav")
        if (outFile.isFile && outFile.length() > 64L) {
            return outFile
        }

        val clauses = splitClauses(text, 170)
        val chunks = mutableListOf<FloatArray>()
        var totalSamples = 0

        synchronized(synthLock) {
            ensureLoadedLocked()
            lastUsedMs = System.currentTimeMillis()
            val gapSamples = (0.14 * sampleRate).toInt()
            for ((idx, clause) in clauses.withIndex()) {
                val pcm = inferSingleClauseLocked(clause, cleanVoice, speed)
                if (pcm.isNotEmpty()) {
                    chunks.add(pcm)
                    totalSamples += pcm.size
                    if (idx + 1 < clauses.size) {
                        val silence = FloatArray(gapSamples)
                        chunks.add(silence)
                        totalSamples += gapSamples
                    }
                }
            }
            lastUsedMs = System.currentTimeMillis()
        }

        val combined = FloatArray(totalSamples)
        var cursor = 0
        for (c in chunks) {
            System.arraycopy(c, 0, combined, cursor, c.size)
            cursor += c.size
        }

        val tmpFile = File(vault.cacheDir, "$digest.wav.tmp")
        writeWav16Mono(tmpFile, combined, sampleRate)
        if (outFile.exists()) outFile.delete()
        tmpFile.renameTo(outFile)
        return outFile
    }

    private fun inferSingleClauseLocked(clause: String, voiceId: String, speed: Double): FloatArray {
        val env = ortEnv ?: return FloatArray(0)
        val textSess = sText ?: return FloatArray(0)
        val durSess = sDur ?: return FloatArray(0)
        val veSess = sVe ?: return FloatArray(0)
        val decSess = sDec ?: return FloatArray(0)
        val preset = voices[voiceId] ?: return FloatArray(0)

        val phones = phonemize(clause)
        if (phones.isEmpty()) return FloatArray(0)

        val seqList = ArrayList<Long>(phones.length + 2)
        seqList.add(bosId)
        for (ch in phones) {
            val id = vocab[ch.toString()]
            if (id != null) seqList.add(id)
        }
        seqList.add(eosId)
        val seq = seqList.toLongArray()
        val seqLen = seq.size.toLong()

        val idsTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(seq), longArrayOf(1L, seqLen))
        val maskTensor = createBoolMaskTensor(env, seq, padId)
        val spkTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(preset.spk), longArrayOf(1L, preset.spk.size.toLong()))
        val styleTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(preset.style), preset.styleShape)
        val nullCtxTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(nullCtxFlat), nullCtxShape)
        val nullMaskTensor = createBoolMaskTensor(env, longArrayOf(bosId, eosId), padId)
        val nullSpkTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(nullSpk), longArrayOf(1L, nullSpk.size.toLong()))
        val nullStyleTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(nullStyle), nullStyleShape)

        try {
            var ctxFlat = FloatArray(0)
            var ctxShape = longArrayOf()
            textSess.run(mapOf("ids" to idsTensor, "style" to styleTensor)).use { res ->
                val t = res[0] as OnnxTensor
                ctxShape = t.info.shape
                val fb = t.floatBuffer
                ctxFlat = FloatArray(fb.remaining())
                fb.get(ctxFlat)
            }

            OnnxTensor.createTensor(env, FloatBuffer.wrap(ctxFlat), ctxShape).use { ctxTensor ->
                var logS = 0f
                durSess.run(mapOf("ctx" to ctxTensor, "ctx_mask" to maskTensor, "spk" to spkTensor)).use { durRes ->
                    val dt = durRes[0] as OnnxTensor
                    logS = dt.floatBuffer.get(0)
                }

                val secs = min(exp(logS.toDouble()) / max(speed, 0.25), 15.0)
                val frames = max(2, (secs * flowFps).roundToInt())
                val latentCount = 144 * frames

                val x = FloatArray(latentCount)
                var rngState = 0x5DEECE66DL
                fun nextUniform(): Double {
                    rngState = rngState * 6364136223846793005L + 1442695040888963407L
                    return ((rngState ushr 11) and 0x1FFFFFFFFFFFFFL).toDouble() / (1L shl 53).toDouble()
                }
                var idx = 0
                while (idx < latentCount) {
                    val u1 = max(1e-7, nextUniform())
                    val u2 = nextUniform()
                    val r = sqrt(-2.0 * ln(u1))
                    val theta = 2.0 * PI * u2
                    x[idx] = (r * cos(theta)).toFloat()
                    if (idx + 1 < latentCount) x[idx + 1] = (r * sin(theta)).toFloat()
                    idx += 2
                }

                val steps = 8
                val cfgLimit = 6
                val cfgScale = 3.0f
                val sway = -1.0
                val tg = FloatArray(steps + 1) { k ->
                    val u = k.toDouble() / steps.toDouble()
                    (u + sway * (cos(PI / 2.0 * u) - 1.0 + u)).toFloat()
                }
                val xShape = longArrayOf(1L, 144L, frames.toLong())

                for (step in 0 until steps) {
                    val tTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(floatArrayOf(tg[step])), longArrayOf(1L))
                    val xTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(x), xShape)
                    try {
                        val vel = FloatArray(latentCount)
                        veSess.run(
                            mapOf(
                                "x" to xTensor,
                                "t" to tTensor,
                                "ctx" to ctxTensor,
                                "ctx_mask" to maskTensor,
                                "spk" to spkTensor,
                                "style" to styleTensor
                            )
                        ).use { condRes ->
                            (condRes[0] as OnnxTensor).floatBuffer.get(vel)
                        }

                        if (step < cfgLimit) {
                            val vu = FloatArray(latentCount)
                            veSess.run(
                                mapOf(
                                    "x" to xTensor,
                                    "t" to tTensor,
                                    "ctx" to nullCtxTensor,
                                    "ctx_mask" to nullMaskTensor,
                                    "spk" to nullSpkTensor,
                                    "style" to nullStyleTensor
                                )
                            ).use { uncondRes ->
                                (uncondRes[0] as OnnxTensor).floatBuffer.get(vu)
                            }
                            for (j in 0 until latentCount) {
                                vel[j] = vu[j] + cfgScale * (vel[j] - vu[j])
                            }
                        }

                        val dt = tg[step + 1] - tg[step]
                        for (j in 0 until latentCount) {
                            x[j] += dt * vel[j]
                        }
                    } finally {
                        tTensor.close()
                        xTensor.close()
                    }
                }

                OnnxTensor.createTensor(env, FloatBuffer.wrap(x), xShape).use { finalX ->
                    decSess.run(mapOf("x" to finalX)).use { decRes ->
                        val wavTensor = decRes[0] as OnnxTensor
                        val fb = wavTensor.floatBuffer
                        val raw = FloatArray(fb.remaining())
                        fb.get(raw)
                        return trimAndFade(raw, sampleRate)
                    }
                }
            }
        } finally {
            idsTensor.close()
            maskTensor.close()
            spkTensor.close()
            styleTensor.close()
            nullCtxTensor.close()
            nullMaskTensor.close()
            nullSpkTensor.close()
            nullStyleTensor.close()
        }
    }

    private fun phonemize(raw: String): String {
        var text = Normalizer.normalize(raw, Normalizer.Form.NFC)
            .replace(Regex("[-–—/]+"), " ")
            .replace(Regex("[:;]+"), ",")
            .replace(Regex("[“”\"'‘’«»()\\[\\]{}*#_~`<>|]+"), " ")

        text = Regex("\\d+").replace(text) { m ->
            val v = m.value.toLongOrNull()
            if (v != null && v <= 999_999_999L) " ${numberToVietnamese(v.toInt())} " else " ${m.value} "
        }

        text = text.lowercase()
            .replace(Regex("\\s+([.,!?…])"), "$1")
            .replace(Regex("\\s+"), " ")
            .trim()

        val tokens = Regex("[\\p{L}]+|[.,!?]").findAll(text).map { it.value }.toList()
        val out = ArrayList<String>(tokens.size)
        var wordCount = 0
        for (tok in tokens) {
            if (tok.length == 1 && ".,!?".contains(tok[0])) {
                if (out.isNotEmpty()) {
                    out[out.size - 1] = out[out.size - 1] + tok
                }
                continue
            }
            wordCount++
            val ph = words[tok]
            if (ph != null) {
                out.add(ph)
            } else {
                val fb = buildString {
                    for (ch in tok) append(charFallback[ch.toString()] ?: "")
                }
                out.add(fb.ifEmpty { tok })
            }
        }
        if (out.isEmpty()) return ""
        var joined = out.joinToString(" ").trim(' ', '.', ',', '!', '?')
        if (wordCount < 5 || joined.isEmpty() || !".,!?".contains(joined.last())) {
            joined += "."
        }
        return joined
    }

    companion object {
        private val DIGITS_VI = arrayOf("không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín")

        @Volatile
        private var instance: VieNeuNanoMobile? = null

        fun getInstance(context: Context): VieNeuNanoMobile {
            return instance ?: synchronized(this) {
                instance ?: VieNeuNanoMobile(context.applicationContext).also { instance = it }
            }
        }

        private fun createBoolMaskTensor(env: OrtEnvironment, ids: LongArray, padId: Long): OnnxTensor {
            val buf = ByteBuffer.allocateDirect(ids.size)
            for (v in ids) {
                buf.put(if (v != padId) 1.toByte() else 0.toByte())
            }
            buf.rewind()
            return OnnxTensor.createTensor(env, buf, longArrayOf(1L, ids.size.toLong()), OnnxJavaType.BOOL)
        }

        private fun jsonFloatArray(arr: JSONArray): FloatArray {
            return FloatArray(arr.length()) { i -> arr.optDouble(i, 0.0).toFloat() }
        }

        fun numberToVietnamese(n: Int): String {
            if (n < 0) return "âm ${numberToVietnamese(-n)}"
            if (n < 10) return DIGITS_VI[n]

            fun readTriple(v: Int, full: Boolean): List<String> {
                val h = v / 100
                val rem = v % 100
                val t = rem / 10
                val u = rem % 10
                val out = mutableListOf<String>()
                if (full || h > 0) {
                    out.add(DIGITS_VI[h])
                    out.add("trăm")
                    if (t == 0 && u > 0) out.add("lẻ")
                }
                if (t == 1) {
                    out.add("mười")
                    if (u == 5) out.add("lăm") else if (u > 0) out.add(DIGITS_VI[u])
                } else if (t > 1) {
                    out.add(DIGITS_VI[t])
                    out.add("mươi")
                    when (u) {
                        1 -> out.add("mốt")
                        4 -> out.add("tư")
                        5 -> out.add("lăm")
                        in 2..9 -> out.add(DIGITS_VI[u])
                    }
                } else if (u > 0) {
                    out.add(DIGITS_VI[u])
                }
                return out
            }

            val millions = n / 1_000_000
            val thousands = (n % 1_000_000) / 1_000
            val units = n % 1_000
            val parts = mutableListOf<String>()
            if (millions > 0) { parts.addAll(readTriple(millions, false)); parts.add("triệu") }
            if (thousands > 0) { parts.addAll(readTriple(thousands, millions > 0)); parts.add("nghìn") }
            if (units > 0) { parts.addAll(readTriple(units, millions > 0 || thousands > 0)) }
            return parts.joinToString(" ")
        }

        private fun splitClauses(text: String, maxChars: Int): List<String> {
            val trimmed = text.trim()
            if (trimmed.isEmpty()) return emptyList()
            if (trimmed.length <= maxChars) return listOf(trimmed)
            val parts = mutableListOf<String>()
            var rem = trimmed
            while (rem.length > maxChars) {
                val sub = rem.substring(0, maxChars)
                var cut = sub.indexOfLast { ".;!?,".contains(it) }
                if (cut <= 0) cut = sub.lastIndexOf(' ')
                if (cut <= 0) cut = maxChars
                val head = rem.substring(0, cut + 1).trim()
                if (head.isNotEmpty()) parts.add(head)
                rem = rem.substring((cut + 1).coerceAtMost(rem.length)).trim()
            }
            if (rem.isNotEmpty()) parts.add(rem)
            return parts
        }

        private fun trimAndFade(samples: FloatArray, sampleRate: Int): FloatArray {
            if (samples.isEmpty()) return samples
            var peak = 0f
            for (s in samples) if (abs(s) > peak) peak = abs(s)
            var lo = 0
            var hi = samples.size
            if (peak > 1e-4f) {
                val thr = max(0.004f, peak * 0.012f)
                val first = samples.indexOfFirst { abs(it) >= thr }
                val last = samples.indexOfLast { abs(it) >= thr }
                if (first >= 0 && last >= first) {
                    lo = max(0, first - (0.025 * sampleRate).toInt())
                    hi = min(samples.size, last + (0.080 * sampleRate).toInt())
                }
            }
            val out = samples.copyOfRange(lo, hi)
            val fade = min((0.015 * sampleRate).toInt(), out.size / 4)
            if (fade > 1) {
                for (k in 0 until fade) {
                    val g = (0.5 - 0.5 * cos(PI * k.toDouble() / fade.toDouble())).toFloat()
                    out[k] *= g
                    out[out.size - 1 - k] *= g
                }
            }
            for (i in out.indices) {
                out[i] = out[i].coerceIn(-1f, 1f)
            }
            return out
        }

        private fun writeWav16Mono(dest: File, samples: FloatArray, sampleRate: Int) {
            val dataBytes = samples.size * 2
            val buf = ByteBuffer.allocate(44 + dataBytes).order(ByteOrder.LITTLE_ENDIAN)
            buf.put("RIFF".toByteArray(Charsets.US_ASCII))
            buf.putInt(36 + dataBytes)
            buf.put("WAVE".toByteArray(Charsets.US_ASCII))
            buf.put("fmt ".toByteArray(Charsets.US_ASCII))
            buf.putInt(16)
            buf.putShort(1) // PCM
            buf.putShort(1) // Mono
            buf.putInt(sampleRate)
            buf.putInt(sampleRate * 2)
            buf.putShort(2)
            buf.putShort(16)
            buf.put("data".toByteArray(Charsets.US_ASCII))
            buf.putInt(dataBytes)
            for (s in samples) {
                val pcm = (s * 32767.0f).roundToInt().coerceIn(-32768, 32767).toShort()
                buf.putShort(pcm)
            }
            FileOutputStream(dest).use { fos ->
                fos.write(buf.array())
            }
        }
    }
}

