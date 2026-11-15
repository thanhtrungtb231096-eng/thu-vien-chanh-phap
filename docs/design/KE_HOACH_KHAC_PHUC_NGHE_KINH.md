# Kế hoạch khắc phục & nâng cấp độ ổn định chức năng nghe

Ngày lập: 07/10/2026. Cập nhật: đã triển khai Đợt 0–4 và hoàn tất nghiệm thu trên máy này ở Đợt 5; máy chủ cục bộ đã nạp bản sửa, gói VPS đã kiểm tra. Kết quả và giới hạn: [báo cáo nâng cấp](../reports/audio-stability/BAO_CAO_NANG_CAP.md).
Phạm vi: giọng đọc trực tuyến (edge-tts), luồng phát, phục hồi lỗi, quan sát vận hành. Không thay đổi nội dung kinh văn, mã đoạn, khóa lưu trữ hay dữ liệu người dùng.

Mục tiêu: chức năng nghe phát liền mạch, tự phục hồi khi dịch vụ giọng nói chập chờn, và **không bao giờ** hiển thị lỗi kỹ thuật thô như `Failed to load because no supported source was found.`

---

## 1. Tóm tắt điều hành

Chức năng nghe dùng dịch vụ `edge-tts` (Microsoft) để tổng hợp MP3, chia văn bản thành các phần nhỏ rồi **stream** cho thẻ `<audio>` qua `/api/audio/<token>` bằng `Transfer-Encoding: chunked`. Cách làm này có ba điểm yếu chồng lên nhau:

1. Dịch vụ thượng nguồn trả lời thất thường (`NoAudioReceived`, độ trễ 0,4–18 giây) — đã tái hiện.
2. Khi tổng hợp lỗi giữa chừng, máy chủ đóng luồng chunked **thiếu chunk kết thúc**, khiến trình duyệt báo lỗi nguồn.
3. Trình phát chỉ có một lớp thử lại ở bước xin URL; sau khi thẻ `<audio>` đã nhận `src` thì không có cơ chế tự phục hồi.

Kế hoạch chia làm 6 đợt: quan sát → sửa HTTP → bền hóa tổng hợp → phục hồi trình phát → UX/thông điệp → kiểm thử soak & phát hành. Kết quả cam kết: tỉ lệ phát thành công không cần can thiệp ≥ 99%, p50 thời gian có tiếng đầu ≤ 2,5 giây, tỉ lệ đứt giữa đoạn ≤ 0,5%.

---

## 2. Hiện trạng và bằng chứng giám sát

### 2.1 Kiến trúc hiện tại

```text
[Thẻ <audio>]
   │  GET /api/audio/<token>?priority=foreground     (chunked, không Content-Length)
   ▼
[server.py: Handler.stream_audio]  ── attach ──►  [NarrationEngine]
   ▲                                                  │
   │  POST /api/tts {stream:true}                     ├─ transport_parts(text, 320)  chia phần
   │  ◄── {"stream":true,"url":"/api/audio/<token>"}  ├─ edge_tts.Communicate(...).stream()
[audio-service.js: AudioService.prepare]              └─ AUDIO_CACHE (MP3 theo digest)
```

Điểm vào liên quan: `app/server.py` (`do_POST` 420–466, `stream_audio` 468–502), `app/narration_engine.py` (`_run` 119–163), `app/web/js/audio-service.js` (23–114), `app/web/js/audiobook.js` (284–404), `app/web/js/dharma-player-store.js`, `app/web/js/persistent-player.js`.

### 2.2 Số đo giám sát (đã thực hiện)

Kịch bản: gọi `POST /api/tts` rồi mở luồng `/api/audio`, đo byte đầu tiên / tổng thời gian / khoảng lặng; song song gọi thẳng `edge_tts` để tách lỗi thượng nguồn.

