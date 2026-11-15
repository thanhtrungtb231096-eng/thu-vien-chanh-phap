# Hợp đồng giữa trình đọc, thanh nghe và điều hướng

Áp dụng cho đợt nâng cấp UX ngày 10/10/2026. Đọc tài liệu này trước khi thêm màn hình hoặc di chuyển điều khiển dùng chung.

| Thành phần | Trạng thái sở hữu | Giới hạn trách nhiệm |
|---|---|---|
| LibraryRouter | Màn hình, URL, lịch sử, truy vấn/bộ lọc, cuộn, snapshot đọc | Chuyển màn hình dùng pushState; tiến độ và chuẩn hóa URL dùng replaceState; phục hồi không tự tạo thêm lịch sử |
| Reader | Bản/ngôn ngữ đang đọc, doc.version, block/textOffset, mục/trang | Lật trang không tua tiếng; giữ đoạn chuẩn qua đổi font/kích thước; số trang chỉ thuộc bố cục hiện tại |
| DharmaPlayerStore | Tác phẩm đang nghe, hàng đợi, trạng thái mở/chuyển tác phẩm | Có thể nghe tác phẩm khác bản đang đọc; phải hiển thị tên đúng; hủy yêu cầu cũ khi đổi tác phẩm |
| Audiobook | Giọng, tốc độ, đoạn, giây, phát/tạm dừng, lặp/hẹn giờ | Điều khiển nghe không ghi đè vị trí đọc; Follow chỉ chuyển trang khi bật; đổi trang không đổi đoạn nghe |
| PersistentPlayer | Một tập DOM điều khiển nghe, vị trí gắn ở thư viện/trình đọc | Di chuyển các node đang dùng; không tạo audio/play button thứ hai; mở bảng tùy chọn giữ trạng thái phát |
| LibraryCatalog | Mã bản, tên, nguồn, nhãn hiệu đính, bộ chọn sách chung | Metadata xác minh không suy ra proofread; danh sách nhiều sách giữ thứ tự và lựa chọn qua lọc |
| LibraryEditions | Hiệu đính cá nhân và ánh xạ phiên bản | Chỉ áp dụng sửa khi phiên bản nguồn khớp; ánh xạ ba tiêu đề chỉ chạy khi from/to và block hợp lệ, có bản sao trước di chuyển |
| LibraryOffline | Cache bản chữ/nguồn, media, tiến độ chương | Thêm nguồn không xóa audio cũ; hủy tải giữ đoạn hoàn tất; nguồn/giọng/phát âm khác không giả là đã tải |
| LibrarySync | Bản ghi cá nhân, tombstone, thông tin phiên đồng bộ | Không đồng bộ cache/media/token; thu hồi token phải có hiệu lực máy chủ; giữ bản ghi chú khác khi có xung đột |

Luồng mở bản chữ: xác định đúng bản → fetch/parse → kiểm tra ánh xạ phiên bản → áp dụng hiệu đính hợp lệ → phục hồi block/textOffset → layout → cập nhật tên trang. Không lấy số trang làm khóa ghi chú.

Luồng phát: resolve tác phẩm → hủy yêu cầu cũ → chuẩn bị bản chữ và ánh xạ listen → phân đoạn → tải/đệm → phát. Chỉ cập nhật chỉ số chẩn đoán bắt đầu nghe khi media thực sự báo playing. WAV kiểm thử không thay thế phép đo giọng tổng hợp thật.

Back/Forward phải phục hồi màn hình, bộ lọc và truy vấn, giữ phiên nghe. Khi đóng trình đọc do router phục hồi, gọi close với route=false. Snapshot tiến độ đọc không tạo thêm mục Back.

Trong phân trang, chỉ có một điểm focus vào vùng kinh văn. Enter chọn đoạn và mở ghi chú. Link ngoài cột hiện tại không nằm trong vòng Tab. Không để scrollLeft gốc thay thế transform/trạng thái trang. Dialog giữ focus bên trong và trả về nút mở khi đóng.

## Tài nguyên và phiên bản

CSS nguồn giữ thứ tự trong config/stylesheets.json; đầu ra library.bundle.css giữ URL tương đối và một yêu cầu tải ban đầu. Việc gom đầu ra chưa đồng nghĩa đã loại bỏ mọi selector cũ; chỉ xóa sau khi đối chiếu ảnh và các luồng.

build_ux_release.py dùng hash JS/CSS, HTML chuẩn hóa, worker, mã máy chủ và phiên chỉ mục để tạo phiên bản. Manifest có hash HTML/worker/tài nguyên. Catalog đầy đủ, báo cáo, công cụ và font Hán tải khi cần. Công cụ/font Hán dùng URL theo hash của manifest hiện hành.

Worker dựng cache tạm, kiểm tra checksum rồi mới cho cài đặt hoàn tất. Gói sai không thay cache đang dùng. Index, manifest và tài nguyên có phiên bản dùng bộ cache tương thích; công cụ tải muộn kiểm tra hash trước khi thực thi. Bản mới chờ thao tác người dùng; trước reload lưu vị trí/tạm dừng audio. Cache sách và IndexedDB media tách khỏi cache giao diện.

## Cổng kiểm tra khi thay đổi

Chạy mô hình đọc/phân đoạn/formatter khi thay parsing hoặc phân trang; chạy thanh hợp nhất khi đổi DOM nghe; chạy hai trình duyệt/SQLite tạm khi đổi đồng bộ; chạy worker thật khi đổi manifest/cache. tests/run_ux_regression.py xác minh hash trước/sau và gắn bằng chứng với phiên bản. Kiểm thử không được dùng hồ sơ đồng bộ thật của người dùng.
