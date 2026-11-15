# Khắc phục và nâng cấp chức năng nghe kinh

**Cập nhật tiếp theo ngày 07/10/2026:** đã tái hiện việc nghe ngắt quãng trên bản này và bổ sung phát từ âm thanh hoàn chỉnh, đệm theo thời lượng cùng tải trước song song. Xem [báo cáo cải tiến nghe liên tục](../audio-continuity/BAO_CAO_CAI_TIEN.md) để biết cấu hình và kết quả mới nhất. Những số đo bên dưới thuộc lần nâng cấp trước.

Ngày triển khai: 07/10/2026. Đợt 0–4 đã triển khai; đã hoàn tất nghiệm thu trên máy này ở Đợt 5, gồm 200 đoạn trực tuyến, hai đoạn dài trong Chromium và gói cập nhật VPS. Máy chủ cục bộ đã được khởi động lại với bản sửa. Bằng chứng tổng hợp: [verification.json](verification.json).

## Thay đổi đã tích hợp

- Máy chủ chờ byte đầu trước khi gửi header âm thanh; lỗi sớm trả JSON 502/504 có `code` và `retryable`. Luồng đã bắt đầu luôn gửi chunk kết thúc khi tổng hợp thất bại. Âm thanh hoàn chỉnh có `Content-Length`, `Accept-Ranges`, hỗ trợ khoảng byte và khoảng đuôi; vị trí ngoài tệp trả 416 với `Content-Range`.
- Tổng hợp thử thêm tối đa ba lần với backoff 0,5 / 1,2 / 2,5 giây, chỉ thử lại phần chưa phát byte. Phần hoàn chỉnh được dùng lại khi phần sau thất bại. Một worker nhận việc nền; các worker còn lại dành cho nghe. Watchdog có thời gian chờ thích ứng và không theo dõi việc còn trong hàng đợi.
- Máy chủ làm ấm dịch vụ bằng câu tự tạo ngắn mỗi lần khởi động. Warmup chạy trên worker nền, bỏ qua cache và không ghi câu thử vào cache âm thanh.
- Trình phát tự chuyển từ stream sang blob đầy đủ khi nguồn lỗi, ngừng tiến triển hoặc kết thúc trước khi tổng hợp hoàn tất. Tối đa hai lượt tải phục hồi; giữ đoạn, vị trí và tốc độ. Tạm dừng/chuyển kinh hủy tải và ngăn kết quả cũ phát trở lại. Giữ vị trí cả khi tạm dừng trước byte đầu; dừng nguồn lỗi sau khi hết lượt phục hồi để sự kiện ended đến muộn không nhảy đoạn. Ưu tiên audio ngoại tuyến và blob đã đệm; tải trước ba đoạn, giới hạn tám mục đệm và giải phóng ObjectURL.
- Thông báo lỗi và trạng thái phục hồi dùng tiếng Việt. Nút Thử lại xuất hiện sau khi phục hồi thất bại. iPhone/iPad ưu tiên blob; chưa kiểm chứng trên thiết bị thật.
- Có cấu hình `config/audio.txt`, log JSON được flush, log xoay vòng 8 MiB, `/api/narration/stats` và đếm phục hồi. Launcher chạy Python không đệm. Gói VPS nhận cả cấu hình mới và module đọc cấu hình. Đã tăng phiên bản JS và cache service worker, cập nhật manifest tài nguyên ngoại tuyến.

## Điều chỉnh so với thiết kế đề xuất

Thêm `GET /api/audio/<token>?status=1` và trường `statusCheck` trong descriptor để xác nhận audio đầy đủ. HTTP kết thúc hợp lệ chỉ chứng minh framing; một stream MP3 bị cắt vẫn có thể đọc/giải mã phần đầu. Cả tải blob và sự kiện ended phải kiểm tra trạng thái tổng hợp để tránh lưu audio thiếu hoặc nhảy sang đoạn tiếp theo. Không dùng thời lượng ước tính làm bằng chứng duy nhất vì tốc độ đọc thay đổi và ước tính có thể sai.

Thêm `POST /api/narration/events` với ba sự kiện cho phép: `recovery-start`, `recovery-success`, `recovery-failed`. Không nhận nội dung kinh hay vị trí nghe. Endpoint số liệu và sự kiện giữ kiểm tra host/origin hiện có. Bộ đếm sự kiện là số liệu chẩn đoán do client báo, không phải bằng chứng độc lập về âm thanh đã nghe.

