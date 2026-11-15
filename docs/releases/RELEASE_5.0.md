# Tàng Kinh Thanh Tịnh 5.0 — 08/09/2026

Giao diện thư viện được nâng cấp để thao tác tìm/đọc/nghe dễ tiếp cận hơn, chữ rõ và hoa văn Phật giáo thống nhất. Bản này triển khai [kế hoạch thiết kế](UI_REDESIGN_PLAN.md).

## Giao diện và điều hướng

- Màu Bạch Ngọc, Hoàng Y, Dạ Thiền được quản lý tại `css/tokens.css`. Các biến màu cũ còn được sử dụng cũng chuyển về đây; font vẫn tải từ thư mục nội bộ.
- Tăng chữ giao diện và nhãn nhỏ, sử dụng đơn vị `rem` để hỗ trợ phóng to chữ. Chữ kinh văn giữ điều khiển cỡ chữ riêng.
- Thêm sen, pháp luân, góc dây lá bằng SVG dùng chung: bìa kinh, nhận diện, các kho, tủ sách trống, đường phân cách cuối phần đọc và chân trang. Hoa văn không thuộc nội dung kinh hoặc lời đọc.
- Menu “Tu học & công cụ” được đưa ra khỏi vùng cắt/cuộn. Trên điện thoại và tablet hẹp, nút **Menu** mở bảng điều hướng có các phân khu, chuông, nghe theo bộ và chọn màu. Escape đóng và trả focus về nút mở.
- Trang chủ ưu tiên tìm kiếm, đọc tiếp khi có lịch sử, kinh gợi ý rồi các kho. Bộ lọc kho/ngôn ngữ mở theo nhu cầu.
- Ở 390×844, ô tìm kiếm nằm khoảng y=198–250 px; ở 320×740 khoảng y=232–284 px, thay cho vị trí cũ y≈742/896 px.
- Khối giới thiệu nghe theo bộ được thu gọn trong danh mục. Thiết bị hẹp mặc định dùng danh sách nếu chưa có lựa chọn cách hiển thị được lưu.
- Bản khác & PDF mở trong thẻ, tránh bảng nổi vượt khỏi màn hình. Sửa nhãn vấn đáp, từ điển và nút tọa thiền bị tràn khi chữ lớn.

## Đọc và nghe

- Thanh đọc mobile giữ Mục lục, A−/A+, Tùy chọn. Các bản ngôn ngữ, đánh dấu, tập trung và tìm/ghi chú nằm trong Tùy chọn; trên máy tính các điều khiển vẫn hiện trực tiếp.
- Mục lục và bảng công cụ mobile quản lý focus và Escape; mở một bảng đóng bảng còn lại.
- Thông tin ngữ cảnh kinh điển mặc định thu gọn; vẫn có thể mở, và trạng thái lựa chọn được giữ theo tác phẩm trong phiên đọc. Tiêu đề dài có vùng cuộn thay vì cắt bằng dấu ba chấm trên mobile.
- Đối chiếu Việt–Hán xếp dọc trên màn hình hẹp, giữ điều hướng riêng từng bản.
- Bảng nghe kinh có trạng thái thu gọn và mở rộng để chọn giọng/tốc độ/hẹn dừng. Phát/dừng và tiến trình luôn dễ tiếp cận khi bảng nghe mở.
- Trình nghe trọn bộ nằm trong bố cục trình đọc, dành chỗ cho nội dung thay vì phủ lên thanh điều hướng. **Chi tiết** mở thời gian/danh sách. Nút **Nghe kinh** ở thanh trên cho phép mở các thiết lập giọng; đóng bảng đó sẽ hiện lại trình nghe trọn bộ.
- Đóng trình đọc dừng phiên nghe trọn bộ; tác vụ chuyển kinh đang chờ không tự mở lại sau khi đóng.
- Giữ nguyên khóa lưu trữ, dữ liệu kinh gốc, mã đoạn, ghi chú, dấu trang và liên kết đọc tiếp.

## Kiểm tra

- `node --test tests/reader-model.test.cjs tests/sutra-formatter.test.cjs`: kiểm tra bảo toàn nguồn và định dạng đoạn/kệ.
- `tests/edge_cases.py`: chuyển bản nhanh, font Hán, bàn phím, tương phản, phụ lục, escape nội dung, thiếu giọng Việt và đóng lúc tải âm thanh.
- `tests/acceptance.py`: tìm kiếm, yêu thích, mục lục, ghi chú/dấu trang, đọc tiếp, hiệu chỉnh/xuất nhập, đối chiếu, phát âm thanh thực, sao lưu, các phân khu và liên kết đoạn.
- `tests/experience_check.py`: đọc/nghe trực tiếp, phục hồi lỗi dịch vụ, chữ và nội dung trên các kích thước. Cập nhật thao tác mở bộ lọc/công cụ theo giao diện mới trong các bài kiểm tra liên quan.
- `tests/ui_redesign.py`: 5 chiều rộng (320/390/768/1024/1440) × 3 theme cho các màn hình chính; bấm thật cả 6 mục menu; vị trí tìm kiếm; phóng to chữ 200% ở trang chủ/danh mục/công cụ; focus bảng đọc; đổi bản Việt/Hán/đối chiếu; thu gọn/mở rộng hai trình nghe; đóng khi có lịch chuyển kinh chờ.
- Thử riêng trình nghe trọn bộ với âm thanh thật: phát, tạm dừng, tiếp tục và đóng đều đạt. Vùng đọc ở màn hình 390×844 còn khoảng 351 px khi trình nghe trọn bộ thu gọn đang mở với tên đầy đủ của Bát Nhã Tâm Kinh.
- Tương phản chữ kinh văn/nền trang đo được: Bạch Ngọc **11,57:1**, Hoàng Y **11,39:1**, Dạ Thiền **12,33:1**. Đây là kết quả các cặp màu chính, không phải chứng nhận WCAG toàn ứng dụng.

Ảnh và kết quả JSON cục bộ ở `tests/artifacts/ui-redesign/`; các bài kiểm tra cũ lưu vào `tests/artifacts/`. Kiểm tra trình duyệt dùng Chromium trên máy phát triển. Chưa kiểm tra Safari/iOS, Android thật hoặc mọi tổ hợp mở bảng/phóng to chữ trên các nền tảng đó. Bảng đối chiếu dữ liệu rộng trong phụ lục giữ vùng cuộn ngang riêng.

Mở thư viện bằng `MO_THU_VIEN.cmd` trong `web-thuvien/`, hoặc địa chỉ `http://127.0.0.1:8090/web-thuvien/index.html` khi dịch vụ đã chạy. Nhấn **Ctrl+F5** nếu trình duyệt vẫn hiển thị bản cũ.
