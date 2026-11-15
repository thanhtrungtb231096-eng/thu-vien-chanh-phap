(() => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const node = (id, title, description = '', children = [], extra = {}) => ({ id, title, description, children, entries: [], count: 0, ...extra });
  const H = 'tang-han', M = 'tang-dai-thua', N = 'tang-nam-tong';
  const hanGroups = [
    ['01', 'a-ham', 'A-Hàm bộ', 'kinh'], ['02', 'ban-duyen', 'Bản Duyên bộ', 'kinh'],
    ['03', 'bat-nha', 'Bát Nhã bộ', 'kinh'], ['04', 'phap-hoa', 'Pháp Hoa bộ', 'kinh'],
    ['05', 'hoa-nghiem', 'Hoa Nghiêm bộ', 'kinh'], ['06', 'bao-tich', 'Bảo Tích bộ', 'kinh'],
    ['07', 'niet-ban', 'Niết Bàn bộ', 'kinh'], ['08', 'dai-tap', 'Đại Tập bộ', 'kinh'],
    ['09', 'kinh-tap', 'Kinh Tập bộ', 'kinh'], ['10', 'mat-giao', 'Mật Giáo bộ', 'kinh'],
    ['11', 'luat-bo', 'Luật bộ', 'luat'], ['12', 'thich-kinh', 'Thích Kinh Luận bộ', 'luan'],
    ['13', 'ty-dam', 'Tỳ Đàm bộ', 'luan'], ['14', 'trung-quan', 'Trung Quán bộ', 'luan'],
    ['15', 'du-gia', 'Du Già bộ', 'luan'], ['16', 'luan-tap', 'Luận Tập bộ', 'luan'],
    ['17', 'kinh-so', 'Kinh Sớ bộ', 'chu-so'], ['18', 'luat-so', 'Luật Sớ bộ', 'chu-so'],
    ['19', 'luan-so', 'Luận Sớ bộ', 'chu-so'], ['20', 'chu-tong', 'Chư Tông bộ', 'tong-phai'],
    ['21', 'su-truyen', 'Sử Truyện bộ', 'lich-su'], ['22', 'su-vi', 'Sự Vị bộ', 'tu-lieu'],
    ['23', 'ngoai-giao', 'Ngoại Giáo bộ', 'tu-lieu'], ['24', 'muc-luc', 'Mục Lục bộ', 'tu-lieu'],
    ['25', 'co-dat', 'Cổ Dật & Nghi Tợ bộ', 'tu-lieu']
  ];
  const mahaGroups = [
    ['bat-nha', 'Bát Nhã', 'Tâm Kinh, Kim Cang và các kinh Bát Nhã'],
    ['phap-hoa', 'Pháp Hoa', 'Pháp Hoa và các kinh liên quan'],
    ['hoa-nghiem', 'Hoa Nghiêm', 'Đại Phương Quảng Phật Hoa Nghiêm'],
    ['bao-tich', 'Bảo Tích', 'Đại Bảo Tích và các kinh cùng bộ'],
    ['niet-ban', 'Niết Bàn', 'Các kinh thuộc Niết Bàn bộ'],
    ['dai-tap', 'Đại Tập', 'Các kinh thuộc Đại Tập bộ'],
    ['tinh-do', 'Kinh Tịnh độ', 'A Di Đà, Vô Lượng Thọ, Quán Vô Lượng Thọ'],
    ['mat-giao', 'Mật giáo', 'Kinh, đà-la-ni và nghi quỹ trong Mật Giáo bộ'],
    ['kinh-khac', 'Các kinh khác', 'Duy Ma Cật, Lăng Già, Dược Sư và các kinh khác'],
    ['ban-duyen', 'Bản duyên & kinh liên quan', 'Các bản trong tuyển tập và liên kết Bản Duyên bộ'],
    ['a-ham-lien-quan', 'Kinh sơ kỳ liên quan', 'Bản trong tuyển tập có mã Taishō thuộc A-Hàm bộ']
  ];
  function ahamGroup(number) {
    if (number >= 1 && number <= 25) return 'truong-aham';
    if (number >= 26 && number <= 94) return 'trung-aham';
    if (number >= 99 && number <= 124) return 'tap-aham';
    if (number >= 125 && number <= 148) return 'tang-nhat';
    if (number >= 1505 && number <= 1508) return 'luan-giai';
    return 'kinh-khac';
  }
  function sharedTree() {
    return node('tu-lieu-chung', 'Tu học & tư liệu dùng chung', 'Tài liệu liên truyền thống hoặc chưa đủ thông tin để gán vào một tạng.', [
      node('nhap-mon', 'Nhập môn & giáo lý'), node('thien', 'Thiền & thực hành'),
      node('doi-chieu', 'Giảng giải & đối chiếu Pāli – A-Hàm'),
      node('giang-kinh', 'Giới thiệu & giảng kinh'), node('gioi-luat', 'Giới luật & đạo đức'),
      node('nghi-le', 'Kinh tụng & nghi lễ'), node('lich-su', 'Lịch sử & danh tăng'),
      node('doi-song', 'Phật học & đời sống'), node('van-hoc', 'Văn học & thi kệ'),
      node('tham-khao', 'Tài liệu tham khảo')
    ], { shared: true });
  }
  function definitions(divisions = []) {
    const categories = [
      ['kinh', 'Kinh tạng', 'A-Hàm, Bản Duyên và các bộ kinh Hán truyền'],
      ['luat', 'Luật tạng', 'Các bản luật Hán truyền'],
      ['luan', 'Luận tạng', 'Thích kinh luận, Tỳ Đàm, Trung Quán, Du Già và Luận Tập'],
      ['chu-so', 'Chú sớ', 'Kinh sớ, luật sớ và luận sớ'],
      ['tong-phai', 'Tông phái', 'Trước tác các tông phái trong Hán tạng'],
      ['lich-su', 'Lịch sử & truyện ký', 'Sử Truyện bộ'],
      ['tu-lieu', 'Tư liệu & mục lục', 'Sự vị, ngoại giáo, mục lục, cổ dật và nghi tợ']
    ].map(([id, title, description]) => node(id, title, description, hanGroups.filter(g => g[3] === id).map(([code, slug, name]) => {
      const d = divisions.find(x => x.code === code);
      const children = code === '01' ? [
        node('truong-aham', 'Trường A-Hàm'), node('trung-aham', 'Trung A-Hàm'),
        node('tap-aham', 'Tạp A-Hàm'), node('tang-nhat', 'Tăng Nhất A-Hàm'),
        node('kinh-khac', 'Kinh liên quan khác'), node('luan-giai', 'Luận giải A-Hàm')
      ] : [];
      return node(slug, d?.name || name, (d?.hanName || '') + ' · Bộ ' + code, children, { division: code });
    })));
    const han = node(H, 'Đại Tạng Kinh Hán tạng', 'Tra cứu theo 25 bộ gốc; giữ mã Taishō, Hán văn và các bản Việt.', categories);
    const maha = node(M, 'Đại Tạng Kinh Đại thừa', 'Kinh, luật, luận và tu học; liên kết các bản tương ứng trong Hán tạng.', [
      node('kinh', 'Kinh tạng', 'Chọn nhóm bộ để xem các tác phẩm và bản dịch', mahaGroups.map(args => node(...args))),
      node('luat', 'Luật & giới Bồ-tát', 'Giới Bồ-tát và tài liệu luật Hán truyền', [
        node('bo-tat-gioi', 'Giới Bồ-tát'), node('luat-han-truyen', 'Luật Hán truyền', 'Bản luật và liên kết Luật bộ; giữ rõ bộ phái nguồn'),
        node('hoc-gioi', 'Giảng giải & học giới')
      ]),
      node('luan', 'Luận tạng', 'Luận Đại thừa và tài liệu nghiên cứu', [
        node('thich-kinh', 'Luận giải thích kinh'), node('trung-quan', 'Trung Quán'),
        node('du-gia', 'Du Già / Duy thức'), node('luan-khac', 'Các luận khác')
      ]),
      node('chu-giai', 'Giảng giải & chú sớ', 'Tìm sách giảng theo cùng nhóm bộ của bản kinh', [
        ...mahaGroups.filter(g => !['ban-duyen', 'a-ham-lien-quan'].includes(g[0])).map(args => node(...args)),
        node('chu-so-han', 'Chú sớ Hán truyền', 'Liên kết các bộ chú sớ trong Hán tạng')
      ]),
      node('tu-hoc', 'Tông phái & tu học', 'Các tài liệu tu học có nhóm nguồn xác định', [
        node('thien', 'Thiền tông'), node('tinh-do', 'Tịnh độ'), node('duy-thuc', 'Học Duy thức'),
        node('mat-tong', 'Học Mật tông'), node('tong-phai', 'Tông phái Hán truyền'), node('dai-thua', 'Giáo lý Đại thừa')
      ])
    ]);
    const nam = node(N, 'Đại Tạng Kinh Nam tông', 'Kinh Pāli / Nikāya, luật, A-tỳ-đàm và tài liệu Nam tông hiện có.', [
      node('kinh', 'Kinh tạng · Nikāya', 'Năm bộ Nikāya và các bản kinh lẻ', [
        node('truong-bo', 'Trường Bộ', 'Dīgha Nikāya · DN'), node('trung-bo', 'Trung Bộ', 'Majjhima Nikāya · MN'),
        node('tuong-ung', 'Tương Ưng Bộ', 'Saṃyutta Nikāya · SN'), node('tang-chi', 'Tăng Chi Bộ', 'Aṅguttara Nikāya · AN'),
        node('tieu-bo', 'Tiểu Bộ', 'Khuddaka Nikāya · KN'), node('kinh-le', 'Kinh lẻ & bản trích', 'Các bản chưa xác định đủ bộ / số kinh')
      ]),
      node('luat', 'Luật tạng', 'Phân tích giới, Tiểu phẩm, luật nghi và học giới', [
        node('ban-luat', 'Bản luật & giới bổn'), node('hoc-gioi', 'Chú giải & học giới')
      ]),
      node('a-ty-dam', 'A-tỳ-đàm / Vi diệu pháp', 'Các tài liệu A-tỳ-đàm hiện có; bản luận và sách học được phân biệt', [
        node('ban-luan', 'Bản A-tỳ-đàm'), node('hoc-luan', 'Sách học & tổng hợp')
      ]),
      node('chu-giai', 'Chú giải & nghiên cứu', 'Pháp Cú, Thanh Tịnh Đạo, Mi Tiên và các tài liệu liên quan', [
        node('phap-cu', 'Chú giải Pháp Cú'), node('thanh-tinh-dao', 'Thanh Tịnh Đạo'),
        node('mi-tien', 'Mi Tiên / Milinda'), node('nghien-cuu', 'Nghiên cứu & giảng giải')
      ]),
      node('tu-hoc', 'Tu học Nam tông', 'Nhóm Thiền nguyên thủy và tài liệu có nguồn Nam tông rõ ràng', [node('thien', 'Thiền nguyên thủy')])
    ]);
    return { modules: [han, maha, nam], shared: sharedTree() };
  }
  const taishoNumber = data => Number((String(data.taishoId || data.id).match(/n(\d+)/) || [])[1] || 0);
  function hanPath(data) {
    const g = hanGroups.find(g => g[0] === String(data.division).padStart(2, '0'));
    if (!g) throw new Error('Unknown Hán division: ' + data.division);
    return [H, g[3], g[1], ...(g[0] === '01' ? [ahamGroup(taishoNumber(data))] : [])];
  }
  function mahaGroup(title, division) {
    const t = normalize(title);
    // Prefer the source division for tantra, rather than a generic word such as "Kim Cang".
    if (division === '10') return 'mat-giao';
    if (/a di da|vo luong tho|無量壽|阿彌陀/.test(t)) return 'tinh-do';
    if (/bat nha|ba la mat|kim cang|般若/.test(t) || division === '03') return 'bat-nha';
    if (/phap hoa|pho mon|法華/.test(t) || division === '04') return 'phap-hoa';
    if (/hoa nghiem|華嚴/.test(t) || division === '05') return 'hoa-nghiem';
    if (/bao tich|寶積/.test(t) || division === '06') return 'bao-tich';
    if (/niet ban|涅槃/.test(t) || division === '07') return 'niet-ban';
    if (/dai tap|大集/.test(t) || division === '08') return 'dai-tap';
    if (division === '02') return 'ban-duyen';
    if (division === '01') return 'a-ham-lien-quan';
    return 'kinh-khac';
  }
  function classifyHan(data) {
    const d = String(data.division).padStart(2, '0');
    const kind = d === '11' ? 'luat' : ['12', '13', '14', '15', '16'].includes(d) || (d === '01' && taishoNumber(data) >= 1505) ? 'luan' : ['17', '18', '19'].includes(d) ? 'chu-giai' : Number(d) >= 20 ? 'tu-lieu' : d === '10' ? 'mat-giao' : 'kinh';
    return { path: hanPath(data), kind };
  }
  function paliGroup(title) {
    const t = normalize(title);
    if (/truong bo/.test(t)) return 'truong-bo';
    if (/trung bo/.test(t)) return 'trung-bo';
    if (/tuong ung/.test(t)) return 'tuong-ung';
    if (/tang chi/.test(t)) return 'tang-chi';
    if (/tieu bo|phap cu|dhammapada/.test(t)) return 'tieu-bo';
    return 'kinh-le';
  }
  function classifyBook(data) {
    const sub = normalize(data.subcategory), cat = normalize(data.category);
    const title = normalize([data.title, data.filename].join(' ')).replace(/-/g, ' ');
    const result = (path, kind) => ({ path, kind });
    if (sub === 'kinh pali / nam tong') {
      if (/tich truyen|tim hieu/.test(title)) return result([N, 'chu-giai', 'phap-cu'], 'chu-giai');
      if (/na tien|milinda/.test(title)) return result([N, 'chu-giai', 'mi-tien'], 'van-dap');
      return result([N, 'kinh', paliGroup(title)], 'kinh');
    }
    if (sub === 'luan & a ty dam' || sub === 'luan & a-ty-dam') {
      // These source folders also contain Sarvāstivāda studies: do not label them Pāli Abhidhamma.
      if (/huu bo|cau xa|huyen trang/.test(title)) return result([H, 'luan', 'ty-dam'], 'nghien-cuu');
      if (/thanh tinh dao/.test(title)) return result([N, 'chu-giai', 'thanh-tinh-dao'], 'chu-giai');
      if (/nguyen thuy phat giao.*tu tuong/.test(title)) return result([N, 'chu-giai', 'nghien-cuu'], 'nghien-cuu');
      return result([N, 'a-ty-dam', 'hoc-luan'], 'hoc-luan');
    }
    if (sub === 'gioi luat') {
      if (/phan tich gioi ty khuu|tieu pham/.test(title)) return result([N, 'luat', 'ban-luat'], 'luat');
      if (/nam tong|theravada|phat giao nguyen thuy/.test(title)) return result([N, 'luat', 'hoc-gioi'], 'giang');
      if (/bo tat gioi|pham vong/.test(title)) return result([M, 'luat', 'bo-tat-gioi'], 'giang');
      if (/ty nai da|tu phan luat|luat ma ha tang ky/.test(title)) return result([H, 'luat', 'luat-bo'], 'luat');
      return result(['tu-lieu-chung', 'gioi-luat'], 'giang');
    }
    if (sub === 'luan bac tong' || sub === 'luan') {
      const g = cat === 'duy thuc' || /duy thuc|du gia/.test(title) ? 'du-gia' : /trung quan|trung luan/.test(title) ? 'trung-quan' : 'luan-khac';
      return result([M, 'luan', g], 'luan');
    }
    if (sub === 'kinh bac tong' || cat === 'giang kinh') {
      if (/phap bao dan/.test(title + ' ' + sub)) return result([M, 'tu-hoc', 'thien'], 'giang');
      if (sub === 'pali & a-ham') return result(['tu-lieu-chung', 'doi-chieu'], 'giang');
      if (cat === 'giang kinh' && ['cac kinh khac', 'gioi thieu kinh dien'].includes(sub)) return result(['tu-lieu-chung', 'giang-kinh'], 'giang');
      if (sub === 'kinh pham vong') return result([M, 'luat', 'hoc-gioi'], 'giang');
      return result([M, cat === 'giang kinh' ? 'chu-giai' : 'kinh', mahaGroup(cat === 'giang kinh' ? sub : title)], cat === 'giang kinh' ? 'giang' : 'kinh');
    }
    if (sub === 'thien nguyen thuy') return result([N, 'tu-hoc', 'thien'], 'tu-hoc');
    if (cat === 'tinh do') return result([M, 'tu-hoc', 'tinh-do'], 'tu-hoc');
    if (cat === 'duy thuc') return result([M, 'tu-hoc', 'duy-thuc'], 'tu-hoc');
    if (cat === 'mat tong') return result([M, 'tu-hoc', 'mat-tong'], 'tu-hoc');
    if (sub === 'dai thua' || sub === 'bo-tat') return result([M, 'tu-hoc', 'dai-thua'], 'tu-hoc');
    if (cat === 'buoc dau hoc phat') return result(['tu-lieu-chung', 'nhap-mon'], 'tu-hoc');
    if (cat === 'thien') return result(['tu-lieu-chung', 'thien'], 'tu-hoc');
    if (cat === 'kinh tung & sam van' || sub === 'nghi thuc' || sub === 'ho niem') return result(['tu-lieu-chung', 'nghi-le'], 'nghi-le');
    if (sub === 'lich su phat giao' || sub === 'danh tang') return result(['tu-lieu-chung', 'lich-su'], 'tu-lieu');
    if (cat === 'sach phat hoc & van hoc') return result(['tu-lieu-chung', 'van-hoc'], 'tu-hoc');
    if (cat === 'sach suc khoe') return result(['tu-lieu-chung', 'tham-khao'], 'tai-lieu');
    return result(['tu-lieu-chung', 'doi-song'], 'tu-hoc');
  }
  function build(sources) {
    const { modules, shared } = definitions(sources.divisions), entries = [], byKey = new Map(), byPath = new Map(), placements = new Map(), works = new Map();
    const index = (nodes, parent = []) => nodes.forEach(n => { n.path = [...parent, n.id]; byPath.set(n.path.join('/'), n); index(n.children, n.path); });
    const separate = node('phucminh', 'Chùa Phúc Minh', 'Giữ nguyên tủ sách và phân loại hiện có');
    index([...modules, shared, separate]);
    const hanById = new Map(sources.han.map(d => [d.id, d]));
    function place(entry, path) {
      const target = byPath.get(path.join('/')); if (!target) throw new Error('Unknown tree path: ' + path.join('/'));
      if (!target.entries.some(e => e.key === entry.key)) target.entries.push(entry);
      const paths = placements.get(entry.key) || []; if (!paths.some(p => p.join('/') === path.join('/'))) paths.push(path); placements.set(entry.key, paths);
    }
    function add(type, data, classification, sourceLabel, sourceGroup) {
      const key = type + ':' + data.id;
      if (byKey.has(key)) throw new Error('Duplicate edition: ' + key);
      const code = type === 'daitang' ? data.id : data.taishoId || '';
      const entry = { type, id: data.id, key, data, title: data.vietTitle || data.title, sourceLabel, sourceGroup: sourceGroup || '', workKey: code ? 'taisho:' + code : key, ...classification };
      byKey.set(key, entry); entries.push(entry); place(entry, entry.path);
      const editions = works.get(entry.workKey) || []; editions.push(entry); works.set(entry.workKey, editions);
      return entry;
    }
    sources.han.forEach(d => add('daitang', d, classifyHan(d), 'Đại Tạng Kinh Hán', sources.divisions.find(g => g.code === d.division)?.name));
    sources.mahayana.forEach(d => {
      const original = hanById.get(d.taishoId), div = original?.division;
      const classification = div === '11' ? { path: [M, 'luat', 'bo-tat-gioi'], kind: 'luat' } : { path: [M, 'kinh', mahaGroup(d.title, div)], kind: div === '10' ? 'mat-giao' : 'kinh' };
      const entry = add('daithua', d, classification, 'Tuyển tập 62 bộ', d.categoryName);
      if (original) place(entry, hanPath(original));
    });
    sources.ebooks.forEach(d => add('ebooks', d, classifyBook(d), 'Kho sách Việt ngữ · Ebooks', [d.category, d.subcategory].filter(Boolean).join(' · ')));
    sources.phucminh.forEach(d => add('phucminh', d, { path: ['phucminh'], kind: 'tai-lieu' }, 'Chùa Phúc Minh', d.category));
    // Related views point to the same edition; they never duplicate content or listening/reading state.
    entries.filter(e => e.type === 'daitang').forEach(entry => {
      const d = entry.data.division;
      if (Number(d) >= 3 && Number(d) <= 10) place(entry, [M, 'kinh', mahaGroup(entry.title, d)]);
      if (d === '11') place(entry, [M, 'luat', 'luat-han-truyen']);
      const luan = { '12': 'thich-kinh', '14': 'trung-quan', '15': 'du-gia', '16': 'luan-khac' };
      if (luan[d]) place(entry, [M, 'luan', luan[d]]);
      if (['17', '18', '19'].includes(d)) place(entry, [M, 'chu-giai', 'chu-so-han']);
      if (d === '20') place(entry, [M, 'tu-hoc', 'tong-phai']);
    });
    const collect = n => {
      const unique = new Map([...n.entries, ...n.children.flatMap(collect)].map(e => [e.key, e]));
      n.all = [...unique.values()]; n.count = n.all.length; n.workCount = new Set(n.all.map(e => e.workKey)).size; return n.all;
    };
    collect(shared); collect(separate);
    // Shared books are reachable as a labelled branch in all three trees, without a fourth canon.
    function copyShared(original) {
      return node(original.id, original.title, original.description, original.children.map(copyShared), { shared: true, entries: original.entries });
    }
    modules.forEach(m => { const copy = copyShared(shared); m.children.push(copy); index([copy], [m.id]); });
    entries.filter(e => e.path[0] === 'tu-lieu-chung').forEach(entry => modules.forEach(m => {
      const paths = placements.get(entry.key); paths.push([m.id, ...entry.path]);
    }));
    modules.forEach(m => {
      collect(m);
      m.ownCount = entries.filter(e => e.path[0] === m.id).length;
      m.sharedCount = shared.count;
      m.linkedCount = m.count - m.ownCount - m.sharedCount;
    });
    const related = new Map();
    function link(a, b, labelA, labelB) {
      if (!byPath.has(a) || !byPath.has(b)) return;
      related.set(a, [...(related.get(a) || []), { path: b.split('/'), label: labelA }]);
      related.set(b, [...(related.get(b) || []), { path: a.split('/'), label: labelB }]);
    }
    [['truong-aham', 'truong-bo'], ['trung-aham', 'trung-bo'], ['tap-aham', 'tuong-ung'], ['tang-nhat', 'tang-chi']].forEach(([a, n]) => link(H + '/kinh/a-ham/' + a, N + '/kinh/' + n, 'Tra cứu nhóm Nikāya tương ứng', 'Tra cứu nhóm A-Hàm tương ứng'));
    hanGroups.filter(g => Number(g[0]) >= 3 && Number(g[0]) <= 10).forEach(g => link(H + '/kinh/' + g[1], M + '/kinh/' + (g[1] === 'kinh-tap' ? 'kinh-khac' : g[1]), 'Tác phẩm & bản dịch trong cây Đại thừa', 'Về bộ gốc trong Hán tạng'));
    mahaGroups.filter(g => byPath.has(M + '/chu-giai/' + g[0])).forEach(g => link(M + '/kinh/' + g[0], M + '/chu-giai/' + g[0], 'Giảng giải & nghiên cứu nhóm này', 'Bản kinh thuộc nhóm này'));
    link(N + '/luat', H + '/luat', 'Tra cứu luật Hán truyền', 'Tra cứu luật Nam tông');
    link(N + '/a-ty-dam', H + '/luan/ty-dam', 'Nghiên cứu Tỳ-đàm Hán truyền', 'Tài liệu A-tỳ-đàm Nam tông');
    return { modules, shared, separate, entries, byKey, byPath, placements, works, related };
  }
  window.ContentTaxonomy = { build, normalize, definitions, ahamGroup, classifyHan, classifyBook, hanGroups };
})();
