/**
 * Thư Viện Chánh Pháp - 244 Câu Hỏi Đáp Kinh Mi Tiên Vấn Đáp (Milinda Pañha)
 */
const MILINDA_PANHA_QUESTIONS = [
  {
    "id": 1,
    "title": "Danh (Nāma) - Dụ Cỗ Xe & Thực Tướng Vô Ngã",
    "category": "Vô ngã & Khởi đầu",
    "summary": "Vua hỏi ai là Na-tiên? Ngài Na-tiên chỉ ra thân thể, lục căn, ngũ uẩn không phải tự ngã bất biến; cũng như gọng, trục, bánh, căm xe ráp lại mới giả gọi là cỗ xe."
  },
  {
    "id": 2,
    "title": "Con số hạ lạp của Tỳ-kheo",
    "category": "Giới luật & Tăng sự",
    "summary": "Vấn đáp về số năm tu hành, sự tôn kính giữa người xuất gia và nếp sống tri túc của Tăng đoàn."
  },
  {
    "id": 3,
    "title": "Đàm thoại như một Trí giả hay như một Vương giả?",
    "category": "Phương pháp luận",
    "summary": "Trí giả đàm thoại cởi mở, tôn trọng chân lý, hoan hỷ khi được chỉ lỗi; Vương giả áp đặt quyền lực, ai trái ý sẽ bị trừng phạt."
  },
  {
    "id": 4,
    "title": "Thỉnh mời vào Hoàng cung",
    "category": "Hạnh Sa-môn",
    "summary": "Đức vua thỉnh ngài Na-tiên vào cung đàm đạo Chánh pháp cùng 500 vị Tỳ-kheo với tâm cung kính không vụ lợi."
  },
  {
    "id": 5,
    "title": "Mục đích tối thượng của sự xuất gia",
    "category": "Cứu cánh giải thoát",
    "summary": "Mục đích tối thượng: dập tắt hoàn toàn khổ đau cũ và ngăn chặn không cho mầm mống khổ đau mới sinh khởi, tiến đến giải thoát Niết-bàn."
  },
  {
    "id": 6,
    "title": "Tái sanh và Không tái sanh",
    "category": "Nghiệp & Tái sinh",
    "summary": "Kẻ còn tham sân si phiền não thì còn tái sanh; bậc đã dập tắt vô minh lậu hoặc thì chứng vô sanh, chấm dứt luân hồi."
  },
  {
    "id": 7,
    "title": "Chú tâm và Trí tuệ",
    "category": "Tâm lý học Phật giáo",
    "summary": "Sự phân biệt giữa tác ý chú tâm (Manasikāra - gom giữ tâm thức) và Trí tuệ (Paññā - soi sáng cắt đứt phiền não)."
  },
  {
    "id": 8,
    "title": "Hành tướng của chú tâm và trí tuệ cùng sự khác nhau giữa chúng",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của chú tâm và trí tuệ cùng sự khác nhau giữa chúng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 9,
    "title": "Tất cả Pháp lành lấy Giới làm sở y",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tất cả Pháp lành lấy Giới làm sở y\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 10,
    "title": "Hành tướng của Tín",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tín\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 11,
    "title": "Hành tướng của Tấn",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tấn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 12,
    "title": "Hành tướng của Niệm",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Niệm\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 13,
    "title": "Hành tướng của Định",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Định\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 14,
    "title": "Hành tướng của Tuệ",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tuệ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 15,
    "title": "Ngũ căn - riêng và chung",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ngũ căn - riêng và chung\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 16,
    "title": "Tương quan thân trước và sau",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tương quan thân trước và sau\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 17,
    "title": "Tái sanh và Vô sanh",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tái sanh và Vô sanh\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 18,
    "title": "Trí và Tuệ (nana-panna)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Trí và Tuệ (nana-panna)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 19,
    "title": "Bậc vô sanh có còn đau khổ không?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bậc vô sanh có còn đau khổ không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 20,
    "title": "Cảm Thọ",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cảm Thọ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 21,
    "title": "Cái gì dẫn dắt đi tái sanh?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cái gì dẫn dắt đi tái sanh?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 22,
    "title": "Không nên hỏi lại câu đã hỏi",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Không nên hỏi lại câu đã hỏi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 23,
    "title": "Danh sắc tương quan liên hệ",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Danh sắc tương quan liên hệ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 24,
    "title": "Thời gian và không còn thời gian",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thời gian và không còn thời gian\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 25,
    "title": "Nguyên nhân của thời gian",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nguyên nhân của thời gian\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 26,
    "title": "Thời gian tối sơ?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thời gian tối sơ?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 27,
    "title": "Có rồi không, Không rồi có!",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Có rồi không, Không rồi có!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 28,
    "title": "Pháp hành thì sao?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Pháp hành thì sao?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 29,
    "title": "Tự nhiên sanh?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tự nhiên sanh?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 30,
    "title": "Tự ngã trong thân?",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tự ngã trong thân?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 31,
    "title": "Nhãn thức và tâm thức (Cakkhu vinnana - Mano vinnana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nhãn thức và tâm thức (Cakkhu vinnana - Mano vinnana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 32,
    "title": "Hành tướng của Xúc (Phassalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Xúc (Phassalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 33,
    "title": "Hành tướng của Thọ (Vedanalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Thọ (Vedanalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 34,
    "title": "Hành tướng của Tưởng (Sannalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tưởng (Sannalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 35,
    "title": "Hành tướng của Tác Ý (Cetanalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tác Ý (Cetanalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 36,
    "title": "Hành tướng của Thức (Vinnanalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Thức (Vinnanalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 37,
    "title": "Hành tướng của Tầm (Vitakkalakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tầm (Vitakkalakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 38,
    "title": "Hành tướng của Tứ (hay Sát) (Vicaralakkhana)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hành tướng của Tứ (hay Sát) (Vicaralakkhana)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 39,
    "title": "Lại hỏi về \"Chú tâm\" (Manasikàra)",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Lại hỏi về \"Chú tâm\" (Manasikàra)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 40,
    "title": "Những tâm sở đồng sanh",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Những tâm sở đồng sanh\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 41,
    "title": "Về năm giác quan",
    "category": "Tâm lý học & Các Pháp",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về năm giác quan\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 42,
    "title": "Bất bình đẳng sai khác của chúng sanh là do nghiệp",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bất bình đẳng sai khác của chúng sanh là do nghiệp\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 43,
    "title": "Sớm ngăn ngừa điều ác",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sớm ngăn ngừa điều ác\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 44,
    "title": "Lửa địa ngục",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Lửa địa ngục\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 45,
    "title": "Nước dựa khí",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nước dựa khí\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 46,
    "title": "Niết bàn",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Niết bàn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 47,
    "title": "Ai sẽ đắc Niết bàn?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ai sẽ đắc Niết bàn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 48,
    "title": "Làm sao biết Niết bàn là tối thượng lạc?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Làm sao biết Niết bàn là tối thượng lạc?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 49,
    "title": "Có Phật không?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Có Phật không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 50,
    "title": "Phật là tối thượng tôn bảo",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phật là tối thượng tôn bảo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 51,
    "title": "Phật tối thắng như thế nào?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phật tối thắng như thế nào?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 52,
    "title": "Thấy Phật",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thấy Phật\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 53,
    "title": "Khi chết ngũ uẩn diệt theo",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Khi chết ngũ uẩn diệt theo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 54,
    "title": "Vedagù?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vedagù?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 55,
    "title": "Nếu chết mà diệt hết thì thoát khỏi nghiệp",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nếu chết mà diệt hết thì thoát khỏi nghiệp\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 56,
    "title": "Nghiệp trú ở đâu?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nghiệp trú ở đâu?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 57,
    "title": "Biết còn tái sanh?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Biết còn tái sanh?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 58,
    "title": "Phật ở đâu?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phật ở đâu?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 59,
    "title": "Thương yêu cái thân?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thương yêu cái thân?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 60,
    "title": "Bậc toàn giác biết tất cả?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bậc toàn giác biết tất cả?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 61,
    "title": "Tại sao Phật không giống cha mẹ ngài?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Phật không giống cha mẹ ngài?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 62,
    "title": "Thực hành phạm hạnh (Brahmacàri)",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thực hành phạm hạnh (Brahmacàri)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 63,
    "title": "Ai truyền cụ túc giới cho Đức Phật?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ai truyền cụ túc giới cho Đức Phật?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 64,
    "title": "Nước mắt nào là thuốc? Nước mắt nào là độc dược?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nước mắt nào là thuốc? Nước mắt nào là độc dược?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 65,
    "title": "Tham luyến và dứt tham luyến",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tham luyến và dứt tham luyến\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 66,
    "title": "Trí tuệ ở đâu?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Trí tuệ ở đâu?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 67,
    "title": "Luân hồi (Samsara)",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Luân hồi (Samsara)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 68,
    "title": "Trí nhớ",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Trí nhớ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 69,
    "title": "Ai cũng có trí nhớ",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ai cũng có trí nhớ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 70,
    "title": "Có bao nhiêu loại trí nhớ",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Có bao nhiêu loại trí nhớ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 71,
    "title": "Tương quan phước và tội",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tương quan phước và tội\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 72,
    "title": "Diệt khổ chưa đến?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Diệt khổ chưa đến?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 73,
    "title": "Cõi Phạm Thiên bao xa?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cõi Phạm Thiên bao xa?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 74,
    "title": "Thời gian tái sanh",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thời gian tái sanh\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 75,
    "title": "Sự liên hệ giữa kiếp này với kiếp kia",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sự liên hệ giữa kiếp này với kiếp kia\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 76,
    "title": "Vào cửa nào để đầu thai?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vào cửa nào để đầu thai?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 77,
    "title": "Nhân sanh giác ngộ",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nhân sanh giác ngộ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 78,
    "title": "Điều lành nhỏ, phước quả lớn; Điều ác lớn, tội báo nhỏ",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Điều lành nhỏ, phước quả lớn; Điều ác lớn, tội báo nhỏ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 79,
    "title": "Kẻ trí làm điều ác, tội báo nhỏ; Người ngu làm điều ác tội báo lớn",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Kẻ trí làm điều ác, tội báo nhỏ; Người ngu làm điều ác tội báo lớn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 80,
    "title": "Bay bằng thân",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bay bằng thân\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 81,
    "title": "Xương dài 100 do tuần",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Xương dài 100 do tuần\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 82,
    "title": "Biển",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Biển\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 83,
    "title": "Ngưng hơi thở",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ngưng hơi thở\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 84,
    "title": "Pháp xuất thế gian",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Pháp xuất thế gian\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 85,
    "title": "Tuệ xuất thế gian nằm ở đâu?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tuệ xuất thế gian nằm ở đâu?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 86,
    "title": "Vấn đề số 86",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vấn đề số 86\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 87,
    "title": "Vấn đề số 87",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vấn đề số 87\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 88,
    "title": "Thì giờ phải lẽ rồi",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thì giờ phải lẽ rồi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 89,
    "title": "Phật và chư tăng, ai phước báu nhiều hơn?",
    "category": "Nghiệp, Tái sinh & Niết-bàn",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phật và chư tăng, ai phước báu nhiều hơn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 90,
    "title": "Lễ bái, cúng dường Xá lợi, Kim thân Phật, cây Bồ-đề... không có",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Lễ bái, cúng dường Xá lợi, Kim thân Phật, cây Bồ-đề... không có\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 91,
    "title": "Đức Phật có toàn giác không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Phật có toàn giác không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 92,
    "title": "Đức Thế Tôn có tâm Đại bi hay không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Thế Tôn có tâm Đại bi hay không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 93,
    "title": "Nghi vấn về sự Bố thí ba-la-mật",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nghi vấn về sự Bố thí ba-la-mật\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 94,
    "title": "Bố thí hai mắt lại được thiên nhãn",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bố thí hai mắt lại được thiên nhãn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 95,
    "title": "Hoài nghi về sự thụ thai",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hoài nghi về sự thụ thai\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 96,
    "title": "Nghi về thời gian giáo pháp tồn tại",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nghi về thời gian giáo pháp tồn tại\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 97,
    "title": "Đức Thế Tôn còn khổ chút ít nào không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Thế Tôn còn khổ chút ít nào không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 98,
    "title": "Đức thế tôn đã thật sự hoàn tất mọi phận sự chưa?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức thế tôn đã thật sự hoàn tất mọi phận sự chưa?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 99,
    "title": "Tại sao Đức Thế Tôn không dùng \"Tứ như ý túc\" để duy trì thọ",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Đức Thế Tôn không dùng \"Tứ như ý túc\" để duy trì thọ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 100,
    "title": "Chánh pháp của Đức Thế Tôn có vẻ không được toàn hảo?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Chánh pháp của Đức Thế Tôn có vẻ không được toàn hảo?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 101,
    "title": "Tại sao có những câu hỏi mà Đức Thế Tôn làm thinh không trả",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao có những câu hỏi mà Đức Thế Tôn làm thinh không trả\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 102,
    "title": "Chúng sanh sợ hãi diêm chúa?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Chúng sanh sợ hãi diêm chúa?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 103,
    "title": "Tụng kinh Paritta thật không có lợi ích!",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tụng kinh Paritta thật không có lợi ích!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 104,
    "title": "Oai lực của Đức Phật thua ma vương?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Oai lực của Đức Phật thua ma vương?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 105,
    "title": "Vì Đức Phật thuyết pháp mà làm cho sáu mươi vị tỳ kheo hộc",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vì Đức Phật thuyết pháp mà làm cho sáu mươi vị tỳ kheo hộc\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 106,
    "title": "Bậc Thánh cư sĩ sao lại phải đảnh lễ, cúng dường phàm Tăng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bậc Thánh cư sĩ sao lại phải đảnh lễ, cúng dường phàm Tăng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 107,
    "title": "Giáo hội của Đức Tôn Sư có bị phân ly, chia rẽ không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Giáo hội của Đức Tôn Sư có bị phân ly, chia rẽ không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 108,
    "title": "Tỳ kheo tạo nghiệp do không biết, tại sao lại không có tội?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tỳ kheo tạo nghiệp do không biết, tại sao lại không có tội?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 109,
    "title": "Đức Thế Tôn có lãnh đạo, bảo quản giáo hội tỳ khưu không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Thế Tôn có lãnh đạo, bảo quản giáo hội tỳ khưu không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 110,
    "title": "Tại sao Đức Thế Tôn không thu thúc lục căn?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Đức Thế Tôn không thu thúc lục căn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 111,
    "title": "Sao Đức Thế Tôn lại có lời nói khiếm nhã?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sao Đức Thế Tôn lại có lời nói khiếm nhã?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 112,
    "title": "Cái cây có tâm ý không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cái cây có tâm ý không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 113,
    "title": "Bữa cơm của Cunda có vấn đề!",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bữa cơm của Cunda có vấn đề!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 114,
    "title": "Tại sao chư Tăng không được cúng dường nhục thân Như Lai?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao chư Tăng không được cúng dường nhục thân Như Lai?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 115,
    "title": "Quả đất dường như có tâm thức?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Quả đất dường như có tâm thức?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 116,
    "title": "Đức Phật thuyết về bố thí là để nhận được lợi lộc cúng dường?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Phật thuyết về bố thí là để nhận được lợi lộc cúng dường?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 117,
    "title": "Tại sao Đức Thế Tôn không muốn thuyết pháp sau khi đắc đạo?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Đức Thế Tôn không muốn thuyết pháp sau khi đắc đạo?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 118,
    "title": "Ai là thầy của Đức Thế Tôn?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Ai là thầy của Đức Thế Tôn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 119,
    "title": "Vấn đề số 119",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Vấn đề số 119\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 120,
    "title": "Có nên hoan hỷ không khi người ta tán dương Tam Bảo?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Có nên hoan hỷ không khi người ta tán dương Tam Bảo?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 121,
    "title": "Sao Đức Thế Tôn lại dùng lời ác khẩu, ác ngữ?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sao Đức Thế Tôn lại dùng lời ác khẩu, ác ngữ?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 122,
    "title": "Đức Thế Tôn còn bất bình, sân hận!",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Thế Tôn còn bất bình, sân hận!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 123,
    "title": "Phải chăng Đức Thế Tôn không có tâm bi mẫn?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phải chăng Đức Thế Tôn không có tâm bi mẫn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 124,
    "title": "Phẩm mạo xuất gia cao siêu đến cỡ nào?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phẩm mạo xuất gia cao siêu đến cỡ nào?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 125,
    "title": "Đời sống Sa-môn vô tru, như nai trong rừng, sao lại xây chùa, tạo",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đời sống Sa-môn vô tru, như nai trong rừng, sao lại xây chùa, tạo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 126,
    "title": "Tại sao Đức Thế Tôn không thu thúc cái bụng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Đức Thế Tôn không thu thúc cái bụng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 127,
    "title": "Đức Phật muốn che dấu Pháp?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Phật muốn che dấu Pháp?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 128,
    "title": "Lý do nặng nhẹ của tội nói dối!",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Lý do nặng nhẹ của tội nói dối!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 129,
    "title": "Phước báu của Đức Thế Tôn không ưu thắng, tối thượng bằng đệ",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Phước báu của Đức Thế Tôn không ưu thắng, tối thượng bằng đệ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 130,
    "title": "Thần thông của đức Mục-kiền-liên không đương cự nổi thần lực",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thần thông của đức Mục-kiền-liên không đương cự nổi thần lực\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 131,
    "title": "Kiếp áp chót, tại cung trời Đẩu suất, Đức Bồ-tát quán xét thế",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Kiếp áp chót, tại cung trời Đẩu suất, Đức Bồ-tát quán xét thế\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 132,
    "title": "Rơi đi bằng phi pháp? Rơi đi bằng pháp? Cắt đứt sự rơi?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Rơi đi bằng phi pháp? Rơi đi bằng pháp? Cắt đứt sự rơi?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 133,
    "title": "Tâm từ vô lượng không tiêu trừ được các sự họa hại?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tâm từ vô lượng không tiêu trừ được các sự họa hại?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 134,
    "title": "Quả của thiện và ác nghiệp rất lạ lùng",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Quả của thiện và ác nghiệp rất lạ lùng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 135,
    "title": "Sự tà hạnh của người nữ?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sự tà hạnh của người nữ?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 136,
    "title": "Các vị A la hán còn sợ hãi?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Các vị A la hán còn sợ hãi?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 137,
    "title": "Đức Phật dạy cắt đứt sợ hãi?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Phật dạy cắt đứt sợ hãi?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 138,
    "title": "Cái gì nơi Đức Thế Tôn là cao quý không ai sánh bằng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cái gì nơi Đức Thế Tôn là cao quý không ai sánh bằng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 139,
    "title": "Đức Thế Tôn là người khai sáng Đạo hay Đạo có sẵn từ ngàn",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Thế Tôn là người khai sáng Đạo hay Đạo có sẵn từ ngàn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 140,
    "title": "Đức Phật từ bỏ sự tinh tấn, lại khuyên đệ tử nên tinh tấn?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đức Phật từ bỏ sự tinh tấn, lại khuyên đệ tử nên tinh tấn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 141,
    "title": "Tại sao có sự đắc quả nhanh, chậm khác nhau?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao có sự đắc quả nhanh, chậm khác nhau?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 142,
    "title": "Về cư sĩ A-la-hán",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cư sĩ A-la-hán\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 143,
    "title": "Tại sao bồ tát Loma Kassapa giết hại chúng sanh để tế lễ?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao bồ tát Loma Kassapa giết hại chúng sanh để tế lễ?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 144,
    "title": "Tượng vương Chaddanta thì cung kính y cà sa - mà bồ-tát",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tượng vương Chaddanta thì cung kính y cà sa - mà bồ-tát\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 145,
    "title": "Về cái nhà không mái của người thợ gốm?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cái nhà không mái của người thợ gốm?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 146,
    "title": "Tại sao có lúc Đức Phật xưng mình là bà-la-môn, có khi xưng",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao có lúc Đức Phật xưng mình là bà-la-môn, có khi xưng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 147,
    "title": "Tại sao không có hai Đức Phật xuất hiện một lần?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao không có hai Đức Phật xuất hiện một lần?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 148,
    "title": "Không nên cho kẻ phàm tục xuất gia trong giáo hội thanh tịnh",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Không nên cho kẻ phàm tục xuất gia trong giáo hội thanh tịnh\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 149,
    "title": "Thân thọ khổ, tâm có thọ khổ chăng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thân thọ khổ, tâm có thọ khổ chăng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 150,
    "title": "Giải thêm về \"tâm không động\"",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Giải thêm về \"tâm không động\"\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 151,
    "title": "Người đã phạm \"bất cộng trụ\", xin tu lại, có đắc được đạo quả",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Người đã phạm \"bất cộng trụ\", xin tu lại, có đắc được đạo quả\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 152,
    "title": "Cư sĩ phá giới và sa môn phá giới, hậu quả tội lỗi nặng nhẹ ra",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cư sĩ phá giới và sa môn phá giới, hậu quả tội lỗi nặng nhẹ ra\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 153,
    "title": "Nước có sanh mạng chăng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Nước có sanh mạng chăng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 154,
    "title": "(Trùng với câu hỏi 141)",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"(Trùng với câu hỏi 141)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 155,
    "title": "Trên thế gian này cái gì không sanh?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Trên thế gian này cái gì không sanh?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 156,
    "title": "Bậc A-la-hán còn phạm giới?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Bậc A-la-hán còn phạm giới?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 157,
    "title": "Cái gì không do nhân, nghiệp, thời tiết sanh?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cái gì không do nhân, nghiệp, thời tiết sanh?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 158,
    "title": "(Trùng với câu hỏi 157)",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"(Trùng với câu hỏi 157)\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 159,
    "title": "Sao không thấy tử thi của dạ xoa?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Sao không thấy tử thi của dạ xoa?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 160,
    "title": "Tại sao Đức Thế Tôn không cấm chế giới luật một lần?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao Đức Thế Tôn không cấm chế giới luật một lần?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 161,
    "title": "Mặt trời có bệnh chăng?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Mặt trời có bệnh chăng?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 162,
    "title": "Lại bệnh của mặt trời nữa!",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Lại bệnh của mặt trời nữa!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 163,
    "title": "Về chuyện Bồ tát Vessantara bố thí vợ con.",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chuyện Bồ tát Vessantara bố thí vợ con.\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 164,
    "title": "Chư Phật quá khứ có tu khổ hạnh không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Chư Phật quá khứ có tu khổ hạnh không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 165,
    "title": "Năng lực của thiện và ác nghiệp, cái nào mạnh hơn?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Năng lực của thiện và ác nghiệp, cái nào mạnh hơn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 166,
    "title": "Hồi hướng phước có hiệu quả không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hồi hướng phước có hiệu quả không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 167,
    "title": "Hồi hướng \"ác\" có được không?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Hồi hướng \"ác\" có được không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 168,
    "title": "Tại sao có chiêm bao?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao có chiêm bao?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 169,
    "title": "Chết đúng thời và chết không đúng thời",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Chết đúng thời và chết không đúng thời\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 170,
    "title": "Tại sao nhập Niết bàn lại có hiện tượng phi thường?",
    "category": "Hoài Nghi Nút Thắt (Mendaka)",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao nhập Niết bàn lại có hiện tượng phi thường?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 171,
    "title": "Chúng sanh nào có khả năng đắc đạo?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Chúng sanh nào có khả năng đắc đạo?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 172,
    "title": "Niết bàn có xen lẫn khổ?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Niết bàn có xen lẫn khổ?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 173,
    "title": "Tại sao không diễn tả Niết bàn một cách cụ thể?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Tại sao không diễn tả Niết bàn một cách cụ thể?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 174,
    "title": "Làm cho rõ Niết bàn?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Làm cho rõ Niết bàn?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 175,
    "title": "Niết bàn không ở đâu cả!",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Niết bàn không ở đâu cả!\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 176,
    "title": "Có ai thấy Phật không?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Có ai thấy Phật không?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 177,
    "title": "Đầu đà khổ hạnh có ích lợi gì?",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Đầu đà khổ hạnh có ích lợi gì?\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 178,
    "title": "Về con lừa",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con lừa\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 179,
    "title": "Về con gà",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con gà\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 180,
    "title": "Về con sóc",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con sóc\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 181,
    "title": "Về con cọp cái",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con cọp cái\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 182,
    "title": "Về con cọp đực",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con cọp đực\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 183,
    "title": "Về con rùa nước",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con rùa nước\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 184,
    "title": "Về cái kèn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cái kèn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 185,
    "title": "Về cây súng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cây súng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 186,
    "title": "Về con quạ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con quạ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 187,
    "title": "Về con khỉ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con khỉ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 188,
    "title": "Về dây bầu leo",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về dây bầu leo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 189,
    "title": "Về hoa sen",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về hoa sen\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 190,
    "title": "Về hạt giống",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về hạt giống\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 191,
    "title": "Cây Sàla xanh tốt",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Cây Sàla xanh tốt\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 192,
    "title": "Về chiếc thuyền",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chiếc thuyền\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 193,
    "title": "Về ghe thuyền dính đá ngầm",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về ghe thuyền dính đá ngầm\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 194,
    "title": "Về cột buồm",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cột buồm\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 195,
    "title": "Về người cầm lái thuyền",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người cầm lái thuyền\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 196,
    "title": "Về người làm công",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người làm công\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 197,
    "title": "Về biển cả",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về biển cả\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 198,
    "title": "Về quả đất",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về quả đất\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 199,
    "title": "Về nước",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về nước\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 200,
    "title": "Về lửa",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về lửa\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 201,
    "title": "Về gió",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về gió\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 202,
    "title": "Về núi",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về núi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 203,
    "title": "Về hư không",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về hư không\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 204,
    "title": "Về mặt trăng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về mặt trăng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 205,
    "title": "Về mặt trời",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về mặt trời\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 206,
    "title": "Về trời Đế thích",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về trời Đế thích\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 207,
    "title": "Về Chuyển luân Thánh vương",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về Chuyển luân Thánh vương\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 208,
    "title": "Về con mối",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con mối\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 209,
    "title": "Về con mèo",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con mèo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 210,
    "title": "Về con chuột",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con chuột\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 211,
    "title": "Về con bò cạp",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con bò cạp\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 212,
    "title": "Về con chồn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con chồn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 213,
    "title": "Về chó rừng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chó rừng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 214,
    "title": "Về con nai",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con nai\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 215,
    "title": "Về con bò",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con bò\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 216,
    "title": "Về con heo",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con heo\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 217,
    "title": "Về con voi",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con voi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 218,
    "title": "Về sư tử",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về sư tử\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 219,
    "title": "Về vịt nước",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về vịt nước\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 220,
    "title": "Về chim Venàhikà mái",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chim Venàhikà mái\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 221,
    "title": "Về chim sẻ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chim sẻ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 222,
    "title": "Về chim cu",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về chim cu\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 223,
    "title": "Về con rít",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con rít\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 224,
    "title": "Về con dơi",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con dơi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 225,
    "title": "Về con đỉa",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con đỉa\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 226,
    "title": "Về con rắn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con rắn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 227,
    "title": "Về con trăn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con trăn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 228,
    "title": "Về nhện giăng lưới",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về nhện giăng lưới\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 229,
    "title": "Về hài nhi",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về hài nhi\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 230,
    "title": "Về rùa vàng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về rùa vàng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 231,
    "title": "Về rừng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về rừng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 232,
    "title": "Về cây đại thọ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cây đại thọ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 233,
    "title": "Về mưa",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về mưa\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 234,
    "title": "Về ngọc mani",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về ngọc mani\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 235,
    "title": "Về người săn bắn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người săn bắn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 236,
    "title": "Về người câu cá",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người câu cá\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 237,
    "title": "Về thợ bào gỗ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về thợ bào gỗ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 238,
    "title": "Về người thợ gốm",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người thợ gốm\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 239,
    "title": "Về con quạ",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về con quạ\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 240,
    "title": "Về cái dù",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về cái dù\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 241,
    "title": "Về đám ruộng",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về đám ruộng\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 242,
    "title": "Thuốc trị độc rắn",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Thuốc trị độc rắn\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 243,
    "title": "Về vật thực",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về vật thực\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  },
  {
    "id": 244,
    "title": "Về người bắn cung",
    "category": "Pháp Hành & Ẩn Dụ Tu Tập",
    "summary": "Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: \"Về người bắn cung\". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại."
  }
];

if (typeof module !== "undefined" && module.exports) { module.exports = MILINDA_PANHA_QUESTIONS; }
