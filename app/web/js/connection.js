/* Explain unsupported entry points before the user encounters fetch failures. */
(function () {
  'use strict';
  const serviceURL = 'http://127.0.0.1:8090/web-thuvien/index.html';
  function url() {
    const reader = window.Reader?.state;
    const hash = reader?.item ? '#read/' + encodeURIComponent(reader.key) + '/' + reader.mode + (reader.block ? '/' + reader.block : '') : location.hash;
    return serviceURL + hash;
  }
  function recoveryLink() {
    const link = document.createElement('a');
    link.className = 'r-primary';
    link.href = url();
    link.textContent = '🚀 Mở Thư Viện Chuẩn (127.0.0.1:8090)';
    link.style.display = 'inline-flex';
    link.style.alignItems = 'center';
    link.style.padding = '8px 16px';
    link.style.fontWeight = 'bold';
    return link;
  }
  function show(message) {
    let banner = document.getElementById('connection-notice');
    if (!banner) {
      banner = document.createElement('section');
      banner.id = 'connection-notice';
      banner.className = 'connection-notice';
      banner.setAttribute('role', 'status');
      document.querySelector('main').prepend(banner);
    }
    banner.replaceChildren();
    const text = document.createElement('p');
    text.innerHTML = `<strong>⚠️ Thông báo quan trọng:</strong> ${message}`;
    const hint = document.createElement('p');
    hint.innerHTML = `👉 <strong>Cách mở nhanh nhất:</strong> Nhấp đúp <code>MO_THU_VIEN.cmd</code> trong thư mục gốc để mở máy chủ và trình duyệt.`;
    const actions = document.createElement('div');
    actions.style.marginTop = '12px';
    const backup = document.createElement('button');
    backup.className = 'r-button';
    backup.textContent = 'Xuất ghi chú sao lưu';
    backup.onclick = () => window.LibraryStore.backup();
    actions.append(recoveryLink(), backup);
    banner.append(text, hint, actions);
  }
  async function init() {
    if (location.protocol === 'file:') {
      try {
        // Attempt quick probe to local server on port 8090
        await fetch('http://127.0.0.1:8090/api/voices', { mode: 'no-cors', signal: AbortSignal.timeout(600) });
        // Server is active! Seamlessly redirect to the standard URL!
        location.replace(url());
        return;
      } catch {
        // Server not reachable yet
      }
      show('Bạn đang mở trực tiếp tệp HTML qua chế độ <code>file:///</code>. Trình duyệt sẽ chặn tải các bài kinh văn và giọng đọc AI do giới hạn bảo mật tệp cục bộ.');
    }
  }
  window.LibraryConnection = { url, recoveryLink, show, init };
})();
