use flate2::read::{GzDecoder, ZlibDecoder};
use rusqlite::{params_from_iter, types::Value as SqlValue, Connection, OpenFlags};
use serde::Serialize;
use serde_json::{json, Value as JsonValue};
use sha2::{Digest, Sha256};
use std::collections::HashSet;
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::Manager;
use unicode_normalization::UnicodeNormalization;

pub struct ChanhPhapVault {
    pub root_dir: PathBuf,
    pub packs_dir: PathBuf,
    pub tts_dir: PathBuf,
    pub cache_dir: PathBuf,
    user_cache_db: PathBuf,
    db_lock: Mutex<()>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultStatus {
    pub packs: Vec<String>,
    pub tts_installed: bool,
    pub free_disk_mi_b: Option<u64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ManuscriptHit {
    pub found: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pack_id: Option<String>,
}

impl ChanhPhapVault {
    pub fn new(app: &tauri::AppHandle) -> Self {
        let base_local = std::env::var_os("LOCALAPPDATA")
            .map(PathBuf::from)
            .or_else(|| app.path().app_local_data_dir().ok())
            .unwrap_or_else(|| std::env::temp_dir());

        let root_dir = base_local.join("ChanhPhapVault");
        let packs_dir = root_dir.join("text-packs");
        let tts_dir = root_dir.join("tts").join("vieneu-nano-mobile-v1");
        let cache_dir = root_dir.join("tts-cache");
        let user_cache_db = root_dir.join("online-manuscripts.sqlite3");

        for d in [&root_dir, &packs_dir, &tts_dir, &cache_dir] {
            let _ = fs::create_dir_all(d);
        }

        let vault = Self {
            root_dir,
            packs_dir,
            tts_dir,
            cache_dir,
            user_cache_db,
            db_lock: Mutex::new(()),
        };
        vault.init_user_cache_db();
        vault.ensure_bundled_core_extracted(app);
        vault
    }

    fn pack_filename(id: &str) -> Option<&'static str> {
        match id {
            "core-bundled" => Some("core-bundled.pack.db"),
            "daithua" => Some("daithua.pack.db"),
            "ebooks" => Some("namtong-ebooks.pack.db"),
            "daitang" => Some("daitanghan.pack.db"),
            _ => None,
        }
    }

    fn init_user_cache_db(&self) {
        let _guard = self.db_lock.lock().unwrap_or_else(|e| e.into_inner());
        if let Ok(conn) = Connection::open(&self.user_cache_db) {
            let _ = conn.execute(
                "CREATE TABLE IF NOT EXISTS cached_docs (url TEXT PRIMARY KEY, content TEXT, updated_at REAL);",
                [],
            );
        }
    }

    pub fn ensure_bundled_core_extracted(&self, app: &tauri::AppHandle) {
        let dest = self.packs_dir.join("core-bundled.pack.db");
        if dest.is_file() && dest.metadata().map(|m| m.len() > 1024).unwrap_or(false) {
            return;
        }

        let tmp = self.packs_dir.join("core-bundled.pack.db.tmp");

        // 1. Check external resource / portable packs directory next to executable
        let mut candidate_paths: Vec<PathBuf> = Vec::new();
        if let Ok(res_dir) = app.path().resource_dir() {
            candidate_paths.push(res_dir.join("packs").join("core-bundled.pack.db"));
        }
        if let Ok(exe) = std::env::current_exe() {
            if let Some(parent) = exe.parent() {
                candidate_paths.push(parent.join("packs").join("core-bundled.pack.db"));
            }
        }
        for src in candidate_paths {
            if src.is_file() && fs::copy(&src, &tmp).is_ok() {
                let _ = fs::remove_file(&dest);
                let _ = fs::rename(&tmp, &dest);
                return;
            }
        }

        // 2. Extract from Tauri embedded frontendDist asset resolver
        for asset_key in ["packs/core-bundled.pack.db", "/packs/core-bundled.pack.db"] {
            if let Some(asset) = app.asset_resolver().get(asset_key.to_string()) {
                if asset.bytes.len() > 1024 && fs::write(&tmp, &asset.bytes).is_ok() {
                    let _ = fs::remove_file(&dest);
                    let _ = fs::rename(&tmp, &dest);
                    return;
                }
            }
        }
    }

    pub fn active_pack_files(&self) -> Vec<(String, PathBuf)> {
        let mut out = Vec::new();
        for id in ["core-bundled", "daithua", "ebooks", "daitang"] {
            if let Some(fname) = Self::pack_filename(id) {
                let path = self.packs_dir.join(fname);
                if path.is_file() && path.metadata().map(|m| m.len() > 1024).unwrap_or(false) {
                    out.push((id.to_string(), path));
                }
            }
        }
        out
    }

    pub fn is_tts_installed(&self) -> bool {
        let required = [
            "duration_predictor.onnx",
            "text_encoder.onnx",
            "vector_estimator.onnx",
            "codec_decoder.onnx",
            "vi_lexicon.json.gz",
            "voices_constants.json.gz",
        ];
        required.iter().all(|name| self.tts_dir.join(name).is_file())
    }

    pub fn vault_status(&self) -> JsonValue {
        let packs: Vec<String> = self.active_pack_files().into_iter().map(|(id, _)| id).collect();
        let free_mib = query_free_disk_mib(&self.root_dir);
        json!({
            "packs": packs,
            "ttsInstalled": self.is_tts_installed(),
            "freeDiskMiB": free_mib,
        })
    }

    pub fn get_manuscript(&self, url: &str) -> ManuscriptHit {
        let ro_flags = OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_NO_MUTEX;
        for (pack_id, db_file) in self.active_pack_files() {
            if let Ok(conn) = Connection::open_with_flags(&db_file, ro_flags) {
                let row: Result<(Vec<u8>, usize), _> = conn.query_row(
                    "SELECT raw_zlib, raw_bytes FROM manuscripts WHERE url = ?1 LIMIT 1",
                    [url],
                    |r| Ok((r.get(0)?, r.get::<_, i64>(1)?.max(0) as usize)),
                );
                if let Ok((blob, expected_len)) = row {
                    if let Some(text) = inflate_zlib_utf8(&blob, expected_len) {
                        return ManuscriptHit {
                            found: true,
                            content: Some(text),
                            pack_id: Some(pack_id),
                        };
                    }
                }
            }
        }

        let _guard = self.db_lock.lock().unwrap_or_else(|e| e.into_inner());
        if self.user_cache_db.is_file() {
            if let Ok(conn) = Connection::open_with_flags(&self.user_cache_db, ro_flags) {
                if let Ok(content) = conn.query_row(
                    "SELECT content FROM cached_docs WHERE url = ?1 LIMIT 1",
                    [url],
                    |r| r.get::<_, String>(0),
                ) {
                    return ManuscriptHit {
                        found: true,
                        content: Some(content),
                        pack_id: Some("online-cache".to_string()),
                    };
                }
            }
        }

        ManuscriptHit {
            found: false,
            content: None,
            pack_id: None,
        }
    }

    pub fn cache_manuscript(&self, url: &str, content: &str) {
        let _guard = self.db_lock.lock().unwrap_or_else(|e| e.into_inner());
        if let Ok(conn) = Connection::open(&self.user_cache_db) {
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs_f64())
                .unwrap_or(0.0);
            let _ = conn.execute(
                "INSERT OR REPLACE INTO cached_docs(url, content, updated_at) VALUES(?1, ?2, ?3)",
                rusqlite::params![url, content, now],
            );
        }
    }

