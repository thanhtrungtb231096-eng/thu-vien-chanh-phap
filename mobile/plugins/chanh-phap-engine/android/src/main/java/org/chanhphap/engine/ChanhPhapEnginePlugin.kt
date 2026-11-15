package org.chanhphap.engine

import android.Manifest
import android.os.Build
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import java.util.concurrent.Executors

@CapacitorPlugin(
    name = "ChanhPhapEngine",
    permissions = [
        Permission(
            strings = [Manifest.permission.POST_NOTIFICATIONS],
            alias = "notifications"
        )
    ]
)
class ChanhPhapEnginePlugin : Plugin() {

    private val ioExecutor = Executors.newCachedThreadPool { r ->
        Thread(r, "chanh-phap-plugin-io").apply { isDaemon = true }
    }

    override fun load() {
        val audio = ChanhPhapAudioController.getInstance(context)
        audio.onStateChanged = { stateObj ->
            notifyListeners("playbackState", stateObj)
        }
    }

    @PluginMethod
    fun getVaultStatus(call: PluginCall) {
        ioExecutor.execute {
            val obj = ChanhPhapVault.getInstance(context).vaultStatus()
            call.resolve(JSObject.fromJSONObject(obj))
        }
    }

    @PluginMethod
    fun getManuscript(call: PluginCall) {
        val url = call.getString("url", "") ?: ""
        if (url.isEmpty()) {
            call.resolve(JSObject().put("found", false))
            return
        }
        ioExecutor.execute {
            val hit = ChanhPhapVault.getInstance(context).getManuscript(url)
            if (hit.found && hit.content != null) {
                call.resolve(
                    JSObject()
                        .put("found", true)
                        .put("content", hit.content)
                        .put("packId", hit.packId ?: "vault")
                )
            } else {
                call.resolve(JSObject().put("found", false))
            }
        }
    }

    @PluginMethod
    fun cacheManuscript(call: PluginCall) {
        val url = call.getString("url", "") ?: ""
        val content = call.getString("content", "") ?: ""
        if (url.isEmpty()) {
            call.resolve()
            return
        }
        ioExecutor.execute {
            ChanhPhapVault.getInstance(context).cacheManuscript(url, content)
            call.resolve()
        }
    }

    @PluginMethod
    fun searchVault(call: PluginCall) {
        val q = call.getString("q", "") ?: ""
        val collection = call.getString("collection", "") ?: ""
        val mode = call.getString("mode", "") ?: ""
        val offset = call.getInt("offset", 0) ?: 0
        ioExecutor.execute {
            val res = ChanhPhapVault.getInstance(context).searchVault(q, collection, mode, offset)
            call.resolve(JSObject.fromJSONObject(res))
        }
    }

    @PluginMethod
    fun downloadPack(call: PluginCall) {
        val id = call.getString("id")
        val kind = call.getString("kind")
        if (id.isNullOrEmpty() || kind.isNullOrEmpty()) {
            call.reject("Thiếu thông tin gói dữ liệu cần tải.")
            return
        }
        val remoteBase = call.getString("remoteBaseUrl", "https://thuvienchanhphap.duckdns.org")
            ?: "https://thuvienchanhphap.duckdns.org"

        ioExecutor.execute {
            try {
                ChanhPhapVault.getInstance(context).downloadPack(id, kind, remoteBase) { pct ->
                    notifyListeners("downloadProgress", JSObject().put("id", id).put("percent", pct))
                }
                call.resolve(JSObject().put("installed", true))
            } catch (e: Exception) {
                call.reject(e.message ?: "Tải gói dữ liệu thất bại.")
            }
        }
    }

    @PluginMethod
    fun removePack(call: PluginCall) {
        val id = call.getString("id", "") ?: ""
        val kind = call.getString("kind", "") ?: ""
        ioExecutor.execute {
            ChanhPhapVault.getInstance(context).removePack(id, kind)
            call.resolve()
        }
    }

