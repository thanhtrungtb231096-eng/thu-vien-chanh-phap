# Biên tập và vận hành Thư viện Chánh Pháp

Liên hệ tiếp nhận góp ý: thanhtrungtb231096@gmail.com. Báo cáo của người đọc được xem trước và gửi do người đọc chủ động; ứng dụng không tự gửi email.

## Một bản kinh qua các bước duyệt

1. Kiểm tra tên tác phẩm, người dịch/biên soạn, ấn bản, năm, đơn vị phát hành; ghi vị trí thông tin trong nguồn. Dùng config/edition_metadata.json cho metadata đã đối chiếu.
2. Xác minh điều kiện chia sẻ với chủ thể quyền; trạng thái chưa xác minh không được chuyển thành đã cấp phép bằng suy đoán.
3. Đối chiếu toàn bản chữ với Word/PDF; rà soát chữ mất, font cũ, kệ, bảng, chú thích, Hán văn và tên Pāli. Ghi người rà soát, phạm vi, ngày và checksum. Không dùng kiểm tra ký tự thay thế hiệu đính.
4. Người thứ hai kiểm tra phần đã sửa, các tác phẩm được giới thiệu và văn bản nghe; nghe thuật ngữ, dấu câu, kệ/chú với người có chuyên môn.
5. Xuất phiên bản mới, lưu bản cũ và ánh xạ đoạn khi cần; thử tìm kiếm, vị trí đã lưu, ghi chú và nghe tiếp trước phát hành.

Hàng đợi ưu tiên sinh bằng `python tools/build/build_editorial_queue.py`. CSV trong docs/reports/editorial có nguồn, checksum, cờ và cột người rà soát. Có đối tượng nhúng trong Word không tự chứng minh kinh văn sai. Ưu tiên thêm theo phản hồi và mức sử dụng thực tế khi có dữ liệu được cộng đồng đồng ý cung cấp.

metadata-review.csv rà các tiêu đề quá chung/địa điểm/năm/cơ quan chưa có metadataVerified; ứng viên hiện tại không phải kết luận đã sai. Ghi loại tác phẩm, ấn bản, quyền sử dụng và vị trí trong trang tên sách khi duyệt. Các bản cùng mã cần hồ sơ bản dịch/ấn bản riêng; kiểm tra lượng bản chính và tư liệu dùng chung trước khi công bố độ đầy đủ của tạng.

Nhãn công khai: bản chữ chuyển đổi, OCR tự động, đã đối chiếu nguồn, đã hiệu đính. Chỉ đặt proofread=true sau khi hoàn tất kiểm tra toàn bản và có hồ sơ duyệt. MetadataVerified chỉ xác nhận thông tin đầu sách.

## Dữ liệu và khôi phục

- Máy chủ: hồ sơ đồng bộ, thiết bị, ghi chú/vị trí/thời khóa. Mỗi hồ sơ tối đa 20 thiết bị, 20.000 bản ghi, 10 MB dữ liệu chính. Giữ tối đa 100 phiên bản ghi chú khác để đối chiếu; không thay thế sao lưu lâu dài.
- Trình duyệt: dữ liệu cá nhân, bản thu nhập trong IndexedDB, sách/âm thanh ngoại tuyến trong cache. JSON cá nhân không gồm tệp media, cache hoặc token đồng bộ; xuất bản thu riêng.
- Ghép nối: mã một lần, 10 phút; khi mất thiết bị, thu hồi từ thiết bị còn kết nối. Khi mất mọi thiết bị, dùng JSON cá nhân để tạo hồ sơ mới. Không có khôi phục bằng email hoặc tên thiết bị.
- Ghi chú cùng sửa được hợp nhất theo thời điểm; bản khác được giữ và xuất để người dùng quyết định. Không tự ghép nội dung hai câu thành một câu mới.

Sao lưu nhất quán khi máy chủ đang hoạt động:

```text
python tools/maintenance/operations_backup.py --out E:\thuvien-backups\ten-moi.zip
python tools/maintenance/operations_backup.py --restore E:\thuvien-backups\ten-moi.zip --into E:\thuvien-restore\ten-moi
```

Tên tệp/thư mục phải mới và nằm ngoài thư mục dự án. Lệnh khôi phục diễn tập không ghi lên `local/storage/state`. Thêm `--include-index` nếu cần chụp cả chỉ mục khoảng 1,93 GB; mặc định chỉ lưu dữ liệu máy chủ cá nhân. Kho nguồn cần bản sao riêng và lịch sao lưu do quản trị xác nhận. Bản sao personal.sqlite3 chứa dữ liệu riêng và token hash, chỉ quản trị được truy cập; không đưa vào gói VPS công khai.

Sau diễn tập: kiểm tra checksum, SQLite quick_check, số hồ sơ/thiết bị/bản ghi, ghép/sync trong môi trường riêng, ghi thời gian phục hồi. Phục hồi production là thao tác vận hành riêng, cần cửa sổ bảo trì và xác minh đích trước khi thay tệp.

Gói VPS đặt hai công cụ tại web-thuvien/operations_backup.py và web-thuvien/health_probe.py. Chạy từ tài khoản vận hành có quyền đúng, dùng thư mục sao lưu riêng không phục vụ web. Thư mục diễn tập phải mới và nằm ngoài thư mục cài thư viện; công cụ không tự thay database đang dùng. Hạn chế quyền đọc archive cá nhân và lưu thêm một bản ngoài máy chủ.

## Giám sát và phát hành

Chạy `python tools/maintenance/health_probe.py --base https://ten-mien --out bao-cao.json` từ máy giám sát; không gửi nội dung riêng hoặc yêu cầu TTS. Kết hợp log máy chủ để theo dõi HTTP lỗi, thời gian truy vấn, dung lượng đĩa/cache, hàng đợi TTS và độ sẵn sàng chỉ mục. Lập lịch phù hợp trên VPS; không coi một lần probe là uptime tháng.

Máy chủ trực tiếp lấy địa chỉ kết nối để giới hạn mã/hồ sơ. Chỉ tin X-Forwarded-For cuối cùng khi kết nối đến từ loopback; reverse proxy phải ghi địa chỉ khách thật. Nếu dùng proxy khác, xác minh cấu hình và kiểm tra giới hạn với hai địa chỉ khách trước mở rộng.

Trước phát hành: chạy bộ nghiệm thu UX, mô hình đọc/nghe, thanh hợp nhất, API sync, kiểm tra liên kết gói; so sánh ảnh. Sau phát hành: kiểm tra version, deep link, tìm kiếm, TTS mới/cache, cập nhật đang nghe và ngoại tuyến. Không xóa cache sách người dùng khi thay cache giao diện.

Thiết bị thật và nghiên cứu người dùng là cổng nghiệm thu riêng: NVDA/VoiceOver/TalkBack, iPhone Safari, Android Chrome, 200% zoom, 320 px, nghe 30–60 phút, khóa màn hình, cuộc gọi, Bluetooth, đổi mạng và xung đột hai thiết bị. Ghi kết quả đạt/trượt, gián đoạn và vị trí phục hồi; không thay thế chúng bằng WAV mô phỏng.

Mẫu tác vụ và bảng ký nghiệm thu: [NGHIEM_THU_THIET_BI_VA_CONG_DONG.md](NGHIEM_THU_THIET_BI_VA_CONG_DONG.md). Hợp đồng phần mềm và cổng hồi quy: [HOP_DONG_DOC_NGHE_DIEU_HUONG.md](HOP_DONG_DOC_NGHE_DIEU_HUONG.md).
