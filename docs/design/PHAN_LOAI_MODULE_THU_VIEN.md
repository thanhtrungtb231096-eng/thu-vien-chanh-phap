# Phương án sáu module nội dung (lịch sử)

**Phương án này đã được thay bằng ba cây Hán tạng, Đại thừa và Nam tông theo yêu cầu mới.** Xem [cấu trúc ba tạng kinh và mạng lưới tra cứu](CAU_TRUC_BA_TANG_KINH.md). Chùa Phúc Minh giữ riêng theo cấu trúc cũ. Nội dung dưới đây lưu lại phương án trước.

Phạm vi lần này là tổ chức các lối vào ngoài thư viện. Trình đọc, bảng nghe trong trình đọc và thanh phát âm thanh giữ giao diện và hành vi cũ. Đã gỡ màn hình “Mục lục tạng kinh” tổng hợp và các chế độ “Đọc & nghe / Tra cứu / Chỉ nghe” vừa thêm.

## Lối vào chính

| Module | Nhóm bên trong | Cách tìm |
| --- | --- | --- |
| Kinh Pāli / Nikāya | Trường Bộ, Trung Bộ, Tương Ưng, Tăng Chi, Tiểu Bộ; kinh lẻ; giảng giải | Module → bộ → bản sách |
| Kinh A-Hàm | Trường, Trung, Tạp, Tăng Nhất A-Hàm; các kinh liên quan | Module → bộ → bản kinh |
| Kinh Đại thừa | Bát Nhã, Pháp Hoa, Hoa Nghiêm, Bảo Tích, Niết Bàn, Đại Tập, Tịnh độ, Mật giáo, Kinh tập | Module → nhóm bộ → bản kinh hoặc giảng giải → tác phẩm |
| Luật & giới luật | Luật tạng / giới bổn; luật sớ; học giới / ứng dụng | Module → nhóm → tác phẩm |
| Luận & A-tỳ-đàm | A-tỳ-đàm, Trung Quán, Du Già / Duy thức, luận giải thích kinh, luận khác, luận sớ | Module → nhóm luận → tác phẩm |
| Tu học & nghiên cứu | Nhập môn, Thiền, Tịnh độ, Duy thức, Mật tông, nghi lễ, giảng giải / chú sớ, lịch sử / truyện / tông phái, đời sống, văn học, tư liệu | Module → chủ đề → nhóm con nếu có → tác phẩm |

Mỗi module có nút riêng ở thanh bên, menu điện thoại và trang chủ. Không cần đi qua một trang cây tổng hợp. Trang đầu module chỉ hiện những nhóm có tài liệu; tác phẩm xuất hiện sau khi chọn nhóm cuối. Có nút xem tất cả khi muốn duyệt rộng hơn.

Ví dụ: **Kinh Đại thừa → Bát Nhã → Bản kinh → Bát Nhã Tâm Kinh**. Muốn tìm sách giảng về Bát Nhã thì chọn **Giảng giải & nghiên cứu** trong cùng nhóm. Đường dẫn phía trên giúp quay lại từng cấp. URL có thể mở thẳng nhóm, như `#kinh-dai-thua/bat-nha/kinh`.

## Nguyên tắc phân loại

