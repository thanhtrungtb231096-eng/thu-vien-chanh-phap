# Lối đọc trực tiếp trong các module nghe kinh

10/10/2026 — triển khai tại `app/web/`.

## Giao diện và thao tác

| Vị trí | Lối đọc |
| --- | --- |
| Trang bộ kinh Đại Thừa / Hán Tạng | **Đọc kinh** đặt cạnh **Nghe kinh**, thay nhãn Đọc & đối chiếu trước đây |
| Mục lục từng phẩm / phần | Hai nút **Đọc** và **Nghe**; Đọc mở đúng block của phần đã chọn, Nghe bắt đầu tại phần đó |
| Khóa tụng hằng ngày / danh sách tu học | Mỗi bản kinh có **Đọc / Nghe**; tên kinh mở trang thông tin và các phẩm |
| Hàng đợi | **Đọc kinh** mở văn bản, giữ nguyên các mục và thứ tự hàng đợi |
| Danh sách đang nghe trọn bộ | **Đọc kinh** mở bản được chọn, giữ bản đang phát và vị trí trong bộ |
| Bản thu đã nhập | **Đọc kinh** mở bản văn liên kết; vẫn đọc được khi tệp audio chưa có trên thiết bị |
| Tu học hôm nay — thời khóa nghe | Bổ sung **Đọc kinh** cạnh nút Nghe tiếp |

Nút đọc toàn kinh mở bản Việt nếu có, sau đó mới dùng bản Hán. Nút đọc từng phần mở bản Việt và block tương ứng; trình đọc giữ vị trí đọc độc lập. Khi đang có phiên nghe, mở văn bản giữ giọng đọc, nguồn audio, đoạn, số giây, trạng thái phát/tạm dừng và danh sách nghe.

Các dòng phẩm là `article` chứa hai nút độc lập. Trên điện thoại, hai nút đặt bên dưới tên phần; vùng bấm ít nhất 44×44px. Tên truy cập nêu rõ Đọc phần này / Nghe từ phần này và tên phần. Mở từ bảng hàng đợi trên điện thoại tự đóng bảng để chuyển sang trang đọc.

Danh mục thư viện, nguồn tài liệu, kết quả tìm kiếm, sách ngoại tuyến và lịch sử nghe đã có lối đọc trực tiếp; tiếp tục dùng các thao tác này.

## Triển khai

- `dharma-shell.js`: nhãn và vị trí nút đọc toàn kinh, nút đọc/nghe từng phẩm và từng bản trong khóa tụng.
- `persistent-player.js`: lối đọc từ hàng đợi và bộ kinh đang phát; chữ và nút cập nhật theo danh sách hiện tại, kể cả khi thay nội dung một danh sách cùng tên.
- `library-upgrades.js`: lối đọc bản văn của bản thu và bản kinh trong thời khóa nghe.
- `library-design.css`: bố cục nút đôi trên máy tính/điện thoại, vùng bấm và tiêu điểm bàn phím.
- Các nút đọc dùng `LibraryUI.open()`; không gọi hàm bắt đầu nghe hoặc thay mục trong hàng đợi.

Cache giao diện `cp-shell-v35-reading-actions`; PersistentPlayer `6-reading-actions`, DharmaShell `2-reading-actions`, LibraryUpgrades `4-reading-actions`, CSS thiết kế chung `3-reading-actions`. Manifest ngoại tuyến đồng bộ với các phiên bản này.

## Kiểm tra và ảnh

- `tests/reading_actions_check.py`: mở đúng sách/phẩm bằng chuột và bàn phím; đọc không tự phát hay tạo lịch sử nghe; giữ nguồn audio/vị trí/trạng thái và hàng đợi; khóa tụng, bản thu, thời khóa nghe, bản chỉ có Hán văn; bố cục 320–1440px trong ba màu nền. Kiểm tra thêm Tạp A-Hàm thật (`T02n0099`).
- `tests/audio_regression_suite.py`: gồm kiểm tra lối đọc mới và các luồng nghe liên tục, phục hồi audio, trình phát, module thư viện, đọc/nghe, lịch sử và thanh chung.
- `tests/library_design_check.py`: giao diện thư viện, bìa sách, nút mở chi tiết và đọc, bố cục ở 320–1920px.

Audio kiểm tra là WAV cục bộ; không gọi dịch vụ giọng đọc bên ngoài. Các kiểm tra trình duyệt dùng Chrome trên Windows.

Kết quả: **9 nhóm kiểm tra lối đọc đạt**, **8 bộ hồi quy đọc/nghe đạt**, **5 nhóm kiểm tra thiết kế thư viện đạt**; không có lỗi JavaScript. Cú pháp các file JavaScript thay đổi hợp lệ; 55 tham chiếu CSS/JS tồn tại và khớp manifest ngoại tuyến.

- [Tạp A-Hàm trên máy tính](../../tests/artifacts/reading-actions/tap-a-ham-1440.png)
- [Tạp A-Hàm trên điện thoại](../../tests/artifacts/reading-actions/tap-a-ham-390.png)
- [Màn hình 320px](../../tests/artifacts/reading-actions/tap-a-ham-320.png)
- [Kết quả lối đọc](../../tests/artifacts/reading-actions/results.json)
- [Kết quả hồi quy](../../tests/artifacts/audio-recovery/browser-regressions.json)
