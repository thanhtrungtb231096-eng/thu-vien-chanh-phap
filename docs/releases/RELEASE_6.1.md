# 6.1 · Lời kinh trọn câu, lượt thoại rõ ràng

Sửa tình trạng một câu bị tách sang hai đoạn nghe, đặc biệt khi bản in có chú thích hoặc chuyển trang xen giữa câu. Trường hợp kiểm chứng là Kinh Thất Phật, câu “Bí-sô thưa: … nhưng không ai biết được.”

## Cách chia lời kinh mới

- Ghép các dòng văn xuôi bị xuống hàng trong bản nguồn, kể cả hai nửa câu nằm hai bên chú thích/trang in.
- Tách lượt hỏi–đáp theo lời dẫn của nhân vật. Giữ lời dẫn và câu trích dẫn cùng nhau, không tách ngay sau dấu hai chấm.
- Ưu tiên hết câu và dấu đóng ngoặc kép. Giới hạn 420 ký tự cũ không còn là điểm cắt cứng; một câu dài có thể giữ nguyên tới giới hạn 1.800 ký tự của máy chủ.
- Nếu văn bản vượt giới hạn dịch vụ, ưu tiên ranh giới câu rồi dấu ngắt mệnh đề; chỉ dùng ranh giới từ khi câu nguồn quá dài và không có dấu câu phù hợp. Không thêm dấu câu hay viết lại lời kinh.
- Khổ kệ được giữ xuống dòng riêng. Nội dung đọc dùng cùng các đoạn với màn hình lời kinh.
- Bỏ khoảng nghỉ 1,2 giây tại mọi ranh giới đoạn nguồn và 2,8 giây tại tiêu đề. Hiện dùng dấu câu do TTS đọc, thêm khoảng nghỉ ngắn cho lượt thoại (180 ms) và tiêu đề (400–650 ms).
- Giữ yêu cầu âm thanh đang tải trước khi chuyển câu, tránh hủy rồi tải lại cùng câu kế tiếp.
- Chữ lời kinh vừa hơn, giãn dòng gọn hơn; tự cuộn đặt đầu lượt lời đang đọc vào vùng nhìn thấy.

## Dữ liệu cá nhân

Mã đoạn nguồn và tệp kinh không bị sửa. Vị trí nghe và ghi chú từ 6.0 được ánh xạ sang câu mới. Vì ranh giới tệp âm thanh thay đổi, mốc cũ được đưa về **đầu câu tương ứng**, không giữ số giây không còn khớp. Ghi chú giữ nguyên nội dung; vị trí cũ được sao lưu trong `audio-notes-v1:<mã kinh>` và `legacyPosition`. Ghi chú tạo mới tiếp tục dùng số giây chính xác trong đoạn mới.

## Kiểm tra

```powershell
node web-thuvien/tests/narration-model.test.cjs
python web-thuvien/tests/narration_check.py
python web-thuvien/tests/test_spotify_player.py
node web-thuvien/tests/reader-model.test.cjs
node web-thuvien/tests/sutra-formatter.test.cjs
```

Các kiểm tra bao gồm câu lỗi trong ảnh, câu dài hơn 420 ký tự, đổi lượt thoại, số thập phân, chữ viết tắt, khổ kệ, bảo toàn từ ngữ và ánh xạ nguồn trên Thất Phật/Trường A-Hàm/Tâm Kinh/Dược Sư. Kiểm thử trình duyệt dùng âm thanh mẫu, xác nhận nội dung gửi tới TTS trùng lời kinh hiển thị, chuyển mốc ghi chú cũ, giữ yêu cầu tải trước đang chờ và hiển thị trên máy tính/điện thoại. Toàn bộ 11 nhóm kiểm thử giao diện/trình phát hiện có tiếp tục đạt.

Ảnh kiểm chứng: `tests/artifacts/narration/that-phat-desktop.png`, `that-phat-mobile.png`. Báo cáo: `tests/artifacts/narration/results.json`.

Nhấn **Ctrl + F5** và mở lại bản kinh để áp dụng. Thuật toán dựa trên dấu câu và cấu trúc văn bản; các lỗi thiếu dấu/chữ trong bản nguồn chưa được tự động biên tập. Chưa phải đồng bộ từng từ và không cam kết loại bỏ độ trễ mạng của dịch vụ giọng đọc.
