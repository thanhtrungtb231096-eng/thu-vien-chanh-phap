# Đại Thư Viện Chánh Pháp — Đã Trực Tuyến Thành Công

> [!TIP]
> **ĐỊA CHỈ TRUY CẬP CHÍNH THỨC (Gửi link này cho bạn bè):**
> 
> ### **https://thuvienchanhphap.duckdns.org**
> 
> - **Tên miền:** `thuvienchanhphap.duckdns.org` (Miễn phí vĩnh viễn, có SSL ổ khóa xanh)
> - **Máy chủ:** Oracle Cloud Always Free (Singapore) — **0đ/tháng**
> - **IP Public:** `161.118.198.123`
> - **Tính năng hoạt động:** Toàn bộ kinh điển Đại Tạng & Đại Thừa, tìm kiếm toàn văn FTS5, 4 giọng đọc tiếng Việt (Hoài My, Nam Minh), đồng bộ tiến độ đọc giữa các thiết bị.

---

> [!TIP]
> Thẻ ghi nợ (debit) của Vietcombank, Techcombank, TPBank… thường dùng được. **Thẻ ảo hoặc thẻ trả trước hay bị từ chối.**

---

## Phần A — Đăng ký tài khoản (15 phút)

1. Vào **https://www.oracle.com/cloud/free/** → bấm **Start for free**.
2. Điền **Country: Vietnam**, họ tên (**viết không dấu, giống tên trên thẻ**), email → xác nhận email.
3. Đặt mật khẩu và **Cloud Account Name** (ví dụ `thuvienchanhphap`; ghi lại tên này để đăng nhập).
4. **Home Region: chọn `Singapore`**.
   > [!IMPORTANT]
   > Home Region **không đổi được** về sau, và máy miễn phí chỉ tạo được ở vùng này. Chọn Singapore để bạn bè ở Việt Nam mở trang nhanh nhất.
5. Nhập địa chỉ, số điện thoại → nhập thẻ để xác minh → đồng ý điều khoản → **Start my free trial**.
6. Chờ email "Your account is ready" (thường 5–30 phút) → đăng nhập tại **https://cloud.oracle.com**.

**Nếu bị báo lỗi thẻ:** thử một thẻ khác, tắt VPN, dùng trình duyệt Chrome bình thường (không ẩn danh). Đây là khâu khó nhất; qua được bước này thì phần còn lại dễ.

---

## Phần B — Tạo máy chủ (10 phút)

1. Menu ☰ → **Compute** → **Instances** → **Create instance**.
2. **Name:** `thuvien`.
3. **Image and shape** → **Edit**:
   - **Change image** → **Canonical Ubuntu** → **24.04** (chọn bản thường, không chọn *Minimal*) → Select.
   - **Change shape** → **Ampere** → **VM.Standard.A1.Flex** → kéo **1 OCPU, 6 GB RAM** → Select.
     *Nếu báo **"Out of capacity"**:* chọn **Specialty and previous generation** → **VM.Standard.E2.1.Micro** (1 GB RAM, cũng miễn phí và đủ dùng).
