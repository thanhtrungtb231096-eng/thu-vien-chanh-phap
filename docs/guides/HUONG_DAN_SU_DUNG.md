# Thư Viện Chánh Pháp — Tàng Kinh Thanh Tịnh 5.0

## Bắt đầu nhanh

1. Nhấp đúp **MO_THU_VIEN.cmd** trong thư mục gốc.
2. Ở **Khám phá**, nhập tên kinh vào ô tra cứu (có thể gõ không dấu), hoặc chọn một trong bốn bản kinh được giới thiệu.
3. Bấm **Đọc kinh** để mở bản Việt, hoặc **▶ Nghe** để mở và phát giọng đọc trực tiếp.
4. Trong danh mục, chọn **Thể loại / Bộ kinh** để lọc. **Bản khác & PDF** chứa các bản để đối chiếu. **Lưu kinh** đưa tác phẩm vào tủ sách riêng.

Nếu vẫn thấy giao diện cũ, nhấn **Ctrl+F5** để tải lại.

Trên điện thoại, bấm **Menu** ở góc trên để chọn kho kinh, tủ sách, các công cụ tu học, chuông hoặc chế độ màu. Tại trang chủ, **Bộ lọc kho kinh & ngôn ngữ** mở các tùy chọn tra cứu; lịch sử **Trang kinh đang đọc** xuất hiện sau lần đọc đầu tiên.

Trong trình đọc trên điện thoại, **Tùy chọn** chứa Bản Việt/Hán văn/Đối chiếu/Khảo chứng, đánh dấu, tập trung, tìm & ghi chú và thiết lập đọc. **A− / A+** điều chỉnh chữ trực tiếp. Nhấn **Ngữ cảnh kinh điển** để xem thông tin giới thiệu tác phẩm.

Bảng nghe mở ở dạng gọn; bấm **Tùy chọn** trong bảng nghe để chọn giọng, tốc độ và hẹn dừng. Khi nghe trọn bộ, **Chi tiết** mở danh sách/thời gian; **Nghe kinh** trên thanh tiêu đề mở thiết lập giọng. Đóng bảng thiết lập sẽ trở về trình nghe trọn bộ. Đóng trình đọc sẽ dừng nghe.

## Mở thư viện và nghe kinh

**Cách đơn giản:** nhấp đúp **`MO_THU_VIEN.cmd`** trong thư mục gốc. Tệp này kiểm tra máy chủ, tự khởi động nếu cần và mở trình duyệt đúng địa chỉ. Không mở trực tiếp `app/web/index.html`.

Nếu đã mở bằng `file://`, trang sẽ giải thích nguyên nhân và hiện nút **Mở thư viện đầy đủ**. Trong trình đọc, nút này chuyển đến đúng tác phẩm đang chọn. Hãy dùng **Xuất ghi chú ở địa chỉ này** trước khi chuyển nếu bạn đã lưu ghi chú ở địa chỉ tệp cũ.

Chạy từ thư mục gốc `E:\Kinh điển phật giáo`:

```powershell
python -X utf8 app/server.py
```

Mở **http://127.0.0.1:8090/web-thuvien/index.html**. Máy chủ chỉ lắng nghe trên máy cục bộ. Cổng 8090 tách khỏi máy chủ tĩnh cũ ở cổng 8088. Giữ cửa sổ máy chủ hoạt động trong khi dùng thư viện.

Các gói cần cho giọng đọc đã được cài trong `local/runtime/python/` của workspace này. Khi chuyển ứng dụng sang máy khác, có thể cài riêng vào thư mục dự án:

```powershell
python -m pip install --target local/runtime/python -r config/requirements-audio.txt
```

Nếu dùng `uv`:

```powershell
uv --cache-dir local/storage/cache/work pip install --target local/runtime/python -r config/requirements-audio.txt
```

Ứng dụng vẫn đọc được với máy chủ HTTP tĩnh; giọng trực tuyến yêu cầu máy chủ `server.py`. Không mở trực tiếp `index.html` bằng giao thức `file://` vì trình duyệt có thể chặn tải các tệp kinh.

## Đọc và điều chỉnh mục lục

