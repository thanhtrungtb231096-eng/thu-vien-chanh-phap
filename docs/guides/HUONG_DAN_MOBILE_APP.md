# Hướng Dẫn Triển Khai & Cài Đặt Ứng Dụng Di Động Chánh Pháp (iOS & Android)

Tài liệu này hướng dẫn từng bước dành cho người dùng sử dụng **máy tính Windows** và **điện thoại iPhone** (cùng điện thoại Android) để biên dịch, cài đặt và vận hành hệ sinh thái **Ứng dụng Di động Chánh Pháp** (`org.chanhphap.thuvien`).

---

## 1. Tổng Quan Kiến Trúc Đã Tích Hợp

Ứng dụng di động dùng chung 100% lõi giao diện [app/web](file:///e:/Kinh%20điển%20phật%20giáo/app/web) với bản Web PC và VPS, đồng thời bổ sung cầu nối bản địa [mobile-bridge.js](file:///e:/Kinh%20điển%20phật%20giáo/app/web/js/mobile-bridge.js) và plugin gốc `ChanhPhapEngine` (Swift + Kotlin):

1. **Nghe kinh liên tục khi tắt màn hình / khóa máy**:
   - **iOS**: `AVAudioSession (.playback, .spokenAudio)` + điều khiển trên Màn hình khóa, Dynamic Island, Control Center, AirPods & CarPlay (`MPNowPlayingInfoCenter` + `MPRemoteCommandCenter`), tự động tạo sẵn trước 2 đoạn kinh tiếp theo dưới nền.
   - **Android**: `Media3 ExoPlayer` + `MediaSessionService` (`FOREGROUND_SERVICE_MEDIA_PLAYBACK` + `WAKE_MODE_NETWORK`), không bị ngắt bởi chế độ tiết kiệm pin Doze.
2. **Đọc & Tra cứu Ngoại tuyến 3 Tầng (SQLite `.pack.db` + FTS5)**:
   - **Tầng 1 (Nhúng sẵn trong App — 6,96 MB)**: Toàn bộ 26 tài liệu Chùa Phúc Minh và 18 Kinh Nhật Tụng cốt lõi (Tâm Kinh, Kim Cang, A Di Đà, Phổ Môn, Địa Tạng, Dược Sư, Vu Lan, Pháp Cú...) mở tức thì ngay lần đầu cài đặt không cần mạng.
   - **Tầng 2 (Tải theo nhu cầu trong mục *Đọc & nghe ngoại tuyến*)**: Gói Đại Thừa (`21,6 MB`), Nam Tông & Sách giảng (`203,9 MB`), Đại Tạng Kinh Hán (`224,0 MB`) có sẵn chỉ mục tìm kiếm không dấu FTS5 nội bộ (`< 16 ms`).
   - **Tầng 3 (Giọng Đọc AI Nội Bộ `VieNeu-TTS-v3-Nano` FP16 — `138,1 MB`)**: Hai giọng **Thiền Tâm Đức (Nam)** và **Thục Đoan (Nữ)** chạy trực tiếp bằng ONNX Runtime trên chip iPhone / Android khi bật Chế độ Máy bay.
   - **Lưu nhanh từng bài kinh & chương nghe lẻ (`Tải để đọc/nghe ngoại tuyến`)**: Ngay trong thanh công cụ đọc kinh, người dùng có thể bấm **Tải để đọc/nghe ngoại tuyến** để lưu riêng một bản kinh (và từng chương âm thanh MP3 vào bộ nhớ đệm khóa màn hình nếu chưa tải Gói Giọng AI 138 MB).

> **Quy tắc sạch kho nguồn**: Mọi tệp nhị phân lớn đã xuất sẵn nằm gọn ngoài thư mục dự án tại `E:\Kinh điển phật giáo - Mobile\`, không làm phình kho mã nguồn chính.

---

## 2. Đưa Kho Gói Kinh & Giọng Đọc AI Lên Máy Chủ Hoặc Cloudflare R2

Các gói tải về cho điện thoại đã được xuất sẵn và kiểm tra mã băm SHA-256 tại:
- `E:\Kinh điển phật giáo - Mobile\cdn-upload\tts\vieneu-nano-mobile-v1\` (`138,14 MiB`)
- `E:\Kinh điển phật giáo - Mobile\cdn-upload\text-packs\` (`456,47 MiB`)

### Cách A: Phục vụ trực tiếp từ máy chủ Thư viện (`server.py`)
Máy chủ [server.py](file:///e:/Kinh%20điển%20phật%20giáo/app/server.py) đã hỗ trợ sẵn đường dẫn `/mobile-packs/` (kèm tải nối tiếp `HTTP Range 206 Partial Content`).
- **Trên máy tính Windows cục bộ**: Máy chủ tự động nhận diện thư mục `E:\Kinh điển phật giáo - Mobile\cdn-upload\`.
- **Trên VPS (`thuvienchanhphap.duckdns.org`)**: Sao chép thư mục `cdn-upload` lên VPS vào đường dẫn `deploy/goi-mobile/cdn-upload/` (hoặc đặt biến môi trường `THUVIEN_MOBILE_PACKS_DIR=/duong/dan/cdn-upload`).

### Cách B: Dùng Cloudflare R2 (Miễn phí 10 GB lưu trữ + 0 phí băng thông tải ra)
1. Tạo bucket R2 trên Cloudflare và bật tên miền công khai (ví dụ `https://packs.chanhphap.org`).
2. Tải nguyên cấu trúc bên trong `cdn-upload/` lên thư mục `/mobile-packs/` của bucket R2.
3. Đặt biến môi trường `THUVIEN_MOBILE_PACK_CDN_URL=https://packs.chanhphap.org` trên VPS — máy chủ sẽ tự động chuyển hướng (`302`) các lượt tải gói dung lượng lớn sang R2 CDN để bảo vệ băng thông VPS.

---

## 3. Biên Dịch Tệp Cài Đặt `.ipa` (iPhone) & `.apk` (Android) Từ Máy Windows

Vì Apple chỉ cho phép trình biên dịch Xcode chạy trên macOS, dự án đã cấu hình sẵn dây chuyền **Cloud macOS 15 tự động** tại [build-mobile.yml](file:///e:/Kinh%20điển%20phật%20giáo/.github/workflows/build-mobile.yml). Bạn không cần mua máy Mac:

### Bước 1: Đẩy mã nguồn lên GitHub (Kho Private miễn phí)
GitHub cung cấp **2.000 phút chạy máy ảo miễn phí mỗi tháng** cho kho Private. Mở PowerShell tại `E:\Kinh điển phật giáo`:

```powershell
git init
git add .
git commit -m "Tích hợp hệ thống Mobile App iOS & Android Chánh Pháp"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/thu-vien-chanh-phap.git
git push -u origin main
```

### Bước 2: Bấm nút Biên dịch trên Đám mây
1. Mở trang GitHub của kho dự án trên trình duyệt Windows → chọn thẻ **Actions**.
2. Chọn quy trình **Build Chánh Pháp Mobile Apps (iOS .ipa & Android .apk)** ở cột bên trái.
3. Nhấn nút **Run workflow** → giữ nguyên địa chỉ máy chủ (hoặc nhập tên miền riêng) → nhấn **Run workflow**.
4. Sau khoảng **8–12 phút**, quy trình hoàn tất sẽ xuất ra 2 gói tải về trong mục **Artifacts**:
   - `ChanhPhap-iOS-Unsigned-IPA` (chứa tệp `ChanhPhap-iOS-Unsigned.ipa` cho iPhone).
   - `ChanhPhap-Android-APK` (chứa tệp `ChanhPhap-Android.apk` cài ngay lên mọi máy Android).

---

## 4. Hai Cách Cài Đặt Lên Điện Thoại iPhone Của Bạn

### Lựa chọn 1: Cài đặt thử nghiệm ngay trên Windows với chi phí \$0 (Qua Sideloadly)
Phù hợp để trải nghiệm thực tế ngay trên chiếc iPhone cá nhân của bạn trước khi mở tài khoản Apple Developer:
1. Tải và cài **iTunes** (bản cài trực tiếp từ trang chủ Apple, không dùng bản Microsoft Store) + công cụ **Sideloadly** trên máy Windows.
2. Cắm cáp nối iPhone vào máy tính Windows và chọn **Tin cậy máy tính này (Trust This Computer)** trên màn hình iPhone.
3. Trên iPhone (iOS 16 trở lên): Mở **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ Nhà phát triển (Developer Mode)** → Bật lên và khởi động lại máy.
4. Giải nén `ChanhPhap-iOS-Unsigned-IPA.zip` lấy tệp `ChanhPhap-iOS-Unsigned.ipa`, kéo thả vào cửa sổ **Sideloadly**, nhập Apple ID cá nhân và nhấn **Start**.
5. Lần đầu cài xong, trên iPhone vào **Cài đặt → Cài đặt chung → Quản lý VPN & Thiết bị** → chọn email Apple ID của bạn → nhấn **Tin cậy (Trust)**. Mở biểu tượng **Chánh Pháp** ngoài màn hình chính và trải nghiệm!

### Lựa chọn 2: Phát hành rộng rãi qua Apple TestFlight & App Store (\$99/năm)
Khi sẵn sàng chia sẻ cho toàn thể đạo hữu (tối đa 10.000 người qua đường dẫn TestFlight hoặc tải thẳng trên App Store, không cần cắm dây máy tính):
1. Đăng ký tài khoản **Apple Developer Program** (\$99/năm) và **Google Play Console** (\$25 một lần duy nhất cho Android).
2. Trong trang GitHub kho dự án → **Settings → Secrets and variables → Actions**, thêm 7 khóa bảo mật:
   - `APPLE_TEAM_ID`: Mã Team ID 10 ký tự của bạn trên Apple Developer.
   - `APPLE_CERTIFICATE_P12_BASE64`: Chuỗi Base64 của chứng chỉ phân phối `.p12`.
   - `APPLE_P12_PASSWORD`: Mật khẩu bảo vệ tệp `.p12`.
   - `APPLE_PROVISIONING_PROFILE_BASE64`: Chuỗi Base64 của hồ sơ cấp phép App Store cho Bundle ID `org.chanhphap.thuvien`.
   - `APPSTORE_API_KEY_ID`, `APPSTORE_API_ISSUER_ID`, `APPSTORE_API_PRIVATE_KEY`: Khóa App Store Connect API để tự động đẩy bản dựng lên **TestFlight**.
3. Chạy lại **Run workflow** trên GitHub Actions — hệ thống sẽ tự động ký số chính thức và đẩy ứng dụng thẳng lên **Apple TestFlight** của bạn!

---

## 5. Các Lệnh Bảo Trì Khi Cập Nhật Nội Dung Hoặc Giao Diện Sau Này

Mỗi khi bạn bổ sung kinh sách mới hoặc nâng cấp giao diện trong `app/web/`, chỉ cần chạy trên máy Windows:

```powershell
# 1. Đồng bộ phiên bản giao diện Web dùng chung
python -X utf8 tools/build/build_ux_release.py

# 2. (Tùy chọn) Đóng gói lại các gói kho kinh .pack.db nếu có kinh văn mới
python -X utf8 tools/mobile/build_text_packs.py

# 3. Kiểm tra tự động toàn bộ hệ thống Web + Cầu nối Mobile App
python -X utf8 tests/structure_check.py
python -X utf8 tests/mobile_app_check.py
```

