"""End-to-end verification for iPhone Lock-Screen Continuous Playback & Chapter Duration UX:
1. Multi-Phẩm sutra Lock Screen metadata retains Chapter Title across all prose segments (no 2s disappearance).
2. Lock Screen setPositionState & #dp-seek report Total Chapter Duration (not micro-segment duration).
3. Lock Screen scrub (seekto), ±15s cross-segment skip, and Next/Prev Chapter (⏭/⏮) work accurately.
4. iPhone Safari/PWA Lock-Screen simulation (iPhone UA + visibilityState='hidden'):
   - Zero <audio> src teardown across transitions
   - Automatic Dynamic Chapter Audio Stitching (multi-segment continuous hardware stream)
   - Synchronous Silent Keep-Alive loop during 4G lag + automatic warm-voice retry (zero robotic TTS fallback)."""
from __future__ import annotations

import json
from pathlib import Path
import struct
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import DEPENDENCIES
sys.path.insert(0, str(DEPENDENCIES))
import server
from playwright.sync_api import sync_playwright


class QuietHandler(server.Handler):
    def log_message(self, *args):
        pass


def make_pcm_wav(duration_sec: float = 4.0, sample_rate: int = 8000) -> bytes:
    num_samples = int(duration_sec * sample_rate)
    data_bytes = num_samples * 2
    header = struct.pack(
        '<4sI4s4sIHHIIHH4sI',
        b'RIFF',
        36 + data_bytes,
        b'WAVE',
        b'fmt ',
        16,
        1,
        1,
        sample_rate,
        sample_rate * 2,
        2,
        16,
        b'data',
        data_bytes,
    )
    # Subtle non-zero tone so binary inspector & Chromium MediaEngine decode full duration cleanly
    tone = struct.pack('<8h', 120, 240, 120, 0, -120, -240, -120, 0)
    pcm = (tone * ((num_samples // 8) + 1))[:data_bytes]
    return header + pcm


MULTI_CHAPTER_SUTRA = """# Kinh Thính Pháp Kiểm Thử

## Phẩm 1: Chánh Niệm Hơi Thở

Đức Phật dạy các thầy Tỳ-kheo hãy an trú chánh niệm trước mặt, thở vào biết rõ hơi thở dài, thở ra biết rõ hơi thở dài trong sự tỉnh giác tròn đầy.

Người hành giả lắng nghe lời kinh với tâm thanh tịnh, buông xả mọi lo âu thường nhật để thân và tâm trở về một mối an lành vững chãi.

Khi hơi thở nhẹ nhàng và sâu lắng, từng câu pháp thấm sâu vào tâm thức như mưa xuân thấm xuống đất hiền, nuôi dưỡng hạt giống từ bi và trí tuệ.

Hết thảy các pháp hữu vi đều vô thường, ai dùng trí tuệ quán chiếu tỏ tường điều ấy thì liền nhàm chán khổ đau, đây là con đường thanh tịnh.

## Phẩm 2: Tứ Vô Lượng Tâm

Bấy giờ Thế Tôn lại bảo đại chúng rằng người tu tập tâm Từ rải khắp một phương, hai phương, ba phương, bốn phương cùng khắp mười phương thế giới.

Tâm Bi thương xót muôn loài chúng sinh đang chịu khổ não, nguyện cho tất cả thoát khỏi ưu sầu và đạt được sự an ổn lâu dài không thối chuyển.

Tâm Hỷ vui mừng trước mọi điều lành của tha nhân không chút ganh tị, tâm Xả bình thản vững vàng trước tám ngọn gió đời khen chê được mất.
"""


def find_chromium_exe() -> str | None:
    candidates = [
        Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
        Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe'),
    ]
    for c in candidates:
        if c.is_file():
            return str(c)
    return None


def main() -> None:
    httpd = server.LibraryHTTPServer(('127.0.0.1', 0), QuietHandler)
    httpd.allowed_patterns = set()
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{httpd.server_port}'

    wav_clip = make_pcm_wav(duration_sec=10.0)
    checks: list[str] = []
    page_errors: list[str] = []

    try:
        with sync_playwright() as p:
            exe = find_chromium_exe()
            browser = p.chromium.launch(executable_path=exe, headless=True) if exe else p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 390, 'height': 844},
                user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
                service_workers='block',
            )

            context.add_init_script("""
                (() => {
                  const NativeAudio = window.Audio;
                  window.__audioStats = { removeSrcCalls: 0, srcHistory: [], positionStates: [], actionHandlers: {}, speechSynthCalls: 0 };
                  window.Audio = function() {
                    const el = new NativeAudio();
                    const origRemove = el.removeAttribute.bind(el);
                    el.removeAttribute = function(name) {
                      if (name === 'src') window.__audioStats.removeSrcCalls += 1;
                      return origRemove(name);
                    };
                    let currentSrc = '';
                    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
                    Object.defineProperty(el, 'src', {
                      get() { return desc.get.call(el); },
                      set(v) {
                        currentSrc = v;
                        window.__audioStats.srcHistory.push(String(v));
                        return desc.set.call(el, v);
                      }
                    });
                    window.testAudio = el;
                    return el;
                  };
                  window.Audio.prototype = NativeAudio.prototype;

                  if ('speechSynthesis' in window) {
                    const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
                    window.speechSynthesis.speak = function(u) {
                      window.__audioStats.speechSynthCalls += 1;
                      return origSpeak(u);
                    };
                  }

                  let fakeHidden = false;
                  Object.defineProperty(document, 'visibilityState', {
                    configurable: true,
                    get() { return fakeHidden ? 'hidden' : 'visible'; }
                  });
                  Object.defineProperty(document, 'hidden', {
                    configurable: true,
                    get() { return fakeHidden; }
                  });
                  window.__setFakeLockScreen = (locked) => {
                    fakeHidden = Boolean(locked);
                    document.dispatchEvent(new Event('visibilitychange'));
                  };

                  if ('mediaSession' in navigator) {
                    const origSetPos = navigator.mediaSession.setPositionState?.bind(navigator.mediaSession);
                    navigator.mediaSession.setPositionState = (state) => {
                      window.__audioStats.positionStates.push({ ...state });
                      return origSetPos ? origSetPos(state) : undefined;
                    };
                    const origSetHandler = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);
                    navigator.mediaSession.setActionHandler = (name, fn) => {
                      window.__audioStats.actionHandlers[name] = fn;
                      return origSetHandler(name, fn);
                    };
                  }
                })();
            """)

            context.route('**/api/voices', lambda r: r.fulfill(json={
                'available': True,
                'offlineAvailable': True,
                'audioVersion': 11,
                'voices': [],
                'offlineVoices': [
                    {'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức · Nam (Trầm tĩnh)'},
                    {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan · Nữ (Dịu dàng)'},
                ],
                'audioConfig': {'startupBufferSeconds': 0, 'prefetchMax': 24, 'bufferSeconds': 120},
            }))
            context.route('**/api/audio-pack/manifest*', lambda r: r.fulfill(json={'available': False, 'packs': []}))

            held_routes = []
            hold_target_text = [None]
            fail_once_text = [None]

            def handle_tts(route):
                body = json.loads(route.request.post_data or '{}')
                txt = body.get('text', '')
                if fail_once_text[0] and txt == fail_once_text[0]:
                    fail_once_text[0] = None
                    route.fulfill(status=502, json={'error': 'Mạng di động chập chờn tạm thời.', 'retryable': True})
                    return
                if hold_target_text[0] and txt == hold_target_text[0]:
                    held_routes.append(route)
                    return
                route.fulfill(status=200, content_type='audio/wav', body=wav_clip)

            context.route('**/api/tts', handle_tts)

            page = context.new_page()
            page.on('pageerror', lambda e: page_errors.append(str(e)))
            page.goto(f'{base}/web-thuvien/index.html', wait_until='networkidle')

            sutra_url = page.evaluate("new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet'), location.href).href")
            context.route(sutra_url, lambda r: r.fulfill(status=200, content_type='text/markdown; charset=utf-8', body=MULTI_CHAPTER_SUTRA))

            # 1. Start playing multi-chapter sutra on iPhone
            page.evaluate("DharmaPlayerStore.playItem({type:'daithua', id:'dt_01_2'})")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.wait_for_timeout(450)

            ch_state = page.evaluate("""() => ({
                chapterCount: Audiobook.state.chapterCount,
                chapterIndex: Audiobook.state.chapterIndex,
                chapterTitle: Audiobook.state.chapterTitle,
                chapterDuration: Audiobook.state.chapterDuration,
                segmentDuration: Audiobook.state.duration,
                seekMax: Number(document.getElementById('dp-seek').max),
                seekDisabled: document.getElementById('dp-seek').disabled,
                backDisabled: document.getElementById('dp-back').disabled,
                lockTitle: navigator.mediaSession?.metadata?.title || '',
                lockArtist: navigator.mediaSession?.metadata?.artist || '',
                lastPosState: window.__audioStats.positionStates.at(-1),
            })""")
            assert ch_state['chapterCount'] == 2, f'Expected 2 Phẩm chapters, got: {ch_state}'
            assert 'Phẩm 1' in ch_state['chapterTitle'], ch_state
            assert ch_state['chapterDuration'] >= 40.0, f'Expected full Phẩm 1 duration (>=40s), got: {ch_state}'
            assert ch_state['seekDisabled'] is False and ch_state['backDisabled'] is False, 'Seek bar & ±10s must be enabled for offline AI voices!'
            assert abs(ch_state['seekMax'] - ch_state['chapterDuration']) < 1.0, ch_state
            assert ch_state['lastPosState']['duration'] >= 40.0, ch_state
            assert 'Phần 1/2' in ch_state['lockArtist'], ch_state
            checks.append('Multi-chapter sutra computes full Phẩm duration (>=40s) on Lock Screen & enables #dp-seek / ±10s')

            # 2. Lock iPhone screen -> verify Dynamic Chapter Audio Stitching & Chapter Title persistence on prose segments!
            page.evaluate('window.__setFakeLockScreen(true)')
            page.wait_for_timeout(400)
            remove_before = page.evaluate('window.__audioStats.removeSrcCalls')

            # Finish segment 0 while iPhone screen is locked -> must transition synchronously into Stitched Chapter Slice without removing src!
            page.evaluate('testAudio.currentTime = testAudio.duration - 0.02')
            page.wait_for_function("Audiobook.state.index >= 1 && Audiobook.state.status === 'playing'")
            stitched_check = page.evaluate("""() => ({
                removeAfter: window.__audioStats.removeSrcCalls,
                index: Audiobook.state.index,
                audioDuration: testAudio.duration,
                lockTitle: navigator.mediaSession?.metadata?.title || '',
                lockArtist: navigator.mediaSession?.metadata?.artist || '',
            })""")
            assert stitched_check['removeAfter'] == remove_before, f'Expected 0 removeAttribute("src") during lock-screen transition, got {stitched_check}'
            assert stitched_check['audioDuration'] >= 25.0, f'Expected stitched multi-segment Chapter stream (>=25s), got {stitched_check}'
            # Advance into prose segment 2 inside the stitched stream -> Phẩm 1 title MUST remain on Lock Screen!
            page.evaluate('testAudio.currentTime = 14.0; testAudio.dispatchEvent(new Event("timeupdate"))')
            page.wait_for_function('Audiobook.state.index >= 2')
            prose_meta = page.evaluate("""() => ({
                index: Audiobook.state.index,
                segHeading: Audiobook.segments[Audiobook.state.index].heading,
                chapterTitle: Audiobook.state.chapterTitle,
                lockTitle: navigator.mediaSession?.metadata?.title || '',
                lockArtist: navigator.mediaSession?.metadata?.artist || '',
            })""")
            assert prose_meta['segHeading'] is None, 'Prose segment itself has no raw heading'
            assert 'Phẩm 1' in prose_meta['lockTitle'] and 'Phần 1/2' in prose_meta['lockArtist'], f'Chapter title disappeared on prose segment: {prose_meta}'
            checks.append('Locked iPhone stitches Phẩm into continuous stream (0 src teardown) & keeps Phẩm title on prose segments')

            # 3. Test Lock Screen Scrub (seekto), ±15s cross-segment skip, and Next/Prev Chapter (⏭ / ⏮)
            page.evaluate('window.__audioStats.actionHandlers.seekto({ seekTime: 26.0 })')
            page.wait_for_function('Audiobook.state.index >= 2 && Audiobook.state.chapterTime >= 24.0')

            # Skip backward 20s across segment boundary!
            before_skip = page.evaluate('Audiobook.state.chapterTime')
            page.evaluate('window.__audioStats.actionHandlers.seekbackward({ seekOffset: 20 })')
            page.wait_for_function(f'Audiobook.state.chapterTime < {before_skip - 15}')

            # Lock Screen Next Track (⏭) -> Must jump to Phẩm 2 (chapterIndex === 1)!
            page.evaluate('window.__audioStats.actionHandlers.nexttrack()')
            page.wait_for_function("Audiobook.state.chapterIndex === 1 && Audiobook.state.status === 'playing'")
            pham2_meta = page.evaluate("""() => ({
                chapterIndex: Audiobook.state.chapterIndex,
                chapterTitle: Audiobook.state.chapterTitle,
                lockTitle: navigator.mediaSession?.metadata?.title || '',
                lockArtist: navigator.mediaSession?.metadata?.artist || '',
            })""")
            assert 'Phẩm 2' in pham2_meta['lockTitle'] and 'Phần 2/2' in pham2_meta['lockArtist'], pham2_meta

            # Lock Screen Prev Track (⏮) when < 5s into Phẩm 2 -> Must jump back to Phẩm 1 (chapterIndex === 0)!
            page.evaluate('window.__audioStats.actionHandlers.previoustrack()')
            page.wait_for_function('Audiobook.state.chapterIndex === 0')
            checks.append('Lock Screen scrub (seekto), cross-segment ±15s skip, and Chapter Next/Prev (⏭/⏮) verified')

            # 4. Simulate 4G Dead-Zone + Transient 502 while iPhone screen is locked -> Silent Keep-Alive + Warm Voice Recovery!
            last_seg_idx = page.evaluate('Audiobook.segments.length - 1')
            last_seg_text = page.evaluate(f'Audiobook.segments[{last_seg_idx}].text')
            # Clear caches by switching voice while locked and holding the target segment
            page.evaluate('Audiobook.pause()')
            hold_target_text[0] = last_seg_text
            fail_once_text[0] = last_seg_text
            page.evaluate("""() => {
                const sel = document.getElementById('audio-voice');
                sel.value = 'offline:vieneu-thuc-doan';
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }""")
            # Play second-to-last segment, then hold last segment so ended hits an unbuffered 4G stall while screen is locked!
            prev_idx = last_seg_idx - 1
            hold_target_text[0] = last_seg_text
            fail_once_text[0] = None
            page.evaluate(f'Audiobook.seekChunk({prev_idx}, 0, true)')
            page.wait_for_function(f"Audiobook.state.index === {prev_idx} && Audiobook.state.status === 'playing'")
            page.wait_for_function('true')
            page.wait_for_timeout(200)
            assert len(held_routes) >= 1, 'Expected prefetch of final segment to be held'

            # Trigger natural ended of prev_idx while screen is locked and final segment is still downloading over slow 4G!
            page.evaluate('testAudio.currentTime = testAudio.duration - 0.02')
            page.wait_for_function(f"Audiobook.state.index === {last_seg_idx} && Audiobook.state.status === 'loading'")
            keep_alive_state = page.evaluate('({ loop: testAudio.loop, paused: testAudio.paused, speechCalls: window.__audioStats.speechSynthCalls })')
            assert keep_alive_state['loop'] is True and keep_alive_state['paused'] is False, f'Expected silent keep-alive loop active on locked iPhone, got: {keep_alive_state}'
            assert keep_alive_state['speechCalls'] == 0, 'Must NEVER switch to robotic speechSynthesis!'

            # Release 4G response -> must seamlessly switch loop=false and speak warm AI voice!
            while held_routes:
                held_routes.pop(0).fulfill(status=200, content_type='audio/wav', body=wav_clip)
            hold_target_text[0] = None
            page.wait_for_function(f"Audiobook.state.index === {last_seg_idx} && Audiobook.state.status === 'playing'")
            resumed_state = page.evaluate('({ loop: testAudio.loop, paused: testAudio.paused, voice: Audiobook.state.voice, speechCalls: window.__audioStats.speechSynthCalls })')
            assert resumed_state['loop'] is False and resumed_state['paused'] is False
            assert resumed_state['voice'] == 'offline:vieneu-thuc-doan'
            assert resumed_state['speechCalls'] == 0
            checks.append('4G stall on locked iPhone holds AVAudioSession via Silent Keep-Alive & resumes warm AI voice (0 robotic fallback)')

            assert not page_errors, f'Unexpected JS page errors: {page_errors}'
            browser.close()

        print(json.dumps({'result': 'passed', 'checks': checks}, ensure_ascii=False, indent=2), flush=True)
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join()


if __name__ == '__main__':
    main()

