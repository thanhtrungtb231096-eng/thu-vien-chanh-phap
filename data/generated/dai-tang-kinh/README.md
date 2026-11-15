# Đại Tạng Kinh

Module riêng của thư viện, nhập từ `EbooksProject`. Mở tại:

`http://127.0.0.1:8090/web-thuvien/index.html#daitang`

## Nội dung

- 1.624 tài liệu: 1.614 Word trong thư mục nguồn và 10 Word trong ba ZIP.
- 1.616 bản chữ có thể đọc và nghe, gồm 7 bản có tên nguồn ghi thiếu phần.
- 8 tài liệu chỉ có thông tin đầu sách: vẫn xem thông tin và tải Word; chưa mở đọc/nghe.
- 13 nhóm: kinh và luận, giảng kinh, nhập môn, Thiền, Tịnh độ, Duy thức, Mật tông, kinh tụng và sám văn, thuyết pháp, sách Phật học và văn học, khuyến tu, tâm và đời sống, sức khỏe.

Tên **Đại Tạng Kinh** là tên module theo yêu cầu. Bộ sưu tập gồm cả kinh điển, giảng giải, trước tác và sách tham khảo; không phải mọi tài liệu đều là kinh.

## Sử dụng

Danh mục hỗ trợ tìm không dấu theo tên sách, người dịch, tác giả và tên tệp; lọc nhóm/chủ đề/trạng thái; sắp xếp; xem thẻ hoặc danh sách; phân trang 30 tài liệu. Mở bìa hoặc tên sách để xem thông tin và nguồn.

Trình đọc và thanh nghe dùng chung với các module khác: mục lục, tìm trong sách, đánh dấu, ghi chú, đọc tiếp, chỉnh chữ/màu, giọng đọc, tốc độ, hẹn giờ, hàng đợi và nghe liên tục. Sách đã lưu xuất hiện trong **Tủ sách của tôi**. **Tìm trong kinh văn** có bộ lọc **Đại Tạng Kinh** và mở đúng đoạn tìm được.

Nút **Toàn màn hình** ở thanh trên của trình đọc mở không gian đọc đầy màn hình; thoát bằng **Thu nhỏ**, **Esc** hoặc **Alt + Enter**. Xem [hướng dẫn toàn màn hình](../../../reports/reader-fullscreen.md).

Chọn **Lưu ngoại tuyến** trong thông tin sách để lưu bản chữ cùng Word gốc trên thiết bị. Âm thanh tổng hợp cần kết nối, trừ những chương nghe đã được tải ở chức năng ngoại tuyến dùng chung. Thư mục `Sach-Noi` của nguồn chỉ chứa Word; giọng nghe được tạo từ bản chữ.

## Tệp trong module

| Đường dẫn | Vai trò |
| --- | --- |
| `catalog.json` | Danh mục, nhóm, tên sách, thông tin dịch giả/tác giả và liên kết nguồn |
| `text/*.md` | Bản chữ Unicode có chương mục cho trình đọc và nghe |
| `originals/*.doc` | Mười Word lấy từ ZIP, tên tệp theo mã tài liệu |
| `conversion-audit.json` | Kết quả chuyển đổi và dấu hiệu cần đối chiếu theo từng nguồn |
| `../../js/dai-tang-kinh-data.js` | Danh mục dùng trên giao diện |

Các Word nằm ngoài ZIP được liên kết trực tiếp từ `EbooksProject`. Tệp nguồn không bị sửa hoặc di chuyển. Mã `ep-…` được tạo từ đường dẫn nguồn và giữ ổn định khi dựng lại cùng đường dẫn.

## Cập nhật sau khi bổ sung nguồn

Chạy từ thư mục gốc dự án bằng Python và Node.js:

```powershell
python -X utf8 web-thuvien\build_ebooks.py
python -X utf8 web-thuvien\build_ebooks_index.py
```

Lệnh đầu chuyển Word, dựng danh mục và bản chữ. Lệnh thứ hai cập nhật chỉ mục của module này trong một giao dịch; giữ các bộ sách khác. Nếu chưa có chỉ mục, công cụ dựng chỉ mục toàn thư viện. Sau khi dựng, tải lại trang; khi thay đổi mã Python của máy chủ, khởi động lại máy chủ.

Khởi động thư viện qua cách mở dự án đang dùng, hoặc:

```powershell
python -X utf8 web-thuvien\launch.py
```

Kiểm tra với một máy chủ thử đang chạy ở cổng 8096:

```powershell
python -X utf8 web-thuvien\server.py --port 8096
# Trong cửa sổ PowerShell khác:
python -X utf8 web-thuvien\tests\dai_tang_kinh_check.py
```

Kiểm tra âm thanh dùng WAV cục bộ để xác nhận luồng phát, không xác nhận chất lượng hay khả năng kết nối dịch vụ giọng đọc trực tuyến.

## Đối chiếu bản chuyển

Chuyển đổi giữ phần văn bản chính, chú thích chân trang/cuối sách và nguồn Word. Chương mục được nhận diện tự động; bố cục bảng, ảnh, công thức và đối tượng nhúng cần xem trong Word gốc. Mã chữ Việt cũ được chuyển khi nhận diện được; những chỗ chưa đọc được có ghi chú riêng. Các bản chữ chưa được hiệu đính toàn bộ.

Hai sai khác tên Pāli của Trung Bộ và Tăng Chi Bộ được ghi trong thông tin sách; văn bản nguồn vẫn giữ để đối chiếu. Chi tiết khảo sát: [báo cáo nguồn](../../../reports/ebooks-project/README.md), [tài liệu cần rà soát](../../../reports/ebooks-project/quality-review.md).

## Kết quả kiểm tra ngày 04/10/2026

- Đối chiếu SHA-256 toàn bộ 1.619 tệp nguồn: không thay đổi.
- Dựng lại đủ 1.624 tài liệu, 1.616 bản chữ; chỉ mục tìm kiếm chứa đủ bản chữ của module.
- Kiểm tra trên Chrome: danh mục, phân trang, lọc, tìm không dấu, nguồn Word, mục lục, đọc tiếp, đánh dấu, ghi chú, liên kết tới sách, tủ sách, nghe liên tục, đọc ngoại tuyến và mở đúng đoạn tìm kiếm. Bố cục thẻ/danh sách được kiểm tra ở 320, 390, 768 và 1.024 px.
- Kiểm tra lại module Chùa Phúc Minh: 26 sách, đọc PDF/bản chữ, nghe, vị trí đọc, tìm kiếm và bố cục; không có lỗi JavaScript trong các luồng kiểm tra.
- Kiểm tra trực tiếp máy chủ 8090: module mở được bản chữ, nguồn Word và tìm kiếm; dịch vụ giọng Hoài My trả về 18.144 byte âm thanh cho một câu nghe thử.

Kết quả tự động: [kiểm tra module](../../tests/artifacts/dai-tang-kinh/results.json), [kiểm tra máy chủ đang chạy](../../tests/artifacts/dai-tang-kinh/live-results.json).
