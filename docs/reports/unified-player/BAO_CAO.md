# Thanh điều khiển đọc và nghe dùng chung

09/10/2026 — cập nhật bản hợp nhất trong `app/web/`: tăng nhẹ kích thước thanh/nút phát, thêm Bản đọc và đưa Nghe lại từ đầu ra thanh ngoài trang đọc. Khi mở trang đọc, cùng thành phần trình phát nằm trong chân trang và chứa điều hướng đọc; khi trở về thư viện, trình phát trở lại vị trí của thư viện. Chuyển giao diện giữ nguyên phiên nghe và thời gian phát.

Thiết kế và cơ sở lựa chọn: [Hợp nhất thanh đọc và nghe](../../design/HOP_NHAT_THANH_DOC_NGHE.md).

## Hành vi đã triển khai

- Chưa nghe: chân trang chỉ có trang trước, vị trí đọc và trang tiếp. **Nghe kinh** bắt đầu nghe trực tiếp.
- Đang đọc và nghe trên máy tính: một hàng gồm điều hướng trang, phát/dừng và chuyển đoạn, trạng thái và thời gian, **Nghe từ đây** và **Tùy chọn**. Điện thoại dùng hai hàng gọn. Chuyển trang không tua audio; chuyển đoạn nghe giữ trạng thái đang phát hoặc tạm dừng.
- **Theo lời kinh** nằm trong Tùy chọn. Trên điện thoại, **Nghe từ đây** cũng chuyển vào đây; thao tác tự đóng bảng khi bắt đầu nghe. Bộ nút và thanh tua không chồng lên nhau.
- Một bộ chọn giọng, tốc độ, hẹn giờ và âm lượng. Các thao tác nghe lại, lặp, lưu kinh và hàng đợi có trong tùy chọn.
- Ngoài trang đọc, **Bản đọc** mở đúng bản Việt và vị trí đoạn đang nghe; giữ trạng thái phát/tạm dừng, đoạn, số giây và nguồn audio. Nút có biểu tượng quyển sách, nhãn trên máy tính và tên truy cập **Trở lại bản đọc**. Tiêu điểm chuyển vào vùng đọc sau khi tải xong.
- **Nghe lại từ đầu** có nút vòng mũi tên ngay trước nhóm phát ngoài trình đọc. Thao tác phát lại toàn bộ kinh từ đoạn đầu, bỏ vùng lặp A–B, giữ giọng/tốc độ/âm lượng/hẹn giờ/hàng đợi. Trong trang đọc, cùng nút chuyển vào Tùy chọn.
- Bản thu mở vị trí đọc đã lưu vì chưa có liên kết đoạn với văn bản; audio tiếp tục giữ file/phẩm/thời gian. Nghe lại từ đầu phát lại file từ giây 0.
- Khi đọc kinh khác với bản đang nghe, thanh ghi tên bản thực sự đang phát. **Nghe từ đây** chuyển sang trang đang đọc; đồng bộ lời kinh chỉ bật khi có văn bản tương ứng.
- Bàn phím, toàn màn hình, bản thu, hàng đợi, lịch sử và vị trí đọc/nghe tiếp tục dùng phiên audio hiện tại.
- Giữ phân trang cho đoạn dài, vị trí văn bản qua thay đổi cỡ chữ, đổi màn hình và đóng/mở trình đọc.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| `tests/unified_player_check.py` | 10 nhóm đạt: cùng node trình phát, điều hướng đọc/nghe độc lập, tùy chọn dùng chung, trở lại đúng đoạn đọc khi phát/tạm dừng bằng chuột và bàn phím, nghe lại toàn kinh giữ tùy chọn/hàng đợi, bản thu, bố cục, toàn màn hình và hai sách thực tế |
| `tests/audio_regression_suite.py` | 7 bộ trình duyệt đạt: phát liên tục, phục hồi audio, trình phát, module thư viện, đọc/nghe, lịch sử và thanh hợp nhất |
| `tests/pocketbook_reader_check.py` | 10 nhóm đạt, gồm phân trang đoạn dài, lưu vị trí trong đoạn, thay đổi bố cục và ngoại tuyến |
| `tests/reader_fullscreen_check.py` | 6 nhóm đạt: API toàn màn hình, thoát bằng các cách, API bị từ chối/không hỗ trợ và giữ phiên nghe |
| Mô hình đọc và chia đoạn nghe | Hai bộ Node đạt với kinh thực tế, gồm văn bản Trường A-Hàm dài hơn 1,2 triệu ký tự |
| Cú pháp và manifest | PersistentPlayer và service worker qua `node --check`; 55 tham chiếu CSS/JS tồn tại và khớp phiên bản cache ngoại tuyến |

