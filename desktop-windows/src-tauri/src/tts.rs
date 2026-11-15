use crate::vault::{gunzip_utf8, ChanhPhapVault};
use base64::{engine::general_purpose::STANDARD as BASE64_STD, Engine};
use ort::session::{builder::GraphOptimizationLevel, Session};
use ort::value::Tensor;
use regex::Regex;
use serde::Serialize;
use serde_json::Value as JsonValue;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::f64::consts::PI;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use unicode_normalization::UnicodeNormalization;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TtsSynthResult {
    pub wav_base64: String,
    pub pack_active: bool,
}

#[derive(Clone)]
struct VoicePreset {
    spk: Vec<f32>,
    style: Vec<f32>,
    style_shape: [usize; 3],
}

struct OrtSessions {
    s_text: Session,
    s_dur: Session,
    s_ve: Session,
    s_dec: Session,
}

struct InnerState {
    loaded: bool,
    last_used: Instant,
    words: HashMap<String, String>,
    char_fallback: HashMap<String, String>,
    vocab: HashMap<String, i64>,
    bos_id: i64,
    eos_id: i64,
    pad_id: i64,
    flow_fps: f64,
    sample_rate: u32,
    null_spk: Vec<f32>,
    null_style: Vec<f32>,
    null_style_shape: [usize; 3],
    null_ctx_flat: Vec<f32>,
    null_ctx_shape: Vec<usize>,
    voices: HashMap<String, VoicePreset>,
    sessions: Option<OrtSessions>,
}

pub struct VieNeuNanoDesktop {
    inner: Arc<Mutex<InnerState>>,
}

impl VieNeuNanoDesktop {
    pub fn new() -> Self {
        let inner = Arc::new(Mutex::new(InnerState {
            loaded: false,
            last_used: Instant::now(),
            words: HashMap::new(),
            char_fallback: HashMap::new(),
            vocab: HashMap::new(),
            bos_id: 0,
            eos_id: 1,
            pad_id: 2,
            flow_fps: 15.625,
            sample_rate: 24000,
            null_spk: Vec::new(),
            null_style: Vec::new(),
            null_style_shape: [1, 50, 256],
            null_ctx_flat: Vec::new(),
            null_ctx_shape: vec![1, 2, 256],
            voices: HashMap::new(),
            sessions: None,
        }));

        let janitor_ref = Arc::clone(&inner);
        thread::spawn(move || loop {
            thread::sleep(Duration::from_secs(60));
            if let Ok(mut guard) = janitor_ref.lock() {
                if guard.loaded && guard.last_used.elapsed() >= Duration::from_secs(180) {
                    guard.unload();
                }
            }
        });

        Self { inner }
    }

    pub fn unload(&self) {
        if let Ok(mut guard) = self.inner.lock() {
            guard.unload();
        }
    }

