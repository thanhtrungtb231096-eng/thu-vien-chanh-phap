# Nghiệm thu lộ trình bằng giải nghĩa và câu chuyện — 11/10/2026

**Cập nhật 12/10/2026.** Phiên bản: `ux-20261010-f3aa783cac2a`. Bản cục bộ tại `http://127.0.0.1:8090/web-thuvien/index.html#paths`. Chỉ mục giữ **5.348 bản văn / 3.395.798 đoạn**.

## Nội dung và trải nghiệm đã đổi

- Viết lại **41 bài** thành lời giải nghĩa, câu chuyện, ứng dụng và ý đọng lại; bỏ trắc nghiệm, câu hỏi phản tỉnh và checklist.
- **8 chuyện/thí dụ trong kinh** có nguồn và vị trí. **41 tình huống đời sống** mang nhãn minh họa hư cấu. Lời kể không được trình bày như trích nguyên văn.
- **26 hồ sơ kinh** có giải nghĩa được viết sâu hơn; giữ bản đồ pháp học, thuật ngữ, xuất xứ và liên kết đọc bản thực.
- Bản đồ nội dung của 26 hồ sơ dùng giải thích trực tiếp theo từng đoạn, thay các lời nhắc đọc/ghi. Tiêu đề hồ sơ có thứ bậc h2 → h3 → h4.
- Nội dung tập trung vào nóng giận, mất mát, lòng tin, sửa lỗi, gia đình, công việc, chăm bệnh và bố thí có trách nhiệm. Không hứa sự chuyển hóa tức thì; những tình huống trọng tâm giải thích cả khó khăn có thể trở lại.
- Bài đọc hiện trực tiếp trước nguồn tham khảo. Chuyện trong kinh và minh họa đời sống có cách trình bày và nhãn riêng. Chữ tiêu chuẩn 17px trên máy tính, 16px trên điện thoại, có cỡ lớn và đọc tập trung.
- Danh sách bài thu gọn trên điện thoại và mở khi cần; tiêu đề bài xuất hiện trong màn hình đầu ở trường hợp kiểm tra 390px.
- Mục lục tự bù chiều cao thanh công cụ thực tế; không che phần đầu câu chuyện hoặc lời giải nghĩa khi đổi cỡ chữ và khi có thông báo lưu.
- Ghi chép riêng là phần tùy chọn. Dấu đọc không yêu cầu trả lời hoặc đánh giá; giữ ghi chép cũ và bản nháp.

## Bằng chứng kiểm tra

| Bộ kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Nguồn chuyện và đọc tự do | Đạt: 8/8 chuyện mở đúng hồ sơ, Back trở lại bài; Unicode, ghi chép tùy chọn và bản nháp | `tests/artifacts/learning-narrative-20261011/results.json` |
| Mục lục và tiêu đề truy cập | Đạt 72 lần chuyển mục ở 320/390/768/1440px với hai cỡ chữ; phần đọc ở dưới thanh công cụ và hồ sơ dùng h2/h3/h4 | `tests/artifacts/learning-narrative-20261011/results.json` |
| Ngoại tuyến với service worker thật | Đạt: tải lại không mạng, ghi chép, lưu bài, cỡ chữ, hồ sơ hơi thở và tìm mã | `tests/artifacts/learning-depth-20261011/offline.json` |
| Máy chủ đang sử dụng | Đạt: version và SHA-256 nội dung khớp bản build | `tests/artifacts/learning-narrative-20261011/local-server.json` |
| Hồi quy toàn bộ | Đạt 18/18 lượt cho bản cập nhật 12/10; 57 tệp JavaScript qua syntax và 29 nhóm kiểm tra theo đợt | `tests/artifacts/ux-upgrade-20261010/regression.json` |
| Bố cục module và hồ sơ | Đạt 435 lượt: 45 tổng quan/bài/cây, 345 hero, 45 hồ sơ; năm kích thước 320–1920px và ba màu nền | `tests/artifacts/module-study-20261011/results.json`, `tests/artifacts/learning-depth-20261011/results.json` |

Ảnh giao diện trực tiếp:

- [Bài trên điện thoại](../../tests/artifacts/learning-narrative-20261011/lesson-390.png).
- [Câu chuyện trên điện thoại](../../tests/artifacts/learning-narrative-20261011/story-390.png).
- [Bài trên máy tính](../../tests/artifacts/learning-narrative-20261011/lesson-1440.png).
- [Câu chuyện trên máy tính](../../tests/artifacts/learning-narrative-20261011/story-1440.png).

Các ảnh được lấy từ ứng dụng chạy thật trong Chromium, không phải ảnh mô phỏng thiết kế. Bằng chứng phần mềm không thay thế hiệu đính giáo nghĩa; bản biên soạn chưa có xác nhận hiệu đính Phật học độc lập.

## Nguồn và vận hành

Xem [thiết kế, cách diễn giải và vị trí tám chuyện](../design/LO_TRINH_GIAI_NGHIA_CAU_CHUYEN_20261011.md). Các bản kinh nguồn được giữ nguyên. Nguồn Nikāya đối chiếu trên dhammatalks.org, Access to Insight và bản trong thư viện; Pháp Hoa và Duy Ma Cật đối chiếu toàn văn Việt tại kho nguồn.

Bản sao trước thay đổi: `storage/backups/learning-narrative-20261011/manifest.json`, có hash của các tệp lưu và dữ liệu bài trước khi viết lại. Phiên bản cũ: `ux-20261010-eaecaf6ec62b`.

Máy chủ cổng 8090 được kiểm tra đúng tiến trình của workspace trước khi khởi động lại. Bản mới đã mở ở bài **Vương tử Vô Úy: lời thật, có ích, đúng lúc**. Mở lần sau bằng `MO_THU_VIEN.cmd` → **Lộ trình tu học**. Nội dung nằm ở workspace và máy chủ cục bộ; chưa triển khai VPS.
