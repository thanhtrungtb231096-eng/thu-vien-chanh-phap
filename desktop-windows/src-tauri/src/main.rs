// Ngăn mở cửa sổ dòng lệnh đen (console) khi chạy bản Release trên Windows
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    chanh_phap_lib::run()
}