    pub fn synthesize_base64(
        &self,
        vault: &ChanhPhapVault,
        text: &str,
        voice_id: &str,
        speed: f64,
    ) -> Result<TtsSynthResult, String> {
        let clean_voice = if voice_id.contains("thuc-doan") {
            "vieneu-thuc-doan"
        } else {
            "vieneu-thien-tam-duc"
        };
        let clamped_speed = speed.clamp(0.5, 1.8);
        let cache_key = format!("{}|{:.2}|{}", clean_voice, clamped_speed, text);
        let digest = hex::encode(Sha256::digest(cache_key.as_bytes()));
        let out_file: PathBuf = vault.cache_dir.join(format!("{}.wav", digest));

        if out_file.is_file() {
            if let Ok(bytes) = fs::read(&out_file) {
                if bytes.len() > 64 {
                    return Ok(TtsSynthResult {
                        wav_base64: BASE64_STD.encode(&bytes),
                        pack_active: true,
                    });
                }
            }
        }

        if !vault.is_tts_installed() {
            return Err("Chưa cài đặt gói Giọng Đọc AI Nội Bộ.".to_string());
        }

        let clauses = split_clauses(text, 170);
        if clauses.is_empty() {
            return Err("Đoạn văn bản trống.".to_string());
        }

        let (combined_pcm, sample_rate) = {
            let mut guard = self.inner.lock().map_err(|_| "Khóa tiến trình TTS bị lỗi.")?;
            guard.ensure_loaded(&vault.tts_dir)?;
            guard.last_used = Instant::now();

            let sr = guard.sample_rate;
            let gap_samples = (0.14 * sr as f64).round() as usize;
            let mut all_samples: Vec<f32> = Vec::new();

            for (idx, clause) in clauses.iter().enumerate() {
                let pcm = guard.infer_single_clause(clause, clean_voice, clamped_speed)?;
                if !pcm.is_empty() {
                    all_samples.extend_from_slice(&pcm);
                    if idx + 1 < clauses.len() {
                        all_samples.resize(all_samples.len() + gap_samples, 0.0);
                    }
                }
            }
            guard.last_used = Instant::now();
            (all_samples, sr)
        };

        if combined_pcm.is_empty() {
            return Err("Không tạo được sóng âm cho đoạn kinh này.".to_string());
        }

        let wav_bytes = encode_wav16_mono(&combined_pcm, sample_rate);
        let tmp_file = vault.cache_dir.join(format!("{}.wav.tmp", digest));
        if fs::write(&tmp_file, &wav_bytes).is_ok() {
            let _ = fs::remove_file(&out_file);
            let _ = fs::rename(&tmp_file, &out_file);
        }

        Ok(TtsSynthResult {
            wav_base64: BASE64_STD.encode(&wav_bytes),
            pack_active: true,
        })
    }
}

impl InnerState {
    fn unload(&mut self) {
        self.loaded = false;
        self.words.clear();
        self.char_fallback.clear();
        self.vocab.clear();
        self.voices.clear();
        self.sessions = None;
    }

