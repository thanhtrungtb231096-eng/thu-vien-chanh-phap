(function () {
  'use strict';
  const prefix = 'cp3:';
  const read = (key, fallback) => { try {
    const x = JSON.parse(localStorage.getItem(prefix + key));
    if (x == null) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(x)) return fallback;
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) && (typeof x !== 'object' || Array.isArray(x))) return fallback;
    return x;
  } catch { return fallback; } };
  let warned = false;
  const write = (key, value) => {
    try { const before = localStorage.getItem(prefix + key); const after = JSON.stringify(value); localStorage.setItem(prefix + key, after); if (before !== after) window.dispatchEvent(new CustomEvent('library-store-change', {detail:{key:prefix+key,before,after}})); return true; }
    catch { if (!warned) { warned = true; window.dispatchEvent(new CustomEvent('library-storage-error')); } return false; }
  };
  function download(name, value, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([type === 'application/json' ? JSON.stringify(value, null, 2) : value], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function backup() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (/^(cp3:|dhamma_|reader_)/.test(key)) data[key] = localStorage.getItem(key);
    }
    download('chanh-phap-sao-luu.json', { format: 'chanh-phap', version: 3, exportedAt: new Date().toISOString(), data });
  }
  function restore(raw) {
    const input = JSON.parse(raw);
    if (input.format !== 'chanh-phap' || input.version !== 3 || !input.data || typeof input.data !== 'object' || Array.isArray(input.data)) throw new Error('Tệp sao lưu không đúng định dạng.');
    const items = Object.entries(input.data);
    for (const [k, v] of items) {
      if (!/^(cp3:|dhamma_|reader_)/.test(k) || typeof v !== 'string') throw new Error('Dữ liệu sao lưu không hợp lệ.');
      if (k.startsWith(prefix)) JSON.parse(v);
    }
    const previous = items.map(([k]) => [k, localStorage.getItem(k)]);
    try {
      for (const [k, v] of items) {
        // Merge dictionaries and records so importing does not discard newer local notes.
        let value = v;
        try {
          const a = JSON.parse(v), b = JSON.parse(localStorage.getItem(k) || 'null');
          if (Array.isArray(a) && Array.isArray(b)) {
            const merged = new Map();
            [...a, ...b].forEach(x => {
              const id = x.id || JSON.stringify(x), old = merged.get(id);
              if (k !== prefix + 'listening-history' || !old || (Number(x.lastPlayedAt) || 0) >= (Number(old.lastPlayedAt) || 0)) merged.set(id, x);
            });
            value = JSON.stringify([...merged.values()]);
          } else if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) value = JSON.stringify({ ...a, ...b });
        } catch { /* legacy plain string preference */ }
        localStorage.setItem(k, value);
      }
    } catch (error) {
      for (const [k, v] of previous) { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); }
      throw error;
    }
    window.dispatchEvent(new Event('library-restored'));
  }
  window.LibraryStore = { read, write, download, backup, restore };
})();
