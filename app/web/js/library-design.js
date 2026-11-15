/* Shared, source-aware book jackets and presentation across every collection. */
(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const modules = {
    daithua: ['KINH ĐIỂN ĐẠI THỪA', 'Kho kinh Đại Thừa', 'Khám phá 62 bộ kinh với bản Việt, Hán văn và khảo chứng để đọc, nghe và đối chiếu.', '62 bộ kinh', 'lotus', 0],
    daitanghan: ['ĐẠI CHÁNH TÂN TU ĐẠI TẠNG KINH', 'Đại Tạng Kinh Hán', 'Tra cứu 25 bộ Taishō theo tên kinh, mã số và bản dịch hiện có.', '25 bộ Taishō', 'wheel', 1],
    appendix: ['NGHIÊN CỨU & ĐỐI CHIẾU', 'Cầu nối kinh điển', 'Đối chiếu A-Hàm và Nikāya, khám phá hệ thống pháp học và các phụ lục nghiên cứu.', 'Phụ lục', 'book', 2],
    roadmap: ['THỰC HÀNH TỪNG NGÀY', 'Lộ trình pháp hành', 'Từng bước nuôi dưỡng giới, định và tuệ trong đời sống.', 'Pháp hành', 'lotus', 0],
    milinda: ['VẤN ĐÁP PHẬT HỌC', 'Mi Tiên vấn đáp', 'Những cuộc đàm đạo giữa Đại đức Na-tiên và vua Mi-lan-đà về giáo pháp và tâm thức.', '244 cuộc đàm đạo', 'wheel', 3],
    practical: ['GIÁO PHÁP & ĐỜI SỐNG', 'Phật pháp đời thường', 'Tìm lời giải cho những câu hỏi về chánh niệm, nghiệp và đời sống cư sĩ.', '218 vấn đáp', 'lotus', 4],
    glossary: ['HIỂU THÊM LỜI KINH', 'Từ điển Pāḷi · Hán · Việt', 'Tra cứu thuật ngữ, định nghĩa và gợi ý ứng dụng trong thực hành.', 'Từ điển Phật học', 'book', 2],
    timer: ['AN TRÚ TRONG HIỆN TẠI', 'Tọa thiền & chuông chánh niệm', 'Dành một khoảng lặng để trở về hơi thở và chăm sóc thân tâm.', 'Không gian thiền', 'lotus', 0],
    notes: ['SUY NGẪM BÊN TRANG KINH', 'Sổ tay tu học', 'Gìn giữ những điều tâm đắc, ghi chú và suy ngẫm trên hành trình học Phật.', 'Ghi chép cá nhân', 'book', 1]
  };
  function resolve(ref) {
    if (ref?.data) return ref;
    const data = ref?.type === 'ebooks' ? DAI_TANG_KINH_DATA.find(x => x.id === ref.id) : ref?.type === 'phucminh' ? PHUC_MINH_DATA.find(x => x.id === ref.id) : ref?.type === 'daithua' ? DAI_THUA_DATA.find(x => x.id === ref.id) : DAI_TANG_HAN_DATA.texts.find(x => x.id === ref?.id);
    return data ? { type: ref.type, data } : null;
  }
  function credits(ref) {
    const item = resolve(ref);
    return item ? (['phucminh', 'ebooks'].includes(item.type) ? item.data.credits || [] : window.EDITION_CREDITS?.[item.type + ':' + item.data.id] || []).filter(c => c.cover) : [];
  }
  function creditLine(ref) { return credits(ref).map(c => c.role + ': ' + c.name).join(' · '); }
  function jacket(ref, options = {}) {
    const item = resolve(ref), data = item?.data || {};
    const title = options.title || data.vietTitle || data.title || 'Thư viện Chánh Pháp';
    const collection = options.collection || (item?.type === 'ebooks' ? 'ĐẠI TẠNG KINH' : item?.type === 'phucminh' ? 'CHÙA PHÚC MINH' : item?.type === 'daithua' ? 'KINH ĐIỂN ĐẠI THỪA' : 'ĐẠI TẠNG KINH HÁN');
    const code = options.code || data.taishoId || (item?.type === 'daitang' ? data.id : data.category || 'VĂN · TƯ · TU');
    const group = String(data.categoryCode || data.division || data.category || title);
    const selectedTones = { T08n0251: 0, T12n0366: 1, T14n0450: 2, T09n0262: 3 };
    const collectionTone = item?.type === 'phucminh' ? [...new Set(PHUC_MINH_DATA.map(b => b.category))].indexOf(data.category) % 5 : [...group].reduce((n, c) => n + c.codePointAt(0), 0) % 5;
    const tone = options.tone ?? selectedTones[code] ?? collectionTone;
    const names = credits(item).slice(0, 2);
    return `<div class="edition-cover edition-tone-${tone}${title.length > 110 ? ' edition-lengthy' : ''}${names.length > 1 ? ' edition-multiple-credits' : ''}${options.mini ? ' edition-mini' : ''}${options.className ? ' ' + esc(options.className) : ''}" aria-hidden="true">
      <div class="edition-imprint"><span>${esc(collection)}</span><i></i></div>
      <div class="edition-seal">${LibraryArt.svg(options.symbol || 'lotus')}<span>${esc(code)}</span></div>
      <div class="edition-title-area${title.length > 110 ? ' edition-long-title' : ''}"><strong class="edition-title">${esc(title)}</strong>${title.length > 110 ? '<span class="edition-thumbnail-label">TAISHŌ<br><b>' + esc(code) + '</b></span>' : ''}</div>
      <div class="edition-credits">${names.length ? names.map(c => `<div class="edition-credit"><small>${esc(c.role)}</small><b>${esc(c.name)}</b></div>`).join('') : `<div class="edition-colophon">${LibraryArt.svg('wheel')}<span>${esc(options.colophon || (data.vietFile || data.files?.vietMd ? 'BẢN TIẾNG VIỆT' : item?.type === 'daitang' ? 'NGUYÊN TÁC HÁN VĂN' : 'TÀNG KINH CÁC'))}</span></div>`}</div>
      <div class="edition-footer"><span>CHÁNH PHÁP</span><i>·</i><span>VĂN TƯ TU</span></div>
    </div>`;
  }
  function fillCover(element, ref, options = {}) {
    if (!element) return;
    const template = document.createElement('template'); template.innerHTML = jacket(ref, options);
    const cover = template.content.firstElementChild;
    [...cover.classList].forEach(c => element.classList.add(c));
    element.innerHTML = cover.innerHTML;
    element.setAttribute('aria-hidden', element.getAttribute('role') === 'button' ? 'false' : 'true');
  }
  function decorateCatalog(card, ref) {
    if (card.querySelector('.catalog-jacket')) return;
    const item = resolve(ref); if (!item) return;
    const cover = document.createElement('button'); cover.className = 'catalog-jacket';
    cover.setAttribute('aria-label', 'Xem thông tin ' + (item.data.vietTitle || item.data.title));
    cover.innerHTML = jacket(item);
    cover.onclick = () => window.DharmaShell.openAlbum(item);
    card.prepend(cover); card.classList.add('edition-catalog-card');
    const info = card.querySelector('.taisho-title-container') || card.querySelector('.catalog-jacket + div');
    if (info && credits(item).length) {
      const byline = document.createElement('p'); byline.className = 'edition-byline'; byline.textContent = creditLine(item); info.append(byline);
    }
  }
  let frame = 0;
  const observer = new ResizeObserver(() => fit());
  function fit() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      document.querySelectorAll('.edition-cover:not(.edition-mini)').forEach(cover => {
        if (cover.getBoundingClientRect().width < 1) return;
        const title = cover.querySelector('.edition-title'), area = cover.querySelector('.edition-title-area');
        title.style.fontSize = '';
        let size = parseFloat(getComputedStyle(title).fontSize);
        const minimum = cover.clientWidth <= 125 ? 6 : 8;
        while ((title.scrollHeight > area.clientHeight + 1 || title.scrollWidth > area.clientWidth + 1) && size > minimum) {
          size -= .5; title.style.fontSize = size + 'px';
        }
        cover.querySelectorAll('.edition-credit b').forEach(name => {
          name.style.fontSize = '';
          let font = parseFloat(getComputedStyle(name).fontSize);
          const slot = name.parentElement;
          while ((slot.scrollHeight > slot.clientHeight + 1 || name.scrollWidth > name.clientWidth + 1) && font > 7) {
            font -= .5; name.style.fontSize = font + 'px';
          }
        });
      });
    });
  }
  const observed = new Set();
  function refresh() {
    for (const cover of observed) if (!cover.isConnected) { observer.unobserve(cover); observed.delete(cover); }
    document.querySelectorAll('.edition-cover').forEach(cover => { if (!observed.has(cover)) { observed.add(cover); observer.observe(cover); } });
    fit();
  }
  function init() {
    for (const [id, [eyebrow, title, description, label, symbol, tone]] of Object.entries(modules)) {
      const panel = document.getElementById('tab-' + id); if (!panel) continue;
      const heading = document.createElement('header'); heading.className = 'edition-module-heading';
      heading.innerHTML = `${jacket(null, { title, collection: 'THƯ VIỆN CHÁNH PHÁP', code: label, tone, symbol, mini: true })}<div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p>${description}</p></div><div class="edition-module-count"></div>`;
      if (['daithua', 'daitanghan', 'appendix', 'milinda', 'practical', 'glossary', 'notes'].includes(id)) {
        const old = panel.firstElementChild;
        if (old?.querySelector('h3')) {
          old.querySelectorAll(':scope > .hero-pill, :scope > button, :scope > a').forEach(b => heading.lastElementChild.append(b));
          old.remove();
        }
      }
      if (id === 'timer') { panel.querySelector('.timer-container > h3')?.remove(); panel.querySelector('.timer-container > p')?.remove(); }
      panel.prepend(heading);
    }
    const pmHero = document.querySelector('.pm-hero');
    pmHero.querySelector('.eyebrow').textContent = 'PHÁP HỌC · PHÁP HÀNH';
    pmHero.querySelector('h1').textContent = 'Tủ sách Chùa Phúc Minh';
    pmHero.querySelector('p').textContent = 'Kinh điển, thiền tập và thi kệ. Đọc sách, nghe pháp và lưu lại những điều tâm đắc.';
    document.querySelector('.featured-section').after(document.querySelector('.pm-home-entry'));
    document.querySelector('.pm-home-symbol').innerHTML = jacket(null, { title: 'Chùa Phúc Minh', collection: 'CHÙA PHÚC MINH', code: '26 TÀI LIỆU', tone: 0, mini: true });
    const codes = ['T08n0251', 'T12n0366', 'T14n0450', 'T09n0262'];
    document.querySelectorAll('.featured-book .book-cover').forEach((cover, i) => {
      const data = DAI_THUA_DATA.find(x => x.taishoId === codes[i] && x.files.vietMd) || DAI_TANG_HAN_DATA.texts.find(x => x.id === codes[i]);
      fillCover(cover, { type: data.files ? 'daithua' : 'daitang', data });
    });
    document.querySelectorAll('.collection-grid > button').forEach(button => {
      const id = button.dataset.collectionTab;
      const title = button.querySelector('h3')?.textContent || 'Chùa Phúc Minh';
      const meta = modules[id];
      const art = document.createElement('span'); art.className = 'collection-jacket';
      art.innerHTML = jacket(null, { title, collection: 'THƯ VIỆN CHÁNH PHÁP', code: 'VĂN · TƯ · TU', tone: meta?.[5] ?? 3, mini: true, symbol: meta?.[4] || 'lotus' });
      button.prepend(art);
    });
    document.querySelector('.dc-cover').innerHTML = jacket(null, { title: 'Bên trang kinh', collection: 'THƯ VIỆN CHÁNH PHÁP', tone: 0 });
    refresh(); document.fonts.ready.then(refresh);
  }
  window.LibraryDesign = { jacket, resolve, credits, creditLine, decorateCatalog, fillCover, fit, refresh, init };
})();
