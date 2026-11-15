# Khôi phục audio ngày 07/10/2026

## Nguyên nhân

Máy chủ cục bộ trên cổng 8090 chạy trong môi trường bị hạn chế kết nối mạng.
`edge-tts` nhận `ClientConnectorError` với nguyên nhân `PermissionError: [WinError 5] Access is denied`
khi kết nối `speech.platform.bing.com:443`. Giao diện hiển thị thông báo giọng trực tuyến gián đoạn.

Trước khi khôi phục, số liệu máy chủ ghi nhận 73 lỗi, 240 lần thử lại và chưa nhận byte âm thanh nào.
Kiểm tra trực tiếp với quyền mạng cho thấy cả Hoài My và Nam Minh vẫn hoạt động.

## Xử lý

- Xác minh đường dẫn và cổng của tiến trình thư viện trước khi dừng; khởi động lại máy chủ ẩn với quyền mạng.
- Nhận diện lỗi quyền kết nối, kể cả lỗi được HTTP client bọc bên trong.
- Trả mã `network-denied`, `retryable:false` cho cả tổng hợp trực tiếp và tải audio theo luồng.
- Dừng thử lại khi kết nối bị chặn; giữ việc thử lại cho lỗi kết nối tạm thời.
- Báo cách mở lại `MO_THU_VIEN.cmd`, giữ đoạn và giây đang nghe để nút **Thử lại** tiếp tục đúng vị trí.
- Cập nhật phiên bản script và cache giao diện.

## Kiểm chứng

37 kiểm thử tự động đạt:

| Lệnh | Số kiểm thử |
| --- | ---: |
| `node --test tests/audio-service.test.cjs` | 17 |
| `python -X utf8 tests/narration_engine_check.py` | 11 |
| `python -X utf8 tests/narration_server_check.py` | 7 |
| `python -X utf8 tests/narration_stats_check.py` | 2 |

`python -X utf8 tests/audio_network_runtime_check.py` đạt trên Chrome với máy chủ thực ở cổng 8090:
hai giọng phát MP3 đầy đủ, tạm dừng/nghe tiếp giữ vị trí; lỗi quyền mạng báo đúng và không tự thử lại;
nút **Thử lại** nghe tiếp cùng đoạn từ giây đã lưu sau khi kết nối được khôi phục.
Văn bản thử được thay vào bản kinh trong ngữ cảnh trình duyệt riêng.
Kết quả: [runtime-results.json](../../../tests/artifacts/audio-network-access/runtime-results.json).

`python -X utf8 tests/buffered_audio_runtime_check.py` đạt: tám đoạn phát đúng thứ tự bằng audio đầy đủ;
đoạn tải lỗi được phục hồi trước khi phát; tạm dừng trong lúc chuẩn bị không tự phát lại.
Khoảng chuyển đoạn lớn nhất trong lần chạy này là 0,0278 giây.

Sau khi khôi phục, máy chủ thực không ghi nhận lỗi tổng hợp trong các lượt kiểm tra.
Việc phát được xác nhận bằng bộ giải mã và đồng hồ audio của trình duyệt; âm lượng kiểm thử được tắt.

## Sử dụng

Tải lại trang bằng **Ctrl+F5**, rồi nhấn **Thử lại** hoặc **Phát**.
Máy chủ cục bộ đã được chạy lại; không cần cài lại bộ giọng đọc.
