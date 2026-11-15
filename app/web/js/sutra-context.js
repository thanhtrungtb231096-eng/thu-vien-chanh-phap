/**
 * SutraContext — Ngữ Cảnh Kinh Điển (Scholarly Context Layer)
 * Cung cấp bối cảnh lịch sử, dịch giả, chủ đề và kinh liên quan
 * cho trải nghiệm đọc kinh chuyên sâu.
 *
 * Dựa trên lịch sử phát triển kinh điển Phật giáo:
 * Truyền khẩu → Kết tập → Chữ viết → Bản khắc → In ấn → Số hóa → Thư viện số
 */
const SutraContext = (() => {
  'use strict';

  // ── Ngữ cảnh cho các kinh quan trọng ──
  // Key format: taishoId hoặc dai-thua id
  const DATA = {
    'T08n0251': {
      translator: 'Huyền Trang (玄奘), dịch năm 649 SCN tại Trường An',
      period: 'Bát-nhã thời (般若時) — khoảng 22 năm thuyết pháp về Không tính',
      themes: ['Tánh Không (Śūnyatā)', 'Ngũ Uẩn Giai Không', 'Bất sinh bất diệt', 'Bát-nhã Ba-la-mật-đa'],
      audience: 'Tôn giả Xá-lợi-phất (Śāriputra) và 1.250 vị Tỳ-kheo',
      related: ['T05n0220', 'T08n0235', 'T08n0223'],
      relatedNames: ['Đại Bát Nhã', 'Kim Cang', 'Ma-ha Bát-nhã'],
      paliEquiv: 'Không có tương đương trực tiếp trong Nikāya',
      significance: 'Bản kinh ngắn nhất nhưng chứa đựng tinh yếu toàn bộ hệ thống Bát-nhã. Được tụng đọc phổ biến nhất trong Phật giáo Đông Á.',
      difficulty: 1,
      readingMinutes: 5
    },
    'T12n0366': {
      translator: 'Cưu-ma-la-thập (鳩摩羅什, Kumārajīva), dịch năm 402 SCN tại Trường An',
      period: 'Phương đẳng thời (方等時) — kinh điển Tịnh Độ',
      themes: ['Tịnh Độ', 'Niệm Phật', 'A Di Đà Phật', 'Cực Lạc thế giới', 'Nguyện lực'],
      audience: 'Trưởng lão Xá-lợi-phất và đại chúng tại vườn Kỳ Đà, thành Xá-vệ',
      related: ['T12n0365', 'T12n0360'],
      relatedNames: ['Quán Vô Lượng Thọ', 'Vô Lượng Thọ'],
      paliEquiv: 'Không có tương đương trong Nikāya',
      significance: 'Một trong "Tịnh Độ Tam Kinh" — nền tảng của pháp môn Niệm Phật, phổ biến nhất tại Việt Nam.',
      difficulty: 1,
      readingMinutes: 15
    },
    'T14n0450': {
      translator: 'Huyền Trang (玄奘), dịch năm 650 SCN',
      period: 'Kinh tạng — Mật giáo sơ kỳ',
      themes: ['12 đại nguyện', 'Tiêu tai giải nạn', 'Diệt trừ nghiệp chướng', 'Lưu Ly Quang'],
      audience: 'Bồ-tát Văn-thù-sư-lợi và đại chúng',
      related: ['T14n0449', 'T14n0451'],
      relatedNames: ['Dược Sư bản nguyện (bản khác)', 'Dược Sư Thất Phật'],
      paliEquiv: 'Không có tương đương trong Nikāya',
      significance: 'Kinh căn bản về Phật Dược Sư, tụng để cầu an, trị bệnh và tiêu trừ nghiệp chướng.',
      difficulty: 1,
      readingMinutes: 25
    },
    'T09n0262': {
      translator: 'Cưu-ma-la-thập (鳩摩羅什), dịch năm 406 SCN',
      period: 'Pháp Hoa — Niết-bàn thời (法華涅槃時) — 8 năm cuối đời thuyết pháp',
      themes: ['Nhất Thừa (Ekayāna)', 'Phương tiện thiện xảo', 'Thọ ký thành Phật', 'Phẩm Phổ Môn'],
      audience: 'Đại chúng tại núi Linh Thứu (Gṛdhrakūṭa)',
      related: ['T09n0263', 'T09n0264'],
      relatedNames: ['Pháp Hoa (bản Dharmarakṣa)', 'Pháp Hoa (bản Xà-na-quật-đa)'],
      paliEquiv: 'Một số ý tương đương rải rác trong Sutta Nipāta và Saṃyutta Nikāya',
      significance: '"Kinh vương" (經王) — được xem là bản kinh tối thượng tổng hợp toàn bộ giáo pháp. Phẩm Phổ Môn là bản kinh được tụng phổ biến nhất.',
      difficulty: 3,
      readingMinutes: 180
    },
    'T12n0365': {
      translator: 'Cương Lương Da Xá (畺良耶舍, Kālayaśas), dịch đời Lưu Tống (424-442 SCN)',
      period: 'Tịnh Độ kinh điển',
      themes: ['Thập Lục Quán', 'Quán tưởng Tịnh Độ', 'Cửu phẩm liên hoa', 'Vi Đề Hy phu nhân'],
      audience: 'Phu nhân Vi Đề Hy (Vaidehī) tại thành Vương Xá',
      related: ['T12n0366', 'T12n0360'],
      relatedNames: ['Kinh A Di Đà', 'Kinh Vô Lượng Thọ'],
      paliEquiv: 'Không có tương đương',
      significance: 'Kinh thứ hai trong Tịnh Độ Tam Kinh. Dạy 16 phép quán tưởng cõi Cực Lạc.',
      difficulty: 2,
      readingMinutes: 30
    },
    'T01n0001': {
      translator: 'Phật-đà-da-xá & Trúc Phật Niệm (佛陀耶舍 & 竺佛念), dịch năm 413 SCN',
      period: 'A-hàm bộ — tương đương Trường Bộ (Dīgha Nikāya) Pāḷi',
      themes: ['Giới luật', 'Nhân duyên', 'Vũ trụ quan', 'Đạo đức xã hội'],
      audience: 'Các đệ tử và cư sĩ tại nhiều địa điểm khác nhau',
      related: ['T01n0026', 'T02n0099'],
      relatedNames: ['Trung A-hàm', 'Tạp A-hàm'],
      paliEquiv: 'Dīgha Nikāya (Trường Bộ Kinh)',
      significance: 'Trường A-hàm là một trong 4 bộ A-hàm căn bản, chứa các bài kinh dài về giáo lý cơ bản và đạo đức.',
      difficulty: 2,
      readingMinutes: 600
    },
    'T05n0220': {
      translator: 'Huyền Trang (玄奘), dịch 660-663 SCN — công trình dịch thuật đồ sộ nhất lịch sử',
      period: 'Bát-nhã thời — 600 quyển',
      themes: ['Tánh Không', 'Bát-nhã Ba-la-mật', 'Bồ-tát đạo', 'Pháp tướng'],
      audience: 'Tôn giả Tu-bồ-đề và đại chúng',
      related: ['T08n0251', 'T08n0235'],
      relatedNames: ['Tâm Kinh', 'Kim Cang'],
      paliEquiv: 'Không có — kinh điển Đại Thừa thuần túy',
      significance: 'Bộ kinh dài nhất trong Đại Tạng (600 quyển). Hệ thống hóa toàn bộ giáo lý Tánh Không.',
      difficulty: 4,
      readingMinutes: 3000
    },
    'T08n0235': {
      translator: 'Cưu-ma-la-thập (鳩摩羅什), dịch năm 402 SCN',
      period: 'Bát-nhã thời',
      themes: ['Tánh Không', 'Vô trụ', 'Bố thí Ba-la-mật', 'Phá chấp ngã-pháp'],
      audience: 'Tu-bồ-đề (Subhūti) tại vườn Kỳ Đà, thành Xá-vệ',
      related: ['T08n0251', 'T05n0220'],
      relatedNames: ['Tâm Kinh', 'Đại Bát Nhã'],
      paliEquiv: 'Không có tương đương trực tiếp',
      significance: 'Kim Cang Bát-nhã — bản kinh Bát-nhã phổ biến thứ hai, nổi tiếng với câu "Ưng vô sở trụ nhi sinh kỳ tâm".',
      difficulty: 2,
      readingMinutes: 35
    },
    'T10n0279': {
      translator: 'Thật-xoa-nan-đà (實叉難陀, Śikṣānanda), dịch 695-699 SCN',
      period: 'Hoa Nghiêm thời (華嚴時) — giai đoạn đầu sau khi thành đạo',
      themes: ['Pháp giới duyên khởi', 'Lý sự vô ngại', 'Thập địa', 'Phổ Hiền hạnh nguyện'],
      audience: 'Chư Bồ-tát tại Bồ-đề đạo tràng và các cõi trời',
      related: ['T10n0293', 'T09n0278'],
      relatedNames: ['Thập Địa Kinh Luận', 'Hoa Nghiêm (bản 60 quyển)'],
      paliEquiv: 'Không có tương đương',
      significance: 'Một trong những bộ kinh vĩ đại nhất. Trình bày toàn cảnh pháp giới — "một trong tất cả, tất cả trong một".',
      difficulty: 5,
      readingMinutes: 2400
    },
    'T14n0475': {
      translator: 'Cưu-ma-la-thập (鳩摩羅什), dịch năm 406 SCN',
      period: 'Phương đẳng thời',
      themes: ['Bất nhị pháp môn', 'Cư sĩ đạo', 'Phương tiện thuyết pháp', 'Tĩnh lặng sấm sét'],
      audience: 'Trưởng giả Duy-ma-cật (Vimalakīrti) và các đệ tử Phật',
      related: ['T14n0474', 'T14n0476'],
      relatedNames: ['Duy Ma Cật (bản Chi Khiêm)', 'Duy Ma Cật (bản Huyền Trang)'],
      paliEquiv: 'Không có tương đương',
      significance: 'Kinh nổi tiếng nhất về vai trò cư sĩ trong Phật giáo. "Sự im lặng sấm sét" của Duy-ma-cật là biểu tượng của Bất nhị.',
      difficulty: 3,
      readingMinutes: 60
    }
  };

  // ── Lộ trình đọc kinh gợi ý ──
  const READING_PATHS = [
    {
      id: 'beginner',
      name: '🌱 Bước Đầu Tu Học',
      description: 'Dành cho người mới tìm hiểu Phật pháp. Từ kinh ngắn dễ hiểu đến kinh nền tảng.',
      sutras: [
        { id: 'T08n0251', reason: 'Kinh ngắn nhất, chứa tinh yếu trí tuệ Bát Nhã' },
        { id: 'T12n0366', reason: 'Kinh tụng phổ biến nhất, pháp môn niệm Phật' },
        { id: 'T14n0450', reason: 'Cầu an, hiểu về nguyện lực và phước đức' },
        { id: 'T08n0235', reason: 'Trí tuệ phá chấp, nền tảng tư duy Đại Thừa' }
      ]
    },
    {
      id: 'deepening',
      name: '📖 Nghiên Cứu Chuyên Sâu',
      description: 'Cho người đã có nền tảng, muốn đi sâu vào giáo lý.',
      sutras: [
        { id: 'T09n0262', reason: '"Kinh Vương" — tổng hợp toàn bộ giáo pháp Nhất Thừa' },
        { id: 'T14n0475', reason: 'Bất nhị pháp môn — trí tuệ của cư sĩ Duy-ma-cật' },
        { id: 'T12n0365', reason: '16 phép quán tưởng Tịnh Độ' },
        { id: 'T01n0001', reason: 'Trường A-hàm — kinh nguyên thủy, đối chiếu Nikāya' }
      ]
    },
    {
      id: 'scholar',
      name: '🔬 Khảo Cứu Học Thuật',
      description: 'Nghiên cứu đối chiếu A-hàm — Nikāya, văn bản học Phật giáo.',
      sutras: [
        { id: 'T01n0001', reason: 'Trường A-hàm ↔ Dīgha Nikāya' },
        { id: 'T05n0220', reason: 'Đại Bát Nhã 600 quyển — hệ thống Không tính hoàn chỉnh' },
        { id: 'T10n0279', reason: 'Hoa Nghiêm — pháp giới duyên khởi, triết học đỉnh cao' }
      ]
    }
  ];

  // ── Difficulty labels ──
  const DIFFICULTY = {
    1: { label: 'Dễ tiếp cận', color: 'var(--zen-emerald)', icon: '🌱' },
    2: { label: 'Cần nền tảng', color: 'var(--accent)', icon: '📖' },
    3: { label: 'Chuyên sâu', color: 'var(--cover-clay)', icon: '🔍' },
    4: { label: 'Nâng cao', color: 'var(--cover-plum)', icon: '📚' },
    5: { label: 'Học thuật chuyên môn', color: 'var(--cover-blue)', icon: '🎓' }
  };

  function get(taishoId) {
    return DATA[taishoId] || null;
  }

  function getByItem(item) {
    const id = item.data?.taishoId || item.data?.id;
    return DATA[id] || null;
  }

  function getDifficulty(level) {
    return DIFFICULTY[level] || DIFFICULTY[1];
  }

  function getPaths() {
    return READING_PATHS;
  }

  function estimateListening(readingMinutes) {
    // Listening is ~1.5x reading time at normal speed
    return Math.ceil(readingMinutes * 1.4);
  }

  function renderContextCard(item) {
    const context = getByItem(item);
    if (!context) return '';
    const diff = getDifficulty(context.difficulty);
    const listenTime = estimateListening(context.readingMinutes);
    const formatTime = (min) => min >= 60 ? `${Math.floor(min / 60)} giờ ${min % 60 ? min % 60 + ' phút' : ''}` : `${min} phút`;

    return `<details class="sutra-context-card">
      <summary class="context-summary">
        <span class="context-icon">📍</span>
        <span>Ngữ cảnh kinh điển</span>
        <span class="context-time">📖 ~${formatTime(context.readingMinutes)} đọc · 🔊 ~${formatTime(listenTime)} nghe</span>
      </summary>
      <div class="context-body">
        <div class="context-row"><span class="context-label">Dịch giả</span><span>${context.translator}</span></div>
        <div class="context-row"><span class="context-label">Thời kỳ</span><span>${context.period}</span></div>
        <div class="context-row"><span class="context-label">Đối tượng</span><span>${context.audience}</span></div>
        <div class="context-row"><span class="context-label">Chủ đề</span><span class="context-themes">${context.themes.map(t => `<span class="context-theme-tag">${t}</span>`).join('')}</span></div>
        <div class="context-row"><span class="context-label">Tương đương Pāḷi</span><span>${context.paliEquiv}</span></div>
        <div class="context-row"><span class="context-label">Mức độ</span><span style="color:${diff.color}">${diff.icon} ${diff.label}</span></div>
        <div class="context-significance"><em>${context.significance}</em></div>
        ${context.relatedNames.length ? `<div class="context-related"><span class="context-label">Kinh liên quan</span>${context.relatedNames.map((name, i) => `<button class="context-related-btn" data-related-id="${context.related[i]}">${name}</button>`).join('')}</div>` : ''}
      </div>
    </details>`;
  }

  return { get, getByItem, getDifficulty, getPaths, estimateListening, renderContextCard, DATA, READING_PATHS };
})();

if (typeof window !== 'undefined') window.SutraContext = SutraContext;