    fn ensure_loaded(&mut self, tts_dir: &PathBuf) -> Result<(), String> {
        if self.loaded && self.sessions.is_some() {
            return Ok(());
        }

        let lex_raw = gunzip_utf8(&tts_dir.join("vi_lexicon.json.gz"))?;
        let vc_raw = gunzip_utf8(&tts_dir.join("voices_constants.json.gz"))?;
        let lex_json: JsonValue = serde_json::from_str(&lex_raw)
            .map_err(|e| format!("Lỗi đọc từ điển âm vị: {}", e))?;
        let vc_json: JsonValue = serde_json::from_str(&vc_raw)
            .map_err(|e| format!("Lỗi đọc cấu hình giọng đọc: {}", e))?;

        self.words.clear();
        if let Some(obj) = lex_json.get("words").and_then(|v| v.as_object()) {
            for (k, v) in obj {
                if let Some(s) = v.as_str() {
                    self.words.insert(k.clone(), s.to_string());
                }
            }
        }

        self.char_fallback.clear();
        if let Some(obj) = lex_json.get("charFallback").and_then(|v| v.as_object()) {
            for (k, v) in obj {
                if let Some(s) = v.as_str() {
                    self.char_fallback.insert(k.clone(), s.to_string());
                }
            }
        }

        self.vocab.clear();
        if let Some(obj) = lex_json.get("vocab").and_then(|v| v.as_object()) {
            for (k, v) in obj {
                if let Some(id) = v.as_i64() {
                    self.vocab.insert(k.clone(), id);
                }
            }
        }

        self.bos_id = vc_json.get("bosId").and_then(|v| v.as_i64()).unwrap_or(0);
        self.eos_id = vc_json.get("eosId").and_then(|v| v.as_i64()).unwrap_or(1);
        self.pad_id = vc_json.get("padId").and_then(|v| v.as_i64()).unwrap_or(2);
        self.flow_fps = vc_json.get("flowFps").and_then(|v| v.as_f64()).unwrap_or(15.625);
        self.sample_rate = vc_json
            .get("sampleRate")
            .and_then(|v| v.as_u64())
            .unwrap_or(24000) as u32;

        self.null_spk = json_f32_vec(vc_json.get("nullSpk"));
        self.null_style = json_f32_vec(vc_json.get("nullStyle"));
        if let Some(arr) = vc_json.get("nullStyleShape").and_then(|v| v.as_array()) {
            if arr.len() >= 2 {
                self.null_style_shape = [
                    1,
                    arr[0].as_u64().unwrap_or(50) as usize,
                    arr[1].as_u64().unwrap_or(256) as usize,
                ];
            }
        }

        self.voices.clear();
        if let Some(v_map) = vc_json.get("voices").and_then(|v| v.as_object()) {
            for (vid, entry) in v_map {
                let spk = json_f32_vec(entry.get("speakerEmb"));
                let sty = json_f32_vec(entry.get("style"));
                let mut s_shape = [1usize, 50, 256];
                if let Some(dims) = entry.get("styleShape").and_then(|v| v.as_array()) {
                    if dims.len() >= 2 {
                        s_shape = [
                            1,
                            dims[0].as_u64().unwrap_or(50) as usize,
                            dims[1].as_u64().unwrap_or(256) as usize,
                        ];
                    }
                }
                self.voices.insert(
                    vid.clone(),
                    VoicePreset {
                        spk,
                        style: sty,
                        style_shape: s_shape,
                    },
                );
            }
        }

        let load_model = |name: &str| -> Result<Session, String> {
            Session::builder()
                .map_err(|e| format!("Lỗi khởi tạo ONNX builder ({}): {}", name, e))?
                .with_optimization_level(GraphOptimizationLevel::Level3)
                .map_err(|e| format!("Lỗi cấu hình tối ưu ONNX ({}): {}", name, e))?
                .with_intra_threads(2)
                .map_err(|e| format!("Lỗi cấu hình luồng CPU ONNX ({}): {}", name, e))?
                .commit_from_file(tts_dir.join(name))
                .map_err(|e| format!("Không nạp được mô hình {}: {}", name, e))
        };

        let s_text = load_model("text_encoder.onnx")?;
        let s_dur = load_model("duration_predictor.onnx")?;
        let s_ve = load_model("vector_estimator.onnx")?;
        let s_dec = load_model("codec_decoder.onnx")?;

        // Precompute unconditional null_ctx once
        let null_ids_t = Tensor::from_array(([1usize, 2], vec![self.bos_id, self.eos_id]))
            .map_err(|e| format!("Lỗi tạo null_ids tensor: {}", e))?;
        let null_sty_t = Tensor::from_array((self.null_style_shape, self.null_style.clone()))
            .map_err(|e| format!("Lỗi tạo null_style tensor: {}", e))?;

        {
            let inputs = ort::inputs![
                "ids" => null_ids_t.view(),
                "style" => null_sty_t.view(),
            ]
            .map_err(|e| format!("Lỗi đóng gói input null_ctx: {}", e))?;
            let outputs = s_text
                .run(inputs)
                .map_err(|e| format!("Lỗi suy luận null_ctx: {}", e))?;
            let (shape, data) = outputs[0]
                .try_extract_raw_tensor::<f32>()
                .map_err(|e| format!("Lỗi trích xuất null_ctx: {}", e))?;
            self.null_ctx_shape = shape.iter().map(|&d| d.max(1) as usize).collect();
            self.null_ctx_flat = data.to_vec();
        }

        self.sessions = Some(OrtSessions {
            s_text,
            s_dur,
            s_ve,
            s_dec,
        });
        self.loaded = true;
        Ok(())
    }

