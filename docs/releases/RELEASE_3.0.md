# Tàng Kinh Các 3.0 — 07/09/2026

Người dùng đã xác nhận toàn bộ phương án nâng cấp và bổ sung nghe kinh bằng tiếng Việt. Phiên bản này triển khai giao diện mới, trình đọc theo cấu trúc kinh và audiobook tiếng Việt; giữ nguyên các tệp kinh trong `Dai_thua/` và `Dai_Tang_Kinh_Han/`.

## Giao diện và thư viện

- Trang chủ Tàng Kinh Các: giấy ngà, xanh ngọc trầm, vàng tiết chế, minh họa hoa sen SVG, điều hướng thu gọn theo nhu cầu.
- Ba chủ đề Bạch Ngọc, Hoàng Y, Dạ Thiền; bố cục máy tính, máy tính bảng và điện thoại.
- Phông Be Vietnam Pro, Noto Serif và Noto Serif TC được lưu tại `fonts/`, kèm giấy phép OFL. Không cần gọi Google Fonts khi mở ứng dụng.
- Tra cứu tên/mã/tiêu đề Hán không dấu trên hai kho kinh, lọc theo kho và bản Việt; danh mục có dạng thẻ/danh sách.
- Tủ sách yêu thích, đọc gần đây, bộ lọc phụ lục và đường dẫn đến các kinh có mã xác định.
- Các phân khu vấn đáp, từ điển, tọa thiền, pháp hành và ghi chú cũ tiếp tục hoạt động trong hệ giao diện mới.

## Trình đọc kinh

- `reader-model.js` tạo khối nguồn giữ nguyên từng ký tự, vị trí bắt đầu/kết thúc và mã đoạn ổn định theo nguồn. Mục lục nhận diện quyển/phần/phẩm/chương/bài kinh; hạn chế nhận nhầm danh sách đầu sách là chương thật.
- Phần đọc Ngắn/Vừa/Dài được tách tại ranh giới khối. Mục do phần mềm tạo ghi rõ “Phần đọc”, tách khỏi tiêu đề nguyên bản.
- Mục lục có tìm kiếm, nhánh thu gọn, chỉ hiện mục lớn, điều chỉnh chiều rộng bằng chuột hoặc bàn phím.
- Cuộn liên tục chỉ giữ cửa sổ tối đa 5 phần đã dựng để hạn chế DOM; từng phần chỉ dựng phần hiện tại. Nội dung nguồn vẫn được tải toàn tệp khi mở, chưa có chỉ mục/chunk vật lý cho toàn kho.
- Bộ hiệu chỉnh có đặt điểm chia, sửa tên/cấp mục, gộp với phần trước, xem trước, lưu, hoàn tác, đặt lại, xuất/nhập JSON có kiểm tra tác phẩm/ngôn ngữ/phiên bản nguồn.
- Tìm trong toàn bài, kể cả phần chưa dựng; nhiều dấu trang và ghi chú theo đoạn; xuất ghi chú Markdown và liên kết trực tiếp đến đoạn.
- Ghi nhớ đoạn cùng tỷ lệ vị trí bên trong đoạn, riêng từng bản ngôn ngữ. Liên kết dùng mã đoạn nên không phụ thuộc lựa chọn độ dài phần đọc trên thiết bị khác.
- Đối chiếu Việt–Hán điều hướng độc lập, không suy đoán căn chỉnh hai bản. Các vùng Hán dùng Noto Serif TC.
- Cỡ chữ, giãn dòng, khoảng cách đoạn, chiều rộng, căn chữ, kiểu chữ; đọc tập trung, tụng chữ lớn, cuộn tự động và giảm chuyển động.
- Mọi khối kinh đi qua nhánh `preserveSource` của `SutraFormatter.format()`, escape nội dung trước khi sinh markup. Các chức năng cũ dùng formatter cũ tiếp tục có đường xử lý riêng.

## Nghe kinh tiếng Việt

- Máy chủ `server.py` phục vụ thư viện và API `/api/voices`, `/api/tts` tại **127.0.0.1:8090**, tách khỏi máy chủ tĩnh cũ tại 8088.
- Hai giọng trực tuyến Hoài My và Nam Minh qua `edge-tts`; chỉ hiển thị giọng thiết bị có ngôn ngữ `vi` khi dùng Web Speech API.
- Luồng nghe luôn từ bản Việt, kể cả khi đang xem Hán. Tác phẩm chưa có bản Việt không có nút nghe.
- Chia lời đọc thành đoạn ngắn, tải trước đoạn kế tiếp, phát/tạm dừng, nghe thử, lùi/tiến, thanh chọn đoạn, tốc độ, hẹn dừng, theo dõi đoạn đang nghe và nghe từ đoạn Việt đã chọn.
- Lưu vị trí nghe theo đoạn và chỉ số đoạn âm thanh; giọng trực tuyến lưu thêm vị trí thời gian. Đóng/chuyển kinh hủy yêu cầu đang tải để tránh phát nhầm nội dung cũ.
- Metadata, chú thích đã nhận diện, tiêu đề chạy đầu trang đã nhận diện và chữ Hán được bỏ khỏi luồng nghe. Không sửa tệp kinh nguồn.
- Bộ nhớ đệm âm thanh trong `.audio-cache/`, giới hạn khoảng 256 MiB; máy chủ giới hạn yêu cầu đồng thời và chỉ cho phép hai mã giọng Việt.

