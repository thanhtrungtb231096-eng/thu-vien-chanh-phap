# Nghiệm thu thiết bị thật và cộng đồng

Tình trạng ngày 10/10/2026: đã có hồi quy cục bộ với Chromium và kinh văn thật; audio tương tác dùng WAV mẫu. Các ô dưới đây chưa được ký đạt. Không dùng điểm kiểm thử cục bộ để công bố chứng nhận WCAG, Core Web Vitals, chất lượng phát âm hoặc công suất VPS.

## Ghi thông tin mỗi lượt

Phiên bản thư viện, URL, ngày, người thử, thiết bị/OS/trình duyệt, công nghệ hỗ trợ, cỡ chữ/zoom, Wi-Fi/di động và cache nóng/lạnh. Dùng hồ sơ tu học thử riêng. Xuất chẩn đoán phiên ở Trợ giúp; tệp không chứa ghi chú. Không đưa ảnh có dữ liệu riêng vào báo cáo công khai.

| Thiết bị tối thiểu | Người thử | Phiên bản | Kết quả | Bằng chứng |
|---|---|---|---|---|
| Windows + Chrome/Edge + bàn phím + NVDA | Chưa phân công | | Chưa thử | |
| iPhone + Safari + VoiceOver, cả web và màn hình chính | Chưa phân công | | Chưa thử | |
| Android phổ thông + Chrome + TalkBack, cả web và ứng dụng đã cài | Chưa phân công | | Chưa thử | |
| Máy tính/macOS + Safari để kiểm tra khác engine | Chưa phân công | | Chưa thử | |

Mỗi lỗi ghi bước tái hiện, mong đợi/thực tế, phiên bản, ảnh/log và mức ảnh hưởng. Sau sửa, chạy lại ca trượt cùng các luồng liên quan. Không ký nghiệm thu khi còn lỗi mất dữ liệu, sai vị trí, không đọc/nghe được hoặc focus chặn tác vụ chính.

## Nhiệm vụ trọng tâm

| Ca | Cách thực hiện | Điều kiện đạt |
|---|---|---|
| F01 Tìm đúng bản | Tìm Dược Sư, một bản Phúc Minh và một sách Word; chuyển tên sách/kinh văn; kiểm tra dịch giả và bản ngôn ngữ | Không nhầm kho/bản; ghi thời gian và mọi thất bại; mục tiêu ban đầu khoảng 60 giây, cần hiệu chỉnh theo khảo sát |
| F02 Lịch sử | Đi danh mục → tác phẩm → đọc; tìm câu → đọc; Back/Forward và reload deep link | Đúng màn hình, query/filter, đoạn; không tự dừng tiếng |
| F03 Đọc lâu | Đọc mẫu văn xuôi/kệ/chú/bảng/chú thích/Hán/Pāli; tăng font, xoay máy, zoom 200%, bố cục 320 px | Chữ không mất/cắt, đúng đoạn đã lưu, focus không khuất sau thanh đáy; người đọc đối chiếu mẫu với nguồn |
| F04 Bàn phím/AT | Hai vòng Tab/Shift+Tab, vào kinh văn Enter, ghi chú, tìm trước/sau, đóng dialog/Menu bằng Escape | Tên truy cập diễn đạt đúng, slider đọc giá trị/tên, vòng focus đúng; kiểm tra mọi cặp màu dùng cho chữ/control, kể cả hover/disabled/focus |
| F05 Ba cách điều hướng | Nhờ người mới chỉ nút lật trang, chuyển đoạn nghe và ±10 giây | Hiểu đúng ba thao tác; đồng hồ theo đoạn không bị hiểu là tổng thời lượng |
| F06 Nghe 30–60 phút | Khóa màn hình, cuộc gọi, Bluetooth, mất/đổi mạng, đổi giọng, tạm dừng khi đang tải, đóng/mở lại | Ghi mọi gián đoạn, thao tác phục hồi, block và giây trước/sau; không tự phát khi đã bấm dừng; thống nhất sai lệch nghe tiếp trước lượt thử |
| F07 Hẹn/lặp | Thử hẹn dừng, toàn kinh, một kinh, A–B và nghe lại từ đầu | Dừng/lặp đúng phần; đổi lặp không làm mất vị trí đọc hoặc hàng đợi |
| F08 Ngoại tuyến | Chỉ chữ; thêm nguồn; tải một chương, hủy nửa chừng; đóng ứng dụng, bật chế độ máy bay và mở lại | Đọc/nguồn/audio đúng phần đã tải; nói rõ phần thiếu, giọng và số đoạn; hoàn tất cũ được giữ sau hủy/cập nhật |
| F09 Đồng bộ | Hai hồ sơ thử/two devices; thêm/sửa/xóa ghi chú, cùng sửa khi mất mạng; reconnect; thu hồi từ xa, xóa hồ sơ | Không hợp nhất lẫn hồ sơ; giữ phiên bản khác để đối chiếu; token thu hồi bị từ chối; dữ liệu cục bộ còn sau xóa hồ sơ |
| F10 Sao lưu/xóa | Xuất/nhập JSON; xuất một bản thu; gỡ cache/bản thu; tạo/xóa/hoàn tác thời khóa | Phạm vi sao lưu đúng lời hướng dẫn; thao tác có xác nhận/hoàn tác phù hợp; thời gian hoạt động không được hiểu là đã hoàn thành |
| F11 Cập nhật | Có bản mới khi đang nghe và đang ngoại tuyến; từ chối cập nhật rồi chấp nhận khi thuận tiện | Giao diện đang dùng giữ tương thích, không tự reload, lưu vị trí, cache sách còn; bản thiếu/sai checksum không được kích hoạt |
| F12 Góp ý/chia sẻ | Chọn đoạn, báo sai, xem trước JSON/email; chia sẻ URL cho thiết bị thứ hai | Đúng book/block/version, không có ghi chú riêng; xem trước có tên/trích dẫn đúng; kiểm tra hiển thị link trên ứng dụng chia sẻ thực tế |