    pub fn search_vault(&self, query: &str, collection: &str, mode: &str, offset: usize) -> JsonValue {
        let norm = normalize_search_vi(&query.replace('"', ""));
        let tokens: Vec<&str> = norm
            .split_whitespace()
            .filter(|t| !t.is_empty())
            .take(10)
            .collect();
        if tokens.is_empty() {
            return json!({ "results": [], "total": 0, "offset": offset });
        }

        let fts_expr = tokens
            .iter()
            .map(|t| format!("\"{}\"*", t))
            .collect::<Vec<_>>()
            .join(" AND ");

        let ro_flags = OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_NO_MUTEX;
        let mut all_results: Vec<JsonValue> = Vec::new();
        let mut seen_keys: HashSet<String> = HashSet::new();

        for (_, db_file) in self.active_pack_files() {
            let Ok(conn) = Connection::open_with_flags(&db_file, ro_flags) else {
                continue;
            };
            let mut sql = String::from(
                "SELECT m.meta, s.block, s.chapter, s.page, s.preview \
                 FROM fulltext f \
                 JOIN sections s ON s.sid = f.rowid \
                 JOIN manuscripts m ON m.doc = s.doc \
                 WHERE fulltext MATCH ?",
            );
            let mut params: Vec<SqlValue> = vec![SqlValue::from(fts_expr.clone())];
            if !mode.is_empty() {
                sql.push_str(" AND m.mode = ?");
                params.push(SqlValue::from(mode.to_string()));
            }
            if !collection.is_empty() {
                sql.push_str(" AND m.book_key LIKE ?");
                params.push(SqlValue::from(format!("{}:%", collection)));
            }
            sql.push_str(" LIMIT 40");

            let Ok(mut stmt) = conn.prepare(&sql) else {
                continue;
            };
            let Ok(rows) = stmt.query_map(params_from_iter(params), |r| {
                Ok((
                    r.get::<_, String>(0)?,
                    r.get::<_, Option<String>>(1)?.unwrap_or_default(),
                    r.get::<_, Option<String>>(2)?.unwrap_or_default(),
                    r.get::<_, Option<i64>>(3)?,
                    r.get::<_, Option<String>>(4)?.unwrap_or_default(),
                ))
            }) else {
                continue;
            };

            for item in rows.flatten() {
                let (meta_str, block, chapter, page_opt, preview) = item;
                let Ok(mut meta_obj) = serde_json::from_str::<JsonValue>(&meta_str) else {
                    continue;
                };
                let key = meta_obj
                    .get("key")
                    .and_then(|v| v.as_str())
                    .unwrap_or_default()
                    .to_string();
                let dedup = format!("{}|{}", key, block);
                if !seen_keys.insert(dedup) {
                    continue;
                }
                if let Some(map) = meta_obj.as_object_mut() {
                    map.insert("block".to_string(), json!(block));
                    map.insert("chapter".to_string(), json!(chapter));
                    if let Some(p) = page_opt {
                        map.insert("page".to_string(), json!(p));
                    }
                    map.insert("excerpt".to_string(), json!(preview));
                }
                all_results.push(meta_obj);
                if all_results.len() >= 60 {
                    break;
                }
            }
            if all_results.len() >= 60 {
                break;
            }
        }

        let total = all_results.len();
        let sliced: Vec<JsonValue> = all_results.into_iter().skip(offset).take(30).collect();
        json!({
            "results": sliced,
            "total": total,
            "offset": offset,
        })
    }

