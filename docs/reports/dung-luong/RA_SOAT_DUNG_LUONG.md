# Rà soát dung lượng và gói VPS

Ngày kiểm tra: 2026-11-14. Dung lượng dùng đơn vị MiB/GiB (1024).
Thư mục trước khi đóng gói: **6.07 GiB**, 20,364 tệp. Không tính thư mục gói xuất và báo cáo này.

| Mục | Dung lượng MiB | Số tệp |
| --- | ---: | ---: |
| `local` | 3915.10 | 12,057 |
| `data` | 2185.24 | 7,263 |
| `tests` | 94.14 | 778 |
| `app` | 17.82 | 132 |
| `docs` | 8.09 | 73 |
| `tools` | 0.23 | 36 |
| `vps` | 0.11 | 15 |
| `README.md` | 0.01 | 1 |
| `config` | 0.00 | 6 |
| `debug.log` | 0.00 | 1 |
| `MO_THU_VIEN.cmd` | 0.00 | 1 |
| `.gitignore` | 0.00 | 1 |

## Kết luận

- Chỉ mục tìm kiếm có 5,348 bản chữ, 3,395,798 đoạn. Tệp chỉ mục: 1841.58 MiB; vùng trống chỉ 5.26 MiB. VACUUM không giúp giảm đáng kể.
- Đã đối chiếu SHA-256 các bản chữ với chỉ mục và kiểm tra 7,226 liên kết nguồn/tài nguyên. Gói bao gồm Word gốc của `EbooksProject`, bản chữ chuyển đổi, PDF, font, giao diện và chỉ mục.
- Script đóng gói trước đây bỏ sót `EbooksProject`; liên kết tải Word và lưu ngoại tuyến có thể bị thiếu khi cập nhật VPS.
- Gói mới bỏ runtime Windows, cache, bộ kiểm thử, tệp ZIP cũ và tài liệu phát triển; giữ nguyên tệp nguồn trên máy.
- `personal.sqlite3` chứa ghép nối thiết bị và dữ liệu cá nhân: không xóa và không đưa lên VPS để ghi đè dữ liệu người dùng.
- `local/runtime/python/` dùng để chạy ứng dụng/giọng đọc/xử lý PDF trên Windows; VPS cài phụ thuộc Linux riêng.
- `local/storage/cache/audio/` có thể tạo lại khi nghe (cần Internet). `local/storage/cache/work/` chứa mô hình/trang OCR và log. Các cache này không được đưa vào gói VPS.
- Phát hiện 5 nhóm tệp triển khai có nội dung trùng, tương đương 0.77 MiB. Nhiều đường dẫn còn được danh mục sử dụng; không xóa chỉ vì nội dung trùng. Danh sách trong `audit.json`.
- Gói chưa nén: 3.95 GiB, 7,403 tệp. Dùng LZMA2 mức 5, tạo bản chụp SQLite nhất quán và kiểm tra 7-Zip trước khi xuất.
- Công cụ rà soát và đóng gói giữ nguyên tệp nguồn/cache trên Windows.
