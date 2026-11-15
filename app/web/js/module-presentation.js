/* Shared module introductions. Existing catalogue controls keep their identity. */
(() => {
  'use strict';
  const esc = value => PersistentPlayer.esc(value);
  const definitions = {
    'tang-han': ['HÁN TẠNG · TRUYỀN THỪA & KHẢO CHỨNG', 'Đại Tạng Kinh Hán tạng', 'Đi từ kinh, luật, luận đến từng bản đọc. Mã Taishō và hồ sơ nguồn giúp bạn đối chiếu lời kinh qua các ấn bản.', 'wheel', 'TÀNG'],
    'tang-dai-thua': ['ĐẠI THỪA · TỪ BI & TRÍ TUỆ', 'Đại Tạng Kinh Đại thừa', 'Khám phá các hệ kinh và luận giải Đại thừa. Đọc trong bối cảnh truyền thống, nuôi dưỡng lòng từ bi cùng sự hiểu biết.', 'lotus', 'BI'],
    'tang-nam-tong': ['NAM TÔNG · PHÁP HỌC & PHÁP HÀNH', 'Đại Tạng Kinh Nam tông', 'Tìm về Nikāya, luật, A-tỳ-đàm và chú giải. Nhận biết từng lớp văn bản để học và thực hành có căn cứ.', 'book', 'TUỆ'],
    phucminh: ['BÊN TRANG SÁCH CHÙA PHÚC MINH', 'Tủ sách Chùa Phúc Minh', 'Kinh điển, thiền tập và thi kệ. Một không gian đọc chậm, nghe sâu và gìn giữ những điều tâm đắc.', 'lotus', 'TỊNH'],
    daitang: ['TỆP SÁCH VIỆT NGỮ · BẢN ĐỌC & NGUỒN', 'Kho sách Phật giáo Việt ngữ', 'Kinh, luật, luận và sách giảng được giữ cùng hồ sơ nguồn. Chọn bản phù hợp để đọc, nghe và kiểm chứng.', 'book', 'VĂN'],
    daithua: ['TUYỂN TẬP · KINH ĐIỂN ĐẠI THỪA', 'Tuyển tập 62 bộ kinh', 'Những lối vào kinh điển với bản Việt, Hán và khảo chứng hiện có. Tìm từng tác phẩm và nhận biết bản dịch trước khi đọc.', 'lotus', 'PHÁP'],
    daitanghan: ['DANH MỤC NGUỒN · ĐẠI CHÁNH TÂN TU', 'Danh mục Hán tạng gốc', 'Tra cứu theo 25 bộ Taishō, tên kinh và mã số. Đối chiếu nguyên văn Hán với các bản Việt hiện có trong thư viện.', 'wheel', 'TẠNG'],
    paths: ['ĐỌC CHẬM · HIỂU SÂU · SỐNG LÀNH', 'Hiểu lời kinh. Thấm vào đời sống.', 'Những lời giải nghĩa có chiều sâu, câu chuyện mở lòng và cách ứng dụng gần gũi. Đi từ nguồn kinh đến gia đình, công việc và sự chăm sóc mỗi ngày.', 'lotus', 'HIỂU'],
    roadmap: ['GIỚI · ĐỊNH · TUỆ', 'Từ hiểu biết đến thực hành', 'Một bản đồ tu học từ nền tảng đạo đức đến sự tỉnh thức. Khám phá bài học chi tiết và chọn nhịp thực hành phù hợp.', 'lotus', 'HÀNH'],
    appendix: ['KHẢO CHỨNG · ĐỐI CHIẾU · TÌM HIỂU', 'Cầu nối kinh điển', 'Tìm hiểu A-Hàm và Nikāya, danh số pháp học và cách tổ chức tạng kinh. Đọc các truyền thống trong bối cảnh riêng của từng nguồn.', 'wheel', 'CHIẾU'],
    glossary: ['HIỂU TỪ · HIỂU NGHĨA · HIỂU PHÁP', 'Từ điển Pāḷi · Hán · Việt', 'Gỡ từng lớp nghĩa của thuật ngữ Phật học. Trở lại lời kinh với cách hiểu rõ ràng và có bối cảnh.', 'book', 'NGHĨA'],
    milinda: ['ĐỐI THOẠI · TƯ DUY · CHÁNH KIẾN', 'Mi Tiên vấn đáp', 'Theo dõi những cuộc đối thoại của Na-tiên và vua Mi-lan-đà. Đọc một tác phẩm vấn đáp trong lịch sử truyền thừa Phật giáo.', 'wheel', 'TƯ'],
    practical: ['GIÁO PHÁP TRONG ĐỜI SỐNG', 'Phật pháp đời thường', 'Từ trang kinh đến gia đình, công việc và những mối quan hệ. Suy ngẫm từng tình huống để sống có hiểu biết và lòng từ.', 'lotus', 'SỐNG'],
    timer: ['TRỞ VỀ HƠI THỞ · AN TRÚ HIỆN TẠI', 'Tọa thiền & chuông chánh niệm', 'Dành một khoảng lặng, chọn thời lượng vừa sức và trở về với thân tâm. Đều đặn từng ngày, nhẹ nhàng từng bước.', 'lotus', 'AN'],
    notes: ['GÌN GIỮ ĐIỀU TÂM ĐẮC', 'Sổ tay tu học', 'Ghi điều đã hiểu, điều còn băn khoăn và sự chuyển biến trong đời sống. Mỗi trang ghi chép là một dịp trở lại với chính mình.', 'book', 'NHỚ'],
    shelf: ['TỦ SÁCH CỦA BẠN', 'Những trang kinh đồng hành', 'Lưu bản kinh tâm đắc, trở lại trang đang đọc và sắp xếp danh sách tu học theo nhu cầu của bạn.', 'book', 'LƯU'],
    'listening-history': ['LẮNG NGHE · TIẾP NỐI · SUY NGẪM', 'Lịch sử nghe', 'Tiếp tục bản kinh đang nghe, trở lại lời pháp đã học và dành thêm thời gian cho điều bạn muốn hiểu sâu.', 'wheel', 'NGHE'],
    fulltext: ['TÌM TRONG LỜI KINH', 'Tra cứu kinh văn', 'Tìm một câu, một thuật ngữ hoặc một chủ đề trong các bản chữ. Mở đoạn tìm thấy để đọc trong mạch văn đầy đủ.', 'book', 'TÌM'],
    quality: ['XUẤT XỨ · BẢN DỊCH · HIỆU ĐÍNH', 'Nguồn & hiệu đính', 'Nhận biết hồ sơ ấn bản, tình trạng bản chữ và nguồn đối chiếu. Sự minh bạch giúp mỗi lần đọc thêm vững căn cứ.', 'wheel', 'NGUỒN'],
    offline: ['MANG THEO MỘT TRANG KINH', 'Đọc & nghe ngoại tuyến', 'Chuẩn bị bản chữ và âm thanh cho những lúc không có mạng. Chọn tài liệu cần dùng và quản lý dung lượng trên thiết bị.', 'book', 'MANG'],
    study: ['ĐỀU ĐẶN · VỪA SỨC · BỀN LÂU', 'Thời khóa của tôi', 'Chọn sách, đặt thời gian và theo dõi việc đọc nghe từng ngày. Giữ một nhịp tu học phù hợp với đời sống của bạn.', 'lotus', 'NHỊP'],
    settings: ['CHĂM SÓC KHÔNG GIAN TU HỌC', 'Thiết bị & giọng đọc', 'Điều chỉnh giọng đọc, quản lý thiết bị và dữ liệu tu học. Để trải nghiệm đọc nghe phù hợp hơn với bạn.', 'wheel', 'HÒA'],
    daily: ['MỘT THỜI KHÓA · MỘT KHOẢNG LẶNG', 'Khóa tụng hằng ngày', 'Sắp xếp các bản đọc và danh sách nghe cho thời khóa của bạn. Bắt đầu từ một bản kinh quen thuộc, thực hành với sự chú tâm.', 'lotus', 'TỤNG']
  };
  const actions = {
    paths: ['Chọn lộ trình', () => document.getElementById('curriculum-tracks')?.scrollIntoView({block:'start'})],
    roadmap: ['Mở bài học chi tiết →', () => LearningPath.navigate('nen-tang')],
    shelf: ['Khám phá tạng kinh →', () => ContentModules.go('tang-han')],
    notes: ['Đến lộ trình tu học →', () => LearningPath.navigate()],
    timer: ['Học về chánh niệm →', () => LearningPath.navigate('nen-tang', 'hoi-tho')],
    daily: ['Lập thời khóa →', () => LibraryUpgrades.navigate('study')]
  };
  const compact = {offline:'Kinh sách bên bạn, cả khi ngoại tuyến.',fulltext:'Tìm câu kinh, đọc lại trong văn cảnh.',quality:'Hiểu xuất xứ, nhận biết bản đọc.',study:'Giữ nhịp đọc và nghe mỗi ngày.',settings:'Giọng đọc, thiết bị và dữ liệu của bạn.'};
  function decorate(id, panel = document.getElementById('tab-' + id), options = {}) {
    const data = definitions[id];
    if (!panel || !data || panel.querySelector('.cp-module-hero')) return;
    const old = panel.querySelector(':scope > .edition-module-heading, :scope > .upgrade-hero, :scope > .pm-hero, :scope > .content-module-heading, :scope > .section-heading, :scope > .lh-heading, :scope > .playlist-hero');
    const hero = document.createElement('header');
    hero.className = 'cp-module-hero'; hero.dataset.module = id;
    hero.innerHTML = `<div class="cp-hero-copy"><span class="cp-hero-kicker">${esc(data[0])}</span><h1 tabindex="-1">${esc(options.title || data[1])}</h1><p>${esc(options.description || data[2])}</p><div class="cp-hero-meta"></div></div><div class="cp-hero-art" aria-hidden="true"><div class="cp-hero-halo">${LibraryArt.svg(data[3])}</div><span class="cp-hero-seal">${esc(data[4])}</span><span class="cp-hero-imprint">CHÁNH PHÁP / VĂN TƯ TU</span></div><div class="cp-hero-rule" aria-hidden="true"><span>THƯ VIỆN CHÁNH PHÁP</span><i></i><span>HỌC PHÁP · HIỂU NGUỒN · THỰC HÀNH</span></div>`;
    const meta = hero.querySelector('.cp-hero-meta');
    if (compact[id]) {const full=hero.querySelector('.cp-hero-copy > p');full.className='cp-hero-description';const short=document.createElement('p');short.className='cp-hero-mobile';short.textContent=compact[id];full.after(short);}
    if (old) {
      ['content-module-heading','edition-module-heading','pm-hero','ep-hero','lh-heading'].forEach(name => {if(old.classList.contains(name))hero.classList.add(name);});
      const headingId = old.querySelector('h1[id],h2[id]')?.id;
      if (headingId) hero.querySelector('h1').id = headingId;
      if (id === 'listening-history') {const summary=old.querySelector('#lh-summary');if(summary)meta.append(summary);}
      if (id === 'daily') {const play=old.querySelector('#daily-play');if(play)meta.append(play);}
      old.querySelectorAll('.edition-module-count > *, .content-total, .pm-hero-facts, :scope > button, :scope > a').forEach(node => meta.append(node));
      if (['phucminh','daitang'].includes(id)) old.querySelectorAll(':scope > div > a').forEach(node => meta.append(node));
      old.replaceWith(hero);
    } else panel.prepend(hero);
    if (actions[id]) {
      const [label, action] = actions[id], button = document.createElement('button');
      button.type = 'button'; button.className = 'cp-hero-action'; button.textContent = label; button.onclick = action; meta.append(button);
    }
    hero.querySelector('.cp-hero-copy').insertAdjacentHTML('afterbegin', '<span class="cp-hero-number" aria-hidden="true">' + String(Object.keys(definitions).indexOf(id) + 1).padStart(2, '0') + ' / TÀNG KINH CÁC</span>');
  }
  function init() {
    document.body.classList.add('cp-editorial');
    const brand = document.querySelector('.pali-sub'); if (brand) brand.textContent = 'TÀNG KINH · VĂN TƯ TU';
    const header = document.querySelector('.noble-header');
    const context = document.createElement('span'); context.className = 'cp-header-context'; context.id = 'cp-header-context'; header.append(context);
    Object.keys(definitions).forEach(id => decorate(id));
    const hero = document.querySelector('.sanctuary-hero'); hero?.classList.add('cp-home-hero');
    if (hero && !hero.querySelector('.cp-home-link')) {
      const link = document.createElement('button'); link.type = 'button'; link.className = 'cp-home-link'; link.textContent = 'Bắt đầu lộ trình tu học →'; link.onclick = () => LearningPath.navigate(); hero.querySelector('.hero-actions')?.append(link);
    }
    onTab(appState.currentTab);
  }
  function onTab(id) {
    decorate(id);
    const label = document.getElementById('cp-header-context'); if (label) label.textContent = definitions[id]?.[1] || (id === 'home' ? 'Không gian kinh điển & tu học' : 'Bên trang kinh');
  }
  window.ModulePresentation = {init, decorate, onTab, definitions};
})();
