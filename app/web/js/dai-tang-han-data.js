/**
 * Đại Tạng Kinh Hán Tạng (25 Bộ - 2.471 Văn Bản · 1.109 Bản Dịch Việt)
 * Đã chuẩn hóa và bổ sung tiêu đề Tiếng Việt (vietTitle) cho toàn bộ 2.471 văn bản kinh điển.
 */
const DAI_TANG_HAN_DATA = {
  "divisions": [
    {
      "code": "01",
      "name": "A Hàm bộ",
      "hanName": "阿含部",
      "total": 155,
      "hasViet": 144,
      "folderName": "01_A_Ham"
    },
    {
      "code": "02",
      "name": "Bản Duyên bộ",
      "hanName": "本緣部",
      "total": 72,
      "hasViet": 67,
      "folderName": "02_Ban_Duyen"
    },
    {
      "code": "03",
      "name": "Bát Nhã bộ",
      "hanName": "般若部",
      "total": 57,
      "hasViet": 42,
      "folderName": "03_Bat_Nha"
    },
    {
      "code": "04",
      "name": "Pháp Hoa bộ",
      "hanName": "法華部",
      "total": 16,
      "hasViet": 16,
      "folderName": "04_Phap_Hoa"
    },
    {
      "code": "05",
      "name": "Hoa Nghiêm bộ",
      "hanName": "華嚴部",
      "total": 32,
      "hasViet": 32,
      "folderName": "05_Hoa_Nghiem"
    },
    {
      "code": "06",
      "name": "Bảo Tích bộ",
      "hanName": "寶積部",
      "total": 65,
      "hasViet": 57,
      "folderName": "06_Bao_Tich"
    },
    {
      "code": "07",
      "name": "Niết Bàn bộ",
      "hanName": "涅槃部",
      "total": 23,
      "hasViet": 23,
      "folderName": "07_Niet_Ban"
    },
    {
      "code": "08",
      "name": "Đại Tập bộ",
      "hanName": "大集部",
      "total": 28,
      "hasViet": 28,
      "folderName": "08_Dai_Tap"
    },
    {
      "code": "09",
      "name": "Kinh Tập bộ",
      "hanName": "經集部",
      "total": 433,
      "hasViet": 398,
      "folderName": "09_Kinh_Tap"
    },
    {
      "code": "10",
      "name": "Mật giáo bộ",
      "hanName": "密教部",
      "total": 614,
      "hasViet": 2,
      "folderName": "10_Mat_Giao"
    },
    {
      "code": "11",
      "name": "Luật bộ",
      "hanName": "律部",
      "total": 87,
      "hasViet": 84,
      "folderName": "11_Luat"
    },
    {
      "code": "12",
      "name": "Thích Kinh Luận bộ",
      "hanName": "釋經論部",
      "total": 32,
      "hasViet": 31,
      "folderName": "12_Thich_Kinh_Luan"
    },
    {
      "code": "13",
      "name": "Tỳ Đàm bộ",
      "hanName": "毘曇部",
      "total": 28,
      "hasViet": 28,
      "folderName": "13_Ty_Dam"
    },
    {
      "code": "14",
      "name": "Trung Quán bộ",
      "hanName": "中觀部",
      "total": 15,
      "hasViet": 15,
      "folderName": "14_Trung_Quan"
    },
    {
      "code": "15",
      "name": "Du Già bộ",
      "hanName": "瑜伽部",
      "total": 49,
      "hasViet": 49,
      "folderName": "15_Du_Gia"
    },
    {
      "code": "16",
      "name": "Luận Tập bộ",
      "hanName": "論集部",
      "total": 66,
      "hasViet": 64,
      "folderName": "16_Luan_Tap"
    },
    {
      "code": "17",
      "name": "Kinh Sớ bộ",
      "hanName": "經疏部",
      "total": 111,
      "hasViet": 0,
      "folderName": "17_Kinh_So"
    },
    {
      "code": "18",
      "name": "Luật Sớ bộ",
      "hanName": "律疏部",
      "total": 12,
      "hasViet": 0,
      "folderName": "18_Luat_So"
    },
    {
      "code": "19",
      "name": "Luận Sớ bộ",
      "hanName": "論疏部",
      "total": 35,
      "hasViet": 0,
      "folderName": "19_Luan_So"
    },
    {
      "code": "20",
      "name": "Chư Tông bộ",
      "hanName": "諸宗部",
      "total": 185,
      "hasViet": 0,
      "folderName": "20_Chu_Tong"
    },
    {
      "code": "21",
      "name": "Sử Truyện bộ",
      "hanName": "史傳部",
      "total": 96,
      "hasViet": 0,
      "folderName": "21_Su_Truyen"
    },
    {
      "code": "22",
      "name": "Sự Vị bộ",
      "hanName": "事彙部",
      "total": 17,
      "hasViet": 0,
      "folderName": "22_Su_Vi"
    },
    {
      "code": "23",
      "name": "Ngoại Giáo bộ",
      "hanName": "外教部",
      "total": 9,
      "hasViet": 0,
      "folderName": "23_Ngoai_Giao"
    },
    {
      "code": "24",
      "name": "Mục Lục bộ",
      "hanName": "目錄部",
      "total": 42,
      "hasViet": 0,
      "folderName": "24_Muc_Luc"
    },
    {
      "code": "25",
      "name": "Cổ Dật & Nghi Tợ bộ",
      "hanName": "古逸+疑似部",
      "total": 192,
      "hasViet": 0,
      "folderName": "25_Co_Dat_Nghi_Toi"
    }
  ],
  "texts": [
    {
      "id": "T01n0001",
      "title": "長阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0001.md",
      "nikayaNote": "Trường A-Hàm Kinh (Dīgha Āgama) — Tương đương Trường Bộ Kinh (Dīgha Nikāya, DN 1 - 34)",
      "vietTitle": "Kinh Trường A-Hàm"
    },
    {
      "id": "T01n0002",
      "title": "七佛經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0002_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0002.md",
      "vietTitle": "Kinh Thất Phật"
    },
    {
      "id": "T01n0003",
      "title": "毘婆尸佛經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0003_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0003.md",
      "vietTitle": "Kinh Tỳ Bà Thi Phật"
    },
    {
      "id": "T01n0004",
      "title": "七佛父母姓字經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0004_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0004.md",
      "vietTitle": "Kinh Thất Phật Phụ Mẫu Tính Tự"
    },
    {
      "id": "T01n0005",
      "title": "佛般泥洹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0005_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0005.md",
      "vietTitle": "Kinh Phật Bát Nê Hoàn"
    },
    {
      "id": "T01n0006",
      "title": "般泥洹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0006_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0006.md",
      "vietTitle": "Kinh Bát Nê Hoàn"
    },
    {
      "id": "T01n0007",
      "title": "大般涅槃經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0007_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0007.md",
      "vietTitle": "Kinh Đại Bát Niết Bàn"
    },
    {
      "id": "T01n0008",
      "title": "大堅固婆羅門緣起經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0008_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0008.md",
      "vietTitle": "Kinh Đại Kiên Cố Bà La Môn Duyên Khởi"
    },
    {
      "id": "T01n0009",
      "title": "人仙經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0009_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0009.md",
      "vietTitle": "Kinh Nhân Tiên"
    },
    {
      "id": "T01n0010",
      "title": "白衣金幢二婆羅門緣起經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0010_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0010.md",
      "vietTitle": "Kinh Bạch Y Kim Tràng Nhị Bà La Môn Duyên Khởi"
    },
    {
      "id": "T01n0011",
      "title": "尼拘陀梵志經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0011_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0011.md",
      "vietTitle": "Kinh Ni Câu Đà Phạm Chí"
    },
    {
      "id": "T01n0012",
      "title": "大集法門經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0012_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0012.md",
      "vietTitle": "Kinh Đại Tập Pháp Môn"
    },
    {
      "id": "T01n0013",
      "title": "長阿含十報法經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0013_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0013.md",
      "vietTitle": "Kinh Trường A Hàm Thập Báo Pháp"
    },
    {
      "id": "T01n0014",
      "title": "人本欲生經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0014_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0014.md",
      "vietTitle": "Kinh Nhân Bản Dục Sinh"
    },
    {
      "id": "T01n0015",
      "title": "帝釋所問經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0015_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0015.md",
      "vietTitle": "Kinh Đế Thích Sở Vấn"
    },
    {
      "id": "T01n0016",
      "title": "尸迦羅越六方禮經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0016_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0016.md",
      "nikayaNote": "Thi-ca-la-việt Lục Phương Lễ Kinh — Tương đương Sigālovāda Sutta (Kinh Giáo Giới Thi-ca-la-việt, DN 31)",
      "vietTitle": "Kinh Thi Ca La Việt Lục Phương Lễ"
    },
    {
      "id": "T01n0017",
      "title": "善生子經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0017_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0017.md",
      "nikayaNote": "Thiện Sanh Tử Kinh — Dị bản tương đương Sigālovāda Sutta (DN 31)",
      "vietTitle": "Kinh Thiện Sinh Tử"
    },
    {
      "id": "T01n0018",
      "title": "信佛功德經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0018_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0018.md",
      "vietTitle": "Kinh Tín Phật Công Đức"
    },
    {
      "id": "T01n0019",
      "title": "大三摩惹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0019_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0019.md",
      "vietTitle": "Kinh Đại Tam Ma Nhạ"
    },
    {
      "id": "T01n0020",
      "title": "佛開解梵志阿颰經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0020_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0020.md",
      "vietTitle": "Kinh Phật Khai Giải Phạm Chí A Bạt"
    },
    {
      "id": "T01n0021",
      "title": "梵網六十二見經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0021_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0021.md",
      "vietTitle": "Kinh Phạm Võng Lục Thập Nhị Kiến"
    },
    {
      "id": "T01n0022",
      "title": "寂志果經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0022_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0022.md",
      "vietTitle": "Kinh Tịch Chí Quả"
    },
    {
      "id": "T01n0023",
      "title": "大樓炭經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0023_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0023.md",
      "vietTitle": "Kinh Đại Lâu Thán"
    },
    {
      "id": "T01n0024",
      "title": "起世經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0024_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0024.md",
      "vietTitle": "Kinh Khởi Thế"
    },
    {
      "id": "T01n0025",
      "title": "起世因本經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0025_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0025.md",
      "vietTitle": "Kinh Khởi Thế Nhân Bản"
    },
    {
      "id": "T01n0026",
      "title": "中阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0026_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0026.md",
      "nikayaNote": "Trung A-Hàm Kinh (Majjhima Āgama) — Tương đương Trung Bộ Kinh (Majjhima Nikāya, MN 1 - 152)",
      "vietTitle": "Kinh Trung A-Hàm"
    },
    {
      "id": "T01n0027",
      "title": "七知經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0027_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0027.md",
      "vietTitle": "Kinh Thất Tri"
    },
    {
      "id": "T01n0028",
      "title": "園生樹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0028_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0028.md",
      "vietTitle": "Kinh Viên Sinh Thụ"
    },
    {
      "id": "T01n0029",
      "title": "鹹水喻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0029_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0029.md",
      "vietTitle": "Kinh Hàm Thủy Dụ"
    },
    {
      "id": "T01n0030",
      "title": "薩鉢多酥哩踰捺野經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0030_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0030.md",
      "vietTitle": "Kinh Tát Bát Đa Tô Rỉ Du Nại Dã"
    },
    {
      "id": "T01n0031",
      "title": "一切流攝守因經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0031_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0031.md",
      "vietTitle": "Kinh Nhất Thiết Lưu Nhiếp Thủ Nhân"
    },
    {
      "id": "T01n0032",
      "title": "四諦經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0032_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0032.md",
      "vietTitle": "Kinh Tứ Đế"
    },
    {
      "id": "T01n0033",
      "title": "恒水經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0033_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0033.md",
      "vietTitle": "Kinh Hằng Thủy"
    },
    {
      "id": "T01n0034",
      "title": "法海經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0034.md",
      "vietTitle": "Kinh Pháp Hải"
    },
    {
      "id": "T01n0035",
      "title": "海八德經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0035_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0035.md",
      "vietTitle": "Kinh Hải Bát Đức"
    },
    {
      "id": "T01n0036",
      "title": "本相猗致經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0036_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0036.md",
      "vietTitle": "Kinh Bản Tướng Y Trí"
    },
    {
      "id": "T01n0037",
      "title": "緣本致經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0037_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0037.md",
      "vietTitle": "Kinh Duyên Bản Trí"
    },
    {
      "id": "T01n0038",
      "title": "輪王七寶經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0038_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0038.md",
      "vietTitle": "Kinh Luân Vương Thất Bảo"
    },
    {
      "id": "T01n0039",
      "title": "頂生王故事經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0039_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0039.md",
      "vietTitle": "Kinh Đính Sinh Vương Cố Sự"
    },
    {
      "id": "T01n0040",
      "title": "文陀竭王經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0040_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0040.md",
      "vietTitle": "Kinh Văn Đà Kiệt Vương"
    },
    {
      "id": "T01n0041",
      "title": "頻婆娑羅王經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0041_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0041.md",
      "vietTitle": "Kinh Tần Bà Bà La Vương"
    },
    {
      "id": "T01n0042",
      "title": "鐵城泥犁經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0042_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0042.md",
      "vietTitle": "Kinh Thiết Thành Nê Lê"
    },
    {
      "id": "T01n0043",
      "title": "閻羅王五天使者經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0043_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0043.md",
      "vietTitle": "Kinh Diêm La Vương Ngũ Thiên Sứ Giả"
    },
    {
      "id": "T01n0044",
      "title": "古來世時經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0044_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0044.md",
      "vietTitle": "Kinh Cổ Lai Thế Thời"
    },
    {
      "id": "T01n0045",
      "title": "大正句王經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0045_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0045.md",
      "vietTitle": "Kinh Đại Chánh Cú Vương"
    },
    {
      "id": "T01n0046",
      "title": "阿那律八念經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0046_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0046.md",
      "vietTitle": "Kinh A Na Luật Bát Niệm"
    },
    {
      "id": "T01n0047",
      "title": "離睡經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0047_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0047.md",
      "vietTitle": "Kinh Li Thụy"
    },
    {
      "id": "T01n0048",
      "title": "是法非法經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0048_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0048.md",
      "vietTitle": "Kinh Thị Pháp Phi Pháp"
    },
    {
      "id": "T01n0049",
      "title": "求欲經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0049_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0049.md",
      "vietTitle": "Kinh Cầu Dục"
    },
    {
      "id": "T01n0050",
      "title": "受歲經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0050_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0050.md",
      "vietTitle": "Kinh Thọ Tuế"
    },
    {
      "id": "T01n0051",
      "title": "梵志計水淨經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0051_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0051.md",
      "vietTitle": "Kinh Phạm Chí Kế Thủy Tịnh"
    },
    {
      "id": "T01n0052",
      "title": "大生義經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0052_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0052.md",
      "vietTitle": "Kinh Đại Sinh Nghĩa"
    },
    {
      "id": "T01n0053",
      "title": "苦陰經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0053_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0053.md",
      "vietTitle": "Kinh Khổ Âm"
    },
    {
      "id": "T01n0054",
      "title": "釋摩男本四子經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0054_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0054.md",
      "vietTitle": "Kinh Thích Ma Nam Bản Tứ Tử"
    },
    {
      "id": "T01n0055",
      "title": "苦陰因事經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0055_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0055.md",
      "vietTitle": "Kinh Khổ Âm Nhân Sự"
    },
    {
      "id": "T01n0056",
      "title": "樂想經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0056_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0056.md",
      "vietTitle": "Kinh Lạc Tưởng"
    },
    {
      "id": "T01n0057",
      "title": "漏分布經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0057_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0057.md",
      "vietTitle": "Kinh Lậu Phân Bố"
    },
    {
      "id": "T01n0058",
      "title": "阿耨風經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0058_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0058.md",
      "vietTitle": "Kinh A Nậu Phong"
    },
    {
      "id": "T01n0059",
      "title": "諸法本經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0059_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0059.md",
      "vietTitle": "Kinh Chư Pháp Bản"
    },
    {
      "id": "T01n0060",
      "title": "瞿曇彌記果經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0060_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0060.md",
      "vietTitle": "Kinh Cù Đàm Di Kí Quả"
    },
    {
      "id": "T01n0061",
      "title": "受新歲經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0061_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0061.md",
      "vietTitle": "Kinh Thọ Tân Tuế"
    },
    {
      "id": "T01n0062",
      "title": "新歲經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0062_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0062.md",
      "vietTitle": "Kinh Tân Tuế"
    },
    {
      "id": "T01n0063",
      "title": "解夏經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0063_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0063.md",
      "vietTitle": "Kinh Giải Hạ"
    },
    {
      "id": "T01n0064",
      "title": "瞻婆比丘經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0064_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0064.md",
      "vietTitle": "Kinh Chiêm Bà Tỳ Kheo"
    },
    {
      "id": "T01n0065",
      "title": "伏婬經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0065_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0065.md",
      "vietTitle": "Kinh Phục Dâm"
    },
    {
      "id": "T01n0066",
      "title": "魔嬈亂經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0066_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0066.md",
      "vietTitle": "Kinh Ma Nhiêu Loạn"
    },
    {
      "id": "T01n0067",
      "title": "弊魔試目連經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0067_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0067.md",
      "vietTitle": "Kinh Tệ Ma Thí Mục Liên"
    },
    {
      "id": "T01n0068",
      "title": "賴吒和羅經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0068_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0068.md",
      "vietTitle": "Kinh Lại Trá Hòa La"
    },
    {
      "id": "T01n0069",
      "title": "護國經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0069_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0069.md",
      "vietTitle": "Kinh Hộ Quốc"
    },
    {
      "id": "T01n0070",
      "title": "數經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0070_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0070.md",
      "vietTitle": "Kinh Sổ"
    },
    {
      "id": "T01n0071",
      "title": "梵志頞波羅延問種尊經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0071_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0071.md",
      "vietTitle": "Kinh Phạm Chí Át Ba La Diên Vấn Chủng Tôn"
    },
    {
      "id": "T01n0072",
      "title": "三歸五戒慈心厭離功德經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0072_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0072.md",
      "vietTitle": "Kinh Tam Quy Ngũ Giới Từ Tâm Yếm Li Công Đức"
    },
    {
      "id": "T01n0073",
      "title": "須達經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0073_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0073.md",
      "vietTitle": "Kinh Tu Đạt"
    },
    {
      "id": "T01n0074",
      "title": "長者施報經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0074_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0074.md",
      "vietTitle": "Kinh Trường Giả Thí Báo"
    },
    {
      "id": "T01n0075",
      "title": "佛為黃竹園老婆羅門說學經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0075_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0075.md",
      "vietTitle": "Kinh Phật Vi Hoàng Trúc Viên Lão Bà La Môn Thuyết Học"
    },
    {
      "id": "T01n0076",
      "title": "梵摩渝經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0076_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0076.md",
      "vietTitle": "Kinh Phạm Ma Du"
    },
    {
      "id": "T01n0077",
      "title": "尊上經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0077_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0077.md",
      "vietTitle": "Kinh Tôn Thượng"
    },
    {
      "id": "T01n0078",
      "title": "兜調經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0078_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0078.md",
      "vietTitle": "Kinh Đâu Điều"
    },
    {
      "id": "T01n0079",
      "title": "鸚鵡經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0079_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0079.md",
      "vietTitle": "Kinh Anh Vũ"
    },
    {
      "id": "T01n0080",
      "title": "佛為首迦長者說業報差別經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0080_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0080.md",
      "vietTitle": "Kinh Phật Vi Thủ Ca Trường Giả Thuyết Nghiệp Báo Sai Biệt"
    },
    {
      "id": "T01n0081",
      "title": "分別善惡報應經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0081_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0081.md",
      "vietTitle": "Kinh Phân Biệt Thiện Ác Báo Ứng"
    },
    {
      "id": "T01n0082",
      "title": "意經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0082_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0082.md",
      "vietTitle": "Kinh Ý"
    },
    {
      "id": "T01n0083",
      "title": "應法經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0083_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0083.md",
      "vietTitle": "Kinh Ứng Pháp"
    },
    {
      "id": "T01n0084",
      "title": "分別布施經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0084_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0084.md",
      "vietTitle": "Kinh Phân Biệt Bố Thí"
    },
    {
      "id": "T01n0085",
      "title": "息諍因緣經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0085_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0085.md",
      "vietTitle": "Kinh Tức Tránh Nhân Duyên"
    },
    {
      "id": "T01n0086",
      "title": "泥犁經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0086_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0086.md",
      "vietTitle": "Kinh Nê Lê"
    },
    {
      "id": "T01n0087",
      "title": "齋經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0087_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0087.md",
      "vietTitle": "Kinh Trai"
    },
    {
      "id": "T01n0088",
      "title": "優陂夷墮舍迦經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0088_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0088.md",
      "vietTitle": "Kinh Ưu Bi Di Đọa Xá Ca"
    },
    {
      "id": "T01n0089",
      "title": "八關齋經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0089_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0089.md",
      "vietTitle": "Kinh Bát Quan Trai"
    },
    {
      "id": "T01n0090",
      "title": "鞞摩肅經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0090_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0090.md",
      "vietTitle": "Kinh Bệ Ma Túc"
    },
    {
      "id": "T01n0091",
      "title": "婆羅門子命終愛念不離經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0091_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0091.md",
      "vietTitle": "Kinh Bà La Môn Tử Mạng Chung Ái Niệm Bất Li"
    },
    {
      "id": "T01n0092",
      "title": "十支居士八城人經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0092_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0092.md",
      "vietTitle": "Kinh Thập Chi Cư Sĩ Bát Thành Nhân"
    },
    {
      "id": "T01n0093",
      "title": "邪見經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0093_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0093.md",
      "vietTitle": "Kinh Tà Kiến"
    },
    {
      "id": "T01n0094",
      "title": "箭喻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0094_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0094.md",
      "vietTitle": "Kinh Tiễn Dụ"
    },
    {
      "id": "T01n0095",
      "title": "蟻喻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0095_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0095.md",
      "vietTitle": "Kinh Nghĩ Dụ"
    },
    {
      "id": "T01n0096",
      "title": "治意經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0096_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0096.md",
      "vietTitle": "Kinh Trị Ý"
    },
    {
      "id": "T01n0097",
      "title": "廣義法門經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0097_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0097.md",
      "vietTitle": "Kinh Quảng Nghĩa Pháp Môn"
    },
    {
      "id": "T01n0098",
      "title": "普法義經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0098_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T01n0098.md",
      "vietTitle": "Kinh Phổ Pháp Nghĩa"
    },
    {
      "id": "T02n0099",
      "title": "雜阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0099_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0099.md",
      "nikayaNote": "Tạp A-Hàm Kinh (Saṃyukta Āgama) — Tương đương Tương Ưng Bộ Kinh (Saṃyutta Nikāya, SN)",
      "vietTitle": "Kinh Tạp A-Hàm"
    },
    {
      "id": "T02n0100",
      "title": "別譯雜阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0100_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0100.md",
      "nikayaNote": "Biệt Dịch Tạp A-Hàm Kinh — Tương đương các thiên Tương Ưng Bộ Kinh",
      "vietTitle": "Kinh Biệt Dịch Tạp A-Hàm"
    },
    {
      "id": "T02n0101",
      "title": "雜阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0101_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0101.md",
      "vietTitle": "Kinh Tạp A Hàm"
    },
    {
      "id": "T02n0102",
      "title": "佛說五蘊皆空經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0102_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0102.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Uẩn Giai Không"
    },
    {
      "id": "T02n0103",
      "title": "佛說聖法印經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0103_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0103.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Pháp Ấn"
    },
    {
      "id": "T02n0104",
      "title": "佛說法印經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0104_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0104.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Ấn"
    },
    {
      "id": "T02n0105",
      "title": "五陰譬喻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0105_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0105.md",
      "vietTitle": "Kinh Ngũ Âm Thí Dụ"
    },
    {
      "id": "T02n0106",
      "title": "佛說水沫所漂經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0106_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0106.md",
      "vietTitle": "Kinh Phật Thuyết Thủy Mạt Sở Phiêu"
    },
    {
      "id": "T02n0107",
      "title": "佛說不自守意經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0107_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0107.md",
      "vietTitle": "Kinh Phật Thuyết Bất Tự Thủ Ý"
    },
    {
      "id": "T02n0108",
      "title": "佛說滿願子經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0108_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0108.md",
      "vietTitle": "Kinh Phật Thuyết Mãn Nguyện Tử"
    },
    {
      "id": "T02n0109",
      "title": "佛說轉法輪經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0109_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0109.md",
      "vietTitle": "Kinh Phật Thuyết Chuyển Pháp Luân"
    },
    {
      "id": "T02n0110",
      "title": "佛說三轉法輪經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0110_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0110.md",
      "vietTitle": "Kinh Phật Thuyết Tam Chuyển Pháp Luân"
    },
    {
      "id": "T02n0111",
      "title": "佛說相應相可經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0111_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0111.md",
      "vietTitle": "Kinh Phật Thuyết Tướng Ứng Tướng Khả"
    },
    {
      "id": "T02n0112",
      "title": "佛說八正道經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0112_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0112.md",
      "vietTitle": "Kinh Phật Thuyết Bát Chánh Đạo"
    },
    {
      "id": "T02n0113",
      "title": "佛說難提釋經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0113_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0113.md",
      "vietTitle": "Kinh Phật Thuyết Nan Đề Thích"
    },
    {
      "id": "T02n0114",
      "title": "佛說馬有三相經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0114_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0114.md",
      "vietTitle": "Kinh Phật Thuyết Mã Hữu Tam Tướng"
    },
    {
      "id": "T02n0115",
      "title": "佛說馬有八態譬人經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0115_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0115.md",
      "vietTitle": "Kinh Phật Thuyết Mã Hữu Bát Thái Thí Nhân"
    },
    {
      "id": "T02n0116",
      "title": "佛說戒德香經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0116_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0116.md",
      "vietTitle": "Kinh Phật Thuyết Giới Đức Hương"
    },
    {
      "id": "T02n0117",
      "title": "佛說戒香經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0117_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0117.md",
      "vietTitle": "Kinh Phật Thuyết Giới Hương"
    },
    {
      "id": "T02n0118",
      "title": "佛說鴦掘摩經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0118_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0118.md",
      "vietTitle": "Kinh Phật Thuyết Ương Quật Ma"
    },
    {
      "id": "T02n0119",
      "title": "佛說鴦崛髻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0119_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0119.md",
      "vietTitle": "Kinh Phật Thuyết Ương Quật Kế"
    },
    {
      "id": "T02n0120",
      "title": "央掘魔羅經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0120_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0120.md",
      "vietTitle": "Kinh Ương Quật Ma La"
    },
    {
      "id": "T02n0121",
      "title": "佛說月喻經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0121_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0121.md",
      "vietTitle": "Kinh Phật Thuyết Nguyệt Dụ"
    },
    {
      "id": "T02n0122",
      "title": "佛說波斯匿王太后崩塵土坌身經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0122_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0122.md",
      "vietTitle": "Kinh Phật Thuyết Ba Tư Nặc Vương Thái Hậu Băng Trần Thổ Bộn Thân"
    },
    {
      "id": "T02n0123",
      "title": "佛說放牛經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0123_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0123.md",
      "vietTitle": "Kinh Phật Thuyết Phóng Ngưu"
    },
    {
      "id": "T02n0124",
      "title": "緣起經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0124_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0124.md",
      "vietTitle": "Kinh Duyên Khởi"
    },
    {
      "id": "T02n0125",
      "title": "增壹阿含經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0125_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0125.md",
      "nikayaNote": "Tăng Nhất A-Hàm Kinh (Ekottara Āgama) — Tương đương Tăng Chi Bộ Kinh (Aṅguttara Nikāya, AN)",
      "vietTitle": "Kinh Tăng Nhất A-Hàm"
    },
    {
      "id": "T02n0126",
      "title": "佛說阿羅漢具德經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0126_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0126.md",
      "vietTitle": "Kinh Phật Thuyết A La Hán Cụ Đức"
    },
    {
      "id": "T02n0127",
      "title": "佛說四人出現世間經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0127_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0127.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Nhân Xuất Hiện Thế Gian"
    },
    {
      "id": "T02n0128a",
      "title": "須摩提女經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0128a.md",
      "vietTitle": "Kinh Tu Ma Đề Nữ"
    },
    {
      "id": "T02n0128b",
      "title": "須摩提女經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0128b.md",
      "vietTitle": "Kinh Tu Ma Đề Nữ"
    },
    {
      "id": "T02n0129",
      "title": "佛說三摩竭經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0129_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0129.md",
      "vietTitle": "Kinh Phật Thuyết Tam Ma Kiệt"
    },
    {
      "id": "T02n0130",
      "title": "佛說給孤長者女得度因緣經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0130_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0130.md",
      "vietTitle": "Kinh Phật Thuyết Cấp Cô Trường Giả Nữ Đắc Độ Nhân Duyên"
    },
    {
      "id": "T02n0131",
      "title": "佛說婆羅門避死經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0131_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0131.md",
      "vietTitle": "Kinh Phật Thuyết Bà La Môn Tị Tử"
    },
    {
      "id": "T02n0132a",
      "title": "佛說食施獲五福報經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0132a.md",
      "vietTitle": "Kinh Phật Thuyết Thực Thí Hoạch Ngũ Phước Báo"
    },
    {
      "id": "T02n0132b",
      "title": "施食獲五福報經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0132b.md",
      "vietTitle": "Kinh Thí Thực Hoạch Ngũ Phước Báo"
    },
    {
      "id": "T02n0133",
      "title": "頻毘娑羅王詣佛供養經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0133_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0133.md",
      "vietTitle": "Kinh Tần Tỳ Bà La Vương Nghệ Phật Cúng Dưỡng"
    },
    {
      "id": "T02n0134",
      "title": "佛說長者子六過出家經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0134_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0134.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Tử Lục Quá Xuất Gia"
    },
    {
      "id": "T02n0135",
      "title": "佛說力士移山經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0135_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0135.md",
      "vietTitle": "Kinh Phật Thuyết Lực Sĩ Di Sơn"
    },
    {
      "id": "T02n0136",
      "title": "佛說四未曾有法經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0136_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0136.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Vị Tằng Hữu Pháp"
    },
    {
      "id": "T02n0137",
      "title": "舍利弗摩訶目連遊四衢經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0137.md",
      "vietTitle": "Kinh Xá Lợi Phất Ma Ha Mục Liên Du Tứ Cù"
    },
    {
      "id": "T02n0138",
      "title": "佛說十一想思念如來經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0138.md",
      "vietTitle": "Kinh Phật Thuyết Thập Nhất Tưởng Tư Niệm Như Lai"
    },
    {
      "id": "T02n0139",
      "title": "佛說四泥犁經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0139_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0139.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Nê Lê"
    },
    {
      "id": "T02n0140",
      "title": "阿那邠邸化七子經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0140_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0140.md",
      "vietTitle": "Kinh A Na Bân Đễ Hóa Thất Tử"
    },
    {
      "id": "T02n0141",
      "title": "佛說阿遬達經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0141_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0141.md",
      "vietTitle": "Kinh Phật Thuyết A Tốc Đạt"
    },
    {
      "id": "T02n0142a",
      "title": "佛說玉耶女經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0142a.md",
      "vietTitle": "Kinh Phật Thuyết Ngọc Da Nữ"
    },
    {
      "id": "T02n0142b",
      "title": "玉耶女經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0142b.md",
      "vietTitle": "Kinh Ngọc Da Nữ"
    },
    {
      "id": "T02n0143",
      "title": "玉耶經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0143_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0143.md",
      "vietTitle": "Kinh Ngọc Da"
    },
    {
      "id": "T02n0144",
      "title": "佛說大愛道般泥洹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0144_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0144.md",
      "vietTitle": "Kinh Phật Thuyết Đại Ái Đạo Bát Nê Hoàn"
    },
    {
      "id": "T02n0145",
      "title": "佛母般泥洹經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0145_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0145.md",
      "vietTitle": "Kinh Phật Mẫu Bát Nê Hoàn"
    },
    {
      "id": "T02n0146",
      "title": "舍衛國王夢見十事經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0146_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0146.md",
      "vietTitle": "Kinh Xá Vệ Quốc Vương Mộng Kiến Thập Sự"
    },
    {
      "id": "T02n0147",
      "title": "佛說舍衛國王十夢經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0147_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0147.md",
      "vietTitle": "Kinh Phật Thuyết Xá Vệ Quốc Vương Thập Mộng"
    },
    {
      "id": "T02n0148",
      "title": "國王不梨先泥十夢經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0148_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0148.md",
      "vietTitle": "Kinh Quốc Vương Bất Lê Tiên Nê Thập Mộng"
    },
    {
      "id": "T02n0149",
      "title": "佛說阿難同學經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0149_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0149.md",
      "vietTitle": "Kinh Phật Thuyết A Nan Đồng Học"
    },
    {
      "id": "T02n0150A",
      "title": "七處三觀經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0150A.md",
      "vietTitle": "Kinh Thất Xứ Tam Quan"
    },
    {
      "id": "T02n0150B",
      "title": "九橫經",
      "division": "01",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0150B.md",
      "vietTitle": "Kinh Cửu Hoành"
    },
    {
      "id": "T02n0151",
      "title": "佛說阿含正行經",
      "division": "01",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0151_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/01_A_Ham/T02n0151.md",
      "vietTitle": "Kinh Phật Thuyết A Hàm Chánh Hạnh"
    },
    {
      "id": "T03n0152",
      "title": "六度集經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0152_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0152.md",
      "vietTitle": "Kinh Lục Độ Tập"
    },
    {
      "id": "T03n0153",
      "title": "菩薩本緣經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0153_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0153.md",
      "vietTitle": "Kinh Bồ Tát Bản Duyên"
    },
    {
      "id": "T03n0154",
      "title": "生經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0154_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0154.md",
      "vietTitle": "Kinh Bản Sinh (Sinh Kinh)"
    },
    {
      "id": "T03n0155",
      "title": "菩薩本行經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0155_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0155.md",
      "vietTitle": "Kinh Bồ Tát Bản Hạnh"
    },
    {
      "id": "T03n0156",
      "title": "大方便佛報恩經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0156_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0156.md",
      "vietTitle": "Kinh Đại Phương Tiện Phật Báo Ân"
    },
    {
      "id": "T03n0157",
      "title": "悲華經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0157_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0157.md",
      "vietTitle": "Kinh Bi Hoa"
    },
    {
      "id": "T03n0158",
      "title": "大乘悲分陀利經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0158_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0158.md",
      "vietTitle": "Kinh Đại Thừa Bi Phân Đà Lợi"
    },
    {
      "id": "T03n0159",
      "title": "大乘本生心地觀經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0159_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0159.md",
      "vietTitle": "Kinh Đại Thừa Bản Sinh Tâm Địa Quan"
    },
    {
      "id": "T03n0160",
      "title": "菩薩本生鬘論",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0160_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0160.md",
      "vietTitle": "Bồ Tát Bản Sinh Man Luận"
    },
    {
      "id": "T03n0161",
      "title": "長壽王經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0161_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0161.md",
      "vietTitle": "Kinh Trường Thọ Vương"
    },
    {
      "id": "T03n0162",
      "title": "金色王經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0162_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0162.md",
      "vietTitle": "Kinh Kim Sắc Vương"
    },
    {
      "id": "T03n0163",
      "title": "妙色王因緣經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0163_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0163.md",
      "vietTitle": "Kinh Diệu Sắc Vương Nhân Duyên"
    },
    {
      "id": "T03n0164",
      "title": "師子素馱娑王斷肉經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0164_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0164.md",
      "vietTitle": "Kinh Sư Tử Tố Đà Bà Vương Đoạn Nhục"
    },
    {
      "id": "T03n0165",
      "title": "頂生王因緣經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0165_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0165.md",
      "vietTitle": "Kinh Đính Sinh Vương Nhân Duyên"
    },
    {
      "id": "T03n0166",
      "title": "月光菩薩經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0166_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0166.md",
      "vietTitle": "Kinh Nguyệt Quang Bồ Tát"
    },
    {
      "id": "T03n0167",
      "title": "太子慕魄經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0167_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0167.md",
      "vietTitle": "Kinh Thái Tử Mộ Phách"
    },
    {
      "id": "T03n0168",
      "title": "太子墓魄經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0168_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0168.md",
      "vietTitle": "Kinh Thái Tử Mộ Phách"
    },
    {
      "id": "T03n0169",
      "title": "月明菩薩經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0169_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0169.md",
      "vietTitle": "Kinh Nguyệt Minh Bồ Tát"
    },
    {
      "id": "T03n0170",
      "title": "德光太子經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0170_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0170.md",
      "vietTitle": "Kinh Đức Quang Thái Tử"
    },
    {
      "id": "T03n0171",
      "title": "太子須大拏經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0171_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0171.md",
      "vietTitle": "Kinh Thái Tử Tu Đại Noa"
    },
    {
      "id": "T03n0172",
      "title": "菩薩投身飴餓虎起塔因緣經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0172_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0172.md",
      "vietTitle": "Kinh Bồ Tát Đầu Thân Di Ngạ Hổ Khởi Tháp Nhân Duyên"
    },
    {
      "id": "T03n0173",
      "title": "福力太子因緣經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0173_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0173.md",
      "vietTitle": "Kinh Phước Lực Thái Tử Nhân Duyên"
    },
    {
      "id": "T03n0174",
      "title": "菩薩睒子經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0174_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0174.md",
      "vietTitle": "Kinh Bồ Tát Thiểm Tử"
    },
    {
      "id": "T03n0175a",
      "title": "睒子經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0175a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0175a.md",
      "vietTitle": "Kinh Thiểm Tử"
    },
    {
      "id": "T03n0175b",
      "title": "佛說睒子經",
      "division": "02",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0175b.md",
      "vietTitle": "Kinh Phật Thuyết Thiểm Tử"
    },
    {
      "id": "T03n0175c",
      "title": "佛說睒子經",
      "division": "02",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0175c.md",
      "vietTitle": "Kinh Phật Thuyết Thiểm Tử"
    },
    {
      "id": "T03n0176",
      "title": "師子月佛本生經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0176_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0176.md",
      "vietTitle": "Kinh Sư Tử Nguyệt Phật Bản Sinh"
    },
    {
      "id": "T03n0177",
      "title": "大意經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0177_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0177.md",
      "vietTitle": "Kinh Đại Ý"
    },
    {
      "id": "T03n0178",
      "title": "前世三轉經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0178_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0178.md",
      "vietTitle": "Kinh Tiền Thế Tam Chuyển"
    },
    {
      "id": "T03n0179",
      "title": "銀色女經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0179_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0179.md",
      "vietTitle": "Kinh Ngân Sắc Nữ"
    },
    {
      "id": "T03n0180",
      "title": "過去世佛分衛經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0180_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0180.md",
      "vietTitle": "Kinh Quá Khứ Thế Phật Phân Vệ"
    },
    {
      "id": "T03n0181a",
      "title": "九色鹿經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0181a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0181a.md",
      "vietTitle": "Kinh Cửu Sắc Lộc"
    },
    {
      "id": "T03n0181b",
      "title": "佛說九色鹿經",
      "division": "02",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0181b.md",
      "vietTitle": "Kinh Phật Thuyết Cửu Sắc Lộc"
    },
    {
      "id": "T03n0182a",
      "title": "鹿母經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0182a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0182a.md",
      "vietTitle": "Kinh Lộc Mẫu"
    },
    {
      "id": "T03n0182b",
      "title": "佛說鹿母經",
      "division": "02",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0182b.md",
      "vietTitle": "Kinh Phật Thuyết Lộc Mẫu"
    },
    {
      "id": "T03n0183",
      "title": "一切智光明仙人慈心因緣不食肉經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0183_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0183.md",
      "vietTitle": "Kinh Nhất Thiết Trí Quang Minh Tiên Nhân Từ Tâm Nhân Duyên Bất Thực Nhục"
    },
    {
      "id": "T03n0184",
      "title": "修行本起經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0184_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0184.md",
      "vietTitle": "Kinh Tu Hạnh Bản Khởi"
    },
    {
      "id": "T03n0185",
      "title": "太子瑞應本起經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0185_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0185.md",
      "vietTitle": "Kinh Thái Tử Thụy Ứng Bản Khởi"
    },
    {
      "id": "T03n0186",
      "title": "普曜經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0186_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0186.md",
      "vietTitle": "Kinh Phổ Diệu"
    },
    {
      "id": "T03n0187",
      "title": "方廣大莊嚴經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0187_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0187.md",
      "vietTitle": "Kinh Phương Quảng Đại Trang Nghiêm"
    },
    {
      "id": "T03n0188",
      "title": "異出菩薩本起經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0188_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0188.md",
      "vietTitle": "Kinh Dị Xuất Bồ Tát Bản Khởi"
    },
    {
      "id": "T03n0189",
      "title": "過去現在因果經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0189_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0189.md",
      "vietTitle": "Kinh Quá Khứ Hiện Tại Nhân Quả"
    },
    {
      "id": "T03n0190",
      "title": "佛本行集經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0190_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0190.md",
      "vietTitle": "Kinh Phật Bản Hạnh Tập"
    },
    {
      "id": "T03n0191",
      "title": "眾許摩訶帝經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0191_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T03n0191.md",
      "vietTitle": "Kinh Chúng Hứa Ma Ha Đế"
    },
    {
      "id": "T04n0192",
      "title": "佛所行讚",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0192_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0192.md",
      "vietTitle": "Phật Sở Hạnh Tán"
    },
    {
      "id": "T04n0193",
      "title": "佛本行經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0193_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0193.md",
      "vietTitle": "Kinh Phật Bản Hạnh"
    },
    {
      "id": "T04n0194",
      "title": "僧伽羅剎所集經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0194_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0194.md",
      "vietTitle": "Kinh Tăng Già La Sát Sở Tập"
    },
    {
      "id": "T04n0195",
      "title": "佛說十二遊經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0195_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0195.md",
      "vietTitle": "Kinh Phật Thuyết Thập Nhị Du"
    },
    {
      "id": "T04n0196",
      "title": "中本起經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0196_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0196.md",
      "vietTitle": "Kinh Trung Bản Khởi"
    },
    {
      "id": "T04n0197",
      "title": "佛說興起行經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0197_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0197.md",
      "vietTitle": "Kinh Phật Thuyết Hưng Khởi Hạnh"
    },
    {
      "id": "T04n0198",
      "title": "佛說義足經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0198_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0198.md",
      "vietTitle": "Kinh Phật Thuyết Nghĩa Túc"
    },
    {
      "id": "T04n0199",
      "title": "佛五百弟子自說本起經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0199_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0199.md",
      "vietTitle": "Kinh Phật Ngũ Bách Đệ Tử Tự Thuyết Bản Khởi"
    },
    {
      "id": "T04n0200",
      "title": "撰集百緣經",
      "division": "02",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0200.md",
      "vietTitle": "Kinh Soạn Tập Bách Duyên"
    },
    {
      "id": "T04n0201",
      "title": "大莊嚴論經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0201_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0201.md",
      "vietTitle": "Kinh Đại Trang Nghiêm Luận"
    },
    {
      "id": "T04n0202",
      "title": "賢愚經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0202_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0202.md",
      "vietTitle": "Kinh Hiền Ngu"
    },
    {
      "id": "T04n0203",
      "title": "雜寶藏經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0203_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0203.md",
      "vietTitle": "Kinh Tạp Bảo Tạng"
    },
    {
      "id": "T04n0204",
      "title": "雜譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0204_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0204.md",
      "vietTitle": "Kinh Tạp Thí Dụ"
    },
    {
      "id": "T04n0205",
      "title": "雜譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0205_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0205.md",
      "vietTitle": "Kinh Tạp Thí Dụ"
    },
    {
      "id": "T04n0206",
      "title": "舊雜譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0206_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0206.md",
      "vietTitle": "Kinh Cựu Tạp Thí Dụ"
    },
    {
      "id": "T04n0207",
      "title": "雜譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0207_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0207.md",
      "vietTitle": "Kinh Tạp Thí Dụ"
    },
    {
      "id": "T04n0208",
      "title": "眾經撰雜譬喻",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0208_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0208.md",
      "vietTitle": "Chúng Kinh Soạn Tạp Thí Dụ"
    },
    {
      "id": "T04n0209",
      "title": "百喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0209_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0209.md",
      "vietTitle": "Kinh Bách Dụ"
    },
    {
      "id": "T04n0210",
      "title": "法句經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0210_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0210.md",
      "vietTitle": "Kinh Pháp Cú"
    },
    {
      "id": "T04n0211",
      "title": "法句譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0211_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0211.md",
      "vietTitle": "Kinh Pháp Cú Thí Dụ"
    },
    {
      "id": "T04n0212",
      "title": "出曜經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0212_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0212.md",
      "vietTitle": "Kinh Xuất Diệu"
    },
    {
      "id": "T04n0213",
      "title": "法集要頌經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0213_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0213.md",
      "vietTitle": "Kinh Pháp Tập Yếu Tụng"
    },
    {
      "id": "T04n0214",
      "title": "猘狗經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0214_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0214.md",
      "vietTitle": "Kinh Chế Cẩu"
    },
    {
      "id": "T04n0215",
      "title": "群牛譬經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0215_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0215.md",
      "vietTitle": "Kinh Quần Ngưu Thí"
    },
    {
      "id": "T04n0216",
      "title": "大魚事經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0216_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0216.md",
      "vietTitle": "Kinh Đại Ngư Sự"
    },
    {
      "id": "T04n0217",
      "title": "譬喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0217_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0217.md",
      "vietTitle": "Kinh Thí Dụ"
    },
    {
      "id": "T04n0218",
      "title": "灌頂王喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0218_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0218.md",
      "vietTitle": "Kinh Quán Đính Vương Dụ"
    },
    {
      "id": "T04n0219",
      "title": "醫喻經",
      "division": "02",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0219_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/02_Ban_Duyen/T04n0219.md",
      "vietTitle": "Kinh Y Dụ"
    },
    {
      "id": "T05n0220a",
      "title": "大般若波羅蜜多經(第1卷-第200卷)",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T05n0220a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T05n0220a.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 1 Quyển - Đệ 2 0 0 Quyển )"
    },
    {
      "id": "T06n0220b",
      "title": "大般若波羅蜜多經(第201卷-第400卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T06n0220b.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 2 0 1 Quyển - Đệ 4 0 0 Quyển )"
    },
    {
      "id": "T07n0220c",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220c.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220d",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220d.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220e",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220e.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220f",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220f.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220g",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220g.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220h",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220h.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220i",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220i.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220j",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220j.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220k",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220k.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220l",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220l.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220m",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220m.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220n",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220n.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T07n0220o",
      "title": "大般若波羅蜜多經(第401卷-第600卷)",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T07n0220o.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh ( Đệ 4 0 1 Quyển - Đệ 6 0 0 Quyển )"
    },
    {
      "id": "T08n0221",
      "title": "放光般若經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0221_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0221.md",
      "vietTitle": "Kinh Phóng Quang Bát Nhã"
    },
    {
      "id": "T08n0222",
      "title": "光讚經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0222_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0222.md",
      "vietTitle": "Kinh Quang Tán"
    },
    {
      "id": "T08n0223",
      "title": "摩訶般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0223_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0223.md",
      "vietTitle": "Kinh Ma Ha Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0224",
      "title": "道行般若經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0224_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0224.md",
      "vietTitle": "Kinh Đạo Hạnh Bát Nhã"
    },
    {
      "id": "T08n0225",
      "title": "大明度經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0225_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0225.md",
      "vietTitle": "Kinh Đại Minh Độ"
    },
    {
      "id": "T08n0226",
      "title": "摩訶般若鈔經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0226_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0226.md",
      "vietTitle": "Kinh Ma Ha Bát Nhã Sao"
    },
    {
      "id": "T08n0227",
      "title": "小品般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0227_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0227.md",
      "vietTitle": "Kinh Tiểu Phẩm Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0228",
      "title": "佛說佛母出生三法藏般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0228_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0228.md",
      "vietTitle": "Kinh Phật Thuyết Phật Mẫu Xuất Sinh Tam Pháp Tạng Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0229",
      "title": "佛說佛母寶德藏般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0229_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0229.md",
      "vietTitle": "Kinh Phật Thuyết Phật Mẫu Bảo Đức Tạng Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0230",
      "title": "聖八千頌般若波羅蜜多一百八名真實圓義陀羅尼經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0230_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0230.md",
      "vietTitle": "Kinh Thánh Bát Thiên Tụng Bát Nhã Ba La Mật Đa Nhất Bách Bát Danh Chân Thật Viên Nghĩa Đà La Ni"
    },
    {
      "id": "T08n0231",
      "title": "勝天王般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0231_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0231.md",
      "vietTitle": "Kinh Thắng Thiên Vương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0232",
      "title": "文殊師利所說摩訶般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0232_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0232.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Sở Thuyết Ma Ha Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0233",
      "title": "文殊師利所說般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0233_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0233.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Sở Thuyết Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0234",
      "title": "佛說濡首菩薩無上清淨分衛經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0234_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0234.md",
      "vietTitle": "Kinh Phật Thuyết Nhu Thủ Bồ Tát Vô Thượng Thanh Tịnh Phân Vệ"
    },
    {
      "id": "T08n0235",
      "title": "金剛般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0235_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0235.md",
      "vietTitle": "Kinh Kim Cương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0236a",
      "title": "金剛般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0236a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0236a.md",
      "vietTitle": "Kinh Kim Cương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0236b",
      "title": "金剛般若波羅蜜經",
      "division": "03",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0236b.md",
      "vietTitle": "Kinh Kim Cương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0237",
      "title": "金剛般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0237_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0237.md",
      "vietTitle": "Kinh Kim Cương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0238",
      "title": "金剛能斷般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0238_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0238.md",
      "vietTitle": "Kinh Kim Cương Năng Đoạn Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0239",
      "title": "佛說能斷金剛般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0239_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0239.md",
      "vietTitle": "Kinh Phật Thuyết Năng Đoạn Kim Cương Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0240",
      "title": "實相般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0240_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0240.md",
      "vietTitle": "Kinh Thật Tướng Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0241",
      "title": "金剛頂瑜伽理趣般若經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0241_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0241.md",
      "vietTitle": "Kinh Kim Cương Đính Du Già Lý Thú Bát Nhã"
    },
    {
      "id": "T08n0242",
      "title": "佛說遍照般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0242_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0242.md",
      "vietTitle": "Kinh Phật Thuyết Biến Chiếu Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0243",
      "title": "大樂金剛不空真實三麼耶經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0243_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0243.md",
      "vietTitle": "Kinh Đại Lạc Kim Cương Bất Không Chân Thật Tam Ma Da"
    },
    {
      "id": "T08n0244",
      "title": "佛說最上根本大樂金剛不空三昧大教王經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0244_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0244.md",
      "vietTitle": "Kinh Phật Thuyết Tối Thượng Căn Bản Đại Lạc Kim Cương Bất Không Tam Muội Đại Giáo Vương"
    },
    {
      "id": "T08n0245",
      "title": "佛說仁王般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0245_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0245.md",
      "vietTitle": "Kinh Phật Thuyết Nhân Vương Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0246",
      "title": "仁王護國般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0246_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0246.md",
      "vietTitle": "Kinh Nhân Vương Hộ Quốc Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0247",
      "title": "佛說了義般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0247_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0247.md",
      "vietTitle": "Kinh Phật Thuyết Liễu Nghĩa Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0248",
      "title": "佛說五十頌聖般若波羅蜜經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0248_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0248.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Thập Tụng Thánh Bát Nhã Ba La Mật"
    },
    {
      "id": "T08n0249",
      "title": "佛說帝釋般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0249_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0249.md",
      "vietTitle": "Kinh Phật Thuyết Đế Thích Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0250",
      "title": "摩訶般若波羅蜜大明呪經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0250_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0250.md",
      "vietTitle": "Kinh Ma Ha Bát Nhã Ba La Mật Đại Minh Chú"
    },
    {
      "id": "T08n0251",
      "title": "般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0251_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0251.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh (Bát Nhã Tâm Kinh)"
    },
    {
      "id": "T08n0252",
      "title": "普遍智藏般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0252_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0252.md",
      "vietTitle": "Kinh Phổ Biến Trí Tạng Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0253",
      "title": "般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0253_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0253.md",
      "vietTitle": "Kinh Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0254",
      "title": "般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0254_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0254.md",
      "vietTitle": "Kinh Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0255",
      "title": "般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0255_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0255.md",
      "vietTitle": "Kinh Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0256",
      "title": "唐梵翻對字音般若波羅蜜多心經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0256_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0256.md",
      "vietTitle": "Kinh Đường Phạm Phiên Đối Tự Âm Bát Nhã Ba La Mật Đa Tâm"
    },
    {
      "id": "T08n0257",
      "title": "佛說聖佛母般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0257_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0257.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Phật Mẫu Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0258",
      "title": "佛說聖佛母小字般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0258_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0258.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Phật Mẫu Tiểu Tự Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0259",
      "title": "佛說觀想佛母般若波羅蜜多菩薩經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0259_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0259.md",
      "vietTitle": "Kinh Phật Thuyết Quan Tưởng Phật Mẫu Bát Nhã Ba La Mật Đa Bồ Tát"
    },
    {
      "id": "T08n0260",
      "title": "佛說開覺自性般若波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0260_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0260.md",
      "vietTitle": "Kinh Phật Thuyết Khai Giác Tự Tính Bát Nhã Ba La Mật Đa"
    },
    {
      "id": "T08n0261",
      "title": "大乘理趣六波羅蜜多經",
      "division": "03",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0261_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0261.md",
      "vietTitle": "Kinh Đại Thừa Lý Thú Lục Ba La Mật Đa"
    },
    {
      "id": "T09n0262",
      "title": "妙法蓮華經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0262_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0262.md",
      "vietTitle": "Kinh Diệu Pháp Liên Hoa (Pháp Hoa)"
    },
    {
      "id": "T09n0263",
      "title": "正法華經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0263_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0263.md",
      "vietTitle": "Kinh Chánh Pháp Hoa"
    },
    {
      "id": "T09n0264",
      "title": "添品妙法蓮華經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0264_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0264.md",
      "vietTitle": "Kinh Thiêm Phẩm Diệu Pháp Liên Hoa"
    },
    {
      "id": "T09n0265",
      "title": "薩曇分陀利經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0265_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0265.md",
      "vietTitle": "Kinh Tát Đàm Phân Đà Lợi"
    },
    {
      "id": "T09n0266",
      "title": "佛說阿惟越致遮經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0266_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0266.md",
      "vietTitle": "Kinh Phật Thuyết A Duy Việt Trí Già"
    },
    {
      "id": "T09n0267",
      "title": "不退轉法輪經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0267_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0267.md",
      "vietTitle": "Kinh Bất Thoái Chuyển Pháp Luân"
    },
    {
      "id": "T09n0268",
      "title": "佛說廣博嚴淨不退轉輪經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0268_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0268.md",
      "vietTitle": "Kinh Phật Thuyết Quảng Bác Nghiêm Tịnh Bất Thoái Chuyển Luân"
    },
    {
      "id": "T09n0269",
      "title": "佛說法華三昧經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0269_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0269.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Hoa Tam Muội"
    },
    {
      "id": "T09n0270",
      "title": "大法鼓經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0270_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0270.md",
      "vietTitle": "Kinh Đại Pháp Cổ"
    },
    {
      "id": "T09n0271",
      "title": "佛說菩薩行方便境界神通變化經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0271_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0271.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Hạnh Phương Tiện Cảnh Giới Thần Thông Biến Hóa"
    },
    {
      "id": "T09n0272",
      "title": "大薩遮尼乾子所說經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0272_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0272.md",
      "vietTitle": "Kinh Đại Tát Già Ni Càn Tử Sở Thuyết"
    },
    {
      "id": "T09n0273",
      "title": "金剛三昧經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0273_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0273.md",
      "vietTitle": "Kinh Kim Cương Tam Muội"
    },
    {
      "id": "T09n0274",
      "title": "佛說濟諸方等學經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0274_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0274.md",
      "vietTitle": "Kinh Phật Thuyết Tế Chư Phương Đẳng Học"
    },
    {
      "id": "T09n0275",
      "title": "大乘方廣總持經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0275_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0275.md",
      "vietTitle": "Kinh Đại Thừa Phương Quảng Tổng Trì"
    },
    {
      "id": "T09n0276",
      "title": "無量義經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0276_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0276.md",
      "vietTitle": "Kinh Vô Lượng Nghĩa"
    },
    {
      "id": "T09n0277",
      "title": "佛說觀普賢菩薩行法經",
      "division": "04",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0277_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/04_Phap_Hoa/T09n0277.md",
      "vietTitle": "Kinh Phật Thuyết Quan Phổ Hiền Bồ Tát Hạnh Pháp"
    },
    {
      "id": "T09n0278",
      "title": "大方廣佛華嚴經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T09n0278_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T09n0278.md",
      "vietTitle": "Kinh Đại Phương Quảng Phật Hoa Nghiêm (Hoa Nghiêm 60 Quyển)"
    },
    {
      "id": "T10n0279",
      "title": "大方廣佛華嚴經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0279_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0279.md",
      "vietTitle": "Kinh Đại Phương Quảng Phật Hoa Nghiêm (Hoa Nghiêm 80 Quyển)"
    },
    {
      "id": "T10n0280",
      "title": "佛說兜沙經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0280_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0280.md",
      "vietTitle": "Kinh Phật Thuyết Đâu Sa"
    },
    {
      "id": "T10n0281",
      "title": "佛說菩薩本業經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0281_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0281.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Bản Nghiệp"
    },
    {
      "id": "T10n0282",
      "title": "諸菩薩求佛本業經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0282_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0282.md",
      "vietTitle": "Kinh Chư Bồ Tát Cầu Phật Bản Nghiệp"
    },
    {
      "id": "T10n0283",
      "title": "菩薩十住行道品",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0283_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0283.md",
      "vietTitle": "Bồ Tát Thập Trụ Hạnh Đạo Phẩm"
    },
    {
      "id": "T10n0284",
      "title": "佛說菩薩十住經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0284_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0284.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Thập Trụ"
    },
    {
      "id": "T10n0285",
      "title": "漸備一切智德經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0285_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0285.md",
      "vietTitle": "Kinh Tiệm Bị Nhất Thiết Trí Đức"
    },
    {
      "id": "T10n0286",
      "title": "十住經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0286_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0286.md",
      "vietTitle": "Kinh Thập Trụ"
    },
    {
      "id": "T10n0287",
      "title": "佛說十地經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0287_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0287.md",
      "vietTitle": "Kinh Phật Thuyết Thập Địa"
    },
    {
      "id": "T10n0288",
      "title": "等目菩薩所問三昧經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0288_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0288.md",
      "vietTitle": "Kinh Đẳng Mục Bồ Tát Sở Vấn Tam Muội"
    },
    {
      "id": "T10n0289",
      "title": "顯無邊佛土功德經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0289_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0289.md",
      "vietTitle": "Kinh Hiển Vô Biên Phật Thổ Công Đức"
    },
    {
      "id": "T10n0290",
      "title": "佛說較量一切佛剎功德經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0290_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0290.md",
      "vietTitle": "Kinh Phật Thuyết Giác Lượng Nhất Thiết Phật Sát Công Đức"
    },
    {
      "id": "T10n0291",
      "title": "佛說如來興顯經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0291_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0291.md",
      "vietTitle": "Kinh Phật Thuyết Như Lai Hưng Hiển"
    },
    {
      "id": "T10n0292",
      "title": "度世品經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0292_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0292.md",
      "vietTitle": "Kinh Độ Thế Phẩm"
    },
    {
      "id": "T10n0293",
      "title": "大方廣佛華嚴經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0293_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0293.md",
      "vietTitle": "Kinh Đại Phương Quảng Phật Hoa Nghiêm (Nhập Bất Tư Nghị Giải Thoát Cảnh Giới Phổ Hiền Hạnh Nguyện)"
    },
    {
      "id": "T10n0294",
      "title": "佛說羅摩伽經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0294_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0294.md",
      "vietTitle": "Kinh Phật Thuyết La Ma Già"
    },
    {
      "id": "T10n0295",
      "title": "大方廣佛華嚴經入法界品",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0295_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0295.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Nhập Pháp Giới Phẩm"
    },
    {
      "id": "T10n0296",
      "title": "文殊師利發願經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0296_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0296.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Phát Nguyện"
    },
    {
      "id": "T10n0297",
      "title": "普賢菩薩行願讚",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0297_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0297.md",
      "vietTitle": "Phổ Hiền Bồ Tát Hạnh Nguyện Tán"
    },
    {
      "id": "T10n0298",
      "title": "大方廣普賢所說經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0298_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0298.md",
      "vietTitle": "Kinh Đại Phương Quảng Phổ Hiền Sở Thuyết"
    },
    {
      "id": "T10n0299",
      "title": "大方廣總持寶光明經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0299_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0299.md",
      "vietTitle": "Kinh Đại Phương Quảng Tổng Trì Bảo Quang Minh"
    },
    {
      "id": "T10n0300",
      "title": "大方廣佛華嚴經不思議佛境界分",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0300_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0300.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Bất Tư Nghị Phật Cảnh Giới Phân"
    },
    {
      "id": "T10n0301",
      "title": "大方廣如來不思議境界經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0301_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0301.md",
      "vietTitle": "Kinh Đại Phương Quảng Như Lai Bất Tư Nghị Cảnh Giới"
    },
    {
      "id": "T10n0302",
      "title": "度諸佛境界智光嚴經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0302_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0302.md",
      "vietTitle": "Kinh Độ Chư Phật Cảnh Giới Trí Quang Nghiêm"
    },
    {
      "id": "T10n0303",
      "title": "佛華嚴入如來德智不思議境界經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0303_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0303.md",
      "vietTitle": "Kinh Phật Hoa Nghiêm Nhập Như Lai Đức Trí Bất Tư Nghị Cảnh Giới"
    },
    {
      "id": "T10n0304",
      "title": "大方廣入如來智德不思議經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0304_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0304.md",
      "vietTitle": "Kinh Đại Phương Quảng Nhập Như Lai Trí Đức Bất Tư Nghị"
    },
    {
      "id": "T10n0305",
      "title": "信力入印法門經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0305_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0305.md",
      "vietTitle": "Kinh Tín Lực Nhập Ấn Pháp Môn"
    },
    {
      "id": "T10n0306",
      "title": "大方廣佛花嚴經修慈分",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0306_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0306.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Tu Từ Phân"
    },
    {
      "id": "T10n0307",
      "title": "佛說莊嚴菩提心經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0307_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0307.md",
      "vietTitle": "Kinh Phật Thuyết Trang Nghiêm Bồ Đề Tâm"
    },
    {
      "id": "T10n0308",
      "title": "佛說大方廣菩薩十地經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0308_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0308.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phương Quảng Bồ Tát Thập Địa"
    },
    {
      "id": "T10n0309",
      "title": "最勝問菩薩十住除垢斷結經",
      "division": "05",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0309_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/05_Hoa_Nghiem/T10n0309.md",
      "vietTitle": "Kinh Tối Thắng Vấn Bồ Tát Thập Trụ Trừ Cấu Đoạn Kết"
    },
    {
      "id": "T11n0310",
      "title": "大寶積經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0310_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0310.md",
      "vietTitle": "Kinh Đại Bảo Tích"
    },
    {
      "id": "T11n0311",
      "title": "大方廣三戒經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0311_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0311.md",
      "vietTitle": "Kinh Đại Phương Quảng Tam Giới"
    },
    {
      "id": "T11n0312",
      "title": "佛說如來不思議祕密大乘經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0312_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0312.md",
      "vietTitle": "Kinh Phật Thuyết Như Lai Bất Tư Nghị Bí Mật Đại Thừa"
    },
    {
      "id": "T11n0313",
      "title": "阿閦佛國經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0313_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0313.md",
      "vietTitle": "Kinh A Súc Phật Quốc"
    },
    {
      "id": "T11n0314",
      "title": "佛說大乘十法經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0314.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Thập Pháp"
    },
    {
      "id": "T11n0315a",
      "title": "佛說普門品經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0315a.md",
      "vietTitle": "Kinh Phật Thuyết Phổ Môn Phẩm"
    },
    {
      "id": "T11n0315b",
      "title": "佛說普門品經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0315b.md",
      "vietTitle": "Kinh Phật Thuyết Phổ Môn Phẩm"
    },
    {
      "id": "T11n0316",
      "title": "佛說大乘菩薩藏正法經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0316.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Bồ Tát Tạng Chánh Pháp"
    },
    {
      "id": "T11n0317",
      "title": "佛說胞胎經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0317.md",
      "vietTitle": "Kinh Phật Thuyết Bào Thai"
    },
    {
      "id": "T11n0318",
      "title": "文殊師利佛土嚴淨經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0318.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Phật Thổ Nghiêm Tịnh"
    },
    {
      "id": "T11n0319",
      "title": "大聖文殊師利菩薩佛剎功德莊嚴經",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0319.md",
      "vietTitle": "Kinh Đại Thánh Văn Thù Sư Lợi Bồ Tát Phật Sát Công Đức Trang Nghiêm"
    },
    {
      "id": "T11n0320",
      "title": "父子合集經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0320_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T11n0320.md",
      "vietTitle": "Kinh Phụ Tử Hợp Tập"
    },
    {
      "id": "T12n0321",
      "title": "佛說護國尊者所問大乘經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0321_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0321.md",
      "vietTitle": "Kinh Phật Thuyết Hộ Quốc Tôn Giả Sở Vấn Đại Thừa"
    },
    {
      "id": "T12n0322",
      "title": "法鏡經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0322_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0322.md",
      "vietTitle": "Kinh Pháp Kính"
    },
    {
      "id": "T12n0323",
      "title": "郁迦羅越問菩薩行經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0323_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0323.md",
      "vietTitle": "Kinh Úc Ca La Việt Vấn Bồ Tát Hạnh"
    },
    {
      "id": "T12n0324",
      "title": "佛說幻士仁賢經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0324_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0324.md",
      "vietTitle": "Kinh Phật Thuyết Huyễn Sĩ Nhân Hiền"
    },
    {
      "id": "T12n0325",
      "title": "佛說決定毘尼經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0325_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0325.md",
      "vietTitle": "Kinh Phật Thuyết Quyết Định Tỳ Ni"
    },
    {
      "id": "T12n0326",
      "title": "佛說三十五佛名禮懺文",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0326_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0326.md",
      "vietTitle": "Phật Thuyết Tam Thập Ngũ Phật Danh Lễ Sám Văn"
    },
    {
      "id": "T12n0327",
      "title": "發覺淨心經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0327_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0327.md",
      "vietTitle": "Kinh Phát Giác Tịnh Tâm"
    },
    {
      "id": "T12n0328",
      "title": "佛說須賴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0328_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0328.md",
      "vietTitle": "Kinh Phật Thuyết Tu Lại"
    },
    {
      "id": "T12n0329",
      "title": "佛說須賴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0329_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0329.md",
      "vietTitle": "Kinh Phật Thuyết Tu Lại"
    },
    {
      "id": "T12n0330",
      "title": "佛說菩薩修行經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0330_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0330.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Tu Hạnh"
    },
    {
      "id": "T12n0331",
      "title": "佛說無畏授所問大乘經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0331_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0331.md",
      "vietTitle": "Kinh Phật Thuyết Vô Úy Thọ Sở Vấn Đại Thừa"
    },
    {
      "id": "T12n0332",
      "title": "佛說優填王經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0332_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0332.md",
      "vietTitle": "Kinh Phật Thuyết Ưu Điền Vương"
    },
    {
      "id": "T12n0333",
      "title": "佛說大乘日子王所問經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0333_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0333.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Nhật Tử Vương Sở Vấn"
    },
    {
      "id": "T12n0334",
      "title": "佛說須摩提菩薩經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0334_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0334.md",
      "vietTitle": "Kinh Phật Thuyết Tu Ma Đề Bồ Tát"
    },
    {
      "id": "T12n0335",
      "title": "佛說須摩提菩薩經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0335_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0335.md",
      "vietTitle": "Kinh Phật Thuyết Tu Ma Đề Bồ Tát"
    },
    {
      "id": "T12n0336",
      "title": "須摩提經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0336_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0336.md",
      "vietTitle": "Kinh Tu Ma Đề"
    },
    {
      "id": "T12n0337",
      "title": "佛說阿闍貰王女阿術達菩薩經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0337_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0337.md",
      "vietTitle": "Kinh Phật Thuyết A Đồ Thế Vương Nữ A Thuật Đạt Bồ Tát"
    },
    {
      "id": "T12n0338",
      "title": "佛說離垢施女經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0338_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0338.md",
      "vietTitle": "Kinh Phật Thuyết Li Cấu Thí Nữ"
    },
    {
      "id": "T12n0339",
      "title": "得無垢女經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0339_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0339.md",
      "vietTitle": "Kinh Đắc Vô Cấu Nữ"
    },
    {
      "id": "T12n0340",
      "title": "文殊師利所說不思議佛境界經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0340_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0340.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Sở Thuyết Bất Tư Nghị Phật Cảnh Giới"
    },
    {
      "id": "T12n0341",
      "title": "聖善住意天子所問經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0341_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0341.md",
      "vietTitle": "Kinh Thánh Thiện Trụ Ý Thiên Tử Sở Vấn"
    },
    {
      "id": "T12n0342",
      "title": "佛說如幻三昧經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0342_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0342.md",
      "vietTitle": "Kinh Phật Thuyết Như Huyễn Tam Muội"
    },
    {
      "id": "T12n0343",
      "title": "佛說太子刷護經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0343_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0343.md",
      "vietTitle": "Kinh Phật Thuyết Thái Tử Loát Hộ"
    },
    {
      "id": "T12n0344",
      "title": "佛說太子和休經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0344_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0344.md",
      "vietTitle": "Kinh Phật Thuyết Thái Tử Hòa Hưu"
    },
    {
      "id": "T12n0345",
      "title": "慧上菩薩問大善權經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0345_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0345.md",
      "vietTitle": "Kinh Tuệ Thượng Bồ Tát Vấn Đại Thiện Quyền"
    },
    {
      "id": "T12n0346",
      "title": "佛說大方廣善巧方便經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0346_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0346.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phương Quảng Thiện Xảo Phương Tiện"
    },
    {
      "id": "T12n0347",
      "title": "大乘顯識經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0347_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0347.md",
      "vietTitle": "Kinh Đại Thừa Hiển Thức"
    },
    {
      "id": "T12n0348",
      "title": "佛說大乘方等要慧經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0348_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0348.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Phương Đẳng Yếu Tuệ"
    },
    {
      "id": "T12n0349",
      "title": "彌勒菩薩所問本願經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0349_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0349.md",
      "vietTitle": "Kinh Di Lặc Bồ Tát Sở Vấn Bản Nguyện"
    },
    {
      "id": "T12n0350",
      "title": "佛說遺日摩尼寶經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0350_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0350.md",
      "vietTitle": "Kinh Phật Thuyết Di Nhật Ma Ni Bảo"
    },
    {
      "id": "T12n0351",
      "title": "佛說摩訶衍寶嚴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0351_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0351.md",
      "vietTitle": "Kinh Phật Thuyết Ma Ha Diễn Bảo Nghiêm"
    },
    {
      "id": "T12n0352",
      "title": "佛說大迦葉問大寶積正法經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0352_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0352.md",
      "vietTitle": "Kinh Phật Thuyết Đại Ca Diệp Vấn Đại Bảo Tích Chánh Pháp"
    },
    {
      "id": "T12n0353",
      "title": "勝鬘師子吼一乘大方便方廣經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0353_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0353.md",
      "vietTitle": "Kinh Thắng Man Sư Tử Hống Nhất Thừa Đại Phương Tiện Phương Quảng"
    },
    {
      "id": "T12n0354",
      "title": "毘耶娑問經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0354_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0354.md",
      "vietTitle": "Kinh Tỳ Da Bà Vấn"
    },
    {
      "id": "T12n0355",
      "title": "入法界體性經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0355_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0355.md",
      "vietTitle": "Kinh Nhập Pháp Giới Thể Tính"
    },
    {
      "id": "T12n0356",
      "title": "佛說寶積三昧文殊師利菩薩問法身經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0356_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0356.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Tích Tam Muội Văn Thù Sư Lợi Bồ Tát Vấn Pháp Thân"
    },
    {
      "id": "T12n0357",
      "title": "如來莊嚴智慧光明入一切佛境界經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0357_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0357.md",
      "vietTitle": "Kinh Như Lai Trang Nghiêm Trí Tuệ Quang Minh Nhập Nhất Thiết Phật Cảnh Giới"
    },
    {
      "id": "T12n0358",
      "title": "度一切諸佛境界智嚴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0358_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0358.md",
      "vietTitle": "Kinh Độ Nhất Thiết Chư Phật Cảnh Giới Trí Nghiêm"
    },
    {
      "id": "T12n0359",
      "title": "佛說大乘入諸佛境界智光明莊嚴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0359_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0359.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Nhập Chư Phật Cảnh Giới Trí Quang Minh Trang Nghiêm"
    },
    {
      "id": "T12n0360",
      "title": "佛說無量壽經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0360_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0360.md",
      "vietTitle": "Kinh Vô Lượng Thọ"
    },
    {
      "id": "T12n0361",
      "title": "佛說無量清淨平等覺經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0361_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0361.md",
      "vietTitle": "Kinh Phật Thuyết Vô Lượng Thanh Tịnh Bình Đẳng Giác"
    },
    {
      "id": "T12n0362",
      "title": "佛說阿彌陀三耶三佛薩樓佛檀過度人道經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0362_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0362.md",
      "vietTitle": "Kinh Phật Thuyết A Di Đà Tam Da Tam Phật Tát Lâu Phật Đàn Quá Độ Nhân Đạo"
    },
    {
      "id": "T12n0363",
      "title": "佛說大乘無量壽莊嚴經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0363_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0363.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Vô Lượng Thọ Trang Nghiêm"
    },
    {
      "id": "T12n0364",
      "title": "佛說大阿彌陀經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0364_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0364.md",
      "vietTitle": "Kinh Phật Thuyết Đại A Di Đà"
    },
    {
      "id": "T12n0365",
      "title": "佛說觀無量壽佛經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0365_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0365.md",
      "vietTitle": "Kinh Quán Vô Lượng Thọ Phật"
    },
    {
      "id": "T12n0366",
      "title": "佛說阿彌陀經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0366_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0366.md",
      "vietTitle": "Kinh A Di Đà"
    },
    {
      "id": "T12n0367",
      "title": "稱讚淨土佛攝受經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0367_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0367.md",
      "vietTitle": "Kinh Xưng Tán Tịnh Thổ Phật Nhiếp Thọ"
    },
    {
      "id": "T12n0368",
      "title": "拔一切業障根本得生淨土神呪",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0368_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0368.md",
      "vietTitle": "Bạt Nhất Thiết Nghiệp Chướng Căn Bản Đắc Sinh Tịnh Thổ Thần Chú"
    },
    {
      "id": "T12n0369",
      "title": "阿彌陀佛說呪",
      "division": "06",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0369.md",
      "vietTitle": "A Di Đà Phật Thuyết Chú"
    },
    {
      "id": "T12n0370",
      "title": "阿彌陀鼓音聲王陀羅尼經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0370_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0370.md",
      "vietTitle": "Kinh A Di Đà Cổ Âm Thanh Vương Đà La Ni"
    },
    {
      "id": "T12n0371",
      "title": "觀世音菩薩授記經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0371_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0371.md",
      "vietTitle": "Kinh Quan Thế Âm Bồ Tát Thọ Kí"
    },
    {
      "id": "T12n0372",
      "title": "佛說如幻三摩地無量印法門經",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0372_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0372.md",
      "vietTitle": "Kinh Phật Thuyết Như Huyễn Tam Ma Địa Vô Lượng Ấn Pháp Môn"
    },
    {
      "id": "T12n0373",
      "title": "後出阿彌陀佛偈",
      "division": "06",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0373_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/06_Bao_Tich/T12n0373.md",
      "vietTitle": "Hậu Xuất A Di Đà Phật Kệ"
    },
    {
      "id": "T12n0374",
      "title": "大般涅槃經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0374_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0374.md",
      "vietTitle": "Kinh Đại Bát Niết Bàn (Bắc Bản)"
    },
    {
      "id": "T12n0375",
      "title": "大般涅槃經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0375_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0375.md",
      "vietTitle": "Kinh Đại Bát Niết Bàn (Nam Bản)"
    },
    {
      "id": "T12n0376",
      "title": "佛說大般泥洹經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0376_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0376.md",
      "vietTitle": "Kinh Phật Thuyết Đại Bát Nê Hoàn"
    },
    {
      "id": "T12n0377",
      "title": "大般涅槃經後分",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0377_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0377.md",
      "vietTitle": "Đại Bát Niết Bàn Kinh Hậu Phân"
    },
    {
      "id": "T12n0378",
      "title": "佛說方等般泥洹經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0378_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0378.md",
      "vietTitle": "Kinh Phật Thuyết Phương Đẳng Bát Nê Hoàn"
    },
    {
      "id": "T12n0379",
      "title": "四童子三昧經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0379_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0379.md",
      "vietTitle": "Kinh Tứ Đồng Tử Tam Muội"
    },
    {
      "id": "T12n0380",
      "title": "大悲經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0380_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0380.md",
      "vietTitle": "Kinh Đại Bi"
    },
    {
      "id": "T12n0381",
      "title": "等集眾德三昧經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0381_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0381.md",
      "vietTitle": "Kinh Đẳng Tập Chúng Đức Tam Muội"
    },
    {
      "id": "T12n0382",
      "title": "集一切福德三昧經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0382_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0382.md",
      "vietTitle": "Kinh Tập Nhất Thiết Phước Đức Tam Muội"
    },
    {
      "id": "T12n0383",
      "title": "摩訶摩耶經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0383_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0383.md",
      "vietTitle": "Kinh Ma Ha Ma Da"
    },
    {
      "id": "T12n0384",
      "title": "菩薩從兜術天降神母胎說廣普經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0384_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0384.md",
      "vietTitle": "Kinh Bồ Tát Tòng Đâu Thuật Thiên Hàng Thần Mẫu Thai Thuyết Quảng Phổ"
    },
    {
      "id": "T12n0385",
      "title": "中陰經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0385_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0385.md",
      "vietTitle": "Kinh Trung Âm"
    },
    {
      "id": "T12n0386",
      "title": "蓮華面經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0386_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0386.md",
      "vietTitle": "Kinh Liên Hoa Diện"
    },
    {
      "id": "T12n0387",
      "title": "大方等無想經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0387_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0387.md",
      "vietTitle": "Kinh Đại Phương Đẳng Vô Tưởng"
    },
    {
      "id": "T12n0388",
      "title": "大雲無想經卷第九",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0388_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0388.md",
      "vietTitle": "Đại Vân Vô Tưởng Kinh Quyển Đệ Cửu"
    },
    {
      "id": "T12n0389",
      "title": "佛垂般涅槃略說教誡經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0389_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0389.md",
      "vietTitle": "Kinh Phật Thùy Bát Niết Bàn Lược Thuyết Giáo Giới"
    },
    {
      "id": "T12n0390",
      "title": "佛臨涅槃記法住經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0390_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0390.md",
      "vietTitle": "Kinh Phật Lâm Niết Bàn Kí Pháp Trụ"
    },
    {
      "id": "T12n0391",
      "title": "般泥洹後灌臘經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0391_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0391.md",
      "vietTitle": "Kinh Bát Nê Hoàn Hậu Quán Lạp"
    },
    {
      "id": "T12n0392",
      "title": "佛滅度後棺斂葬送經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0392_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0392.md",
      "vietTitle": "Kinh Phật Diệt Độ Hậu Quan Liễm Táng Tống"
    },
    {
      "id": "T12n0393",
      "title": "迦葉赴佛般涅槃經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0393_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0393.md",
      "vietTitle": "Kinh Ca Diệp Phó Phật Bát Niết Bàn"
    },
    {
      "id": "T12n0394",
      "title": "佛入涅槃密迹金剛力士哀戀經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0394_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0394.md",
      "vietTitle": "Kinh Phật Nhập Niết Bàn Mật Tích Kim Cương Lực Sĩ Ai Luyến"
    },
    {
      "id": "T12n0395",
      "title": "佛說當來變經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0395_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0395.md",
      "vietTitle": "Kinh Phật Thuyết Đương Lai Biến"
    },
    {
      "id": "T12n0396",
      "title": "佛說法滅盡經",
      "division": "07",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0396_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/07_Niet_Ban/T12n0396.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Diệt Tận"
    },
    {
      "id": "T13n0397",
      "title": "大方等大集經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0397_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0397.md",
      "vietTitle": "Kinh Đại Phương Đẳng Đại Tập"
    },
    {
      "id": "T13n0398",
      "title": "大哀經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0398_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0398.md",
      "vietTitle": "Kinh Đại Ai"
    },
    {
      "id": "T13n0399",
      "title": "寶女所問經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0399_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0399.md",
      "vietTitle": "Kinh Bảo Nữ Sở Vấn"
    },
    {
      "id": "T13n0400",
      "title": "佛說海意菩薩所問淨印法門經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0400_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0400.md",
      "vietTitle": "Kinh Phật Thuyết Hải Ý Bồ Tát Sở Vấn Tịnh Ấn Pháp Môn"
    },
    {
      "id": "T13n0401",
      "title": "佛說無言童子經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0401_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0401.md",
      "vietTitle": "Kinh Phật Thuyết Vô Ngôn Đồng Tử"
    },
    {
      "id": "T13n0402",
      "title": "寶星陀羅尼經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0402_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0402.md",
      "vietTitle": "Kinh Bảo Tinh Đà La Ni"
    },
    {
      "id": "T13n0403",
      "title": "阿差末菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0403_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0403.md",
      "vietTitle": "Kinh A Sai Mạt Bồ Tát"
    },
    {
      "id": "T13n0404",
      "title": "大集大虛空藏菩薩所問經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0404_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0404.md",
      "vietTitle": "Kinh Đại Tập Đại Hư Không Tạng Bồ Tát Sở Vấn"
    },
    {
      "id": "T13n0405",
      "title": "虛空藏菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0405_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0405.md",
      "vietTitle": "Kinh Hư Không Tạng Bồ Tát"
    },
    {
      "id": "T13n0406",
      "title": "虛空藏菩薩神呪經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0406_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0406.md",
      "vietTitle": "Kinh Hư Không Tạng Bồ Tát Thần Chú"
    },
    {
      "id": "T13n0407",
      "title": "虛空藏菩薩神呪經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0407_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0407.md",
      "vietTitle": "Kinh Hư Không Tạng Bồ Tát Thần Chú"
    },
    {
      "id": "T13n0408",
      "title": "虛空孕菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0408_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0408.md",
      "vietTitle": "Kinh Hư Không Dựng Bồ Tát"
    },
    {
      "id": "T13n0409",
      "title": "觀虛空藏菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0409_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0409.md",
      "vietTitle": "Kinh Quan Hư Không Tạng Bồ Tát"
    },
    {
      "id": "T13n0410",
      "title": "大方廣十輪經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0410_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0410.md",
      "vietTitle": "Kinh Đại Phương Quảng Thập Luân"
    },
    {
      "id": "T13n0411",
      "title": "大乘大集地藏十輪經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0411_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0411.md",
      "vietTitle": "Kinh Đại Thừa Đại Tập Địa Tạng Thập Luân"
    },
    {
      "id": "T13n0412",
      "title": "地藏菩薩本願經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0412_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0412.md",
      "vietTitle": "Kinh Địa Tạng Bồ Tát Bản Nguyện"
    },
    {
      "id": "T13n0413",
      "title": "百千頌大集經地藏菩薩請問法身讚",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0413_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0413.md",
      "vietTitle": "Bách Thiên Tụng Đại Tập Kinh Địa Tạng Bồ Tát Thỉnh Vấn Pháp Thân Tán"
    },
    {
      "id": "T13n0414",
      "title": "菩薩念佛三昧經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0414_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0414.md",
      "vietTitle": "Kinh Bồ Tát Niệm Phật Tam Muội"
    },
    {
      "id": "T13n0415",
      "title": "大方等大集經菩薩念佛三昧分",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0415_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0415.md",
      "vietTitle": "Đại Phương Đẳng Đại Tập Kinh Bồ Tát Niệm Phật Tam Muội Phân"
    },
    {
      "id": "T13n0416",
      "title": "大方等大集經賢護分",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0416_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0416.md",
      "vietTitle": "Đại Phương Đẳng Đại Tập Kinh Hiền Hộ Phân"
    },
    {
      "id": "T13n0417",
      "title": "佛說般舟三昧經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0417_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0417.md",
      "vietTitle": "Kinh Phật Thuyết Bát Chu Tam Muội"
    },
    {
      "id": "T13n0418",
      "title": "般舟三昧經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0418_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0418.md",
      "vietTitle": "Kinh Bát Chu Tam Muội"
    },
    {
      "id": "T13n0419",
      "title": "拔陂菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0419_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0419.md",
      "vietTitle": "Kinh Bạt Bi Bồ Tát"
    },
    {
      "id": "T13n0420",
      "title": "自在王菩薩經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0420_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0420.md",
      "vietTitle": "Kinh Tự Tại Vương Bồ Tát"
    },
    {
      "id": "T13n0421",
      "title": "奮迅王問經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0421_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0421.md",
      "vietTitle": "Kinh Phấn Tấn Vương Vấn"
    },
    {
      "id": "T13n0422",
      "title": "大集譬喻王經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0422_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0422.md",
      "vietTitle": "Kinh Đại Tập Thí Dụ Vương"
    },
    {
      "id": "T13n0423",
      "title": "僧伽吒經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0423_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0423.md",
      "vietTitle": "Kinh Tăng Già Trá"
    },
    {
      "id": "T13n0424",
      "title": "大集會正法經",
      "division": "08",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0424_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/08_Dai_Tap/T13n0424.md",
      "vietTitle": "Kinh Đại Tập Hội Chánh Pháp"
    },
    {
      "id": "T14n0425",
      "title": "賢劫經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0425_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0425.md",
      "vietTitle": "Kinh Hiền Kiếp"
    },
    {
      "id": "T14n0426",
      "title": "佛說千佛因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0426_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0426.md",
      "vietTitle": "Kinh Phật Thuyết Thiên Phật Nhân Duyên"
    },
    {
      "id": "T14n0427",
      "title": "佛說八吉祥神呪經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0427_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0427.md",
      "vietTitle": "Kinh Phật Thuyết Bát Cát Tường Thần Chú"
    },
    {
      "id": "T14n0428",
      "title": "佛說八陽神呪經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0428_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0428.md",
      "vietTitle": "Kinh Phật Thuyết Bát Dương Thần Chú"
    },
    {
      "id": "T14n0429",
      "title": "佛說八部佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0429_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0429.md",
      "vietTitle": "Kinh Phật Thuyết Bát Bộ Phật Danh"
    },
    {
      "id": "T14n0430",
      "title": "八吉祥經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0430_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0430.md",
      "vietTitle": "Kinh Bát Cát Tường"
    },
    {
      "id": "T14n0431",
      "title": "八佛名號經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0431_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0431.md",
      "vietTitle": "Kinh Bát Phật Danh Hào"
    },
    {
      "id": "T14n0432",
      "title": "佛說十吉祥經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0432_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0432.md",
      "vietTitle": "Kinh Phật Thuyết Thập Cát Tường"
    },
    {
      "id": "T14n0433",
      "title": "佛說寶網經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0433_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0433.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Võng"
    },
    {
      "id": "T14n0434",
      "title": "佛說稱揚諸佛功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0434_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0434.md",
      "vietTitle": "Kinh Phật Thuyết Xưng Dương Chư Phật Công Đức"
    },
    {
      "id": "T14n0435",
      "title": "佛說滅十方冥經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0435_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0435.md",
      "vietTitle": "Kinh Phật Thuyết Diệt Thập Phương Minh"
    },
    {
      "id": "T14n0436",
      "title": "受持七佛名號所生功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0436_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0436.md",
      "vietTitle": "Kinh Thọ Trì Thất Phật Danh Hào Sở Sinh Công Đức"
    },
    {
      "id": "T14n0437",
      "title": "大乘寶月童子問法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0437_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0437.md",
      "vietTitle": "Kinh Đại Thừa Bảo Nguyệt Đồng Tử Vấn Pháp"
    },
    {
      "id": "T14n0438",
      "title": "佛說大乘大方廣佛冠經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0438_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0438.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Đại Phương Quảng Phật Quan"
    },
    {
      "id": "T14n0439",
      "title": "佛說諸佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0439_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0439.md",
      "vietTitle": "Kinh Phật Thuyết Chư Phật"
    },
    {
      "id": "T14n0440",
      "title": "佛說佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0440_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0440.md",
      "vietTitle": "Kinh Phật Thuyết Phật Danh"
    },
    {
      "id": "T14n0441",
      "title": "佛說佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0441_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0441.md",
      "vietTitle": "Kinh Phật Thuyết Phật Danh"
    },
    {
      "id": "T14n0442",
      "title": "十方千五百佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0442_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0442.md",
      "vietTitle": "Kinh Thập Phương Thiên Ngũ Bách Phật Danh"
    },
    {
      "id": "T14n0443",
      "title": "五千五百佛名神呪除障滅罪經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0443_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0443.md",
      "vietTitle": "Kinh Ngũ Thiên Ngũ Bách Phật Danh Thần Chú Trừ Chướng Diệt Tội"
    },
    {
      "id": "T14n0444",
      "title": "佛說百佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0444_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0444.md",
      "vietTitle": "Kinh Phật Thuyết Bách Phật Danh"
    },
    {
      "id": "T14n0445",
      "title": "佛說不思議功德諸佛所護念經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0445_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0445.md",
      "vietTitle": "Kinh Phật Thuyết Bất Tư Nghị Công Đức Chư Phật Sở Hộ Niệm"
    },
    {
      "id": "T14n0446a",
      "title": "過去莊嚴劫千佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0446a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0446a.md",
      "vietTitle": "Kinh Quá Khứ Trang Nghiêm Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0446b",
      "title": "過去莊嚴劫千佛名經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0446b.md",
      "vietTitle": "Kinh Quá Khứ Trang Nghiêm Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0447a",
      "title": "現在賢劫千佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0447a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0447a.md",
      "vietTitle": "Kinh Hiện Tại Hiền Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0447b",
      "title": "現在賢劫千佛名經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0447b.md",
      "vietTitle": "Kinh Hiện Tại Hiền Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0448a",
      "title": "未來星宿劫千佛名經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0448a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0448a.md",
      "vietTitle": "Kinh Vị Lai Tinh Túc Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0448b",
      "title": "未來星宿劫千佛名經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0448b.md",
      "vietTitle": "Kinh Vị Lai Tinh Túc Kiếp Thiên Phật Danh"
    },
    {
      "id": "T14n0449",
      "title": "佛說藥師如來本願經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0449_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0449.md",
      "vietTitle": "Kinh Phật Thuyết Dược Sư Như Lai Bản Nguyện"
    },
    {
      "id": "T14n0450",
      "title": "藥師琉璃光如來本願功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0450_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0450.md",
      "vietTitle": "Kinh Dược Sư Lưu Ly Quang Như Lai Bản Nguyện Công Đức"
    },
    {
      "id": "T14n0451",
      "title": "藥師琉璃光七佛本願功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0451_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0451.md",
      "vietTitle": "Kinh Dược Sư Lưu Ly Quang Thất Phật Bản Nguyện Công Đức"
    },
    {
      "id": "T14n0452",
      "title": "佛說觀彌勒菩薩上生兜率天經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0452_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0452.md",
      "vietTitle": "Kinh Phật Thuyết Quan Di Lặc Bồ Tát Thượng Sinh Đâu Suất Thiên"
    },
    {
      "id": "T14n0453",
      "title": "佛說彌勒下生經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0453_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0453.md",
      "vietTitle": "Kinh Phật Thuyết Di Lặc Hạ Sinh"
    },
    {
      "id": "T14n0454",
      "title": "佛說彌勒下生成佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0454_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0454.md",
      "vietTitle": "Kinh Phật Thuyết Di Lặc Hạ Sinh Thành Phật"
    },
    {
      "id": "T14n0455",
      "title": "佛說彌勒下生成佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0455_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0455.md",
      "vietTitle": "Kinh Phật Thuyết Di Lặc Hạ Sinh Thành Phật"
    },
    {
      "id": "T14n0456",
      "title": "佛說彌勒大成佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0456_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0456.md",
      "vietTitle": "Kinh Phật Thuyết Di Lặc Đại Thành Phật"
    },
    {
      "id": "T14n0457",
      "title": "佛說彌勒來時經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0457_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0457.md",
      "vietTitle": "Kinh Phật Thuyết Di Lặc Lai Thời"
    },
    {
      "id": "T14n0458",
      "title": "文殊師利問菩薩署經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0458_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0458.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Vấn Bồ Tát Thự"
    },
    {
      "id": "T14n0459",
      "title": "佛說文殊悔過經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0459_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0459.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Hối Quá"
    },
    {
      "id": "T14n0460",
      "title": "佛說文殊師利淨律經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0460_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0460.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Tịnh Luật"
    },
    {
      "id": "T14n0461",
      "title": "佛說文殊師利現寶藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0461_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0461.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Hiện Bảo Tạng"
    },
    {
      "id": "T14n0462",
      "title": "大方廣寶篋經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0462_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0462.md",
      "vietTitle": "Kinh Đại Phương Quảng Bảo Khiếp"
    },
    {
      "id": "T14n0463",
      "title": "佛說文殊師利般涅槃經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0463_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0463.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Bát Niết Bàn"
    },
    {
      "id": "T14n0464",
      "title": "文殊師利問菩提經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0464_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0464.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Vấn Bồ Đề"
    },
    {
      "id": "T14n0465",
      "title": "伽耶山頂經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0465_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0465.md",
      "vietTitle": "Kinh Già Da Sơn Đính"
    },
    {
      "id": "T14n0466",
      "title": "佛說象頭精舍經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0466_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0466.md",
      "vietTitle": "Kinh Phật Thuyết Tượng Đầu Tinh Xá"
    },
    {
      "id": "T14n0467",
      "title": "大乘伽耶山頂經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0467_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0467.md",
      "vietTitle": "Kinh Đại Thừa Già Da Sơn Đính"
    },
    {
      "id": "T14n0468",
      "title": "文殊師利問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0468_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0468.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Vấn"
    },
    {
      "id": "T14n0469",
      "title": "文殊問經字母品第十四",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0469_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0469.md",
      "vietTitle": "Văn Thù Vấn Kinh Tự Mẫu Phẩm Đệ Thập Tứ"
    },
    {
      "id": "T14n0470",
      "title": "佛說文殊師利巡行經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0470_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0470.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Tuần Hạnh"
    },
    {
      "id": "T14n0471",
      "title": "佛說文殊師利行經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0471_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0471.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Hạnh"
    },
    {
      "id": "T14n0472",
      "title": "佛說大乘善見變化文殊師利問法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0472_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0472.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Thiện Kiến Biến Hóa Văn Thù Sư Lợi Vấn Pháp"
    },
    {
      "id": "T14n0473",
      "title": "佛說妙吉祥菩薩所問大乘法螺經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0473_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0473.md",
      "vietTitle": "Kinh Phật Thuyết Diệu Cát Tường Bồ Tát Sở Vấn Đại Thừa Pháp Loa"
    },
    {
      "id": "T14n0474",
      "title": "佛說維摩詰經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0474_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0474.md",
      "vietTitle": "Kinh Phật Thuyết Duy Ma Cật"
    },
    {
      "id": "T14n0475",
      "title": "維摩詰所說經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0475_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0475.md",
      "vietTitle": "Kinh Duy Ma Cật Sở Thuyết"
    },
    {
      "id": "T14n0476",
      "title": "說無垢稱經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0476_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0476.md",
      "vietTitle": "Kinh Thuyết Vô Cấu Xưng"
    },
    {
      "id": "T14n0477",
      "title": "佛說大方等頂王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0477_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0477.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phương Đẳng Đính Vương"
    },
    {
      "id": "T14n0478",
      "title": "大乘頂王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0478_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0478.md",
      "vietTitle": "Kinh Đại Thừa Đính Vương"
    },
    {
      "id": "T14n0479",
      "title": "善思童子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0479_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0479.md",
      "vietTitle": "Kinh Thiện Tư Đồng Tử"
    },
    {
      "id": "T14n0480",
      "title": "佛說月上女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0480_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0480.md",
      "vietTitle": "Kinh Phật Thuyết Nguyệt Thượng Nữ"
    },
    {
      "id": "T14n0481",
      "title": "持人菩薩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0481_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0481.md",
      "vietTitle": "Kinh Trì Nhân Bồ Tát"
    },
    {
      "id": "T14n0482",
      "title": "持世經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0482_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0482.md",
      "vietTitle": "Kinh Trì Thế"
    },
    {
      "id": "T14n0483",
      "title": "三曼陀跋陀羅菩薩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0483_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0483.md",
      "vietTitle": "Kinh Tam Mạn Đà Bạt Đà La Bồ Tát"
    },
    {
      "id": "T14n0484",
      "title": "不思議光菩薩所說經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0484_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0484.md",
      "vietTitle": "Kinh Bất Tư Nghị Quang Bồ Tát Sở Thuyết"
    },
    {
      "id": "T14n0485",
      "title": "無所有菩薩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0485_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0485.md",
      "vietTitle": "Kinh Vô Sở Hữu Bồ Tát"
    },
    {
      "id": "T14n0486",
      "title": "師子莊嚴王菩薩請問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0486_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0486.md",
      "vietTitle": "Kinh Sư Tử Trang Nghiêm Vương Bồ Tát Thỉnh Vấn"
    },
    {
      "id": "T14n0487",
      "title": "離垢慧菩薩所問禮佛法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0487_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0487.md",
      "vietTitle": "Kinh Li Cấu Tuệ Bồ Tát Sở Vấn Lễ Phật Pháp"
    },
    {
      "id": "T14n0488",
      "title": "寶授菩薩菩提行經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0488_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0488.md",
      "vietTitle": "Kinh Bảo Thọ Bồ Tát Bồ Đề Hạnh"
    },
    {
      "id": "T14n0489",
      "title": "佛說除蓋障菩薩所問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0489_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0489.md",
      "vietTitle": "Kinh Phật Thuyết Trừ Cái Chướng Bồ Tát Sở Vấn"
    },
    {
      "id": "T14n0490",
      "title": "佛說八大菩薩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0490_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0490.md",
      "vietTitle": "Kinh Phật Thuyết Bát Đại Bồ Tát"
    },
    {
      "id": "T14n0491",
      "title": "六菩薩亦當誦持經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0491_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0491.md",
      "vietTitle": "Kinh Lục Bồ Tát Diệc Đương Tụng Trì"
    },
    {
      "id": "T14n0492a",
      "title": "佛說阿難問事佛吉凶經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0492a.md",
      "vietTitle": "Kinh Phật Thuyết A Nan Vấn Sự Phật Cát Hung"
    },
    {
      "id": "T14n0492b",
      "title": "阿難問事佛吉凶經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0492b.md",
      "vietTitle": "Kinh A Nan Vấn Sự Phật Cát Hung"
    },
    {
      "id": "T14n0493",
      "title": "佛說阿難四事經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0493_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0493.md",
      "vietTitle": "Kinh Phật Thuyết A Nan Tứ Sự"
    },
    {
      "id": "T14n0494",
      "title": "阿難七夢經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0494_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0494.md",
      "vietTitle": "Kinh A Nan Thất Mộng"
    },
    {
      "id": "T14n0495",
      "title": "佛說阿難分別經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0495_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0495.md",
      "vietTitle": "Kinh Phật Thuyết A Nan Phân Biệt"
    },
    {
      "id": "T14n0496",
      "title": "佛說大迦葉本經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0496_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0496.md",
      "vietTitle": "Kinh Phật Thuyết Đại Ca Diệp Bản"
    },
    {
      "id": "T14n0497",
      "title": "佛說摩訶迦葉度貧母經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0497_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0497.md",
      "vietTitle": "Kinh Phật Thuyết Ma Ha Ca Diệp Độ Bần Mẫu"
    },
    {
      "id": "T14n0498",
      "title": "佛說初分說經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0498_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0498.md",
      "vietTitle": "Kinh Phật Thuyết Sơ Phân Thuyết"
    },
    {
      "id": "T14n0499",
      "title": "佛為阿支羅迦葉自化作苦經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0499_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0499.md",
      "vietTitle": "Kinh Phật Vi A Chi La Ca Diệp Tự Hóa Tác Khổ"
    },
    {
      "id": "T14n0500",
      "title": "羅云忍辱經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0500_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0500.md",
      "vietTitle": "Kinh La Vân Nhẫn Nhục"
    },
    {
      "id": "T14n0501",
      "title": "佛說沙曷比丘功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0501_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0501.md",
      "vietTitle": "Kinh Phật Thuyết Sa Hạt Tỳ Kheo Công Đức"
    },
    {
      "id": "T14n0502",
      "title": "佛為年少比丘說正事經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0502_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0502.md",
      "vietTitle": "Kinh Phật Vi Niên Thiếu Tỳ Kheo Thuyết Chánh Sự"
    },
    {
      "id": "T14n0503",
      "title": "比丘避女惡名欲自殺經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0503_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0503.md",
      "vietTitle": "Kinh Tỳ Kheo Tị Nữ Ác Danh Dục Tự Sát"
    },
    {
      "id": "T14n0504",
      "title": "比丘聽施經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0504_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0504.md",
      "vietTitle": "Kinh Tỳ Kheo Thính Thí"
    },
    {
      "id": "T14n0505",
      "title": "佛說隨勇尊者經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0505_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0505.md",
      "vietTitle": "Kinh Phật Thuyết Tùy Dũng Tôn Giả"
    },
    {
      "id": "T14n0506",
      "title": "犍陀國王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0506_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0506.md",
      "vietTitle": "Kinh Kiền Đà Quốc Vương"
    },
    {
      "id": "T14n0507",
      "title": "佛說未生冤經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0507_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0507.md",
      "vietTitle": "Kinh Phật Thuyết Vị Sinh Oan"
    },
    {
      "id": "T14n0508",
      "title": "阿闍世王問五逆經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0508_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0508.md",
      "vietTitle": "Kinh A Đồ Thế Vương Vấn Ngũ Nghịch"
    },
    {
      "id": "T14n0509",
      "title": "阿闍世王授決經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0509_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0509.md",
      "vietTitle": "Kinh A Đồ Thế Vương Thọ Quyết"
    },
    {
      "id": "T14n0510",
      "title": "採花違王上佛授決號妙花經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0510_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0510.md",
      "vietTitle": "Kinh Thải Hoa Vi Vương Thượng Phật Thọ Quyết Hào Diệu Hoa"
    },
    {
      "id": "T14n0511",
      "title": "佛說蓱沙王五願經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0511_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0511.md",
      "vietTitle": "Kinh Phật Thuyết Bình Sa Vương Ngũ Nguyện"
    },
    {
      "id": "T14n0512",
      "title": "佛說淨飯王般涅槃經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0512_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0512.md",
      "vietTitle": "Kinh Phật Thuyết Tịnh Phạn Vương Bát Niết Bàn"
    },
    {
      "id": "T14n0513",
      "title": "佛說琉璃王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0513_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0513.md",
      "vietTitle": "Kinh Phật Thuyết Lưu Ly Vương"
    },
    {
      "id": "T14n0514",
      "title": "佛說諫王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0514_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0514.md",
      "vietTitle": "Kinh Phật Thuyết Gián Vương"
    },
    {
      "id": "T14n0515",
      "title": "如來示教勝軍王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0515_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0515.md",
      "vietTitle": "Kinh Như Lai Thị Giáo Thắng Quân Vương"
    },
    {
      "id": "T14n0516",
      "title": "佛說勝軍王所問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0516_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0516.md",
      "vietTitle": "Kinh Phật Thuyết Thắng Quân Vương Sở Vấn"
    },
    {
      "id": "T14n0517",
      "title": "佛說末羅王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0517_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0517.md",
      "vietTitle": "Kinh Phật Thuyết Mạt La Vương"
    },
    {
      "id": "T14n0518",
      "title": "佛說旃陀越國王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0518_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0518.md",
      "vietTitle": "Kinh Phật Thuyết Chiên Đà Việt Quốc Vương"
    },
    {
      "id": "T14n0519",
      "title": "佛說摩達國王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0519_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0519.md",
      "vietTitle": "Kinh Phật Thuyết Ma Đạt Quốc Vương"
    },
    {
      "id": "T14n0520",
      "title": "佛說薩羅國經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0520_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0520.md",
      "vietTitle": "Kinh Phật Thuyết Tát La Quốc"
    },
    {
      "id": "T14n0521",
      "title": "佛說梵摩難國王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0521_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0521.md",
      "vietTitle": "Kinh Phật Thuyết Phạm Ma Nan Quốc Vương"
    },
    {
      "id": "T14n0522",
      "title": "普達王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0522_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0522.md",
      "vietTitle": "Kinh Phổ Đạt Vương"
    },
    {
      "id": "T14n0523",
      "title": "佛說五王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0523_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0523.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Vương"
    },
    {
      "id": "T14n0524",
      "title": "佛為優填王說王法政論經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0524_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0524.md",
      "vietTitle": "Kinh Phật Vi Ưu Điền Vương Thuyết Vương Pháp Chính Luận"
    },
    {
      "id": "T14n0525",
      "title": "佛說長者子懊惱三處經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0525_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0525.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Tử Áo Não Tam Xứ"
    },
    {
      "id": "T14n0526",
      "title": "佛說長者子制經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0526_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0526.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Tử Chế"
    },
    {
      "id": "T14n0527",
      "title": "佛說逝童子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0527_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0527.md",
      "vietTitle": "Kinh Phật Thuyết Thệ Đồng Tử"
    },
    {
      "id": "T14n0528",
      "title": "佛說菩薩逝經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0528_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0528.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Thệ"
    },
    {
      "id": "T14n0529",
      "title": "佛說阿鳩留經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0529_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0529.md",
      "vietTitle": "Kinh Phật Thuyết A Cưu Lưu"
    },
    {
      "id": "T14n0530",
      "title": "佛說須摩提長者經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0530_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0530.md",
      "vietTitle": "Kinh Phật Thuyết Tu Ma Đề Trường Giả"
    },
    {
      "id": "T14n0531",
      "title": "佛說長者音悅經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0531_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0531.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Âm Duyệt"
    },
    {
      "id": "T14n0532",
      "title": "私呵昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0532_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0532.md",
      "vietTitle": "Kinh Tư Ha Muội"
    },
    {
      "id": "T14n0533",
      "title": "菩薩生地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0533_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0533.md",
      "vietTitle": "Kinh Bồ Tát Sinh Địa"
    },
    {
      "id": "T14n0534",
      "title": "佛說月光童子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0534_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0534.md",
      "vietTitle": "Kinh Phật Thuyết Nguyệt Quang Đồng Tử"
    },
    {
      "id": "T14n0535",
      "title": "佛說申日經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0535_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0535.md",
      "vietTitle": "Kinh Phật Thuyết Thân Nhật"
    },
    {
      "id": "T14n0536",
      "title": "申日兒本經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0536_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0536.md",
      "vietTitle": "Kinh Thân Nhật Nhi Bản"
    },
    {
      "id": "T14n0537",
      "title": "佛說越難經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0537_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0537.md",
      "vietTitle": "Kinh Phật Thuyết Việt Nan"
    },
    {
      "id": "T14n0538",
      "title": "佛說呵雕阿那鋡經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0538_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0538.md",
      "vietTitle": "Kinh Phật Thuyết Ha Điêu A Na Hàm"
    },
    {
      "id": "T14n0539",
      "title": "盧至長者因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0539_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0539.md",
      "vietTitle": "Kinh Lô Chí Trường Giả Nhân Duyên"
    },
    {
      "id": "T14n0540a",
      "title": "佛說樹提伽經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0540a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0540a.md",
      "vietTitle": "Kinh Phật Thuyết Thụ Đề Già"
    },
    {
      "id": "T14n0540b",
      "title": "佛說樹提伽經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0540b.md",
      "vietTitle": "Kinh Phật Thuyết Thụ Đề Già"
    },
    {
      "id": "T14n0541",
      "title": "佛說佛大僧大經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0541_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0541.md",
      "vietTitle": "Kinh Phật Thuyết Phật Đại Tăng Đại"
    },
    {
      "id": "T14n0542",
      "title": "佛說耶祇經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0542_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0542.md",
      "vietTitle": "Kinh Phật Thuyết Da Kỳ"
    },
    {
      "id": "T14n0543",
      "title": "佛說巨力長者所問大乘經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0543_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0543.md",
      "vietTitle": "Kinh Phật Thuyết Cự Lực Trường Giả Sở Vấn Đại Thừa"
    },
    {
      "id": "T14n0544",
      "title": "辯意長者子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0544_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0544.md",
      "vietTitle": "Kinh Biện Ý Trường Giả Tử"
    },
    {
      "id": "T14n0545",
      "title": "佛說德護長者經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0545_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0545.md",
      "vietTitle": "Kinh Phật Thuyết Đức Hộ Trường Giả"
    },
    {
      "id": "T14n0546",
      "title": "佛說金耀童子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0546_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0546.md",
      "vietTitle": "Kinh Phật Thuyết Kim Diệu Đồng Tử"
    },
    {
      "id": "T14n0547",
      "title": "大花嚴長者問佛那羅延力經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0547_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0547.md",
      "vietTitle": "Kinh Đại Hoa Nghiêm Trường Giả Vấn Phật Na La Diên Lực"
    },
    {
      "id": "T14n0548",
      "title": "佛說金光王童子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0548_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0548.md",
      "vietTitle": "Kinh Phật Thuyết Kim Quang Vương Đồng Tử"
    },
    {
      "id": "T14n0549",
      "title": "佛說光明童子因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0549_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0549.md",
      "vietTitle": "Kinh Phật Thuyết Quang Minh Đồng Tử Nhân Duyên"
    },
    {
      "id": "T14n0550",
      "title": "金色童子因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0550_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0550.md",
      "vietTitle": "Kinh Kim Sắc Đồng Tử Nhân Duyên"
    },
    {
      "id": "T14n0551",
      "title": "佛說摩鄧女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0551_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0551.md",
      "vietTitle": "Kinh Phật Thuyết Ma Đặng Nữ"
    },
    {
      "id": "T14n0552",
      "title": "佛說摩登女解形中六事經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0552_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0552.md",
      "vietTitle": "Kinh Phật Thuyết Ma Đăng Nữ Giải Hình Trung Lục Sự"
    },
    {
      "id": "T14n0553",
      "title": "佛說",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0553_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0553.md",
      "vietTitle": "Phật Thuyết"
    },
    {
      "id": "T14n0554",
      "title": "佛說奈女耆婆經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0554_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0554.md",
      "vietTitle": "Kinh Phật Thuyết Nại Nữ Kỳ Bà"
    },
    {
      "id": "T14n0555a",
      "title": "五母子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0555a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0555a.md",
      "vietTitle": "Kinh Ngũ Mẫu Tử"
    },
    {
      "id": "T14n0555b",
      "title": "五母子經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0555b.md",
      "vietTitle": "Kinh Ngũ Mẫu Tử"
    },
    {
      "id": "T14n0556",
      "title": "佛說七女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0556_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0556.md",
      "vietTitle": "Kinh Phật Thuyết Thất Nữ"
    },
    {
      "id": "T14n0557",
      "title": "佛說龍施女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0557_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0557.md",
      "vietTitle": "Kinh Phật Thuyết Long Thí Nữ"
    },
    {
      "id": "T14n0558",
      "title": "佛說龍施菩薩本起經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0558_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0558.md",
      "vietTitle": "Kinh Phật Thuyết Long Thí Bồ Tát Bản Khởi"
    },
    {
      "id": "T14n0559",
      "title": "佛說老女人經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0559_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0559.md",
      "vietTitle": "Kinh Phật Thuyết Lão Nữ Nhân"
    },
    {
      "id": "T14n0560",
      "title": "佛說老母女六英經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0560_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0560.md",
      "vietTitle": "Kinh Phật Thuyết Lão Mẫu Nữ Lục Anh"
    },
    {
      "id": "T14n0561",
      "title": "佛說老母經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0561_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0561.md",
      "vietTitle": "Kinh Phật Thuyết Lão Mẫu"
    },
    {
      "id": "T14n0562",
      "title": "佛說無垢賢女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0562_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0562.md",
      "vietTitle": "Kinh Phật Thuyết Vô Cấu Hiền Nữ"
    },
    {
      "id": "T14n0563",
      "title": "佛說腹中女聽經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0563_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0563.md",
      "vietTitle": "Kinh Phật Thuyết Phúc Trung Nữ Thính"
    },
    {
      "id": "T14n0564",
      "title": "佛說轉女身經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0564_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0564.md",
      "vietTitle": "Kinh Phật Thuyết Chuyển Nữ Thân"
    },
    {
      "id": "T14n0565",
      "title": "順權方便經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0565_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0565.md",
      "vietTitle": "Kinh Thuận Quyền Phương Tiện"
    },
    {
      "id": "T14n0566",
      "title": "樂瓔珞莊嚴方便品經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0566_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0566.md",
      "vietTitle": "Kinh Lạc Anh Lạc Trang Nghiêm Phương Tiện Phẩm"
    },
    {
      "id": "T14n0567",
      "title": "佛說梵志女首意經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0567_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0567.md",
      "vietTitle": "Kinh Phật Thuyết Phạm Chí Nữ Thủ Ý"
    },
    {
      "id": "T14n0568",
      "title": "有德女所問大乘經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0568_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0568.md",
      "vietTitle": "Kinh Hữu Đức Nữ Sở Vấn Đại Thừa"
    },
    {
      "id": "T14n0569",
      "title": "佛說心明經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0569_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0569.md",
      "vietTitle": "Kinh Phật Thuyết Tâm Minh"
    },
    {
      "id": "T14n0570",
      "title": "佛說賢首經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0570_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0570.md",
      "vietTitle": "Kinh Phật Thuyết Hiền Thủ"
    },
    {
      "id": "T14n0571",
      "title": "佛說婦人遇辜經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0571_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0571.md",
      "vietTitle": "Kinh Phật Thuyết Phụ Nhân Ngộ Cô"
    },
    {
      "id": "T14n0572",
      "title": "佛說長者法志妻經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0572_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0572.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Pháp Chí Thê"
    },
    {
      "id": "T14n0573",
      "title": "差摩婆帝授記經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0573_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0573.md",
      "vietTitle": "Kinh Sai Ma Bà Đế Thọ Kí"
    },
    {
      "id": "T14n0574",
      "title": "佛說堅固女經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0574_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0574.md",
      "vietTitle": "Kinh Phật Thuyết Kiên Cố Nữ"
    },
    {
      "id": "T14n0575",
      "title": "佛說大方等修多羅王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0575_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0575.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phương Đẳng Tu Đa La Vương"
    },
    {
      "id": "T14n0576",
      "title": "佛說轉有經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0576_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0576.md",
      "vietTitle": "Kinh Phật Thuyết Chuyển Hữu"
    },
    {
      "id": "T14n0577",
      "title": "佛說大乘流轉諸有經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0577_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0577.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Lưu Chuyển Chư Hữu"
    },
    {
      "id": "T14n0578",
      "title": "無垢優婆夷問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0578_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0578.md",
      "vietTitle": "Kinh Vô Cấu Ưu Bà Di Vấn"
    },
    {
      "id": "T14n0579",
      "title": "優婆夷淨行法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0579_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0579.md",
      "vietTitle": "Kinh Ưu Bà Di Tịnh Hạnh Pháp Môn"
    },
    {
      "id": "T14n0580",
      "title": "佛說長者女菴提遮師子吼了義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0580_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0580.md",
      "vietTitle": "Kinh Phật Thuyết Trường Giả Nữ Am Đề Già Sư Tử Hống Liễu Nghĩa"
    },
    {
      "id": "T14n0581",
      "title": "佛說八師經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0581_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0581.md",
      "vietTitle": "Kinh Phật Thuyết Bát Sư"
    },
    {
      "id": "T14n0582",
      "title": "佛說孫多耶致經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0582_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0582.md",
      "vietTitle": "Kinh Phật Thuyết Tôn Đa Da Trí"
    },
    {
      "id": "T14n0583",
      "title": "佛說黑氏梵志經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0583_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0583.md",
      "vietTitle": "Kinh Phật Thuyết Hắc Thị Phạm Chí"
    },
    {
      "id": "T14n0584",
      "title": "長爪梵志請問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0584_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T14n0584.md",
      "vietTitle": "Kinh Trường Trảo Phạm Chí Thỉnh Vấn"
    },
    {
      "id": "T15n0585",
      "title": "持心梵天所問經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0585.md",
      "vietTitle": "Kinh Trì Tâm Phạm Thiên Sở Vấn"
    },
    {
      "id": "T15n0586",
      "title": "思益梵天所問經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0586.md",
      "vietTitle": "Kinh Tư Ích Phạm Thiên Sở Vấn"
    },
    {
      "id": "T15n0587",
      "title": "勝思惟梵天所問經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0587.md",
      "vietTitle": "Kinh Thắng Tư Duy Phạm Thiên Sở Vấn"
    },
    {
      "id": "T15n0588",
      "title": "佛說須真天子經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0588.md",
      "vietTitle": "Kinh Phật Thuyết Tu Chân Thiên Tử"
    },
    {
      "id": "T15n0589",
      "title": "佛說魔逆經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0589.md",
      "vietTitle": "Kinh Phật Thuyết Ma Nghịch"
    },
    {
      "id": "T15n0590",
      "title": "佛說四天王經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0590.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Thiên Vương"
    },
    {
      "id": "T15n0591",
      "title": "商主天子所問經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0591.md",
      "vietTitle": "Kinh Thương Chủ Thiên Tử Sở Vấn"
    },
    {
      "id": "T15n0592",
      "title": "天請問經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0592.md",
      "vietTitle": "Kinh Thiên Thỉnh Vấn"
    },
    {
      "id": "T15n0593",
      "title": "佛為勝光天子說王法經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0593.md",
      "vietTitle": "Kinh Phật Vi Thắng Quang Thiên Tử Thuyết Vương Pháp"
    },
    {
      "id": "T15n0594",
      "title": "佛說大自在天子因地經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0594.md",
      "vietTitle": "Kinh Phật Thuyết Đại Tự Tại Thiên Tử Nhân Địa"
    },
    {
      "id": "T15n0595",
      "title": "佛說嗟韈曩法天子受三歸依獲免惡道經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0595.md",
      "vietTitle": "Kinh Phật Thuyết Ta Oạt Nẵng Pháp Thiên Tử Thọ Tam Quy Y Hoạch Miễn Ác Đạo"
    },
    {
      "id": "T15n0596",
      "title": "佛說天王太子辟羅經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0596.md",
      "vietTitle": "Kinh Phật Thuyết Thiên Vương Thái Tử Bích La"
    },
    {
      "id": "T15n0597",
      "title": "龍王兄弟經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0597.md",
      "vietTitle": "Kinh Long Vương Huynh Đệ"
    },
    {
      "id": "T15n0598",
      "title": "佛說海龍王經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0598.md",
      "vietTitle": "Kinh Phật Thuyết Hải Long Vương"
    },
    {
      "id": "T15n0599",
      "title": "佛為海龍王說法印經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0599.md",
      "vietTitle": "Kinh Phật Vi Hải Long Vương Thuyết Pháp Ấn"
    },
    {
      "id": "T15n0600",
      "title": "十善業道經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0600.md",
      "vietTitle": "Kinh Thập Thiện Nghiệp Đạo"
    },
    {
      "id": "T15n0601",
      "title": "佛為娑伽羅龍王所說大乘經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0601.md",
      "vietTitle": "Kinh Phật Vi Bà Già La Long Vương Sở Thuyết Đại Thừa"
    },
    {
      "id": "T15n0602",
      "title": "佛說大安般守意經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0602.md",
      "vietTitle": "Kinh Phật Thuyết Đại An Bát Thủ Ý"
    },
    {
      "id": "T15n0603",
      "title": "陰持入經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0603.md",
      "vietTitle": "Kinh Âm Trì Nhập"
    },
    {
      "id": "T15n0604",
      "title": "佛說禪行三十七品經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0604.md",
      "vietTitle": "Kinh Phật Thuyết Thiền Hạnh Tam Thập Thất Phẩm"
    },
    {
      "id": "T15n0605",
      "title": "禪行法想經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0605.md",
      "vietTitle": "Kinh Thiền Hạnh Pháp Tưởng"
    },
    {
      "id": "T15n0606",
      "title": "修行道地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0606_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0606.md",
      "vietTitle": "Kinh Tu Hạnh Đạo Địa"
    },
    {
      "id": "T15n0607",
      "title": "道地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0607_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0607.md",
      "vietTitle": "Kinh Đạo Địa"
    },
    {
      "id": "T15n0608",
      "title": "小道地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0608_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0608.md",
      "vietTitle": "Kinh Tiểu Đạo Địa"
    },
    {
      "id": "T15n0609",
      "title": "禪要經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0609_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0609.md",
      "vietTitle": "Kinh Thiền Yếu"
    },
    {
      "id": "T15n0610",
      "title": "佛說內身觀章句經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0610_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0610.md",
      "vietTitle": "Kinh Phật Thuyết Nội Thân Quan Chương Cú"
    },
    {
      "id": "T15n0611",
      "title": "法觀經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0611_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0611.md",
      "vietTitle": "Kinh Pháp Quan"
    },
    {
      "id": "T15n0612",
      "title": "身觀經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0612_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0612.md",
      "vietTitle": "Kinh Thân Quan"
    },
    {
      "id": "T15n0613",
      "title": "禪祕要法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0613_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0613.md",
      "vietTitle": "Kinh Thiền Bí Yếu Pháp"
    },
    {
      "id": "T15n0614",
      "title": "坐禪三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0614_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0614.md",
      "vietTitle": "Kinh Tọa Thiền Tam Muội"
    },
    {
      "id": "T15n0615",
      "title": "菩薩訶色欲法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0615_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0615.md",
      "vietTitle": "Kinh Bồ Tát Ha Sắc Dục Pháp"
    },
    {
      "id": "T15n0616",
      "title": "禪法要解",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0616_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0616.md",
      "vietTitle": "Thiền Pháp Yếu Giải"
    },
    {
      "id": "T15n0617",
      "title": "思惟略要法",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0617_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0617.md",
      "vietTitle": "Tư Duy Lược Yếu Pháp"
    },
    {
      "id": "T15n0618",
      "title": "達摩多羅禪經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0618_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0618.md",
      "vietTitle": "Kinh Đạt Ma Đa La Thiền"
    },
    {
      "id": "T15n0619",
      "title": "五門禪經要用法",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0619_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0619.md",
      "vietTitle": "Ngũ Môn Thiền Kinh Yếu Dụng Pháp"
    },
    {
      "id": "T15n0620",
      "title": "治禪病祕要法",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0620_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0620.md",
      "vietTitle": "Trị Thiền Bệnh Bí Yếu Pháp"
    },
    {
      "id": "T15n0621",
      "title": "佛說佛印三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0621_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0621.md",
      "vietTitle": "Kinh Phật Thuyết Phật Ấn Tam Muội"
    },
    {
      "id": "T15n0622",
      "title": "佛說自誓三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0622_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0622.md",
      "vietTitle": "Kinh Phật Thuyết Tự Thệ Tam Muội"
    },
    {
      "id": "T15n0623",
      "title": "佛說如來獨證自誓三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0623_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0623.md",
      "vietTitle": "Kinh Phật Thuyết Như Lai Độc Chứng Tự Thệ Tam Muội"
    },
    {
      "id": "T15n0624",
      "title": "佛說伅真陀羅所問如來三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0624_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0624.md",
      "vietTitle": "Kinh Phật Thuyết Đốn Chân Đà La Sở Vấn Như Lai Tam Muội"
    },
    {
      "id": "T15n0625",
      "title": "大樹緊那羅王所問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0625_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0625.md",
      "vietTitle": "Kinh Đại Thụ Khẩn Na La Vương Sở Vấn"
    },
    {
      "id": "T15n0626",
      "title": "佛說阿闍世王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0626_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0626.md",
      "vietTitle": "Kinh Phật Thuyết A Đồ Thế Vương"
    },
    {
      "id": "T15n0627",
      "title": "文殊支利普超三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0627_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0627.md",
      "vietTitle": "Kinh Văn Thù Chi Lợi Phổ Siêu Tam Muội"
    },
    {
      "id": "T15n0628",
      "title": "佛說未曾有正法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0628_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0628.md",
      "vietTitle": "Kinh Phật Thuyết Vị Tằng Hữu Chánh Pháp"
    },
    {
      "id": "T15n0629",
      "title": "佛說放鉢經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0629_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0629.md",
      "vietTitle": "Kinh Phật Thuyết Phóng Bát"
    },
    {
      "id": "T15n0630",
      "title": "佛說成具光明定意經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0630_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0630.md",
      "vietTitle": "Kinh Phật Thuyết Thành Cụ Quang Minh Định Ý"
    },
    {
      "id": "T15n0631",
      "title": "佛說法律三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0631_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0631.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Luật Tam Muội"
    },
    {
      "id": "T15n0632",
      "title": "佛說慧印三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0632_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0632.md",
      "vietTitle": "Kinh Phật Thuyết Tuệ Ấn Tam Muội"
    },
    {
      "id": "T15n0633",
      "title": "佛說如來智印經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0633_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0633.md",
      "vietTitle": "Kinh Phật Thuyết Như Lai Trí Ấn"
    },
    {
      "id": "T15n0634",
      "title": "佛說大乘智印經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0634_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0634.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Trí Ấn"
    },
    {
      "id": "T15n0635",
      "title": "佛說弘道廣顯三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0635_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0635.md",
      "vietTitle": "Kinh Phật Thuyết Hoằng Đạo Quảng Hiển Tam Muội"
    },
    {
      "id": "T15n0636",
      "title": "無極寶三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0636_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0636.md",
      "vietTitle": "Kinh Vô Cực Bảo Tam Muội"
    },
    {
      "id": "T15n0637",
      "title": "佛說寶如來三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0637_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0637.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Như Lai Tam Muội"
    },
    {
      "id": "T15n0638",
      "title": "佛說超日明三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0638_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0638.md",
      "vietTitle": "Kinh Phật Thuyết Siêu Nhật Minh Tam Muội"
    },
    {
      "id": "T15n0639",
      "title": "月燈三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0639_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0639.md",
      "vietTitle": "Kinh Nguyệt Đăng Tam Muội"
    },
    {
      "id": "T15n0640",
      "title": "佛說月燈三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0640_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0640.md",
      "vietTitle": "Kinh Phật Thuyết Nguyệt Đăng Tam Muội"
    },
    {
      "id": "T15n0641",
      "title": "佛說月燈三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0641_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0641.md",
      "vietTitle": "Kinh Phật Thuyết Nguyệt Đăng Tam Muội"
    },
    {
      "id": "T15n0642",
      "title": "佛說首楞嚴三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0642_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0642.md",
      "vietTitle": "Kinh Phật Thuyết Thủ Lăng Nghiêm Tam Muội"
    },
    {
      "id": "T15n0643",
      "title": "佛說觀佛三昧海經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0643_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0643.md",
      "vietTitle": "Kinh Phật Thuyết Quan Phật Tam Muội Hải"
    },
    {
      "id": "T15n0644",
      "title": "佛說金剛三昧本性清淨不壞不滅經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0644_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0644.md",
      "vietTitle": "Kinh Phật Thuyết Kim Cương Tam Muội Bản Tính Thanh Tịnh Bất Hoại Bất Diệt"
    },
    {
      "id": "T15n0645",
      "title": "不必定入定入印經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0645_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0645.md",
      "vietTitle": "Kinh Bất Tất Định Nhập Định Nhập Ấn"
    },
    {
      "id": "T15n0646",
      "title": "入定不定印經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0646_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0646.md",
      "vietTitle": "Kinh Nhập Định Bất Định Ấn"
    },
    {
      "id": "T15n0647",
      "title": "力莊嚴三昧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0647_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0647.md",
      "vietTitle": "Kinh Lực Trang Nghiêm Tam Muội"
    },
    {
      "id": "T15n0648",
      "title": "寂照神變三摩地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0648_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0648.md",
      "vietTitle": "Kinh Tịch Chiếu Thần Biến Tam Ma Địa"
    },
    {
      "id": "T15n0649",
      "title": "觀察諸法行經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0649_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0649.md",
      "vietTitle": "Kinh Quan Sát Chư Pháp Hạnh"
    },
    {
      "id": "T15n0650",
      "title": "諸法無行經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0650_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0650.md",
      "vietTitle": "Kinh Chư Pháp Vô Hạnh"
    },
    {
      "id": "T15n0651",
      "title": "佛說諸法本無經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0651_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0651.md",
      "vietTitle": "Kinh Phật Thuyết Chư Pháp Bản Vô"
    },
    {
      "id": "T15n0652",
      "title": "佛說大乘隨轉宣說諸法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0652_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0652.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Tùy Chuyển Tuyên Thuyết Chư Pháp"
    },
    {
      "id": "T15n0653",
      "title": "佛藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0653_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0653.md",
      "vietTitle": "Kinh Phật Tạng"
    },
    {
      "id": "T15n0654",
      "title": "佛說入無分別法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0654_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0654.md",
      "vietTitle": "Kinh Phật Thuyết Nhập Vô Phân Biệt Pháp Môn"
    },
    {
      "id": "T15n0655",
      "title": "佛說勝義空經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0655_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T15n0655.md",
      "vietTitle": "Kinh Phật Thuyết Thắng Nghĩa Không"
    },
    {
      "id": "T16n0656",
      "title": "菩薩瓔珞經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0656_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0656.md",
      "vietTitle": "Kinh Bồ Tát Anh Lạc"
    },
    {
      "id": "T16n0657",
      "title": "佛說華手經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0657_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0657.md",
      "vietTitle": "Kinh Phật Thuyết Hoa Thủ"
    },
    {
      "id": "T16n0658",
      "title": "寶雲經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0658_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0658.md",
      "vietTitle": "Kinh Bảo Vân"
    },
    {
      "id": "T16n0659",
      "title": "大乘寶雲經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0659_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0659.md",
      "vietTitle": "Kinh Đại Thừa Bảo Vân"
    },
    {
      "id": "T16n0660",
      "title": "佛說寶雨經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0660_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0660.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Vũ"
    },
    {
      "id": "T16n0661",
      "title": "大乘百福相經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0661_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0661.md",
      "vietTitle": "Kinh Đại Thừa Bách Phước Tướng"
    },
    {
      "id": "T16n0662",
      "title": "大乘百福莊嚴相經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0662_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0662.md",
      "vietTitle": "Kinh Đại Thừa Bách Phước Trang Nghiêm Tướng"
    },
    {
      "id": "T16n0663",
      "title": "金光明經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0663_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0663.md",
      "vietTitle": "Kinh Kim Quang Minh"
    },
    {
      "id": "T16n0664",
      "title": "合部金光明經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0664_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0664.md",
      "vietTitle": "Kinh Hợp Bộ Kim Quang Minh"
    },
    {
      "id": "T16n0665",
      "title": "金光明最勝王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0665_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0665.md",
      "vietTitle": "Kinh Kim Quang Minh Tối Thắng Vương"
    },
    {
      "id": "T16n0666",
      "title": "大方等如來藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0666_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0666.md",
      "vietTitle": "Kinh Đại Phương Đẳng Như Lai Tạng"
    },
    {
      "id": "T16n0667",
      "title": "大方廣如來藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0667_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0667.md",
      "vietTitle": "Kinh Đại Phương Quảng Như Lai Tạng"
    },
    {
      "id": "T16n0668",
      "title": "佛說不增不減經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0668_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0668.md",
      "vietTitle": "Kinh Phật Thuyết Bất Tăng Bất Giảm"
    },
    {
      "id": "T16n0669",
      "title": "佛說無上依經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0669_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0669.md",
      "vietTitle": "Kinh Phật Thuyết Vô Thượng Y"
    },
    {
      "id": "T16n0670",
      "title": "楞伽阿跋多羅寶經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0670_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0670.md",
      "vietTitle": "Kinh Lăng Già A Bạt Đa La Bảo"
    },
    {
      "id": "T16n0671",
      "title": "入楞伽經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0671_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0671.md",
      "vietTitle": "Kinh Nhập Lăng Già"
    },
    {
      "id": "T16n0672",
      "title": "大乘入楞伽經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0672_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0672.md",
      "vietTitle": "Kinh Đại Thừa Nhập Lăng Già"
    },
    {
      "id": "T16n0673",
      "title": "大乘同性經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0673_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0673.md",
      "vietTitle": "Kinh Đại Thừa Đồng Tính"
    },
    {
      "id": "T16n0674",
      "title": "證契大乘經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0674_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0674.md",
      "vietTitle": "Kinh Chứng Khế Đại Thừa"
    },
    {
      "id": "T16n0675",
      "title": "深密解脫經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0675_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0675.md",
      "vietTitle": "Kinh Thâm Mật Giải Thoát"
    },
    {
      "id": "T16n0676",
      "title": "解深密經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0676_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0676.md",
      "vietTitle": "Kinh Giải Thâm Mật"
    },
    {
      "id": "T16n0677",
      "title": "佛說解節經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0677_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0677.md",
      "vietTitle": "Kinh Phật Thuyết Giải Tiết"
    },
    {
      "id": "T16n0678",
      "title": "相續解脫地波羅蜜了義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0678_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0678.md",
      "vietTitle": "Kinh Tướng Tục Giải Thoát Địa Ba La Mật Liễu Nghĩa"
    },
    {
      "id": "T16n0679",
      "title": "相續解脫如來所作隨順處了義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0679_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0679.md",
      "vietTitle": "Kinh Tướng Tục Giải Thoát Như Lai Sở Tác Tùy Thuận Xứ Liễu Nghĩa"
    },
    {
      "id": "T16n0680",
      "title": "佛說佛地經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0680_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0680.md",
      "vietTitle": "Kinh Phật Thuyết Phật Địa"
    },
    {
      "id": "T16n0681",
      "title": "大乘密嚴經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0681_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0681.md",
      "vietTitle": "Kinh Đại Thừa Mật Nghiêm"
    },
    {
      "id": "T16n0682",
      "title": "大乘密嚴經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0682_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0682.md",
      "vietTitle": "Kinh Đại Thừa Mật Nghiêm"
    },
    {
      "id": "T16n0683",
      "title": "佛說諸德福田經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0683_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0683.md",
      "vietTitle": "Kinh Phật Thuyết Chư Đức Phước Điền"
    },
    {
      "id": "T16n0684",
      "title": "佛說父母恩難報經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0684_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0684.md",
      "vietTitle": "Kinh Phật Thuyết Phụ Mẫu Ân Nan Báo"
    },
    {
      "id": "T16n0685",
      "title": "佛說盂蘭盆經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0685_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0685.md",
      "vietTitle": "Kinh Phật Thuyết Vu Lan Bồn"
    },
    {
      "id": "T16n0686",
      "title": "佛說報恩奉盆經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0686_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0686.md",
      "vietTitle": "Kinh Phật Thuyết Báo Ân Phụng Bồn"
    },
    {
      "id": "T16n0687",
      "title": "佛說孝子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0687_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0687.md",
      "vietTitle": "Kinh Phật Thuyết Hiếu Tử"
    },
    {
      "id": "T16n0688",
      "title": "佛說未曾有經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0688_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0688.md",
      "vietTitle": "Kinh Phật Thuyết Vị Tằng Hữu"
    },
    {
      "id": "T16n0689",
      "title": "甚希有經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0689_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0689.md",
      "vietTitle": "Kinh Thậm Hy Hữu"
    },
    {
      "id": "T16n0690",
      "title": "佛說希有挍量功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0690_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0690.md",
      "vietTitle": "Kinh Phật Thuyết Hy Hữu Hiệu Lượng Công Đức"
    },
    {
      "id": "T16n0691",
      "title": "最無比經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0691_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0691.md",
      "vietTitle": "Kinh Tối Vô Tỳ"
    },
    {
      "id": "T16n0692",
      "title": "佛說作佛形像經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0692_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0692.md",
      "vietTitle": "Kinh Phật Thuyết Tác Phật Hình Tượng"
    },
    {
      "id": "T16n0693",
      "title": "佛說造立形像福報經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0693_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0693.md",
      "vietTitle": "Kinh Phật Thuyết Tạo Lập Hình Tượng Phước Báo"
    },
    {
      "id": "T16n0694",
      "title": "佛說大乘造像功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0694_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0694.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Tạo Tượng Công Đức"
    },
    {
      "id": "T16n0695",
      "title": "佛說灌洗佛形像經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0695_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0695.md",
      "vietTitle": "Kinh Phật Thuyết Quán Tẩy Phật Hình Tượng"
    },
    {
      "id": "T16n0696",
      "title": "佛說摩訶剎頭經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0696_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0696.md",
      "vietTitle": "Kinh Phật Thuyết Ma Ha Sát Đầu"
    },
    {
      "id": "T16n0697",
      "title": "佛說浴像功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0697_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0697.md",
      "vietTitle": "Kinh Phật Thuyết Dục Tượng Công Đức"
    },
    {
      "id": "T16n0698",
      "title": "浴佛功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0698_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0698.md",
      "vietTitle": "Kinh Dục Phật Công Đức"
    },
    {
      "id": "T16n0699",
      "title": "佛說造塔功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0699_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0699.md",
      "vietTitle": "Kinh Phật Thuyết Tạo Tháp Công Đức"
    },
    {
      "id": "T16n0700",
      "title": "右繞佛塔功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0700_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0700.md",
      "vietTitle": "Kinh Hữu Nhiễu Phật Tháp Công Đức"
    },
    {
      "id": "T16n0701",
      "title": "佛說溫室洗浴眾僧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0701_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0701.md",
      "vietTitle": "Kinh Phật Thuyết Ôn Thất Tẩy Dục Chúng Tăng"
    },
    {
      "id": "T16n0702",
      "title": "佛說施燈功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0702_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0702.md",
      "vietTitle": "Kinh Phật Thuyết Thí Đăng Công Đức"
    },
    {
      "id": "T16n0703",
      "title": "燈指因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0703_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0703.md",
      "vietTitle": "Kinh Đăng Chỉ Nhân Duyên"
    },
    {
      "id": "T16n0704",
      "title": "佛說樓閣正法甘露鼓經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0704_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0704.md",
      "vietTitle": "Kinh Phật Thuyết Lâu Các Chánh Pháp Cam Lộ Cổ"
    },
    {
      "id": "T16n0705",
      "title": "佛說布施經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0705_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0705.md",
      "vietTitle": "Kinh Phật Thuyết Bố Thí"
    },
    {
      "id": "T16n0706",
      "title": "佛說五大施經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0706_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0706.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Đại Thí"
    },
    {
      "id": "T16n0707",
      "title": "佛說出家功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0707_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0707.md",
      "vietTitle": "Kinh Phật Thuyết Xuất Gia Công Đức"
    },
    {
      "id": "T16n0708",
      "title": "了本生死經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0708_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0708.md",
      "vietTitle": "Kinh Liễu Bản Sinh Tử"
    },
    {
      "id": "T16n0709",
      "title": "佛說稻芉經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0709_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0709.md",
      "vietTitle": "Kinh Phật Thuyết Đạo Canh"
    },
    {
      "id": "T16n0710",
      "title": "慈氏菩薩所說大乘緣生稻",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0710_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0710.md",
      "vietTitle": "Từ Thị Bồ Tát Sở Thuyết Đại Thừa Duyên Sinh Đạo"
    },
    {
      "id": "T16n0711",
      "title": "大乘舍黎娑擔摩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0711_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0711.md",
      "vietTitle": "Kinh Đại Thừa Xá Lê Bà Đam Ma"
    },
    {
      "id": "T16n0712",
      "title": "佛說大乘稻芉經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0712_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0712.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Đạo Canh"
    },
    {
      "id": "T16n0713",
      "title": "貝多樹下思惟十二因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0713_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0713.md",
      "vietTitle": "Kinh Bối Đa Thụ Hạ Tư Duy Thập Nhị Nhân Duyên"
    },
    {
      "id": "T16n0714",
      "title": "緣起聖道經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0714_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0714.md",
      "vietTitle": "Kinh Duyên Khởi Thánh Đạo"
    },
    {
      "id": "T16n0715",
      "title": "佛說舊城喻經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0715_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0715.md",
      "vietTitle": "Kinh Phật Thuyết Cựu Thành Dụ"
    },
    {
      "id": "T16n0716",
      "title": "緣生初勝分法本經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0716_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0716.md",
      "vietTitle": "Kinh Duyên Sinh Sơ Thắng Phân Pháp Bản"
    },
    {
      "id": "T16n0717",
      "title": "分別緣起初勝法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0717_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0717.md",
      "vietTitle": "Kinh Phân Biệt Duyên Khởi Sơ Thắng Pháp Môn"
    },
    {
      "id": "T16n0718",
      "title": "佛說分別緣生經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0718_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0718.md",
      "vietTitle": "Kinh Phật Thuyết Phân Biệt Duyên Sinh"
    },
    {
      "id": "T16n0719",
      "title": "十二緣生祥瑞經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0719_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0719.md",
      "vietTitle": "Kinh Thập Nhị Duyên Sinh Tường Thụy"
    },
    {
      "id": "T16n0720",
      "title": "無明羅剎集",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0720_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T16n0720.md",
      "vietTitle": "Vô Minh La Sát Tập"
    },
    {
      "id": "T17n0721",
      "title": "正法念處經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0721_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0721.md",
      "vietTitle": "Kinh Chánh Pháp Niệm Xứ"
    },
    {
      "id": "T17n0722",
      "title": "妙法聖念處經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0722_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0722.md",
      "vietTitle": "Kinh Diệu Pháp Thánh Niệm Xứ"
    },
    {
      "id": "T17n0723",
      "title": "分別業報略經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0723_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0723.md",
      "vietTitle": "Kinh Phân Biệt Nghiệp Báo Lược"
    },
    {
      "id": "T17n0724",
      "title": "佛說罪業應報教化地獄經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0724_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0724.md",
      "vietTitle": "Kinh Phật Thuyết Tội Nghiệp Ứng Báo Giáo Hóa Địa Ngục"
    },
    {
      "id": "T17n0725",
      "title": "佛說六道伽陀經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0725_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0725.md",
      "vietTitle": "Kinh Phật Thuyết Lục Đạo Già Đà"
    },
    {
      "id": "T17n0726",
      "title": "六趣輪迴經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0726_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0726.md",
      "vietTitle": "Kinh Lục Thú Luân Hồi"
    },
    {
      "id": "T17n0727",
      "title": "十不善業道經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0727_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0727.md",
      "vietTitle": "Kinh Thập Bất Thiện Nghiệp Đạo"
    },
    {
      "id": "T17n0728",
      "title": "諸法集要經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0728_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0728.md",
      "vietTitle": "Kinh Chư Pháp Tập Yếu"
    },
    {
      "id": "T17n0729",
      "title": "佛說分別善惡所起經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0729_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0729.md",
      "vietTitle": "Kinh Phật Thuyết Phân Biệt Thiện Ác Sở Khởi"
    },
    {
      "id": "T17n0730",
      "title": "佛說處處經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0730_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0730.md",
      "vietTitle": "Kinh Phật Thuyết Xứ Xứ"
    },
    {
      "id": "T17n0731",
      "title": "佛說十八泥犁經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0731_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0731.md",
      "vietTitle": "Kinh Phật Thuyết Thập Bát Nê Lê"
    },
    {
      "id": "T17n0732",
      "title": "佛說罵意經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0732_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0732.md",
      "vietTitle": "Kinh Phật Thuyết Mạ Ý"
    },
    {
      "id": "T17n0733",
      "title": "佛說堅意經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0733_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0733.md",
      "vietTitle": "Kinh Phật Thuyết Kiên Ý"
    },
    {
      "id": "T17n0734",
      "title": "佛說鬼問目連經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0734_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0734.md",
      "vietTitle": "Kinh Phật Thuyết Quỷ Vấn Mục Liên"
    },
    {
      "id": "T17n0735",
      "title": "佛說四願經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0735_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0735.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Nguyện"
    },
    {
      "id": "T17n0736",
      "title": "佛說四自侵經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0736_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0736.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Tự Xâm"
    },
    {
      "id": "T17n0737",
      "title": "所欲致患經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0737_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0737.md",
      "vietTitle": "Kinh Sở Dục Trí Hoạn"
    },
    {
      "id": "T17n0738",
      "title": "佛說分別經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0738_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0738.md",
      "vietTitle": "Kinh Phật Thuyết Phân Biệt"
    },
    {
      "id": "T17n0739",
      "title": "佛說慢法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0739_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0739.md",
      "vietTitle": "Kinh Phật Thuyết Mạn Pháp"
    },
    {
      "id": "T17n0740",
      "title": "佛說頞多和多耆經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0740_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0740.md",
      "vietTitle": "Kinh Phật Thuyết Át Đa Hòa Đa Kỳ"
    },
    {
      "id": "T17n0741",
      "title": "五苦章句經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0741_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0741.md",
      "vietTitle": "Kinh Ngũ Khổ Chương Cú"
    },
    {
      "id": "T17n0742",
      "title": "佛說自愛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0742_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0742.md",
      "vietTitle": "Kinh Phật Thuyết Tự Ái"
    },
    {
      "id": "T17n0743",
      "title": "佛說忠心經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0743_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0743.md",
      "vietTitle": "Kinh Phật Thuyết Trung Tâm"
    },
    {
      "id": "T17n0744",
      "title": "佛說除恐災患經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0744_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0744.md",
      "vietTitle": "Kinh Phật Thuyết Trừ Khủng Tai Hoạn"
    },
    {
      "id": "T17n0745",
      "title": "佛說雜藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0745_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0745.md",
      "vietTitle": "Kinh Phật Thuyết Tạp Tạng"
    },
    {
      "id": "T17n0746",
      "title": "餓鬼報應經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0746_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0746.md",
      "vietTitle": "Kinh Ngạ Quỷ Báo Ứng"
    },
    {
      "id": "T17n0747a",
      "title": "佛說罪福報應經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0747a.md",
      "vietTitle": "Kinh Phật Thuyết Tội Phước Báo Ứng"
    },
    {
      "id": "T17n0747b",
      "title": "佛說輪轉五道罪福報應經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0747b.md",
      "vietTitle": "Kinh Phật Thuyết Luân Chuyển Ngũ Đạo Tội Phước Báo Ứng"
    },
    {
      "id": "T17n0748",
      "title": "佛說護淨經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0748_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0748.md",
      "vietTitle": "Kinh Phật Thuyết Hộ Tịnh"
    },
    {
      "id": "T17n0749",
      "title": "佛說因緣僧護經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0749_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0749.md",
      "vietTitle": "Kinh Phật Thuyết Nhân Duyên Tăng Hộ"
    },
    {
      "id": "T17n0750",
      "title": "沙彌羅經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0750_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0750.md",
      "vietTitle": "Kinh Sa Di La"
    },
    {
      "id": "T17n0751a",
      "title": "佛說五無反復經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0751a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0751a.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Vô Phản Phục"
    },
    {
      "id": "T17n0751b",
      "title": "佛說五無返復經",
      "division": "09",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0751b.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Vô Phản Phục"
    },
    {
      "id": "T17n0752",
      "title": "佛說五無返復經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0752_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0752.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Vô Phản Phục"
    },
    {
      "id": "T17n0753",
      "title": "十二品生死經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0753_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0753.md",
      "vietTitle": "Kinh Thập Nhị Phẩm Sinh Tử"
    },
    {
      "id": "T17n0754",
      "title": "佛說未曾有因緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0754_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0754.md",
      "vietTitle": "Kinh Phật Thuyết Vị Tằng Hữu Nhân Duyên"
    },
    {
      "id": "T17n0755",
      "title": "佛說淨意優婆塞所問經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0755_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0755.md",
      "vietTitle": "Kinh Phật Thuyết Tịnh Ý Ưu Bà Tắc Sở Vấn"
    },
    {
      "id": "T17n0756",
      "title": "佛說八無暇有暇經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0756_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0756.md",
      "vietTitle": "Kinh Phật Thuyết Bát Vô Hạ Hữu Hạ"
    },
    {
      "id": "T17n0757",
      "title": "佛說身毛喜豎經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0757_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0757.md",
      "vietTitle": "Kinh Phật Thuyết Thân Mao Hỷ Thụ"
    },
    {
      "id": "T17n0758",
      "title": "佛說諸行有為經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0758_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0758.md",
      "vietTitle": "Kinh Phật Thuyết Chư Hạnh Hữu Vi"
    },
    {
      "id": "T17n0759",
      "title": "佛說較量壽命經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0759_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0759.md",
      "vietTitle": "Kinh Phật Thuyết Giác Lượng Thọ Mạng"
    },
    {
      "id": "T17n0760",
      "title": "惟日雜難經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0760_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0760.md",
      "vietTitle": "Kinh Duy Nhật Tạp Nan"
    },
    {
      "id": "T17n0761",
      "title": "佛說法集經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0761_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0761.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Tập"
    },
    {
      "id": "T17n0762",
      "title": "佛說決定義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0762_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0762.md",
      "vietTitle": "Kinh Phật Thuyết Quyết Định Nghĩa"
    },
    {
      "id": "T17n0763",
      "title": "佛說法乘義決定經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0763_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0763.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Thừa Nghĩa Quyết Định"
    },
    {
      "id": "T17n0764",
      "title": "佛說法集名數經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0764_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0764.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Tập Danh Sổ"
    },
    {
      "id": "T17n0765",
      "title": "本事經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0765_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0765.md",
      "vietTitle": "Kinh Bản Sự"
    },
    {
      "id": "T17n0766",
      "title": "佛說法身經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0766_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0766.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Thân"
    },
    {
      "id": "T17n0767",
      "title": "佛說三品弟子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0767_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0767.md",
      "vietTitle": "Kinh Phật Thuyết Tam Phẩm Đệ Tử"
    },
    {
      "id": "T17n0768",
      "title": "三慧經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0768_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0768.md",
      "vietTitle": "Kinh Tam Tuệ"
    },
    {
      "id": "T17n0769",
      "title": "佛說四輩經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0769_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0769.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Bối"
    },
    {
      "id": "T17n0770",
      "title": "佛說四不可得經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0770_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0770.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Bất Khả Đắc"
    },
    {
      "id": "T17n0771",
      "title": "四品學法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0771_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0771.md",
      "vietTitle": "Kinh Tứ Phẩm Học Pháp"
    },
    {
      "id": "T17n0772",
      "title": "大乘四法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0772_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0772.md",
      "vietTitle": "Kinh Đại Thừa Tứ Pháp"
    },
    {
      "id": "T17n0773",
      "title": "佛說菩薩修行四法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0773_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0773.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Tu Hạnh Tứ Pháp"
    },
    {
      "id": "T17n0774",
      "title": "大乘四法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0774_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0774.md",
      "vietTitle": "Kinh Đại Thừa Tứ Pháp"
    },
    {
      "id": "T17n0775",
      "title": "佛說四無所畏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0775_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0775.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Vô Sở Úy"
    },
    {
      "id": "T17n0776",
      "title": "佛說四品法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0776_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0776.md",
      "vietTitle": "Kinh Phật Thuyết Tứ Phẩm Pháp Môn"
    },
    {
      "id": "T17n0777",
      "title": "佛說賢者五福德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0777_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0777.md",
      "vietTitle": "Kinh Phật Thuyết Hiền Giả Ngũ Phước Đức"
    },
    {
      "id": "T17n0778",
      "title": "佛說菩薩內習六波羅蜜經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0778_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0778.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Nội Tập Lục Ba La Mật"
    },
    {
      "id": "T17n0779",
      "title": "佛說八大人覺經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0779_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0779.md",
      "vietTitle": "Kinh Phật Thuyết Bát Đại Nhân Giác"
    },
    {
      "id": "T17n0780",
      "title": "佛說十力經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0780_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0780.md",
      "vietTitle": "Kinh Phật Thuyết Thập Lực"
    },
    {
      "id": "T17n0781",
      "title": "佛說佛十力經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0781_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0781.md",
      "vietTitle": "Kinh Phật Thuyết Phật Thập Lực"
    },
    {
      "id": "T17n0782",
      "title": "佛說十號經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0782_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0782.md",
      "vietTitle": "Kinh Phật Thuyết Thập Hào"
    },
    {
      "id": "T17n0783",
      "title": "佛說十二頭陀經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0783_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0783.md",
      "vietTitle": "Kinh Phật Thuyết Thập Nhị Đầu Đà"
    },
    {
      "id": "T17n0784",
      "title": "四十二章經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0784_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0784.md",
      "vietTitle": "Kinh Tứ Thập Nhị Chương"
    },
    {
      "id": "T17n0785",
      "title": "得道梯橙錫杖經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0785_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0785.md",
      "vietTitle": "Kinh Đắc Đạo Thê Trừng Tích Trượng"
    },
    {
      "id": "T17n0786",
      "title": "佛說木槵子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0786_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0786.md",
      "vietTitle": "Kinh Phật Thuyết Mộc Hoạn Tử"
    },
    {
      "id": "T17n0787",
      "title": "曼殊室利呪藏中校量數珠功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0787_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0787.md",
      "vietTitle": "Kinh Mạn Thù Thất Lợi Chú Tạng Trung Hiệu Lượng Sổ Châu Công Đức"
    },
    {
      "id": "T17n0788",
      "title": "佛說校量數珠功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0788_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0788.md",
      "vietTitle": "Kinh Phật Thuyết Hiệu Lượng Sổ Châu Công Đức"
    },
    {
      "id": "T17n0789",
      "title": "金剛頂瑜伽念珠經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0789_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0789.md",
      "vietTitle": "Kinh Kim Cương Đính Du Già Niệm Châu"
    },
    {
      "id": "T17n0790",
      "title": "佛說孛經抄",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0790_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0790.md",
      "vietTitle": "Phật Thuyết Bột Kinh Sao"
    },
    {
      "id": "T17n0791",
      "title": "佛說出家緣經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0791_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0791.md",
      "vietTitle": "Kinh Phật Thuyết Xuất Gia Duyên"
    },
    {
      "id": "T17n0792",
      "title": "佛說法受塵經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0792_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0792.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Thọ Trần"
    },
    {
      "id": "T17n0793",
      "title": "佛說佛醫經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0793_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0793.md",
      "vietTitle": "Kinh Phật Thuyết Phật Y"
    },
    {
      "id": "T17n0794a",
      "title": "佛說時非時經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0794a.md",
      "vietTitle": "Kinh Phật Thuyết Thời Phi Thời"
    },
    {
      "id": "T17n0794b",
      "title": "佛說時非時經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0794b.md",
      "vietTitle": "Kinh Phật Thuyết Thời Phi Thời"
    },
    {
      "id": "T17n0795",
      "title": "佛治身經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0795_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0795.md",
      "vietTitle": "Kinh Phật Trị Thân"
    },
    {
      "id": "T17n0796",
      "title": "佛說見正經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0796_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0796.md",
      "vietTitle": "Kinh Phật Thuyết Kiến Chánh"
    },
    {
      "id": "T17n0797a",
      "title": "佛說貧窮老公經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0797a.md",
      "vietTitle": "Kinh Phật Thuyết Bần Cùng Lão Công"
    },
    {
      "id": "T17n0797b",
      "title": "佛說貧窮老公經",
      "division": "09",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0797b.md",
      "vietTitle": "Kinh Phật Thuyết Bần Cùng Lão Công"
    },
    {
      "id": "T17n0798",
      "title": "佛說進學經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0798_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0798.md",
      "vietTitle": "Kinh Phật Thuyết Tiến Học"
    },
    {
      "id": "T17n0799",
      "title": "佛說略教誡經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0799_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0799.md",
      "vietTitle": "Kinh Phật Thuyết Lược Giáo Giới"
    },
    {
      "id": "T17n0800",
      "title": "佛說無上處經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0800_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0800.md",
      "vietTitle": "Kinh Phật Thuyết Vô Thượng Xứ"
    },
    {
      "id": "T17n0801",
      "title": "佛說無常經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0801_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0801.md",
      "vietTitle": "Kinh Phật Thuyết Vô Thường"
    },
    {
      "id": "T17n0802",
      "title": "佛說信解智力經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0802_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0802.md",
      "vietTitle": "Kinh Phật Thuyết Tín Giải Trí Lực"
    },
    {
      "id": "T17n0803",
      "title": "佛說清淨心經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0803_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0803.md",
      "vietTitle": "Kinh Phật Thuyết Thanh Tịnh Tâm"
    },
    {
      "id": "T17n0804",
      "title": "佛說解憂經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0804_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0804.md",
      "vietTitle": "Kinh Phật Thuyết Giải Ưu"
    },
    {
      "id": "T17n0805",
      "title": "佛說栴檀樹經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0805_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0805.md",
      "vietTitle": "Kinh Phật Thuyết Chiên Đàn Thụ"
    },
    {
      "id": "T17n0806",
      "title": "佛說枯樹經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0806_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0806.md",
      "vietTitle": "Kinh Phật Thuyết Khô Thụ"
    },
    {
      "id": "T17n0807",
      "title": "佛說內藏百寶經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0807_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0807.md",
      "vietTitle": "Kinh Phật Thuyết Nội Tạng Bách Bảo"
    },
    {
      "id": "T17n0808",
      "title": "佛說犢子經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0808_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0808.md",
      "vietTitle": "Kinh Phật Thuyết Độc Tử"
    },
    {
      "id": "T17n0809",
      "title": "佛說乳光佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0809_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0809.md",
      "vietTitle": "Kinh Phật Thuyết Nhũ Quang Phật"
    },
    {
      "id": "T17n0810",
      "title": "諸佛要集經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0810_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0810.md",
      "vietTitle": "Kinh Chư Phật Yếu Tập"
    },
    {
      "id": "T17n0811",
      "title": "佛說決定總持經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0811_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0811.md",
      "vietTitle": "Kinh Phật Thuyết Quyết Định Tổng Trì"
    },
    {
      "id": "T17n0812",
      "title": "菩薩行五十緣身經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0812_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0812.md",
      "vietTitle": "Kinh Bồ Tát Hạnh Ngũ Thập Duyên Thân"
    },
    {
      "id": "T17n0813",
      "title": "佛說無希望經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0813_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0813.md",
      "vietTitle": "Kinh Phật Thuyết Vô Hy Vọng"
    },
    {
      "id": "T17n0814",
      "title": "佛說象腋經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0814_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0814.md",
      "vietTitle": "Kinh Phật Thuyết Tượng Dịch"
    },
    {
      "id": "T17n0815",
      "title": "佛昇忉利天為母說法經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0815_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0815.md",
      "vietTitle": "Kinh Phật Thăng Đao Lợi Thiên Vi Mẫu Thuyết Pháp"
    },
    {
      "id": "T17n0816",
      "title": "佛說道神足無極變化經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0816_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0816.md",
      "vietTitle": "Kinh Phật Thuyết Đạo Thần Túc Vô Cực Biến Hóa"
    },
    {
      "id": "T17n0817",
      "title": "佛說大淨法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0817_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0817.md",
      "vietTitle": "Kinh Phật Thuyết Đại Tịnh Pháp Môn"
    },
    {
      "id": "T17n0818",
      "title": "大莊嚴法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0818_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0818.md",
      "vietTitle": "Kinh Đại Trang Nghiêm Pháp Môn"
    },
    {
      "id": "T17n0819",
      "title": "佛說法常住經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0819_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0819.md",
      "vietTitle": "Kinh Phật Thuyết Pháp Thường Trụ"
    },
    {
      "id": "T17n0820",
      "title": "佛說演道俗業經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0820_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0820.md",
      "vietTitle": "Kinh Phật Thuyết Diễn Đạo Tục Nghiệp"
    },
    {
      "id": "T17n0821",
      "title": "大方廣如來祕密藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0821_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0821.md",
      "vietTitle": "Kinh Đại Phương Quảng Như Lai Bí Mật Tạng"
    },
    {
      "id": "T17n0822",
      "title": "佛說諸法勇王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0822_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0822.md",
      "vietTitle": "Kinh Phật Thuyết Chư Pháp Dũng Vương"
    },
    {
      "id": "T17n0823",
      "title": "佛說一切法高王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0823_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0823.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Pháp Cao Vương"
    },
    {
      "id": "T17n0824",
      "title": "諸法最上王經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0824_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0824.md",
      "vietTitle": "Kinh Chư Pháp Tối Thượng Vương"
    },
    {
      "id": "T17n0825",
      "title": "佛說甚深大迴向經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0825_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0825.md",
      "vietTitle": "Kinh Phật Thuyết Thậm Thâm Đại Hồi Hướng"
    },
    {
      "id": "T17n0826",
      "title": "弟子死復生經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0826_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0826.md",
      "vietTitle": "Kinh Đệ Tử Tử Phục Sinh"
    },
    {
      "id": "T17n0827",
      "title": "佛說懈怠耕者經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0827_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0827.md",
      "vietTitle": "Kinh Phật Thuyết Giải Đãi Canh Giả"
    },
    {
      "id": "T17n0828",
      "title": "無字寶篋經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0828_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0828.md",
      "vietTitle": "Kinh Vô Tự Bảo Khiếp"
    },
    {
      "id": "T17n0829",
      "title": "大乘離文字普光明藏經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0829_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0829.md",
      "vietTitle": "Kinh Đại Thừa Li Văn Tự Phổ Quang Minh Tạng"
    },
    {
      "id": "T17n0830",
      "title": "大乘遍照光明藏無字法門經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0830_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0830.md",
      "vietTitle": "Kinh Đại Thừa Biến Chiếu Quang Minh Tạng Vô Tự Pháp Môn"
    },
    {
      "id": "T17n0831",
      "title": "謗佛經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0831_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0831.md",
      "vietTitle": "Kinh Báng Phật"
    },
    {
      "id": "T17n0832",
      "title": "佛語經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0832_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0832.md",
      "vietTitle": "Kinh Phật Ngữ"
    },
    {
      "id": "T17n0833",
      "title": "第一義法勝經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0833_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0833.md",
      "vietTitle": "Kinh Đệ Nhất Nghĩa Pháp Thắng"
    },
    {
      "id": "T17n0834",
      "title": "大威燈光仙人問疑經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0834_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0834.md",
      "vietTitle": "Kinh Đại Uy Đăng Quang Tiên Nhân Vấn Nghi"
    },
    {
      "id": "T17n0835",
      "title": "如來師子吼經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0835_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0835.md",
      "vietTitle": "Kinh Như Lai Sư Tử Hống"
    },
    {
      "id": "T17n0836",
      "title": "大方廣師子吼經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0836_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0836.md",
      "vietTitle": "Kinh Đại Phương Quảng Sư Tử Hống"
    },
    {
      "id": "T17n0837",
      "title": "佛說出生菩提心經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0837_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0837.md",
      "vietTitle": "Kinh Phật Thuyết Xuất Sinh Bồ Đề Tâm"
    },
    {
      "id": "T17n0838",
      "title": "佛說發菩提心破諸魔經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0838_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0838.md",
      "vietTitle": "Kinh Phật Thuyết Phát Bồ Đề Tâm Phá Chư Ma"
    },
    {
      "id": "T17n0839",
      "title": "占察善惡業報經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0839_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0839.md",
      "vietTitle": "Kinh Chiêm Sát Thiện Ác Nghiệp Báo"
    },
    {
      "id": "T17n0840",
      "title": "稱讚大乘功德經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0840_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0840.md",
      "vietTitle": "Kinh Xưng Tán Đại Thừa Công Đức"
    },
    {
      "id": "T17n0841",
      "title": "說妙法決定業障經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0841_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0841.md",
      "vietTitle": "Kinh Thuyết Diệu Pháp Quyết Định Nghiệp Chướng"
    },
    {
      "id": "T17n0842",
      "title": "大方廣圓覺修多羅了義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0842_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0842.md",
      "vietTitle": "Kinh Đại Phương Quảng Viên Giác Tu Đa La Liễu Nghĩa"
    },
    {
      "id": "T17n0843",
      "title": "佛說大乘不思議神通境界經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0843_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0843.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Bất Tư Nghị Thần Thông Cảnh Giới"
    },
    {
      "id": "T17n0844",
      "title": "佛說大方廣未曾有經善巧方便品",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0844_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0844.md",
      "vietTitle": "Phật Thuyết Đại Phương Quảng Vị Tằng Hữu Kinh Thiện Xảo Phương Tiện Phẩm"
    },
    {
      "id": "T17n0845",
      "title": "佛說尊那經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0845_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0845.md",
      "vietTitle": "Kinh Phật Thuyết Tôn Na"
    },
    {
      "id": "T17n0846",
      "title": "外道問聖大乘法無我義經",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0846_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0846.md",
      "vietTitle": "Kinh Ngoại Đạo Vấn Thánh Đại Thừa Pháp Vô Ngã Nghĩa"
    },
    {
      "id": "T17n0847",
      "title": "大乘修行菩薩行門諸經要集",
      "division": "09",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0847_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/09_Kinh_Tap/T17n0847.md",
      "vietTitle": "Đại Thừa Tu Hạnh Bồ Tát Hạnh Môn Chư Kinh Yếu Tập"
    },
    {
      "id": "T18n0848",
      "title": "大毘盧遮那成佛神變加持經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0848.md",
      "vietTitle": "Kinh Đại Tỳ Lô Già Na Thành Phật Thần Biến Gia Trì"
    },
    {
      "id": "T18n0849",
      "title": "大毘盧遮那佛說要略念誦經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0849.md",
      "vietTitle": "Kinh Đại Tỳ Lô Già Na Phật Thuyết Yếu Lược Niệm Tụng"
    },
    {
      "id": "T18n0850",
      "title": "攝大毘盧遮那成佛神變加持經入蓮華胎藏海會悲生曼荼攞廣大念誦儀軌供養方便會",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0850.md",
      "vietTitle": "Nhiếp Đại Tỳ Lô Già Na Thành Phật Thần Biến Gia Trì Kinh Nhập Liên Hoa Thai Tạng Hải Hội Bi Sinh Mạn Đồ La Quảng Đại Niệm Tụng Nghi Quỹ Cúng Dưỡng Phương Tiện Hội"
    },
    {
      "id": "T18n0851",
      "title": "大毘盧遮那經廣大儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0851.md",
      "vietTitle": "Đại Tỳ Lô Già Na Kinh Quảng Đại Nghi Quỹ"
    },
    {
      "id": "T18n0852a",
      "title": "大毘盧遮那成佛神變加持經蓮華胎藏悲生曼荼羅廣大成就儀軌供養方便會",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0852a.md",
      "vietTitle": "Đại Tỳ Lô Già Na Thành Phật Thần Biến Gia Trì Kinh Liên Hoa Thai Tạng Bi Sinh Mạn Đồ La Quảng Đại Thành Tựu Nghi Quỹ Cúng Dưỡng Phương Tiện Hội"
    },
    {
      "id": "T18n0852b",
      "title": "大毘盧舍那成佛神變加持經蓮華胎藏悲生曼荼羅廣大成就儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0852b.md",
      "vietTitle": "Đại Tỳ Lô Xá Na Thành Phật Thần Biến Gia Trì Kinh Liên Hoa Thai Tạng Bi Sinh Mạn Đồ La Quảng Đại Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T18n0853",
      "title": "大毘盧遮那成佛神變加持經蓮華胎藏菩提幢標幟普通真言藏廣大成就瑜伽",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0853.md",
      "vietTitle": "Đại Tỳ Lô Già Na Thành Phật Thần Biến Gia Trì Kinh Liên Hoa Thai Tạng Bồ Đề Tràng Tiêu Xí Phổ Thông Chân Ngôn Tạng Quảng Đại Thành Tựu Du Già"
    },
    {
      "id": "T18n0854",
      "title": "胎藏梵字真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0854.md",
      "vietTitle": "Thai Tạng Phạm Tự Chân Ngôn"
    },
    {
      "id": "T18n0855",
      "title": "青龍寺軌記",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0855.md",
      "vietTitle": "Thanh Long Tự Quỹ Kí"
    },
    {
      "id": "T18n0856",
      "title": "大毘盧遮那成佛神變加持經略示七支念誦隨行法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0856.md",
      "vietTitle": "Đại Tỳ Lô Già Na Thành Phật Thần Biến Gia Trì Kinh Lược Thị Thất Chi Niệm Tụng Tùy Hạnh Pháp"
    },
    {
      "id": "T18n0857",
      "title": "大日經略攝念誦隨行法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0857.md",
      "vietTitle": "Đại Nhật Kinh Lược Nhiếp Niệm Tụng Tùy Hạnh Pháp"
    },
    {
      "id": "T18n0858",
      "title": "大毘盧遮那略要速疾門五支念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0858.md",
      "vietTitle": "Đại Tỳ Lô Già Na Lược Yếu Tốc Tật Môn Ngũ Chi Niệm Tụng Pháp"
    },
    {
      "id": "T18n0859",
      "title": "供養儀式",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0859.md",
      "vietTitle": "Cúng Dưỡng Nghi Thức"
    },
    {
      "id": "T18n0860",
      "title": "大日經持誦次第儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0860.md",
      "vietTitle": "Đại Nhật Kinh Trì Tụng Thứ Đệ Nghi Quỹ"
    },
    {
      "id": "T18n0861",
      "title": "毘盧遮那五字真言修習儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0861.md",
      "vietTitle": "Tỳ Lô Già Na Ngũ Tự Chân Ngôn Tu Tập Nghi Quỹ"
    },
    {
      "id": "T18n0862",
      "title": "阿闍梨大曼荼攞灌頂儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0862.md",
      "vietTitle": "A Đồ Lê Đại Mạn Đồ La Quán Đính Nghi Quỹ"
    },
    {
      "id": "T18n0863",
      "title": "大毘盧遮那經阿闍梨真實智品中阿闍梨住阿字觀門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0863.md",
      "vietTitle": "Đại Tỳ Lô Già Na Kinh A Đồ Lê Chân Thật Trí Phẩm Trung A Đồ Lê Trụ A Tự Quan Môn"
    },
    {
      "id": "T18n0864A",
      "title": "大日如來劍印",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0864A.md",
      "vietTitle": "Đại Nhật Như Lai Kiếm Ấn"
    },
    {
      "id": "T18n0864B",
      "title": "胎藏金剛教法名號",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0864B.md",
      "vietTitle": "Thai Tạng Kim Cương Giáo Pháp Danh Hào"
    },
    {
      "id": "T18n0865",
      "title": "金剛頂一切如來真實攝大乘現證大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0865.md",
      "vietTitle": "Kinh Kim Cương Đính Nhất Thiết Như Lai Chân Thật Nhiếp Đại Thừa Hiện Chứng Đại Giáo Vương"
    },
    {
      "id": "T18n0866",
      "title": "金剛頂瑜伽中略出念誦經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0866.md",
      "vietTitle": "Kinh Kim Cương Đính Du Già Trung Lược Xuất Niệm Tụng"
    },
    {
      "id": "T18n0867",
      "title": "金剛峰樓閣一切瑜伽瑜祇經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0867.md",
      "vietTitle": "Kinh Kim Cương Phong Lâu Các Nhất Thiết Du Già Du Kỳ"
    },
    {
      "id": "T18n0868",
      "title": "諸佛境界攝真實經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0868.md",
      "vietTitle": "Kinh Chư Phật Cảnh Giới Nhiếp Chân Thật"
    },
    {
      "id": "T18n0869",
      "title": "金剛頂經瑜伽十八會指歸",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0869.md",
      "vietTitle": "Kim Cương Đính Kinh Du Già Thập Bát Hội Chỉ Quy"
    },
    {
      "id": "T18n0870",
      "title": "略述金剛頂瑜伽分別聖位修證法門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0870.md",
      "vietTitle": "Lược Thuật Kim Cương Đính Du Già Phân Biệt Thánh Vị Tu Chứng Pháp Môn"
    },
    {
      "id": "T18n0871",
      "title": "金剛頂瑜伽略述三十七尊心要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0871.md",
      "vietTitle": "Kim Cương Đính Du Già Lược Thuật Tam Thập Thất Tôn Tâm Yếu"
    },
    {
      "id": "T18n0872",
      "title": "金剛頂瑜伽三十七尊出生義",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0872.md",
      "vietTitle": "Kim Cương Đính Du Già Tam Thập Thất Tôn Xuất Sinh Nghĩa"
    },
    {
      "id": "T18n0873",
      "title": "金剛頂蓮華部心念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0873.md",
      "vietTitle": "Kim Cương Đính Liên Hoa Bộ Tâm Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T18n0874",
      "title": "金剛頂一切如來真實攝大乘現證大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0874.md",
      "vietTitle": "Kinh Kim Cương Đính Nhất Thiết Như Lai Chân Thật Nhiếp Đại Thừa Hiện Chứng Đại Giáo Vương"
    },
    {
      "id": "T18n0875",
      "title": "蓮華部心念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0875.md",
      "vietTitle": "Liên Hoa Bộ Tâm Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T18n0876",
      "title": "金剛頂經瑜伽修習毘盧遮那三摩地法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0876.md",
      "vietTitle": "Kim Cương Đính Kinh Du Già Tu Tập Tỳ Lô Già Na Tam Ma Địa Pháp"
    },
    {
      "id": "T18n0877",
      "title": "金剛頂經毘盧遮那一百八尊法身契印",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0877.md",
      "vietTitle": "Kim Cương Đính Kinh Tỳ Lô Già Na Nhất Bách Bát Tôn Pháp Thân Khế Ấn"
    },
    {
      "id": "T18n0878",
      "title": "金剛頂經金剛界大道場毘盧遮那如來自受用身內證智眷屬法身異名佛最上乘祕密三摩地禮懺文",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0878.md",
      "vietTitle": "Kim Cương Đính Kinh Kim Cương Giới Đại Đạo Tràng Tỳ Lô Già Na Như Lai Tự Thọ Dụng Thân Nội Chứng Trí Quyến Chúc Pháp Thân Dị Danh Phật Tối Thượng Thừa Bí Mật Tam Ma Địa Lễ Sám Văn"
    },
    {
      "id": "T18n0879",
      "title": "金剛頂瑜伽三十七尊禮",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0879.md",
      "vietTitle": "Kim Cương Đính Du Già Tam Thập Thất Tôn Lễ"
    },
    {
      "id": "T18n0880",
      "title": "瑜伽金剛頂經釋字母品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0880.md",
      "vietTitle": "Du Già Kim Cương Đính Kinh Thích Tự Mẫu Phẩm"
    },
    {
      "id": "T18n0881",
      "title": "賢劫十六尊",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0881.md",
      "vietTitle": "Hiền Kiếp Thập Lục Tôn"
    },
    {
      "id": "T18n0882",
      "title": "佛說一切如來真實攝大乘現證三昧大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0882.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai Chân Thật Nhiếp Đại Thừa Hiện Chứng Tam Muội Đại Giáo Vương"
    },
    {
      "id": "T18n0883",
      "title": "佛說祕密三昧大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0883.md",
      "vietTitle": "Kinh Phật Thuyết Bí Mật Tam Muội Đại Giáo Vương"
    },
    {
      "id": "T18n0884",
      "title": "佛說祕密相經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0884.md",
      "vietTitle": "Kinh Phật Thuyết Bí Mật Tướng"
    },
    {
      "id": "T18n0885",
      "title": "佛說一切如來金剛三業最上祕密大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0885.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai Kim Cương Tam Nghiệp Tối Thượng Bí Mật Đại Giáo Vương"
    },
    {
      "id": "T18n0886",
      "title": "佛說金剛場莊嚴般若波羅蜜多教中一分",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0886.md",
      "vietTitle": "Phật Thuyết Kim Cương Tràng Trang Nghiêm Bát Nhã Ba La Mật Đa Giáo Trung Nhất Phân"
    },
    {
      "id": "T18n0887",
      "title": "佛說無二平等最上瑜伽大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0887.md",
      "vietTitle": "Kinh Phật Thuyết Vô Nhị Bình Đẳng Tối Thượng Du Già Đại Giáo Vương"
    },
    {
      "id": "T18n0888",
      "title": "一切祕密最上名義大教王儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0888.md",
      "vietTitle": "Nhất Thiết Bí Mật Tối Thượng Danh Nghĩa Đại Giáo Vương Nghi Quỹ"
    },
    {
      "id": "T18n0889",
      "title": "一切如來大祕密王未曾有最上微妙大曼拏羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0889.md",
      "vietTitle": "Kinh Nhất Thiết Như Lai Đại Bí Mật Vương Vị Tằng Hữu Tối Thượng Vi Diệu Đại Mạn Noa La"
    },
    {
      "id": "T18n0890",
      "title": "佛說瑜伽大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0890.md",
      "vietTitle": "Kinh Phật Thuyết Du Già Đại Giáo Vương"
    },
    {
      "id": "T18n0891",
      "title": "佛說幻化網大瑜伽教十忿怒明王大明觀想儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0891.md",
      "vietTitle": "Kinh Phật Thuyết Huyễn Hóa Võng Đại Du Già Giáo Thập Phẫn Nộ Minh Vương Đại Minh Quan Tưởng Nghi Quỹ"
    },
    {
      "id": "T18n0892",
      "title": "佛說大悲空智金剛大教王儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0892.md",
      "vietTitle": "Kinh Phật Thuyết Đại Bi Không Trí Kim Cương Đại Giáo Vương Nghi Quỹ"
    },
    {
      "id": "T18n0893a",
      "title": "蘇悉地羯羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0893a.md",
      "vietTitle": "Kinh Tô Tất Địa Yết La"
    },
    {
      "id": "T18n0893b",
      "title": "蘇悉地羯羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0893b.md",
      "vietTitle": "Kinh Tô Tất Địa Yết La"
    },
    {
      "id": "T18n0893c",
      "title": "蘇悉地羯羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0893c.md",
      "vietTitle": "Kinh Tô Tất Địa Yết La"
    },
    {
      "id": "T18n0894a",
      "title": "蘇悉地羯羅供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0894a.md",
      "vietTitle": "Tô Tất Địa Yết La Cúng Dưỡng Pháp"
    },
    {
      "id": "T18n0894b",
      "title": "蘇悉地羯羅供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0894b.md",
      "vietTitle": "Tô Tất Địa Yết La Cúng Dưỡng Pháp"
    },
    {
      "id": "T18n0895a",
      "title": "蘇婆呼童子請問經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0895a.md",
      "vietTitle": "Kinh Tô Bà Hô Đồng Tử Thỉnh Vấn"
    },
    {
      "id": "T18n0895b",
      "title": "蘇婆呼童子請問經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0895b.md",
      "vietTitle": "Kinh Tô Bà Hô Đồng Tử Thỉnh Vấn"
    },
    {
      "id": "T18n0896",
      "title": "妙臂菩薩所問經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0896.md",
      "vietTitle": "Kinh Diệu Tý Bồ Tát Sở Vấn"
    },
    {
      "id": "T18n0897",
      "title": "蕤呬耶經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0897.md",
      "vietTitle": "Kinh Nhuy Hí Da"
    },
    {
      "id": "T18n0898",
      "title": "佛說毘奈耶經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0898.md",
      "vietTitle": "Kinh Phật Thuyết Tỳ Nại Da"
    },
    {
      "id": "T18n0899",
      "title": "清淨法身毘盧遮那心地法門成就一切陀羅尼三種悉地",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0899.md",
      "vietTitle": "Thanh Tịnh Pháp Thân Tỳ Lô Già Na Tâm Địa Pháp Môn Thành Tựu Nhất Thiết Đà La Ni Tam Chủng Tất Địa"
    },
    {
      "id": "T18n0900",
      "title": "十八契印",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0900.md",
      "vietTitle": "Thập Bát Khế Ấn"
    },
    {
      "id": "T18n0901",
      "title": "陀羅尼集經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0901.md",
      "vietTitle": "Kinh Đà La Ni Tập"
    },
    {
      "id": "T18n0902",
      "title": "總釋陀羅尼義讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0902.md",
      "vietTitle": "Tổng Thích Đà La Ni Nghĩa Tán"
    },
    {
      "id": "T18n0903",
      "title": "都部陀羅尼目",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0903.md",
      "vietTitle": "Đô Bộ Đà La Ni Mục"
    },
    {
      "id": "T18n0904",
      "title": "念誦結護法普通諸部",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0904.md",
      "vietTitle": "Niệm Tụng Kết Hộ Pháp Phổ Thông Chư Bộ"
    },
    {
      "id": "T18n0905",
      "title": "三種悉地破地獄轉業障出三界祕密陀羅尼法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0905.md",
      "vietTitle": "Tam Chủng Tất Địa Phá Địa Ngục Chuyển Nghiệp Chướng Xuất Tam Giới Bí Mật Đà La Ni Pháp"
    },
    {
      "id": "T18n0906",
      "title": "佛頂尊勝心破地獄轉業障出三界祕密三身佛果三種悉地真言儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0906.md",
      "vietTitle": "Phật Đính Tôn Thắng Tâm Phá Địa Ngục Chuyển Nghiệp Chướng Xuất Tam Giới Bí Mật Tam Thân Phật Quả Tam Chủng Tất Địa Chân Ngôn Nghi Quỹ"
    },
    {
      "id": "T18n0907",
      "title": "佛頂尊勝心破地獄轉業障出三界祕密陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0907.md",
      "vietTitle": "Phật Đính Tôn Thắng Tâm Phá Địa Ngục Chuyển Nghiệp Chướng Xuất Tam Giới Bí Mật Đà La Ni"
    },
    {
      "id": "T18n0908",
      "title": "金剛頂瑜伽護摩儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0908.md",
      "vietTitle": "Kim Cương Đính Du Già Hộ Ma Nghi Quỹ"
    },
    {
      "id": "T18n0909",
      "title": "金剛頂瑜伽護摩儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0909.md",
      "vietTitle": "Kim Cương Đính Du Già Hộ Ma Nghi Quỹ"
    },
    {
      "id": "T18n0910",
      "title": "梵天擇地法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0910.md",
      "vietTitle": "Phạm Thiên Trạch Địa Pháp"
    },
    {
      "id": "T18n0911",
      "title": "建立曼荼羅及揀擇地法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0911.md",
      "vietTitle": "Kiến Lập Mạn Đồ La Cập Giản Trạch Địa Pháp"
    },
    {
      "id": "T18n0912",
      "title": "建立曼荼羅護摩儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0912.md",
      "vietTitle": "Kiến Lập Mạn Đồ La Hộ Ma Nghi Quỹ"
    },
    {
      "id": "T18n0913",
      "title": "火",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0913.md",
      "vietTitle": "Hỏa"
    },
    {
      "id": "T18n0914",
      "title": "火吽軌別錄",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0914.md",
      "vietTitle": "Hỏa Hồng Quỹ Biệt Lục"
    },
    {
      "id": "T18n0915",
      "title": "受菩提心戒儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0915.md",
      "vietTitle": "Thọ Bồ Đề Tâm Giới Nghi"
    },
    {
      "id": "T18n0916",
      "title": "受五戒八戒文",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0916.md",
      "vietTitle": "Thọ Ngũ Giới Bát Giới Văn"
    },
    {
      "id": "T18n0917",
      "title": "無畏三藏禪要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T18n0917.md",
      "vietTitle": "Vô Úy Tam Tạng Thiền Yếu"
    },
    {
      "id": "T19n0918",
      "title": "諸佛心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0918.md",
      "vietTitle": "Kinh Chư Phật Tâm Đà La Ni"
    },
    {
      "id": "T19n0919",
      "title": "諸佛心印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0919.md",
      "vietTitle": "Kinh Chư Phật Tâm Ấn Đà La Ni"
    },
    {
      "id": "T19n0920",
      "title": "佛心經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0920.md",
      "vietTitle": "Kinh Phật Tâm"
    },
    {
      "id": "T19n0921",
      "title": "阿閦如來念誦供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0921.md",
      "vietTitle": "A Súc Như Lai Niệm Tụng Cúng Dưỡng Pháp"
    },
    {
      "id": "T19n0922",
      "title": "藥師琉璃光如來消災除難念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0922.md",
      "vietTitle": "Dược Sư Lưu Ly Quang Như Lai Tiêu Tai Trừ Nan Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0923",
      "title": "藥師如來觀行儀軌法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0923.md",
      "vietTitle": "Dược Sư Như Lai Quan Hạnh Nghi Quỹ Pháp"
    },
    {
      "id": "T19n0924A",
      "title": "藥師如來念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0924A.md",
      "vietTitle": "Dược Sư Như Lai Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0924B",
      "title": "藥師如來念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0924B.md",
      "vietTitle": "Dược Sư Như Lai Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0924C",
      "title": "藥師儀軌一具",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0924C.md",
      "vietTitle": "Dược Sư Nghi Quỹ Nhất Cụ"
    },
    {
      "id": "T19n0925",
      "title": "藥師琉璃光王七佛本願功德經念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0925.md",
      "vietTitle": "Dược Sư Lưu Ly Quang Vương Thất Phật Bản Nguyện Công Đức Kinh Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0926",
      "title": "藥師琉璃光王七佛本願功德經念誦儀軌供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0926.md",
      "vietTitle": "Dược Sư Lưu Ly Quang Vương Thất Phật Bản Nguyện Công Đức Kinh Niệm Tụng Nghi Quỹ Cúng Dưỡng Pháp"
    },
    {
      "id": "T19n0927",
      "title": "藥師七佛供養儀軌如意王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0927.md",
      "vietTitle": "Kinh Dược Sư Thất Phật Cúng Dưỡng Nghi Quỹ Như Ý Vương"
    },
    {
      "id": "T19n0928",
      "title": "修藥師儀軌布壇法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0928.md",
      "vietTitle": "Tu Dược Sư Nghi Quỹ Bố Đàn Pháp"
    },
    {
      "id": "T19n0929",
      "title": "淨瑠璃淨土摽",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0929.md",
      "vietTitle": "Tịnh Lưu Ly Tịnh Thổ Phiếu"
    },
    {
      "id": "T19n0930",
      "title": "無量壽如來觀行供養儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0930.md",
      "vietTitle": "Vô Lượng Thọ Như Lai Quan Hạnh Cúng Dưỡng Nghi Quỹ"
    },
    {
      "id": "T19n0931",
      "title": "金剛頂經觀自在王如來修行法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0931.md",
      "vietTitle": "Kim Cương Đính Kinh Quan Tự Tại Vương Như Lai Tu Hạnh Pháp"
    },
    {
      "id": "T19n0932",
      "title": "金剛頂經瑜伽觀自在王如來修行法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0932.md",
      "vietTitle": "Kim Cương Đính Kinh Du Già Quan Tự Tại Vương Như Lai Tu Hạnh Pháp"
    },
    {
      "id": "T19n0933",
      "title": "九品往生阿彌陀三摩地集陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0933.md",
      "vietTitle": "Kinh Cửu Phẩm Vãng Sinh A Di Đà Tam Ma Địa Tập Đà La Ni"
    },
    {
      "id": "T19n0934",
      "title": "佛說無量功德陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0934.md",
      "vietTitle": "Kinh Phật Thuyết Vô Lượng Công Đức Đà La Ni"
    },
    {
      "id": "T19n0935",
      "title": "極樂願文",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0935.md",
      "vietTitle": "Cực Lạc Nguyện Văn"
    },
    {
      "id": "T19n0936",
      "title": "大乘無量壽經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0936.md",
      "vietTitle": "Kinh Đại Thừa Vô Lượng Thọ"
    },
    {
      "id": "T19n0937",
      "title": "佛說大乘聖無量壽決定光明王如來陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0937.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Thánh Vô Lượng Thọ Quyết Định Quang Minh Vương Như Lai Đà La Ni"
    },
    {
      "id": "T19n0938",
      "title": "釋迦文尼佛金剛一乘修行儀軌法品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0938.md",
      "vietTitle": "Thích Ca Văn Ni Phật Kim Cương Nhất Thừa Tu Hạnh Nghi Quỹ Pháp Phẩm"
    },
    {
      "id": "T19n0939",
      "title": "佛說大乘觀想曼拏羅淨諸惡趣經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0939.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Quan Tưởng Mạn Noa La Tịnh Chư Ác Thú"
    },
    {
      "id": "T19n0940",
      "title": "佛說帝釋巖祕密成就儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0940.md",
      "vietTitle": "Phật Thuyết Đế Thích Nham Bí Mật Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T19n0941",
      "title": "釋迦牟尼佛成道在菩提樹降魔讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0941.md",
      "vietTitle": "Thích Ca Mâu Ni Phật Thành Đạo Tại Bồ Đề Thụ Hàng Ma Tán"
    },
    {
      "id": "T19n0942",
      "title": "釋迦佛讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0942.md",
      "vietTitle": "Thích Ca Phật Tán"
    },
    {
      "id": "T19n0943",
      "title": "佛說無能勝幡王如來莊嚴陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0943.md",
      "vietTitle": "Kinh Phật Thuyết Vô Năng Thắng Phan Vương Như Lai Trang Nghiêm Đà La Ni"
    },
    {
      "id": "T19n0944A",
      "title": "大佛頂如來放光悉怛多鉢怛囉陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0944A.md",
      "vietTitle": "Đại Phật Đính Như Lai Phóng Quang Tất Đát Đa Bát Đát La Đà La Ni"
    },
    {
      "id": "T19n0944B",
      "title": "大佛頂大陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0944B.md",
      "vietTitle": "Đại Phật Đính Đại Đà La Ni"
    },
    {
      "id": "T19n0945",
      "title": "大佛頂如來密因修證了義諸菩薩萬行首楞嚴經",
      "division": "10",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0945_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0945.md",
      "vietTitle": "Kinh Đại Phật Đảnh Như Lai Mật Nhân Tu Chứng Liễu Nghĩa Chư Bồ Tát Vạn Hạnh Thủ Lăng Nghiêm"
    },
    {
      "id": "T19n0946",
      "title": "大佛頂廣聚陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0946.md",
      "vietTitle": "Kinh Đại Phật Đính Quảng Tụ Đà La Ni"
    },
    {
      "id": "T19n0947",
      "title": "大佛頂如來放光悉怛多般怛羅大神力都攝一切呪王陀羅尼經大威德最勝金輪三昧呪品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0947.md",
      "vietTitle": "Đại Phật Đính Như Lai Phóng Quang Tất Đát Đa Bát Đát La Đại Thần Lực Đô Nhiếp Nhất Thiết Chú Vương Đà La Ni Kinh Đại Uy Đức Tối Thắng Kim Luân Tam Muội Chú Phẩm"
    },
    {
      "id": "T19n0948",
      "title": "金輪王佛頂要略念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0948.md",
      "vietTitle": "Kim Luân Vương Phật Đính Yếu Lược Niệm Tụng Pháp"
    },
    {
      "id": "T19n0949",
      "title": "奇特最勝金輪佛頂念誦儀軌法要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0949.md",
      "vietTitle": "Kỳ Đặc Tối Thắng Kim Luân Phật Đính Niệm Tụng Nghi Quỹ Pháp Yếu"
    },
    {
      "id": "T19n0950",
      "title": "菩提場所說一字頂輪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0950.md",
      "vietTitle": "Kinh Bồ Đề Tràng Sở Thuyết Nhất Tự Đính Luân Vương"
    },
    {
      "id": "T19n0951",
      "title": "一字佛頂輪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0951.md",
      "vietTitle": "Kinh Nhất Tự Phật Đính Luân Vương"
    },
    {
      "id": "T19n0952",
      "title": "五佛頂三昧陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0952.md",
      "vietTitle": "Kinh Ngũ Phật Đính Tam Muội Đà La Ni"
    },
    {
      "id": "T19n0953",
      "title": "一字奇特佛頂經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0953.md",
      "vietTitle": "Kinh Nhất Tự Kỳ Đặc Phật Đính"
    },
    {
      "id": "T19n0954A",
      "title": "一字頂輪王念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0954A.md",
      "vietTitle": "Nhất Tự Đính Luân Vương Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0954B",
      "title": "一字頂輪王念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0954B.md",
      "vietTitle": "Nhất Tự Đính Luân Vương Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0955",
      "title": "一字頂輪王瑜伽觀行儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0955.md",
      "vietTitle": "Nhất Tự Đính Luân Vương Du Già Quan Hạnh Nghi Quỹ"
    },
    {
      "id": "T19n0956",
      "title": "大陀羅尼末法中一字心呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0956.md",
      "vietTitle": "Kinh Đại Đà La Ni Mạt Pháp Trung Nhất Tự Tâm Chú"
    },
    {
      "id": "T19n0957",
      "title": "金剛頂一字頂輪王瑜伽一切時處念誦成佛儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0957.md",
      "vietTitle": "Kim Cương Đính Nhất Tự Đính Luân Vương Du Già Nhất Thiết Thời Xứ Niệm Tụng Thành Phật Nghi Quỹ"
    },
    {
      "id": "T19n0958",
      "title": "金剛頂經一字頂輪王儀軌音義",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0958.md",
      "vietTitle": "Kim Cương Đính Kinh Nhất Tự Đính Luân Vương Nghi Quỹ Âm Nghĩa"
    },
    {
      "id": "T19n0959",
      "title": "頂輪王大曼荼羅灌頂儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0959.md",
      "vietTitle": "Đính Luân Vương Đại Mạn Đồ La Quán Đính Nghi Quỹ"
    },
    {
      "id": "T19n0960",
      "title": "一切如來說佛頂輪王一百八名讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0960.md",
      "vietTitle": "Nhất Thiết Như Lai Thuyết Phật Đính Luân Vương Nhất Bách Bát Danh Tán"
    },
    {
      "id": "T19n0961",
      "title": "如意寶珠轉輪祕密現身成佛金輪呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0961.md",
      "vietTitle": "Kinh Như Ý Bảo Châu Chuyển Luân Bí Mật Hiện Thân Thành Phật Kim Luân Chú Vương"
    },
    {
      "id": "T19n0962",
      "title": "寶悉地成佛陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0962.md",
      "vietTitle": "Kinh Bảo Tất Địa Thành Phật Đà La Ni"
    },
    {
      "id": "T19n0963",
      "title": "佛說熾盛光大威德消災吉祥陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0963.md",
      "vietTitle": "Kinh Phật Thuyết Sí Thịnh Quang Đại Uy Đức Tiêu Tai Cát Tường Đà La Ni"
    },
    {
      "id": "T19n0964",
      "title": "佛說大威德金輪佛頂熾盛光如來消除一切災難陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0964.md",
      "vietTitle": "Kinh Phật Thuyết Đại Uy Đức Kim Luân Phật Đính Sí Thịnh Quang Như Lai Tiêu Trừ Nhất Thiết Tai Nan Đà La Ni"
    },
    {
      "id": "T19n0965",
      "title": "大妙金剛大甘露軍拏利焰鬘熾盛佛頂經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0965.md",
      "vietTitle": "Kinh Đại Diệu Kim Cương Đại Cam Lộ Quân Noa Lợi Diễm Man Sí Thịnh Phật Đính"
    },
    {
      "id": "T19n0966",
      "title": "大聖妙吉祥菩薩說除災教令法輪",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0966.md",
      "vietTitle": "Đại Thánh Diệu Cát Tường Bồ Tát Thuyết Trừ Tai Giáo Lệnh Pháp Luân"
    },
    {
      "id": "T19n0967",
      "title": "佛頂尊勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0967.md",
      "vietTitle": "Kinh Phật Đính Tôn Thắng Đà La Ni"
    },
    {
      "id": "T19n0968",
      "title": "佛頂尊勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0968.md",
      "vietTitle": "Kinh Phật Đính Tôn Thắng Đà La Ni"
    },
    {
      "id": "T19n0969",
      "title": "佛頂最勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0969.md",
      "vietTitle": "Kinh Phật Đính Tối Thắng Đà La Ni"
    },
    {
      "id": "T19n0970",
      "title": "最勝佛頂陀羅尼淨除業障呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0970.md",
      "vietTitle": "Kinh Tối Thắng Phật Đính Đà La Ni Tịnh Trừ Nghiệp Chướng Chú"
    },
    {
      "id": "T19n0971",
      "title": "佛說佛頂尊勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0971.md",
      "vietTitle": "Kinh Phật Thuyết Phật Đính Tôn Thắng Đà La Ni"
    },
    {
      "id": "T19n0972",
      "title": "佛頂尊勝陀羅尼念誦儀軌法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0972.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni Niệm Tụng Nghi Quỹ Pháp"
    },
    {
      "id": "T19n0973",
      "title": "尊勝佛頂脩瑜伽法軌儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0973.md",
      "vietTitle": "Tôn Thắng Phật Đính Tu Du Già Pháp Quỹ Nghi"
    },
    {
      "id": "T19n0974A",
      "title": "最勝佛頂陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974A.md",
      "vietTitle": "Kinh Tối Thắng Phật Đính Đà La Ni"
    },
    {
      "id": "T19n0974B",
      "title": "佛頂尊勝陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974B.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni"
    },
    {
      "id": "T19n0974C",
      "title": "加句靈驗佛頂尊勝陀羅尼記",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974C.md",
      "vietTitle": "Gia Cú Linh Nghiệm Phật Đính Tôn Thắng Đà La Ni Kí"
    },
    {
      "id": "T19n0974D",
      "title": "佛頂尊勝陀羅尼注義",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974D.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni Chú Nghĩa"
    },
    {
      "id": "T19n0974E",
      "title": "佛頂尊勝陀羅尼真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974E.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni Chân Ngôn"
    },
    {
      "id": "T19n0974F",
      "title": "佛頂尊勝陀羅尼別法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0974F.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni Biệt Pháp"
    },
    {
      "id": "T19n0975",
      "title": "白傘蓋大佛頂王最勝無比大威德金剛無礙大道場陀羅尼念誦法要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0975.md",
      "vietTitle": "Bạch Tán Cái Đại Phật Đính Vương Tối Thắng Vô Tỳ Đại Uy Đức Kim Cương Vô Ngại Đại Đạo Tràng Đà La Ni Niệm Tụng Pháp Yếu"
    },
    {
      "id": "T19n0976",
      "title": "佛頂大白傘蓋陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0976.md",
      "vietTitle": "Kinh Phật Đính Đại Bạch Tán Cái Đà La Ni"
    },
    {
      "id": "T19n0977",
      "title": "佛說大白傘蓋總持陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0977.md",
      "vietTitle": "Kinh Phật Thuyết Đại Bạch Tán Cái Tổng Trì Đà La Ni"
    },
    {
      "id": "T19n0978",
      "title": "佛說一切如來烏瑟膩沙最勝總持經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0978.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai Ô Sắt Nị Sa Tối Thắng Tổng Trì"
    },
    {
      "id": "T19n0979",
      "title": "于瑟抳沙毘左野陀囉尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0979.md",
      "vietTitle": "Vu Sắt Nễ Sa Tỳ Tả Dã Đà La Ni"
    },
    {
      "id": "T19n0980",
      "title": "大勝金剛佛頂念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0980.md",
      "vietTitle": "Đại Thắng Kim Cương Phật Đính Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0981",
      "title": "大毘盧遮那佛眼修行儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0981.md",
      "vietTitle": "Đại Tỳ Lô Già Na Phật Nhãn Tu Hạnh Nghi Quỹ"
    },
    {
      "id": "T19n0982",
      "title": "佛母大孔雀明王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0982.md",
      "vietTitle": "Kinh Phật Mẫu Đại Khổng Tước Minh Vương"
    },
    {
      "id": "T19n0983A",
      "title": "佛說大孔雀明王畫像壇場儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0983A.md",
      "vietTitle": "Phật Thuyết Đại Khổng Tước Minh Vương Họa Tượng Đàn Tràng Nghi Quỹ"
    },
    {
      "id": "T19n0983B",
      "title": "孔雀經真言等梵本",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0983B.md",
      "vietTitle": "Khổng Tước Kinh Chân Ngôn Đẳng Phạm Bản"
    },
    {
      "id": "T19n0984",
      "title": "孔雀王呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0984.md",
      "vietTitle": "Kinh Khổng Tước Vương Chú"
    },
    {
      "id": "T19n0985",
      "title": "佛說大孔雀呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0985.md",
      "vietTitle": "Kinh Phật Thuyết Đại Khổng Tước Chú Vương"
    },
    {
      "id": "T19n0986",
      "title": "大金色孔雀王呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0986.md",
      "vietTitle": "Kinh Đại Kim Sắc Khổng Tước Vương Chú"
    },
    {
      "id": "T19n0987",
      "title": "佛說大金色孔雀王呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0987.md",
      "vietTitle": "Kinh Phật Thuyết Đại Kim Sắc Khổng Tước Vương Chú"
    },
    {
      "id": "T19n0988",
      "title": "孔雀王呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0988.md",
      "vietTitle": "Kinh Khổng Tước Vương Chú"
    },
    {
      "id": "T19n0989",
      "title": "大雲輪請雨經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0989.md",
      "vietTitle": "Kinh Đại Vân Luân Thỉnh Vũ"
    },
    {
      "id": "T19n0990",
      "title": "大雲經祈雨壇法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0990.md",
      "vietTitle": "Đại Vân Kinh Kỳ Vũ Đàn Pháp"
    },
    {
      "id": "T19n0991",
      "title": "大雲輪請雨經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0991.md",
      "vietTitle": "Kinh Đại Vân Luân Thỉnh Vũ"
    },
    {
      "id": "T19n0992",
      "title": "大方等大雲經請雨品第六十四",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0992.md",
      "vietTitle": "Đại Phương Đẳng Đại Vân Kinh Thỉnh Vũ Phẩm Đệ Lục Thập Tứ"
    },
    {
      "id": "T19n0993",
      "title": "大雲經請雨品第六十四",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0993.md",
      "vietTitle": "Đại Vân Kinh Thỉnh Vũ Phẩm Đệ Lục Thập Tứ"
    },
    {
      "id": "T19n0994",
      "title": "仁王護國般若波羅蜜多經陀羅尼念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0994.md",
      "vietTitle": "Nhân Vương Hộ Quốc Bát Nhã Ba La Mật Đa Kinh Đà La Ni Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T19n0995",
      "title": "仁王般若念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0995.md",
      "vietTitle": "Nhân Vương Bát Nhã Niệm Tụng Pháp"
    },
    {
      "id": "T19n0996",
      "title": "仁王般若陀羅尼釋",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0996.md",
      "vietTitle": "Nhân Vương Bát Nhã Đà La Ni Thích"
    },
    {
      "id": "T19n0997",
      "title": "守護國界主陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0997.md",
      "vietTitle": "Kinh Thủ Hộ Quốc Giới Chủ Đà La Ni"
    },
    {
      "id": "T19n0998",
      "title": "佛說迴向輪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0998.md",
      "vietTitle": "Kinh Phật Thuyết Hồi Hướng Luân"
    },
    {
      "id": "T19n0999",
      "title": "佛說守護大千國土經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n0999.md",
      "vietTitle": "Kinh Phật Thuyết Thủ Hộ Đại Thiên Quốc Thổ"
    },
    {
      "id": "T19n1000",
      "title": "成就妙法蓮華經王瑜伽觀智儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1000.md",
      "vietTitle": "Thành Tựu Diệu Pháp Liên Hoa Kinh Vương Du Già Quan Trí Nghi Quỹ"
    },
    {
      "id": "T19n1001",
      "title": "法華曼荼羅威儀形色法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1001.md",
      "vietTitle": "Kinh Pháp Hoa Mạn Đồ La Uy Nghi Hình Sắc Pháp"
    },
    {
      "id": "T19n1002",
      "title": "不空羂索毘盧遮那佛大灌頂光真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1002.md",
      "vietTitle": "Bất Không Quyến Sách Tỳ Lô Già Na Phật Đại Quán Đính Quang Chân Ngôn"
    },
    {
      "id": "T19n1003",
      "title": "大樂金剛不空真實三昧耶經般若波羅蜜多理趣釋",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1003.md",
      "vietTitle": "Đại Lạc Kim Cương Bất Không Chân Thật Tam Muội Da Kinh Bát Nhã Ba La Mật Đa Lý Thú Thích"
    },
    {
      "id": "T19n1004",
      "title": "般若波羅蜜多理趣經大樂不空三昧真實金剛薩埵菩薩等一十七聖大曼荼羅義述",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1004.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Lý Thú Kinh Đại Lạc Bất Không Tam Muội Chân Thật Kim Cương Tát Đóa Bồ Tát Đẳng Nhất Thập Thất Thánh Đại Mạn Đồ La Nghĩa Thuật"
    },
    {
      "id": "T19n1005A",
      "title": "大寶廣博樓閣善住祕密陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1005A.md",
      "vietTitle": "Kinh Đại Bảo Quảng Bác Lâu Các Thiện Trụ Bí Mật Đà La Ni"
    },
    {
      "id": "T19n1005B",
      "title": "寶樓閣經梵字真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1005B.md",
      "vietTitle": "Bảo Lâu Các Kinh Phạm Tự Chân Ngôn"
    },
    {
      "id": "T19n1006",
      "title": "廣大寶樓閣善住祕密陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1006.md",
      "vietTitle": "Kinh Quảng Đại Bảo Lâu Các Thiện Trụ Bí Mật Đà La Ni"
    },
    {
      "id": "T19n1007",
      "title": "牟梨曼陀羅呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1007.md",
      "vietTitle": "Kinh Mâu Lê Mạn Đà La Chú"
    },
    {
      "id": "T19n1008",
      "title": "菩提場莊嚴陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1008.md",
      "vietTitle": "Kinh Bồ Đề Tràng Trang Nghiêm Đà La Ni"
    },
    {
      "id": "T19n1009",
      "title": "出生無邊門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1009.md",
      "vietTitle": "Kinh Xuất Sinh Vô Biên Môn Đà La Ni"
    },
    {
      "id": "T19n1010",
      "title": "佛說出生無邊門陀羅尼儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1010.md",
      "vietTitle": "Phật Thuyết Xuất Sinh Vô Biên Môn Đà La Ni Nghi Quỹ"
    },
    {
      "id": "T19n1011",
      "title": "佛說無量門微密持經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1011.md",
      "vietTitle": "Kinh Phật Thuyết Vô Lượng Môn Vi Mật Trì"
    },
    {
      "id": "T19n1012",
      "title": "佛說出生無量門持經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1012.md",
      "vietTitle": "Kinh Phật Thuyết Xuất Sinh Vô Lượng Môn Trì"
    },
    {
      "id": "T19n1013",
      "title": "阿難陀目佉尼呵離陀經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1013.md",
      "vietTitle": "Kinh A Nan Đà Mục Khư Ni Ha Li Đà"
    },
    {
      "id": "T19n1014",
      "title": "無量門破魔陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1014.md",
      "vietTitle": "Kinh Vô Lượng Môn Phá Ma Đà La Ni"
    },
    {
      "id": "T19n1015",
      "title": "佛說阿難陀目佉尼呵離陀隣尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1015.md",
      "vietTitle": "Kinh Phật Thuyết A Nan Đà Mục Khư Ni Ha Li Đà Lân Ni"
    },
    {
      "id": "T19n1016",
      "title": "舍利弗陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1016.md",
      "vietTitle": "Kinh Xá Lợi Phất Đà La Ni"
    },
    {
      "id": "T19n1017",
      "title": "佛說一向出生菩薩經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1017.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Hướng Xuất Sinh Bồ Tát"
    },
    {
      "id": "T19n1018",
      "title": "出生無邊門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1018.md",
      "vietTitle": "Kinh Xuất Sinh Vô Biên Môn Đà La Ni"
    },
    {
      "id": "T19n1019",
      "title": "大方廣佛華嚴經入法界品四十二字觀門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1019.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Nhập Pháp Giới Phẩm Tứ Thập Nhị Tự Quan Môn"
    },
    {
      "id": "T19n1020",
      "title": "大方廣佛花嚴經入法界品頓證毘盧遮那法身字輪瑜伽儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1020.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Nhập Pháp Giới Phẩm Đốn Chứng Tỳ Lô Già Na Pháp Thân Tự Luân Du Già Nghi Quỹ"
    },
    {
      "id": "T19n1021",
      "title": "華嚴經心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1021.md",
      "vietTitle": "Hoa Nghiêm Kinh Tâm Đà La Ni"
    },
    {
      "id": "T19n1022A",
      "title": "一切如來心祕密全身舍利寶篋印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1022A.md",
      "vietTitle": "Kinh Nhất Thiết Như Lai Tâm Bí Mật Toàn Thân Xá Lợi Bảo Khiếp Ấn Đà La Ni"
    },
    {
      "id": "T19n1022B",
      "title": "一切如來心祕密全身舍利寶篋印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1022B.md",
      "vietTitle": "Kinh Nhất Thiết Như Lai Tâm Bí Mật Toàn Thân Xá Lợi Bảo Khiếp Ấn Đà La Ni"
    },
    {
      "id": "T19n1023",
      "title": "一切如來正法祕密篋印心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1023.md",
      "vietTitle": "Kinh Nhất Thiết Như Lai Chánh Pháp Bí Mật Khiếp Ấn Tâm Đà La Ni"
    },
    {
      "id": "T19n1024",
      "title": "無垢淨光大陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1024.md",
      "vietTitle": "Kinh Vô Cấu Tịnh Quang Đại Đà La Ni"
    },
    {
      "id": "T19n1025",
      "title": "佛頂放無垢光明入普門觀察一切如來心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1025.md",
      "vietTitle": "Kinh Phật Đính Phóng Vô Cấu Quang Minh Nhập Phổ Môn Quan Sát Nhất Thiết Như Lai Tâm Đà La Ni"
    },
    {
      "id": "T19n1026",
      "title": "佛說造塔延命功德經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1026.md",
      "vietTitle": "Kinh Phật Thuyết Tạo Tháp Diên Mạng Công Đức"
    },
    {
      "id": "T19n1027a",
      "title": "金剛光焰止風雨陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1027a.md",
      "vietTitle": "Kinh Kim Cương Quang Diễm Chỉ Phong Vũ Đà La Ni"
    },
    {
      "id": "T19n1027b",
      "title": "金剛光焰止風雨陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1027b.md",
      "vietTitle": "Kinh Kim Cương Quang Diễm Chỉ Phong Vũ Đà La Ni"
    },
    {
      "id": "T19n1028A",
      "title": "佛說護諸童子陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1028A.md",
      "vietTitle": "Kinh Phật Thuyết Hộ Chư Đồng Tử Đà La Ni"
    },
    {
      "id": "T19n1028B",
      "title": "童子經念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1028B.md",
      "vietTitle": "Đồng Tử Kinh Niệm Tụng Pháp"
    },
    {
      "id": "T19n1029",
      "title": "佛說安宅陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T19n1029.md",
      "vietTitle": "Kinh Phật Thuyết An Trạch Đà La Ni Chú"
    },
    {
      "id": "T20n1030",
      "title": "觀自在大悲成就瑜伽蓮華部念誦法門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1030.md",
      "vietTitle": "Quan Tự Tại Đại Bi Thành Tựu Du Già Liên Hoa Bộ Niệm Tụng Pháp Môn"
    },
    {
      "id": "T20n1031",
      "title": "聖觀自在菩薩心真言瑜伽觀行儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1031.md",
      "vietTitle": "Thánh Quan Tự Tại Bồ Tát Tâm Chân Ngôn Du Già Quan Hạnh Nghi Quỹ"
    },
    {
      "id": "T20n1032",
      "title": "瑜伽蓮華部念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1032.md",
      "vietTitle": "Du Già Liên Hoa Bộ Niệm Tụng Pháp"
    },
    {
      "id": "T20n1033",
      "title": "金剛恐怖集會方廣軌儀觀自在菩薩三世最勝心明王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1033.md",
      "vietTitle": "Kinh Kim Cương Khủng Bố Tập Hội Phương Quảng Quỹ Nghi Quan Tự Tại Bồ Tát Tam Thế Tối Thắng Tâm Minh Vương"
    },
    {
      "id": "T20n1034",
      "title": "呪五首",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1034.md",
      "vietTitle": "Chú Ngũ Thủ"
    },
    {
      "id": "T20n1035",
      "title": "千轉陀羅尼觀世音菩薩呪",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1035.md",
      "vietTitle": "Thiên Chuyển Đà La Ni Quan Thế Âm Bồ Tát Chú"
    },
    {
      "id": "T20n1036",
      "title": "千轉大明陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1036.md",
      "vietTitle": "Kinh Thiên Chuyển Đại Minh Đà La Ni"
    },
    {
      "id": "T20n1037",
      "title": "觀自在菩薩說普賢陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1037.md",
      "vietTitle": "Kinh Quan Tự Tại Bồ Tát Thuyết Phổ Hiền Đà La Ni"
    },
    {
      "id": "T20n1038",
      "title": "清淨觀世音普賢陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1038.md",
      "vietTitle": "Kinh Thanh Tịnh Quan Thế Âm Phổ Hiền Đà La Ni"
    },
    {
      "id": "T20n1039",
      "title": "阿唎多羅陀羅尼阿嚕力經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1039.md",
      "vietTitle": "Kinh A Lợi Đa La Đà La Ni A Lỗ Lực"
    },
    {
      "id": "T20n1040",
      "title": "金剛頂降三世大儀軌法王教中觀自在菩薩心真言一切如來蓮華大曼荼羅品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1040.md",
      "vietTitle": "Kim Cương Đính Hàng Tam Thế Đại Nghi Quỹ Pháp Vương Giáo Trung Quan Tự Tại Bồ Tát Tâm Chân Ngôn Nhất Thiết Như Lai Liên Hoa Đại Mạn Đồ La Phẩm"
    },
    {
      "id": "T20n1041",
      "title": "觀自在菩薩心真言一印念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1041.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Tâm Chân Ngôn Nhất Ấn Niệm Tụng Pháp"
    },
    {
      "id": "T20n1042",
      "title": "觀自在菩薩大悲智印周遍法界利益眾生薰真如法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1042.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Đại Bi Trí Ấn Chu Biến Pháp Giới Lợi Ích Chúng Sinh Huân Chân Như Pháp"
    },
    {
      "id": "T20n1043",
      "title": "請觀世音菩薩消伏毒害陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1043.md",
      "vietTitle": "Kinh Thỉnh Quan Thế Âm Bồ Tát Tiêu Phục Độc Hại Đà La Ni Chú"
    },
    {
      "id": "T20n1044",
      "title": "佛說六字呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1044.md",
      "vietTitle": "Kinh Phật Thuyết Lục Tự Chú Vương"
    },
    {
      "id": "T20n1045a",
      "title": "佛說六字神呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1045a.md",
      "vietTitle": "Kinh Phật Thuyết Lục Tự Thần Chú Vương"
    },
    {
      "id": "T20n1045b",
      "title": "六字神呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1045b.md",
      "vietTitle": "Kinh Lục Tự Thần Chú Vương"
    },
    {
      "id": "T20n1046",
      "title": "六字大陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1046.md",
      "vietTitle": "Kinh Lục Tự Đại Đà La Ni Chú"
    },
    {
      "id": "T20n1047",
      "title": "佛說聖六字大明王陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1047.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Lục Tự Đại Minh Vương Đà La Ni"
    },
    {
      "id": "T20n1048",
      "title": "佛說大護明大陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1048.md",
      "vietTitle": "Kinh Phật Thuyết Đại Hộ Minh Đại Đà La Ni"
    },
    {
      "id": "T20n1049",
      "title": "聖六字增壽大明陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1049.md",
      "vietTitle": "Kinh Thánh Lục Tự Tăng Thọ Đại Minh Đà La Ni"
    },
    {
      "id": "T20n1050",
      "title": "佛說大乘莊嚴寶王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1050.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Trang Nghiêm Bảo Vương"
    },
    {
      "id": "T20n1051",
      "title": "佛說一切佛攝相應大教王經聖觀自在菩薩念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1051.md",
      "vietTitle": "Phật Thuyết Nhất Thiết Phật Nhiếp Tướng Ứng Đại Giáo Vương Kinh Thánh Quan Tự Tại Bồ Tát Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1052",
      "title": "讚觀世音菩薩頌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1052.md",
      "vietTitle": "Tán Quan Thế Âm Bồ Tát Tụng"
    },
    {
      "id": "T20n1053",
      "title": "聖觀自在菩薩功德讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1053.md",
      "vietTitle": "Thánh Quan Tự Tại Bồ Tát Công Đức Tán"
    },
    {
      "id": "T20n1054",
      "title": "聖觀自在菩薩一百八名經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1054.md",
      "vietTitle": "Kinh Thánh Quan Tự Tại Bồ Tát Nhất Bách Bát Danh"
    },
    {
      "id": "T20n1055",
      "title": "佛說聖觀自在菩薩梵讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1055.md",
      "vietTitle": "Phật Thuyết Thánh Quan Tự Tại Bồ Tát Phạm Tán"
    },
    {
      "id": "T20n1056",
      "title": "金剛頂瑜伽千手千眼觀自在菩薩修行儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1056.md",
      "vietTitle": "Kinh Kim Cương Đính Du Già Thiên Thủ Thiên Nhãn Quan Tự Tại Bồ Tát Tu Hạnh Nghi Quỹ"
    },
    {
      "id": "T20n1057a",
      "title": "千眼千臂觀世音菩薩陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1057a.md",
      "vietTitle": "Kinh Thiên Nhãn Thiên Tý Quan Thế Âm Bồ Tát Đà La Ni Thần Chú"
    },
    {
      "id": "T20n1057b",
      "title": "千眼千臂觀世音菩薩陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1057b.md",
      "vietTitle": "Kinh Thiên Nhãn Thiên Tý Quan Thế Âm Bồ Tát Đà La Ni Thần Chú"
    },
    {
      "id": "T20n1058",
      "title": "千手千眼觀世音菩薩姥陀羅尼身經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1058.md",
      "vietTitle": "Kinh Thiên Thủ Thiên Nhãn Quan Thế Âm Bồ Tát Mỗ Đà La Ni Thân"
    },
    {
      "id": "T20n1059",
      "title": "千手千眼觀世音菩薩治病合藥經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1059.md",
      "vietTitle": "Kinh Thiên Thủ Thiên Nhãn Quan Thế Âm Bồ Tát Trị Bệnh Hợp Dược"
    },
    {
      "id": "T20n1060",
      "title": "千手千眼觀世音菩薩廣大圓滿無礙大悲心陀羅尼經",
      "division": "10",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1060_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1060.md",
      "vietTitle": "Kinh Thiên Thủ Thiên Nhãn Quan Thế Âm Bồ Tát Quảng Đại Viên Mãn Vô Ngại Đại Bi Tâm Đà La Ni"
    },
    {
      "id": "T20n1061",
      "title": "千手千眼觀自在菩薩廣大圓滿無礙大悲心陀羅尼呪本",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1061.md",
      "vietTitle": "Thiên Thủ Thiên Nhãn Quan Tự Tại Bồ Tát Quảng Đại Viên Mãn Vô Ngại Đại Bi Tâm Đà La Ni Chú Bản"
    },
    {
      "id": "T20n1062A",
      "title": "千手千眼觀世音菩薩大身呪本",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1062A.md",
      "vietTitle": "Thiên Thủ Thiên Nhãn Quan Thế Âm Bồ Tát Đại Thân Chú Bản"
    },
    {
      "id": "T20n1062B",
      "title": "世尊聖者千眼千首千足千舌千臂觀自在菩提薩埵怛嚩廣大圓滿無礙大悲心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1062B.md",
      "vietTitle": "Thế Tôn Thánh Giả Thiên Nhãn Thiên Thủ Thiên Túc Thiên Thiệt Thiên Tý Quan Tự Tại Bồ Đề Tát Đóa Đát Phược Quảng Đại Viên Mãn Vô Ngại Đại Bi Tâm Đà La Ni"
    },
    {
      "id": "T20n1063",
      "title": "番大悲神呪",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1063.md",
      "vietTitle": "Phiên Đại Bi Thần Chú"
    },
    {
      "id": "T20n1064",
      "title": "千手千眼觀世音菩薩大悲心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1064.md",
      "vietTitle": "Thiên Thủ Thiên Nhãn Quan Thế Âm Bồ Tát Đại Bi Tâm Đà La Ni"
    },
    {
      "id": "T20n1065",
      "title": "千光眼觀自在菩薩祕密法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1065.md",
      "vietTitle": "Kinh Thiên Quang Nhãn Quan Tự Tại Bồ Tát Bí Mật Pháp"
    },
    {
      "id": "T20n1066",
      "title": "大悲心陀羅尼修行念誦略儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1066.md",
      "vietTitle": "Đại Bi Tâm Đà La Ni Tu Hạnh Niệm Tụng Lược Nghi"
    },
    {
      "id": "T20n1067",
      "title": "攝無礙大悲心大陀羅尼經計一法中出無量義南方滿願補陀落海會五部諸尊等弘誓力方位及威儀形色執持三摩耶幖幟曼荼羅儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1067.md",
      "vietTitle": "Nhiếp Vô Ngại Đại Bi Tâm Đại Đà La Ni Kinh Kế Nhất Pháp Trung Xuất Vô Lượng Nghĩa Nam Phương Mãn Nguyện Bổ Đà Lạc Hải Hội Ngũ Bộ Chư Tôn Đẳng Hoằng Thệ Lực Phương Vị Cập Uy Nghi Hình Sắc Chấp Trì Tam Ma Da Tiêu Xí Mạn Đồ La Nghi Quỹ"
    },
    {
      "id": "T20n1068",
      "title": "千手觀音造次第法儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1068.md",
      "vietTitle": "Thiên Thủ Quan Âm Tạo Thứ Đệ Pháp Nghi Quỹ"
    },
    {
      "id": "T20n1069",
      "title": "十一面觀自在菩薩心密言念誦儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1069.md",
      "vietTitle": "Kinh Thập Nhất Diện Quan Tự Tại Bồ Tát Tâm Mật Ngôn Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1070",
      "title": "佛說十一面觀世音神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1070.md",
      "vietTitle": "Kinh Phật Thuyết Thập Nhất Diện Quan Thế Âm Thần Chú"
    },
    {
      "id": "T20n1071",
      "title": "十一面神呪心經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1071.md",
      "vietTitle": "Kinh Thập Nhất Diện Thần Chú Tâm"
    },
    {
      "id": "T20n1072A",
      "title": "聖賀野紇哩縛大威怒王立成大神驗供養念誦儀軌法品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1072A.md",
      "vietTitle": "Thánh Hạ Dã Hột Rỉ Phược Đại Uy Nộ Vương Lập Thành Đại Thần Nghiệm Cúng Dưỡng Niệm Tụng Nghi Quỹ Pháp Phẩm"
    },
    {
      "id": "T20n1072B",
      "title": "馬頭觀音心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1072B.md",
      "vietTitle": "Mã Đầu Quan Âm Tâm Đà La Ni"
    },
    {
      "id": "T20n1073",
      "title": "何耶揭唎婆像法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1073.md",
      "vietTitle": "Hà Da Yết Lợi Bà Tượng Pháp"
    },
    {
      "id": "T20n1074",
      "title": "何耶揭唎婆觀世音菩薩受法壇",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1074.md",
      "vietTitle": "Hà Da Yết Lợi Bà Quan Thế Âm Bồ Tát Thọ Pháp Đàn"
    },
    {
      "id": "T20n1075",
      "title": "佛說七俱胝佛母准提大明陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1075.md",
      "vietTitle": "Kinh Phật Thuyết Thất Câu Chi Phật Mẫu Chuẩn Đề Đại Minh Đà La Ni"
    },
    {
      "id": "T20n1076",
      "title": "七俱胝佛母所說准提陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1076.md",
      "vietTitle": "Kinh Thất Câu Chi Phật Mẫu Sở Thuyết Chuẩn Đề Đà La Ni"
    },
    {
      "id": "T20n1077",
      "title": "佛說七俱胝佛母心大准提陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1077.md",
      "vietTitle": "Kinh Phật Thuyết Thất Câu Chi Phật Mẫu Tâm Đại Chuẩn Đề Đà La Ni"
    },
    {
      "id": "T20n1078",
      "title": "七佛俱胝佛母心大准提陀羅尼法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1078.md",
      "vietTitle": "Thất Phật Câu Chi Phật Mẫu Tâm Đại Chuẩn Đề Đà La Ni Pháp"
    },
    {
      "id": "T20n1079",
      "title": "七俱胝獨部法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1079.md",
      "vietTitle": "Thất Câu Chi Độc Bộ Pháp"
    },
    {
      "id": "T20n1080",
      "title": "如意輪陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1080.md",
      "vietTitle": "Kinh Như Ý Luân Đà La Ni"
    },
    {
      "id": "T20n1081",
      "title": "佛說觀自在菩薩如意心陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1081.md",
      "vietTitle": "Kinh Phật Thuyết Quan Tự Tại Bồ Tát Như Ý Tâm Đà La Ni Chú"
    },
    {
      "id": "T20n1082",
      "title": "觀世音菩薩祕密藏如意輪陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1082.md",
      "vietTitle": "Kinh Quan Thế Âm Bồ Tát Bí Mật Tạng Như Ý Luân Đà La Ni Thần Chú"
    },
    {
      "id": "T20n1083",
      "title": "觀世音菩薩如意摩尼陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1083.md",
      "vietTitle": "Kinh Quan Thế Âm Bồ Tát Như Ý Ma Ni Đà La Ni"
    },
    {
      "id": "T20n1084",
      "title": "觀世音菩薩如意摩尼輪陀羅尼念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1084.md",
      "vietTitle": "Quan Thế Âm Bồ Tát Như Ý Ma Ni Luân Đà La Ni Niệm Tụng Pháp"
    },
    {
      "id": "T20n1085",
      "title": "觀自在菩薩如意輪念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1085.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Như Ý Luân Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1086",
      "title": "觀自在菩薩如意輪瑜伽",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1086.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Như Ý Luân Du Già"
    },
    {
      "id": "T20n1087",
      "title": "觀自在如意輪菩薩瑜伽法要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1087.md",
      "vietTitle": "Quan Tự Tại Như Ý Luân Bồ Tát Du Già Pháp Yếu"
    },
    {
      "id": "T20n1088",
      "title": "如意輪菩薩觀門義注祕訣",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1088.md",
      "vietTitle": "Như Ý Luân Bồ Tát Quan Môn Nghĩa Chú Bí Quyết"
    },
    {
      "id": "T20n1089",
      "title": "都表如意摩尼轉輪聖王次第念誦祕密最要略法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1089.md",
      "vietTitle": "Đô Biểu Như Ý Ma Ni Chuyển Luân Thánh Vương Thứ Đệ Niệm Tụng Bí Mật Tối Yếu Lược Pháp"
    },
    {
      "id": "T20n1090",
      "title": "佛說如意輪蓮華心如來修行觀門儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1090.md",
      "vietTitle": "Phật Thuyết Như Ý Luân Liên Hoa Tâm Như Lai Tu Hạnh Quan Môn Nghi"
    },
    {
      "id": "T20n1091",
      "title": "七星如意輪祕密要經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1091.md",
      "vietTitle": "Kinh Thất Tinh Như Ý Luân Bí Mật Yếu"
    },
    {
      "id": "T20n1092",
      "title": "不空羂索神變真言經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1092.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Thần Biến Chân Ngôn"
    },
    {
      "id": "T20n1093",
      "title": "不空羂索呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1093.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Chú"
    },
    {
      "id": "T20n1094",
      "title": "不空羂索神呪心經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1094.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Thần Chú Tâm"
    },
    {
      "id": "T20n1095",
      "title": "不空羂索呪心經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1095.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Chú Tâm"
    },
    {
      "id": "T20n1096",
      "title": "不空羂索陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1096.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Đà La Ni"
    },
    {
      "id": "T20n1097",
      "title": "不空羂索陀羅尼自在王呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1097.md",
      "vietTitle": "Kinh Bất Không Quyến Sách Đà La Ni Tự Tại Vương Chú"
    },
    {
      "id": "T20n1098",
      "title": "佛說不空羂索陀羅尼儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1098.md",
      "vietTitle": "Kinh Phật Thuyết Bất Không Quyến Sách Đà La Ni Nghi Quỹ"
    },
    {
      "id": "T20n1099",
      "title": "佛說聖觀自在菩薩不空王祕密心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1099.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Quan Tự Tại Bồ Tát Bất Không Vương Bí Mật Tâm Đà La Ni"
    },
    {
      "id": "T20n1100",
      "title": "葉衣觀自在菩薩經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1100.md",
      "vietTitle": "Kinh Diệp Y Quan Tự Tại Bồ Tát"
    },
    {
      "id": "T20n1101",
      "title": "佛說大方廣曼殊室利經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1101.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phương Quảng Mạn Thù Thất Lợi"
    },
    {
      "id": "T20n1102",
      "title": "金剛頂經多羅菩薩念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1102.md",
      "vietTitle": "Kim Cương Đính Kinh Đa La Bồ Tát Niệm Tụng Pháp"
    },
    {
      "id": "T20n1103a",
      "title": "觀自在菩薩隨心呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1103a.md",
      "vietTitle": "Kinh Quan Tự Tại Bồ Tát Tùy Tâm Chú"
    },
    {
      "id": "T20n1103b",
      "title": "觀自在菩薩怛嚩多唎隨心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1103b.md",
      "vietTitle": "Kinh Quan Tự Tại Bồ Tát Đát Phược Đa Lợi Tùy Tâm Đà La Ni"
    },
    {
      "id": "T20n1104",
      "title": "佛說聖多羅菩薩經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1104.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Đa La Bồ Tát"
    },
    {
      "id": "T20n1105",
      "title": "聖多羅菩薩一百八名陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1105.md",
      "vietTitle": "Kinh Thánh Đa La Bồ Tát Nhất Bách Bát Danh Đà La Ni"
    },
    {
      "id": "T20n1106",
      "title": "讚揚聖德多羅菩薩一百八名經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1106.md",
      "vietTitle": "Kinh Tán Dương Thánh Đức Đa La Bồ Tát Nhất Bách Bát Danh"
    },
    {
      "id": "T20n1107",
      "title": "聖多羅菩薩梵讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1107.md",
      "vietTitle": "Thánh Đa La Bồ Tát Phạm Tán"
    },
    {
      "id": "T20n1108A",
      "title": "聖救度佛母二十一種禮讚經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1108A.md",
      "vietTitle": "Kinh Thánh Cứu Độ Phật Mẫu Nhị Thập Nhất Chủng Lễ Tán"
    },
    {
      "id": "T20n1108B",
      "title": "救度佛母二十一種禮讚經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1108B.md",
      "vietTitle": "Kinh Cứu Độ Phật Mẫu Nhị Thập Nhất Chủng Lễ Tán"
    },
    {
      "id": "T20n1109",
      "title": "白救度佛母讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1109.md",
      "vietTitle": "Bạch Cứu Độ Phật Mẫu Tán"
    },
    {
      "id": "T20n1110",
      "title": "佛說一髻尊陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1110.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Kế Tôn Đà La Ni"
    },
    {
      "id": "T20n1111",
      "title": "青頸觀自在菩薩心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1111.md",
      "vietTitle": "Kinh Thanh Cảnh Quan Tự Tại Bồ Tát Tâm Đà La Ni"
    },
    {
      "id": "T20n1112",
      "title": "金剛頂瑜伽青頸大悲王觀自在念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1112.md",
      "vietTitle": "Kim Cương Đính Du Già Thanh Cảnh Đại Bi Vương Quan Tự Tại Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1113A",
      "title": "觀自在菩薩廣大圓滿無礙大悲心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1113A.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Quảng Đại Viên Mãn Vô Ngại Đại Bi Tâm Đà La Ni"
    },
    {
      "id": "T20n1113B",
      "title": "大慈大悲救苦觀世音自在王菩薩廣大圓滿無礙自在青頸大悲心陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1113B.md",
      "vietTitle": "Đại Từ Đại Bi Cứu Khổ Quan Thế Âm Tự Tại Vương Bồ Tát Quảng Đại Viên Mãn Vô Ngại Tự Tại Thanh Cảnh Đại Bi Tâm Đà La Ni"
    },
    {
      "id": "T20n1114",
      "title": "毘俱胝菩薩一百八名經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1114.md",
      "vietTitle": "Kinh Tỳ Câu Chi Bồ Tát Nhất Bách Bát Danh"
    },
    {
      "id": "T20n1115",
      "title": "觀自在菩薩阿麼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1115.md",
      "vietTitle": "Quan Tự Tại Bồ Tát A Ma"
    },
    {
      "id": "T20n1116",
      "title": "廣大蓮華莊嚴曼拏羅滅一切罪陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1116.md",
      "vietTitle": "Kinh Quảng Đại Liên Hoa Trang Nghiêm Mạn Noa La Diệt Nhất Thiết Tội Đà La Ni"
    },
    {
      "id": "T20n1117",
      "title": "佛說觀自在菩薩母陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1117.md",
      "vietTitle": "Kinh Phật Thuyết Quan Tự Tại Bồ Tát Mẫu Đà La Ni"
    },
    {
      "id": "T20n1118",
      "title": "佛說十八臂陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1118.md",
      "vietTitle": "Kinh Phật Thuyết Thập Bát Tý Đà La Ni"
    },
    {
      "id": "T20n1119",
      "title": "大樂金剛薩埵修行成就儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1119.md",
      "vietTitle": "Đại Lạc Kim Cương Tát Đóa Tu Hạnh Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T20n1120A",
      "title": "金剛頂勝初瑜伽經中略出大樂金剛薩埵念誦儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1120A.md",
      "vietTitle": "Kim Cương Đính Thắng Sơ Du Già Kinh Trung Lược Xuất Đại Lạc Kim Cương Tát Đóa Niệm Tụng Nghi"
    },
    {
      "id": "T20n1120B",
      "title": "勝初瑜伽儀軌真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1120B.md",
      "vietTitle": "Thắng Sơ Du Già Nghi Quỹ Chân Ngôn"
    },
    {
      "id": "T20n1121",
      "title": "金剛頂普賢瑜伽大教王經大樂不空金剛薩埵一切時方成就儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1121.md",
      "vietTitle": "Kim Cương Đính Phổ Hiền Du Già Đại Giáo Vương Kinh Đại Lạc Bất Không Kim Cương Tát Đóa Nhất Thiết Thời Phương Thành Tựu Nghi"
    },
    {
      "id": "T20n1122",
      "title": "金剛頂瑜伽他化自在天理趣會普賢修行念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1122.md",
      "vietTitle": "Kim Cương Đính Du Già Tha Hóa Tự Tại Thiên Lý Thú Hội Phổ Hiền Tu Hạnh Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1123",
      "title": "金剛頂勝初瑜伽普賢菩薩念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1123.md",
      "vietTitle": "Kim Cương Đính Thắng Sơ Du Già Phổ Hiền Bồ Tát Niệm Tụng Pháp"
    },
    {
      "id": "T20n1124",
      "title": "普賢金剛薩埵略瑜伽念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1124.md",
      "vietTitle": "Phổ Hiền Kim Cương Tát Đóa Lược Du Già Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1125",
      "title": "金剛頂瑜伽金剛薩埵五祕密修行念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1125.md",
      "vietTitle": "Kim Cương Đính Du Già Kim Cương Tát Đóa Ngũ Bí Mật Tu Hạnh Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1126",
      "title": "佛說普賢曼拏羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1126.md",
      "vietTitle": "Kinh Phật Thuyết Phổ Hiền Mạn Noa La"
    },
    {
      "id": "T20n1127",
      "title": "佛說普賢菩薩陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1127.md",
      "vietTitle": "Kinh Phật Thuyết Phổ Hiền Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1128",
      "title": "最上大乘金剛大教寶王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1128.md",
      "vietTitle": "Kinh Tối Thượng Đại Thừa Kim Cương Đại Giáo Bảo Vương"
    },
    {
      "id": "T20n1129",
      "title": "佛說金剛手菩薩降伏一切部多大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1129.md",
      "vietTitle": "Kinh Phật Thuyết Kim Cương Thủ Bồ Tát Hàng Phục Nhất Thiết Bộ Đa Đại Giáo Vương"
    },
    {
      "id": "T20n1130",
      "title": "大乘金剛髻珠菩薩修行分",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1130.md",
      "vietTitle": "Đại Thừa Kim Cương Kế Châu Bồ Tát Tu Hạnh Phân"
    },
    {
      "id": "T20n1131",
      "title": "聖金剛手菩薩一百八名梵讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1131.md",
      "vietTitle": "Thánh Kim Cương Thủ Bồ Tát Nhất Bách Bát Danh Phạm Tán"
    },
    {
      "id": "T20n1132",
      "title": "金剛王菩薩祕密念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1132.md",
      "vietTitle": "Kim Cương Vương Bồ Tát Bí Mật Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1133",
      "title": "金剛壽命陀羅尼念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1133.md",
      "vietTitle": "Kim Cương Thọ Mạng Đà La Ni Niệm Tụng Pháp"
    },
    {
      "id": "T20n1134A",
      "title": "金剛壽命陀羅尼經法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1134A.md",
      "vietTitle": "Kim Cương Thọ Mạng Đà La Ni Kinh Pháp"
    },
    {
      "id": "T20n1134B",
      "title": "金剛壽命陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1134B.md",
      "vietTitle": "Kinh Kim Cương Thọ Mạng Đà La Ni"
    },
    {
      "id": "T20n1135",
      "title": "佛說一切如來金剛壽命陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1135.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai Kim Cương Thọ Mạng Đà La Ni"
    },
    {
      "id": "T20n1136",
      "title": "佛說一切諸如來心光明加持普賢菩薩延命金剛最勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1136.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Chư Như Lai Tâm Quang Minh Gia Trì Phổ Hiền Bồ Tát Diên Mạng Kim Cương Tối Thắng Đà La Ni"
    },
    {
      "id": "T20n1137",
      "title": "佛說善法方便陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1137.md",
      "vietTitle": "Kinh Phật Thuyết Thiện Pháp Phương Tiện Đà La Ni"
    },
    {
      "id": "T20n1138a",
      "title": "金剛祕密善門陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1138a.md",
      "vietTitle": "Kinh Kim Cương Bí Mật Thiện Môn Đà La Ni Chú"
    },
    {
      "id": "T20n1138b",
      "title": "金剛祕密善門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1138b.md",
      "vietTitle": "Kinh Kim Cương Bí Mật Thiện Môn Đà La Ni"
    },
    {
      "id": "T20n1139",
      "title": "護命法門神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1139.md",
      "vietTitle": "Kinh Hộ Mạng Pháp Môn Thần Chú"
    },
    {
      "id": "T20n1140",
      "title": "佛說延壽妙門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1140.md",
      "vietTitle": "Kinh Phật Thuyết Diên Thọ Diệu Môn Đà La Ni"
    },
    {
      "id": "T20n1141",
      "title": "慈氏菩薩略修瑜伽念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1141.md",
      "vietTitle": "Từ Thị Bồ Tát Lược Tu Du Già Niệm Tụng Pháp"
    },
    {
      "id": "T20n1142",
      "title": "佛說慈氏菩薩陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1142.md",
      "vietTitle": "Phật Thuyết Từ Thị Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1143",
      "title": "佛說慈氏菩薩誓願陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1143.md",
      "vietTitle": "Kinh Phật Thuyết Từ Thị Bồ Tát Thệ Nguyện Đà La Ni"
    },
    {
      "id": "T20n1144",
      "title": "佛說彌勒菩薩發願王偈",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1144.md",
      "vietTitle": "Phật Thuyết Di Lặc Bồ Tát Phát Nguyện Vương Kệ"
    },
    {
      "id": "T20n1145",
      "title": "虛空藏菩薩能滿諸願最勝心陀羅尼求聞持法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1145.md",
      "vietTitle": "Hư Không Tạng Bồ Tát Năng Mãn Chư Nguyện Tối Thắng Tâm Đà La Ni Cầu Văn Trì Pháp"
    },
    {
      "id": "T20n1146",
      "title": "大虛空藏菩薩念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1146.md",
      "vietTitle": "Đại Hư Không Tạng Bồ Tát Niệm Tụng Pháp"
    },
    {
      "id": "T20n1147",
      "title": "聖虛空藏菩薩陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1147.md",
      "vietTitle": "Kinh Thánh Hư Không Tạng Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1148",
      "title": "佛說虛空藏菩薩陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1148.md",
      "vietTitle": "Phật Thuyết Hư Không Tạng Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1149",
      "title": "五大虛空藏菩薩速疾大神驗祕密式經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1149.md",
      "vietTitle": "Kinh Ngũ Đại Hư Không Tạng Bồ Tát Tốc Tật Đại Thần Nghiệm Bí Mật Thức"
    },
    {
      "id": "T20n1150",
      "title": "轉法輪菩薩摧魔怨敵法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1150.md",
      "vietTitle": "Chuyển Pháp Luân Bồ Tát Tồi Ma Oán Địch Pháp"
    },
    {
      "id": "T20n1151",
      "title": "修習般若波羅蜜菩薩觀行念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1151.md",
      "vietTitle": "Tu Tập Bát Nhã Ba La Mật Bồ Tát Quan Hạnh Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1152",
      "title": "佛說佛母般若波羅蜜多大明觀想儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1152.md",
      "vietTitle": "Phật Thuyết Phật Mẫu Bát Nhã Ba La Mật Đa Đại Minh Quan Tưởng Nghi Quỹ"
    },
    {
      "id": "T20n1153",
      "title": "普遍光明清淨熾盛如意寶印心無能勝大明王大隨求陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1153.md",
      "vietTitle": "Kinh Phổ Biến Quang Minh Thanh Tịnh Sí Thịnh Như Ý Bảo Ấn Tâm Vô Năng Thắng Đại Minh Vương Đại Tùy Cầu Đà La Ni"
    },
    {
      "id": "T20n1154",
      "title": "佛說隨求即得大自在陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1154.md",
      "vietTitle": "Kinh Phật Thuyết Tùy Cầu Tức Đắc Đại Tự Tại Đà La Ni Thần Chú"
    },
    {
      "id": "T20n1155",
      "title": "金剛頂瑜伽最勝祕密成佛隨求即得神變加持成就陀羅尼儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1155.md",
      "vietTitle": "Kim Cương Đính Du Già Tối Thắng Bí Mật Thành Phật Tùy Cầu Tức Đắc Thần Biến Gia Trì Thành Tựu Đà La Ni Nghi Quỹ"
    },
    {
      "id": "T20n1156A",
      "title": "大隨求即得大陀羅尼明王懺悔法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1156A.md",
      "vietTitle": "Đại Tùy Cầu Tức Đắc Đại Đà La Ni Minh Vương Sám Hối Pháp"
    },
    {
      "id": "T20n1156B",
      "title": "宗叡僧正於唐國師所口受",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1156B.md",
      "vietTitle": "Tông Duệ Tăng Chánh Vu Đường Quốc Sư Sở Khẩu Thọ"
    },
    {
      "id": "T20n1157",
      "title": "香王菩薩陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1157.md",
      "vietTitle": "Kinh Hương Vương Bồ Tát Đà La Ni Chú"
    },
    {
      "id": "T20n1158",
      "title": "地藏菩薩儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1158.md",
      "vietTitle": "Địa Tạng Bồ Tát Nghi Quỹ"
    },
    {
      "id": "T20n1159A",
      "title": "(không tiêu đề)",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1159A.md",
      "vietTitle": "( k h ô n g t i ê u đ ề )"
    },
    {
      "id": "T20n1159B",
      "title": "佛說地藏菩薩陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1159B.md",
      "vietTitle": "Kinh Phật Thuyết Địa Tạng Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1160",
      "title": "日光菩薩月光菩薩陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1160.md",
      "vietTitle": "Nhật Quang Bồ Tát Nguyệt Quang Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1161",
      "title": "佛說觀藥王藥上二菩薩經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1161.md",
      "vietTitle": "Kinh Phật Thuyết Quan Dược Vương Dược Thượng Nhị Bồ Tát"
    },
    {
      "id": "T20n1162",
      "title": "持世陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1162.md",
      "vietTitle": "Kinh Trì Thế Đà La Ni"
    },
    {
      "id": "T20n1163",
      "title": "佛說雨寶陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1163.md",
      "vietTitle": "Kinh Phật Thuyết Vũ Bảo Đà La Ni"
    },
    {
      "id": "T20n1164",
      "title": "佛說大乘聖吉祥持世陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1164.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Thánh Cát Tường Trì Thế Đà La Ni"
    },
    {
      "id": "T20n1165",
      "title": "聖持世陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1165.md",
      "vietTitle": "Kinh Thánh Trì Thế Đà La Ni"
    },
    {
      "id": "T20n1166",
      "title": "馬鳴菩薩大神力無比驗法念誦軌儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1166.md",
      "vietTitle": "Mã Minh Bồ Tát Đại Thần Lực Vô Tỳ Nghiệm Pháp Niệm Tụng Quỹ Nghi"
    },
    {
      "id": "T20n1167",
      "title": "八大菩薩曼荼羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1167.md",
      "vietTitle": "Kinh Bát Đại Bồ Tát Mạn Đồ La"
    },
    {
      "id": "T20n1168A",
      "title": "佛說大乘八大曼拏羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1168A.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Bát Đại Mạn Noa La"
    },
    {
      "id": "T20n1168B",
      "title": "八曼荼羅經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1168B.md",
      "vietTitle": "Kinh Bát Mạn Đồ La"
    },
    {
      "id": "T20n1169",
      "title": "佛說持明藏瑜伽大教尊那菩薩大明成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1169.md",
      "vietTitle": "Kinh Phật Thuyết Trì Minh Tạng Du Già Đại Giáo Tôn Na Bồ Tát Đại Minh Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T20n1170",
      "title": "佛說金剛香菩薩大明成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1170.md",
      "vietTitle": "Kinh Phật Thuyết Kim Cương Hương Bồ Tát Đại Minh Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T20n1171",
      "title": "金剛頂經瑜伽文殊師利菩薩法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1171.md",
      "vietTitle": "Kim Cương Đính Kinh Du Già Văn Thù Sư Lợi Bồ Tát Pháp"
    },
    {
      "id": "T20n1172",
      "title": "金剛頂超勝三界經說文殊五字真言勝相",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1172.md",
      "vietTitle": "Kim Cương Đính Siêu Thắng Tam Giới Kinh Thuyết Văn Thù Ngũ Tự Chân Ngôn Thắng Tướng"
    },
    {
      "id": "T20n1173",
      "title": "金剛頂經曼殊室利菩薩五字心陀羅尼品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1173.md",
      "vietTitle": "Kim Cương Đính Kinh Mạn Thù Thất Lợi Bồ Tát Ngũ Tự Tâm Đà La Ni Phẩm"
    },
    {
      "id": "T20n1174",
      "title": "五字陀羅尼頌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1174.md",
      "vietTitle": "Ngũ Tự Đà La Ni Tụng"
    },
    {
      "id": "T20n1175",
      "title": "金剛頂經瑜伽文殊師利菩薩供養儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1175.md",
      "vietTitle": "Kim Cương Đính Kinh Du Già Văn Thù Sư Lợi Bồ Tát Cúng Dưỡng Nghi Quỹ"
    },
    {
      "id": "T20n1176",
      "title": "曼殊室利童子菩薩五字瑜伽法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1176.md",
      "vietTitle": "Mạn Thù Thất Lợi Đồng Tử Bồ Tát Ngũ Tự Du Già Pháp"
    },
    {
      "id": "T20n1177A",
      "title": "大乘瑜伽金剛性海曼殊室利千臂千鉢大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1177A.md",
      "vietTitle": "Kinh Đại Thừa Du Già Kim Cương Tính Hải Mạn Thù Thất Lợi Thiên Tý Thiên Bát Đại Giáo Vương"
    },
    {
      "id": "T20n1177B",
      "title": "千鉢文殊一百八名讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1177B.md",
      "vietTitle": "Thiên Bát Văn Thù Nhất Bách Bát Danh Tán"
    },
    {
      "id": "T20n1178",
      "title": "文殊菩薩獻佛陀羅尼名烏蘇吒",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1178.md",
      "vietTitle": "Văn Thù Bồ Tát Hiến Phật Đà La Ni Danh Ô Tô Trá"
    },
    {
      "id": "T20n1179",
      "title": "文殊師利菩薩六字呪功能法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1179.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Bồ Tát Lục Tự Chú Công Năng Pháp"
    },
    {
      "id": "T20n1180",
      "title": "六字神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1180.md",
      "vietTitle": "Kinh Lục Tự Thần Chú"
    },
    {
      "id": "T20n1181",
      "title": "大方廣菩薩藏經中文殊師利根本一字陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1181.md",
      "vietTitle": "Kinh Đại Phương Quảng Bồ Tát Tạng Kinh Trung Văn Thù Sư Lợi Căn Bản Nhất Tự Đà La Ni"
    },
    {
      "id": "T20n1182",
      "title": "曼殊室利菩薩呪藏中一字呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1182.md",
      "vietTitle": "Kinh Mạn Thù Thất Lợi Bồ Tát Chú Tạng Trung Nhất Tự Chú Vương"
    },
    {
      "id": "T20n1183",
      "title": "一髻文殊師利童子陀羅尼念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1183.md",
      "vietTitle": "Nhất Kế Văn Thù Sư Lợi Đồng Tử Đà La Ni Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T20n1184",
      "title": "大聖妙吉祥菩薩祕密八字陀羅尼修行曼荼羅次第儀軌法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1184.md",
      "vietTitle": "Đại Thánh Diệu Cát Tường Bồ Tát Bí Mật Bát Tự Đà La Ni Tu Hạnh Mạn Đồ La Thứ Đệ Nghi Quỹ Pháp"
    },
    {
      "id": "T20n1185A",
      "title": "佛說文殊師利法寶藏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1185A.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Sư Lợi Pháp Bảo Tạng Đà La Ni"
    },
    {
      "id": "T20n1185B",
      "title": "文殊師利寶藏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1185B.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Bảo Tạng Đà La Ni"
    },
    {
      "id": "T20n1186",
      "title": "佛說妙吉祥菩薩陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1186.md",
      "vietTitle": "Phật Thuyết Diệu Cát Tường Bồ Tát Đà La Ni"
    },
    {
      "id": "T20n1187",
      "title": "佛說最勝妙吉祥根本智最上祕密一切名義三摩地分",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1187.md",
      "vietTitle": "Phật Thuyết Tối Thắng Diệu Cát Tường Căn Bản Trí Tối Thượng Bí Mật Nhất Thiết Danh Nghĩa Tam Ma Địa Phân"
    },
    {
      "id": "T20n1188",
      "title": "文殊所說最勝名義經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1188.md",
      "vietTitle": "Kinh Văn Thù Sở Thuyết Tối Thắng Danh Nghĩa"
    },
    {
      "id": "T20n1189",
      "title": "佛說文殊菩薩最勝真實名義經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1189.md",
      "vietTitle": "Kinh Phật Thuyết Văn Thù Bồ Tát Tối Thắng Chân Thật Danh Nghĩa"
    },
    {
      "id": "T20n1190",
      "title": "聖妙吉祥真實名經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1190.md",
      "vietTitle": "Kinh Thánh Diệu Cát Tường Chân Thật Danh"
    },
    {
      "id": "T20n1191",
      "title": "大方廣菩薩藏文殊師利根本儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1191.md",
      "vietTitle": "Kinh Đại Phương Quảng Bồ Tát Tạng Văn Thù Sư Lợi Căn Bản Nghi Quỹ"
    },
    {
      "id": "T20n1192",
      "title": "妙吉祥平等祕密最上觀門大教王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1192.md",
      "vietTitle": "Kinh Diệu Cát Tường Bình Đẳng Bí Mật Tối Thượng Quan Môn Đại Giáo Vương"
    },
    {
      "id": "T20n1193",
      "title": "妙吉祥平等瑜伽祕密觀身成佛儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1193.md",
      "vietTitle": "Diệu Cát Tường Bình Đẳng Du Già Bí Mật Quan Thân Thành Phật Nghi Quỹ"
    },
    {
      "id": "T20n1194",
      "title": "妙吉祥平等觀門大教王經略出護摩儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1194.md",
      "vietTitle": "Diệu Cát Tường Bình Đẳng Quan Môn Đại Giáo Vương Kinh Lược Xuất Hộ Ma Nghi"
    },
    {
      "id": "T20n1195",
      "title": "大聖文殊師利菩薩讚佛法身禮",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1195.md",
      "vietTitle": "Đại Thánh Văn Thù Sư Lợi Bồ Tát Tán Phật Pháp Thân Lễ"
    },
    {
      "id": "T20n1196",
      "title": "曼殊室利菩薩吉祥伽陀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1196.md",
      "vietTitle": "Mạn Thù Thất Lợi Bồ Tát Cát Tường Già Đà"
    },
    {
      "id": "T20n1197",
      "title": "佛說文殊師利一百八名梵讚",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1197.md",
      "vietTitle": "Phật Thuyết Văn Thù Sư Lợi Nhất Bách Bát Danh Phạm Tán"
    },
    {
      "id": "T20n1198",
      "title": "聖者文殊師利發菩提心願文",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T20n1198.md",
      "vietTitle": "Thánh Giả Văn Thù Sư Lợi Phát Bồ Đề Tâm Nguyện Văn"
    },
    {
      "id": "T21n1199",
      "title": "金剛手光明灌頂經最勝立印聖無動尊大威怒王念誦儀軌法品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1199.md",
      "vietTitle": "Kim Cương Thủ Quang Minh Quán Đính Kinh Tối Thắng Lập Ấn Thánh Vô Động Tôn Đại Uy Nộ Vương Niệm Tụng Nghi Quỹ Pháp Phẩm"
    },
    {
      "id": "T21n1200",
      "title": "底哩三昧耶不動尊威怒王使者念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1200.md",
      "vietTitle": "Để Rỉ Tam Muội Da Bất Động Tôn Uy Nộ Vương Sứ Giả Niệm Tụng Pháp"
    },
    {
      "id": "T21n1201",
      "title": "底哩三昧耶不動尊聖者念誦祕密法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1201.md",
      "vietTitle": "Để Rỉ Tam Muội Da Bất Động Tôn Thánh Giả Niệm Tụng Bí Mật Pháp"
    },
    {
      "id": "T21n1202",
      "title": "不動使者陀羅尼祕密法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1202.md",
      "vietTitle": "Bất Động Sứ Giả Đà La Ni Bí Mật Pháp"
    },
    {
      "id": "T21n1203",
      "title": "聖無動尊安鎮家國等法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1203.md",
      "vietTitle": "Thánh Vô Động Tôn An Trấn Gia Quốc Đẳng Pháp"
    },
    {
      "id": "T21n1204",
      "title": "聖無動尊一字出生八大童子祕要法品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1204.md",
      "vietTitle": "Thánh Vô Động Tôn Nhất Tự Xuất Sinh Bát Đại Đồng Tử Bí Yếu Pháp Phẩm"
    },
    {
      "id": "T21n1205",
      "title": "勝軍不動明王四十八使者祕密成就儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1205.md",
      "vietTitle": "Thắng Quân Bất Động Minh Vương Tứ Thập Bát Sứ Giả Bí Mật Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1206",
      "title": "佛說俱利伽羅大龍勝外道伏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1206.md",
      "vietTitle": "Kinh Phật Thuyết Câu Lợi Già La Đại Long Thắng Ngoại Đạo Phục Đà La Ni"
    },
    {
      "id": "T21n1207",
      "title": "說矩里迦龍王像法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1207.md",
      "vietTitle": "Thuyết Củ Lý Ca Long Vương Tượng Pháp"
    },
    {
      "id": "T21n1208",
      "title": "俱力迦羅龍王儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1208.md",
      "vietTitle": "Câu Lực Ca La Long Vương Nghi Quỹ"
    },
    {
      "id": "T21n1209",
      "title": "金剛頂瑜伽降三世成就極深密門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1209.md",
      "vietTitle": "Kim Cương Đính Du Già Hàng Tam Thế Thành Tựu Cực Thâm Mật Môn"
    },
    {
      "id": "T21n1210",
      "title": "降三世忿怒明王念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1210.md",
      "vietTitle": "Hàng Tam Thế Phẫn Nộ Minh Vương Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T21n1211",
      "title": "甘露軍荼利菩薩供養念誦成就儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1211.md",
      "vietTitle": "Cam Lộ Quân Đồ Lợi Bồ Tát Cúng Dưỡng Niệm Tụng Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1212",
      "title": "西方陀羅尼藏中金剛族阿蜜哩多軍吒利法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1212.md",
      "vietTitle": "Tây Phương Đà La Ni Tạng Trung Kim Cương Tộc A Mật Rỉ Đa Quân Trá Lợi Pháp"
    },
    {
      "id": "T21n1213",
      "title": "千臂軍荼利梵字真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1213.md",
      "vietTitle": "Thiên Tý Quân Đồ Lợi Phạm Tự Chân Ngôn"
    },
    {
      "id": "T21n1214",
      "title": "聖閻曼德迦威怒王立成大神驗念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1214.md",
      "vietTitle": "Thánh Diêm Mạn Đức Ca Uy Nộ Vương Lập Thành Đại Thần Nghiệm Niệm Tụng Pháp"
    },
    {
      "id": "T21n1215",
      "title": "大乘方廣曼殊室利菩薩華嚴本教閻曼德迦忿怒王真言大威德儀軌品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1215.md",
      "vietTitle": "Đại Thừa Phương Quảng Mạn Thù Thất Lợi Bồ Tát Hoa Nghiêm Bản Giáo Diêm Mạn Đức Ca Phẫn Nộ Vương Chân Ngôn Đại Uy Đức Nghi Quỹ Phẩm"
    },
    {
      "id": "T21n1216",
      "title": "大方廣曼殊室利童真菩薩華嚴本教讚閻曼德迦忿怒王真言阿毘遮嚕迦儀軌品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1216.md",
      "vietTitle": "Đại Phương Quảng Mạn Thù Thất Lợi Đồng Chân Bồ Tát Hoa Nghiêm Bản Giáo Tán Diêm Mạn Đức Ca Phẫn Nộ Vương Chân Ngôn A Tỳ Già Lỗ Ca Nghi Quỹ Phẩm"
    },
    {
      "id": "T21n1217",
      "title": "佛說妙吉祥最勝根本大教經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1217.md",
      "vietTitle": "Kinh Phật Thuyết Diệu Cát Tường Tối Thắng Căn Bản Đại Giáo"
    },
    {
      "id": "T21n1218",
      "title": "文殊師利耶曼德迦呪法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1218.md",
      "vietTitle": "Văn Thù Sư Lợi Da Mạn Đức Ca Chú Pháp"
    },
    {
      "id": "T21n1219",
      "title": "曼殊室利焰曼德迦萬愛祕術如意法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1219.md",
      "vietTitle": "Mạn Thù Thất Lợi Diễm Mạn Đức Ca Vạn Ái Bí Thuật Như Ý Pháp"
    },
    {
      "id": "T21n1220",
      "title": "金剛藥叉瞋怒王息災大威神驗念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1220.md",
      "vietTitle": "Kim Cương Dược Xoa Sân Nộ Vương Tức Tai Đại Uy Thần Nghiệm Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T21n1221",
      "title": "青色大金剛藥叉辟鬼魔法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1221.md",
      "vietTitle": "Thanh Sắc Đại Kim Cương Dược Xoa Bích Quỷ Ma Pháp"
    },
    {
      "id": "T21n1222a",
      "title": "聖迦抳忿怒金剛童子菩薩成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1222a.md",
      "vietTitle": "Kinh Thánh Ca Nễ Phẫn Nộ Kim Cương Đồng Tử Bồ Tát Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1222b",
      "title": "聖迦柅忿怒金剛童子菩薩成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1222b.md",
      "vietTitle": "Kinh Thánh Ca Nễ Phẫn Nộ Kim Cương Đồng Tử Bồ Tát Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1223",
      "title": "佛說無量壽佛化身大忿迅俱摩羅金剛念誦瑜伽儀軌法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1223.md",
      "vietTitle": "Phật Thuyết Vô Lượng Thọ Phật Hóa Thân Đại Phẫn Tấn Câu Ma La Kim Cương Niệm Tụng Du Già Nghi Quỹ Pháp"
    },
    {
      "id": "T21n1224",
      "title": "金剛童子持念經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1224.md",
      "vietTitle": "Kinh Kim Cương Đồng Tử Trì Niệm"
    },
    {
      "id": "T21n1225",
      "title": "大威怒烏芻澁麼儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1225.md",
      "vietTitle": "Kinh Đại Uy Nộ Ô Sô Sáp Ma Nghi Quỹ"
    },
    {
      "id": "T21n1226",
      "title": "烏芻澁明王儀軌梵字",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1226.md",
      "vietTitle": "Ô Sô Sáp Minh Vương Nghi Quỹ Phạm Tự"
    },
    {
      "id": "T21n1227",
      "title": "大威力烏樞瑟摩明王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1227.md",
      "vietTitle": "Kinh Đại Uy Lực Ô Xu Sắt Ma Minh Vương"
    },
    {
      "id": "T21n1228",
      "title": "穢跡金剛說神通大滿陀羅尼法術靈要門",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1228.md",
      "vietTitle": "Uế Tích Kim Cương Thuyết Thần Thông Đại Mãn Đà La Ni Pháp Thuật Linh Yếu Môn"
    },
    {
      "id": "T21n1229",
      "title": "穢跡金剛禁百變法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1229.md",
      "vietTitle": "Kinh Uế Tích Kim Cương Cấm Bách Biến Pháp"
    },
    {
      "id": "T21n1230",
      "title": "佛說大輪金剛總持陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1230.md",
      "vietTitle": "Kinh Phật Thuyết Đại Luân Kim Cương Tổng Trì Đà La Ni"
    },
    {
      "id": "T21n1231",
      "title": "大輪金剛修行悉地成就及供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1231.md",
      "vietTitle": "Đại Luân Kim Cương Tu Hạnh Tất Địa Thành Tựu Cập Cúng Dưỡng Pháp"
    },
    {
      "id": "T21n1232",
      "title": "播般曩結使波金剛念誦儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1232.md",
      "vietTitle": "Bá Bát Nẵng Kết Sứ Ba Kim Cương Niệm Tụng Nghi"
    },
    {
      "id": "T21n1233",
      "title": "佛說無能勝大明王陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1233.md",
      "vietTitle": "Kinh Phật Thuyết Vô Năng Thắng Đại Minh Vương Đà La Ni"
    },
    {
      "id": "T21n1234",
      "title": "無能勝大明陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1234.md",
      "vietTitle": "Kinh Vô Năng Thắng Đại Minh Đà La Ni"
    },
    {
      "id": "T21n1235",
      "title": "無能勝大明心陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1235.md",
      "vietTitle": "Kinh Vô Năng Thắng Đại Minh Tâm Đà La Ni"
    },
    {
      "id": "T21n1236",
      "title": "聖無能勝金剛火陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1236.md",
      "vietTitle": "Kinh Thánh Vô Năng Thắng Kim Cương Hỏa Đà La Ni"
    },
    {
      "id": "T21n1237",
      "title": "阿吒婆拘鬼神大將上佛陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1237.md",
      "vietTitle": "Kinh A Trá Bà Câu Quỷ Thần Đại Tương Thượng Phật Đà La Ni Thần Chú"
    },
    {
      "id": "T21n1238",
      "title": "阿吒婆",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1238.md",
      "vietTitle": "A Trá Bà"
    },
    {
      "id": "T21n1239",
      "title": "阿吒薄俱元帥大將上佛陀羅尼經修行儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1239.md",
      "vietTitle": "A Trá Bạc Câu Nguyên Suất Đại Tương Thượng Phật Đà La Ni Kinh Tu Hạnh Nghi Quỹ"
    },
    {
      "id": "T21n1240",
      "title": "阿吒薄",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1240.md",
      "vietTitle": "A Trá Bạc"
    },
    {
      "id": "T21n1241",
      "title": "伽馱金剛真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1241.md",
      "vietTitle": "Già Đà Kim Cương Chân Ngôn"
    },
    {
      "id": "T21n1242",
      "title": "佛說妙吉祥瑜伽大教金剛陪囉嚩輪觀想成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1242.md",
      "vietTitle": "Kinh Phật Thuyết Diệu Cát Tường Du Già Đại Giáo Kim Cương Bồi La Phược Luân Quan Tưởng Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1243",
      "title": "佛說出生一切如來法眼遍照大力明王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1243.md",
      "vietTitle": "Kinh Phật Thuyết Xuất Sinh Nhất Thiết Như Lai Pháp Nhãn Biến Chiếu Đại Lực Minh Vương"
    },
    {
      "id": "T21n1244",
      "title": "毘沙門天王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1244.md",
      "vietTitle": "Kinh Tỳ Sa Môn Thiên Vương"
    },
    {
      "id": "T21n1245",
      "title": "佛說毘沙門天王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1245.md",
      "vietTitle": "Kinh Phật Thuyết Tỳ Sa Môn Thiên Vương"
    },
    {
      "id": "T21n1246",
      "title": "摩訶吠室囉末那野提婆喝囉闍陀羅尼儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1246.md",
      "vietTitle": "Ma Ha Phệ Thất La Mạt Na Dã Đề Bà Hát La Đồ Đà La Ni Nghi Quỹ"
    },
    {
      "id": "T21n1247",
      "title": "北方毘沙門天王隨軍護法儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1247.md",
      "vietTitle": "Bắc Phương Tỳ Sa Môn Thiên Vương Tùy Quân Hộ Pháp Nghi Quỹ"
    },
    {
      "id": "T21n1248",
      "title": "北方毘沙門天王隨軍護法真言",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1248.md",
      "vietTitle": "Bắc Phương Tỳ Sa Môn Thiên Vương Tùy Quân Hộ Pháp Chân Ngôn"
    },
    {
      "id": "T21n1249",
      "title": "毘沙門儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1249.md",
      "vietTitle": "Tỳ Sa Môn Nghi Quỹ"
    },
    {
      "id": "T21n1250",
      "title": "北方毘沙門多聞寶藏天王神妙陀羅尼別行儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1250.md",
      "vietTitle": "Bắc Phương Tỳ Sa Môn Đa Văn Bảo Tạng Thiên Vương Thần Diệu Đà La Ni Biệt Hạnh Nghi Quỹ"
    },
    {
      "id": "T21n1251",
      "title": "吽迦陀野儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1251.md",
      "vietTitle": "Hồng Ca Đà Dã Nghi Quỹ"
    },
    {
      "id": "T21n1252a",
      "title": "佛說大吉祥天女十二名號經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1252a.md",
      "vietTitle": "Kinh Phật Thuyết Đại Cát Tường Thiên Nữ Thập Nhị Danh Hào"
    },
    {
      "id": "T21n1252b",
      "title": "佛說大吉祥天女十二名號經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1252b.md",
      "vietTitle": "Kinh Phật Thuyết Đại Cát Tường Thiên Nữ Thập Nhị Danh Hào"
    },
    {
      "id": "T21n1253",
      "title": "大吉祥天女十二契一百八名無垢大乘經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1253.md",
      "vietTitle": "Kinh Đại Cát Tường Thiên Nữ Thập Nhị Khế Nhất Bách Bát Danh Vô Cấu Đại Thừa"
    },
    {
      "id": "T21n1254",
      "title": "末利支提婆華鬘經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1254.md",
      "vietTitle": "Kinh Mạt Lợi Chi Đề Bà Hoa Man"
    },
    {
      "id": "T21n1255a",
      "title": "佛說摩利支天菩薩陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1255a.md",
      "vietTitle": "Kinh Phật Thuyết Ma Lợi Chi Thiên Bồ Tát Đà La Ni"
    },
    {
      "id": "T21n1255b",
      "title": "佛說摩利支天經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1255b.md",
      "vietTitle": "Kinh Phật Thuyết Ma Lợi Chi Thiên"
    },
    {
      "id": "T21n1256",
      "title": "佛說摩利支天陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1256.md",
      "vietTitle": "Kinh Phật Thuyết Ma Lợi Chi Thiên Đà La Ni Chú"
    },
    {
      "id": "T21n1257",
      "title": "佛說大摩里支菩薩經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1257.md",
      "vietTitle": "Kinh Phật Thuyết Đại Ma Lý Chi Bồ Tát"
    },
    {
      "id": "T21n1258",
      "title": "摩利支菩薩略念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1258.md",
      "vietTitle": "Ma Lợi Chi Bồ Tát Lược Niệm Tụng Pháp"
    },
    {
      "id": "T21n1259",
      "title": "摩利支天一印法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1259.md",
      "vietTitle": "Ma Lợi Chi Thiên Nhất Ấn Pháp"
    },
    {
      "id": "T21n1260",
      "title": "大藥叉女歡喜母并愛子成就法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1260.md",
      "vietTitle": "Đại Dược Xoa Nữ Hoan Hỷ Mẫu Tịnh Ái Tử Thành Tựu Pháp"
    },
    {
      "id": "T21n1261",
      "title": "訶利帝母真言經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1261.md",
      "vietTitle": "Kinh Ha Lợi Đế Mẫu Chân Ngôn"
    },
    {
      "id": "T21n1262",
      "title": "佛說鬼子母經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1262.md",
      "vietTitle": "Kinh Phật Thuyết Quỷ Tử Mẫu"
    },
    {
      "id": "T21n1263",
      "title": "氷揭羅天童子經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1263.md",
      "vietTitle": "Kinh Băng Yết La Thiên Đồng Tử"
    },
    {
      "id": "T21n1264a",
      "title": "觀自在菩薩化身蘘麌哩曳童女銷伏毒害陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1264a.md",
      "vietTitle": "Kinh Quan Tự Tại Bồ Tát Hóa Thân Nương Vũ Rỉ Duệ Đồng Nữ Tiêu Phục Độc Hại Đà La Ni"
    },
    {
      "id": "T21n1264b",
      "title": "佛說穰麌梨童女經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1264b.md",
      "vietTitle": "Kinh Phật Thuyết Nhưỡng Vũ Lê Đồng Nữ"
    },
    {
      "id": "T21n1265",
      "title": "佛說常瞿利毒女陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1265.md",
      "vietTitle": "Kinh Phật Thuyết Thường Cù Lợi Độc Nữ Đà La Ni Chú"
    },
    {
      "id": "T21n1266",
      "title": "大聖天歡喜雙身毘那夜迦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1266.md",
      "vietTitle": "Đại Thánh Thiên Hoan Hỷ Song Thân Tỳ Na Dạ Ca Pháp"
    },
    {
      "id": "T21n1267",
      "title": "使呪法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1267.md",
      "vietTitle": "Kinh Sứ Chú Pháp"
    },
    {
      "id": "T21n1268",
      "title": "大使呪法經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1268.md",
      "vietTitle": "Kinh Đại Sứ Chú Pháp"
    },
    {
      "id": "T21n1269",
      "title": "佛說金色迦那鉢底陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1269.md",
      "vietTitle": "Kinh Phật Thuyết Kim Sắc Ca Na Bát Để Đà La Ni"
    },
    {
      "id": "T21n1270",
      "title": "大聖歡喜雙身大自在天毘那夜迦王歸依念誦供養法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1270.md",
      "vietTitle": "Đại Thánh Hoan Hỷ Song Thân Đại Tự Tại Thiên Tỳ Na Dạ Ca Vương Quy Y Niệm Tụng Cúng Dưỡng Pháp"
    },
    {
      "id": "T21n1271",
      "title": "摩訶毘盧遮那如來定惠均等入三昧耶身雙身大聖歡喜天菩薩修行祕密法儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1271.md",
      "vietTitle": "Ma Ha Tỳ Lô Già Na Như Lai Định Huệ Quân Đẳng Nhập Tam Muội Da Thân Song Thân Đại Thánh Hoan Hỷ Thiên Bồ Tát Tu Hạnh Bí Mật Pháp Nghi Quỹ"
    },
    {
      "id": "T21n1272",
      "title": "金剛薩埵說頻那夜迦天成就儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1272.md",
      "vietTitle": "Kinh Kim Cương Tát Đóa Thuyết Tần Na Dạ Ca Thiên Thành Tựu Nghi Quỹ"
    },
    {
      "id": "T21n1273",
      "title": "毘那夜迦誐那鉢底瑜伽悉地品祕要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1273.md",
      "vietTitle": "Tỳ Na Dạ Ca Nga Na Bát Để Du Già Tất Địa Phẩm Bí Yếu"
    },
    {
      "id": "T21n1274",
      "title": "大聖歡喜雙身毘那夜迦天形像品儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1274.md",
      "vietTitle": "Đại Thánh Hoan Hỷ Song Thân Tỳ Na Dạ Ca Thiên Hình Tượng Phẩm Nghi Quỹ"
    },
    {
      "id": "T21n1275",
      "title": "聖歡喜天式法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1275.md",
      "vietTitle": "Thánh Hoan Hỷ Thiên Thức Pháp"
    },
    {
      "id": "T21n1276",
      "title": "文殊師利菩薩根本大教王經金翅鳥王品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1276.md",
      "vietTitle": "Văn Thù Sư Lợi Bồ Tát Căn Bản Đại Giáo Vương Kinh Kim Sí Điểu Vương Phẩm"
    },
    {
      "id": "T21n1277",
      "title": "速疾立驗魔醯首羅天說阿尾奢法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1277.md",
      "vietTitle": "Tốc Tật Lập Nghiệm Ma Hê Thủ La Thiên Thuyết A Vĩ Xa Pháp"
    },
    {
      "id": "T21n1278",
      "title": "迦樓羅及諸天密言經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1278.md",
      "vietTitle": "Kinh Ca Lâu La Cập Chư Thiên Mật Ngôn"
    },
    {
      "id": "T21n1279",
      "title": "摩醯首羅天法要",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1279.md",
      "vietTitle": "Ma Hê Thủ La Thiên Pháp Yếu"
    },
    {
      "id": "T21n1280",
      "title": "摩醯首羅大自在天王神通化生伎藝天女念誦法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1280.md",
      "vietTitle": "Ma Hê Thủ La Đại Tự Tại Thiên Vương Thần Thông Hóa Sinh Kỹ Nghệ Thiên Nữ Niệm Tụng Pháp"
    },
    {
      "id": "T21n1281",
      "title": "那羅延天共阿修羅王鬪戰法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1281.md",
      "vietTitle": "Na La Diên Thiên Cộng A Tu La Vương Đấu Chiến Pháp"
    },
    {
      "id": "T21n1282",
      "title": "寶藏天女陀羅尼法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1282.md",
      "vietTitle": "Bảo Tạng Thiên Nữ Đà La Ni Pháp"
    },
    {
      "id": "T21n1283",
      "title": "佛說寶藏神大明曼拏羅儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1283.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Tạng Thần Đại Minh Mạn Noa La Nghi Quỹ"
    },
    {
      "id": "T21n1284",
      "title": "佛說聖寶藏神儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1284.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Bảo Tạng Thần Nghi Quỹ"
    },
    {
      "id": "T21n1285",
      "title": "佛說寶賢陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1285.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Hiền Đà La Ni"
    },
    {
      "id": "T21n1286",
      "title": "堅牢地天儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1286.md",
      "vietTitle": "Kiên Lao Địa Thiên Nghi Quỹ"
    },
    {
      "id": "T21n1287",
      "title": "大黑天神法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1287.md",
      "vietTitle": "Đại Hắc Thiên Thần Pháp"
    },
    {
      "id": "T21n1288",
      "title": "佛說最上祕密那拏天經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1288.md",
      "vietTitle": "Kinh Phật Thuyết Tối Thượng Bí Mật Na Noa Thiên"
    },
    {
      "id": "T21n1289",
      "title": "佛說金毘羅童子威德經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1289.md",
      "vietTitle": "Kinh Phật Thuyết Kim Tỳ La Đồng Tử Uy Đức"
    },
    {
      "id": "T21n1290",
      "title": "焰羅王供行法次第",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1290.md",
      "vietTitle": "Diễm La Vương Cúng Hạnh Pháp Thứ Đệ"
    },
    {
      "id": "T21n1291",
      "title": "深沙大將儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1291.md",
      "vietTitle": "Thâm Sa Đại Tương Nghi Quỹ"
    },
    {
      "id": "T21n1292",
      "title": "法華十羅剎法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1292.md",
      "vietTitle": "Pháp Hoa Thập La Sát Pháp"
    },
    {
      "id": "T21n1293",
      "title": "般若守護十六善神王形體",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1293.md",
      "vietTitle": "Bát Nhã Thủ Hộ Thập Lục Thiện Thần Vương Hình Thể"
    },
    {
      "id": "T21n1294",
      "title": "施八方天儀則",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1294.md",
      "vietTitle": "Thí Bát Phương Thiên Nghi Tắc"
    },
    {
      "id": "T21n1295",
      "title": "供養護世八天法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1295.md",
      "vietTitle": "Cúng Dưỡng Hộ Thế Bát Thiên Pháp"
    },
    {
      "id": "T21n1296",
      "title": "十天儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1296.md",
      "vietTitle": "Thập Thiên Nghi Quỹ"
    },
    {
      "id": "T21n1297",
      "title": "供養十二大威德天報恩品",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1297.md",
      "vietTitle": "Cúng Dưỡng Thập Nhị Đại Uy Đức Thiên Báo Ân Phẩm"
    },
    {
      "id": "T21n1298",
      "title": "十二天供儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1298.md",
      "vietTitle": "Thập Nhị Thiên Cúng Nghi Quỹ"
    },
    {
      "id": "T21n1299",
      "title": "文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1299.md",
      "vietTitle": "Kinh Văn Thù Sư Lợi Bồ Tát Cập Chư Tiên Sở Thuyết Cát Hung Thời Nhật Thiện Ác Túc Diệu"
    },
    {
      "id": "T21n1300",
      "title": "摩登伽經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1300.md",
      "vietTitle": "Kinh Ma Đăng Già"
    },
    {
      "id": "T21n1301",
      "title": "舍頭諫太子二十八宿經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1301.md",
      "vietTitle": "Kinh Xá Đầu Gián Thái Tử Nhị Thập Bát Túc"
    },
    {
      "id": "T21n1302",
      "title": "諸星母陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1302.md",
      "vietTitle": "Kinh Chư Tinh Mẫu Đà La Ni"
    },
    {
      "id": "T21n1303",
      "title": "佛說聖曜母陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1303.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Diệu Mẫu Đà La Ni"
    },
    {
      "id": "T21n1304",
      "title": "宿曜儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1304.md",
      "vietTitle": "Túc Diệu Nghi Quỹ"
    },
    {
      "id": "T21n1305",
      "title": "北斗七星念誦儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1305.md",
      "vietTitle": "Bắc Đẩu Thất Tinh Niệm Tụng Nghi Quỹ"
    },
    {
      "id": "T21n1306",
      "title": "北斗七星護摩祕要儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1306.md",
      "vietTitle": "Bắc Đẩu Thất Tinh Hộ Ma Bí Yếu Nghi Quỹ"
    },
    {
      "id": "T21n1307",
      "title": "佛說北斗七星延命經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1307.md",
      "vietTitle": "Kinh Phật Thuyết Bắc Đẩu Thất Tinh Diên Mạng"
    },
    {
      "id": "T21n1308",
      "title": "七曜攘災決",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1308.md",
      "vietTitle": "Thất Diệu Nhượng Tai Quyết"
    },
    {
      "id": "T21n1309",
      "title": "七曜星辰別行法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1309.md",
      "vietTitle": "Thất Diệu Tinh Thần Biệt Hạnh Pháp"
    },
    {
      "id": "T21n1310",
      "title": "北斗七星護摩法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1310.md",
      "vietTitle": "Bắc Đẩu Thất Tinh Hộ Ma Pháp"
    },
    {
      "id": "T21n1311",
      "title": "梵天火羅九曜",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1311.md",
      "vietTitle": "Phạm Thiên Hỏa La Cửu Diệu"
    },
    {
      "id": "T21n1312",
      "title": "難儞計濕嚩囉天說支輪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1312.md",
      "vietTitle": "Kinh Nan Nễ Kế Thấp Phược La Thiên Thuyết Chi Luân"
    },
    {
      "id": "T21n1313",
      "title": "佛說救拔焰口餓鬼陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1313.md",
      "vietTitle": "Kinh Phật Thuyết Cứu Bạt Diễm Khẩu Ngạ Quỷ Đà La Ni"
    },
    {
      "id": "T21n1314",
      "title": "佛說救面然餓鬼陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1314.md",
      "vietTitle": "Kinh Phật Thuyết Cứu Diện Nhiên Ngạ Quỷ Đà La Ni Thần Chú"
    },
    {
      "id": "T21n1315",
      "title": "施諸餓鬼飲食及水法",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1315.md",
      "vietTitle": "Thí Chư Ngạ Quỷ Ẩm Thực Cập Thủy Pháp"
    },
    {
      "id": "T21n1316",
      "title": "佛說甘露經陀羅尼呪",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1316.md",
      "vietTitle": "Phật Thuyết Cam Lộ Kinh Đà La Ni Chú"
    },
    {
      "id": "T21n1317",
      "title": "甘露陀羅尼呪",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1317.md",
      "vietTitle": "Cam Lộ Đà La Ni Chú"
    },
    {
      "id": "T21n1318",
      "title": "瑜伽集要救阿難陀羅尼焰口軌儀經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1318.md",
      "vietTitle": "Kinh Du Già Tập Yếu Cứu A Nan Đà La Ni Diễm Khẩu Quỹ Nghi"
    },
    {
      "id": "T21n1319",
      "title": "瑜伽集要焰口施食起教阿難陀緣由",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1319.md",
      "vietTitle": "Du Già Tập Yếu Diễm Khẩu Thí Thực Khởi Giáo A Nan Đà Duyên Do"
    },
    {
      "id": "T21n1320",
      "title": "瑜伽集要焰口施食儀",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1320.md",
      "vietTitle": "Du Già Tập Yếu Diễm Khẩu Thí Thực Nghi"
    },
    {
      "id": "T21n1321",
      "title": "佛說施餓鬼甘露味大陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1321.md",
      "vietTitle": "Kinh Phật Thuyết Thí Ngạ Quỷ Cam Lộ Vị Đại Đà La Ni"
    },
    {
      "id": "T21n1322",
      "title": "新集浴像儀軌",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1322.md",
      "vietTitle": "Tân Tập Dục Tượng Nghi Quỹ"
    },
    {
      "id": "T21n1323",
      "title": "除一切疾病陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1323.md",
      "vietTitle": "Kinh Trừ Nhất Thiết Tật Bệnh Đà La Ni"
    },
    {
      "id": "T21n1324",
      "title": "能淨一切眼疾病陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1324.md",
      "vietTitle": "Kinh Năng Tịnh Nhất Thiết Nhãn Tật Bệnh Đà La Ni"
    },
    {
      "id": "T21n1325",
      "title": "佛說療痔病經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1325.md",
      "vietTitle": "Kinh Phật Thuyết Liệu Trĩ Bệnh"
    },
    {
      "id": "T21n1326",
      "title": "佛說呪時氣病經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1326.md",
      "vietTitle": "Kinh Phật Thuyết Chú Thời Khí Bệnh"
    },
    {
      "id": "T21n1327",
      "title": "佛說呪齒經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1327.md",
      "vietTitle": "Kinh Phật Thuyết Chú Xỉ"
    },
    {
      "id": "T21n1328",
      "title": "佛說呪目經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1328.md",
      "vietTitle": "Kinh Phật Thuyết Chú Mục"
    },
    {
      "id": "T21n1329",
      "title": "佛說呪小兒經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1329.md",
      "vietTitle": "Kinh Phật Thuyết Chú Tiểu Nhi"
    },
    {
      "id": "T21n1330",
      "title": "囉嚩拏說救療小兒疾病經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1330.md",
      "vietTitle": "Kinh La Phược Noa Thuyết Cứu Liệu Tiểu Nhi Tật Bệnh"
    },
    {
      "id": "T21n1331",
      "title": "佛說灌頂經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1331.md",
      "vietTitle": "Kinh Phật Thuyết Quán Đính"
    },
    {
      "id": "T21n1332",
      "title": "七佛八菩薩所說大陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1332.md",
      "vietTitle": "Kinh Thất Phật Bát Bồ Tát Sở Thuyết Đại Đà La Ni Thần Chú"
    },
    {
      "id": "T21n1333",
      "title": "虛空藏菩薩問七佛陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1333.md",
      "vietTitle": "Kinh Hư Không Tạng Bồ Tát Vấn Thất Phật Đà La Ni Chú"
    },
    {
      "id": "T21n1334",
      "title": "如來方便善巧呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1334.md",
      "vietTitle": "Kinh Như Lai Phương Tiện Thiện Xảo Chú"
    },
    {
      "id": "T21n1335",
      "title": "大吉義神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1335.md",
      "vietTitle": "Kinh Đại Cát Nghĩa Thần Chú"
    },
    {
      "id": "T21n1336",
      "title": "陀羅尼雜集",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1336.md",
      "vietTitle": "Đà La Ni Tạp Tập"
    },
    {
      "id": "T21n1337",
      "title": "種種雜呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1337.md",
      "vietTitle": "Kinh Chủng Chủng Tạp Chú"
    },
    {
      "id": "T21n1338",
      "title": "呪三首經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1338.md",
      "vietTitle": "Kinh Chú Tam Thủ"
    },
    {
      "id": "T21n1339",
      "title": "大方等陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1339.md",
      "vietTitle": "Kinh Đại Phương Đẳng Đà La Ni"
    },
    {
      "id": "T21n1340",
      "title": "大法炬陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1340.md",
      "vietTitle": "Kinh Đại Pháp Cự Đà La Ni"
    },
    {
      "id": "T21n1341",
      "title": "大威德陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1341.md",
      "vietTitle": "Kinh Đại Uy Đức Đà La Ni"
    },
    {
      "id": "T21n1342",
      "title": "佛說無崖際總持法門經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1342.md",
      "vietTitle": "Kinh Phật Thuyết Vô Nhai Tế Tổng Trì Pháp Môn"
    },
    {
      "id": "T21n1343",
      "title": "尊勝菩薩所問一切諸法入無量門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1343.md",
      "vietTitle": "Kinh Tôn Thắng Bồ Tát Sở Vấn Nhất Thiết Chư Pháp Nhập Vô Lượng Môn Đà La Ni"
    },
    {
      "id": "T21n1344",
      "title": "金剛上味陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1344.md",
      "vietTitle": "Kinh Kim Cương Thượng Vị Đà La Ni"
    },
    {
      "id": "T21n1345",
      "title": "金剛場陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1345.md",
      "vietTitle": "Kinh Kim Cương Tràng Đà La Ni"
    },
    {
      "id": "T21n1346",
      "title": "諸佛集會陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1346.md",
      "vietTitle": "Kinh Chư Phật Tập Hội Đà La Ni"
    },
    {
      "id": "T21n1347",
      "title": "息除中夭陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1347.md",
      "vietTitle": "Kinh Tức Trừ Trung Yêu Đà La Ni"
    },
    {
      "id": "T21n1348",
      "title": "佛說十二佛名神呪校量功德除障滅罪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1348.md",
      "vietTitle": "Kinh Phật Thuyết Thập Nhị Phật Danh Thần Chú Hiệu Lượng Công Đức Trừ Chướng Diệt Tội"
    },
    {
      "id": "T21n1349",
      "title": "佛說稱讚如來功德神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1349.md",
      "vietTitle": "Kinh Phật Thuyết Xưng Tán Như Lai Công Đức Thần Chú"
    },
    {
      "id": "T21n1350",
      "title": "佛說一切如來名號陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1350.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai Danh Hào Đà La Ni"
    },
    {
      "id": "T21n1351",
      "title": "佛說持句神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1351.md",
      "vietTitle": "Kinh Phật Thuyết Trì Cú Thần Chú"
    },
    {
      "id": "T21n1352",
      "title": "佛說陀隣尼鉢經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1352.md",
      "vietTitle": "Kinh Phật Thuyết Đà Lân Ni Bát"
    },
    {
      "id": "T21n1353",
      "title": "東方最勝燈王陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1353.md",
      "vietTitle": "Kinh Đông Phương Tối Thắng Đăng Vương Đà La Ni"
    },
    {
      "id": "T21n1354",
      "title": "東方最勝燈王如來經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1354.md",
      "vietTitle": "Kinh Đông Phương Tối Thắng Đăng Vương Như Lai"
    },
    {
      "id": "T21n1355",
      "title": "佛說聖最上燈明如來陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1355.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Tối Thượng Đăng Minh Như Lai Đà La Ni"
    },
    {
      "id": "T21n1356",
      "title": "佛說華積陀羅尼神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1356.md",
      "vietTitle": "Kinh Phật Thuyết Hoa Tích Đà La Ni Thần Chú"
    },
    {
      "id": "T21n1357",
      "title": "佛說師子奮迅菩薩所問經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1357.md",
      "vietTitle": "Kinh Phật Thuyết Sư Tử Phấn Tấn Bồ Tát Sở Vấn"
    },
    {
      "id": "T21n1358",
      "title": "佛說花聚陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1358.md",
      "vietTitle": "Kinh Phật Thuyết Hoa Tụ Đà La Ni Chú"
    },
    {
      "id": "T21n1359",
      "title": "佛說花積樓閣陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1359.md",
      "vietTitle": "Kinh Phật Thuyết Hoa Tích Lâu Các Đà La Ni"
    },
    {
      "id": "T21n1360",
      "title": "六門陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1360.md",
      "vietTitle": "Kinh Lục Môn Đà La Ni"
    },
    {
      "id": "T21n1361",
      "title": "六門陀羅尼經論",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1361.md",
      "vietTitle": "Lục Môn Đà La Ni Kinh Luận"
    },
    {
      "id": "T21n1362",
      "title": "佛說善夜經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1362.md",
      "vietTitle": "Kinh Phật Thuyết Thiện Dạ"
    },
    {
      "id": "T21n1363",
      "title": "勝幢臂印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1363.md",
      "vietTitle": "Kinh Thắng Tràng Tý Ấn Đà La Ni"
    },
    {
      "id": "T21n1364",
      "title": "妙臂印幢陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1364.md",
      "vietTitle": "Kinh Diệu Tý Ấn Tràng Đà La Ni"
    },
    {
      "id": "T21n1365",
      "title": "八名普密陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1365.md",
      "vietTitle": "Kinh Bát Danh Phổ Mật Đà La Ni"
    },
    {
      "id": "T21n1366",
      "title": "佛說祕密八名陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1366.md",
      "vietTitle": "Kinh Phật Thuyết Bí Mật Bát Danh Đà La Ni"
    },
    {
      "id": "T21n1367",
      "title": "佛說大普賢陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1367.md",
      "vietTitle": "Kinh Phật Thuyết Đại Phổ Hiền Đà La Ni"
    },
    {
      "id": "T21n1368",
      "title": "佛說大七寶陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1368.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thất Bảo Đà La Ni"
    },
    {
      "id": "T21n1369a",
      "title": "百千印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1369a.md",
      "vietTitle": "Kinh Bách Thiên Ấn Đà La Ni"
    },
    {
      "id": "T21n1369b",
      "title": "百千印陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1369b.md",
      "vietTitle": "Kinh Bách Thiên Ấn Đà La Ni"
    },
    {
      "id": "T21n1370",
      "title": "佛說持明藏八大總持王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1370.md",
      "vietTitle": "Kinh Phật Thuyết Trì Minh Tạng Bát Đại Tổng Trì Vương"
    },
    {
      "id": "T21n1371",
      "title": "佛說聖大總持王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1371.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Đại Tổng Trì Vương"
    },
    {
      "id": "T21n1372",
      "title": "增慧陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1372.md",
      "vietTitle": "Kinh Tăng Tuệ Đà La Ni"
    },
    {
      "id": "T21n1373",
      "title": "佛說施一切無畏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1373.md",
      "vietTitle": "Kinh Phật Thuyết Thí Nhất Thiết Vô Úy Đà La Ni"
    },
    {
      "id": "T21n1374",
      "title": "佛說一切功德莊嚴王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1374.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Công Đức Trang Nghiêm Vương"
    },
    {
      "id": "T21n1375",
      "title": "佛說莊嚴王陀羅尼呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1375.md",
      "vietTitle": "Kinh Phật Thuyết Trang Nghiêm Vương Đà La Ni Chú"
    },
    {
      "id": "T21n1376",
      "title": "佛說聖莊嚴陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1376.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Trang Nghiêm Đà La Ni"
    },
    {
      "id": "T21n1377",
      "title": "佛說寶帶陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1377.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Đái Đà La Ni"
    },
    {
      "id": "T21n1378a",
      "title": "佛說玄師颰陀所說神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1378a.md",
      "vietTitle": "Kinh Phật Thuyết Huyền Sư Bạt Đà Sở Thuyết Thần Chú"
    },
    {
      "id": "T21n1378b",
      "title": "幻師颰陀神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1378b.md",
      "vietTitle": "Kinh Huyễn Sư Bạt Đà Thần Chú"
    },
    {
      "id": "T21n1379",
      "title": "佛說大愛陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1379.md",
      "vietTitle": "Kinh Phật Thuyết Đại Ái Đà La Ni"
    },
    {
      "id": "T21n1380",
      "title": "佛說善樂長者經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1380.md",
      "vietTitle": "Kinh Phật Thuyết Thiện Lạc Trường Giả"
    },
    {
      "id": "T21n1381",
      "title": "佛說大吉祥陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1381.md",
      "vietTitle": "Kinh Phật Thuyết Đại Cát Tường Đà La Ni"
    },
    {
      "id": "T21n1382",
      "title": "佛說宿命智陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1382.md",
      "vietTitle": "Phật Thuyết Túc Mạng Trí Đà La Ni"
    },
    {
      "id": "T21n1383",
      "title": "佛說宿命智陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1383.md",
      "vietTitle": "Kinh Phật Thuyết Túc Mạng Trí Đà La Ni"
    },
    {
      "id": "T21n1384",
      "title": "佛說鉢蘭那賒嚩哩大陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1384.md",
      "vietTitle": "Kinh Phật Thuyết Bát Lan Na Xa Phược Rỉ Đại Đà La Ni"
    },
    {
      "id": "T21n1385",
      "title": "佛說俱枳羅陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1385.md",
      "vietTitle": "Kinh Phật Thuyết Câu Chỉ La Đà La Ni"
    },
    {
      "id": "T21n1386",
      "title": "佛說妙色陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1386.md",
      "vietTitle": "Kinh Phật Thuyết Diệu Sắc Đà La Ni"
    },
    {
      "id": "T21n1387",
      "title": "佛說栴檀香身陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1387.md",
      "vietTitle": "Kinh Phật Thuyết Chiên Đàn Hương Thân Đà La Ni"
    },
    {
      "id": "T21n1388",
      "title": "佛說無畏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1388.md",
      "vietTitle": "Kinh Phật Thuyết Vô Úy Đà La Ni"
    },
    {
      "id": "T21n1389",
      "title": "佛說無量壽大智陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1389.md",
      "vietTitle": "Phật Thuyết Vô Lượng Thọ Đại Trí Đà La Ni"
    },
    {
      "id": "T21n1390",
      "title": "佛說洛叉陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1390.md",
      "vietTitle": "Kinh Phật Thuyết Lạc Xoa Đà La Ni"
    },
    {
      "id": "T21n1391",
      "title": "佛說檀特羅麻油述經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1391.md",
      "vietTitle": "Kinh Phật Thuyết Đàn Đặc La Ma Du Thuật"
    },
    {
      "id": "T21n1392",
      "title": "大寒林聖難拏陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1392.md",
      "vietTitle": "Kinh Đại Hàn Lâm Thánh Nan Noa Đà La Ni"
    },
    {
      "id": "T21n1393",
      "title": "佛說摩尼羅亶經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1393.md",
      "vietTitle": "Kinh Phật Thuyết Ma Ni La Đản"
    },
    {
      "id": "T21n1394",
      "title": "佛說安宅神呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1394.md",
      "vietTitle": "Kinh Phật Thuyết An Trạch Thần Chú"
    },
    {
      "id": "T21n1395",
      "title": "拔濟苦難陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1395.md",
      "vietTitle": "Kinh Bạt Tế Khổ Nan Đà La Ni"
    },
    {
      "id": "T21n1396",
      "title": "佛說拔除罪障呪王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1396.md",
      "vietTitle": "Kinh Phật Thuyết Bạt Trừ Tội Chướng Chú Vương"
    },
    {
      "id": "T21n1397",
      "title": "智炬陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1397.md",
      "vietTitle": "Kinh Trí Cự Đà La Ni"
    },
    {
      "id": "T21n1398",
      "title": "佛說智光滅一切業障陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1398.md",
      "vietTitle": "Kinh Phật Thuyết Trí Quang Diệt Nhất Thiết Nghiệp Chướng Đà La Ni"
    },
    {
      "id": "T21n1399",
      "title": "佛說滅除五逆罪大陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1399.md",
      "vietTitle": "Kinh Phật Thuyết Diệt Trừ Ngũ Nghịch Tội Đại Đà La Ni"
    },
    {
      "id": "T21n1400",
      "title": "佛說消除一切災障寶髻陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1400.md",
      "vietTitle": "Kinh Phật Thuyết Tiêu Trừ Nhất Thiết Tai Chướng Bảo Kế Đà La Ni"
    },
    {
      "id": "T21n1401",
      "title": "佛說大金剛香陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1401.md",
      "vietTitle": "Kinh Phật Thuyết Đại Kim Cương Hương Đà La Ni"
    },
    {
      "id": "T21n1402",
      "title": "消除一切閃電障難隨求如意陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1402.md",
      "vietTitle": "Kinh Tiêu Trừ Nhất Thiết Thiểm Điện Chướng Nan Tùy Cầu Như Ý Đà La Ni"
    },
    {
      "id": "T21n1403",
      "title": "佛說如意摩尼陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1403.md",
      "vietTitle": "Kinh Phật Thuyết Như Ý Ma Ni Đà La Ni"
    },
    {
      "id": "T21n1404",
      "title": "佛說如意寶總持王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1404.md",
      "vietTitle": "Kinh Phật Thuyết Như Ý Bảo Tổng Trì Vương"
    },
    {
      "id": "T21n1405",
      "title": "佛說息除賊難陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1405.md",
      "vietTitle": "Kinh Phật Thuyết Tức Trừ Tặc Nan Đà La Ni"
    },
    {
      "id": "T21n1406",
      "title": "佛說辟除賊害呪經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1406.md",
      "vietTitle": "Kinh Phật Thuyết Bích Trừ Tặc Hại Chú"
    },
    {
      "id": "T21n1407",
      "title": "佛說辟除諸惡陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1407.md",
      "vietTitle": "Kinh Phật Thuyết Bích Trừ Chư Ác Đà La Ni"
    },
    {
      "id": "T21n1408",
      "title": "佛說最上意陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1408.md",
      "vietTitle": "Kinh Phật Thuyết Tối Thượng Ý Đà La Ni"
    },
    {
      "id": "T21n1409",
      "title": "佛說聖最勝陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1409.md",
      "vietTitle": "Kinh Phật Thuyết Thánh Tối Thắng Đà La Ni"
    },
    {
      "id": "T21n1410",
      "title": "佛說勝幡瓔珞陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1410.md",
      "vietTitle": "Kinh Phật Thuyết Thắng Phan Anh Lạc Đà La Ni"
    },
    {
      "id": "T21n1411",
      "title": "佛說蓮華眼陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1411.md",
      "vietTitle": "Kinh Phật Thuyết Liên Hoa Nhãn Đà La Ni"
    },
    {
      "id": "T21n1412",
      "title": "佛說寶生陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1412.md",
      "vietTitle": "Kinh Phật Thuyết Bảo Sinh Đà La Ni"
    },
    {
      "id": "T21n1413",
      "title": "佛說尊勝大明王經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1413.md",
      "vietTitle": "Kinh Phật Thuyết Tôn Thắng Đại Minh Vương"
    },
    {
      "id": "T21n1414",
      "title": "佛說金身陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1414.md",
      "vietTitle": "Kinh Phật Thuyết Kim Thân Đà La Ni"
    },
    {
      "id": "T21n1415",
      "title": "大金剛妙高山樓閣陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1415.md",
      "vietTitle": "Đại Kim Cương Diệu Cao Sơn Lâu Các Đà La Ni"
    },
    {
      "id": "T21n1416",
      "title": "金剛摧碎陀羅尼",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1416.md",
      "vietTitle": "Kim Cương Tồi Toái Đà La Ni"
    },
    {
      "id": "T21n1417",
      "title": "佛說壞相金剛陀羅尼經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1417.md",
      "vietTitle": "Kinh Phật Thuyết Hoại Tướng Kim Cương Đà La Ni"
    },
    {
      "id": "T21n1418",
      "title": "佛說一切如來安像三昧儀軌經",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1418.md",
      "vietTitle": "Kinh Phật Thuyết Nhất Thiết Như Lai An Tượng Tam Muội Nghi Quỹ"
    },
    {
      "id": "T21n1419",
      "title": "佛說造像量度經解",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1419.md",
      "vietTitle": "Phật Thuyết Tạo Tượng Lượng Độ Kinh Giải"
    },
    {
      "id": "T21n1420",
      "title": "龍樹五明論",
      "division": "10",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/10_Mat_Giao/T21n1420.md",
      "vietTitle": "Long Thụ Ngũ Minh Luận"
    },
    {
      "id": "T22n1421",
      "title": "彌沙塞部和醯五分律",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1421_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1421.md",
      "vietTitle": "Ngũ Phần Luật (Di Sa Tắc Bộ Hòa Hê Ngũ Phần Luật)"
    },
    {
      "id": "T22n1422a",
      "title": "彌沙塞五分戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1422a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1422a.md",
      "vietTitle": "Di Sa Tắc Ngũ Phân Giới Bản"
    },
    {
      "id": "T22n1422b",
      "title": "五分戒本",
      "division": "11",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1422b.md",
      "vietTitle": "Ngũ Phân Giới Bản"
    },
    {
      "id": "T22n1423",
      "title": "五分比丘尼戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1423_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1423.md",
      "vietTitle": "Ngũ Phân Tỳ Kheo Ni Giới Bản"
    },
    {
      "id": "T22n1424",
      "title": "彌沙塞羯磨本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1424_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1424.md",
      "vietTitle": "Di Sa Tắc Yết Ma Bản"
    },
    {
      "id": "T22n1425",
      "title": "摩訶僧祇律",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1425_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1425.md",
      "vietTitle": "Ma Ha Tăng Kỳ Luật"
    },
    {
      "id": "T22n1426",
      "title": "摩訶僧祇律大比丘戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1426_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1426.md",
      "vietTitle": "Ma Ha Tăng Kỳ Luật Đại Tỳ Kheo Giới Bản"
    },
    {
      "id": "T22n1427",
      "title": "摩訶僧祇比丘尼戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1427_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1427.md",
      "vietTitle": "Ma Ha Tăng Kỳ Tỳ Kheo Ni Giới Bản"
    },
    {
      "id": "T22n1428",
      "title": "四分律",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1428_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1428.md",
      "vietTitle": "Tứ Phần Luật"
    },
    {
      "id": "T22n1429",
      "title": "四分律比丘戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1429_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1429.md",
      "vietTitle": "Tứ Phân Luật Tỳ Kheo Giới Bản"
    },
    {
      "id": "T22n1430",
      "title": "四分僧戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1430_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1430.md",
      "vietTitle": "Tứ Phân Tăng Giới Bản"
    },
    {
      "id": "T22n1431",
      "title": "四分比丘尼戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1431_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1431.md",
      "vietTitle": "Tứ Phân Tỳ Kheo Ni Giới Bản"
    },
    {
      "id": "T22n1432",
      "title": "曇無德律部雜羯磨",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1432_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1432.md",
      "vietTitle": "Đàm Vô Đức Luật Bộ Tạp Yết Ma"
    },
    {
      "id": "T22n1433",
      "title": "羯磨",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1433_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1433.md",
      "vietTitle": "Yết Ma"
    },
    {
      "id": "T22n1434",
      "title": "四分比丘尼羯磨法",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1434_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T22n1434.md",
      "vietTitle": "Tứ Phân Tỳ Kheo Ni Yết Ma Pháp"
    },
    {
      "id": "T23n1435",
      "title": "十誦律",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1435_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1435.md",
      "vietTitle": "Thập Tụng Luật"
    },
    {
      "id": "T23n1436",
      "title": "十誦比丘波羅提木叉戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1436_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1436.md",
      "vietTitle": "Thập Tụng Tỳ Kheo Ba La Đề Mộc Xoa Giới Bản"
    },
    {
      "id": "T23n1437",
      "title": "十誦比丘尼波羅提木叉戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1437_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1437.md",
      "vietTitle": "Thập Tụng Tỳ Kheo Ni Ba La Đề Mộc Xoa Giới Bản"
    },
    {
      "id": "T23n1438",
      "title": "大沙門百一羯磨法",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1438_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1438.md",
      "vietTitle": "Đại Sa Môn Bách Nhất Yết Ma Pháp"
    },
    {
      "id": "T23n1439",
      "title": "十誦羯磨比丘要用",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1439_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1439.md",
      "vietTitle": "Thập Tụng Yết Ma Tỳ Kheo Yếu Dụng"
    },
    {
      "id": "T23n1440",
      "title": "薩婆多毘尼毘婆沙",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1440_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1440.md",
      "vietTitle": "Tát Bà Đa Tỳ Ni Tỳ Bà Sa"
    },
    {
      "id": "T23n1441",
      "title": "薩婆多部毘尼摩得勒伽",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1441_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1441.md",
      "vietTitle": "Tát Bà Đa Bộ Tỳ Ni Ma Đắc Lặc Già"
    },
    {
      "id": "T23n1442",
      "title": "根本說一切有部毘奈耶",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1442_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1442.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da"
    },
    {
      "id": "T23n1443",
      "title": "根本說一切有部苾芻尼毘奈耶",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1443_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1443.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Bật Sô Ni Tỳ Nại Da"
    },
    {
      "id": "T23n1444",
      "title": "根本說一切有部毘奈耶出家事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1444_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1444.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Xuất Gia Sự"
    },
    {
      "id": "T23n1445",
      "title": "根本說一切有部毘奈耶安居事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1445_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1445.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da An Cư Sự"
    },
    {
      "id": "T23n1446",
      "title": "根本說一切有部毘奈耶隨意事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1446_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1446.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Tùy Ý Sự"
    },
    {
      "id": "T23n1447",
      "title": "根本說一切有部毘奈耶皮革事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1447_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T23n1447.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Bì Cách Sự"
    },
    {
      "id": "T24n1448",
      "title": "根本說一切有部毘奈耶藥事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1448_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1448.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Dược Sự"
    },
    {
      "id": "T24n1449",
      "title": "根本說一切有部毘奈耶羯恥那衣事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1449_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1449.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Yết Sỉ Na Y Sự"
    },
    {
      "id": "T24n1450",
      "title": "根本說一切有部毘奈耶破僧事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1450_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1450.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Phá Tăng Sự"
    },
    {
      "id": "T24n1451",
      "title": "根本說一切有部毘奈耶雜事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1451_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1451.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Tạp Sự"
    },
    {
      "id": "T24n1452",
      "title": "根本說一切有部尼陀那目得迦",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1452_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1452.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Ni Đà Na Mục Đắc Ca"
    },
    {
      "id": "T24n1453",
      "title": "根本說一切有部百一羯磨",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1453_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1453.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Bách Nhất Yết Ma"
    },
    {
      "id": "T24n1454",
      "title": "根本說一切有部戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1454_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1454.md",
      "vietTitle": "Kinh Căn Bản Thuyết Nhất Thiết Hữu Bộ Giới"
    },
    {
      "id": "T24n1455",
      "title": "根本說一切有部苾芻尼戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1455_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1455.md",
      "vietTitle": "Kinh Căn Bản Thuyết Nhất Thiết Hữu Bộ Bật Sô Ni Giới"
    },
    {
      "id": "T24n1456",
      "title": "根本說一切有部毘奈耶尼陀那目得迦攝頌",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1456_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1456.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Ni Đà Na Mục Đắc Ca Nhiếp Tụng"
    },
    {
      "id": "T24n1457",
      "title": "根本說一切有部略毘奈耶雜事攝頌",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1457_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1457.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Lược Tỳ Nại Da Tạp Sự Nhiếp Tụng"
    },
    {
      "id": "T24n1458",
      "title": "根本薩婆多部律攝",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1458_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1458.md",
      "vietTitle": "Căn Bản Tát Bà Đa Bộ Luật Nhiếp"
    },
    {
      "id": "T24n1459",
      "title": "根本說一切有部毘奈耶頌",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1459_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1459.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Tỳ Nại Da Tụng"
    },
    {
      "id": "T24n1460",
      "title": "解脫戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1460_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1460.md",
      "vietTitle": "Kinh Giải Thoát Giới"
    },
    {
      "id": "T24n1461",
      "title": "律二十二明了論",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1461_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1461.md",
      "vietTitle": "Luật Nhị Thập Nhị Minh Liễu Luận"
    },
    {
      "id": "T24n1462",
      "title": "善見律毘婆沙",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1462_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1462.md",
      "vietTitle": "Thiện Kiến Luật Tỳ Bà Sa"
    },
    {
      "id": "T24n1463",
      "title": "毘尼母經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1463_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1463.md",
      "vietTitle": "Kinh Tỳ Ni Mẫu"
    },
    {
      "id": "T24n1464",
      "title": "鼻奈耶",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1464_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1464.md",
      "vietTitle": "Tỵ Nại Da"
    },
    {
      "id": "T24n1465",
      "title": "舍利弗問經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1465_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1465.md",
      "vietTitle": "Kinh Xá Lợi Phất Vấn"
    },
    {
      "id": "T24n1466",
      "title": "優波離問佛經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1466_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1466.md",
      "vietTitle": "Kinh Ưu Ba Li Vấn Phật"
    },
    {
      "id": "T24n1467a",
      "title": "佛說犯戒罪報輕重經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1467a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1467a.md",
      "vietTitle": "Kinh Phật Thuyết Phạm Giới Tội Báo Khinh Trọng"
    },
    {
      "id": "T24n1467b",
      "title": "佛說犯戒罪報輕重經",
      "division": "11",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1467b.md",
      "vietTitle": "Kinh Phật Thuyết Phạm Giới Tội Báo Khinh Trọng"
    },
    {
      "id": "T24n1468",
      "title": "佛說目連所問經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1468_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1468.md",
      "vietTitle": "Kinh Phật Thuyết Mục Liên Sở Vấn"
    },
    {
      "id": "T24n1469",
      "title": "佛說迦葉禁戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1469_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1469.md",
      "vietTitle": "Kinh Phật Thuyết Ca Diệp Cấm Giới"
    },
    {
      "id": "T24n1470",
      "title": "大比丘三千威儀",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1470_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1470.md",
      "vietTitle": "Đại Tỳ Kheo Tam Thiên Uy Nghi"
    },
    {
      "id": "T24n1471",
      "title": "沙彌十戒法并威儀",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1471_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1471.md",
      "vietTitle": "Sa Di Thập Giới Pháp Tịnh Uy Nghi"
    },
    {
      "id": "T24n1472",
      "title": "沙彌威儀",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1472_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1472.md",
      "vietTitle": "Sa Di Uy Nghi"
    },
    {
      "id": "T24n1473",
      "title": "佛說沙彌十戒儀則經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1473_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1473.md",
      "vietTitle": "Kinh Phật Thuyết Sa Di Thập Giới Nghi Tắc"
    },
    {
      "id": "T24n1474",
      "title": "沙彌尼戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1474_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1474.md",
      "vietTitle": "Kinh Sa Di Ni Giới"
    },
    {
      "id": "T24n1475",
      "title": "沙彌尼離戒文",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1475_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1475.md",
      "vietTitle": "Sa Di Ni Li Giới Văn"
    },
    {
      "id": "T24n1476",
      "title": "佛說優婆塞五戒相經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1476_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1476.md",
      "vietTitle": "Kinh Phật Thuyết Ưu Bà Tắc Ngũ Giới Tướng"
    },
    {
      "id": "T24n1477",
      "title": "佛說戒消災經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1477_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1477.md",
      "vietTitle": "Kinh Phật Thuyết Giới Tiêu Tai"
    },
    {
      "id": "T24n1478",
      "title": "大愛道比丘尼經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1478_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1478.md",
      "vietTitle": "Kinh Đại Ái Đạo Tỳ Kheo Ni"
    },
    {
      "id": "T24n1479",
      "title": "佛說苾芻五法經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1479_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1479.md",
      "vietTitle": "Kinh Phật Thuyết Bật Sô Ngũ Pháp"
    },
    {
      "id": "T24n1480",
      "title": "佛說苾芻迦尸迦十法經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1480_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1480.md",
      "vietTitle": "Kinh Phật Thuyết Bật Sô Ca Thi Ca Thập Pháp"
    },
    {
      "id": "T24n1481",
      "title": "佛說五恐怖世經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1481_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1481.md",
      "vietTitle": "Kinh Phật Thuyết Ngũ Khủng Bố Thế"
    },
    {
      "id": "T24n1482",
      "title": "佛阿毘曇經出家相品",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1482_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1482.md",
      "vietTitle": "Phật A Tỳ Đàm Kinh Xuất Gia Tướng Phẩm"
    },
    {
      "id": "T24n1483a",
      "title": "佛說目連問戒律中五百輕重事",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1483a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1483a.md",
      "vietTitle": "Phật Thuyết Mục Liên Vấn Giới Luật Trung Ngũ Bách Khinh Trọng Sự"
    },
    {
      "id": "T24n1483b",
      "title": "佛說目連問戒律中五百輕重事經",
      "division": "11",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1483b.md",
      "vietTitle": "Kinh Phật Thuyết Mục Liên Vấn Giới Luật Trung Ngũ Bách Khinh Trọng Sự"
    },
    {
      "id": "T24n1484",
      "title": "梵網經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1484_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1484.md",
      "vietTitle": "Kinh Phạm Võng"
    },
    {
      "id": "T24n1485",
      "title": "菩薩瓔珞本業經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1485_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1485.md",
      "vietTitle": "Kinh Bồ Tát Anh Lạc Bản Nghiệp"
    },
    {
      "id": "T24n1486",
      "title": "受十善戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1486_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1486.md",
      "vietTitle": "Kinh Thọ Thập Thiện Giới"
    },
    {
      "id": "T24n1487",
      "title": "佛說菩薩內戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1487_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1487.md",
      "vietTitle": "Kinh Phật Thuyết Bồ Tát Nội Giới"
    },
    {
      "id": "T24n1488",
      "title": "優婆塞戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1488_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1488.md",
      "vietTitle": "Kinh Ưu Bà Tắc Giới"
    },
    {
      "id": "T24n1489",
      "title": "清淨毘尼方廣經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1489_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1489.md",
      "vietTitle": "Kinh Thanh Tịnh Tỳ Ni Phương Quảng"
    },
    {
      "id": "T24n1490",
      "title": "寂調音所問經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1490_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1490.md",
      "vietTitle": "Kinh Tịch Điều Âm Sở Vấn"
    },
    {
      "id": "T24n1491",
      "title": "菩薩藏經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1491_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1491.md",
      "vietTitle": "Kinh Bồ Tát Tạng"
    },
    {
      "id": "T24n1492",
      "title": "佛說舍利弗悔過經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1492_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1492.md",
      "vietTitle": "Kinh Phật Thuyết Xá Lợi Phất Hối Quá"
    },
    {
      "id": "T24n1493",
      "title": "大乘三聚懺悔經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1493_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1493.md",
      "vietTitle": "Kinh Đại Thừa Tam Tụ Sám Hối"
    },
    {
      "id": "T24n1494",
      "title": "佛說淨業障經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1494_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1494.md",
      "vietTitle": "Kinh Phật Thuyết Tịnh Nghiệp Chướng"
    },
    {
      "id": "T24n1495",
      "title": "善恭敬經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1495_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1495.md",
      "vietTitle": "Kinh Thiện Cung Kính"
    },
    {
      "id": "T24n1496",
      "title": "佛說正恭敬經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1496_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1496.md",
      "vietTitle": "Kinh Phật Thuyết Chánh Cung Kính"
    },
    {
      "id": "T24n1497",
      "title": "佛說大乘戒經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1497_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1497.md",
      "vietTitle": "Kinh Phật Thuyết Đại Thừa Giới"
    },
    {
      "id": "T24n1498",
      "title": "佛說八種長養功德經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1498_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1498.md",
      "vietTitle": "Kinh Phật Thuyết Bát Chủng Trường Dưỡng Công Đức"
    },
    {
      "id": "T24n1499",
      "title": "菩薩戒羯磨文",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1499_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1499.md",
      "vietTitle": "Bồ Tát Giới Yết Ma Văn"
    },
    {
      "id": "T24n1500",
      "title": "菩薩戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1500_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1500.md",
      "vietTitle": "Bồ Tát Giới Bản"
    },
    {
      "id": "T24n1501",
      "title": "菩薩戒本",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1501_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1501.md",
      "vietTitle": "Bồ Tát Giới Bản"
    },
    {
      "id": "T24n1502",
      "title": "菩薩受齋經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1502_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1502.md",
      "vietTitle": "Kinh Bồ Tát Thọ Trai"
    },
    {
      "id": "T24n1503",
      "title": "優婆塞五戒威儀經",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1503_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1503.md",
      "vietTitle": "Kinh Ưu Bà Tắc Ngũ Giới Uy Nghi"
    },
    {
      "id": "T24n1504",
      "title": "菩薩五法懺悔文",
      "division": "11",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1504_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/11_Luat/T24n1504.md",
      "vietTitle": "Bồ Tát Ngũ Pháp Sám Hối Văn"
    },
    {
      "id": "T25n1505",
      "title": "四阿鋡暮抄解",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1505_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1505.md",
      "vietTitle": "Tứ A Hàm Mộ Sao Giải"
    },
    {
      "id": "T25n1506",
      "title": "三法度論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1506_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1506.md",
      "vietTitle": "Tam Pháp Độ Luận"
    },
    {
      "id": "T25n1507",
      "title": "分別功德論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1507_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1507.md",
      "vietTitle": "Phân Biệt Công Đức Luận"
    },
    {
      "id": "T25n1508",
      "title": "阿含口解十二因緣經",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1508_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1508.md",
      "vietTitle": "Kinh A Hàm Khẩu Giải Thập Nhị Nhân Duyên"
    },
    {
      "id": "T25n1509",
      "title": "大智度論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1509_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1509.md",
      "vietTitle": "Đại Trí Độ Luận"
    },
    {
      "id": "T25n1510a",
      "title": "金剛般若論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1510a_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1510a.md",
      "vietTitle": "Kim Cương Bát Nhã Luận"
    },
    {
      "id": "T25n1510b",
      "title": "金剛般若波羅蜜經論",
      "division": "12",
      "hasViet": false,
      "vietFile": null,
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1510b.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Luận"
    },
    {
      "id": "T25n1511",
      "title": "金剛般若波羅蜜經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1511_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1511.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Luận"
    },
    {
      "id": "T25n1512",
      "title": "金剛仙論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1512_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1512.md",
      "vietTitle": "Kim Cương Tiên Luận"
    },
    {
      "id": "T25n1513",
      "title": "能斷金剛般若波羅蜜多經論釋",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1513_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1513.md",
      "vietTitle": "Năng Đoạn Kim Cương Bát Nhã Ba La Mật Đa Kinh Luận Thích"
    },
    {
      "id": "T25n1514",
      "title": "能斷金剛般若波羅蜜多經論頌",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1514_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1514.md",
      "vietTitle": "Năng Đoạn Kim Cương Bát Nhã Ba La Mật Đa Kinh Luận Tụng"
    },
    {
      "id": "T25n1515",
      "title": "金剛般若波羅蜜經破取著不壞假名論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1515_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1515.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Phá Thủ Trước Bất Hoại Giả Danh Luận"
    },
    {
      "id": "T25n1516",
      "title": "聖佛母般若波羅蜜多九頌精義論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1516_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1516.md",
      "vietTitle": "Thánh Phật Mẫu Bát Nhã Ba La Mật Đa Cửu Tụng Tinh Nghĩa Luận"
    },
    {
      "id": "T25n1517",
      "title": "佛母般若波羅蜜多圓集要義釋論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1517_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1517.md",
      "vietTitle": "Phật Mẫu Bát Nhã Ba La Mật Đa Viên Tập Yếu Nghĩa Thích Luận"
    },
    {
      "id": "T25n1518",
      "title": "佛母般若波羅蜜多圓集要義論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1518_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T25n1518.md",
      "vietTitle": "Phật Mẫu Bát Nhã Ba La Mật Đa Viên Tập Yếu Nghĩa Luận"
    },
    {
      "id": "T26n1519",
      "title": "妙法蓮華經憂波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1519_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1519.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1520",
      "title": "妙法蓮華經論優波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1520_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1520.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Luận Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1521",
      "title": "十住毘婆沙論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1521_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1521.md",
      "vietTitle": "Thập Trụ Tỳ Bà Sa Luận"
    },
    {
      "id": "T26n1522",
      "title": "十地經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1522_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1522.md",
      "vietTitle": "Thập Địa Kinh Luận"
    },
    {
      "id": "T26n1523",
      "title": "大寶積經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1523_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1523.md",
      "vietTitle": "Đại Bảo Tích Kinh Luận"
    },
    {
      "id": "T26n1524",
      "title": "無量壽經優波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1524_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1524.md",
      "vietTitle": "Vô Lượng Thọ Kinh Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1525",
      "title": "彌勒菩薩所問經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1525_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1525.md",
      "vietTitle": "Di Lặc Bồ Tát Sở Vấn Kinh Luận"
    },
    {
      "id": "T26n1526",
      "title": "寶髻經四法憂波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1526_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1526.md",
      "vietTitle": "Bảo Kế Kinh Tứ Pháp Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1527",
      "title": "涅槃論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1527_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1527.md",
      "vietTitle": "Niết Bàn Luận"
    },
    {
      "id": "T26n1528",
      "title": "涅槃經本有今無偈論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1528_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1528.md",
      "vietTitle": "Niết Bàn Kinh Bản Hữu Kim Vô Kệ Luận"
    },
    {
      "id": "T26n1529",
      "title": "遺教經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1529_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1529.md",
      "vietTitle": "Di Giáo Kinh Luận"
    },
    {
      "id": "T26n1530",
      "title": "佛地經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1530_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1530.md",
      "vietTitle": "Phật Địa Kinh Luận"
    },
    {
      "id": "T26n1531",
      "title": "文殊師利菩薩問菩提經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1531_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1531.md",
      "vietTitle": "Văn Thù Sư Lợi Bồ Tát Vấn Bồ Đề Kinh Luận"
    },
    {
      "id": "T26n1532",
      "title": "勝思惟梵天所問經論",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1532_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1532.md",
      "vietTitle": "Thắng Tư Duy Phạm Thiên Sở Vấn Kinh Luận"
    },
    {
      "id": "T26n1533",
      "title": "轉法輪經憂波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1533_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1533.md",
      "vietTitle": "Chuyển Pháp Luân Kinh Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1534",
      "title": "三具足經憂波提舍",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1534_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1534.md",
      "vietTitle": "Tam Cụ Túc Kinh Ưu Ba Đề Xá"
    },
    {
      "id": "T26n1535",
      "title": "大乘四法經釋",
      "division": "12",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1535_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/12_Thich_Kinh_Luan/T26n1535.md",
      "vietTitle": "Đại Thừa Tứ Pháp Kinh Thích"
    },
    {
      "id": "T26n1536",
      "title": "阿毘達磨集異門足論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1536_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1536.md",
      "vietTitle": "A Tỳ Đạt Ma Tập Dị Môn Túc Luận"
    },
    {
      "id": "T26n1537",
      "title": "阿毘達磨法蘊足論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1537_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1537.md",
      "vietTitle": "A Tỳ Đạt Ma Pháp Uẩn Túc Luận"
    },
    {
      "id": "T26n1538",
      "title": "施設論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1538_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1538.md",
      "vietTitle": "Thí Thiết Luận"
    },
    {
      "id": "T26n1539",
      "title": "阿毘達磨識身足論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1539_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1539.md",
      "vietTitle": "A Tỳ Đạt Ma Thức Thân Túc Luận"
    },
    {
      "id": "T26n1540",
      "title": "阿毘達磨界身足論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1540_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1540.md",
      "vietTitle": "A Tỳ Đạt Ma Giới Thân Túc Luận"
    },
    {
      "id": "T26n1541",
      "title": "眾事分阿毘曇論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1541_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1541.md",
      "vietTitle": "Chúng Sự Phân A Tỳ Đàm Luận"
    },
    {
      "id": "T26n1542",
      "title": "阿毘達磨品類足論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1542_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1542.md",
      "vietTitle": "A Tỳ Đạt Ma Phẩm Loại Túc Luận"
    },
    {
      "id": "T26n1543",
      "title": "阿毘曇八犍度論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1543_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1543.md",
      "vietTitle": "A Tỳ Đàm Bát Kiền Độ Luận"
    },
    {
      "id": "T26n1544",
      "title": "阿毘達磨發智論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1544_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T26n1544.md",
      "vietTitle": "A Tỳ Đạt Ma Phát Trí Luận"
    },
    {
      "id": "T27n1545",
      "title": "阿毘達磨大毘婆沙論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T27n1545_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T27n1545.md",
      "vietTitle": "A Tỳ Đạt Ma Đại Tỳ Bà Sa Luận"
    },
    {
      "id": "T28n1546",
      "title": "阿毘曇毘婆沙論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1546_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1546.md",
      "vietTitle": "A Tỳ Đàm Tỳ Bà Sa Luận"
    },
    {
      "id": "T28n1547",
      "title": "鞞婆沙論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1547_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1547.md",
      "vietTitle": "Bệ Bà Sa Luận"
    },
    {
      "id": "T28n1548",
      "title": "舍利弗阿毘曇論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1548_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1548.md",
      "vietTitle": "Xá Lợi Phất A Tỳ Đàm Luận"
    },
    {
      "id": "T28n1549",
      "title": "尊婆須蜜菩薩所集論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1549_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1549.md",
      "vietTitle": "Tôn Bà Tu Mật Bồ Tát Sở Tập Luận"
    },
    {
      "id": "T28n1550",
      "title": "阿毘曇心論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1550_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1550.md",
      "vietTitle": "A Tỳ Đàm Tâm Luận"
    },
    {
      "id": "T28n1551",
      "title": "阿毘曇心論經",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1551_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1551.md",
      "vietTitle": "Kinh A Tỳ Đàm Tâm Luận"
    },
    {
      "id": "T28n1552",
      "title": "雜阿毘曇心論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1552_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1552.md",
      "vietTitle": "Tạp A Tỳ Đàm Tâm Luận"
    },
    {
      "id": "T28n1553",
      "title": "阿毘曇甘露味論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1553_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1553.md",
      "vietTitle": "A Tỳ Đàm Cam Lộ Vị Luận"
    },
    {
      "id": "T28n1554",
      "title": "入阿毘達磨論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1554_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1554.md",
      "vietTitle": "Nhập A Tỳ Đạt Ma Luận"
    },
    {
      "id": "T28n1555",
      "title": "五事毘婆沙論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1555_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1555.md",
      "vietTitle": "Ngũ Sự Tỳ Bà Sa Luận"
    },
    {
      "id": "T28n1556",
      "title": "薩婆多宗五事論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1556_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1556.md",
      "vietTitle": "Tát Bà Đa Tông Ngũ Sự Luận"
    },
    {
      "id": "T28n1557",
      "title": "阿毘曇五法行經",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1557_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T28n1557.md",
      "vietTitle": "Kinh A Tỳ Đàm Ngũ Pháp Hạnh"
    },
    {
      "id": "T29n1558",
      "title": "阿毘達磨俱舍論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1558_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1558.md",
      "vietTitle": "A Tỳ Đạt Ma Câu Xá Luận"
    },
    {
      "id": "T29n1559",
      "title": "阿毘達磨俱舍釋論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1559_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1559.md",
      "vietTitle": "A Tỳ Đạt Ma Câu Xá Thích Luận"
    },
    {
      "id": "T29n1560",
      "title": "阿毘達磨俱舍論本頌",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1560_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1560.md",
      "vietTitle": "A Tỳ Đạt Ma Câu Xá Luận Bản Tụng"
    },
    {
      "id": "T29n1561",
      "title": "俱舍論實義疏",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1561_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1561.md",
      "vietTitle": "Câu Xá Luận Thật Nghĩa Sớ"
    },
    {
      "id": "T29n1562",
      "title": "阿毘達磨順正理論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1562_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1562.md",
      "vietTitle": "A Tỳ Đạt Ma Thuận Chánh Lý Luận"
    },
    {
      "id": "T29n1563",
      "title": "阿毘達磨藏顯宗論",
      "division": "13",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1563_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/13_Ty_Dam/T29n1563.md",
      "vietTitle": "A Tỳ Đạt Ma Tạng Hiển Tông Luận"
    },
    {
      "id": "T30n1564",
      "title": "中論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1564_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1564.md",
      "vietTitle": "Trung Luận"
    },
    {
      "id": "T30n1565",
      "title": "順中論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1565_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1565.md",
      "vietTitle": "Thuận Trung Luận"
    },
    {
      "id": "T30n1566",
      "title": "般若燈論釋",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1566_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1566.md",
      "vietTitle": "Bát Nhã Đăng Luận Thích"
    },
    {
      "id": "T30n1567",
      "title": "大乘中觀釋論(第1卷-第9卷)",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1567_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1567.md",
      "vietTitle": "Đại Thừa Trung Quan Thích Luận ( Đệ 1 Quyển - Đệ 9 Quyển )"
    },
    {
      "id": "T30n1568",
      "title": "十二門論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1568_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1568.md",
      "vietTitle": "Thập Nhị Môn Luận"
    },
    {
      "id": "T30n1569",
      "title": "百論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1569_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1569.md",
      "vietTitle": "Bách Luận"
    },
    {
      "id": "T30n1570",
      "title": "廣百論本",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1570_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1570.md",
      "vietTitle": "Quảng Bách Luận Bản"
    },
    {
      "id": "T30n1571",
      "title": "大乘廣百論釋論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1571_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1571.md",
      "vietTitle": "Đại Thừa Quảng Bách Luận Thích Luận"
    },
    {
      "id": "T30n1572",
      "title": "百字論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1572_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1572.md",
      "vietTitle": "Bách Tự Luận"
    },
    {
      "id": "T30n1573",
      "title": "壹輸盧迦論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1573_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1573.md",
      "vietTitle": "Nhất Thâu Lô Ca Luận"
    },
    {
      "id": "T30n1574",
      "title": "大乘破有論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1574_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1574.md",
      "vietTitle": "Đại Thừa Phá Hữu Luận"
    },
    {
      "id": "T30n1575",
      "title": "六十頌如理論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1575_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1575.md",
      "vietTitle": "Lục Thập Tụng Như Lý Luận"
    },
    {
      "id": "T30n1576",
      "title": "大乘二十頌論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1576_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1576.md",
      "vietTitle": "Đại Thừa Nhị Thập Tụng Luận"
    },
    {
      "id": "T30n1577",
      "title": "大丈夫論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1577_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1577.md",
      "vietTitle": "Đại Trượng Phu Luận"
    },
    {
      "id": "T30n1578",
      "title": "大乘掌珍論",
      "division": "14",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1578_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/14_Trung_Quan/T30n1578.md",
      "vietTitle": "Đại Thừa Chưởng Trân Luận"
    },
    {
      "id": "T30n1579",
      "title": "瑜伽師地論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1579_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1579.md",
      "vietTitle": "Du Già Sư Địa Luận"
    },
    {
      "id": "T30n1580",
      "title": "瑜伽師地論釋",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1580_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1580.md",
      "vietTitle": "Du Già Sư Địa Luận Thích"
    },
    {
      "id": "T30n1581",
      "title": "菩薩地持經",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1581_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1581.md",
      "vietTitle": "Kinh Bồ Tát Địa Trì"
    },
    {
      "id": "T30n1582",
      "title": "菩薩善戒經",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1582_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1582.md",
      "vietTitle": "Kinh Bồ Tát Thiện Giới"
    },
    {
      "id": "T30n1583",
      "title": "菩薩善戒經",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1583_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1583.md",
      "vietTitle": "Kinh Bồ Tát Thiện Giới"
    },
    {
      "id": "T30n1584",
      "title": "決定藏論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1584_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T30n1584.md",
      "vietTitle": "Quyết Định Tạng Luận"
    },
    {
      "id": "T31n1585",
      "title": "成唯識論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1585_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1585.md",
      "vietTitle": "Thành Duy Thức Luận"
    },
    {
      "id": "T31n1586",
      "title": "唯識三十論頌",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1586_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1586.md",
      "vietTitle": "Duy Thức Tam Thập Luận Tụng"
    },
    {
      "id": "T31n1587",
      "title": "轉識論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1587_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1587.md",
      "vietTitle": "Chuyển Thức Luận"
    },
    {
      "id": "T31n1588",
      "title": "唯識論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1588_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1588.md",
      "vietTitle": "Duy Thức Luận"
    },
    {
      "id": "T31n1589",
      "title": "大乘唯識論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1589_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1589.md",
      "vietTitle": "Đại Thừa Duy Thức Luận"
    },
    {
      "id": "T31n1590",
      "title": "唯識二十論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1590_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1590.md",
      "vietTitle": "Duy Thức Nhị Thập Luận"
    },
    {
      "id": "T31n1591",
      "title": "成唯識寶生論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1591_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1591.md",
      "vietTitle": "Thành Duy Thức Bảo Sinh Luận"
    },
    {
      "id": "T31n1592",
      "title": "攝大乘論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1592_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1592.md",
      "vietTitle": "Nhiếp Đại Thừa Luận"
    },
    {
      "id": "T31n1593",
      "title": "攝大乘論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1593_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1593.md",
      "vietTitle": "Nhiếp Đại Thừa Luận"
    },
    {
      "id": "T31n1594",
      "title": "攝大乘論本",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1594_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1594.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Bản"
    },
    {
      "id": "T31n1595",
      "title": "攝大乘論釋",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1595_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1595.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Thích"
    },
    {
      "id": "T31n1596",
      "title": "攝大乘論釋論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1596_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1596.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Thích Luận"
    },
    {
      "id": "T31n1597",
      "title": "攝大乘論釋",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1597_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1597.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Thích"
    },
    {
      "id": "T31n1598",
      "title": "攝大乘論釋",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1598_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1598.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Thích"
    },
    {
      "id": "T31n1599",
      "title": "中邊分別論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1599_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1599.md",
      "vietTitle": "Trung Biên Phân Biệt Luận"
    },
    {
      "id": "T31n1600",
      "title": "辯中邊論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1600_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1600.md",
      "vietTitle": "Biện Trung Biên Luận"
    },
    {
      "id": "T31n1601",
      "title": "辯中邊論頌",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1601_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1601.md",
      "vietTitle": "Biện Trung Biên Luận Tụng"
    },
    {
      "id": "T31n1602",
      "title": "顯揚聖教論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1602_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1602.md",
      "vietTitle": "Hiển Dương Thánh Giáo Luận"
    },
    {
      "id": "T31n1603",
      "title": "顯揚聖教論頌",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1603_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1603.md",
      "vietTitle": "Hiển Dương Thánh Giáo Luận Tụng"
    },
    {
      "id": "T31n1604",
      "title": "大乘莊嚴經論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1604_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1604.md",
      "vietTitle": "Đại Thừa Trang Nghiêm Kinh Luận"
    },
    {
      "id": "T31n1605",
      "title": "大乘阿毘達磨集論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1605_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1605.md",
      "vietTitle": "Đại Thừa A Tỳ Đạt Ma Tập Luận"
    },
    {
      "id": "T31n1606",
      "title": "大乘阿毘達磨雜集論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1606_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1606.md",
      "vietTitle": "Đại Thừa A Tỳ Đạt Ma Tạp Tập Luận"
    },
    {
      "id": "T31n1607",
      "title": "六門教授習定論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1607_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1607.md",
      "vietTitle": "Lục Môn Giáo Thọ Tập Định Luận"
    },
    {
      "id": "T31n1608",
      "title": "業成就論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1608_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1608.md",
      "vietTitle": "Nghiệp Thành Tựu Luận"
    },
    {
      "id": "T31n1609",
      "title": "大乘成業論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1609_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1609.md",
      "vietTitle": "Đại Thừa Thành Nghiệp Luận"
    },
    {
      "id": "T31n1610",
      "title": "佛性論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1610_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1610.md",
      "vietTitle": "Phật Tính Luận"
    },
    {
      "id": "T31n1611",
      "title": "究竟一乘寶性論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1611_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1611.md",
      "vietTitle": "Cứu Cánh Nhất Thừa Bảo Tính Luận"
    },
    {
      "id": "T31n1612",
      "title": "大乘五蘊論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1612_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1612.md",
      "vietTitle": "Đại Thừa Ngũ Uẩn Luận"
    },
    {
      "id": "T31n1613",
      "title": "大乘廣五蘊論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1613_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1613.md",
      "vietTitle": "Đại Thừa Quảng Ngũ Uẩn Luận"
    },
    {
      "id": "T31n1614",
      "title": "大乘百法明門論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1614_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1614.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận"
    },
    {
      "id": "T31n1615",
      "title": "王法正理論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1615_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1615.md",
      "vietTitle": "Vương Pháp Chánh Lý Luận"
    },
    {
      "id": "T31n1616",
      "title": "十八空論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1616_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1616.md",
      "vietTitle": "Thập Bát Không Luận"
    },
    {
      "id": "T31n1617",
      "title": "三無性論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1617_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1617.md",
      "vietTitle": "Tam Vô Tính Luận"
    },
    {
      "id": "T31n1618",
      "title": "顯識論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1618_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1618.md",
      "vietTitle": "Hiển Thức Luận"
    },
    {
      "id": "T31n1619",
      "title": "無相思塵論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1619_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1619.md",
      "vietTitle": "Vô Tướng Tư Trần Luận"
    },
    {
      "id": "T31n1620",
      "title": "解捲論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1620_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1620.md",
      "vietTitle": "Giải Quyển Luận"
    },
    {
      "id": "T31n1621",
      "title": "掌中論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1621_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1621.md",
      "vietTitle": "Chưởng Trung Luận"
    },
    {
      "id": "T31n1622",
      "title": "取因假設論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1622_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1622.md",
      "vietTitle": "Thủ Nhân Giả Thiết Luận"
    },
    {
      "id": "T31n1623",
      "title": "觀總相論頌",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1623_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1623.md",
      "vietTitle": "Quan Tổng Tướng Luận Tụng"
    },
    {
      "id": "T31n1624",
      "title": "觀所緣緣論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1624_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1624.md",
      "vietTitle": "Quan Sở Duyên Duyên Luận"
    },
    {
      "id": "T31n1625",
      "title": "觀所緣論釋",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1625_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1625.md",
      "vietTitle": "Quan Sở Duyên Luận Thích"
    },
    {
      "id": "T31n1626",
      "title": "大乘法界無差別論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1626_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1626.md",
      "vietTitle": "Đại Thừa Pháp Giới Vô Sai Biệt Luận"
    },
    {
      "id": "T31n1627",
      "title": "大乘法界無差別論",
      "division": "15",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1627_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/15_Du_Gia/T31n1627.md",
      "vietTitle": "Đại Thừa Pháp Giới Vô Sai Biệt Luận"
    },
    {
      "id": "T32n1628",
      "title": "因明正理門論本",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1628_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1628.md",
      "vietTitle": "Nhân Minh Chánh Lý Môn Luận Bản"
    },
    {
      "id": "T32n1629",
      "title": "因明正理門論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1629_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1629.md",
      "vietTitle": "Nhân Minh Chánh Lý Môn Luận"
    },
    {
      "id": "T32n1630",
      "title": "因明入正理論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1630_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1630.md",
      "vietTitle": "Nhân Minh Nhập Chánh Lý Luận"
    },
    {
      "id": "T32n1631",
      "title": "迴諍論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1631_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1631.md",
      "vietTitle": "Hồi Tránh Luận"
    },
    {
      "id": "T32n1632",
      "title": "方便心論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1632_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1632.md",
      "vietTitle": "Phương Tiện Tâm Luận"
    },
    {
      "id": "T32n1633",
      "title": "如實論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1633_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1633.md",
      "vietTitle": "Như Thật Luận"
    },
    {
      "id": "T32n1634",
      "title": "入大乘論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1634_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1634.md",
      "vietTitle": "Nhập Đại Thừa Luận"
    },
    {
      "id": "T32n1635",
      "title": "大乘寶要義論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1635_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1635.md",
      "vietTitle": "Đại Thừa Bảo Yếu Nghĩa Luận"
    },
    {
      "id": "T32n1636",
      "title": "大乘集菩薩學論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1636_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1636.md",
      "vietTitle": "Đại Thừa Tập Bồ Tát Học Luận"
    },
    {
      "id": "T32n1637",
      "title": "集大乘相論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1637_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1637.md",
      "vietTitle": "Tập Đại Thừa Tướng Luận"
    },
    {
      "id": "T32n1638",
      "title": "集諸法寶最上義論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1638_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1638.md",
      "vietTitle": "Tập Chư Pháp Bảo Tối Thượng Nghĩa Luận"
    },
    {
      "id": "T32n1639",
      "title": "提婆菩薩破楞伽經中外道小乘四宗論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1639_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1639.md",
      "vietTitle": "Đề Bà Bồ Tát Phá Lăng Già Kinh Trung Ngoại Đạo Tiểu Thừa Tứ Tông Luận"
    },
    {
      "id": "T32n1640",
      "title": "提婆菩薩釋楞伽經中外道小乘涅槃論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1640_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1640.md",
      "vietTitle": "Đề Bà Bồ Tát Thích Lăng Già Kinh Trung Ngoại Đạo Tiểu Thừa Niết Bàn Luận"
    },
    {
      "id": "T32n1641",
      "title": "隨相論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1641_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1641.md",
      "vietTitle": "Tùy Tướng Luận"
    },
    {
      "id": "T32n1642",
      "title": "金剛針論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1642_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1642.md",
      "vietTitle": "Kim Cương Châm Luận"
    },
    {
      "id": "T32n1643",
      "title": "尼乾子問無我義經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1643_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1643.md",
      "vietTitle": "Kinh Ni Càn Tử Vấn Vô Ngã Nghĩa"
    },
    {
      "id": "T32n1644",
      "title": "佛說立世阿毘曇論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1644_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1644.md",
      "vietTitle": "Phật Thuyết Lập Thế A Tỳ Đàm Luận"
    },
    {
      "id": "T32n1645",
      "title": "彰所知論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1645_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1645.md",
      "vietTitle": "Chương Sở Tri Luận"
    },
    {
      "id": "T32n1646",
      "title": "成實論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1646_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1646.md",
      "vietTitle": "Thành Thật Luận"
    },
    {
      "id": "T32n1647",
      "title": "四諦論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1647_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1647.md",
      "vietTitle": "Tứ Đế Luận"
    },
    {
      "id": "T32n1648",
      "title": "解脫道論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1648_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1648.md",
      "vietTitle": "Giải Thoát Đạo Luận"
    },
    {
      "id": "T32n1649",
      "title": "三彌底部論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1649_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1649.md",
      "vietTitle": "Tam Di Để Bộ Luận"
    },
    {
      "id": "T32n1650",
      "title": "辟支佛因緣論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1650_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1650.md",
      "vietTitle": "Bích Chi Phật Nhân Duyên Luận"
    },
    {
      "id": "T32n1651",
      "title": "十二因緣論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1651_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1651.md",
      "vietTitle": "Thập Nhị Nhân Duyên Luận"
    },
    {
      "id": "T32n1652",
      "title": "緣生論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1652_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1652.md",
      "vietTitle": "Duyên Sinh Luận"
    },
    {
      "id": "T32n1653",
      "title": "大乘緣生論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1653_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1653.md",
      "vietTitle": "Đại Thừa Duyên Sinh Luận"
    },
    {
      "id": "T32n1654",
      "title": "因緣心論頌因緣心論釋",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1654_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1654.md",
      "vietTitle": "Nhân Duyên Tâm Luận Tụng Nhân Duyên Tâm Luận Thích"
    },
    {
      "id": "T32n1655",
      "title": "止觀門論頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1655_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1655.md",
      "vietTitle": "Chỉ Quan Môn Luận Tụng"
    },
    {
      "id": "T32n1656",
      "title": "寶行王正論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1656_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1656.md",
      "vietTitle": "Bảo Hạnh Vương Chánh Luận"
    },
    {
      "id": "T32n1657",
      "title": "手杖論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1657_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1657.md",
      "vietTitle": "Thủ Trượng Luận"
    },
    {
      "id": "T32n1658",
      "title": "諸教決定名義論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1658_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1658.md",
      "vietTitle": "Chư Giáo Quyết Định Danh Nghĩa Luận"
    },
    {
      "id": "T32n1659",
      "title": "發菩提心經論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1659_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1659.md",
      "vietTitle": "Phát Bồ Đề Tâm Kinh Luận"
    },
    {
      "id": "T32n1660",
      "title": "菩提資糧論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1660_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1660.md",
      "vietTitle": "Bồ Đề Tư Lương Luận"
    },
    {
      "id": "T32n1661",
      "title": "菩提心離相論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1661_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1661.md",
      "vietTitle": "Bồ Đề Tâm Li Tướng Luận"
    },
    {
      "id": "T32n1662",
      "title": "菩提行經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1662_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1662.md",
      "vietTitle": "Kinh Bồ Đề Hạnh"
    },
    {
      "id": "T32n1663",
      "title": "菩提心觀釋",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1663_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1663.md",
      "vietTitle": "Bồ Đề Tâm Quan Thích"
    },
    {
      "id": "T32n1664",
      "title": "廣釋菩提心論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1664_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1664.md",
      "vietTitle": "Quảng Thích Bồ Đề Tâm Luận"
    },
    {
      "id": "T32n1665",
      "title": "金剛頂瑜伽中發阿耨多羅三藐三菩提心論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1665_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1665.md",
      "vietTitle": "Kim Cương Đính Du Già Trung Phát A Nậu Đa La Tam Miểu Tam Bồ Đề Tâm Luận"
    },
    {
      "id": "T32n1666",
      "title": "大乘起信論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1666_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1666.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận"
    },
    {
      "id": "T32n1667",
      "title": "大乘起信論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1667_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1667.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận"
    },
    {
      "id": "T32n1668",
      "title": "釋摩訶衍論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1668_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1668.md",
      "vietTitle": "Thích Ma Ha Diễn Luận"
    },
    {
      "id": "T32n1669",
      "title": "大宗地玄文本論",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1669_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1669.md",
      "vietTitle": "Đại Tông Địa Huyền Văn Bản Luận"
    },
    {
      "id": "T32n1670A",
      "title": "那先比丘經",
      "division": "16",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1670A.md",
      "vietTitle": "Kinh Na Tiên Tỳ Kheo"
    },
    {
      "id": "T32n1670B",
      "title": "那先比丘經",
      "division": "16",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1670B.md",
      "vietTitle": "Kinh Na Tiên Tỳ Kheo"
    },
    {
      "id": "T32n1671",
      "title": "福蓋正行所集經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1671_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1671.md",
      "vietTitle": "Kinh Phước Cái Chánh Hạnh Sở Tập"
    },
    {
      "id": "T32n1672",
      "title": "龍樹菩薩為禪陀迦王說法要偈",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1672_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1672.md",
      "vietTitle": "Long Thụ Bồ Tát Vi Thiền Đà Ca Vương Thuyết Pháp Yếu Kệ"
    },
    {
      "id": "T32n1673",
      "title": "勸發諸王要偈",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1673_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1673.md",
      "vietTitle": "Khuyến Phát Chư Vương Yếu Kệ"
    },
    {
      "id": "T32n1674",
      "title": "龍樹菩薩勸誡王頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1674_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1674.md",
      "vietTitle": "Long Thụ Bồ Tát Khuyến Giới Vương Tụng"
    },
    {
      "id": "T32n1675",
      "title": "讚法界頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1675_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1675.md",
      "vietTitle": "Tán Pháp Giới Tụng"
    },
    {
      "id": "T32n1676",
      "title": "廣大發願頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1676_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1676.md",
      "vietTitle": "Quảng Đại Phát Nguyện Tụng"
    },
    {
      "id": "T32n1677",
      "title": "三身梵讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1677_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1677.md",
      "vietTitle": "Tam Thân Phạm Tán"
    },
    {
      "id": "T32n1678",
      "title": "佛三身讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1678_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1678.md",
      "vietTitle": "Phật Tam Thân Tán"
    },
    {
      "id": "T32n1679",
      "title": "佛一百八名讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1679_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1679.md",
      "vietTitle": "Phật Nhất Bách Bát Danh Tán"
    },
    {
      "id": "T32n1680",
      "title": "一百五十讚佛頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1680_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1680.md",
      "vietTitle": "Nhất Bách Ngũ Thập Tán Phật Tụng"
    },
    {
      "id": "T32n1681",
      "title": "佛吉祥德讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1681_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1681.md",
      "vietTitle": "Phật Cát Tường Đức Tán"
    },
    {
      "id": "T32n1682",
      "title": "七佛讚唄伽他",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1682_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1682.md",
      "vietTitle": "Thất Phật Tán Bái Già Tha"
    },
    {
      "id": "T32n1683",
      "title": "犍稚梵讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1683_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1683.md",
      "vietTitle": "Kiền Trĩ Phạm Tán"
    },
    {
      "id": "T32n1684",
      "title": "八大靈塔梵讚",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1684_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1684.md",
      "vietTitle": "Bát Đại Linh Tháp Phạm Tán"
    },
    {
      "id": "T32n1685",
      "title": "佛說八大靈塔名號經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1685_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1685.md",
      "vietTitle": "Kinh Phật Thuyết Bát Đại Linh Tháp Danh Hào"
    },
    {
      "id": "T32n1686",
      "title": "賢聖集伽陀一百頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1686_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1686.md",
      "vietTitle": "Hiền Thánh Tập Già Đà Nhất Bách Tụng"
    },
    {
      "id": "T32n1687",
      "title": "事師法五十頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1687_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1687.md",
      "vietTitle": "Sự Sư Pháp Ngũ Thập Tụng"
    },
    {
      "id": "T32n1688",
      "title": "密跡力士大權神王經偈頌",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1688_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1688.md",
      "vietTitle": "Mật Tích Lực Sĩ Đại Quyền Thần Vương Kinh Kệ Tụng"
    },
    {
      "id": "T32n1689",
      "title": "請賓頭盧法",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1689_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1689.md",
      "vietTitle": "Thỉnh Tân Đầu Lô Pháp"
    },
    {
      "id": "T32n1690",
      "title": "賓頭盧突羅闍為優陀延王說法經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1690_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1690.md",
      "vietTitle": "Kinh Tân Đầu Lô Đột La Đồ Vi Ưu Đà Diên Vương Thuyết Pháp"
    },
    {
      "id": "T32n1691",
      "title": "迦葉仙人說醫女人經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1691_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1691.md",
      "vietTitle": "Kinh Ca Diệp Tiên Nhân Thuyết Y Nữ Nhân"
    },
    {
      "id": "T32n1692",
      "title": "勝軍化世百喻伽他經",
      "division": "16",
      "hasViet": true,
      "vietFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1692_viet.md",
      "hanFile": "../Dai_Tang_Kinh_Han/16_Luan_Tap/T32n1692.md",
      "vietTitle": "Kinh Thắng Quân Hóa Thế Bách Dụ Già Tha"
    },
    {
      "id": "T33n1693",
      "title": "人本欲生經註",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1693.md",
      "vietTitle": "Nhân Bản Dục Sinh Kinh Chú"
    },
    {
      "id": "T33n1694",
      "title": "陰持入經註",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1694.md",
      "vietTitle": "Âm Trì Nhập Kinh Chú"
    },
    {
      "id": "T33n1695",
      "title": "大般若波羅蜜多經般若理趣分述讚",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1695.md",
      "vietTitle": "Đại Bát Nhã Ba La Mật Đa Kinh Bát Nhã Lý Thú Phân Thuật Tán"
    },
    {
      "id": "T33n1696",
      "title": "大品經遊意",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1696.md",
      "vietTitle": "Đại Phẩm Kinh Du Ý"
    },
    {
      "id": "T33n1697",
      "title": "大慧度經宗要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1697.md",
      "vietTitle": "Đại Tuệ Độ Kinh Tông Yếu"
    },
    {
      "id": "T33n1698",
      "title": "金剛般若經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1698.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Sớ"
    },
    {
      "id": "T33n1699",
      "title": "金剛般若疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1699.md",
      "vietTitle": "Kim Cương Bát Nhã Sớ"
    },
    {
      "id": "T33n1700",
      "title": "金剛般若經贊述",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1700.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Tán Thuật"
    },
    {
      "id": "T33n1701",
      "title": "金剛般若經疏論纂要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1701.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Sớ Luận Toản Yếu"
    },
    {
      "id": "T33n1702",
      "title": "金剛經纂要刊定記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1702.md",
      "vietTitle": "Kim Cương Kinh Toản Yếu San Định Kí"
    },
    {
      "id": "T33n1703",
      "title": "金剛般若波羅蜜經註解",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1703.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Chú Giải"
    },
    {
      "id": "T33n1704",
      "title": "金剛般若波羅蜜經略疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1704.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Lược Sớ"
    },
    {
      "id": "T33n1705",
      "title": "仁王護國般若經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1705.md",
      "vietTitle": "Nhân Vương Hộ Quốc Bát Nhã Kinh Sớ"
    },
    {
      "id": "T33n1706",
      "title": "仁王護國般若波羅蜜經疏神寶記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1706.md",
      "vietTitle": "Nhân Vương Hộ Quốc Bát Nhã Ba La Mật Kinh Sớ Thần Bảo Kí"
    },
    {
      "id": "T33n1707",
      "title": "仁王般若經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1707.md",
      "vietTitle": "Nhân Vương Bát Nhã Kinh Sớ"
    },
    {
      "id": "T33n1708",
      "title": "仁王經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1708.md",
      "vietTitle": "Nhân Vương Kinh Sớ"
    },
    {
      "id": "T33n1709",
      "title": "仁王護國般若波羅蜜多經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1709.md",
      "vietTitle": "Nhân Vương Hộ Quốc Bát Nhã Ba La Mật Đa Kinh Sớ"
    },
    {
      "id": "T33n1710",
      "title": "般若波羅蜜多心經幽贊",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1710.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh U Tán"
    },
    {
      "id": "T33n1711",
      "title": "般若波羅蜜多心經贊",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1711.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh Tán"
    },
    {
      "id": "T33n1712",
      "title": "般若波羅蜜多心經略疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1712.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh Lược Sớ"
    },
    {
      "id": "T33n1713",
      "title": "般若心經略疏連珠記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1713.md",
      "vietTitle": "Bát Nhã Tâm Kinh Lược Sớ Liên Châu Kí"
    },
    {
      "id": "T33n1714",
      "title": "般若波羅蜜多心經註解",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1714.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh Chú Giải"
    },
    {
      "id": "T33n1715",
      "title": "法華經義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1715.md",
      "vietTitle": "Pháp Hoa Kinh Nghĩa Kí"
    },
    {
      "id": "T33n1716",
      "title": "妙法蓮華經玄義",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1716.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Huyền Nghĩa"
    },
    {
      "id": "T33n1717",
      "title": "法華玄義釋籤",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T33n1717.md",
      "vietTitle": "Pháp Hoa Huyền Nghĩa Thích Thiêm"
    },
    {
      "id": "T34n1718",
      "title": "妙法蓮華經文句",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1718.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Văn Cú"
    },
    {
      "id": "T34n1719",
      "title": "法華文句記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1719.md",
      "vietTitle": "Pháp Hoa Văn Cú Kí"
    },
    {
      "id": "T34n1720",
      "title": "法華玄論",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1720.md",
      "vietTitle": "Pháp Hoa Huyền Luận"
    },
    {
      "id": "T34n1721",
      "title": "法華義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1721.md",
      "vietTitle": "Pháp Hoa Nghĩa Sớ"
    },
    {
      "id": "T34n1722",
      "title": "法華遊意",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1722.md",
      "vietTitle": "Pháp Hoa Du Ý"
    },
    {
      "id": "T34n1723",
      "title": "妙法蓮華經玄贊",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1723.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Huyền Tán"
    },
    {
      "id": "T34n1724",
      "title": "法華玄贊義決",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1724.md",
      "vietTitle": "Pháp Hoa Huyền Tán Nghĩa Quyết"
    },
    {
      "id": "T34n1725",
      "title": "法華宗要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1725.md",
      "vietTitle": "Pháp Hoa Tông Yếu"
    },
    {
      "id": "T34n1726",
      "title": "觀音玄義",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1726.md",
      "vietTitle": "Quan Âm Huyền Nghĩa"
    },
    {
      "id": "T34n1727",
      "title": "觀音玄義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1727.md",
      "vietTitle": "Quan Âm Huyền Nghĩa Kí"
    },
    {
      "id": "T34n1728",
      "title": "觀音義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1728.md",
      "vietTitle": "Quan Âm Nghĩa Sớ"
    },
    {
      "id": "T34n1729",
      "title": "觀音義疏記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1729.md",
      "vietTitle": "Quan Âm Nghĩa Sớ Kí"
    },
    {
      "id": "T34n1730",
      "title": "金剛三昧經論",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T34n1730.md",
      "vietTitle": "Kim Cương Tam Muội Kinh Luận"
    },
    {
      "id": "T35n1731",
      "title": "華嚴遊意",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T35n1731.md",
      "vietTitle": "Hoa Nghiêm Du Ý"
    },
    {
      "id": "T35n1732",
      "title": "大方廣佛華嚴經搜玄分齊通智方軌",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T35n1732.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Sưu Huyền Phân Tề Thông Trí Phương Quỹ"
    },
    {
      "id": "T35n1733",
      "title": "華嚴經探玄記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T35n1733.md",
      "vietTitle": "Hoa Nghiêm Kinh Thám Huyền Kí"
    },
    {
      "id": "T35n1734",
      "title": "花嚴經文義綱目",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T35n1734.md",
      "vietTitle": "Hoa Nghiêm Kinh Văn Nghĩa Cương Mục"
    },
    {
      "id": "T35n1735",
      "title": "大方廣佛華嚴經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T35n1735.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Sớ"
    },
    {
      "id": "T36n1736",
      "title": "大方廣佛華嚴經隨疏演義鈔",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1736.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Tùy Sớ Diễn Nghĩa Sao"
    },
    {
      "id": "T36n1737",
      "title": "大華嚴經略策",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1737.md",
      "vietTitle": "Đại Hoa Nghiêm Kinh Lược Sách"
    },
    {
      "id": "T36n1738",
      "title": "新譯華嚴經七處九會頌釋章",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1738.md",
      "vietTitle": "Tân Dịch Hoa Nghiêm Kinh Thất Xứ Cửu Hội Tụng Thích Chương"
    },
    {
      "id": "T36n1739",
      "title": "新華嚴經論",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1739.md",
      "vietTitle": "Tân Hoa Nghiêm Kinh Luận"
    },
    {
      "id": "T36n1740",
      "title": "大方廣佛華嚴經中卷卷大意略敘",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1740.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Trung Quyển Quyển Đại Ý Lược Tự"
    },
    {
      "id": "T36n1741",
      "title": "略釋新華嚴經修行次第決疑論",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1741.md",
      "vietTitle": "Lược Thích Tân Hoa Nghiêm Kinh Tu Hạnh Thứ Đệ Quyết Nghi Luận"
    },
    {
      "id": "T36n1742",
      "title": "大方廣佛華嚴經願行觀門骨目",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1742.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Nguyện Hạnh Quan Môn Cốt Mục"
    },
    {
      "id": "T36n1743",
      "title": "皇帝降誕日於麟德殿講大方廣佛華嚴經玄義一部",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T36n1743.md",
      "vietTitle": "Hoàng Đế Hàng Đản Nhật Vu Lân Đức Điện Giảng Đại Phương Quảng Phật Hoa Nghiêm Kinh Huyền Nghĩa Nhất Bộ"
    },
    {
      "id": "T37n1744",
      "title": "勝鬘寶窟",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1744.md",
      "vietTitle": "Thắng Man Bảo Quật"
    },
    {
      "id": "T37n1745",
      "title": "無量壽經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1745.md",
      "vietTitle": "Vô Lượng Thọ Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1746",
      "title": "無量壽經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1746.md",
      "vietTitle": "Vô Lượng Thọ Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1747",
      "title": "兩卷無量壽經宗要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1747.md",
      "vietTitle": "Lưỡng Quyển Vô Lượng Thọ Kinh Tông Yếu"
    },
    {
      "id": "T37n1748",
      "title": "無量壽經連義述文贊",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1748.md",
      "vietTitle": "Vô Lượng Thọ Kinh Liên Nghĩa Thuật Văn Tán"
    },
    {
      "id": "T37n1749",
      "title": "觀無量壽經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1749.md",
      "vietTitle": "Quan Vô Lượng Thọ Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1750",
      "title": "觀無量壽佛經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1750.md",
      "vietTitle": "Quan Vô Lượng Thọ Phật Kinh Sớ"
    },
    {
      "id": "T37n1751",
      "title": "觀無量壽佛經疏妙宗鈔",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1751.md",
      "vietTitle": "Quan Vô Lượng Thọ Phật Kinh Sớ Diệu Tông Sao"
    },
    {
      "id": "T37n1752",
      "title": "觀無量壽經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1752.md",
      "vietTitle": "Quan Vô Lượng Thọ Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1753",
      "title": "觀無量壽佛經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1753.md",
      "vietTitle": "Quan Vô Lượng Thọ Phật Kinh Sớ"
    },
    {
      "id": "T37n1754",
      "title": "觀無量壽佛經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1754.md",
      "vietTitle": "Quan Vô Lượng Thọ Phật Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1755",
      "title": "阿彌陀經義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1755.md",
      "vietTitle": "A Di Đà Kinh Nghĩa Kí"
    },
    {
      "id": "T37n1756",
      "title": "阿彌陀經義述",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1756.md",
      "vietTitle": "A Di Đà Kinh Nghĩa Thuật"
    },
    {
      "id": "T37n1757",
      "title": "阿彌陀經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1757.md",
      "vietTitle": "A Di Đà Kinh Sớ"
    },
    {
      "id": "T37n1758",
      "title": "阿彌陀經通贊疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1758.md",
      "vietTitle": "A Di Đà Kinh Thông Tán Sớ"
    },
    {
      "id": "T37n1759",
      "title": "阿彌陀經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1759.md",
      "vietTitle": "A Di Đà Kinh Sớ"
    },
    {
      "id": "T37n1760",
      "title": "阿彌陀經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1760.md",
      "vietTitle": "A Di Đà Kinh Sớ"
    },
    {
      "id": "T37n1761",
      "title": "阿彌陀經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1761.md",
      "vietTitle": "A Di Đà Kinh Nghĩa Sớ"
    },
    {
      "id": "T37n1762",
      "title": "阿彌陀經要解",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1762.md",
      "vietTitle": "A Di Đà Kinh Yếu Giải"
    },
    {
      "id": "T37n1763",
      "title": "大般涅槃經集解",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1763.md",
      "vietTitle": "Đại Bát Niết Bàn Kinh Tập Giải"
    },
    {
      "id": "T37n1764",
      "title": "大般涅槃經義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T37n1764.md",
      "vietTitle": "Đại Bát Niết Bàn Kinh Nghĩa Kí"
    },
    {
      "id": "T38n1765",
      "title": "大般涅槃經玄義",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1765.md",
      "vietTitle": "Đại Bát Niết Bàn Kinh Huyền Nghĩa"
    },
    {
      "id": "T38n1766",
      "title": "涅槃玄義發源機要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1766.md",
      "vietTitle": "Niết Bàn Huyền Nghĩa Phát Nguyên Ki Yếu"
    },
    {
      "id": "T38n1767",
      "title": "大般涅槃經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1767.md",
      "vietTitle": "Đại Bát Niết Bàn Kinh Sớ"
    },
    {
      "id": "T38n1768",
      "title": "涅槃經遊意",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1768.md",
      "vietTitle": "Niết Bàn Kinh Du Ý"
    },
    {
      "id": "T38n1769",
      "title": "涅槃宗要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1769.md",
      "vietTitle": "Niết Bàn Tông Yếu"
    },
    {
      "id": "T38n1770",
      "title": "本願藥師經古迹",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1770.md",
      "vietTitle": "Bản Nguyện Dược Sư Kinh Cổ Tích"
    },
    {
      "id": "T38n1771",
      "title": "彌勒經遊意",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1771.md",
      "vietTitle": "Di Lặc Kinh Du Ý"
    },
    {
      "id": "T38n1772",
      "title": "觀彌勒上生兜率天經贊",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1772.md",
      "vietTitle": "Quan Di Lặc Thượng Sinh Đâu Suất Thiên Kinh Tán"
    },
    {
      "id": "T38n1773",
      "title": "彌勒上生經宗要",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1773.md",
      "vietTitle": "Di Lặc Thượng Sinh Kinh Tông Yếu"
    },
    {
      "id": "T38n1774",
      "title": "三彌勒經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1774.md",
      "vietTitle": "Tam Di Lặc Kinh Sớ"
    },
    {
      "id": "T38n1775",
      "title": "注維摩詰經",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1775.md",
      "vietTitle": "Kinh Chú Duy Ma Cật"
    },
    {
      "id": "T38n1776",
      "title": "維摩義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1776.md",
      "vietTitle": "Duy Ma Nghĩa Kí"
    },
    {
      "id": "T38n1777",
      "title": "維摩經玄疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1777.md",
      "vietTitle": "Duy Ma Kinh Huyền Sớ"
    },
    {
      "id": "T38n1778",
      "title": "維摩經略疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1778.md",
      "vietTitle": "Duy Ma Kinh Lược Sớ"
    },
    {
      "id": "T38n1779",
      "title": "維摩經略疏垂裕記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1779.md",
      "vietTitle": "Duy Ma Kinh Lược Sớ Thùy Dụ Kí"
    },
    {
      "id": "T38n1780",
      "title": "淨名玄論",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1780.md",
      "vietTitle": "Tịnh Danh Huyền Luận"
    },
    {
      "id": "T38n1781",
      "title": "維摩經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1781.md",
      "vietTitle": "Duy Ma Kinh Nghĩa Sớ"
    },
    {
      "id": "T38n1782",
      "title": "說無垢稱經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T38n1782.md",
      "vietTitle": "Thuyết Vô Cấu Xưng Kinh Sớ"
    },
    {
      "id": "T39n1783",
      "title": "金光明經玄義",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1783.md",
      "vietTitle": "Kim Quang Minh Kinh Huyền Nghĩa"
    },
    {
      "id": "T39n1784",
      "title": "金光明經玄義拾遺記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1784.md",
      "vietTitle": "Kim Quang Minh Kinh Huyền Nghĩa Thập Di Kí"
    },
    {
      "id": "T39n1785",
      "title": "金光明經文句",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1785.md",
      "vietTitle": "Kim Quang Minh Kinh Văn Cú"
    },
    {
      "id": "T39n1786",
      "title": "金光明經文句記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1786.md",
      "vietTitle": "Kim Quang Minh Kinh Văn Cú Kí"
    },
    {
      "id": "T39n1787",
      "title": "金光明經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1787.md",
      "vietTitle": "Kim Quang Minh Kinh Sớ"
    },
    {
      "id": "T39n1788",
      "title": "金光明最勝王經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1788.md",
      "vietTitle": "Kim Quang Minh Tối Thắng Vương Kinh Sớ"
    },
    {
      "id": "T39n1789",
      "title": "楞伽阿跋多羅寶經註解",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1789.md",
      "vietTitle": "Lăng Già A Bạt Đa La Bảo Kinh Chú Giải"
    },
    {
      "id": "T39n1790",
      "title": "入楞伽心玄義",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1790.md",
      "vietTitle": "Nhập Lăng Già Tâm Huyền Nghĩa"
    },
    {
      "id": "T39n1791",
      "title": "注大乘入楞伽經",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1791.md",
      "vietTitle": "Kinh Chú Đại Thừa Nhập Lăng Già"
    },
    {
      "id": "T39n1792",
      "title": "佛說盂蘭盆經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1792.md",
      "vietTitle": "Phật Thuyết Vu Lan Bồn Kinh Sớ"
    },
    {
      "id": "T39n1793",
      "title": "溫室經義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1793.md",
      "vietTitle": "Ôn Thất Kinh Nghĩa Kí"
    },
    {
      "id": "T39n1794",
      "title": "註四十二章經",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1794.md",
      "vietTitle": "Kinh Chú Tứ Thập Nhị Chương"
    },
    {
      "id": "T39n1795",
      "title": "大方廣圓覺修多羅了義經略疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1795.md",
      "vietTitle": "Đại Phương Quảng Viên Giác Tu Đa La Liễu Nghĩa Kinh Lược Sớ"
    },
    {
      "id": "T39n1796",
      "title": "大毘盧遮那成佛經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1796.md",
      "vietTitle": "Đại Tỳ Lô Già Na Thành Phật Kinh Sớ"
    },
    {
      "id": "T39n1797",
      "title": "大毘盧遮那經供養次第法疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1797.md",
      "vietTitle": "Đại Tỳ Lô Già Na Kinh Cúng Dưỡng Thứ Đệ Pháp Sớ"
    },
    {
      "id": "T39n1798",
      "title": "金剛頂經大瑜伽祕密心地法門義訣",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1798.md",
      "vietTitle": "Kim Cương Đính Kinh Đại Du Già Bí Mật Tâm Địa Pháp Môn Nghĩa Quyết"
    },
    {
      "id": "T39n1799",
      "title": "首楞嚴義疏注經",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1799.md",
      "vietTitle": "Kinh Thủ Lăng Nghiêm Nghĩa Sớ Chú"
    },
    {
      "id": "T39n1800",
      "title": "請觀音經疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1800.md",
      "vietTitle": "Thỉnh Quan Âm Kinh Sớ"
    },
    {
      "id": "T39n1801",
      "title": "請觀音經疏闡義鈔",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1801.md",
      "vietTitle": "Thỉnh Quan Âm Kinh Sớ Xiển Nghĩa Sao"
    },
    {
      "id": "T39n1802",
      "title": "十一面神呪心經義疏",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1802.md",
      "vietTitle": "Thập Nhất Diện Thần Chú Tâm Kinh Nghĩa Sớ"
    },
    {
      "id": "T39n1803",
      "title": "佛頂尊勝陀羅尼經教跡義記",
      "division": "17",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/17_Kinh_So/T39n1803.md",
      "vietTitle": "Phật Đính Tôn Thắng Đà La Ni Kinh Giáo Tích Nghĩa Kí"
    },
    {
      "id": "T40n1804",
      "title": "四分律刪繁補闕行事鈔",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1804.md",
      "vietTitle": "Tứ Phân Luật San Phồn Bổ Khuyết Hạnh Sự Sao"
    },
    {
      "id": "T40n1805",
      "title": "四分律行事鈔資持記",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1805.md",
      "vietTitle": "Tứ Phân Luật Hạnh Sự Sao Tư Trì Kí"
    },
    {
      "id": "T40n1806",
      "title": "四分律比丘含注戒本",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1806.md",
      "vietTitle": "Tứ Phân Luật Tỳ Kheo Hàm Chú Giới Bản"
    },
    {
      "id": "T40n1807",
      "title": "四分比丘戒本疏",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1807.md",
      "vietTitle": "Tứ Phân Tỳ Kheo Giới Bản Sớ"
    },
    {
      "id": "T40n1808",
      "title": "四分律刪補隨機羯磨",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1808.md",
      "vietTitle": "Tứ Phân Luật San Bổ Tùy Ki Yết Ma"
    },
    {
      "id": "T40n1809",
      "title": "僧羯磨",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1809.md",
      "vietTitle": "Tăng Yết Ma"
    },
    {
      "id": "T40n1810",
      "title": "尼羯磨",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1810.md",
      "vietTitle": "Ni Yết Ma"
    },
    {
      "id": "T40n1811",
      "title": "菩薩戒義疏",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1811.md",
      "vietTitle": "Bồ Tát Giới Nghĩa Sớ"
    },
    {
      "id": "T40n1812",
      "title": "天台菩薩戒疏",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1812.md",
      "vietTitle": "Thiên Đài Bồ Tát Giới Sớ"
    },
    {
      "id": "T40n1813",
      "title": "梵網經菩薩戒本疏",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1813.md",
      "vietTitle": "Phạm Võng Kinh Bồ Tát Giới Bản Sớ"
    },
    {
      "id": "T40n1814",
      "title": "菩薩戒本疏",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1814.md",
      "vietTitle": "Bồ Tát Giới Bản Sớ"
    },
    {
      "id": "T40n1815",
      "title": "梵網經古迹記",
      "division": "18",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/18_Luat_So/T40n1815.md",
      "vietTitle": "Phạm Võng Kinh Cổ Tích Kí"
    },
    {
      "id": "T40n1816",
      "title": "金剛般若論會釋",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T40n1816.md",
      "vietTitle": "Kim Cương Bát Nhã Luận Hội Thích"
    },
    {
      "id": "T40n1817",
      "title": "略明般若末後一頌讚述",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T40n1817.md",
      "vietTitle": "Lược Minh Bát Nhã Mạt Hậu Nhất Tụng Tán Thuật"
    },
    {
      "id": "T40n1818",
      "title": "法華論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T40n1818.md",
      "vietTitle": "Pháp Hoa Luận Sớ"
    },
    {
      "id": "T40n1819",
      "title": "無量壽經優婆提舍願生偈註",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T40n1819.md",
      "vietTitle": "Vô Lượng Thọ Kinh Ưu Bà Đề Xá Nguyện Sinh Kệ Chú"
    },
    {
      "id": "T40n1820",
      "title": "佛遺教經論疏節要",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T40n1820.md",
      "vietTitle": "Phật Di Giáo Kinh Luận Sớ Tiết Yếu"
    },
    {
      "id": "T41n1821",
      "title": "俱舍論記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T41n1821.md",
      "vietTitle": "Câu Xá Luận Kí"
    },
    {
      "id": "T41n1822",
      "title": "俱舍論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T41n1822.md",
      "vietTitle": "Câu Xá Luận Sớ"
    },
    {
      "id": "T41n1823",
      "title": "俱舍論頌疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T41n1823.md",
      "vietTitle": "Câu Xá Luận Tụng Sớ"
    },
    {
      "id": "T42n1824",
      "title": "中觀論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T42n1824.md",
      "vietTitle": "Trung Quan Luận Sớ"
    },
    {
      "id": "T42n1825",
      "title": "十二門論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T42n1825.md",
      "vietTitle": "Thập Nhị Môn Luận Sớ"
    },
    {
      "id": "T42n1826",
      "title": "十二門論宗致義記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T42n1826.md",
      "vietTitle": "Thập Nhị Môn Luận Tông Trí Nghĩa Kí"
    },
    {
      "id": "T42n1827",
      "title": "百論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T42n1827.md",
      "vietTitle": "Bách Luận Sớ"
    },
    {
      "id": "T42n1828",
      "title": "瑜伽論記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T42n1828.md",
      "vietTitle": "Du Già Luận Kí"
    },
    {
      "id": "T43n1829",
      "title": "瑜伽師地論略纂",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1829.md",
      "vietTitle": "Du Già Sư Địa Luận Lược Toản"
    },
    {
      "id": "T43n1830",
      "title": "成唯識論述記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1830.md",
      "vietTitle": "Thành Duy Thức Luận Thuật Kí"
    },
    {
      "id": "T43n1831",
      "title": "成唯識論掌中樞要",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1831.md",
      "vietTitle": "Thành Duy Thức Luận Chưởng Trung Xu Yếu"
    },
    {
      "id": "T43n1832",
      "title": "成唯識論了義燈",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1832.md",
      "vietTitle": "Thành Duy Thức Luận Liễu Nghĩa Đăng"
    },
    {
      "id": "T43n1833",
      "title": "成唯識論演祕",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1833.md",
      "vietTitle": "Thành Duy Thức Luận Diễn Bí"
    },
    {
      "id": "T43n1834",
      "title": "唯識二十論述記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T43n1834.md",
      "vietTitle": "Duy Thức Nhị Thập Luận Thuật Kí"
    },
    {
      "id": "T44n1835",
      "title": "辯中邊論述記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1835.md",
      "vietTitle": "Biện Trung Biên Luận Thuật Kí"
    },
    {
      "id": "T44n1836",
      "title": "大乘百法明門論解",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1836.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận Giải"
    },
    {
      "id": "T44n1837",
      "title": "大乘百法明門論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1837.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận Sớ"
    },
    {
      "id": "T44n1838",
      "title": "大乘法界無差別論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1838.md",
      "vietTitle": "Đại Thừa Pháp Giới Vô Sai Biệt Luận Sớ"
    },
    {
      "id": "T44n1839",
      "title": "理門論述記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1839.md",
      "vietTitle": "Lý Môn Luận Thuật Kí"
    },
    {
      "id": "T44n1840",
      "title": "因明入正理論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1840.md",
      "vietTitle": "Nhân Minh Nhập Chánh Lý Luận Sớ"
    },
    {
      "id": "T44n1841",
      "title": "因明義斷",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1841.md",
      "vietTitle": "Nhân Minh Nghĩa Đoạn"
    },
    {
      "id": "T44n1842",
      "title": "因明入正理論義纂要",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1842.md",
      "vietTitle": "Nhân Minh Nhập Chánh Lý Luận Nghĩa Toản Yếu"
    },
    {
      "id": "T44n1843",
      "title": "大乘起信論義疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1843.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Nghĩa Sớ"
    },
    {
      "id": "T44n1844",
      "title": "起信論疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1844.md",
      "vietTitle": "Khởi Tín Luận Sớ"
    },
    {
      "id": "T44n1845",
      "title": "大乘起信論別記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1845.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Biệt Kí"
    },
    {
      "id": "T44n1846",
      "title": "大乘起信論義記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1846.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Nghĩa Kí"
    },
    {
      "id": "T44n1847",
      "title": "大乘起信論義記別記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1847.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Nghĩa Kí Biệt Kí"
    },
    {
      "id": "T44n1848",
      "title": "起信論疏筆削記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1848.md",
      "vietTitle": "Khởi Tín Luận Sớ Bút Tước Kí"
    },
    {
      "id": "T44n1849",
      "title": "大乘起信論內義略探記",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1849.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Nội Nghĩa Lược Thám Kí"
    },
    {
      "id": "T44n1850",
      "title": "大乘起信論裂網疏",
      "division": "19",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/19_Luan_So/T44n1850.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Liệt Võng Sớ"
    },
    {
      "id": "T44n1851",
      "title": "大乘義章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T44n1851.md",
      "vietTitle": "Đại Thừa Nghĩa Chương"
    },
    {
      "id": "T45n1852",
      "title": "三論玄義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1852.md",
      "vietTitle": "Tam Luận Huyền Nghĩa"
    },
    {
      "id": "T45n1853",
      "title": "大乘玄論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1853.md",
      "vietTitle": "Đại Thừa Huyền Luận"
    },
    {
      "id": "T45n1854",
      "title": "二諦義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1854.md",
      "vietTitle": "Nhị Đế Nghĩa"
    },
    {
      "id": "T45n1855",
      "title": "三論遊意義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1855.md",
      "vietTitle": "Tam Luận Du Ý Nghĩa"
    },
    {
      "id": "T45n1856",
      "title": "鳩摩羅什法師大義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1856.md",
      "vietTitle": "Cưu Ma La Thập Pháp Sư Đại Nghĩa"
    },
    {
      "id": "T45n1857",
      "title": "寶藏論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1857.md",
      "vietTitle": "Bảo Tạng Luận"
    },
    {
      "id": "T45n1858",
      "title": "肇論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1858.md",
      "vietTitle": "Triệu Luận"
    },
    {
      "id": "T45n1859",
      "title": "肇論疏",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1859.md",
      "vietTitle": "Triệu Luận Sớ"
    },
    {
      "id": "T45n1860",
      "title": "肇論新疏",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1860.md",
      "vietTitle": "Triệu Luận Tân Sớ"
    },
    {
      "id": "T45n1861",
      "title": "大乘法苑義林章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1861.md",
      "vietTitle": "Đại Thừa Pháp Uyển Nghĩa Lâm Chương"
    },
    {
      "id": "T45n1862",
      "title": "勸發菩提心集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1862.md",
      "vietTitle": "Khuyến Phát Bồ Đề Tâm Tập"
    },
    {
      "id": "T45n1863",
      "title": "能顯中邊慧日論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1863.md",
      "vietTitle": "Năng Hiển Trung Biên Tuệ Nhật Luận"
    },
    {
      "id": "T45n1864",
      "title": "大乘入道次第",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1864.md",
      "vietTitle": "Đại Thừa Nhập Đạo Thứ Đệ"
    },
    {
      "id": "T45n1865",
      "title": "八識規矩補註",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1865.md",
      "vietTitle": "Bát Thức Quy Củ Bổ Chú"
    },
    {
      "id": "T45n1866",
      "title": "華嚴一乘教義分齊章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1866.md",
      "vietTitle": "Hoa Nghiêm Nhất Thừa Giáo Nghĩa Phân Tề Chương"
    },
    {
      "id": "T45n1867",
      "title": "華嚴五教止觀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1867.md",
      "vietTitle": "Hoa Nghiêm Ngũ Giáo Chỉ Quan"
    },
    {
      "id": "T45n1868",
      "title": "華嚴一乘十玄門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1868.md",
      "vietTitle": "Hoa Nghiêm Nhất Thừa Thập Huyền Môn"
    },
    {
      "id": "T45n1869",
      "title": "華嚴五十要問答",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1869.md",
      "vietTitle": "Hoa Nghiêm Ngũ Thập Yếu Vấn Đáp"
    },
    {
      "id": "T45n1870",
      "title": "華嚴經內章門等雜孔目章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1870.md",
      "vietTitle": "Hoa Nghiêm Kinh Nội Chương Môn Đẳng Tạp Khổng Mục Chương"
    },
    {
      "id": "T45n1871",
      "title": "華嚴經旨歸",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1871.md",
      "vietTitle": "Hoa Nghiêm Kinh Chỉ Quy"
    },
    {
      "id": "T45n1872",
      "title": "華嚴策林",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1872.md",
      "vietTitle": "Hoa Nghiêm Sách Lâm"
    },
    {
      "id": "T45n1873",
      "title": "華嚴經問答",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1873.md",
      "vietTitle": "Hoa Nghiêm Kinh Vấn Đáp"
    },
    {
      "id": "T45n1874",
      "title": "華嚴經明法品內立三寶章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1874.md",
      "vietTitle": "Hoa Nghiêm Kinh Minh Pháp Phẩm Nội Lập Tam Bảo Chương"
    },
    {
      "id": "T45n1875",
      "title": "華嚴經義海百門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1875.md",
      "vietTitle": "Hoa Nghiêm Kinh Nghĩa Hải Bách Môn"
    },
    {
      "id": "T45n1876",
      "title": "修華嚴奧旨妄盡還源觀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1876.md",
      "vietTitle": "Tu Hoa Nghiêm Áo Chỉ Vọng Tận Hoàn Nguyên Quan"
    },
    {
      "id": "T45n1877",
      "title": "華嚴遊心法界記",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1877.md",
      "vietTitle": "Hoa Nghiêm Du Tâm Pháp Giới Kí"
    },
    {
      "id": "T45n1878",
      "title": "華嚴發菩提心章",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1878.md",
      "vietTitle": "Hoa Nghiêm Phát Bồ Đề Tâm Chương"
    },
    {
      "id": "T45n1879a",
      "title": "華嚴經關脈義記",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1879a.md",
      "vietTitle": "Hoa Nghiêm Kinh Quan Mạch Nghĩa Kí"
    },
    {
      "id": "T45n1879b",
      "title": "華嚴關脈義記",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1879b.md",
      "vietTitle": "Hoa Nghiêm Quan Mạch Nghĩa Kí"
    },
    {
      "id": "T45n1880",
      "title": "金師子章雲間類解",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1880.md",
      "vietTitle": "Kim Sư Tử Chương Vân Gian Loại Giải"
    },
    {
      "id": "T45n1881",
      "title": "華嚴經金師子章註",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1881.md",
      "vietTitle": "Hoa Nghiêm Kinh Kim Sư Tử Chương Chú"
    },
    {
      "id": "T45n1882",
      "title": "三聖圓融觀門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1882.md",
      "vietTitle": "Tam Thánh Viên Dung Quan Môn"
    },
    {
      "id": "T45n1883",
      "title": "華嚴法界玄鏡",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1883.md",
      "vietTitle": "Hoa Nghiêm Pháp Giới Huyền Kính"
    },
    {
      "id": "T45n1884",
      "title": "註華嚴法界觀門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1884.md",
      "vietTitle": "Chú Hoa Nghiêm Pháp Giới Quan Môn"
    },
    {
      "id": "T45n1885",
      "title": "註華嚴經題法界觀門頌",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1885.md",
      "vietTitle": "Chú Hoa Nghiêm Kinh Đề Pháp Giới Quan Môn Tụng"
    },
    {
      "id": "T45n1886",
      "title": "原人論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1886.md",
      "vietTitle": "Nguyên Nhân Luận"
    },
    {
      "id": "T45n1887A",
      "title": "華嚴一乘法界圖",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1887A.md",
      "vietTitle": "Hoa Nghiêm Nhất Thừa Pháp Giới Đồ"
    },
    {
      "id": "T45n1887B",
      "title": "法界圖記叢髓錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1887B.md",
      "vietTitle": "Pháp Giới Đồ Kí Tùng Tủy Lục"
    },
    {
      "id": "T45n1888",
      "title": "解迷顯智成悲十明論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1888.md",
      "vietTitle": "Giải Mê Hiển Trí Thành Bi Thập Minh Luận"
    },
    {
      "id": "T45n1889",
      "title": "海印三昧論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1889.md",
      "vietTitle": "Hải Ấn Tam Muội Luận"
    },
    {
      "id": "T45n1890",
      "title": "華嚴一乘成佛妙義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1890.md",
      "vietTitle": "Hoa Nghiêm Nhất Thừa Thành Phật Diệu Nghĩa"
    },
    {
      "id": "T45n1891",
      "title": "文殊指南圖讚",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1891.md",
      "vietTitle": "Văn Thù Chỉ Nam Đồ Tán"
    },
    {
      "id": "T45n1892",
      "title": "關中創立戒壇圖經",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1892.md",
      "vietTitle": "Kinh Quan Trung Sang Lập Giới Đàn Đồ"
    },
    {
      "id": "T45n1893",
      "title": "淨心誡觀法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1893.md",
      "vietTitle": "Tịnh Tâm Giới Quan Pháp"
    },
    {
      "id": "T45n1894",
      "title": "釋門章服儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1894.md",
      "vietTitle": "Thích Môn Chương Phục Nghi"
    },
    {
      "id": "T45n1895",
      "title": "量處輕重儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1895.md",
      "vietTitle": "Lượng Xứ Khinh Trọng Nghi"
    },
    {
      "id": "T45n1896",
      "title": "釋門歸敬儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1896.md",
      "vietTitle": "Thích Môn Quy Kính Nghi"
    },
    {
      "id": "T45n1897",
      "title": "教誡新學比丘行護律儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1897.md",
      "vietTitle": "Giáo Giới Tân Học Tỳ Kheo Hạnh Hộ Luật Nghi"
    },
    {
      "id": "T45n1898",
      "title": "律相感通傳",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1898.md",
      "vietTitle": "Luật Tướng Cảm Thông Truyền"
    },
    {
      "id": "T45n1899",
      "title": "中天竺舍衛國祇洹寺圖經",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1899.md",
      "vietTitle": "Kinh Trung Thiên Trúc Xá Vệ Quốc Kỳ Hoàn Tự Đồ"
    },
    {
      "id": "T45n1900",
      "title": "佛制比丘六物圖",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1900.md",
      "vietTitle": "Phật Chế Tỳ Kheo Lục Vật Đồ"
    },
    {
      "id": "T45n1901",
      "title": "護命放生軌儀法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1901.md",
      "vietTitle": "Hộ Mạng Phóng Sinh Quỹ Nghi Pháp"
    },
    {
      "id": "T45n1902",
      "title": "受用三水要行法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1902.md",
      "vietTitle": "Thọ Dụng Tam Thủy Yếu Hạnh Pháp"
    },
    {
      "id": "T45n1903",
      "title": "說罪要行法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1903.md",
      "vietTitle": "Thuyết Tội Yếu Hạnh Pháp"
    },
    {
      "id": "T45n1904",
      "title": "根本說一切有部出家授近圓羯磨儀範",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1904.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Xuất Gia Thọ Cận Viên Yết Ma Nghi Phạm"
    },
    {
      "id": "T45n1905",
      "title": "根本說一切有部苾芻習學略法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1905.md",
      "vietTitle": "Căn Bản Thuyết Nhất Thiết Hữu Bộ Bật Sô Tập Học Lược Pháp"
    },
    {
      "id": "T45n1906",
      "title": "菩薩戒本宗要",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1906.md",
      "vietTitle": "Bồ Tát Giới Bản Tông Yếu"
    },
    {
      "id": "T45n1907",
      "title": "菩薩戒本持犯要記",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1907.md",
      "vietTitle": "Bồ Tát Giới Bản Trì Phạm Yếu Kí"
    },
    {
      "id": "T45n1908",
      "title": "大乘六情懺悔",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1908.md",
      "vietTitle": "Đại Thừa Lục Tình Sám Hối"
    },
    {
      "id": "T45n1909",
      "title": "慈悲道場懺法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1909.md",
      "vietTitle": "Từ Bi Đạo Tràng Sám Pháp"
    },
    {
      "id": "T45n1910",
      "title": "慈悲水懺法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T45n1910.md",
      "vietTitle": "Từ Bi Thủy Sám Pháp"
    },
    {
      "id": "T46n1911",
      "title": "摩訶止觀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1911.md",
      "vietTitle": "Ma Ha Chỉ Quan"
    },
    {
      "id": "T46n1912",
      "title": "止觀輔行傳弘決",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1912.md",
      "vietTitle": "Chỉ Quan Phụ Hạnh Truyền Hoằng Quyết"
    },
    {
      "id": "T46n1913",
      "title": "止觀義例",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1913.md",
      "vietTitle": "Chỉ Quan Nghĩa Lệ"
    },
    {
      "id": "T46n1914",
      "title": "止觀大意",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1914.md",
      "vietTitle": "Chỉ Quan Đại Ý"
    },
    {
      "id": "T46n1915",
      "title": "修習止觀坐禪法要",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1915.md",
      "vietTitle": "Tu Tập Chỉ Quan Tọa Thiền Pháp Yếu"
    },
    {
      "id": "T46n1916",
      "title": "釋禪波羅蜜次第法門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1916.md",
      "vietTitle": "Thích Thiền Ba La Mật Thứ Đệ Pháp Môn"
    },
    {
      "id": "T46n1917",
      "title": "六妙法門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1917.md",
      "vietTitle": "Lục Diệu Pháp Môn"
    },
    {
      "id": "T46n1918",
      "title": "四念處",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1918.md",
      "vietTitle": "Tứ Niệm Xứ"
    },
    {
      "id": "T46n1919",
      "title": "天台智者大師禪門口訣",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1919.md",
      "vietTitle": "Thiên Đài Trí Giả Đại Sư Thiền Môn Khẩu Quyết"
    },
    {
      "id": "T46n1920",
      "title": "觀心論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1920.md",
      "vietTitle": "Quan Tâm Luận"
    },
    {
      "id": "T46n1921",
      "title": "觀心論疏",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1921.md",
      "vietTitle": "Quan Tâm Luận Sớ"
    },
    {
      "id": "T46n1922",
      "title": "釋摩訶般若波羅蜜經覺意三昧",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1922.md",
      "vietTitle": "Thích Ma Ha Bát Nhã Ba La Mật Kinh Giác Ý Tam Muội"
    },
    {
      "id": "T46n1923",
      "title": "諸法無諍三昧法門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1923.md",
      "vietTitle": "Chư Pháp Vô Tránh Tam Muội Pháp Môn"
    },
    {
      "id": "T46n1924",
      "title": "大乘止觀法門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1924.md",
      "vietTitle": "Đại Thừa Chỉ Quan Pháp Môn"
    },
    {
      "id": "T46n1925",
      "title": "法界次第初門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1925.md",
      "vietTitle": "Pháp Giới Thứ Đệ Sơ Môn"
    },
    {
      "id": "T46n1926",
      "title": "法華經安樂行義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1926.md",
      "vietTitle": "Pháp Hoa Kinh An Lạc Hạnh Nghĩa"
    },
    {
      "id": "T46n1927",
      "title": "十不二門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1927.md",
      "vietTitle": "Thập Bất Nhị Môn"
    },
    {
      "id": "T46n1928",
      "title": "十不二門指要鈔",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1928.md",
      "vietTitle": "Thập Bất Nhị Môn Chỉ Yếu Sao"
    },
    {
      "id": "T46n1929",
      "title": "四教義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1929.md",
      "vietTitle": "Tứ Giáo Nghĩa"
    },
    {
      "id": "T46n1930",
      "title": "天台八教大意",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1930.md",
      "vietTitle": "Thiên Đài Bát Giáo Đại Ý"
    },
    {
      "id": "T46n1931",
      "title": "天台四教儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1931.md",
      "vietTitle": "Thiên Đài Tứ Giáo Nghi"
    },
    {
      "id": "T46n1932",
      "title": "金剛錍",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1932.md",
      "vietTitle": "Kim Cương Tỳ"
    },
    {
      "id": "T46n1933",
      "title": "南嶽思大禪師立誓願文",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1933.md",
      "vietTitle": "Nam Nhạc Tư Đại Thiền Sư Lập Thệ Nguyện Văn"
    },
    {
      "id": "T46n1934",
      "title": "國清百錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1934.md",
      "vietTitle": "Quốc Thanh Bách Lục"
    },
    {
      "id": "T46n1935",
      "title": "法智遺編觀心二百問",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1935.md",
      "vietTitle": "Pháp Trí Di Biên Quan Tâm Nhị Bách Vấn"
    },
    {
      "id": "T46n1936",
      "title": "四明十義書",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1936.md",
      "vietTitle": "Tứ Minh Thập Nghĩa Thư"
    },
    {
      "id": "T46n1937",
      "title": "四明尊者教行錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1937.md",
      "vietTitle": "Tứ Minh Tôn Giả Giáo Hạnh Lục"
    },
    {
      "id": "T46n1938",
      "title": "天台傳佛心印記",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1938.md",
      "vietTitle": "Thiên Đài Truyền Phật Tâm Ấn Kí"
    },
    {
      "id": "T46n1939",
      "title": "教觀綱宗",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1939.md",
      "vietTitle": "Giáo Quan Cương Tông"
    },
    {
      "id": "T46n1940",
      "title": "方等三昧行法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1940.md",
      "vietTitle": "Phương Đẳng Tam Muội Hạnh Pháp"
    },
    {
      "id": "T46n1941",
      "title": "法華三昧懺儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1941.md",
      "vietTitle": "Pháp Hoa Tam Muội Sám Nghi"
    },
    {
      "id": "T46n1942",
      "title": "法華三昧行事運想補助儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1942.md",
      "vietTitle": "Pháp Hoa Tam Muội Hạnh Sự Vận Tưởng Bổ Trợ Nghi"
    },
    {
      "id": "T46n1943",
      "title": "略法華三昧補助儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1943.md",
      "vietTitle": "Lược Pháp Hoa Tam Muội Bổ Trợ Nghi"
    },
    {
      "id": "T46n1944",
      "title": "禮法華經儀式",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1944.md",
      "vietTitle": "Lễ Pháp Hoa Kinh Nghi Thức"
    },
    {
      "id": "T46n1945",
      "title": "金光明懺法補助儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1945.md",
      "vietTitle": "Kim Quang Minh Sám Pháp Bổ Trợ Nghi"
    },
    {
      "id": "T46n1946",
      "title": "金光明最勝懺儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1946.md",
      "vietTitle": "Kim Quang Minh Tối Thắng Sám Nghi"
    },
    {
      "id": "T46n1947",
      "title": "釋迦如來涅槃禮讚文",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1947.md",
      "vietTitle": "Thích Ca Như Lai Niết Bàn Lễ Tán Văn"
    },
    {
      "id": "T46n1948",
      "title": "天台智者大師齋忌禮讚文",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1948.md",
      "vietTitle": "Thiên Đài Trí Giả Đại Sư Trai Kỵ Lễ Tán Văn"
    },
    {
      "id": "T46n1949",
      "title": "請觀世音菩薩消伏毒害陀羅尼三昧儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1949.md",
      "vietTitle": "Thỉnh Quan Thế Âm Bồ Tát Tiêu Phục Độc Hại Đà La Ni Tam Muội Nghi"
    },
    {
      "id": "T46n1950",
      "title": "千手眼大悲心呪行法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1950.md",
      "vietTitle": "Thiên Thủ Nhãn Đại Bi Tâm Chú Hạnh Pháp"
    },
    {
      "id": "T46n1951",
      "title": "熾盛光道場念誦儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1951.md",
      "vietTitle": "Sí Thịnh Quang Đạo Tràng Niệm Tụng Nghi"
    },
    {
      "id": "T46n1952",
      "title": "觀自在菩薩如意輪呪課法",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1952.md",
      "vietTitle": "Quan Tự Tại Bồ Tát Như Ý Luân Chú Khóa Pháp"
    },
    {
      "id": "T46n1953",
      "title": "菩提心義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1953.md",
      "vietTitle": "Bồ Đề Tâm Nghĩa"
    },
    {
      "id": "T46n1954",
      "title": "明佛法根本碑",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1954.md",
      "vietTitle": "Minh Phật Pháp Căn Bản Bi"
    },
    {
      "id": "T46n1955",
      "title": "顯密圓通成佛心要集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1955.md",
      "vietTitle": "Hiển Mật Viên Thông Thành Phật Tâm Yếu Tập"
    },
    {
      "id": "T46n1956",
      "title": "密呪圓因往生集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T46n1956.md",
      "vietTitle": "Mật Chú Viên Nhân Vãng Sinh Tập"
    },
    {
      "id": "T47n1957",
      "title": "略論安樂淨土義",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1957.md",
      "vietTitle": "Lược Luận An Lạc Tịnh Thổ Nghĩa"
    },
    {
      "id": "T47n1958",
      "title": "安樂集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1958.md",
      "vietTitle": "An Lạc Tập"
    },
    {
      "id": "T47n1959",
      "title": "觀念阿彌陀佛相海三昧功德法門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1959.md",
      "vietTitle": "Quan Niệm A Di Đà Phật Tướng Hải Tam Muội Công Đức Pháp Môn"
    },
    {
      "id": "T47n1960",
      "title": "釋淨土群疑論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1960.md",
      "vietTitle": "Thích Tịnh Thổ Quần Nghi Luận"
    },
    {
      "id": "T47n1961",
      "title": "淨土十疑論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1961.md",
      "vietTitle": "Tịnh Thổ Thập Nghi Luận"
    },
    {
      "id": "T47n1962",
      "title": "五方便念佛門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1962.md",
      "vietTitle": "Ngũ Phương Tiện Niệm Phật Môn"
    },
    {
      "id": "T47n1963",
      "title": "淨土論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1963.md",
      "vietTitle": "Tịnh Thổ Luận"
    },
    {
      "id": "T47n1964",
      "title": "西方要決釋疑通規",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1964.md",
      "vietTitle": "Tây Phương Yếu Quyết Thích Nghi Thông Quy"
    },
    {
      "id": "T47n1965",
      "title": "遊心安樂道",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1965.md",
      "vietTitle": "Du Tâm An Lạc Đạo"
    },
    {
      "id": "T47n1966",
      "title": "念佛鏡",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1966.md",
      "vietTitle": "Niệm Phật Kính"
    },
    {
      "id": "T47n1967",
      "title": "念佛三昧寶王論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1967.md",
      "vietTitle": "Niệm Phật Tam Muội Bảo Vương Luận"
    },
    {
      "id": "T47n1968",
      "title": "往生淨土決疑行願二門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1968.md",
      "vietTitle": "Vãng Sinh Tịnh Thổ Quyết Nghi Hạnh Nguyện Nhị Môn"
    },
    {
      "id": "T47n1969A",
      "title": "樂邦文類",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1969A.md",
      "vietTitle": "Lạc Bang Văn Loại"
    },
    {
      "id": "T47n1969B",
      "title": "樂邦遺稿",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1969B.md",
      "vietTitle": "Lạc Bang Di Cảo"
    },
    {
      "id": "T47n1970",
      "title": "龍舒增廣淨土文",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1970.md",
      "vietTitle": "Long Thư Tăng Quảng Tịnh Thổ Văn"
    },
    {
      "id": "T47n1971",
      "title": "淨土境觀要門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1971.md",
      "vietTitle": "Tịnh Thổ Cảnh Quan Yếu Môn"
    },
    {
      "id": "T47n1972",
      "title": "淨土或問",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1972.md",
      "vietTitle": "Tịnh Thổ Hoặc Vấn"
    },
    {
      "id": "T47n1973",
      "title": "廬山蓮宗寶鑑",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1973.md",
      "vietTitle": "Lư Sơn Liên Tông Bảo Giám"
    },
    {
      "id": "T47n1974",
      "title": "寶王三昧念佛直指",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1974.md",
      "vietTitle": "Bảo Vương Tam Muội Niệm Phật Trực Chỉ"
    },
    {
      "id": "T47n1975",
      "title": "淨土生無生論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1975.md",
      "vietTitle": "Tịnh Thổ Sinh Vô Sinh Luận"
    },
    {
      "id": "T47n1976",
      "title": "西方合論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1976.md",
      "vietTitle": "Tây Phương Hợp Luận"
    },
    {
      "id": "T47n1977",
      "title": "淨土疑辨",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1977.md",
      "vietTitle": "Tịnh Thổ Nghi Biện"
    },
    {
      "id": "T47n1978",
      "title": "讚阿彌陀佛偈",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1978.md",
      "vietTitle": "Tán A Di Đà Phật Kệ"
    },
    {
      "id": "T47n1979",
      "title": "轉經行道願往生淨土法事讚",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1979.md",
      "vietTitle": "Chuyển Kinh Hạnh Đạo Nguyện Vãng Sinh Tịnh Thổ Pháp Sự Tán"
    },
    {
      "id": "T47n1980",
      "title": "往生禮讚偈",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1980.md",
      "vietTitle": "Vãng Sinh Lễ Tán Kệ"
    },
    {
      "id": "T47n1981",
      "title": "依觀經等明般舟三昧行道往生讚",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1981.md",
      "vietTitle": "Y Quan Kinh Đẳng Minh Bát Chu Tam Muội Hạnh Đạo Vãng Sinh Tán"
    },
    {
      "id": "T47n1982",
      "title": "集諸經禮懺儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1982.md",
      "vietTitle": "Tập Chư Kinh Lễ Sám Nghi"
    },
    {
      "id": "T47n1983",
      "title": "淨土五會念佛略法事儀讚",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1983.md",
      "vietTitle": "Tịnh Thổ Ngũ Hội Niệm Phật Lược Pháp Sự Nghi Tán"
    },
    {
      "id": "T47n1984",
      "title": "往生淨土懺願儀",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1984.md",
      "vietTitle": "Vãng Sinh Tịnh Thổ Sám Nguyện Nghi"
    },
    {
      "id": "T47n1985",
      "title": "鎮州臨濟慧照禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1985.md",
      "vietTitle": "Trấn Châu Lâm Tế Tuệ Chiếu Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1986A",
      "title": "筠州洞山悟本禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1986A.md",
      "vietTitle": "Quân Châu Động Sơn Ngộ Bản Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1986B",
      "title": "瑞州洞山良价禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1986B.md",
      "vietTitle": "Thụy Châu Động Sơn Lương Giới Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1987A",
      "title": "撫州曹山元證禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1987A.md",
      "vietTitle": "Phủ Châu Tào Sơn Nguyên Chứng Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1987B",
      "title": "撫州曹山本寂禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1987B.md",
      "vietTitle": "Phủ Châu Tào Sơn Bản Tịch Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1988",
      "title": "雲門匡真禪師廣錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1988.md",
      "vietTitle": "Vân Môn Khuông Chân Thiền Sư Quảng Lục"
    },
    {
      "id": "T47n1989",
      "title": "潭州溈山靈祐禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1989.md",
      "vietTitle": "Đàm Châu Quy Sơn Linh Hựu Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1990",
      "title": "袁州仰山慧寂禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1990.md",
      "vietTitle": "Viên Châu Ngưỡng Sơn Tuệ Tịch Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1991",
      "title": "金陵清涼院文益禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1991.md",
      "vietTitle": "Kim Lăng Thanh Lương Viện Văn Ích Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1992",
      "title": "汾陽無德禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1992.md",
      "vietTitle": "Phần Dương Vô Đức Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1993",
      "title": "黃龍慧南禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1993.md",
      "vietTitle": "Hoàng Long Tuệ Nam Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1994A",
      "title": "楊岐方會和尚語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1994A.md",
      "vietTitle": "Dương Kỳ Phương Hội Hòa Thượng Ngữ Lục"
    },
    {
      "id": "T47n1994B",
      "title": "楊岐方會和尚後錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1994B.md",
      "vietTitle": "Dương Kỳ Phương Hội Hòa Thượng Hậu Lục"
    },
    {
      "id": "T47n1995",
      "title": "法演禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1995.md",
      "vietTitle": "Pháp Diễn Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1996",
      "title": "明覺禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1996.md",
      "vietTitle": "Minh Giác Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1997",
      "title": "圓悟佛果禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1997.md",
      "vietTitle": "Viên Ngộ Phật Quả Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1998A",
      "title": "大慧普覺禪師語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1998A.md",
      "vietTitle": "Đại Tuệ Phổ Giác Thiền Sư Ngữ Lục"
    },
    {
      "id": "T47n1998B",
      "title": "大慧普覺禪師宗門武庫",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1998B.md",
      "vietTitle": "Đại Tuệ Phổ Giác Thiền Sư Tông Môn Vũ Khố"
    },
    {
      "id": "T47n1999",
      "title": "密菴和尚語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n1999.md",
      "vietTitle": "Mật Am Hòa Thượng Ngữ Lục"
    },
    {
      "id": "T47n2000",
      "title": "虛堂和尚語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T47n2000.md",
      "vietTitle": "Hư Đường Hòa Thượng Ngữ Lục"
    },
    {
      "id": "T48n2001",
      "title": "宏智禪師廣錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2001.md",
      "vietTitle": "Hoằng Trí Thiền Sư Quảng Lục"
    },
    {
      "id": "T48n2002A",
      "title": "如淨和尚語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2002A.md",
      "vietTitle": "Như Tịnh Hòa Thượng Ngữ Lục"
    },
    {
      "id": "T48n2002B",
      "title": "天童山景德寺如淨禪師續語錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2002B.md",
      "vietTitle": "Thiên Đồng Sơn Cảnh Đức Tự Như Tịnh Thiền Sư Tục Ngữ Lục"
    },
    {
      "id": "T48n2003",
      "title": "佛果圜悟禪師碧巖錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2003.md",
      "vietTitle": "Phật Quả Viên Ngộ Thiền Sư Bích Nham Lục"
    },
    {
      "id": "T48n2004",
      "title": "萬松老人評唱天童覺和尚頌古從容庵錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2004.md",
      "vietTitle": "Vạn Tùng Lão Nhân Bình Xướng Thiên Đồng Giác Hòa Thượng Tụng Cổ Tòng Dung Am Lục"
    },
    {
      "id": "T48n2005",
      "title": "無門關",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2005.md",
      "vietTitle": "Vô Môn Quan"
    },
    {
      "id": "T48n2006",
      "title": "人天眼目",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2006.md",
      "vietTitle": "Nhân Thiên Nhãn Mục"
    },
    {
      "id": "T48n2007",
      "title": "南宗頓教最上大乘摩訶般若波羅蜜經六祖惠能大師於韶州大梵寺施法壇經",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2007.md",
      "vietTitle": "Kinh Nam Tông Đốn Giáo Tối Thượng Đại Thừa Ma Ha Bát Nhã Ba La Mật Kinh Lục Tổ Huệ Năng Đại Sư Vu Thiều Châu Đại Phạm Tự Thí Pháp Đàn"
    },
    {
      "id": "T48n2008",
      "title": "六祖大師法寶壇經",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2008.md",
      "vietTitle": "Kinh Lục Tổ Đại Sư Pháp Bảo Đàn"
    },
    {
      "id": "T48n2009",
      "title": "少室六門",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2009.md",
      "vietTitle": "Thiếu Thất Lục Môn"
    },
    {
      "id": "T48n2010",
      "title": "信心銘",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2010.md",
      "vietTitle": "Tín Tâm Minh"
    },
    {
      "id": "T48n2011",
      "title": "最上乘論",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2011.md",
      "vietTitle": "Tối Thượng Thừa Luận"
    },
    {
      "id": "T48n2012A",
      "title": "黃檗山斷際禪師傳心法要",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2012A.md",
      "vietTitle": "Hoàng Bách Sơn Đoạn Tế Thiền Sư Truyền Tâm Pháp Yếu"
    },
    {
      "id": "T48n2012B",
      "title": "黃檗斷際禪師宛陵錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2012B.md",
      "vietTitle": "Hoàng Bách Đoạn Tế Thiền Sư Uyển Lăng Lục"
    },
    {
      "id": "T48n2013",
      "title": "禪宗永嘉集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2013.md",
      "vietTitle": "Thiền Tông Vĩnh Gia Tập"
    },
    {
      "id": "T48n2014",
      "title": "永嘉證道歌",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2014.md",
      "vietTitle": "Vĩnh Gia Chứng Đạo Ca"
    },
    {
      "id": "T48n2015",
      "title": "禪源諸詮集都序",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2015.md",
      "vietTitle": "Thiền Nguyên Chư Thuyên Tập Đô Tự"
    },
    {
      "id": "T48n2016",
      "title": "宗鏡錄",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2016.md",
      "vietTitle": "Tông Kính Lục"
    },
    {
      "id": "T48n2017",
      "title": "萬善同歸集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2017.md",
      "vietTitle": "Vạn Thiện Đồng Quy Tập"
    },
    {
      "id": "T48n2018",
      "title": "永明智覺禪師唯心訣",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2018.md",
      "vietTitle": "Vĩnh Minh Trí Giác Thiền Sư Duy Tâm Quyết"
    },
    {
      "id": "T48n2019A",
      "title": "真心直說",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2019A.md",
      "vietTitle": "Chân Tâm Trực Thuyết"
    },
    {
      "id": "T48n2019B",
      "title": "誡初心學人文",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2019B.md",
      "vietTitle": "Giới Sơ Tâm Học Nhân Văn"
    },
    {
      "id": "T48n2020",
      "title": "高麗國普照禪師修心訣",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2020.md",
      "vietTitle": "Cao Lệ Quốc Phổ Chiếu Thiền Sư Tu Tâm Quyết"
    },
    {
      "id": "T48n2021",
      "title": "禪宗決疑集",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2021.md",
      "vietTitle": "Thiền Tông Quyết Nghi Tập"
    },
    {
      "id": "T48n2022",
      "title": "禪林寶訓",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2022.md",
      "vietTitle": "Thiền Lâm Bảo Huấn"
    },
    {
      "id": "T48n2023",
      "title": "緇門警訓",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2023.md",
      "vietTitle": "Truy Môn Cảnh Huấn"
    },
    {
      "id": "T48n2024",
      "title": "禪關策進",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2024.md",
      "vietTitle": "Thiền Quan Sách Tiến"
    },
    {
      "id": "T48n2025",
      "title": "勅修百丈清規",
      "division": "20",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/20_Chu_Tong/T48n2025.md",
      "vietTitle": "Sắc Tu Bách Trượng Thanh Quy"
    },
    {
      "id": "T49n2026",
      "title": "撰集三藏及雜藏傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2026.md",
      "vietTitle": "Soạn Tập Tam Tạng Cập Tạp Tạng Truyền"
    },
    {
      "id": "T49n2027",
      "title": "迦葉結經",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2027.md",
      "vietTitle": "Kinh Ca Diệp Kết"
    },
    {
      "id": "T49n2028",
      "title": "迦丁比丘說當來變經",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2028.md",
      "vietTitle": "Kinh Ca Đinh Tỳ Kheo Thuyết Đương Lai Biến"
    },
    {
      "id": "T49n2029",
      "title": "佛使比丘迦旃延說法沒盡偈百二十章",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2029.md",
      "vietTitle": "Phật Sứ Tỳ Kheo Ca Chiên Diên Thuyết Pháp Một Tận Kệ Bách Nhị Thập Chương"
    },
    {
      "id": "T49n2030",
      "title": "大阿羅漢難提蜜多羅所說法住記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2030.md",
      "vietTitle": "Đại A La Hán Nan Đề Mật Đa La Sở Thuyết Pháp Trụ Kí"
    },
    {
      "id": "T49n2031",
      "title": "異部宗輪論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2031.md",
      "vietTitle": "Dị Bộ Tông Luân Luận"
    },
    {
      "id": "T49n2032",
      "title": "十八部論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2032.md",
      "vietTitle": "Thập Bát Bộ Luận"
    },
    {
      "id": "T49n2033",
      "title": "部執異論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2033.md",
      "vietTitle": "Bộ Chấp Dị Luận"
    },
    {
      "id": "T49n2034",
      "title": "歷代三寶紀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2034.md",
      "vietTitle": "Lịch Đại Tam Bảo Kỉ"
    },
    {
      "id": "T49n2035",
      "title": "佛祖統紀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2035.md",
      "vietTitle": "Phật Tổ Thống Kỉ"
    },
    {
      "id": "T49n2036",
      "title": "佛祖歷代通載",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2036.md",
      "vietTitle": "Phật Tổ Lịch Đại Thông Tái"
    },
    {
      "id": "T49n2037",
      "title": "釋氏稽古略",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2037.md",
      "vietTitle": "Thích Thị Khê Cổ Lược"
    },
    {
      "id": "T49n2038",
      "title": "釋鑑稽古略續集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2038.md",
      "vietTitle": "Thích Giám Khê Cổ Lược Tục Tập"
    },
    {
      "id": "T49n2039",
      "title": "三國遺事",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T49n2039.md",
      "vietTitle": "Tam Quốc Di Sự"
    },
    {
      "id": "T50n2040",
      "title": "釋迦譜",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2040.md",
      "vietTitle": "Thích Ca Phổ"
    },
    {
      "id": "T50n2041",
      "title": "釋迦氏譜",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2041.md",
      "vietTitle": "Thích Ca Thị Phổ"
    },
    {
      "id": "T50n2042",
      "title": "阿育王傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2042.md",
      "vietTitle": "A Dục Vương Truyền"
    },
    {
      "id": "T50n2043",
      "title": "阿育王經",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2043.md",
      "vietTitle": "Kinh A Dục Vương"
    },
    {
      "id": "T50n2044",
      "title": "天尊說阿育王譬喻經",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2044.md",
      "vietTitle": "Kinh Thiên Tôn Thuyết A Dục Vương Thí Dụ"
    },
    {
      "id": "T50n2045",
      "title": "阿育王息壞目因緣經",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2045.md",
      "vietTitle": "Kinh A Dục Vương Tức Hoại Mục Nhân Duyên"
    },
    {
      "id": "T50n2046",
      "title": "馬鳴菩薩傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2046.md",
      "vietTitle": "Mã Minh Bồ Tát Truyền"
    },
    {
      "id": "T50n2047a",
      "title": "龍樹菩薩傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2047a.md",
      "vietTitle": "Long Thụ Bồ Tát Truyền"
    },
    {
      "id": "T50n2047b",
      "title": "龍樹菩薩傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2047b.md",
      "vietTitle": "Long Thụ Bồ Tát Truyền"
    },
    {
      "id": "T50n2048",
      "title": "提婆菩薩傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2048.md",
      "vietTitle": "Đề Bà Bồ Tát Truyền"
    },
    {
      "id": "T50n2049",
      "title": "婆藪槃豆法師傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2049.md",
      "vietTitle": "Bà Tẩu Bàn Đậu Pháp Sư Truyền"
    },
    {
      "id": "T50n2050",
      "title": "隋天台智者大師別傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2050.md",
      "vietTitle": "Tùy Thiên Đài Trí Giả Đại Sư Biệt Truyền"
    },
    {
      "id": "T50n2051",
      "title": "唐護法沙門法琳別傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2051.md",
      "vietTitle": "Đường Hộ Pháp Sa Môn Pháp Lâm Biệt Truyền"
    },
    {
      "id": "T50n2052",
      "title": "大唐故三藏玄奘法師行狀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2052.md",
      "vietTitle": "Đại Đường Cố Tam Tạng Huyền Trang Pháp Sư Hạnh Trạng"
    },
    {
      "id": "T50n2053",
      "title": "大唐大慈恩寺三藏法師傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2053.md",
      "vietTitle": "Đại Đường Đại Từ Ân Tự Tam Tạng Pháp Sư Truyền"
    },
    {
      "id": "T50n2054",
      "title": "唐大薦福寺故寺主翻經大德法藏和尚傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2054.md",
      "vietTitle": "Đường Đại Tiến Phước Tự Cố Tự Chủ Phiên Kinh Đại Đức Pháp Tạng Hòa Thượng Truyền"
    },
    {
      "id": "T50n2055",
      "title": "玄宗朝翻經三藏善無畏贈鴻臚卿行狀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2055.md",
      "vietTitle": "Huyền Tông Triều Phiên Kinh Tam Tạng Thiện Vô Úy Tặng Hồng Lư Khanh Hạnh Trạng"
    },
    {
      "id": "T50n2056",
      "title": "大唐故大德贈司空大辨正廣智不空三藏行狀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2056.md",
      "vietTitle": "Đại Đường Cố Đại Đức Tặng Ty Không Đại Biện Chánh Quảng Trí Bất Không Tam Tạng Hạnh Trạng"
    },
    {
      "id": "T50n2057",
      "title": "大唐青龍寺三朝供奉大德行狀",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2057.md",
      "vietTitle": "Đại Đường Thanh Long Tự Tam Triều Cúng Phụng Đại Đức Hạnh Trạng"
    },
    {
      "id": "T50n2058",
      "title": "付法藏因緣傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2058.md",
      "vietTitle": "Phó Pháp Tạng Nhân Duyên Truyền"
    },
    {
      "id": "T50n2059",
      "title": "高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2059.md",
      "vietTitle": "Cao Tăng Truyền"
    },
    {
      "id": "T50n2060",
      "title": "續高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2060.md",
      "vietTitle": "Tục Cao Tăng Truyền"
    },
    {
      "id": "T50n2061",
      "title": "宋高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2061.md",
      "vietTitle": "Tống Cao Tăng Truyền"
    },
    {
      "id": "T50n2062",
      "title": "大明高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2062.md",
      "vietTitle": "Đại Minh Cao Tăng Truyền"
    },
    {
      "id": "T50n2063",
      "title": "比丘尼傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2063.md",
      "vietTitle": "Tỳ Kheo Ni Truyền"
    },
    {
      "id": "T50n2064",
      "title": "神僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2064.md",
      "vietTitle": "Thần Tăng Truyền"
    },
    {
      "id": "T50n2065",
      "title": "海東高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T50n2065.md",
      "vietTitle": "Hải Đông Cao Tăng Truyền"
    },
    {
      "id": "T51n2066",
      "title": "大唐西域求法高僧傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2066.md",
      "vietTitle": "Đại Đường Tây Vực Cầu Pháp Cao Tăng Truyền"
    },
    {
      "id": "T51n2067",
      "title": "弘贊法華傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2067.md",
      "vietTitle": "Hoằng Tán Pháp Hoa Truyền"
    },
    {
      "id": "T51n2068",
      "title": "法華傳記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2068.md",
      "vietTitle": "Pháp Hoa Truyền Kí"
    },
    {
      "id": "T51n2069",
      "title": "天台九祖傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2069.md",
      "vietTitle": "Thiên Đài Cửu Tổ Truyền"
    },
    {
      "id": "T51n2070",
      "title": "往生西方淨土瑞應傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2070.md",
      "vietTitle": "Vãng Sinh Tây Phương Tịnh Thổ Thụy Ứng Truyền"
    },
    {
      "id": "T51n2071",
      "title": "淨土往生傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2071.md",
      "vietTitle": "Tịnh Thổ Vãng Sinh Truyền"
    },
    {
      "id": "T51n2072",
      "title": "往生集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2072.md",
      "vietTitle": "Vãng Sinh Tập"
    },
    {
      "id": "T51n2073",
      "title": "華嚴經傳記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2073.md",
      "vietTitle": "Hoa Nghiêm Kinh Truyền Kí"
    },
    {
      "id": "T51n2074",
      "title": "大方廣佛華嚴經感應傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2074.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Cảm Ứng Truyền"
    },
    {
      "id": "T51n2075",
      "title": "曆代法寶記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2075.md",
      "vietTitle": "Lịch Đại Pháp Bảo Kí"
    },
    {
      "id": "T51n2076",
      "title": "景德傳燈錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2076.md",
      "vietTitle": "Cảnh Đức Truyền Đăng Lục"
    },
    {
      "id": "T51n2077",
      "title": "續傳燈錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2077.md",
      "vietTitle": "Tục Truyền Đăng Lục"
    },
    {
      "id": "T51n2078",
      "title": "傳法正宗記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2078.md",
      "vietTitle": "Truyền Pháp Chánh Tông Kí"
    },
    {
      "id": "T51n2079",
      "title": "傳法正宗定祖圖",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2079.md",
      "vietTitle": "Truyền Pháp Chánh Tông Định Tổ Đồ"
    },
    {
      "id": "T51n2080",
      "title": "傳法正宗論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2080.md",
      "vietTitle": "Truyền Pháp Chánh Tông Luận"
    },
    {
      "id": "T51n2081",
      "title": "兩部大法相承師資付法記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2081.md",
      "vietTitle": "Lưỡng Bộ Đại Pháp Tướng Thừa Sư Tư Phó Pháp Kí"
    },
    {
      "id": "T51n2082",
      "title": "冥報記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2082.md",
      "vietTitle": "Minh Báo Kí"
    },
    {
      "id": "T51n2083",
      "title": "釋門自鏡錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2083.md",
      "vietTitle": "Thích Môn Tự Kính Lục"
    },
    {
      "id": "T51n2084",
      "title": "三寶感應要略錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2084.md",
      "vietTitle": "Tam Bảo Cảm Ứng Yếu Lược Lục"
    },
    {
      "id": "T51n2085",
      "title": "高僧法顯傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2085.md",
      "vietTitle": "Cao Tăng Pháp Hiển Truyền"
    },
    {
      "id": "T51n2086",
      "title": "北魏僧惠生使西域記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2086.md",
      "vietTitle": "Bắc Ngụy Tăng Huệ Sinh Sứ Tây Vực Kí"
    },
    {
      "id": "T51n2087",
      "title": "大唐西域記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2087.md",
      "vietTitle": "Đại Đường Tây Vực Kí"
    },
    {
      "id": "T51n2088",
      "title": "釋迦方志",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2088.md",
      "vietTitle": "Thích Ca Phương Chí"
    },
    {
      "id": "T51n2089",
      "title": "遊方記抄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2089.md",
      "vietTitle": "Du Phương Kí Sao"
    },
    {
      "id": "T51n2090",
      "title": "釋迦牟尼如來像法滅盡之記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2090.md",
      "vietTitle": "Thích Ca Mâu Ni Như Lai Tượng Pháp Diệt Tận Chi Kí"
    },
    {
      "id": "T51n2091",
      "title": "燉煌錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2091.md",
      "vietTitle": "Đôn Hoàng Lục"
    },
    {
      "id": "T51n2092",
      "title": "洛陽伽藍記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2092.md",
      "vietTitle": "Lạc Dương Già Lam Kí"
    },
    {
      "id": "T51n2093",
      "title": "寺塔記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2093.md",
      "vietTitle": "Tự Tháp Kí"
    },
    {
      "id": "T51n2094",
      "title": "梁京寺記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2094.md",
      "vietTitle": "Lương Kinh Tự Kí"
    },
    {
      "id": "T51n2095",
      "title": "廬山記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2095.md",
      "vietTitle": "Lư Sơn Kí"
    },
    {
      "id": "T51n2096",
      "title": "天台山記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2096.md",
      "vietTitle": "Thiên Đài Sơn Kí"
    },
    {
      "id": "T51n2097",
      "title": "南嶽總勝集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2097.md",
      "vietTitle": "Nam Nhạc Tổng Thắng Tập"
    },
    {
      "id": "T51n2098",
      "title": "古清涼傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2098.md",
      "vietTitle": "Cổ Thanh Lương Truyền"
    },
    {
      "id": "T51n2099",
      "title": "廣清涼傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2099.md",
      "vietTitle": "Quảng Thanh Lương Truyền"
    },
    {
      "id": "T51n2100",
      "title": "續清涼傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2100.md",
      "vietTitle": "Tục Thanh Lương Truyền"
    },
    {
      "id": "T51n2101",
      "title": "補陀洛迦山傳",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T51n2101.md",
      "vietTitle": "Bổ Đà Lạc Ca Sơn Truyền"
    },
    {
      "id": "T52n2102",
      "title": "弘明集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2102.md",
      "vietTitle": "Hoằng Minh Tập"
    },
    {
      "id": "T52n2103",
      "title": "廣弘明集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2103.md",
      "vietTitle": "Quảng Hoằng Minh Tập"
    },
    {
      "id": "T52n2104",
      "title": "集古今佛道論衡",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2104.md",
      "vietTitle": "Tập Cổ Kim Phật Đạo Luận Hành"
    },
    {
      "id": "T52n2105",
      "title": "續集古今佛道論衡",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2105.md",
      "vietTitle": "Tục Tập Cổ Kim Phật Đạo Luận Hành"
    },
    {
      "id": "T52n2106",
      "title": "集神州三寶感通錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2106.md",
      "vietTitle": "Tập Thần Châu Tam Bảo Cảm Thông Lục"
    },
    {
      "id": "T52n2107",
      "title": "道宣律師感通錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2107.md",
      "vietTitle": "Đạo Tuyên Luật Sư Cảm Thông Lục"
    },
    {
      "id": "T52n2108",
      "title": "集沙門不應拜俗等事",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2108.md",
      "vietTitle": "Tập Sa Môn Bất Ứng Bái Tục Đẳng Sự"
    },
    {
      "id": "T52n2109",
      "title": "破邪論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2109.md",
      "vietTitle": "Phá Tà Luận"
    },
    {
      "id": "T52n2110",
      "title": "辯正論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2110.md",
      "vietTitle": "Biện Chánh Luận"
    },
    {
      "id": "T52n2111",
      "title": "十門辯惑論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2111.md",
      "vietTitle": "Thập Môn Biện Hoặc Luận"
    },
    {
      "id": "T52n2112",
      "title": "甄正論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2112.md",
      "vietTitle": "Chân Chánh Luận"
    },
    {
      "id": "T52n2113",
      "title": "北山錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2113.md",
      "vietTitle": "Bắc Sơn Lục"
    },
    {
      "id": "T52n2114",
      "title": "護法論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2114.md",
      "vietTitle": "Hộ Pháp Luận"
    },
    {
      "id": "T52n2115",
      "title": "鐔津文集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2115.md",
      "vietTitle": "Đàm Tân Văn Tập"
    },
    {
      "id": "T52n2116",
      "title": "辯偽錄",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2116.md",
      "vietTitle": "Biện Ngụy Lục"
    },
    {
      "id": "T52n2117",
      "title": "三教平心論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2117.md",
      "vietTitle": "Tam Giáo Bình Tâm Luận"
    },
    {
      "id": "T52n2118",
      "title": "折疑論",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2118.md",
      "vietTitle": "Chiết Nghi Luận"
    },
    {
      "id": "T52n2119",
      "title": "寺沙門玄奘上表記",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2119.md",
      "vietTitle": "Tự Sa Môn Huyền Trang Thượng Biểu Kí"
    },
    {
      "id": "T52n2120",
      "title": "代宗朝贈司空大辨正廣智三藏和上表制集",
      "division": "21",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/21_Su_Truyen/T52n2120.md",
      "vietTitle": "Đại Tông Triều Tặng Ty Không Đại Biện Chánh Quảng Trí Tam Tạng Hòa Thượng Biểu Chế Tập"
    },
    {
      "id": "T53n2121",
      "title": "經律異相",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T53n2121.md",
      "vietTitle": "Kinh Luật Dị Tướng"
    },
    {
      "id": "T53n2122",
      "title": "法苑珠林",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T53n2122.md",
      "vietTitle": "Pháp Uyển Châu Lâm"
    },
    {
      "id": "T54n2123",
      "title": "諸經要集",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2123.md",
      "vietTitle": "Chư Kinh Yếu Tập"
    },
    {
      "id": "T54n2124",
      "title": "法門名義集",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2124.md",
      "vietTitle": "Pháp Môn Danh Nghĩa Tập"
    },
    {
      "id": "T54n2125",
      "title": "南海寄歸內法傳",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2125.md",
      "vietTitle": "Nam Hải Ký Quy Nội Pháp Truyền"
    },
    {
      "id": "T54n2126",
      "title": "大宋僧史略",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2126.md",
      "vietTitle": "Đại Tống Tăng Sử Lược"
    },
    {
      "id": "T54n2127",
      "title": "釋氏要覽",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2127.md",
      "vietTitle": "Thích Thị Yếu Lãm"
    },
    {
      "id": "T54n2128",
      "title": "一切經音義",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2128.md",
      "vietTitle": "Nhất Thiết Kinh Âm Nghĩa"
    },
    {
      "id": "T54n2129",
      "title": "續一切經音義",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2129.md",
      "vietTitle": "Tục Nhất Thiết Kinh Âm Nghĩa"
    },
    {
      "id": "T54n2130",
      "title": "翻梵語",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2130.md",
      "vietTitle": "Phiên Phạm Ngữ"
    },
    {
      "id": "T54n2131",
      "title": "翻譯名義集",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2131.md",
      "vietTitle": "Phiên Dịch Danh Nghĩa Tập"
    },
    {
      "id": "T54n2132",
      "title": "悉曇字記",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2132.md",
      "vietTitle": "Tất Đàm Tự Kí"
    },
    {
      "id": "T54n2133A",
      "title": "梵語千字文",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2133A.md",
      "vietTitle": "Phạm Ngữ Thiên Tự Văn"
    },
    {
      "id": "T54n2133B",
      "title": "梵語千字文",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2133B.md",
      "vietTitle": "Phạm Ngữ Thiên Tự Văn"
    },
    {
      "id": "T54n2134",
      "title": "唐梵文字",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2134.md",
      "vietTitle": "Đường Phạm Văn Tự"
    },
    {
      "id": "T54n2135",
      "title": "梵語雜名",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2135.md",
      "vietTitle": "Phạm Ngữ Tạp Danh"
    },
    {
      "id": "T54n2136",
      "title": "唐梵兩語雙對集",
      "division": "22",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/22_Su_Vi/T54n2136.md",
      "vietTitle": "Đường Phạm Lưỡng Ngữ Song Đối Tập"
    },
    {
      "id": "T54n2137",
      "title": "金七十論",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2137.md",
      "vietTitle": "Kim Thất Thập Luận"
    },
    {
      "id": "T54n2138",
      "title": "勝宗十句義論",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2138.md",
      "vietTitle": "Thắng Tông Thập Cú Nghĩa Luận"
    },
    {
      "id": "T54n2139",
      "title": "老子化胡經",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2139.md",
      "vietTitle": "Kinh Lão Tử Hóa Hồ"
    },
    {
      "id": "T54n2140",
      "title": "摩尼教下部讚",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2140.md",
      "vietTitle": "Ma Ni Giáo Hạ Bộ Tán"
    },
    {
      "id": "T54n2141A",
      "title": "摩尼光佛教法儀略",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2141A.md",
      "vietTitle": "Ma Ni Quang Phật Giáo Pháp Nghi Lược"
    },
    {
      "id": "T54n2141B",
      "title": "波斯教殘經",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2141B.md",
      "vietTitle": "Kinh Ba Tư Giáo Tàn"
    },
    {
      "id": "T54n2142",
      "title": "序聽迷詩所經",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2142.md",
      "vietTitle": "Kinh Tự Thính Mê Thi Sở"
    },
    {
      "id": "T54n2143",
      "title": "景教三威蒙度讚",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2143.md",
      "vietTitle": "Cảnh Giáo Tam Uy Mông Độ Tán"
    },
    {
      "id": "T54n2144",
      "title": "大秦景教流行中國碑頌",
      "division": "23",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/23_Ngoai_Giao/T54n2144.md",
      "vietTitle": "Đại Tần Cảnh Giáo Lưu Hạnh Trung Quốc Bi Tụng"
    },
    {
      "id": "T55n2145",
      "title": "出三藏記集",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2145.md",
      "vietTitle": "Xuất Tam Tạng Kí Tập"
    },
    {
      "id": "T55n2146",
      "title": "眾經目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2146.md",
      "vietTitle": "Chúng Kinh Mục Lục"
    },
    {
      "id": "T55n2147",
      "title": "眾經目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2147.md",
      "vietTitle": "Chúng Kinh Mục Lục"
    },
    {
      "id": "T55n2148",
      "title": "眾經目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2148.md",
      "vietTitle": "Chúng Kinh Mục Lục"
    },
    {
      "id": "T55n2149",
      "title": "大唐內典錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2149.md",
      "vietTitle": "Đại Đường Nội Điển Lục"
    },
    {
      "id": "T55n2150",
      "title": "續大唐內典錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2150.md",
      "vietTitle": "Tục Đại Đường Nội Điển Lục"
    },
    {
      "id": "T55n2151",
      "title": "古今譯經圖紀",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2151.md",
      "vietTitle": "Cổ Kim Dịch Kinh Đồ Kỉ"
    },
    {
      "id": "T55n2152",
      "title": "續古今譯經圖紀",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2152.md",
      "vietTitle": "Tục Cổ Kim Dịch Kinh Đồ Kỉ"
    },
    {
      "id": "T55n2153",
      "title": "大周刊定眾經目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2153.md",
      "vietTitle": "Đại Chu San Định Chúng Kinh Mục Lục"
    },
    {
      "id": "T55n2154",
      "title": "開元釋教錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2154.md",
      "vietTitle": "Khai Nguyên Thích Giáo Lục"
    },
    {
      "id": "T55n2155",
      "title": "開元釋教錄略出",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2155.md",
      "vietTitle": "Khai Nguyên Thích Giáo Lục Lược Xuất"
    },
    {
      "id": "T55n2156",
      "title": "大唐貞元續開元釋教錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2156.md",
      "vietTitle": "Đại Đường Trinh Nguyên Tục Khai Nguyên Thích Giáo Lục"
    },
    {
      "id": "T55n2157",
      "title": "貞元新定釋教目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2157.md",
      "vietTitle": "Trinh Nguyên Tân Định Thích Giáo Mục Lục"
    },
    {
      "id": "T55n2158",
      "title": "續貞元釋教錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2158.md",
      "vietTitle": "Tục Trinh Nguyên Thích Giáo Lục"
    },
    {
      "id": "T55n2159",
      "title": "傳教大師將來台州錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2159.md",
      "vietTitle": "Truyền Giáo Đại Sư Tương Lai Đài Châu Lục"
    },
    {
      "id": "T55n2160",
      "title": "傳教大師將來越州錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2160.md",
      "vietTitle": "Truyền Giáo Đại Sư Tương Lai Việt Châu Lục"
    },
    {
      "id": "T55n2161",
      "title": "御請來目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2161.md",
      "vietTitle": "Ngự Thỉnh Lai Mục Lục"
    },
    {
      "id": "T55n2162",
      "title": "根本大和尚真跡策子等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2162.md",
      "vietTitle": "Căn Bản Đại Hòa Thượng Chân Tích Sách Tử Đẳng Mục Lục"
    },
    {
      "id": "T55n2163",
      "title": "常曉和尚請來目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2163.md",
      "vietTitle": "Thường Hiểu Hòa Thượng Thỉnh Lai Mục Lục"
    },
    {
      "id": "T55n2164",
      "title": "靈巖寺和尚請來法門道具等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2164.md",
      "vietTitle": "Linh Nham Tự Hòa Thượng Thỉnh Lai Pháp Môn Đạo Cụ Đẳng Mục Lục"
    },
    {
      "id": "T55n2165",
      "title": "日本國承和五年入唐求法目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2165.md",
      "vietTitle": "Nhật Bản Quốc Thừa Hòa Ngũ Niên Nhập Đường Cầu Pháp Mục Lục"
    },
    {
      "id": "T55n2166",
      "title": "慈覺大師在唐送進錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2166.md",
      "vietTitle": "Từ Giác Đại Sư Tại Đường Tống Tiến Lục"
    },
    {
      "id": "T55n2167",
      "title": "入唐新求聖教目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2167.md",
      "vietTitle": "Nhập Đường Tân Cầu Thánh Giáo Mục Lục"
    },
    {
      "id": "T55n2168A",
      "title": "惠運禪師將來教法目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2168A.md",
      "vietTitle": "Huệ Vận Thiền Sư Tương Lai Giáo Pháp Mục Lục"
    },
    {
      "id": "T55n2168B",
      "title": "惠運律師書目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2168B.md",
      "vietTitle": "Huệ Vận Luật Sư Thư Mục Lục"
    },
    {
      "id": "T55n2169",
      "title": "開元寺求得經疏記等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2169.md",
      "vietTitle": "Khai Nguyên Tự Cầu Đắc Kinh Sớ Kí Đẳng Mục Lục"
    },
    {
      "id": "T55n2170",
      "title": "福州溫州台州求得經律論疏記外書等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2170.md",
      "vietTitle": "Phước Châu Ôn Châu Đài Châu Cầu Đắc Kinh Luật Luận Sớ Kí Ngoại Thư Đẳng Mục Lục"
    },
    {
      "id": "T55n2171",
      "title": "青龍寺求法目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2171.md",
      "vietTitle": "Thanh Long Tự Cầu Pháp Mục Lục"
    },
    {
      "id": "T55n2172",
      "title": "日本比丘圓珍入唐求法目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2172.md",
      "vietTitle": "Nhật Bản Tỳ Kheo Viên Trân Nhập Đường Cầu Pháp Mục Lục"
    },
    {
      "id": "T55n2173",
      "title": "智證大師請來目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2173.md",
      "vietTitle": "Trí Chứng Đại Sư Thỉnh Lai Mục Lục"
    },
    {
      "id": "T55n2174A",
      "title": "新書寫請來法門等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2174A.md",
      "vietTitle": "Tân Thư Tả Thỉnh Lai Pháp Môn Đẳng Mục Lục"
    },
    {
      "id": "T55n2174B",
      "title": "禪林寺宗叡僧正目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2174B.md",
      "vietTitle": "Thiền Lâm Tự Tông Duệ Tăng Chánh Mục Lục"
    },
    {
      "id": "T55n2175",
      "title": "錄外經等目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2175.md",
      "vietTitle": "Lục Ngoại Kinh Đẳng Mục Lục"
    },
    {
      "id": "T55n2176",
      "title": "諸阿闍梨真言密教部類總錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2176.md",
      "vietTitle": "Chư A Đồ Lê Chân Ngôn Mật Giáo Bộ Loại Tổng Lục"
    },
    {
      "id": "T55n2177",
      "title": "華嚴宗章疏并因明錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2177.md",
      "vietTitle": "Hoa Nghiêm Tông Chương Sớ Tịnh Nhân Minh Lục"
    },
    {
      "id": "T55n2178",
      "title": "天台宗章疏",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2178.md",
      "vietTitle": "Thiên Đài Tông Chương Sớ"
    },
    {
      "id": "T55n2179",
      "title": "三論宗章疏",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2179.md",
      "vietTitle": "Tam Luận Tông Chương Sớ"
    },
    {
      "id": "T55n2180",
      "title": "法相宗章疏",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2180.md",
      "vietTitle": "Pháp Tướng Tông Chương Sớ"
    },
    {
      "id": "T55n2181",
      "title": "注進法相宗章疏",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2181.md",
      "vietTitle": "Chú Tiến Pháp Tướng Tông Chương Sớ"
    },
    {
      "id": "T55n2182",
      "title": "律宗章疏",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2182.md",
      "vietTitle": "Luật Tông Chương Sớ"
    },
    {
      "id": "T55n2183",
      "title": "東域傳燈目錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2183.md",
      "vietTitle": "Đông Vực Truyền Đăng Mục Lục"
    },
    {
      "id": "T55n2184",
      "title": "新編諸宗教藏總錄",
      "division": "24",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/24_Muc_Luc/T55n2184.md",
      "vietTitle": "Tân Biên Chư Tông Giáo Tạng Tổng Lục"
    },
    {
      "id": "T85n2732",
      "title": "梁朝傅大士頌金剛經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2732.md",
      "vietTitle": "Kinh Lương Triều Phó Đại Sĩ Tụng Kim Cương"
    },
    {
      "id": "T85n2733",
      "title": "御注金剛般若波羅蜜經宣演",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2733.md",
      "vietTitle": "Ngự Chú Kim Cương Bát Nhã Ba La Mật Kinh Tuyên Diễn"
    },
    {
      "id": "T85n2734",
      "title": "金剛暎卷上",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2734.md",
      "vietTitle": "Kim Cương Ánh Quyển Thượng"
    },
    {
      "id": "T85n2735",
      "title": "金剛般若經旨贊",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2735.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Chỉ Tán"
    },
    {
      "id": "T85n2736",
      "title": "金剛般若經依天親菩薩論贊略釋秦本義記卷上",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2736.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Y Thiên Thân Bồ Tát Luận Tán Lược Thích Tần Bản Nghĩa Kí Quyển Thượng"
    },
    {
      "id": "T85n2737",
      "title": "金剛經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2737.md",
      "vietTitle": "Kim Cương Kinh Sớ"
    },
    {
      "id": "T85n2738",
      "title": "金剛經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2738.md",
      "vietTitle": "Kim Cương Kinh Sớ"
    },
    {
      "id": "T85n2739",
      "title": "金剛般若經挾註",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2739.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Hiệp Chú"
    },
    {
      "id": "T85n2740",
      "title": "金剛般若義記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2740.md",
      "vietTitle": "Kim Cương Bát Nhã Nghĩa Kí"
    },
    {
      "id": "T85n2741",
      "title": "金剛般若經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2741.md",
      "vietTitle": "Kim Cương Bát Nhã Kinh Sớ"
    },
    {
      "id": "T85n2742",
      "title": "金剛般若波羅蜜經傳外傳卷下",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2742.md",
      "vietTitle": "Kim Cương Bát Nhã Ba La Mật Kinh Truyền Ngoại Truyền Quyển Hạ"
    },
    {
      "id": "T85n2743",
      "title": "持誦金剛經靈驗功德記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2743.md",
      "vietTitle": "Trì Tụng Kim Cương Kinh Linh Nghiệm Công Đức Kí"
    },
    {
      "id": "T85n2744",
      "title": "仁王般若實相論卷第二",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2744.md",
      "vietTitle": "Nhân Vương Bát Nhã Thật Tướng Luận Quyển Đệ Nhị"
    },
    {
      "id": "T85n2745",
      "title": "仁王經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2745.md",
      "vietTitle": "Nhân Vương Kinh Sớ"
    },
    {
      "id": "T85n2746",
      "title": "般若波羅蜜多心經還源述",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2746.md",
      "vietTitle": "Bát Nhã Ba La Mật Đa Tâm Kinh Hoàn Nguyên Thuật"
    },
    {
      "id": "T85n2747",
      "title": "挾註波羅蜜多心經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2747.md",
      "vietTitle": "Kinh Hiệp Chú Ba La Mật Đa Tâm"
    },
    {
      "id": "T85n2748",
      "title": "法華義記卷第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2748.md",
      "vietTitle": "Pháp Hoa Nghĩa Kí Quyển Đệ Tam"
    },
    {
      "id": "T85n2749",
      "title": "法華經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2749.md",
      "vietTitle": "Pháp Hoa Kinh Sớ"
    },
    {
      "id": "T85n2750",
      "title": "法華經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2750.md",
      "vietTitle": "Pháp Hoa Kinh Sớ"
    },
    {
      "id": "T85n2751",
      "title": "法華經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2751.md",
      "vietTitle": "Pháp Hoa Kinh Sớ"
    },
    {
      "id": "T85n2752",
      "title": "法華問答",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2752.md",
      "vietTitle": "Pháp Hoa Vấn Đáp"
    },
    {
      "id": "T85n2753",
      "title": "華嚴經章",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2753.md",
      "vietTitle": "Hoa Nghiêm Kinh Chương"
    },
    {
      "id": "T85n2754",
      "title": "華嚴略疏卷第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2754.md",
      "vietTitle": "Hoa Nghiêm Lược Sớ Quyển Đệ Tam"
    },
    {
      "id": "T85n2755",
      "title": "華嚴經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2755.md",
      "vietTitle": "Hoa Nghiêm Kinh Sớ"
    },
    {
      "id": "T85n2756",
      "title": "華嚴經義記卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2756.md",
      "vietTitle": "Hoa Nghiêm Kinh Nghĩa Kí Quyển Đệ Nhất"
    },
    {
      "id": "T85n2757",
      "title": "華嚴經疏卷第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2757.md",
      "vietTitle": "Hoa Nghiêm Kinh Sớ Quyển Đệ Tam"
    },
    {
      "id": "T85n2758",
      "title": "十地義記卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2758.md",
      "vietTitle": "Thập Địa Nghĩa Kí Quyển Đệ Nhất"
    },
    {
      "id": "T85n2759",
      "title": "無量壽經義記卷下",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2759.md",
      "vietTitle": "Vô Lượng Thọ Kinh Nghĩa Kí Quyển Hạ"
    },
    {
      "id": "T85n2760",
      "title": "無量壽觀經義記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2760.md",
      "vietTitle": "Vô Lượng Thọ Quan Kinh Nghĩa Kí"
    },
    {
      "id": "T85n2761",
      "title": "勝鬘經記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2761.md",
      "vietTitle": "Thắng Man Kinh Kí"
    },
    {
      "id": "T85n2762",
      "title": "勝鬘經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2762.md",
      "vietTitle": "Thắng Man Kinh Sớ"
    },
    {
      "id": "T85n2763",
      "title": "挾注勝鬘經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2763.md",
      "vietTitle": "Kinh Hiệp Chú Thắng Man"
    },
    {
      "id": "T85n2764A",
      "title": "涅槃經義記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2764A.md",
      "vietTitle": "Niết Bàn Kinh Nghĩa Kí"
    },
    {
      "id": "T85n2764B",
      "title": "大涅槃經義記卷第四",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2764B.md",
      "vietTitle": "Đại Niết Bàn Kinh Nghĩa Kí Quyển Đệ Tứ"
    },
    {
      "id": "T85n2765",
      "title": "涅槃經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2765.md",
      "vietTitle": "Niết Bàn Kinh Sớ"
    },
    {
      "id": "T85n2766",
      "title": "藥師經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2766.md",
      "vietTitle": "Dược Sư Kinh Sớ"
    },
    {
      "id": "T85n2767",
      "title": "藥師經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2767.md",
      "vietTitle": "Dược Sư Kinh Sớ"
    },
    {
      "id": "T85n2768",
      "title": "維摩義記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2768.md",
      "vietTitle": "Duy Ma Nghĩa Kí"
    },
    {
      "id": "T85n2769",
      "title": "維摩經義記卷第四",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2769.md",
      "vietTitle": "Duy Ma Kinh Nghĩa Kí Quyển Đệ Tứ"
    },
    {
      "id": "T85n2770",
      "title": "維摩經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2770.md",
      "vietTitle": "Duy Ma Kinh Sớ"
    },
    {
      "id": "T85n2771",
      "title": "維摩經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2771.md",
      "vietTitle": "Duy Ma Kinh Sớ"
    },
    {
      "id": "T85n2772",
      "title": "維摩經疏卷第三．第六",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2772.md",
      "vietTitle": "Duy Ma Kinh Sớ Quyển Đệ Tam ． Đệ Lục"
    },
    {
      "id": "T85n2773",
      "title": "維摩經抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2773.md",
      "vietTitle": "Duy Ma Kinh Sao"
    },
    {
      "id": "T85n2774",
      "title": "維摩經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2774.md",
      "vietTitle": "Duy Ma Kinh Sớ"
    },
    {
      "id": "T85n2775",
      "title": "維摩疏釋前小序抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2775.md",
      "vietTitle": "Duy Ma Sớ Thích Tiền Tiểu Tự Sao"
    },
    {
      "id": "T85n2776",
      "title": "釋肇序",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2776.md",
      "vietTitle": "Thích Triệu Tự"
    },
    {
      "id": "T85n2777",
      "title": "淨名經集解關中疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2777.md",
      "vietTitle": "Tịnh Danh Kinh Tập Giải Quan Trung Sớ"
    },
    {
      "id": "T85n2778",
      "title": "淨名經關中釋抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2778.md",
      "vietTitle": "Tịnh Danh Kinh Quan Trung Thích Sao"
    },
    {
      "id": "T85n2779",
      "title": "佛說楞伽經禪門悉談章",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2779.md",
      "vietTitle": "Phật Thuyết Lăng Già Kinh Thiền Môn Tất Đàm Chương"
    },
    {
      "id": "T85n2780",
      "title": "溫室經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2780.md",
      "vietTitle": "Ôn Thất Kinh Sớ"
    },
    {
      "id": "T85n2781",
      "title": "盂蘭盆經讚述",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2781.md",
      "vietTitle": "Vu Lan Bồn Kinh Tán Thuật"
    },
    {
      "id": "T85n2782",
      "title": "大乘稻芉經隨聽疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2782.md",
      "vietTitle": "Đại Thừa Đạo Canh Kinh Tùy Thính Sớ"
    },
    {
      "id": "T85n2783",
      "title": "大乘稻芉經隨聽疏決",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2783.md",
      "vietTitle": "Đại Thừa Đạo Canh Kinh Tùy Thính Sớ Quyết"
    },
    {
      "id": "T85n2784",
      "title": "大乘四法經釋抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2784.md",
      "vietTitle": "Đại Thừa Tứ Pháp Kinh Thích Sao"
    },
    {
      "id": "T85n2785",
      "title": "大乘四法經論廣釋開決記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2785.md",
      "vietTitle": "Đại Thừa Tứ Pháp Kinh Luận Quảng Thích Khai Quyết Kí"
    },
    {
      "id": "T85n2786",
      "title": "天請問經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2786.md",
      "vietTitle": "Thiên Thỉnh Vấn Kinh Sớ"
    },
    {
      "id": "T85n2787",
      "title": "四分戒本疏卷第一．第二．第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2787.md",
      "vietTitle": "Tứ Phân Giới Bản Sớ Quyển Đệ Nhất ． Đệ Nhị ． Đệ Tam"
    },
    {
      "id": "T85n2788",
      "title": "律戒本疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2788.md",
      "vietTitle": "Luật Giới Bản Sớ"
    },
    {
      "id": "T85n2789",
      "title": "律戒本疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2789.md",
      "vietTitle": "Luật Giới Bản Sớ"
    },
    {
      "id": "T85n2790",
      "title": "律雜抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2790.md",
      "vietTitle": "Luật Tạp Sao"
    },
    {
      "id": "T85n2791",
      "title": "宗四分比丘隨門要略行儀",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2791.md",
      "vietTitle": "Tông Tứ Phân Tỳ Kheo Tùy Môn Yếu Lược Hạnh Nghi"
    },
    {
      "id": "T85n2792",
      "title": "毘尼心",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2792.md",
      "vietTitle": "Tỳ Ni Tâm"
    },
    {
      "id": "T85n2793",
      "title": "三部律抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2793.md",
      "vietTitle": "Tam Bộ Luật Sao"
    },
    {
      "id": "T85n2794",
      "title": "律抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2794.md",
      "vietTitle": "Luật Sao"
    },
    {
      "id": "T85n2795",
      "title": "四部律并論要用抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2795.md",
      "vietTitle": "Tứ Bộ Luật Tịnh Luận Yếu Dụng Sao"
    },
    {
      "id": "T85n2796",
      "title": "律抄第三卷手決",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2796.md",
      "vietTitle": "Luật Sao Đệ Tam Quyển Thủ Quyết"
    },
    {
      "id": "T85n2797",
      "title": "梵網經述記卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2797.md",
      "vietTitle": "Phạm Võng Kinh Thuật Kí Quyển Đệ Nhất"
    },
    {
      "id": "T85n2798",
      "title": "本業瓔珞經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2798.md",
      "vietTitle": "Bản Nghiệp Anh Lạc Kinh Sớ"
    },
    {
      "id": "T85n2799",
      "title": "十地論義疏卷第一．第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2799.md",
      "vietTitle": "Thập Địa Luận Nghĩa Sớ Quyển Đệ Nhất ． Đệ Tam"
    },
    {
      "id": "T85n2800",
      "title": "廣百論疏卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2800.md",
      "vietTitle": "Quảng Bách Luận Sớ Quyển Đệ Nhất"
    },
    {
      "id": "T85n2801",
      "title": "瑜伽師地論分門記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2801.md",
      "vietTitle": "Du Già Sư Địa Luận Phân Môn Kí"
    },
    {
      "id": "T85n2802",
      "title": "瑜伽論手記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2802.md",
      "vietTitle": "Du Già Luận Thủ Kí"
    },
    {
      "id": "T85n2803",
      "title": "地持義記卷第四",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2803.md",
      "vietTitle": "Địa Trì Nghĩa Kí Quyển Đệ Tứ"
    },
    {
      "id": "T85n2804",
      "title": "唯識三十論要釋",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2804.md",
      "vietTitle": "Duy Thức Tam Thập Luận Yếu Thích"
    },
    {
      "id": "T85n2805",
      "title": "攝大乘講疏卷第五．第七",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2805.md",
      "vietTitle": "Nhiếp Đại Thừa Giảng Sớ Quyển Đệ Ngũ ． Đệ Thất"
    },
    {
      "id": "T85n2806",
      "title": "攝大乘論抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2806.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Sao"
    },
    {
      "id": "T85n2807",
      "title": "攝大乘論章卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2807.md",
      "vietTitle": "Nhiếp Đại Thừa Luận Chương Quyển Đệ Nhất"
    },
    {
      "id": "T85n2808",
      "title": "攝論章卷第一",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2808.md",
      "vietTitle": "Nhiếp Luận Chương Quyển Đệ Nhất"
    },
    {
      "id": "T85n2809",
      "title": "攝大乘義章卷第四",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2809.md",
      "vietTitle": "Nhiếp Đại Thừa Nghĩa Chương Quyển Đệ Tứ"
    },
    {
      "id": "T85n2810",
      "title": "大乘百法明門論開宗義記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2810.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận Khai Tông Nghĩa Kí"
    },
    {
      "id": "T85n2811",
      "title": "大乘百法明門論開宗義記序釋",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2811.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận Khai Tông Nghĩa Kí Tự Thích"
    },
    {
      "id": "T85n2812",
      "title": "大乘百法明門論開宗義決",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2812.md",
      "vietTitle": "Đại Thừa Bách Pháp Minh Môn Luận Khai Tông Nghĩa Quyết"
    },
    {
      "id": "T85n2813",
      "title": "大乘起信論略述",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2813.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Lược Thuật"
    },
    {
      "id": "T85n2814",
      "title": "大乘起信論廣釋卷第三．四．五",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2814.md",
      "vietTitle": "Đại Thừa Khởi Tín Luận Quảng Thích Quyển Đệ Tam ． Tứ ． Ngũ"
    },
    {
      "id": "T85n2815",
      "title": "起信論註",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2815.md",
      "vietTitle": "Khởi Tín Luận Chú"
    },
    {
      "id": "T85n2816",
      "title": "因緣心釋論開決記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2816.md",
      "vietTitle": "Nhân Duyên Tâm Thích Luận Khai Quyết Kí"
    },
    {
      "id": "T85n2817",
      "title": "大乘經纂要義",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2817.md",
      "vietTitle": "Đại Thừa Kinh Toản Yếu Nghĩa"
    },
    {
      "id": "T85n2818",
      "title": "大乘二十二問本",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2818.md",
      "vietTitle": "Đại Thừa Nhị Thập Nhị Vấn Bản"
    },
    {
      "id": "T85n2819",
      "title": "諸經要抄",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2819.md",
      "vietTitle": "Chư Kinh Yếu Sao"
    },
    {
      "id": "T85n2820",
      "title": "菩薩藏修道眾經抄卷第十二",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2820.md",
      "vietTitle": "Bồ Tát Tạng Tu Đạo Chúng Kinh Sao Quyển Đệ Thập Nhị"
    },
    {
      "id": "T85n2821",
      "title": "諸經要略文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2821.md",
      "vietTitle": "Chư Kinh Yếu Lược Văn"
    },
    {
      "id": "T85n2822",
      "title": "大乘要語",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2822.md",
      "vietTitle": "Đại Thừa Yếu Ngữ"
    },
    {
      "id": "T85n2823",
      "title": "大乘入道次第開決",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2823.md",
      "vietTitle": "Đại Thừa Nhập Đạo Thứ Đệ Khai Quyết"
    },
    {
      "id": "T85n2824",
      "title": "天台分門圖",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2824.md",
      "vietTitle": "Thiên Đài Phân Môn Đồ"
    },
    {
      "id": "T85n2825",
      "title": "真言要決卷第一．第三",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2825.md",
      "vietTitle": "Chân Ngôn Yếu Quyết Quyển Đệ Nhất ． Đệ Tam"
    },
    {
      "id": "T85n2826",
      "title": "略諸經論念佛法門往生淨土集卷上",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2826.md",
      "vietTitle": "Lược Chư Kinh Luận Niệm Phật Pháp Môn Vãng Sinh Tịnh Thổ Tập Quyển Thượng"
    },
    {
      "id": "T85n2827",
      "title": "淨土五會念佛誦經觀行儀卷中．下",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2827.md",
      "vietTitle": "Tịnh Thổ Ngũ Hội Niệm Phật Tụng Kinh Quan Hạnh Nghi Quyển Trung ． Hạ"
    },
    {
      "id": "T85n2828",
      "title": "大乘淨土讚",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2828.md",
      "vietTitle": "Đại Thừa Tịnh Thổ Tán"
    },
    {
      "id": "T85n2829",
      "title": "持齋念佛懺悔禮文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2829.md",
      "vietTitle": "Trì Trai Niệm Phật Sám Hối Lễ Văn"
    },
    {
      "id": "T85n2830A",
      "title": "道安法師念佛讚",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2830A.md",
      "vietTitle": "Đạo An Pháp Sư Niệm Phật Tán"
    },
    {
      "id": "T85n2830B",
      "title": "道安法師念佛讚文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2830B.md",
      "vietTitle": "Đạo An Pháp Sư Niệm Phật Tán Văn"
    },
    {
      "id": "T85n2831",
      "title": "無心論",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2831.md",
      "vietTitle": "Vô Tâm Luận"
    },
    {
      "id": "T85n2832",
      "title": "南天竺國菩提達摩禪師觀門",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2832.md",
      "vietTitle": "Nam Thiên Trúc Quốc Bồ Đề Đạt Ma Thiền Sư Quan Môn"
    },
    {
      "id": "T85n2833",
      "title": "觀心論",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2833.md",
      "vietTitle": "Quan Tâm Luận"
    },
    {
      "id": "T85n2834",
      "title": "大乘無生方便門",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2834.md",
      "vietTitle": "Đại Thừa Vô Sinh Phương Tiện Môn"
    },
    {
      "id": "T85n2835",
      "title": "大乘開心顯性頓悟真宗論",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2835.md",
      "vietTitle": "Đại Thừa Khai Tâm Hiển Tính Đốn Ngộ Chân Tông Luận"
    },
    {
      "id": "T85n2836",
      "title": "大乘北宗論",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2836.md",
      "vietTitle": "Đại Thừa Bắc Tông Luận"
    },
    {
      "id": "T85n2837",
      "title": "楞伽師資記",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2837.md",
      "vietTitle": "Lăng Già Sư Tư Kí"
    },
    {
      "id": "T85n2838",
      "title": "傳法寶紀",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2838.md",
      "vietTitle": "Truyền Pháp Bảo Kỉ"
    },
    {
      "id": "T85n2839",
      "title": "讚禪門詩",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2839.md",
      "vietTitle": "Tán Thiền Môn Thi"
    },
    {
      "id": "T85n2840",
      "title": "三界圖",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2840.md",
      "vietTitle": "Tam Giới Đồ"
    },
    {
      "id": "T85n2841",
      "title": "大佛略懺",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2841.md",
      "vietTitle": "Đại Phật Lược Sám"
    },
    {
      "id": "T85n2842",
      "title": "印沙佛文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2842.md",
      "vietTitle": "Ấn Sa Phật Văn"
    },
    {
      "id": "T85n2843",
      "title": "大悲啟請",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2843.md",
      "vietTitle": "Đại Bi Khải Thỉnh"
    },
    {
      "id": "T85n2844",
      "title": "文殊師利菩薩無相十禮",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2844.md",
      "vietTitle": "Văn Thù Sư Lợi Bồ Tát Vô Tướng Thập Lễ"
    },
    {
      "id": "T85n2845",
      "title": "押座文類",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2845.md",
      "vietTitle": "Áp Tòa Văn Loại"
    },
    {
      "id": "T85n2846",
      "title": "祈願文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2846.md",
      "vietTitle": "Kỳ Nguyện Văn"
    },
    {
      "id": "T85n2847",
      "title": "祈願文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2847.md",
      "vietTitle": "Kỳ Nguyện Văn"
    },
    {
      "id": "T85n2848",
      "title": "迴向文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2848.md",
      "vietTitle": "Hồi Hướng Văn"
    },
    {
      "id": "T85n2849",
      "title": "大乘四齋日",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2849.md",
      "vietTitle": "Đại Thừa Tứ Trai Nhật"
    },
    {
      "id": "T85n2850",
      "title": "地藏菩薩十齋日",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2850.md",
      "vietTitle": "Địa Tạng Bồ Tát Thập Trai Nhật"
    },
    {
      "id": "T85n2851",
      "title": "和菩薩戒文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2851.md",
      "vietTitle": "Hòa Bồ Tát Giới Văn"
    },
    {
      "id": "T85n2852",
      "title": "入布薩堂說偈文等",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2852.md",
      "vietTitle": "Nhập Bố Tát Đường Thuyết Kệ Văn Đẳng"
    },
    {
      "id": "T85n2853",
      "title": "布薩文等",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2853.md",
      "vietTitle": "Bố Tát Văn Đẳng"
    },
    {
      "id": "T85n2854",
      "title": "禮懺文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2854.md",
      "vietTitle": "Lễ Sám Văn"
    },
    {
      "id": "T85n2855",
      "title": "禮懺文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2855.md",
      "vietTitle": "Lễ Sám Văn"
    },
    {
      "id": "T85n2856",
      "title": "禮懺文",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2856.md",
      "vietTitle": "Lễ Sám Văn"
    },
    {
      "id": "T85n2857",
      "title": "索法號義",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2857.md",
      "vietTitle": "Sách Pháp Hào Nghĩa"
    },
    {
      "id": "T85n2858",
      "title": "大目乾連冥間救母變文并圖",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2858.md",
      "vietTitle": "Đại Mục Càn Liên Minh Gian Cứu Mẫu Biến Văn Tịnh Đồ"
    },
    {
      "id": "T85n2859",
      "title": "惠遠外傳",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2859.md",
      "vietTitle": "Huệ Viễn Ngoại Truyền"
    },
    {
      "id": "T85n2860",
      "title": "府君存惠傳",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2860.md",
      "vietTitle": "Phủ Quân Tồn Huệ Truyền"
    },
    {
      "id": "T85n2861",
      "title": "泉州千佛新著諸祖師頌",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2861.md",
      "vietTitle": "Tuyền Châu Thiên Phật Tân Trước Chư Tổ Sư Tụng"
    },
    {
      "id": "T85n2862",
      "title": "大蕃沙洲釋門教法和尚洪",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2862.md",
      "vietTitle": "Đại Phồn Sa Châu Thích Môn Giáo Pháp Hòa Thượng Hồng"
    },
    {
      "id": "T85n2863",
      "title": "王梵志詩集",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2863.md",
      "vietTitle": "Vương Phạm Chí Thi Tập"
    },
    {
      "id": "T85n2864",
      "title": "進旨",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2864.md",
      "vietTitle": "Tiến Chỉ"
    },
    {
      "id": "T85n2865",
      "title": "護身命經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2865.md",
      "vietTitle": "Kinh Hộ Thân Mạng"
    },
    {
      "id": "T85n2866",
      "title": "護身命經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2866.md",
      "vietTitle": "Kinh Hộ Thân Mạng"
    },
    {
      "id": "T85n2867",
      "title": "慈仁問八十種好經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2867.md",
      "vietTitle": "Kinh Từ Nhân Vấn Bát Thập Chủng Hảo"
    },
    {
      "id": "T85n2868",
      "title": "決罪福經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2868.md",
      "vietTitle": "Kinh Quyết Tội Phước"
    },
    {
      "id": "T85n2869",
      "title": "妙好寶車經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2869.md",
      "vietTitle": "Kinh Diệu Hảo Bảo Xa"
    },
    {
      "id": "T85n2870",
      "title": "像法決疑經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2870.md",
      "vietTitle": "Kinh Tượng Pháp Quyết Nghi"
    },
    {
      "id": "T85n2871",
      "title": "大通方廣懺悔滅罪莊嚴成佛經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2871.md",
      "vietTitle": "Kinh Đại Thông Phương Quảng Sám Hối Diệt Tội Trang Nghiêm Thành Phật"
    },
    {
      "id": "T85n2872",
      "title": "妙法蓮華經度量天地品第二十九",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2872.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Độ Lượng Thiên Địa Phẩm Đệ Nhị Thập Cửu"
    },
    {
      "id": "T85n2873",
      "title": "首羅比丘經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2873.md",
      "vietTitle": "Kinh Thủ La Tỳ Kheo"
    },
    {
      "id": "T85n2874",
      "title": "小法滅盡經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2874.md",
      "vietTitle": "Kinh Tiểu Pháp Diệt Tận"
    },
    {
      "id": "T85n2875",
      "title": "大方廣華嚴十惡品經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2875.md",
      "vietTitle": "Kinh Đại Phương Quảng Hoa Nghiêm Thập Ác Phẩm"
    },
    {
      "id": "T85n2876",
      "title": "天公經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2876.md",
      "vietTitle": "Kinh Thiên Công"
    },
    {
      "id": "T85n2877",
      "title": "如來在金棺囑累清淨莊嚴敬福經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2877.md",
      "vietTitle": "Kinh Như Lai Tại Kim Quan Chúc Luy Thanh Tịnh Trang Nghiêm Kính Phước"
    },
    {
      "id": "T85n2878",
      "title": "救疾經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2878.md",
      "vietTitle": "Kinh Cứu Tật"
    },
    {
      "id": "T85n2879",
      "title": "普賢菩薩說證明經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2879.md",
      "vietTitle": "Kinh Phổ Hiền Bồ Tát Thuyết Chứng Minh"
    },
    {
      "id": "T85n2880",
      "title": "究竟大悲經卷第二．三．四",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2880.md",
      "vietTitle": "Cứu Cánh Đại Bi Kinh Quyển Đệ Nhị ． Tam ． Tứ"
    },
    {
      "id": "T85n2881",
      "title": "善惡因果經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2881.md",
      "vietTitle": "Kinh Thiện Ác Nhân Quả"
    },
    {
      "id": "T85n2882",
      "title": "呪魅經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2882.md",
      "vietTitle": "Kinh Chú Mị"
    },
    {
      "id": "T85n2883",
      "title": "法王經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2883.md",
      "vietTitle": "Kinh Pháp Vương"
    },
    {
      "id": "T85n2884",
      "title": "大威儀請問",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2884.md",
      "vietTitle": "Đại Uy Nghi Thỉnh Vấn"
    },
    {
      "id": "T85n2885",
      "title": "佛性海藏智慧解脫破心相經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2885.md",
      "vietTitle": "Kinh Phật Tính Hải Tạng Trí Tuệ Giải Thoát Phá Tâm Tướng"
    },
    {
      "id": "T85n2886",
      "title": "佛為心王菩薩說投陀經卷上",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2886.md",
      "vietTitle": "Phật Vi Tâm Vương Bồ Tát Thuyết Đầu Đà Kinh Quyển Thượng"
    },
    {
      "id": "T85n2887",
      "title": "父母恩重經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2887.md",
      "vietTitle": "Kinh Phụ Mẫu Ân Trọng"
    },
    {
      "id": "T85n2888",
      "title": "延壽命經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2888.md",
      "vietTitle": "Kinh Diên Thọ Mạng"
    },
    {
      "id": "T85n2889",
      "title": "續命經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2889.md",
      "vietTitle": "Kinh Tục Mạng"
    },
    {
      "id": "T85n2890",
      "title": "如來成道經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2890.md",
      "vietTitle": "Kinh Như Lai Thành Đạo"
    },
    {
      "id": "T85n2891",
      "title": "山海慧菩薩經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2891.md",
      "vietTitle": "Kinh Sơn Hải Tuệ Bồ Tát"
    },
    {
      "id": "T85n2892",
      "title": "現報當受經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2892.md",
      "vietTitle": "Kinh Hiện Báo Đương Thọ"
    },
    {
      "id": "T85n2893",
      "title": "大辯邪正經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2893.md",
      "vietTitle": "Kinh Đại Biện Tà Chánh"
    },
    {
      "id": "T85n2894",
      "title": "三廚經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2894.md",
      "vietTitle": "Kinh Tam Trù"
    },
    {
      "id": "T85n2895",
      "title": "要行捨身經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2895.md",
      "vietTitle": "Kinh Yếu Hạnh Xá Thân"
    },
    {
      "id": "T85n2896",
      "title": "示所犯者瑜伽法鏡經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2896.md",
      "vietTitle": "Kinh Thị Sở Phạm Giả Du Già Pháp Kính"
    },
    {
      "id": "T85n2897",
      "title": "天地八陽神呪經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2897.md",
      "vietTitle": "Kinh Thiên Địa Bát Dương Thần Chú"
    },
    {
      "id": "T85n2898",
      "title": "高王觀世音經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2898.md",
      "vietTitle": "Kinh Cao Vương Quan Thế Âm"
    },
    {
      "id": "T85n2899",
      "title": "妙法蓮華經馬明菩薩品第三十",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2899.md",
      "vietTitle": "Diệu Pháp Liên Hoa Kinh Mã Minh Bồ Tát Phẩm Đệ Tam Thập"
    },
    {
      "id": "T85n2900",
      "title": "齋法清淨經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2900.md",
      "vietTitle": "Kinh Trai Pháp Thanh Tịnh"
    },
    {
      "id": "T85n2901",
      "title": "法句經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2901.md",
      "vietTitle": "Kinh Pháp Cú"
    },
    {
      "id": "T85n2902",
      "title": "法句經疏",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2902.md",
      "vietTitle": "Pháp Cú Kinh Sớ"
    },
    {
      "id": "T85n2903",
      "title": "無量大慈教經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2903.md",
      "vietTitle": "Kinh Vô Lượng Đại Từ Giáo"
    },
    {
      "id": "T85n2904",
      "title": "七千佛神符經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2904.md",
      "vietTitle": "Kinh Thất Thiên Phật Thần Phù"
    },
    {
      "id": "T85n2905",
      "title": "現在十方千五百佛名並雜佛同號",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2905.md",
      "vietTitle": "Hiện Tại Thập Phương Thiên Ngũ Bách Phật Danh Tịnh Tạp Phật Đồng Hào"
    },
    {
      "id": "T85n2906",
      "title": "三萬佛同根本神祕之印並法龍種上尊王佛法",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2906.md",
      "vietTitle": "Tam Vạn Phật Đồng Căn Bản Thần Bí Chi Ấn Tịnh Pháp Long Chủng Thượng Tôn Vương Phật Pháp"
    },
    {
      "id": "T85n2907",
      "title": "普賢菩薩行願王經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2907.md",
      "vietTitle": "Kinh Phổ Hiền Bồ Tát Hạnh Nguyện Vương"
    },
    {
      "id": "T85n2908",
      "title": "大方廣佛華嚴經普賢菩薩行願王品",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2908.md",
      "vietTitle": "Đại Phương Quảng Phật Hoa Nghiêm Kinh Phổ Hiền Bồ Tát Hạnh Nguyện Vương Phẩm"
    },
    {
      "id": "T85n2909",
      "title": "地藏菩薩經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2909.md",
      "vietTitle": "Kinh Địa Tạng Bồ Tát"
    },
    {
      "id": "T85n2910",
      "title": "金有陀羅尼經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2910.md",
      "vietTitle": "Kinh Kim Hữu Đà La Ni"
    },
    {
      "id": "T85n2911",
      "title": "讚僧功德經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2911.md",
      "vietTitle": "Kinh Tán Tăng Công Đức"
    },
    {
      "id": "T85n2912",
      "title": "無常三啟經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2912.md",
      "vietTitle": "Kinh Vô Thường Tam Khải"
    },
    {
      "id": "T85n2913",
      "title": "七女觀經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2913.md",
      "vietTitle": "Kinh Thất Nữ Quan"
    },
    {
      "id": "T85n2914",
      "title": "觀經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2914.md",
      "vietTitle": "Kinh Quan"
    },
    {
      "id": "T85n2915",
      "title": "救諸眾生一切苦難經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2915.md",
      "vietTitle": "Kinh Cứu Chư Chúng Sinh Nhất Thiết Khổ Nan"
    },
    {
      "id": "T85n2916",
      "title": "勸善經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2916.md",
      "vietTitle": "Kinh Khuyến Thiện"
    },
    {
      "id": "T85n2917A",
      "title": "新菩薩經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2917A.md",
      "vietTitle": "Kinh Tân Bồ Tát"
    },
    {
      "id": "T85n2917B",
      "title": "新菩薩經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2917B.md",
      "vietTitle": "Kinh Tân Bồ Tát"
    },
    {
      "id": "T85n2918",
      "title": "釋家觀化還愚經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2918.md",
      "vietTitle": "Kinh Thích Gia Quan Hóa Hoàn Ngu"
    },
    {
      "id": "T85n2919",
      "title": "佛母經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2919.md",
      "vietTitle": "Kinh Phật Mẫu"
    },
    {
      "id": "T85n2920",
      "title": "僧伽和尚欲入涅槃說六度經",
      "division": "25",
      "hasViet": false,
      "vietFile": "",
      "hanFile": "../Dai_Tang_Kinh_Han/25_Co_Dat_Nghi_Toi/T85n2920.md",
      "vietTitle": "Kinh Tăng Già Hòa Thượng Dục Nhập Niết Bàn Thuyết Lục Độ"
    }
  ]
};

if (typeof window !== "undefined") {
  window.DAI_TANG_HAN_DATA = DAI_TANG_HAN_DATA;
}
if (typeof module !== "undefined") {
  module.exports = DAI_TANG_HAN_DATA;
}
