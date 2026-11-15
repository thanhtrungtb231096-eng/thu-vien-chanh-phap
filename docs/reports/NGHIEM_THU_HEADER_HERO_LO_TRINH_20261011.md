# Nghiệm thu header, hero và lộ trình tu học — 11/10/2026

Đã triển khai trong workspace, phiên bản **ux-20261010-337599538300**. Đây là bản cập nhật cục bộ; chưa đóng gói lại hoặc triển khai VPS. Chỉ mục vẫn có **5.348 bản văn / 3.395.798 đoạn**.

Mở `MO_THU_VIEN.cmd`, chọn **Lộ trình tu học** ở thanh bên hoặc menu điện thoại. Có thể mở trực tiếp `#paths/nen-tang/nguon-kinh`.

## Kết quả

- Header có nhận diện pháp luân, chữ serif và điểm nhấn vàng đồng. 23 module dùng hero chung, cùng hero riêng của trang chủ và trang bộ kinh. Mỗi cây tạng, nhánh danh mục và danh sách khóa tụng có nội dung giới thiệu phù hợp.
- Lộ trình mới có **5 hướng / 23 bài / 22 hồ sơ nguồn**: nền tảng, Nikāya, Đại thừa, Tịnh độ và khảo cứu.
- Mỗi bài có mục tiêu, bối cảnh, điểm đọc, mã và bộ kinh, nguồn đối chiếu, bản đọc thực trong kho, bài thực hành, câu hỏi tự kiểm tra và nhật ký.
- Có sơ đồ các lớp truyền thừa kinh sách, thuật ngữ, danh mục nguồn và phân biệt kinh/chú giải/hướng dẫn biên soạn.
- Nhịp 15/25/40 phút, checklist tự xác nhận, tiến độ theo bài, ghi chép lưu riêng, giữ bản nháp khi chuyển bài, xuất nhật ký và tạo thời khóa từ bản Việt có thật.
- Đường dẫn từng bài hoạt động với tải lại, Back/Forward và đọc kinh rồi trở lại bài. Đã sửa URL danh mục cũ để đổi sang dạng chuẩn ngay trong phiên điều hướng.

Nội dung, phương pháp chọn nguồn và cấu trúc mở rộng được ghi trong [tài liệu thiết kế và nghiên cứu](../design/HEADER_HERO_VA_LO_TRINH_TU_HOC_20261011.md).

## Bằng chứng

| Kiểm tra | Phạm vi | Bằng chứng |
|---|---|---|
| `module_study_check.py` | 23 bài, nguồn/bản liên kết, quiz, checklist, ghi chép, bản nháp, lịch học, xuất JSON, đường dẫn và menu điện thoại | [results.json](../../tests/artifacts/module-study-20261011/results.json) |
| Bố cục mới | 45 bố cục lộ trình và 345 bố cục hero; 320/390/768/1440/1920 px, ba theme | Cùng `results.json`; không tràn ngang, không lỗi JavaScript |
| `canon_tree_check.py` | 4.183 tài liệu, ba cây, 25 bộ Hán tạng, 26 tài liệu Phúc Minh, bản Hán, nguồn cùng mã, URL cũ, đọc/nghe liên tục, năm độ rộng | [report.json](../../tests/artifacts/canon-tree/report.json) |
| `reading_actions_check.py` | Đọc/nghe qua bộ kinh, khóa tụng, hàng đợi, thời khóa, bản thu và bản Hán; giữ trạng thái phát | 9 nhóm đạt, WAV cục bộ |
| `run_ux_regression.py` | Các đợt UX, Reader/Narration/Formatter, đồng bộ, cache/worker, player, tra cứu, cấu trúc và launcher | [regression.json](../../tests/artifacts/ux-upgrade-20261010/regression.json) |
| Lộ trình ngoại tuyến | Cài cache, tắt mạng, tải lại bài với nguồn và nhật ký; chuyển hướng học khi mạng tắt | [offline.json](../../tests/artifacts/module-study-20261011/offline.json) |

Kết quả cuối: **17/17 lượt hồi quy đạt**, 29 nhóm trong chín đợt UX, 55 tệp JavaScript qua syntax; 8 nhóm nghiệm thu lộ trình; 9 nhóm cây tạng kinh; 9 nhóm thao tác đọc/nghe. Không có lỗi JavaScript trong các kiểm tra trình duyệt. SHA-256 của **77 tài nguyên** khớp manifest; ba script lộ trình/hero mới có trong danh sách precache. Số DOM ban đầu 9.771 và decoded resource 3.535.057 byte trong đợt UX-04; đây là số đo cục bộ.

Ảnh: [lộ trình máy tính](../../tests/artifacts/module-study-20261011/paths-1440.png), [lộ trình điện thoại](../../tests/artifacts/module-study-20261011/paths-390.png), [bài học máy tính](../../tests/artifacts/module-study-20261011/lesson-1440.png), [bài học điện thoại](../../tests/artifacts/module-study-20261011/lesson-390.png).

Trong hồi quy đã phát hiện và sửa việc hero công cụ đẩy nút tải ngoại tuyến xuống thấp trên điện thoại. Kiểm tra lại ở 320/390 px giữ nút thao tác trong vùng đã quy định của nghiệm thu trước.

Hai giả định của kiểm tra cây cũ đã được cập nhật: bản Hán hiện có nút nghe vô hiệu hóa kèm lý do theo bản sửa trước; ảnh chụp hash lịch sử của Reader/audio đã cũ sau các nâng cấp được nghiệm thu ngày 10–11/10. Kiểm tra hiện xác nhận các nguồn đang dùng không đổi trong lúc chạy; ảnh chụp lịch sử vẫn được giữ.

## Phạm vi xác nhận

Kiểm tra trên Chromium cục bộ và các khung nhìn mô phỏng; audio dùng WAV fixture, không đánh giá phát âm TTS thực hoặc thiết bị di động thật. Nội dung hướng dẫn tu học có dẫn nguồn và phân lớp biên soạn, chưa có ghi nhận thẩm định chuyên môn Phật học. Đây là hai phạm vi riêng với kiểm tra phần mềm.

Các tệp nguồn kinh, PDF và Word không thuộc thay đổi này. Thời lượng và thứ tự bài là gợi ý học tập; tiến độ không đánh giá chứng đắc.

## Chạy lại và khôi phục

```text
python -X utf8 tools/build/build_ux_release.py
python -X utf8 tests/module_study_check.py
python -X utf8 tests/run_ux_regression.py
```

Checkpoint các tệp đã sửa trước khi triển khai: `storage/backups/module-study-20261011/manifest.json`. Khi cần hoàn tác, dùng bản sao các tệp tương ứng, bỏ các script mới khỏi HTML/manifest stylesheet, dựng lại release và cache; giữ nguyên dữ liệu tu học cá nhân. Không thay database cá nhân hoặc kinh văn bằng bản cũ để hoàn tác giao diện.
