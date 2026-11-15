# Kết quả sắp xếp thư mục

Đã tách mã ứng dụng, cấu hình, nguồn sách, dữ liệu chuyển đổi, công cụ, tài liệu, kiểm thử, môi trường chạy và gói xuất. Cây thư mục cùng quy tắc sử dụng: [CAU_TRUC_THU_MUC.md](../../guides/CAU_TRUC_THU_MUC.md).

- Chuyển 64 vị trí, giữ đủ 12.422 tệp ban đầu; đối chiếu SHA-256 thành công với 7.265 tệp sách, dữ liệu chuyển đổi, cơ sở dữ liệu và gói nén.
- Giữ nguyên URL sách, mã tài liệu và 5.348 bản chữ / 3.395.798 đoạn tìm kiếm. Không cần dựng lại chỉ mục.
- Kiểm tra HTTP và Chromium đạt: bốn bộ sưu tập, đọc sách, tìm kiếm, tải Word/PDF, xem trang PDF, chặn đường dẫn riêng tư và traversal.
- Kiểm tra bản xuất tương thích VPS đạt; gói nén đã có cũng được kiểm tra lại từ vị trí mới.
- Thư viện cục bộ được khởi động lại trên cổng 8090. Mở bằng MO_THU_VIEN.cmd tại thư mục gốc; lệnh mở cũng hoạt động từ thư mục làm việc khác.
- Đã dọn ba cây thử tạm. Chỉ giữ bản sao mã (khoảng 232 KiB), ảnh gốc dự phòng, bản chụp dữ liệu cá nhân, danh sách tệp và nhật ký trong storage/backups/restructure/.

Dữ liệu và checksum chi tiết: integrity.json, verification.json, release-verification.json và rollback-verification.json trong thư mục báo cáo này.

## Khôi phục cấu trúc trước thay đổi

Bản khôi phục đã được thử trên 12.422 đường dẫn giả lập. Trước khi khôi phục, đóng máy chủ cục bộ; chạy từ thư mục gốc:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File storage/backups/restructure/RESTORE_LAYOUT.ps1
```

Sau đó mở bằng web-thuvien/MO_THU_VIEN.cmd. Script chuyển lại các vị trí theo nhật ký và khôi phục mã trước thay đổi. Không dùng bản chụp personal-before.sqlite3 để ghi đè dữ liệu người dùng mới phát sinh.