1. Phân theo nội dung để tìm sách; giữ kho nguồn để kiểm chứng xuất xứ. Bốn kho gốc và toàn bộ trang cũ vẫn truy cập được. Các kho Đại Tạng Kinh, tuyển tập 62 bộ và Hán tạng được đặt trong mục thu gọn “Kho nguồn & bộ sưu tập”; Chùa Phúc Minh giữ lối vào riêng sẵn có.
2. Phân biệt kinh, luật, luận, giảng giải, chú sớ và tài liệu tu học bằng nhóm và nhãn. “Kinh” ở tên kho nguồn không đồng nghĩa mọi tài liệu trong kho là bản kinh.
3. Ưu tiên bộ gốc trong dữ liệu. Tuyển tập 62 bộ dùng mã Taishō để đối chiếu Hán tạng trước; không dùng Thập Nhị Phân Giáo làm cấp điều hướng chính.
4. Đây là cách tổ chức thư viện dựa trên siêu dữ liệu hiện có, không phải việc xác lập lại phạm vi kinh điển của các truyền thống. Chưa xác định được bộ thì giữ ở nhóm “kinh lẻ / tài liệu liên quan” hoặc “giảng giải / tài liệu khác”. Bản duyên và tư liệu lịch sử giữ tên bộ gốc; không gán toàn bộ Bản Duyên bộ thành kinh Đại thừa.
5. Kinh Tịnh độ là lối gom theo nhu cầu tìm kiếm, có thể lấy bản từ Bảo Tích, Đại Tập hoặc Kinh Tập. Bộ Taishō ban đầu vẫn hiển thị ở “Nguồn & phân loại”. Mật giáo ưu tiên bộ gốc để các tên “Kim Cang Đỉnh” không bị xếp nhầm vào Bát Nhã.
6. Một **bản / tài liệu** có một vị trí chính. Nhiều bản dịch, bản trích hoặc ấn bản của cùng tác phẩm vẫn giữ riêng. Tổng số bản không được hiểu là tổng số tác phẩm độc lập.

Các ranh giới A-Hàm và nhóm bộ Hán tạng tham khảo [mục lục CBETA](https://www.cbeta.org/cbreader/help/cbeta_toc_en.htm). Cách chia năm bộ Nikāya tham khảo [giới thiệu Trường Bộ trên SuttaCentral](https://suttacentral.net/edition/dn/en/sujato/general_introduction). Các nhóm nội dung và cách gom tài liệu tu học là lựa chọn biên tập cho thư viện này; xuất xứ luôn được giữ để người nghiên cứu kiểm tra.

## Những chi tiết giúp tìm nhanh

- Ô tìm kiếm trên đầu trang tìm trong nhóm đang mở, nhận cả từ khóa không dấu, tên dịch giả và mã Taishō. Tìm trên trang chủ vẫn tìm toàn thư viện.
- Bộ lọc bản đọc gồm tất cả, có bản Việt, chỉ có bản Hán. Bản Hán mở đúng chế độ Hán văn; chỉ hiện nút nghe khi có bản Việt.
- Mỗi trang tối đa 24 bản, giúp các nhóm lớn như Mật giáo hoặc Kinh tập không tạo danh sách quá dài.
- Mỗi thẻ có tên, loại nội dung, ngôn ngữ, dịch giả nếu có, kho nguồn, mã Taishō nếu có và thông tin phân loại mở khi cần.
- Đọc hoặc nghe dùng các thao tác cũ. Quay về thư viện giữ nhóm đã mở. Chuyển module không ngắt âm thanh đang phát.
- Mã sách, liên kết tệp, vị trí đọc, lịch sử nghe, sách đã lưu và ghi chú không đổi; không sao chép hoặc di chuyển các văn bản nguồn.

## Điểm mở rộng sau này

Nên bổ sung quan hệ “tác phẩm → nhiều ấn bản / bản dịch” và quan hệ đối chiếu A-Hàm–Nikāya bằng bảng dữ liệu đã được kiểm chứng. Khi có bảng này, có thể gom các ấn bản dưới một tác phẩm mà vẫn giữ mã bản dịch và tiến độ riêng. Giao diện nghe/đọc sẽ được bàn và chỉnh ở yêu cầu tiếp theo của người dùng.

## Kiểm tra

`python tests/content_modules_check.py` kiểm tra bao phủ toàn bộ dữ liệu, các ranh giới phân loại dễ nhầm, điều hướng từng cấp, tìm không dấu, phân trang, đường dẫn nhóm, bản Hán, mở trình đọc cũ, nghe liên tục và menu điện thoại ở năm độ rộng với ba giao diện màu.

`python tests/reader_fullscreen_check.py` và `python tests/test_spotify_player.py` kiểm tra lại trình đọc và bộ phát hiện có.
