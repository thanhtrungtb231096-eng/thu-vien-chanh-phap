# Cấu trúc và quy tắc quản lý thư viện

## Cây thư mục

```text
Thư viện/
├── MO_THU_VIEN.cmd
├── README.md
├── app/
│   ├── server.py, launch.py, library_services.py, narration_engine.py
│   ├── audio_config.py, audio_packs.py, offline_tts.py
│   ├── project_paths.py, text_normalize.py, phuc_minh_pdf.py
│   └── web/                    # HTML, CSS, JS, font, hình giao diện
├── config/                     # allowed_hosts.txt, audio.txt, requirements-*.txt
├── data/
│   ├── sources/
│   │   ├── Dai_thua/
│   │   ├── Dai_Tang_Kinh_Han/
│   │   ├── EbooksProject/
│   │   └── chua phuc minh/
│   └── generated/              # Văn bản chuyển đổi, danh mục, OCR
├── tools/
│   ├── audio/                  # Dựng gói Chapter-Sprite, cài Sherpa-ONNX, đồng bộ VPS/R2
│   ├── build/                  # Dựng danh mục, chuyển Word/PDF, tạo chỉ mục
│   │   └── legacy/             # Builder cũ, lưu để tham khảo
│   ├── assets/                 # Công cụ tải font
│   └── maintenance/            # Bảo trì và sao lưu ra vị trí ngoài dự án
├── tests/
│   ├── package/                # Kiểm tra gói VPS đã nén
│   └── artifacts/              # Ảnh và kết quả kiểm thử
├── docs/
│   ├── guides/                 # Hướng dẫn hiện hành
│   ├── design/                 # Thiết kế và kế hoạch giao diện
│   ├── releases/               # Ghi chú các phiên bản
│   ├── history/                # Lịch sử phát triển
│   └── reports/                # Báo cáo dung lượng, chất lượng và triển khai
├── local/                      # Chỉ dùng để chạy thư viện trên Windows
│   ├── open_library.ps1
│   ├── CHIA_SE_BAN_BE.cmd
│   ├── THU_VIEN_CHANH_PHAP.url
│   ├── runtime/
│   │   ├── python/             # Phụ thuộc Python và OCR Node trên Windows
│   │   └── bin/                # cloudflared.exe
│   └── storage/
│       ├── state/              # search.sqlite3 và personal.sqlite3 hiện hành
│       ├── audio-packs/        # Gói âm thanh kinh dựng sẵn liền mạch (.mp3 + .cues.json)
│       ├── tts-models/         # Mô hình giọng AI ngoại tuyến Sherpa-ONNX (Piper VITS)
│       └── cache/              # Âm thanh O(1) LRU, mô hình/trang OCR và log
└── vps/                        # Công cụ triển khai, không phải bản sao ứng dụng
    ├── DONG_GOI_VPS.cmd, DONG_GOI_VPS.ps1, prepare_vps.py
    ├── TAI_LEN_VPS.cmd, TAI_LEN_VPS.ps1
    ├── cai_dat_vps.sh, cap_nhat_vps.sh, verify_vps.py
    └── CAP_NHAT_OPENGRAPH.ps1
```

Gói VPS mặc định xuất sang thư mục cùng cấp `E:\Kinh điển phật giáo - VPS\`; chỉ tạo thư mục khi đóng gói. Thư mục dự án giữ bộ nguồn hiện hành và dữ liệu chạy.

## Quy tắc

- Đặt sách gốc mới vào đúng bộ sưu tập trong `data/sources/`. Giữ tên và đường dẫn tương đối bên trong bộ sưu tập để mã sách ổn định.
- Chỉnh giao diện tại `app/web/`. Dữ liệu sinh tự động nằm trong `data/generated/`; dựng lại bằng công cụ tương ứng khi thay sách nguồn.
- Tập trung đường dẫn vật lý tại `app/project_paths.py`. Mã chương trình dùng `public_path()` để đọc liên kết danh mục; không ghép đường dẫn tương đối vào thư mục giao diện.
- Chỉ mục tìm kiếm và dữ liệu cá nhân có mục đích khác nhau. `search.sqlite3` có thể dựng lại; `personal.sqlite3` chứa dữ liệu ghép nối và ghi chú cần giữ/sao lưu.
- `app/`, `config/`, `data/` là một bộ nguồn dùng chung cho local và VPS. Không chép lại các thư mục này vào `local/` hoặc `vps/`.
- Tệp xuất đặt ngoài dự án, mặc định là `E:\Kinh điển phật giáo - VPS\`; kết quả kiểm thử trong `tests/artifacts/`, báo cáo trong `docs/reports/`. Tài liệu phiên bản cũ giữ nội dung lịch sử; dùng README và hướng dẫn này cho đường dẫn hiện hành.
- Bản sao lưu, checkpoint và bản sao mã trước thay đổi phải nằm ngoài thư mục dự án. Công cụ sao lưu từ chối đường dẫn xuất bên trong dự án. Không tạo thêm thư mục `storage/backups/` ở đây.
- Khi đóng gói lại thành công, thay gói VPS hiện hành; không tích lũy các gói `thuvien-truoc-*.7z`.

## Công cụ thường dùng

Chạy từ thư mục gốc:

```powershell
python -X utf8 app/server.py --port 8090
python -X utf8 tools/build/build_full_library_data.py
python -X utf8 tools/build/build_ebooks.py
python -X utf8 tools/build/build_phuc_minh.py
python -X utf8 tools/build/build_library_index.py
python -X utf8 tests/structure_check.py
vps\DONG_GOI_VPS.cmd -AuditOnly
vps\DONG_GOI_VPS.cmd
```

Chỉ chạy builder khi cần cập nhật nội dung. Việc sắp xếp thư mục tự giữ nguyên chỉ mục hiện tại.

Để chia sẻ thư viện Windows qua Cloudflare, chạy `local/CHIA_SE_BAN_BE.cmd`.

## Tương thích VPS

URL sách, API và giao diện được ánh xạ đến vị trí mới, không đổi mã tài liệu, vị trí đoạn đọc hoặc đường dẫn lưu ngoại tuyến.

`vps/prepare_vps.py` xuất cấu trúc VPS tương thích gồm `web-thuvien/`, bốn thư mục nguồn và `.library-state/search.sqlite3`. Runtime Windows, cache, dữ liệu cá nhân và công cụ kiểm thử được loại khỏi gói.

Sau khi sửa mã hoặc dữ liệu, chạy đóng gói lại để tạo gói có đường dẫn hiện hành. Gói xuất bên ngoài dự án là sản phẩm có thể tạo lại; chỉnh sửa nguồn tại dự án này.

`TAI_LEN_VPS.cmd` dùng quy trình **cài đặt**. VPS hiện có sử dụng `cap_nhat_vps.sh` để kiểm tra gói, lưu bản khôi phục và cập nhật mà vẫn giữ cấu hình cùng dữ liệu cá nhân.