| Đợt | Độ dài | Kết quả luồng | Byte đầu | Tổng | Khoảng lặng > 0,4s |
| --- | --- | --- | --- | --- | --- |
| A | 143 ký tự | OK | 11,0s | 14,4s | 0,41s · 1,72s |
| B | 266 ký tự | OK | 18,1s | 35,2s | 0,48 · 0,92 · 9,09 · 3,36s |
| C | 512 ký tự | **ĐỨT (0 byte)** | – | 6,2s | – |
| D | 389 ký tự | **ĐỨT (2.640 byte)** | – | 30,0s | – |
| E | 512 ký tự | OK (lần sau) | 0,03s | 14,0s | 4,84 · 4,59 · 2,30s |

Gọi trực tiếp `edge_tts` cùng câu:

```text
short#0: first_audio=4,47s   med#0: first_audio=7,44s
short#1: first_audio=0,47s   med#1: FAIL NoAudioReceived (2,59s)
short#2: first_audio=0,44s   med#2: OK 0,48s
```

Kết luận quan sát: cùng một câu, khi có tiếng sau 0,4s, khi mất 7–18s, khi thất bại hẳn. Lần nghe lại sau khi đoạn đã xong chỉ ~0,03s (bộ nhớ đệm hoạt động). Lần nghe đầu luôn chậm và có khoảng lặng.

### 2.3 Cách tái hiện và tệp chứng cứ

- `tests/progressive_live_probe.py` — kiểm tra phát liên tục văn bản tổng hợp, ghi `tests/artifacts/audio-recovery/latency-after.json`.
- `tests/progressive_resume_check.py` — tua/tiếp tục với gói âm thanh chậm cục bộ.
- `tests/playback_continuity_check.py` — đệm trước, tạm dừng/tiếp tục, thử lại thoáng qua.
- Script giám sát tạm (`listen_probe.py`, `stress_probe.py`, `edge_probe.py`) tái hiện lỗi nêu trên; sẽ được chuẩn hóa thành `tests/narration_soak_probe.py` ở Đợt 0.

---

## 3. Phân tích nguyên nhân gốc

| Mã | Nguyên nhân | Vị trí | Bằng chứng |
| --- | --- | --- | --- |
| RC-1 | Luồng chunked không có chunk kết thúc khi tổng hợp lỗi; trình duyệt coi là nguồn hỏng | `app/server.py:496-498` | Đợt C, D: `IncompleteRead`; lần nghe kế tiếp nhận `502` |
| RC-2 | Dịch vụ thượng nguồn thất thường (`NoAudioReceived`, websocket chậm) nhưng chỉ thử lại 2 lần, không backoff, chỉ khi chưa có byte nào | `narration_engine.py:128-140`, `server.py:234-250` | `med#1: FAIL NoAudioReceived`; đợt B đứt sau 6,3s |
| RC-3 | Sau khi `<audio>` nhận `src`, không có phục hồi tự động; người dùng phải bấm "Thử lại" | `audiobook.js:339` | Ảnh lỗi kèm nút "Thử lại" |
| RC-4 | Thời gian có tiếng đầu cao do kết nối thượng nguồn lạnh (~4,5s) + chia phần 320 ký tự tổng hợp **tuần tự** | `narration_engine.py:11,119-142`; `edge_tts` | `first_audio=4,47s` lần đầu; byte đầu 11–18s |
| RC-5 | Chỉ 2 worker; việc tải trước (background) cạnh tranh với phát (foreground); watchdog 25s hủy job đang chờ | `narration_engine.py:52,86-92,145` | Đợt D đứt ~30s = watchdog 25s + phụ trội |
| RC-6 | Thiếu quan sát: log ra tệp bị block-buffering, không có số liệu tổng hợp để giám sát | `app/launch.py:39-44` | Log không cập nhật dù có request mới |
| RC-7 | Thông điệp lỗi thô của trình duyệt lọt ra giao diện (tiếng Anh) | `audiobook.js:339` và cơ chế hiển thị notice | Ảnh chụp: `Failed to load because no supported source was found.` |

---

## 4. Mục tiêu và chỉ số nghiệm thu

