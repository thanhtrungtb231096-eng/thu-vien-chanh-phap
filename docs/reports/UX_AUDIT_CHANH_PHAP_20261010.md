# Đánh giá UI/UX và chất lượng phần mềm Thư viện Chánh Pháp

Ngày đánh giá: **10/10/2026**. Phạm vi: bản mã và dữ liệu trong thư mục làm việc hiện tại.

**Kết luận:** thư viện có nền tảng công năng tốt và bản sắc thị giác rõ. Tuy nhiên, trải nghiệm hiện tại còn lỗi trong thao tác đọc bằng bàn phím, điều hướng Back, tên truy cập của điều khiển nghe và chất lượng thông tin đầu sách. Chưa đủ bằng chứng để coi sản phẩm đã tối ưu cho cộng đồng trên mọi thiết bị.

Điểm tổng quan theo nhận định chuyên gia: **khoảng 6,5/10**. Đây là đánh giá định tính của phiên rà soát, không phải chỉ số khảo sát người dùng, chứng nhận khả năng tiếp cận hoặc điểm hiệu năng đo trên VPS.

## 1. Phương pháp và giới hạn của kết luận

Đã thực hiện:

- Đọc mã giao diện, mô hình đọc/nghe, lưu trữ, ngoại tuyến, đồng bộ, máy chủ và cấu hình triển khai.
- Khảo sát trực tiếp bằng Chrome trên Windows; máy chủ cục bộ riêng, hồ sơ trình duyệt riêng.
- Kiểm tra ba cây tạng kinh chính, danh mục nguồn, trang tác phẩm, đọc kinh, thanh nghe, tìm kiếm, tủ sách, lịch sử, ngoại tuyến, thiết bị và thời khóa.
- Chụp **54 ảnh**, gồm các màn hình tại 1440, 768, 390 và 320 CSS px; riêng trình đọc khảo sát ba giao diện Bạch Ngọc, Hoàng Y, Dạ Thiền.
- Dùng kinh văn thật trong các luồng đọc. Âm thanh của kiểm tra tương tác dùng WAV cục bộ; không đánh giá phát âm hoặc độ ổn định dịch vụ thật bằng âm thanh này.
- Chạy lại hai bộ mô hình đọc/phân đoạn nghe và bộ thanh đọc/nghe hợp nhất: **2 bộ Node đạt; 10 nhóm kiểm tra thanh hợp nhất đạt**.
- Không có lỗi JavaScript được ghi nhận trong hai lượt khảo sát hoàn tất. Điều này không đồng nghĩa mọi chức năng đều không có lỗi.

Chưa thực hiện: nghiên cứu với người dùng thật; VoiceOver/TalkBack/NVDA; Safari/iPhone thật; nghe khi khóa màn hình; kiểm tra tải nhiều người; đo Core Web Vitals trên máy chủ công khai; rà soát từng trang kinh; kiểm thử xâm nhập. Công cụ web không truy cập được tên miền ghi trong cấu hình, nên không đưa ra kết luận website công khai đang hoạt động hay ngừng hoạt động.

Ngoại tuyến và đồng bộ được đọc mã và đối chiếu các báo cáo kiểm tra hiện có. Phiên khảo sát mới chặn service worker để tách hành vi giao diện; không phải phép kiểm tra ngoại tuyến mới từ đầu đến cuối.

Phân loại nhận định:

- **Đã tái hiện:** có thao tác và dữ liệu quan sát trong phiên này.
- **Đọc mã/dữ liệu:** xác định cách triển khai hoặc dấu hiệu cần xử lý.
- **Đánh giá UX:** nhận định chuyên môn cần kiểm chứng với người dùng.
- **Chưa kiểm chứng:** yêu cầu phải đo trước khi đưa ra cam kết.

## 2. Đánh giá theo từng mặt

| Mặt đánh giá | Điểm tham khảo /10 | Nhận xét |
|---|---:|---|
| Độ đầy đủ công năng | 8 | Đọc/nghe, vị trí riêng, tìm toàn văn, ghi chú, hàng đợi, ngoại tuyến và đồng bộ đã có |
| Bản sắc và sự nhất quán thị giác | 8 | Màu, bìa sách, hoa văn và kiểu chữ tạo được không gian phù hợp |
| Đọc kinh | 6 | Bố cục đọc ban đầu tốt; lỗi focus trong phân trang ảnh hưởng trực tiếp việc đọc |
| Nghe kinh | 7 | Thanh chung và bảo toàn phiên nghe tốt; khả năng nghe dài trên thiết bị thật còn phải chứng minh |
| Tìm kiếm và điều hướng | 6 | Cây danh mục và mã Taishō hữu ích; phạm vi tìm kiếm và lịch sử điều hướng còn gây nhầm |
| Điện thoại và người lớn tuổi | 6 | Điều khiển chính khá lớn; phần giới thiệu dài, nhiều nhãn phụ nhỏ, cài đặt nhiều tầng |
| Khả năng tiếp cận | 5 | Có focus, nhãn và dialog; đã phát hiện lỗi bàn phím và slider thiếu tên truy cập |
| Chất lượng thư mục và độ tin cậy nội dung | 6 | Có nguồn, checksum và cờ kiểm tra; còn tên sách sai và nhiều bản chưa hiệu đính |
| Hiệu năng và khả năng bảo trì | 5 | Nhiều lớp CSS/JS, tải dữ liệu và dựng biểu mẫu lớn ngay lúc mở |
| Sẵn sàng vận hành cho cộng đồng | Chưa chấm | Thiếu phép đo production, thiết bị thật và quy trình quản trị cộng đồng đã kiểm chứng |

