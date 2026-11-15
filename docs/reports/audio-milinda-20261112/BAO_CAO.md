# Sửa lỗi nghe Mi Tiên và đổi giọng — local/VPS

Ngày 12/11/2026, local và VPS đã chạy cùng bản **`ux-20261010-0967464ad970`**. Chỉ mục hai nơi sẵn sàng: 5.348 bản chữ, 3.395.798 đoạn tìm kiếm. Giữ hai giọng **Hoài My/Nam Minh**; chưa cài hoặc tự chuyển sang giọng dự phòng khác.

## Trường hợp trong ảnh

Đúng cuốn **Kinh Mi Tiên · Vấn Đáp (Milinda Panha)**, mã `ebooks:ep-c2f5222bc69d`, có 1.154 đoạn nghe. Đoạn 11 dài 397 ký tự, là các mục đánh số 12–30. Log trước sửa ghi nhận kết nối treo, `NoAudioReceived` và lượt tổng hợp bị hủy sau 35 giây. Các tiêu đề ngắn như “Phần II”, “Phần III” cũng gặp lỗi.

Đoạn 11, hai tiêu đề này và thao tác đổi nữ sang nam đã được kiểm tra bằng **nội dung kinh thật** trên trình duyệt ở cả local và VPS, theo sự cho phép gửi các trích đoạn cần thiết qua Microsoft của người dùng. Lượt kiểm tra cuối phát được, giữ đúng đoạn, tạm dừng/nghe tiếp đúng vị trí và giữ giọng nam sau tải lại trang. Không ghi nhận lỗi JavaScript, lỗi trên trình phát hoặc HTTP lỗi trong lượt cuối.

## Các sửa chữa

