# Thư viện Chánh Pháp · Dharma Edition 6.0

> Cập nhật cách chia câu và lượt thoại: xem [RELEASE_6.1.md](RELEASE_6.1.md).

Ngày triển khai: 12/09/2026. Thực hiện theo yêu cầu nâng cấp giao diện trong `KE_HOACH_THIET_KE_GIAO_DIEN_SPOTIFY.md`.

## Mở bản nâng cấp

Chạy `MO_THU_VIEN.cmd`, truy cập `http://127.0.0.1:8090/web-thuvien/index.html`. Nếu trang cũ còn được giữ trong trình duyệt, nhấn **Ctrl + F5**. Không cần cài thêm thư viện JavaScript hoặc chạy bước build.

Giao diện mặc định cho thiết bị mới là **Dạ Thiền**: nền xanh đen, điểm nhấn vàng và bìa kinh hoa sen. Lựa chọn Bạch Ngọc/Hoàng Y đã lưu trước đây được giữ lại; chọn Dạ Thiền trên thanh đầu trang hoặc trong Menu điện thoại để đổi.

## Những thay đổi chính

- Bố cục ba cột trên màn hình lớn: điều hướng và tủ sách bên trái, nội dung ở giữa, bản dịch/ghi chú/hàng đợi/từ điển bên phải. Máy tính bảng có cột điều hướng thu gọn, điện thoại có thanh điều hướng đáy và trình phát nhỏ.
- Thanh phát cố định hoạt động độc lập với trình đọc. Mở kho kinh, tra cứu, mở một bản kinh khác và đóng trình đọc đều giữ phiên nghe. Chỉ khi chọn Nghe ở bản kinh khác, phiên nghe mới chuyển sang bản đó.
- Trang bộ kinh có bìa, thông tin dịch giả sẵn có, danh sách phần/phẩm lấy từ văn bản nguồn, nút nghe, đọc, lưu và thêm hàng đợi. Màu nền thay đổi theo nhóm bìa.
- Hàng đợi cá nhân có thể thêm, xóa, đưa lên trước hoặc phát trực tiếp. Danh sách tu học tự tạo được lưu trên thiết bị và có thể mở từ Tủ sách trên điện thoại.
- Chế độ nghe trọn bộ tiếp tục phát theo danh mục/lộ trình. Trong khi đang nghe trọn bộ, hàng đợi riêng được giữ lại; nhấn Tiếp để chuyển sang hàng đợi cá nhân.
- Lời kinh chữ lớn theo đoạn đang phát, chạm đoạn để nghe từ đó, tự cuộn, giảm chuyển động theo tùy chọn hệ thống. Trình đọc Hán–Việt và các công cụ đọc/nghiên cứu cũ được giữ lại.
- Lặp một kinh/trọn bộ; đánh dấu đoạn A và B; khoảng nghỉ 1,5 giây giữa các lượt A–B; số biến 3, 7, 21 hoặc 108. Kết thúc số biến sẽ tạm dừng.
- Ghi chú gắn với mã kinh, chỉ số đoạn và số giây trong đoạn. Nhấn mốc ghi chú để nghe lại; xuất Markdown hoặc dùng chức năng sao lưu thư viện để giữ dữ liệu.
- Từ điển Pāḷi dùng dữ liệu hiện có, gợi ý thuật ngữ theo đoạn đang phát và hỗ trợ tìm không dấu.
- Chọn giọng Hoài My/Nam Minh/giọng thiết bị khả dụng, tốc độ, âm lượng, hẹn giờ 15–60 phút, mưa nền tổng hợp bằng Web Audio và thỉnh chuông.
- Đăng ký MediaSession để trình duyệt hỗ trợ điều khiển phát/tạm dừng/chuyển đoạn/tua. Hỗ trợ bàn phím, modal có quản lý focus và thông báo lỗi có thể phục hồi.

## Thao tác nhanh

