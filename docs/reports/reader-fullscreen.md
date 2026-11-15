# Đọc kinh toàn màn hình

Đã bổ sung ngày 05/10/2026 vào trình đọc dùng chung của Đại Tạng Kinh, Chùa Phúc Minh, Đại Thừa và Hán Tạng.

## Cách dùng

1. Mở bản chữ của một sách hoặc bài kinh.
2. Bấm **Toàn màn hình** ở góc phải thanh trên cùng. Trên màn hình nhỏ, nút hiển thị bằng biểu tượng bốn góc.
3. Bấm **Thu nhỏ**, nhấn **Esc**, hoặc dùng **Alt + Enter** để trở lại chế độ đọc bình thường. **Alt + Enter** cũng dùng để bật chế độ.

Chế độ dùng toàn bộ chiều cao màn hình và ẩn thanh phát cố định phía dưới. Việc nghe vẫn tiếp tục; nút **Nghe kinh/Nghe sách** trong trình đọc mở các công cụ nghe. Mục lục, chỉnh chữ, chuyển phần, đánh dấu và ghi chú vẫn dùng được. Vị trí đọc được giữ khi thay đổi chế độ.

Khi trình duyệt hỗ trợ, chế độ cũng ẩn thanh địa chỉ bằng chức năng toàn màn hình của trình duyệt. Khi chức năng này không có hoặc bị từ chối, trang vẫn mở không gian đọc tràn khung; thanh địa chỉ có thể còn hiện.

Trở về thư viện sẽ tự thoát phiên toàn màn hình do trình đọc mở. Trạng thái này không lưu thành tùy chọn tự bật khi tải lại trang.

## Kiểm tra

Chạy với máy chủ thư viện đang mở trên cổng 8090:

```powershell
python -X utf8 web-thuvien\tests\reader_fullscreen_check.py
```

Đã kiểm tra Fullscreen API thực tế trên Chrome; nút vào/thoát, Esc, phím tắt, thoát bằng trình duyệt; giữ đoạn và vị trí cuộn; chỉnh chữ và hộp thoại hiệu đính; đóng sách khi yêu cầu đang chờ; API tiền tố trả về không phải Promise; không thoát phiên toàn màn hình mở từ nơi khác.

Các trường hợp trình duyệt từ chối/không hỗ trợ được mô phỏng, gồm cả bốn bộ sách. Kiểm tra tiếp tục nghe và bố cục ở 320, 390, 768 và 1.024 px. Kiểm tra lại Đại Tạng Kinh và Chùa Phúc Minh để xác nhận các luồng đọc/nghe hiện có.

[Kết quả kiểm tra](../web-thuvien/tests/artifacts/reader-fullscreen/results.json).
