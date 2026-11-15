# Cải tiến nghe kinh liên tục — 07/10/2026

Đã triển khai và nạp bản sửa trên máy chủ cục bộ tại `http://127.0.0.1:8090/web-thuvien/index.html`. Máy chủ trả `audioVersion: 5`; trình duyệt nhận JS `v=15-buffered`, cache giao diện `cp-shell-v26-buffered-audio` và chế độ đệm bật mặc định. Giọng, định dạng MP3 nguồn, kinh văn, mã đoạn và khóa lưu vị trí nghe giữ nguyên.

## Vì sao có thông báo trong ảnh

Thông báo **“Không tải lại được đoạn đang nghe…”** xuất hiện khi nguồn âm thanh bị lỗi hoặc ngừng tiến triển và việc tải phục hồi không thành công. Thông báo này mô tả kết quả phục hồi; riêng ảnh chụp chưa xác định được lỗi mạng cụ thể.

Đã đối chiếu mã nguồn và số liệu máy chủ trước sửa. Bản chụp số liệu khi sao lưu ghi nhận:

- 67 lượt thử lại do `NoAudioReceived`, 9 sự kiện `job-error` cùng loại.
- 17 sự kiện chờ byte đầu quá hạn; byte đầu có p50 khoảng 7,2 giây và p95 17 giây, trong khi giới hạn cũ là 15 giây.
- 11 lượt bắt đầu phục hồi, 9 lượt thành công và 1 lượt thất bại; tại thời điểm chụp còn một việc tổng hợp hoạt động.

Đây là số sự kiện, không phải tỷ lệ lỗi độc lập: một việc có thể tạo nhiều sự kiện. Bằng chứng gốc nằm trong [bản chụp trước sửa](../../../storage/backups/audio-continuity-20261007-141318/stats-before.json) và log cùng thư mục.