| Chỉ số | Hiện tại | Mục tiêu | Cách đo |
| --- | --- | --- | --- |
| Phát thành công không cần can thiệp | ~50–70% (soak thủ công) | ≥ 99% | Soak 200 đoạn `tests/narration_soak_probe.py` |
| Thời gian có tiếng đầu p50 / p95 | 11–18s | ≤ 2,5s / ≤ 6s | Probe đo TTFB, mạng tốt |
| Tỉ lệ đứt giữa đoạn | Cao | ≤ 0,5% | Đếm sự kiện `stream-truncated` |
| Tự phục hồi lỗi tạm thời | 0% (thủ công) | ≥ 95% | Kiểm thử tiêm lỗi |
| Sai lệch vị trí sau phục hồi | – | < 1,5s | Kiểm thử phục hồi |
| Nghe lại đoạn đã đệm | ~0,03s | < 0,3s | Probe |
| Thông điệp lỗi tiếng Anh hiển thị | Có | 0 ca | Quét chuỗi trên UI lỗi |
| Phản hồi chunked kết thúc sai | Có | 0 ca | `tests/stream_termination_check.py` |

Bảo toàn: nội dung kinh, mã đoạn, khóa `listen:*`, `offline-packs`, ghi chú, đồng bộ, và luồng phát bản thu người đọc.

---

## 5. Thiết kế đích

Ý tưởng chủ đạo: **khởi động nhanh bằng stream, chữa lành bằng blob**. Thẻ `<audio>` vẫn được stream để có tiếng sớm, nhưng mọi lỗi được phát hiện và tự chuyển sang tải trọn gói (blob) rồi phát lại từ đúng vị trí. Máy chủ luôn kết thúc luồng hợp lệ và ưu tiên phát.

### 5.1 Máy chủ — HTTP đúng chuẩn (Đợt 1)

Thay `stream_audio` bằng thuật toán:

```text
attach(job)
chờ tối đa T_first (mặc định 15s) một trong ba: có chunk đầu / job.done / job.error
  ├─ lỗi và chưa có byte  → 502 {code:'upstream', retryable:true}
  ├─ done                 → 200/206 với Content-Length + Accept-Ranges + Range (tua được)
  └─ có dữ liệu           → 200 chunked; khi kết thúc LUÔN ghi '0\r\n\r\n'
                            khi lỗi giữa chừng: vẫn ghi chunk kết thúc rồi đóng
giữ header X-Accel-Buffering: no; Cache-Control: no-store
```

Hệ quả: không còn `IncompleteRead`; lỗi sớm trả JSON rõ ràng để frontend thử lại; đoạn ngắn có `Content-Length` nên thanh thời gian và tua chính xác.

### 5.2 Động cơ tổng hợp — bền hóa (Đợt 2)

- **Retry có backoff** cho `NoAudioReceived` và lỗi websocket: tối đa 3 lần, nghỉ 0,5s → 1,2s → 2,5s; chỉ khởi động lại một clip chưa phát byte nào.
- **Ấm kết nối** lúc khởi động: tổng hợp một câu rất ngắn để loại bỏ độ trễ bắt tay ~4,5s.
- **Pool worker riêng cho foreground** để phát không xếp sau tải trước; tải trước nền bị giới hạn số việc song song.
- **Watchdog thích ứng**: dùng `last_audio` nhưng nới theo `receive_timeout`, và không hủy job đang có listener đang phát foreground.
- **Ưu tiên cache**: ghi cache từng clip và gói đầy đủ ngay khi xong (đã có) để lần nghe lại tức thì.
- Tham số hóa qua `config/audio.txt` hoặc biến môi trường: `workers`, `retries`, `backoff`, `T_first`, `prefetch`.

### 5.3 Tầng truyền tải frontend (Đợt 3)

- `AudioService.prepare` thử lại cả `NoAudioReceived`-tương đương và lỗi mạng; `download` thêm backoff và tôn trọng `AbortSignal`.
- Thêm API `AudioService.recover(text, voice, seconds)` tải trọn gói rồi trả blob + vị trí để trình phát tiếp tục.

### 5.4 Trình phát — tự phục hồi (Đợt 3)

Thay `audio.onerror` một lần bằng quy trình:

```text
onerror / stalled kéo dài:
  lưu offset = position(); persist vị trí
  thử recover(tối đa 2 lần, backoff):
     blob = AudioService.recover(current.text, voice)
     audio.src = URL(blob); audio.currentTime = offset; play()
  nếu vẫn lỗi → failed('Không tải lại được đoạn đang nghe…') + nút Thử lại
```

Bổ sung: prefetch sâu 3 đoạn; ưu tiên dùng blob đã đệm khi bắt đầu đoạn; theo dõi `stalled`/`ended` so với thời lượng ước tính để phát hiện stream bị cắt sớm và kích hoạt phục hồi.

### 5.5 Quan sát (Đợt 0 & xuyên suốt)

- **Log có cấu trúc** JSON mỗi dòng vào `storage/cache/work/narration.log`: `{ts, ev, text_len, voice, attempt, ms_to_first, bytes, error}`.
- Ghi log không đệm (`flush=True`) và chuyển log máy chủ sang line-buffered trong `app/launch.py`.
- **`GET /api/narration/stats`**: số job, tỉ lệ lỗi theo loại, p50/p95 TTFB, số đứt luồng, số phục hồi. Dùng cho `tests/narration_soak_probe.py` và kiểm tra sức khỏe.

### 5.6 UX và thông điệp (Đợt 4)

- Ánh xạ `MediaError.code` (1–4) sang tiếng Việt; không hiển thị chuỗi thô của trình duyệt.
- Trạng thái rõ: "Đang chuẩn bị giọng đọc…" → "Đang tải lại đoạn đang nghe…" → "Đã nghe tiếp".
- Giữ vị trí và đoạn khi mọi lỗi; nút "Thử lại" chỉ hiện sau khi tự phục hồi thất bại.

---

## 6. Kế hoạch triển khai theo đợt

| Đợt | Mục tiêu | Thay đổi chính | Định nghĩa hoàn thành |
| --- | --- | --- | --- |
| 0 — Quan sát | Đo được, tái hiện được | `config/audio.txt`; log JSON + `flush`; `/api/narration/stats`; `tests/narration_soak_probe.py`, `tests/log_tail.py` | Chạy soak cho ra baseline JSON; stats phản ánh đúng |
| 1 — HTTP | Không còn luồng đứt sai | `server.py: stream_audio`, `do_GET /api/audio`; `tests/stream_termination_check.py` | Mọi phản hồi kết thúc hợp lệ; lỗi sớm trả 502 JSON; Range hoạt động |
| 2 — Động cơ | Chịu lỗi thượng nguồn | `narration_engine.py`: retry/backoff, ấm kết nối, pool foreground, watchdog; `tests/narration_engine_check.py` mở rộng | Tiêm `NoAudioReceived`/stall → vẫn hoàn tất hoặc lỗi sạch |
| 3 — Trình phát | Tự phục hồi | `audio-service.js`, `audiobook.js`, `tests/audio_recovery_runtime_check.py` | Đứt giữa đoạn → tự tải lại, sai lệch < 1,5s |
| 4 — UX | Lỗi dễ hiểu | `audiobook.js`, `persistent-player.js`, CSS trạng thái | Không còn chuỗi lỗi tiếng Anh; nhãn trạng thái đúng |
| 5 — Nghiệm thu | Chứng minh & phát hành | Soak, tài liệu, cập nhật `NANG_CAP_THU_VIEN.md`, báo cáo `docs/reports/audio-stability/` | Đạt mọi chỉ số mục 4; ghi rõ giới hạn còn lại |

Ưu tiên: Đợt 0–1 là P0 (sửa lỗi hiển thị ngay), Đợt 2–3 là P1 (giải quyết triệt để), Đợt 4–5 là P2 (hoàn thiện). Có thể phát hành Đợt 0–1 trước.

---

## 7. Kế hoạch kiểm thử

### 7.1 Mở rộng kiểm thử hiện có

- `tests/playback_continuity_check.py`: thêm ca stream bị cắt giữa chừng, assert tự phục hồi và vị trí đúng.
- `tests/progressive_resume_check.py`: thêm provider lỗi sau N byte để kiểm tra chuyển sang blob.
- `tests/progressive_live_probe.py`: ghi thêm TTFB p50/p95 và số lần phục hồi vào artifact.
- `tests/narration_engine_check.py`: tiêm `NoAudioReceived` và stall để kiểm tra retry/termination.