Không lấy số lượng chức năng làm đại diện cho sự dễ dùng. Ba kết quả cần ưu tiên là: người mới tìm được đúng bản, người đọc giữ được vị trí, người nghe duy trì được phiên nghe đáng tin cậy.

## 3. Những điểm tốt nên giữ

1. **Tách vị trí đọc và vị trí nghe.** Kiểm tra đóng/mở sách giữ cùng đoạn và textOffset; chuyển trang không tự tua audio.
2. **Một thanh phát chung.** Bộ kiểm tra xác nhận giữ trạng thái phát/tạm dừng, nguồn audio và thời gian khi đi giữa thư viện và bản đọc.
3. **Có đường trở lại bản đọc và nghe từ đoạn cụ thể.** Đây là công năng quan trọng cho người học kinh nghiêm túc.
4. **Cây tra cứu theo tạng và nhóm bộ.** Ba cây hiện tại có đường dẫn phân cấp, bản liên kết và phân biệt tư liệu dùng chung.
5. **Tìm không dấu hoạt động.** Hai truy vấn “chánh niệm” và “chanh niem” cùng trả 30.799 đoạn; truy vấn cụm từ trả 11.800 đoạn trong lượt đo.
6. **Giữ nguyên nguồn và ghi nhận hiệu đính cá nhân.** Có PDF/Word, hash, nhãn OCR và cờ kiểm tra tự động.
7. **Có xử lý gián đoạn audio, cache và hủy yêu cầu cũ.** Các báo cáo và kiểm tra hiện có thể hiện sự đầu tư vào tính liên tục.
8. **Có sao lưu dữ liệu cá nhân và phản hồi lỗi lưu trữ.** Đây là nền tảng để hoàn thiện khả năng phục hồi.

Các điểm trên là tài sản cần bảo toàn trong mọi lần nâng cấp.

## 4. Các phát hiện quan trọng có bằng chứng

### UX-01 — P1: Tab làm lệch kinh văn trong chế độ lật trang

**Trạng thái: đã tái hiện.**

Mở Kinh Dược Sư, giữ chế độ Lật trang, nhấn Tab qua các điều khiển và đoạn văn. Sau 35 lượt Tab:

- Máy tính: số trang vẫn ở index 1, nhưng scrollLeft của vùng trang đổi từ 0 sang **3.120 px**.
- Phiên điện thoại mới 390 px: số trang vẫn ở index 0, nhưng scrollLeft đổi từ 0 sang **5.535 px**.
- Kinh văn bị cắt hai phía và hiển thị các mảnh cột; không phải chỉ một ảnh chụp lúc đang đổi kích thước.

Đối chiếu mã cho thấy mỗi source-block có tabindex 0; danh sách focus lấy cả phần tử có hình chữ nhật nằm ngoài trang đang xem. Trình đọc đồng thời dùng transform để chuyển cột. Dữ liệu quan sát phù hợp với việc trình duyệt tự cuộn vùng bị cắt khi focus đến đoạn ngoài trang.

**Đề xuất:** quản lý focus theo trang hiện tại; dùng một điểm vào vùng kinh văn và thao tác rõ ràng để chọn đoạn; nếu focus cần tới đoạn khác thì chuyển trang bằng cùng cơ chế phân trang. Không để cuộn ngang tự phát tạo ra vị trí thứ hai ngoài trạng thái Reader.pages.

**Nghiệm thu:** Tab/Shift+Tab ít nhất hai vòng, sau đó đổi cỡ chữ, lật trang và đổi kích thước; chữ luôn đầy đủ, chỉ số trang khớp nội dung, focus nằm trong phần đang hiển thị.

Ảnh: [trước thao tác](../../tests/artifacts/ux-audit-20261010/reader-fresh-390.png), [sau thao tác](../../tests/artifacts/ux-audit-20261010/reader-keyboard-390.png).

### UX-02 — P1: Back bỏ qua các màn hình vừa xem

**Trạng thái: đã tái hiện.**

Trên phiên mới, bấm Chùa Phúc Minh → Lịch sử nghe → Khám phá. URL đổi lần lượt nhưng history.length giữ nguyên 2. Nhấn Back quay về about:blank của phiên mới; trong phiên bình thường người dùng có thể quay về trang ngoài thư viện trước đó.

app.js dùng replaceState trong switchTab; reader.js cũng thay thế URL khi mở/đóng đọc. Các cây tạng kinh đã có đường dùng pushState, nên hành vi giữa các khu vực chưa đồng nhất.