    fn infer_single_clause(&self, clause: &str, voice_id: &str, speed: f64) -> Result<Vec<f32>, String> {
        let Some(sess) = self.sessions.as_ref() else {
            return Ok(Vec::new());
        };
        let Some(preset) = self.voices.get(voice_id) else {
            return Ok(Vec::new());
        };

        let phones = self.phonemize(clause);
        if phones.is_empty() {
            return Ok(Vec::new());
        }

        let mut seq: Vec<i64> = Vec::with_capacity(phones.chars().count() + 2);
        seq.push(self.bos_id);
        for ch in phones.chars() {
            let key = ch.to_string();
            if let Some(&id) = self.vocab.get(&key) {
                seq.push(id);
            }
        }
        seq.push(self.eos_id);
        let seq_len = seq.len();

        let mask_vec: Vec<bool> = seq.iter().map(|&v| v != self.pad_id).collect();
        let null_mask_vec: Vec<bool> = vec![self.bos_id != self.pad_id, self.eos_id != self.pad_id];

        let ids_t = Tensor::from_array(([1usize, seq_len], seq))
            .map_err(|e| format!("Lỗi ids tensor: {}", e))?;
        let mask_t = Tensor::from_array(([1usize, seq_len], mask_vec))
            .map_err(|e| format!("Lỗi mask tensor: {}", e))?;
        let spk_t = Tensor::from_array(([1usize, preset.spk.len()], preset.spk.clone()))
            .map_err(|e| format!("Lỗi spk tensor: {}", e))?;
        let style_t = Tensor::from_array((preset.style_shape, preset.style.clone()))
            .map_err(|e| format!("Lỗi style tensor: {}", e))?;

        let null_ctx_t = Tensor::from_array((self.null_ctx_shape.clone(), self.null_ctx_flat.clone()))
            .map_err(|e| format!("Lỗi null_ctx tensor: {}", e))?;
        let null_mask_t = Tensor::from_array(([1usize, 2], null_mask_vec))
            .map_err(|e| format!("Lỗi null_mask tensor: {}", e))?;
        let null_spk_t = Tensor::from_array(([1usize, self.null_spk.len()], self.null_spk.clone()))
            .map_err(|e| format!("Lỗi null_spk tensor: {}", e))?;
        let null_style_t = Tensor::from_array((self.null_style_shape, self.null_style.clone()))
            .map_err(|e| format!("Lỗi null_style tensor: {}", e))?;

        // Stage 1: Text Encoder
        let (ctx_shape, ctx_flat) = {
            let inputs = ort::inputs![
                "ids" => ids_t.view(),
                "style" => style_t.view(),
            ]
            .map_err(|e| format!("Lỗi input text_encoder: {}", e))?;
            let res = sess
                .s_text
                .run(inputs)
                .map_err(|e| format!("Lỗi chạy text_encoder: {}", e))?;
            let (sh, d) = res[0]
                .try_extract_raw_tensor::<f32>()
                .map_err(|e| format!("Lỗi đọc output text_encoder: {}", e))?;
            let sh_usize: Vec<usize> = sh.iter().map(|&v| v.max(1) as usize).collect();
            (sh_usize, d.to_vec())
        };

        let ctx_t = Tensor::from_array((ctx_shape, ctx_flat))
            .map_err(|e| format!("Lỗi tạo ctx tensor: {}", e))?;

        // Stage 2: Duration Predictor
        let log_s = {
            let inputs = ort::inputs![
                "ctx" => ctx_t.view(),
                "ctx_mask" => mask_t.view(),
                "spk" => spk_t.view(),
            ]
            .map_err(|e| format!("Lỗi input duration_predictor: {}", e))?;
            let res = sess
                .s_dur
                .run(inputs)
                .map_err(|e| format!("Lỗi chạy duration_predictor: {}", e))?;
            let (_, d) = res[0]
                .try_extract_raw_tensor::<f32>()
                .map_err(|e| format!("Lỗi đọc output duration_predictor: {}", e))?;
            d.first().copied().unwrap_or(0.0)
        };

        let secs = ((log_s as f64).exp() / speed.max(0.25)).min(15.0);
        let frames = ((secs * self.flow_fps).round() as usize).max(2);
        let latent_count = 144 * frames;

        // Deterministic Gaussian noise (matches Android/iOS LCG + Box-Muller)
        let mut x = vec![0.0f32; latent_count];
        let mut rng_state: u64 = 0x5DEECE66D;
        let mut next_uniform = || -> f64 {
            rng_state = rng_state
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            (((rng_state >> 11) & 0x1FFFFFFFFFFFFF) as f64) / ((1u64 << 53) as f64)
        };
        let mut idx = 0;
        while idx < latent_count {
            let u1 = next_uniform().max(1e-7);
            let u2 = next_uniform();
            let r = (-2.0 * u1.ln()).sqrt();
            let theta = 2.0 * PI * u2;
            x[idx] = (r * theta.cos()) as f32;
            if idx + 1 < latent_count {
                x[idx + 1] = (r * theta.sin()) as f32;
            }
            idx += 2;
        }

        // Stage 3: Flow-matching Vector Estimator (8 sway steps, CFG = 3.0 for first 6 steps)
        let steps = 8usize;
        let cfg_limit = 6usize;
        let cfg_scale = 3.0f32;
        let sway = -1.0f64;
        let tg: Vec<f32> = (0..=steps)
            .map(|k| {
                let u = k as f64 / steps as f64;
                (u + sway * ((PI / 2.0 * u).cos() - 1.0 + u)) as f32
            })
            .collect();
        let x_shape = [1usize, 144, frames];

        for step in 0..steps {
            let t_t = Tensor::from_array(([1usize], vec![tg[step]]))
                .map_err(|e| format!("Lỗi t tensor: {}", e))?;
            let x_t = Tensor::from_array((x_shape, x.clone()))
                .map_err(|e| format!("Lỗi x tensor: {}", e))?;

            let mut vel: Vec<f32> = {
                let inputs = ort::inputs![
                    "x" => x_t.view(),
                    "t" => t_t.view(),
                    "ctx" => ctx_t.view(),
                    "ctx_mask" => mask_t.view(),
                    "spk" => spk_t.view(),
                    "style" => style_t.view(),
                ]
                .map_err(|e| format!("Lỗi input vector_estimator: {}", e))?;
                let res = sess
                    .s_ve
                    .run(inputs)
                    .map_err(|e| format!("Lỗi chạy vector_estimator: {}", e))?;
                let (_, d) = res[0]
                    .try_extract_raw_tensor::<f32>()
                    .map_err(|e| format!("Lỗi đọc vel: {}", e))?;
                d.to_vec()
            };

            if step < cfg_limit {
                let vu: Vec<f32> = {
                    let inputs = ort::inputs![
                        "x" => x_t.view(),
                        "t" => t_t.view(),
                        "ctx" => null_ctx_t.view(),
                        "ctx_mask" => null_mask_t.view(),
                        "spk" => null_spk_t.view(),
                        "style" => null_style_t.view(),
                    ]
                    .map_err(|e| format!("Lỗi input uncond vector_estimator: {}", e))?;
                    let res = sess
                        .s_ve
                        .run(inputs)
                        .map_err(|e| format!("Lỗi chạy uncond vector_estimator: {}", e))?;
                    let (_, d) = res[0]
                        .try_extract_raw_tensor::<f32>()
                        .map_err(|e| format!("Lỗi đọc vu: {}", e))?;
                    d.to_vec()
                };
                for j in 0..latent_count.min(vel.len()).min(vu.len()) {
                    vel[j] = vu[j] + cfg_scale * (vel[j] - vu[j]);
                }
            }

            let dt = tg[step + 1] - tg[step];
            for j in 0..latent_count.min(vel.len()) {
                x[j] += dt * vel[j];
            }
        }

        // Stage 4: Codec Decoder -> 24 kHz waveform
        let final_x_t = Tensor::from_array((x_shape, x))
            .map_err(|e| format!("Lỗi final_x tensor: {}", e))?;
        let raw_wav: Vec<f32> = {
            let inputs = ort::inputs![
                "x" => final_x_t.view(),
            ]
            .map_err(|e| format!("Lỗi input codec_decoder: {}", e))?;
            let res = sess
                .s_dec
                .run(inputs)
                .map_err(|e| format!("Lỗi chạy codec_decoder: {}", e))?;
            let (_, d) = res[0]
                .try_extract_raw_tensor::<f32>()
                .map_err(|e| format!("Lỗi đọc sóng âm codec_decoder: {}", e))?;
            d.to_vec()
        };

        Ok(trim_and_fade(&raw_wav, self.sample_rate))
    }