### 7.2 Kiểm thử mới

- `tests/stream_termination_check.py` — client HTTP khẳng định mọi phản hồi `/api/audio` có `Content-Length` hoặc chunk kết thúc `0\r\n\r\n`; đường lỗi sớm trả 502 JSON.
- `tests/audio_recovery_runtime_check.py` — provider cục bộ đóng luồng giữa chừng; trình phát phải tự phát lại, giữ vị trí.
- `tests/narration_soak_probe.py` — 200 đoạn tự tạo, báo cáo tỉ lệ thành công, TTFB, khoảng lặng; ngưỡng cứng theo mục 4.
- `tests/narration_stats_check.py` — `/api/narration/stats` khớp với một lượt tổng hợp đã biết.

### 7.3 Ma trận nghiệm thu

| Kịch bản | Mong đợi |
| --- | --- |
| Tổng hợp bình thường | Có tiếng đầu ≤ 6s (p95); nghe liền mạch |
| `NoAudioReceived` lần đầu | Tự thử lại, phát thành công, không lộ lỗi |
| Thượng nguồn chết hoàn toàn | Lỗi tiếng Việt + nút Thử lại; vị trí giữ nguyên |
| Luồng đứt giữa đoạn | Tự tải lại blob, tiếp tục sai lệch < 1,5s |
| Tua trong đoạn đã phát | Chính xác nhờ `Content-Length`/Range |
| Mất mạng giữa chừng | Phát phần đã lưu ngoại tuyến; phần còn lại chờ mạng |
| Nghe lại đoạn đã đệm | < 0,3s |
| iOS/Safari thật | Ghi nhận hành vi autoplay/chunked; không hứa hẹn ngoài kiểm chứng |

---

## 8. Rủi ro và giảm thiểu

| Rủi ro | Ảnh hưởng | Giảm thiểu |
| --- | --- | --- |
| Microsoft đổi/khóa edge-tts | Mất giọng trực tuyến | Ấm kết nối, backoff; chuẩn bị nhà cung cấp thay thế (Azure Speech, TTS cục bộ) và ưu tiên giọng thiết bị khi có |
| Tăng worker gây bị chặn | Lỗi lan rộng | Giới hạn đồng thời, backoff, hàng đợi ưu tiên |
| Blob chiếm RAM | Treo trên thiết bị yếu | Giới hạn số blob giữ, giải phóng `ObjectURL`, dùng `download` từng đoạn |
| Proxy/CDN đệm luồng | Tăng độ trễ | Header `X-Accel-Buffering: no`, `Cache-Control: no-store`; kiểm tra qua tunnel |
| iOS Safari hạn chế chunked/autoplay | Khác biệt nền tảng | Ưu tiên blob cho iOS, nút phát chủ động, kiểm tra thiết bị thật nếu có |
| Thay đổi làm hỏng đồng bộ/lưu vị trí | Mất dữ liệu người dùng | Không đổi khóa lưu; regression cho `listen:*`, `offline-packs`, `audio-notes` |

---

## 9. Lộ trình và ước lượng

| Đợt | Ước lượng (người) | Phụ thuộc |
| --- | --- | --- |
| 0 | 0,5–1 ngày | – |
| 1 | 0,5–1 ngày | 0 |
| 2 | 1–1,5 ngày | 0 |
| 3 | 1–1,5 ngày | 1, 2 |
| 4 | 0,5 ngày | 3 |
| 5 | 1–1,5 ngày | 1–4 |

Tổng: khoảng 4,5–7 ngày công cho một người. Đây là ước lượng, không phải cam kết. Có thể giao Đợt 0–1 trước để giảm lỗi hiển thị ngay.

---

## 10. Cấu hình, giám sát và hoàn tác

