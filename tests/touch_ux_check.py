"""Automated E2E verification for Stage A Touch Mobile & Tablet UI/UX across iPhone, iPad & Desktop."""
from pathlib import Path
import json
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import DEPENDENCIES, REPORTS
sys.path.insert(0, str(DEPENDENCIES))
import server


class QuietHandler(server.Handler):
    def log_message(self, *args):
        pass


def main():
    httpd = server.ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
    httpd.allowed_patterns = set()
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{httpd.server_address[1]}'
    checks = []

    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)

            # =================================================================
            # 1. iPhone 15 Pro Viewport (393 x 852, Coarse Touch)
            # =================================================================
            iphone_ctx = browser.new_context(
                viewport={'width': 393, 'height': 852},
                is_mobile=True,
                has_touch=True,
                device_scale_factor=3,
            )
            page = iphone_ctx.new_page()
            errors, failed = [], []
            page.on('pageerror', lambda err: errors.append(str(err)))
            page.on(
                'response',
                lambda res: failed.append(res.url)
                if res.status >= 400 and res.url.startswith(base)
                else None,
            )

            page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            page.wait_for_function('Boolean(window.TouchUX && window.Reader && window.DharmaShell)')
            assert not errors and not failed, (errors, failed)

            # Header touch ergonomics
            header_box = page.locator('#dharma-drawer-toggle').bounding_box()
            bell_box = page.locator('#dharma-bell-quick').bounding_box()
            assert header_box and header_box['width'] >= 42 and header_box['height'] >= 42, header_box
            assert bell_box and bell_box['width'] >= 42 and bell_box['height'] >= 42, bell_box
            assert not page.locator('#library-menu-toggle').is_visible()
            checks.append('iPhone header 44px drawer & mindfulness bell controls verified')

            # 5-Pillar Bottom Navigation Bar
            pillars = page.locator('#dharma-mobile-nav [data-mobile-nav]')
            assert pillars.count() == 5
            nav_ids = page.evaluate(
                "[...document.querySelectorAll('#dharma-mobile-nav [data-mobile-nav]')].map(b => b.dataset.mobileNav)"
            )
            assert nav_ids == ['home', 'canons', 'search', 'shelf', 'menu'], nav_ids
            for idx in range(5):
                b_box = pillars.nth(idx).bounding_box()
                assert b_box and b_box['height'] >= 48, (idx, b_box)
            assert page.locator('#dharma-mobile-nav [data-mobile-nav="home"]').evaluate(
                "el => el.classList.contains('active')"
            )
            checks.append('5-pillar thumb-zone Bottom Navigation Bar ergonomics verified')

            # Off-Canvas Slide-Over Sidebar Drawer + Theme Switcher + Distinct Canon Icons
            assert not page.evaluate("document.body.classList.contains('dharma-drawer-open')")
            page.locator('#dharma-mobile-nav [data-mobile-nav="menu"]').click()
            page.wait_for_function(
                "document.body.classList.contains('dharma-drawer-open') && Math.abs(document.getElementById('dharma-sidebar').getBoundingClientRect().x) < 2"
            )
            sidebar_box = page.locator('#dharma-sidebar').bounding_box()
            assert sidebar_box and abs(sidebar_box['x']) < 2 and sidebar_box['width'] >= 280, sidebar_box
            assert page.locator('#dharma-sidebar .ds-drawer-top').is_visible()
            assert page.locator('#ds-offline-badge').is_visible()

            # Check distinct SVG icons across the canons inside #dharma-sidebar
            canon_svgs = page.evaluate(
                """() => ['tang-han', 'tang-dai-thua', 'tang-nam-tong', 'phucminh', 'offline']
                    .map(id => document.querySelector(`#dharma-sidebar [data-dharma-nav="${id}"] svg`)?.innerHTML || '')"""
            )
            assert len(set(canon_svgs)) == 5 and all(canon_svgs), canon_svgs

            # Theme switch inside Drawer
            page.locator('#dharma-sidebar .ds-drawer-themes [data-theme="night"]').click()
            assert page.evaluate("document.documentElement.getAttribute('data-theme')") == 'night'
            page.locator('#dharma-sidebar .ds-drawer-themes [data-theme="parchment"]').click()
            assert page.evaluate("document.documentElement.getAttribute('data-theme')") == 'parchment'

            # Navigating via drawer auto-closes drawer & updates active bottom pillar
            page.locator('#dharma-sidebar [data-dharma-nav="phucminh"]').click()
            page.wait_for_function("!document.body.classList.contains('dharma-drawer-open')")
            assert page.evaluate('appState.currentTab') == 'phucminh'
            assert page.locator('#dharma-mobile-nav [data-mobile-nav="canons"]').evaluate(
                "el => el.classList.contains('active')"
            )
            checks.append('Off-Canvas Slide-Over Sidebar, distinct canon icons & live theme switcher verified')

            # Canon & Offline Quick-Switcher Bottom Sheet
            page.locator('#dharma-mobile-nav [data-mobile-nav="canons"]').click()
            page.wait_for_selector('#dharma-canons-sheet[open]')
            sheet_box = page.locator('#dharma-canons-sheet').bounding_box()
            assert sheet_box and abs((sheet_box['y'] + sheet_box['height']) - 852) <= 2, sheet_box
            page.locator('#dharma-canons-sheet [data-canon-go="daithua"]').click()
            assert not page.evaluate("document.getElementById('dharma-canons-sheet').open")
            assert page.evaluate('appState.currentTab') == 'daithua'
            checks.append('Canon & Offline Quick-Switcher Bottom Sheet verified')

            # Smart Collapsible Header when scrolling down on daithua catalog
            h_before = page.locator('.noble-header').bounding_box()['height']
            page.evaluate('window.scrollTo(0, 360)')
            page.wait_for_function("document.body.classList.contains('dharma-header-compact')")
            page.wait_for_timeout(260)
            h_compact = page.locator('.noble-header').bounding_box()['height']
            assert h_before - h_compact >= 34, (h_before, h_compact)
            page.evaluate('window.scrollTo(0, 0)')
            page.wait_for_function("!document.body.classList.contains('dharma-header-compact')")
            checks.append(f'Smart Collapsible Header verified ({round(h_before)}px -> {round(h_compact)}px on scroll)')

            # Search & Personal Shelf pillars
            page.locator('#dharma-mobile-nav [data-mobile-nav="search"]').click()
            assert page.evaluate('appState.currentTab') == 'fulltext'
            page.locator('#dharma-mobile-nav [data-mobile-nav="shelf"]').click()
            assert page.evaluate('appState.currentTab') == 'shelf'
            assert page.locator('#tab-shelf .shelf-quick-tabs button').count() == 5
            checks.append('Search & Shelf bottom tabs + personal quick-tabs verified')

            # Compact Floating Mini-Player + Swipe-Up to expand #dp-now
            page.evaluate(
                """() => {
                    const b = DAI_THUA_DATA.find(x => x.taishoId === 'T08n0251');
                    const item = DharmaPlayerStore.resolve({ type: 'daithua', id: b.id });
                    DharmaPlayerStore.state.item = item;
                    document.body.classList.remove('player-empty');
                    PersistentPlayer.paint(DharmaPlayerStore.state);
                }"""
            )
            p_box = page.locator('#persistent-player').bounding_box()
            assert p_box and 58 <= p_box['height'] <= 74, p_box
            assert page.locator('#persistent-player .dp-cover').is_visible()

            # Dispatch synthetic touch swipe-up on #persistent-player -> opens #dp-now
            page.evaluate(
                """() => {
                    const el = document.getElementById('persistent-player');
                    const mk = (type, y) => {
                        const touch = new Touch({ identifier: 1, target: el, clientX: 180, clientY: y });
                        return new TouchEvent(type, {
                            bubbles: true,
                            cancelable: true,
                            touches: type === 'touchend' ? [] : [touch],
                            changedTouches: [touch],
                        });
                    };
                    el.dispatchEvent(mk('touchstart', 760));
                    el.dispatchEvent(mk('touchend', 690));
                }"""
            )
            assert page.evaluate("document.getElementById('dp-now').open")
            assert page.evaluate('TouchUX.handleBackButton()') is True
            assert not page.evaluate("document.getElementById('dp-now').open")
            checks.append('Compact floating Mini-Player & Swipe-Up Now Playing sheet verified')

            # Touch Reader: Mobile Aa Bottom Sheet + Tap Center Zen Mode + Hardware Back Stack
            page.evaluate("LibraryUI.open('daithua', DAI_THUA_DATA[0].id, 'viet')")
            page.wait_for_function('Boolean(window.Reader && Reader.state.ready)')
            assert not page.locator('#dharma-mobile-nav').is_visible()

            # Open Aa Inspector Bottom Sheet & increment font size
            font_before = int(page.locator('#r-font').input_value())
            page.locator('#reader-view-container [data-panel="settings"]').click()
            insp_box = page.locator('#reader-inspector').bounding_box()
            assert insp_box and abs((insp_box['y'] + insp_box['height']) - 852) <= 2, insp_box
            page.locator('#reader-sheet-font-up').click()
            assert int(page.locator('#r-font').input_value()) == font_before + 1
            assert page.evaluate('TouchUX.handleBackButton()') is True
            assert page.evaluate("document.getElementById('reader-inspector').hidden")

            # Tap center of #reader-scroll -> toggles Immersive Zen Mode
            page.evaluate(
                """() => {
                    const pane = document.getElementById('reader-scroll');
                    const r = pane.getBoundingClientRect();
                    const cx = r.left + r.width * 0.5;
                    const cy = r.top + r.height * 0.5;
                    const target = pane.querySelector('p, .source-prose') || pane;
                    const mk = type => {
                        const touch = new Touch({ identifier: 2, target, clientX: cx, clientY: cy });
                        return new TouchEvent(type, {
                            bubbles: true,
                            cancelable: true,
                            touches: type === 'touchend' ? [] : [touch],
                            changedTouches: [touch],
                        });
                    };
                    target.dispatchEvent(mk('touchstart'));
                    target.dispatchEvent(mk('touchend'));
                }"""
            )
            assert page.evaluate(
                "document.getElementById('reader-view-container').classList.contains('reader-zen-immersive')"
            )
            assert not page.locator('.reader-topbar').is_visible()
            assert page.locator('#reader-zen-pill').is_visible()

            # Hardware Back Stack unwinds Zen Mode -> Reader -> Tab History -> Home -> False
            assert page.evaluate('TouchUX.handleBackButton()') is True
            assert not page.evaluate(
                "document.getElementById('reader-view-container').classList.contains('reader-zen-immersive')"
            )
            assert page.evaluate("document.getElementById('reader-view-container').classList.contains('active')")

            assert page.evaluate('TouchUX.handleBackButton()') is True
            assert not page.evaluate("document.getElementById('reader-view-container').classList.contains('active')")

            steps = 0
            while page.evaluate('TouchUX.handleBackButton()') and steps < 10:
                steps += 1
            assert page.evaluate('appState.currentTab') == 'home'
            assert page.evaluate('TouchUX.handleBackButton()') is False
            assert not errors and not failed, (errors, failed)
            checks.append('Reader Aa Bottom Sheet, Tap-Center Zen Mode & Hardware Back Stack verified')
            iphone_ctx.close()

            # =================================================================
            # 2. iPad Air Portrait (820 x 1180) & Tablet Landscape (1100 x 820)
            # =================================================================
            ipad_ctx = browser.new_context(
                viewport={'width': 820, 'height': 1180},
                has_touch=True,
            )
            tpage = ipad_ctx.new_page()
            tpage.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            tpage.wait_for_function('Boolean(window.TouchUX)')
            assert tpage.locator('#dharma-mobile-nav').is_visible()
            tpage.locator('#dharma-drawer-toggle').click()
            tpage.wait_for_function(
                "document.body.classList.contains('dharma-drawer-open') && Math.abs(document.getElementById('dharma-sidebar').getBoundingClientRect().x) < 2"
            )
            assert tpage.locator('#dharma-sidebar [data-dharma-nav="tang-dai-thua"] span').first.is_visible()
            tpage.locator('#ds-drawer-close').click()

            # Rotate to Tablet Landscape (1100 x 820) -> Collapsible Labeled Rail
            tpage.set_viewport_size({'width': 1100, 'height': 820})
            tpage.wait_for_timeout(120)
            assert not tpage.locator('#dharma-mobile-nav').is_visible()
            full_w = tpage.locator('#dharma-sidebar').bounding_box()['width']
            assert full_w >= 190, full_w
            tpage.locator('#dharma-drawer-toggle').click()
            assert tpage.evaluate("document.body.classList.contains('dharma-rail-collapsed')")
            rail_w = tpage.locator('#dharma-sidebar').bounding_box()['width']
            assert 70 <= rail_w <= 92, rail_w
            assert tpage.locator('#dharma-sidebar .ds-rail-caption').first.is_visible()
            checks.append(f'iPad Portrait Drawer & Landscape Collapsible Labeled Rail ({round(full_w)}px <-> {round(rail_w)}px) verified')
            ipad_ctx.close()

            # =================================================================
            # 3. Desktop Regression Check (1680 x 950 Wide Sanctuary)
            # =================================================================
            desk_ctx = browser.new_context(viewport={'width': 1680, 'height': 950})
            dpage = desk_ctx.new_page()
            dpage.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            dpage.wait_for_function('Boolean(window.TouchUX)')
            assert not dpage.locator('#dharma-drawer-toggle').is_visible()
            assert not dpage.locator('#dharma-mobile-nav').is_visible()
            assert dpage.locator('#dharma-sidebar').is_visible()
            assert dpage.locator('#dharma-companion').is_visible()

            # Smart Cross-Platform App Download Dialog (Web Only -> Auto-Hidden in Native Shells)
            assert dpage.locator('#dharma-download-toggle').is_visible()
            assert dpage.locator('#home-download-app-btn').is_visible()
            dpage.locator('#dharma-download-toggle').click()
            assert dpage.evaluate("document.getElementById('dharma-app-download-dialog').open")
            apk_href = dpage.locator('#app-dl-android-apk').get_attribute('href') or ''
            ipa_href = dpage.locator('#app-dl-ios-ipa').get_attribute('href') or ''
            exe_href = dpage.locator('#app-dl-win-exe').get_attribute('href') or ''
            assert apk_href.endswith('/releases/latest/download/ChanhPhap-Android.apk'), apk_href
            assert ipa_href.endswith('/releases/latest/download/ChanhPhap-iOS-Unsigned.ipa'), ipa_href
            assert exe_href.endswith('/releases/latest/download/ChanhPhap-Windows-Setup_x64.exe'), exe_href
            dpage.locator('#app-dl-close').click()
            assert not dpage.evaluate("document.getElementById('dharma-app-download-dialog').open")

            dpage.evaluate(
                """() => {
                    document.documentElement.classList.add('cp-native-app');
                    window.TouchUX.syncAppDownloadVisibility();
                }"""
            )
            assert not dpage.locator('#dharma-download-toggle').is_visible()
            assert not dpage.locator('#home-download-app-btn').is_visible()
            assert dpage.evaluate('window.TouchUX.openAppDownloadDialog()') is False
            checks.append('Desktop 1680x950 sanctuary + Smart App Download Dialog (Web-only, Native-hidden) verified')
            desk_ctx.close()

            browser.close()

        outcome = {'result': 'passed', 'checks': checks}
        dest = REPORTS / 'mobile'
        dest.mkdir(parents=True, exist_ok=True)
        (dest / 'touch_ux_verification.json').write_text(
            json.dumps(outcome, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )
        print(json.dumps(outcome, ensure_ascii=False, indent=2), flush=True)
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join()


if __name__ == '__main__':
    main()
