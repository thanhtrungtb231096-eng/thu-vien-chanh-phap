# Sổ triển khai và nghiệm thu nâng cấp Chánh Pháp

**Cập nhật 12/10/2026 — hoàn thiện phần đọc:** phiên bản `ux-20261010-f3aa783cac2a` chuyển bản đồ 26 hồ sơ sang lời giải thích trực tiếp và sửa mục lục để không che nội dung trên điện thoại/chữ lớn. **18/18 lượt hồi quy, 435 lượt bố cục, 72 lần chuyển mục và 8/8 nguồn chuyện đạt**; bản ngoại tuyến đạt. Máy chủ cục bộ đã mở đúng bản mới. Xem [báo cáo và ảnh cập nhật](NGHIEM_THU_LO_TRINH_GIAI_NGHIA_CAU_CHUYEN_20261011.md).

**Cập nhật 11/10/2026 — viết lại lộ trình bằng giải nghĩa và câu chuyện:** bản `ux-20261010-f3561349b0c5` thay 41 bài bằng mạch đọc giải nghĩa → câu chuyện → ứng dụng. Bỏ trắc nghiệm, câu hỏi phản tỉnh và checklist; có 8 chuyện/thí dụ định vị trong kinh, 41 minh họa đời sống ghi rõ hư cấu và 26 hồ sơ giải nghĩa. Điện thoại thu gọn danh sách bài; giữ dữ liệu cá nhân cũ. **18/18 lượt hồi quy và 435 lượt bố cục đạt**; bản đọc ngoại tuyến và 8/8 liên kết chuyện qua kiểm tra. Máy chủ 8090 đã mở đúng bản mới. Xem [báo cáo mới và ảnh](NGHIEM_THU_LO_TRINH_GIAI_NGHIA_CAU_CHUYEN_20261011.md), [thiết kế và nguồn](../design/LO_TRINH_GIAI_NGHIA_CAU_CHUYEN_20261011.md).

**Cập nhật 11/10/2026 — lộ trình tu học chuyên sâu:** phiên bản `ux-20261010-eaecaf6ec62b` có **7 hướng học / 41 bài / 26 hồ sơ giải nghĩa kinh / 30 nguồn**. Bổ sung ý nghĩa cốt lõi, tầm quan trọng, thuật ngữ, điều dễ hiểu nhầm, đời sống cư sĩ và cách đọc/tụng có hiểu; giao diện có tìm không dấu, bài/kinh đã lưu, tiếp tục học, mục lục nhanh, cỡ chữ và đọc tập trung. **18/18 lượt hồi quy đạt**, 435 lượt bố cục và kiểm tra ngoại tuyến thực đạt. Máy chủ cục bộ đã khởi động lại đúng phiên bản; mở `MO_THU_VIEN.cmd` để sử dụng. Xem [nghiệm thu mới và ảnh](NGHIEM_THU_LO_TRINH_CHUYEN_SAU_20261011.md), [thiết kế và tài liệu nghiên cứu](../design/LO_TRINH_TU_HOC_CHUYEN_SAU_20261011.md).

**Cập nhật 11/10/2026 — header, hero và lộ trình tu học:** đã triển khai phiên bản `ux-20261010-337599538300`, 23 hero dùng chung cùng hero trang chủ, 5 lộ trình / 23 bài / 22 hồ sơ nguồn, nhật ký, tự kiểm tra và tạo thời khóa. 17/17 lượt hồi quy đạt; 45 bố cục lộ trình và 345 bố cục hero qua kiểm tra. Xem [nghiệm thu và ảnh](NGHIEM_THU_HEADER_HERO_LO_TRINH_20261011.md), [thiết kế và nguồn nghiên cứu](../design/HEADER_HERO_VA_LO_TRINH_TU_HOC_20261011.md). Bản này ở workspace, chưa đóng gói lại hoặc triển khai VPS; các bằng chứng của phiên bản trước bên dưới được giữ nguyên.

Yêu cầu: triển khai lần lượt các đề xuất trong UX_AUDIT_CHANH_PHAP_20261010.md; nghiệm thu trước khi chuyển hạng mục.

Bản khôi phục mã và cấu hình: storage/backups/ux-upgrade-20261010; manifest ghi SHA-256 từng tệp. Kinh văn/PDF/Word nguồn không thuộc phạm vi sửa giao diện.

