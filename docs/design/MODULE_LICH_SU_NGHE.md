# Module lịch sử nghe

Ngày triển khai: 08/10/2026.

## Trải nghiệm

- Vào **Lịch sử nghe** từ thanh bên; trên điện thoại chọn **Lịch sử** ở thanh điều hướng dưới. Liên kết trực tiếp: `/web-thuvien/index.html#listening-history`.
- Trang chủ có **Nghe tiếp**, hiển thị ba bản nghe dở gần nhất. Mục này xuất hiện khi đã có tiến độ nghe.
- Trang lịch sử có ba bộ lọc: **Tất cả**, **Đang nghe**, **Đã nghe xong**. Tìm theo tên kinh, phần kinh hoặc người đọc, có hỗ trợ nhập không dấu.
- Mỗi dòng gồm bìa nhỏ, tên kinh, trạng thái, lần nghe gần nhất, đoạn / tổng số đoạn, số giây trong đoạn, phần kinh và giọng đọc. Thanh mảnh thể hiện vị trí trong bản kinh theo đoạn; đây không phải tổng thời lượng đã nghe.
- **Nghe tiếp** trở lại vị trí lưu. Khi đang phát, cùng nút chuyển thành **Tạm dừng**. **Nghe lại** phát từ đầu đối với bản đã hoàn tất. Nút đọc kinh mở văn bản tương ứng.
- Danh sách mới nhất ở trên; tải thêm từng 20 dòng. Có trạng thái trống riêng cho lần đầu, từng bộ lọc và tìm kiếm.
- Màu sắc dùng chung với ba giao diện Giấy / Vàng / Đêm. Trên màn hình nhỏ, thao tác nằm dưới phần nội dung, vùng bấm tối thiểu 44px.

## Tiến độ và dữ liệu

- `cp3:listening-history` chứa một bản ghi cho mỗi tác phẩm và loại bản nghe. Bản thu nhập và giọng đọc tổng hợp có vị trí riêng.
- Ghi nhận khi âm thanh thực sự phát; mở trang đọc, xem bộ kinh, thêm hàng đợi hoặc lỗi trước khi phát không tạo lịch sử mới.
- Lưu mỗi 5 giây khi đang phát, khi đổi đoạn / tạm dừng và khi ẩn / rời trang. Vị trí chứa block nguồn, sourceOffset, phiên bản phân đoạn, chỉ số đoạn và số giây.
- Dấu hoàn tất chỉ xuất hiện khi phát đến cuối bản kinh. Sự kiện `dharma-listening-finished` phát trước khi trình nghe đặt lại vị trí và chuyển sang kinh tiếp theo, gồm ảnh chụp vị trí và đoạn cuối. Không ghi hoàn tất khi chỉ kết thúc một đoạn, nghe thử hoặc lặp A–B.
- Nghe lại chuyển bản đã hoàn tất sang đang nghe. Thời điểm hoàn tất gần nhất vẫn được lưu.
- Khi phân đoạn thay đổi, tiếp tục theo block nguồn và bỏ mốc giây cũ để tránh tua nhầm. Nếu block không còn, bắt đầu từ đầu bản văn hiện tại.
- Bản thu đọc từ kho ngoại tuyến trên thiết bị. Nếu tệp không còn, thông báo để nhập lại trong **Thiết bị & giọng đọc**; giữ lịch sử và loại bản nghe.
- Kế thừa tiến độ `listen:` cũ có chỉ số đoạn hoặc số giây lớn hơn 0 một lần; không suy diễn hoàn tất từ dữ liệu cũ.
- Dữ liệu nằm trong bộ nhớ trình duyệt, được sao lưu / khôi phục và tham gia đồng bộ hiện có khi đã ghép thiết bị. Tệp bản thu vẫn cần có trên thiết bị nghe. Khôi phục lịch sử chọn bản ghi có lần nghe mới hơn khi trùng ID.

## Mã và kiểm tra

- Giao diện / bộ theo dõi: `app/web/js/listening-history.js` và `app/web/css/listening-history.css`.
- Tích hợp điều hướng và khôi phục âm thanh: `dharma-shell.js`, `content-modules.js`, `dharma-player-store.js`, `audiobook.js`, `library-store.js`.
- Cache giao diện: `cp-shell-v31-listening-history`; CSS và JS mới có trong danh sách tài nguyên ngoại tuyến.
- Kiểm tra trình duyệt: `python -X utf8 tests/listening_history_check.py`; kết quả và ảnh giao diện nằm trong `tests/artifacts/listening-history/`.
