# Header, hero và lộ trình tu học — 11/10/2026

Thiết kế và chức năng đã được triển khai trong `app/web`. Mở thư viện bằng `MO_THU_VIEN.cmd`, chọn **Lộ trình tu học** ở thanh bên hoặc menu điện thoại. Đường dẫn tổng quan là `#paths`; một bài có đường dẫn riêng, ví dụ `#paths/nen-tang/nguon-kinh`.

## Thiết kế giao diện

Header giữ tìm kiếm và các thao tác quen thuộc, thêm nhận diện chữ serif, huy hiệu pháp luân, dòng vàng đồng và phụ đề “Tàng kinh · Văn Tư Tu”. Hero dùng nền xanh trầm, nền ngà của trang, đường viền mảnh, họa tiết sen/pháp luân/sách và dấu chữ tiết chế. Họa tiết dùng SVG sẵn có, không cần ảnh ngoài hay font mới.

23 module dùng một component giới thiệu chung; trang chủ có hero riêng và lối vào lộ trình mới. Trang bộ kinh giữ bìa và bổ sung đường phân cách cùng hệ màu. Các cây tạng kinh cập nhật hero theo nhánh đang xem. Khóa tụng cập nhật hero theo tên danh sách và giữ nút nghe. Ba nhóm tạng có sắc nền riêng để người dùng nhận biết, cùng cấu trúc tiêu đề và cách dùng nút.

Mỗi hero có tên module, mục đích, chi tiết đặc thù và thao tác phù hợp nếu cần. Số liệu danh mục, nút tạo danh sách, nút nghe khóa tụng và thông tin lịch sử nghe được chuyển sang hero mới bằng chính phần tử hiện có, giữ ID và hành vi. Nền Bạch Ngọc, Hoàng Y và Dạ Thiền dùng chung các token màu hiện có.

Trên điện thoại, nội dung về một cột; họa tiết lùi xuống nền, không che chữ hoặc nhận tương tác. Việc tìm kiếm và đọc tiếp ở trang chủ vẫn nằm trước hero theo quyết định UX trước đó.

## Cấu trúc lộ trình

| Hướng học | Số bài | Nhịp gợi ý | Nội dung |
|---|---:|---|---|
| Nền tảng tu học | 8 | 8 tuần | Nhận diện nguồn; giới hạnh; bốn sự thật; xét nghiệm cách hiểu; bố thí; niệm hơi thở; niệm xứ; giữ nhịp |
| Đọc sâu Nikāya | 4 | 4–8 tuần | Đọc toàn cảnh; năm uẩn; duyên khởi; lòng từ |
| Từ bi & trí tuệ Đại thừa | 4 | 4–8 tuần | Bản truyền thừa; Tâm Kinh; Kim Cang; Pháp Hoa và hạnh tôn trọng |
| Tu học theo hướng Tịnh độ | 4 | 4–8 tuần | Ba kinh Tịnh độ; phát nguyện; nguyện và nền tảng đạo đức; thời khóa |
| Khảo cứu & đối chiếu | 3 | Tự chọn | Hồ sơ tác phẩm/ấn bản; đối chiếu văn bản; kinh, chú giải và hướng dẫn hiện đại |

Thứ tự và thời lượng là lựa chọn sư phạm của thư viện. Đây là các hướng học có thể chọn, không phải một thang bậc chung áp cho mọi truyền thống. Người dùng có thể đọc lại nền tảng hoặc mở trực tiếp bất kỳ bài nào.

Mỗi bài có:

1. Mục tiêu, điểm đọc và kiến thức cần phân biệt.
2. Giải thích biên soạn, kèm nguồn cụ thể.
3. Thẻ nguồn: mã, bộ, thể loại, truyền thống, bối cảnh, trọng tâm đọc và tài liệu đối chiếu.
4. Bản trong thư viện: tên bản thực, credits và tình trạng bản chữ; nút đọc/nghe theo khả năng của bản.
5. Bài thực hành cụ thể trong đời sống và câu hỏi suy ngẫm.
6. Một câu tự kiểm tra có giải thích, nhật ký và ba mục tự xác nhận trước khi ghi hoàn thành.

