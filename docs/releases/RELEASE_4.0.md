# Thư viện Chánh Pháp 4.0 — 07/09/2026

Đợt nâng cấp này giải quyết phản hồi về thao tác khó dùng, giao diện nhỏ và rối, kinh văn dính thành khối dài và nút nghe chưa hoạt động theo mong đợi.

## Giao diện và thao tác

- Đưa tìm kiếm lên đầu trang, thay phần minh họa lớn bằng một ô tra cứu rõ ràng; bổ sung từ khóa gợi ý và nút xóa từ khóa.
- Bốn lối vào trực tiếp: Bát Nhã Tâm Kinh, A Di Đà, Dược Sư, Pháp Hoa. Nút đọc/nghe liên kết đến tác phẩm thực có trong dữ liệu.
- Kết quả tìm kiếm có tên kinh, mã kinh, ngôn ngữ và nút nghe riêng; vẫn tìm không dấu và giới hạn số kết quả hiển thị.
- Danh mục dùng bộ chọn thể loại/bộ kinh; bảng tổng quan 25 bộ có thể mở khi cần. Các bản Hán, song ngữ và PDF nằm trong mục “Bản khác & PDF”.
- Tăng kích thước chữ và vùng bấm, thống nhất thẻ kinh, khoảng cách, màu nền và các trạng thái tương tác. Giữ ba chủ đề sáng, ấm và tối.
- Trình đọc có nút A−/A+ trực tiếp, “Kiểu đọc”, “Tìm & ghi chú”; trên điện thoại có thể đánh dấu đoạn trong bảng ghi chú.

## Trình bày kinh văn

Nguyên nhân trước đây nằm trong nhánh `preserveSource` của `sutra-formatter.js`: cả khối nguồn được đưa vào một `div` với `white-space: normal`, nên các dòng/đối thoại bị nối lại. Nhánh mới sinh các đoạn `p`, nối dòng OCR trong câu, tách đối thoại và đoạn sau dấu kết câu, nhận diện các nhóm dòng kệ nằm giữa văn xuôi. Đoạn dài được ngắt ở ranh giới dấu câu có khoảng trắng; phần cuối chưa có dấu chấm vẫn được giữ.

Thay đổi chỉ ở lớp hiển thị. `ReaderModel`, định danh khối, văn bản nguồn, ghi chú và mục lục cá nhân vẫn dùng cấu trúc cũ. Thông tin nguồn có thể thu gọn; kết quả tìm kiếm nằm trong nhóm thu gọn sẽ tự mở nhóm đó. Các tệp trong `Dai_thua/` và `Dai_Tang_Kinh_Han/` không bị sửa.

Việc nhận diện kệ và xuống đoạn là quy tắc trình bày, không phải hiệu đính học thuật. Các bản OCR bất thường vẫn cần đối chiếu bản gốc.

## Nghe kinh

Máy chủ đã tạo được MP3 mới trong kiểm tra thực tế; không cần thay bộ tổng hợp tiếng nói. Đợt sửa tập trung vào luồng sử dụng và phục hồi:

- Nút nghe ở trang chủ, kết quả và danh mục đợi đúng tác phẩm tải xong rồi phát; nút nghe trong trình đọc bắt đầu phát khi mở bảng.
- Gắn sự kiện điều khiển ngay khi khởi tạo, không đợi truy vấn giọng đọc kết thúc.
- Có trạng thái tải, đang nghe, tạm dừng, lỗi và nút “Kết nối lại”. Khi máy chủ vừa được khởi động, người đọc có thể kết nối lại ngay trong trang hiện tại.
- Yêu cầu âm thanh có thời hạn 45 giây, có kiểm tra kiểu/độ dài dữ liệu trả về và hủy khi đóng hoặc chuyển tác phẩm.
- Giữ MP3 của đoạn hiện tại trong bộ nhớ để nghe tiếp; hiện văn bản đoạn đang nghe, giọng đọc, tốc độ và hẹn dừng.
- Chỉ dùng giọng thiết bị tiếng Việt; không tự chuyển sang giọng ngoại ngữ khi giọng Việt không có.

Giọng trực tuyến cần Internet, gửi đoạn kinh đến dịch vụ Microsoft; bộ nhớ đệm cục bộ hoạt động như trước. Đây là giọng đọc tổng hợp. Kiểm thử xác nhận trình duyệt giải mã và thời gian phát tăng, không thay thế đánh giá nghe bằng tai trên loa của người dùng hay kiểm tra phát nền iOS/Android.

## Kiểm chứng

**Kết quả chốt:** 33 nhóm kiểm tra trình duyệt đã qua (11 trải nghiệm mới, 11 nghiệm thu tổng thể, 7 tình huống biên, 4 khôi phục điểm mở), không ghi nhận lỗi JavaScript. Hai bộ kiểm tra Node.js về cấu trúc nguồn và định dạng cũng đã qua.

- `node web-thuvien/tests/reader-model.test.cjs`: bảo toàn văn bản, định danh và chia phần.
- `node web-thuvien/tests/sutra-formatter.test.cjs`: dòng OCR, đối thoại, kệ xen văn xuôi, đoạn dài, câu cuối và escape HTML; đối chiếu 4.463 khối nguồn trong bốn tệp Việt/Hán, tạo 10.324 đoạn hiển thị, không mất chữ sau khi chuẩn hóa khoảng trắng.
- `python -X utf8 web-thuvien/tests/experience_check.py`: tìm kiếm, đọc/nghe trực tiếp, phát MP3 có thời gian tăng, tạm dừng/tiếp tục, bộ lọc, ghi chú, lỗi và kết nối lại; bốn kích thước trình đọc 1440/820/390/320 px và ba chủ đề.
- `python -X utf8 web-thuvien/tests/acceptance.py`: mục lục dài, tìm toàn bài, ghi chú, khôi phục vị trí, hiệu chỉnh/xuất/nhập mục lục, đối chiếu, đổi giọng/tốc độ, sao lưu, công cụ cũ và liên kết tới đoạn.
- `python -X utf8 web-thuvien/tests/edge_cases.py`: chuyển tác phẩm nhanh, bàn phím, chữ Hán, HTML an toàn, thiếu giọng Việt, đóng lúc tải âm thanh. Tương phản chữ chính/nền trang: sáng 11,58:1; ấm 11,80:1; tối 13,30:1.
- `python -X utf8 web-thuvien/tests/file_entry_regression.py`: mở nhầm file HTML, khôi phục đúng T11n0311, tải lại sau lỗi mạng và khởi động từ thư mục khác.

Ảnh và báo cáo ở `tests/artifacts/`; ảnh mới có tiền tố `v4-`. Các lượt kiểm tra dùng Chromium trên Windows; chưa kiểm chứng trình duyệt điện thoại thật.

## Tiếp tục phát triển

`css/experience.css` là lớp giao diện 4.0 nạp sau `sanctuary.css`. Các lớp cũ còn phục vụ những phân hệ hiện có. Không đổi tiền tố lưu trữ `cp3:` hoặc định dạng sao lưu 3: bản 4.0 tương thích dữ liệu đọc/nghe/ghi chú đã lưu.

Khởi động bằng `MO_THU_VIEN.cmd`, hoặc mở **http://127.0.0.1:8090/web-thuvien/index.html** khi máy chủ đang chạy. Nếu trình duyệt còn giữ giao diện cũ, nhấn Ctrl+F5. Hướng dẫn thao tác: [HUONG_DAN_SU_DUNG.md](HUONG_DAN_SU_DUNG.md).