Trong [mã nguồn edge-tts](https://github.com/rany2/edge-tts/blob/master/src/edge_tts/communicate.py), `NoAudioReceived` được phát sinh khi phiên kết nối kết thúc mà không nhận được âm thanh. Log hiện có chưa cho biết nguyên nhân sâu hơn ở phía dịch vụ Microsoft. Các lần thử thực tế cũng ghi nhận phản hồi lúc nhanh, lúc phải thử lại.

Bản cũ phát trực tiếp nguồn còn đang tổng hợp, tải các đoạn kế tiếp tuần tự và chỉ có một worker nhận việc nền. Khi dữ liệu về chậm, bộ đệm cạn ngay trong lúc nghe hoặc khi chuyển đoạn. Việc chất lượng giọng tốt nhưng tiếng đọc ngắt quãng phù hợp với lỗi cấp dữ liệu này.

## Thay đổi

1. **Phát âm thanh hoàn chỉnh:** tải đủ đoạn vào blob và kiểm tra trạng thái tổng hợp thành công trước khi đưa vào trình phát. Âm thanh bị cắt không được dùng như một đoạn đầy đủ.
2. **Đệm theo thời lượng:** hướng tới 45 giây tiếng đọc kế tiếp, tối đa 12 đoạn, với hai việc tải nền đồng thời. Khi bắt đầu lượt nghe mới từ đầu đoạn, chờ bổ sung tối đa 8 giây để chuẩn bị khoảng 12 giây tiếng đọc kế tiếp. Thời lượng dự phòng là ước tính theo số từ và tốc độ đọc.
3. **Giữ tài nguyên cho phát:** tổng ba worker; hai worker được nhận việc nền, ít nhất một worker dành cho yêu cầu cần nghe ngay. Trình phát dùng chung việc tải nếu đoạn đang được chuẩn bị, tránh tải trùng.
4. **Chịu gián đoạn khi chuẩn bị:** tải lỗi có thử lại; việc nền lỗi được trì hoãn thử lại để không chặn các đoạn sau. Phần truyền tải đã tổng hợp thành công tiếp tục được dùng lại. Giới hạn chờ byte đầu tăng từ 15 lên 35 giây; thời gian tải tổng được điều chỉnh theo độ dài đoạn, tối đa 300 giây, và vẫn có giới hạn ngừng tiến triển riêng.
5. **Tạm dừng và vị trí nghe:** giữ cơ chế hủy công việc cũ khi dừng/chuyển kinh/đổi giọng; kết quả về muộn không tự phát. Bộ đệm có cơ chế loại bỏ đoạn cũ và giải phóng ObjectURL của nguồn phát.

Giữ `transport_limit=320`. Đã thử yêu cầu dài khoảng 1.000 ký tự để giảm số kết nối, nhưng lần đo đó cả hai giọng trả `NoAudioReceived` và bài kiểm tra đoạn dài không hoàn tất. Sau khi dùng lại 320 ký tự, bài kiểm tra đoạn dài đạt. Đây là quan sát trong phiên đo, chưa phải kết luận mọi yêu cầu 1.000 ký tự đều thất bại.

Đệm chuyển phần chờ tạo giọng sang trước khi phát và trong lúc nghe đoạn trước. Nó không bảo đảm nghe liên tục nếu dịch vụ gián đoạn kéo dài hơn lượng âm thanh đã chuẩn bị. Khi bắt đầu, người nghe có thể phải chờ lâu hơn để tải đủ đoạn đầu.

## Kết quả đo với dịch vụ thật

Dùng Chromium/Chrome trên máy này, văn bản thử nghiệm tự tạo, cache máy chủ và trình duyệt riêng cho từng lượt. Bản đối chiếu dùng JS trước sửa trong thư mục sao lưu cùng cấu hình cũ. Không truyền kinh văn của thư viện trong các phép đo này.

### Sáu đoạn liên tiếp

| Phiên đo | Bắt đầu phát | Khoảng chuyển đoạn lớn nhất | Kết quả |
| --- | ---: | ---: | --- |
| Bản cũ — Hoài My | 11,851 giây | 18,483 giây | Phát hết; có tải phục hồi |
| Bản mới — Hoài My | 2,724 giây | 0,066 giây | Phát hết sáu đoạn |
| Bản mới — Nam Minh | 24,681 giây | 0,077 giây | Phát hết; bảy lượt thử lại phía tổng hợp được xử lý trước khi cần phát |

Bằng chứng: [bản cũ](../../../tests/artifacts/audio-continuity/baseline-vi-VN-HoaiMyNeural.json), [Hoài My sau sửa](../../../tests/artifacts/audio-continuity/candidate-vi-VN-HoaiMyNeural.json), [Nam Minh sau sửa](../../../tests/artifacts/audio-continuity/candidate-vi-VN-NamMinhNeural.json). Các sự kiện `waiting` ở đầu mỗi nguồn, tại thời điểm 0, vẫn được ghi; không tính chúng là gián đoạn giữa lúc đọc.

Các lượt đo diễn ra kế tiếp nhau nên điều kiện dịch vụ có thể khác nhau. Mẫu sáu đoạn cho thấy bản sửa xử lý được tình huống đã tái hiện, không đủ để suy ra tỷ lệ ổn định cho mọi mạng hoặc thời điểm.

### Đoạn dài

Văn bản khoảng 1.700 ký tự, giữ cùng một đoạn nghe, tổng hợp qua nhiều phần truyền tải 320 ký tự. Hai giọng phát đến hết:

| Giọng | Bắt đầu phát | Tổng thời gian đến khi hết | Mẫu trạng thái chờ sau khi phát |
| --- | ---: | ---: | ---: |
| Hoài My | 6,485 giây | 140,547 giây | 0 |
| Nam Minh | 6,047 giây | 137,094 giây | 0 |

Kiểm tra trạng thái mỗi giây; không có lỗi JavaScript. Phát lại từ cache ghi nhận sự kiện `playing` sau khoảng 0,221 và 0,029 giây. Bằng chứng: [đoạn dài](../../../tests/artifacts/audio-continuity/long-two-voice.json), [số liệu máy chủ](../../../tests/artifacts/audio-continuity/long-two-voice-stats.json).

Các số đo dựa trên sự kiện trình phát và tiến triển thời gian media; phép đo không thu tín hiệu từ loa.

## Kiểm thử chức năng

- Bài tiêm lỗi cục bộ: tám đoạn đúng thứ tự đều phát từ blob đầy đủ; một đoạn bị cắt khi tải nền được tải lại trước khi phát; khoảng chuyển đoạn lớn nhất 0,0383 giây. Hai việc tổng hợp nền và một việc cần nghe có thể chạy đồng thời. Tạm dừng lúc chuẩn bị không bị kết quả về muộn làm tự phát. [Bằng chứng](../../../tests/artifacts/audio-continuity/buffered-runtime.json).
- Bộ kiểm tra yêu cầu âm thanh: 15 bài đạt, gồm timeout, hủy tải, HTTP lỗi, nguồn bị cắt, xác nhận hoàn tất, giữ vị trí phục hồi và thời gian tải cho đoạn dài. Máy tổng hợp: 10 bài đạt; cấu hình/số liệu: 2 bài đạt.
- Kiểm tra HTTP/kết thúc luồng, API máy chủ, phân đoạn không mất chữ, phát dần tùy chọn, tua và phục hồi lỗi runtime đã đạt.
- Bộ hồi quy trình duyệt đạt: nghe liên tục, phục hồi kết nối, trình phát ở các kích thước/giao diện, đồng bộ, tìm kiếm nghe đúng đoạn, phát âm tùy chỉnh, bản thu và âm thanh ngoại tuyến. [Bằng chứng](../../../tests/artifacts/audio-recovery/browser-regressions.json).
- Máy chủ đang chạy đã được xác nhận nhận cấu hình mới và JS mới, không có lỗi trang. [Bằng chứng](../../../tests/artifacts/audio-continuity/local-server-verification.json). Service worker mới tải đủ tài nguyên; giao diện Phật giáo vẫn mở được khi ngoại tuyến.

## Sử dụng và hoàn tác

Mở lại trang thư viện hoặc nhấn **Ctrl+F5**, rồi chọn **Thử lại** hoặc **Nghe tiếp**. Vị trí đã lưu được giữ. Có thể tải trước chương trong **Đọc & nghe ngoại tuyến** để nghe bằng phần âm thanh đã lưu khi kết nối không ổn định.

Cấu hình và giải thích tham số ở [hướng dẫn thư viện](../../guides/NANG_CAP_THU_VIEN.md#cấu-hình-và-giám-sát-nghe-kinh). Đổi cấu hình cần khởi động lại máy chủ. `buffered=false` cho phép quay lại phát trong lúc tải.

Bản sao lưu trước sửa: `storage/backups/audio-continuity-20261007-141318/`. Đã đối chiếu SHA-256 của 12 tệp mã/cấu hình/tài liệu đã sao lưu; log và số liệu trước sửa cũng được lưu. Muốn hoàn tác toàn bộ, khôi phục các tệp tương ứng, tăng phiên bản cache giao diện và khởi động lại máy chủ. Không cần đổi định dạng dữ liệu cá nhân.

Phạm vi đã nạp là máy chủ cục bộ. Chưa triển khai bản này lên VPS/tên miền và chưa kiểm chứng Safari/iPhone/iPad thật. Nếu thư viện được nghe qua địa chỉ chia sẻ khác, máy chủ phục vụ địa chỉ đó cần nhận cùng bản sửa.