Phiên bản nghiệm thu cuối: **ux-20261010-bbade1200ed1**. Chỉ mục vẫn có **5.348 bản văn / 3.395.798 đoạn**. Kết quả dưới đây thuộc máy chủ cục bộ và Chromium; các cổng cần thiết bị/người dùng/biên tập/VPS nằm ở cuối báo cáo.

| Đợt | Phạm vi | Trạng thái | Bằng chứng |
|---|---|---|---|
| 1 | UX-01: bàn phím và phân trang | Đạt nghiệm thu cục bộ | tests/artifacts/ux-upgrade-20261010/stage1.json; 1440/390/320 px, 110 lượt Tab mỗi kích thước, chọn đoạn, cỡ chữ và ba màu |
| 2 | UX-02/03: lịch sử điều hướng, tên truy cập | Đạt nghiệm thu cục bộ | stage2.json; 4 nhóm tương tác, bộ unified_player_check 10 nhóm đạt |
| 3 | UX-05: metadata và trạng thái nội dung | Đạt nghiệm thu cục bộ | stage3.json; ba sách đối chiếu; sao lưu metadata và chỉ mục riêng |
| 4 | UX-04: tải theo nhu cầu, bộ chọn sách chung | Đạt nghiệm thu cục bộ | stage4.json; DOM 9.770; decoded 3.420.474 byte; báo cáo, hồ sơ nguồn, công cụ và font Hán tải khi cần; một CSS đầu ra |
| 5 | UX-06/08/09: tìm kiếm, danh sách tu học, điện thoại | Đạt nghiệm thu cục bộ | stage5.json; danh sách bốn kho, thứ tự bằng nút, phạm vi tìm kiếm, Back từ kết quả, ảnh điện thoại |
| 6 | UX-07 và trải nghiệm nghe, đọc, ngoại tuyến | Đạt nghiệm thu cục bộ | stage6.json; tìm trong sách, lưu bản chữ, hủy tải giữ đoạn, tải lại và phát cache khi mạng/TTS bị chặn |
| 7 | UX-10: vòng đời thiết bị đồng bộ và dữ liệu | Đạt nghiệm thu cục bộ | stage7.json; sync_lifecycle_check.py: 5 nhóm đạt, SQLite tạm riêng |
| 8 | Trợ giúp, báo sai đoạn, quy trình biên tập và vận hành | Đạt nghiệm thu cục bộ | stage8.json; share có metadata/trích đoạn và mở đúng đoạn; CSV 675 bản ưu tiên, một ứng viên metadata; sao lưu 0,016 s và khôi phục riêng 0,030 s (DB mẫu 94 KB, không phải RTO production) |
| 9 | Hồi quy, phiên bản, đóng gói và hướng dẫn nghiệm thu thực địa | Đạt nghiệm thu cục bộ và gói xuất | regression.json: 15 lượt/bộ đạt; 29 nhóm theo đợt; 52 tệp JS qua syntax; package.json: checksum/import/rebuild đạt, không có DB cá nhân; bảng thiết bị thật đã chuẩn bị |

Các xác nhận cần thiết bị thật, người dùng hoặc người hiệu đính được ghi riêng; kiểm thử mô phỏng không thay thế chúng.

## Thay đổi và bằng chứng chính