Nút phát có vùng bấm 48×48px, các nút chính còn lại ít nhất 44×44px. Kiểm tra ba màu nền tại 320, 390, 768, 1024, 1440 và 1920px xác nhận không tràn ngang, không chồng điều khiển, nội dung đọc nằm phía trên thanh chung. Thanh thư viện được kiểm tra thêm ở 820, 1100 và 1200px. Dưới 375px, tên kinh/trạng thái có hàng riêng, tránh bị ép nhỏ giữa các nút.

| Màn hình | Thanh đọc/nghe | Thanh ngoài trình đọc |
| --- | --- | --- |
| Máy tính / máy tính bảng từ 768px | 64px | 84px |
| Điện thoại 390px | 108px | 88px |
| Điện thoại 320px | 108px | 106px, tên kinh ở hàng riêng |

Liên kết sách được cung cấp mở **Thanh Tịnh Đạo** (`ep-ebda2b7dd811`). Kiểm tra thêm **Kinh Trường Bộ** trong ảnh (`ep-2b3de2ffb41b`), bắt đầu nghe từ phần đọc thứ 37. Cả hai dùng văn bản thật và cùng thanh thu gọn ở 1440/390px.

Các kiểm tra phát liên tục dùng sự kiện kết thúc thật của Audio: tự chuyển đoạn/phẩm, chuyển kinh trong hàng đợi, hủy khi tạm dừng và phục hồi lỗi ở vị trí đã lưu. Audio là WAV cục bộ được chặn trong trình duyệt; không gọi dịch vụ tổng hợp tiếng nói bên ngoài. Không có lỗi JavaScript trong các lượt kiểm tra trình duyệt.

## Ảnh và dữ liệu

- [Thanh mới trên máy tính](../../../tests/artifacts/unified-player/player-1440.png)
- [Thanh mới trên điện thoại](../../../tests/artifacts/unified-player/player-390.png)
- [Trang đọc trên máy tính](../../../tests/artifacts/unified-player/reader-1440-parchment.png)
- [Trang đọc trên điện thoại](../../../tests/artifacts/unified-player/reader-390-parchment.png)
- [Thư viện trên máy tính, có Bản đọc và Nghe lại từ đầu](../../../tests/artifacts/unified-player/library-1440.png)
- [Thư viện trên điện thoại](../../../tests/artifacts/unified-player/library-390.png)
- [Thư viện trên màn hình 320px](../../../tests/artifacts/unified-player/library-320.png)
- [Kinh Trường Bộ trên máy tính](../../../tests/artifacts/unified-player/truong-bo-1440-night.png)
- [Kinh Trường Bộ trên điện thoại](../../../tests/artifacts/unified-player/truong-bo-390-night.png)
- [Thanh Tịnh Đạo từ liên kết được cung cấp](../../../tests/artifacts/unified-player/thanh-tinh-dao-1440-night.png)
- [Tùy chọn trên điện thoại](../../../tests/artifacts/unified-player/options-390.png)
- [Bố cục và thao tác thanh chung](../../../tests/artifacts/unified-player/results.json)
- [Kết quả 7 bộ hồi quy](../../../tests/artifacts/audio-recovery/browser-regressions.json)
- [Phân trang và ngoại tuyến](../../../tests/artifacts/pocketbook-reader/results.json)
- [Toàn màn hình](../../../tests/artifacts/reader-fullscreen/results.json)

Ảnh `reader-*` dùng văn bản thử dài để kiểm tra phân trang; ảnh Trường Bộ và Thanh Tịnh Đạo dùng bản sách thực tế. Kết quả thuộc Chrome/Chromium trên Windows; chưa kiểm thử Safari/iPhone thật hoặc thực hiện nghiên cứu người dùng có đối chứng. Cache giao diện đã tăng lên `cp-shell-v34-player-actions`, PersistentPlayer `5-actions`, CSS chung `3-actions`, manifest ngoại tuyến khớp. Bản này được sửa và kiểm tra tại thư viện cục bộ.