4. **Networking:** để mặc định (*Create new virtual cloud network*, *public subnet*, **Assign a public IPv4 address = Yes**).
5. **Add SSH keys:** chọn **Generate a key pair for me** → bấm **Save private key**. Lưu file `.key` vào chỗ dễ tìm, ví dụ `E:\thuvien-vps\`.
   > [!CAUTION]
   > Mất file `.key` là **không vào được máy chủ nữa**. Hãy sao lưu file này.
6. **Boot volume:** để mặc định (khoảng 47 GB, vẫn miễn phí) → bấm **Create**.
7. Chờ trạng thái chuyển sang **Running** (màu xanh) → **ghi lại `Public IP address`**.

### Mở cổng web (bắt buộc)
1. Trên trang của máy chủ, mục **Primary VNIC** → bấm vào tên **Subnet**.
2. Tab **Security** → bấm **Default Security List for ...** → **Add Ingress Rules**.
3. Điền: **Source CIDR** `0.0.0.0/0` · **IP Protocol** `TCP` · **Destination Port Range** `80,443` → **Add Ingress Rules**.

*(Tường lửa bên trong máy chủ thì script tự mở, bạn không cần làm gì thêm.)*

---

**Đường dẫn công cụ hiện hành:** `vps/`; gói mặc định xuất bên ngoài dự án tại `E:\Kinh điển phật giáo - VPS\`. Thư mục xuất chỉ tạo khi đóng gói. Quy trình dưới đây dành cho cài đặt VPS. Cập nhật VPS hiện có dùng `vps/cap_nhat_vps.sh`.

## Phần C — Đưa thư viện lên (15–25 phút, gần như tự động)

1. Nhấp đúp **[vps/DONG_GOI_VPS.cmd](../../vps/DONG_GOI_VPS.cmd)**. Script tạo `thuvien.7z`, bản kiểm tra SHA-256, danh sách tệp và công cụ cài đặt trong `E:\Kinh điển phật giáo - VPS\`. Gói giữ đủ Word gốc từ `EbooksProject`, kinh văn, PDF, giao diện và chỉ mục; bỏ runtime Windows, cache, bộ kiểm thử và dữ liệu cá nhân. Dung lượng thực tế được báo khi hoàn tất. *Nếu đã thay đổi mã hoặc tài liệu, hãy đóng gói lại.*
2. Nhấp đúp **[vps/TAI_LEN_VPS.cmd](../../vps/TAI_LEN_VPS.cmd)**:
   - Nhập **Public IP** → Enter
   - **Kéo thả file `.key`** vào cửa sổ → Enter
3. Script tự tải lên, cài đặt và bật HTTPS. Khi xong sẽ hiện dòng:
   ```
   https://152-69-1-2.sslip.io/web-thuvien/index.html
   ```
   👉 **Gửi link này cho bạn bè.** Trên điện thoại có thể bấm "Thêm vào màn hình chính" để dùng như ứng dụng.

> [!NOTE]
> Lần đầu mở link có thể mất khoảng 30 giây, vì máy chủ đang xin chứng chỉ HTTPS. Những lần sau trang mở nhanh.

---

## Phần D — Giữ máy chủ không bị Oracle thu hồi

Oracle có thể **tạm dừng máy miễn phí nếu nó "nhàn rỗi" suốt 7 ngày** (CPU, mạng và RAM đều dưới 20%). Một thư viện ít người vào có thể bị tính là nhàn rỗi. Có hai cách xử lý:

| Cách | Chi phí | Ghi chú |
|---|---|---|
| **Nâng lên Pay As You Go** (Billing → Upgrade) | **Vẫn 0đ** nếu chỉ dùng tài nguyên Always Free | Oracle **không thu hồi** máy của tài khoản PAYG. Nên đặt **Budget** 1 USD để được báo qua email nếu lỡ dùng vượt mức miễn phí. |
| Giữ tài khoản Free | 0đ | Nếu máy bị dừng: vào Instances → **Start**. Dữ liệu vẫn còn. |

> [!WARNING]
> **Không** dùng các script "chạy giả tải" để lách quy định. Oracle có thể khóa luôn tài khoản.

---

## Vận hành sau này

| Việc | Cách làm |
|---|---|
| Cập nhật kinh/giao diện | Chạy lại `DONG_GOI_VPS.cmd` → `TAI_LEN_VPS.cmd` (dữ liệu đồng bộ của bạn bè trên máy chủ được giữ nguyên) |
| Xem lỗi | `ssh -i %USERPROFILE%\.ssh\thuvien_vps.key ubuntu@IP` → `journalctl -u thuvien -n 50` |
| Khởi động lại | (trên máy chủ) `sudo systemctl restart thuvien` |
| Dùng tên miền riêng | Trỏ bản ghi A về IP → `TAI_LEN_VPS.cmd` chạy với `-Domain thuvien.tenmien.com` |

> [!NOTE]
> - Máy tính ở nhà **không cần bật** nữa, và bạn cũng không cần `CHIA_SE_BAN_BE.cmd` nữa.
> - **Ai có link đều vào được.** Nếu muốn đặt mật khẩu chung cho bạn bè, hãy báo để thêm vào.
> - Giọng đọc dùng dịch vụ miễn phí của Microsoft. Nếu dịch vụ này lỗi thì chỉ phần nghe bị ảnh hưởng; đọc chữ, xem PDF và tìm kiếm vẫn chạy.

## Nếu Oracle không cho đăng ký

Script dùng được cho **mọi VPS Ubuntu**. Phương án dự phòng rẻ nhất là VPS khuyến mãi theo năm (khoảng 300.000–560.000đ/năm). Khi đó chạy `TAI_LEN_VPS.cmd -User root`, và đăng nhập bằng mật khẩu thay cho file khóa.

## Các tệp

- [DONG_GOI_VPS.cmd](../../vps/DONG_GOI_VPS.cmd) — đóng gói trên Windows
- [TAI_LEN_VPS.cmd](../../vps/TAI_LEN_VPS.cmd) — tải lên và cài đặt một lần bấm
- [cai_dat_vps.sh](../../vps/cai_dat_vps.sh) — chạy trên máy chủ (an toàn khi chạy lại)

### Rà soát dung lượng và cập nhật phiên bản mới

- Gói mặc định xuất ngoài dự án, tại `E:\Kinh điển phật giáo - VPS\`. Chỉ tải gói này và script cài đặt/checksum; không cần nén toàn bộ thư mục dự án.
- Gói tạo sau đợt rà soát ngày 05/10/2026 đã có đầy đủ dữ liệu. Chạy `TAI_LEN_VPS.cmd` để tải lên bằng IP và khóa SSH của máy chủ đang dùng.
- Khi cập nhật không truyền `-Domain`, script giữ tên miền từ dịch vụ hiện có. Có thể truyền rõ `-Domain thuvienchanhphap.duckdns.org`.
- Script kiểm tra SHA-256 trước khi tải và trên VPS, kiểm tra gói trước khi dừng dịch vụ. `personal.sqlite3` và cache trên VPS được giữ vì không có trong gói cập nhật.
- Báo cáo rà soát: [RA_SOAT_DUNG_LUONG.md](../reports/dung-luong/RA_SOAT_DUNG_LUONG.md). Chỉ mục chứa dữ liệu tìm kiếm thật; vùng trống rất ít, không nên xóa để giảm dung lượng.
- Chỉ kiểm tra lại mà không nén: `powershell -NoProfile -ExecutionPolicy Bypass -File vps\DONG_GOI_VPS.ps1 -AuditOnly` (chạy từ thư mục dự án).
- Để dùng nơi xuất khác: `DONG_GOI_VPS.cmd E:\thuvien-vps`, rồi `TAI_LEN_VPS.cmd -Out E:\thuvien-vps`.
- Chỉ giữ gói VPS mới nhất. Sau khi nén và kiểm tra thành công, công cụ thay gói hiện hành; không tạo bản sao `thuvien-truoc-*.7z`.
- Công cụ đóng gói cần Python 3.10+ và 7-Zip. Bản chụp SQLite tạm được tự dọn sau khi kiểm tra và xuất gói.
