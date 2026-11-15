# Hướng Dẫn Đóng Gói & Phát Hành Ứng Dụng Windows PC (Microsoft Store `.msix` & Bộ Cài `.exe`)

Tài liệu này hướng dẫn toàn trình xuất bản **Đại Thư Viện Kinh Điển Phật Giáo Chánh Pháp** (`org.chanhphap.thuvien`) thành ứng dụng **Windows 10/11 Native (`Tauri v2` + `Rust`)**, hoàn thiện hệ sinh thái **4 nền tảng chung 1 lõi giao diện duy nhất** (**Web/VPS · iPhone/iPad iOS · Android · Windows PC Microsoft Store**).

---

## 1. Kiến trúc Ứng dụng Windows PC có gì đặc biệt?

1. **Siêu nhẹ & Mượt tức thì (Tauri v2 + WebView2 Native):**
   - Tận dụng nhân hiển thị `Edge WebView2` có sẵn trong Windows 10/11 thay vì nhồi cả trình duyệt Chromium nặng hàng trăm MB như Electron. Bộ cài đặt gọn nhẹ chỉ khoảng **`~18–32 MB`** (đã nhúng sẵn gói *Tủ Sách Phúc Minh & 18 Kinh Nhật Tụng Cốt Lõi*).
2. **Đọc & Tìm kiếm Ngoại tuyến 5.348 Bản Kinh (`rusqlite` + `FTS5` Native Rust):**
   - Toàn bộ các gói kinh `.pack.db` dùng chung định dạng 100% với bản iOS & Android, lưu bền vững tại `%LOCALAPPDATA%\ChanhPhapVault` (không bị trình duyệt tự dọn rác, tốc độ mở kinh dưới `2 ms`).
3. **Tự Tổng Hợp Giọng Đọc AI Nội Bộ trên CPU Máy Tính (`ort` ONNX Runtime Rust):**
   - Tích hợp động cơ `VieNeu-TTS-v3-Nano` 4 mạng nơ-ron (`Thiền Tâm Đức` & `Thục Đoan`) chạy thẳng bằng C++/Rust trên CPU máy tính kể cả khi rút dây mạng Wi-Fi, kết hợp bộ đệm tải trước 2 đoạn (`gapless prefetch`) và tích hợp phím cứng âm thanh Windows 10/11 (`SystemMediaTransportControls` / nút Play-Pause trên bàn phím & tai nghe Bluetooth).
4. **Thích ứng Hoàn hảo Cả Chuột Lẫn Màn Hình Cảm Ứng (Surface / Laptop 2-trong-1):**
   - Mở toàn màn hình máy tính: hiển thị giao diện Điện thờ 3 cột sang trọng.
   - Thu gọn cửa sổ chia đôi màn hình hoặc xoay dọc trên máy tính bảng Windows Surface: tự động chuyển sang Thanh điều hướng đáy 5 trụ cột, Ngăn kéo vuốt cạnh màn hình và Chế độ Thiền (Zen Mode) chạm một ngón.

---

## 2. Xuất bản tự động trên Đám mây GitHub Actions (Không cần cài bộ biên dịch C++/Rust nặng vào máy)

Mọi công cụ nặng (Visual Studio C++ Build Tools, Rust Cargo, Windows 10/11 SDK `makeappx.exe`) đều được GitHub cấp sẵn miễn phí trên máy chủ đám mây `windows-2022`.

### Các bước bấm nút tạo gói `.exe` và `.msix`:
1. Đẩy mã nguồn dự án lên kho GitHub cá nhân của bạn.
2. Mở tab **Actions** trên GitHub → chọn quy trình **`Build Chánh Pháp Windows PC App (Microsoft Store .msix & Setup .exe)`**.
3. Bấm nút **Run workflow** → bấm xác nhận **Run workflow**.
4. Sau khoảng **8–12 phút**, quá trình hoàn tất và xuất ra **2 gói cài đặt** ở mục **Artifacts** cuối trang:
   - **`ChanhPhap-Windows-Setup-EXE`** (`ChanhPhap-Windows-Setup_x64.exe`): Bộ cài đặt độc lập tiếng Việt — tải về máy Windows bất kỳ, nhấp đúp cài trong 5 giây là có biểu tượng **Chánh Pháp** ngoài Màn hình chính (Desktop) & Start Menu.
   - **`ChanhPhap-Windows-Store-MSIX`** (`ChanhPhap-Windows-Store_x64.msix`): Gói chuẩn đóng hộp của Microsoft để đưa lên chợ ứng dụng **Microsoft Store**.

---

## 3. Hướng dẫn Đưa Ứng Dụng lên Chợ **Microsoft Store** (Windows 10 & Windows 11)

