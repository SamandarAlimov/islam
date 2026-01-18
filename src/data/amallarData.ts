import { 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Heart, 
  Circle, 
  XCircle, 
  Ban,
  BookOpen,
  Moon,
  Sun,
  Users,
  Coins,
  Plane,
  MessageCircle,
  Utensils,
  Shirt,
  Home,
  Hand
} from "lucide-react";
import React from "react";

export interface Dalil {
  type: "quran" | "hadith";
  source: string;
  text: string;
  arabic?: string;
  translation?: string;
}

export interface AmalDetail {
  id: string;
  name: string;
  description: string;
  details?: string;
  icon?: string;
  fullDescription?: string;
  importance?: string;
  howTo?: string[];
  benefits?: string[];
  dalillar: Dalil[];
  relatedAmals?: string[];
}

export interface AmalCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
  items: AmalDetail[];
}

export const amallarData: Record<string, AmalCategory> = {
  farz: {
    id: "farz",
    title: "Farz (Fard)",
    description: "Qat'iy dalil bilan sobit bo'lgan, bajarish majburiy amallar. Tark etilsa gunoh, inkor qilinsa kufr.",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconName: "AlertCircle",
    items: [
      {
        id: "iymon-alloh",
        name: "Allohga iymon keltirish",
        description: "Alloh yagonaligiga, sifatlariga ishonish",
        details: "Tavhid - Islomning asosi",
        icon: "Star",
        fullDescription: "Allohga iymon keltirish - bu Allohning yagonaligiga, uning go'zal ismlari va oliy sifatlariga, Uning har bir narsaga qodir ekanligiga chin dildan ishonishdir. Bu Islomning eng asosiy va muhim ruknidir.",
        importance: "Bu iymonsiz hech bir amal qabul qilinmaydi. Allohga iymon - Jannatga kirishning asosiy shartidir.",
        howTo: [
          "Alloh yagonaligini tan olish (Tavhid)",
          "Allohning barcha go'zal ismlari va sifatlariga ishonish",
          "Allohdan boshqaga sig'inmaslik",
          "Faqat Allohgagina ibodat qilish"
        ],
        benefits: [
          "Abadiy Jannat",
          "Dunyo va oxiratda xavfsizlik",
          "Qalbda tinchlik va xotirjamlik",
          "Allohning muhabbati va rahmati"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 255 (Oyatul Kursiy)",
            arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
            text: "Alloh - Undan o'zga hech qanday iloh yo'q. U tirik va barhayotdir, barcha narsani boshqaruvchidir.",
            translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence."
          },
          {
            type: "quran",
            source: "Al-Ikhlas, 1-4",
            arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            text: "Ayting: 'U Alloh yagonadir. Alloh behojatdir. U tug'magan va tug'ilmagan. Unga hech kim teng emas.'",
            translation: "Say: He is Allah, the One. Allah, the Eternal. He begets not, nor was He begotten. And there is none comparable to Him."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 8",
            text: "Islom besh narsa ustiga qurilgandir: Allohdan o'zga iloh yo'q va Muhammad Allohning Rasuli deb guvohlik berish, namoz o'qish, zakot berish, Hajj qilish va Ramazon ro'zasini tutish.",
            arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ"
          }
        ],
        relatedAmals: ["shahodat", "namoz", "zakot"]
      },
      {
        id: "namoz",
        name: "Namoz o'qish",
        description: "Kuniga 5 vaqt namoz o'qish",
        details: "Bomdod, Peshin, Asr, Shom, Xufton",
        icon: "Moon",
        fullDescription: "Namoz - bu musulmonning Alloh bilan to'g'ridan-to'g'ri bog'lanishi bo'lib, kuniga besh vaqt bajarilishi farz qilingan ibodatdir. U Islomning ikkinchi ustuni va iymonsdan keyin eng muhim farzdir.",
        importance: "Namoz - iymon bilan kufr orasidagi chegaradir. Uni tark etish katta gunohdir.",
        howTo: [
          "Tahorat olish (poklanish)",
          "Qiblaga yuzlanish",
          "Niyat qilish",
          "Takbir aytib namozga kirish",
          "Qiroat, ruku, sajda va boshqa ruknlarni bajarish",
          "Salom bilan yakunlash"
        ],
        benefits: [
          "Gunohlarning kechirilishi",
          "Jannatga kirish",
          "Qalbning pokllanishi",
          "Fahsho va munkardan saqlanish",
          "Rizq va barakaning ko'payishi"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 43",
            arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
            text: "Namozni tik tutinglar, zakotni beringlar va ruku qiluvchilar bilan birga ruku qilinglar.",
            translation: "And establish prayer and give zakah and bow with those who bow."
          },
          {
            type: "quran",
            source: "Al-Ankabut, 45",
            arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
            text: "Albatta, namoz fahsh va munkar ishlardan qaytaradi.",
            translation: "Indeed, prayer prohibits immorality and wrongdoing."
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 82",
            text: "Besh vaqt namoz, bir Juma ikkinchi Jumagacha, bir Ramazon ikkinchi Ramazongacha - katta gunohlardan saqlanilsa - oradagi gunohlar uchun kafforatdir.",
            arabic: "الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، وَرَمَضَانُ إِلَى رَمَضَانَ، مُكَفِّرَاتٌ لِمَا بَيْنَهُنَّ"
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 134",
            text: "Kishi bilan shirk va kufr orasidagi chegara - namozni tark etishdir.",
            arabic: "بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلاَةِ"
          }
        ],
        relatedAmals: ["tahorat", "qiblaga-yuzlanish", "vitr-namozi"]
      },
      {
        id: "roza",
        name: "Ro'za tutish",
        description: "Ramazon oyida ro'za tutish",
        details: "Tong otishidan quyosh botguncha",
        icon: "Sun",
        fullDescription: "Ro'za - tong otishidan quyosh botguncha yeyish-ichish va jinsiy aloqadan tiyilishdir. Ramazon oyida ro'za tutish har bir balog'atga yetgan, sog'lom musulmonga farzdir.",
        importance: "Ro'za Islomning to'rtinchi ustuni bo'lib, Allohning rizo-mamnunligini qozonish va Jannatga kirishning sabablaridan biridir.",
        howTo: [
          "Saharlikda niyat qilish",
          "Tong otgunicha saharlik qilish",
          "Kun davomida yeyish-ichishdan tiyilish",
          "Tilni yomon so'zlardan saqlash",
          "Quyosh botganda iftorlik qilish",
          "Taroveh namozi o'qish"
        ],
        benefits: [
          "Barcha oldingi gunohlar kechiriladi",
          "Rayyon eshigidan Jannatga kirish",
          "Ro'zadorning duosi qabul bo'ladi",
          "Taqvo hosil bo'ladi",
          "Sog'liqqa foyda"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 183",
            arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
            text: "Ey iymon keltirganlar! Sizlarga ham sizlardan oldingilarga yozilganidek, ro'za yozildi. Shoyad taqvo qilsangizlar.",
            translation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1894",
            text: "Kim iymon bilan va savob umidida Ramazon ro'zasini tutsa, uning oldingi gunohlari kechiriladi.",
            arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ"
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 1151",
            text: "Ro'za qalqondir. Ro'zador fahsh so'zlamasan va johillik qilmasin. Agar birov unga haqorat qilsa yoki janjal qilsa: 'Men ro'zadormman' desin.",
            arabic: "الصِّيَامُ جُنَّةٌ"
          }
        ],
        relatedAmals: ["taroveh", "saharlik", "iftorlik"]
      },
      {
        id: "zakot",
        name: "Zakot berish",
        description: "Nisob miqdoriga yetgan moldan 2.5%",
        details: "Faqir va muhtojlarga",
        icon: "Coins",
        fullDescription: "Zakot - nisob miqdoriga yetgan va bir yil to'lgan molning 2.5 foizini muhtoj kishilarga berishdir. Bu Islomning uchinchi ustuni bo'lib, mol-mulkni poklash vositasidir.",
        importance: "Zakot Qur'onda namoz bilan birga 82 marta tilga olingan. Uni bermaslik katta gunoh, inkor etish esa kufrdir.",
        howTo: [
          "Molning nisob miqdoriga yetganini hisoblash",
          "85 gramm oltin yoki 595 gramm kumush qiymatida",
          "Bir yil to'lganini tekshirish",
          "2.5 foizini hisoblash",
          "Zakot olishga haqli kishilarga berish"
        ],
        benefits: [
          "Mol-mulkning pokllanishi va barakasi",
          "Faqirlarning duosi",
          "Jamiyatda tenglik",
          "Baxillikdan poklanish",
          "Oxiratda ulkan savob"
        ],
        dalillar: [
          {
            type: "quran",
            source: "At-Tavba, 103",
            arabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا",
            text: "Ularning mollaridan sadaqa ol, u bilan ularni poklaysan va taqvorong qilasan.",
            translation: "Take from their wealth a charity by which you purify them and cause them increase."
          },
          {
            type: "quran",
            source: "At-Tavba, 60",
            arabic: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا",
            text: "Sadaqalar faqat faqirlar, miskinlar, zakot yig'uvchilar, qalblari jalb qilinganlar uchundir...",
            translation: "Zakah expenditures are only for the poor and for the needy and for those employed to collect [zakah]..."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1395",
            text: "Mol egasi zakotni bermasa, qiyomat kuni uning moli kallakal ilon bo'lib bo'yniga o'raladi va uni tishlab aytadi: 'Men seninng boyliging, men sening to'plagan narsangman.'",
            arabic: "مَا مِنْ صَاحِبِ ذَهَبٍ وَلاَ فِضَّةٍ لاَ يُؤَدِّي مِنْهَا حَقَّهَا"
          }
        ],
        relatedAmals: ["sadaqa", "fitr-sadaqasi"]
      },
      {
        id: "hajj",
        name: "Hajj qilish",
        description: "Imkoni bo'lganda umrda bir marta",
        details: "Zulhijja oyida Makkada",
        icon: "Plane",
        fullDescription: "Hajj - Makkayi Mukarramaga borib, Ka'ba atrofida tavof qilish, Safa va Marva tepalarida sa'y qilish, Arofatda turib duo qilish va boshqa ibodat amallarini bajarishdir. Moliy va jismoniy imkoni bo'lgan har bir musulmonga umrda bir marta farzdir.",
        importance: "Hajj Islomning beshinchi ustuni bo'lib, qabul bo'lgan Hajjning mukofoti faqat Jannatdir.",
        howTo: [
          "Ehromga kirish",
          "Makkaga kirib tavof qilish",
          "Safa va Marva orasida sa'y qilish",
          "8-Zulhijjada Minoga chiqish",
          "9-Zulhijjada Arofatda turish",
          "Muzdalifada tunash",
          "Jumrotga tosh otish",
          "Qurbonlik so'yish va soch olish"
        ],
        benefits: [
          "Barcha gunohlarning kechirilishi",
          "Yangi tug'ilgan go'dak kabi bo'lib qaytish",
          "Faqat Jannat mukofoti",
          "Alloh mehmonlari qatorida bo'lish",
          "Ulkan savob va fazilat"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Oli Imron, 97",
            arabic: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا",
            text: "Yo'lga qodir bo'lgan kishilarning Alloh uchun Ka'bani Hajj qilishi farzdir.",
            translation: "And [due] to Allah from the people is a pilgrimage to the House - for whoever is able to find thereto a way."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1521",
            text: "Qabul bo'lgan Hajjning mukofoti faqat Jannatdir.",
            arabic: "الْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلاَّ الْجَنَّةُ"
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1820",
            text: "Kim Alloh uchun Hajj qilib, fahsh so'zlardan va gunohlardan saqla sa, onasidan tug'ilgan kunidek (gunohlarsiz) qaytadi.",
            arabic: "مَنْ حَجَّ لِلَّهِ فَلَمْ يَرْفُثْ وَلَمْ يَفْسُقْ رَجَعَ كَيَوْمِ وَلَدَتْهُ أُمُّهُ"
          }
        ],
        relatedAmals: ["umra", "tavof", "say"]
      },
      {
        id: "ota-ona",
        name: "Ota-onaga yaxshilik",
        description: "Ota-onaga hurmat va xizmat",
        details: "Allohdan keyin eng katta haq",
        icon: "Users",
        fullDescription: "Ota-onaga yaxshilik qilish - ularga hurmat ko'rsatish, xizmat qilish, ularning so'zlarini tinglash, ularni xafa qilmaslik va ularga mehr-muhabbat bilan munosabatda bo'lishdir.",
        importance: "Ota-onaga yaxshilik Qur'onda Allohga ibodat qilish bilan birga tilga olingan. Ularga oq bo'lish katta gunohlardan hisoblanadi.",
        howTo: [
          "Ularga hurmat bilan muomala qilish",
          "Ularning ehtiyojlarini qondirish",
          "Ularni xafa qiladigan so'zlardan saqlanish",
          "Ularning duosini olish",
          "Vafotlaridan keyin ular uchun duo qilish"
        ],
        benefits: [
          "Jannat eshiklarining ochilishi",
          "Umrning uzayishi va rizqning ko'payishi",
          "Allohning roziligi",
          "Farzandlardan yaxshilik ko'rish",
          "Qiyomatda najot topish"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Isro, 23-24",
            arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
            text: "Robbingiz faqat O'ziga ibodat qilishingizni va ota-onangizga yaxshilik qilishingizni buyurdi.",
            translation: "And your Lord has decreed that you not worship except Him, and to parents, good treatment."
          },
          {
            type: "quran",
            source: "Luqmon, 14",
            arabic: "وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ حَمَلَتْهُ أُمُّهُ وَهْنًا عَلَىٰ وَهْنٍ",
            text: "Biz insonga ota-onasiga (yaxshilik qilishni) vasiyat qildik. Onasi uni zaiflik ustiga zaiflik bilan ko'tardi.",
            translation: "And We have enjoined upon man [care] for his parents. His mother carried him, [increasing her] in weakness upon weakness."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 5971",
            text: "Allohning roziligi ota-onaning roziligidir va Allohning g'azabi ota-onaning g'azabidir.",
            arabic: "رِضَا اللَّهِ فِي رِضَا الْوَالِدِ، وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدِ"
          }
        ],
        relatedAmals: ["silai-rahm", "qarindoshlarga-yaxshilik"]
      }
    ]
  },
  vojib: {
    id: "vojib",
    title: "Vojib",
    description: "Kuchli dalil bilan sobit bo'lgan, bajarish lozim amallar. Tark etilsa gunoh, lekin inkor qilinsa kofir bo'lmaydi.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconName: "Star",
    items: [
      {
        id: "vitr-namozi",
        name: "Vitr namozi",
        description: "Xuftondan keyin o'qiladigan 3 rakat",
        details: "Vojib darajasida",
        icon: "Moon",
        fullDescription: "Vitr namozi - xufton namozidan keyin, tong otgunicha o'qiladigan namoz. Hanafiy mazhabida vojib, boshqa mazhablarida kuchli sunnatdir.",
        importance: "Payg'ambarimiz (s.a.v.) hech qachon tark etmaganlar va ummatga ham tavsiya qilganlar.",
        howTo: [
          "Xufton farz va sunnatidan keyin o'qiladi",
          "3 rakat bo'lib, 2 rakatda o'tirib tahiyyot o'qiladi",
          "3-rakatda Fotiha va suradan keyin Qunut duosi o'qiladi",
          "Ruku va sajdadan keyin salom beriladi"
        ],
        benefits: [
          "Kechasi o'qilgan eng afzal namoz",
          "Payg'ambar sunnatiga ergashish",
          "Kechagi kunning yakunlanishi",
          "Qabul bo'lgan duo vaqti"
        ],
        dalillar: [
          {
            type: "hadith",
            source: "Abu Dovud, 1418",
            text: "Vitr haq (amaldagi)dir. Kim vitr o'qimasa, bizdan emas.",
            arabic: "الْوِتْرُ حَقٌّ، فَمَنْ لَمْ يُوتِرْ فَلَيْسَ مِنَّا"
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 754",
            text: "Kecha namozini oxirgi amaling vitr qil.",
            arabic: "اجْعَلُوا آخِرَ صَلاَتِكُمْ بِاللَّيْلِ وِتْرًا"
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 998",
            text: "Albatta Alloh toqdir, U toqni yaxshi ko'radi. Ey Qur'on ahli, vitr o'qinglar!",
            arabic: "إِنَّ اللَّهَ وِتْرٌ يُحِبُّ الْوِتْرَ، فَأَوْتِرُوا يَا أَهْلَ الْقُرْآنِ"
          }
        ],
        relatedAmals: ["xufton-namozi", "tahajjud"]
      },
      {
        id: "fitr-sadaqasi",
        name: "Fitr sadaqasi",
        description: "Ramazon oxirida beriladigan sadaqa",
        details: "Oila a'zolari uchun",
        icon: "Coins",
        fullDescription: "Fitr sadaqasi - Ramazon bayramidan oldin berilishi vojib bo'lgan sadaqa. Har bir oila a'zosi uchun bir so' (taxminan 2.5-3 kg) bug'doy, arpa, xurmo yoki shunga teng pul beriladi.",
        importance: "Ro'zadagi kamchiliklarni to'ldiradi va bayram kuni faqirlarni xursand qiladi.",
        howTo: [
          "Ramazonning oxirgi kunlarida berish",
          "Hayit namozidan oldin berish afzal",
          "Har bir oila a'zosi uchun alohida berish",
          "Faqirlarga to'g'ridan-to'g'ri berish"
        ],
        benefits: [
          "Ro'zadagi kamchiliklarning to'ldirilishi",
          "Faqirlarning bayramda xursand bo'lishi",
          "Ro'zaning Allohga ko'tarilishi",
          "Katta savob"
        ],
        dalillar: [
          {
            type: "hadith",
            source: "Abu Dovud, 1609",
            text: "Rasululloh (s.a.v.) zakotul fitrni ro'zadorni bema'ni va fahsh so'zlardan poklash va faqirlarni to'ydirish uchun farz qildilar.",
            arabic: "فَرَضَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ زَكَاةَ الْفِطْرِ طُهْرَةً لِلصَّائِمِ"
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1503",
            text: "Rasululloh (s.a.v.) zakotul fitrni xurmodan bir so' yoki arpadan bir so' qilib farz qildilar.",
            arabic: "فَرَضَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ زَكَاةَ الْفِطْرِ صَاعًا مِنْ تَمْرٍ"
          }
        ],
        relatedAmals: ["zakot", "sadaqa", "roza"]
      },
      {
        id: "qurbonlik",
        name: "Qurbonlik so'yish",
        description: "Qurbon hayitida mol so'yish",
        details: "Imkoni bo'lganda vojib",
        icon: "Star",
        fullDescription: "Qurbonlik - Qurbon hayiti kunlarida (10, 11, 12 Zulhijja) nisob miqdorida mol-mulkga ega bo'lgan kishilarga vojib bo'lgan ibodatdir.",
        importance: "Ibrohim alayhissalomning sunnatlaridan bo'lib, Allohga yaqinlashish vositasidir.",
        howTo: [
          "Qurbonlik hayvonini tanlash (qo'y, echki, mol, tuya)",
          "10-Zulhijjada hayit namozidan keyin so'yish",
          "Bismilloh va takbir aytib so'yish",
          "Go'shtni 3 qismga bo'lish (o'zi, sovg'a, sadaqa)"
        ],
        benefits: [
          "Har bir tuk uchun savob",
          "Ibrohim alayhissalom sunnatini tirilrish",
          "Faqirlarni xursand qilish",
          "Allohga yaqinlashish"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Kawthar, 2",
            arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
            text: "Robbingga namoz o'qi va qurbon so'y.",
            translation: "So pray to your Lord and sacrifice [to Him alone]."
          },
          {
            type: "hadith",
            source: "Ibn Majah, 3123",
            text: "Kim imkoni bo'la turib qurbonlik qilmasa, bizning namozgohimizga yaqinlashmasin.",
            arabic: "مَنْ كَانَ لَهُ سَعَةٌ وَلَمْ يُضَحِّ، فَلَا يَقْرَبَنَّ مُصَلَّانَا"
          },
          {
            type: "hadith",
            source: "Tirmiziy, 1493",
            text: "Qurbonlik kunida Odam farzandining Allohga eng maqbul amali qon oqizishdir. U qiyomat kuni shoxlari, tuyoqlari va junlari bilan keladi. Qon yerga tushmasdan Alloh huzurida qabul bo'ladi.",
            arabic: "مَا عَمِلَ ابْنُ آدَمَ مِنْ عَمَلٍ يَوْمَ النَّحْرِ أَحَبَّ إِلَى اللَّهِ مِنْ إِهْرَاقِ الدَّمِ"
          }
        ],
        relatedAmals: ["hayit-namozi", "hajj"]
      }
    ]
  },
  sunnat: {
    id: "sunnat",
    title: "Sunnat",
    description: "Payg'ambarimiz (s.a.v.) doimiy bajargan amallar. Bajarilsa savob, tark etilsa gunoh emas, lekin ta'na qilinadi.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconName: "CheckCircle2",
    items: [
      {
        id: "bomdod-sunnati",
        name: "Bomdod sunnati (2 rakat)",
        description: "Farzdan oldin o'qiladi",
        details: "Eng kuchli sunnat",
        icon: "Sun",
        fullDescription: "Bomdod sunnat namozi - bomdod farzidan oldin o'qiladigan 2 rakat sunnat muakkadadir. Bu barcha sunnatlar ichida eng kuchlisidir.",
        importance: "Payg'ambarimiz (s.a.v.) hech qachon tark etmaganlar va 'Dunyo va undagi narsalardan afzaldir' deb ta'riflaganlar.",
        howTo: [
          "Bomdod vaqti kirgandan keyin o'qish",
          "Farz namozidan oldin o'qish",
          "2 rakat o'qish",
          "Qisqa suralar o'qish afzal (Kofirun va Ixlos)"
        ],
        benefits: [
          "Dunyo va undagi narsalardan afzal",
          "Kunni ibodot bilan boshlash",
          "Payg'ambar sunnatiga amal qilish",
          "Ulkan savob"
        ],
        dalillar: [
          {
            type: "hadith",
            source: "Sahih Muslim, 725",
            text: "Bomdodning ikki rak'ati dunyo va undagi narsalardan yaxshiroqdir.",
            arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا"
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1169",
            text: "Sizlardan birortangiz bomdod sunnatining ikki rak'atini tark etmasin, hatto otlar ustida quvib ketilsa ham.",
            arabic: "لَا تَدَعُوا رَكْعَتَيِ الْفَجْرِ وَإِنْ طَرَدَتْكُمُ الْخَيْلُ"
          }
        ],
        relatedAmals: ["bomdod-namozi", "tahajjud"]
      },
      {
        id: "misvok",
        name: "Misvok ishlatish",
        description: "Tahorat oldidan tish tozalash",
        details: "Payg'ambarimiz doim ishlatganlar",
        icon: "Hand",
        fullDescription: "Misvok - tish tozalash uchun ishlatiladigan maxsus daraxt shoxchasi. Payg'ambarimiz (s.a.v.) juda ko'p ishlatganlar va ummatga ham tavsiya qilganlar.",
        importance: "Payg'ambarimiz (s.a.v.): 'Agar ummatimga og'ir kelmasligini bilsam, har namozda misvok ishlatishni buyurardim' deb marhamat qilganlar.",
        howTo: [
          "Tahorat oldidan ishlatish",
          "Namozga turganda ishlatish",
          "Qur'on o'qishdan oldin",
          "Uyga kirganda",
          "Uxlashdan oldin"
        ],
        benefits: [
          "Og'izning tozalanishi",
          "Allohning roziligi",
          "Payg'ambar sunnatiga amal",
          "Sog'liqqa foyda",
          "Namozning savobini ko'paytirish"
        ],
        dalillar: [
          {
            type: "hadith",
            source: "Sahih Buxoriy, 887",
            text: "Agar ummatimga og'ir kelmasligini bilsam, har namozda misvok ishlatishni buyurardim.",
            arabic: "لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لَأَمَرْتُهُمْ بِالسِّوَاكِ عِنْدَ كُلِّ صَلَاةٍ"
          },
          {
            type: "hadith",
            source: "Nasai, 5",
            text: "Misvok og'izni tozalovchi, Rabbni rozi qiluvchidir.",
            arabic: "السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ"
          }
        ],
        relatedAmals: ["tahorat", "namoz"]
      },
      {
        id: "juma-sunnatlari",
        name: "Juma sunnatlari",
        description: "Juma kuni maxsus sunnatlar",
        details: "G'usl, eng yaxshi kiyim, atir",
        icon: "Sun",
        fullDescription: "Juma kuni musulmonlar uchun maxsus kundir. Bu kunda bir qator sunnatlar bor: g'usl olish, eng yaxshi kiyim kiyish, atir sepish, Kahf surasini o'qish va ko'p salavot aytish.",
        importance: "Juma - haftaning eng afzal kuni. Payg'ambarimiz (s.a.v.) bu kunning fazilatlarini ko'p ta'riflaganlar.",
        howTo: [
          "Juma kuni g'usl olish",
          "Eng yaxshi kiyimlarni kiyish",
          "Atir sepish (erkaklar)",
          "Erta masjidga borish",
          "Kahf surasini o'qish",
          "Payg'ambarga ko'p salavot aytish"
        ],
        benefits: [
          "Bir haftadagi gunohlarning kechirilishi",
          "Fazilatli vaqtda duoning qabul bo'lishi",
          "Ulkan savob",
          "Payg'ambar shafomandi",
          "Qiyomatda nur"
        ],
        dalillar: [
          {
            type: "hadith",
            source: "Sahih Buxoriy, 877",
            text: "Kim juma kuni g'usl olsa, so'ng (namozga) chiqsa, imkoni bor narsadan sadaqa bersa, xutbaga quloq solsa va jim tursa, unga har qadami uchun bir yillik ro'za va bir yillik namoz savobi beriladi.",
            arabic: "مَنِ اغْتَسَلَ يَوْمَ الْجُمُعَةِ غُسْلَ الْجَنَابَةِ ثُمَّ رَاحَ"
          },
          {
            type: "hadith",
            source: "Abu Dovud, 1047",
            text: "Kim juma kuni va kechasida Kahf surasini o'qisa, unga ikki juma orasida nur beriladi.",
            arabic: "مَنْ قَرَأَ سُورَةَ الْكَهْفِ يَوْمَ الْجُمُعَةِ"
          },
          {
            type: "hadith",
            source: "Nasai, 1374",
            text: "Kunlaringizning eng afzali juma kunidir. Bu kunda menga ko'p salavot ayting, chunki salavotlaringiz menga yetkaziladi.",
            arabic: "إِنَّ مِنْ أَفْضَلِ أَيَّامِكُمْ يَوْمَ الْجُمُعَةِ"
          }
        ],
        relatedAmals: ["juma-namozi", "quron-oqish"]
      }
    ]
  },
  mustahab: {
    id: "mustahab",
    title: "Mustahab (Mandub)",
    description: "Bajarilishi yaxshi ko'rilgan, tark etilsa ta'na qilinmaydigan amallar. Savob bor, gunoh yo'q.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconName: "Heart",
    items: [
      {
        id: "tahajjud",
        name: "Tahajjud namozi",
        description: "Kechasi uyg'onib o'qiladi",
        details: "Eng afzal nafl namoz",
        icon: "Moon",
        fullDescription: "Tahajjud - kechaning oxirgi qismida uxlabdan keyin uyg'onib o'qiladigan namoz. Bu farz namozlardan keyin eng afzal namozdir.",
        importance: "Alloh taolo har kecha osmoniga tushib, duo qiluvchilarning duosini qabul qiladi. Bu vaqt eng fazilatli vaqtlardan biridir.",
        howTo: [
          "Kechaning oxirgi uchdan birida uyg'onish",
          "Tahorat olib namoz o'qish",
          "2-8 rakat o'qish",
          "Vitr bilan yakunlash"
        ],
        benefits: [
          "Allohning maxsus muhabbati",
          "Duolarning qabul bo'lishi",
          "Jannatning yuqori darajalariga ko'tarilish",
          "Gunohlarning kechirilishi",
          "Qiyomatda nur"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Isro, 79",
            arabic: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
            text: "Kechaning bir qismida tahajjud o'qi, bu senga qo'shimcha (ibodat)dir. Shoyad Robbing seni maqomul mahmudga ko'tarsa.",
            translation: "And from [part of] the night, pray with it as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station."
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 1163",
            text: "Farz namozdan keyin eng afzal namoz kecha namozidir.",
            arabic: "أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ"
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1145",
            text: "Rabbimiz har kecha dunyo osmoniga tushadi, kechaning oxirgi uchdan biri qolganda va aytadi: 'Kim Menga duo qilsa, ijobat qilaman, kim so'rasa, beraman, kim mag'firat so'rasa, mag'firat qilaman.'",
            arabic: "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا"
          }
        ],
        relatedAmals: ["vitr-namozi", "sahar-vaqti"]
      },
      {
        id: "nafl-sadaqa",
        name: "Nafl sadaqa",
        description: "Zakotdan tashqari sadaqa",
        details: "Qancha ko'p bo'lsa shuncha yaxshi",
        icon: "Coins",
        fullDescription: "Nafl sadaqa - zakotdan tashqari ixtiyoriy ravishda beriladigan sadaqa. Bu mol bilan qilinadigan eng afzal ibodat bo'lib, Alloh yo'lida sarflash deb ham ataladi.",
        importance: "Sadaqa balolarni daf qiladi, umrni uzaytiradi, rizqni ko'paytiradi va Jahannam o'tidan himoya qiladi.",
        howTo: [
          "Niyatni xolis qilish",
          "Halol moldan berish",
          "Yashirin berish afzal",
          "Faqir va muhtojlarni izlash",
          "Oz bo'lsa ham berish"
        ],
        benefits: [
          "Balolarning daf bo'lishi",
          "Molning barakasi",
          "Jahannam o'tidan himoya",
          "Qiyomatda soya",
          "Allohning muhabbati"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 261",
            arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
            text: "Mollarini Alloh yo'lida sarflaganlarning misoli bir donning misolidir, u yettita boshoq chiqardi, har boshoqda yuz dona.",
            translation: "The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 1410",
            text: "Yashirin sadaqa Rabbning g'azabini o'chiradi.",
            arabic: "صَدَقَةُ السِّرِّ تُطْفِئُ غَضَبَ الرَّبِّ"
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 1016",
            text: "Har bir musulmon sadaqa berishi kerak. Deyildi: 'Agar topmasa-chi?' Dedilar: 'Qo'li bilan ishlab, o'ziga foyda qiladi va sadaqa beradi.'",
            arabic: "عَلَى كُلِّ مُسْلِمٍ صَدَقَةٌ"
          }
        ],
        relatedAmals: ["zakot", "qard-hasana"]
      }
    ]
  },
  mubah: {
    id: "mubah",
    title: "Mubah",
    description: "Shariatda ruxsat etilgan, na savob na gunoh bo'lmagan amallar. Niyatga qarab savob bo'lishi mumkin.",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    borderColor: "border-gray-200 dark:border-gray-700",
    iconName: "Circle",
    items: [
      {
        id: "halol-ovqat",
        name: "Halol ovqat yeyish",
        description: "Ruxsat etilgan taomlar",
        details: "O'rtacha yeyish afzal",
        icon: "Utensils",
        fullDescription: "Halol ovqat yeyish - Islomda ruxsat etilgan taomlarni iste'mol qilish. Bu amallning o'zi muboh bo'lib, niyatga qarab savob yoki gunoh bo'lishi mumkin.",
        importance: "Halol ovqat - sog'lom tana va ruhning asosidir. Harom ovqat esa duoning qabul bo'lishiga to'sqinlik qiladi.",
        howTo: [
          "Halol mahsulotlarni tanlash",
          "Bismilloh bilan boshlash",
          "O'ng qo'l bilan yeyish",
          "O'rtacha yeyish",
          "Alhamdulillah bilan yakunlash"
        ],
        benefits: [
          "Tananing sog'lom bo'lishi",
          "Ibodatlarning qabul bo'lishi",
          "Duoning ijobat bo'lishi",
          "Rizqning barakasi"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 168",
            arabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
            text: "Ey odamlar, yerdagi halol va pok narsalardan yenglar.",
            translation: "O mankind, eat from whatever is on earth [that is] lawful and good."
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 1015",
            text: "Albatta Alloh pokdir, faqat pokni qabul qiladi.",
            arabic: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا"
          }
        ],
        relatedAmals: ["yeyish-odobi", "shukr"]
      }
    ]
  },
  makruh: {
    id: "makruh",
    title: "Makruh",
    description: "Yoqtirilmagan, tark etilishi afzal bo'lgan amallar. Qilish gunoh emas, lekin tark etish savob.",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconName: "XCircle",
    items: [
      {
        id: "isrof",
        name: "Ortiqcha isrof",
        description: "Halolda ham isrof qilish",
        details: "Makruh tahrimi",
        icon: "Coins",
        fullDescription: "Isrof - mol-mulkni, vaqtni yoki boshqa ne'matlarni zaruriyatsiz sarflash. Bu halol narsalarda ham makruh, haromga olib borsa esa harom bo'ladi.",
        importance: "Alloh isrof qiluvchilarni yoqtirmaydi. Isrof - shaytanning yo'lidir.",
        howTo: [
          "Zaruriy narsalargagina sarflash",
          "Ortiqcha xarajatlardan saqlanish",
          "Tejamkor bo'lish",
          "Boshqalarga ulashish"
        ],
        benefits: [
          "Molning barakasi",
          "Allohning roziligi",
          "Boshqalarga yordam berish imkoni",
          "Qiyomatda yengillik"
        ],
        dalillar: [
          {
            type: "quran",
            source: "Al-A'rof, 31",
            arabic: "وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ",
            text: "Yenglar, ichinglar, lekin isrof qilmanglar. Albatta U isrof qiluvchilarni yoqtirmaydi.",
            translation: "Eat and drink, but be not excessive. Indeed, He likes not those who commit excess."
          },
          {
            type: "quran",
            source: "Al-Isro, 27",
            arabic: "إِنَّ الْمُبَذِّرِينَ كَانُوا إِخْوَانَ الشَّيَاطِينِ",
            text: "Albatta isrof qiluvchilar shaytanlarning birodarlaridir.",
            translation: "Indeed, the wasteful are brothers of the devils."
          }
        ],
        relatedAmals: ["tejamkorlik", "sadaqa"]
      }
    ]
  },
  haram: {
    id: "haram",
    title: "Harom",
    description: "Qat'iy dalil bilan taqiqlangan amallar. Qilish katta gunoh, halol deb bilish kufr.",
    color: "text-red-700 dark:text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/50",
    borderColor: "border-red-300 dark:border-red-700",
    iconName: "Ban",
    items: [
      {
        id: "shirk",
        name: "Shirk (Allohga sherik qilish)",
        description: "Eng katta gunoh",
        details: "Kechirilmaydi",
        icon: "Ban",
        fullDescription: "Shirk - Allohga sherik qo'shish, ya'ni Allohdan boshqaga sig'inish, ibodat qilish yoki Allohning sifatlarini boshqaga berish. Bu eng katta gunoh bo'lib, tavbasiz kechirilmaydi.",
        importance: "Shirk yagona kechirilmaydigan gunohdir. U iymoni yo'q qiladi va abadiy Jahannamga olib boradi.",
        howTo: [
          "Faqat Allohga sig'inish",
          "Allohdan boshqaga duo qilmaslik",
          "Tavhidni mustahkamlash",
          "Shirkning barcha turlaridan saqlanish"
        ],
        benefits: [],
        dalillar: [
          {
            type: "quran",
            source: "An-Niso, 48",
            arabic: "إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ",
            text: "Albatta Alloh O'ziga sherik qilinishini kechirmaydi. Bundan boshqasini xohlagan kishiga kechiradi.",
            translation: "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills."
          },
          {
            type: "quran",
            source: "Al-Moida, 72",
            arabic: "إِنَّهُ مَن يُشْرِكْ بِاللَّهِ فَقَدْ حَرَّمَ اللَّهُ عَلَيْهِ الْجَنَّةَ وَمَأْوَاهُ النَّارُ",
            text: "Albatta kim Allohga sherik qilsa, Alloh unga Jannatni harom qiladi va uning joyi Jahannamdir.",
            translation: "Indeed, he who associates others with Allah - Allah has forbidden him Paradise, and his refuge is the Fire."
          },
          {
            type: "hadith",
            source: "Sahih Buxoriy, 4497",
            text: "Eng katta gunoh Allohga sherik qilish, ota-onaga oq bo'lish va yolg'on guvohlikdir.",
            arabic: "أَكْبَرُ الْكَبَائِرِ الْإِشْرَاكُ بِاللَّهِ"
          }
        ],
        relatedAmals: ["tavhid", "iymon"]
      },
      {
        id: "ribo",
        name: "Sudxo'rlik (Ribo)",
        description: "Foiz olish va berish",
        details: "Urushga teng",
        icon: "Coins",
        fullDescription: "Ribo (sudxo'rlik) - qarz ustiga qo'shimcha olish yoki berishdir. Bu Islomda qat'iyan harom bo'lib, Alloh va Rasuli bilan urush e'lon qilish deb ta'riflangan.",
        importance: "Ribo jamiyatni buzadi, faqirlarni ezadi va Allohning la'natiga sabab bo'ladi.",
        howTo: [
          "Foizsiz qarz olish/berish",
          "Islomiy bank xizmatlari",
          "Halol tijorat",
          "Qard hasana berish"
        ],
        benefits: [],
        dalillar: [
          {
            type: "quran",
            source: "Al-Baqara, 275",
            arabic: "أَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
            text: "Alloh savdoni halol, riboni harom qildi.",
            translation: "Allah has permitted trade and has forbidden interest."
          },
          {
            type: "quran",
            source: "Al-Baqara, 279",
            arabic: "فَأْذَنُوا بِحَرْبٍ مِّنَ اللَّهِ وَرَسُولِهِ",
            text: "Agar qilmasangizlar, Alloh va Rasulidan urushga tayyorlanishingizni bilinglar.",
            translation: "If you do not, then be informed of a war [against you] from Allah and His Messenger."
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 1598",
            text: "Rasululloh (s.a.v.) ribo yeyuvchini, yedirguvchini, yozuvchini va ikkala guvohni la'natladilar va 'Ular tengdir' dedilar.",
            arabic: "لَعَنَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ آكِلَ الرِّبَا وَمُوكِلَهُ"
          }
        ],
        relatedAmals: ["halol-tijorat", "qard-hasana"]
      },
      {
        id: "ghibat",
        name: "G'iybat",
        description: "Orqadan yomon gapirish",
        details: "O'lik go'shtini yeyish kabi",
        icon: "MessageCircle",
        fullDescription: "G'iybat - birodar musulmonni orqasidan unga yoqmaydigan gapni aytish, garchi u haqiqat bo'lsa ham. Bu Qur'onda o'lik birodarning go'shtini yeyishga o'xshatilgan.",
        importance: "G'iybat jamiyatni buzadi, odamlar orasidagi ishonchni yo'q qiladi va katta gunohdir.",
        howTo: [
          "Tilni nazorat qilish",
          "Boshqalarning kamchiliklarini yashirish",
          "Yaxshi gapirish yoki jim turish",
          "G'iybat qilinayotgan joydan ketish"
        ],
        benefits: [],
        dalillar: [
          {
            type: "quran",
            source: "Al-Hujurot, 12",
            arabic: "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا",
            text: "Ba'zingiz ba'zingizni g'iybat qilmasin. Birortangiz o'lik birodarining go'shtini yeyishni yoqtiradimi?",
            translation: "And do not backbite each other. Would one of you like to eat the flesh of his brother when dead?"
          },
          {
            type: "hadith",
            source: "Sahih Muslim, 2589",
            text: "G'iybat nima ekanini bilasizmi? Birodaringni unga yoqmaydigan narsa bilan zikr qilishing. Deyildi: Aytganim unda bo'lsa-chi? Dedi: Agar unda bo'lsa g'iybat qilding, bo'lmasa tuhmat qilding.",
            arabic: "أَتَدْرُونَ مَا الْغِيبَةُ؟"
          }
        ],
        relatedAmals: ["til-saqlash", "yaxshi-gapirish"]
      }
    ]
  }
};

export const getAmalById = (categoryId: string, amalId: string): AmalDetail | undefined => {
  const category = amallarData[categoryId];
  if (!category) return undefined;
  return category.items.find(item => item.id === amalId);
};

export const getAllAmals = (): { category: AmalCategory; amal: AmalDetail }[] => {
  const result: { category: AmalCategory; amal: AmalDetail }[] = [];
  Object.values(amallarData).forEach(category => {
    category.items.forEach(amal => {
      result.push({ category, amal });
    });
  });
  return result;
};

export const searchAmals = (query: string): { category: AmalCategory; amal: AmalDetail }[] => {
  const lowerQuery = query.toLowerCase();
  return getAllAmals().filter(({ amal }) => 
    amal.name.toLowerCase().includes(lowerQuery) ||
    amal.description.toLowerCase().includes(lowerQuery) ||
    amal.fullDescription?.toLowerCase().includes(lowerQuery)
  );
};
