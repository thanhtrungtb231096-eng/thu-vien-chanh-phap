# Tủ sách Chùa Phúc Minh

Mở thư viện bằng `MO_THU_VIEN.cmd`, rồi chọn **Chùa Phúc Minh** trong thanh điều hướng hoặc thẻ giới thiệu trên trang Khám phá. Địa chỉ trực tiếp: http://127.0.0.1:8090/web-thuvien/index.html#phucminh.

Module gồm 26 tài liệu, 6.281 trang từ thư mục `chua phuc minh`.

- Tìm tên sách hoặc chủ đề, có thể gõ không dấu; lọc theo chủ đề, sách đã lưu, tài liệu có thể nghe; sắp xếp theo tên hoặc số trang.
- **Đọc sách** mở bản chữ với mục lục theo trang, cỡ chữ, chế độ tập trung, tìm nội dung, dấu trang và ghi chú. Vị trí đọc được lưu tự động. Thi kệ và kinh tụng giữ dòng gốc khi hiển thị.
- **Xem PDF** mở bản gốc ngay trong thư viện, hỗ trợ chuyển trang, nhập số trang, phóng to, tải PDF và nhớ trang đã đọc. Phím mũi tên trái/phải chuyển trang. **Bản PDF** trong trình đọc mở đúng trang để đối chiếu.
- **Nghe** dùng thanh phát chung của thư viện. Có giọng nam/nữ, tốc độ, hẹn giờ, hàng đợi và nghe tiếp. Phần nghe tiếp tục khi chuyển mục; nút **Nghe từ trang này** trong trình xem PDF bắt đầu từ văn bản tương ứng.
- **Lưu sách** đưa tài liệu vào Tủ sách của bạn và các bộ lọc của module. Tìm kiếm chung trên trang Khám phá cũng bao gồm tủ sách mới.

24 tài liệu có bản chữ và hỗ trợ nghe. Hai tập **Câu đối pháp** chủ yếu là trang ảnh, hiện hỗ trợ đọc PDF; chức năng nghe sẽ cần bản chữ đã được nhận dạng và kiểm tra. Bản chữ trích xuất có thể còn lỗi ký tự/khoảng cách; bản PDF gốc luôn được giữ để đối chiếu. Giọng đọc tiếng Việt có thể phát âm từ Pāḷi chưa chuẩn. Giọng trực tuyến cần kết nối Internet; thư viện sẽ thông báo nếu dịch vụ giọng đọc không khả dụng.

Vị trí đọc, dấu trang, sách đã lưu và ghi chú nằm trong bộ nhớ trình duyệt trên từng thiết bị. Dùng chức năng xuất bản sao lưu trong Tủ sách của bạn để giữ lại dữ liệu cá nhân.

## Cập nhật dữ liệu

Các bản chữ và danh mục đã được tạo sẵn. Khi chuyển thư viện local sang máy khác, giữ nguyên cấu trúc thư mục gốc, gồm `app/`, `config/`, `data/` và `local/`. Sách gốc nằm trong `data/sources/chua phuc minh/`. Công cụ xem PDF cần PyMuPDF; nếu thiếu, cài từ thư mục gốc:

```powershell
pip install --target local/runtime/python -r config/requirements-collections.txt
```

Để bổ sung hay đổi tài liệu, cập nhật danh sách `BOOKS` trong `build_phuc_minh.py`, giữ nguyên ID của tài liệu cũ để bảo toàn liên kết và vị trí đọc, rồi chạy:

```powershell
python -X utf8 tools/build/build_phuc_minh.py
```

Script tạo `js/phuc-minh-data.js`, `data/phuc-minh/catalog.json` và các bản chữ trong `data/phuc-minh/text/`. Script phục hồi khoảng cách từ vị trí ký tự, bỏ số trang và nhãn lặp ở lề; không sửa PDF gốc. Module không đọc tên tệp bất kỳ qua API: trình xem chỉ nhận ID trong danh mục và số trang hợp lệ, đồng thời giới hạn kích thước ảnh và số lượt render đồng thời.

Tên tác giả, người giảng, người biên soạn và dịch giả được lưu trong `data/phuc-minh/credits.json`, kèm số trang PDF làm căn cứ. Bìa và thông tin sách hiển thị đúng vai trò; tài liệu không ghi tên rõ ràng không được gán tác giả. Khi sửa thông tin này, chạy `python -X utf8 tools/build/build_phuc_minh.py --credits-only` để cập nhật danh mục mà giữ nguyên bản chữ và vị trí đọc. Tìm kiếm trong module cũng hỗ trợ tên người thực hiện.

## Kiểm tra

```powershell
python -X utf8 app/server.py --port 8095
# Trong một cửa sổ khác, tại thư mục gốc:
python -X utf8 tests/phuc_minh_check.py
python -X utf8 tests/phuc_minh_voice_check.py
```

Kiểm tra giao diện dùng âm thanh mẫu cục bộ để xác minh luồng nghe, không phụ thuộc dịch vụ bên ngoài. Kiểm tra giọng đọc riêng gọi dịch vụ thực tế tại cổng 8090. Ảnh chụp kiểm tra nằm trong `tests/artifacts/phuc-minh-*`.