| Đề xuất | Đã triển khai/kiểm chứng | Cổng còn cần xác nhận |
|---|---|---|
| UX-01 | Một điểm vào kinh văn, Enter chọn/ghi chú; Tab không cuộn ngang; giữ đoạn qua font/màu/màn hình | NVDA/VoiceOver/TalkBack và zoom thật |
| UX-02 | Router chung, Back/Forward, album/deep link, query/filter và tên trang | Deep link trên Safari và ứng dụng đã cài |
| UX-03 | Slider có tên/giá trị, nhãn Lời kinh đồng nhất; giọng/tốc độ/hẹn giờ ở đầu, số biến/âm nền mở riêng | Trình đọc màn hình thật và khả năng hiểu nhãn của người mới |
| UX-04 | Catalog gọn, tải theo nhu cầu, chọn sách có giới hạn; CSS gom theo manifest | LCP/INP/CLS p75 trên điện thoại/mạng/VPS thật; 16 CSS nguồn còn được giữ để tiếp tục rà selector cũ |
| UX-05 | Ba tên/credits đã đối chiếu; tiêu đề tổng hợp và chỉ mục đồng nhất; migrate vị trí/ghi chú cũ có backup | Một ứng viên metadata; hiệu đính thân bài, phân loại tác phẩm, ấn bản/quyền sử dụng |
| UX-06 | Chuyển tìm tên/kinh văn giữ từ khóa; bộ lọc toàn kho/ngôn ngữ rõ; Back giữ kết quả; rỗng online/offline đúng | Nhiệm vụ tìm đúng bản với người dùng thật |
| UX-07 | Đoạn x/y cùng đồng hồ đoạn, tiến độ toàn bản riêng theo số đoạn; phân biệt tua/lật trang | Người mới hiểu ba loại điều hướng; thời lượng thật khi có audio |
| UX-08 | Danh sách nghe/thời khóa chung bốn kho, tìm/thêm/xếp bằng nút; mẫu một sách; chỉnh và hoàn tác xóa | Người lớn tuổi dùng cảm ứng/AT |
| UX-09 | Tìm/đọc tiếp trước hero; hero điện thoại gọn, nghe rõ tên; ẩn player rỗng; bỏ bìa giả công cụ; nút ngoại tuyến trong vùng đầu | Nghiên cứu sử dụng và kiểm tra nhãn phụ/cỡ chữ toàn giao diện |
| UX-10 | Thiết bị/tên/hoạt động cuối, thu hồi/xóa; giới hạn hồ sơ/thiết bị/dung lượng; giữ ghi chú khác khi xung đột | Proxy/IP thật, bảo mật và xung đột trên thiết bị/mạng thật |
| Đọc/nghe bổ sung | Tên bản/credits/trạng thái, tìm trong sách trước/sau/trở lại, thử lại/mở nguồn khi lỗi, chọn phần Hán đối chiếu rõ; một thanh dùng chung | Mẫu thơ/kệ/chú/bảng/chú thích/Hán/Pāli có người đối chiếu; nghe 30–60 phút/khóa máy/cuộc gọi/Bluetooth |
| Ngoại tuyến/sao lưu | Chọn chỉ chữ/nguồn/chương tại trình đọc hoặc công cụ; dung lượng/giọng/tiến độ; hủy giữ phần xong; xuất media riêng, xác nhận gỡ | Chính sách giải phóng bộ nhớ và cài ứng dụng trên iOS/Android thật |
| Cộng đồng/vận hành | Trợ giúp, phạm vi dữ liệu, báo sai xem trước/JSON/mailto, share preview, hàng đợi biên tập, backup/restore riêng, probe và chẩn đoán | Người biên tập/duyệt quyền; lịch giám sát/sao lưu và diễn tập production; duyệt bộ kinh ngắn/giọng thật trước chuẩn bị audio khởi đầu |
| Kiến trúc/phát hành | Hợp đồng Reader/audio/queue/route, asset hash/version, cache cài có kiểm tra checksum và chờ người dùng, local launcher xử lý phiên bản mới | Triển khai thử/VPS và cập nhật qua proxy thật |

Tối ưu đầu trang giảm DOM từ 29.044 xuống 9.770 (**66,4%**), decoded resource từ 6.277.745 xuống 3.420.474 byte (**45,5%**); CSS tải đầu từ 16 xuống 1. Đây là số đo cục bộ về dữ liệu đã giải mã và công việc DOM, không phải số byte truyền trên VPS hay cam kết tốc độ người dùng thật. Selector nhiều sách không còn 2.784 option; các mục đã chọn được giữ có thứ tự.

Trong hồi quy có hai lỗi được phát hiện và sửa trước chốt: tên kinh chạm điều khiển ở 320 px và mốc đọc đổi sau tăng font. Đối chiếu ảnh còn phát hiện bộ chọn tìm kiếm chồng bộ lọc và CSS hero bị ghi đè; đã sửa và thêm kiểm tra. Kiểm tra mở Windows phát hiện so sánh version số/chuỗi; đã sửa, không khởi động trùng vào cổng có máy chủ cũ. Backend giữ version đã nạp để không báo nhầm mã mới khi process còn cũ.

## Hồi quy cuối