    pub fn remove_pack(&self, id: &str, kind: &str) {
        if kind == "tts" {
            let _ = fs::remove_dir_all(&self.tts_dir);
            let _ = fs::create_dir_all(&self.tts_dir);
            return;
        }
        if id == "core-bundled" {
            return;
        }
        if let Some(fname) = Self::pack_filename(id) {
            let _ = fs::remove_file(self.packs_dir.join(fname));
        }
    }

    pub fn download_pack<F>(&self, id: &str, kind: &str, remote_base_url: &str, mut on_progress: F) -> Result<(), String>
    where
        F: FnMut(f64),
    {
        let base = remote_base_url.trim_end_matches('/');
        let client = reqwest::blocking::Client::builder()
            .connect_timeout(Duration::from_secs(20))
            .timeout(Duration::from_secs(600))
            .build()
            .map_err(|e| format!("Không khởi tạo được kết nối tải gói: {}", e))?;

        if kind == "tts" {
            let manifest_url = format!("{}/mobile-packs/tts/vieneu-nano-mobile-v1/manifest.json", base);
            let manifest_text = http_get_text(&client, &manifest_url)?;
            let manifest: JsonValue = serde_json::from_str(&manifest_text)
                .map_err(|e| format!("Manifest gói giọng đọc không hợp lệ: {}", e))?;
            let files = manifest
                .get("files")
                .and_then(|v| v.as_array())
                .ok_or_else(|| "Thiếu danh sách tệp trong manifest TTS.".to_string())?;
            let total_bytes = manifest
                .get("totalBytes")
                .and_then(|v| v.as_f64())
                .unwrap_or(1.0)
                .max(1.0);
            let mut done_bytes = 0.0;

            for f in files {
                let name = f
                    .get("name")
                    .and_then(|v| v.as_str())
                    .ok_or_else(|| "Tên tệp TTS không hợp lệ.".to_string())?;
                let expected_sha = f.get("sha256").and_then(|v| v.as_str()).unwrap_or("");
                let f_bytes = f.get("mobileBytes").and_then(|v| v.as_f64()).unwrap_or(0.0);
                let dest = self.tts_dir.join(name);

                if dest.is_file() && !expected_sha.is_empty() && sha256_hex(&dest).as_deref() == Some(expected_sha) {
                    done_bytes += f_bytes;
                    on_progress((done_bytes / total_bytes) * 100.0);
                    continue;
                }

                let file_url = format!("{}/mobile-packs/tts/vieneu-nano-mobile-v1/{}", base, name);
                download_verified_file(&client, &file_url, &dest, expected_sha, |frac| {
                    on_progress(((done_bytes + f_bytes * frac) / total_bytes) * 100.0);
                })?;
                done_bytes += f_bytes;
                on_progress((done_bytes / total_bytes) * 100.0);
            }

            let _ = fs::write(self.tts_dir.join("manifest.json"), manifest_text.as_bytes());
            on_progress(100.0);
            return Ok(());
        }

        let fname = Self::pack_filename(id).ok_or_else(|| "Mã gói kinh không hợp lệ.".to_string())?;
        let manifest_url = format!("{}/mobile-packs/text-packs/manifest.json", base);
        let manifest_text = http_get_text(&client, &manifest_url)?;
        let manifest: JsonValue = serde_json::from_str(&manifest_text)
            .map_err(|e| format!("Manifest gói kinh không hợp lệ: {}", e))?;

        let mut expected_sha = String::new();
        if let Some(packs) = manifest.get("packs").and_then(|v| v.as_array()) {
            for p in packs {
                if p.get("id").and_then(|v| v.as_str()) == Some(id) {
                    expected_sha = p.get("sha256").and_then(|v| v.as_str()).unwrap_or("").to_string();
                    break;
                }
            }
        }

        let dest = self.packs_dir.join(fname);
        let file_url = format!("{}/mobile-packs/text-packs/{}", base, fname);
        download_verified_file(&client, &file_url, &dest, &expected_sha, |frac| {
            on_progress(frac * 100.0);
        })?;
        on_progress(100.0);
        Ok(())
    }
}

