package org.chanhphap.engine

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.ForwardingPlayer
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaController
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import androidx.media3.session.SessionToken
import com.getcapacitor.JSObject
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.Executors

data class QueueSegmentItem(
    val index: Int,
    val block: String,
    val heading: String,
    val sourceOffset: Int,
    val text: String
)

class ChanhPhapPlaybackService : MediaSessionService() {

    private var mediaSession: MediaSession? = null

    @OptIn(UnstableApi::class)
    override fun onCreate() {
        super.onCreate()
        val controller = ChanhPhapAudioController.getInstance(applicationContext)
        val forwarding = object : ForwardingPlayer(controller.exoPlayer) {
            override fun getAvailableCommands(): Player.Commands {
                return super.getAvailableCommands()
                    .buildUpon()
                    .add(Player.COMMAND_SEEK_TO_NEXT)
                    .add(Player.COMMAND_SEEK_TO_NEXT_MEDIA_ITEM)
                    .add(Player.COMMAND_SEEK_TO_PREVIOUS)
                    .add(Player.COMMAND_SEEK_TO_PREVIOUS_MEDIA_ITEM)
                    .build()
            }

            override fun isCommandAvailable(command: Int): Boolean {
                if (command == Player.COMMAND_SEEK_TO_NEXT ||
                    command == Player.COMMAND_SEEK_TO_NEXT_MEDIA_ITEM ||
                    command == Player.COMMAND_SEEK_TO_PREVIOUS ||
                    command == Player.COMMAND_SEEK_TO_PREVIOUS_MEDIA_ITEM
                ) {
                    return true
                }
                return super.isCommandAvailable(command)
            }

            override fun seekToNext() = controller.nextSegmentFromLockScreen()
            override fun seekToNextMediaItem() = controller.nextSegmentFromLockScreen()
            override fun seekToPrevious() = controller.prevSegmentFromLockScreen()
            override fun seekToPreviousMediaItem() = controller.prevSegmentFromLockScreen()
            override fun play() = controller.resumeOrStart()
            override fun pause() = controller.pause()
        }
        mediaSession = MediaSession.Builder(this, forwarding).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.release()
        mediaSession = null
        super.onDestroy()
    }
}

class ChanhPhapAudioController private constructor(private val appContext: Context) {

    private val mainHandler = Handler(Looper.getMainLooper())
    private val synthExecutor = Executors.newSingleThreadExecutor { r ->
        Thread(r, "chanh-phap-audio-worker").apply { isDaemon = true }
    }

    val exoPlayer: ExoPlayer by lazy {
        val attrs = AudioAttributes.Builder()
            .setUsage(C.USAGE_MEDIA)
            .setContentType(C.AUDIO_CONTENT_TYPE_SPEECH)
            .build()
        ExoPlayer.Builder(appContext)
            .setAudioAttributes(attrs, true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_NETWORK)
            .build().apply {
                addListener(object : Player.Listener {
                    override fun onPlaybackStateChanged(playbackState: Int) {
                        if (playbackState == Player.STATE_ENDED && !usingSystemSpeech) {
                            advanceToNextSegment()
                        }
                    }
                })
            }
    }

    var onStateChanged: ((JSObject) -> Unit)? = null

    private var bookKey: String = ""
    private var bookTitle: String = "Thư viện Chánh Pháp"
    private var remoteBaseUrl: String = "https://thuvienchanhphap.duckdns.org"
    private var voice: String = "vieneu-thien-tam-duc"
    private var voiceLabel: String = "Thiền Tâm Đức · AI Chánh Pháp"
    private var rate: Float = 0.95f
    private var segments: List<QueueSegmentItem> = emptyList()

    private var currentIndex: Int = 0
    private var status: String = "idle"
    private var message: String = ""
    private var onDeviceAiActive: Boolean = false
    @Volatile
    private var sessionGeneration: Long = 0L

    private var repeatMode: String = "off"
    private var repeatTarget: Int = 0
    private var repeatCount: Int = 0
    private var repeatA: Int = -1
    private var repeatB: Int = -1
    private var sleepDeadlineMs: Long = 0L

    private var systemTts: TextToSpeech? = null
    private var systemTtsReady = false
    private var usingSystemSpeech = false
    private var systemSpeechStartedMs = 0L
    private var systemSpeechEstSec = 1.0
    private var mediaControllerStarted = false

    private val tickRunnable = object : Runnable {
        override fun run() {
            if (status == "playing") {
                if (sleepDeadlineMs > 0L && System.currentTimeMillis() >= sleepDeadlineMs) {
                    sleepDeadlineMs = 0L
                    message = "Đã dừng theo hẹn giờ ngủ."
                    pause()
                } else {
                    emitState(false)
                }
            }
            mainHandler.postDelayed(this, 500L)
        }
    }

