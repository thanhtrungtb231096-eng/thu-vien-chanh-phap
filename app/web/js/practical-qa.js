/**
 * Thư Viện Chánh Pháp - 220 Vấn Đáp Thực Hành Chánh Niệm & Đời Sống
 */
const PRACTICAL_QA_DATA = [
  {
    "id": 1,
    "question": "Thế nào là giữ chánh niệm trong cuộc sống  hằng ngày?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Luôn nhớ nghĩ đến những điều chân chánh, để tránh khởi lên những tâm bất thiện tham, sân, si thì đó là giữ chánh niệm. Ví dụ như luôn ghi nhận các oai nghi đi, đứng, nằm, ngồi… hoặc là tưởng nhớ đến ân đức Phật, Pháp, Tăng, tưởng nhớ đến các giới thanh tịnh mà mình đang thọ trì, tưởng nhớ đến những việc làm bố thí, tưởng nhớ về đức hạnh chư thiên có trong mình, tưởng niệm về sự chết, rải tâm từ, niệm hơi thở vào ra, niệm về sắc thân tứ đại, niệm về năm uẩn luôn sinh diệt, nó vô thường, khổ, vô n..."
  },
  {
    "id": 2,
    "question": "Các nhà khoa học cho rằng con người là từ  loài vượn tiến hóa thành người nguyên thủy,  rồi thành người tinh khôn. Một số tôn giáo thì  cho rằng Thượng Đế tạo ra con người và thế  giới - còn đối với Đạo Phật thì giải thích như thế  nào về nguồn gốc loài người và thế giới này?",
    "category": "Giới luật & Ăn uống",
    "answer": "Theo Giáo Pháp của Đức Phật thì con người và tất cả chúng sinh đang ở trong vòng luân hồi tái sinh, từ kiếp sống này sang kiếp sống khác. Cả thế 4 giới đất trời cũng trải qua sự sinh, trụ, hoại, diệt, từ đại kiếp này, sang đại kiếp khác. Trong kinh Khởi Thế Nhân Bổn, Đức Phật đã nói về điều này; Thế giới này trải qua một thời gian dài an trú, rồi đến một ngày sẽ phải hoại diệt, hoặc bốc cháy bằng lửa; lửa cháy từ quả đất này lên đến các cõi trời Dục Giới và lên đến"
  },
  {
    "id": 3,
    "question": "Đa số các Phật tử tại gia không phân biệt  được đâu là tín ngưỡng - đâu là Đạo Phật - Sư  có thể giải thích cho các Phật tử hiểu về sự khác  nhau giữa tín ngưỡng và Phật Pháp không?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Ở trong dân gian có rất nhiều hình thức tín ngưỡng, không thuộc tôn giáo, và hình thức tín ngưỡng thuộc tôn giáo. Như tín ngưỡng thờ Thánh, Thần ở đền đình, miếu mạo, tín ngưỡng thờ Mẫu, tín ngưỡng thờ Tổ Tiên ở tại gia, hoặc phủ điện… Những tín ngưỡng ấy ở trong dân gian, không thuộc về tôn giáo, thuộc về văn hóa truyền thống của mỗi địa phương khác nhau, thì có các hình thức tín ngưỡng khác nhau. Đó là tín ngưỡng dân gian. Còn tín ngưỡng thuộc về tôn giáo như Đạo Phật"
  },
  {
    "id": 4,
    "question": "Người Phật tử tại gia thờ cúng ông bà tổ  tiên - vậy các vị gia tiên có ngự ở ban thờ không  - và việc thờ cúng như thế nào là mê tín không  có lợi ích, như thế nào là chánh tín có lợi ích?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Theo giáo Pháp của Đức Phật thì một người sau khi chết sẽ đi tái sinh sang một kiếp sống mới ngay tức thì, có khi tái sinh làm chư thiên, làm người, là súc sinh… Một số người có thể tái sinh làm quỷ thần, có thể còn quanh quẩn với người thân. Nhưng họ cũng có cuộc sống riêng có phận sự phải làm chứ không ngồi yên một chỗ, (không phải lúc nào cũng ngự ở ban thờ). Vậy việc lập ban thờ chỉ là hình tướng, để hướng về cội nguồn, tưởng nhớ, tri ân đến tổ tông tiền bối là chính. Giống như tôn thờ Đức P..."
  },
  {
    "id": 5,
    "question": "Có sự khác biệt gì giữa sự thờ Phật và tôn  thờ và các vị gia tiên?",
    "category": "Giáo lý Căn bản",
    "answer": "Tôn thờ Phật là để tưởng nhớ đến một bậc giác ngộ, giải thoát. Khi lễ Phật là lễ đức tính giác ngộ, giải thoát ấy, khi cúng dàng Phật là cúng dàng đức tính giác ngộ, giải thoát ấy, làm cho mình tăng trưởng công đức, phước lành, tăng trưởng đức tin và thực hành theo lời Phật dạy để hướng đến sự giác ngộ, giải thoát trong tương lai giống như Đức Phật vậy. Việc thờ cúng ông bà tiên tổ là để mình tưởng nhớ đến cội nguồn tổ tiên, nhờ ghi nhớ cội nguồn tổ tiên như vậy, mình cũng ghi nhớ được những bà ..."
  },
  {
    "id": 6,
    "question": "Quan điểm của Đạo Phật về các vị thần linh  như thế nào - Đức Phật có cho các đệ tử tôn thờ,  hay không tôn thờ thần linh không? 8",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Các vị Thần Linh trong dân gian là các vị chư thiên ngự ở các nơi trên mặt đất, như Sơn Thần, Thổ Địa, Thọ Thần, Hà Bá… là các vị chư thiên thấp nhất trong hàng thiên chúng, họ có tâm lý, tư tưởng cũng gần giống cõi người, có vị nhiều phiễn não, tham, sân, si, ưa làm việc bất thiện, có vị ít phiền não, ưa làm việc thiện…cũng giống như con người ở thế gian. Đức Phật không khuyến khích việc tôn thờ chư thiên, cũng không ngăn cản việc đó. Đức Phật có dạy hãy rải lòng từ đến chư thiên, khi tạo phước..."
  },
  {
    "id": 7,
    "question": "Vấn đề ăn chay trong đạo Phật có do Đức  Phật giảng dạy không - nó có liên quan gì đến  việc tu hành đắc đạo không. Tại sao lại có người  ăn chay, có người thì không?",
    "category": "Giới luật & Ăn uống",
    "answer": "Ăn chay là một tục lệ phát sinh sau này, không có bài kinh nào Đức Phật dạy phải ăn chay, hay là không được ăn chay. Đức Phật chỉ dạy không nuôi sống bằng tà mạng, và không bị trói buộc, không có lỗi lầm với thức ăn là được. Việc tu hành đắc đạo không liên quan đến việc ăn chay, hay ăn mặn. Bản thân Đức Phật và các Bậc Thánh Đệ tử trước khi đắc đạo và sau khi đã đắc đạo đều không ăn chay, mặc dù 9 văn hóa ăn chay đã có từ trước thời Đức Phật. Một số"
  },
  {
    "id": 8,
    "question": "Một người tu tập đến mức độ nào thì có thể  thấy được kiếp trước của mình và biết được  kiếp sau mình sẽ tái sinh về đâu?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Có hai pháp tu tập để thấy được kiếp trước và kiếp sau của chính mình: Một là tu tập tứ thiền, bát định trên 10 kasina, thực hành làm chủ tâm theo mười bốn pháp thuần thục để phát triển túc mạng trí thì có thể thấy được các kiếp sống quá khứ, tương lai. Hai là thực hành thiền tuệ, sau khi đã phân biệt được danh, sắc ở bên trong và bên ngoài, đến giai đoạn quán pháp duyên sinh. Vị ấy nương vào danh sắc của nghiệp luân và phiền não luân để hướng về"
  },
  {
    "id": 9,
    "question": "Các nhà ngoại cảm nói rằng họ tiếp xúc  được với hầu hết những người đã chết, họ kể  chi tiết được những việc đã xảy ra của người  khi còn sống - như vậy hiện tượng đó có đúng  không và nên hiểu nó như thế nào theo quan  điểm của đạo Phật?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Theo Giáo Pháp của Đức Phật một người khi lâm chung sẽ tùy theo những nghiệp thiện, ác của mình đã tạo mà đi tái sinh về một kiếp sống mới, họ sẽ có một thân ngũ uẩn mới, không còn giống với hình dáng của thân ngũ uẩn hiện tại nữa. Các nhà ngoại cảm thì luôn thấy người chết rồi sẽ có một linh hồn tồn tại, có hình dạng giống như khi còn sống, cả tâm lý, tính cách không có gì thay đổi. Đó là một loại tà kiến chấp thường, cho rằng có một linh hồn tồn tại vĩnh hằng, đó có thể là sự ảo tưởng của một ..."
  },
  {
    "id": 10,
    "question": "Một người muốn đi xuất gia thì cần có  những tiêu chuẩn gì không - và có phải trải qua  những sự thử thách gì không?",
    "category": "Giáo lý Căn bản",
    "answer": "Theo luật Phật chế người đi xuất gia phải có đủ sáu căn không thiếu khuyết, tức là người không bị mù, điếc, câm, bại liệt, tâm thần. Là người không mắc nợ, không mắc bệnh truyền nhiễm, không đồng tính luyến ái…Khi được một vị thầy tế độ cho xuất gia rồi 11 vị ấy sẽ được chỉ dạy cho những luật nghi, phép tắc, nề nếp lối sống và những phận sự cần thiết của người xuất gia. Có những pháp cần phải học, có những pháp cần phải thực hành. Mục đích của vị ấy cần hướng"
  },
  {
    "id": 11,
    "question": "Một người xuất gia trong thời gian bao lâu  thì có thể ra làm trụ trì, giảng dạy Phật pháp và  tiếp độ đệ tử?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Việc làm trụ trì thì không quy định trong Giới Luật, khi có thí chủ xây dựng một ngôi tịnh xá rồi cúng dàng đến cá nhân một vị Tỳ kheo nào đó thì vị ấy là trụ trì. Vậy vị Tỳ kheo ấy ít nhất cũng phải là vị đã trưởng thành và có năng lực thì mới có thể biết được những phận sự cần phải làm với ngôi tịnh xá ấy. Việc giảng dạy Giáo Pháp cũng không quy định về thời gian, vị nào có đủ trình độ, năng lực thì có thể làm. Việc tiếp độ đệ tử thì có được quy định trong Giới Luật, vị đó phải là người am hiể..."
  },
  {
    "id": 12,
    "question": "Trong kinh Đức Phật dạy: hãy nương tựa  vào Pháp chứ đừng nương tựa vào ai khác -  trong luật thì Đức Phật quy định người xuất  gia năm năm đầu phải nương tựa vào một vị  thầy - điều này có ý nghĩa như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vị thầy là người có kiến thức về pháp học và có kinh nghiệm về pháp hành, người học trò cần phải 12 nương tựa vị thầy để học hỏi, tiếp nhận pháp, nếu không sẽ dễ hiểu sai và thực hành sai pháp thì sẽ gặp nguy hiểm. Nương tựa vị thầy là nương tựa vào pháp của vị thầy chứ không phải nương tựa vào con người vị thầy ấy, (y pháp bất y nhân) vị ấy thừa tự pháp chứ không thừa tự tài vật. Khi bản thân mình đã có đủ kiến thức pháp học và kinh nghiệm pháp hành vững"
  },
  {
    "id": 13,
    "question": "Người nghèo khổ là do đời trước bỏn xẻn  không bố thí cúng dàng - nay mình bố thí cho  họ thì có khiến cho họ mắc nợ rồi kiếp sau lại  nghèo khổ nữa không - có cách nào giúp họ  thoát khổ lâu dài không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Người nghèo thọ nhận vật của người khác cho vì không lấy trộm cắp nên không mắc nợ. Nhưng nếu họ không biết tạo phước thì kiếp sau họ vẫn nghèo khổ. Cách để giúp họ thoát khổ lâu dài chính là bố thí pháp. Giúp cho họ hiểu được Phật Pháp, phát khởi được niềm tin vào nhân quả, nghiệp báo, biết cung kính, giữ giới, tạo phước, tu tâm thì mới giúp họ thoát khổ lâu dài được. Vì vậy bố thí pháp thù thắng hơn là bố thí tài vật."
  },
  {
    "id": 14,
    "question": "Thế nào là thiện tâm hợp trí tuệ và thiện  tâm không có trí tuệ? Quả báo của 2 tâm này sẽ  như thế nào? 13",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Thiện tâm hợp trí tuệ là khi mình làm việc thiện có sự hiểu biết đúng đi kèm với việc thiện ấy. Ví dụ như khi bố thí, người đó biết việc bố thí sẽ có quả báo công đức phước lành cho bản thân mình ở tương lai, nên vị ấy hoan hỷ và hướng tâm đến quả phước mà mình đang mong cầu. Hoặc khi kính lễ phật, khi học đạo, tu tâm… vị ấy luôn hiểu biết về những công đức, phước lành của những thiện nghiệp ấy thì đó là thiện tâm hợp trí tuệ. Còn thiện tâm không có trí tuệ là một người có"
  },
  {
    "id": 15,
    "question": "Một người mong cầu vừa được hưởng  phước báu giàu sang vừa đạt được trí tuệ giác  ngộ thì có được không - và phải tạo nhân như  thế nào?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Muốn thành tựu được như vậy thì vị đó phải tích cực tạo phước như bố thí, cung kính, phục vụ…. và phải nỗ lực tu tâm thực hành giới, định, tuệ, 14 làm được cả hai việc như thế thì mong ước có thể sẽ thành tưu được."
  },
  {
    "id": 16,
    "question": "Tại sao có những đứa trẻ sinh ra đã có khả  năng trí tuệ lớn được gọi là thần đồng?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Đó là những đứa trẻ có công đức phước lành lớn. Vì ở trong những kiếp quá khứ nó thấy những đứa trẻ thần đồng khác, nó rất là hoan hỷ và mong muốn mình cũng được như thế. Rồi nó đã tạo được những công đức, phước lành lớn đi kèm với những ước muốn ấy, cho đến thời điểm cận tử ở kiếp trước, thiện nghiệp ấy đã cho quả, nó đi tục sinh sang kiếp sống này với những công đức và mong muốn ấy. Đó là nguyên nhân của những đứa trẻ có những khả năng khác thường, được gọi là thần đồng."
  },
  {
    "id": 17,
    "question": "Tại sao có một vài đứa trẻ nhớ lại được  kiếp trước của mình - đó có phải là túc mạng  trí không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Nhớ lại được kiếp trước cũng là quả của những thiện nghiệp, công đức phước lành đã tạo ở kiếp trước, cùng với những ước nguyện nhớ lại tiền kiếp, đã được thành tựu ở kiếp này."
  },
  {
    "id": 18,
    "question": "Có một số người tiếp xúc được với người  vô hình (cõi âm) đó là khả năng gì? Những lời  họ nói ra có đáng tin không? 15",
    "category": "Pháp Hành Đời Thường",
    "answer": "Những bậc tu hành đắc đạo có thần thông, có thể tiếp xúc trực tiếp với các vị Phạm Thiên, Chư Thiên, Quỷ Thần, Dạ Xoa là chuyện rất bình thường. Còn ở trong dân gian có một số người tiếp xúc với những chúng sinh vô hình ấy, đa số là do phi nhân, quỷ thần, tác động. Có những quỷ thần có tâm tốt, họ mách bảo những việc tốt. Có những quỷ thần có tâm xấu, họ lừa dối, sai khiến những người tin theo họ làm những việc vô nghĩa. Vì vậy có những trường hợp tin tưởng được, có những trường hợp không tin"
  },
  {
    "id": 19,
    "question": "Những người dân ở vùng quê họ sống  bằng nghề sát sinh và thích uống rượu thì họ  có nên thọ trì Tam Quy - Ngũ giới, nghe pháp,  hành thiền được không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Có nên quy y Tam Bảo, nghe pháp, hành thiền, nhờ có nghe pháp, tu tập dần dần mới hiểu sâu về nhân quả, nghiệp báo, thiện ác, chánh tà, rồi tâm tàm, quý phát sinh họ mới thấy hổ thẹn, và ghê sợ với hành động sát sinh và uống rượu ấy, dần dần họ mới biết sợ quả báo của những việc làm tội lỗi, họ mới siêng năng tạo phước, tu tâm hướng đến giác ngộ, giải thoát ở tương lai."
  },
  {
    "id": 20,
    "question": "Một người thường làm nghề sát sinh -  nhưng có tâm cung kính cúng dàng Tam Bảo  thì khi chết họ có sinh về cõi lành được không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Nếu những thiện nghiệp ấy mạnh hơn ác nghiệp sát sinh, hoặc thiện nghiệp ấy được tạo ra ở thời điểm cận tử thì vị ấy vẫn được sinh về cõi lành. 16 Nếu thiện nghiệp ấy yếu hơn ác nghiệp thì có thể vẫn sinh vào cõi khổ, khi trả quả ác nghiệp xong rồi thì mới được sinh trở lại cõi lành hưởng phước về thiện nghiệp đã tạo ra."
  },
  {
    "id": 21,
    "question": "Một người sống rất hiền lành không hại  ai, nhưng cũng không biết làm phước thiện,  không biết tu tập thì khi chết họ sẽ sinh về đâu?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Một người không tạo phước, cũng không tạo tội, khi chết sinh về đâu thì còn tùy thuộc vào ý thức của người đó có tà kiến, hay chánh kiến. Nếu họ là người không tin nhân quả cho rằng chết rồi là hết, không có quả báo của các nghiệp thiện ác, không có các loài hóa sinh… thì họ sinh vào đọa xứ. Nếu họ có chánh kiến, tin có nhân quả, nghiệp báo luân hồi tái sinh thì nhờ chánh kiến ấy họ mới được sinh cõi lành."
  },
  {
    "id": 22,
    "question": "Một người tự xưng là A la hán nhưng lại  tuyên bố rằng không có cõi trời - không có địa  ngục thì có phù hợp với Đạo Phật không?",
    "category": "Giáo lý Căn bản",
    "answer": "Vị nào tuyên bố như vậy thì không phải là bậc A La Hán, mà đang bị ảo tưởng lớn, ngã mạn lớn, si mê, tà kiến lớn. Không những không có kiến thức Phật học mà còn không có kinh nghiệm thực chứng. Ai học pháp cũng biết rằng: Bồ Tát từ cõi trời Đâu Suốt giáng sinh, rồi khi thành Phật Ngài từng lên cõi trời Đao Lợi thuyết pháp độ Mẫu Thân, vậy không có cõi trời là gì? Vô số bài kinh Đức Phật nói đến các cõi trời và địa ngục. Trong kinh Đức Phật thường nói về Tam Giới;"
  },
  {
    "id": 23,
    "question": "Có người nói rằng tu hành không chấp vào  hình tướng - làm việc tốt cũng buông xả đi - làm  việc xấu cũng buông xả đi thì đúng hay sai?",
    "category": "Giáo lý Căn bản",
    "answer": "Chỉ có Đức Phật và các bậc A La Hán thì mới hoàn toàn buông xả, không còn chấp trước vào bất cứ hành động gì. Còn các bậc Thánh Hữu Học và phàm phu chưa làm được như vậy. Vì thế, khi làm việc xấu, việc bất thiện phải biết đó là việc bất thiện, phải có tâm hổ thẹn, ghê sợ về quả báo của những việc bất thiện, để đề phòng và tránh xa những việc đó ở tương lai. Khi làm việc thiện thì cũng phải biết đó là việc thiện để hoan hỷ với quả báo tốt lành của những việc thiện đó ở tương lai, để tích cực làm ..."
  },
  {
    "id": 24,
    "question": "Có người phát nguyện rằng: chỉ khi nào độ  hết chúng sinh giải thoát rồi mình mới thành  Phật - phát nguyện như thế có phù hợp với lời  Phật dạy không?",
    "category": "Giới luật & Ăn uống",
    "answer": "Một vị Phật cũng chỉ độ được một số lượng chúng sinh có giới hạn, có đủ nhân duyên mà thôi, không thể độ hết chúng sinh được. Một người chưa thành Phật thì chẳng độ được ai cả. Mình còn trong sinh tử, còn vô minh tà kiến khổ đau thì làm sao có thể giúp người hết vô minh, tà kiến giải thoát khổ đau sinh tử được. Lời phát nguyện như vậy là cuồng vọng, ảo tưởng, không đúng với Pháp của Phật, và không thể thực hiện được."
  },
  {
    "id": 25,
    "question": "Những lời phát nguyện có ảnh hưởng như  thế nào đối với cuộc sống của mình - và mình  nên phát nguyện những gì - và không nên phát  nguyện những gì - và phát nguyện như thế  nào thì được thành tựu, như thế nào sẽ không  thành tựu?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Lời phát nguyện có ảnh hướng, có liên quan sâu sắc đến cuộc sống của mình, như một người phát nguyện thành Phật sẽ nỗ lực hành Bồ Tát đạo để thành Phật. Có phát nguyện trở thành bậc đệ nhất trí tuệ, đệ nhất thần thông… hoặc nguyện sinh thiên giới, nguyện sinh làm người… rồi nỗ lực tạo nhân để thành tựu được ước nguyện ấy. Mình nên phát nguyện những điều cao thượng, chân chánh, đi kèm với trí tuệ như phát nguyện giác 19"
  },
  {
    "id": 26,
    "question": "Một người không tin nhân quả nên làm  việc ác so với người có tin nhân quả nhưng vẫn  làm ác thì tội của người nào lớn hơn?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Người không tin nhân quả làm việc ác với tâm lý thản nhiên, hoặc thích thú với việc ác ấy nên ác nghiệp ấy sẽ vững bền thâm sâu, sẽ cho quả đọa trong ác thú lâu dài, không biết ngày nào mới thoát được ra. Còn người có tin nhân quả, nếu làm việc ác thì sẽ có sự hổ thẹn, ghê sợ với tội lỗi ấy, họ sẽ cố gắng làm những việc thiện khác đề bù đắp lại vì vậy quả báo ở tương lai sẽ nhẹ hơn rất nhiều. Nếu có rơi vào đọa xứ thì họ cũng sẽ nhanh chóng thoát ra, chứ không bị chìm đắm lâu dài như người không..."
  },
  {
    "id": 27,
    "question": "Một người làm việc xấu rồi muốn che giấu  nên nói lời thề độc ác thì lời thề đó có thành  hiện thực không?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Lời thế ấy sẽ rất nguy hiểm, nếu vị ấy không sám hối, không từ bỏ thì lời thề ấy sẽ trở thành hiện thực."
  },
  {
    "id": 28,
    "question": "Ở một số chùa và một số tư gia thường có  nghi lễ cúng cháo cho các cô hồn - vậy cô hồn đó  là gì? Họ có ăn được không - việc đó có ý nghĩa  gì không?",
    "category": "Xuất gia & Đời sống Tăng đoàn",
    "answer": "Những cô hồn ấy thường được hiểu theo nghĩa là các hàng quỷ đói. Họ chỉ có thể nhận được công đức, phước lành của người thân hồi hướng cho chứ không ăn được các thức ăn do con người cúng thí. Vì vậy hãy cúng dàng Tam Bảo rồi hồi hướng phước lành cho họ thì họ mới nhận được, mới thật sự có lợi ích lâu dài cho họ."
  },
  {
    "id": 29,
    "question": "Đa số người phương Tây họ không thờ  cúng người đã mất vậy những người đã mất ở  bên đó có khổ sở bất hạnh hơn người Việt Nam  mình không?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Thờ cúng hay không là do văn hóa, tục lệ, tín ngưỡng dân gian của người sống chứ không liên quan gì đến người chết. Một người khi chết rồi họ sẽ tái sinh sang một kiếp sống mới, có đời sống mới, có quyến thuộc mới, có chỗ ở mới, thức ăn mới phù hợp với thân thể mới của họ. Người nào có thờ cúng 21 thì tạo ra phước tôn kính, cúng dàng… còn người không thờ cúng thì không tạo được phước ấy thôi, chứ không có ảnh hưởng gì đến người đã chết."
  },
  {
    "id": 30,
    "question": "Tại sao trong cuộc sống này có người mình  vừa mới gặp đã thấy hoan hỷ quý mến - có  người vừa mới gặp mình đã cảm thấy khó chịu  không thân thiện được là sao?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Trong những kiếp luân hồi tái sinh, mình có rất nhiều ân nhân, cũng có rất nhiều kẻ thù, khi gặp một người xa lạ ở đời này, nhưng là ân nhân trong quá khứ, thì mình cảm thấy lòng hoan hỷ có thiện cảm với nhau. Còn nếu gặp lại một người dù xa lạ ở đời này nhưng lại là thù địch ở quá khứ thì rất dễ sinh ác cảm, dễ sinh mẫu thuẫn chống đối lẫn nhau."
  },
  {
    "id": 31,
    "question": "Tại sao trên cuộc đời này lại có người giàu,  người nghèo, người xinh - người xấu, người trí  - người ngu, người sống lâu - người chết sớm…  là do nguyên nhân gì?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Do những đời kiếp quá khứ đã tạo nhân thiện, ác khác nhau, nên đời này mới có sự vui, khổ khác nhau như vậy. Người nào ở kiếp trước từng làm việc bố thí thì đời này giàu sang, người không bố thí, hoặc lấy trộm cắp thì nghèo khổ. Người nào từng gieo nhân từ ái thì xinh, người gieo nhân sân hận thì xấu xí. 22 Người nào gieo nhân siêng học hỏi và tu tâm thì"
  },
  {
    "id": 32,
    "question": "Làm thế nào để nhận ra được đâu là người  thật lòng sống tốt với mình - đâu là người có ác  ý muốn hại mình?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Người có lòng tốt với mình, khi thấy mình họ sẽ hoan hỷ, an vui. Việc gì có lợi họ sẽ muốn mình cùng được hưởng, khi mình được lợi ích gì thì họ vui mừng, hoan hỷ, khi mình gặp khó khăn họ sẽ hết lòng giúp đỡ… Người có ác ý với mình thì sẽ tỏ ra ngược lại; khi thấy mình họ không hoan hỷ, khi có lợi ích gì họ không muốn cho mình được hưởng, khi mình được lợi họ thường khó chịu, khi mình gặp khó khăn họ không giúp đỡ mà còn mừng vui…"
  },
  {
    "id": 33,
    "question": "Làm sao để nhận biết được một người  chân chánh tu tập và một người không chân  chánh tu tập?",
    "category": "Giáo lý Căn bản",
    "answer": "Người chân chánh tu tập họ chỉ nói chuyện về Phật Pháp, không thích nói chuyện đời, họ chỉ làm những công việc của người tu tập, không làm công việc của người đời. Họ chỉ kết giao với người tu tập, 23 không thích dao du với người đời… Người không chân chánh tu tập thì ngược lại: Thích nói chuyện đời, không nói Phật Pháp, thích làm công việc đời, không thích làm công việc của người tu. Thích giao du với người đời, không thân cận các bậc chân tu…"
  },
  {
    "id": 34,
    "question": "Làm sao để biết được một vị thầy là bậc  minh sư - thiện tri thức?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Một bậc là minh sư thiện tri thức sẽ không đề cao cái lợi ích về danh vọng, chức quyền, tài sản vật chất ở hiện tại, mà luôn đề cao về sự lợi ích, sự tiến hóa, sự an vui lâu dài ở tương lai. Vị ấy không đề cao sự an vui của các pháp hữu lậu, như sự hưởng hạnh phúc, ở các cõi nhân gian, thiên giới…vì chưa thoát khỏi vô minh, tham ái, chấp thủ, mà luôn đề cao sự an vui vô lậu, như sự giác ngộ, giải thoát Niết Bàn, chấm dứt khổ đau sinh tử."
  },
  {
    "id": 35,
    "question": "Làm sao để giữ được tâm mình không bị  tham dục - sân hận chi phối?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tâm bị tham dục chi phối là do hay suy nghĩ đến sắc đẹp của bản thân mình và của người khác phái. Muốn dứt tham dục thì ngược lại phải suy nghĩ đến sự bất tịnh, hôi thối của thân mình và của người khác phái. Bị sân hận chi phối là do hay suy nghĩ rằng; người ta ác với mình. Muốn hết sân hận thì phải suy nghĩ rằng họ là người hiền thiện. 24"
  },
  {
    "id": 36,
    "question": "Làm sao để giữ được tâm mình không bị  sợ hãi?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Do tham ái với bản thân mình, hoặc tham ái với những người mình yêu thương, hoặc với những vật mình yêu quý nên sinh ra sợ hãi. Muốn thoát khỏi sợ hãi thì thường xuyên phải quán xét đến sự vô thường, khổ, vô ngã đối với bản thân mình, với những người mình yêu thương và với những vật mình yêu quý, để dứt bỏ lòng tham ái thì sẽ hết sự sợ hãi."
  },
  {
    "id": 37,
    "question": "Cần phải làm gì để được sống lâu, giàu  sang, xinh đẹp và thông minh trí tuệ?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Muốn sống lâu thì phải tránh sát sinh. Muốn giàu sang thì phải bố thí, cúng dàng. Muốn xinh đẹp thì không sân hận, ác ý. Muốn thông minh trí tuệ thì phải thường xuyên nghe giảng pháp và thực hành thiền."
  },
  {
    "id": 38,
    "question": "Con người sau khi chết sẽ đi về đâu?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Đi theo những nghiệp thiện, ác đã tạo ra từ thân, khẩu, ý mà tái sinh vào các cõi cao thấp khác nhau: Người làm nhiều việc ác sẽ phải tái sinh vào các cõi khổ như: Địa ngục, súc sinh, ngạ quỷ, a tu la. Người làm việc thiện thì được tái sinh về các cõi lành như: cõi người, cõi trời Tứ Thiên Vương - Đao Lợi Thiên - Dạ Ma Thiên - Đâu Xuất Thiên - Hóa Lạc Thiên - Tha Hóa Tự Tại Thiên. Người nào thực hành đắc các tầng thiền định thì sẽ sinh về cõi Phạm Thiên như: Phạm Chúng Thiên"
  },
  {
    "id": 39,
    "question": "Cúng bái cho người chết - vậy họ có ăn  được không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Người chết rồi sẽ đi tái sinh về các cõi sống khác nhau, ở mỗi cõi sống ấy sẽ dùng những thực phẩm khác nhau, họ không nhất thiết phải ăn thức ăn của cõi người. Mặc dù một số vị Chư Thiên trên mặt đất có thể thọ dụng được thức ăn do người dâng cúng. Nhưng họ vẫn có thức ăn riêng của cõi Chư Thiên cao cấp hơn rất nhiều. Vì vậy, việc dâng cúng chủ yếu là để tỏ lòng thành kính không phải để cho người chết ăn."
  },
  {
    "id": 40,
    "question": "Làm lễ cầu siêu cho người chết vậy có lợi  ích gì không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Người chết đã tái sinh vào địa ngục và súc sinh rồi thì không thể cầu siêu được nữa. Nếu sinh 26 làm người hoặc sinh thiên rồi thì không cần cầu siêu nữa. Nếu họ sinh làm ngạ quỷ thì có thể tạo phước hồi hướng cho họ, thì họ mới được lợi ích. Cách để tạo ra phước là lễ Phật, tụng kinh, cúng dàng Tam Bảo, trì giới, nghe pháp, tu tập nội tâm… rồi hồi hướng những công đức phước lành ấy cho họ để cho họ tùy hỷ theo mà phát khởi lên thiện tâm, tạo ra thiện nghiệp. Để"
  },
  {
    "id": 41,
    "question": "Ở các chùa vào dịp đầu năm thường làm  lễ dâng sao giải hạn, vậy việc đó có lợi ích gì  không?",
    "category": "Giáo lý Căn bản",
    "answer": "Đó là tục lễ tín ngưỡng dân gian của người đời chứ không phải giáo pháp của Đạo Phật, một số chùa không giảng dạy Phật Pháp chỉ phục vụ tín ngưỡng dân gian thì mới có lễ đó. Những người hiểu Phật Pháp chỉ tin nhân quả, nghiệp báo chứ không tin vào sao tốt xấu nên không bao giờ làm lễ dâng sao, giải hạn."
  },
  {
    "id": 42,
    "question": "Nhiều ngôi chùa vẫn cúng giấy tiền vàng  mã, và đốt giấy tiền vàng mã, việc đó có lợi ích  gì không?",
    "category": "Giáo lý Căn bản",
    "answer": "Việc đó cũng là tín ngưỡng dân gian của một số người đời mê tín dị đoan, chứ Đức Phật không dạy làm việc đó, chỉ những chùa không giảng dạy Phật Pháp chỉ phục vụ tín ngưỡng dân gian thì mới làm như thế. Những người hiểu Phật Pháp chỉ tin vào 27 luân hồi, tái sinh, chứ không làm những việc mê tín, tà kiến như vậy."
  },
  {
    "id": 43,
    "question": "Người Phật tử đã quy y Tam Bảo rồi thì có  được tôn thờ các thần linh khác hay đi lễ bái ở  các đền phủ không?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Người Phật tử đã quy y Tam Bảo mà có được học pháp, hiểu pháp và có thực hành theo giáo pháp thì sẽ hiểu được Đức Phật là bậc tối thượng phước lành của nhân gian thiên giới. Các vị Thần linh cũng còn đến kính lễ Phật để được tạo phước thì người Phật tử chỉ cần tôn thờ, học pháp và thực hành theo Pháp của Đức Phật là đã được đầy đủ các phước lành rồi, nên không cần phải đi cầu xin lễ bái ở đâu nữa."
  },
  {
    "id": 44,
    "question": "Người ăn chay có công đức gì không -  người tu hành có cần phải ăn chay không - một  người đã ăn chay nhiều năm rồi chuyển sang  ăn mặn thì có tội lỗi gì không?",
    "category": "Giới luật & Ăn uống",
    "answer": "Ăn chay thì sẽ ít tham đắm vào vị ngon của món ăn hơn là ăn mặn. Còn việc ăn là để duy trì mạng sống thôi chứ không tạo ra công đức gì cả. Người tu không cần phải ăn chay, vì Đức Phật không có quy định học giới nào là phải ăn chay cả. Một người dù đã ăn chay nhiều năm rồi chuyển sang ăn mặn thì không có tội lỗi gì hết. Với người tu thì việc ăn mặn phải giữ tam tịnh nhục, và kiêng ăn một số loại thịt mà Đức Phật đã chế định trong giới luật. 28"
  },
  {
    "id": 45,
    "question": "Cuộc sống của người tu hành khác biệt với  người tại gia như thế nào?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Người tu hành khác với người tại gia cả về hình tướng, đến tư tưởng và tâm lý. Về hình tướng; người tu hành phải từ bỏ đời sống của người tại gia, từ bỏ các nghề nghiệp, từ bỏ vợ, hoặc chồng, từ bỏ nhà cửa, tài sản và thân quyến. Vị ấy phải tìm cho mình một vị thầy để nương tựa mà học đạo. vị ấy phải cạo bỏ râu tóc, mặc áo cà sa tượng trưng cho ruộng phước điền, nuôi sống bằng sự bố thí cúng dàng của các Phật tử tại gia. Phận sự chính yếu của người xuất gia là học giáo pháp và thực hành thiền. K..."
  },
  {
    "id": 46,
    "question": "Người Phật tử đến chùa phải chào hỏi và  xưng hô với các sư như thế nào cho phải đạo?",
    "category": "Giáo lý Căn bản",
    "answer": "Các chùa Bắc Tông thì có sự tấn phong cấp bậc như: 29 Các vị còn trẻ thì là Đại Đức Các vị đã tu trên 20 năm thì là Thượng Tọa Các vị đã tu trên 40 năm thì là Hòa Thượng Nếu gần gũi, thân mật thì gọi là Thầy, Sư Phụ… Với các sư cô thì gọi là Sư Cô - Sư Bà - Ni Sư - Ni Trưởng… Với các chùa Nam Tông thì các vị xuất gia thường"
  },
  {
    "id": 47,
    "question": "Người Phật tử muốn cúng dàng đến chùa  và các sư thì phải tác bạch như thế nào cho  đúng pháp theo Phật giáo Nguyên Thủy?",
    "category": "Giáo lý Căn bản",
    "answer": "Theo Luật Phật chế người xuất gia không được thọ nhận và giữ gìn tiền, và vàng bạc, mà chỉ được thọ nhân các vật dụng cần thiết, như y, vật thực, sàng tọa, trú xứ, thuốc men… Vì vậy các Phật tử chỉ nên cúng dàng các vật dụng cần thiết ấy. Nếu dâng cúng tịnh tài (tiền) thì phải có người hộ tăng của các vị sư ấy giữ dùm. Thì Phật tử tác bạch rằng: Kính bạch sư (Bhante…) con xin được cúng dàng tứ vật dụng hợp luật tới sư… (hoặc tới toàn thể chư Tăng trong chùa - vào công việc gì cụ thể), hoặc để cá..."
  },
  {
    "id": 48,
    "question": "Việc tụng kinh, có ý nghĩa gì, có mục đích  và lợi ích gì không?",
    "category": "Giáo lý Căn bản",
    "answer": "Việc tụng kinh chủ yếu là để ghi nhớ những lời dạy của Đức Phật, nhờ vậy mà trí tuệ cũng tăng trưởng hơn, đức tin và lòng thành kính với Phật Pháp cũng tăng trưởng lên, những tâm ô nhiễm phiền não cũng giảm bớt đi, đức tinh tấn và chí nguyện thực hành giáo pháp hướng đến giác ngộ, giải thoát Niết Bàn cũng tăng lên. Nhờ siêng năng tụng kinh mà giới hạnh được thanh tịnh lên, nhờ tâm tàm quý, sám hối những lỗi lầm. Nhờ tụng kinh mà chánh niệm cũng tăng trưởng lên, vì tâm luôn tưởng nhớ đến giáo"
  },
  {
    "id": 49,
    "question": "Tại sao các thầy lại đi xuất gia - có mục đích  gì và có lợi ích gì?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Đời sống tại gia có rất nhiều phiền não, bị tham dục, bị sân hận, bị si mê tà kiến chi phối. Suốt đời khổ sở tìm kiếm và giữ gìn những tài sản, danh vọng, chức quyền, tình ái. Bị khổ sở vì không đạt được những gì mình mong muốn, phải xa lìa những cái mình yêu 31 thương, và gặp những cái mà mình không ưa thích… Chỉ có con đường tu tâm học đạo mới có thể đoạn trừ, chấm dứt được những phiền não khổ đau ấy. Người xuất gia chuyên tâm học đạo cho nên hiểu"
  },
  {
    "id": 50,
    "question": "Đức Phật có sự khác biệt gì đối với các vị  thần linh và con người?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Đức Phật cũng sinh ra ở cõi người nên Ngài là con người. Ngài được tôn xưng là Phật vì Ngài là bậc tu hành chứng đắc Đạo Quả, đoạn trừ được hết phiền não tham, sân, si. Là bậc xứng đáng được cúng dàng. Là bậc Chánh Đẳng Giác. Là bậc đầy đủ đức hạnh và trí tuệ Là bậc chỉ nói những lời thiện lành. Là bậc hiểu rõ tường tận về chúng sinh, các cõi trong thế gian."
  },
  {
    "id": 51,
    "question": "Ở Việt Nam có tín ngưỡng tôn thờ Ông táo  -ngày 23 tháng 12 âm lịch hàng năm sẽ cưỡi cá  chép lên tâu thiên đình thì điều đó có sự thật  không?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Theo tục lệ tín ngưỡng dân gian, người dân thờ ông Thổ Công vốn là các vị thiên thần, hay thần linh thổ địa, sống ở đất đai, nhà cửa, cây cối… Các vị thần linh ấy có thần thông, thần lực, có thể bay đến 33 các cõi trời gặp các vị vua trời được. Các vị ấy có thể tự bay đi, hoặc hóa ra ngựa, voi để cỡi, hoặc xe ngựa để ngồi… Còn tín ngưỡng dâng cúng cá chép cho Ông Táo lên trời chỉ là tín ngưỡng do con người tự nghĩ ra chứ không có thật. Việc phóng sinh thì cũng tốt,"
  },
  {
    "id": 52,
    "question": "Ở các chùa Việt Nam có thờ hình tượng  rồng - vậy rồng là loài có thật không và sinh  sống ở đâu?",
    "category": "Xuất gia & Đời sống Tăng đoàn",
    "answer": "Rồng là loài hóa sinh thuộc hàng Chư Thiên ở cõi Tứ Thiên Vương, có thân rồng rắn, nhưng có thần thông có thể biến hóa thành người sinh sống được với con người. Rồng thường sống dưới biển, có vua rồng cai quản, có tầng lớp xã hội của rồng. Về tâm linh tín ngưỡng của rồng cũng giống như con người có vị tin Phật hộ trì Phật pháp, nên người ta đắp tượng rồng như một vị hộ pháp, trừ gian diệt ác bảo vệ chùa chiền… Có những vị thì có tà kiến, tin theo những tín ngưỡng khác…"
  },
  {
    "id": 53,
    "question": "Trong nhiều bài kinh có nói đến các loài  vật có thể nói chuyện được với nhau với cả con  người - thì điều đó có thật không - tại sao ngày  nay lại không nói được?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Một số loài vật có công đức lớn vẫn có thể nói chuyện được với con người, giống như một số người ở trên đời có thể nói chuyện được với Chư Thiên. Một số người có tha tâm thông có thể biết được suy nghĩ 34 của các con vật. Ngày nay vẫn có những con vật nghe và hiểu được tiếng người, nhưng nói được rất ít. Vậy những câu chuyện về loài vật nói được với nhau và với cả con người ở trong kinh là có thật."
  },
  {
    "id": 54,
    "question": "Một vị A la hán mà muốn tu tiếp để trở  thành một vị Phật thì có được không?",
    "category": "Giáo lý Căn bản",
    "answer": "Một vị đã chứng A La Hán là đã đoạn trừ hết phiền não luân, là những nguyên nhân dẫn đi luân hồi tái sinh rồi thì sẽ nhập Niết Bàn chứ không thể tu tập thành Phật được nữa."
  },
  {
    "id": 55,
    "question": "Các vị xuất gia thời nay có tu tập giống với  các vị xuất gia thời Đức Phật không?",
    "category": "Giáo lý Căn bản",
    "answer": "Các vị xuất gia thời Đức Phật sống bằng hạnh khất thực nuôi thân, nhiệm vụ chủ yếu là học giáo pháp và thực hành thiền. Thời nay chỉ còn một số ít người tu tập như thế."
  },
  {
    "id": 56,
    "question": "Tại sao trong Đạo Phật lại có Phật giáo  Nam tông và Bắc Tông có sự khác nhau gì giữa  hai hệ phái không?",
    "category": "Giáo lý Căn bản",
    "answer": "Sau khi Đức Phật nhập Niết Bàn mấy trăm năm sau thì trong Tăng Chúng xuất hiện một số các vị Tăng trẻ muốn cải cách và đổi mới đạo Phật được gọi là Đại Chúng Bộ truyền bá về phía Bắc của Ấn Độ nên được gọi là Phật Giáo Bắc Truyền, hay Phật Giáo Phát triển. 35 Phật Giáo Phát Triển chủ trương dấn thân nhập thế, hành Bồ Tát Đạo hướng đến thành Phật Quả trong tương lai, phát triển lên nhiều kinh điển Đại Thừa,"
  },
  {
    "id": 57,
    "question": "Phật giáo Bắc tông thì tu theo Lục độ Ba la  mật - Bên Nam tông thì nói là mười pháp Ba la  mật - vậy có sự mâu thuẫn gì không?",
    "category": "Giáo lý Căn bản",
    "answer": "Sáu ba la mật là cách nói tóm gọn của mười ba la mật cũng tương đồng như nhau: Sáu ba la mật gồm có: Bố thí ba la mật Trì giới ba la mật Tinh tấn ba la mật Nhẫn nhục ba la mật Thiền định ba la mật Trí tuệ ba la mật 36"
  },
  {
    "id": 58,
    "question": "Các Phật tử đến chùa đều muốn cầu phúc,  cầu lộc, cầu tài - vậy những điều mong cầu ấy là  tốt hay xấu, và có đạt được không? 37",
    "category": "Giáo lý Căn bản",
    "answer": "Nếu hiểu đúng Phật Pháp thì sự mong cầu ấy mới có lợi ích lớn, nếu không hiểu Phật Pháp thì sự mong cầu ấy chỉ có lợi ích rất nhỏ bé. Người hiểu đúng Phật Pháp là khi lễ Phật vị ấy hướng tâm đến các ân đức cao thượng của Đức Phật để kính lễ, hướng đến các ân đức cao thượng của Đức Phật để cúng dàng. Đó là thiện tâm hợp trí tuệ, là thiện nghiệp do mình tạo ra, từ thiện nghiệp ấy mới khởi lên ước muốn mong cầu cả những điều cao thượng như: cầu mong cho con được Giác ngộ, giải thoát khổ"
  },
  {
    "id": 59,
    "question": "Người tại gia khi có công việc thường nhờ  thầy chùa hoặc vị thầy cúng lễ bái cho gia đình  được bình an, người chết được siêu thoát, thì  điều đó có tốt không, có lợi ích gì không?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Việc lễ bái khi tạo ra phúc, có khi cũng tạo ra tội. Nếu giết hại sinh linh, cúng tế quỷ thần, tin theo tà pháp, tà thuật, mê tín dị đoan chỉ thêm tăng trưởng tà kiến thì vô lợi ích mà còn tạo thêm ác nghiệp. 38 Nếu việc lễ bái là cơ hội để tạo ra phước lành, như việc lễ Phật tụng kinh, cúng dàng Tam Bảo, nghe giảng giáo pháp, học đạo tu tâm, tạo ra thiện nghiệp, công đức phước lành, rồi hồi hướng công đức ấy đến"
  },
  {
    "id": 60,
    "question": "Đức Phật không dạy những pháp tín  ngưỡng mê tín dị đoan, như xem ngày giờ  tốt xấu, dâng sao giải hạn, cầu cúng van xin…  Nhưng tại sao đa số các chùa vẫn phục vụ cho  sự mê tín đó đi ngược lại với lời Phật dạy?",
    "category": "Giáo lý Căn bản",
    "answer": "Đó là những tục lệ tín ngưỡng dân gian, từ ngàn xưa đến nay vẫn luôn tồn tại trong dân gian. Với người xuất gia Đức Phật không cho phép làm việc ấy, nhưng vì một số lý do, nguyên nhân khác nhau nên một số chùa vẫn phải làm việc ấy. Lý do thứ nhất là vì đa số người dân không hiểu về giáo Pháp của đức Phật. Lý do thứ hai là vì đa số chùa muốn hài hòa giữa Phật Pháp với tín ngưỡng dân gian. Vì thời nay người tu hành không còn có những bậc"
  },
  {
    "id": 61,
    "question": "Chánh niệm- tỉnh giác có nghĩa là gì - thế  nào là giữ chánh niệm - tỉnh giác?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Chánh là chân chánh, niệm là nhớ nghĩ. Vậy nhớ nghĩ những điều chân chánh thì gọi là chánh 39 niệm. Ví dụ như niệm Phật, niệm Pháp, niệm Tăng, niệm thân, thọ, tâm, pháp… Chánh niệm ấy được thực hành thuần thục trở lên rõ ràng thì được gọi là tỉnh giác. Người nào có thực hành một pháp môn tu tập về thiền chỉ, thiền quán để thanh tịnh hóa nội tâm, phát sinh tuệ giác, đoạn trừ phiền não, chấm dứt khổ đau"
  },
  {
    "id": 62,
    "question": "Oai nghi có nghĩa là gì - thế nào là giữ gìn  oai nghi?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Oai nghi là những cử chỉ hành động như đi, đứng, nằm, ngồi, nói năng, ăn, mặc…có chánh niệm, có tỉnh thức, theo khuôn phép giới luật cao thượng, được giáo hóa, được dạy bảo từ Đức Phật, được lưu truyền trong giới luật là phận sự người xuất gia phải học tập và thực hành. Người giữ gìn oai nghi khi có bất cứ hành động nào cũng trang nghiêm tề chỉnh, nhẹ nhàng, chứ không thô thiển, lỗ mãng, không phóng dật lăng xăng, nghịch ngợm, tự mình không mất chánh niệm, cũng"
  },
  {
    "id": 63,
    "question": "Ba la mật có nghĩa là gì - thế nào là tạo tác  ba la mật?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Ba la mật là những công hạnh, công đức, phước lành cần được tạo tác, cùng với chí nguyện, ước muốn hướng đến đạo quả siêu thế, trí tuệ giác ngộ, giải thoát luân hồi tử sinh. Vậy khi làm các việc công đức như: bố thí - giữ giới - xuất gia - trí tuệ - tinh tấn - kham nhẫn - chân thật - quyết định - từ tâm - xả tâm với ước muốn chứng ngộ Niết Bàn thì những pháp ấy được gọi tạo tác ba la mật."
  },
  {
    "id": 64,
    "question": "Thế nào là pháp tục đế - thế nào là pháp  chân đế?",
    "category": "Giáo lý Căn bản",
    "answer": "Giáo pháp của Đức Phật dạy về hai sự thật - một sự thật tương đối và một sự thật tuyệt đối. Sự thật tương đối cũng gọi là pháp tục đế, Đức Phật dạy bỏ các việc ác và làm các việc công đức phước lành, như bố thí, giữ giới, cung kính, giúp đỡ, thực hành các pháp thiền định… để tránh bị quả báo ở các cõi khổ đau và được hưởng phước lành ở các cõi nhân gian, thiên giới, phạm thiên giới. Vì những pháp ấy chưa chấm dứt được khổ đau sinh tử vẫn còn luân hồi trong tam giới nên được gọi là pháp tục đế,"
  },
  {
    "id": 65,
    "question": "Đức Phật có dạy pháp môn gì để cho mọi  người tu hành thành Phật như Ngài không?",
    "category": "Giáo lý Căn bản",
    "answer": "Các câu chuyện tiền thân trong rất nhiều bài kinh đã nói lên con đường thực hành Bồ Tát Đạo với nguyện vọng trở thành Phật Chánh Đẳng Giác là tấm gương cho những ai phát tâm tu thành Phật Quả thì có thể y cứ vào đấy mà thực hành các ba la mật cho đến khi viên mãn thì cũng có thể trở thành một Đức Phật ở tương lai."
  },
  {
    "id": 66,
    "question": "Người Phật tử tại gia có thể áp dụng Bát  Chánh Đạo trong cuộc sống hàng ngày không -  và áp dụng như thế nào?",
    "category": "Giới luật & Ăn uống",
    "answer": "Thực hành Bát Chánh Đạo như sau: Nghe giảng, học giáo pháp để có chánh kiến, chánh tư duy. Giữ giới, bỏ ác làm lành để có chánh ngữ, chánh nghiệp, chánh mạng. 42 Thực hành thiền định để có chánh tinh tấn, chánh niệm, chánh định. Thực hành thiền tuệ để viên mãn được chánh trí, chánh giải thoát, thì cũng viên mãn chánh ngữ, chánh"
  },
  {
    "id": 67,
    "question": "Tu tập theo pháp môn Tứ Thánh Đế là như  thế nào - thế nào là giác ngộ Tứ Thánh Đế?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thực hành thiền tuệ phân biệt được thân năm uẩn sinh, già, bệnh chết này là giác ngộ sự thật thứ nhất về Khổ Đế Phân biết pháp duyên khởi thấy được nguyên nhân sinh ra năm uẩn này là giác ngộ sự thật thứ hai về Tập Đế. Liễu tri được sự sinh diệt, vô thường, khổ, vô ngã của thân năm uẩn này nên diệt trừ được vô minh, tham ái, chấp thủ với nó là giác ngộ sự thật thứ ba về Diệt Đế."
  },
  {
    "id": 68,
    "question": "Xúc chạm pháp thế gian tâm không động  không sầu - tự tại và vô nhiễm có nghĩa là gì?",
    "category": "Giáo lý Căn bản",
    "answer": "Là khi sáu căn: (mắt, tai, mũi, lưỡi, thân, ý) tiếp xúc với sáu trần là: (sắc, thanh, hương, vị, xúc, 43 pháp). Nếu cảnh trần ấy không được khả ái, không được như ý thì cũng nên giữ tâm bình thản không nên sầu muội, khó chịu. Nếu cảnh trần ấy tốt đẹp khả ái, hấp dẫn thì cũng nên giữ tâm bình thản, không nên tham ái, đắm nhiễm ưa thích với nó. Chỉ những bậc có tuệ giác cao thượng thấy được tính sinh diệt, vô thường, vô ngã của các pháp thế"
  },
  {
    "id": 69,
    "question": "Kinh Pháp Cú - Đức Phật dạy: Pháp thí thắng  mọi thí - pháp hỷ thắng mọi hỷ - pháp vị thắng  mọi vị - ái diệt hết khổ đau; có nghĩa là gì?",
    "category": "Giáo lý Căn bản",
    "answer": "“Pháp thí thắng mọi thí”  có ý nghĩa là người nào có khả năng thuyết giảng giáo pháp của Như Lai là đang thực hành hạnh bố cao thượng, thù thắng hơn những sự bố thí về tài vật. Vì bố thí pháp là đem đến sự chấm dứt khổ đau, đạt được sự an vui tuyệt đối, còn bố thí tài vật chỉ đem lại sự an vui ngắn ngủi tạm thời. “Pháp hỷ thắng mọi hỷ” có ý nghĩa là người nào đạt được sự hỷ lạc ly dục, ly bất thiện pháp… trong pháp sẽ cao thượng thù thắng hơn những sự hỷ lạc"
  },
  {
    "id": 70,
    "question": "Một người không học, không tu Phật Pháp  nhưng vẫn thường xuyên làm việc từ thiện -  với người có học có tu Phật Pháp nhưng không  làm từ thiện gì cả - thì quả báo ở đời sau của  hai người sẽ như thế nào?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Người thường xuyên làm việc từ thiện nhưng không học đạo tu tâm thì đời sau hưởng phước hữu lậu ở cõi nhân thiên, được hưởng sự sung túc về tài sản vật chất, danh vọng, chức quyền… nhưng nội tâm vẫn đầy phiền não tham, sân, si khi hưởng hết những phước đấy rồi thì lại tái sinh vào những cõi khổ đau sinh tử lâu dài…Còn người chỉ học đạo tu tâm nhưng không tạo phước thì sẽ đi đến giác ngộ, Niết Bàn giải thoát sinh tử, nhưng thiếu phước vật chất nên vị ấy ít nhận được những vật dụng, ít có danh tiế..."
  },
  {
    "id": 71,
    "question": "Một người sát sinh, lấy của không cho rồi  mang bố thí - cúng dàng thì việc đó có phước  báu không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Sát sinh, lấy của không cho là tạo tội sẽ không tránh khỏi quả báo bất hạnh ở tương lai. Rồi mang vật ấy đi bố thí, thì vật thí ấy không thanh tịnh, thí chủ cũng không thanh tịnh, nếu người thọ thí cũng không thanh tịnh nữa thì sự việc ấy không có công đức gì. Dù sao cũng không nên làm như vậy dù cho có phước cũng rất ít mà tội lỗi thì nhiều hơn."
  },
  {
    "id": 72,
    "question": "Một người chết đã sinh vào địa ngục - nếu  người thân lập đàn làm lễ cầu siêu thì họ có  siêu thoát được không?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Sinh làm ngạ quỷ thì còn có cơ hội tùy hỷ công đức phước lành của người thân tạo ra và hồi hướng cho mà được sinh về cõi lành, còn nếu đã sinh vào địa ngục, hay những cõi khác rồi thì không thể siêu độ được nữa, chỉ khi nào trả hết nghiệp quả rồi thì mới có thể ra khỏi đó mà thôi."
  },
  {
    "id": 73,
    "question": "Ở các chùa Miền Bắc thường có ban thờ  Đức Chúa Ông và Đức Thánh Hiền thì các vị ấy là  ai, có lịch sử, có sự thật hay có ý nghĩa gì không?",
    "category": "Xuất gia & Đời sống Tăng đoàn",
    "answer": "Đức Chúa Ông vốn có lịch sử là Ông trưởng giả Cấp Cô Độc người đã dùng vàng rải khắp mặt đất để mua khu vườn của thái tử Kỳ Đà để xây dựng tịnh xá Kỳ Viên dâng lên cúng dàng Đức Phật. Là đại thí chủ hộ trì Phật Pháp. Tôn thờ Đức Chúa Ông có ý 46 nghĩa là để các hàng Phật tử tri ân, tưởng nhớ và noi gương trưởng giả Cấp Cô Độc trong việc cúng dàng Tam Bảo và hộ trì Phật Pháp. Đức Thánh Hiền vốn có lịch sử là tôn giả Ananda"
  },
  {
    "id": 74,
    "question": "Ở một số chùa Việt Nam có thờ hai tượng  hộ pháp, một vị hiền, một vị dữ là có lịch sử, có  sự thật không hay có ý nghĩa gì?",
    "category": "Giáo lý Căn bản",
    "answer": "Vì mục đích răn đe người ác, khuyến khích người hiền nên cổ nhân đã tạc lên hai tượng hộ pháp có ý nghĩa tượng trưng cho các vị Thiên Thần hộ trì bảo vệ Phật Pháp. Một vị có hình tướng dữ là để răn đe những người có ác ý muốn làm hại chùa chiền phỉ báng người tu thì sẽ bị Ngài trừng phạt. Một vị có hình tướng hiền hòa có ý nghĩa là Ngài sẽ hộ trì cho những người hiền thiện có tâm tu học và hộ trì Phật Pháp…"
  },
  {
    "id": 75,
    "question": "Ở một số chùa Việt Nam có thờ tượng Phật  nghìn tay, nghìn mắt là có dựa trên lịch sử, sự  thật gì không hay là có ý nghĩa gì?",
    "category": "Giáo lý Căn bản",
    "answer": "Nghìn tay có ý nghĩa tượng trưng cho năng lực phi thường có thể làm được nhiều việc cùng một lúc cứu giúp được nhiều người. 47 Nghìn mắt có ý nghĩa tượng trưng cho khả năng thấy biết sâu xa những điều tốt xấu gì mọi người làm các Ngài đều thấy hết, không thể che giấu được. Hệ phái phát triển xây dựng lên rất nhiều hình tượng Phật, Bồ Tát có tính chất thiêng liêng huyền bí như vậy để dễ dàng truyền bá tín ngưỡng Phật pháp"
  },
  {
    "id": 76,
    "question": "Khi các Phật tử đi quy Tam Bảo các thầy  thường giảng là quy y Phật rồi thì không quy  y thiên thần, quỷ vật… vậy tại sao các chùa vẫn  thờ chư Thiên như Ngọc Hoàng Thượng Đế,  Nam Tào, Bắc Đẩu, Tiên Đồng, Ngọc Nữ…?",
    "category": "Giáo lý Căn bản",
    "answer": "Vì dưới thời phong kiến các vua chúa có tín ngưỡng theo tôn giáo nào thì dân chúng phải xu hướng theo để lấy lòng vua chúa. Khi các vua chúa tôn sùng Đạo Phật thì Đạo Phật hưng thịnh, khi vua chúa tôn sùng Đạo Nho, Đạo Lão thì Đạo Phật có nguy cơ suy tàn nên người ta lai tạp cả Đạo Nho, Đạo Lão vào để có cơ hội tồn tại. Các vị thiên thần ấy chủ yếu theo tín ngưỡng của Lão Giáo lai tạp với Đạo Phật. Ngày nay khi xây dựng lại các chùa mới những người trí thức sẽ khôi phục lại Đạo Phật thuần túy ch..."
  },
  {
    "id": 77,
    "question": "Trong các lần kết tập kinh điển của Đạo  Phật, thì các kinh điển Đại Thừa có được kết  tập không ạ? 48",
    "category": "Giáo lý Căn bản",
    "answer": "Trong bốn lần kết tập kinh điển: lần thứ nhất là sau khi Đức Phật nhập Niết bàn ba tháng, lần hai là sau một trăm năm, lần ba là sau hai trăm năm, lần thứ tư là sau ba trăm năm thì lúc ấy chưa xuất hiện các kinh Đại Thừa nên chỉ có các kinh Nikaya được kết tập mà thôi."
  },
  {
    "id": 78,
    "question": "Làm như thế nào để bớt nóng giận ạ? Làm  sao để kiềm chế cơn giận?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Nếu như để đến lúc nóng giận nổi lên rồi mình mới kiềm chế thì cũng giống như một người chờ đến lúc cháy nhà rồi mới đi dập lửa, thì sẽ rất là gian khổ, có khi không dập được, mà còn bị chết cháy. Tốt nhất là nên đề phòng lửa từ lúc lửa chưa cháy. Cũng vậy, mình cần phải đề phòng tâm tức giận, sân hận bằng sự tu tập tâm từ, tâm bi, tâm hỷ, tâm xả hàng ngày. Mỗi ngày dành ra 1- 2- 3- 4 tiếng gì đó nhắm mắt lại ngồi thiền hướng tâm đến tất cả những người xung quanh, tất cả chúng sinh và tác"
  },
  {
    "id": 79,
    "question": "Tu tại gia như thế nào cho đúng bổn phận  của người tu tại gia và hướng đến tu xuất gia  trong đời này và đời sau ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Tu tại gia thì thọ trì Tam Quy Ngũ Giới, Bát Quan Trai Giới, phụng dưỡng cha mẹ, chăm sóc vợ con, giúp đỡ thân quyến, tôn trọng pháp luật, làm tròn bổn phận với đời. Trong tâm luôn thức tỉnh về sự vô thường ngắn ngủi giả tạm của kiếp người. Tin sâu nhân quả nghiệp báo, mỗi khi tạo phước đều phát nguyện chứng đắc Niết Bàn giải thoát tử sinh. Tranh thủ thời gian để được nghe pháp, ngồi thiền, thân cận các bậc Sa Môn Trưởng Lão để học hỏi những đạo lý thâm sâu. Luôn phát nguyện được xuất gia xả bỏ ..."
  },
  {
    "id": 80,
    "question": "Khi Đức Phật nhập niết bàn tại sao Ngài  không chỉ định ra một vị tỳ kheo để thay Phật  thống lãnh tăng đoàn?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bởi vì không ai có được trí tuệ, và đức hạnh ngang bằng với Đức Phật để thống lãnh Tăng đoàn. Tăng đoàn của Đức Phật không phải là một tổ chức người nọ cai trị, thống trị người kia, tăng đoàn của Đức Phật là những người tu tập hướng vào nội tâm 50 mình, để đoạn trừ những phiền não trong tâm mình, chứ không phải để mình hướng đến người khác, để tuân thủ theo người khác. Nếu như Đức Phật chỉ định một người nào đó đứng lên thống lãnh tăng đoàn, thì"
  },
  {
    "id": 81,
    "question": "Con có thắc mắc không biết hiện tại bản  thân con đã đủ duyên phước để thực hành  thiền hay chưa, hay con phải vun bồi thêm Ba- la-mật, vì con không biết được kiếp quá khứ đã  từng bố thí cúng dường nhiều hay ít, thì con  phải làm sao ạ? Con kính tri ân Sư ạ!",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bây giờ cứ thử thực hành đi rồi mình sẽ biết. Khi thực hành mà cảm thấy thuận duyên, như là mình ước muốn có trú xứ là mình có trú xứ để thực hành; mình ước muốn có vật thực là có vật thực, có người hộ độ cho mình; mình ước muốn có y phục, có dược phẩm trị bệnh là có. Những điều đó dễ dàng có được là do mình có phước, mình đã từng hộ độ trong quá khứ nên bây giờ mình khởi lên tâm muốn đi tu tập thì tự nhiên những điều đó, những phước đó tự động đi kèm theo. Mình cảm thấy có được những"
  },
  {
    "id": 82,
    "question": "Con rất muốn đọc các kinh sách Phật Giáo  Nguyên Thủy để học được những điều đức Thế  Tôn đã thuyết giảng nhưng con không biết bắt  đầu từ kinh nào. Con xin Sư chỉ bảo cho con ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Trong năm bộ kinh là pháp của Đức Phật thì kinh nào đọc trước cũng được. Cũng giống như một mâm cỗ dọn ra, mình ăn món nào trước cũng được, món nào cũng bổ, cũng chất lượng hết. Pháp của Đức Phật cũng vậy, pháp nào học trước cũng được, cứ học tuần tự bài này đến bài khác, bộ này đến bộ khác, bắt đầu học từ bộ nào cũng được hết, cứ đọc đi."
  },
  {
    "id": 83,
    "question": "Trí thông minh và trí tuệ khác nhau như  thế nào ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Trí thông minh và trí tuệ khác nhau nhiều. Người có trí thông minh lanh lợi hiểu biết nhanh chóng, học rộng, biết nhiều, nên có nhiều kiến thức. Nếu vị ấy có nhận thức đúng với sự thật thì cũng là người có trí tuệ. 52 Người có trí tuệ có thể cũng thông minh, cũng biết nhiều thứ trên đời nhưng cũng có thể không biết nhiều, không có nhiều kiến thức, không học rộng biết nhiều nhưng người đó biết đúng với sự thật. Người"
  },
  {
    "id": 84,
    "question": "Trí tuệ cốt tủy ở trong đạo Phật là gì ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Trí tuệ cốt tủy là trí tuệ thấy được các sự thật. Như là vị đó thấy được thân này là đất, nước, lửa, gió. Thấy được tâm, tâm sở, tiến trình tâm sinh lên như thế nào. Thấy được năm uẩn (sắc, thọ, tưởng, hành, thức).. Thấy được pháp nhân duyên là những nguyên nhân sinh ra thân tâm - danh sắc này. Thấy được sự sinh diệt; vô thường, khổ, vô ngã của danh sắc. Thấy được Niết Bàn, chấm dứt vô minh, tham ái, chấp thủ… 53"
  },
  {
    "id": 85,
    "question": "Hiện nay có một số vị chữa bệnh bằng cách  dùng tâm của vị ấy để chữa bệnh cho người  khác mà không cần chạm vào người bệnh,  cũng không cần phải uống thuốc mà biết đúng  bệnh, chữa được bệnh. Vậy chúng con hiểu hiện  tượng này như thế nào cho đúng ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Hiện tượng dùng tâm của mình để chữa được bệnh cho người khác không có trong kinh điển, không có trong pháp của Đức Phật. Cái này nó nằm ở pháp bên ngoài, pháp này Sư không biết. Không biết là có điều đó không, hay nó chỉ là ảo tưởng, nó chỉ là tà kiến. Sư có đọc qua lịch sử từ ngàn xưa đến nay, đến các vị thần y, các vị danh y từ cổ chí kim đến nay cũng không có cách chữa bệnh đó. Không có cách chữa bệnh mà có thể ở đây thấy được bệnh của người người khác ở nơi khác, chỉ trừ khi vị đó là một vị..."
  },
  {
    "id": 86,
    "question": "Giới cấm thủ là gì ạ?  54",
    "category": "Giới luật & Ăn uống",
    "answer": "Giới cấm thủ có nghĩa là chấp thủ vào việc giữ giới. Ví dụ một người giữ một giới nào đấy và vị đó chấp rằng từ sự giữ giới này ta sẽ đạt được cái này, cái kia. Hay như một người chấp thủ vào một điều sai mà lại cho rằng đúng. Ví dụ như trong kinh có một người tu hạnh con chó, người ta ngồi chồm hổm, ăn đồ ăn quăng xuống đất và người ta nghĩ rằng nhờ tu cái hạnh này sau sẽ được sinh thiên giới. Nhưng đó là một sự chấp thủ về hạnh con chó, đó được gọi là giới cấm thủ. Tu tập hạnh đấy sau này sẽ b..."
  },
  {
    "id": 87,
    "question": "Một hôm con có mặt ở nhà một vị Phật tử  và được một vị Sư ở đó hướng dẫn tụng đọc  nghi thức quy y tam bảo và thọ trì ngũ giới. Khi  đọc đến điều giới thứ tư là cố tác ý tránh xa lời  nói dối, bản thân con đã gặp khó khăn không  thể đọc tụng được tròn vành, rõ chữ điều giới  đó (mặc dù bình thường con có đọc được điều  giới đó). Qua sự việc đó con nhận thấy bản thân  có nhiều khiếm khuyết về giới, đặc biệt là giới  nói dối. Dạ con xin được sám hối về lời nói dối  của mình và kính mong Sư giảng giải thêm cho  chúng con về giới. Dạ có phải là khi ở trước một  vị có giới thanh tịnh, nếu một người không có  thân, khẩu, ý thanh tịnh thì những điều lỗi của  người đó sẽ dễ dàng bị phởi bày ra không ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Cũng có thể do lúc đấy mình khởi lên tâm trạo hối do mình biết rằng mình giữ giới không thanh tịnh nên là đọc lên cảm thấy ngượng ngùng. Bây giờ mình cần phải hổ thẹn, ghê sợ những lỗi lầm, sau đó thọ trì giới cho thanh tịnh. Nên thực hành pháp thiền niệm Giới như: “Quả thật các giới tôi đang thọ trì, không bị đứt, không bị lủng, không bị vụn nát, không bị nhiễm ô….” niệm như một thời gian sau mình sẽ cảm thấy hoan hỉ về giới được thanh tịnh thì tâm lý sẽ tự tin dần lên."
  },
  {
    "id": 88,
    "question": "Người làm việc ác biết đó là ác thì có đi  kèm trí tuệ không? Quả báo sẽ như thế nào với  người làm ác mà không biết mình làm ác? 56",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Khi ác tâm khởi lên, trước, trong và sau khi làm ác thì không có trí tuệ. Còn tâm nhận biết được đó là việc ác thì có trí tuệ đi kèm. Nhờ nhận biết như vậy tâm hổ thẹn, ghê sợ tội lỗi sẽ khởi lên, vị đó có thể sám hối ngăn ngừa tránh làm việc việc ác nữa và tích cực làm việc thiện nhiều hơn nên quả báo của việc ác đó sẽ nhẹ hơn so với người làm ác mà không biết mình làm ác. Người làm ác mà không biết mình làm ác là người hoàn toan si mê, tà kiến không tin nhân quả, nên"
  },
  {
    "id": 89,
    "question": "Duyên Khởi là gì ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Duyên là nhân duyên, hay nguyên nhân, khởi là sinh khởi lên. Ví dụ như nhân duyên nào mà sinh khởi lên cái thân, già, chết, sầu bi, ưu não này? Đó là tái sinh vào bụng mẹ, Nhân duyên gì tái sinh bụng mẹ? - Là vì có nghiệp hữu. Nhân duyên gì khởi lên nghiệp hữu? - Là vì có chấp thủ. Nhân duyên gì khởi lên chấp thủ? - Là vì có tham ái. Nhân duyên gì khởi lên tham ái? - Là vì có cảm thọ."
  },
  {
    "id": 90,
    "question": "Tu tại gia như thế nào cho đúng bổn phận  của người tu tại gia và hướng đến tu xuất gia  trong đời này và đời sau ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Tu tại gia thì thọ trì Tam Quy Ngũ Giới, Bát Quan Trai Giới, phụng dưỡng cha mẹ, chăm sóc vợ con, giúp đỡ thân quyến, tôn trọng pháp luật, làm tròn bổn phận với đời. Trong tâm luân thức tỉnh về sự vô thường ngắn ngủi giả tạm của kiếp người. Tin sâu nhân quả nghiệp báo, mỗi khi tạo phước đều phát nguyện chứng đắc Niết Bàn giải thoát tử sinh. Tranh thủ thời gian để được nghe pháp, ngồi thiền, thân cận các bậc Sa Môn Trưởng Lão để học hỏi những đạo lý thâm sâu. Luôn phát nguyện được xuất gia xả bỏ ..."
  },
  {
    "id": 91,
    "question": "Các vị đắc A La Hán rồi có gặp được Phật  không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Khi Đức Phật còn tại thế thì mới gặp được, Đức Phật nhập Niết Bàn rồi thì không gặp được nữa. Vị ấy chỉ có thể nhớ về những kiếp trước của mình đã từng gặp Phật trong quá khứ thôi. 58"
  },
  {
    "id": 92,
    "question": "Các vị Phật khi nhập Niết-bàn còn về các  cõi khác như cõi trời để giảng giải, phổ độ cho  chúng sinh nữa không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Các vị Phật khi đã nhập Niết Bàn rồi thì không còn hiện hữu dưới bất cứ hình tướng nào, ở bất cứ nơi đâu nữa, cũng không ban phước lành, hay phổ độ chúng sinh gì nữa. Chỉ còn những lời dạy của các Ngài lưu truyền lại ở cõi nhân gian và thiên giới y theo đó thực hành mà được sự lợi ích, tấn hóa, an vui mà thôi."
  },
  {
    "id": 93,
    "question": "Con có thể hiểu rằng thân cận bậc chân  nhân chính là pháp môn căn bản mà một hành  giả cần tu tập trong lộ trình đi đến Niết-bàn  đúng không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Đúng thế, nếu người đấy mà thân cận bậc chân nhân rồi vị đó thuần thục lắng nghe và thực hành theo giáo pháp của bậc chân nhân thì vị đó sẽ thành tựu được tất cả những đức hạnh của một bậc chân nhân."
  },
  {
    "id": 94,
    "question": "Bản chất là mình chỉ mượn tên 4 khái niệm  đất, nước, lửa, gió để đặt tên cho 4 loại sắc chân  đế nổi trội trong mình đúng không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Tên là danh chế định Đức Phật mượn nó để diễn tả các pháp chân đế nhờ vậy mà dẫn dắt được các hàng Thanh Văn đi đến giác ngộ giải thoát. Ngoài bốn đại: đất, nước, lửa, gió còn có các y đại sinh, các tâm, và tâm sở, cần được liễu tri để giác ngộ ra các sự thật. 59"
  },
  {
    "id": 95,
    "question": "Sự khác biệt giữa bậc Thánh và bậc chân  nhân là gì ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Một bậc Thánh thì chắc chắn là một bậc chân nhân. Một bậc chưa phải là bậc Thánh nhưng có những đức hạnh cao thượng thì cũng có thể được coi là một bậc chân nhân. Ví dụ Đức Phật dạy hãy thân cận bậc Thánh, bậc chân nhân, tu tập và thuần thục pháp với các bậc Thánh, bậc chân nhân. Đức Phật dạy một người muốn bước trên con đường tu tập thì hãy tìm đến Đức Phật là một bậc Thánh, một bậc chân nhân. Nếu Đức Phật không còn ở trên đời thì hãy tìm đến bậc A-la-hán. Bậc A-la-hán đó là bậc Thánh, bậc"
  },
  {
    "id": 96,
    "question": "Sự khác nhau như thế nào giữa người  thông minh - người trí thức - người trí tuệ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Người thông minh là người có trí lanh lợi, hiểu vấn đề một cách nhanh chóng… Người trí thức 60 là người có trí nhớ tốt, học rộng, biết nhiều, có nhiều kiến thức nên gọi là người trí thức. Người trí tuệ là người biết đúng, và thấy đúng các sự thật thâm sâu. Người thông minh và người trí thức mà không có trí tuệ thì vẫn làm nô lệ cho phiền não, nội tâm bị chi phối bởi tham, sân, tà kiến nên không giải thoát khổ đau."
  },
  {
    "id": 97,
    "question": "Như thế nào là san tham pháp?",
    "category": "Giáo lý Căn bản",
    "answer": "San tham pháp là tâm bỏn sẻn, không muốn chia sẻ những kiến thức về pháp học và những kinh nghiệm về pháp hành của bản thân mình cho những người khác, không muốn cho người khác giỏi hơn mình về pháp học và pháp hành, cho nên cố ý che giấu những kinh nghiệm tốt, chỉ muốn cho bản thân mình có thôi, không muốn cho người khác tiến bộ như mình. Đó là một tâm tánh xấu, chỉ có ở những người phàm phu ích kỷ."
  },
  {
    "id": 98,
    "question": "Các tôn giáo khác họ dành rất nhiều thời  gian để cầu nguyện vậy sự cầu nguyện ấy có lợi  ích gì không?",
    "category": "Giáo lý Căn bản",
    "answer": "Cầu nguyện là để thể hiện lòng thành kính, làm tăng trưởng đức tin vào bậc đáng tôn kính ấy. Theo Pháp của Đức Phật thì cũng cần có đức tin, từ 61 đức tin ấy làm nền tảng để phát triển trí tuệ, chứ không chỉ dừng lại ở đức tin ấy. Bởi vì, đức tin mà mạnh quá thì sẽ lấn át trí tuệ, tin một cách mù quáng mê muội, thì sẽ không tốt. Vì vậy, việc nghi lễ cầu nguyện thì cũng tốt, nhưng không nên quá nhiều, nên dành nhiều thời gian cho việc học pháp và thực hành"
  },
  {
    "id": 99,
    "question": "Đạo Phật đã truyền vào Việt Nam được  2000 năm rồi - vậy tại sao đa số người Việt  Nam vẫn thấy xa lạ và không hiểu biết nhiều về  Phật Pháp?",
    "category": "Giáo lý Căn bản",
    "answer": "Đạo Phật thì không xa lạ, ai cũng biết đến, nhưng Giáo Pháp thì xa lạ vì người giảng dạy Giáp Pháp không có nhiều. Trong Kinh Đức Phật cũng nói rằng: Người thuyết giảng được Giáo Pháp của Như Lai khó tìm được ở trên đời. Chùa thờ Phật thì rất nhiều, người xuất gia cũng không ít, tín đồ Phật tử thì rất đông. Nhưng đại đa số mọi người chỉ biết đến Đạo Phật thông qua hình thức nghi lễ. Có rất ít người được học pháp, và thực hành chánh pháp, vì thế Giáo Pháp vẫn còn xa lạ đối với đa số người Việt Na..."
  },
  {
    "id": 100,
    "question": "Kinh điển của Đạo Phật rất nhiều - nhưng  rất ít vị sư ở các chùa giảng dạy - trong khi  đạo Thiên Chúa kinh điển không nhiều nhưng  vị Linh Mục nào cũng giảng dạy giáo lý là do  nguyên nhân gì? 62",
    "category": "Giáo lý Căn bản",
    "answer": "Giáo lý của các tôn giáo khác chủ yếu là hướng đến niềm tin, thuộc về pháp thế gian cho nên dễ hiểu, dễ giảng dạy. Còn Giáo lý của Đạo Phật là hướng đến trí tuệ, xuất thế gian, ngoài kiến thức pháp học ra còn phải có cả kinh nghiệm tu chứng, thì mới hiểu được những điều thâm sâu trong Giáo Pháp. Vì vậy, rất ít người giảng dạy được đúng chánh Pháp"
  },
  {
    "id": 101,
    "question": "Tại sao các sư Miền Nam thuyết pháp lại  hay hơn, cuốn hút hơn và có nhiều Phật tử lắng  nghe hơn các sư Miền Bắc?",
    "category": "Giáo lý Căn bản",
    "answer": "Vì văn hóa hào phóng của người miền Nam tạo ra tính cách tự nhiên, thoải mái dễ hòa đồng, nên các sư Miền Nam giảng pháp có sự gần gũi, tự nhiên nên có nhiều người thích nghe. Các sư Miền Bắc do ảnh hưởng truyền thống văn hóa nghiêm khắc của Nho Giáo, phù hợp với các nghi lễ trang nghiêm thành kính hơn là thuyết giảng Giáo Pháp, vì thế khu vực Miền Bắc rất ít giảng sư."
  },
  {
    "id": 102,
    "question": "Tại sao ở Miền Bắc chùa chiền thì nhiều mà  Phật pháp vẫn không hưng thịnh như ở Miền  Nam?",
    "category": "Giáo lý Căn bản",
    "answer": "Người Miền Bắc rất nặng tín ngưỡng đa Thần, đa Thánh, và Phật Giáo bị đồng hóa với các tín ngưỡng dân gian, đa số người dân không hiểu Phật Pháp. Người tu hành thì ít mà phải bận rộn phục vụ tín ngưỡng và lo xây dựng khôi phục chùa cảnh thì nhiều nên không có thời gian tu tập và giảng dạy Phật Pháp vì vậy mà Phật Pháp chưa hưng thịnh được. 63"
  },
  {
    "id": 103,
    "question": "Bài Kinh Thất Giác chi có thể chữa lành  bệnh ngay lập tức cho Đức Phật và một số các  vị A La Hán - vậy người thực hành Thất Giác Chi  có lợi ích với sức khỏe không - và sự thực hành  Thất Giác Chi như thế nào?",
    "category": "Giáo lý Căn bản",
    "answer": "Thực hành Thất Giác Chi không những có lợi cho sức khỏe mà còn có thể đi đến giác ngộ, giải thoát. Vị ấy cần phải thực hành một pháp thiền, ví dụ như thiền niệm hơi thở. Đó là niệm giác chi. Thấy hơi thởi vào ra rõ ràng là trạch pháp giác chi Siêng năng thực hành là tinh tấn giác chi Hoan hỷ thực hành là hỷ giác chi Thực hành nhẹ nhàng thư thái là khinh an giác chi Nhất tâm thực hành là định giác chi Thản nhiên thực hành là xả giác chi."
  },
  {
    "id": 104,
    "question": "Lậu hoặc là gì ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Lậu hoặc là những phiền não, khi tâm mình khởi lên tham dục thì đấy là lậu hoặc, sân hận là lậu hoặc; tà kiến là lậu hoặc; vô minh, tham ái, chấp thủ đấy là lậu hoặc. 64"
  },
  {
    "id": 105,
    "question": "Né tránh và phòng hộ khác nhau như thế  nào ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tránh né là tránh xa những nơi nguy hiểm đến thân tâm của mình. Như tránh xa ác nhân, ác thú, những nơi không an toàn, những nơi không phù hợp với đời sống học đạo, tu tâm giải thoát… Phòng hộ la giữ chánh niệm, tỉnh giác chú tâm vào pháp môn đang tu tập miên mật không xao lãng, không gián đoạn. Không hướng tâm theo ngoại cảnh, không tham đắm, ưa thích hay ghét bỏ với ngoại cảnh…để tránh sinh ra phiền não khổ đau."
  },
  {
    "id": 106,
    "question": "Những vị đắc A-la-hán đã nhập Niết-bàn thì  làm sao thành Phật được ạ? Thưa Sư, có chuyện  những vị đã đắc Niết-bàn rồi mà còn phát nguyện  xuống thế gian để độ sanh không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Một vị mà đã chứng đến Sơ Quả là đã không thành Phật được nữa rồi, chứ nói gì đến một vị A-la- hán. Đã chứng vào những quả thanh văn đấy rồi thì không thành Phật nữa. Một vị Chứng Dự Lưu thì vẫn trở lại thế gian được bảy lần nữa. Một vị Nhất Lai còn trở lại được một lần nữa. Vị Bất Lai thì sinh về cõi Tịnh Cư không trở lại nữa. Một vị A La Hán thì Đại Bát Niết Bàn trong kiếp hiện tại rồi vĩnh viễn không trở lại nữa."
  },
  {
    "id": 107,
    "question": "Sự hiểu nhầm, xung đột trong một tập thể  đôi khi khiến con bị phiền não con phải làm gì  trong trường hợp này ạ?  65",
    "category": "Pháp Hành Đời Thường",
    "answer": "Bị hiểu lầm rồi sinh ra xung đột, nếu mình biết đó là hiểu lầm rồi thì mình hãy buông xả nó đi hoặc chờ thời cơ thích hợp mà giải thích để hóa giải sự hiểu lầm ấy. Còn xung đột, phiền não sinh ra do mình không biết tránh né những chỗ cần tránh né, không biết thân cận những chỗ cần thân cận. Hay là mình không biết kham nhẫn, không biết phòng hộ, không biết trừ diệt, không biết tu tập cho nên xung đột phiền não sinh ra. Nếu như mình biết kham nhẫn, tránh né, biết tu tập sống hiền hòa thì sẽ chấm d..."
  },
  {
    "id": 108,
    "question": "Con muốn hỏi cách trừ diệt phiền não ngay  khi nó khởi lên là như thế nào ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Cách trừ diệt những tâm dục tầm, sân tầm, hại tầm hay là các tâm bất thiện khởi lên thì có rất nhiều cách. Trừ diệt bằng cách mình nhận ra đây là những tâm bất thiện, đây là dục tầm, sân tầm, hại tầm, nó có hại chứ không phải có lợi, cần buông bỏ nó thì mình có thể trừ diệt nó bằng cách đó là buông xả, buông bỏ nó. Mình trừ diệt nó bằng cách là quán, ví dụ như khởi lên một dục tham thì hãy quán đến bất tịnh, khởi lên một sân hận thì quán đến rải tâm từ. Tâm hại tầm khởi lên thì rải tâm bi mong c..."
  },
  {
    "id": 109,
    "question": "Thượng tọa và Trung tọa tỳ khưu có nghĩa  là gì ạ?",
    "category": "Xuất gia & Đời sống Tăng đoàn",
    "answer": "Thượng tọa tỳ kheo là những vị tu đã lâu năm ví dụ như từ 10 hạ trở lên thì được gọi là Thượng tọa tỳ kheo. Trung tọa tỳ kheo là những vị tu được một thời gian chưa lâu lắm như là từ năm hạ trở lên. Còn tân học tỳ kheo là những vị từ sơ hạ đến 4 hạ. Đấy là ba bậc của các vị tỳ kheo."
  },
  {
    "id": 110,
    "question": "Thế nào là thừa tự pháp ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Thừa tự pháp có ý nghĩa là một vị đệ tử đến học đạo với một vị thầy với mục đích là cầu đạo giác ngộ giải thoát chứ không phải vì mục đích được hưởng những lợi dưỡng, tài sản vật chất của vị thầy ấy. Một vị đệ tử chỉ cố gắng phát triển pháp học, pháp hành chứ không tham lam lợi dưỡng thì đó là đang sống theo hạnh thừa tự pháp."
  },
  {
    "id": 111,
    "question": "Thế nào là tùy học viễn ly ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tùy học viễn ly có nghĩa là một người ưa thích đời sống độc cư, xa lánh hội chúng thích ở nơi yên tĩnh vắng lặng để thực hành thiền chỉ quán hướng đến sự đoạn trừ các phiền não."
  },
  {
    "id": 112,
    "question": "Một vị A-la-hán khi tiếp xúc với cảnh khả  ái do thiện nghiệp trổ quả thì sẽ khởi lên loại  tâm gì ạ?  67",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Một vị A La Hán thì chỉ khởi lên tâm xả. Vị đó không có khởi lên bất cứ một tâm tham ái, đắm nhiễm gì dù là đối với cảnh khải ái. Ví dụ như vị đó được cung kính, được cúng dàng thì tâm đó vẫn là tâm xả. Tâm thản nhiên, không có tham ái, không có ngã mạn. Tất cả những tâm hành của một vị A-la-hán khởi lên đều là tâm duy tác. Cái tâm đấy không để lại nghiệp gì trong tương lai."
  },
  {
    "id": 113,
    "question": "Việc xác định nhu cầu vật dụng cho việc tu  tập, làm sao để xác định ranh giới giữa mức  vừa đủ cần dùng và mức dư thừa ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Một vị tỳ kheo thì rất dễ dàng để biết được vừa đủ hay dư thừa vì Đức Phật quy định vị đó chỉ được dùng 3 bộ y, có tam y: một y tăng già lê, một y vai trái và một hạ y; về y áo vị đó chỉ dùng thế. Còn ngoài ra có thể là dùng các y khác là y phụ tùng. Có tam y đấy là đủ rồi. Hoặc là chỉ có một bình bát, vị nào mà sở hữu từ hai bình bát trở lên thì là dư thừa và vị đó không tích trữ nữa. Về vật thực, vị đó chỉ thọ dụng vật thực đủ ăn trong ngày, hết giờ là vị đó phải xả, buông xả vật thực đó. Sẽ c..."
  },
  {
    "id": 114,
    "question": "Thế nào là tịnh nhãn ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tịnh nhãn tức là vị đó thấy được con đường, thấy được chân lý, thấy được các sự thật. Bởi vì lúc đấy vị đó mới là người có mắt, thấy được sự thật tuyệt đối về khổ, thấy được nhân sinh ra khổ, thấy được sự đoạn tận nhân sinh ra khổ, chứng đắc Niết- bàn và thấy con đường đi đến giải thoát. Vậy thì một người nào mà giác ngộ chân lý Tứ Thánh Đế, thấy các sự thật đó thì được gọi là tịnh nhãn. 69"
  },
  {
    "id": 115,
    "question": "Trong kinh thừa tự pháp có câu: Phản bội  là ác pháp. Con xin Sư giải thích cho con chỗ  này ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Vì phản bội là vô ơn, là bất thiện. Phản bội có nghĩa là thấy người khác làm ơn giúp mình nhưng mình lại có tâm ác ý muốn người đấy phải giúp mình một cách vô điều kiện, trở thành một người nô lệ cho mình, để phục vụ, phục dịch mình từ cái nhỏ đến cái lớn; tức là do nhu cầu tham đắm của mình lớn quá. Rồi mình cứ muốn người khác giúp mình nhưng mình lại làm hại người ta thì đấy được gọi là phản bội. Có một câu chuyện về những người lái buôn đi qua sa mạc rất mệt mỏi, rồi đến một khu rừng. Khi"
  },
  {
    "id": 116,
    "question": "Nếu giữ tám giới mà không giữ giới ăn phi  thời thì có lợi ích hơn giữ 5 giới không ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Giữ tám giới mà không giữ giới ăn phi thời thì vẫn lợi ích hơn giữ năm giới. Không giữ được trọn vẹn 8 giới thì có thể thọ trì bảy giới cũng được. Dù 70 không thành tựu bát quan trai giới nhưng mình giữ được bao nhiêu tốt bấy nhiêu. Kể cả có những người giữ được năm giới thì có thể thọ năm giới. Nhưng có người chỉ giữ được bốn giới thì không thọ năm giới mà thọ bốn giới thôi. Có những người chỉ thọ ba giới, có những người chỉ thọ hai giới, có người chỉ thọ một"
  },
  {
    "id": 117,
    "question": "Một cư sĩ tại gia còn nhiều phận sự, công  việc phải làm thì nên tu tập đề mục gì và tu tập  như thế nào trong cuộc sống để duy trì chánh  niệm và phát triển được Bát Chánh Đạo ạ?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Người cư sĩ tại gia thì có nhiều hạng người lắm. Có những người vẫn thực hành được pháp như người xuất gia, mặc dù là hình tướng tại gia nhưng tâm hoàn toàn xuất gia. Nhưng có những người thì quá bận rộn với đời sống tại gia, không thực hành được nhiều thì cố gắng thực hành một chút ít. Ví dụ tối thiểu nhất là giữ được năm giới. Bát quan trai giới vào các ngày 8, 15, 23, 30 âm lịch. Ngày bát quan trai giới cũng đồng nghĩa với việc thực hành thiền chỉ quán. Ngày hôm đấy hãy thực hành niệm Ân Đức"
  },
  {
    "id": 118,
    "question": "Trên cõi Phạm Thiên có nhà cửa và cây cối  phong cảnh như cõi nhân gian không ạ? Rồng  Naga có hình dáng giống như rồng trong văn hóa  truyền thống Việt Nam, Trung Quốc không ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Trên cõi Phạm Thiên thì được ở trong những tòa lâu đài bằng châu báu, bằng pha lê, bằng vàng, bằng ngọc cũng giống như trên cõi trời. Trên các cõi trời cũng có những tòa lâu đài, cung điện bằng vàng, bằng ngọc nhưng mà tất cả những điều này đều do hóa hiện ra, đều do công đức, đều do những công phước lành mà tự hóa hiện ra chứ không cần xây dựng, không cần thợ thuyền, không cần thiết kế gì hết. Tùy theo cái phước của mỗi vị khi sinh lên đấy thì những lâu đài đã hóa sinh cùng lúc vị đó tái sinh."
  },
  {
    "id": 119,
    "question": "Nếu mình hùn phước cúng dường mà  người trung gian nhận tiền của mình do vô tình  hay cố ý lại quên không chuyển đến thiền viện  để cúng dường thì như thế mình được coi là đã  tạo phước thiện qua thân hay chưa ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vật thí chưa đến tay người nhận thì phước thiện ấy chưa hẳn đã thành tựu, nếu có thể thì mình lấy lại vật đó và làm phước lại. Khởi lên ý cúng dàng là ý nghiệp, tự thân làm ra, và tự tay dâng cúng là thân nghiệp, tác bạch dâng cúng thì là ý ngiệp. Khi nào có đủ ba điều kiện là có thí chủ cúng dàng, có phẩm vật cúng dàng, và có người thọ nhận thì phước thiện ấy mới thành tựu."
  },
  {
    "id": 120,
    "question": "Con thấy trên YouTube có video niệm  “Namo Tassa Bhavagato Arahato Samma  Sambuddhasa” kèm nhạc và rải tâm từ tiếng  Pali kèm nhạc. Vậy thì khi nghe mình có khởi  tâm thiện lành cung kính đối với Đức Phật hay  có tác ý mong cho chúng sanh được an vui thì  nghe như vậy có đúng đắn không ạ? Vì trong  tám giới có giới không được nghe nhạc!",
    "category": "Giới luật & Ăn uống",
    "answer": "Nếu như với một người tu tập nghiêm túc, đàng hoàng thì sẽ không nghe nhạc. Khi mình niệm Phật cũng không nên đi kèm với những cái nhạc đó. Đi kèm với những cái nhạc đó thì vẫn khởi lên được tâm cung kính, vẫn có những cái phước hữu lậu. Như chư thiên vẫn tấu nhạc cúng dàng Đức Phật hay là có những vị nhạc công, nhạc sĩ có thể người ta vẫn tấu nhạc cúng dàng chứ không phải là không, những 74 người đó vẫn có phước chứ không phải là không có"
  },
  {
    "id": 121,
    "question": "Thế nào là thời chánh pháp? Thế nào là  thời mạt pháp?",
    "category": "Giáo lý Căn bản",
    "answer": "Thời nào mà đại đa số mọi người còn chân chánh tu học và thực hành theo lời Phật dạy, còn chứng đắc các đạo quả giải thoát giác ngộ thì còn là thời chánh pháp. Thời nào mà đại đa số mọi người không còn chân chánh tu học và thực hành theo lời Phật dạy, và không còn người chứng đắc các đạo quả giải thoát, giác ngộ nữa thì được gọi là thời mạt pháp."
  },
  {
    "id": 122,
    "question": "Khiếp đảm, sợ hãi là thuộc nhóm tâm tham,  sân hay si ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Sợ hãi thuộc về tâm sân. Khi khởi lên sợ hãi, nếu một người phân tích được danh pháp rồi thì sẽ phân tích đó là nhóm tâm sân: si, vô tàm, vô quý, phóng dật, sân. Tức là tất cả những sự sợ hãi, lo lắng, bất an đều là tâm sân hết, nên người nào diệt được tâm sân thì sẽ hết sợ hãi. 75"
  },
  {
    "id": 123,
    "question": "Làm sao để diệt trừ sợ hãi khi phải đến  những nơi vắng vẻ vào ban đêm ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Nếu mình là người không có tội lỗi thì mình sẽ tự tin rằng mình là người có giới không có tội lỗi ở thân, khẩu, ý thì mình cảm thấy có sự tự tin nên khi đi đến những nơi thanh vắng mình sẽ không sợ hãi vì mình biết rằng đối với những phi nhân, quỷ thần bất thiện ấy sẽ không làm hại những người lương thiện được. Hay các vị chư thiên cao thượng thì hoan hỷ với những người thiện, chỉ có xua đuổi những người bất thiện thôi. Hoặc người biết tu tập thì cố gắng giữ chánh niệm trên pháp tu của mình ấy. ..."
  },
  {
    "id": 124,
    "question": "Một người ở đời sợ ma là do đâu ạ? Với  kiểu sợ hãi này vị đó cần tu tập về đề mục gì  hoặc suy tư về điều gì để loại bỏ nỗi sợ này ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Sợ đấy nó sinh ra từ tham ái. Ví dụ một người quá tham ái đối với cái thân thì nó sinh ra sự hãi chết, còn những người mà không tham ái với thân thì nó không sinh ra sự hãi chết. Vị đó gặp ma, vị đó nói chuyện với ma cũng chẳng sao, là chuyện bình thường. Ví dụ như những người ở trong rừng hay những người tu hay ở nghĩa trang người ta sẽ thấy phi nhân gầm hú la ó là chuyện bình thường và những người đấy không sợ, người đấy rất tự tin. Người đấy cứ mặc kệ, nếu như có nhìn thấy nó cũng cứ mặc kệ"
  },
  {
    "id": 125,
    "question": "Sự sợ hãi kinh cảm về nỗi khổ đau luân hồi  sinh tử là trạng thái tâm thiện hay bất thiện  ạ? Nó có tương tự như nỗi sợ hãi bình thường  không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Sợ hãi mà nói là kinh cảm, ví dụ như mình niệm về xác chết, niệm về sự chết và mình thấy nỗi khổ trong sinh tử của mình hay của chúng sinh thì cái tâm này hoàn toàn là tâm thiện đi kèm với trí tuệ rất cao. Nó có sự kinh cảm và có sự nhàm chán, có sự ly tham, có sự mong muốn được chấm dứt khổ đau thì tâm này là tâm rất cao thượng. Nó khác hoàn toàn với sự sợ hãi thông thường sinh lên từ tâm phiền não, từ sự ngu si. Còn sự kinh cảm thì sinh ra từ trí tuệ, từ sự giác ngộ cao thượng, từ sự thấy các ..."
  },
  {
    "id": 126,
    "question": "Con có cấu uế tự ti, hờn trách người thầy,  con phải làm sao để không còn cấu uế này nữa  và thoát khỏi bị đọa địa ngục ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vì Giới - Định - Tuệ còn yếu nên sinh ra tự ti. Vậy phải tinh tấn thực hành Giới - Định - Tuệ thì sẽ tự tin thôi. Còn việc phiền não với vị thầy thì phải thực hành thiền tâm từ hàng ngày với vị thầy đó. Phải kham nhẫn để tránh sinh lên tâm bất thiện với vị thầy."
  },
  {
    "id": 127,
    "question": "Cách tốt nhất để đối diện với quả bất thiện  là gì ạ? Con thấy trong kinh khi bị người ta  chửi mắng Đức Phật dạy Ngài Ananda chỉ cần  kham nhẫn đủ 7 ngày không tránh né nó sẽ  hết. Nhưng con đã kham nhẫn hàng tháng nay,  tập trung hành thiền nhưng những tiếng chửi  mắng vẫn cứ vang lên trong đầu. Nhiều khi con  tưởng nhớ đến các bậc đại ân đức, các vị thầy  tổ. Con rất ngại phạm tội bất kính nên cũng  không dám niệm Phật trong lúc này. Nhưng con  cũng không biết cách nào để vượt qua, xin Sư  chỉ dạy cho con?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Cách đối diện với quả bất thiện là biết quả đó là do chính mình tạo ra nên cố kham nhẫn chờ cho nó qua đi. Chỉ có Đức Phật mới chấm dứt được quả của nghiệp bất thiện trong thời gian bảy ngày. Dù có ai phỉ báng, vu oan đến Ngài thì trong thời gian 7 ngày sau sẽ tự được giải tỏa những oan khiên đó. Nhưng đối với những người khác thì không có chuyện đó, nhất là đối với những người phàm phu thời bây giờ. Nếu nguyên nhân đó đến là do những quả của nghiệp 78"
  },
  {
    "id": 128,
    "question": "Tôn giả Mục Kiền Liên nhờ thần lực của 10  phương Tăng để cứu mẹ mình là có thật trong  kinh mà Đức Phật Gotama thuyết giảng không  ạ? Nếu có thật thì bài chú nguyện đó là gì ạ?  Nếu không có thì con xin Sư cho con hỏi cách  báo hiếu cha mẹ tốt nhất theo lời Phật dạy ạ?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Không có nhé. Trong kinh nguyên thủy không có chuyện Mục Kiền Liên xuống địa ngục cứu mẹ. Đấy là câu chuyện bên Trung Quốc sau này sáng tạo ra để khuyến khích cho mọi người sống hiếu thuận với cha mẹ thôi. Chính Ngài Mục Kiền Liên về cuối đời cũng bị chết vì nghiệp bất hiếu trong quá khứ. Trong một kiếp quá khứ Ngài đã từng nghe lời xui khiến của người vợ mà giết hại cha mẹ. Quả của nghiệp bất hiếu ở trong quá khứ trổ cho nên Ngài còn bị ngoại đạo đánh cho tan xương nát thịt, chết"
  },
  {
    "id": 129,
    "question": "Có một số người ỷ thế bản thân đã có nhiều  kinh nghiệm trong tu tập, đã lâu năm trong giáo  pháp nên coi thường người khác, khi đến một  môi trường tu tập thì coi thường mọi người  khác, khi được mọi người nhắc nhở các quy  định tu tập sinh hoạt thì không chịu nghe, tự  mình sống và tu tập một kiểu. Với một hành giả  có thái độ như vậy thì nó sẽ gây chướng ngại  đến sự tu tập của vị đó đến người khác như thế  nào ạ? Vận hành của nghiệp sẽ ra sao ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thời Đức Phật cũng có tôn giả Channa (Xa- nặc) - người đánh ngựa đưa Đức Phật đi xuất gia. Vị đấy rất kiêu ngạo. Vị đấy nói ta đưa Đức Phật đi tu nên giờ mới có Phật; còn Xá Lợi Phất hay Mục Kiền Liên cũng là bông hoa nở muộn, không có ta thì làm 80 sao có Phật. Phật là của ta, Pháp này là Pháp của ta, đó là của chúng ta. Cho nên vị đó không bao giờ nghe lời ai dạy bảo, nên vị ấy không chứng đắc được pháp gì. Và cách Đức Phật dạy vị đó là khi Ngài nhập Niết-"
  },
  {
    "id": 130,
    "question": "Một người cho những điều bất thiện là  thiện, những điều thiện lại là bất thiện thì là  đang khởi lên tâm gì ạ? Và sẽ cho quả báo như  thế nào trong tương lai ạ?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Những người nói thiện là bất thiện hay bất thiện là thiện thì tâm đấy là đại tà kiến. Nếu như không bỏ được tư tưởng đấy, không bỏ được ý nghĩ đấy, những lời nói, hành động như vậy thì chắc chắn vị đấy sẽ sinh về cõi khổ đau rất là lâu. Giống như thả con rùa mù với khúc gỗ dưới sông, trăm năm mới trồi lên một lần, con rùa mù có trồi đúng khúc gỗ hay không, thì người này có trở lại làm người được cũng 81 sẽ khó như con rùa mù thò cổ được vào miếng gỗ."
  },
  {
    "id": 131,
    "question": "Vì sao nỗi buồn lại thuộc về tâm sân?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Vì tâm sân luôn đi với những trạng thái, sầu, bi, ưu não. Khi mình tức giận mình cũng buồn phiền sầu ưu, khi mà mình ghen tị nó cũng sầu ưu, Khi hối hận, bỏn xẻn cũng có sầu ưu. Khi mình đánh nhau, chửi nhau với ai lúc đấy mình cũng có sầu ưu. Khi mà mình than khóc vì điều gì đó cũng sầu ưu. Hoặc chỉ cần hơi khởi lên cái tâm buồn phiền vẩn vơ ở mức độ rất là nhỏ thôi thì đó cũng là sầu ưu. Vì vậy tất cả những nỗi buồn phiền đều thuộc về tâm sân."
  },
  {
    "id": 132,
    "question": "Thế nào là chánh tín? Thế nào là mê tín?",
    "category": "Giáo lý Căn bản",
    "answer": "Chánh tín là niềm tin đúng, tin những điều chân chánh, tin vào những điều có thật. Vì Đức Phật là bậc Giác Ngộ, có trí tuệ toàn giác nên những Pháp Ngài nói ra đúng với chân lý, đúng với sự thật. Vậy người nào có học pháp, có nghe giảng pháp thì sẽ có hiểu biết đúng nên có niềm tin đúng thì gọi là chánh tín. Như tin nhân quả, nghiệp báo, luân hồi tái sinh, tin vào con đường tu tập chân chánh sẽ đi đến Niết Bàn chấm dứt khổ đau… thì đó là chánh tín. Còn mê tín là niềm tin sai, tin tưởng những thứ"
  },
  {
    "id": 133,
    "question": "Người ta nói các sư nguyên thủy là cỗ xe  nhỏ chỉ lo độ mình, không lo độ người, làm cho  đạo Phật không hưng thịnh còn Phật giáo phát  triển thì lo hoằng pháp độ sinh nên đạo Phật  hưng thịnh hơn có đúng không?",
    "category": "Giáo lý Căn bản",
    "answer": "Câu này không phải trong kinh Đức Phật nói mà chỉ khi Tăng chúng phân phái thành 2 hệ phái là Thượng tọa bộ và Đại chúng bộ, hai hệ phái mâu thuẫn nhau rồi bắt đầu mới gọi nhau là đại thừa và tiểu thừa. Các vị ở bên Đại chúng bộ hướng đến mục tiêu là tu, tích lũy các ba la mật để thành Phật tương lai, nên tự nhận là Đại Thừa (Phật Giáo phát triển). Còn bên Thượng tọa bộ tu Giới - Định - Tuệ như lời Phật dạy nên gọi là Phật Giáo nguyên thủy. Nói rằng là bên nguyên thủy chỉ lo độ mình không"
  },
  {
    "id": 134,
    "question": "Con vừa nghe Sư giảng là khi một người  mệnh chung, người đó nghĩ về một người thân  đã xuất gia và có đức hạnh có giới định tuệ thì  người mệnh chung đó sẽ được sanh về cõi lành.  Như vậy nếu như mình không có người nhà  xuất gia lúc mệnh chung mình nghĩ về một vị  Sư mà mình nhận thấy người đó có đầy đủ đức  hạnh thì mình có được về cõi lành không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Không nhất thiết phải là người thân, chỉ cần tôn trọng cung kính bất cứ một vị tỳ kheo nào mà 84 nếu như mình cung kính đúng vị đáng cung kính, tức là mình có sự hoan hỉ với giới của vị đó, với định, với tuệ, với sự giải thoát, của vị đó và đến lúc mình chết với thiện tâm đấy, với trí tuệ đấy, thì chắc chắn mình được sinh về cõi lành."
  },
  {
    "id": 135,
    "question": "Đời này vị đó phát nguyện là đời sau sẽ  xuất gia tu theo đúng chánh pháp của Phật, vậy  đời này vị đó cần làm những gì để đời sau vị đó  sẽ thành nguyện?",
    "category": "Giáo lý Căn bản",
    "answer": "Muốn phát nguyện kiếp sau trở lại làm người xuất gia theo chánh pháp thì phải học và hành theo chánh pháp, về Giới - Định - Tuệ, ngay từ bây giờ, để có được trí tuệ mạnh kiếp sau mới phân biệt được chánh tà. Hiện tại chưa xuất gia lâu dài được thì phải thường xuyên xuất gia gieo duyên để xem mình có hoan hỷ, tha thiết muốn sống đời xuất gia như vậy không. Và khi lễ Phật, tụng kinh, cúng dàng Tam Bảo, hay làm bất cứ việc phước thiện gì thì cũng chí thành tha thiết khởi lên ước nguyện: cầu mong ch..."
  },
  {
    "id": 136,
    "question": "Ở trong đoạn kinh “hết thảy phương xứ,  cùng khắp vô biên giới, vị ấy an trú biến mãn  với tâm cấu hữu với từ quảng đại vô biên không  hận, không sân.” là ám chỉ điều gì ạ? Nếu một vị  thực hành thiền tâm từ bằng cách rải tâm từ ra  khắp các phương hướng mà không hướng đến  85 một đối tượng chúng sinh nhất định nào thì có  được không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Ở đây, có nghĩa là rải tâm từ đến chúng sinh ở tất cả các 10 phương hướng, cùng khắp thế giới này như chúng sinh ở trên quả đất này, chúng sinh ở cõi địa ngục, chúng sinh ở cõi thiên giới, cõi phạm thiên, rồi chúng sinh ở các thế giới khác…Nếu chỉ mở tâm ra các phương hướng mà không thấy chúng sinh thì không phải là hành thiền tâm từ."
  },
  {
    "id": 137,
    "question": "Tưởng có phải là sự lưu trữ ghi lại thông  tin sau khi tâm tiếp nhận cảnh không ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tưởng là nhớ lại thôi, chứ nó không nghĩa lưu trữ gì hết. Như mình đã từng gặp một người nào đó rồi hôm sau mình gặp lại người đó mình nhận ra người quen thì đấy là tưởng là tưởng. Tưởng tượng, hay nhớ lại những cái mà mình đã từng thấy, đã từng nghe từng tiếp xúc…"
  },
  {
    "id": 138,
    "question": "Khi tâm khởi lên ý muốn cử động cánh tay  thì sẽ sinh ra phong đại khiến cánh tay di chuyển  ở sát na tâm nào trong một lộ trình tâm ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Mọi hành động đều là thân biểu tri sinh ra từ tâm thức ở sát na ý môn, và các tốc hành tâm. Khi tác ý muốn chuyển động là tạo ra sắc do tâm sinh, có phong đại nổi trội. 86"
  },
  {
    "id": 139,
    "question": "Pháp khởi tâm chính là như lý tác ý đúng  không ạ?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Như lý tác ý thì sẽ khởi lên các tốc hành tâm thiện, và để lại nghiệp thiện. Ví dụ như khi mắt thấy một cảnh sắc hiểu đúng bản chất của nó là tứ đại, vô thường, khổ, vô ngã… thì là như lý tác ý. Phi như lý tác ý thì sẽ khởi lên tâm bất thiện, và để lại nghiệp bất thiện. Ví dụ như sáu căn tiếp xúc với sáu trần rồi tác ý nó là thường, lạc, ngã, tịnh… thì là phi như lý tác ý."
  },
  {
    "id": 140,
    "question": "Chúng con làm việc ở công ty đôi khi có những  tranh luận xảy ra vì sự bất đồng quan điểm trong  cách xử lý tình huống, trong công việc có những  trường hợp không thể phân định đúng sai vì  mỗi người đều có ý đúng và do đó hai bên cứ thế  khăng khăng quan điểm của mình và điều này  khiến ảnh hưởng đến sự hòa thuận và mối quan  hệ giữa các đồng nghiệp ở trong công ty. Trong  trường hợp này chúng con cần phải làm gì?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Sống ở đâu cũng sẽ có những mâu thuẫn, bất đồng và phiền não như vậy, chỉ có nhiều hay ít mà thôi. Muốn tránh được những phiền não ấy thì mình phải có một pháp tu tâm và duy trì chánh niệm trên pháp tu ấy ở mọi lúc, mọi nơi. Ví dụ như thực hành thiền tâm từ, hoặc niệm Ân Đức Phật, hoặc niệm sự chết... hàng ngày, rồi khi đi làm cũng luôn giữ chánh niệm tỉnh giác ở trong tâm, thì khi có chuyện gì xảy ra thì mình cũng luôn giữ được sự bình tĩnh, sáng suốt và không bị lôi cuốn vào những chuyện phiền..."
  },
  {
    "id": 141,
    "question": "Một người trong bùn không thể kéo người  khác ra khỏi vũng bùn, vậy một người đang  ở trong vũng bùn có thể tự mình kéo mình ra  khỏi vũng bùn được không ạ Hay là vị đó vẫn  cần phải nhờ đến một người đã ra khỏi vũng  bùn kéo mình ra ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Ở trên đời này chỉ có hai người có thể tự mình ra khỏi bùn lầy mà không cần người khác kéo. Đó là Đức Phật Chánh Đẳng Giác và Đức Phật Độc Giác. là những bậc tự mình ở trong bùn lầy và nhận biết ra được đây là bùn lầy và bước qua được bùn lầy ấy. Ngoài hai bậc đấy ra thì ai cũng phải có người chỉ đường hết. Những người không học Phật Pháp cho dù có khởi lên những tâm tham dục, sân hận, si mê, tà kiến… họ cũng không biết đấy là bất thiện, là nhân của khổ đau, và không biết được phương pháp để"
  },
  {
    "id": 142,
    "question": "Con hay nghe pháp trong lúc làm việc nhà  và cả trước khi ngủ do trong lúc làm việc hoặc  trước khi ngủ con hay suy nghĩ linh tinh vậy  việc làm này có tội không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Suy nghĩ linh tinh thì là phóng dật là có tội. Còn nghe pháp thì là thiện pháp thì không có tội. Nghe Pháp trong lúc làm việc và trong lúc đi ngủ cũng được 88 nếu đấy là nghe gián tiếp. Mình thu âm lại các cái bài giảng pháp mình nghe trong lúc mình làm việc, trong lúc ăn, trong lúc ngủ thì cũng được. Còn nếu mà đang nghe pháp trực tiếp từ một vị giảng Sư đang giảng pháp thì ngồi nghe pháp trang nghiêm thành kính, nếu không thì phạm tội bất kính pháp thì có tội."
  },
  {
    "id": 143,
    "question": "Dùng đồ khá đắt tiền mà ba mẹ mua cho  con cái thì con cái có được tùy nghi sử dụng hay  không ạ? Ví dụ con không dùng đến chiếc máy  tính nữa mà đem cho tặng hoặc bán lại và dùng  tiền đó bố thí cúng dường mà ba mẹ không biết  hoặc biết nhưng không đồng ý thì có phạm lỗi  hay không ạ?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Nếu cha mẹ có cho nhưng con cái vẫn nằm ở trong quyền quản lý của cha mẹ, chưa phải là một cái người tự do làm những cái điều theo sở thích của mình, thì mình làm gì mình cũng phải xin phép thì mới đúng. Còn có những cái cha mẹ cho nhưng nó là của riêng mình, cha mẹ không để tâm, không quản lý nữa, thì nó là vật của riêng mình, mình mới được tặng, hoặc bán. Còn có những thứ mình biết rằng cha mẹ vẫn còn quản lý cả mình, cả những cái đồ của mình thì phải xin phép mới được, mình không xin"
  },
  {
    "id": 144,
    "question": "Những người lên đồng, gọi hồn, con thấy  khi họ gọi hồn về thì hồn nói cũng có nhiều điều  đúng mặc dù họ không biết gì về người chết cả? 89",
    "category": "Pháp Hành Đời Thường",
    "answer": "Có những hàng phi nhân, hay là các chư thiên sống ở trên mặt đất, ở trong các nhà của những người bình thường, người ta có tuổi thọ rất là lâu người ta biết hết cái quá khứ, tương lai của một người khác, hay là người ta biết cặn kẽ, chi tiết chuyện của một người khác, đó là chuyện bình thường, không khó khăn. Người ta nói ra được những chuyện đó cũng chẳng đem lại lợi ích gì cả, người đời thường thấy những việc đó hay sinh ra cái tâm cuồng tín, mê muội mà thôi, tốt nhất nên tránh xa những điều đ..."
  },
  {
    "id": 145,
    "question": "Thế nào là vị ngọt, sự nguy hiểm, sự xuất  ly đỗi với cuộc sống tại gia? Thế nào là vị ngọt,  sự nguy hiểm, sự xuất lý đối với cuộc sống xuất  gia? Thế nào là vị ngọt, sự nguy hiểm, sự xuất  lý đối với các vị Chư Thiên - Phạm Thiên?",
    "category": "Đời sống Gia đình & Cư sĩ",
    "answer": "Vị ngọt đối với người tại gia là sự hưởng thụ các dục lạc như: lấy được vợ đẹp, có con ngoan, có nhiều tài sản, có danh vọng, có chức quyền…. Còn sự nguy hiểm thì nó tiềm ẩn ngay trong vị ngọt đấy, người vợ đấy có thể làm những việc hư hỏng, con cái có thể hư hỏng, danh vọng có thể bị mất đi, chức quyên bị mất đi, lúc nào đó mình sẽ lâm vào tù tội, do mình đắm nhiễm vào tham dục nhiều quá, một lúc nào đó mình sẽ phạm những lỗi lầm đi tù tội, bị đánh đập, có thể bị mất mát về tài sản, bị mất mát ..."
  },
  {
    "id": 146,
    "question": "Tại sao cần phải hành thiền, có lợi ích và  mục đích gì?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vì nội tâm có nhiều phiền não, tham, sân, si và thực hành thiền là con đường duy nhất có thể đoạn trừ tuyệt đối được những phiền não ấy. Người có lòng tham lớn, sân hận lớn, si mê tà kiến lớn thì tạo tạo rất nhiều tội lỗi, ác nghiệp, những điều ấy sẽ cho quả báo đau khổ lâu dài ở địa ngục, ngã quỷ, súc sinh… Việc hành thiền sẽ làm giảm bớt hoặc đoạn trừ được những tâm bất thiện và hành động bất thiện ấy nên việc hành thiền sẽ dần dần phát sinh trí tuệ giác ngộ chân lý các sự thật, và đi đến chấm..."
  },
  {
    "id": 147,
    "question": "Thiền sinh cần phải thực hành thiền theo  lộ trình tuần tự như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Tùy theo khả năng của mỗi vị thiền sinh, và tùy thuộc vào kinh nghiệm hướng dẫn của mỗi vị thầy, nên lộ trình thực hành có thể khác nhau. Trước tiên vị ấy nên thực hành một pháp thiền định ví dụ như thiền hơi thở. Vị ấy cần chánh niệm tỉnh giác nhận biết hơi thở vào ra ấy cho đến khi đắc định, và phát triển được tợ tướng vững mạnh để chứng đắc đến; Sơ - Nhị - Tam - Tứ Thiền. Tiếp theo vị ấy sẽ thực hành quán 32 thể trược, rồi hành 10 kasina đạt đến Tứ Thiền, Bát Định. Tiếp theo là hành bốn thiền..."
  },
  {
    "id": 148,
    "question": "Có những điều gì là cấm kỵ cần phải kiêng  tránh trong khi thực hành thiền không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "- Tránh khoe khoang công hạnh thực hành, và sự tu chứng của bản thân. Tránh mong cầu thần thông và những điều huyền bí khác. Tránh thân cận những nơi ồn ào bất thiện, và những người tà kiến, bất thiện 93 Tránh khởi lên các phiền não: như tham dục, sân hận, ác ý với ai ở đời Tránh buông lung, phóng dật, lười biếng…"
  },
  {
    "id": 149,
    "question": "Với một người thực hành thiền mà không  thể chứng đắc các pháp thiền chỉ - quán cao thì  có lợi ích gì không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Dù không đắc thiền, nhưng khi thực hành có chánh niệm tỉnh giác, vẫn khởi lên được những thiện tâm cao thượng, để lại những thiện nghiệp cao thượng, phát triển được các ba la mật cao thượng, khiến cho nội tâm càng ngày càng thanh tịnh, làm giảm bớt các phiền não, bất thiện, làm tăng trưởng phước trí, và nhanh chóng chứng ngộ Niết Bàn trong tương lai. Đó là những lợi ích của sự thực hành thiền."
  },
  {
    "id": 150,
    "question": "Hành thiền hơi thở một thời gian mà  không có kết quả thì có nên đổi sang pháp thiền  khác không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nếu cảm thấy không tiến bộ thì có thể đổi một pháp thiền khác như thực hành các kasina hoặc thực hành thiền tứ đại…"
  },
  {
    "id": 151,
    "question": "Nhân duyên gì khiến cho một người có thể  chứng đắc đạo quả ngay trong khi đang nghe  một thời pháp - ngày nay có thể chứng đắc  được như thế không? 94",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Đó là những người đã từng tu tập thực hành thiền tuệ trong nhiều kiếp quá khứ rồi, đã đầy đủ nhân duyên rồi thì mới giác ngộ được như thế. Khi Đức Phật còn tại thế thì có rất nhiều người như vậy, càng về sau này thì càng ít đi. Thời nay không còn nghe nói đến ai có thể chứng đắc được như thế nữa."
  },
  {
    "id": 152,
    "question": "Một người chỉ hành thiền nhưng không bố  thí - và một người chỉ bố thí nhưng không hành  thiền thì sẽ cho quả báo như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Người hành thiền nhưng không bố thí, thì hưởng phước hiện tại lạc trú, dễ dàng chứng đắc, thiền, thông, đạo quả. Nhưng vị ấy ít được hưởng phước thế gian, ít nhận được các vật dụng, vị ấy sống đơn lẻ một mình, có ít người thân cận xung quanh. Với người chỉ bố thí mà không hành thiền thì có nhiều phước thế gian, có nhiều tài sản, danh vọng, chức quyền…nhưng cuộc sống của vị ấy có nhiều phiền não, khổ tâm, dễ sinh ra tà kiến và ở trong sinh tử lâu dài. Vậy người có đầy đủ cả hai phước ấy thì sẽ"
  },
  {
    "id": 153,
    "question": "Một người hành thiền bị ngộ nhận - chưa  chứng đắc mà tưởng mình đã chứng đắc thì có  lợi ích hay tổn hại gì không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bị ngộ nhận thì dễ sinh ra những tà kiến, ảo tưởng, ngã mạn, tăng thượng mạn, tổn hại công đức phước lành. Tà kiến ấy dễ lan truyền đến những người khác khiến cho nhiều người đi lạc đường. Nếu 95 không thức tỉnh sớm, không từ bỏ được sự ngộ nhận ấy thì sẽ đi đến sa đọa vào cõi khổ đau."
  },
  {
    "id": 155,
    "question": "Một người hành thiền thì sẽ có lợi ích gì  đối với hiện tại và tương lai?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Lợi ích ở hiện tại là được an trú trong trạng thái an lạc, không bị khổ tâm bởi các phiền não thiêu đốt. Được mọi người kính trọng, được chư thiên ái kính, hộ trì…Lợi ích ở tương lai là sẽ thể nhập Niết Bàn, chấn dứt khổ đau sinh tử. Nếu chưa chứng ngộ Niết Bàn thì sẽ tái sinh về cõi an lành, không bị đọa vào cõi khổ đau."
  },
  {
    "id": 156,
    "question": "Ngày nay có rất nhiều người dạy các pháp  thiền khác nhau - làm sao để mình biết được  96 pháp nào đúng, pháp nào sai mà lựa chọn để  thực hành?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Với người trí tuệ thấp thì rất khó để nhận biết được pháp nào đúng, pháp nào sai. Nhưng có thể nhận biết được đạo hạnh của vị thầy dạy pháp ấy như thế nào: Nếu vị thầy ấy có nhiều phiền não, tham, sân, si còn nhiều thì có thể pháp ấy không đúng. Nếu vị ấy dạy pháp vì danh lợi, tự khen đức hạnh của mình, thích chê bai người khác, mong được mọi người cung kính, cúng dàng thì pháp ấy có thể không đúng."
  },
  {
    "id": 157,
    "question": "Nếu tu tập thiền định thì ta chỉ có thể chứng  thiền thôi, thế làm sao sau khi chứng thiền có  thể chứng được Thánh quả? Còn nữa con nghe  nói có những vị chưa chứng thiền mà vẫn chứng  Thánh thì các vị ấy tu tập như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nếu chỉ dừng lại ở thiền định thôi thì không chứng được Thánh Quả, còn nếu thực hành chứng đắc thiền định rồi lại chuyển sang thực hành thiền 97 tuệ, nhờ có thiền định làm nền tảng nên dễ dàng chứng đắc Đạo Quả. Có người không thực hành thiền định, mà thực hành thẳng vào thiền tuệ, thì cũng phải đạt đến cận hành định hoặc sát na định thì mới phát triển được trí tuệ, nhờ trí tuệ ấy mà chứng đắc Đạo Quả. Vì vậy"
  },
  {
    "id": 158,
    "question": "Một người muốn thành tựu được cả pháp  học và pháp hành thì phải làm gì?",
    "category": "Giáo lý Căn bản",
    "answer": "Nếu còn ở độ tuổi thiếu niên thì nên chăm chỉ học pháp. Khi chuyên tâm pháp học thì cũng nên dành một ít thời gian để tập hành thiền. Nếu đã đến tuổi trung niên trở lên thì nên chuyên tâm hành thiền. Khi chuyên tâm hành thiền thì cũng phải hạn chế pháp học, để thực hành cho thành tựu các pháp thiền chỉ, quán. Khi đã thực hành thành tựu rồi lại hướng về pháp học thì sẽ dễ dàng hơn. Một người luôn nỗ lực tinh tấn trau dồi cả pháp học và pháp hành, một thời gian dài không lười biếng thì sẽ thành tự..."
  },
  {
    "id": 159,
    "question": "Hành thiền như thế nào là tạo ra được các  ba la mật?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nếu thực hành thiền chỉ - quán một cách nghiêm túc, với ước muốn chứng ngộ Niết Bàn thì sẽ tạo được rất nhiều ba la mật như: 98 Vì không phạm giới, nên có trì giới ba la mật Sống độc cư, viễn ly xa lìa ngũ dục, nên được xuất ly ba la mật Phát triển tuệ quán nên được trí tuệ ba la mật Nỗ lực, cố gắng thực hành nên được tinh tấn ba la mật"
  },
  {
    "id": 160,
    "question": "Người hành thiền để mong cầu phước báu  như - sống lâu, mạnh khỏe, sắc đẹp, giàu sang  thì có được không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Trong khi hành thiền thì thiện tâm hợp trí tuệ sinh lên rất mạnh để lại những thiện nghiệp rất 99 lớn, vì thế mình có thể mong cầu những điều cao thượng nhất, như chứng ngộ Niết Bàn, hoặc cầu sinh về cõi Phạm Thiên, Chư Thiên hoặc mong cầu những hạnh phúc ở cõi người như sống lâu, mạnh khỏe, sắc đẹp, giàu sang thì cũng đều đạt được."
  },
  {
    "id": 161,
    "question": "Một người cần có trình độ Phật học như  thế nào để có thể thực hành thiền được - pháp  học và pháp hành hỗ trợ lẫn nhau như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vị ấy chỉ cần có đủ niềm tin về nghiệp và quả của nghiệp, tin rằng có nhiều kiếp sống luôn hồi tái sinh, và có con đường chấm dứt vòng tái sinh ấy chính là thực hành thiền, thì vị ấy có thể thực hành thiền được. Pháp học sẽ giúp cho vị ấy có niềm tin đúng và mạnh mẽ, khiến cho vị ấy tinh tấn thực hành. Pháp hành sẽ giúp cho vị ấy sáng tỏ được những gì đã tin tưởng ở pháp học. Người có pháp học tốt thì khi nhất tâm thực hành sẽ dễ dàng nhanh chóng. Người có pháp hành tốt thì khi học cũng dễ dàng ..."
  },
  {
    "id": 162,
    "question": "Người hành thiền là đang tạo nghiệp gì -  và quả báo sẽ như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Người mới thực hành thiền đang phát triển chánh niệm, tỉnh giác, cho đến khi đạt đến định cận hành là đang tạo ra các thiện nghiệp Dục giới, sẽ cho ra quả, hạnh phúc an vui ở cõi nhân thiên. Khi chứng đắc được Sơ, Nhị, Tam, Tứ thiền an trú ở trong các tầng thiền ấy là đang tạo thiện nghiệp Sắc giới sẽ cho quả sinh về các cõi Phạm Thiên Sắc Giới. Khi chứng 100 bốn tầng thiền Vô Sắc, an trú ở đó là đang tạo thiện nghiệp Vô Sắc, sẽ cho quả sinh về bốn cõi Vô Sắc Giới."
  },
  {
    "id": 163,
    "question": "Thời Đức Phật thì hầu hết Tăng Ni đều  hành thiền - vậy tại sao thời nay hầu hết Tăng  Ni lại không thực hành thiền?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vì thời Đức Phật thuần là Chánh Pháp, Đức Phật chủ trương khai mở ra Giáo Pháp này là để thực hành thiền hướng đến Giác Ngộ, giải thoát. Ở thời kỳ đầu, Tăng Ni chỉ có mục đích ấy và phận sự ấy. Sau này giáo pháp lan tỏa rộng ra, tín đồ Phật tử nhiều lên Tăng Ni lại vướng vào nhiều phận sự khác, như là thực hiện các hình thức nghi lễ, xây dựng tu viện, quảng bá giáo pháp dưới nhiều hình thức khác nhau… càng lúc những phận sự bên ngoài ấy càng nhiều lên, đa số Tăng Ni quá bận rộn không còn thời gi..."
  },
  {
    "id": 164,
    "question": "Một người không tin vào thuyết luân hồi  tái sinh mà thực hành thiền thì có lợi ích gì  không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Không có niềm tin như vậy, nếu có thực hành thì vị ấy sẽ có tâm niệm không chân chánh, mục đích không chân chánh, dễ khởi lên những mong cầu hạ liệt hướng về hưởng thụ ngũ dục lạc, dễ sinh ra ảo tưởng, hoang tưởng, loạn tưởng. Thực hành như vậy thì vui ít, khổ nhiều, phiền não nhiều, sự nguy hiểm sẽ nhiều hơn."
  },
  {
    "id": 165,
    "question": "Nhiều người tin rằng có luân hồi tái sinh -  vậy tại sao họ vẫn không thực hành thiền?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Dù tin có luân hồi, nhưng lại không thấy được sự nguy hiểm trong luân hồi. Có khi còn tham ái với luân hồi, còn ưa thích lạc thú ở các cõi thiên giới, nên người tin có luân hồi thường ưa thích tạo phước, để hưởng phước hữu lậu ấy ở tương lai."
  },
  {
    "id": 166,
    "question": "Pháp hành thiền có thể làm thay đổi tâm lý,  tính cách và số phận con người không - và thay  đổi như thế nào?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nếu thực hành tốt, có sự thành tựu, có kết quả thì sẽ có sự thay đổi rất lớn, những tâm tánh bất thiện, như tham dục, sân hận, si mê, tà kiến, phóng dật, tội lỗi…dần dần sẽ giảm bớt, những đức tính thiện lành, cao thượng, như lòng từ, bi, hỷ, xả, vô tham, vô sân, trí tuệ, phước lành sẽ tăng lên. Như người đi từ trong bóng tối đi ra ánh sáng, từ vực thẳm lên bờ cao, 102 từ bùn thối lên tòa sen thơm…mọi thứ sẽ thay đổi như vậy."
  },
  {
    "id": 167,
    "question": "Một số người hành thiền một thời gian thì  trở lên rất là kiêu mạn, khó tính, thích chỉ trích  nói xấu người khác… là do nguyên nhân gì?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vì vị ấy quá tự hào về một chút thành quả đã đạt được, quên mất mục đích tối hậu của sự thực hành thiền là đoạn trừ vô minh, tham ái, chấp thủ…. Như người vào rừng lấy lõi cây, lấy được vỏ cây đã cho là lõi cây nên say mê, tham đắm phóng dật, khen mình chê người, vì vậy mà không lấy được lõi cây. Một số người thực hành thiền cũng vậy vì tự mãn sớm quá sẽ không đạt được múc đích là giác ngộ, giải thoát."
  },
  {
    "id": 168,
    "question": "Người Phật tử tại gia thì nên tu tập như  thế nào để dễ dàng hòa nhập với xã hội mà  vẫn giữ được tâm trong sạch không bị nhiễm  những pháp bất thiện ở đời?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nên thực hành các pháp thiền bảo hộ, như thiền tâm từ (Cầu mong cho mọi người được an vui hạnh phúc). Thiền tâm bi (Cầu mong cho mọi người thoát khổ đau). Thiền tâm hỷ (Cầu mong cho mọi người không phải xa lìa những thành công của họ). Thiền tâm xả (Mọi người là thừa tự của nghiệp mà họ đã tạo). Các pháp thiền tâm từ, bi, hỷ, xả này sẽ giúp cho hành giả hòa hợp với mọi người xung quanh, tránh được những ác cảm, mâu thuẫn, xung đột với mọi người."
  },
  {
    "id": 169,
    "question": "Một người tu đắc đạo thì vị đó có thần  thông không - và một người có thần thông thì  vị đó có phải là tu hành đắc đạo không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thần thông là kết quả của thiền định, Đạo Quả là kết quả của thiền tuệ. Một người chuyên thực hành thiền định thì có thể chứng được thần thông, nhưng không chứng đạo quả. Một người chuyên hành thiền tuệ thì có thể chứng Đạo Quả nhưng có thể không có thần thông. Một người vừa thực hành thiền định, vừa thực hành thiền tuệ thì có thể chứng được cả thần thông và Đạo Quả."
  },
  {
    "id": 170,
    "question": "Một người thường làm từ thiện xã hội  như bố thí giúp người thì đó có phải tâm từ bi  không - quả báo sẽ như thế nào với người có  hành thiền tâm từ nhưng không bố thí cho ai  gì cả?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Một người trước, trong và sau khi làm việc bố thí mà có khởi lên suy nghĩ rằng; mong có người thọ thí được an vui, hạnh phúc thì đó là tâm từ. Hoặc họ thấy người thọ thí đang khổ đau và ước mong cho người thọ thí thoát khổ đau thì đó là tâm bi. Tâm từ, bi và hành động bố thí ấy đều thuộc về tâm thiện dục giới, cho quả phước lành ở cõi nhân thiên trong tương lai. Từ nhân bố thí sẽ cho quả giàu sang, từ nhân khởi lòng từ, bi sẽ cho quả được an vui, sắc đẹp… Còn với người chỉ hành thiền tâm từ nhưn..."
  },
  {
    "id": 171,
    "question": "Có người nào tu chưa đắc thiền - đắc đạo  mà tưởng mình đã đắc không - hoặc có người  nào tu đã đắc thiền - đắc đạo mà không biết  mình đã đắc không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Ngày nay có rất nhiều người ngộ nhận về sự đắc thiền và đắc đạo này. Nguyên nhân ngộ nhận là do tự thực hành không có thầy hướng dẫn, hoặc vị đó 105 được một vị thầy không thực chứng, vị thầy ngộ nhận rồi truyền đạt lại sự ngộ nhận đó, có những thiền sinh thì cố tình nói dối nâng cao sự tu tập của mình lên để được vị thầy công nhận cho sự chứng đắc ấy. Đắc thiền và đắc đạo có sự khác nhau, đắc thiền là sự thanh tịnh hóa dần dẫn, nhờ sự tinh tấn thực hành"
  },
  {
    "id": 172,
    "question": "Một người đang hành thiền làm lợi cho  bản thân mình. Vậy người ấy có đang làm lợi  cho người khác được không? Và làm việc ấy  như thế nào? 106",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Đức Phật dạy rằng: “dù lợi người bao nhiêu chớ quên phần tự lợi, nhờ thắng trí tự lợi hãy chuyên tâm lợi mình” . Lợi mình chính là thực hành thiền. Người đang làm lợi ích cho mình thì cũng có lợi ích cho người. Ví dụ như một người có bệnh, bản thân người bệnh cũng đau khổ, mà những người thân cũng khổ đau, mình ốm đau thì những người thân xung quanh cũng đâu sung sướng gì, mình khổ thì mọi người cũng khổ. Khi người chữa trị cho lành bệnh đó, thì bản thân mình an lành mà những người"
  },
  {
    "id": 173,
    "question": "Có người bảo rằng để tâm trước cửa mũi  khi ngồi thiền thì lực sẽ chạy lên não và gây đau  đầu, căng thẳng. Do đó, nhiều vị chủ trương  rằng để tâm ở đan điền, đưa tâm quan sát toàn  thân cho đến khi tâm lắng dịu, bớt lăng xăng,  hơi thở nhẹ nhàng thì bắt đầu biết rõ hơi thở,  xin Sư cho con hỏi như vậy có đúng không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Trong pháp tu tập thiền của Phật giáo không có khái niệm về huyệt đan điền, chỉ có các nhà võ học tập tập khí công thì mới có khái niệm về huyệt đan điền. Hành thiền là tu tâm để đoạn trừ phiền não, không có lực chạy lên chạy xuống gì hết, nên cứ yên tâm, để tâm ở trước cửa mũi và quan sát hơi thở nhẹ nhàng thì sẽ không đau đầu mà còn phát sinh sự hỷ lạc khinh an rất cao độ và đi đến đắc định, đắc thiền, 108 nên cứ yên tâm mà thực hành đừng sợ, đừng chấp"
  },
  {
    "id": 174,
    "question": "Một người tín đồ của tôn giáo khác có thể  thực hành đắc được thiền chỉ, thiền quán, được  giác ngộ niết bàn của Phật Giáo không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nếu vị ấy nỗ lực, tinh tấn thực hành với mục đích, đoạn trừ các phiền não ở trong nội tâm mình thì vẫn có thể đắc được các pháp thiền chỉ, thiền quán và giác ngộ Niết Bàn chấm dứt khổ đau. Đức Phật cũng từng hóa độ cho nhiều người ngoại đạo sau khi nghe pháp các vị ấy cũng giác ngộ sự thật, đoạn trừ phiền não, chứng ngộ Niết Bàn và sẽ quy y trở thành Phật tử. Khi đã giác ngộ rồi thì niềm tin vào Tam Bảo sẽ là tuyệt đối vị ấy sẽ tự nhận biết được đâu là chánh, đâu là tà và sẽ tự động bỏ tà, quy c..."
  },
  {
    "id": 175,
    "question": "Làm thế nào để phát triển được tâm xả,  không yêu không ghét?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thực hành thiền tâm xả với tác ý: Chúng sinh là chủ nhân của nghiệp, là thừa tự của nghiệp thì sẽ giữ được tâm bình thản, không yêu, không ghét với tất cả chúng sinh. Thực hành các pháp thiền quán bất tịnh như: niệm xác chết, niệm sự chết, thân hành niệm, thiền tứ đại thì sẽ đạt được tâm bình thản, với những sự vật khả ái trên đời 109 Thực hành thiền tuệ niệm vô thường, khổ, vô ngã"
  },
  {
    "id": 176,
    "question": "Có người cho rằng Bát Chánh Đạo mới là  giải thoát còn thiền chỉ là bổ trợ cho giải thoát  mà thôi. Có người thì cho rằng thiền mới giải  thoát được còn Bát Chánh Đạo chỉ là bổ trợ  thôi. Vậy như thế nào mới là đúng ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thực hành thiền chính là thực hành Bát Chánh Đạo. Chánh kiến - chánh tư duy là thực hành thiền tuệ minh sát Chánh ngữ - chánh nghiệp, chánh mạng là giữ giới thanh tịnh Chánh tinh tấn, chánh niệm, chánh định là thực hành thiền định Vậy ai thực hành Giới - Định - Tuệ chính là đang thực hành Bát Chánh Đạo."
  },
  {
    "id": 177,
    "question": "Trong 10 Ba-la-mật thì Ba-la-mật từ pháp  hành thiền so với Ba-la-mật từ hành động bố  thí, cúng dường thì có khác nhau không ạ, quả  cho ra khác nhau như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bố thí, cúng dường bằng những tài sản, vật chất rồi nguyện chứng ngộ Niết Bàn thì mới trở thành pháp Ba-la-mật. Người hành thiền rồi sau này chỉ dẫn cho người khác thực hành thiền thì đấy cũng là bố thí, và đó là pháp thí. “Pháp thí thắng mọi thí” . 110 Bố thí pháp là bố thí sự bất tử nên thù thắng hơn bố thí vật chất. Trong hành thiền sẽ đầy đủ tất cả các Ba la mật khác nên thực hành thiền thì những Ba-la-mật đó mạnh mẽ hơn, sẽ đi đến Niết-bàn nhanh chóng"
  },
  {
    "id": 178,
    "question": "Con đã thực hành thiền niệm Ân Đức Phật  và thiền hơi thở nhiều lần nhưng thất bại. Khi  thiền Ân Đức Phật, con cảm thấy mệt và nhức  đầu, còn khi thiền hơi thở con không cảm nhận  được hơi thở mặc dù đã cố gắng thư giãn, để  tâm nhẹ nhàng rồi ạ. Như vậy là do con không  thể thực hành và đắc thiền định được hay do  con phù hợp với đề mục thiền khác ạ? Và có  nhiều thầy mỗi thầy một ý con không biết nghe  theo ai ạ. Con nghĩ là con không có duyên với  thiền, tuổi con còn trẻ con nghĩ thời điểm hiện  tại con nên dừng việc hành thiền lại, tập trung  vào phát triển, học tập, công việc, giữ giới, tìm  hiểu về pháp học. Còn việc hành thiền thì sẽ đợi  đến khi nào có nhân duyên gặp được đúng thầy  là người tu hành chân chánh đúng chính pháp  và thực tu thực chứng để được sự chỉ dẫn trực  tiếp từ vị ấy thì sẽ tốt hơn. Con sợ rằng nếu tự  thực hành mà hành sai thì sẽ nguy hiểm và  bị tẩu hỏa nhập ma ạ. Con xin Sư cho con lời  khuyên ạ!",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thực hành mà cứ thực hành thôi thì lại tốt đẹp, còn thực hành mà thấy mình hành dở với hành không dở tức là mình đang mong cầu chứng đắc cái gì 111 đó thì sự thực hành đó không xuất phát từ tâm chân chánh. Cho nên gặp trở ngại là do tâm của mình không được tự nhiên. Thực hành là để giảm bớt phiền não, để an tâm. Niệm Ân Đức Phật cho tâm hoan hỷ với Đức Phật, chứ cứ mong cầu phải đắc định. Hành hơi thở cũng vậy, để tâm bớt lăng xăng, mình phải biết"
  },
  {
    "id": 179,
    "question": "Bốn sắc chân đế (địa đại, thủy đại, hỏa đại,  phong đại) khác biệt thế nào với các khái niệm  đất, nước, lửa, gió theo chế định bình thường ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bây giờ mình nhìn thấy đất, nước, lửa, gió ở bên ngoài bằng con mắt mình thấy thì chỉ là tục đế, còn chân đế là mình phân tích ra được nó. Ví dụ như người đấy phân tích ra được đất, nước, lửa, gió ở trên thân mình thì cái thân mình nó tan ra thành các hạt sắc. Rồi vị đó nhìn sâu vào những hạt sắc đó, phân tích ra được những hạt sắc đó là sắc gì. Ví dụ mình 112 phân tích ở trên thân có những cái sắc do nghiệp quá khứ sinh, sắc do tâm sinh, sắc thời tiết sinh, sắc vật"
  },
  {
    "id": 180,
    "question": "Tưởng tri và tuệ tri khác nhau như thế nào ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tưởng tri là hiểu sai, tuệ tri là hiểu đúng. Tưởng tri ví dụ như có người làm một cái hình nộm để ở giữa đường, người nào đi qua nhìn thấy cái hình nộm từ xa nghĩ là người thật thì đấy là tưởng tri. Nhưng khi lại gần rồi mới thấy đó là hình nộm bù nhìn, lúc đấy người đó nhận ra sự thật thì đó mới là tuệ tri. Vậy trưởng tri là nhìn sai, hiểu sai, tuệ tri là nhìn đúng, hiểu đúng. Cũng vậy, trên thân tâm năm uẩn này, một người vô minh thì nghĩ rằng cái thân này"
  },
  {
    "id": 181,
    "question": "Có người cho rằng việc nỗ lực chứng đắc  các tầng thiền là tu sai, bởi vì ý niệm phải chứng  cái này, cái kia làm tăng trưởng ngã mạn. Và  thứ hai là khi mình nghĩ phải tu chứng cái này,  cái kia thì đó là tà kiến về bản ngã cho nên là  ko nên tu chứng đắc các tầng thiền, chỉ cần hay  biết duy trì sự tỉnh giác là đủ. Vậy việc tu chứng  các tầng thiền định là nên hay không nên ạ? Và  con nên có như lý tác ý như thế nào để không  rơi vào tà kiến và ngã mạn với sự chứng đắc và  các thành tựu tâm linh của bản thân ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Có tà kiến hay không còn do bản thân người đó. Việc tu tập thì mình cứ tu tập, còn sự chứng đắc là kết quả của sự tu tập. Cũng giống như một người mang một hạt cam đi trồng, hạt cam đấy mọc lên rồi sẽ phải ra hoa kết trái, đó là yếu tố tự nhiên của nó cho dù người đó có mong hay không mong. Người đó trồng đúng thì vẫn ra quả, người đó trồng sai thì nó sẽ chết mà không ra quả. Cũng như con gà ấp trứng, 115 nó mong rằng con ta sẽ nở ra, nó mong như vậy cũng"
  },
  {
    "id": 182,
    "question": "Đoạn trong bài kinh số 1 này “Thắng tri  tứ đại là tứ đại” , “Dục hỷ là căn bản của đau  khổ, từ hữu, sanh khởi lên” , “Thắng tri Niết-bàn  là Niết-bàn” là thuộc những đế nào trong Tứ  Thánh Đế / Tứ Diệu Đế ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Vị ấy thấy được thân này là đất, nước, lửa, gió thì vị ấy cũng thấy đất, nước, lửa, gió đấy sinh lên và diệt đi liên tục. Chính vì thấy được tính sinh lên, diệt đi liên tục như thế nên vị đó thấy được sự vô thường. Vì nó vô thường như thế cho nên nó là khổ. 117 Vì khổ nên nó là vô ngã. Khi thấy được sự thật của tứ đại đất, nước, lửa, gió rồi là vị đó thấy được chân lý thứ nhất - Khổ Đế. Rồi vị đó thấy được dục hỷ là nguyên nhân sinh ra khổ, từ hữu sanh khởi lên thì"
  },
  {
    "id": 183,
    "question": "Pháp vô vi và pháp hữu vi khác nhau như  thế nào ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Pháp Hữu Vi tức là những cái thuộc về danh và sắc, là những cái có tính sinh và diệt, cái danh sắc này nó cứ sinh diệt liên tục. Tất cả những vật chất mà chúng ta nhìn thấy hay không nhìn thấy, thân và tâm của mình luôn luôn sinh diệt, vô thường, vì vô thường nên khổ, vì khổ mình không làm chủ được nó nên gọi là vô ngã. Đấy là đặc tính của pháp hữu vi. Hữu vi là thuộc về vật chất và tinh thần, danh và sắc. Còn pháp vô vi là chỉ cho một trạng thái của sự không hiện hữu các pháp hữu vi. Nó chỉ là ..."
  },
  {
    "id": 184,
    "question": "Danh là gì và sắc là gì ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Danh là cái chỉ cho tâm của con người, tâm và tâm sở. Tâm của mình vui hay buồn, hay là những tư tưởng, những nhận thức và tất cả những tâm thức đấy được gọi là danh. Theo thuật ngữ Phật học danh gọi là Nāma, còn sắc là Rūpa. Sắc chỉ cho những cái thuộc về vật chất, là thân của mình. Các vật chất ở bên ngoài thì được gọi là sắc. Vậy thì cứ gọi sắc là thân, danh là tâm. Còn muốn hiểu sâu thì phải học vi diệu pháp và thực hành thiền tuệ, để hiểu rõ hơn về danh và sắc."
  },
  {
    "id": 185,
    "question": "Có bao nhiêu loại tham ái ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Tham ái mà phân tích ra ở mức độ chi tiết thì rất nhiều nhưng chỉ phân tích ở mức độ tổng quát thôi thì có sáu ái. Con mắt tham ái với sắc, tai tham ái với âm thanh, mũi tham ái với mùi hương, lưỡi tham ái với vị, ý tham ái với các pháp. Sáu căn tham ái với sáu trần, đó là sáu tham ái. Hay là ở mức độ tổng quát hơn nữa thì là dục ái, hữu ái, vô hữu ái. Tức là tham ái ở cõi dục, chúng sinh ở cõi dục thì tham ái với những cảnh dục. Ở các giác quan tham ái với các cảnh trần được gọi là dục ái. Hữu ..."
  },
  {
    "id": 186,
    "question": "Thân kiến là gì ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Thân kiến là sự thấy biết về thân năm uẩn này. Thấy đúng là chánh kiến, thấy sai là tà kiến. Một người vô văn phàm phu thì có tưởng tri về thân, từ đó sẽ chấp thân này là thường, lạc, ngã, tịnh, tức là tôi, là của tôi, tự ngã của tôi, thì đấy là người tà kiến hay chưa đoạn trừ được thân kiến. Đối với người có trí tuệ thì phân tích ra được, thấy được thân này là đất, nước, lửa, gió; năm uẩn này là vô thường, khổ, vô ngã thì vị đó đoạn trừ được tà kiến, đoan trừ được những ảo tưởng, những hiểu biế..."
  },
  {
    "id": 187,
    "question": "Có gì khác nhau giữa sự liễu tri và trí tuệ  của một vị thánh hữu học và một bậc A-la-hán ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Bậc thánh hữu học có liễu tri, tức là cũng thấy được sự vô thường, khổ, vô ngã ở trên thân, nhưng vị đó mới liễu tri được 1 phần chứ không liễu tri được toàn phần. Còn các bậc A-la-hán thì liễu tri được toàn phần chứ không còn sự liễu tri một phần như các bậc thánh hữu học. Các bậc thánh hữu học mặc dù đã đoạn trừ được thân kiến, hoài nghi, giới cấm thủ nhưng có thể các vị ấy vẫn còn có dục tham, sân hận. Rồi cũng có các bậc thánh đã đoạn trừ được dục tham, sân hận nhưng vẫn còn hữu ái, vô hữu á..."
  },
  {
    "id": 189,
    "question": "Mấy hôm nay hành thiền con thấy căng  cứng ở quanh mũi là sao ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vậy là do chăm chú mạnh quá nên mất đi sự tự nhiên. Hoặc là do chú tâm vào cái da ở mũi nhiều quá. Bây giờ phải để tâm nhẹ ra một chút, để cách cái da ra một chút, ngồi nhẹ nhàng, thản nhiên hơn một chút thì nó sẽ bớt căng đi. 122"
  },
  {
    "id": 190,
    "question": "Con hành thiền đã được hơn hai năm, con  ngồi 2 tiếng buổi sáng, thời gian đầu con không  bị hôn trầm nhưng từ năm thứ hai trở đi con  hay bị rơi vào hôn trầm và con dường như dậm  chân tại chỗ, không tiến bộ hơn được. Xin Sư  cho con lời khuyên để con có thể thêm nỗ lực  tinh tấn hơn?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Cần phải đến một môi trường tu tập để trình pháp thực tế hàng ngày thì mới tiến bộ được. Thực hành thiền hơi thở phải để tâm vào đúng hơi thở, ở vị trí của hơi thở, ở đúng điểm xúc chạm và nhận biết được hơi thở, chú tâm vừa phải, tự nhiên thì càng ngồi lâu chánh niệm càng mạnh, tỉnh giác càng cao mới đúng. Còn nếu tâm nó bắt nhiều đối tượng một lúc thì chánh niệm rất là yếu, không có sự tỉnh giác cao, cho nên sinh ra hôn trầm. Phải điều chỉnh lại cách chú tâm vào một điểm nhỏ, chú tâm vừa phải,"
  },
  {
    "id": 191,
    "question": "Sắc mạng căn và sắc giới tính là gì ạ? Sắc  khinh, sắc nhu là gì ạ?",
    "category": "Giới luật & Ăn uống",
    "answer": "Sắc mạng căn là sắc duy trì mạng sống do nghiệp sinh. Sắc giới tính là sắc biểu hiện tính chất của giới tính nam, nữ khác nhau. Người nam có có biểu hiện là mạnh mẽ, người nữ có biểu hiện dịu dàng. Sắc khinh là tính chất nhẹ nhàng, sắc nhu là tính mềm mại của các sắc biểu tri. Người nào thực hành thiền tứ đại, phân biệt được 28 loại sắc ở sáu căn bên trong, bên ngoài thì sẽ tuệ tri rõ về các loại sắc ấy. 123"
  },
  {
    "id": 192,
    "question": "Khi vào tứ thiền sắc giới có phải mình  ngưng thở, tai mình không còn nghe âm thanh,  không còn thân không ạ? Mình quán các chi  thiền là khi mình nhập vào tầng thiền rồi quán  hay khi mình xuất khỏi tầng thiền mình mới  quán ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Khi tâm vào an chỉ định của tứ thiền thì nó không còn hơi thở nữa. Hơi thở dừng lại hoàn toàn và lúc đấy các căn khác không hề có nhận biết. Ví dụ như nhãn thức ngưng, nhĩ thức ngưng nên không nghe âm thanh hoặc lúc đấy có những cái âm thanh tác động vào lớn quá thì nó trượt ngay đi. Và những cảm giác trên thân thì vị đó cũng không nhận biết trong sát na an chỉ định đấy. Nhưng đôi khi có những tác động vật lý quá mạnh lên thân mình thì khi mình nhận biết những cảm giác đó trên thân"
  },
  {
    "id": 193,
    "question": "Con được biết có một số vị thiền sư sau khi  viên tịch còn để lại xá lợi là cả nhục thân như  Ngài Huệ Năng, 2 thiền sư ở chùa Đậu. Vậy các vị  ấy đang ở tầng thiền nào khi các vị viên tịch ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thật ra người để lại xá lợi hay là để lại cái thân này thì không nhất thiết vị đó là một bậc đắc đạo hay đắc thiền. Có những người phàm phu bình thường, người ta không tu tập gì, không chứng đắc đạo quả gì mà người ta có thể vẫn để lại được sắc thân. Có thể sự để lại sắc thân đấy là do công đức và do lời phát nguyện của các vị đấy. Có những người do có công đức lớn rồi vị đó có những ước nguyện và nó cũng có thể thành tựu, khi chết thì sắc thân nó không tan hoại. Người để lại sắc thân chưa chắc ..."
  },
  {
    "id": 194,
    "question": "Con có đọc lời dạy của Ngài Pa-auk  Sayadaw rằng là mình phải gieo trồng và nuôi  dưỡng hạt giống minh và hạnh để đời sau, kiếp  khác có cơ hội được gặp chánh pháp, có trí tuệ  để hiểu được giáo pháp của Đức Phật. Dạ con  xin Sư chỉ dạy cho con được hiểu rõ thêm về  hạt giống minh ạ? Nếu nhiều đời mà con không  125 có đủ duyên phước lành để sinh ra trong môi  trường có giáo pháp mà phải sống với những  người có tà kiến thì hạt giống minh đã có của  con có bị tiêu hoại đi không ạ? Nếu bị tiêu hoại  rồi thì những đời sau nữa khi con may mắn gặp  được giáo pháp của Đức Phật thì con mới có  cơ hội vun bồi lại những hạt giống minh phải  không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Hạt giống minh đấy thì người nào tu chứng được thiền tuệ mới có hạt giống minh. Tức là khi nào phân biệt ra được sắc chân đế, danh chân đế, thấy được các pháp duyên khởi, thấy được sự vô thường, khổ, vô ngã trên danh sắc, thấy được tính sinh diệt trên danh sắc thì tất cả những quá trình mình thành tựu được tuệ quán, thấy được pháp chân đế đấy, từ lúc đấy trở đi mới gọi là hạt giống minh. Có những người có thể phân biệt được danh sắc, duyên khởi, thấy tam tướng, vô thường, khổ vô ngã rồi nhưng"
  },
  {
    "id": 195,
    "question": "Con biết đến Phật Pháp và tu tập gần một  năm nay tuy không được miên mật nhưng con  vẫn cố gắng ngồi thiền nghe pháp hàng ngày.  Thời gian đầu con thấy tính tham sân si của con  giảm bớt và thấy an lạc hơn. Nhưng gần đây  con thấy tâm tham sân si của mình còn mạnh  mẽ hơn trước. Con có cố gắng quay lại hơi thở  niệm Ân Đức Phật hoặc nghĩ đến nhân quả  nhưng không có tác dụng. Con luôn cảm thấy  bất mãn và bất như ý với đời sống gia đình và  công việc. Chỉ khi con nghe pháp và ngồi thiền  thì thấy bình an hơn. Nhưng khi quay lại cuộc  sống mưu sinh thì tâm luôn mệt mỏi và căng  thẳng, lâu ngày dẫn đến thân thể suy nhược,  tâm thân đều rã rời mệt mỏi. Gia đình con hiện  đang có một khoản nợ và ba mẹ ốm bệnh nên  không thể bỏ công việc đi đến chùa tu tập. Mong  127 Sư cho con xin lời khuyên nên làm gì vào lúc  này để giảm bớt tâm bất thiện ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Tâm bất thiện do môi trường sống; ở tại gia thì sẽ phải có những cái tâm bất thiện đấy. Bây giờ mình càng muốn trốn tránh nó thì nó càng đau khổ thôi. Bây giờ mình phải chấp nhận là còn sống ở đời sống thế gian này, đời sống tại gia là không thể tránh khỏi những phiền não tham, sân, si được. Chỉ có cách là sống với nó, mình phải chấp nhận cái khổ đau đấy, chấp nhận khổ đau rồi thì khổ đau sẽ giảm bớt đi. Còn những người không chấp nhận thì nó mới khổ đau. Còn cứ nghĩ rằng mình phải hạnh phúc, ph..."
  },
  {
    "id": 196,
    "question": "Tuệ kinh úy trong tầng thiền minh sát có  tính chất như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Tuệ kinh úy là một người thấy danh sắc sinh diệt liên tục, rồi vị đó mới thấy rằng danh sắc này không trường tồn, không bền vững, không dài lâu, không chắc chắn, không an ổn, là đau khổ, là 128 rỗng không là không thể nương tựa. Như người ta thấy một trận động đất, sóng thần, hỏa hoạn, cuồng phong, tàn phá mọi thứ trên đời thì có cảm giác kinh sợ, hãi hùng. Cũng vậy khi tuệ quán thấy được sự thật về danh sắc này thì cũng kinh sợ với sự vô thường,"
  },
  {
    "id": 197,
    "question": "Làm sao để có sự bảo hộ từ chư thiên khi  đến những nơi nguy hiểm ạ?",
    "category": "Nghiệp báo & Phước đức",
    "answer": "Có sự bảo hộ từ chư thiên nếu như vị đó: một là rải tâm từ đến chư thiên, hai là mình làm phước mình hồi hướng cho chư thiên thì có thể được chư thiên bảo hộ."
  },
  {
    "id": 198,
    "question": "Thiên nhãn trí và túc mạng trí của Đức  Phật với những bậc A-la-hán có gì khác biệt ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Thiên nhãn trí và túc mạng trí của Đức Phật khác xa so với các vị A-la-hán khác. Túc mạng trí của Đức Phật có thể thấy những đời sống quá khứ không có giới hạn. Còn các bậc A-la-hán thấy được các đời sống quá khứ có giới hạn. Các vị A-la-hán nhiều nhất cũng chỉ thấy được một A-tăng-kỳ kiếp, một trăm ngàn đại kiếp chứ không thể thấy được vô biên, vô tận như Đức Phật. Thiên nhãn trí cũng thế. Đức Phật có thể thấy đến ba nghìn đại thiên thế giới nhưng các bậc A-la-hán thì thấy có giới hạn thôi, có ..."
  },
  {
    "id": 199,
    "question": "Sự khác biệt giữa tuệ phản khán của tuệ  minh sát và lậu tận trí là gì ạ?",
    "category": "Pháp Hành Đời Thường",
    "answer": "Lậu tận trí ở đây là một bậc chứng đến quả thứ tư mới có lậu tận trí. Một bậc có lậu tận trí rồi thì vị đấy biết là sinh đã tận, phạm hạnh đã thành, việc cần làm đã làm xong, đã đặt gánh nặng xuống, đã đoạn trừ kiết sử, đã chánh trí giải thoát, đã diệt tận khổ đau, đấy chính là tuệ phản khán của bậc lậu tận trí. Chứng Tam Quả thì vị đấy sẽ có tuệ phản khán, biết là mình đã chứng được đạo quả thứ ba, đoạn trừ thân kiến, hoài nghi, giới cấm thủ, dục tham và sân hận, không còn sinh lại cõi dục giới..."
  },
  {
    "id": 200,
    "question": "Con xin Sư giảng cho con ý nghĩa của các ví  dụ mà Đức Phật lấy trong bốn món thức ăn là  đoàn thực, xúc thực, tư niệm thực và thức thực ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Đoàn thực là thức ăn hàng ngày để nuôi dưỡng sắc thân cần được tuệ tri bằng thiền tuệ phân biệt sắc uẩn. Thức ăn vào trong bao tử, trở thành sắc thời tiết, khi dưỡng chất ấy gặp lửa tiêu hóa ở trong dạ dày trở thành sắc vật thực. Sắc vật thực lan tỏa khắp toàn thân nuôi dưỡng những sắc do nghiệp 130 sinh, do tâm, do thời tiết sinh. Để tuệ tri được sự sinh diệt, vô thường, khổ, vô ngã, bất tịnh của thân Thức thực là thức ăn của tâm, cần được tuệ tri"
  },
  {
    "id": 201,
    "question": "Con xin Sư hướng dẫn cho con cách quan sát  ý môn và các chi thiền khi vào được sơ thiền ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Muốn kiểm tra thiền chi, thì vị ấy phải duy trì được tợ tướng, ánh sáng mạnh mẽ tỏa chiếu liên tục từ 3 đến 4 giờ không gián đoạn. Trải qua nhiều ngày như vậy rồi. Tức là vị đó chắc chắn đã vào đến an chỉ định rồi thì lúc đấy vị đó mới nên kiểm tra ý môn. Trước tiên hãy hành thiền cho đến khi vào đến trạng thái định thâm sâu mạnh mẽ tỏa sáng nhất khoảng gần 1h. Rồi nhìn xuống ý môn, vùng trái tim bên trái thì sẽ thấy ở tâm hữu phần sáng trong."
  },
  {
    "id": 202,
    "question": "Con có tham dự một khóa thiền ở chùa  Phúc Minh. Con đã cố gắng tu tập nhưng con  vẫn chưa có nimitta. Khi trở về nhà con vẫn  cố gắng dành thời gian thiền hằng ngày vào  buổi tối, nhưng đến giờ con vẫn chưa có tiến  bộ. không biết có phải là con không đủ duyên tu  thiền hành hay không! xin Sư chỉ dạy cho con  để con vững tâm hơn trên con đường tu tập ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Việc tập thiền thì cứ tập, không nên mong cầu phải có nimitta. Thực hành mà cảm thấy những phiền não, những triền cái của mình như là; dục, tham, sân hận, hôn trầm, thụy miên, trạo hối, hoài nghi của mình bớt đi thì đó là tiến bộ rồi. Người nào có 5 triền cái mạnh thì phải tu một thời gian khá dài. Vừa hành thiền mình vừa phải nỗ lực đấu tranh để gột rửa, để loại bỏ những ô nhiễm đấy đi. Khi cái ô nhiễm đấy lắng đọng rồi thì mình lại phải phát triển năm căn: đức tin, tinh tấn, chánh niệm, nhất t..."
  },
  {
    "id": 203,
    "question": "Chân đế của thiền là gì ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Đức Phật dạy hai pháp một là tục đế, hai là chân đế. Pháp tục đế, là những lời dạy về hạnh bố thí, làm phước, giữ giới, thực hành thiền định để hưởng phước lành ở cõi nhân gian thiên giới… Pháp chân đế là sự thực hành thiền tuệ để thấy được các sự thật tối hậu thâm sâu. Như Phật biệt được sắc chân đế (28 loại sắc ở sáu căn). Danh chân đế (89 tâm vương, 52 âm sở). Pháp duyên khởi (12 nhân duyên). Tính sinh diệt (vô thường, khổ, vô ngã) trên danh, sắc ấy cho đến khi chứng ngộ Niết Bàn."
  },
  {
    "id": 204,
    "question": "Trường hợp vị Bất Lai không nhập vào  Tứ thiền mà lúc đó tái sinh về cõi Ngũ Tịnh Cư  Thiên thì lúc cận tử đối tượng của tâm cận tử  là gì ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Một vị Bất Lai dù không hành thiền định, thì đến thời điểm cận tử vị ấy cũng sẽ tự động trú tâm vào một pháp thiền nào đấy rồi chứng đắc Tứ thiền sắc giới, rồi nương vào Tứ thiền ấy hóa sinh vào cõi Tịnh Cư Thiên. Nên tâm tục sinh của vị ấy vẫn là tâm quả Tứ thiền. 134"
  },
  {
    "id": 205,
    "question": "Một thiền sinh quán các kiếp sống quá khứ  ở tầng tuệ phân tích duyên khởi của thiền quán  như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vị ấy cần phải khởi lên nghiệp luân và phiền não luân: Vị ấy có thể đi đảnh lễ, cúng dàng Đức Phật, thì đó là nghiệp luân, lúc ấy ở ý môn sẽ sinh khởi 34 tâm thiện dục giới. Rồi vị ấy phát nguyện; mong cho con kiếp sau sinh làm người, tu tập và chứng đắc Niết Bàn, đó là phiền não luân, ở ý môn sẽ sinh lên lộ tâm tham tà kiến: Lộ trình phiền não luân: Vô minh: 20 tâm (nhóm tham tà kiến) - ảo tưởng"
  },
  {
    "id": 206,
    "question": "Nghiệp cận tử của vị Thánh Bất Lai không  nhập tầng thiền là gì? Thiên nhãn của vị Thánh  Nhập Lưu có thấy được các vị Thánh Bất Lai  ở cõi Tịnh Cư Thiên không? Không vô biên xứ  của Kasiṇa trắng và không vô biên xứ nhập từ  Kasiṇa lửa khác nhau như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Nghiệp cận tử của vị Thánh Bất Lai, sẽ tự động nhập Tứ thiền. Thiên nhãn thì sẽ thấy được những gì có sắc tướng. Cõi Tịnh Cư thuộc về Sắc Giới nên Thiên nhãn của vị Dự Lưu hay phàm nhân đều thấy được. Muốn vào được các tầng thiền Vô Sắc như Không Vô Biên Xứ thì phải vượt qua Tứ Thiền Sắc Giới của bất cứ Kasina nào cũng được. Cũng như một người muốn đi đến một nơi chốn khác bằng nhiều phương tiện khác nhau mà thôi."
  },
  {
    "id": 207,
    "question": "Quán phồng xẹp ở bụng có phải là quán  phong đại không ạ? Và nếu quán phong đại thì  mình quán như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Quán phồng xẹp ở bụng thì đúng là đang quán về phong đại trong thiền Tứ Đại nhá. Cách quán như vậy là để cảm nhận được đặc tính đẩy của gió 136 ở vùng bụng đó và ở khắp toàn thân. Khi cảm nhận được rồi thì mình lại phải tập đến các cái tính khác nữa như: cứng, thô, nặng, mềm, mịn, nhẹ. Nước có hai tính là: chảy và dính. Lửa có hai đặc tính là: nóng, lạnh. Gió có hai đặc tính là: đẩy, nâng. Phải tập từng cái một cho đến khi có thể nhận biết được cả 12 cái"
  },
  {
    "id": 208,
    "question": "Các pháp thiền dù chỉ là hiện tại lạc trú  nhưng nó có vai trò và sự hỗ trợ như thế nào  đối với việc khởi lên như lý tác ý, sự khởi tâm  đúng đắn ạ? Bởi vì con thấy tâm mình bị tham  sân chi phối rất khó để cho con có thể khởi lên  được.",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Bản chất các pháp thiền đã là như lý tác ý rồi. Hơn nữa nó còn được duy trì liên tục nên nó áp đảo được những tâm bất thiện, và dần dần đi đến giác ngộ hoàn toàn. Lúc an trú trong thiền định thì là hiện tại lạc trú, nhưng cũng luôn như lý tác ý. Khi thực hành thiền tuệ thì như lý tác ý ấy còn thâm sâu hơn nên đạt được trí tuệ thù thắng hơn, và thấy được sự thật tuyệt đối hơn…Người nào thường xuyên thực hành thiền thì như lý tác ý sẽ mạnh dần lên, trí tuệ sẽ 137"
  },
  {
    "id": 209,
    "question": "Càng thực hành con càng cảm thấy dễ mất  chánh niệm và tâm bất thiện sinh khởi nhiều  hơn. Vậy làm sao để duy trì chánh niệm và loại  trừ tà kiến ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vì khi không thực hành thì không có chánh niệm nên không có gì để mất, còn khi thực hành mới có một chút chánh niệm, do nó còn yếu nên không giữ được lâu. Vậy thì phải cố gắng thực hành nhiều hơn cho chánh niệm mạnh lên, thì tâm bất thiện cũng sẽ yếu dần đi thôi. Khi chưa thực hành thiền thì hàng ngày sống với cấu uế mà không biết đó là cấu uế. Trong cái môi trường hỗn loạn, hỗn độn giống như là một cái ao nước có quá nhiều vẩn đục, nên mình không nhìn"
  },
  {
    "id": 210,
    "question": "phương pháp tu tập quán riêng lẻ thân thọ  tâm và pháp có đưa đến sự giác ngộ không ạ?  Hay hành giả cần tu tập quán cả 4 niệm xứ mới  đưa tới giác ngộ ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Còn tùy vào sự tham ái của mỗi người khác nhau; ví dụ người nào tham ái thân nặng thì phải quán thân, có người tham ái với thọ nặng hơn thì chủ yếu là quán thọ, có người tham ái với tâm thì chủ yếu là quán tâm, có người tham ái với pháp thì chủ yếu là quán pháp. Một người mới tu tập có thể khởi đầu từ quán thân, hoặc thọ, hoặc tâm, hoặc pháp. Nhưng sau đó thì cũng phải quán hết cả bốn vì nó đều là danh sắc, là năm uẩn, là sáu nội - ngoại xứ như nhau mà thôi"
  },
  {
    "id": 211,
    "question": "Với một hành giả tu tập theo phương pháp  thiền của ngài cư sĩ Goenka nếu chưa đắc cận  định mà ghi nhận các cảm thọ thì có đưa tới sự  tấn hóa đến giác ngộ cho hành giả không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Để đi đến giác ngộ thì một hành giả phải tuệ tri được các sắc chân đế, các tâm, tâm sở. Tuệ quán được pháp duyên sinh. Và tuệ tri sự sinh diệt, vô thường, khổ, vô ngã thì mới giác ngộ được chân lý Tứ Thánh Đế chứng đắc Đạo Quả, Niết Bàn. Khởi đầu tu tập với pháp niệm thọ mới chỉ là bước đầu phát triển chánh niệm, tỉnh giác mà thôi. 139 Từ chánh niệm ấy nếu thành tựu được chánh định, thì từ chánh định mới thực hành được thiền tuệ."
  },
  {
    "id": 212,
    "question": "Càng hành thiền nhiều con cảm thấy mình  càng muốn xa lánh mọi người thì có vấn đề gì  không ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Hành thiền một thời gian khi tâm đạt được một chút định tĩnh rồi, thiền sinh sẽ cảm thấy sự hạnh phúc an lạc do tâm định tĩnh ấy mang lại cao thượng hơn những niềm vui náo động ở thế gian. Vị ấy sẽ nhàm chán những đám đông ồn ào, và ưa thích cuộc sống yên tĩnh một mình, vì tiếng ồn và sự tiếp xúc sẽ làm suy yếu tâm định tĩnh ấy, còn ở một mình yên tĩnh vị ấy sẽ giữ được tâm định tĩnh và còn có thể tu tập phát triển được nó cao hơn nữa. Chỉ khi nào chứng đắc được đạo quả siêu thế thì vị ấy mới th..."
  },
  {
    "id": 213,
    "question": "Thiền nguyên thủy và thiền tổ Sư có gì  giống và khác nhau ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Thiền nguyên thủy là các pháp thiền chỉ, quán, do Đức Phật dạy còn được lưu truyền trong 140 hầu hết kinh điển Nikaya. Còn Tổ Sư thiền là các pháp thiền phát triển về sau này, do các vị Tổ Sư đời sau này sáng tạo ra. Thiền Nguyên thủy chỉ hướng đến thanh tịnh nội tâm, đoạn trừ phiền não, giác ngộ các sự thật, chứng đắc Niết bàn, chấm dứt khổ đau sinh tử. Tổ Sư thiền là kinh nghiệm riêng của một vị Tổ Sư"
  },
  {
    "id": 214,
    "question": "Khi một vị Thánh trú thiền quả là Tứ Thiền  Siêu Thế thì tầng thiền đó có được gọi là tầng  thiền sắc giới không ạ? Hay chỉ có thể gọi là  tầng thiền siêu thế ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Vị đó trú ở cái tầng thiền đấy, pháp thiền đấy nó là tâm quả, tâm quả thì nó là tâm duy tác và nó không để lại nghiệp gì cho nên không được gọi là thiền sắc giới. Ví dụ mình trú ở tứ thiền sắc giới thì nó để lại thiện nghiệp sắc giới. Còn trú ở tứ thiền siêu thế, vì là thiền quả, không để lại nghiệp gì cho nên nó là tứ thiền siêu thế."
  },
  {
    "id": 215,
    "question": "Khi một thiền sinh quán được đến thời  điểm ngũ uẩn diệt hoàn toàn trong tương lai  thì có phải là tuệ tri diệt đế không ạ? Hay là chỉ  khi nào chứng ngộ đạo quả thì mới được gọi là  tuệ tri diệt đế ạ? 141",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Hướng về kiếp tương lai cuối cùng thấy năm uẩn diệt, không còn tái sinh. Đó là pháp quán nhân duyên, sinh diệt bình thường, không phải là tuệ tri Diệt Đế. Khi nào chứng đắc Đạo Quả, diệt trừ phiền não, thấy rõ Niết Bàn mới là Diệt Đế."
  },
  {
    "id": 216,
    "question": "Sự tu niệm có liên quan và hỗ trợ đến tu  định như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Khi mình ghi nhớ, nhận biết một đối tượng, một pháp tu tập nào đó thì là niệm. Niệm đó được liên tục thì nó đạt đến định tĩnh, nhất tâm. Niệm hỗ trợ cho định là như vậy. Ví dụ như mình nhận biết hơi thở vào hơi thở ra liên tục, rồi từ sự nhận biết miên mật không gián đoạn đấy thì sẽ đắc định, đắc các tầng thiền..."
  },
  {
    "id": 217,
    "question": "Chỉ tu niệm thì có thể đắc Niết Bàn không ạ?",
    "category": "Giáo lý Căn bản",
    "answer": "Tu niệm mà niệm thân, niệm thọ, niệm tâm, niệm pháp thì có đắc Niết Bàn. Niệm nó không khởi lên một mình, mà niệm bao giờ cũng đi cùng với tín, với tàm, quý, vô tham, vô sân, hành, xả, tịnh thân, tịnh tâm, khinh thân, khinh tâm, nhu thân, nhu tâm, thích thân, thích tâm, quần thân, quần tâm, chánh thân, chánh tâm và trí tuệ. Vì vậy, niệm nếu được tu tập đầy đủ thì sẽ đi đến Niết Bàn."
  },
  {
    "id": 218,
    "question": "Tầng thiền định hỗ trợ cho việc thực hành  thiền minh sát và phát triển trí tuệ như thế  nào ạ? 142",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Hỗ trợ bằng cách: trước khi thực hành thiền tuệ mình sẽ nhập vào một tầng thiền định, làm cho tâm định tĩnh, trong sáng, rồi sau đó suất khỏi tầng thiền ấy mới thực hành thiền tuệ. Nhờ sự trợ giúp của thiền định đi trước nên việc tuệ quán danh, sắc trở nên dễ dàng hơn rất nhiều, so với người không thực hành thiền định."
  },
  {
    "id": 219,
    "question": "Người hành thiền có biết được khi nào  mình đắc định, đắc thiền không?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Trong khi hành thiền nếu người nào có chánh niệm tốt, tâm ít phiền não, thực hành đúng pháp dù đang thực hành bất cứ pháp thiền nào thì cũng sẽ xuất hiện ánh sáng, đó là dấu hiệu của sự đắc định. Lúc đầu định đó còn non yếu, sau đó sẽ già mạnh dần lên. Khi ánh sáng của tâm định ấy kéo dài mạnh mẽ liên tục trong nhiều giờ không gián đoạn, thì vị ấy sẽ đạt đến trạng thái, ly dục, ly ác bất thiện pháp chứng và an trú thiền thứ nhất một trạng thái hỷ, lạc do ly dục sinh với tầm, với tứ… Đó là dấu hi..."
  },
  {
    "id": 220,
    "question": "Ánh sáng phát sinh khi tu tập thiền là cái  gì ạ? Năng lực và giá trị của nó trong việc phát  triển định như thế nào ạ?",
    "category": "Chánh niệm & Thiền quán",
    "answer": "Khi tâm chánh niệm tỉnh giác, an trú trên bất cứ một pháp thiền nào một cách nhẹ nhàng liên tục không gián đoạn thì những cấu uế, phiền não, hay những tâm bất thiện càng lúc càng yếu đi, và tâm thanh tịnh trong sáng mạnh dần lên, thì ánh sáng, hay quang tướng cũng bắt đầu sinh khởi, nó là ấn chứng của sự đắc định. Khi công phu tăng trưởng, định lực thâm sâu thì ánh sáng đó sẽ càng tăng trưởng, mạnh mẽ liên tục không gián đoạn, và tâm của thiền giả sẽ gắn chặt vào ánh sáng ấy trong suốt cả thời t..."
  }
];

if (typeof module !== "undefined" && module.exports) { module.exports = PRACTICAL_QA_DATA; }
