# Nghiệm thu lộ trình tu học chuyên sâu — 11/10/2026

Đã triển khai **7 hướng học, 41 bài, 26 hồ sơ giải nghĩa kinh và 30 nguồn** tại `app/web`. Phiên bản phần mềm: **`ux-20261010-eaecaf6ec62b`**.

Mở `MO_THU_VIEN.cmd` → **Lộ trình tu học** hoặc truy cập `http://127.0.0.1:8090/web-thuvien/index.html#paths`. Máy chủ cục bộ đã được khởi động lại đúng phiên bản, chỉ mục sẵn sàng và tệp mở thư viện hoạt động.

## Nội dung và giao diện

- Mở rộng Nikāya, Đại thừa, Tịnh độ và khảo cứu; thêm hướng **Đạo đức & đời sống cư sĩ**, **Đọc, tụng & ghi nhớ có hiểu**.
- Mỗi kinh có xuất xứ, tầm quan trọng, bản đồ nội dung, nghĩa pháp học cốt lõi, giải nghĩa trọng yếu, thuật ngữ, cách hiểu dễ nhầm, ứng dụng và bản nguồn.
- Mỗi bài có lý do quan trọng, mục tiêu riêng, nguồn đọc, thực hành, bốn bước buổi học, câu tự kiểm tra có giải thích, nhật ký và tiến độ.
- Trang tổng quan có tiếp tục học, lối tìm nhanh, tìm không dấu, lọc hướng học, bài/kinh đã lưu và phân trang kết quả.
- Trang hồ sơ kinh có đường dẫn riêng, mục lục nhanh, liên kết bài học, mở bản đọc thật rồi trở lại. Ví dụ: `#paths/kinh/heart`.
- Giao diện giấy ngà, xanh trầm, vàng đồng; hero thu gọn khi học, thanh tùy chọn bám khi cuộn, ba cỡ chữ và chế độ đọc tập trung.

## Bằng chứng kiểm tra

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Hồi quy toàn thư viện | **18/18 lượt đạt**, 57 file JavaScript hợp lệ, 29 nhóm kiểm tra theo 9 đợt UX | [regression.json](../../tests/artifacts/ux-upgrade-20261010/regression.json) |
| Lộ trình mở rộng | **6 nhóm đạt**: dữ liệu, giữ ghi chép/tiến độ cũ, đọc tập trung, tìm/lưu/tiếp tục, 26 hồ sơ, điều hướng, lỗi lưu và bàn phím | [results.json](../../tests/artifacts/learning-depth-20261011/results.json) |
| Module và lộ trình hiện có | **8 nhóm đạt**, toàn bộ 41 bài mở được, bản đọc và thời khóa thực hoạt động | [module-study results.json](../../tests/artifacts/module-study-20261011/results.json) |
| Ngoại tuyến thực | **3 nhóm đạt** sau khi cài service worker và ngắt mạng: tải lại bài mới, nhật ký/cỡ chữ/bài đã lưu, hồ sơ trực tiếp, tìm theo mã và hướng học mới | [offline.json](../../tests/artifacts/learning-depth-20261011/offline.json) |
| Bố cục | **435 lượt đạt**: 45 bố cục trang học mới, 45 bố cục module/kinh, 345 header/hero; 320/390/768/1440/1920px, ba màu nền | Hai file kết quả giao diện phía trên |
| Phiên bản và ngoại tuyến | 79 asset có hash; 73 asset shell, gồm hai script nội dung mới | `data/generated/library-version.json`, `offline-assets.json` |

Không có lỗi JavaScript trong hai bộ kiểm tra giao diện lộ trình. Bộ mới còn kiểm tra cỡ chữ lớn nhất tại cả 45 bố cục; mục lục nhanh đưa tiêu điểm đến phần không bị thanh cố định che.

Ảnh chụp sạch từ trình duyệt độc lập:

- [Tổng quan trên máy tính](../../tests/artifacts/learning-depth-20261011/overview-1440-viewport.png), [toàn trang](../../tests/artifacts/learning-depth-20261011/overview-1440.png).
- [Bài học trên máy tính](../../tests/artifacts/learning-depth-20261011/lesson-1440-viewport.png), [toàn trang](../../tests/artifacts/learning-depth-20261011/lesson-1440.png).
- [Hồ sơ kinh trên điện thoại](../../tests/artifacts/learning-depth-20261011/scripture-390-viewport.png), [toàn trang](../../tests/artifacts/learning-depth-20261011/scripture-390.png).

## Dữ liệu và phạm vi

ID của 23 bài cũ được giữ; kiểm tra đã nạp nhật ký và bài hoàn thành theo ID cũ vào chương trình mới. Đổi cỡ chữ và đọc tập trung không xóa bản nháp. Tiến độ, nhật ký, bài đã lưu và tùy chọn dùng kho `cp3:` cùng sao lưu/đồng bộ hiện có. Bộ nhớ từ chối ghi có thông báo và không báo đã lưu giả.

Hồ sơ là hướng dẫn đọc hiểu có nguồn, không thay toàn văn. Học nghĩa sâu và pháp thực hành tiếp tục theo nguồn giảng/truyền thống phù hợp. Chưa có ghi nhận thẩm định độc lập bởi người hiệu đính Phật học. Kiểm tra phần mềm xác nhận chức năng, liên kết dữ liệu và bố cục.

Các nguồn, cấu trúc chương trình và phương pháp biên soạn xem tại [tài liệu thiết kế & nghiên cứu](../design/LO_TRINH_TU_HOC_CHUYEN_SAU_20261011.md). Bản sao trước thay đổi nằm ở `storage/backups/learning-depth-20261011/manifest.json`.