## Nội dung và âm thanh trước khi giới thiệu

Chọn bộ kinh ngắn để khởi đầu, gồm Tâm Kinh đang có nút nghe rõ tên. Người biên tập xác minh metadata, loại tác phẩm/ấn bản, quyền chia sẻ và đối chiếu toàn bản. Người thứ hai duyệt trước khi gắn “đã hiệu đính”. Không tự đổi proofread chỉ vì bài thử không mất ký tự.

Nghe giọng thật với người am hiểu: tên người, Pāli, tên phẩm, dấu câu, thơ/kệ, chú và những đoạn có bảng/chú thích. Ghi voice/rate/pronunciation version, đoạn sai, cách đọc mong muốn và người duyệt. Chuẩn bị audio trước cho bản khởi đầu sau khi văn bản/giọng được duyệt. WAV kiểm thử và cache được tạo tự động chưa thay thế việc này.

Hàng đợi nội dung: docs/reports/editorial/review-queue.csv (675 bản ưu tiên theo cờ), metadata-review.csv (ứng viên tiêu đề cần xác minh). Cờ chỉ là tín hiệu; không suy ra 675 bản sai. Bổ sung phân loại kinh/luật/luận/chú giải/nghiên cứu/tư liệu, các bản cùng mã và nguồn/ấn bản/quyền sử dụng theo hồ sơ duyệt.

## Đo trên VPS

1. Cài gói đã kiểm tra vào môi trường thử; không ghi đè personal.sqlite3; đối chiếu manifest/hash, HTTP status, version client/server, nguồn và share link.
2. Chạy health_probe theo lịch, lưu lỗi HTTP/nguồn, độ trễ tìm, dung lượng cache/đĩa, trạng thái chỉ mục và hàng đợi/lỗi TTS. Một lần thành công không phải uptime tháng.
3. Đo nhiều lượt trên điện thoại/mạng thực tế: LCP/CLS và INP bằng công cụ phù hợp, lấy p75 theo nhóm thiết bị. Mục tiêu tham chiếu LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1. Chẩn đoán phiên chỉ cung cấp LCP/CLS và thời lượng tương tác quan sát lớn nhất, chưa phải INP chuẩn.
4. Đo nhấn nghe → media playing và byte đầu máy chủ riêng: p50/p95, cache/new synthesis, giọng và thiết bị; ghi hết phiên và gián đoạn. Ngưỡng audio đề xuất trong audit cần xác nhận bằng hạ tầng thật.
5. Thử tải nhiều phiên cùng/khác văn bản và giọng, ưu tiên đoạn đang nghe, hủy và phục hồi. Phép thử 200 yêu cầu fixture cục bộ không chứng minh công suất dịch vụ giọng/VPS.
6. Kiểm tra reverse proxy ghi IP thật, giới hạn tạo hồ sơ/dung lượng/ghép mã với hai khách; kiểm thử bảo mật riêng trước mở rộng.
7. Lập lịch sao lưu cá nhân và nguồn; khôi phục vào thư mục/máy thử, ghi thời gian và thử sync sau restore. Chỉ triển khai khôi phục production với đích và cửa sổ bảo trì đã xác minh.

## Quan sát người dùng

Mời ba nhóm: người mới, người lớn tuổi dùng điện thoại, người đọc/nghiên cứu thường xuyên; bắt đầu 5–6 người mỗi nhóm, bổ sung người dùng AT. Giao nhiệm vụ F01/F02/F06/F08/F09 mà không chỉ sẵn từng bước. Ghi hoàn thành/thất bại, thời gian, thao tác sai và nơi người thử không biết làm gì tiếp. Mẫu nhỏ nhằm tìm lỗi, không đại diện thống kê cả cộng đồng.

Phát hành mở rộng cần người phụ trách kỹ thuật, nội dung và vận hành ký các mục liên quan; kèm lỗi còn mở và cách xử lý. Đầu mối góp ý: thanhtrungtb231096@gmail.com.
