# Hợp nhất thanh điều khiển đọc và nghe

Triển khai 08/10/2026, thu gọn ngày 09/10/2026, giao diện cục bộ `app/web/`.

## Vấn đề và lựa chọn thiết kế

Trước đây `persistent-player` nằm ngoài trình đọc, còn `audio-panel` có bộ nút riêng trong trình đọc. Cả hai điều khiển cùng `Audiobook`, nhưng khác bố cục, mức chi tiết và nơi mở tùy chọn. Nút chuyển trang và chuyển đoạn nghe nằm ở hai thanh gần nhau. Việc chuyển thư viện / đọc / toàn màn hình phải đổi giữa các bộ điều khiển.

Thiết kế mới dùng **một thành phần trình phát**, đổi vị trí theo ngữ cảnh. Nhóm đọc và nghe cùng nằm trong một bề mặt cuối trang; giữ nhãn và hành vi riêng vì trang đọc thay đổi theo màn hình/cỡ chữ, còn đoạn nghe thuộc bản văn. Thời gian trên thanh tua luôn là thời gian **trong đoạn hiện tại**.

Hướng thiết kế dựa trên yêu cầu có nhãn rõ, điều khiển bằng bàn phím và trạng thái có thể nhận biết của [W3C WAI — Media Players](https://www.w3.org/WAI/media/av/player/). Các nút chính và công tắc có vùng bấm ít nhất 44px để dễ thao tác; mức tối thiểu của [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) là 24px hoặc đáp ứng ngoại lệ khoảng cách. Đây là quyết định thiết kế có kiểm tra chức năng và bố cục; chưa phải kết quả nghiên cứu người dùng có đối chứng.

## Bố cục và thao tác

| Ngữ cảnh | Bố cục và hành vi |
| --- | --- |
| Thư viện trên máy tính | Cao 84px, tên kinh / trạng thái ở trái; nghe lại từ đầu, chuyển đoạn + lùi/tiến 10 giây + phát/dừng và thanh thời gian ở giữa; Bản đọc / lời kinh / hàng đợi / tùy chọn ở phải. Nút lùi/tiến 10 giây chỉ hiện trên 1100px; màn hình nhỏ hơn dùng thanh thời gian |
| Thư viện trên điện thoại | Cao 88px, tên kinh / trạng thái, nghe lại từ đầu / phát-dừng / đoạn tiếp, Bản đọc / tùy chọn; thanh tua bên dưới. Dưới 375px, tên kinh có hàng riêng và thanh cao 106px. Hàng đợi và lời kinh có trong tùy chọn |
| Chỉ đọc, chưa có phiên nghe | Thanh nhỏ với trang trước / chỉ báo trang & phần / trang tiếp. Bấm Nghe kinh để bắt đầu |
| Đọc và nghe trên máy tính | Một hàng cao 64px: điều hướng trang bên trái; chuyển đoạn / phát-dừng cạnh trạng thái và thanh thời gian ở giữa; Nghe từ đây / Tùy chọn bên phải |
| Đọc và nghe trên điện thoại | Hai hàng gọn, tổng 108px: điều hướng trang ở trên; chuyển đoạn / phát-dừng cạnh trạng thái và thời gian ở dưới; Tùy chọn ở góc phải |
| Toàn màn hình | Cùng thanh và bảng tùy chọn; thoát toàn màn hình giữ nguyên audio |
| Đọc một kinh, nghe kinh khác | Thanh ghi tên bản kinh thực sự đang nghe. Theo lời kinh bị vô hiệu hóa; Nghe từ đây chuyển sang bản Việt của trang đang đọc |

- **Trang trước / Trang tiếp** chỉ đổi trang hoặc phần đọc. **Đoạn trước / Đoạn sau** chỉ đổi đoạn nghe; đoạn sau dùng hết bản hiện tại rồi mới lấy bản kế tiếp trong hàng đợi.
- Khi đang nghe, chuyển đoạn tiếp tục phát. Khi tạm dừng, chuyển đoạn giữ tạm dừng.
- **Bản đọc** trên thanh ngoài trình đọc mở bản Việt của kinh đang nghe tại block và vị trí văn bản tương ứng. Phiên audio, trạng thái phát/tạm dừng, đoạn và số giây được giữ nguyên; tiêu điểm chuyển đến vùng đọc. Với bản thu không có liên kết văn bản, mở vị trí đọc đã lưu. Nút bị vô hiệu hóa nếu chưa chọn kinh hoặc kinh không có bản Việt.
- **Nghe lại từ đầu** (vòng mũi tên trước các nút phát) phát lại toàn bộ bản đang nghe từ đoạn đầu / giây 0, xóa vùng lặp A–B, giữ giọng, tốc độ, âm lượng, hẹn giờ và hàng đợi. Khi trong trang đọc, cùng nút nằm trong Tùy chọn. Bản thu cũng bắt đầu lại từ đầu file.
- Nút **Nghe kinh** đầu trang bắt đầu nghe. Khi đã có phiên nghe tương ứng, nút trở thành **Điều khiển nghe**, đưa tiêu điểm đến nút phát/dừng trong thanh chung.
- **Nghe từ đây** chọn đoạn theo văn bản đang thấy. **Theo lời kinh** chỉ hoạt động khi đang đọc bản Việt/đối chiếu tương ứng; bản thu không có liên kết block văn bản nên không bật đồng bộ chữ.
- **Theo lời kinh** nằm trong Tùy chọn ở mọi màn hình. Trên điện thoại, **Nghe từ đây** cũng nằm trong Tùy chọn; bấm nút sẽ đóng bảng và bắt đầu nghe đúng vị trí đọc. Cùng các node nút/công tắc được giữ khi đổi kích thước màn hình.
- **Tùy chọn** dùng chung một bộ chọn giọng, tốc độ, hẹn giờ và âm lượng. Nghe lại, lặp A–B, lưu kinh, âm thanh, lời kinh và hàng đợi nằm tại đây. **Phẩm & vị trí nghe** mở lựa chọn phần và đoạn; **Đọc từ đoạn nghe** đóng tùy chọn, tạm dừng và đưa về văn bản.
- Bản thu nhập dùng cùng thanh và bảng tùy chọn; bộ chọn giọng tổng hợp và nghe thử giọng bị vô hiệu hóa khi đang nghe bản thu.
- Điều hướng phím trang không đổi trang khi tiêu điểm đang ở nhóm audio; Space trên nút phát/dừng hoạt động theo nút. Các input/select giữ thao tác bàn phím gốc. Tab trong trình đọc bao gồm thanh chung, bảng tùy chọn có vòng tiêu điểm của dialog và Escape đóng dialog trước.

## Triển khai

- `PersistentPlayer.mountReader()` chuyển **cùng node DOM** của thanh, bảng tùy chọn và màn hình lời kinh vào trình đọc; khi đóng đọc, chuyển về trang thư viện. Không tạo thêm Audio, không nạp lại đoạn vì thay đổi giao diện.
- `reader-footer-inner` trở thành nhóm điều hướng đọc bên trong thành phần chung. Không còn `audio-panel`, `audio-play`, `audio-previous`, `audio-next`, `audio-expand`, `audio-close`.
- Bộ `audio-voice` / `audio-rate` / `audio-sleep` chuyển từ trình đọc vào bảng chung, giữ các trình xử lý và dữ liệu đã lưu. Không còn các bản sao `dp-voice` / `dp-rate` / `dp-sleep`.
- `Audiobook` cập nhật trạng thái và các tùy chọn; `PersistentPlayer` là nơi hiển thị nút phát và tiến độ. Các input đang tương tác được giữ giá trị để tránh ghi đè thao tác tua/chọn phần.
- `unified-player.css` định nghĩa bố cục thư viện / trình đọc / điện thoại. Loại bỏ các quy tắc ẩn trình phát trong toàn màn hình và trừ thêm chiều cao của trình phát ngoài.
- Cache giao diện `cp-shell-v34-player-actions`; PersistentPlayer `5-actions`, CSS chung `3-actions`, manifest ngoại tuyến đồng bộ. Nút phát tăng lên 48px, các nút thao tác khác giữ vùng bấm 44px.

## Kiểm tra

`tests/unified_player_check.py` kiểm tra một node trình phát, giữ phiên nghe qua mở/đóng/chuyển sách, điều hướng đọc/nghe riêng, một bộ tùy chọn, bàn phím, toàn màn hình, vùng bấm và khoảng cách tại 320–1920px trong ba chế độ màu. Kiểm tra Bản đọc khi đang phát/tạm dừng, đúng sách/block/thời gian/source; nghe lại từ đầu xóa vùng A–B và giữ tùy chọn. Bản thu kiểm tra giữ vị trí đọc đã lưu và phát lại từ đầu file. Văn bản thử có nhiều trang và đoạn dài; có thêm bản Thanh Tịnh Đạo và Kinh Trường Bộ thực tế. Thanh đọc/nghe đo được 64px trên máy tính và 108px trên điện thoại; nút phát 48px và các nút còn lại ít nhất 44px.

Kết quả và ảnh nằm ở `tests/artifacts/unified-player/`. Các kiểm tra đọc, phát liên tục, lỗi mạng, hàng đợi, bản thu, lịch sử và ngoại tuyến được cập nhật sang bộ điều khiển chung. Audio kiểm tra là WAV cục bộ; chưa đo độ trễ dịch vụ giọng đọc hoặc kiểm thử Safari/iPhone thật.

Xem [báo cáo triển khai và ảnh giao diện](../reports/unified-player/BAO_CAO.md).