Tin vui đối với nhà phát triển cá nhân: từ năm 2025, Microsoft đã mở chương trình đăng ký tài khoản **Individual Developer** trên Microsoft Partner Center với chi phí **0\$ (miễn phí)** hoặc phí xác minh một lần rất nhỏ tùy quốc gia, **không thu phí duy trì hằng năm** và **Microsoft tự động ký chứng chỉ số (Code Signing) miễn phí** cho gói `.msix` khi duyệt lên Store!

### Bước 1: Đăng ký tên ứng dụng trên Microsoft Partner Center
1. Truy cập [partner.microsoft.com/dashboard](https://partner.microsoft.com/dashboard) và đăng nhập bằng tài khoản Microsoft cá nhân.
2. Vào **Apps and games** → bấm **New product** → chọn **MSIX or PWA app**.
3. Đặt tên hiển thị trên Store (ví dụ: **`Chánh Pháp - Đại Thư Viện Kinh Điển`**) và bấm **Reserve product name**.

### Bước 2: Lấy 2 thông số định danh của Microsoft cấp cho ứng dụng
1. Trong trang quản lý ứng dụng vừa tạo trên Partner Center, mở mục **Product management** → **Product identity**.
2. Sao chép chính xác 2 dòng sau:
   - **`Package/Identity/Name`** (ví dụ: `12345TenCuaBan.ChanhPhapDaiThuVien`)
   - **`Package/Identity/Publisher`** (ví dụ: `CN=A1B2C3D4-E5F6-7890-ABCD-1234567890AB`)

### Bước 3: Bấm Build lại gói `.msix` khớp định danh Partner Center
1. Quay lại tab **Actions** trên GitHub → chọn **`Build Chánh Pháp Windows PC App`** → bấm **Run workflow**.
2. Dán 2 dòng vừa sao chép vào 2 ô:
   - `ms_store_identity_name`: dán giá trị `Package/Identity/Name`
   - `ms_store_publisher`: dán giá trị `Package/Identity/Publisher`
   - `app_version`: giữ `1.0.0.0` (lưu ý: chữ số thứ 4 của phiên bản MSIX trên Microsoft Store luôn phải là `.0`, ví dụ `1.0.0.0`, `1.1.0.0`).
   *(Mẹo: Bạn cũng có thể lưu cố định vào GitHub Settings → Secrets → `MS_STORE_IDENTITY_NAME` và `MS_STORE_PUBLISHER` để các lần sau không cần dán lại).*
3. Tải gói **`ChanhPhap-Windows-Store_x64.msix`** về máy.

### Bước 4: Tải gói `.msix` lên Store & Phát hành
1. Trên Partner Center, mở **Submissions** → **Start your submission**.
2. Mục **Packages**: kéo thả tệp **`ChanhPhap-Windows-Store_x64.msix`** vào. Hệ thống của Microsoft sẽ tự động kiểm tra `AppxManifest.xml`, bộ ảnh Tiles (`StoreLogo`, `Square44x44Logo`, `Square150x150Logo`, `Wide310x150Logo`, `Square310x310Logo`, `SplashScreen`) và xác nhận hợp lệ.
3. Mục **Properties**: chọn danh mục **Books & reference** (Sách & Tra cứu), khai báo phân loại độ tuổi **IARC** (Mọi lứa tuổi — `3+`).
4. Mục **Store listings**: chọn ngôn ngữ **Vietnamese**, điền mô tả ngắn gọn và tải lên 3–4 ảnh chụp màn hình ứng dụng.
5. Bấm **Submit to the Store**. Đội ngũ Microsoft thường duyệt trong **24–48 giờ**; ngay khi duyệt xong, hàng triệu người dùng Windows 10 & Windows 11 có thể tìm chữ **"Chánh Pháp"** trong **Microsoft Store** và bấm **Get / Install** chỉ bằng 1 cú nhấp chuột!

---

## 4. Biên dịch trực tiếp trên máy tính Windows cá nhân (Tùy chọn cho Lập trình viên)

Nếu bạn muốn tự biên dịch ngay trên máy tính Windows của mình thay vì dùng GitHub Actions:
1. Cài đặt [Rust (`rustup.rs`)](https://rustup.rs/) và **Visual Studio C++ Build Tools** (*Desktop development with C++*).
2. Chạy lệnh tạo gói giao diện & biểu tượng chuẩn Windows ra thư mục ngoài dự án (`E:\Kinh điển phật giáo - Mobile\windows-staging`):
   ```powershell
   python -X utf8 tools/windows/build_windows_shell.py
   ```
3. Biên dịch bộ cài `.exe`:
   ```powershell
   cd desktop-windows
   npm install
   npm run build:exe
   ```
   Bộ cài hoàn chỉnh sẽ nằm tại `desktop-windows/src-tauri/target/release/bundle/nsis/`.

