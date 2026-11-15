# Thư viện Chánh Pháp

**Phân loại thư mục:** `local/` chứa công cụ, môi trường và dữ liệu chạy trên máy này; `vps/` chứa công cụ triển khai lên máy chủ. `app/`, `config/`, `data/` là bộ mã nguồn và dữ liệu gốc dùng chung, chỉ lưu một bộ. Xem [sơ đồ thư mục](docs/guides/CAU_TRUC_THU_MUC.md).

**Lộ trình tu học** có **7 hướng, 41 bài và 26 hồ sơ kinh**. Các bài được viết theo mạch giải nghĩa → câu chuyện → ứng dụng, với **8 chuyện/thí dụ có vị trí trong kinh và 41 tình huống đời sống ghi rõ là minh họa hư cấu**. Trắc nghiệm và checklist đã được bỏ; ghi chép riêng mở khi cần. Có tìm không dấu, lưu bài/kinh, cỡ chữ và đọc tập trung. Dữ liệu cá nhân cũ được giữ; bài và hồ sơ đọc được ngoại tuyến sau khi chuẩn bị shell. Xem [thiết kế và nguồn](docs/design/LO_TRINH_GIAI_NGHIA_CAU_CHUYEN_20261011.md).

Nhấp đúp **MO_THU_VIEN.cmd** tại thư mục gốc để mở thư viện trên máy.

Trang chủ và thanh bên có ba cây: **Đại Tạng Kinh Hán tạng, Đại Tạng Kinh Đại thừa, Đại Tạng Kinh Nam tông**. Mở nhóm → bộ → tác phẩm → bản đọc; các cây có liên kết để đối chiếu bản nguồn và sách giảng. Xem [cấu trúc ba tạng kinh và mạng lưới tra cứu](docs/design/CAU_TRUC_BA_TANG_KINH.md).

Trình đọc kinh và sách Chùa Phúc Minh có **Lật trang / Cuộn**, tùy chỉnh chữ và màu nền, lưu vị trí đọc và nghe riêng. **Một thanh điều khiển chung** dùng xuyên suốt thư viện và trang đọc; khi mở kinh, thanh đặt ngay cuối trang và phân biệt nhóm **Đọc** với nhóm **Nghe**. Chọn **Nghe kinh** để bắt đầu, **Nghe từ đây** để nghe theo trang đọc, **Nghe tiếp** để tiếp tục và **Theo lời kinh** để trang tự theo đoạn đang nghe. Giọng đọc, tốc độ, âm lượng, hẹn giờ, nghe lại và lặp nằm trong **Tùy chọn**; chọn **Phẩm & vị trí nghe** để đổi phần hoặc đọc từ đoạn nghe. Xem [thanh điều khiển hợp nhất](docs/design/HOP_NHAT_THANH_DOC_NGHE.md) và [trình đọc](docs/design/NANG_CAP_DOC_KINH_POCKETBOOK.md).

**Lịch sử nghe** trong thanh bên và thanh điều hướng điện thoại lưu các bản kinh đang nghe dở / đã nghe xong. Chọn **Nghe tiếp** để trở lại đúng đoạn và số giây; **Nghe lại** bắt đầu bản đã hoàn tất từ đầu. Trang chủ hiển thị tối đa ba bản đang nghe trong mục **Nghe tiếp**. Xem [module lịch sử nghe](docs/design/MODULE_LICH_SU_NGHE.md).

Trong trang bộ kinh, từng phẩm có hai nút **Đọc / Nghe**. Khóa tụng, hàng đợi, bộ đang nghe, bản thu nhập và thời khóa nghe cũng có lối **Đọc kinh** trực tiếp. Chọn đọc giữ nguyên phiên audio và danh sách nghe. Xem [các vị trí đã bổ sung nút đọc](docs/design/BO_SUNG_NUT_DOC_KINH.md).

Thanh phát ngoài trang đọc cao **84px trên máy tính / 88px trên điện thoại** (106px ở màn hình dưới 375px, tên kinh nằm trên hàng riêng). Nút **Bản đọc** mở đúng kinh và đoạn đang nghe, giữ nguyên audio; nút vòng mũi tên **Nghe lại từ đầu** phát lại toàn bộ kinh. Thanh trong trang đọc cao **64px trên máy tính / 108px trên điện thoại** với nút phát 48px. **Theo lời kinh** nằm trong Tùy chọn; trên điện thoại, chọn **Tùy chọn → Nghe từ đây** để nghe từ trang hiện tại. Xem [ảnh và kết quả kiểm tra](docs/reports/unified-player/BAO_CAO.md).

| Thư mục | Nội dung |
| --- | --- |
| `app/` | Máy chủ Python và giao diện trong `app/web/` |
| `config/` | Cấu hình tên miền và danh sách phụ thuộc |
| `data/sources/` | Bốn bộ sưu tập sách gốc |
| `data/generated/` | Văn bản chuyển đổi, danh mục, dữ liệu OCR và ngoại tuyến |
| `local/` | Mở/chia sẻ thư viện Windows, runtime và dữ liệu vận hành local |
| `vps/` | Rà soát, đóng gói, tải lên, cài đặt và cập nhật VPS |
| `tools/` | Dựng dữ liệu, tải font và bảo trì dùng chung |
| `tests/` | Kiểm thử và kết quả trong `tests/artifacts/` |
| `docs/` | Hướng dẫn, thiết kế, lịch sử phiên bản và báo cáo |
| `local/runtime/` | Phụ thuộc Python/OCR Windows và chương trình Cloudflare |
| `local/storage/` | Cơ sở dữ liệu hiện hành và cache của local |
| `E:\Kinh điển phật giáo - VPS\` | Thư mục xuất bên ngoài dự án, tạo khi đóng gói; chỉ giữ gói mới nhất |

Đường dẫn truy cập vẫn là `/web-thuvien/index.html`. Các liên kết sách và mã tài liệu được giữ nguyên dù vị trí lưu trên ổ đĩa đã được phân loại lại.

Rà soát trước khi đóng gói:

```powershell
vps\DONG_GOI_VPS.cmd -AuditOnly
```

Tạo gói cập nhật:

```powershell
vps\DONG_GOI_VPS.cmd
```

Gói xuất giữ cấu trúc tương thích với VPS đang sử dụng. Công cụ đóng gói tự chọn tài nguyên cần thiết và chụp chỉ mục SQLite; không cần nén toàn bộ thư mục làm việc.

**Quy tắc dung lượng:** gói xuất, bản sao lưu, checkpoint và bản mã cũ phải lưu bên ngoài thư mục dự án. Gói VPS mặc định xuất vào thư mục cùng cấp, tên thư mục dự án cộng ` - VPS`; chỉ tạo khi chạy đóng gói. Công cụ đóng gói thay gói đã kiểm tra thành công, không tạo thêm `thuvien-truoc-*.7z`. Có thể chọn nơi xuất khác bên ngoài: `vps\DONG_GOI_VPS.cmd E:\thuvien-vps`.

Xem [quy tắc cấu trúc thư mục](docs/guides/CAU_TRUC_THU_MUC.md) và [hướng dẫn VPS](docs/guides/HUONG_DAN_VPS.md).