- **Mục lục**: tìm không dấu, mở/thu gọn nhánh, chọn chỉ mục lớn, kéo đường phân cách hoặc dùng nút −/+ để đổi độ rộng.
- **A− / A+**: giảm/tăng chữ ngay trên thanh đọc. **Aa Kiểu đọc**: giãn dòng, khoảng cách đoạn, chiều rộng, chủ đề, cách căn chữ và kiểu chữ. Chọn phần đọc Ngắn/Vừa/Dài hoặc Cuộn liên tục.
- **Phần trước / Phần tiếp** và phím mũi tên: chuyển phần đọc. `/` hoặc `Ctrl+K` trong trình đọc mở tìm kiếm toàn bài kinh, kể cả các phần chưa hiển thị.
- Nhấn vào đoạn kinh để chọn; **Đánh dấu** lưu đoạn đó. Trong **Tìm & ghi chú**, nhập ghi chú gắn với đoạn và mở lại các dấu trang. Trên điện thoại, nút **Đánh dấu đoạn đang chọn** nằm trong bảng này.
- **Đọc tiếp** lưu theo định danh đoạn, tách riêng bản Việt, Hán và đối chiếu. Thay đổi cách chia phần không thay đổi mã đoạn.
- **Đối chiếu**: mục lục chính điều hướng bản Việt; ô chọn phía Hán điều hướng riêng. Hệ thống không tự suy đoán hai đoạn là bản dịch tương ứng.
- **Tập trung** đóng các bảng bên. **Chế độ tụng** tăng cỡ chữ; cuộn tự động có ba tốc độ, dừng khi cuộn chuột hoặc đóng trình đọc.

Trong **Aa Kiểu đọc → Hiệu chỉnh mục lục**, chọn đoạn cần làm đầu mục, nhập tên và cấp mục, bấm **Xem trước**. Có thể gộp với phần trước, hoàn tác hoặc xem trước cấu trúc mặc định. Bấm **Lưu cấu trúc** để giữ thay đổi. Xuất/nhập JSON chỉ chấp nhận đúng tác phẩm, bản ngôn ngữ và phiên bản văn bản.

Mục được tạo để thuận tiện đọc gọi là **Phần đọc**. Mọi hiệu chỉnh mục lục được lưu riêng; các tệp kinh gốc không bị chỉnh sửa. Khi nguồn thay đổi, cấu trúc không khớp sẽ không tự áp dụng. Mục lục tự nhận diện từ tiêu đề cần được người quản lý xem lại với tài liệu có OCR hoặc cách phân chương bất thường.

## Nghe tiếng Việt như audiobook

Chọn **▶ Nghe** ở trang chủ/danh mục/kết quả, hoặc **Nghe kinh** trong trình đọc. Giọng đọc bắt đầu khi bản Việt tải xong:

1. Chọn **Hoài My · Nữ** hoặc **Nam Minh · Nam** cho giọng trực tuyến. Có thể chọn giọng tiếng Việt trên thiết bị nếu trình duyệt cung cấp.
2. Nếu trình duyệt yêu cầu thao tác cho phép âm thanh, bấm **Phát tiếng Việt**. Có thể **Nghe thử** và điều chỉnh tốc độ 0,65–1,4×.
3. Tạm dừng/nghe tiếp, lùi hoặc tiến đoạn, kéo thanh vị trí và đặt hẹn dừng 15/30/60 phút.
4. Bật **Theo đoạn đang nghe** để vùng đọc theo âm thanh. Mở **Đoạn kinh đang nghe** để xem nội dung phát. Trong **Tìm & ghi chú**, **Nghe từ đoạn đã chọn** bắt đầu tại đoạn Việt đang chọn.
5. Đóng trình đọc sẽ dừng âm thanh và lưu chỗ nghe dở. Lần sau mở lại cùng kinh có thể nghe tiếp.

Giọng trực tuyến dùng dịch vụ giọng nói của Microsoft qua thư viện `edge-tts`, cần Internet và gửi đoạn kinh cần tổng hợp đến dịch vụ. Âm thanh đã tạo được lưu đệm trong `local/storage/cache/audio/`, giới hạn khoảng 256 MiB. Đổi giọng sẽ tạo âm thanh cho giọng mới. Đây là đọc tổng hợp, không phải bản thu của người tụng kinh; chất lượng phát âm thuật ngữ và ngắt câu phụ thuộc giọng cùng chất lượng văn bản nguồn.

Chế độ nghe luôn lấy **bản tiếng Việt** kể cả khi đang xem Hán văn. Không tự dịch các kinh chưa có bản Việt. Phần metadata, chú thích được nhận diện và chữ Hán được loại khỏi luồng nghe; văn bản đọc vẫn hiển thị nguyên bản. Kinh có chú thích OCR chưa nhận diện được cần hiệu chỉnh nguồn theo quy trình học thuật trước khi kỳ vọng bản nghe hoàn toàn sạch.

Khi mạng lỗi, trình nghe hiển thị thông báo và giữ đoạn hiện tại. Kiểm tra Internet, bảo đảm đã mở **MO_THU_VIEN.cmd**, rồi bấm **Kết nối lại**. Giọng thiết bị chỉ được dùng nếu ngôn ngữ là tiếng Việt. Một số thiết bị có thể tạm ngừng phát khi khóa màn hình; bản này chưa cam kết phát nền như ứng dụng audiobook native. Giọng thiết bị nghe tiếp từ đầu đoạn ngắn; giọng trực tuyến có thể tiếp tục từ vị trí thời gian trong đoạn.