**Đề xuất:** một cơ chế điều hướng chung. Tạo mục lịch sử khi người dùng chuyển màn hình; thay thế mục khi cập nhật vị trí đọc hoặc chuẩn hóa URL. Back cần đóng bản đọc hoặc về màn hình trước, đồng thời giữ bộ lọc, vị trí cuộn và phiên nghe. Đồng bộ tiêu đề trang với màn hình/tác phẩm.

**Nghiệm thu:** kiểm tra Back/Forward từ cả cây tạng, danh mục nguồn, tìm kiếm, trang tác phẩm và bản đọc; tải lại deep link vẫn mở đúng.

### UX-03 — P1: Điều khiển tốc độ nghe thiếu tên truy cập

**Trạng thái: đã xác nhận qua cây khả năng tiếp cận của trình duyệt.**

Trong bảng Tùy chỉnh nghe kinh, cây ARIA chứa status “Tốc độ” và một slider không có tên. Người dùng trình đọc màn hình không nhận được tên công năng của slider.

Một nút có chữ hiển thị “Lời kinh” lại mang tên truy cập “Không gian tọa thiền (F)”. Đây là sự lệch giữa chữ người dùng nhìn thấy và tên phần mềm hỗ trợ đọc được.

**Đề xuất:** gán nhãn rõ cho slider, mô tả giá trị như “0,95 lần”; đồng nhất nhãn hiển thị, aria-label và công năng. Kiểm tra lại các điều khiển được chuyển giữa bản đọc và thanh phát.

**Nghiệm thu:** cây ARIA có “slider Tốc độ nghe”; người dùng NVDA/VoiceOver xác định và thay đổi được tốc độ; tên nút chứa nhãn hiển thị phù hợp.

### UX-04 — P1: Trang đầu tải và dựng quá nhiều dữ liệu

**Trạng thái: đã đo trên máy chủ cục bộ.**

| Quan sát lần tải đầu | Giá trị |
|---|---:|
| Resource entries | 73 |
| Tổng decodedBodySize | 6.277.745 byte, khoảng 6,28 MB |
| Tổng transferSize | 6.299.345 byte, gồm overhead được trình duyệt ghi nhận |
| JS/CSS tải | 39 JS / 16 CSS |
| Số phần tử DOM sau khởi tạo trang chủ | 29.044 |
| Dữ liệu sách Word đã chuyển đổi | 2.042.503 byte |
| Báo cáo kiểm tra toàn kho | 1.896.767 byte |
| Dữ liệu Hán tạng | 782.161 byte |

Danh sách thời khóa dựng sẵn **2.784 option**. Các biểu mẫu nguồn, ngoại tuyến, bản thu cũng dựng danh sách lớn trong khu vực chưa mở.

**Đề xuất:** tải báo cáo chất lượng khi mở Nguồn & hiệu đính; chỉ dựng biểu mẫu khi cần; tìm/chọn sách qua danh sách lọc có giới hạn; tách dữ liệu catalog khỏi gói khởi tạo; tải module theo màn hình và phân trang từ nguồn dữ liệu.

Máy chủ VPS theo script có nén zstd/gzip. Vì vậy 6,28 MB cục bộ không phải số byte truyền đã đo trên VPS, và số DOM không tự chứng minh ứng dụng chậm. Đây là bằng chứng về tải công việc cần giảm; phải đo tiếp trên thiết bị phổ thông.

**Nghiệm thu:** ghi ngân sách JS, dữ liệu và DOM cho đường mở đầu; đo LCP/INP/CLS trên mạng và điện thoại thật; không tải báo cáo toàn kho ở trang chủ.

### UX-05 — P1: Một số tên sách lấy nhầm thông tin trong nguồn

**Trạng thái: xác nhận trong catalog hiện tại.**

| Mã | Tên đang hiển thị | Tệp nguồn |
|---|---|---|
| ep-b0448adb54d8 | Hà Nội - 2006 | Kinh-Vien-Giac-Luan-Giang-TK-Thich-Thong-Hue.doc |
| ep-62a15f61582c | Viện Cao Đẳng Phật Học Hải Đức | Luan-Giai-Trung-Luan-Vien-Cao-Dang-Phat-Hoc-Hai-Duc.doc |
| ep-247bffa03610 | Viện Cao Đẳng Phật Học Hải Đức | Cau-Xa-Luan-Tung-Luoc-Thich-I-Phat-Hoc-Vien-Trung-Phan.doc |

Đây là dấu hiệu bộ trích metadata chọn nhầm địa điểm/năm hoặc đơn vị làm tên tác phẩm. Tên chính xác phải được xác minh từ trang tên sách và thông tin xuất bản.

**Đề xuất:** rà soát metadata độc lập với OCR thân bài; kiểm tra các tiêu đề quá chung như “Kinh”, “Giới thiệu”, địa điểm/năm hoặc tên cơ quan; giữ tên nguồn, tên chuẩn và tên khác làm dữ liệu riêng để tìm kiếm.

**Nghiệm thu:** mỗi sách ưu tiên có tên đúng, vai trò tác giả/dịch giả đúng, ấn bản và nguồn; các tiêu đề nghi ngờ đi vào hàng đợi biên tập trước khi giới thiệu cho cộng đồng.

