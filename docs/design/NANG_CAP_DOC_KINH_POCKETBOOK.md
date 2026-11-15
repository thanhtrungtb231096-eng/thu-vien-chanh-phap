# Nâng cấp trình đọc kinh theo phong cách PocketBook

Ngày thực hiện: 07/10/2026. Áp dụng cho giao diện cục bộ trong `app/web/`.

**Cập nhật 08/10/2026:** thanh nghe riêng mô tả bên dưới đã được thay bằng [thanh điều khiển đọc/nghe hợp nhất](HOP_NHAT_THANH_DOC_NGHE.md). Thư viện, trang đọc và toàn màn hình dùng cùng một bộ nút; giọng đọc và hẹn giờ dùng một bảng tùy chọn chung.

## Trải nghiệm đọc

- Trang giấy liền mạch, chữ serif dễ đọc, thanh công cụ nhỏ và mục lục thu gọn khi mở sách. Thanh nghe xuất hiện khi có phiên nghe đang chạy hoặc tạm dừng.
- **Lật trang** bố trí văn bản theo chiều cao màn hình bằng cột CSS. Nút Trước/Tiếp, phím mũi tên, PageUp/PageDown và vuốt ngang trên điện thoại chuyển trang. Cuối một phần sẽ chuyển sang phần kế tiếp.
- **Cuộn** giữ cách đọc từng phần; **Cuộn liên tục** nằm trong Kiểu đọc. Bật cuộn tự động sẽ chuyển sang chế độ cuộn liên tục.
- **Kiểu đọc** chứa cỡ chữ, font, giãn dòng, khoảng cách đoạn, chiều rộng, ba màu nền và các bản Việt/Hán/đối chiếu. Đối chiếu dùng cuộn để giữ hai bản dễ so sánh.
- **Tập trung** thu thanh công cụ; nút Thoát tập trung luôn còn ở đầu trang. Toàn màn hình vẫn có nút thoát và công cụ nghe.
- Số trang được tính trong phần hiện tại và thay đổi theo màn hình/cỡ chữ. Vị trí được lưu bằng mã đoạn và vị trí chữ, nên số trang thay đổi vẫn tìm được chỗ đang đọc.

Thiết bị mới mặc định lật trang, chữ 21px, giãn dòng 1,85. Lựa chọn cũ được giữ; người đang dùng chế độ cuộn có thể bấm Lật trang để chuyển.

## Đọc và nghe tiếp

Mở nút **Đọc & nghe** ở đầu trang để hiện thanh nghe gọn dưới kinh văn. Thanh dành chỗ riêng cho văn bản, không phủ lên chữ; thanh phát bên ngoài được ẩn khi thanh này đang mở.

Thanh nghe bố trí một hàng trên máy tính, hai hàng trên điện thoại: thông tin đoạn nghe, nút phát/dừng tròn và nhóm công cụ phụ. Nút phát/dừng, chuyển đoạn, tùy chọn và ẩn thanh dùng biểu tượng với nhãn truy cập và chú giải. Công tắc Theo lời kinh giữ nhãn trên màn hình nhỏ. Thanh nghe cao khoảng 61px / 105px trong kiểm thử; mỗi điều khiển có vùng bấm tối thiểu 44px.

1. **Nghe từ đây** chọn đoạn âm thanh tương ứng với chữ đang hiển thị. Nếu trang đang ở thông tin xuất bản hoặc số trang PDF, tìm kinh văn tiếp theo có thể nghe.
2. **Nghe tiếp** dùng vị trí nghe đã lưu, gồm đoạn và số giây. Khi đang phát, nút trở thành Tạm dừng.
3. **Theo lời kinh** bật hoặc tắt việc trang tự theo đoạn đang nghe. Khi bật lại, trang chuyển ngay đến vị trí nghe hiện tại.
4. **Tùy chọn** mở công cụ bên cạnh trang: giọng đọc, chọn phẩm, tốc độ, hẹn giờ, nghe lại và lặp đoạn. **Đọc từ đoạn nghe** trong công cụ này tạm dừng âm thanh và trở lại đoạn chữ tương ứng; bản Hán sẽ chuyển sang bản Việt.