- **Cấu hình** (`config/audio.txt`): `workers`, `retries`, `backoff_ms`, `first_byte_timeout`, `prefetch_depth`, `warmup` (bật/tắt). Mặc định an toàn nếu tệp thiếu.
- **Giám sát**: `storage/cache/work/narration.log` (JSON mỗi dòng) và `GET /api/narration/stats`. Bảng theo dõi thủ công: tỉ lệ lỗi, p95 TTFB, số phục hồi.
- **Hoàn tác**: giữ đường cũ sau cờ (`progressive`); mỗi đợt tách nhỏ, có thể tắt riêng. Không đổi định dạng lưu trữ nên hoàn tác không mất dữ liệu.
- **Tài liệu cập nhật**: `docs/guides/NANG_CAP_THU_VIEN.md` (mục "Giọng đọc và bản thu") và báo cáo `docs/reports/audio-stability/`.

---

## 11. Phụ lục

### 11.1 Hợp đồng endpoint

| Endpoint | Trường hợp | Trả về |
| --- | --- | --- |
| `POST /api/tts` (`stream:true`) | OK | `200 {"stream":true,"url":"/api/audio/<token>","cached":bool,"estimatedDuration":float}` |
| `POST /api/tts` | Bận/thiếu bộ giọng | `429`/`503` JSON có `retryable` |
| `GET /api/audio/<token>` | Chưa xong | `200 chunked`, luôn kết thúc `0\r\n\r\n` |
| `GET /api/audio/<token>` | Đã xong | `200`/`206` với `Content-Length` + `Accept-Ranges` |
| `GET /api/audio/<token>` | Lỗi sớm | `502 {"error":...,"code":"upstream","retryable":true}` |
| `GET /api/narration/stats` | Luôn | Số liệu vận hành (mục 5.5) |

### 11.2 Nguyên tắc bất biến

- Không sửa nội dung kinh, mã đoạn, `sourceOffset`, phân đoạn (`NarrationModel.VERSION`).
- Không đổi khóa lưu trữ `listen:*`, `listen-recording:*`, `offline-packs`, `audio-notes:*`, `dharma-*`.
- Không truyền kinh văn thật ra ngoài ngoài dịch vụ giọng đọc đã thỏa thuận; giữ nguyên chính sách hiện tại.
- Mọi thay đổi phải có kiểm thử tái hiện lỗi trước, rồi mới sửa.

---

## 12. Theo dõi triển khai ngày 07/10/2026

| Đợt | Trạng thái |
| --- | --- |
| 0 | Đã có cấu hình, log JSON không đệm, số liệu vận hành, probe 200 đoạn và công cụ xem log |
| 1 | Đã sửa framing, lỗi sớm, timeout byte đầu, audio hoàn chỉnh và Range; kiểm thử tái hiện lỗi đã đạt sau sửa |
| 2 | Đã có retry/backoff, warmup không dùng cache, worker dành cho foreground, watchdog và dùng lại clip hoàn chỉnh |
| 3 | Đã có tải blob có xác nhận hoàn tất, phục hồi tự động, giữ vị trí và hủy khi tạm dừng/chuyển kinh |
| 4 | Đã có thông báo tiếng Việt, trạng thái tải lại/nghe tiếp, nút Thử lại sau thất bại và cache giao diện mới |
| 5 | Kiểm thử cục bộ/hồi quy đạt; Microsoft 200/200 đoạn hoàn tất; hai đoạn dài trong Chromium đạt; gói VPS đã kiểm tra CRC, SHA-256 và chạy độc lập. Máy chủ cục bộ đã nạp audioVersion 4. Chưa kiểm chứng Safari/iOS thật, loa ở quy mô 200 đoạn hoặc tunnel/proxy/VPS thực tế |

Endpoint bổ sung: `GET /api/audio/<token>?status=1` xác nhận tổng hợp đầy đủ; `POST /api/narration/events` nhận ba sự kiện phục hồi. Việc kiểm tra trạng thái thay cho suy luận chỉ từ thời lượng ước tính giúp không nhận nhầm stream kết thúc HTTP đúng nhưng audio còn thiếu. Chi tiết, bằng chứng kiểm thử và số đo nằm trong báo cáo liên kết đầu tài liệu.
