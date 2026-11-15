# Cải tiến thao tác đọc và nghe — 07/10/2026

Thanh đọc và nghe nằm dưới kinh văn, gọn trong một hàng trên máy tính và hai hàng trên điện thoại. Thông tin nghe nằm bên trái, nút phát tròn ở giữa và các công cụ phụ bên phải. Nhóm điều hướng trang được căn giữa theo cùng chiều rộng với thanh nghe.

## Cách dùng

- **Đọc & nghe** hiện thanh nghe gọn bên dưới văn bản. Mở thanh không tự phát âm thanh.
- **Nghe từ đây** bắt đầu từ chữ đang đọc. Nút tròn ở giữa thanh dùng biểu tượng phát hoặc tạm dừng, có nhãn và chú giải tương ứng; nghe tiếp giữ vị trí đã lưu.
- **Theo lời kinh** để trang tự theo đoạn đang nghe. Tắt tùy chọn để đọc ở vị trí khác trong lúc vẫn nghe.
- **Tùy chọn**, biểu tượng điều chỉnh ở bên phải, mở công cụ bên cạnh trang: chọn giọng, phẩm, tốc độ, hẹn giờ, nghe lại và lặp đoạn. **Đọc từ đoạn nghe** trong công cụ này tạm dừng và trở về đoạn chữ tương ứng.
- **×** ẩn thanh nghe, giữ phiên nghe hiện tại. Khi thanh nghe trong trang mở, thanh phát bên ngoài được ẩn để tránh hai bộ điều khiển cùng lúc.
- Bấm số trang/phần ở cuối trang để mở mục lục và chọn phần đọc.

Thanh nghe cao 61px ở máy tính và 105px ở điện thoại trong kiểm thử chiều cao màn hình 900px. Các nút vẫn có vùng bấm tối thiểu 44px; nhãn Theo lời kinh vẫn hiện trên điện thoại. Thanh tham gia bố cục trang, không phủ lên chữ. Mở/đóng thanh và tùy chọn giữ vị trí chữ khi phân trang lại. Xem [thiết kế máy tính](../../../tests/artifacts/read-listen-continuity/minimal-controls-desktop.png).

## Chuyển đoạn

Chuyển đoạn, phẩm hoặc giọng trong lúc phát tiếp tục nghe; chọn đoạn/phẩm khi đã tạm dừng vẫn giữ tạm dừng. Nút Tiếp ở thanh phát chuyển đoạn hiện tại trước khi chuyển sang kinh trong hàng đợi. Kinh trong hàng đợi hoặc trọn bộ phát từ đầu dù đã có vị trí nghe cũ.

Bổ sung kiểm tra trạng thái kết thúc của thẻ audio nếu trình duyệt bỏ lỡ sự kiện `ended`, tránh xử lý kết thúc hai lần, giữ tạm dừng khi kiểm tra hoàn tất âm thanh và hủy lịch chuyển phẩm khi người nghe tạm dừng.

## Kiểm tra

- `tests/read_listen_continuity_check.py`: bố cục thanh nghe, tùy chọn, chuyển đoạn/phẩm/giọng, hàng đợi/trọn bộ, sự kiện kết thúc bị bỏ lỡ, tạm dừng trong lúc kiểm tra kết thúc hoặc chờ chuyển phẩm, phát tự nhiên qua bảy đoạn, toàn màn hình và sáu chiều rộng 320–1920px. Kiểm tra biểu tượng theo trạng thái phát, vùng bấm 44px, nhãn điều khiển và nhóm công cụ không chồng nhau; chụp thêm màu Hoàng Y và Dạ Thiền.
- `tests/pocketbook_reader_check.py`: lật trang, vị trí chữ, chuyển đọc/nghe, ba màu nền và năm chiều rộng, mở sách khác, Việt/Hán/đối chiếu, cache tài nguyên mới và tải lại ngoại tuyến.
- `tests/audio_regression_suite.py`: bộ kiểm thử nghe, phục hồi, trình phát và chức năng thư viện. Đã thêm kiểm thử đọc/nghe mới vào danh sách chạy cho các lần sau.
- `tests/buffered_audio_runtime_check.py`: tám đoạn phát bằng audio cục bộ, tải trước bị gián đoạn vẫn phục hồi; khoảng chuyển đoạn lớn nhất đo được 0,029 giây.
- `node --test tests/narration-model.test.cjs tests/reader-model.test.cjs tests/audio-service.test.cjs`: 19 kiểm thử đạt, gồm toàn vẹn kinh văn và bản đồ đoạn nghe.

Kết quả và ảnh bố cục: [đọc/nghe](../../../tests/artifacts/read-listen-continuity/results.json), [trình đọc](../../../tests/artifacts/pocketbook-reader/results.json), [hồi quy nghe](../../../tests/artifacts/audio-recovery/browser-regressions.json), [đệm âm thanh](../../../tests/artifacts/audio-continuity/buffered-runtime.json).

Kiểm thử audio dùng mẫu WAV cục bộ và tiêm lỗi có kiểm soát. Đợt này không đo lại hiệu năng dịch vụ giọng trực tuyến thật. Áp dụng trong thư mục làm việc; chưa triển khai lên VPS. Bản cache giao diện là `cp-shell-v30-minimal-reader-controls`.