    init {
        mainHandler.post {
            exoPlayer // Ensure initialized on main thread
            mainHandler.postDelayed(tickRunnable, 500L)
        }
    }

    private fun ensureServiceBound() {
        if (mediaControllerStarted) return
        mediaControllerStarted = true
        try {
            val token = SessionToken(appContext, ComponentName(appContext, ChanhPhapPlaybackService::class.java))
            MediaController.Builder(appContext, token).buildAsync()
        } catch (_: Exception) {
            mediaControllerStarted = false
        }
    }

    fun startQueue(
        bookKey: String,
        bookTitle: String,
        remoteBaseUrl: String,
        voice: String,
        rate: Float,
        startIndex: Int,
        startSeconds: Double,
        repeatMode: String,
        repeatTarget: Int,
        repeatA: Int,
        repeatB: Int,
        sleepDeadlineMs: Long,
        segments: List<QueueSegmentItem>
    ) {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            ensureServiceBound()
            stopInternal(emitIdle = false)
            this.bookKey = bookKey
            this.bookTitle = bookTitle
            this.remoteBaseUrl = remoteBaseUrl.trimEnd('/')
            this.voice = if (voice.contains("thuc-doan")) "vieneu-thuc-doan" else "vieneu-thien-tam-duc"
            this.voiceLabel = if (this.voice == "vieneu-thuc-doan") {
                "Thục Đoan · Nữ (AI Chánh Pháp)"
            } else {
                "Thiền Tâm Đức · Nam (AI Chánh Pháp)"
            }
            this.rate = rate.coerceIn(0.5f, 2.0f)
            this.segments = segments
            this.currentIndex = startIndex.coerceIn(0, segments.size - 1)
            this.repeatMode = repeatMode
            this.repeatTarget = repeatTarget.coerceAtLeast(0)
            this.repeatCount = 0
            this.repeatA = repeatA
            this.repeatB = repeatB
            this.sleepDeadlineMs = sleepDeadlineMs

            exoPlayer.setPlaybackSpeed(this.rate)
            playSegment(this.currentIndex, startSeconds.coerceAtLeast(0.0))
        }
    }

    fun resumeOrStart() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            ensureServiceBound()
            if (!usingSystemSpeech && status == "paused" && exoPlayer.mediaItemCount > 0) {
                exoPlayer.setPlaybackSpeed(rate)
                exoPlayer.play()
                status = "playing"
                emitState(false)
                return@post
            }
            playSegment(currentIndex, currentPositionSeconds())
        }
    }

    fun pause() {
        mainHandler.post {
            sessionGeneration++
            if (usingSystemSpeech) {
                systemTts?.stop()
            }
            exoPlayer.pause()
            if (status != "idle") {
                status = "paused"
                emitState(false)
            }
        }
    }

    fun stop() {
        mainHandler.post { stopInternal(emitIdle = true) }
    }

    private fun stopInternal(emitIdle: Boolean) {
        sessionGeneration++
        usingSystemSpeech = false
        systemTts?.stop()
        exoPlayer.stop()
        exoPlayer.clearMediaItems()
        status = "idle"
        if (emitIdle) emitState(false)
    }

    fun seek(index: Int, seconds: Double, resume: Boolean) {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            val clampedIdx = index.coerceIn(0, segments.size - 1)
            if (clampedIdx == currentIndex && !usingSystemSpeech && exoPlayer.mediaItemCount > 0) {
                val targetMs = (seconds.coerceAtLeast(0.0) * 1000.0).toLong()
                exoPlayer.seekTo(targetMs)
                if (resume) {
                    exoPlayer.play()
                    status = "playing"
                } else {
                    exoPlayer.pause()
                    status = "paused"
                }
                emitState(false)
                return@post
            }
            currentIndex = clampedIdx
            if (resume) {
                playSegment(clampedIdx, seconds.coerceAtLeast(0.0))
            } else {
                sessionGeneration++
                exoPlayer.stop()
                exoPlayer.clearMediaItems()
                status = "paused"
                emitState(false)
            }
        }
    }

    fun nextSegmentFromLockScreen() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            val next = (currentIndex + 1).coerceAtMost(segments.size - 1)
            seek(next, 0.0, resume = true)
        }
    }

    fun prevSegmentFromLockScreen() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            if (currentPositionSeconds() > 4.0) {
                seek(currentIndex, 0.0, resume = true)
            } else {
                seek((currentIndex - 1).coerceAtLeast(0), 0.0, resume = true)
            }
        }
    }

    fun updateOptions(
        repeatMode: String?,
        repeatTarget: Int?,
        repeatA: Int?,
        repeatB: Int?,
        sleepDeadlineMs: Long?,
        rate: Float?
    ) {
        mainHandler.post {
            if (repeatMode != null) { this.repeatMode = repeatMode; this.repeatCount = 0 }
            if (repeatTarget != null) { this.repeatTarget = repeatTarget.coerceAtLeast(0); this.repeatCount = 0 }
            if (repeatA != null) this.repeatA = repeatA
            if (repeatB != null) this.repeatB = repeatB
            if (sleepDeadlineMs != null) this.sleepDeadlineMs = sleepDeadlineMs.coerceAtLeast(0L)
            if (rate != null) {
                this.rate = rate.coerceIn(0.5f, 2.0f)
                exoPlayer.setPlaybackSpeed(this.rate)
            }
            emitState(false)
        }
    }

    fun currentStateSnapshot(finished: Boolean = false): JSObject {
        return JSObject().apply {
            put("bookKey", bookKey)
            put("status", status)
            put("index", currentIndex)
            put("currentTime", currentPositionSeconds())
            put("duration", currentDurationSeconds())
            put("voice", voice)
            put("voiceLabel", voiceLabel)
            put("packActive", false)
            put("onDeviceAiActive", onDeviceAiActive)
            put("finished", finished)
            put("message", message)
        }
    }

    private fun currentPositionSeconds(): Double {
        if (usingSystemSpeech) {
            return if (status == "playing") {
                ((System.currentTimeMillis() - systemSpeechStartedMs) / 1000.0).coerceIn(0.0, systemSpeechEstSec)
            } else 0.0
        }
        return (exoPlayer.currentPosition.coerceAtLeast(0L)).toDouble() / 1000.0
    }

    private fun currentDurationSeconds(): Double {
        if (usingSystemSpeech) return systemSpeechEstSec.coerceAtLeast(1.0)
        val durMs = exoPlayer.duration
        return if (durMs > 50L && durMs != C.TIME_UNSET) durMs.toDouble() / 1000.0 else 1.0
    }

    private fun emitState(finished: Boolean) {
        onStateChanged?.invoke(currentStateSnapshot(finished))
    }

    private fun playSegment(index: Int, startSeconds: Double) {
        if (index !in segments.indices) return
        val gen = ++sessionGeneration
        currentIndex = index
        usingSystemSpeech = false
        systemTts?.stop()
        exoPlayer.stop()

        val seg = segments[index]
        val cleanText = seg.text.trim()
        if (cleanText.isEmpty()) {
            advanceToNextSegment()
            return
        }

        status = "loading"
        message = "Đang chuẩn bị giọng đọc…"
        emitState(false)

        val activeVoice = voice
        val remoteBase = remoteBaseUrl

        synthExecutor.execute {
            val resolved = resolveSegmentAudioFile(cleanText, activeVoice, remoteBase)
            mainHandler.post {
                if (sessionGeneration != gen) return@post
                if (resolved != null) {
                    val (file, isAiLocal, label) = resolved
                    val chapter = seg.heading.ifBlank { "Đoạn ${index + 1}/${segments.size}" }
                    val metadata = MediaMetadata.Builder()
                        .setTitle(bookTitle)
                        .setArtist("Thư viện Chánh Pháp · $chapter")
                        .setAlbumTitle(label)
                        .build()
                    val item = MediaItem.Builder()
                        .setUri(Uri.fromFile(file))
                        .setMediaMetadata(metadata)
                        .build()

                    onDeviceAiActive = isAiLocal
                    voiceLabel = label
                    exoPlayer.setMediaItem(item)
                    exoPlayer.setPlaybackSpeed(rate)
                    exoPlayer.prepare()
                    if (startSeconds > 0.05) {
                        exoPlayer.seekTo((startSeconds * 1000.0).toLong())
                    }
                    exoPlayer.play()
                    status = "playing"
                    message = "Đang đọc · " + cleanText.take(68)
                    emitState(false)

                    prefetchUpcomingSegments(index, gen, activeVoice, remoteBase)
                } else {
                    playWithAndroidSystemSpeech(cleanText, gen)
                }
            }
        }
    }

    private fun prefetchUpcomingSegments(afterIndex: Int, generation: Long, voice: String, remoteBase: String) {
        val upcoming = listOf(afterIndex + 1, afterIndex + 2)
            .filter { it in segments.indices }
            .map { segments[it].text.trim() }
            .filter { it.isNotEmpty() }
        if (upcoming.isEmpty()) return

        synthExecutor.execute {
            for (txt in upcoming) {
                if (sessionGeneration != generation) break
                resolveSegmentAudioFile(txt, voice, remoteBase)
            }
        }
    }

    private data class ResolvedAudio(val file: File, val isLocalAi: Boolean, val label: String)

    private fun resolveSegmentAudioFile(text: String, voice: String, remoteBase: String): ResolvedAudio? {
        val ai = VieNeuNanoMobile.getInstance(appContext)
        if (ai.isAvailable()) {
            try {
                val wav = ai.synthesizeToWavFile(text, voice, 1.0)
                val label = if (voice == "vieneu-thuc-doan") {
                    "Thục Đoan · AI Nội Bộ (Ngoại tuyến)"
                } else {
                    "Thiền Tâm Đức · AI Nội Bộ (Ngoại tuyến)"
                }
                return ResolvedAudio(wav, true, label)
            } catch (_: Exception) {}
        }

        val vault = ChanhPhapVault.getInstance(appContext)
        val digest = MessageDigest.getInstance("SHA-256")
            .digest("mp3|$voice|$text".toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }
        val cachedMp3 = File(vault.cacheDir, "$digest.mp3")
        if (cachedMp3.isFile && cachedMp3.length() > 256L) {
            val label = if (voice == "vieneu-thuc-doan") "Thục Đoan · Đã lưu đệm" else "Thiền Tâm Đức · Đã lưu đệm"
            return ResolvedAudio(cachedMp3, false, label)
        }

        try {
            val conn = (URL("$remoteBase/api/tts").openConnection() as HttpURLConnection).apply {
                connectTimeout = 12000
                readTimeout = 25000
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
            val payload = JSONObject()
                .put("text", text)
                .put("voice", voice)
                .put("stream", false)
                .toString()
            conn.outputStream.use { it.write(payload.toByteArray(Charsets.UTF_8)) }
            if (conn.responseCode == 200) {
                val bytes = conn.inputStream.use { it.readBytes() }
                if (bytes.size > 256) {
                    val tmp = File(vault.cacheDir, "$digest.mp3.tmp")
                    FileOutputStream(tmp).use { it.write(bytes) }
                    if (cachedMp3.exists()) cachedMp3.delete()
                    tmp.renameTo(cachedMp3)
                    val label = if (voice == "vieneu-thuc-doan") "Thục Đoan · Máy chủ AI" else "Thiền Tâm Đức · Máy chủ AI"
                    return ResolvedAudio(cachedMp3, false, label)
                }
            }
        } catch (_: Exception) {}

        return null
    }

    private fun playWithAndroidSystemSpeech(text: String, gen: Long) {
        usingSystemSpeech = true
        onDeviceAiActive = false
        voiceLabel = "Giọng tiếng Việt Android (Dự phòng ngoại tuyến)"
        val words = text.split(Regex("\\s+")).size.coerceAtLeast(1)
        systemSpeechEstSec = (words.toDouble() / (3.1 * rate)).coerceAtLeast(1.5)
        systemSpeechStartedMs = System.currentTimeMillis()
        status = "playing"
        message = "Đang đọc (Giọng thiết bị) · " + text.take(60)
        emitState(false)

        fun speakNow(tts: TextToSpeech) {
            tts.language = Locale("vi", "VN")
            tts.setSpeechRate(rate)
            tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                override fun onDone(utteranceId: String?) {
                    mainHandler.post {
                        if (sessionGeneration == gen && usingSystemSpeech && status == "playing") {
                            advanceToNextSegment()
                        }
                    }
                }
                override fun onError(utteranceId: String?) {}
            })
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "seg-$gen")
        }

        val existing = systemTts
        if (existing != null && systemTtsReady) {
            speakNow(existing)
            return
        }
        systemTts = TextToSpeech(appContext) { code ->
            if (code == TextToSpeech.SUCCESS) {
                systemTtsReady = true
                if (sessionGeneration == gen) {
                    systemTts?.let { speakNow(it) }
                }
            }
        }
    }

    private fun advanceToNextSegment() {
        if (repeatA >= 0 && repeatB >= repeatA && currentIndex >= repeatB) {
            repeatCount++
            if (repeatTarget > 0 && repeatCount >= repeatTarget) {
                message = "Đã hoàn tất $repeatTarget biến tụng đã chọn."
                pause()
                return
            }
            playSegment(repeatA.coerceAtMost(segments.size - 1), 0.0)
            return
        }

        if (currentIndex + 1 < segments.size) {
            playSegment(currentIndex + 1, 0.0)
            return
        }

        if (repeatMode == "one" || repeatMode == "all") {
            repeatCount++
            if (repeatTarget > 0 && repeatCount >= repeatTarget) {
                status = "paused"
                message = "Đã hoàn tất $repeatTarget biến tụng."
                emitState(false)
                return
            }
            playSegment(0, 0.0)
            return
        }

        status = "paused"
        message = "Đã nghe trọn bản kinh."
        emitState(true)
    }

    companion object {
        @Volatile
        private var instance: ChanhPhapAudioController? = null

        fun getInstance(context: Context): ChanhPhapAudioController {
            return instance ?: synchronized(this) {
                instance ?: ChanhPhapAudioController(context.applicationContext).also { instance = it }
            }
        }
    }
}