- [regression.json](../../tests/artifacts/ux-upgrade-20261010/regression.json): 15 lượt/bộ đạt, 29 nhóm theo chín đợt, hash tài nguyên đúng trước/sau, 52 tệp JS hợp lệ; không có pageError trong các đợt.
- Ba bộ Node: Reader, Narration, Formatter; kiểm tra bảo toàn kinh văn/phân đoạn và HTML an toàn theo mẫu.
- sync_lifecycle_check.py: 5 ca API với SQLite tạm; owner token cũ có thể thu hồi, hai hồ sơ tách biệt, hạn mức rollback và proxy peer.
- [stage9-update.json](../../tests/artifacts/ux-upgrade-20261010/stage9-update.json): 3 nhóm worker thật; update lỗi checksum bị từ chối, waiting không ngắt tiếng, chấp nhận cập nhật giữ sách/vị trí và cold reload offline. Worker revision/audio là fixture.
- unified_player_check.py: 10 nhóm; thanh gắn trong đọc cao 64 px desktop/108 px mobile; ngoài đọc 84/88 px, riêng 320 px 114 px để tránh chạm tên. Kiểm tra 320–1920 px và ba theme.
- structure_check.py: 8 nhóm, bốn kho, nguồn/PDF/Word, đường dẫn/private/traversal/host và trình duyệt thật.
- local_launcher_check.py: 4 ca, endpoint HTTP thật với payload thử; version chuỗi, máy chủ cũ, chỉ mục chưa sẵn sàng và identity process không theo tệp đã thay.
- [narration-local.json](../../tests/artifacts/ux-upgrade-20261010/narration-local.json): 200 yêu cầu, concurrency 2, transport fixture, thành công 100%, không cắt luồng/HTTP sai; không đo phát âm, tiếng trong loa hoặc công suất dịch vụ thật.

## Cách chạy lại và khôi phục

Gói cuối: [thuvien.7z](../../dist/vps/ux-20261010/thuvien.7z), **1.209.187.942 byte / 1.153,17 MiB**, 7.392 tệp theo manifest; đã đối chiếu 7.221 liên kết. Đi kèm [SHA-256](../../dist/vps/ux-20261010/thuvien.7z.sha256), [manifest](../../dist/vps/ux-20261010/package-manifest.json) và cai_dat_vps.sh. CRC toàn bộ archive, SQLite quick_check và ba truy vấn trên bản chụp đạt. [package.json](../../tests/artifacts/ux-upgrade-20261010/package.json) xác nhận hash/phiên bản, mã riêng không được phục vụ web, import công cụ vận hành và build lại ở cấu trúc VPS cho cùng phiên bản. Không có personal.sqlite3 trong gói.

Bản cục bộ đã mở bằng launch.py --no-browser tại http://127.0.0.1:8090/web-thuvien/index.html. [local-health.json](../../tests/artifacts/ux-upgrade-20261010/local-health.json): status, narration stats và tìm kiếm đều HTTP 200; runtime version đúng bbade1200ed1, chỉ mục sẵn sàng. Probe không yêu cầu TTS và không gửi dữ liệu riêng.

```text
python -X utf8 tools/build/build_ux_release.py
python -X utf8 tests/run_ux_regression.py
python -X utf8 tools/deploy/prepare_vps.py --out dist/vps/ux-20261010
python -X utf8 tools/maintenance/verify_ux_package.py
```

Không chạy build/sửa mã trong lúc đóng gói. Bản gói có SHA-256, manifest, CRC và bản chụp SQLite nhất quán; không có personal.sqlite3. Tệp gói trước được giữ dưới tên thuvien-truoc khi tạo bản mới.

Checkpoint mã: storage/backups/ux-upgrade-20261010/manifest.json. Metadata/ba tiêu đề và các hàng chỉ mục trước sửa có bản riêng trong metadata. Thân kinh được chứng minh giữ nguyên khi tạo ánh xạ ba header; không sửa Word/PDF gốc. Ghi chú/vị trí trước ánh xạ được lưu trên trình duyệt ở khóa before-header-migration.