## Chia sẻ thư viện qua Cloudflare Tunnel

Bạn có thể chia sẻ tạm thời thư viện để bạn bè cùng đọc và nghe kinh trên điện thoại hoặc máy tính khác thông qua Cloudflare Quick Tunnel (miễn phí, không cần tài khoản hay tên miền riêng).

### 1. Cơ chế bảo mật máy chủ chia sẻ
- **Danh sách trắng tệp (Whitelist)**: Máy chủ chỉ cung cấp giao diện web (`web-thuvien/`) và nội dung kinh văn (`Dai_Tang_Kinh_Han/`, `Dai_thua/`). Mọi thư mục runtime (`local/runtime/python`), bộ đệm âm thanh (`local/storage/cache/audio`), tệp nén sao lưu (`web-thuvien.zip`), mã nguồn kịch bản (`*.py`, `*.cmd`), bộ kiểm thử và tài liệu nội bộ đều bị chặn (trả về 404).
- **Kiểm soát tên miền (Host/Origin)**: Máy chủ từ chối mọi yêu cầu từ các trang web lạ hoặc không nằm trong danh sách được phép. Tên miền chia sẻ được cấu hình tại tệp `web-thuvien/allowed_hosts.txt` (mặc định chấp nhận mọi liên kết `*.trycloudflare.com`). Bạn cũng có thể khởi động với cờ `--share` hoặc `--allow-host <ten-mien>`.

### 2. Các bước thực hiện
1. **Khởi động máy chủ**: Mở PowerShell tại thư mục gốc, chạy:
   ```powershell
   python -X utf8 app/server.py
   ```
   *(Hoặc nhấp đúp vào `MO_THU_VIEN.cmd`).*
2. **Mở đường dẫn Tunnel**: Mở thêm một cửa sổ PowerShell riêng và chạy:
   ```powershell
   cloudflared tunnel --url http://127.0.0.1:8090
   ```
   Cloudflare sẽ cấp một đường dẫn ngẫu nhiên dạng: `https://ten-ngau-nhien.trycloudflare.com`.
3. **Gửi liên kết cho bạn bè**:
   ```text
   https://ten-ngau-nhien.trycloudflare.com/web-thuvien/index.html
   ```
4. **Lưu ý khi chia sẻ**:
   - Máy tính của bạn cần duy trì mở, có kết nối Internet và không vào chế độ Sleep (ngủ).
   - Dịch vụ tổng hợp âm thanh giới hạn tối đa 2 yêu cầu xử lý giọng đọc đồng thời; nếu nhiều người cùng bấm nghe một lúc có thể nhận thông báo đang bận và cần thử lại sau vài giây.
   - Khi muốn dừng chia sẻ, nhấn `Ctrl+C` trong cửa sổ chạy `cloudflared`.

## Tủ sách và sao lưu

Nhấn **Lưu kinh** trên thẻ để thêm vào **Tủ sách**. Các dữ liệu đọc/nghe, ghi chú, mục lục cá nhân và tùy chọn được lưu trong trình duyệt. Dùng **Xuất bản sao lưu** để tạo tệp JSON; nhập sẽ hợp nhất với dữ liệu hiện có, ưu tiên dữ liệu cục bộ khi trùng khóa. Ghi chú từng kinh có thể xuất Markdown.

Dữ liệu trình duyệt gắn với địa chỉ truy cập. `localhost:8088`, `127.0.0.1:8088` và `127.0.0.1:8090` là các nơi lưu khác nhau. Để chuyển dữ liệu từ phiên bản cũ: mở thư viện ở địa chỉ cũ, dùng nút xuất sao lưu đã nâng cấp, rồi nhập tại địa chỉ mới. Dấu trang cũ dùng pixel được giữ trong sao lưu và chuyển thành dấu trang cần xác định lại vị trí; không có phép chuyển pixel sang đoạn chính xác khi bố cục đã thay đổi.

## Kiểm thử và phạm vi

```powershell
node tests/reader-model.test.cjs
node tests/sutra-formatter.test.cjs
python -X utf8 tests/audio_check.py
python -X utf8 tests/experience_check.py
python -X utf8 tests/acceptance.py
```

Kiểm thử trình duyệt cần Playwright và Chromium; các script hiện dùng Chromium đã có trên máy phát triển. Ảnh nghiệm thu và báo cáo nằm trong `tests/artifacts/`.

Phiên bản này gồm tìm toàn văn **trong bài kinh đang mở**. Tìm toàn văn toàn kho, PWA ngoại tuyến, đồng bộ đám mây và audio tụng thu âm là các đợt mở rộng riêng.

Tham chiếu kỹ thuật: [Web Speech API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [edge-tts](https://github.com/rany2/edge-tts).