### UX-06 — P2: Phạm vi tìm kiếm không nhất quán

**Trạng thái: đã tái hiện và đọc mã.**

Tìm ở đầu trang, Tra cứu trên điện thoại và Tìm trong kinh văn là các điểm vào có phạm vi khác nhau. Sau khi xem Chùa Phúc Minh, trang tìm toàn văn vẫn có ô đầu trang gợi ý “Tìm trong tủ sách Chùa Phúc Minh…”. Sau khi tra Trường A-Hàm rồi chuyển sang tìm toàn văn, gợi ý đầu trang vẫn là “Tìm trong Trường A-Hàm…”.

Truy vấn không có kết quả trực tuyến vẫn khuyên “tải thêm sách”, vốn phù hợp hơn với tìm ngoại tuyến.

**Đề xuất:** một điểm tìm thống nhất với lựa chọn “Tên sách” / “Trong kinh văn”; phạm vi “Toàn thư viện” / “Nhóm đang xem” được hiển thị rõ. Khi nhập từ khóa, đưa kết quả lên vùng đầu và giữ truy vấn khi mở/đóng sách. Trạng thái rỗng phải phản ánh tìm trực tuyến hay chỉ trong sách đã tải.

**Nghiệm thu:** cùng từ khóa có đường chuyển phạm vi rõ ràng; gợi ý, tiêu đề kết quả và dữ liệu thực tế luôn cùng phạm vi.

### UX-07 — P2: Thanh tua theo đoạn dễ bị hiểu là thời lượng toàn kinh

**Trạng thái: đọc mã và kiểm tra giao diện.**

Thanh thời gian điều khiển đoạn hiện tại; thông tin giải thích nằm trong Tùy chọn. Khi chuyển đoạn, đồng hồ của đoạn bắt đầu lại. Người quen ứng dụng audiobook có thể hiểu 0:40 là cả tác phẩm.

**Đề xuất:** hiển thị ngay “Đoạn 1/34 · 00:10/00:40”; tiến độ toàn kinh/chương đặt riêng và ghi rõ ước tính nếu chưa có thời lượng thật. Nút trước/sau đoạn phải phân biệt với tua ±10 giây và lật trang.

**Nghiệm thu:** người mới chỉ đúng chức năng ba loại điều hướng mà không cần đọc tài liệu.

### UX-08 — P2: Tạo danh sách tu học chỉ chọn được tuyển tập 62 bộ

**Trạng thái: đã xác nhận.**

Biểu mẫu danh sách có 62 lựa chọn, tất cả từ DAI_THUA_DATA; không có sách Nam tông, Phúc Minh hoặc kho Word đã chuyển đổi. Trong khi đó, thời khóa có danh sách sách rộng hơn.

**Đề xuất:** dùng bộ chọn tác phẩm chung cho toàn thư viện; tìm theo tên, thêm từng sách, sắp thứ tự bằng nút và kéo nếu có; tránh yêu cầu giữ Ctrl/⌘ để chọn nhiều. Có nhãn phân biệt danh sách nghe, kinh đã lưu và thời khóa.

### UX-09 — P2: Diện tích trang đầu chưa ưu tiên thao tác thường xuyên

**Trạng thái: đánh giá UX từ ảnh.**

Tại 390×844, hero trang chủ chiếm phần lớn vùng nhìn; thẻ tạng đầu tiên bắt đầu khoảng y=795. Trang ngoại tuyến dành phần đầu cho bìa trang công cụ, tiêu đề và mô tả; nút lưu nằm dưới vùng đầu, trong khi thanh nghe và điều hướng chiếm đáy.

Thanh nghe vẫn xuất hiện khi chưa chọn sách. Bìa “Đọc & nghe ngoại tuyến” hoặc “Tìm trong kinh văn” có thể khiến trang tiện ích trông như trang một cuốn sách.

**Đề xuất:** đưa Đọc tiếp/Nghe tiếp và tìm kiếm lên trước hero khi có lịch sử; rút hero trên điện thoại; dùng tiêu đề gọn cho tiện ích; thử thanh nghe chỉ mở sau khi chọn sách và giữ nút nghe khởi đầu dễ tìm. Đánh giá bằng nhiệm vụ thực tế trước khi đổi hành vi.

### UX-10 — P1 trước khi mở rộng: Quản lý thiết bị đồng bộ chưa trọn vòng đời

**Trạng thái: đọc mã; chưa kiểm tra xâm nhập.**

Có token ngẫu nhiên, hash trên máy chủ, mã ghép một lần hết hạn sau 10 phút và giới hạn thử mã theo địa chỉ kết nối. Đây là các điểm tốt.

Ngắt đồng bộ hiện xóa thông tin xác thực trên trình duyệt. Trong các endpoint đọc được chưa có quản lý thiết bị, thu hồi token từ xa hoặc xóa toàn bộ hồ sơ máy chủ theo yêu cầu.

**Đề xuất:** danh sách thiết bị, thời điểm đồng bộ cuối, thu hồi thiết bị và xóa dữ liệu máy chủ; hướng dẫn khôi phục khi mất hết thiết bị; công bố dữ liệu nào lưu ở đâu. Kiểm tra hành vi khi dùng reverse proxy, giới hạn tạo hồ sơ và dung lượng theo người dùng.