    fn phonemize(&self, raw: &str) -> String {
        let mut text: String = raw.nfc().collect();
        if let Ok(re_dash) = Regex::new(r"[-–—/]+") {
            text = re_dash.replace_all(&text, " ").into_owned();
        }
        if let Ok(re_semi) = Regex::new(r"[:;]+") {
            text = re_semi.replace_all(&text, ",").into_owned();
        }
        if let Ok(re_quotes) = Regex::new(r#"[“”"'‘’«»()\[\]{}*#_~`<>|]+"#) {
            text = re_quotes.replace_all(&text, " ").into_owned();
        }
        if let Ok(re_digits) = Regex::new(r"\d+") {
            text = re_digits
                .replace_all(&text, |caps: &regex::Captures| {
                    let s = &caps[0];
                    if let Ok(v) = s.parse::<u64>() {
                        if v <= 999_999_999 {
                            return format!(" {} ", number_to_vietnamese(v as u32));
                        }
                    }
                    format!(" {} ", s)
                })
                .into_owned();
        }

        text = text.to_lowercase();
        if let Ok(re_punct_sp) = Regex::new(r"\s+([.,!?…])") {
            text = re_punct_sp.replace_all(&text, "$1").into_owned();
        }
        if let Ok(re_ws) = Regex::new(r"\s+") {
            text = re_ws.replace_all(&text, " ").trim().to_string();
        }

        let Ok(re_tok) = Regex::new(r"[\p{L}]+|[.,!?]") else {
            return String::new();
        };

        let mut out: Vec<String> = Vec::new();
        let mut word_count = 0usize;
        for m in re_tok.find_iter(&text) {
            let tok = m.as_str();
            if tok.len() == 1 && ".,!?".contains(tok) {
                if let Some(last) = out.last_mut() {
                    last.push_str(tok);
                }
                continue;
            }
            word_count += 1;
            if let Some(ph) = self.words.get(tok) {
                out.push(ph.clone());
            } else {
                let mut fb = String::new();
                for ch in tok.chars() {
                    if let Some(sub) = self.char_fallback.get(&ch.to_string()) {
                        fb.push_str(sub);
                    }
                }
                out.push(if fb.is_empty() { tok.to_string() } else { fb });
            }
        }

        if out.is_empty() {
            return String::new();
        }

        let mut joined = out
            .join(" ")
            .trim_matches(|c| matches!(c, ' ' | '.' | ',' | '!' | '?'))
            .to_string();
        let ends_punct = joined
            .chars()
            .last()
            .map(|c| ".,!?".contains(c))
            .unwrap_or(false);
        if word_count < 5 || joined.is_empty() || !ends_punct {
            joined.push('.');
        }
        joined
    }
}