Giữ chia phần truyền tải 320 ký tự và `clip-v1`; không đổi `NarrationModel.VERSION`, mã đoạn, `sourceOffset` hay định dạng dữ liệu cá nhân. Tổng hợp các phần trong cùng một đoạn vẫn tuần tự để giữ giới hạn đồng thời; ưu tiên worker, warmup và tải trước giải quyết phần cạnh tranh tài nguyên. Không bổ sung nhà cung cấp giọng nói thay thế.

## Kiểm thử đã đạt

| Kiểm tra | Kết quả |
| --- | --- |
| `stream_termination_check.py` | Lỗi giữa luồng kết thúc hợp lệ; lỗi sớm 502; deadline 504 được đếm; audio đầy đủ/Range/khoảng đuôi/416 đúng |
| `narration_engine_check.py` | Retry/backoff, cache từng phần, không cache âm thanh thiếu, ưu tiên nghe, watchdog, hủy việc và warmup bỏ qua cache |
| `narration_server_check.py` | Chia sẻ việc tổng hợp, cache không ghi được, lỗi sạch, hàng đợi bận, tắt progressive |
| `narration_stats_check.py` | Số liệu/log khớp một tổng hợp đã biết; không log văn bản; host lạ bị chặn; cấu hình không hợp lệ dùng mặc định |
| `audio-service.test.cjs` | 14 kiểm tra mạng, HTTP, deadline, hủy retry, stream bị cắt, trạng thái tổng hợp, phục hồi giữ giây, thông báo MediaError và cờ progressive |
| `audio_recovery_runtime_check.py` | Chromium thật; stream cục bộ bị cắt, chuyển sang blob, giữ vị trí; lỗi lặp có giới hạn; ended đến muộn không nhảy đoạn; hủy trong lúc tải phục hồi; kinh mới không bị thay bởi kết quả cũ; tạm dừng trước metadata giữ đúng giây đã lưu |
| `progressive_audio_check.py` / `progressive_resume_check.py` | Phát MP3 khi tổng hợp chưa xong; foreground tham gia prefetch; giữ vị trí/tua trong audio đang tải |
| `live_audio_runtime_check.py` / `progressive_live_probe.py` | Hai giọng Microsoft, mỗi giọng đọc hết 1.717 ký tự tự tạo trong Chromium; không ghi nhận chờ giữa luồng hay lỗi JavaScript |
| `audio_regression_suite.py` | Phát liên tục, ba đoạn tải trước, tạm dừng, đổi giọng, lặp A–B, hẹn giờ, ghi chú, hàng đợi; ngoại tuyến, bản thu, đồng bộ; nhiều kích thước và ba giao diện; không có lỗi JavaScript |
| `structure_check.py`, kiểm tra model đọc/nghe | Nguồn và URL ổn định, nội dung không mất, mã đoạn ánh xạ đúng nguồn, tài nguyên riêng bị chặn |
| `tests/package/verify_package.py` | 108 tệp giải nén khớp SHA-256; máy chủ chạy độc lập, audioVersion 4/cấu hình/stats đúng; tìm kiếm bốn bộ sưu tập hoạt động; tệp riêng trả 404; không có SQLite cá nhân trong gói |

Kiểm tra HTTP mới và ba ca AudioService mới đã được chạy trên mã cũ trước khi sửa: tái hiện `IncompleteRead`, phản hồi lỗi sớm sai, thiếu `Accept-Ranges`, chấp nhận blob thiếu và thiếu API phục hồi. Ca Chromium bổ sung cũng đã tái hiện lỗi vị trí trở về 0 khi tạm dừng trước metadata và lỗi ended đến muộn nhảy đoạn sau thất bại. Kiểm tra UI dùng profile trình duyệt mới; dữ liệu đồng bộ dùng SQLite riêng trong thư mục tạm, không thêm dữ liệu kiểm thử vào hồ sơ cá nhân thật.

Lượt xác nhận cuối: 20 kiểm thử Python và 14 kiểm thử AudioService đều đạt; bốn bộ hồi quy trình duyệt và kiểm tra tua/nghe tiếp trên stream đều đạt.

## Số đo nghiệm thu

