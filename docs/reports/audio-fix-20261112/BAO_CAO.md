# Sửa chức năng nghe kinh — local và VPS

Hoàn tất ngày 12/11/2026. Hai môi trường đang chạy cùng bản **`ux-20261010-89aefaa23777`**.

## Các lỗi đã xử lý

- Nâng bộ giọng đọc từ `edge-tts 7.2.8` lên `7.3.1` để hỗ trợ cơ chế kết nối mới; trước sửa cả hai giọng gặp lỗi mở kết nối. Danh sách thay đổi chính thức: [edge-tts releases](https://github.com/rany2/edge-tts/releases).
- Giữ giọng nam/nữ đã chọn qua khởi tạo và tải lại trang. Đổi giọng khi đang phát, đang tải hoặc sau lỗi khởi động lại đúng đoạn hiện tại; yêu cầu cũ bị hủy và không tự phát lại.
- Lưu danh sách giọng cùng lựa chọn mặc định trên thiết bị để chương đã tải vẫn phát được sau khi tải lại trang khi mất Internet.
- Tải chương theo cách chia đoạn của toàn cuốn, giữ khóa âm thanh đúng khi đoạn văn đi qua ranh giới phần đọc/trang in.
- Từ điển phát âm có thể làm đoạn dài hơn giới hạn. Yêu cầu được chia nhỏ trước khi gửi, vẫn giữ một vị trí nghe trong đoạn kinh gốc.
- Chỉ công bố và lưu cache khi từng phần âm thanh hoàn tất. Phần bị ngắt được thử lại trước khi phát, tránh lặp/mất lời hoặc coi âm thanh dở dang là đã hoàn tất.
- Local có đường dự phòng qua chính VPS của thư viện khi dịch vụ gọi trực tiếp lỗi, vẫn dùng đúng giọng đã chọn. VPS không gọi đường dự phòng để tránh vòng lặp.
- Cập nhật mã có phiên bản, manifest và service worker để trình duyệt nhận cùng một bộ tài nguyên; sách và âm thanh đã tải được giữ qua cập nhật.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| Mô hình đoạn nghe trên toàn bộ bản Việt đã lập chỉ mục | 2,784 bản, 2,363,656 đoạn; không có đoạn rỗng/sai giới hạn |
| Đơn vị: yêu cầu âm thanh, máy tổng hợp, HTTP, cấu hình/thống kê | 42 kiểm thử đạt |
| Trình duyệt: nghe liên tục, phục hồi, thanh nghe, ngoại tuyến, đọc/nghe, lịch sử, điều khiển hợp nhất, mở kinh | 8 bộ đạt |
| Các trường hợp đổi giọng và phát âm mở rộng | 5 trường hợp đạt, không lỗi JavaScript |
| Mô phỏng mất đường gọi trực tiếp, phát qua VPS | Cả 4 lựa chọn giọng giải mã/phát được |
| Âm thanh thật với câu thử tự viết trong bốn luồng bộ sưu tập | Cả hai giọng phát được trên local và VPS, đổi giọng đúng đoạn, tạm dừng/nghe tiếp đúng vị trí |
| Cache và cập nhật service worker | Bản sai checksum bị từ chối; bản mới nhận đúng sau cập nhật, giữ sách/vị trí đã lưu |
| Chỉ mục sau cập nhật | Hai nơi đều có 5.348 bản chữ, 3.395.798 đoạn, sẵn sàng |
| Cơ sở dữ liệu VPS | Kiểm tra trước/sau cập nhật không thay đổi |

Kiểm tra âm thanh thật dùng câu tự viết trong trình duyệt riêng, thay nội dung trả về của bản kinh trong ngữ cảnh thử và kiểm tra nội dung yêu cầu trước TTS. Sách gốc được kiểm tra ngay trên máy, không gửi ra dịch vụ trong phép thử. Việc phát được xác nhận bằng bộ giải mã và đồng hồ âm thanh của Chromium; phép thử không đánh giá bằng tai người.

## Độ trễ của dịch vụ bên ngoài

Các đoạn mới chưa có cache vẫn có thể phải đợi khi dịch vụ Microsoft phản hồi chậm hoặc trả `NoAudioReceived`. Sự cố này vẫn được báo cáo ở [upstream issue #512](https://github.com/rany2/edge-tts/issues/512). Trình phát đã có thử lại có giới hạn, giữ vị trí và đường dự phòng; dịch vụ bên ngoài vẫn có thể gián đoạn.

Trong lượt thử cuối với nội dung mới, thời gian khởi phát/đổi giọng đo được: local **11.8–46.5 giây**, VPS **9.2–16.5 giây**. Đây là số đo của bộ câu thử, không phải cam kết thời gian cho mọi kinh. Đệm đoạn tiếp theo và cache giảm việc chờ lại khi đang nghe; bộ thử tám đoạn đã đệm đo khoảng chuyển đoạn tối đa 0,042 giây.

## Cập nhật và sử dụng

- Local đã khởi động lại bằng `local/open_library.ps1`; tiếp tục mở bằng `MO_THU_VIEN.cmd` ở thư mục gốc.
- VPS đã triển khai bản `audio-20261112-01`; kiểm tra hash, module trong bố cục xuất và dịch vụ sau cập nhật đều đạt. Gói chỉ có mã/tài nguyên, không chứa sách hoặc cơ sở dữ liệu.
- Bản khôi phục nằm ngoài ứng dụng tại `/opt/thuvien-backups/audio-20261112-01`.
- Tải lại trang bằng **Ctrl+F5** một lần để nhận bản mới. Muốn nghe không có Internet, tải chương với giọng mong muốn trước.
- Cấu hình dự phòng local nằm ở `relay_url` trong `config/audio.txt`; để trống để tắt, rồi mở lại thư viện.

Bằng chứng tổng hợp: [verification.json](verification.json), [phiên bản đang chạy](running-status.json), [triển khai VPS](deployment.json).