    @PluginMethod
    fun startQueue(call: PluginCall) {
        val bookKey = call.getString("bookKey", "") ?: ""
        val bookTitle = call.getString("bookTitle", "Thư viện Chánh Pháp") ?: "Thư viện Chánh Pháp"
        val remoteBaseUrl = call.getString("remoteBaseUrl", "https://thuvienchanhphap.duckdns.org")
            ?: "https://thuvienchanhphap.duckdns.org"
        val voice = call.getString("voice", "vieneu-thien-tam-duc") ?: "vieneu-thien-tam-duc"
        val rate = (call.getDouble("rate", 0.95) ?: 0.95).toFloat()
        val startIndex = call.getInt("startIndex", 0) ?: 0
        val startSeconds = call.getDouble("startSeconds", 0.0) ?: 0.0
        val repeatMode = call.getString("repeatMode", "off") ?: "off"
        val repeatTarget = call.getInt("repeatTarget", 0) ?: 0
        val repeatA = call.getInt("repeatA", -1) ?: -1
        val repeatB = call.getInt("repeatB", -1) ?: -1
        val sleepDeadlineMs = (call.getDouble("sleepDeadlineMs", 0.0) ?: 0.0).toLong()

        val segsJson = call.getArray("segments")
        val segments = mutableListOf<QueueSegmentItem>()
        if (segsJson != null) {
            for (i in 0 until segsJson.length()) {
                val obj = segsJson.optJSONObject(i) ?: continue
                segments.add(
                    QueueSegmentItem(
                        index = obj.optInt("index", i),
                        block = obj.optString("block", ""),
                        heading = obj.optString("heading", ""),
                        sourceOffset = obj.optInt("sourceOffset", 0),
                        text = obj.optString("text", "")
                    )
                )
            }
        }

        ChanhPhapAudioController.getInstance(context).startQueue(
            bookKey = bookKey,
            bookTitle = bookTitle,
            remoteBaseUrl = remoteBaseUrl,
            voice = voice,
            rate = rate,
            startIndex = startIndex,
            startSeconds = startSeconds,
            repeatMode = repeatMode,
            repeatTarget = repeatTarget,
            repeatA = repeatA,
            repeatB = repeatB,
            sleepDeadlineMs = sleepDeadlineMs,
            segments = segments
        )
        call.resolve()
    }

    @PluginMethod
    fun pauseQueue(call: PluginCall) {
        ChanhPhapAudioController.getInstance(context).pause()
        call.resolve()
    }

    @PluginMethod
    fun stopQueue(call: PluginCall) {
        ChanhPhapAudioController.getInstance(context).stop()
        call.resolve()
    }

    @PluginMethod
    fun seekQueue(call: PluginCall) {
        val index = call.getInt("index", 0) ?: 0
        val seconds = call.getDouble("seconds", 0.0) ?: 0.0
        val resume = call.getBoolean("resume", true) ?: true
        ChanhPhapAudioController.getInstance(context).seek(index, seconds, resume)
        call.resolve()
    }

    @PluginMethod
    fun updateQueueOptions(call: PluginCall) {
        ChanhPhapAudioController.getInstance(context).updateOptions(
            repeatMode = call.getString("repeatMode"),
            repeatTarget = call.getInt("repeatTarget"),
            repeatA = call.getInt("repeatA"),
            repeatB = call.getInt("repeatB"),
            sleepDeadlineMs = call.getDouble("sleepDeadlineMs")?.toLong(),
            rate = call.getDouble("rate")?.toFloat()
        )
        call.resolve()
    }

    @PluginMethod
    fun getQueueState(call: PluginCall) {
        call.resolve(ChanhPhapAudioController.getInstance(context).currentStateSnapshot())
    }

    @PluginMethod
    fun scheduleDailyPracticeReminder(call: PluginCall) {
        val enabled = call.getBoolean("enabled", false) ?: false
        if (!enabled) {
            DailyReminderReceiver.schedule(context, 5, 30, false)
            call.resolve()
            return
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            getPermissionState("notifications") != PermissionState.GRANTED
        ) {
            requestPermissionForAlias("notifications", call, "notificationsPermCallback")
            return
        }
        applyReminderSchedule(call)
    }

    @PermissionCallback
    private fun notificationsPermCallback(call: PluginCall) {
        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            applyReminderSchedule(call)
        } else {
            call.reject("Hãy cho phép quyền Thông báo trong Cài đặt máy Android.")
        }
    }

    private fun applyReminderSchedule(call: PluginCall) {
        val hour = call.getInt("hour", 5) ?: 5
        val minute = call.getInt("minute", 30) ?: 30
        DailyReminderReceiver.schedule(context, hour, minute, true)
        call.resolve()
    }
}