pub fn gunzip_utf8(path: &Path) -> Result<String, String> {
    let file = File::open(path).map_err(|e| format!("Không mở được {}: {}", path.display(), e))?;
    let mut gz = GzDecoder::new(file);
    let mut out = String::new();
    gz.read_to_string(&mut out)
        .map_err(|e| format!("Lỗi giải nén {}: {}", path.display(), e))?;
    Ok(out)
}

fn inflate_zlib_utf8(compressed: &[u8], expected_size: usize) -> Option<String> {
    let mut decoder = ZlibDecoder::new(compressed);
    let mut out = Vec::with_capacity(expected_size.max(4096));
    decoder.read_to_end(&mut out).ok()?;
    String::from_utf8(out).ok()
}

pub fn normalize_search_vi(raw: &str) -> String {
    let lowered = raw.replace('đ', "d").replace('Đ', "d").to_lowercase();
    let mut out = String::with_capacity(lowered.len());
    let mut prev_space = true;
    for ch in lowered.nfd() {
        if ('\u{0300}'..='\u{036F}').contains(&ch) {
            continue;
        }
        if ch.is_alphanumeric() {
            out.push(ch);
            prev_space = false;
        } else if !prev_space {
            out.push(' ');
            prev_space = true;
        }
    }
    out.trim().to_string()
}

fn http_get_text(client: &reqwest::blocking::Client, url: &str) -> Result<String, String> {
    let resp = client
        .get(url)
        .send()
        .map_err(|e| format!("Không kết nối được máy chủ dữ liệu: {}", e))?;
    if !resp.status().is_success() {
        return Err(format!("Máy chủ trả về HTTP {} khi tải manifest.", resp.status().as_u16()));
    }
    resp.text().map_err(|e| format!("Lỗi đọc dữ liệu manifest: {}", e))
}

