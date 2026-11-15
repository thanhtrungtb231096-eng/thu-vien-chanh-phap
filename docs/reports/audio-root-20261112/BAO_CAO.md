# Kiểm tra chức năng nghe — 12/11/2026

**Trạng thái: đã triển khai và kiểm thử trên local/VPS; các trường hợp trong ảnh đã phát và đổi giọng được.** Nguồn Microsoft vẫn có thể trả lỗi hoặc phản hồi chậm; không kết luận mọi đoạn kinh sẽ luôn phát ngay hoặc đã được gọi thử qua Microsoft.

Theo yêu cầu, chỉ giữ **Hoài My / Nam Minh**, gồm hai biến thể tốc độ có sẵn. Không triển khai Emma/Andrew, không cấu hình Azure, không tạo tài khoản hoặc dịch vụ tính phí.

## Các lỗi phần mềm đã sửa

- Giới hạn chờ âm thanh đầu tiên 8 giây có thể hủy yêu cầu hợp lệ. Tăng lên 25 giây; thời hạn toàn đoạn phù hợp với độ dài, tối đa 300 giây. Bộ theo dõi tiến độ tính cả lần thử đang chạy.
- SDK có thể kết thúc vòng đọc bình thường sau khi WebSocket bị ngắt, dù mới nhận một phần âm thanh. Kiểm tra số byte đã được SDK xác nhận bằng `turn.end`; thiếu xác nhận phải bỏ phần dở và thử lại.
- Chế độ mặc định tải và xác nhận **toàn bộ đoạn** trước khi phát. Yêu cầu `buffered=1` chờ trong cùng công việc và trả `202` khi còn tạo âm thanh, tránh việc trình duyệt hủy tải vì khoảng chờ giữa các phần.
- Chỉ phát và lưu từng phần truyền đã hoàn tất; phần tốt được dùng lại khi phần sau cần thử lại, giữ thứ tự và tránh lặp lời.
- Khi gặp `NoAudioReceived`, thử lại đúng giọng và tốc độ với cao độ chênh tối đa 2 Hz. Thử nghiệm có đối chứng cho thấy một số yêu cầu thất bại ở thông số ban đầu nhưng thành công ở thông số gần tương đương. Không đổi sang người đọc khác. Cách này cải thiện phục hồi, không bảo đảm dịch vụ luôn sẵn sàng.
- Luồng tải đầy đủ và luồng trực tuyến dùng cùng bộ tạo âm thanh. Dấu xác nhận và mã SHA-256 của bản đệm toàn đoạn ngăn tái sử dụng dữ liệu cũ chưa được kiểm tra hoặc khác giọng.
- Bản nghe ngoại tuyến cũ chưa có xác nhận đầy đủ sẽ được tạo lại khi tải chương. Sách, nguồn văn bản, bản thu nhập riêng và vị trí nghe được giữ lại.
- Chuẩn hóa ký tự PDF cũ như `Ƣ/ƣ/Ð` và ký tự điều khiển ở đầu vào giọng đọc, giữ nguyên bản kinh gốc.
- Danh sách giọng trực tuyến trên máy chủ và trình duyệt chỉ nhận hai giọng đã chọn. Đổi nam/nữ, tạm dừng, nghe tiếp và nhãn giọng có kiểm thử riêng.

## Triển khai và bảo toàn dữ liệu

- Local và VPS công khai cùng chạy `ux-20261010-129c6fc8d4c6`, giao thức âm thanh phiên bản 7.
- VPS: bản cập nhật cuối `audio-20261112-06`; 7 tệp thay đổi so với bản trung gian `05`; bộ áp dụng xác nhận chỉ mục và cơ sở dữ liệu cá nhân không đổi.
- Tệp quay lui VPS nằm ngoài thư mục ứng dụng: `/opt/thuvien-backups/audio-20261112-06`.
- Gói cập nhật chỉ có mã chương trình; không kèm sách hoặc cơ sở dữ liệu. Không tạo tệp sao lưu trong thư mục dự án.
- Hai máy chủ đã được kiểm tra mã băm của các tệp trình phát được phục vụ thực tế.

Bằng chứng: [triển khai](deployment.json), [trạng thái hai máy chủ](running-status.json).

## Kết quả kiểm thử

| Phạm vi | Kết quả và giới hạn |
| --- | --- |
| Đơn vị, HTTP, JavaScript | 79 kiểm thử qua; dùng bộ tạo âm thanh mô phỏng, không chứng minh dịch vụ Microsoft luôn hoạt động. |
| Trình duyệt | 8 bộ kiểm thử qua: đổi giọng, đệm trước, phục hồi, giữ vị trí, ngoại tuyến, lịch sử, điều hướng và giao diện điện thoại. Chạy lại riêng kiểm thử ngoại tuyến sau khi bổ sung nhãn chương cũ. |
| Toàn bộ bản Việt | 2.784 bản, 2.363.656 đoạn, tối đa 1.800 ký tự/đoạn; không có lỗi cấu trúc. Đây là rà soát bộ phân đoạn, không phải gọi Microsoft cho toàn bộ số đoạn. |
| Phát xuyên hai bản Mi Tiên | 3.159 và 1.154 đoạn, mỗi bản chạy hết với cả hai lựa chọn giọng: tổng 8.626 lượt đoạn, không lỗi hoặc bỏ đoạn, không đổi sang giọng khác. Dùng âm thanh mô phỏng và bỏ thời gian nghỉ biên tập; kiểm chứng luồng phát, không phải chất lượng giọng Microsoft. |
| Trình phát đã triển khai | Local và VPS qua đổi nam → nữ → nam tại cùng đoạn, giải mã Blob hoàn chỉnh; âm thanh được mô phỏng riêng trong trình duyệt kiểm thử. |
| Giọng thật, trước cơ chế phục hồi cùng giọng | 9/32 thành công, 23/32 thất bại, trên 8 trích đoạn từ 6 bản kinh thuộc 4 kho, cả hai giọng, local và VPS. |
| Giọng thật, sau cơ chế phục hồi cùng giọng | **29/32 thành công, 3/32 thất bại ở lần tạo công việc đầu tiên** với bộ đệm thư viện trống. Mỗi công việc có tối đa 4 lần thử cho từng phần truyền. Lần tải thành công chậm nhất: **85,093 giây**. |
| Chạy lại ba ca còn trượt | **3/3 qua** luồng `AudioService.prepare/download` thực tế trên bản đã triển khai; giải mã đầy đủ và đúng giọng. Có thể dùng lại phần âm thanh đã được xác nhận; đây là lần chạy lại sau bộ thử trống, không phải phép thử trống mới. |
| Đúng trường hợp trong ảnh, giọng thật | Cả local và VPS công khai: chọn đúng đoạn 2/3.159, 498 ký tự; nam → nữ → nam, giải mã âm thanh, giữ đoạn, tạm dừng/nghe tiếp và giữ lựa chọn Nam Minh sau tải lại trang đều qua. |

