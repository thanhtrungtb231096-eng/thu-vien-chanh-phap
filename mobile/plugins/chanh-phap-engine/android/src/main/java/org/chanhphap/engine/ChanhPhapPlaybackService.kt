package org.chanhphap.engine

import android.content.ComponentName
import android.content.Context
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.net.wifi.WifiManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
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
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import kotlin.math.abs

data class QueueSegmentItem(
    val index: Int,
    val block: String,
    val heading: String,
    val chapterIndex: Int = -1,
    val chapterCount: Int = 0,
    val chapterTitle: String = "",
    val baseSeconds: Double = 0.0,
    val pauseBefore: Int = 0,
    val sourceOffset: Int,
    val text: String
)

private data class ChapterSection(
    val chapterIndex: Int,
    val title: String,
    val startIndex: Int,
    val endIndex: Int
)

private data class ChapterProgressSnapshot(
    val chapterIndex: Int,
    val chapterCount: Int,
    val title: String,
    val startIndex: Int,
    val endIndex: Int,
    val timeSec: Double,
    val durationSec: Double,
    val estimated: Boolean
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
                    .add(Player.COMMAND_SEEK_FORWARD)
                    .add(Player.COMMAND_SEEK_BACK)
                    .build()
            }

            override fun isCommandAvailable(command: Int): Boolean {
                if (command == Player.COMMAND_SEEK_TO_NEXT ||
                    command == Player.COMMAND_SEEK_TO_NEXT_MEDIA_ITEM ||
                    command == Player.COMMAND_SEEK_TO_PREVIOUS ||
                    command == Player.COMMAND_SEEK_TO_PREVIOUS_MEDIA_ITEM ||
                    command == Player.COMMAND_SEEK_FORWARD ||
                    command == Player.COMMAND_SEEK_BACK
                ) {
                    return true
                }
                return super.isCommandAvailable(command)
            }

            override fun seekToNext() = controller.nextChapterFromLockScreen()
            override fun seekToNextMediaItem() = controller.nextChapterFromLockScreen()
            override fun seekToPrevious() = controller.prevChapterFromLockScreen()
            override fun seekToPreviousMediaItem() = controller.prevChapterFromLockScreen()
            override fun seekForward() = controller.skipBySeconds(15.0)
            override fun seekBack() = controller.skipBySeconds(-15.0)
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
    private val foregroundExecutor = Executors.newSingleThreadExecutor { r ->
        Thread(r, "chanh-phap-audio-fg").apply {
            isDaemon = true
            priority = Thread.NORM_PRIORITY + 1
        }
    }
    private val prefetchExecutor = Executors.newFixedThreadPool(2) { r ->
        Thread(r, "chanh-phap-audio-prefetch").apply { isDaemon = true }
    }

    private val dedupLock = Object()
    private val inFlightKeys = HashSet<String>()
    private val resolvedCache = ConcurrentHashMap<String, ResolvedAudio>()

    private var cpuWakeLock: PowerManager.WakeLock? = null
    private var wifiLock: WifiManager.WifiLock? = null
    private var mediaControllerFuture: Any? = null

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
                    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                        if (usingSystemSpeech) return
                        val nextIdx = mediaItem?.mediaId?.toIntOrNull()
                        if (nextIdx != null && nextIdx in segments.indices && nextIdx != currentIndex) {
                            currentIndex = nextIdx
                            val clean = segments[nextIdx].text.trim()
                            message = "Đang đọc · " + clean.take(68)
                            emitState(false)
                            prefetchUpcomingSegments(nextIdx, sessionGeneration, voice, remoteBaseUrl)
                        }
                    }

                    override fun onPlaybackStateChanged(playbackState: Int) {
                        if (playbackState == Player.STATE_ENDED && !usingSystemSpeech && status == "playing") {
                            advanceAfterPlaylistEnd()
                        }
                    }
                })
            }
    }

    var onStateChanged: ((JSObject) -> Unit)? = null

    private var bookKey: String = ""
    private var bookTitle: String = "Thư viện Chánh Pháp"
    private var remoteBaseUrl: String = "https://thuvienchanhphap.duckdns.org"
    private var rawVoice: String = "vieneu-thien-tam-duc"
    private var voice: String = "vieneu-thien-tam-duc"
    private var voiceLabel: String = "Thiền Tâm Đức · AI Chánh Pháp"
    private var rate: Float = 0.95f
    private var segments: List<QueueSegmentItem> = emptyList()
    private var chapters: List<ChapterSection> = emptyList()
    private val actualDurations = ConcurrentHashMap<Int, Double>()
    private val queuedIndices = ArrayList<Int>()
    private var smoothedChapterId: String = ""
    private var smoothedChapterDur: Double = 0.0

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

    private val tickRunnable = object : Runnable {
        override fun run() {
            if (status == "playing") {
                if (sleepDeadlineMs > 0L && System.currentTimeMillis() >= sleepDeadlineMs) {
                    sleepDeadlineMs = 0L
                    message = "Đã dừng theo hẹn giờ ngủ."
                    pause()
                } else {
                    if (!usingSystemSpeech) {
                        val durMs = exoPlayer.duration
                        if (durMs > 100L && durMs != C.TIME_UNSET) {
                            actualDurations[currentIndex] = durMs.toDouble() / 1000.0
                        }
                    }
                    emitState(false)
                }
            }
            mainHandler.postDelayed(this, 500L)
        }
    }

    init {
        mainHandler.post {
            exoPlayer
            mainHandler.postDelayed(tickRunnable, 500L)
        }
    }

    private fun acquireLocks() {
        try {
            if (cpuWakeLock == null) {
                val pm = appContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
                cpuWakeLock = pm?.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ChanhPhap::AudioPlaybackLock")?.apply {
                    setReferenceCounted(false)
                }
            }
            if (cpuWakeLock?.isHeld == false) {
                cpuWakeLock?.acquire(4 * 60 * 60 * 1000L)
            }
        } catch (_: Exception) {}

        try {
            if (wifiLock == null) {
                val wm = appContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
                val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    WifiManager.WIFI_MODE_FULL_LOW_LATENCY
                } else {
                    @Suppress("DEPRECATION")
                    WifiManager.WIFI_MODE_FULL_HIGH_PERF
                }
                wifiLock = wm?.createWifiLock(mode, "ChanhPhap::AudioWifiLock")?.apply {
                    setReferenceCounted(false)
                }
            }
            if (wifiLock?.isHeld == false) {
                wifiLock?.acquire()
            }
        } catch (_: Exception) {}
    }

    private fun releaseLocks() {
        try {
            if (cpuWakeLock?.isHeld == true) cpuWakeLock?.release()
        } catch (_: Exception) {}
        try {
            if (wifiLock?.isHeld == true) wifiLock?.release()
        } catch (_: Exception) {}
    }

    private fun ensureServiceBound() {
        if (mediaControllerFuture != null) return
        try {
            val token = SessionToken(appContext, ComponentName(appContext, ChanhPhapPlaybackService::class.java))
            mediaControllerFuture = MediaController.Builder(appContext, token).buildAsync()
        } catch (_: Exception) {
            mediaControllerFuture = null
        }
    }

    private fun estimateSegmentSeconds(seg: QueueSegmentItem): Double {
        if (seg.baseSeconds > 0.2) return seg.baseSeconds
        val clean = seg.text.trim()
        if (clean.isEmpty()) return 0.8
        val words = clean.split(Regex("\\s+")).filter { it.isNotEmpty() }.size.coerceAtLeast(1)
        val commas = clean.count { ",;，；:：".indexOf(it) >= 0 }
        val stops = clean.count { ".!?。！？…".indexOf(it) >= 0 }
        val pause = seg.pauseBefore.coerceAtLeast(0).toDouble() / 1000.0
        return (words.toDouble() / 3.15 + commas * 0.20 + stops * 0.38 + 0.35 + pause).coerceAtLeast(0.8)
    }

    private fun buildChapterSections(segs: List<QueueSegmentItem>, fallbackTitle: String): List<ChapterSection> {
        if (segs.isEmpty()) return emptyList()
        if (segs.all { it.chapterIndex >= 0 && it.chapterCount > 0 }) {
            val map = LinkedHashMap<Int, Triple<String, Int, Int>>()
            for (seg in segs) {
                val cur = map[seg.chapterIndex]
                if (cur == null) {
                    val t = seg.chapterTitle.ifBlank { seg.heading.ifBlank { fallbackTitle } }
                    map[seg.chapterIndex] = Triple(t, seg.index, seg.index)
                } else {
                    val t = cur.first.ifBlank { seg.chapterTitle }
                    map[seg.chapterIndex] = Triple(t, minOf(cur.second, seg.index), maxOf(cur.third, seg.index))
                }
            }
            return map.entries.sortedBy { it.key }.mapIndexed { pos, entry ->
                val (t, s, e) = entry.value
                ChapterSection(pos, t.ifBlank { "Phần ${pos + 1}" }, s, e)
            }
        }
        val starts = mutableListOf<Pair<Int, String>>()
        segs.forEachIndexed { idx, s ->
            val h = s.heading.trim()
            if (h.isNotEmpty()) starts.add(idx to h)
        }
        if (starts.isEmpty() || starts[0].first > 0) {
            if (starts.isNotEmpty() && starts[0].first <= 4) {
                starts[0] = 0 to starts[0].second
            } else {
                starts.add(0, 0 to fallbackTitle)
            }
        }
        return starts.mapIndexed { idx, (startIdx, title) ->
            val endIdx = if (idx + 1 < starts.size) starts[idx + 1].first - 1 else segs.size - 1
            ChapterSection(idx, title, startIdx, endIdx)
        }
    }

    private fun segmentMediaDuration(idx: Int): Double {
        if (idx !in segments.indices) return 1.0
        if (idx == currentIndex && !usingSystemSpeech) {
            val durMs = exoPlayer.duration
            if (durMs > 100L && durMs != C.TIME_UNSET) return durMs.toDouble() / 1000.0
        }
        val exact = actualDurations[idx]
        if (exact != null && exact > 0.1) return exact
        return estimateSegmentSeconds(segments[idx])
    }

    private fun chapterSnapshotFor(targetIdx: Int = currentIndex, inSegPosSec: Double = currentPositionSeconds()): ChapterProgressSnapshot {
        if (segments.isEmpty()) {
            return ChapterProgressSnapshot(0, 0, bookTitle, 0, 0, 0.0, 1.0, false)
        }
        val list = chapters.ifEmpty { buildChapterSections(segments, bookTitle) }
        val clamped = targetIdx.coerceIn(0, segments.size - 1)
        val active = list.firstOrNull { clamped in it.startIndex..it.endIndex } ?: list[0]

        var elapsedBefore = 0.0
        var total = 0.0
        var allExact = true
        for (i in active.startIndex..active.endIndex) {
            val hasExact = (actualDurations[i] ?: 0.0) > 0.1 || (i == currentIndex && exoPlayer.duration > 100L && exoPlayer.duration != C.TIME_UNSET)
            if (!hasExact) allExact = false
            val d = segmentMediaDuration(i)
            if (i < clamped) elapsedBefore += d
            total += d
        }
        val curDur = segmentMediaDuration(clamped)
        val inSeg = inSegPosSec.coerceIn(0.0, curDur)
        val rawTotal = total.coerceAtLeast(0.5)
        val chId = "$bookKey|$voice|${active.chapterIndex}"
        var stableTotal = rawTotal
        if (!allExact) {
            if (smoothedChapterId == chId && smoothedChapterDur > 0.0) {
                if (abs(rawTotal - smoothedChapterDur) >= 4.0) smoothedChapterDur = rawTotal
                else stableTotal = smoothedChapterDur
            } else {
                smoothedChapterId = chId
                smoothedChapterDur = rawTotal
            }
        } else {
            smoothedChapterId = chId
            smoothedChapterDur = rawTotal
        }
        val chTime = (elapsedBefore + inSeg).coerceIn(0.0, stableTotal)
        val finalTotal = maxOf(stableTotal, chTime + if (clamped < active.endIndex) 0.5 else 0.0)
        return ChapterProgressSnapshot(active.chapterIndex, list.size, active.title, active.startIndex, active.endIndex, chTime, finalTotal, !allExact)
    }

    private fun fmtMmSs(seconds: Double): String {
        val total = seconds.toInt().coerceAtLeast(0)
        return "%d:%02d".format(total / 60, total % 60)
    }

    private fun buildMediaItem(segIndex: Int, file: File, label: String): MediaItem {
        val ch = chapterSnapshotFor(segIndex, 0.0)
        val displayTitle = if (ch.chapterCount > 1 && ch.title.isNotBlank() && !ch.title.equals(bookTitle, ignoreCase = true)) {
            "${ch.title} — $bookTitle"
        } else {
            bookTitle
        }
        val durBadge = (if (ch.estimated) "~" else "") + fmtMmSs(ch.durationSec)
        val partBadge = if (ch.chapterCount > 1) {
            "Phần ${ch.chapterIndex + 1}/${ch.chapterCount} ($durBadge)"
        } else {
            "Tổng $durBadge"
        }
        val metadata = MediaMetadata.Builder()
            .setTitle(displayTitle)
            .setArtist("$partBadge · $label")
            .setAlbumTitle("Đại Thư Viện Chánh Pháp")
            .build()
        return MediaItem.Builder()
            .setMediaId(segIndex.toString())
            .setUri(Uri.fromFile(file))
            .setMediaMetadata(metadata)
            .build()
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
            val cleanVoice = if (voice.contains("thuc-doan")) "vieneu-thuc-doan" else "vieneu-thien-tam-duc"
            val sameSession = (this.bookKey == bookKey && this.voice == cleanVoice && this.segments.size == segments.size)
            stopInternal(emitIdle = false)
            if (!sameSession) {
                actualDurations.clear()
                resolvedCache.clear()
                smoothedChapterId = ""
                smoothedChapterDur = 0.0
            }
            this.bookKey = bookKey
            this.bookTitle = bookTitle
            this.remoteBaseUrl = remoteBaseUrl.trimEnd('/')
            this.rawVoice = voice
            this.voice = cleanVoice
            this.voiceLabel = if (cleanVoice == "vieneu-thuc-doan") {
                "Thục Đoan · Nữ (AI Chánh Pháp)"
            } else {
                "Thiền Tâm Đức · Nam (AI Chánh Pháp)"
            }
            this.rate = rate.coerceIn(0.5f, 2.0f)
            this.segments = segments
            this.chapters = buildChapterSections(segments, bookTitle)
            this.currentIndex = startIndex.coerceIn(0, segments.size - 1)
            this.repeatMode = repeatMode
            this.repeatTarget = repeatTarget.coerceAtLeast(0)
            this.repeatCount = 0
            this.repeatA = repeatA
            this.repeatB = repeatB
            this.sleepDeadlineMs = sleepDeadlineMs

            acquireLocks()
            exoPlayer.setPlaybackSpeed(this.rate)
            playSegment(this.currentIndex, startSeconds.coerceAtLeast(0.0))
        }
    }

    fun resumeOrStart() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            ensureServiceBound()
            acquireLocks()
            if (!usingSystemSpeech && status == "paused" && exoPlayer.mediaItemCount > 0) {
                exoPlayer.setPlaybackSpeed(rate)
                exoPlayer.play()
                status = "playing"
                emitState(false)
                prefetchUpcomingSegments(currentIndex, sessionGeneration, voice, remoteBaseUrl)
                return@post
            }
            playSegment(currentIndex, currentPositionSeconds())
        }
    }

    fun pause() {
        mainHandler.post {
            sessionGeneration++
            releaseLocks()
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
        releaseLocks()
        usingSystemSpeech = false
        systemTts?.stop()
        queuedIndices.clear()
        exoPlayer.stop()
        exoPlayer.clearMediaItems()
        status = "idle"
        if (emitIdle) emitState(false)
    }

    fun seek(index: Int, seconds: Double, resume: Boolean) {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            val clampedIdx = index.coerceIn(0, segments.size - 1)
            val targetMs = (seconds.coerceAtLeast(0.0) * 1000.0).toLong()
            val queuedPos = queuedIndices.indexOf(clampedIdx)
            if (queuedPos >= 0 && !usingSystemSpeech && queuedPos < exoPlayer.mediaItemCount) {
                currentIndex = clampedIdx
                exoPlayer.seekTo(queuedPos, targetMs)
                if (resume) {
                    acquireLocks()
                    exoPlayer.play()
                    status = "playing"
                    prefetchUpcomingSegments(clampedIdx, sessionGeneration, voice, remoteBaseUrl)
                } else {
                    releaseLocks()
                    exoPlayer.pause()
                    status = "paused"
                }
                emitState(false)
                return@post
            }
            currentIndex = clampedIdx
            if (resume) {
                acquireLocks()
                playSegment(clampedIdx, seconds.coerceAtLeast(0.0))
            } else {
                sessionGeneration++
                releaseLocks()
                queuedIndices.clear()
                exoPlayer.stop()
                exoPlayer.clearMediaItems()
                status = "paused"
                emitState(false)
            }
        }
    }

    fun nextChapterFromLockScreen() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            val ch = chapterSnapshotFor()
            if (ch.chapterIndex + 1 < chapters.size) {
                val nextCh = chapters[ch.chapterIndex + 1]
                seek(nextCh.startIndex, 0.0, resume = true)
            } else {
                emitState(finished = false, nextBookRequested = true)
            }
        }
    }

    fun prevChapterFromLockScreen() {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            val ch = chapterSnapshotFor()
            if (ch.timeSec > 5.0 || ch.chapterIndex == 0) {
                seek(ch.startIndex, 0.0, resume = true)
            } else {
                val prevCh = chapters[ch.chapterIndex - 1]
                seek(prevCh.startIndex, 0.0, resume = true)
            }
        }
    }

    fun skipBySeconds(deltaSec: Double) {
        mainHandler.post {
            if (segments.isEmpty()) return@post
            var idx = currentIndex.coerceIn(0, segments.size - 1)
            var pos = currentPositionSeconds().coerceAtLeast(0.0) + deltaSec
            while (pos < 0.0 && idx > 0) {
                idx -= 1
                pos += segmentMediaDuration(idx)
            }
            if (pos < 0.0) pos = 0.0
            while (idx < segments.size - 1) {
                val d = segmentMediaDuration(idx)
                if (pos < d) break
                pos -= d
                idx += 1
            }
            val finalDur = segmentMediaDuration(idx)
            seek(idx, pos.coerceIn(0.0, (finalDur - 0.05).coerceAtLeast(0.0)), resume = status == "playing" || status == "loading")
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

    fun currentStateSnapshot(finished: Boolean = false, nextBookRequested: Boolean = false): JSObject {
        val ch = chapterSnapshotFor()
        return JSObject().apply {
            put("bookKey", bookKey)
            put("status", status)
            put("index", currentIndex)
            put("currentTime", currentPositionSeconds())
            put("duration", currentDurationSeconds())
            put("chapterIndex", ch.chapterIndex)
            put("chapterCount", ch.chapterCount)
            put("chapterTitle", ch.title)
            put("chapterTime", ch.timeSec)
            put("chapterDuration", ch.durationSec)
            put("chapterEstimated", ch.estimated)
            put("voice", voice)
            put("voiceLabel", voiceLabel)
            put("packActive", onDeviceAiActive)
            put("onDeviceAiActive", onDeviceAiActive)
            put("finished", finished)
            put("nextBookRequested", nextBookRequested)
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
        if (durMs > 50L && durMs != C.TIME_UNSET) return durMs.toDouble() / 1000.0
        val exact = actualDurations[currentIndex]
        if (exact != null && exact > 0.05) return exact
        return if (currentIndex in segments.indices) estimateSegmentSeconds(segments[currentIndex]) else 1.0
    }

    private fun emitState(finished: Boolean, nextBookRequested: Boolean = false) {
        onStateChanged?.invoke(currentStateSnapshot(finished, nextBookRequested))
    }

    private fun playSegment(index: Int, startSeconds: Double) {
        if (index !in segments.indices) return
        val gen = ++sessionGeneration
        currentIndex = index
        usingSystemSpeech = false
        systemTts?.stop()
        queuedIndices.clear()
        exoPlayer.pause()
        exoPlayer.clearMediaItems()

        val seg = segments[index]
        val cleanText = seg.text.trim()
        if (cleanText.isEmpty()) {
            advanceAfterPlaylistEnd()
            return
        }

        acquireLocks()
        status = "loading"
        message = "Đang chuẩn bị giọng đọc…"
        emitState(false)

        val activeVoice = voice
        val remoteBase = remoteBaseUrl
        val allowSystemSpeech = rawVoice.startsWith("device:")

        foregroundExecutor.execute {
            val resolved = resolveSegmentAudioFile(cleanText, activeVoice, remoteBase, maxRetries = 4)
            mainHandler.post {
                if (sessionGeneration != gen) return@post
                if (resolved != null) {
                    val (file, isAiLocal, label, fileDur) = resolved
                    if (fileDur > 0.1) actualDurations[index] = fileDur
                    val item = buildMediaItem(index, file, label)

                    onDeviceAiActive = isAiLocal
                    voiceLabel = label
                    queuedIndices.clear()
                    queuedIndices.add(index)
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
                } else if (allowSystemSpeech) {
                    playWithAndroidSystemSpeech(cleanText, gen)
                } else {
                    releaseLocks()
                    status = "error"
                    message = "Kết nối giọng đọc gián đoạn. Nhấn Nghe tiếp hoặc tải Gói Giọng AI Nội Bộ để nghe không cần mạng."
                    emitState(false)
                }
            }
        }
    }

    private fun prefetchUpcomingSegments(afterIndex: Int, generation: Long, voice: String, remoteBase: String) {
        if (afterIndex + 1 >= segments.size) return
        val upper = if (repeatB >= afterIndex + 1) minOf(segments.size - 1, repeatB) else segments.size - 1
        val candidates = mutableListOf<Pair<Int, String>>()
        var estTotal = 0.0
        for (i in (afterIndex + 1)..upper) {
            val txt = segments[i].text.trim()
            if (txt.isEmpty()) continue
            candidates.add(i to txt)
            estTotal += estimateSegmentSeconds(segments[i])
            if (candidates.size >= 14 || (candidates.size >= 4 && estTotal >= 110.0)) break
        }
        if (candidates.isEmpty()) return

        prefetchExecutor.execute {
            for ((segIdx, txt) in candidates) {
                if (sessionGeneration != generation) break
                val resolved = resolveSegmentAudioFile(txt, voice, remoteBase, maxRetries = 3) ?: continue
                if (resolved.durationSec > 0.1) {
                    actualDurations[segIdx] = resolved.durationSec
                }
                mainHandler.post {
                    if (sessionGeneration != generation || usingSystemSpeech || status == "idle") return@post
                    // Append contiguously into ExoPlayer's active playlist for 0ms hardware gapless transitions!
                    if (queuedIndices.isNotEmpty() && queuedIndices.last() == segIdx - 1 && (repeatB < 0 || segIdx <= repeatB)) {
                        val nextItem = buildMediaItem(segIdx, resolved.file, resolved.label)
                        exoPlayer.addMediaItem(nextItem)
                        queuedIndices.add(segIdx)
                    }
                }
            }
        }
    }

    private data class ResolvedAudio(val file: File, val isLocalAi: Boolean, val label: String, val durationSec: Double)

    private fun measureAudioFileDuration(file: File): Double {
        val retriever = MediaMetadataRetriever()
        return try {
            retriever.setDataSource(file.absolutePath)
            val durStr = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)
            val ms = durStr?.toLongOrNull() ?: 0L
            if (ms > 50L) ms.toDouble() / 1000.0 else 0.0
        } catch (_: Exception) {
            0.0
        } finally {
            try { retriever.release() } catch (_: Exception) {}
        }
    }

    private fun resolveSegmentAudioFile(text: String, voice: String, remoteBase: String, maxRetries: Int): ResolvedAudio? {
        val dedupKey = "$voice|$text"
        resolvedCache[dedupKey]?.let { cached ->
            if (cached.file.isFile && cached.file.length() > 64L) return cached
        }

        synchronized(dedupLock) {
            while (inFlightKeys.contains(dedupKey)) {
                try { dedupLock.wait(1000L) } catch (_: InterruptedException) { break }
                resolvedCache[dedupKey]?.let { cached ->
                    if (cached.file.isFile && cached.file.length() > 64L) return cached
                }
            }
            inFlightKeys.add(dedupKey)
        }

        try {
            val ai = VieNeuNanoMobile.getInstance(appContext)
            if (ai.isAvailable()) {
                try {
                    val wav = ai.synthesizeToWavFile(text, voice, 1.0)
                    val label = if (voice == "vieneu-thuc-doan") {
                        "Thục Đoan · AI Nội Bộ"
                    } else {
                        "Thiền Tâm Đức · AI Nội Bộ"
                    }
                    val res = ResolvedAudio(wav, true, label, measureAudioFileDuration(wav))
                    cacheResolved(dedupKey, res)
                    return res
                } catch (_: Exception) {}
            }

            val vault = ChanhPhapVault.getInstance(appContext)
            val digest = MessageDigest.getInstance("SHA-256")
                .digest("mp3|$voice|$text".toByteArray(Charsets.UTF_8))
                .joinToString("") { "%02x".format(it) }
            val cachedMp3 = File(vault.cacheDir, "$digest.mp3")
            if (cachedMp3.isFile && cachedMp3.length() > 256L) {
                val label = if (voice == "vieneu-thuc-doan") "Thục Đoan · Đã lưu đệm" else "Thiền Tâm Đức · Đã lưu đệm"
                val res = ResolvedAudio(cachedMp3, false, label, measureAudioFileDuration(cachedMp3))
                cacheResolved(dedupKey, res)
                return res
            }

            val attempts = maxRetries.coerceAtLeast(1)
            val backoffs = longArrayOf(800L, 1800L, 3500L, 6000L)
            for (attempt in 0 until attempts) {
                var statusCode = 0
                try {
                    val conn = (URL("$remoteBase/api/tts").openConnection() as HttpURLConnection).apply {
                        connectTimeout = 14000
                        readTimeout = 28000
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
                    statusCode = conn.responseCode
                    if (statusCode == 200) {
                        val bytes = conn.inputStream.use { it.readBytes() }
                        if (bytes.size > 256) {
                            val tmp = File(vault.cacheDir, "$digest.mp3.tmp")
                            FileOutputStream(tmp).use { it.write(bytes) }
                            if (cachedMp3.exists()) cachedMp3.delete()
                            tmp.renameTo(cachedMp3)
                            val label = if (voice == "vieneu-thuc-doan") "Thục Đoan · Máy chủ AI" else "Thiền Tâm Đức · Máy chủ AI"
                            val res = ResolvedAudio(cachedMp3, false, label, measureAudioFileDuration(cachedMp3))
                            cacheResolved(dedupKey, res)
                            return res
                        }
                    }
                } catch (_: Exception) {}

                if (statusCode in 400..499 && statusCode != 429) break
                if (attempt + 1 < attempts) {
                    try { Thread.sleep(backoffs[minOf(attempt, backoffs.size - 1)]) } catch (_: InterruptedException) { break }
                }
            }
            return null
        } finally {
            synchronized(dedupLock) {
                inFlightKeys.remove(dedupKey)
                dedupLock.notifyAll()
            }
        }
    }

    private fun cacheResolved(key: String, value: ResolvedAudio) {
        if (resolvedCache.size > 64) resolvedCache.clear()
        resolvedCache[key] = value
    }

    private fun playWithAndroidSystemSpeech(text: String, gen: Long) {
        usingSystemSpeech = true
        onDeviceAiActive = false
        voiceLabel = "Giọng tiếng Việt Android (Thiết bị)"
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
                            advanceAfterPlaylistEnd()
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

    private fun advanceAfterPlaylistEnd() {
        val lastPlayed = if (queuedIndices.isNotEmpty()) queuedIndices.last() else currentIndex
        currentIndex = lastPlayed

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
                releaseLocks()
                status = "paused"
                message = "Đã hoàn tất $repeatTarget biến tụng."
                emitState(false)
                return
            }
            playSegment(0, 0.0)
            return
        }

        releaseLocks()
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