- Nguồn cục bộ bình thường: 200/200 đoạn hoàn tất, không HTTP kết thúc sai. Đây là fixture truyền tải, không dùng để suy ra độ trễ Microsoft.
- Tiêm lỗi: 200/200 đoạn cuối cùng hoàn tất; 10 đoạn bị ngắt giữa luồng đều tự tải lại, không HTTP kết thúc sai. Tỉ lệ đứt 5% là lỗi chủ động tiêm, nên phép đo này cố ý không đạt ngưỡng đứt luồng 0,5% của môi trường bình thường.
- Sai lệch vị trí sau phục hồi trong Chromium: **0,008 giây**, mục tiêu <1,5 giây; xem `tests/artifacts/audio-recovery/runtime-stability.json`.
- Microsoft, 200 đoạn tự tạo, hai giọng và hai lượt song song: **200/200 hoàn tất**, không đứt giữa luồng, không HTTP kết thúc sai. TTFB p50 **1,796 giây**, p95 **3,766 giây**; lượt nghe lại lâu nhất **0,047 giây**. Đạt các ngưỡng truyền tải đã đo. Trong lượt này không có ca lỗi cần frontend tải lại; không dùng lượt này để khẳng định tỉ lệ phục hồi lỗi thực tế ≥95%. Bằng chứng phục hồi nằm ở kiểm tra tiêm lỗi và Chromium cục bộ. Số liệu đầy đủ: `soak-live-200.json`.
- Chromium, văn bản tự tạo dài 1.717 ký tự: Hoài My bắt đầu phát sau **1,469 giây**, đọc hết trong **136,031 giây**; Nam Minh bắt đầu sau **1,016 giây**, đọc hết trong **132,578 giây**. Không có mẫu chờ giữa luồng hay lỗi JavaScript. Sự kiện playing của phần tử audio khi nghe lại đoạn đã đệm: **0,1981 / 0,038 giây**, đều dưới 0,3 giây. Probe chờ thêm đến khi đồng hồ audio tiến quá 0,1 giây cho ra **0,375 / 0,219 giây**; đây là phép đo khác với thời điểm bắt đầu phát. Số liệu đầy đủ: `tests/artifacts/audio-recovery/latency-after.json`.
- Máy chủ đang dùng ở `127.0.0.1:8090` đã khởi động lại: audioVersion **4**, ba worker, warmup thành công. Câu thử tự tạo nhận byte đầu sau **2,000 giây**, tải đủ **82.224 byte**, trạng thái tổng hợp hoàn tất và không có lỗi dịch vụ; xem [local-server-check.json](local-server-check.json).

TTFB đo byte audio đầu qua HTTP; phép đo Chromium dùng sự kiện phát và đồng hồ audio, không ghi âm loa để xác nhận tiếng. Số liệu của một đợt chạy không bảo đảm mức dịch vụ lâu dài. Chưa kiểm chứng Safari/iOS thật hay luồng qua tunnel/proxy/VPS. Các ngưỡng truyền tải đạt trong phép đo này; việc nghiệm thu thời gian phát có tiếng ở quy mô 200 đoạn và các môi trường ngoài máy cục bộ vẫn cần kiểm chứng riêng.

## Vận hành và hoàn tác

Máy chủ thư viện tại máy này đã nạp Python mới. Nhấn Ctrl+F5 ở trang đang mở để nạp giao diện mới. Khi áp dụng mã hoặc đổi cấu hình ở máy khác, khởi động lại máy chủ rồi tải lại trang. Hướng dẫn cấu hình, số liệu và lệnh kiểm tra nằm trong `docs/guides/NANG_CAP_THU_VIEN.md`, mục Giọng đọc và bản thu.

Có thể đặt `progressive=false` rồi khởi động lại để chuyển sang tải audio đầy đủ. Bản gốc của mã sản phẩm và manifest đã sửa nằm ở `storage/backups/audio-stability-20261007/`. Khi hoàn tác, khôi phục các tệp tương ứng, khởi động lại máy chủ và cập nhật phiên bản cache service worker. Các module/công cụ mới không còn được mã cũ tham chiếu có thể giữ lại. Không cần đổi hoặc xóa dữ liệu người dùng.

[Gói VPS](../../../dist/vps/thuvien.7z) đã cập nhật bản sửa cuối, kiểm tra CRC và đủ 7.356 tệp theo manifest. Gói có [checksum SHA-256](../../../dist/vps/thuvien.7z.sha256) với xuống dòng LF tương thích trình cài đặt Linux; 11 tệp sản phẩm/cấu hình đã đối chiếu khớp mã nguồn hiện tại. [Kiểm tra bản giải nén](../dung-luong/verification.json) đã đạt. Chưa tải gói hoặc triển khai lên máy chủ VPS bên ngoài.
