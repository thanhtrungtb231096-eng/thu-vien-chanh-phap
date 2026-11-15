package org.chanhphap.engine

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import java.util.Calendar

class DailyReminderReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent?) {
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "chanh_phap_daily_practice"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Nhắc Thời Khóa Hằng Ngày",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Nhắc giờ đọc và lắng nghe kinh điển hằng ngày"
            }
            nm.createNotificationChannel(channel)
        }

        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        val contentPending = launchIntent?.let { PendingIntent.getActivity(context, 108, it, flags) }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Thời Khóa Chánh Pháp Hằng Ngày")
            .setContentText("Đã đến giờ tĩnh tâm đọc & lắng nghe lời Phật dạy. An trú trong chánh niệm.")
            .setAutoCancel(true)
            .setContentIntent(contentPending)
            .build()

        nm.notify(2570, notification)
    }

    companion object {
        fun schedule(context: Context, hour: Int, minute: Int, enabled: Boolean) {
            val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, DailyReminderReceiver::class.java)
            val pending = PendingIntent.getBroadcast(
                context,
                2570,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            am.cancel(pending)
            if (!enabled) return

            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour.coerceIn(0, 23))
                set(Calendar.MINUTE, minute.coerceIn(0, 59))
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                if (timeInMillis <= System.currentTimeMillis()) {
                    add(Calendar.DAY_OF_YEAR, 1)
                }
            }
            am.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                cal.timeInMillis,
                AlarmManager.INTERVAL_DAY,
                pending
            )
        }
    }
}