## Lưu trữ và khả năng tương thích

- Không đổi các khóa dữ liệu cũ. Dữ liệu mới dùng tiền tố `cp3:`.
- Sao lưu bao gồm dữ liệu mới, ghi chú/dấu trang cũ và tùy chọn. Nhập hợp nhất, ưu tiên bản cục bộ khi trùng khóa; kiểm tra định dạng trước khi ghi.
- Dấu trang pixel của phiên bản cũ được bảo toàn trong bản sao lưu, chuyển thành dấu trang cần xác định lại vị trí, không hứa chuyển pixel chính xác sang cấu trúc mới.
- Cần xuất/nhập để chuyển dữ liệu giữa `localhost:8088` và `127.0.0.1:8090` vì trình duyệt tách bộ nhớ theo origin.

## Kiểm chứng đã thực hiện

1. Kiểm tra cú pháp các module JavaScript mới và controller đã sửa.
2. `tests/reader-model.test.cjs`: bảo toàn nguồn khi tách/gộp, định danh khối duy nhất, loại mục lục đầu sách lặp, nhận diện chú thích, tìm không dấu; kiểm tra trên bốn bản kinh Việt/Hán thực tế.
3. Trường A-Hàm Việt: 1.281.984 ký tự, 2.315 khối, 230 phần ở độ dài Vừa. Ghép lại khối và các phần cho kết quả đúng nguyên chuỗi nguồn; số phần là quy ước đọc của phần mềm.
4. `tests/audio_check.py`: tạo MP3 thật với cả Hoài My (40.320 byte) và Nam Minh (42.336 byte) trên câu nghe thử.
5. `tests/acceptance.py`: 11 nhóm kiểm tra gồm tìm kiếm, tủ sách, mục lục, tìm toàn bài, dấu trang/ghi chú, đọc tiếp, hiệu chỉnh/xuất nhập, đối chiếu, phát âm thanh thật, sao lưu, phân khu cũ, giao diện nhiều kích thước và liên kết sang trình duyệt mới. Không ghi nhận ngoại lệ JavaScript ở lượt đạt.
6. `tests/edge_cases.py`: 7 nhóm kiểm tra chuyển bản nhanh, hủy tải/phát khi đóng, font Hán, bàn phím/focus, phụ lục, escape markup, không có giọng Việt và tương phản màu.
7. Tương phản chữ chính/nền trang đọc đo được: Bạch Ngọc **11,84:1**, Hoàng Y **11,80:1**, Dạ Thiền **13,30:1**. Đây là kiểm tra các cặp màu chính, không phải chứng nhận toàn bộ WCAG.
8. Chụp và xem ảnh thực tế ở 1440×1000, 768×1024, 390×844; kiểm tra ba chủ đề, mục lục, bảng cài đặt và trình nghe. Không phát hiện tràn ngang vùng đọc trong các kích thước thử.

Ảnh và JSON nghiệm thu nằm trong `tests/artifacts/`; thư mục này cùng runtime/cache được bỏ qua trong Git. Các bài kiểm tra trình duyệt đang dùng Playwright/Chromium cài trên máy phát triển, chưa kiểm tra Safari/iOS hoặc nghe nền trên điện thoại thật.

## Giới hạn cần giữ rõ

- Mục lục tự nhận diện là công cụ hỗ trợ; kinh có cấu trúc OCR bất thường vẫn cần người quản lý kiểm tra. Bộ hiệu chỉnh chỉ thay cấu trúc trình bày.
- Giọng trực tuyến cần Internet, gửi đoạn kinh đến dịch vụ Microsoft, phụ thuộc tính khả dụng của dịch vụ. Là giọng tổng hợp, không phải bản thu người tụng kinh; phát âm thuật ngữ cần người nghe đánh giá.
- Chú thích OCR không nhận diện được có thể còn được đọc; không tự đoán và xóa nội dung không rõ.
- Giọng thiết bị phụ thuộc trình duyệt/hệ điều hành. Không có giọng Việt thì hiển thị hướng dẫn, không dùng giọng ngoại ngữ thay thế.
- Màn hình khóa/phát nền trên điện thoại tùy nền tảng, chưa cam kết như ứng dụng native.
- Tìm toàn văn toàn kho, PWA ngoại tuyến, đồng bộ đám mây và kho audio thu âm vẫn thuộc các đợt mở rộng đã tách trong phương án xác nhận.

Xem [hướng dẫn khởi động và sử dụng](HUONG_DAN_SU_DUNG.md).
