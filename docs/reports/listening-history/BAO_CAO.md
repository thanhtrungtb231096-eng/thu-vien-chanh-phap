# Lịch sử nghe kinh — kết quả triển khai

08/10/2026. Thiết kế và hành vi: [Module lịch sử nghe](../../design/MODULE_LICH_SU_NGHE.md).

## Đã triển khai

- Trang **Lịch sử nghe**, điều hướng máy tính / điện thoại và mục **Nghe tiếp** trên trang chủ.
- Bộ lọc đang nghe / đã nghe xong, tìm không dấu, thứ tự gần nhất, tải thêm, trạng thái trống và nút đọc kinh.
- Tiến độ có block nguồn và mốc giây; lưu định kỳ, lúc tạm dừng, tua khi đang tạm dừng và lúc rời trang.
- Đánh dấu hoàn tất trước khi chuyển hàng đợi / trọn bộ. Nghe lại bắt đầu từ đầu và quay về đang nghe.
- Vị trí riêng cho bản thu nhập; thông báo ngay trong module khi thiếu tệp. Không đổi sang giọng tổng hợp khi thiếu bản thu.
- Kế thừa tiến độ nghe cũ, đồng bộ / sao lưu hiện có, chọn tiến độ mới hơn khi khôi phục và cache giao diện ngoại tuyến.

## Kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| `tests/listening_history_check.py` | 11 nhóm kiểm tra: phát thật, nghe tiếp sau reload, lưu định kỳ, hoàn tất / hàng đợi, bản thu, tìm / lọc, responsive, đồng bộ, khôi phục, tải thêm, lỗi tải và kế thừa dữ liệu |
| `tests/audio_regression_suite.py` | 6 bộ trình duyệt đạt, gồm phục hồi audio, phát liên tục, trình phát chính, các module thư viện, đọc & nghe và lịch sử nghe |
| `tests/pocketbook_reader_check.py` | 10 nhóm kiểm tra đạt; xác nhận trình đọc, audio và trang lịch sử hoạt động sau reload ngoại tuyến |
| Manifest ngoại tuyến | 54 CSS / JS trong HTML khớp tài nguyên cache, không trùng |
| Cú pháp JavaScript | Các file đã sửa qua `node --check` |

Audio kiểm thử dùng WAV cục bộ, không gọi dịch vụ tổng hợp tiếng nói bên ngoài. Không có lỗi JavaScript trong các kiểm tra trình duyệt. Giao diện lịch sử được kiểm tra tại 320, 390, 768, 1024, 1440, 1920px trong cả ba chế độ màu.

Kết quả: [lịch sử nghe](../../../tests/artifacts/listening-history/results.json), [các bộ hồi quy audio](../../../tests/artifacts/audio-recovery/browser-regressions.json), [trình đọc](../../../tests/artifacts/pocketbook-reader/results.json).

Ảnh: [máy tính](../../../tests/artifacts/listening-history/history-1440-parchment.png), [điện thoại](../../../tests/artifacts/listening-history/history-390-parchment.png), [đã nghe xong](../../../tests/artifacts/listening-history/history-completed.png).

Lịch sử cũ chỉ có vị trí nghe, nên không suy diễn bản đã hoàn tất. Dữ liệu mới được lưu khi thực sự phát; bản thu vẫn cần tệp âm thanh trên thiết bị nghe.
