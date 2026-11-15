# Công cụ VPS

Thư mục này chứa bản gốc của công cụ triển khai. Mã ứng dụng, giao diện và sách dùng chung tại `app/`, `config/`, `data/` ở thư mục gốc.

Chạy từ thư mục gốc:

```powershell
vps\DONG_GOI_VPS.cmd -AuditOnly
vps\DONG_GOI_VPS.cmd
```

Gói mặc định xuất vào `E:\Kinh điển phật giáo - VPS\`, bên cạnh thư mục dự án; thư mục này chỉ được tạo khi đóng gói. Chỉ giữ gói mới nhất; đóng gói thành công sẽ thay gói trước đó. Công cụ yêu cầu nơi xuất nằm ngoài dự án. Có thể chọn nơi khác:

```powershell
vps\DONG_GOI_VPS.cmd E:\thuvien-vps
vps\TAI_LEN_VPS.cmd -Out E:\thuvien-vps
```

`TAI_LEN_VPS.cmd` tải lên và chạy trình cài đặt. `cap_nhat_vps.sh` là quy trình cập nhật có kiểm tra và khôi phục trên máy chủ hiện có; bản khôi phục trên VPS nằm ở `/opt/thuvien-backups/`, tách khỏi `/opt/thuvien/`.

Sau mỗi lần sửa mã hoặc sách, tạo gói mới trước khi triển khai. Xem [hướng dẫn VPS](../docs/guides/HUONG_DAN_VPS.md).

Với bản sửa chỉ đổi mã nghe/giao diện, `prepare_audio_update.py` tạo gói nhỏ ở vị trí ngoài dự án. `apply_audio_update.py` chạy trên VPS để kiểm tra hash và mã trong thư mục tạm trước khi thay mã hiện hành, xác nhận dịch vụ và tự khôi phục nếu cập nhật lỗi. Gói này không chứa sách hay cơ sở dữ liệu; cấu hình tên miền và cấu hình âm thanh của VPS được giữ. Bản khôi phục nằm ngoài ứng dụng tại `/opt/thuvien-backups/`.

Phụ thuộc giọng đọc sử dụng `vieneu==3.8.4` (`VieNeu-TTS v3 Nano` trên CPU với 2 giọng Thiền Tâm Đức & Thục Đoan) và bộ đệm LRU tự động. VPS tự đọc và lưu đệm trực tiếp, không gọi đường dự phòng, tránh vòng lặp về chính nó.
