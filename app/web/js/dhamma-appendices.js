/**
 * Phụ Lục Minh Triết - Đại Thư Viện Chánh Pháp
 * 1. Bảng đối chiếu song song A-Hàm (Hán Tạng) ↔ Nikāya (Pāḷi Tipiṭaka)
 * 2. Cẩm nang Thập Nhị Phân Giáo (12 thể loại lời Phật thuyết)
 * 3. Cấu trúc toàn cảnh 25 Bộ Đại Chánh Tân Tu Đại Tạng Kinh (Taishō)
 * 4. Bảng tra cứu Danh Số Pháp Học Cốt Tủy
 */

const DHAMMA_APPENDICES = {
  // PHỤ LỤC I: ĐỐI CHIẾU A-HÀM & NIKĀYA
  ahamNikayaComparison: {
    title: "Bảng Đối Chiếu Toàn Diện: A-Hàm (Hán Tạng) ↔ Nikāya (Pāḷi Nguyên Thủy)",
    introduction: "Kinh tạng A-Hàm (Āgama) trong Hán tạng và Kinh tạng Nikāya trong Pāḷi Tipiṭaka là hai nguồn tài liệu kinh điển sơ kỳ quý giá nhất của nhân loại. Cả hai cùng ghi lại những lời dạy nguyên thủy của Đức Phật lịch sử Gotama và các bậc Thánh đệ tử trước khi Phật giáo phân phái.",
    divisionsCorrelation: [
      {
        hanName: "Trường A-Hàm Kinh (長阿含經)",
        taishoId: "T01n0001",
        paliName: "Trường Bộ Kinh (Dīgha Nikāya - DN)",
        countHan: "22 quyển, 30 kinh",
        countPali: "3 phẩm, 34 kinh",
        school: "Pháp Tạng Bộ (Dharmaguptaka) dịch sang Hán văn đời Hậu Tần (413 TL)",
        nature: "Tập hợp các bản kinh dài, xiển dương oai đức Đức Phật, bác bỏ các tà kiến ngoại đạo, thuyết giảng vũ trụ quan và đạo lý làm người."
      },
      {
        hanName: "Trung A-Hàm Kinh (中阿含經)",
        taishoId: "T01n0026",
        paliName: "Trung Bộ Kinh (Majjhima Nikāya - MN)",
        countHan: "60 quyển, 222 kinh",
        countPali: "15 phẩm, 152 kinh",
        school: "Thuyết Nhất Thiết Hữu Bộ (Sarvāstivāda) dịch sang Hán văn đời Đông Tấn (398 TL)",
        nature: "Tập hợp các bản kinh có độ dài trung bình, hàm chứa các phân tích giáo lý sâu sắc nhất: Tứ Diệu Đế, Bát Chánh Đạo, Vô ngã, Duyên khởi, các phương pháp tu thiền định và minh sát."
      },
      {
        hanName: "Tạp A-Hàm Kinh (雜阿含經)",
        taishoId: "T02n0099",
        paliName: "Tương Ưng Bộ Kinh (Saṃyutta Nikāya - SN)",
        countHan: "50 quyển, 1.362 kinh",
        countPali: "5 thiên, 56 tương ưng, 2.889 kinh",
        school: "Căn Bản Thuyết Nhất Thiết Hữu Bộ (Mūlasarvāstivāda) dịch đời Lưu Tống (443 TL)",
        nature: "Tập hợp các bài kinh ngắn phân theo từng chủ đề giáo lý cốt lõi: Uẩn tương ưng, Xứ tương ưng, Nhân duyên tương ưng, Đạo phẩm tương ưng, Tứ đế tương ưng. Đây được giới học giả đánh giá là tầng kinh điển cổ xưa nhất."
      },
      {
        hanName: "Tăng Nhất A-Hàm Kinh (增一阿含經)",
        taishoId: "T02n0125",
        paliName: "Tăng Chi Bộ Kinh (Aṅguttara Nikāya - AN)",
        countHan: "51 quyển, 472 kinh",
        countPali: "11 chương, 160 phẩm, 8.122 kinh",
        school: "Đại Chúng Bộ (Mahāsāṃghika) hoặc Hóa Địa Bộ dịch đời Đông Tấn (385 TL)",
        nature: "Sắp xếp theo pháp số tăng dần từ Một Pháp (Nhất pháp) đến Mười Một Pháp (Thập nhất pháp), thuận tiện cho việc học thuộc lòng và ứng dụng đời sống."
      }
    ],
    famousCorrelations: [
      {
        sutraHan: "Thi-ca-la-việt Lục Phương Lễ Kinh (T01n0016) & Thiện Sanh Tử Kinh (T01n0017)",
        sutraPali: "Sigālovāda Sutta (Kinh Giáo Giới Thi-ca-la-việt, DN 31)",
        doctrine: "Bổn phận đạo đức của người cư sĩ tại gia: 6 phương quan hệ gia đình xã hội, diệt trừ 4 nghiệp ô uế, 4 ác hành và 6 cửa ngõ phóng dật tiêu tán tài sản."
      },
      {
        sutraHan: "Du Hành Kinh (kinh số 2 trong Trường A-Hàm, T01n0001)",
        sutraPali: "Mahāparinibbāna Sutta (Kinh Đại Bát Niết Bàn, DN 16)",
        doctrine: "Ký sự lịch sử những tháng ngày cuối đời của Đức Phật, chuyến du hành cuối cùng đến Kusinārā, lời phú chúc chánh pháp tối hậu và lễ trà-tỳ xá-lợi."
      },
      {
        sutraHan: "Tịch Chí Quả Kinh (T01n0022)",
        sutraPali: "Sāmaññaphala Sutta (Kinh Sa-Môn Quả, DN 2)",
        doctrine: "Lợi ích thiết thực hiện đời của đời sống xuất gia phạm hạnh từ giới hạnh, thiền định đến các tầng tuệ giác giải thoát."
      },
      {
        sutraHan: "Phạm Võng Lục Thập Nhị Kiến Kinh (T01n0021)",
        sutraPali: "Brahmajāla Sutta (Kinh Phạm Võng, DN 1)",
        doctrine: "Bản kinh đầu tiên phân tích và quét sạch toàn bộ 62 tà kiến triết học thế gian về quá khứ và tương lai (thường kiến, đoạn kiến, hữu biên, vô biên...)."
      },
      {
        sutraHan: "Khởi Thế Kinh (T01n0024) & Khởi Thế Nhân Bản Kinh (T01n0025)",
        sutraPali: "Aggañña Sutta (Kinh Khởi Thế Nhân Duyên, DN 27)",
        doctrine: "Vũ trụ quan Phật giáo: Sự thành - trụ - hoại - không của thế giới, nguồn gốc sự tiến hóa của loài người từ cõi Quang Âm Thiên."
      }
    ]
  },

  // PHỤ LỤC II: THẬP NHỊ PHÂN GIÁO (12 THỂ LOẠI)
  twelveDivisions: {
    title: "Cẩm Nang Thập Nhị Phân Giáo (Dvādaśāṅga-buddhavacana)",
    introduction: "Thập Nhị Bộ Kinh (12 thể loại kinh điển) là phương pháp phân loại toàn bộ giáo pháp của Đức Phật theo thể tài văn học và phương thức thuyết giáo có từ thời kỳ Phật giáo sơ kỳ, được ghi nhận trong cả văn hiến Pāḷi và Hán tạng.",
    genres: [
      {
        code: "01",
        paliSanskrit: "Sūtra (Phạn) / Sutta (Pāḷi)",
        hanName: "Khế Kinh (契經)",
        definition: "Lời dạy trực tiếp bằng văn xuôi của Đức Phật, 'khế lý' (hợp với chân lý tối hậu) và 'khế cơ' (hợp với căn cơ trình độ của người nghe).",
        examples: "Quán Vô Lượng Thọ, Dược Sư, Phạm Võng Bồ Tát Giới, Bát Đại Nhân Giác, Thập Thiện Nghiệp Đạo, Tứ Thập Nhị Chương, Phật Di Giáo Kinh."
      },
      {
        code: "02",
        paliSanskrit: "Geya (Phạn & Pāḷi)",
        hanName: "Trùng Tụng (重頌)",
        definition: "Thể thơ kệ tụng lại, tóm tắt hoặc làm sáng tỏ thêm ý nghĩa của phần văn xuôi đã thuyết ở trước.",
        examples: "Đại Thừa Nhập Lăng Già Kinh, các phẩm trùng tụng trong Tạp A-hàm và Tương Ưng Bộ."
      },
      {
        code: "03",
        paliSanskrit: "Vyākaraṇa (Phạn) / Veyyākaraṇa (Pāḷi)",
        hanName: "Thọ Ký (授記)",
        definition: "Lời phân tích giải thích giáo lý tường tận, hoặc lời Đức Phật huyền ký về quả vị giác ngộ trong tương lai của các đệ tử.",
        examples: "Di Lặc Thượng Sinh Đâu Suất Kinh, Di Lặc Hạ Sinh Thành Phật Kinh, Di Lặc Đại Thành Phật Kinh."
      },
      {
        code: "04",
        paliSanskrit: "Gāthā (Phạn & Pāḷi)",
        hanName: "Phúng Tụng / Kệ Tụng (諷頌 / 孤起頌)",
        definition: "Các bài thi kệ độc lập, không đi kèm văn xuôi, trực tiếp ngợi ca Tam Bảo hoặc đúc kết triết lý sống động.",
        examples: "Phật Sở Hành Tán (Mã Minh Bồ Tát), Pháp Tập Yếu Tụng Kinh, Kinh Pháp Cú (Dhammapada)."
      },
      {
        code: "05",
        paliSanskrit: "Udāna (Phạn & Pāḷi)",
        hanName: "Tự Thuyết (自說)",
        definition: "Những lời dạy Đức Phật tự động tuyên thuyết từ tuệ giác hân hoan thanh tịnh mà không cần ai thưa thỉnh đặt câu hỏi trước.",
        examples: "Phật Thuyết A Di Đà Kinh, Kinh Phật Tự Thuyết trong Tiểu Bộ Pāḷi."
      },
      {
        code: "06",
        paliSanskrit: "Nidāna (Phạn & Pāḷi)",
        hanName: "Nhân Duyên (因緣)",
        definition: "Những bản kinh ghi lại bối cảnh, địa điểm, nhân duyên khởi phát một lời dạy hay giới luật được chế tác.",
        examples: "Địa Tạng Bồ Tát Bổn Nguyện Kinh, Phật Thuyết Vu Lan Bồn Kinh, Phật Thuyết Đạo Cán Kinh, Hưng Khởi Hành Kinh."
      },
      {
        code: "07",
        paliSanskrit: "Avadāna (Phạn) / Apadāna (Pāḷi)",
        hanName: "Thí Dụ (譬喻)",
        definition: "Dùng các câu chuyện ví von, ẩn dụ hình ảnh sinh động để giảng giải các đạo lý trừu tượng khó hiểu.",
        examples: "Bách Dụ Kinh (100 câu chuyện ngụ ngôn nổi tiếng), Hiền Ngu Kinh, Soạn Tập Bách Duyên Kinh, Tạp Bảo Tạng Kinh."
      },
      {
        code: "08",
        paliSanskrit: "Itivṛttaka (Phạn) / Itivuttaka (Pāḷi)",
        hanName: "Bổn Sự (本事 / Như Thị Ngữ)",
        definition: "Ghi chép lại những hạnh nguyện, sự nghiệp kiếp trước của chư vị Thánh đệ tử Bồ Tát, Thinh Văn.",
        examples: "Bản Sự Kinh (Huyền Trang dịch), Kinh Phật Thuyết Như Vậy trong Tiểu Bộ Pāḷi."
      },
      {
        code: "09",
        paliSanskrit: "Jātaka (Phạn & Pāḷi)",
        hanName: "Bổn Sinh (本生)",
        definition: "Các câu chuyện tiền thân của chính Đức Phật Thích Ca Mâu Ni khi còn hành Bồ Tát đạo tích lũy Thập độ Ba-la-mật.",
        examples: "Lục Độ Tập Kinh, Sinh Kinh, Bồ Tát Bản Sinh Man Luận (Jātakamālā), Bi Hoa Kinh, Bản Sinh Tâm Địa Quán Kinh."
      },
      {
        code: "10",
        paliSanskrit: "Vaipulya (Phạn) / Vedalla (Pāḷi)",
        hanName: "Phương Quảng (方廣)",
        definition: "Các bộ đại kinh dung chứa giáo lý bao la rộng lớn, khai mở cảnh giới nhất thừa viên dung vô ngại.",
        examples: "Bát Nhã Tâm Kinh, Kim Cang Bát Nhã, Diệu Pháp Liên Hoa Kinh, Hoa Nghiêm Kinh, Đại Bát Niết Bàn Kinh, Duy Ma Cật, Thủ Lăng Nghiêm, Vô Lượng Thọ, Thắng Man Sư Tử Hống."
      },
      {
        code: "11",
        paliSanskrit: "Adbhutadharma (Phạn) / Abbhutadhamma (Pāḷi)",
        hanName: "Vị Tằng Hữu (未曾有)",
        definition: "Kinh điển ghi chép lại những hiện tượng kỳ diệu, thần thông phi thường, những sự việc chưa từng thấy xuất hiện ở cõi đời.",
        examples: "Vị Tằng Hữu Nhân Duyên Kinh, Hải Long Vương Kinh, Phật Thuyết Hộ Mạng Kinh."
      },
      {
        code: "12",
        paliSanskrit: "Upadeśa (Phạn & Pāḷi)",
        hanName: "Luận Nghị (論議)",
        definition: "Các trước tác phân tích, tranh luận, nghị luận, chú giải và đúc kết giáo lý một cách có phương pháp học thuật chặt chẽ.",
        examples: "Bồ Đề Tư Lương Luận (Long Thọ), Đại Thừa Chỉ Quán Đốn Ngộ Pháp Môn, Bồ Tát Anh Lạc Bản Nghiệp Kinh."
      }
    ]
  },

  // PHỤ LỤC III: SƠ ĐỒ 25 BỘ ĐẠI TẠNG HÁN TẠNG
  taishoStructure: {
    title: "Sơ Đồ Phân Cấu Trúc Toàn Cảnh: 25 Bộ Đại Chánh Tân Tu Đại Tạng Kinh (Taishō)",
    introduction: "Đại Chánh Tân Tu Đại Tạng Kinh (大正新脩大藏經 - Taishō Shinshū Daizōkyō) biên soạn từ 1924 đến 1934 tại Nhật Bản dựa trên nguồn mộc bản cổ khắp Đông Á, gồm 2.471 văn bản chuẩn mực quốc tế chia thành 25 bộ:",
    groups: [
      {
        groupName: "KHỐI I: KINH TẠNG SƠ KỲ & BẢN DUYÊN (Bộ 01 - 02)",
        divisions: [
          { code: "01", name: "A Hàm bộ (阿含部)", count: "155 văn bản (144 bản Việt)", desc: "Kinh tạng Phật giáo sơ kỳ tương đương Nikāya." },
          { code: "02", name: "Bản Duyên bộ (本緣部)", count: "72 văn bản (71 bản Việt)", desc: "Truyện tích tiền thân Đức Phật và chư đại đệ tử." }
        ]
      },
      {
        groupName: "KHỐI II: KINH TẠNG ĐẠI THỪA PHÁT TRIỂN (Bộ 03 - 10)",
        divisions: [
          { code: "03", name: "Bát Nhã bộ (般若部)", count: "57 văn bản (57 bản Việt)", desc: "Trí tuệ Ba-la-mật, Tánh Không, Kim Cang, Tâm Kinh." },
          { code: "04", name: "Pháp Hoa bộ (法華部)", count: "16 văn bản (16 bản Việt)", desc: "Kinh Diệu Pháp Liên Hoa, Vô Lượng Nghĩa, Phổ Hiền." },
          { code: "05", name: "Hoa Nghiêm bộ (華嚴部)", count: "32 văn bản (32 bản Việt)", desc: "Đại Phương Quảng Phật Hoa Nghiêm (60 & 80 quyển), Thập Địa." },
          { code: "06", name: "Bảo Tích bộ (寶積部)", count: "65 văn bản (57 bản Việt)", desc: "Đại Bảo Tích kinh, tích tập 49 hội giáo lý Bồ Tát hạnh." },
          { code: "07", name: "Niết Bàn bộ (涅槃部)", count: "23 văn bản (23 bản Việt)", desc: "Đại Bát Niết Bàn kinh, thuyết Như Lai tánh thường trú." },
          { code: "08", name: "Đại Tập bộ (大集部)", count: "28 văn bản (28 bản Việt)", desc: "Đại Phương Đẳng Đại Tập kinh, hộ trì chánh pháp." },
          { code: "09", name: "Kinh Tập bộ (經集部)", count: "433 văn bản (404 bản Việt)", desc: "Kho tàng các bản kinh ngắn đơn hành của Đại thừa." },
          { code: "10", name: "Mật Giáo bộ (密教部)", count: "614 văn bản (2 bản Việt)", desc: "Đà-la-ni, Mạn-đà-la, nghi quỹ tu trì Mật tông." }
        ]
      },
      {
        groupName: "KHỐI III: LUẬT TẠNG BỘ PHÁI (Bộ 11)",
        divisions: [
          { code: "11", name: "Luật bộ (律部)", count: "87 văn bản (87 bản Việt)", desc: "Tứ Phần Luật, Ngũ Phần Luật, Thập Tụng Luật, Ma-ha-tăng-kỳ Luật, Thiện Kiến Luật." }
        ]
      },
      {
        groupName: "KHỐI IV: LUẬN TẠNG & TRIẾT HỌC HỆ THỐNG (Bộ 12 - 16)",
        divisions: [
          { code: "12", name: "Thích Kinh Luận bộ (釋經論部)", count: "32 văn bản (32 bản Việt)", desc: "Đại Trí Độ Luận, Thập Địa Kinh Luận, Kim Cang Bát Nhã Luận." },
          { code: "13", name: "Tỳ Đàm bộ (毘曇部)", count: "28 văn bản (28 bản Việt)", desc: "A-tỳ-đạt-ma Câu Xá Luận, Phát Trí Luận, Đại Tỳ Bà Sa Luận." },
          { code: "14", name: "Trung Quán bộ (中觀部)", count: "15 văn bản (15 bản Việt)", desc: "Trung Luận, Thập Nhị Môn Luận, Bách Luận của Long Thọ & Thánh Thiên." },
          { code: "15", name: "Du Già bộ (瑜伽部)", count: "49 văn bản (49 bản Việt)", desc: "Du Già Sư Địa Luận, Thành Duy Thức Luận, Nhiếp Đại Thừa Luận." },
          { code: "16", name: "Luận Tập bộ (論集部)", count: "66 văn bản (64 bản Việt)", desc: "Đại Thừa Khởi Tín Luận, Nhân Minh Luận, Bồ Đề Hành Kinh." }
        ]
      },
      {
        groupName: "KHỐI V: TRƯỚC TÁC TRUNG HOA & TÔNG PHÁI (Bộ 17 - 25)",
        divisions: [
          { code: "17-19", name: "Kinh Sớ, Luật Sớ, Luận Sớ", count: "158 văn bản", desc: "Các bản sớ giải kinh điển của các bậc cao tăng Trung Hoa." },
          { code: "20-21", name: "Chư Tông bộ & Sử Truyện bộ", count: "281 văn bản", desc: "Ngữ lục Thiền tông, Thiên Thai, Tịnh Độ, Cao Tăng Truyện." },
          { code: "22-25", name: "Sự Vị, Ngoại Giáo, Mục Lục, Cổ Dật", count: "260 văn bản", desc: "Từ điển Phật học cổ, mục lục thư mục, tư liệu Đôn Hoàng." }
        ]
      }
    ]
  },

  // PHỤ LỤC IV: BẢNG TRA DANH SỐ PHÁP HỌC
  coreDhammaNumbers: {
    title: "Bảng Tra Cứu Danh Số Pháp Học Cốt Tủy",
    introduction: "Hệ thống danh số là đặc trưng sư phạm kinh điển của Đức Phật giúp người tu học nắm vững các mắt xích của con đường giác ngộ:",
    tables: [
      {
        name: "Tam Vô Lậu Học (Tisso Sikkhā)",
        summary: "Nền tảng của toàn bộ tiến trình tu chứng:",
        items: [
          { term: "Giới (Sīla)", desc: "Thanh tịnh hóa thân và khẩu, thu thúc các giác quan, nền móng vững chắc cho định." },
          { term: "Định (Samādhi)", desc: "Lắng dịu năm triền cái, an trú tâm vững chãi trên thiện cảnh, chuẩn bị cho tuệ." },
          { term: "Tuệ (Paññā)", desc: "Thấy rõ thực tánh danh sắc theo Tam tướng: Vô thường, Khổ, Vô ngã, đoạn tận vô minh lậu hoặc." }
        ]
      },
      {
        name: "Tứ Thánh Đế (Cattāri Ariyasaccāni)",
        summary: "Bốn chân lý tối thượng Đức Thế Tôn chuyển pháp luân:",
        items: [
          { term: "Khổ Đế (Dukkha)", desc: "Thực trạng bức bách của ngũ uẩn luân hồi — Phận sự: Cần phải Liễu Tri (Pariññeyya)." },
          { term: "Tập Đế (Samudaya)", desc: "Nguồn gốc sinh khổ là Ái dục (Taṇhā) — Phận sự: Cần phải Đoạn Tận (Pahātabba)." },
          { term: "Diệt Đế (Nirodha)", desc: "Sự dập tắt hoàn toàn tham sân si, Niết-bàn tịch tịnh — Phận sự: Cần phải Chứng Ngộ (Sacchikātabba)." },
          { term: "Đạo Đế (Magga)", desc: "Con đường Bát Chánh Đạo dẫn đến đoạn diệt khổ đau — Phận sự: Cần phải Tu Tiến (Bhāvetabba)." }
        ]
      },
      {
        name: "Bát Chánh Đạo (Ariya Aṭṭhaṅgika Magga)",
        summary: "Con đường độc nhất đưa đến sự thanh tịnh cho chúng sanh:",
        items: [
          { term: "Chánh Tri Kiến (Sammā-diṭṭhi)", desc: "Hiểu biết đúng đắn về Tứ Đế, Nghiệp báo và Tam tướng." },
          { term: "Chánh Tư Duy (Sammā-saṅkappa)", desc: "Suy nghĩ ly dục, không sân hận, không hại người." },
          { term: "Chánh Ngữ (Sammā-vācā)", desc: "Tránh nói dối, nói lời đâm thọc, nói lời thô ác, nói lời vô ích." },
          { term: "Chánh Nghiệp (Sammā-kammanta)", desc: "Tránh sát sanh, trộm cắp và tà dâm." },
          { term: "Chánh Mạng (Sammā-ājīva)", desc: "Mưu sinh bằng nghề chân chánh, không làm tổn hại chúng sanh." },
          { term: "Chánh Tinh Tấn (Sammā-vāyāma)", desc: "Tứ chánh cần: ngăn ác, diệt ác, phát sinh thiện, tăng trưởng thiện." },
          { term: "Chánh Niệm (Sammā-sati)", desc: "Tứ niệm xứ: quán thân, thọ, tâm, pháp trong hiện tại." },
          { term: "Chánh Định (Sammā-samādhi)", desc: "Tâm an trú vững chắc qua các tầng thiền sắc giới." }
        ]
      },
      {
        name: "Thập Phúc Hành Tông (Dasa Puññakiriyavatthu)",
        summary: "Mười cơ hội tạo phước báu vô lượng cho người tại gia (Sách Phúc Hành Tông):",
        items: [
          { term: "1. Bố Thí (Dāna)", desc: "Xả ly của cải, pháp thí và vô úy thí với tâm hoan hỷ." },
          { term: "2. Giữ Giới (Sīla)", desc: "Thọ trì ngũ giới, bát quan trai giới, chánh mạng bát giới." },
          { term: "3. Tu Tiến (Bhāvanā)", desc: "Phát triển tâm qua thiền định và thiền Minh Sát Vipassanā." },
          { term: "4. Cung Kính (Apacāyana)", desc: "Kính trọng bậc trưởng thượng, bậc có giới đức và Tam Bảo." },
          { term: "5. Phục Vụ (Veyyāvacca)", desc: "Hết lòng giúp đỡ Tăng đoàn, người bệnh và việc công đức." },
          { term: "6. Hồi Hướng Phước (Pattidāna)", desc: "Chia sẻ phước báu đến thân quyến quá vãng và muôn loài." },
          { term: "7. Tùy Hỷ Phước (Pattānumodāna)", desc: "Hoan hỷ chân thành trước việc thiện lành của người khác." },
          { term: "8. Thính Pháp (Dhammasavana)", desc: "Lắng nghe Chánh pháp để phát sinh trí tuệ và niềm tin thanh tịnh." },
          { term: "9. Thuyết Pháp (Dhammadesanā)", desc: "Truyền bá chân lý Phật dạy với tâm từ bi không cầu danh lợi." },
          { term: "10. Kiến Thị / Chánh Kiến (Diṭṭhujukamma)", desc: "Uốn nắn tri kiến ngay thẳng theo lý duyên sinh nhân quả." }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DHAMMA_APPENDICES;
}