fn json_f32_vec(val: Option<&JsonValue>) -> Vec<f32> {
    val.and_then(|v| v.as_array())
        .map(|arr| arr.iter().map(|x| x.as_f64().unwrap_or(0.0) as f32).collect())
        .unwrap_or_default()
}

fn number_to_vietnamese(n: u32) -> String {
    const DIGITS: [&str; 10] = [
        "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín",
    ];
    if n < 10 {
        return DIGITS[n as usize].to_string();
    }

    fn read_triple(v: u32, full: bool) -> Vec<&'static str> {
        const DIGITS: [&str; 10] = [
            "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín",
        ];
        let h = (v / 100) as usize;
        let rem = v % 100;
        let t = (rem / 10) as usize;
        let u = (rem % 10) as usize;
        let mut out = Vec::new();
        if full || h > 0 {
            out.push(DIGITS[h]);
            out.push("trăm");
            if t == 0 && u > 0 {
                out.push("lẻ");
            }
        }
        if t == 1 {
            out.push("mười");
            if u == 5 {
                out.push("lăm");
            } else if u > 0 {
                out.push(DIGITS[u]);
            }
        } else if t > 1 {
            out.push(DIGITS[t]);
            out.push("mươi");
            match u {
                1 => out.push("mốt"),
                4 => out.push("tư"),
                5 => out.push("lăm"),
                2..=9 => out.push(DIGITS[u]),
                _ => {}
            }
        } else if u > 0 {
            out.push(DIGITS[u]);
        }
        out
    }

    let millions = n / 1_000_000;
    let thousands = (n % 1_000_000) / 1_000;
    let units = n % 1_000;
    let mut parts: Vec<&str> = Vec::new();
    if millions > 0 {
        parts.extend(read_triple(millions, false));
        parts.push("triệu");
    }
    if thousands > 0 {
        parts.extend(read_triple(thousands, millions > 0));
        parts.push("nghìn");
    }
    if units > 0 {
        parts.extend(read_triple(units, millions > 0 || thousands > 0));
    }
    parts.join(" ")
}

