/* Original essays and fictional life scenes; canonical retellings carry source and passage labels. */
(() => {
  'use strict';
  const D = LearningPathData, essays = {};
  const paragraphs = text => text.split('|');
  function essay(id, why, meaning, title, life, application, takeaway, narrative = null) {
    essays[id] = {why, meaning:paragraphs(meaning), life:{title,paragraphs:paragraphs(life)}, application:paragraphs(application), takeaway, narrative};
  }
  D.narratives = {
    duong:{source:'gradual',title:'Người chỉ đường không thể bước thay',location:'MN 107 · đoạn cuối, ví dụ đường đến Rājagaha',paragraphs:paragraphs('Trong cuộc đối thoại với Gaṇaka Moggallāna, Đức Phật trình bày sự huấn luyện theo từng bước. Khi nói đến kết quả khác nhau giữa những người được hướng dẫn, kinh đưa ra hình ảnh người biết đường đến Rājagaha: cùng nhận chỉ dẫn, có người đi đúng, có người rẽ sang lối khác. Người chỉ đường không thể đi thay.|Điểm sâu của ví dụ nằm ở khoảng cách giữa biết và sống. Hiểu đường giúp tránh lạc, còn đặt chân lên đó thuộc về người học. Tự chịu trách nhiệm không có nghĩa phải cô độc: vẫn cần lời dạy và người hướng dẫn, nhưng sự chuyển hóa được nuôi bằng lựa chọn thật.')},
    guong:{source:'rahula',title:'Chiếc gương của Rāhula',location:'MN 61 · dụng cụ đựng nước và sự soi xét hành động',paragraphs:paragraphs('Rāhula chuẩn bị nước rửa chân khi Đức Phật đến thăm. Từ chút nước còn lại và chiếc đồ đựng bị đổ, úp rồi để rỗng, bài kinh dẫn đến sự nghiêm trọng của cố ý nói dối. Hình ảnh chiếc gương tiếp đó mở ra cách nhìn lại thân, lời nói và ý nghĩ trước, trong và sau hành động.|Gương không sửa khuôn mặt thay người soi. Nó giúp thấy điều đang có để chăm sóc đúng chỗ. Nhận lỗi có ích khi kéo theo việc dừng, bày tỏ lỗi đã gây bằng thân hoặc lời và phòng hộ về sau. Dằn vặt mà không sửa việc đã làm vẫn chưa hoàn thành sự phản tỉnh.')},
    phuong:{source:'sigala',title:'Sáu phương trong một buổi sáng',location:'DN 31 · mở đầu và đoạn trách nhiệm đối với sáu phương',paragraphs:paragraphs('Thiện Sanh ra ngoài thành vào buổi sớm, tóc và áo còn ướt, chắp tay lễ các phương theo lời cha dặn trước khi mất. Đức Phật giảng một nghĩa khác của việc bảo vệ sáu phương: chăm sóc quan hệ với cha mẹ, thầy, vợ chồng, bạn hữu, người cùng làm việc và người sống đời tu hành.|Kinh đặt trách nhiệm ở cả hai phía. Con phụng dưỡng cha mẹ; cha mẹ giúp con trưởng thành trong điều lành. Chủ đối xử đúng với người làm; người làm giữ sự tận tâm. Lòng kính từ một động tác hướng ra không gian trở thành cách sống có trách nhiệm với người quanh mình.')},
    voi:{source:'speech',title:'Đứa trẻ trên lòng vương tử',location:'MN 58 · ví dụ đứa trẻ và tiêu chuẩn lời nói',paragraphs:paragraphs('Vương tử Vô Úy đến thử thách Đức Phật về lời nói khiến người nghe khó chịu. Khi một đứa trẻ đang trên lòng vương tử, Đức Phật dùng ví dụ người thương đứa trẻ sẽ tìm cách lấy vật nguy hiểm khỏi miệng nó, dù có thể gây đau. Đây là tình huống giả định trong kinh, không phải tai nạn đã xảy ra.|Lời nói được đặt dưới trách nhiệm chăm sóc. Điều đúng và có lợi đôi khi khó nghe, nhưng cần thời điểm thích hợp và lòng thương. Ví dụ không cho phép làm nhục người khác rồi gọi đó là giúp họ; trọng tâm là sự cứu khổ và cân nhắc khi nói.')},
    khinh:{source:'lotus',title:'Thường Bất Khinh vẫn giữ lòng kính',location:'Pháp Hoa · phẩm Thường Bất Khinh Bồ-tát, thứ 20',paragraphs:paragraphs('Trong phẩm Thường Bất Khinh, vị Bồ-tát gặp người tu hành thì bày tỏ lòng kính và khả năng thành Phật của họ. Có người mắng nhiếc, thậm chí dùng gậy và đá. Vị ấy tránh ra xa mà vẫn tiếp tục bày tỏ lòng kính, không lấy thù ghét đáp lại thù ghét.|Chi tiết tránh ra xa đáng được chú ý. Giữ lòng kính không buộc phải ở lại cho người khác gây hại. Trong văn cảnh Pháp Hoa, chuyện nêu niềm tin vào khả năng giác ngộ; khi ứng dụng, có thể phân biệt phẩm giá của một người với hành vi cần ngăn chặn của họ.')},
    lua:{source:'lotus',title:'Những đứa trẻ trong nhà đang cháy',location:'Pháp Hoa · phẩm Thí dụ, thứ 3',paragraphs:paragraphs('Ngôi nhà cũ bốc cháy, các con của trưởng giả vẫn mải chơi và không hiểu hiểm nguy. Người cha dùng những xe đồ chơi chúng ưa thích để gọi ra. Khi các con an toàn, ông trao những cỗ xe lớn, quý đẹp. Kinh dùng thí dụ này trình bày phương tiện dẫn đến Phật thừa.|Lời cứu giúp cần chạm được điều người nghe có thể tiếp nhận, rồi đưa họ vượt khỏi chỗ nguy. Phương tiện có hướng đến rõ ràng và lợi ích cho người được giúp. Dùng chuyện ấy biện hộ cho thao túng để lấy tiền, quyền lực hay sự phục tùng đã làm lệch trọng tâm thí dụ.')},
    cungtu:{source:'lotus',title:'Người con nghèo chưa dám nhận gia tài',location:'Pháp Hoa · phẩm Tín giải, thứ 4',paragraphs:paragraphs('Người con lưu lạc trở về mà không nhận ra cha. Thấy cảnh giàu có uy nghi, anh sợ và muốn tìm việc ở nơi nghèo khó. Cha không ép anh nhận ngay thân phận thừa kế: ông đến gần trong dáng vẻ giản dị, giao việc vừa sức, dần cho làm quen với tài sản rồi mới công bố sự thật.|Thí dụ thuộc lời các đệ tử trình bày sự lĩnh hội Pháp Hoa. Một cách suy ngẫm cho đời sống là thấy tự xem thường cũng có thể giam hãm người học. Sự nâng đỡ từng bước giúp đủ vững để đón nhận khả năng rộng hơn; cách suy ngẫm này không thay ý nghĩa Phật thừa của kinh.')},
    benh:{source:'vimalakirti',title:'Một cuộc thăm bệnh mở ra lòng đại bi',location:'Duy Ma Cật · phẩm Văn Thù Sư Lợi, thứ 5',paragraphs:paragraphs('Văn Thù đến thăm Duy Ma Cật và thấy căn phòng trống, chỉ còn chiếc giường người bệnh. Cuộc đối thoại nối bệnh của Bồ-tát với bệnh của chúng sinh, ví như cha mẹ có con đau yếu thì lòng không yên. Sự chăm sóc trở thành cửa đi vào giáo pháp.|Trong ngôn ngữ Đại thừa, lòng bi không tìm an ổn riêng mà bỏ mặc khổ quanh mình. Điều đó không buộc nhận mọi đau khổ vào thân hay kiệt sức vì giúp người. Bi đi cùng trí tuệ: hiểu điều kiện gây khổ, chăm sóc đúng cách và nuôi năng lực giúp đỡ lâu dài.')}
  };
  essay('nguon-kinh','Biết nguồn gốc giúp lòng tin có chỗ đứng vững và lời dạy được hiểu đúng tiếng nói của văn bản.',
    'Một trang kinh có hành trình truyền đến người đọc: được ghi nhớ, truyền lại, dịch và sưu tập trong cộng đồng cụ thể. Tên tác phẩm, bản dịch và đoạn trước sau đều góp phần tạo nghĩa. MN 107 chỉ một bài trong Trung Bộ; T08n0251 chỉ một văn bản trong ấn bản tạng Hán. Mã tham chiếu giúp tìm nguồn, không tự chứng minh niên đại sáng tác hay giá trị cao thấp.|Phân biệt kinh, chú giải và lời biên soạn giữ lòng kính khỏi nhận nhầm lời người đời là lời Phật. Một lời giảng có thể rất hữu ích mà vẫn cần được gọi đúng loại. Khi hiểu nguồn và toàn mạch, lời về buông xả dẫn đến bớt chấp thủ; tách riêng, nó có thể bị hiểu thành bỏ trách nhiệm với gia đình.',
    'Một câu trích trong nhóm gia đình','Lan nhận một ảnh ghi rằng người tu không nên buồn trước mất mát. Đang chăm mẹ bệnh, cô thấy mình yếu đuối và có lỗi. Ảnh không có tên kinh, người dịch hay vị trí; cô nhận ra mình đang bị một lời vô danh phán xét.|Cô ngừng dùng ảnh ấy để kết án bản thân, tìm bản có nguồn và tiếp tục chăm mẹ. Sự thận trọng giúp cô giữ lòng tin, đồng thời có chỗ cho nỗi buồn và tình thương.',
    'Giữ tên kinh, người dịch và đoạn trước sau của một câu làm mình xúc động. Khi chưa rõ nguồn, ghi đúng là lời trích chưa xác định khi chia sẻ. Sự chân thật trong dẫn lời cũng là chánh ngữ.|Đưa nghĩa đã hiểu vào việc gần: giữ lời hẹn, nói sự thật hoặc chăm sóc người thân. Kinh trở thành con đường khi cách sống nhận được lợi ích từ điều đã đọc.',
    'Hiểu đúng nguồn giúp lòng kính đi cùng một cách sống có trách nhiệm.','duong');
  essay('gioi-hanh','Giới hạnh tạo sự an toàn để người khác sống gần mình mà ít sợ bị làm hại. Đó là nền đất của lòng tin.',
    'Ham muốn hay cơn giận có thể xuất hiện nhanh. Giới tạo khoảng dừng để ý muốn chưa lập tức thành hành động. Không chiếm đoạt, cố ý lừa dối hay làm hại bảo vệ thân thể, tài sản và sự tin cậy. Mặt tích cực của giới là năng lực chăm sóc những điều người khác dễ bị tổn thương.|MN 61 đặt sự soi xét trước, trong và sau hành động. Giữ giới trở thành quá trình sống: dự liệu tác hại, dừng khi thấy sai và sửa việc đã gây. Nhận lỗi không xóa mọi khả năng trưởng thành; nó mở cơ hội bắt đầu lại bằng trách nhiệm. Không nói dối dần thành sự đáng tin, không chiếm đoạt dần thành lòng tôn trọng.',
    'Bản báo cáo gửi nhầm','Minh gửi nhầm số liệu làm đồng nghiệp bị khiển trách. Anh định im lặng vì chưa ai biết lỗi từ mình. Sự bất an giúp anh thấy im lặng đang chuyển gánh nặng sang người khác.|Sáng sau, anh báo rõ phần sai, gửi bản sửa và nhận trách nhiệm. Việc ấy không xóa ngay thiệt hại, nhưng trả lại sự công bằng và mở cách kiểm tra để lỗi ít lặp lại.',
    'Khi làm sai, nói rõ sự việc và phần trách nhiệm của mình. Lời giải thích cần giúp hiểu nguyên nhân, không dùng để che lỗi. Xin lỗi đi cùng việc sửa mà người bị ảnh hưởng thực sự cần.|Giữ một cam kết nhỏ giúp tâm học sự đáng tin. Được xây từ việc nhỏ, giới hạnh dần thành phẩm chất bền thay vì hình ảnh trước người khác.',
    'Giới hạnh được nhận biết qua sự an toàn và lòng tin mình tạo ra.','guong');
  essay('bon-su-that','Bốn sự thật giúp nhìn thẳng vào khổ và vẫn thấy khả năng chuyển hóa. Nỗi đau có nguyên nhân và có con đường chăm sóc.',
    'Khổ gồm đau đớn dễ thấy và sự bất toại nguyện khi bám vào điều không thể giữ nguyên. Thân già đi, người thương thay đổi, điều mong muốn không luôn đến. Nhận ra điều ấy giúp thôi đòi đời sống bất biến mới cho phép mình bình an. Người đang khổ cần sự hiểu và chăm sóc, không cần bị trách vì chưa đủ tu.|SN 56.11 gắn mỗi sự thật với nhiệm vụ: hiểu khổ, đoạn trừ nguyên nhân, chứng sự diệt và phát triển con đường. Ái là sự khát khao muốn nắm giữ, trở thành hoặc gạt bỏ. Mất mát thật có thể bị nhân lên bởi đòi hỏi mọi việc theo ý. Bát chánh đạo nuôi cách thấy, ý hướng, lời nói, việc làm, sinh kế, tinh tấn, niệm và định để ái mất dần quyền điều khiển. Một phút yên chưa đồng nghĩa với chứng ngộ diệt khổ.',
    'Không được nhận vào công việc mong đợi','Hà bị từ chối sau nhiều vòng phỏng vấn. Thất vọng sớm thành kết luận mình vô dụng. Đọc lại thư, cô thấy điều có thật là một vị trí đã được giao cho người khác.|Cô cho mình thời gian buồn, nhờ góp ý hồ sơ rồi tìm việc tiếp. Sự kiện chưa đổi, nhưng bớt thành bản án về giá trị cả đời. Khổ được chăm sóc đúng nơi nó phát sinh.',
    'Nhận rõ mất mát cụ thể và đừng ép mình phải vui ngay. Giảm những hành vi làm khổ tăng như tự sỉ nhục, trả đũa hay liên tục đọc lại lời gây đau.|Chọn một hành động thuộc con đường: nói trung thực, làm việc không hại hoặc chú ý vững hơn. Chuyển hóa thường hiện trước hết ở cách đáp lại khó khăn.',
    'Hiểu khổ mở ra chăm sóc; thấy nguyên nhân mở ra khả năng thay đổi.');
  essay('hoc-va-xet','Niềm tin trưởng thành nhờ hiểu hậu quả của điều mình tin. Sự tỉnh táo giúp học giữa nhiều tiếng nói.',
    'Kālāma sống giữa những lời khẳng định trái ngược. Kinh đưa sự xét nghiệm về tham, sân, si và tác hại, đồng thời nhắc sự nhận định của người trí. Một hướng dẫn làm tham mạnh hơn, khiến ghét người khác hoặc bỏ qua tổn hại cần được xem lại dù người nói nổi tiếng.|Dễ chịu không đủ chứng minh một lời dạy tốt. Lời tâng bốc làm vui nhưng nuôi tự cao; góp ý khó nghe có thể giúp sửa lỗi. Xét nghiệm cần trải nghiệm thành thật và người có đạo đức, hiểu biết. Ta có thể kính thầy, thực hành điều có căn cứ và thừa nhận phần chưa hiểu; lòng tin có chiều sâu mà không cần bảo vệ một hình tượng bằng mọi giá.',
    'Lời hứa bình an trong bảy ngày','Quảng cáo hứa làm hết lo âu nếu mua khóa đắt tiền và ngừng nghe người thân. Phương đang mệt nên bị hấp dẫn, nhưng nhận ra sự cô lập và áp lực trả tiền.|Cô chọn nơi học công khai nguồn, chấp nhận tiến trình lâu dài và không ép phụ thuộc. Lòng tin không khiến cô bỏ khả năng nhận biết điều gây hại.',
    'Quan sát tác động của lời hướng dẫn lên cách đối xử: thêm chân thật, bớt sân và có trách nhiệm hơn là dấu hiệu có ý nghĩa. Đọc nguồn thay vì chỉ dựa vào danh tiếng.|Giữ tiếp xúc với người đáng tin. Thừa nhận điều chưa đủ căn cứ giúp học tiếp mà không cần giả vờ đã biết.',
    'Niềm tin sâu có thể đứng cùng sự tỉnh táo và lòng thành thật.');
  essay('bo-thi','Bố thí làm mềm sự nắm giữ và cho người khác điều kiện sống tốt hơn. Ý nghĩa ấy đi cùng giới và tu dưỡng tâm.',
    'Cho đồ chưa tự bảo đảm người nhận được giúp. Giá trị nằm ở nhu cầu thật, cách trao và tâm không biến họ thành người mắc nợ. Bữa ăn, thời gian lắng nghe hay kiến thức đều có thể vơi khổ khi đúng hoàn cảnh. Phẩm giá người nhận cần được giữ cả lúc trao lẫn sau đó.|Iti 60 nêu bố thí, giới và tu tập như ba nền tảng làm phước. Tiền làm thiện không khiến gian dối thành đúng, cũng không thay sửa lỗi với người bị hại. Tâm cho còn có thể nắm danh tiếng, sự biết ơn và quyền can thiệp. Nhận ra điều ấy giúp việc trao làm người nhận thêm tự chủ.',
    'Chiếc máy tính có kèm một gánh nặng','Quang tặng máy cũ cho học sinh nhưng luôn nhắc công và yêu cầu em kể tên anh trên mạng. Em ngại nhận giúp đỡ tiếp. Anh nhận ra món quà có ích đã mang theo áp lực.|Lần sau anh hiểu nhu cầu trước, sửa máy dùng được và không đòi công khai tên. Học sinh tập trung học; việc cho nhẹ hơn cho cả hai.',
    'Hiểu điều người nhận cần và tôn trọng quyền từ chối. Sau khi trao, đừng lấy món quà làm lý do điều khiển họ.|Nuôi việc thiện cùng sự ngay thẳng trong sinh kế và lời nói. Phước có nền vững khi giúp người không dựa trên gây hại nơi khác.',
    'Cho đi sâu sắc làm tăng sự sống và phẩm giá của người nhận.');
  essay('hoi-tho','Hơi thở là chỗ trở về gần gũi khi tâm bị kéo qua lo lắng. Có mặt giúp chọn việc sẽ làm.',
    'Niệm hơi thở bắt đầu bằng biết hơi vào và ra. Không cần tạo nhịp đẹp để chứng minh tu tốt. Thân ở tư thế vừa sức; tâm nhận cảm giác hiện có thay vì chỉ sống trong chuyện suy nghĩ. Khoảng dừng cho phép thấy thân đang căng trước khi lời gây hại được gửi đi.|MN 118 triển khai mười sáu bước qua thân, thọ, tâm và pháp, liên hệ niệm xứ và giác chi. Vài hơi yên mở đầu cho sự học rộng hơn về an tịnh, trạng thái tâm, vô thường và buông xả. Trải nghiệm dễ chịu ngắn chưa phải hoàn thành toàn kinh. Sự bình tĩnh có giá trị khi nâng đỡ giới và cách thấy rõ.',
    'Tin nhắn lúc nửa đêm','Vy đọc một tin bị hiểu là trách móc, gõ nhanh lời gay gắt. Cô đặt máy xuống, nhận ra vai cứng và nhịp thở dồn. Để hơi tự nhiên, cô chờ thân bớt căng.|Sáng sau cô thấy tin có thể hiểu khác và trao đổi trực tiếp phần chưa rõ. Trở về với thân đã ngăn một cuộc cãi từ sự vội vàng.',
    'Trong lúc căng, đặt thiết bị xuống, cảm nhận bàn chân và biết vài hơi tự nhiên. Đợi đủ vững rồi chọn lời phù hợp sự việc.|Nếu chú ý hơi thở gây khó chịu, chuyển sang bàn chân hoặc âm thanh và hoạt động nhẹ. Thực hành cần vừa sức; thở gắng ép không làm tỉnh biết sâu hơn.',
    'Một hơi thở được biết rõ mở khoảng dừng cho lựa chọn lành.');
  essay('niem-xu','Niệm xứ giúp thấy trải nghiệm thành những phần có thể chăm sóc, thay vì một khối quá lớn mang tên bản thân.',
    'Thân gồm tư thế, hơi thở, chuyển động; thọ là sắc thái dễ chịu, khó chịu hoặc trung tính; tâm có trạng thái như sân, tán loạn hay định; pháp gồm khuôn khổ nhận diện sự vận hành, như triền cái và giác chi. Thọ có nghĩa chuyên biệt, không đồng nhất mọi cảm xúc phức tạp.|Bụng căng, cảm giác khó chịu, tâm bực và ý muốn trả đũa liên hệ nhưng không phải cùng một thứ. Thấy rõ giúp nhận ra thân cần nghỉ hay cách hiểu cần sửa. MN 10 nhấn mạnh sinh diệt và không chấp thủ: tâm giận đang có rồi thay đổi, không biến mình thành người giận cố định. Tỉnh biết cho phép chịu trách nhiệm và làm khác.',
    'Sau một cuộc họp dài','Tùng cáu với con vì tiếng động nhỏ. Yên lại, anh thấy mình đói, đau vai và mang bực từ cuộc họp về. Tiếng động là duyên gần; cơn cáu có nhiều điều kiện trước đó.|Anh xin lỗi, ăn uống, nghỉ trước khi tiếp tục việc nhà. Hiểu thân tâm không dùng để bào chữa, mà để sửa điều kiện làm tổn hại lặp lại.',
    'Trong việc như rửa bát, biết tư thế, sức căng và cảm giác. Khi tâm đi xa, nhẹ nhàng nhận ra rồi trở lại.|Gọi đúng trạng thái đang có bằng lời đơn giản và chăm sóc điều kiện cụ thể: nghỉ, nói nhu cầu hoặc dừng lời gây hại. Tỉnh biết có giá trị khi dẫn đến đáp ứng phù hợp.',
    'Thấy rõ trải nghiệm giúp chăm sóc đúng chỗ và bớt bị cuốn đi.');
  essay('giu-nhip','Nếp tu vừa sức giúp điều hiểu có thời gian đi vào tính cách. Sự đều đặn tạo nền cho chuyển hóa.',
    'MN 107 trình bày huấn luyện có trình tự. Với cư sĩ, nhịp đọc vừa sức giúp giới, chú ý và hiểu biết cùng được nuôi. Thời lượng thư viện gợi ý không phải thước đo kinh điển về giá trị người tu. Có ngày yên, có ngày mệt; một điểm trở về nhỏ giúp không lấy hôm nay làm bản án cả con đường.|Khả năng giữ lời, nghe trọn câu, nhận lỗi và bớt phản ứng nóng cho thấy điều học đang có tác dụng. Chúng không chứng minh quả vị, nhưng gắn tu học với sự giảm khổ trong quan hệ. Khi lỡ buổi học, trở lại buổi sau hữu ích hơn tự trách kéo dài.',
    'Mười phút bên cửa sổ','Sau một tháng cố ngồi lâu rồi bỏ, Mai chọn mười phút mỗi sáng đọc một đoạn và yên vừa sức. Ngày đi sớm, cô giữ một phút nhớ nghĩa đã học.|Dần cô bớt ngắt lời mẹ. Thay đổi nhỏ làm việc học có lý do tiếp tục. Nếp tu bền được xây bằng khả năng trở lại.',
    'Gắn việc học với một thời điểm đã có trong ngày và đoạn đủ ngắn để hiểu. Giữ một ứng dụng nhất quán như nghe hết lời người thân.|Khi hoàn cảnh đổi, điều chỉnh thời lượng và giữ hướng đạo đức. Linh hoạt giúp nếp tu tiếp tục nâng đỡ đời sống.',
    'Đi đều là tiếp tục trở lại điều lành sau những ngày không trọn vẹn.','duong');
  essay('doc-tron-bai','Bài kinh có đường đi của ý nghĩa. Đọc được mạch ấy giúp hiểu một câu trong hoàn cảnh của nó.',
    'Người nghe, khó khăn được nêu và trình tự triển khai góp phần tạo nghĩa. MN 107 nói về huấn luyện người xuất gia; áp nguyên nếp sống ấy lên cư sĩ nuôi con có thể tạo sức ép không phù hợp. Có thể học tinh thần từng bước rồi ứng dụng có phân biệt.|Trong MN 10, nhận biết thân tâm đi cùng tinh cần, tỉnh giác, sinh diệt và không chấp thủ. Chỉ giữ quan sát sẽ thu hẹp thực hành thành kỹ thuật chú ý. Đọc trọn mạch giúp thấy sự rèn luyện cả đời sống, có đạo đức và trí tuệ, thay vì một khẩu hiệu thúc mình cố hơn.',
    'Tinh tấn bị hiểu thành thức khuya','Nam đọc lời về tinh tấn rồi nghĩ ít ngủ là tu tốt. Nhiều ngày sau anh cáu và thiếu tập trung. Đọc cả mạch huấn luyện, anh thấy nỗ lực cần nâng đỡ tỉnh giác và hành vi lành.|Anh sắp giờ đọc để nghỉ đủ và có mặt với gia đình. Việc học bền hơn khi sự cố gắng không tiếp tục gây kiệt sức.',
    'Giữ câu quan trọng bên cạnh đoạn trước sau. Nhận ra điều bài mở đầu, triển khai và kết thúc để ý nghĩa không mất khi ghi nhớ.|Ứng dụng có phân biệt bối cảnh: phần huấn luyện chuyên sâu cần hướng dẫn, phần đạo đức gần có thể bắt đầu ngay.',
    'Đọc trọn mạch giúp lời dạy trở thành hướng sống có điểm tựa.','duong');
  essay('nam-uan','Năm uẩn giúp hiểu nỗi khổ do giữ một hình ảnh cứng về bản thân, và mở ra khả năng trưởng thành.',
    'Sắc là mặt vật chất; thọ là sắc thái cảm giác; tưởng là nhận diện; hành gồm hoạt động tạo tác; thức là nhận biết tùy duyên. Các nhóm giúp khảo sát trải nghiệm, không phải năm đồ vật tách rời bên trong người. Thân, cảm giác và suy nghĩ đều đổi thay theo điều kiện.|SN 22.59 khảo sát uẩn qua vô thường, khổ và khả năng điều khiển. Nhận chúng là mình, của mình và tự ngã bền chắc đòi điều chúng không đáp ứng được. Bớt chấp ngã không xóa người đang sống hay hậu quả. Một lỗi cần sửa, nhưng không chứng minh mình vĩnh viễn xấu; điều kiện và phẩm chất có thể được thay đổi.',
    'Khi danh hiệu không còn','Nghỉ quản lý, Bình thấy mình mất giá trị. Nhiều năm anh đã gắn con người với chức vụ và sự kính nể. Đổi công việc trở thành cảm giác mất cả bản thân.|Anh học làm cha, người bạn và người giúp mà không có chức danh đi trước. Trống vắng vẫn có, nhưng anh bớt cần một nhãn duy nhất để cho phép mình có giá trị.',
    'Khi tự gọi mình bằng nhãn nặng nề, trở lại sự kiện, cảm giác và ý nghĩ cụ thể. Trạng thái đang có có thể chăm sóc; nhãn cố định thường đóng khả năng thay đổi.|Sửa hành động và điều kiện nuôi lỗi. Vô ngã không dùng để né trách nhiệm; lỗi cũng không xóa mọi khả năng tốt.',
    'Bớt giữ cái tôi bất biến giúp chịu trách nhiệm và vẫn có thể lớn lên.');
  essay('duyen-khoi','Khổ có điều kiện, nên sự chuyển hóa có nơi bắt đầu. Nhìn duyên giúp bớt thấy mọi việc đã cố định.',
    'SN 12.15 đặt chánh kiến giữa cực đoan có và không bằng thấy sinh khởi và đoạn diệt theo duyên. Sự việc không đứng riêng: thân, tâm, thói quen và hoàn cảnh tương tác. Thấy quan hệ ấy giúp nhận phần có thể đổi và giới hạn hiện tại.|Xúc, thọ, ái và thủ cho thấy tiếp xúc có thể nối bằng cảm giác rồi nắm giữ. Đây là góc ứng dụng gần, không thay toàn bộ mười hai chi và các cách giải thích truyền thống. Cơn bực được nuôi bằng thiếu ngủ, cách hiểu và lặp lại ý trả đũa. Chăm sóc những điều kiện ấy mở hướng khác; hiểu nguyên nhân giúp trách nhiệm có cách thực hiện.',
    'Cuộc cãi vì chiếc bát','Vợ chồng cãi vì bát chưa rửa. Sau đó họ thấy nhiều ngày thiếu ngủ, cảm giác không được giúp và thói quen nói vòng nằm sau việc nhỏ. Chỉ quy lỗi chiếc bát sẽ làm cùng cuộc cãi trở lại ở chuyện khác.|Họ chia lại việc và nói nhu cầu trước khi quá mệt. Một điều kiện đổi mở khả năng đối thoại từng bị cơn giận che.',
    'Khi khó khăn lặp, nhìn nhịp nghỉ, môi trường, giao tiếp và sự nắm giữ trong tâm. Chọn phần có khả năng điều chỉnh.|Thấy hoàn cảnh người khác làm bớt phán xét, đồng thời giữ ranh giới với hành vi gây hại. Hiểu biết và trách nhiệm cùng hiện diện.',
    'Điều có duyên để sinh cũng có điều kiện để thay đổi.');
  essay('long-tu','Lòng từ nuôi thiện ý muốn chúng sinh an ổn và làm cách cư xử có thêm sự chăm sóc.',
    'Sn 1.8 nêu ngay thẳng, khiêm nhường, biết đủ và không tổn hại, rồi mở thiện ý đến các loài. Lòng từ có nền đạo đức, không chỉ là cảm giác ấm khi gần người thích. Có thể mong một người bớt gây hại và sống tốt hơn dù không đồng ý hành vi.|Nhắc lại lời xúc phạm trong tâm kéo dài đối đầu dù người kia đã đi. Lòng từ đổi hướng nuôi tâm: giữ rõ việc sai mà bớt lấy đau làm lý do gây đau thêm. Thiện ý không buộc giao lại lòng tin ngay hay ở lại trong nguy hiểm. Nó được tập dần, không thể ép mình phải thương bằng mệnh lệnh.',
    'Người hàng xóm làm ồn','Hạnh định công kích nhà bên trong nhóm chung. Cô chọn nói rõ giờ cần yên và cách sắp xếp. Biết họ chăm người bệnh, cô hiểu thêm hoàn cảnh nhưng vẫn giữ nhu cầu nghỉ.|Hai nhà thống nhất giờ hoạt động và báo trước. Thiện ý mở đối thoại; ranh giới giữ nó khỏi biến thành chịu đựng ấm ức.',
    'Giữ ý hướng vừa sức: mong mình và người trước mặt bớt gây khổ. Thể hiện bằng lời vừa rõ vừa tôn trọng.|Trong tình huống không an toàn, giữ khoảng cách và tìm giúp đỡ. Có thể không trả thù mà vẫn bảo vệ bản thân.',
    'Lòng từ mở rộng thiện ý và vẫn bảo vệ sự an toàn cần thiết.');
  essay('hai-huong-tu-duy','Điều lặp lại trong tâm có thể thành nếp sống. Sự lựa chọn bắt đầu từ hướng nuôi suy nghĩ.',
    'MN 19 phân biệt tầm dục, sân, hại với xuất ly, vô sân, bất hại. Tiêu chuẩn là điều suy nghĩ nuôi lớn và hậu quả đưa tới. Trả đũa chưa thành lời vẫn làm tâm căng và khiến lần gặp sau dễ bùng nổ. Nhận ra ý nghĩ bất thiện không cần ghét bản thân; cần ngừng cấp chất liệu cho nó.|Ý hướng lành được nuôi bằng nhớ trách nhiệm, cảm thông và việc hữu ích. Kinh cũng nói suy nghĩ quá lâu, kể cả thiện, gây mệt. Tâm luôn bàn cách giúp vẫn có thể thiếu an tịnh. Rèn luyện gồm biết hướng nghĩ và biết lúc lắng xuống cho định được nuôi.',
    'Tập lại cuộc cãi trong đầu','Duy đi về và tưởng tượng lời sắc để đáp đồng nghiệp. Mỗi lần dựng lại, anh thấy đúng hơn và nóng hơn. Nhận tác động ấy, anh ngừng mở lại tranh luận trong tâm.|Anh ghi sự việc cần giải quyết bằng dòng trung tính và để trao đổi sáng sau. Năng lượng trả đũa chuyển thành đối thoại có mục đích.',
    'Nhận dòng nghĩ đang nuôi sân, ham muốn hay chăm sóc. Dừng thêm chất liệu điều gây hại bằng trở lại việc hiện tại.|Sau khi đã chọn việc cần làm, dành khoảng yên. Tâm được nghỉ thường nhìn rõ hơn tâm liên tục tranh luận.',
    'Hướng tâm được nuôi thường xuyên sẽ dần thành hướng sống.');
  essay('bay-cach-doan-tru','Khó khăn khác nhau cần cách chăm sóc khác nhau. Một phương pháp không đáp ứng mọi phiền não.',
    'MN 2 nêu bằng thấy biết, phòng hộ, thọ dụng, kham nhẫn, tránh né, trừ bỏ và tu tập. Các cách gồm sửa cái nhìn, giữ cửa giác quan, dùng vật đúng mục đích, chịu điều phù hợp, tránh nguy hiểm, bỏ ý bất thiện và phát triển giác chi. Mỗi cách đáp ứng điều kiện khác.|Thói quen bị môi trường kích thích cần phòng hộ; nguy hiểm cần tránh; hiểu lầm cần soi sáng. Kham nhẫn là không bị khó chịu lập tức điều khiển trong hoàn cảnh phù hợp. Nó không buộc chịu lạm dụng hay bỏ bệnh cần chăm. Cùng một kinh có cả kham nhẫn và tránh né: chịu đựng và bảo vệ có thể cùng đúng khi đúng chỗ.',
    'Điện thoại cạnh giường','Lâm lướt tin đến khuya rồi tự trách thiếu nghị lực. Anh chuyển máy ra khỏi giường và tắt thông báo. Điều kiện kích thích yếu đi trước khi cần thêm ý chí.|Khi muốn mở máy, anh nhận ra rồi trở về nghỉ. Môi trường đổi cùng rèn tâm giúp sáng bớt mệt; tự trách giảm khi có cách chăm đúng.',
    'Điều chỉnh một điều kiện gần của thói quen, như nơi đặt thiết bị, giờ tiếp xúc hay nội dung. Phòng hộ tạo cơ hội tâm vững hơn.|Giữ kham nhẫn cho điều có thể chịu mà không hại, tránh nguy hiểm rồi nuôi hiểu biết và an tịnh.',
    'Chăm sóc đúng điều kiện giúp tu tập bớt gồng và có hiệu quả.');
  essay('thien-huu','Bạn lành và người hướng dẫn giúp thấy lỗi cùng khả năng của mình trong quan hệ có lòng thương và chân thật.',
    'SN 45.2 nhấn mạnh thiện hữu đối với toàn bộ đời sống phạm hạnh và sự phát triển Bát chánh đạo. Bạn lành không chỉ làm ta được đồng tình; họ giúp nuôi thiện và thấy điều cần sửa. Quan hệ tốt cho phép nhận lỗi không bị làm nhục, nói điều chưa hiểu không bị buộc phục tùng.|Người hướng dẫn đáng tin có sự nhất quán giữa đạo đức, lời dạy và cách đối xử người yếu thế. Biết ơn không buộc bảo vệ mọi hành vi của người kính trọng. Có thể học điều đúng, thấy giới hạn và tìm nguồn đối chiếu. Trưởng thành của người học là lợi ích của thiện hữu.',
    'Nhóm đọc kinh nhỏ','Bốn bạn đọc một đoạn mỗi tuần. Một người nói đã hết sân; bạn nhẹ nhắc lần anh nặng lời người phục vụ. Không ai cười chê; họ cùng nhìn việc đã xảy ra.|Anh trở lại xin lỗi. Nhóm học thành nơi giúp lời hiểu gặp đời sống, thay vì xác nhận hình ảnh đẹp cho nhau.',
    'Chọn người đồng học giữ lời, tôn trọng ranh giới và góp ý cụ thể. Buổi học thành thật nâng đỡ hơn tranh luận thắng thua.|Khi được nhắc lỗi, giữ thông tin giúp sửa việc. Khi góp ý, nói về hành vi và hậu quả để người nghe còn lối thay đổi.',
    'Thiện hữu giúp điều lành được nuôi và điều sai được sửa.');

  essay('ban-va-truyen-thua','Một tác phẩm đi qua nhiều ngôn ngữ. Hiểu hành trình ấy giúp trân trọng bản đang đọc và không vội phán xét bản khác.',
    'Dịch kinh là chuyển một thế giới ý nghĩa sang ngôn ngữ khác. Thuật ngữ có thể được phiên âm, dịch nghĩa hoặc diễn đạt theo quy ước của cộng đồng. Hai bản khác cách dùng từ chưa tự chứng minh một bản sai. Cần nhận đúng tác phẩm, bản dịch và cùng vị trí trước khi nhận định.|Tâm Kinh có các bản văn với hình thức và độ dài khác nhau; hồ sơ đang liên kết T08n0251 là bản Hán gắn với Huyền Trang. Hiểu bản cụ thể giúp không gán chi tiết của một bản dài sang bản ngắn. Truyền thừa có giá trị vì giữ và giải thích lời kinh; nghiên cứu lịch sử giúp biết điều gì có chứng cứ, điều gì thuộc niềm tin của truyền thống.',
    'Hai bản trên bàn đọc','Thu thấy hai bản tụng dùng từ khác và nghĩ người đọc bản kia thiếu hiểu biết. Khi nhìn tên dịch giả cùng đoạn, cô thấy cách chuyển nghĩa khác nhưng không đủ căn cứ kết luận như mình đã nói.|Cô xin lỗi người bạn, cùng đọc từng đoạn. Sự khác biệt trở thành cơ hội hiểu sâu thay vì lý do chia nhóm đúng sai.',
    'Khi gặp từ khác, đặt hai bản cùng đoạn cạnh nhau và giữ thông tin dịch giả. Tìm lời giải thích trước khi kết luận.|Kính trọng truyền thống mình đang học và trình bày truyền thống khác bằng tên gọi, nguồn của chính họ. Sự chính xác giúp đối thoại có phẩm giá.',
    'Trân trọng bản đang đọc và hiểu sự khác biệt mở rộng lòng học hỏi.');
  essay('tam-kinh','Tâm Kinh soi sáng sự chấp vào thân tâm và sự vật như những thực thể đứng riêng, giúp lòng bớt bị nắm giữ làm chật.',
    'Năm uẩn được soi thấy là không trong văn cảnh trí tuệ Bát-nhã. Không nghĩa là không có tự tính độc lập, cố định; nó không phủ nhận những hiện tượng đang được trải nghiệm. Một bông hoa có mặt nhờ đất, nước, ánh sáng và nhiều điều kiện. Hình ảnh ấy chỉ là minh họa nhập môn cho sự phụ thuộc, không thay toàn bộ chiều sâu triết học tánh không.|Sắc và không được trình bày không tách rời: không cần hủy thân hay đời sống để tìm một cái không ở nơi khác. Thấy thân tâm nương duyên giúp bớt đòi chúng bất biến, đồng thời chú ý hơn đến điều kiện chăm sóc. Ngôn ngữ phủ định trong kinh tháo sự bám chấp vào các phạm trù; dùng nó phủ nhận đau khổ, đạo đức hay nhu cầu người khác là hiểu lệch mạch tuệ và từ bi.',
    'Chiếc cốc của cha','Sau khi cha mất, An không cho ai chạm chiếc cốc ông dùng. Một lần nó vỡ, cô thấy như mất cha thêm lần nữa. Yên lại, cô nhận ra tình thương còn trong ký ức, cách sống và những người được cha chăm.|Cô giữ mảnh cốc như một kỷ niệm mà bớt buộc mọi tình thương vào vật phải nguyên vẹn. Nỗi buồn không bị phủ nhận; sự nắm giữ một hình thức bắt đầu mềm đi.',
    'Khi một vật hay danh hiệu trở thành điều duy nhất giữ giá trị cho mình, nhìn các điều kiện và quan hệ rộng hơn đang nâng đỡ cuộc sống. Bớt chấp một hình thức không bắt buộc bỏ điều quý.|Chăm sóc thân, việc làm và người thân bằng nhận biết chúng mong manh và nương duyên. Tuệ về không cần làm trách nhiệm sáng hơn.',
    'Thấy sự vật không đứng riêng giúp buông bớt chấp thủ và chăm sóc điều đang có.');
  essay('kim-cang','Kim Cang giúp việc thiện bớt bị chi phối bởi nhu cầu giữ hình ảnh người làm thiện. Lòng rộng được nuôi cùng trí tuệ không trụ.',
    'Bố thí không trụ tướng không buộc ngừng thấy nhu cầu người nhận hay phủ nhận vật đang cho. Nó nhắm sự bám vào hình ảnh cố định về người cho, người nhận và công lao. Khi tâm đòi mình phải được biết đến là người tốt, món quà có thể bị đặt dưới nhu cầu được tôn vinh.|Các lời phủ định trong kinh đi cùng sự phát tâm và việc độ chúng sinh. Chúng giúp tháo chấp vào một tự ngã cứng, không cho phép bỏ sự chăm sóc cụ thể. Không trụ có thể làm hành động linh hoạt hơn: điều gì thực sự giúp được thì làm, điều gì chỉ nâng hình ảnh mình thì giảm. Đây là giải thích ứng dụng nhập môn; các cách luận giải Bát-nhã cần học trong truyền thống và bản giảng có nguồn.',
    'Bữa cơm không có ảnh chụp','Một nhóm chuẩn bị bữa ăn cho người khó khăn. Người tổ chức muốn tất cả xếp hàng chụp ảnh, nhưng có người nhận không muốn xuất hiện. Họ đổi cách ghi nhận để vẫn minh bạch khoản chi mà giữ riêng tư.|Bữa ăn không giảm giá trị vì thiếu một tấm hình cảm động. Nhóm hiểu rằng việc thiện trọn hơn khi quyền của người nhận không bị dùng để làm đẹp hình ảnh người cho.',
    'Khi giúp, giữ nhu cầu và phẩm giá người nhận ở trung tâm. Có thể minh bạch công việc mà không phô bày hoàn cảnh riêng của họ.|Nhận ra ý muốn được cảm ơn và nhẹ nhàng buông phần đòi hỏi. Sự ghi nhận có thể đến, nhưng không phải điều kiện để tiếp tục làm việc đúng.',
    'Không trụ làm lòng tốt bớt vướng vào công lao và gần hơn với nhu cầu thật.');
  essay('ton-trong','Pháp Hoa nuôi cách nhìn con người qua khả năng giác ngộ, giúp sự tôn trọng sâu hơn sự đánh giá nhất thời.',
    'Hạnh Thường Bất Khinh đặt lòng kính trước những khác biệt về thái độ và hành vi. Trong kinh, sự kính gắn với khả năng thành Phật. Khi ứng dụng, điểm mở ra là không đóng người khác trong lỗi hiện tại hay hoàn cảnh thấp kém, đồng thời vẫn nhận rõ điều cần ngăn chặn.|Tôn trọng không có nghĩa đồng ý mọi việc hoặc nhận sự xúc phạm. Chi tiết vị Bồ-tát tránh xa khi bị đánh cho thấy lòng không thù hận có thể đi cùng sự bảo vệ. Một lời góp ý tôn trọng nói rõ việc sai nhưng không hủy phẩm giá người nghe. Nó giữ cơ hội để họ sửa và lớn lên.',
    'Nhân viên mới mắc lỗi','Một nhân viên nhập sai đơn hàng. Thay vì gọi cô là người vô dụng trước nhóm, trưởng ca nói rõ thiệt hại, hướng dẫn sửa và kiểm tra quy trình. Cô vẫn nhận trách nhiệm nhưng không bị biến thành lỗi của mình.|Lần sau cô chủ động báo sớm khi chưa chắc. Sự tôn trọng không làm tiêu chuẩn thấp đi; nó làm việc sửa lỗi có thể xảy ra trước khi thiệt hại lớn.',
    'Trong bất đồng, nói hành vi, hậu quả và giới hạn cần giữ. Tránh dùng một lỗi làm nhãn cho cả con người.|Giữ khoảng cách với việc gây hại mà không nuôi ý muốn làm người kia mất phẩm giá. Sự rõ ràng ấy cho lòng kính một hình thức thực tế.',
    'Tôn trọng nhìn thấy khả năng trưởng thành và vẫn biết bảo vệ điều đúng.','khinh');
  essay('phuong-tien-nhat-thua','Phương tiện giúp lời dạy đến được với người nghe, còn nhất thừa giữ hướng đi rộng của sự giác ngộ trong Pháp Hoa.',
    'Một người đang sợ không tiếp nhận lời như một người đã vững. Một người mới học cần cách diễn đạt khác người quen kinh luận. Phương tiện quan tâm đến căn cơ để dẫn đi, thay vì đòi mọi người hiểu ngay cùng một tầng ý nghĩa. Trong Pháp Hoa, các phương tiện được đọc theo hướng quy về Phật thừa.|Thí dụ nhà lửa và cùng tử làm hiện rõ sự dẫn dắt qua từng bước. Ứng dụng vào việc giúp người cần giữ mục tiêu có lợi và sự thành thật về giới hạn. Mượn tên phương tiện để nói dối vì lợi riêng làm mất hướng cứu khổ. Khéo léo được nhận ra ở khả năng người được giúp trưởng thành, bớt bị lệ thuộc và thấy rộng hơn.',
    'Dạy một người lớn tuổi dùng điện thoại','Huy muốn mẹ học hết chức năng mới nhưng càng giải thích bà càng ngại. Anh bắt đầu bằng gọi cho người thân, viết vài thao tác lớn và để bà thử tự làm.|Khi đã vững, bà học thêm cách nhận biết tin lừa. Cách dẫn vừa sức không giữ bà ở mức thấp; nó mở sự tự tin để tiếp tục hiểu điều khó hơn.',
    'Bắt đầu từ điều người trước mặt có thể tiếp nhận. Giữ sự tôn trọng và cho họ tự thử thay vì làm mọi việc thay.|Theo dõi lợi ích thật của cách giúp: tăng hiểu biết, giảm nguy cơ và thêm tự chủ. Đó là hướng để sự khéo léo không trượt thành điều khiển.',
    'Phương tiện có ý nghĩa khi dẫn người học đến sự sáng rõ và tự do lớn hơn.','lua');
  essay('duy-ma-bat-nhi','Duy Ma Cật mở lòng bi ngay giữa đời sống và giúp thấy các đối lập không cần trở thành những bức tường chia người.',
    'Bất nhị trong kinh không đơn giản là mọi thứ như nhau. Nó tháo sự chấp cứng vào hai phía và mở cách thấy không bị phân biệt trói buộc. Các đối thoại và sự im lặng trong phẩm Nhập pháp môn bất nhị cần được đọc cùng mạch trí tuệ Đại thừa, không dùng để xóa đúng sai của hành động.|Cuộc thăm bệnh đặt giáo pháp trong một cảnh rất gần: người đau và người đến chăm. Lòng bi không tìm an ổn riêng rồi bỏ khổ ngoài cửa. Đồng thời, tuệ giúp biết cách giúp có hiệu quả và không đồng nhất mình với vai người cứu. Có mặt với người bệnh, hiểu nhu cầu và chia việc chăm đều có thể làm lòng bi thành hành động.',
    'Người chăm sóc cũng cần được chăm','Liên chăm cha nhiều tháng và thấy nghỉ ngơi là ích kỷ. Kiệt sức khiến cô dễ cáu. Khi anh chị chia ca, cô có thời gian ngủ và trở lại bên cha với tâm vững hơn.|Gia đình nhận ra sức khỏe người chăm liên hệ trực tiếp với sự chăm sóc. Không cần chọn giữa thương cha và bảo vệ mình như hai phía loại trừ.',
    'Khi giúp người bệnh, lắng nghe nhu cầu cụ thể và chia việc với người có khả năng. Sự hiện diện chân thật có giá trị hơn lời giảng dài vào lúc họ mệt.|Giữ năng lực giúp lâu dài bằng nghỉ và hỗ trợ. Trí tuệ làm lòng bi bền, không buộc phải cạn kiệt để chứng minh tình thương.',
    'Lòng bi có chiều sâu khi sự hiểu biết làm việc chăm sóc đúng và bền hơn.','benh');
  essay('duoc-su-ban-nguyen','Bản nguyện Dược Sư mở lý tưởng chăm sóc thân, tâm và hoàn cảnh sống của chúng sinh trong truyền thống Đại thừa.',
    'Mười hai nguyện trong T14n0450 có nhiều tầng: ánh sáng và trí tuệ, điều kiện sống, giới hạnh, bệnh tật, thiếu thốn và sự dẫn đến giác ngộ. Chỉ đọc kinh như lời bảo đảm chữa mọi bệnh làm hẹp ý nghĩa bản nguyện. Ngôn ngữ cứu độ thuộc đức tin và hành trì của truyền thống, không phải lời hứa kết quả y khoa từ thư viện.|Khi học tinh thần bản nguyện, thấy người bệnh còn cần thuốc, thức ăn, sự an toàn và người không làm họ cô độc. Chăm sóc có thể bắt đầu rất cụ thể: đưa đi khám, hiểu chỉ dẫn điều trị, giữ sự tôn trọng. Những mô tả thân thể và giới trong văn bản cổ cần được đọc có bối cảnh, không dùng làm lý do hạ thấp người hôm nay.',
    'Một người bệnh trong xóm','Nhóm tụng biết bác sống một mình và thường bỏ bữa khi đau. Ngoài thời tụng theo niềm tin, họ chia nhau mang thức ăn, đưa bác tái khám và giúp đọc hướng dẫn thuốc.|Bác có thêm nâng đỡ tinh thần cùng chăm sóc thiết thực. Tình thương không chỉ được nghe trong buổi tụng, mà có mặt trong những ngày bệnh kéo dài.',
    'Khi nguyện cho người bệnh, nối lời nguyện với một việc đủ khả năng và đúng nhu cầu. Tôn trọng quyết định, riêng tư và hướng dẫn chuyên môn của họ.|Giữ nghi thức như sự nâng đỡ tinh thần, đồng thời tiếp tục việc điều trị và chăm sóc cần thiết. Hai mặt có thể hỗ trợ nhau trong một đời sống có trách nhiệm.',
    'Bản nguyện được soi sáng qua việc làm cho người đau khổ được chăm sóc.');
  essay('ba-kinh','Phân biệt ba kinh Tịnh độ giúp lòng tin có chiều sâu và mỗi lời dạy được hiểu đúng bối cảnh.',
    'A Di Đà T12n0366 trình bày cảnh giới Cực Lạc, khuyến phát nguyện và chấp trì danh hiệu. Vô Lượng Thọ T12n0360 kể hạnh nguyện Pháp Tạng và sự thành tựu cõi Phật. Quán Vô Lượng Thọ T12n0365 có hoàn cảnh của Vi Đề Hy, ba phước, các phép quán và chín phẩm. Chúng liên hệ nhưng không có cùng toàn bộ nội dung.|Trong truyền thống Tịnh độ, cảnh giới và nguyện vãng sinh có ý nghĩa tôn giáo thật đối với người hành trì, không chỉ là ẩn dụ tâm lý. Thư viện giải thích ứng dụng gần mà vẫn giữ tầng nghĩa ấy. Biết điểm riêng của từng kinh giúp học bản nguyện, đạo đức và niệm Phật trong mạch phù hợp, thay vì gom mọi chi tiết vào một bài tụng ngắn.',
    'Một người tìm lời đã nghe','Bà Tâm được kể về chín phẩm và tìm mãi trong bản A Di Đà hằng ngày. Khi biết nội dung ấy thuộc Kinh Quán, bà đọc đúng bản và thấy thêm phần ba phước trước các phép quán.|Bà không bỏ bài tụng quen; bà hiểu nó rõ hơn trong cả một truyền thống. Nhận đúng nguồn làm lòng tin mở rộng thay vì rối bởi chi tiết không tìm thấy.',
    'Giữ riêng tên và mã ba bản khi đọc. Học một kinh trọn mạch trước, rồi nhìn nội dung bổ trợ từ hai bản còn lại.|Kết nối lòng tin với sự ngay thẳng, hiếu dưỡng và chánh ngữ. Học rộng làm niệm Phật gần hơn với cách sống có phẩm chất.',
    'Hiểu điểm riêng của từng kinh giúp thấy truyền thống Tịnh độ đầy đặn hơn.');
  essay('phat-nguyen','Phát nguyện cho đời sống một hướng đi. Lời nguyện có sức khi giúp những lựa chọn hằng ngày trở nên nhất quán.',
    'Trong A Di Đà, nguyện sinh Cực Lạc đi cùng chấp trì danh hiệu và lòng hướng về cõi Phật. Các truyền thống giải thích tín, nguyện và hành với những nhấn mạnh riêng. Không nên biến niềm tin tôn giáo ấy thành lời bảo đảm kết quả từ một số lần niệm do ứng dụng đặt ra.|Ứng dụng gần của phát nguyện là biết điều mình đang muốn nuôi: bớt gây khổ, gìn giữ đạo đức và có tâm hướng thiện. Lời nguyện không loại bỏ yếu đuối, nhưng tạo điểm trở về khi lựa chọn khó. Khi việc làm chưa khớp lời nguyện, sự chân thật giúp nhận và sửa, thay vì dùng nghi thức để che khoảng cách.',
    'Lời nguyện trước khi mở cửa hàng','Sơn niệm Phật buổi sáng nhưng hay nói quá công dụng hàng bán. Anh thấy lợi nhuận đang làm lời nguyện xa cách việc làm. Anh đổi cách giới thiệu, nói rõ giới hạn sản phẩm.|Có đơn hàng giảm, nhưng khách bắt đầu tin hơn. Lời nguyện trở thành một quyết định có giá phải trả và có giá trị đạo đức cụ thể.',
    'Giữ một ý hướng rõ trong buổi tụng rồi nối nó với một hành vi cùng ngày, như không nói quá điều chưa biết hoặc không lấy phần lợi của người khác.|Khi lỡ, trở về lời nguyện bằng sửa việc đã làm. Lòng tin được nuôi bằng sự nhất quán có thể nhìn thấy.',
    'Lời nguyện sâu dần khi nó định hướng cách sống, nhất là lúc có lợi riêng.');
  essay('nguyen-va-gioi','Nguyện lành và nền đạo đức nâng đỡ nhau. Sự hướng về cõi Phật cần được nuôi trong quan hệ hiện tại.',
    'Kinh Vô Lượng Thọ mở lý tưởng bản nguyện, còn Kinh Quán nêu ba phước, gồm hiếu dưỡng, phụng sự thầy, từ tâm bất sát, mười thiện cùng những nền tảng khác. Nguyện vãng sinh không cho phép bỏ phần trách nhiệm đang có. Lòng kính trở nên có hình thức qua việc đối xử thật.|Giới làm lời nguyện bớt bị chia đôi bởi hành vi gây hại. Người có thể tụng rất thành tâm mà vẫn cần sửa gian dối hoặc nặng lời. Nhận khoảng cách ấy không phá đức tin; nó giúp đức tin trưởng thành, đủ sức dẫn một sự thay đổi khó nhưng cần thiết.',
    'Sau một buổi niệm Phật','Hương về nhà và quát người giúp việc vì làm chậm. Nghe giọng mình, cô thấy sự nhẹ trong buổi tụng chưa đi vào quan hệ. Cô xin lỗi và hỏi lại khối lượng việc đang quá sức.|Cô chia việc rõ hơn, giữ thời gian nghỉ. Lời nguyện không mất khi cô nhận lỗi; nó có cơ hội sống trong cách đối đãi.',
    'Để một quan hệ gần trở thành nơi thực hành lời nguyện: giữ lời, chia việc công bằng và bớt lời gây tổn thương.|Khi thấy việc chưa phù hợp, sửa cụ thể với người bị ảnh hưởng. Nghi thức và đạo đức cùng nâng đỡ sự tu học.',
    'Nguyện lành có nền vững trong cách mình đối xử với người đang sống gần.','guong');
  essay('thoi-khoa','Thời khóa tạo một nhịp trở về cho tâm, để lòng tin có cơ hội thấm vào lời nói và việc làm.',
    'Tụng niệm có âm điệu, sự tập trung, ký ức cộng đồng và ý hướng tôn giáo. Hiểu nghĩa làm các mặt ấy bổ trợ nhau: âm thanh giúp tâm quy tụ, còn lời kinh nhắc điều cần sống. Thời khóa dài không tự chứng minh hiểu sâu; nhịp vừa sức có thể giúp giữ sự thành thật với việc tu.|Một buổi niệm Phật có thể được chuẩn bị bằng dừng việc đang làm, đọc rõ nghĩa và hướng tâm theo truyền thống đang học. Những cách sắp xếp của thư viện là gợi ý hiện đại, không là nghi thức bắt buộc hay điều kiện bảo đảm vãng sinh. Hành trì chuyên sâu nên được học từ người hướng dẫn phù hợp.',
    'Buổi tụng bị tiếng con chen vào','Đang tụng, chị Đào bực vì con gọi hỏi bài. Chị thấy mình đang giữ buổi tụng bằng sự nóng nảy. Chị dừng, giúp con một lúc rồi trở lại khi nhà yên.|Âm thanh ít hơn hôm trước nhưng lòng bớt đối kháng. Chị hiểu việc chăm con cũng là nơi cho ý nghĩa thời tụng hiện ra.',
    'Chọn một khoảng vừa sức, đọc nghĩa trước phần tụng chưa hiểu và giữ thân thoải mái. Khi bị gián đoạn, đáp ứng điều cần rồi trở lại.|Mang một nghĩa của buổi tụng vào ngày: lời hòa nhã, việc đúng hẹn hoặc sự chăm sóc. Nhịp tụng được nối với nhịp sống.',
    'Thời khóa có chiều sâu khi sự quy tụ của tâm mở ra cách sống lành hơn.');
  essay('doc-cac-nguyen','Các nguyện trong Vô Lượng Thọ mở một tầm nhìn về cứu độ, điều kiện tu học và sự nâng đỡ rộng lớn.',
    'Pháp Tạng phát nguyện không chỉ cho sự an ổn riêng. Các nguyện trong bản đang đọc liên hệ cảnh giới, tuổi thọ, ánh sáng, điều kiện giác ngộ và sự tiếp nhận chúng sinh. Cần giữ đúng bản khi nói số lượng hoặc chi tiết vì các bản truyền thừa không hoàn toàn đồng nhất.|Học bản nguyện giúp nhìn sự tu như điều cần nhiều điều kiện nâng đỡ. Sự ứng dụng gần là tạo môi trường người khác bớt sợ, có cơ hội học và không bị bỏ lại. Cách ứng dụng này là suy ngẫm biên soạn; ý nghĩa cõi Phật và vãng sinh trong truyền thống không bị thay bằng một chương trình xã hội thuần túy.',
    'Một lớp học có chỗ cho người mới','Nhóm đọc kinh nhận một người đọc chậm. Ban đầu họ ngại mất thời gian, rồi chia đoạn ngắn và gửi bản chữ lớn trước buổi học. Người mới dần có thể theo kịp.|Thay đổi điều kiện giúp lời nguyện muốn mọi người được học trở thành thực tế. Sự rộng không chỉ ở số người được mời mà ở khả năng họ thật sự tham gia.',
    'Nhìn các nguyện theo chủ đề trong đúng bản, rồi giữ ý nghĩa dẫn đến giác ngộ của chúng. Không tự ghép chi tiết từ các bản thành một nguyên văn tưởng tượng.|Trong việc chung, tạo một điều kiện giúp người yếu thế tham gia được: giờ phù hợp, chữ dễ đọc hoặc người đồng hành.',
    'Tầm rộng của lời nguyện nhắc mình chăm cả những điều kiện giúp người khác đi tiếp.');
  essay('ba-phuoc','Ba phước đưa nền đạo đức và lòng phát tâm vào trước các phần quán của Kinh Quán, làm tu học có gốc trong đời sống.',
    'Nhóm thứ nhất gồm hiếu dưỡng cha mẹ, phụng sự thầy, từ tâm không sát và mười thiện. Nhóm thứ hai gồm quy y, giới và sự gìn giữ oai nghi. Nhóm thứ ba gồm phát tâm Bồ-đề, tin nhân quả, đọc tụng Đại thừa và khuyến tiến người tu. Ba nhóm được đọc trong mạch Kinh Quán, không dùng danh sách ngắn thay cho toàn bộ giáo pháp.|Hiếu dưỡng không chỉ là vật chất mà còn cách nghe, chăm và tôn trọng. Mười thiện đưa việc tu vào thân, khẩu, ý. Phát tâm mở việc lành khỏi lợi riêng. Người đang nuôi gia đình không cần đợi có đời sống hoàn toàn yên mới bắt đầu; các trách nhiệm hiện tại đã có nơi để nuôi những phẩm chất ấy.',
    'Cuộc gọi về nhà','Thắng gửi tiền đều nhưng mỗi lần mẹ gọi anh vội ngắt. Khi đọc về hiếu dưỡng, anh nhận ra phần cô đơn không được giải quyết bằng chuyển khoản.|Anh giữ một khoảng gọi không làm việc khác, hỏi tình hình thuốc và tìm người hỗ trợ gần nhà. Tình thương có thêm sự hiện diện, không chỉ nguồn tiền.',
    'Chăm một nhu cầu người thân chưa được đáp ứng: sự nghe, việc đi khám hoặc hỗ trợ sinh hoạt. Giữ khả năng của mình và chia trách nhiệm hợp lý.|Nuôi thân, lời và ý theo hướng ít hại, rồi mở việc lành đến người ngoài gia đình. Nền đạo đức làm hành trì có chiều sâu.',
    'Gốc tu học có thể được nuôi ngay trong bổn phận gần gũi hằng ngày.');
  essay('ho-so','Hồ sơ đúng giúp một lời giải thích có nơi kiểm chứng và giúp người đọc sau tiếp tục việc học.',
    'Một tác phẩm và một tệp không phải cùng cấp. Tác phẩm có bản truyền thừa; bản dịch có dịch giả; tệp số có nơi cung cấp và chất lượng chuyển đổi. Ghi riêng các lớp ấy giúp không xem lỗi OCR là câu kinh hay coi ngày tạo tệp là ngày văn bản xuất hiện.|Mã Đại Chánh cùng vị trí trang, cột, dòng là điểm tìm trong một ấn bản. Chúng có ích cho đối chiếu, nhưng không tự giải quyết lịch sử hình thành kinh. Khi hồ sơ còn thiếu, ghi rõ giới hạn là sự thành thật với người đọc, không phải dấu hiệu nghiên cứu kém.',
    'Một chữ sai trong bản quét','Nhóm đọc thấy câu khó hiểu và tranh luận giáo lý. Đối chiếu ảnh trang, họ nhận ra một chữ bị nhận dạng sai. Cả lập luận vừa dựng dựa trên lỗi chuyển đổi.|Họ ghi bản quét, vị trí và lỗi để người sau không mắc lại. Sự cẩn thận nhỏ bảo vệ ý nghĩa lớn của việc học.',
    'Khi giữ một đoạn, ghi tên tác phẩm, dịch giả hoặc bản, vị trí và nơi lấy tệp. Nếu đọc OCR, kiểm tra ảnh khi câu bất thường.|Chỉ điền thông tin có căn cứ. Hồ sơ rõ giúp lời giải thích sâu có thể được kiểm chứng thay vì chỉ được tin.',
    'Nguồn rõ ràng làm sự hiểu biết có thể được trao lại một cách đáng tin.');
  essay('doi-chieu','Đối chiếu giúp nhìn sâu một lời kinh mà vẫn giữ riêng tiếng nói của từng bản và truyền thống.',
    'So sánh bắt đầu từ cùng tác phẩm và cùng đoạn. Một bản rút gọn với bản đầy đủ hoặc một chú giải với kinh không thể bị xem như hai bản dịch tương đương. Khác cách diễn đạt cần được đặt trong ngữ cảnh, thuật ngữ và chủ đích bản dịch.|Tâm Kinh và Vô ngã tướng có điểm có thể đặt cạnh về chấp thân tâm, nhưng tánh không Bát-nhã và cách khảo sát uẩn trong SN 22.59 không nên bị tuyên bố đồng nhất chỉ từ một câu giống nghĩa. Thấy liên hệ có ích; giữ khác biệt giúp hiểu sâu thay vì hòa mọi truyền thống thành một lời giải đơn giản.',
    'Hai người đọc chữ không','Một người hiểu không là không tồn tại, người kia hiểu không có tự tính. Họ trở lại đoạn và bản giảng có nguồn, thấy cuộc cãi bắt đầu vì cùng chữ nhưng khác khái niệm.|Họ ghi rõ nghĩa đang dùng và đọc tiếp. Làm sáng thuật ngữ giúp đối thoại bớt thắng thua và gần hơn việc tìm hiểu.',
    'Đặt cùng đoạn cạnh nhau, giữ đủ câu trước sau và tên bản. Phân biệt khác chữ với khác nghĩa trước khi nhận định.|Khi so hai truyền thống, nói rõ điểm liên hệ và giới hạn. Chưa đủ bằng chứng đồng nhất thì giữ cả hai cách trình bày.',
    'Đối chiếu tốt làm rõ sự liên hệ mà vẫn trân trọng khác biệt.');
  essay('phan-lop','Biết lớp văn bản giúp một câu chuyện cảm động được quý trọng mà không bị đặt nhầm vào nguyên văn kinh.',
    'Kinh, chú giải, truyện giải thích và lời hướng dẫn hiện đại có chức năng khác nhau. Kệ Pháp Cú và chuyện đi kèm trong truyền thống chú giải không tự là cùng một lớp. Một câu chuyện có thể mở nghĩa rất hay, nhưng người kể cần nói rõ nó từ đâu.|Iti 60 nêu ba nền tảng làm phước; các danh sách triển khai rộng hơn thuộc hệ thống luận giải. Phân lớp không hạ thấp chú giải. Nó giúp người đọc thấy phần kinh nói, phần truyền thống giải thích và phần người biên soạn ứng dụng, để hiểu biết có thể đi sâu mà không nhận nhầm nguồn.',
    'Một câu chuyện được kể lại nhiều lần','Linh nhớ một chuyện từ buổi giảng rồi đăng là trích kinh. Khi người bạn hỏi vị trí, cô không tìm được trong bản đang có. Cô sửa lời dẫn thành chuyện được giảng kể, chưa xác định nguồn.|Câu chuyện vẫn có ý nghĩa, còn sự sửa giúp người đọc biết mức chắc chắn. Chân thật với nguồn làm lời chia sẻ đáng tin hơn.',
    'Khi kể lại, giữ nhãn nguồn: chuyện trong kinh, chuyện chú giải hoặc tình huống minh họa. Đừng thêm lời thoại tưởng tượng rồi trình bày như lời Phật.|Quý giá của câu chuyện nằm cả ở nghĩa nó mở và sự thành thật của người truyền đạt.',
    'Gọi đúng lớp văn bản giúp lòng kính đi cùng sự chính xác.');
  essay('bang-lap-luan','Kết luận có chiều sâu khi điều mình biết và giới hạn của nó được trình bày thành thật.',
    'Một câu trong kinh cho biết văn bản đang nói điều gì; từ đó đến kết luận lịch sử hay kết quả thực hành còn cần chứng cứ khác. Phân biệt dữ kiện, diễn giải và ứng dụng giúp không nhảy từ một câu giàu ý nghĩa sang tuyên bố quá rộng.|Sự thận trọng có thể làm cách sống mềm hơn: không lấy một trải nghiệm riêng làm chuẩn cho tất cả, không lấy một lỗi làm kết luận về cả người. Ghi rõ phạm vi giúp người khác kiểm tra và tiếp tục học. Hiểu biết có thể vững mà vẫn mở cho chứng cứ mới.',
    'Một trải nghiệm ngồi yên','Sau buổi ngồi rất an, Khoa muốn viết rằng phương pháp này chắc chắn giúp mọi người hết lo. Anh nhận ra điều mình có là trải nghiệm một buổi trong hoàn cảnh riêng.|Anh kể đúng điều xảy ra, thời lượng và giới hạn, không hứa kết quả cho người khác. Bài chia sẻ bớt gây kỳ vọng sai và hữu ích hơn cho người mới.',
    'Trình bày điều nguồn nói trước, rồi ghi phần mình suy luận và phần ứng dụng. Dùng phạm vi cụ thể thay lời khẳng định bao trùm.|Khi có chứng cứ mới, sửa nhận định công khai cùng lý do. Khả năng điều chỉnh là một phẩm chất của sự học sâu.',
    'Hiểu sâu đi cùng khả năng nói rõ điều biết và điều còn có giới hạn.');
  essay('sau-phuong','Sáu phương giúp thấy tu học giữa những quan hệ cụ thể, nơi sự kính trọng được đáp lại bằng trách nhiệm.',
    'DN 31 nối sáu phương với cha mẹ, thầy, vợ chồng, bạn, người làm và người tu. Điểm mạnh của bản đồ là tính hai chiều. Con có bổn phận, cha mẹ cũng có trách nhiệm; người làm tận tâm, chủ cũng cần phân công phù hợp và đối đãi đúng. Quan hệ lành không được xây bằng một phía chịu mọi gánh.|Văn bản mang bối cảnh xã hội cổ. Khi ứng dụng hôm nay, cần giữ tinh thần bảo vệ, chân thật và chăm sóc hai chiều, đồng thời nhận rõ những mô tả vai trò không tự thành quy tắc áp mọi gia đình. Sự kính trọng hiện qua việc nghe, giữ lời, chia trách nhiệm và bảo vệ người dễ tổn thương.',
    'Bàn ăn và lịch chăm con','Vợ chồng Huệ đều đi làm nhưng cô làm toàn việc nhà. Khi nói về trách nhiệm hai chiều, họ cùng nhìn thời gian thực tế thay vì mặc định một người phải lo hết.|Họ chia lại việc, giữ thời gian nghỉ cho cả hai và chăm con cùng nhau. Tình thương có thêm sự công bằng để tiếp tục bền.',
    'Chọn một quan hệ đang mất cân đối và nói rõ nhu cầu, khả năng, trách nhiệm đôi bên. Thống nhất việc cụ thể thay lời hứa chung.|Giữ sự kính bằng cách nghe người chịu gánh nặng hơn. Công bằng trong việc nhỏ giúp quan hệ có chỗ cho cả hai.',
    'Bảo vệ sáu phương bắt đầu bằng trách nhiệm hai chiều trong các quan hệ.','phuong');
  essay('chanh-ngu','Chánh ngữ giúp sự thật được nói theo hướng giảm khổ. Điều khó nghe vẫn có thể được trao bằng sự chăm sóc.',
    'MN 58 xét lời theo sự thật, lợi ích và thời điểm thích hợp, kể cả khi người nghe không thích. Chánh ngữ không buộc chỉ nói điều dễ chịu. Có lỗi cần được nêu và nguy cơ cần ngăn; sự im lặng để giữ hòa khí bề mặt đôi khi tiếp tục làm người khác bị hại.|Sự thật cũng có thể bị dùng như vũ khí. Kể lỗi trước đám đông để làm nhục khác với góp ý để sửa việc. Ý hướng cần đi cùng cách nói: nêu hành vi, hậu quả và việc có thể sửa, không kết án toàn bộ con người. Lòng thương làm lời rõ hơn vì nó hướng đến ích lợi thật.',
    'Góp ý sau buổi làm việc','Quản lý thấy Hào bỏ sót bước kiểm tra. Thay vì quát trong nhóm, chị gặp riêng, nêu lỗi và tác động, nghe điều kiện rồi thống nhất cách kiểm. Hào không dễ chịu nhưng biết điều cần thay đổi.|Lần sau anh báo sớm khi quá tải. Sự thật được nói không mất tiêu chuẩn mà tăng khả năng sửa và lòng tin.',
    'Trước cuộc trao đổi khó, xác định sự việc có căn cứ và ích lợi cần đạt. Chọn lúc hai bên có thể nghe, nêu việc cụ thể và phần cần sửa.|Nếu đang nóng, dừng trước lời làm nhục. Có thể kiên quyết với giới hạn và vẫn giữ phẩm giá người đối diện.',
    'Lời thật sâu sắc có sự rõ ràng, đúng lúc và lòng muốn người nghe bớt khổ.','voi');
  essay('doi-song-can-doi','Đời sống cư sĩ có công việc, của cải và trách nhiệm. Tu học giúp những mặt ấy được chăm bằng sự ngay thẳng và biết đủ.',
    'AN 8.54 nói đến siêng năng, bảo vệ tài sản, bạn lành và sống cân đối cho lợi ích hiện tại; tín, giới, thí và tuệ cho lợi ích về sau. Việc kiếm sống không đứng ngoài đạo đức. Có năng lực mà dùng gian dối sẽ làm lòng tin và sự an ổn suy yếu.|Sống cân đối là biết khả năng thu chi và không để ham muốn vượt nền thực tế. Biết đủ không phủ nhận nỗ lực nuôi gia đình, cũng không dùng để giữ người khó khăn trong cảnh thiếu thốn. Nó làm sự so sánh bớt điều khiển quyết định và dành nguồn lực cho những điều có giá trị lâu dài.',
    'Mua để không thua bạn bè','Mỗi lần thấy bạn đổi đồ mới, Phúc mua theo bằng trả góp. Tiền còn lại khiến nhà luôn căng. Anh bắt đầu nhìn chi phí cùng nhu cầu thật thay vì hình ảnh trên mạng.|Anh giảm khoản không cần, giữ quỹ cho gia đình và vẫn phát triển nghề. Bớt so sánh làm nỗ lực có hướng rõ hơn.',
    'Giữ một cách nhìn thành thật về nguồn thu, chi cần thiết và nghĩa vụ. Sự cân đối tạo nền cho tâm bớt bị lo tài chính kéo.|Nuôi nghề bằng chất lượng và chân thật, giữ quan hệ bạn lành, dành phần vừa sức cho chia sẻ. Của cải có thể nâng đỡ việc lành khi được tạo và dùng đúng.',
    'Biết đủ giúp công việc và nguồn lực phục vụ một đời sống có phẩm chất.');
  essay('diem-lanh','Kinh Điềm lành chuyển chú ý về những điều kiện có thể vun bồi cho đời sống tốt, thay vì chỉ đợi dấu hiệu may mắn.',
    'Sn 2.4 nêu không thân cận người ngu, gần người trí, kính người đáng kính, học và nghề, lời khéo nói, chăm gia đình, sống thiện và sự trưởng thành trong pháp. Các điều lành có thể được nuôi bằng quan hệ, hiểu biết và hành động, không chỉ trông vào vận may.|Những điều kiện bên ngoài và phẩm chất bên trong bổ trợ nhau. Môi trường dễ gây hại làm việc tu khó hơn; tâm thiếu tỉnh táo cũng làm môi trường tốt mất tác dụng. Kinh mở một tiến trình đến những phẩm chất sâu như không bị lay động trước pháp thế gian, không nên rút toàn bộ thành mẹo sống thành công.',
    'Một ngày tưởng là xui','Trâm bị hỏng xe trước kỳ thi và nghĩ ngày ấy hoàn toàn xấu. Bạn giúp đưa đi, cô bình tĩnh xử lý và vẫn làm bài. Sau đó cô thấy sự chuẩn bị, người bạn và khả năng giữ tâm đã nâng đỡ mình.|Khó khăn vẫn thật, nhưng cô bớt dùng một sự cố làm tên cho cả ngày. Điều lành đã có thể hiện diện giữa điều bất tiện.',
    'Vun bồi một điều kiện bền: học kỹ năng, giữ bạn lành, chăm gia đình hoặc lời nói tốt. Chúng giúp đời sống vững khi hoàn cảnh không thuận.|Ghi nhận sự giúp đỡ đã nhận và đáp lại bằng hành động. Biết ơn làm điều lành tiếp tục trong quan hệ.',
    'Điều lành có thể được vun bồi ngay giữa một ngày chưa thuận ý.');
  essay('phuc-va-long-tu','Việc thiện đi cùng lòng từ làm sự giúp đỡ có chiều sâu, còn phản tỉnh giữ nó khỏi trở thành lợi riêng.',
    'Bố thí có thể cho điều kiện vật chất; giới bảo vệ khỏi tổn hại; tu tập chăm hướng tâm. Lòng từ mở thiện ý vượt người mình thích. Ba nền tảng làm phước và thiện ý có thể nâng đỡ nhau, nhưng không cần gộp các kinh thành một công thức bảo đảm kết quả.|Người giúp cũng cần nhìn lại ảnh hưởng thật. Có lúc giúp theo ý mình làm người nhận mất quyền chọn; có lúc lòng tốt che việc muốn được kính nể. Sự thành thật với động cơ không khiến phải ngừng làm thiện. Nó giúp cách làm được sửa để lợi ích người nhận rõ hơn.',
    'Giúp người bạn tìm việc','Loan liên tục gửi việc và trách bạn không nhận. Sau khi nghe hoàn cảnh chăm con, cô thấy những việc ấy không phù hợp. Cô đổi sang giúp sửa hồ sơ và tìm giờ linh hoạt.|Bạn có thể chọn mà không bị mang ơn thành áp lực. Thiện ý trưởng thành khi hiểu hoàn cảnh thay vì buộc người khác nhận điều mình nghĩ là tốt.',
    'Trao đổi nhu cầu và khả năng trước khi giúp. Giữ quyền quyết định của người nhận và nhận biết khi cách giúp đang tạo thêm gánh.|Sau việc thiện, nhìn hiệu quả cụ thể và điều có thể sửa. Niềm vui lành đi cùng sự khiêm nhường giúp làm thiện bền.',
    'Lòng tốt có chiều sâu khi hiểu nhu cầu, tôn trọng tự chủ và biết sửa cách giúp.');
  essay('chon-ban-tung','Chọn bản tụng rõ nguồn giúp tiếng đọc và ý nghĩa gặp nhau, đồng thời trân trọng nghi thức của cộng đồng.',
    'Một thời tụng có thể gồm kinh, lời tán, sám hối, hồi hướng và hướng dẫn nghi lễ. Mỗi phần có nguồn và vai trò riêng. Chúng cùng làm một buổi hành trì nhưng không vì thế tất cả trở thành nguyên văn của một kinh. Nhận rõ lớp văn bản giúp hiểu tiếng mình đang đọc.|Bản chữ dễ nhìn và bản giải nghĩa có nguồn hỗ trợ sự tiếp nhận. Nếu khác nghi thức giữa các nơi, cần tìm quy ước của cộng đồng đang học thay vì phán bản lạ là sai. Nghi lễ có sức nâng đỡ qua sự thành kính và cùng thực hành; học nghĩa giúp sức ấy tiếp tục trong ngày.',
    'Trang tụng quen từ nhỏ','Bà Sen đọc bài hồi hướng từ lâu và tưởng nằm trong A Di Đà. Khi cháu tìm giúp, hai người nhận ra đó là phần nghi thức theo sau kinh. Bà vẫn giữ lòng quý với bài đọc.|Hiểu nguồn làm bà biết rõ phần nào là kinh, phần nào biểu đạt nguyện của thời tụng. Sự chính xác không làm buổi tụng lạnh đi; nó làm lòng kính sáng hơn.',
    'Dùng bản có tên kinh, người dịch và nguồn nghi thức khi có. Đọc nghĩa những phần chưa hiểu ở ngoài giờ tụng để tiếng đọc đi cùng sự hiểu.|Giữ truyền thống đang học với sự tôn trọng, đồng thời gọi đúng từng phần khi giới thiệu cho người khác.',
    'Biết điều mình đang tụng giúp lòng thành kính có thêm sự hiểu biết.');
  essay('doc-tron-mach','Một câu nổi tiếng có chiều sâu hơn khi trở về mạch kinh đã nuôi nó. Nghĩa đầy đủ giúp ứng dụng đúng.',
    'Lời không trụ trong Kim Cang nằm cùng việc phát tâm và bố thí; lấy nó làm lý do không quan tâm người khác là tách khỏi hướng của kinh. Thí dụ Pháp Hoa nằm trong sự dẫn đến Phật thừa; chuyển mọi chi tiết thành chuyện đạo đức đơn giản sẽ mất tầng nghĩa tôn giáo.|Đọc trọn mạch không buộc nhớ mọi chữ ngay. Người đọc đi từ hoàn cảnh, hình ảnh và lập luận đến điều đoạn mở ra. Chỗ khó có thể được giữ lại để học tiếp. Sự kiên nhẫn ấy làm một câu từng như khẩu hiệu trở thành một ý nghĩa có gốc, có giới hạn và có sức ứng dụng.',
    'Không trụ bị hiểu thành không cần ai','Đạt nói mình không trụ nên không cần đáp lời bạn lúc khó. Khi đọc phần bố thí và phát tâm, anh thấy mình dùng thuật ngữ để tránh quan hệ. Anh trở lại lắng nghe bạn mà không cố đóng vai cứu giúp.|Anh hiểu bớt chấp vào hình ảnh bản thân có thể làm sự hiện diện rộng hơn, thay vì rút khỏi mọi trách nhiệm.',
    'Giữ câu nổi tiếng cùng đoạn dẫn đến và đoạn tiếp sau. Học từ khóa trong cách kinh dùng, không chỉ nghĩa thông thường.|Để sự hiểu tạo một hành động đúng hướng toàn bài. Bớt chấp cần làm khả năng chăm sóc lớn hơn.',
    'Mạch kinh giữ một câu sâu khỏi trở thành lý do cho thói quen cũ.','cungtu');
  essay('tra-nghia','Thuật ngữ được hiểu đúng giúp người đọc gặp giáo pháp sâu hơn và biết cách thực hành trong đời sống.',
    'Thọ trong niệm xứ là sắc thái cảm giác; không trong Bát-nhã liên hệ không có tự tính; vô ngã trong khảo sát uẩn tháo nhận uẩn là tự ngã bền chắc. Dùng nghĩa thông thường của chữ thay nghĩa văn cảnh có thể làm bài kinh nói điều nó không nói.|Hiểu thuật ngữ không chỉ để nhớ định nghĩa. Khi khó chịu, phân biệt cảm giác với ý muốn trả đũa giúp có khoảng lựa chọn. Khi nghe vô thường, nhận sự thay đổi giúp chăm điều kiện đang có. Một từ trở nên sống động khi nó giúp thấy trải nghiệm chính xác và bớt gây hại.',
    'Từ nhẫn đến việc giữ giới hạn','Dung từng nghĩ nhẫn là im lặng trước mọi lời xúc phạm. Khi học cùng nguồn giảng có bối cảnh, cô hiểu không trả thù vẫn có thể nói giới hạn và rời tình huống gây hại.|Cô trao đổi rõ với đồng nghiệp rồi tìm hỗ trợ khi việc lặp lại. Thuật ngữ được hiểu kỹ mở ra cách hành động an toàn hơn.',
    'Khi gặp từ chuyên biệt, đọc đoạn đang dùng và hồ sơ giải nghĩa kèm nguồn. Giữ nghĩa theo từng văn cảnh thay vì dùng một định nghĩa cho mọi kinh.|Nối nghĩa với một trải nghiệm gần và hành động cụ thể. Sự hiểu sâu thể hiện ở khả năng thấy rõ, không chỉ đọc đúng tên.',
    'Thuật ngữ có sức sống khi giúp thấy rõ trải nghiệm và hành động lành hơn.');
  essay('thoi-khoa-co-nghia','Hiểu, tụng và ứng dụng có thể nuôi nhau thành một nếp sống. Lời kinh không cần dừng ở âm thanh của buổi đọc.',
    'Đọc nghĩa chuẩn bị cho lòng thành kính có nội dung; tụng giúp tâm quy tụ và nhớ; ứng dụng đưa điều nhớ vào lời nói và việc làm. Nhìn lại đời sống giúp thấy phần cần học tiếp. Đây là cách sắp xếp hiện đại của thư viện, không thay nghi thức hay sự hướng dẫn của truyền thống.|Một câu cầu an cho chúng sinh có thể nhắc bớt làm tổn thương người cùng nhà. Một lời hồi hướng có thể giúp việc thiện bớt mang ý muốn giữ công riêng. Không cần đợi hiểu toàn bộ kinh mới bắt đầu việc lành gần, nhưng cũng không lấy vài ứng dụng ấy thay hết chiều sâu giải thoát của giáo pháp.',
    'Lời tụng đi cùng bữa cơm','Gia đình An chọn đọc chậm một đoạn đã hiểu, rồi trong bữa cơm tập nghe mà không ngắt lời. Ban đầu vẫn có lúc nóng; họ nhận ra và dừng thay vì trách nhau tu chưa tốt.|Qua nhiều tuần, bữa cơm dễ thở hơn. Tiếng tụng có một nơi tiếp tục sống trong cách đối xử, dù việc học vẫn còn dài.',
    'Trước buổi tụng, đọc nghĩa một đoạn vừa sức. Sau đó giữ một hành động cùng hướng trong ngày, như lời chân thật hoặc sự nghe trọn vẹn.|Khi thấy mình chưa làm được, sửa việc gần và trở lại nhịp học. Sự thành thật làm buổi tụng sau có chiều sâu mới.',
    'Ý nghĩa của thời tụng tiếp tục lớn lên trong những người được cách sống mình chăm sóc.');

  const deeper = {
    'bon-su-that': [
      'Một điểm quan trọng là buông ái không đồng nghĩa bỏ mọi mong muốn. Ý muốn chăm người bệnh, sửa lỗi hoặc học điều thiện có thể nâng đỡ con đường. Phần cần thấy là sự khát khao đang đòi kết quả và đồng nhất mình với nó đến mức làm hại. Người học vẫn chuẩn bị, làm hết trách nhiệm và nhận kết quả có nhiều duyên. Buông bớt đòi hỏi cho phép hành động sáng hơn, không làm hành động mất hướng.',
      'Có ngày Hà vẫn chạnh lòng khi thấy bạn được nhận việc. Cô không dùng nỗi buồn trở lại để kết luận mình chưa hiểu bài. Cô nhận nó đang có, không nuôi thêm lời tự sỉ nhục và tiếp tục việc cần làm. Sự chuyển hóa nằm cả ở cách sống cùng phần chưa được giải quyết.'
    ],
    'tam-kinh': [
      'Nếu không có bản chất cố định, khả năng thay đổi cũng được mở ra. Một người đang nóng có thể nuôi cách sống khác khi điều kiện được chăm; một quan hệ đã rạn có thể được sửa nếu hai phía có trách nhiệm. Nhưng nương duyên không cho phép hứa mọi điều sẽ đổi theo ý. Có mất mát không thể phục hồi hình thức cũ. Trí tuệ giúp chăm điều có thể chăm và bớt cưỡng ép điều không thuộc quyền mình.',
      'Những ngày giỗ cha, An vẫn khóc. Hiểu lời kinh không biến ký ức thành lạnh lùng. Cô có thể đau và vẫn sống tử tế với người còn bên cạnh; tình thương thôi bị buộc phải chứng minh bằng việc giữ nguyên mọi đồ vật.'
    ],
    'kim-cang': [
      'Chấp tướng còn xuất hiện ở việc xem người nhận mãi là người yếu và mình mãi là người mạnh. Khi họ lớn lên hoặc không làm theo ý, người cho có thể thấy bị phản bội. Không trụ mở khả năng nhìn lại quan hệ ở mỗi thời điểm: người từng được giúp có thể giúp người khác, và mình cũng có lúc cần được nâng đỡ. Lòng tốt không đóng con người vào vai trò để giữ ý nghĩa cho bản thân.',
      'Nhóm vẫn cần chứng từ và báo cáo khoản chi. Họ hiểu không trụ không miễn trách nhiệm quản lý. Điều thay đổi là cách ghi nhận có sự đồng thuận và giữ riêng tư, để minh bạch không được đổi bằng sự tổn thương của người nhận.'
    ],
    'nam-uan': [
      'Cảm giác mất giá trị thường mạnh vì nhiều yếu tố nhập thành một kết luận: thân mệt, thọ khó chịu, tưởng nhớ lần bị xem nhẹ, hành dựng chuyện thất bại và thức nhận các đối tượng ấy. Phân biệt các mặt không cần làm thành cuộc phân tích lạnh. Nó mở những cửa chăm khác nhau: nghỉ cho thân, nghe cảm giác, sửa nhận định và ngừng nuôi lời kết án. Nhờ vậy, hiểu uẩn có tác dụng với một nỗi khổ đang sống.',
      'Bình vẫn có lúc tìm lại sự kính nể cũ. Anh nhận ra nhu cầu ấy rồi trở lại một việc có giá trị trước mặt. Khả năng thay đổi không xuất hiện như một con người mới hoàn toàn; nó được nuôi qua nhiều lần không để một danh hiệu quyết định hết cách sống.'
    ],
    'duyen-khoi': [
      'Nhìn nhiều duyên cũng làm sự quy lỗi có chiều sâu hơn. Không nên vì mọi việc có điều kiện mà nói không ai chịu trách nhiệm; cũng không nên dồn cả vấn đề vào một người rồi bỏ những điều kiện khiến lỗi lặp. Với việc gây hại, cần vừa bảo vệ người bị ảnh hưởng, xác định trách nhiệm, vừa sửa môi trường và thói quen nuôi hành vi ấy. Hiểu duyên giúp việc sửa có cơ hội bền.',
      'Họ chưa hết cãi ngay. Khi lại mệt, giọng cũ có thể trở về. Nhưng giờ họ nhận ra sớm hơn, dừng cuộc nói và quay lại khi có thể nghe. Điều kiện được sửa qua nhiều lần, thay vì một lời hứa rằng từ nay sẽ luôn bình an.'
    ],
    'gioi-hanh': [
      'Hổ thẹn trước điều sai có thể là sức bảo vệ khi hướng đến việc không lặp lại tổn hại. Nó khác với ghét bỏ toàn bộ bản thân. Người chỉ thấy mình xấu vĩnh viễn dễ giấu lỗi hoặc bỏ cuộc; người nhận rõ việc sai có thể nói sự thật và sửa. Giới làm tâm nhẹ hơn vì ít cần che giấu, nhưng sự nhẹ ấy thường đến sau những hành động khó như bồi hoàn và chấp nhận hậu quả.',
      'Đồng nghiệp chưa tin Minh ngay. Anh không đòi được tha thứ vì đã xin lỗi. Anh tiếp tục báo rõ số liệu và giữ quy trình kiểm tra qua nhiều tuần, để lòng tin có thời gian được xây lại bằng việc làm.'
    ],
    'chanh-ngu': [
      'Chánh ngữ còn liên hệ sự im lặng có trách nhiệm. Không cần truyền mọi thông tin đúng nếu nó chỉ phơi riêng tư và không giúp gì; nhưng thông tin về nguy cơ cần được chuyển đến người có trách nhiệm bảo vệ. Sự cân nhắc không chỉ xét cảm xúc mình lúc nói, mà cả quyền của người bị nói đến, người nghe và hậu quả sau đó. Độ sâu của lời nằm ở việc có thể giữ sự thật cùng lòng chăm sóc.',
      'Nếu người quản lý từng làm Hào sợ, một lần nói nhẹ chưa đủ đổi quan hệ. Chị cần giữ cách góp ý ấy nhất quán và không dùng điều anh chia sẻ để trách về sau. Lời đúng lúc chỉ phát huy trọn khi được nâng đỡ bởi một môi trường đáng tin.'
    ],
    'duy-ma-bat-nhi': [
      'Một người bệnh không chỉ là thân cần điều trị; họ còn có ký ức, niềm tin, nỗi sợ và quyền được quyết định. Nhìn toàn vẹn giúp bớt chia việc chăm thành vật chất ở một phía, tinh thần ở phía khác. Có khi một cuộc nghe yên làm việc dùng thuốc dễ hơn; có khi giảm đau giúp tâm có thể tiếp nhận sự nâng đỡ. Sự liên hệ này là ứng dụng đời sống, không phải lời định nghĩa thay thế toàn bộ bất nhị trong kinh.',
      'Liên có lúc thấy có lỗi ngay cả khi được nghỉ. Gia đình không tranh luận để ép cô hết cảm giác ấy, mà giữ việc chia ca và nhắc rằng cô có thể được nâng đỡ. Sự hiểu dần đi vào thân qua những đêm được ngủ và những lần không phải gánh một mình.'
    ],
    'long-tu': [
      'Có người từng gây tổn thương khiến việc khởi thiện ý rất khó. Bắt đầu bằng không nuôi thêm ý trả thù có thể đã là một bước vừa sức. Tâm từ không phải màn biểu diễn phải có cảm xúc đẹp ngay; nó là hướng rèn luyện. Có thể giữ xa, xử lý sự việc bằng cách phù hợp và vẫn mong người kia ngừng gây hại. Với chính mình, sự không ép ấy cũng là một hình thức chăm sóc.',
      'Thỉnh thoảng tiếng ồn vẫn làm Hạnh bực. Cô tiếp tục nói rõ điều đã thống nhất thay vì chờ đến khi quá giận. Lòng từ được nuôi trong những lần trao đổi ấy, không cần đợi mọi cảm xúc khó chịu biến mất.'
    ],
    'phat-nguyen': [
      'Lời nguyện còn giúp nhìn vượt một lợi ích ngắn. Khi chọn chân thật dù mất một đơn hàng, người hành trì không chỉ làm theo quy tắc; họ giữ hướng sống mà mình đã phát tâm. Đức tin có thể nâng đỡ lúc kết quả chưa thuận. Tuy vậy, không nên lấy thành công kinh doanh hay trạng thái dễ chịu làm chứng cứ chắc chắn về thành tựu tôn giáo. Ý nghĩa hành trì cần được hiểu đúng trong truyền thống.',
      'Sơn chưa có thu nhập tốt hơn ngay. Anh phải sắp lại chi phí và chịu những ngày lo. Điều giữ anh đi tiếp là không còn cần nói điều sai để bán hàng, cùng sự nâng đỡ của gia đình và người đồng học.'
    ]
  };
  for (const [id, [meaning, life]] of Object.entries(deeper)) {
    essays[id].meaning.push(meaning);
    essays[id].life.paragraphs.push(life);
  }
  for (const track of D.tracks) for (const lesson of track.lessons) {
    const text = essays[lesson.id];
    if (!text) throw new Error('Missing interpretive essay: ' + lesson.id);
    Object.assign(lesson, text);
    lesson.teaching = text.meaning;
    lesson.readMinutes = Math.max(4, Math.ceil([text.why,...text.meaning,...text.life.paragraphs,...text.application,text.takeaway].join(' ').split(/\s+/).length / 150));
  }
  for (const [key, story] of Object.entries(D.narratives)) {
    if (D.sources[story.source]?.study) {
      const study = D.sources[story.source].study;
      (study.narratives ||= []).push(key);
    }
  }
  const profileEssay = {gradual:'giu-nhip',sigala:'sau-phuong',rahula:'gioi-hanh',kalama:'hoc-va-xet',wheel:'bon-su-that',merit:'bo-thi',breathing:'hoi-tho',mindfulness:'niem-xu',notself:'nam-uan',dependent:'duyen-khoi',metta:'long-tu',heart:'tam-kinh',diamond:'kim-cang',lotus:'phuong-tien-nhat-thua',amitabha:'phat-nguyen',larger:'doc-cac-nguyen',contemplation:'ba-phuoc',thought:'hai-huong-tu-duy',effluents:'bay-cach-doan-tru',friendship:'thien-huu',speech:'chanh-ngu',welfare:'doi-song-can-doi',blessings:'diem-lanh',vimalakirti:'duy-ma-bat-nhi',medicine:'duoc-su-ban-nguyen'};
  for (const [source, id] of Object.entries(profileEssay)) {
    const study = D.sources[source].study, text = essays[id];
    study.meaning = text.meaning.map((paragraph, i) => [['Giải nghĩa trong văn cảnh','Ý nghĩa đối với việc tu học','Chiều sâu của sự chuyển hóa'][i], paragraph]);
    study.application = text.application.join(' ');
  }
  D.sources.dhammapada.study.meaning = [
    ['Tâm và hướng của hành động','Những kệ đầu Pháp Cú đặt vai trò của tâm trước lời nói và việc làm. Điều ấy nhắc nhìn ý hướng đang nuôi một hành vi, không có nghĩa người gặp khổ đều do nghĩ sai hoặc có thể đổi mọi hoàn cảnh chỉ bằng suy nghĩ. Thấy tâm sân đang dẫn lời nói giúp dừng trước tổn hại; tâm được nuôi bằng thiện ý giúp việc làm có hướng lành.'],
    ['Học nghĩa của kệ qua cách sống','Các chủ đề không phóng dật, sân, người trí và con đường giúp lời kệ được đọc rộng hơn một câu danh ngôn. Một kệ cần giữ số và bản dịch khi trích. Những chuyện giải thích kệ thuộc lớp chú giải cần được ghi riêng. Khi đọc về không đáp oán bằng oán, có thể thực hành không trả thù mà vẫn bảo vệ sự an toàn và giải quyết việc sai bằng phương cách có trách nhiệm.']
  ];
  const maps = {
    gradual: [
      'Từ hình ảnh học tính toán theo từng bậc, cuộc đối thoại mở sang việc huấn luyện tâm và đời sống. Sự trưởng thành cần những điều kiện nối tiếp, để nền đã vững nâng đỡ phần sâu hơn.',
      'Giới, phòng hộ căn, tiết độ, tỉnh thức và sự tu tập tâm tạo thành một trình tự có liên hệ. Bối cảnh hướng đến người xuất gia; người cư sĩ có thể học tinh thần từng bước và ứng dụng theo trách nhiệm thực tế.',
      'Ví dụ đường đến Rājagaha phân biệt sự chỉ dẫn với việc đi. Giáo pháp mở lối, còn người học tiếp tục bằng thực hành và chịu trách nhiệm với lựa chọn của mình.'
    ],
    sigala: [
      'Việc Thiện Sanh lễ các phương theo lời cha được mở thành cách bảo vệ các quan hệ. Lòng kính hiện diện qua bổn phận và sự chăm sóc, không chỉ qua động tác nghi lễ.',
      'Những hành vi gây hại, động cơ tham sân si sợ và các đường làm tiêu tán nguồn lực khiến đời sống thiếu an ổn. Mạch này chuẩn bị nền cho trách nhiệm với gia đình và cộng đồng.',
      'Sáu phương đặt nghĩa vụ ở cả hai phía trong mỗi quan hệ; phần về bạn hữu giúp nhận sự chân thật qua hành động. Sự tương hỗ làm quan hệ có nền tin cậy.'
    ],
    rahula: [
      'Các hình ảnh nước và dụng cụ đựng nước làm hiện rõ sự rỗng đi của phẩm chất tu hành khi cố ý nói dối mà không thấy điều cần sửa. Chân thật bảo vệ khả năng nhìn chính mình.',
      'Gương trở thành hình ảnh của phản tỉnh: nhận ra tác hại trước hành động và tiếp tục thấy ảnh hưởng trong khi làm. Sự chú ý ấy giúp ý muốn chưa tự động thành tổn hại.',
      'Nhìn lại việc đã làm dẫn đến bày tỏ lỗi về thân hoặc lời, gìn giữ về sau và nuôi niềm vui trong việc thiện. Trọng tâm là chuyển hóa hành vi, không kéo dài sự tự kết án.'
    ],
    kalama: [
      'Người Kālāma gặp những lời dạy cạnh tranh, mỗi bên đề cao mình. Hoàn cảnh ấy đặt niềm tin trong nhu cầu phân biệt điều thật sự đưa đến lợi ích.',
      'Truyền thống, lời truyền, lập luận hay uy tín chưa đủ nếu đứng riêng. Việc xét cần trở về phẩm chất và tác hại, cùng sự nhận định của người có hiểu biết.',
      'Tham, sân và si được soi qua ảnh hưởng của chúng; các phẩm chất ngược lại mở hướng sống ít hại. Sự an ổn trong phần cuối gắn với đạo đức và tâm rộng.'
    ],
    wheel: [
      'Hai cực đoan hưởng dục và tự hành xác được đặt ngoài con đường Trung đạo. Bát chánh đạo nối cách thấy, hành vi và sự rèn tâm thành hướng giải thoát.',
      'Khổ, nguyên nhân khổ, sự diệt và con đường không là bốn khẩu hiệu tách rời. Chúng làm nỗi khổ có thể được hiểu trong nguyên nhân và khả năng chuyển hóa.',
      'Khổ cần hiểu, nguyên nhân cần đoạn, sự diệt cần chứng và con đường cần phát triển. Mỗi sự thật có công việc tương ứng, nên hiểu giáo lý hướng đến thực hành.',
      'Mạch kinh phân biệt nhận biết sự thật, nhiệm vụ đối với nó và sự hoàn thành nhiệm vụ. Biết tên giáo lý chưa đồng nghĩa với hoàn tất sự tu tập.'
    ],
    merit: [
      'Bố thí, giới và tu tập được nêu như ba nền tảng làm phước. Sự rộng lòng, không gây hại và rèn tâm bổ trợ nhau trong một đời sống thiện.',
      'Việc làm phước được đặt trong ý hướng lành của người làm. Một hành động cho đi có chiều sâu khi đi cùng cách kiếm sống, lời nói và tâm được nuôi đúng.',
      'Các danh sách phúc hành dài hơn là sự triển khai trong truyền thống luận giải. Phân biệt lớp văn bản giúp giữ đúng điều bản kinh ngắn nêu và hiểu thêm phần diễn giải.'
    ],
    breathing: [
      'Hội chúng trong kinh đang tu dưỡng nhiều phẩm chất và phương pháp. Niệm hơi thở được trình bày trong một đời sống có nền tu học, thay vì kỹ thuật đứng riêng.',
      'Mười sáu bước được triển khai qua thân, thọ, tâm và pháp. Biết hơi thở, an tịnh, nhận trạng thái tâm và quán vô thường nối sự chú ý ban đầu với chiều sâu buông xả.',
      'Mạch nối niệm hơi thở với bốn niệm xứ và bảy giác chi. Sự tỉnh biết, khảo sát, năng lượng và an tịnh cùng nâng đỡ một tâm trưởng thành.',
      'Phần hướng đến minh và giải thoát giữ mục đích vượt xa sự thư giãn nhất thời. Một buổi thở yên có thể là bước đầu, không tự là toàn bộ thành tựu kinh trình bày.'
    ],
    mindfulness: [
      'Tinh cần, tỉnh giác và chánh niệm được đặt cùng việc bớt tham ưu. Sự quan sát có hướng tu học, không chỉ ghi nhận trải nghiệm một cách vô định.',
      'Thân, thọ, tâm và pháp là bốn lĩnh vực nhận biết. Các cách khảo sát giúp thấy những phần đang vận hành, để cảm xúc không thành một khối cố định mang tên bản thân.',
      'Sinh khởi, đoạn diệt và không chấp thủ tạo điệp khúc xuyên mạch. Nhận biết đi cùng sự thấy thay đổi và bớt nắm giữ trải nghiệm là mình hay của mình.',
      'MN 10 và DN 22 là những bài có quan hệ gần, nhưng phần triển khai không hoàn toàn giống nhau. Mã bài và bản dịch giữ cho việc đối chiếu có vị trí rõ.'
    ],
    notself: [
      'Sắc, thọ, tưởng, hành và thức được khảo sát qua việc không theo sự điều khiển tuyệt đối. Thân tâm có điều kiện và có giới hạn, nên không đáp ứng đòi hỏi phải luôn như ý.',
      'Sự biến đổi của uẩn làm hiện rõ bất toại nguyện khi muốn giữ chúng bất biến. Vô thường và khổ được nối với việc bớt nhận chúng thành tự ngã bền chắc.',
      'Mạch khảo sát mở đến các uẩn trong nhiều thời điểm và phạm vi. Sự thấy rõ hướng đến ly tham và giải thoát, không phải phủ nhận trách nhiệm của con người đang sống.'
    ],
    dependent: [
      'Cuộc đối thoại đặt chánh kiến trong cách thấy thế giới sinh khởi và đoạn diệt. Cách hiểu được nuôi từ quan hệ nhân duyên, thay vì một nhận định cứng về tồn tại.',
      'Hai cực đoan có và không bị vượt qua khi sự nương duyên được thấy. Bớt chấp hai phía giúp không biến hiện tượng thành thực thể bất biến hoặc phủ nhận mọi ý nghĩa.',
      'Mạch duyên khởi và duyên diệt làm khổ có nguyên nhân và có sự tháo gỡ. Sự chuyển hóa được tìm ở những điều kiện đang nuôi khổ và những điều kiện giúp nó dừng.'
    ],
    metta: [
      'Ngay thẳng, mềm hòa, khiêm nhường, biết đủ và tránh việc bị người trí chê tạo nền cho lòng từ. Thiện ý có gốc trong cách sống không gây hại.',
      'Ý hướng an ổn được mở đến các loài, vượt sự thiên vị theo người thích và người không thích. Lòng từ mở rộng phạm vi chăm sóc mà không xóa nhu cầu bảo vệ an toàn.',
      'Đứng, đi, ngồi và nằm trở thành các hoàn cảnh giữ thiện ý khi tỉnh thức. Lòng từ không chỉ thuộc một buổi ngồi, mà có thể tiếp tục trong lời nói và hành động.'
    ],
    dhammapada: [
      'Các bài kệ được tổ chức theo phẩm và số, giúp một lời ngắn có chỗ trong toàn bộ sưu tập. Vị trí rõ bảo vệ ý nghĩa khi một kệ được nhớ và truyền lại.',
      'Những cặp đối chiếu thiện và bất thiện, tỉnh thức và phóng dật làm hậu quả của cách sống hiện rõ. Ngôn ngữ cô đọng hướng người học về phẩm chất đang được nuôi.',
      'Kệ và những tích truyện trong chú giải thuộc các lớp văn bản khác nhau. Chuyện có thể mở nghĩa cho kệ, nhưng nguồn riêng giúp người đọc không nhận chúng là cùng nguyên văn.'
    ],
    heart: [
      'Trí tuệ Bát-nhã soi năm uẩn là không. Sự khảo sát hướng đến bớt giữ thân tâm như một thực thể độc lập, cố định và làm khổ bởi sự nắm giữ ấy.',
      'Sắc và không được trình bày không tách rời. Không không phải một nơi khác ngoài hiện tượng, và cũng không đòi hủy đời sống để thấy trí tuệ.',
      'Các phủ định tháo sự bám vào những phạm trù làm đối tượng chấp. Chúng cần được đọc trong mạch Bát-nhã, không dùng để phủ nhận đạo đức hoặc nỗi đau đang có.',
      'Tâm không bị chướng ngại được đặt cùng sự nương trí tuệ và hướng giác ngộ. Chiều sâu này vượt một cảm giác dễ chịu, đồng thời mở cách chăm sóc bớt chấp thủ.'
    ],
    diamond: [
      'Vấn đề an trụ và điều phục tâm mở cuộc đối thoại. Sự phát tâm cần được nâng đỡ bằng cách sống và sự thấy không bị hình ảnh bản thân trói buộc.',
      'Độ chúng sinh và bố thí đi cùng việc không trụ tướng. Hành động vẫn được thực hiện, nhưng bớt giữ cứng người cho, người nhận và công lao.',
      'Các cách diễn đạt phá chấp làm lộ khoảng cách giữa tên gọi và thực tại. Chúng tháo sự đồng nhất cứng, không biến mọi khái niệm hữu ích thành điều phải phủ nhận.',
      'Hình ảnh quán chiếu ở phần kết nối với mạch phát tâm và không chấp phía trước. Nhìn tính mong manh giúp làm việc lành mà bớt cưỡng giữ kết quả.'
    ],
    lotus: [
      'Bối cảnh hội chúng mở sang sự trình bày phương tiện và nhất thừa. Nhiều cách dẫn dắt được hiểu trong hướng quy về Phật thừa của kinh.',
      'Nhà lửa, cùng tử và những sự thọ ký làm quá trình tiếp nhận giáo pháp hiện qua hình ảnh. Căn cơ khác nhau được nâng đỡ từng bước để mở khả năng giác ngộ.',
      'Phẩm Thọ lượng mở tầm nhìn về Đức Phật trong thế giới tín giải của Pháp Hoa. Nội dung tôn giáo này cần được giữ khi các thí dụ được ứng dụng vào đời sống.',
      'Thường Bất Khinh làm hiện hạnh kính trọng khả năng thành Phật; Phổ Môn trình bày hạnh cứu giúp của Quán Thế Âm. Lòng kính và lòng bi cùng có chỗ trong mạch kinh.'
    ],
    amitabha: [
      'Cảnh giới Cực Lạc và hội chúng được trình bày như nơi tu học trong đức tin Tịnh độ. Những mô tả này có ý nghĩa tôn giáo, không chỉ là cảnh đẹp để tưởng tượng.',
      'Phát nguyện sinh về cõi Phật và chấp trì danh hiệu tạo trọng tâm hành trì. Tín, nguyện và hành được các truyền thống giải thích với những nhấn mạnh riêng.',
      'Sự khuyến tín và lưu thông nối lời dạy với cộng đồng tiếp nhận. Bản ngắn cần được hiểu theo mạch của chính nó, không tự thêm toàn bộ nội dung hai kinh Tịnh độ còn lại.'
    ],
    larger: [
      'Hạnh của Pháp Tạng và sự phát nguyện mở lý tưởng thành tựu cõi Phật vì chúng sinh. Lời nguyện không chỉ hướng đến an ổn riêng.',
      'Các nguyện trong bản T360 liên hệ điều kiện sống, tu học và giác ngộ. Chi tiết và số lượng cần được giữ theo bản đang đọc khi đối chiếu các truyền thừa.',
      'Cảnh giới thành tựu và lời khuyến tu nối bản nguyện với con đường người hành trì. Đức tin được nuôi cùng cách sống thiện và sự hướng tâm theo truyền thống.'
    ],
    contemplation: [
      'Hoàn cảnh đau khổ của Vi Đề Hy mở nhu cầu tìm nơi nương và con đường tu. Bối cảnh ấy giúp lời dạy được đọc gần với khổ thực của một con người.',
      'Ba phước đặt nền đạo đức và phát tâm trước các phép quán. Các đối tượng và trình tự quán thuộc hệ thống hành trì có truyền thống hướng dẫn.',
      'Chín phẩm trình bày những trường hợp tiếp nhận trong văn cảnh Tịnh độ. Chúng cần được học theo bản và nguồn giảng, không rút thành thước đo chấm người khác.'
    ],
    thought: [
      'Dục, sân và hại được phân biệt với xuất ly, vô sân và bất hại. Ý nghĩ được thấy qua điều nó nuôi trong tâm và hậu quả nó dẫn tới.',
      'Suy nghĩ thường được nuôi sẽ làm tâm nghiêng theo hướng ấy. Việc dừng cấp chất liệu cho sân và hại giúp lời nói, hành động có cơ hội đổi hướng.',
      'Suy nghĩ thiện cũng có lúc cần lắng xuống để thân tâm bớt mệt. Sự an tịnh và định được nuôi khi việc rèn tâm không chỉ tiếp tục bằng suy luận.'
    ],
    effluents: [
      'Tác ý đúng hướng phục vụ việc hiểu khổ và đoạn những khuynh hướng trói buộc. Chú ý đặt sai hướng có thể nuôi thêm quan kiến và lậu hoặc.',
      'Thấy biết, phòng hộ, thọ dụng, kham nhẫn, tránh né, trừ bỏ và tu tập đáp ứng những điều kiện khác nhau. Bài kinh không chỉ đề cao một kỹ thuật duy nhất.',
      'Các phương cách làm hiện rõ sự cần thiết của lựa chọn phù hợp. Kham nhẫn không loại trừ tránh nguy hiểm; rèn tâm đi cùng chăm môi trường và cách sử dụng những điều cần thiết.'
    ],
    speech: [
      'Vương tử đến với một thế đối thoại định làm người đáp mắc kẹt. Đức Phật đưa sự xét lời về lợi ích, sự thật và lòng thương, vượt nhu cầu thắng cuộc tranh luận.',
      'Ví dụ vật nguy hiểm trong miệng đứa trẻ làm trách nhiệm chăm sóc hiện rõ. Đó là ví dụ giả định trong cuộc đối thoại, không phải một sự cố được kể là đã xảy ra.',
      'Lời thật và có lợi vẫn cần thời điểm thích hợp, dù dễ nghe hay khó nghe. Chánh ngữ hướng đến sự giảm khổ, không dùng sự thật như cớ làm nhục.'
    ],
    welfare: [
      'Người cư sĩ có gia đình và tài sản tìm lời dạy cho lợi ích hiện tại và về sau. Trách nhiệm đời thường được đưa vào mạch tu học.',
      'Siêng năng, bảo vệ tài sản, bạn lành và sống cân đối nâng đỡ sự an ổn hiện tại. Năng lực làm việc đi cùng cách dùng nguồn lực và quan hệ đáng tin.',
      'Tín, giới, thí và tuệ mở chiều hướng lâu dài. Thành công vật chất không thay các phẩm chất ấy; việc đời và sự tu cần cùng được chăm.'
    ],
    blessings: [
      'Gần người trí, kính người đáng kính, có môi trường phù hợp và học kỹ năng giúp đời sống có nền. Điều lành có thể được vun bồi bằng lựa chọn hằng ngày.',
      'Chăm gia đình, sinh kế phù hợp và sống thiện nối phẩm chất với trách nhiệm. Sự lành không chỉ là niềm tin về dấu hiệu may mắn.',
      'Nhẫn nại, học pháp, thực hành và tâm vững trước pháp thế gian mở chiều sâu của kinh. Mạch ấy vượt một danh sách mẹo sống thành công.'
    ],
    friendship: [
      'Nhận định của Ānanda về vai trò bạn lành mở cuộc đối thoại. Đức Phật nhấn mạnh tầm quan trọng sâu hơn của thiện hữu trong đời sống phạm hạnh.',
      'Thiện hữu được đặt với toàn bộ đời sống tu vì nâng đỡ sự phát triển con đường. Quan hệ lành giúp điều thiện có điều kiện lớn lên.',
      'Bát chánh đạo làm rõ hướng của sự nâng đỡ: cách thấy, lời nói, hành vi và rèn tâm. Bạn lành không chỉ cho cảm giác đồng tình mà giúp sống có trách nhiệm.'
    ],
    vimalakirti: [
      'Nhân vật cư sĩ và những cuộc đối thoại mở giáo pháp Đại thừa trong đời sống. Trí tuệ và phương tiện được trình bày qua các tình huống phá sự chấp cứng.',
      'Cuộc thăm bệnh nối lòng đại bi với khổ của chúng sinh. Sự chăm sóc trở thành nơi giáo pháp được gặp, không chỉ một việc bên ngoài đời tu.',
      'Phẩm bất nhị tháo sự bám vào hai phía và mở cách thấy vượt phân biệt trói buộc. Chiều sâu ấy không được dùng để xóa trách nhiệm với hành vi đúng sai.'
    ],
    medicine: [
      'T450 là bản Hán gắn với Huyền Trang trong hệ thống tham chiếu đang dùng. Nhận đúng bản giúp các nguyện và nghi thức được học có xuất xứ.',
      'Mười hai nguyện mở lý tưởng nâng đỡ thân, tâm, điều kiện sống và sự giác ngộ. Lòng bi được hiểu rộng hơn một lời hứa chữa bệnh.',
      'Phần hành trì có ý nghĩa trong đức tin và nghi lễ của truyền thống. Sự nâng đỡ tinh thần cần đi cùng chăm sóc thực tế, không thay việc điều trị cần thiết.'
    ]
  };
  for(const [key, texts] of Object.entries(maps)) {
    const study=D.sources[key].study;
    if(texts.length!==study.map.length)throw new Error('Scripture map mismatch: '+key);
    study.map=study.map.map(([title],i)=>[title,texts[i]]);
  }
  D.sources.gradual.study.map[0][0]='Sự huấn luyện theo từng bước';
  D.sources.dependent.study.map[0][0]='Chánh kiến trong đối thoại';
  D.sources.diamond.study.map[0][0]='An trụ và điều phục tâm';
  D.sources.speech.study.map[0][0]='Cuộc đối thoại với vương tử';
  D.sources.welfare.study.map[0][0]='Đời sống của người cư sĩ';
  D.sources.merit.study.map[1][0]='Phước trong mạch tu tập';
  D.version = 3;
})();