Khi hoàn tác, đối chiếu checkpoint, phục hồi đồng bộ mã/catalog/header/chỉ mục cần thiết và tạo phiên bản/cache mới; giữ dữ liệu cá nhân hiện hành. Nếu quay về header cũ, dùng bản ghi trước ánh xạ để xử lý vị trí/ghi chú sau khi xuất JSON cá nhân; không ghi đè database cá nhân bằng bản chụp cũ để sửa lỗi giao diện. Diễn tập khôi phục máy chủ đã làm vào thư mục riêng, không thay storage/state.

## Cổng thực địa chưa ký đạt

Chưa triển khai gói lên VPS; chưa xác nhận tên miền, proxy, công suất và số đo production. Chưa có phiên Safari/iPhone/Android/AT thật, nghe khóa máy/cuộc gọi/Bluetooth 30–60 phút hoặc nghiên cứu người dùng. Chưa hiệu đính toàn kho, duyệt quyền sử dụng và giọng/audio khởi đầu. Ba cặp token màu đạt 4,5:1 trong ba theme chưa thay kiểm tra toàn bộ tương phản/WCAG.

Đã chuẩn bị [bảng nghiệm thu thực địa](../guides/NGHIEM_THU_THIET_BI_VA_CONG_DONG.md), [quy trình biên tập/vận hành](../guides/BIEN_TAP_VA_VAN_HANH.md) và [hợp đồng phần mềm](../guides/HOP_DONG_DOC_NGHE_DIEU_HUONG.md). Các việc này cần người/thiết bị/hạ tầng tương ứng, không thể ký thay bằng kiểm thử mô phỏng. Đầu mối góp ý đã cấu hình: **thanhtrungtb231096@gmail.com**; công cụ không gửi email tự động.

## Bổ sung 11/10/2026: thu gọn tra cứu, hiện nút đọc/nghe

Phiên bản mã cục bộ sau sửa: **ux-20261010-637203aacc4d**. Phần nghiệm thu và gói VPS ngày 10/10 ở trên ghi nhận phiên bản trước; đợt này chưa đóng gói lại hoặc triển khai VPS.

Nguyên nhân: tra cứu nối thêm 40 kết quả mỗi lần; CSS điện thoại ẩn nhãn đọc; bản thiếu văn bản Việt bị bỏ nút nghe. Đã đổi sang **8 kết quả/trang**, thu gọn dòng kết quả và đặt chúng ngay sau bộ lọc, trước hero. Nút đọc/nghe riêng luôn hiện trên máy tính và điện thoại. Bản Hán có nút “Đọc bản Hán” và nút nghe vô hiệu hóa kèm lý do “Chưa có bản Việt để nghe”; bản thiếu chữ vẫn có lối mở nguồn/PDF. Tủ sách gần đây, kinh đã lưu và nhánh danh mục cũng hiện điều khiển nghe cùng trạng thái khả dụng. Quay lại từ bản đọc giữ trang kết quả, từ khóa và bộ lọc.

- [Kiểm tra tra cứu và nút đọc/nghe](../../tests/artifacts/home-search-actions-20261011/results.json): 6 nhóm đạt; bốn kho; 320/390/768/1440 px × ba theme; phân trang có giới hạn, nút 44 px, không tràn ngang, đọc Hán thực tế, mở nguồn, Back về đúng trang 2 và trạng thái rỗng. [Ảnh máy tính](../../tests/artifacts/home-search-actions-20261011/search-1440.png), [ảnh điện thoại](../../tests/artifacts/home-search-actions-20261011/search-390.png).
- Chạy lại đợt [2](../../tests/artifacts/ux-upgrade-20261010/stage2.json) và [5](../../tests/artifacts/ux-upgrade-20261010/stage5.json): 8 nhóm đạt, cùng phiên bản mới. [reading_actions_check.py](../../tests/reading_actions_check.py): 9 nhóm đạt về đọc/nghe, hàng đợi, thời khóa và giữ phiên phát. Tổng cộng 23 nhóm, không có pageError; audio kiểm thử dùng WAV cục bộ, không đo giọng tổng hợp thực tế.
- Dựng lại CSS, URL có hash, định danh bản phát hành và cache ngoại tuyến; đối chiếu SHA-256 của 72 tài nguyên đều đúng. Chỉ mục vẫn có 5.348 bản văn / 3.395.798 đoạn. Bộ hồi quy chung đã thêm home_search_actions_check.py để giữ kiểm tra lỗi này ở các lần sửa tiếp theo.
