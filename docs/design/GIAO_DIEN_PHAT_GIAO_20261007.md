# Giao diện Phật giáo — Tàng Kinh Thanh Tịnh

Ngày thực hiện: 07/10/2026.

## Hướng mỹ thuật

Nền giấy ngà, mực xanh trầm, đường nét vàng đồng. Tiêu đề dùng Noto Serif; giao diện dùng Be Vietnam Pro; Hán văn giữ Noto Serif TC. Font được phục vụ từ máy chủ thư viện.

- Hoa sen đối xứng trong vòng trang trí tám cánh ở phần mở đầu; pháp luân dùng cho nhận diện và kho Hán tạng.
- Góc dây lá trên khung đầu trang và bìa sách; đường viền sen chia nhịp ở thanh bên; dấu sen ở chân trang.
- Hoa văn là SVG, không nhận thao tác chuột, không đọc bằng trình đọc màn hình. Không có chuyển động xoay hoặc nhấp nháy.
- Ba bảng màu: Bạch Ngọc, Hoàng Y, Dạ Thiền. Thiết bị mới dùng Bạch Ngọc; lựa chọn đã lưu được giữ lại.

## Bố cục và chi tiết

Lời chào → phần mở đầu và nút nghe/khám phá → ba tạng kinh → công cụ tu học có thể mở rộng → các khu đọc tiếp và kinh tuyển chọn. Tìm kiếm luôn ở đầu trang. Thẻ ba tạng có số thứ tự, biểu tượng, tên, mô tả, số bản và mũi tên.

Trên điện thoại, bỏ vòng sen lớn để dành diện tích cho lời giới thiệu và nút bấm. Menu và nút chính có vùng bấm tối thiểu 44 px. Thanh nghe và điều hướng có vùng riêng. Logo hỗ trợ Enter và Space để về trang chủ.

CSS mới nằm cuối thứ tự tải: `app/web/css/buddhist-sanctuary.css`. Họa tiết dùng `app/web/js/ornaments.js`, `design/lotus-cloud-border.svg`, `design/lotus-corner.svg`. Nội dung phần mở đầu quản lý tại `dharma-shell.js`; `library-design.js` quản lý bìa sách và các tiêu đề phân khu. Dữ liệu kinh văn và cơ chế xử lý âm thanh không thay đổi trong đợt thiết kế này.

## Sao lưu và khôi phục

Bản trước khi thiết kế: `storage/backups/buddhist-ui-20261007-124501/`.

- `web/`: toàn bộ 81 tệp giao diện trước thay đổi.
- `manifest.json`: đường dẫn, dung lượng và SHA-256 của các tệp giao diện được sao lưu.
- `data/generated/offline-assets.json`: danh sách tài nguyên ngoại tuyến trước thay đổi.
- `baseline/`: ảnh trang chủ cũ trên máy tính và điện thoại.

Khi cần khôi phục, sao chép các tệp từ `web/` trong bản sao lưu về `app/web/` và phục hồi `offline-assets.json` về `data/generated/`. Các tệp thiết kế mới không được mã cũ tham chiếu có thể giữ lại. Đổi tên cache shell trong `sw.js` sang một phiên bản mới và tải lại trang để tránh giao diện cache cũ. Không cần sửa dữ liệu sách, dấu trang hoặc vị trí nghe.

## Kiểm tra

Chạy tại thư mục dự án:

```powershell
python tests\buddhist_ui_check.py
python tests\buddhist_assets_check.py
python tests\library_design_check.py
python tests\canon_tree_check.py
```

Ảnh giao diện và báo cáo trình duyệt mới nằm ở `tests/artifacts/buddhist-ui/`. Bài kiểm tra kiểm tra chín chiều rộng 320–1920 px, ba bảng màu, các kho kinh và màn hình công cụ; vị trí phần mở đầu, vùng bấm, điều hướng bằng bàn phím, menu mobile và lựa chọn giao diện đã lưu.

Các kiểm tra Chromium là bằng chứng trên máy cục bộ; chưa kiểm tra Safari/iPhone thật. Gói VPS trong `dist/` không thuộc đợt thay đổi giao diện này.

Kết quả đã đạt: 9 chiều rộng × 3 bảng màu trên 10 màn hình trong bài kiểm tra mới; 12 phân khu ở 8 chiều rộng × 3 bảng màu trong bài kiểm tra bìa sách; toàn bộ 4.183 bản được bao phủ trong kiểm tra cây kinh. Không ghi nhận tràn ngang hoặc lỗi JavaScript. Đã kiểm tra mở trình đọc, mở bản Hán, lưu sách, điều hướng trở lại, phát âm thanh mô phỏng khi chuyển tạng kinh, menu và nguồn Chùa Phúc Minh.

Tương phản chữ/nền trong ba palette đều từ 4,5:1 trở lên cho chữ chính, chữ phụ, chữ mờ và chữ trên nút chính. Đã kiểm tra SHA-256 của cả 81 tệp sao lưu. Service worker phiên bản `cp-shell-v23-buddhist-sanctuary` tải trước 74 tài nguyên và mở lại giao diện mới khi trình duyệt được chuyển sang ngoại tuyến.
