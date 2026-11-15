# Chuẩn hóa thư mục local và VPS

Ngày thực hiện: 11/11/2026.

Dung lượng từ **8.67 GiB** xuống **4.63 GiB**, giảm **4.05 GiB** (46.7%).

| Vị trí hiện hành | Nội dung |
| --- | --- |
| `local/` | Trình mở Windows, Cloudflare, runtime và dữ liệu vận hành local |
| `vps/` | Công cụ gốc để đóng gói, tải lên, cài đặt, cập nhật và kiểm tra VPS |
| `app/`, `config/`, `data/` | Một bộ mã nguồn, cấu hình và dữ liệu dùng chung |
| `tools/`, `tests/`, `docs/` | Công cụ biên tập/bảo trì, kiểm thử và tài liệu |

## Đã dọn

- Các bản sao lưu mã và triển khai cũ ngày 10–12/10/2026, gồm `site-before-update.tar.gz`, `local-project.zip`, `local-personal.zip` và gói VPS trong bản sao lưu.
- Các bản sao mã trong cache và hai bản cơ sở dữ liệu khôi phục diễn tập cũ.
- Gói VPS đã xuất trước khi thay đường dẫn, checksum, manifest và các script xuất trùng bản gốc. Đã kiểm tra mọi tệp trong manifest còn bản hiện hành để dựng lại.
- Công cụ xóa thư mục tạm dùng một lần, chứa đường dẫn cũ cố định.

Danh sách và dung lượng: [removed-items.json](removed-items.json). Đối chiếu SHA-256 **7,378 tệp** sách, dữ liệu chuyển đổi, giao diện, cấu hình và hai cơ sở dữ liệu hiện hành: không thay đổi nội dung, gồm **5,598 tệp nguồn sách**. Xem [kết quả toàn vẹn](integrity-verification.json).

## Kiểm tra hoạt động

- Năm kiểm tra trình mở local đạt.
- Thử trực tiếp tìm kiếm/đọc cả bốn bộ sưu tập, tải Word/PDF, xem trang PDF và mở bằng Chromium: đạt. Chỉ mục có 5.348 bản chữ và 3.395.798 đoạn.
- Đường dẫn nội bộ local/VPS và cơ sở dữ liệu bị chặn qua HTTP.
- Rà soát gói xác nhận 7.226 liên kết đầy đủ; đường dẫn Python, Node và PowerShell đã cập nhật.
- Công cụ sao lưu/checkpoint/khôi phục từ chối ghi bản sao trong dự án. Công cụ đóng gói từ chối thư mục xuất nằm trong dự án.

## Sử dụng sau này

Mở thư viện bằng `MO_THU_VIEN.cmd` ở thư mục gốc. Khi cần triển khai, chạy `vps\DONG_GOI_VPS.cmd` để tạo gói mới.

Gói VPS mặc định xuất vào **`E:\Kinh điển phật giáo - VPS`**, bên ngoài dự án. Chỉ tạo thư mục xuất khi đóng gói; lần sắp xếp này không tạo gói mới. Sau khi nén và kiểm tra thành công, công cụ thay gói hiện hành và chỉ giữ gói mới nhất. Bản sao lưu và checkpoint cũng phải chọn đường dẫn ngoài dự án.

Cơ sở dữ liệu, runtime, cache đang dùng và kết quả kiểm thử được giữ tại vị trí đã phân loại. Cấu trúc chi tiết: [CAU_TRUC_THU_MUC.md](../../guides/CAU_TRUC_THU_MUC.md).