| Thao tác | Cách dùng |
| --- | --- |
| Nghe một kinh | Chọn Nghe trên thẻ kinh hoặc nút Bắt đầu lắng nghe |
| Xem các phẩm | Chạm bìa kinh hoặc Xem các phẩm |
| Tua theo giây | Thanh thời gian và ±10 giây, trong đoạn hiện tại |
| Lặp A–B | Đánh dấu A, chuyển tới đoạn kết thúc, đánh dấu B; nhấn lại để bỏ lặp |
| Tạo danh sách | Dấu + cạnh Tủ sách bên trái hoặc Tạo danh sách tu học trong Tủ sách |
| Công cụ trên điện thoại | Chạm bìa trên trình phát nhỏ, chọn Tùy chỉnh/Ghi chú/Hàng đợi |
| Kết thúc nghe | Tùy chỉnh → Kết thúc phiên nghe |
| Tìm kiếm | Ctrl/⌘ + K khi ở thư viện |
| Lời kinh / thu nhỏ | F khi không nhập văn bản; hoặc nút lời kinh trên trình phát |
| Ghi chú | N khi không nhập văn bản |
| Đóng hộp thoại | Escape |

## Kiểm chứng

Chạy máy chủ, sau đó:

```powershell
python web-thuvien/tests/test_spotify_player.py
python web-thuvien/tests/audio_check.py
node web-thuvien/tests/reader-model.test.cjs
node web-thuvien/tests/sutra-formatter.test.cjs
```

Kiểm thử trình duyệt dùng Playwright/Chromium đã có trong môi trường dự án. Tệp `test_spotify_player.py` dùng âm thanh WAV mẫu và văn bản kinh thật để kiểm tra ổn định, độc lập với dịch vụ TTS. `audio_check.py` kiểm tra phản hồi audio thật của máy chủ cho hai giọng trực tuyến. Ảnh và báo cáo nằm trong `tests/artifacts/spotify/`, kết quả dịch vụ âm thanh trong `tests/artifacts/audio-results.json`.

Đã kiểm tra tám chiều rộng 320, 390, 768, 820, 1024, 1200, 1440, 1920 px, ba giao diện màu, bảy màn hình thư viện; nghe liên tục qua mười màn hình; mở/đóng trình đọc khác; tua, hẹn giờ, giọng đọc, ghi chú, playlist, lặp A–B bằng sự kiện audio kết thúc thật, tự chuyển hàng đợi, lỗi TTS và khởi động mới trên điện thoại. Kiểm tra mô hình văn bản và định dạng xác nhận không mất nội dung nguồn.

## Phạm vi chính xác so với bản định hướng

- Backend hiện phát từng đoạn TTS. Thanh thời gian hiển thị thời gian **trong đoạn**, còn A–B và lời kinh đồng bộ **theo đoạn**; chưa phải timestamp từng từ hay timeline chính xác cho toàn bộ kinh. Thời lượng bộ kinh có nhãn ước tính.
- Chế độ Hán–Việt nằm trong trình đọc chuyên sâu. Màn hình lời kinh hiện dùng bản Việt, không tự dịch hoặc tự tạo bản âm Hán–Việt.
- MediaSession đã được nối; việc phát nền khi khóa màn hình còn phụ thuộc trình duyệt, hệ điều hành và kết nối. Chưa chứng nhận chạy trên thiết bị iOS/Android thật.
- Bộ đệm TTS của máy chủ được giữ nguyên. Chưa bổ sung tải toàn bộ kinh ngoại tuyến, Picture-in-Picture, kéo mốc A–B trên timeline toàn kinh, thư viện âm thanh suối/mõ, hoặc popup từ điển gắn vào từng từ trong lời kinh.
- Chưa đo cam kết độ trễ 200/300 ms, sai số đồng bộ 0,3 giây, 60 FPS hoặc chứng nhận WCAG AAA; không coi các mục tiêu này là kết quả đã đạt chỉ từ kiểm thử chức năng.

## Cấu trúc triển khai

- `css/spotify-theme.css`: giao diện, bố cục thích ứng, bìa và màn hình lời kinh.
- `js/dharma-player-store.js`: phiên nghe, tải văn bản độc lập, hàng đợi, ghi chú, tích hợp MediaSession.
- `js/persistent-player.js`: trình phát, lời kinh, bảng tu học, tùy chỉnh và âm nền.
- `js/dharma-shell.js`: bố cục thư viện, trang bộ kinh, danh sách tự tạo và điều hướng.
- `audiobook.js`, `reader.js`, `collection-player.js`, `library-ui.js`, `app.js`, `index.html`: tích hợp vào bộ phát/trình đọc hiện có; tài nguyên đã đổi phiên bản để tránh cache giao diện cũ.