fn sha256_hex(path: &Path) -> Option<String> {
    let mut f = File::open(path).ok()?;
    let mut hasher = Sha256::new();
    let mut buf = [0u8; 65536];
    loop {
        let n = f.read(&mut buf).ok()?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Some(hex::encode(hasher.finalize()))
}

fn download_verified_file<F>(
    client: &reqwest::blocking::Client,
    url: &str,
    dest: &Path,
    expected_sha: &str,
    mut on_fraction: F,
) -> Result<(), String>
where
    F: FnMut(f64),
{
    if let Some(parent) = dest.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let part = dest.with_file_name(format!(
        "{}.part",
        dest.file_name().and_then(|s| s.to_str()).unwrap_or("download")
    ));
    let existing_len = part.metadata().map(|m| m.len()).unwrap_or(0);

    let mut req = client.get(url);
    if existing_len > 0 {
        req = req.header("Range", format!("bytes={}-", existing_len));
    }

    let mut resp = req.send().map_err(|e| format!("Tải tệp thất bại: {}", e))?;
    let code = resp.status().as_u16();
    let append = code == 206 && existing_len > 0;
    if code != 200 && code != 206 {
        return Err(format!("Máy chủ trả về HTTP {} khi tải gói.", code));
    }

    let content_len = resp.content_length().unwrap_or(0);
    let total_expected = if append && content_len > 0 {
        existing_len + content_len
    } else {
        content_len
    };
    let mut written = if append { existing_len } else { 0 };

    {
        let mut out = if append {
            OpenOptions::new()
                .create(true)
                .append(true)
                .open(&part)
                .map_err(|e| format!("Không mở được tệp tạm: {}", e))?
        } else {
            File::create(&part).map_err(|e| format!("Không tạo được tệp tạm: {}", e))?
        };

        let mut buf = [0u8; 65536];
        loop {
            let n = resp.read(&mut buf).map_err(|e| format!("Gián đoạn đường truyền: {}", e))?;
            if n == 0 {
                break;
            }
            out.write_all(&buf[..n]).map_err(|e| format!("Lỗi ghi ổ cứng: {}", e))?;
            written += n as u64;
            if total_expected > 0 {
                on_fraction((written as f64 / total_expected as f64).clamp(0.0, 1.0));
            }
        }
        let _ = out.flush();
    }

    if !expected_sha.is_empty() {
        let actual = sha256_hex(&part).unwrap_or_default();
        if !actual.eq_ignore_ascii_case(expected_sha) {
            let _ = fs::remove_file(&part);
            return Err("Kiểm tra toàn vẹn SHA-256 không khớp. Vui lòng bấm tải lại.".to_string());
        }
    }

    let _ = fs::remove_file(dest);
    fs::rename(&part, dest).map_err(|e| format!("Không hoàn tất lưu gói dữ liệu: {}", e))?;
    Ok(())
}

#[cfg(target_os = "windows")]
fn query_free_disk_mib(path: &Path) -> Option<u64> {
    use std::os::windows::ffi::OsStrExt;
    #[link(name = "kernel32")]
    extern "system" {
        fn GetDiskFreeSpaceExW(
            lpDirectoryName: *const u16,
            lpFreeBytesAvailableToCaller: *mut u64,
            lpTotalNumberOfBytes: *mut u64,
            lpTotalNumberOfFreeBytes: *mut u64,
        ) -> i32;
    }
    let wide: Vec<u16> = path.as_os_str().encode_wide().chain(std::iter::once(0)).collect();
    let mut free_avail: u64 = 0;
    let mut total_bytes: u64 = 0;
    let mut total_free: u64 = 0;
    let ok = unsafe {
        GetDiskFreeSpaceExW(
            wide.as_ptr(),
            &mut free_avail,
            &mut total_bytes,
            &mut total_free,
        )
    };
    if ok != 0 {
        Some(free_avail / (1024 * 1024))
    } else {
        None
    }
}

#[cfg(not(target_os = "windows"))]
fn query_free_disk_mib(_path: &Path) -> Option<u64> {
    None
}