Vị trí đọc và nghe được lưu riêng. Mở hoặc ẩn thanh nghe giữ chữ đang đọc khi phân trang lại. Đóng trình đọc hoặc mở sách khác giữ phiên nghe hiện tại. Bấm Nghe từ đây trên sách mới chuyển sang sách đó trước khi phát; mở thanh nghe không tự phát âm thanh. Bấm số trang/phần ở cuối trang để chọn phần trong mục lục.

Khi đang nghe, chuyển đoạn hoặc phẩm tiếp tục phát. Khi đã tạm dừng, chọn đoạn hoặc phẩm vẫn giữ tạm dừng. Nút Tiếp chuyển đoạn trong bản kinh trước khi chuyển sang hàng đợi. Bản kinh trong hàng đợi hoặc trọn bộ bắt đầu từ đầu.

## Tệp và dữ liệu

- `app/web/css/pocketbook-reader.css`: giao diện đọc, phân trang và bố cục màn hình nhỏ, tải sau các lớp giao diện hiện có.
- `app/web/js/reader.js`: điều hướng trang, giữ vị trí chữ, giao diện chuyển đọc/nghe.
- `audiobook.js` và `dharma-player-store.js`: nhận thêm vị trí chữ khi tìm đoạn nghe; các lời gọi cũ vẫn hoạt động.
- `index.html`, `sw.js` và `data/generated/offline-assets.json`: cập nhật tài nguyên và cache `cp-shell-v30-minimal-reader-controls`.

Giữ các khóa `cp3:position:*`, `cp3:listen:*`, dấu trang và ghi chú. Vị trí đọc mới bổ sung `textOffset`; vẫn đọc được bản lưu chỉ có `block` và `fraction`. Không sửa kinh văn hoặc danh mục sách.

Bản sao các tệp trình đọc trước thay đổi nằm tại `storage/backups/pocketbook-reader-20261007-224336/`.

## Kiểm tra

```powershell
python tests/pocketbook_reader_check.py
python tests/read_listen_continuity_check.py
python tests/reader_fullscreen_check.py
python tests/playback_continuity_check.py
node --test tests/reader-model.test.cjs tests/narration-model.test.cjs
```

Bài kiểm tra mới bao phủ 320, 390, 768, 1024, 1440px với ba bảng màu; đoạn dài qua nhiều trang; đóng/mở và tải lại trang; đổi cỡ chữ, mục lục, cài đặt và toàn màn hình; chuyển đọc/nghe, số giây tiếp tục, chuyển sách, bản Hán/đối chiếu và cache ngoại tuyến. Ảnh và kết quả tại `tests/artifacts/pocketbook-reader/`.

Kết quả: 10 nhóm kiểm tra trình đọc mới, 6 nhóm toàn màn hình, kiểm tra phát liên tục và hai bộ kiểm tra mô hình đọc/nghe đều đạt. Không ghi nhận lỗi JavaScript trong các bài kiểm tra trình duyệt mới. [Ảnh máy tính](../../tests/artifacts/pocketbook-reader/desktop.png), [ảnh điện thoại](../../tests/artifacts/pocketbook-reader/parchment-390.png), [bảng đọc/nghe](../../tests/artifacts/pocketbook-reader/listen-desktop.png).

Âm thanh trong kiểm tra trình duyệt dùng WAV cục bộ để đo luồng và vị trí; không đo chất lượng hoặc độ trễ dịch vụ giọng nói trực tuyến. Kiểm tra trên Chrome Windows; chưa kiểm tra Safari/iPhone thật. Chưa cập nhật gói VPS hoặc triển khai lên máy chủ ngoài.

Tham khảo hướng trải nghiệm đọc và nghe từ [PocketBook Reader](https://pocketbook.ch/en-ch/app); giao diện được điều chỉnh cho thư viện kinh Việt/Hán hiện có.