fn split_clauses(text: &str, max_chars: usize) -> Vec<String> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Vec::new();
    }
    let chars: Vec<char> = trimmed.chars().collect();
    if chars.len() <= max_chars {
        return vec![trimmed.to_string()];
    }

    let mut parts: Vec<String> = Vec::new();
    let mut cursor = 0usize;
    while chars.len().saturating_sub(cursor) > max_chars {
        let end = cursor + max_chars;
        let window = &chars[cursor..end];
        let mut cut_rel = window.iter().rposition(|c| ".;!?,".contains(*c));
        if cut_rel.is_none() || cut_rel == Some(0) {
            cut_rel = window.iter().rposition(|&c| c == ' ');
        }
        let step = cut_rel.filter(|&i| i > 0).map(|i| i + 1).unwrap_or(max_chars);
        let head: String = chars[cursor..cursor + step].iter().collect();
        let head_trimmed = head.trim();
        if !head_trimmed.is_empty() {
            parts.push(head_trimmed.to_string());
        }
        cursor += step;
        while cursor < chars.len() && chars[cursor].is_whitespace() {
            cursor += 1;
        }
    }
    if cursor < chars.len() {
        let tail: String = chars[cursor..].iter().collect();
        let tail_trimmed = tail.trim();
        if !tail_trimmed.is_empty() {
            parts.push(tail_trimmed.to_string());
        }
    }
    parts
}

fn trim_and_fade(samples: &[f32], sample_rate: u32) -> Vec<f32> {
    if samples.is_empty() {
        return Vec::new();
    }
    let mut peak = 0.0f32;
    for &s in samples {
        let a = s.abs();
        if a > peak {
            peak = a;
        }
    }
    let mut lo = 0usize;
    let mut hi = samples.len();
    if peak > 1e-4 {
        let thr = 0.004f32.max(peak * 0.012);
        let first = samples.iter().position(|s| s.abs() >= thr);
        let last = samples.iter().rposition(|s| s.abs() >= thr);
        if let (Some(f), Some(l)) = (first, last) {
            if l >= f {
                lo = f.saturating_sub((0.025 * sample_rate as f64) as usize);
                hi = (l + (0.080 * sample_rate as f64) as usize).min(samples.len());
            }
        }
    }

    let mut out = samples[lo..hi].to_vec();
    let fade = ((0.015 * sample_rate as f64) as usize).min(out.len() / 4);
    if fade > 1 {
        let len = out.len();
        for k in 0..fade {
            let g = (0.5 - 0.5 * (PI * k as f64 / fade as f64).cos()) as f32;
            out[k] *= g;
            out[len - 1 - k] *= g;
        }
    }
    for s in &mut out {
        *s = s.clamp(-1.0, 1.0);
    }
    out
}

fn encode_wav16_mono(samples: &[f32], sample_rate: u32) -> Vec<u8> {
    let data_bytes = (samples.len() * 2) as u32;
    let mut buf = Vec::with_capacity(44 + data_bytes as usize);
    buf.extend_from_slice(b"RIFF");
    buf.extend_from_slice(&(36 + data_bytes).to_le_bytes());
    buf.extend_from_slice(b"WAVE");
    buf.extend_from_slice(b"fmt ");
    buf.extend_from_slice(&16u32.to_le_bytes());
    buf.extend_from_slice(&1u16.to_le_bytes()); // PCM
    buf.extend_from_slice(&1u16.to_le_bytes()); // Mono
    buf.extend_from_slice(&sample_rate.to_le_bytes());
    buf.extend_from_slice(&(sample_rate * 2).to_le_bytes());
    buf.extend_from_slice(&2u16.to_le_bytes());
    buf.extend_from_slice(&16u16.to_le_bytes());
    buf.extend_from_slice(b"data");
    buf.extend_from_slice(&data_bytes.to_le_bytes());

    for &s in samples {
        let pcm = (s * 32767.0).round().clamp(-32768.0, 32767.0) as i16;
        buf.extend_from_slice(&pcm.to_le_bytes());
    }
    buf
}

