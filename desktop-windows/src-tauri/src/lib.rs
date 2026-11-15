pub mod tts;
pub mod vault;

use serde_json::{json, Value as JsonValue};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tts::{TtsSynthResult, VieNeuNanoDesktop};
use vault::{ChanhPhapVault, ManuscriptHit};

pub struct AppEngineState {
    pub vault: Arc<ChanhPhapVault>,
    pub tts: Arc<VieNeuNanoDesktop>,
}

#[tauri::command]
async fn vault_status(state: State<'_, AppEngineState>) -> Result<JsonValue, String> {
    let vault = Arc::clone(&state.vault);
    tauri::async_runtime::spawn_blocking(move || vault.vault_status())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn vault_get_manuscript(
    state: State<'_, AppEngineState>,
    url: String,
) -> Result<ManuscriptHit, String> {
    let vault = Arc::clone(&state.vault);
    tauri::async_runtime::spawn_blocking(move || vault.get_manuscript(&url))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn vault_cache_manuscript(
    state: State<'_, AppEngineState>,
    url: String,
    content: String,
) -> Result<JsonValue, String> {
    let vault = Arc::clone(&state.vault);
    tauri::async_runtime::spawn_blocking(move || {
        vault.cache_manuscript(&url, &content);
        json!({ "cached": true })
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn vault_search(
    state: State<'_, AppEngineState>,
    query: String,
    collection: String,
    mode: String,
    offset: usize,
) -> Result<JsonValue, String> {
    let vault = Arc::clone(&state.vault);
    tauri::async_runtime::spawn_blocking(move || {
        vault.search_vault(&query, &collection, &mode, offset)
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn vault_download_pack(
    app: AppHandle,
    state: State<'_, AppEngineState>,
    id: String,
    kind: String,
    remote_base_url: String,
) -> Result<JsonValue, String> {
    let vault = Arc::clone(&state.vault);
    let pack_id = id.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let mut last_pct: i64 = -1;
        vault.download_pack(&id, &kind, &remote_base_url, |pct| {
            let rounded = pct.round() as i64;
            if rounded != last_pct {
                last_pct = rounded;
                let _ = app.emit(
                    "downloadProgress",
                    json!({
                        "id": pack_id,
                        "percent": pct,
                    }),
                );
            }
        })?;
        Ok(json!({ "downloaded": true, "id": id }))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn vault_remove_pack(
    state: State<'_, AppEngineState>,
    id: String,
    kind: String,
) -> Result<JsonValue, String> {
    let vault = Arc::clone(&state.vault);
    let tts = Arc::clone(&state.tts);
    tauri::async_runtime::spawn_blocking(move || {
        if kind == "tts" {
            tts.unload();
        }
        vault.remove_pack(&id, &kind);
        json!({ "removed": true, "id": id })
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn tts_synthesize(
    state: State<'_, AppEngineState>,
    text: String,
    voice: String,
    speed: f64,
) -> Result<TtsSynthResult, String> {
    let vault = Arc::clone(&state.vault);
    let tts = Arc::clone(&state.tts);
    tauri::async_runtime::spawn_blocking(move || tts.synthesize_base64(&vault, &text, &voice, speed))
        .await
        .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            let vault = Arc::new(ChanhPhapVault::new(&handle));
            let tts = Arc::new(VieNeuNanoDesktop::new());
            app.manage(AppEngineState { vault, tts });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            vault_status,
            vault_get_manuscript,
            vault_cache_manuscript,
            vault_search,
            vault_download_pack,
            vault_remove_pack,
            tts_synthesize,
        ])
        .run(tauri::generate_context!())
        .expect("Lỗi khởi chạy ứng dụng Đại Thư Viện Chánh Pháp trên Windows");
}