Bộ thử giọng thật cuối dùng đúng mã bản `129c6fc8d4c6` và `buffered=1` trong khu thử tách biệt. Các tệp MP3 thành công đều được giải mã toàn bộ và kiểm tra không im lặng. Hai lượt trước/sau diễn ra nối tiếp khi dịch vụ Microsoft cũng có thể thay đổi trạng thái, nên số liệu không phải phép đo đối chứng để quy toàn bộ mức tăng cho một thay đổi mã.

Ở lượt trước cơ chế phục hồi, bản thử VPS chưa có tham số chờ toàn đoạn mới; các luồng bị cắt đều bị kiểm tra trạng thái và đánh trượt, không được tính thành công. Ba ca chạy lại cuối không còn lỗi; điều này không biến ba lần thất bại trước thành thành công trong bảng số liệu trống.

- [79 kiểm thử đơn vị/HTTP](../../../tests/artifacts/audio-root-20261112/unit-http-final.json)
- [8 bộ trình duyệt](../../../tests/artifacts/audio-recovery/browser-regressions.json)
- [Rà soát toàn thư viện](../../../tests/artifacts/audio-fix-20261111/corpus.json)
- [Phát hết bản 3.159 đoạn, hai giọng](../../../tests/artifacts/audio-root-20261112/full-playback-phucminh.json)
- [Phát hết bản 1.154 đoạn, hai giọng](../../../tests/artifacts/audio-root-20261112/full-playback-ebooks.json)
- [Kiểm thử trình phát đã triển khai](../../../tests/artifacts/audio-root-20261112/deployed-player-smoke.json)
- [Giữ giọng và kiểm tra bản ngoại tuyến cũ](../../../tests/artifacts/audio-root-20261112/voice-integrity-runtime.json)
- [Chờ hoàn tất cả đoạn](../../../tests/artifacts/audio-root-20261112/long-buffered.json)
- [Tải lại sau khi phần sau thất bại](../../../tests/artifacts/audio-milinda-20261112/long-retry.json)
- [32 phép thử giọng thật trước cơ chế phục hồi](../../../tests/artifacts/audio-root-20261112/cold-main-only.json)
- [32 phép thử giọng thật sau cơ chế phục hồi](../../../tests/artifacts/audio-root-20261112/cold-main-recovery.json)
- [Chạy lại ba ca còn trượt qua trình phát thực tế](../../../tests/artifacts/audio-root-20261112/failed-client-replay.json)
- [Trường hợp trong ảnh: local, giọng thật](../../../tests/artifacts/audio-root-20261112/local-final-phucminh-ui.json)
- [Trường hợp trong ảnh: VPS công khai, giọng thật](../../../tests/artifacts/audio-root-20261112/vps-final-phucminh-ui.json)
- [Đối chứng tham số giọng, không đổi người đọc](../../../tests/artifacts/audio-root-20261112/prosody-live.json)

## Phần chưa giải quyết được

Microsoft vẫn có thể trả `NoAudioReceived` trên các văn bản hợp lệ. Kiểm thử trực tiếp SDK với văn bản đối chứng cũng tái hiện; chỉ thay đổi độ dài, ngôn ngữ SSML hoặc tốc độ không khắc phục được. Cơ chế mới giúp nhiều trường hợp phục hồi với cùng người đọc; vẫn còn ba lần tạo công việc đầu tiên thất bại trong bộ thử trống cuối, trước khi chạy lại thành công. Không dùng các đoạn phát được để kết luận toàn thư viện sẽ luôn ổn định.

Dịch vụ Edge TTS hiện tại không có cơ chế để ứng dụng buộc Microsoft trả âm thanh khi nguồn này gián đoạn. Các sửa đổi bảo vệ tính đầy đủ, giọng đã chọn, vị trí nghe và phục hồi trong ứng dụng; chúng không tạo ra một nguồn Hoài My/Nam Minh độc lập. Người dùng đã chọn không đổi giọng và chưa có tài nguyên Azure, vì vậy không tự thay nguồn hoặc kích hoạt dịch vụ trả phí.

Vấn đề tương tự được báo cáo tại [edge-tts #512](https://github.com/rany2/edge-tts/issues/512). Bằng chứng đánh giá cho thư viện này vẫn là các phép thử thực tế được liên kết phía trên.

Các thử nghiệm Emma/Andrew trước khi người dùng từ chối không được tính vào kết quả nghiệm thu này.