Không coi đây là bằng chứng đã lộ dữ liệu. Đây là thiếu sót quản trị cần hoàn thiện cho dịch vụ cộng đồng.

## 5. Đọc kinh: cấu trúc trải nghiệm cần hoàn thiện

Trình đọc có typography phù hợp, mặc định chữ 21 px, mục lục, Lật trang/Cuộn, ba màu nền và bản đối chiếu. Kiểm tra mô hình với Trường A-Hàm dài 1.281.984 ký tự đạt các kiểm tra tính toàn vẹn hiện có.

Các cải tiến ngoài UX-01:

- Cho người mới thấy **tên bản dịch, dịch giả, loại văn bản và trạng thái hiệu đính** ở đầu bản đọc; mở rộng hồ sơ nguồn khi cần.
- Có vị trí đọc dễ hiểu: “Phẩm… / mục…” là mốc ổn định; số trang trình duyệt thay đổi theo chữ và màn hình cần được giải thích.
- Giữ vị trí tới đúng đoạn sau đổi cỡ chữ, xoay máy, trở lại từ tìm kiếm và từ lời đang nghe.
- Cho phép lưu/ghi chú một đoạn bằng thao tác rõ ràng, dùng được với bàn phím và cảm ứng.
- Kiểm tra thơ, kệ tụng, chú, bảng, chú thích, Hán văn và tên Pāli bằng mẫu có người đối chiếu nguồn.
- Chế độ đối chiếu cần chọn bản và phần tương ứng rõ. Không ngụ ý hai cột đã đồng bộ theo câu khi mới là ghép theo chương do người đọc chọn.
- Tìm trong cuốn đang mở phải khác tên với tìm toàn kho, có đếm kết quả, trước/sau và trở về vị trí trước khi tìm.
- Lỗi tải sách cần nút thử lại và cách mở bản khác có sẵn; lời hướng dẫn chạy MO_THU_VIEN.cmd chỉ dùng cho bản cục bộ.
- Kiểm tra zoom 200%, bố cục 320 px, thay khoảng cách chữ/dòng và focus không bị thanh đáy che.

Ưu tiên sự ổn định và khả năng đọc lâu hơn các hiệu ứng lật trang.

## 6. Nghe kinh: chất lượng phải đo bằng phiên nghe thật

Thiết kế một phiên nghe xuyên suốt thư viện là đúng hướng. Đã có đổi giọng, tốc độ, hẹn dừng, lặp, hàng đợi, nghe tiếp và trở về bản đọc.

Báo cáo ngày 07/10 ghi một lượt giọng Nam Minh bắt đầu sau **24,681 giây**, dù chuyển sáu đoạn sau đó khá liền mạch. Đây là số liệu lịch sử của một lượt đo, không phải kết quả mới hay p95 toàn hệ thống. Bài thử WAV hiện tại kiểm tra trạng thái phần mềm, không chứng minh chất lượng âm thanh từ dịch vụ.

Đề xuất:

1. Khi chờ lâu, giữ tên kinh, vị trí dự định nghe và trạng thái rõ; cho phép hủy, thử lại hoặc dùng phần đã tải.
2. Đưa giọng, tốc độ và hẹn dừng vào phần đầu bảng tùy chọn; đưa âm nền, số biến và A–B vào nhóm nâng cao.
3. Ghi rõ **giọng tổng hợp** hoặc **bản thu người đọc**; tên giọng “Trực tuyến” chưa diễn đạt đầy đủ nguồn âm thanh.
4. Đo phát âm thuật ngữ, tên người, Pāli, dấu câu, kệ và chú với người có chuyên môn; không dùng số lần phát thành công làm đánh giá phát âm.
5. Cho tải nghe từ trang tác phẩm/trình đọc; hiển thị sách và chương sắp tải trước khi bắt đầu.
6. Kiểm tra phiên nghe 30–60 phút: khóa máy, cuộc gọi, Bluetooth, đổi mạng, tạm dừng lúc tải, đổi giọng và trở lại sau đóng ứng dụng.
7. Đo thời gian từ nhấn nghe tới media phát, tỷ lệ hết phiên, số/khoảng gián đoạn và lỗi phục hồi theo thiết bị; tách thời gian máy chủ trả byte đầu.
8. Có bộ kinh ngắn đã được biên tập và chuẩn bị audio trước cho đường bắt đầu nghe; ghi rõ tên kinh trên nút khởi đầu. Hiện nút hero dùng bản đang nghe/đã lưu hoặc mặc định Tâm Kinh, nhưng nhãn chưa cho biết lựa chọn đó.

Bản thu cộng đồng cần hồ sơ người đọc, quyền sử dụng và quy trình duyệt. Không đưa mọi bản nhập cá nhân thành nội dung công khai tự động.

## 7. Nội dung, nguồn và công tác biên tập