- Áp dụng thời hạn rõ ràng cho từng lần chờ dữ liệu WebSocket: 8 giây đến âm thanh đầu, sau đó theo thời gian nhận dữ liệu đã cấu hình. Điều này xử lý trường hợp `receive_timeout` của thư viện không thực sự giới hạn lượt đọc WebSocket. Vấn đề tương ứng được mô tả tại [edge-tts PR #515](https://github.com/rany2/edge-tts/pull/515).
- Khi nhà cung cấp vẫn tổng hợp nhưng chưa công bố phần âm thanh hoàn chỉnh sau 35 giây, trả trạng thái đang chờ và tiếp tục **cùng lượt tổng hợp**, thay cho hủy rồi làm lại từ đầu. Tổng thời gian vẫn có giới hạn; bỏ nghe sẽ hủy công việc không còn người sử dụng.
- Giữ thời gian chờ ưu tiên của đoạn đang nghe trong khoảng chuyển giữa các yêu cầu chờ tiếp. Có kiểm thử riêng tái hiện trường hợp trước đây bị hủy sớm ở khoảng này.
- Chia yêu cầu vận chuyển xuống tối đa 160 ký tự, giữ số thứ tự cùng tên mục. Chuẩn hóa dấu ngắt câu và số La Mã trong tiêu đề trước tổng hợp. Văn bản kinh gốc và mốc vị trí đọc không bị sửa.
- Chỉ phát và lưu từng phần sau khi phần đó hoàn tất; phần bị ngắt được thử lại trước khi công bố, tránh lưu âm thanh dở dang hoặc lặp lời do phát lại phần lỗi.
- Đoạn trên 160 ký tự có thể bắt đầu khi đã có đủ âm thanh hoàn chỉnh để đệm, trong khi phần đuôi tiếp tục được tổng hợp. iOS tiếp tục dùng tệp hoàn chỉnh. Nếu lượt tạo phần đầu thất bại, trình phát sử dụng kết quả từ cơ chế tải lại đang chạy, tránh báo lỗi sớm dù lượt tải lại có thể phục hồi.
- Lựa chọn giọng được giữ qua tải danh sách giọng và tải lại trang. Đổi giọng khi đang phát, đang tải hoặc sau lỗi khởi động lại đúng đoạn hiện tại và hủy yêu cầu cũ.
- Local tiếp tục có thể dùng chính VPS làm đường gọi dự phòng với **cùng giọng đã chọn**; VPS không gọi ngược để tránh vòng lặp.

## Bằng chứng kiểm thử

| Phạm vi | Kết quả và ý nghĩa |
| --- | --- |
| Yêu cầu âm thanh, bộ tổng hợp, HTTP, thống kê | **59 kiểm thử đạt**, gồm treo kết nối, chờ tiếp, hủy, thử lại và âm thanh dở dang |
| Các luồng trình duyệt | **8 bộ đạt**: nghe liên tục, phục hồi, thanh nghe, ngoại tuyến, đọc/nghe, lịch sử, điều khiển hợp nhất và thao tác mở kinh |
| Toàn cuốn Mi Tiên | **1.154/1.154 đoạn cho mỗi giọng**, hoàn tất đúng một lần; 70 lần thử lại khi cố ý làm hỏng phần âm thanh. Phép thử này dùng nguồn âm thanh mô phỏng nội bộ, không tổng hợp toàn bộ sách qua Microsoft |
| Toàn bộ bản Việt đã lập chỉ mục | **2.784 bản, 2.363.656 đoạn nghe**, không đoạn rỗng hoặc sai giới hạn/mốc nguồn. Đây là kiểm tra cấu trúc, không phải 2.363.656 lần gọi Microsoft |
| Đúng đoạn lỗi thật trên local/VPS | Hai giọng giải mã và phát được đoạn 11; tiêu đề ở đoạn 9/12 cũng phát được; giữ đoạn khi đổi giọng và giữ vị trí khi nghe tiếp |
| Trích đoạn thật trong bốn bộ sưu tập | Đại thừa, Đại Tạng Hán bản Việt, Chùa Phúc Minh và Ebooks: cả hai giọng phát được trên cả hai nơi, đổi giọng đúng đoạn |
| Bắt đầu trước khi tổng hợp xong | Phép thử giữ phần đuôi chưa hoàn tất vẫn phát được phần đầu sau **0,641 giây**; tạm dừng/nghe tiếp đúng vị trí. Đây là số đo nguồn mô phỏng |
| Lượt tạo phần đầu thất bại | Cố ý làm hỏng cả hai lần gọi đầu; lượt sau hoàn tất và phát cùng đoạn, không hiện lỗi trên trình phát |
| Chuyển đoạn đã đệm | Tám đoạn nguồn mô phỏng phát đúng thứ tự; khoảng chuyển tối đa **0,0293 giây** |
| Cập nhật trình duyệt | Service worker từ chối bản sai checksum, nhận bản mới đúng quy trình và giữ sách tải xuống/vị trí đọc |
| Sau triển khai | 80 hash tài nguyên hợp lệ; hai nơi cùng phiên bản; cơ sở dữ liệu VPS không đổi |

Kiểm tra trích đoạn thật dùng bộ giải mã và đồng hồ của Chromium. Nó xác nhận âm thanh phát được; không thay thế đánh giá độ truyền cảm bằng tai người. Hai giọng hiện có được giữ theo yêu cầu của người dùng.

## Thời gian chờ và giọng đọc

Lượt cuối, đoạn 11 bắt đầu/đổi giọng trong **0,64–1,22 giây khi đã có cache**. Không dùng số đo này làm cam kết cho đoạn mới chưa từng tổng hợp.

Thử trực tiếp đoạn 11 với cache trống đã tạo đủ âm thanh bằng cả hai giọng: Nam Minh 310.608 byte, Hoài My 306.432 byte. Thời gian tạo toàn đoạn lần lượt 60,813 và 66,829 giây; phần hoàn chỉnh đầu tiên xuất hiện sau 22,610 và 28,344 giây. Các lượt này có thử lại khi Microsoft trả `NoAudioReceived`. Cơ chế phát sớm giúp giảm thời gian chờ toàn đoạn, nhưng tốc độ và khả năng hoạt động của dịch vụ Microsoft vẫn ảnh hưởng các đoạn mới.

Mẫu đúng đoạn 11: [Nam Minh](../../../tests/artifacts/audio-milinda-20261112/probe-11-vi-VN-NamMinhNeural.mp3), [Hoài My](../../../tests/artifacts/audio-milinda-20261112/probe-11-vi-VN-HoaiMyNeural.mp3).

## Triển khai và sử dụng

Local đã khởi động lại; mở bằng `MO_THU_VIEN.cmd` như thường lệ. VPS đã triển khai `audio-20261112-04`, kiểm tra checksum, module xuất, dịch vụ và cơ sở dữ liệu đều đạt. Gói cập nhật chỉ chứa mã/tài nguyên. Bản khôi phục ở ngoài ứng dụng, tại `/opt/thuvien-backups/audio-20261112-04`. Năm tệp trích xuất sách trung gian dùng để điều tra đã được xóa; các công cụ đọc trực tiếp nguồn gốc.

**Nhấn Ctrl+F5 một lần** trên trang đang mở để nhận bản sửa. Để nghe ổn định khi mạng hoặc dịch vụ giọng đọc gián đoạn, có thể tải chương trước với giọng muốn nghe.

Chi tiết: [tổng hợp kiểm chứng](verification.json), [phiên bản đang chạy](running-status.json), [triển khai](deployment.json), [kiểm tra local](../../../tests/artifacts/audio-milinda-20261112/local-final-live-browser.json), [kiểm tra VPS](../../../tests/artifacts/audio-milinda-20261112/vps-final-live-browser.json).