## Nghiên cứu và cách dùng nguồn

Nguồn được chọn theo khả năng kiểm chứng: kinh được định danh bằng số Nikāya hoặc mã Taishō; tư liệu tổ chức tạng và vị trí lấy từ CBETA; nguồn đối chiếu Pāli từ SuttaCentral, Access to Insight và dhammatalks.org; bộ ba kinh Tịnh độ đối chiếu thêm ấn bản BDK. Các bản Taishō được liên kết bằng mã chính xác với danh mục Hán tạng và tuyển tập trong workspace.

Nguồn đối chiếu bên ngoài và bản Việt trong kho có credits riêng. Tên người dịch tiếng Anh không được gán cho bản Việt. Các trang CBETA Online và SuttaCentral có phần nội dung chạy bằng JavaScript; hồ sơ mã và sự hiện diện của bản trong kho được kiểm tra thêm bằng catalog hiện có. Không tự nhận toàn bộ bản chữ đã hiệu đính khi catalog không ghi nhận.

| Nguồn | Dùng cho |
|---|---|
| [SuttaCentral — hướng dẫn đọc kinh](https://suttacentral.net/general-guide-sujato?lang=en), [giới thiệu Trường Bộ](https://suttacentral.net/edition/dn/en/sujato/general_introduction) | Bối cảnh và phương pháp đọc; phân biệt tư liệu giới thiệu hiện đại với kinh văn |
| [CBETA Catalogue](https://www.cbeta.org/cbreader/help/cbeta_toc_en.htm), [quy tắc mã/vị trí](https://www.cbeta-org-tw.cbeta.org/data-format/linehead.htm) | Tổ chức tạng, nhận diện bản và vị trí trích dẫn |
| [MN 107](https://www.accesstoinsight.org/tipitaka/mn/mn.107.horn.html) | Học từng bước; nhận diện bối cảnh người xuất gia trước khi xây dựng bài tập cư sĩ |
| [DN 31](https://www.accesstoinsight.org/tipitaka/dn/dn.31.0.nara.html), [MN 61](https://www.dhammatalks.org/suttas/MN/MN61.html) | Trách nhiệm và phản tỉnh hành vi |
| [SN 56.11](https://www.accesstoinsight.org/tipitaka/sn/sn56/sn56.011.than.html), [AN 3.65](https://www.accesstoinsight.org/tipitaka/an/an03/an03.065.than.html) | Nền tảng pháp học, xét nghiệm cách hiểu |
| [Iti 60](https://www.accesstoinsight.org/tipitaka/kn/iti/iti.3.050-099.than.html#iti-060), [Pháp Cú — phẩm đầu](https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.01.budd.html) | Phân biệt danh sách trong kinh với triển khai luận giải; phân biệt kệ kinh với tích truyện |
| [MN 118](https://www.dhammatalks.org/suttas/MN/MN118.html), [MN 10](https://www.accesstoinsight.org/tipitaka/mn/mn.010.than.html) | Bài đọc về hơi thở và niệm xứ |
| [SN 22.59](https://www.dhammatalks.org/suttas/SN/SN22_59.html), [SN 12.15](https://www.dhammatalks.org/suttas/SN/SN12_15.html), [Sn 1.8](https://www.accesstoinsight.org/tipitaka/kn/snp/snp.1.08.amar.html) | Các bài đọc sâu Nikāya |
| [T251](https://cbetaonline.dila.edu.tw/zh/T0251), [T235](https://cbetaonline.dila.edu.tw/zh/T0235), [T262](https://cbetaonline.dila.edu.tw/zh/T0262) | Nhận diện bản Hán và liên kết các bài Đại thừa |
| [T360](https://cbetaonline.dila.edu.tw/zh/T0360), [T365](https://cbetaonline.dila.edu.tw/zh/T0365), [T366](https://cbetaonline.dila.edu.tw/zh/T0366), [BDK — The Three Pure Land Sutras](https://www.bdkamerica.org/product/the-three-pure-land-sutras/) | Nhận diện ba kinh Tịnh độ và nguồn đối chiếu |

Giao diện có mục mở rộng **Nguồn gốc & hành trình truyền thừa kinh sách**: truyền khẩu/kết tập → ngôn ngữ/truyền thống → bản dịch/tạng kinh → chú giải/tệp số. Đây là sơ đồ các lớp cần nhận biết, không phải niên biểu sáng tác. Niên đại tác phẩm, bản dịch, ấn bản và tệp phải ghi riêng; khi thiếu chứng cứ, dùng “chưa xác định”.

Các nguyên tắc biên soạn đã áp dụng:

- Không gán mọi tài liệu trong kho tên “kinh” thành bản kinh.
- Không đồng nhất toàn bộ Nikāya, A-Hàm và Đại thừa chỉ vì có chủ đề chung.
- Phân biệt `Sn` và `SN`, kinh riêng và toàn bộ sách chứa kinh.
- Với bản bộ, nút ghi “Mở bộ để tìm bài” và nêu số kinh; không giả vờ đã định vị đúng bài/đoạn.
- Không dùng số bài, số phút hoặc số lần trì niệm làm đánh giá chứng đắc.
- Không suy ra một niên đại chắc chắn từ tên dịch giả.
- Không sao chép các bản dịch bên ngoài; hướng dẫn và bài tập là nội dung biên soạn mới, có liên kết nguồn.

Hướng dẫn chưa có ghi nhận thẩm định bởi người hiệu đính Phật học. Các nghĩa chuyên sâu và phương pháp thực hành theo truyền thống vẫn cần người hướng dẫn tương ứng; việc này khác với kiểm tra phần mềm đã hoàn thành.

## Dữ liệu và mở rộng

`learning-path-data.js` tách nội dung thành nguồn và lộ trình/bài học. Khi mở rộng, mỗi nguồn có mã, bộ, loại văn bản, truyền thống, bối cảnh, điểm đọc, credits và URL; mỗi bài tham chiếu khóa nguồn thay vì sao chép kinh văn.

`learning-path.js` quản lý điều hướng và thao tác; `module-presentation.js` quản lý hero dùng chung. CSS được thêm vào manifest và gom thành một bundle. Build tạo lại hash, release identity và danh sách precache, gồm dữ liệu lộ trình để có thể mở giao diện khi ngoại tuyến.

Nhật ký, tiến độ và thời lượng dùng namespace `cp3:` để đi cùng sao lưu/đồng bộ hiện có. Tiến độ là mảng record có ID `track:lesson`; nhật ký lưu riêng từng bài. Bản nháp chưa lưu được giữ khi chuyển bài trong cùng phiên và được đưa vào file xuất nhật ký. Nhấn **Lưu ghi chép** để giữ qua tải lại. Nếu bộ nhớ bị chặn hoặc đầy, giao diện báo chưa lưu, không báo hoàn thành giả.

Nút tạo thời khóa chọn các bản Việt có thật, loại trùng và dùng API thời khóa hiện có. Lặp thao tác cho cùng lộ trình cập nhật cùng thời khóa. File xuất riêng của lộ trình phục vụ lưu/đối chiếu; việc nhập trở lại thư viện dùng file **sao lưu toàn thư viện**, không dùng file xuất nhật ký riêng.

## Kiểm tra

Chạy `python -X utf8 tools/build/build_ux_release.py`, sau đó `python -X utf8 tests/module_study_check.py`. Bộ kiểm tra tự mở máy chủ tạm; có thể đặt `DHARMA_TEST_URL` để dùng máy chủ đã chạy. Bộ hồi quy chung đã có thêm kiểm tra này.

Kiểm tra bao gồm 23 bài, ID nguồn/bản đọc, câu hỏi, checklist hoàn thành, ghi chép và bản nháp, tải lại/Back/Forward, đọc kinh thực, trở lại bài, thời khóa không trùng, xuất nhật ký, menu điện thoại, link bài trực tiếp, 45 bố cục lộ trình và 345 bố cục hero. Kết quả và ảnh nằm trong `tests/artifacts/module-study-20261011/`.
