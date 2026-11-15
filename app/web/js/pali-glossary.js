/**
 * Thư Viện Chánh Pháp Nguyên Thủy - Pāḷi Dhamma Glossary
 * Hệ thống thuật ngữ Pāḷi cốt tủy trong Tam Tạng Pāḷi (Tipiṭaka) & Thắng Pháp (Abhidhamma)
 */
const PALI_GLOSSARY = [
  {
    term: "Anatta",
    pali: "Anattā",
    vietnamese: "Vô ngã",
    category: "Tam Tướng (Tilakkhaṇa)",
    definition: "Đặc tính không có một thực thể độc lập, trường tồn hay một linh hồn bất biến (Attā) điều khiển thân và tâm. Mọi hiện tượng chỉ là sự kết hợp sinh diệt của Danh (Nāma) và Sắc (Rūpa).",
    practiceNote: "Quán chiếu 'Cái này không phải là tôi, không phải của tôi, không phải tự ngã của tôi' (Kinh Vô Ngã Tướng - Anattalakkhaṇa Sutta) để buông bỏ chấp thủ và ngã mạn."
  },
  {
    term: "Anicca",
    pali: "Anicca",
    vietnamese: "Vô thường",
    category: "Tam Tướng (Tilakkhaṇa)",
    definition: "Đặc tính biến đổi không ngừng, sinh rồi diệt, không có gì dừng lại trong một sát-na của vạn pháp hữu vi.",
    practiceNote: "Thấy rõ các cảm thọ, suy nghĩ, hoàn cảnh xuất hiện rồi tự biến hoại để không bám víu khi thuận cảnh hay tuyệt vọng khi nghịch cảnh."
  },
  {
    term: "Dukkha",
    pali: "Dukkha",
    vietnamese: "Khổ / Bất toại nguyện",
    category: "Tam Tướng (Tilakkhaṇa)",
    definition: "Thực trạng bức bách, không thể mang lại sự thỏa mãn vĩnh cửu vì bản chất vô thường và trống rỗng của mọi pháp hữu vi.",
    practiceNote: "Nhận diện Dukkha với tâm bình thản thay vì trốn chạy; thấy Khổ là Thánh đế đầu tiên cần phải liễu tri (Pariññeyya)."
  },
  {
    term: "Sati",
    pali: "Sati",
    vietnamese: "Chánh niệm / Tỉnh niệm",
    category: "Tâm sở thiện (Kusala Cetasika)",
    definition: "Sự ghi nhận rõ ràng, không phán xét, không lãng quên đối với thực tại thân - thọ - tâm - pháp đang diễn ra trong hiện tại.",
    practiceNote: "Duy trì chánh niệm liên tục trong bốn đại oai nghi (Đi, Đứng, Nằm, Ngồi) và các tiểu oai nghi (ăn, uống, co, duỗi, đại tiểu tiện)."
  },
  {
    term: "Sampajañña",
    pali: "Sampajañña",
    vietnamese: "Tỉnh giác / Tỉnh lự",
    category: "Pháp Hành Chánh Niệm",
    definition: "Sự thấu suốt hoàn cảnh, biết rõ mục đích lợi ích, sự thích hợp và bản chất thực của hành động ngay khi đang hành động.",
    practiceNote: "Kết hợp Sati - Sampajañña (Niệm - Giác) là ngọn đuốc soi sáng dẫn đường cho hành giả thoát ly buông lung phóng dật."
  },
  {
    term: "Samādhi",
    pali: "Samādhi",
    vietnamese: "Chánh định / Định tâm",
    category: "Chi đạo (Maggaṅga)",
    definition: "Trạng thái tâm gom về một điểm trên thiện cảnh (Ekaggatā), lắng dịu năm triền cái, giúp tâm trở nên thanh tịnh và vững chãi.",
    practiceNote: "Định là chiếc gương phẳng tĩnh lặng để ánh sáng Tuệ giác (Paññā) soi rọi thực tướng danh sắc."
  },
  {
    term: "Paññā",
    pali: "Paññā",
    vietnamese: "Tuệ giác / Trí tuệ",
    category: "Căn bản giải thoát",
    definition: "Hiểu biết thấu suốt chân lý tối hậu: Tứ Thánh Đế, Duyên Sinh (Paṭiccasamuppāda), Tam Tướng (Vô thường, Khổ, Vô ngã).",
    practiceNote: "Trí tuệ có 3 cấp độ: Văn tuệ (do nghe đọc), Tư tuệ (do suy ngẫm chân chánh), và Tu tuệ (do trực chứng qua thiền Minh sát Vipassanā)."
  },
  {
    term: "Appamāda",
    pali: "Appamāda",
    vietnamese: "Không phóng dật / Tinh cần",
    category: "Cốt tủy lời Phật dạy",
    definition: "Trạng thái tâm không lơ đễnh, luôn cảnh giác, tỉnh thức và tinh tấn tích cực trong các thiện pháp.",
    practiceNote: "Lời di huấn tối hậu của Đức Thế Tôn: 'Vayadhammā saṅkhārā appamādena sampādetha' - Các pháp hữu vi đều chịu hoại diệt, hãy tinh tấn không phóng dật!"
  },
  {
    term: "Pamāda",
    pali: "Pamāda",
    vietnamese: "Phóng dật / Buông lung",
    category: "Cội rễ ô nhiễm",
    definition: "Buông thả tâm ý theo tham dục, lười biếng, thiếu chánh niệm kiểm soát thân khẩu ý, cội nguồn của mọi tai họa luân hồi.",
    practiceNote: "Nhận diện 6 cửa ngõ đưa đến phóng dật: rượu chè nghiện ngập, rong chơi đêm, đàn đúm, cờ bạc, kết bạn xấu, lười biếng."
  },
  {
    term: "Puñña",
    pali: "Puñña",
    vietnamese: "Phước thiện / Công đức",
    category: "Nền tảng hạnh phúc",
    definition: "Những hành động thân, khẩu, ý có tác năng gạn lọc ô uế của tâm, đem lại sự an lạc trong đời này và các đời vị lai.",
    practiceNote: "Phước thiện ví như lương thực trên đường vượt qua biển sinh tử luân hồi, là trợ duyên tất yếu để thành tựu Ba-la-mật."
  },
  {
    term: "Puññakiriyavatthu",
    pali: "Puññakiriyavatthu",
    vietnamese: "Phúc Hành Tông (10 việc thiện)",
    category: "Thắng Pháp & Chú giải",
    definition: "10 cơ hội tạo phước báu tối thượng: 1. Bố thí (Dāna), 2. Trì giới (Sīla), 3. Tu tiến (Bhāvanā), 4. Cung kính (Apacāyana), 5. Phục vụ (Veyyāvacca), 6. Hồi hướng phước (Pattidāna), 7. Tùy hỷ phước (Pattānumodāna), 8. Thính pháp (Dhammasavana), 9. Thuyết pháp (Dhammadesanā), 10. Kiến thị/Chánh tri kiến (Diṭṭhujukamma).",
    practiceNote: "Là kim chỉ nam toàn diện cho người cư sĩ Phật tử tại gia thực hành mỗi ngày (theo sách Phúc Hành Tông)."
  },
  {
    term: "Dāna",
    pali: "Dāna",
    vietnamese: "Bố thí",
    category: "Phúc Hành Tông / Ba-la-mật",
    definition: "Tâm xả ly của cải, tài vật, kiến thức (pháp thí) hay sự không sợ hãi (vô úy thí) đến tha nhân mà không màng danh lợi đền đáp.",
    practiceNote: "Bố thí thù thắng nhất khi hội đủ: Người cho thanh tịnh, vật cho chân chánh, người nhận giới hạnh, và tâm hoan hỷ trước, trong và sau khi cho."
  },
  {
    term: "Sīla",
    pali: "Sīla",
    vietnamese: "Giới hạnh / Thu thúc",
    category: "Tam Vô Lậu Học",
    definition: "Sự gìn giữ thân và khẩu tránh xa các hành vi làm tổn hại tự thân và tha nhân, giữ tâm an ổn và mát mẻ.",
    practiceNote: "Ngũ giới bảo vệ nhân phẩm làm người; Bát quan trai giới thanh lọc tâm ý hướng đến đời sống phạm hạnh của bậc xuất gia."
  },
  {
    term: "Bhāvanā",
    pali: "Bhāvanā",
    vietnamese: "Tu tiến / Phát triển tâm",
    category: "Tam Vô Lậu Học",
    definition: "Sự vun bồi, phát triển những đức tính cao quý trong tâm thông qua định (Samatha) và quán (Vipassanā).",
    practiceNote: "Tạo phước tối thượng trong Thập phúc hành tông vì trực tiếp nhổ tận gốc rễ tham, sân, si."
  },
  {
    term: "Vipassanā",
    pali: "Vipassanā",
    vietnamese: "Thiền Minh Sát",
    category: "Pháp Hành Giải Thoát",
    definition: "Phương pháp thiền quán thấy rõ thực tính của Danh (Nāma) và Sắc (Rūpa) dưới góc độ Tam tướng (Vô thường, Khổ, Vô ngã).",
    practiceNote: "Không suy diễn, chỉ thuần túy quan sát danh sắc trong từng khoảnh khắc sinh diệt của thực tại hiện tiền."
  },
  {
    term: "Samatha",
    pali: "Samatha",
    vietnamese: "Thiền Chỉ / Lắng dịu",
    category: "Định học",
    definition: "Phương pháp an trú tâm vào một đề mục thiền (như niệm hơi thở, biến xứ kasina, từ tâm) để đạt đến các tầng thiền chứng (Jhāna).",
    practiceNote: "Tạo sự tĩnh lặng sâu lắng, trấn áp phiền não tạm thời, tạo sức mạnh tập trung cho Minh sát tuệ."
  },
  {
    term: "Kamma",
    pali: "Kamma",
    vietnamese: "Nghiệp (Hành động có tác ý)",
    category: "Định luật vũ trụ",
    definition: "Tác ý (Cetanā) thiện hay bất thiện biểu hiện qua thân, khẩu, ý. Nghiệp là tài sản duy nhất mà mỗi chúng sanh thừa tự.",
    practiceNote: "'Cetanāhaṃ bhikkhave kammaṃ vadāmi' - Này các Tỳ-kheo, Ta tuyên bố rằng chính Tác ý là Nghiệp."
  },
  {
    term: "Vipāka",
    pali: "Vipāka",
    vietnamese: "Quả của Nghiệp",
    category: "Định luật nhân quả",
    definition: "Kết quả tự nhiên chín muồi sinh ra từ nghiệp nhân thiện hoặc bất thiện đã tạo trong quá khứ hoặc hiện tại.",
    practiceNote: "Hiểu rõ lý Nghiệp - Quả giúp hành giả nhẫn nại trước nghịch cảnh và không bao giờ oán trời trách người."
  },
  {
    term: "Nibbāna",
    pali: "Nibbāna",
    vietnamese: "Niết-bàn",
    category: "Cứu cánh giải thoát",
    definition: "Trạng thái dập tắt hoàn toàn tham ái (Taṇhā), sân hận (Dosa) và si mê (Moha). Là pháp vô vi (Asaṅkhata), bất tử, an lạc tối thượng.",
    practiceNote: "Niết-bàn không phải là nơi chốn cõi trời, mà là sự giải thoát hoàn toàn khỏi mọi ràng buộc của ngũ uẩn và luân hồi."
  },
  {
    term: "Paṭiccasamuppāda",
    pali: "Paṭiccasamuppāda",
    vietnamese: "Thập Nhị Nhân Duyên / Duyên Khởi",
    category: "Giáo lý cốt lõi",
    definition: "Quy luật tương duyên tương sinh của 12 mắt xích: Vô minh -> Hành -> Thức -> Danh sắc -> Lục nhập -> Xúc -> Thọ -> Ái -> Thủ -> Hữu -> Sinh -> Lão tử sầu bi ưu não.",
    practiceNote: "Thấy Duyên khởi là thấy Pháp; thấy Pháp là thấy Phật. Cắt đứt mắt xích Ái (Taṇhā) là con đường giải thoát."
  },
  {
    term: "Ariya Sacca",
    pali: "Ariya Sacca",
    vietnamese: "Tứ Thánh Đế",
    category: "Căn bản giác ngộ",
    definition: "Bốn chân lý cao thượng: 1. Dukkha (Khổ đế), 2. Samudaya (Tập đế - Ái dục), 3. Nirodha (Diệt đế - Niết bàn), 4. Magga (Đạo đế - Bát Chánh Đạo).",
    practiceNote: "Khổ cần liễu tri; Tập cần đoạn tận; Diệt cần chứng ngộ; Đạo cần tu tiến."
  },
  {
    term: "Ariya Aṭṭhaṅgika Magga",
    pali: "Ariya Aṭṭhaṅgika Magga",
    vietnamese: "Bát Chánh Đạo",
    category: "Đạo đế (Magga)",
    definition: "Con đường tám nhánh gồm: Chánh tri kiến, Chánh tư duy (Tuệ); Chánh ngữ, Chánh nghiệp, Chánh mạng (Giới); Chánh tinh tấn, Chánh niệm, Chánh định (Định).",
    practiceNote: "Con đường độc nhất (Ekayano maggo) dẫn đến sự thanh tịnh cho chúng sanh và chấm dứt mọi khổ đau."
  },
  {
    term: "Khandha",
    pali: "Pañcakkhandha",
    vietnamese: "Năm Uẩn",
    category: "Thực tại Danh - Sắc",
    definition: "Năm tập hợp cấu thành con người: Sắc (Rūpa), Thọ (Vedanā), Tưởng (Saññā), Hành (Saṅkhāra), Thức (Viññāṇa).",
    practiceNote: "Cả 5 uẩn đều là vô thường, là khổ, là vô ngã; bám chấp vào 5 uẩn là gốc rễ của Khổ đau (Ngũ thủ uẩn giai khổ)."
  },
  {
    term: "Nīvaraṇa",
    pali: "Pañcanīvaraṇa",
    vietnamese: "Năm Triền Cái",
    category: "Chướng ngại tâm thức",
    definition: "Năm chướng ngại che lấp trí tuệ: 1. Tham dục (Kāmacchanda), 2. Sân độc (Byāpāda), 3. Hôn trầm thụy miên (Thīna-middha), 4. Trạo cử hối quá (Uddhacca-kukkucca), 5. Hoài nghi (Vicikicchā).",
    practiceNote: "Để đắc định hay thấy rõ thực tướng, hành giả phải dùng niệm và giác để nhận diện và dập tắt 5 triền cái."
  },
  {
    term: "Pāramī",
    pali: "Dasa Pāramī",
    vietnamese: "Thập Độ / Ba-la-mật",
    category: "Hạnh nguyện Bồ Tát",
    definition: "Mười phẩm hạnh toàn hảo cần tích lũy: Bố thí, Trì giới, Xuất gia, Trí tuệ, Tinh tấn, Nhẫn nại, Chân thật, Quyết đoán, Từ ái, Xả buông.",
    practiceNote: "Trong Phật giáo Theravāda, Bồ Tát (Bodhisatta) phải trải qua vô lượng kiếp thực hành viên mãn 10 Ba-la-mật để thành bậc Chánh Đẳng Chánh Giác."
  },
  {
    term: "Yonisomanasikāra",
    pali: "Yonisomanasikāra",
    vietnamese: "Như lý tác ý",
    category: "Nhân sinh thiện pháp",
    definition: "Tác ý đúng đắn, khéo léo, hướng tâm về cội nguồn chân lý, nhìn nhận sự vật theo đúng nhân duyên, vô thường, vô ngã.",
    practiceNote: "Là nhân duyên nội tại quan trọng bậc nhất để phát sinh Chánh kiến và đoạn trừ bất thiện pháp."
  },
  {
    term: "Brahmavihāra",
    pali: "Cattāro Brahmavihārā",
    vietnamese: "Tứ Vô Lượng Tâm (Phạm Trú)",
    category: "Tâm thức cao thượng",
    definition: "Bốn trạng thái tâm của bậc Phạm thiên: Từ (Mettā - mong chúng sanh an vui), Bi (Karuṇā - thương xót nỗi khổ tha nhân), Hỷ (Muditā - vui cùng hạnh phúc của người khác), Xả (Upekkhā - tâm bình thản trước mọi thịnh suy).",
    practiceNote: "Rải tâm từ khắp mười phương giải trừ hận thù, tạo môi trường thanh tịnh cho việc hành thiền."
  },
  {
    term: "Ājīvaṭṭhamakasīla",
    pali: "Ājīvaṭṭhamakasīla",
    vietnamese: "Chánh Mạng Bát Giới",
    category: "Giới luật cư sĩ",
    definition: "Tám giới lấy nuôi mạng chân chánh làm thứ 8: Kiêng sát sanh, trộm cắp, tà dâm, nói dối, nói đâm thọc, nói thô ác, nói lời vô ích, và mưu sinh bằng nghề bất chánh.",
    practiceNote: "Là nền tảng giới luật thanh tịnh tuyệt vời cho người Phật tử tại gia muốn tu tiến trí tuệ ngay trong cuộc sống nghề nghiệp."
  },
  {
    term: "Diṭṭhujukamma",
    pali: "Diṭṭhujukamma",
    vietnamese: "Kiến thị / Tri kiến chánh trực",
    category: "Phúc Hành Tông",
    definition: "Uốn nắn tri kiến cho ngay thẳng, hiểu đúng lý nhân quả, nghiệp báo, Tứ Thánh Đế, tin sâu vào Tam Bảo, dứt trừ tà kiến.",
    practiceNote: "Là mắt xích dẫn đầu trong 10 việc tạo phước; tri kiến có chánh trực thì việc bố thí, giữ giới mới thực sự trong sạch và hợp trí."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PALI_GLOSSARY;
}