Báo cáo generated/library-audit.json hiện ghi **5.348 bản văn, 3.395.798 đoạn**. Hướng dẫn NANG_CAP_THU_VIEN.md vẫn ghi 3.732 bản và 1.520.667 đoạn. Hai số trong hướng dẫn cần cập nhật theo cùng phiên bản chỉ mục; không đánh đồng số tác phẩm, bản văn, tệp và bản liên kết.

Có **1.907 bản mang ít nhất một cờ tự động**:

| Cờ | Số bản |
|---|---:|
| Ký tự không nhận dạng được | 69 |
| Ký tự trong vùng dùng riêng | 329 |
| Chuyển font/mã Việt cũ | 290 |
| Trích PDF cần đối chiếu | 26 |
| OCR cần rà soát | 2 |
| Nguồn thiếu phần | 7 |
| Đối tượng nhúng | 1.588 |

Một bản có thể mang nhiều cờ. Đối tượng nhúng không đồng nghĩa kinh văn sai. **Không được diễn giải 1.907 bản thành 1.907 cuốn lỗi.** Catalog Word có 1.624 mục và tất cả đặt proofread=false; trường này thể hiện chưa được ghi nhận hiệu đính, không tự chứng minh mọi mục có sai sót.

Cần xây quy trình:

- Xác minh metadata → đối chiếu bản chữ với nguồn → rà soát văn bản nghe → duyệt xuất bản → lưu lịch sử sửa.
- Trạng thái phân biệt “bản chữ chuyển đổi”, “OCR tự động”, “đã đối chiếu nguồn”, “đã hiệu đính”. Không dùng thông qua kiểm tra ký tự làm bằng chứng đã hiệu đính.
- Phân biệt kinh, luật, luận, chú giải, nghiên cứu và tư liệu đời sống ngay trên thẻ và khi nghe.
- Hiển thị tác phẩm có cùng mã nhưng các bản dịch/ấn bản khác nhau; mã chung không đủ bảo đảm chúng giống toàn bộ nội dung.
- Nhóm Nam tông đang có 80 bản chính nhưng trang tra cứu có 963 bản khi gồm 883 tư liệu dùng chung. Giao diện đã chú thích; vẫn nên đưa hai lượng này cạnh nhau để tránh hiểu nhầm độ đầy đủ của tạng.
- Cơ chế báo sai đoạn có mã bản, đoạn, phiên bản và trích dẫn; cho người gửi xem trước nội dung gửi.
- Hồ sơ nguồn thêm ấn bản, năm, đơn vị phát hành và quyền sử dụng khi xác minh được.
- Ưu tiên hiệu đính những bản được đọc/nghe nhiều và bản có cờ ảnh hưởng nội dung, không chạy theo tổng số tài liệu.

## 8. Ngoại tuyến, dữ liệu cá nhân và thời khóa

**Ngoại tuyến:** luồng tải chương hiện yêu cầu mở bản Việt rồi trở về công cụ. Người dùng phải nhớ sách nào đang cung cấp “Chương đang mở”. Đề xuất tải ngay tại tác phẩm hoặc cho chọn sách/chương trong cùng màn hình; hiển thị dung lượng dự kiến, giọng, số chương hoàn tất và thiếu.

saveBook hiện gom nhiều bản chữ và nguồn PDF/Word. Đề xuất lựa chọn “Chỉ bản chữ”, “Thêm PDF/nguồn”, “Thêm âm thanh” để tiết kiệm bộ nhớ và dữ liệu. Các lựa chọn phải đủ để người dùng biết phần nào dùng được khi mất mạng.

**Sao lưu:** bản sao lưu cá nhân hiện xuất localStorage; audio nhập nằm trong IndexedDB, tài liệu ngoại tuyến trong cache. Cần nói rõ phạm vi xuất và phạm vi đồng bộ, tránh người dùng nghĩ đã sao lưu cả file âm thanh. Có thao tác xuất bản thu hoặc gói sao lưu tương ứng nếu cần.

**Xóa và gỡ:** gỡ sách, bản thu hoặc thời khóa cần phản hồi rõ và khả năng hoàn tác khi khả thi. Hủy tải phải giữ phần hoàn tất và cho thấy trạng thái còn thiếu.

**Thời khóa:** tạo thời khóa dùng nhiều trường và select nhiều lựa chọn. Nên có mẫu đơn giản “một sách, số phút mỗi ngày”, sau đó chỉnh sâu; tìm và thêm sách bằng các mục đã chọn dễ nhìn. Phân biệt “đã mở/đã phát” với người dùng xác nhận hoàn thành; cửa sổ hoạt động không tự chứng minh người dùng đang đọc.

**Đồng bộ:** hiển thị lần thành công cuối, thay đổi chưa gửi, thiết bị hiện tại và cách xử lý xung đột. Cơ chế last-write-wins cần thử với hai thiết bị cùng sửa ghi chú và vị trí, thay vì chỉ kiểm tra ghép thành công.

## 9. Thiết kế giao diện và khả năng tiếp cận

Bản sắc hiện tại nên được giữ: tông xanh, giấy ấm, bìa kinh và nét trang trí tiết chế. Cần điều chỉnh mật độ và thứ tự thông tin:

- Nhãn tác vụ chính dễ đọc; nhãn phụ 10–12 px cần xem lại với người lớn tuổi.
- Giữ các tên thao tác nhất quán: lưu kinh là đánh dấu; tải về là lưu file; đồng bộ là gửi dữ liệu cá nhân.
- “Bạch Ngọc / Hoàng Y / Dạ Thiền” có bản sắc nhưng nên kèm mô tả “Sáng / Ấm / Tối”.
- Giảm bìa và banner trên trang tiện ích; đưa thao tác chính và trạng thái lên đầu.
- Thanh nghe trên điện thoại cần mở được tên kinh đầy đủ và phân biệt tên bản đang phát với bản đang đọc.
- Menu điện thoại dài; nhóm tác vụ thiết yếu, tra cứu và cài đặt; không bắt người dùng nhớ công cụ nằm trong nhóm nào.
- Kiểm tra số lượng điểm Tab: đoạn kinh văn không nên biến thành hàng chục điểm dừng trước khi tới điều khiển cần dùng.

Chuẩn tham chiếu là **WCAG 2.2 AA**: tương phản chữ thường 4,5:1, chữ lớn 3:1; vùng bấm tối thiểu 24×24 CSS px có ngoại lệ. Đề xuất 44×44 cho thao tác chính trên điện thoại là mục tiêu thiết kế của thư viện. Chưa đo đầy đủ tương phản nên không tuyên bố màu hiện tại đạt hoặc trượt. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Dialog cần quản lý focus khi mở/đóng và giữ thao tác trong phạm vi phù hợp. Menu điện thoại hiện đóng bằng Escape trong phép thử; cần thử thêm công nghệ hỗ trợ thật. [WAI: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## 10. Kiến trúc phần mềm và vận hành

Hiện có 16 lớp stylesheet và 39 script được nạp. Nhiều module chỉnh/move cùng thành phần giao diện khi khởi tạo. Đây là dấu hiệu chi phí tích hợp tăng; không có bằng chứng cần viết lại toàn bộ.

Đề xuất nâng cấp từng bước:

1. Một lớp quản lý route, trạng thái chọn bản, vị trí và phạm vi tìm kiếm.
2. Giữ thanh nghe chung đã đạt kiểm tra; mô tả rõ hợp đồng giữa reader, audio, queue và route.
3. Bộ thành phần thống nhất cho chọn sách, trạng thái tải/lỗi/rỗng, thẻ bản văn và hồ sơ nguồn.
4. Thu gọn CSS theo thành phần; bỏ lớp cũ sau khi đối chiếu hình ảnh và kiểm tra các luồng.
5. Sinh manifest/version và số liệu hướng dẫn từ cùng pipeline để giảm lệch tài liệu.
6. Kiểm tra mô hình, tương tác, khả năng tiếp cận và hành vi mạng bằng các bài riêng; bổ sung lỗi UX-01/02/03 vào hồi quy sau khi sửa.
7. Gắn mã phiên bản vào giao diện/chẩn đoán để biết VPS và máy người dùng đang dùng bản nào.
8. Tối ưu catalog và biểu mẫu theo màn hình trước khi thay công nghệ hoặc framework.

Trước khi mở rộng phục vụ cộng đồng:

- Đo trên tên miền thật, thiết bị thật và nhiều người dùng; không suy ra công suất hệ thống từ một phiên nghe cục bộ.
- Kiểm tra hàng đợi TTS khi nhiều phiên có cùng/khác sách và giọng; cache, ưu tiên và giới hạn mỗi người.
- Theo dõi uptime, lỗi nguồn, thời gian tìm kiếm, thời gian có audio, cache, dung lượng và trạng thái chỉ mục.
- Sao lưu dữ liệu máy chủ, thử khôi phục vào môi trường riêng và ghi lại thời gian phục hồi.
- Thử cập nhật khi đang nghe và khi đang ngoại tuyến; người dùng phải nhận được bộ tài nguyên tương thích.
- Có trang trợ giúp, đầu mối liên hệ, báo lỗi và chính sách dữ liệu dễ tìm.
- Rà soát khả năng chia sẻ tác phẩm/đoạn, tiêu đề trang và metadata theo từng link. Metadata HTML hiện chủ yếu mô tả toàn thư viện.

## 11. Lộ trình cải tiến có thứ tự

Thời gian dưới đây là ước lượng để lập kế hoạch, cần điều chỉnh theo người thực hiện và khả năng kiểm tra thiết bị.

| Giai đoạn | Công việc | Điều kiện kết thúc |
|---|---|---|
| 1 — khoảng 1–2 tuần | Sửa UX-01/02/03; sửa placeholder; xác minh các tiêu đề sai đã nêu; cập nhật thống kê hướng dẫn | Bàn phím đọc ổn định, Back đúng, điều khiển nghe có tên, sách mẫu đúng metadata |
| 2 — khoảng 2–4 tuần | Giảm tải trang đầu; thống nhất tìm kiếm; đưa kết quả/đọc tiếp lên đầu; chọn sách chung; tải ngoại tuyến tại tác phẩm | Có số đo trước/sau; người mới hoàn thành các nhiệm vụ trọng tâm |
| 3 — khoảng 4–8 tuần | Kiểm tra Safari/Android, nghe dài, offline và xung đột sync; quản lý thiết bị; quy trình hiệu đính; giám sát và khôi phục | Đạt tiêu chí phát hành trên ma trận thiết bị và có người phụ trách nội dung/vận hành |

Các bước có thể giao nhau. Không cam kết “hoàn hảo” bằng việc hoàn tất một danh sách chức năng; cải tiến cần tiếp tục theo phản hồi và phép đo.

## 12. Tiêu chí phát hành và nghiên cứu người dùng

Mục tiêu kỹ thuật về hiệu năng: **LCP ≤2,5 giây; INP ≤200 ms; CLS ≤0,1**, đánh giá ở phân vị 75 theo nhóm thiết bị. Đây là ngưỡng tham chiếu, chưa phải kết quả hiện tại của thư viện. [Core Web Vitals](https://web.dev/articles/vitals)

Mục tiêu sản phẩm đề xuất, cần hiệu chỉnh sau khi đo baseline:

| Luồng | Tiêu chí nghiệm thu |
|---|---|
| Tìm và đọc | Người mới tìm đúng sách/bản và mở được trong khoảng 60 giây; báo cáo cả trường hợp thất bại |
| Đọc tiếp | Giữ đúng đoạn qua đóng/mở, zoom, đổi chữ và đổi kích thước |
| Nghe tiếp | Giữ đoạn và số giây; khoảng sai lệch được xác định trước khi kiểm tra |
| Phát audio | Đo p50/p95 từ thao tác tới media phát; phân biệt cache và tổng hợp mới; đề xuất p95 dưới 5 giây cache, dưới 10 giây bản mới nếu hạ tầng đáp ứng |
| Nghe dài | Phiên 30–60 phút, có đổi mạng/khóa màn hình; ghi toàn bộ gián đoạn, vị trí sau phục hồi và thao tác người dùng |
| Ngoại tuyến | Mở lại ứng dụng khi mất mạng; phần đã tải đọc/nghe được, phần chưa tải báo chính xác |
| Đồng bộ | Hai thiết bị thêm/sửa/xóa, có mất mạng và xung đột; kết quả được giải thích, không mất ghi chú âm thầm |
| Khả năng tiếp cận | Bàn phím, trình đọc màn hình, zoom và tương phản được kiểm tra; không còn lỗi chặn tác vụ trọng tâm |
| Biên tập | Mọi tác phẩm được giới thiệu có metadata xác minh, nguồn và trạng thái hiệu đính |
| Vận hành | Có kiểm tra phiên bản, giám sát và bài khôi phục dữ liệu thành công |

Nghiên cứu nên mời ba nhóm: người mới tiếp cận kinh điển; người lớn tuổi dùng điện thoại; người đọc/nghiên cứu thường xuyên. Có thể bắt đầu khoảng 5–6 người mỗi nhóm và tuyển thêm người dùng công nghệ hỗ trợ. Mẫu nhỏ nhằm tìm vấn đề, không đại diện thống kê toàn cộng đồng.

Giao các nhiệm vụ: tìm một bản kinh; chọn đúng dịch giả; đọc và trở lại đoạn cũ; nghe, hẹn dừng và khóa máy; tải để dùng mất mạng; ghi chú và ghép thiết bị. Quan sát thời gian, số thao tác, số lần nhầm và điểm không biết tiếp tục ở đâu. Tránh hướng dẫn trước từng bước vì sẽ che khuất vấn đề.

## 13. Bằng chứng và cách chạy lại

- [Quan sát chính, số đo tài nguyên và lịch sử](../../tests/artifacts/ux-audit-20261010/observations.json)
- [Quan sát cây tạng, bộ chọn sách và cây ARIA](../../tests/artifacts/ux-audit-20261010/canon-observations.json)
- [Trang chủ máy tính](../../tests/artifacts/ux-audit-20261010/home-1440.png)
- [Trang chủ điện thoại](../../tests/artifacts/ux-audit-20261010/home-390.png)
- [Tra mã Trường A-Hàm trên điện thoại](../../tests/artifacts/ux-audit-20261010/canon-code-search-390.png)
- [Tùy chọn nghe điện thoại](../../tests/artifacts/ux-audit-20261010/audio-options-390.png)
- [Báo cáo thanh nghe hiện có](unified-player/BAO_CAO.md)
- [Báo cáo độ liên tục audio hiện có](audio-continuity/BAO_CAO_CAI_TIEN.md)

Chạy lại các khảo sát bằng Python có runtime của dự án:

    python -X utf8 tests/ux_audit_20261010.py
    python -X utf8 tests/ux_audit_canon_20261010.py
    node --test tests/reader-model.test.cjs tests/narration-model.test.cjs
    python -X utf8 tests/unified_player_check.py

Hai script khảo sát tạo máy chủ riêng, dùng hồ sơ trình duyệt riêng và ghi bằng chứng trong tests/artifacts/ux-audit-20261010. Chúng dùng Chrome tại đường dẫn Windows hiện tại. Các nhận định về hành vi không được thay thế bằng việc script chạy đến hết; cần đọc kết quả quan sát và ảnh.
