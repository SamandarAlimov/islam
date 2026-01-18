import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  User, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Moon,
  Droplets,
  Hand,
  ArrowDown,
  RotateCcw,
  Volume2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DuaAudioButton from "@/components/DuaAudioButton";

interface NamozStep {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  menDetails?: string;
  womenDetails?: string;
  icon?: React.ReactNode;
  isRukn?: boolean;
  isVojib?: boolean;
}

interface NamozSection {
  title: string;
  steps: NamozStep[];
}

const tahoratSteps: NamozStep[] = [
  {
    id: "niyat",
    name: "Niyat qilish",
    description: "Qalbdan tahorat olishni niyat qilish",
    menDetails: "Bismillohir rohmanir rohim deb boshlang",
    womenDetails: "Bismillohir rohmanir rohim deb boshlang",
    icon: <Hand className="w-5 h-5" />
  },
  {
    id: "qol-yuvish",
    name: "Qo'llarni yuvish",
    description: "Ikkala qo'lni bilakkacha 3 martadan yuvish",
    menDetails: "Barmoqlar orasini hilollang",
    womenDetails: "Barmoqlar orasini hilollang, uzuk bo'lsa olib qo'ying",
    icon: <Droplets className="w-5 h-5" />
  },
  {
    id: "ogiz-burun",
    name: "Og'iz va burunni yuvish",
    description: "Og'izga va burunga 3 martadan suv olish",
    menDetails: "Ro'za tutmagan bo'lsangiz, chuqurroq chayqang",
    womenDetails: "Ro'za tutmagan bo'lsangiz, chuqurroq chayqang",
    icon: <Droplets className="w-5 h-5" />
  },
  {
    id: "yuz-yuvish",
    name: "Yuzni yuvish",
    description: "Yuzni peshonadan iyakkacha, quloq yumshoqlaridan quloq yumshoqlaricha 3 marta yuvish",
    menDetails: "Soqol bo'lsa, barmoqlar bilan hilollang",
    womenDetails: "Yuzni to'liq yuvish kerak",
    icon: <Droplets className="w-5 h-5" />
  },
  {
    id: "qol-tirsakkacha",
    name: "Qo'llarni tirsakkacha yuvish",
    description: "O'ng qo'ldan boshlab tirsakkacha 3 martadan yuvish",
    menDetails: "Tirsakni ham yuvish kerak",
    womenDetails: "Bilaguzuk va taqinchoqlarni olib qo'ying",
    icon: <Droplets className="w-5 h-5" />
  },
  {
    id: "bosh-masah",
    name: "Boshni masah qilish",
    description: "Ho'l qo'llar bilan boshning to'rtdan birini masah qilish",
    menDetails: "Butun boshni masah qilish sunnat",
    womenDetails: "Soch ustidan masah qilish kifoya",
    icon: <Hand className="w-5 h-5" />
  },
  {
    id: "oyoq-yuvish",
    name: "Oyoqlarni yuvish",
    description: "O'ng oyoqdan boshlab to'piqlarni ham qo'shib 3 martadan yuvish",
    menDetails: "Barmoqlar orasini hilollang",
    womenDetails: "Barmoqlar orasini hilollang",
    icon: <Droplets className="w-5 h-5" />
  }
];

const namozSteps: NamozSection[] = [
  {
    title: "Namozga tayyorgarlik",
    steps: [
      {
        id: "tahorat",
        name: "Tahorat olish",
        description: "Namoz o'qish uchun avval tahorat olish kerak",
        icon: <Droplets className="w-5 h-5" />
      },
      {
        id: "qibla",
        name: "Qiblaga yuzlanish",
        description: "Makkadagi Ka'ba tomonga yuzlanish",
        icon: <RotateCcw className="w-5 h-5" />
      },
      {
        id: "niyat",
        name: "Niyat qilish",
        description: "Qaysi namozni o'qishni qalbdan niyat qilish",
        menDetails: "Niyat qalbda bo'ladi, til bilan aytish sunnat",
        womenDetails: "Niyat qalbda bo'ladi, til bilan aytish sunnat",
        icon: <Hand className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Namozning ruknlari",
    steps: [
      {
        id: "takbir",
        name: "Takbiratul Ihrom",
        arabicName: "تَكْبِيرَةُ الإِحْرَام",
        description: "Qo'llarni ko'tarib 'Allohu Akbar' deyish",
        arabic: "اللهُ أَكْبَر",
        transliteration: "Allohu Akbar",
        translation: "Alloh eng buyukdir",
        menDetails: "Qo'llarni quloq barobariga ko'tarish, barmoqlarni tabiiy holda ochish",
        womenDetails: "Qo'llarni yelka barobariga ko'tarish, barmoqlarni tabiiy holda ochish",
        isRukn: true,
        icon: <Hand className="w-5 h-5" />
      },
      {
        id: "qiyom",
        name: "Qiyom (Tik turish)",
        arabicName: "القِيَام",
        description: "Namozda tik turish",
        menDetails: "Qo'llarni kindik ostida bog'lash, o'ng qo'l ustida",
        womenDetails: "Qo'llarni ko'krak ustida bog'lash",
        isRukn: true,
        icon: <User className="w-5 h-5" />
      },
      {
        id: "sano",
        name: "Sano o'qish",
        arabicName: "دُعَاءُ الاسْتِفْتَاح",
        description: "Namozni boshlash duosi",
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
        transliteration: "Subhonaka Allohumma va bihamdik, va tabarokasmuk, va ta'ala jadduk, va la ilaha g'ayruk",
        translation: "Ey Alloh, Sen poksan va hamd Sengadir. Isming muborakdir. Ulug'vorliging yuksak. Sendan o'zga iloh yo'q.",
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "taavvuz",
        name: "Ta'avvuz va Basmala",
        description: "Shaytandan panoh so'rash va Bismilloh",
        arabic: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۝ بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
        transliteration: "A'uzu billahi minash-shaytonir rojim. Bismillahir Rohmanir Rohim",
        translation: "Quvib chiqarilgan shaytandan Allohga sig'inaman. Mehribon va rahmli Alloh nomi bilan",
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "fotiha",
        name: "Fotiha surasi",
        arabicName: "الفَاتِحَة",
        description: "Qur'onning birinchi surasi - har rakatda o'qiladi",
        arabic: `الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
        transliteration: "Alhamdu lillahi Robbil 'alamin. Ar-Rohmanir Rohim. Maliki yawmiddin. Iyyaka na'budu va iyyaka nasta'in. Ihdinassirotal mustaqim. Sirotallazina an'amta 'alayhim, g'ayril mag'zubi 'alayhim valazzollin. Omin.",
        translation: "Hamd olamlarning Rabbi Allohga xosdir. U Rahmli, Mehribondir. Hisob-kitob kunining Egasidir. Faqat Senga ibodat qilamiz va faqat Sendan yordam so'raymiz. Bizni to'g'ri yo'lga hidoyat qil. O'zing ne'mat bergan kishilarning yo'liga. G'azabga uchragan va adashganlarning yo'liga emas.",
        isRukn: true,
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "sura",
        name: "Sura qo'shish",
        description: "Fotiha'dan keyin biror sura yoki 3 oyat o'qish",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Qul huwallohu ahad. Allohus-somad. Lam yalid va lam yulad. Va lam yakun lahu kufuvan ahad.",
        translation: "Ayting: 'U Alloh yagonadir. Alloh behojatdir. U tug'magan va tug'ilmagan. Unga hech kim teng emas.'",
        isVojib: true,
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "ruku",
        name: "Ruku (Egilish)",
        arabicName: "الرُّكُوع",
        description: "Belni egib, qo'llarni tizzaga qo'yish",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subhona Robbiyal 'Azim (3 marta)",
        translation: "Buyuk Robbim pokdir",
        menDetails: "Orqa tekis, bosh orqa bilan bir xil darajada, tizzalar to'g'ri, qo'llar tizzada",
        womenDetails: "Biroz egilish kifoya, qo'llar tizzada, tirsaklar yon tomonga chiqmaydi",
        isRukn: true,
        icon: <ArrowDown className="w-5 h-5" />
      },
      {
        id: "qavma",
        name: "Qavma (Ruku'dan turish)",
        arabicName: "القَوْمَة",
        description: "Ruku'dan tik holatga qaytish",
        arabic: "سَمِعَ اللهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا لَكَ الْحَمْدُ",
        transliteration: "Sami'allohu liman hamidah. Robbana lakal hamd",
        translation: "Alloh hamd aytganlarni eshitdi. Ey Robbimiz, hamd Sengadir",
        icon: <User className="w-5 h-5" />
      },
      {
        id: "sajda1",
        name: "Birinchi Sajda",
        arabicName: "السَّجْدَة",
        description: "Yerga bosh qo'yish - 7 a'zo bilan",
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
        transliteration: "Subhona Robbiyal A'la (3 marta)",
        translation: "Eng yuksak Robbim pokdir",
        menDetails: "Qorin sondan, tirsaklar yerdan va yon tomondan ajratilgan. 7 a'zo: peshona, burun, 2 qo'l, 2 tizza, 2 oyoq barmoqlari",
        womenDetails: "Qorin songa yopishgan, tirsaklar yerga yaqin, tanani yig'iq holda sajda qilish",
        isRukn: true,
        icon: <ArrowDown className="w-5 h-5" />
      },
      {
        id: "jalsa",
        name: "Jalsa (Ikki sajda orasida o'tirish)",
        arabicName: "الجَلْسَة",
        description: "Ikki sajda orasida o'tirish",
        arabic: "رَبِّ اغْفِرْ لِي",
        transliteration: "Robbig'fir li",
        translation: "Rabbim, meni kechir",
        menDetails: "Chap oyoq ustida o'tirib, o'ng oyoq barmoqlari qiblaga qaratiladi",
        womenDetails: "Ikkala oyoqni o'ng tomonga chiqarib o'tirish (tavarrruk)",
        icon: <User className="w-5 h-5" />
      },
      {
        id: "sajda2",
        name: "Ikkinchi Sajda",
        description: "Birinchi sajda kabi takrorlanadi",
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
        transliteration: "Subhona Robbiyal A'la (3 marta)",
        translation: "Eng yuksak Robbim pokdir",
        isRukn: true,
        icon: <ArrowDown className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Oxirgi o'tirish",
    steps: [
      {
        id: "tahiyyot",
        name: "Tahiyyot (Attahiyyat)",
        arabicName: "التَّحِيَّات",
        description: "Oxirgi o'tirishda o'qiladi",
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration: "At-tahiyyatu lillahi vas-solavatu vat-toyyibat. As-salamu 'alayka ayyuhan-nabiyyu va rahmatullohi va barokatuh. As-salamu 'alayna va 'ala 'ibadillahis-solihin. Ash-hadu an la ilaha illallohu va ash-hadu anna Muhammadan 'abduhu va rosuluh",
        translation: "Tahiyyotlar, salovotlar va pokliklar Allohga xosdir. Ey Payg'ambar, sizga salom, Allohning rahmati va barakotlari bo'lsin. Bizga va Allohning solih bandalariga salom bo'lsin. Guvohlik beramanki, Allohdan o'zga iloh yo'q va Muhammad Uning bandasi va elchisidir.",
        menDetails: "Shahodat barmoqini ko'tarib 'la ilaha illalloh' deganda ishora qilish",
        womenDetails: "Shahodat barmoqini ko'tarib 'la ilaha illalloh' deganda ishora qilish",
        isRukn: true,
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "salavot",
        name: "Salavot (Durudi Ibrohim)",
        arabicName: "الصَّلَوَات",
        description: "Payg'ambarimizga salavot",
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        transliteration: "Allohumma solli 'ala Muhammadin va 'ala ali Muhammad, kama sollayta 'ala Ibrohima va 'ala ali Ibrohim, innaka hamidum majid. Allohumma barik 'ala Muhammadin va 'ala ali Muhammad, kama barokta 'ala Ibrohima va 'ala ali Ibrohim, innaka hamidum majid",
        translation: "Ey Alloh, Muhammadga va uning oilasiga rahmat yubor, Ibrohimga va uning oilasiga rahmat yuborganingdek. Albatta Sen maqtovli va ulug'vorsan. Ey Alloh, Muhammadga va uning oilasiga baraka ber, Ibrohimga va uning oilasiga baraka berganingdek. Albatta Sen maqtovli va ulug'vorsan.",
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: "duo",
        name: "Duo",
        description: "Namoz oxirida duo qilish",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Robbana atina fid-dunya hasanatan va fil-akhiroti hasanatan va qina 'azabannar",
        translation: "Ey Robbimiz, bizga dunyoda yaxshilik ber, oxiratda ham yaxshilik ber va bizni do'zax azobidan saqla",
        icon: <Hand className="w-5 h-5" />
      },
      {
        id: "salom",
        name: "Salom berish",
        arabicName: "التَّسْلِيم",
        description: "Namozni tugatish uchun ikki tomonga salom berish",
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
        transliteration: "Assalamu 'alaykum va rahmatulloh",
        translation: "Sizlarga Allohning salomi va rahmati bo'lsin",
        menDetails: "Avval o'ng, keyin chap tomonga qarab salom berish",
        womenDetails: "Avval o'ng, keyin chap tomonga qarab salom berish",
        isRukn: true,
        icon: <Volume2 className="w-5 h-5" />
      }
    ]
  }
];

const namozVaqtlari = [
  { name: "Bomdod", arabic: "الفَجْر", rakatlar: "2 sunnat + 2 farz", description: "Tong otganidan quyosh chiqqunicha" },
  { name: "Peshin", arabic: "الظُّهْر", rakatlar: "4 sunnat + 4 farz + 2 sunnat", description: "Quyosh zavolga kelganidan to asr vaqtigacha" },
  { name: "Asr", arabic: "العَصْر", rakatlar: "4 farz", description: "Soya ikki hissa bo'lganidan to quyosh botguncha" },
  { name: "Shom", arabic: "المَغْرِب", rakatlar: "3 farz + 2 sunnat", description: "Quyosh botganidan to shafaq yo'qolguncha" },
  { name: "Xufton", arabic: "العِشَاء", rakatlar: "4 farz + 2 sunnat + 3 vitr", description: "Shafaq yo'qolganidan to tong otguncha" }
];

const NamozOrganish = () => {
  const [selectedGender, setSelectedGender] = useState<"erkak" | "ayol">("erkak");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium">Namoz o'rganish</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Namoz O'qishni O'rganish
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Namoz - musulmonning Alloh bilan bog'lanishi. Quyida namoz o'qishning to'liq qo'llanmasini topasiz.
          </p>
        </div>

        {/* Gender Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-muted">
            <button
              onClick={() => setSelectedGender("erkak")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium",
                selectedGender === "erkak"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-5 h-5" />
              Erkaklar uchun
            </button>
            <button
              onClick={() => setSelectedGender("ayol")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium",
                selectedGender === "ayol"
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="w-5 h-5" />
              Ayollar uchun
            </button>
          </div>
        </div>

        {/* Gender-specific info banner */}
        <Card className={cn(
          "mb-8 border-2",
          selectedGender === "erkak" 
            ? "bg-primary/5 border-primary/20" 
            : "bg-accent/5 border-accent/20"
        )}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className={cn(
                "w-5 h-5",
                selectedGender === "erkak" ? "text-primary" : "text-accent"
              )} />
              <p className="text-sm text-muted-foreground">
                {selectedGender === "erkak" 
                  ? "Erkaklar namozda qo'llarni quloq barobariga ko'taradi, kindik ostida bog'laydi va ruku'da orqa tekis bo'ladi."
                  : "Ayollar namozda qo'llarni yelka barobariga ko'taradi, ko'krak ustida bog'laydi va harakatlarni yig'iqroq qiladi."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vaqtlar" className="space-y-6">
          <TabsList className="w-full flex-wrap h-auto gap-2 p-2 bg-muted/50">
            <TabsTrigger value="vaqtlar" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Namoz vaqtlari</span>
              <span className="sm:hidden">Vaqtlar</span>
            </TabsTrigger>
            <TabsTrigger value="tahorat" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">Tahorat</span>
              <span className="sm:hidden">Tahorat</span>
            </TabsTrigger>
            <TabsTrigger value="namoz" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Namoz o'qish</span>
              <span className="sm:hidden">Namoz</span>
            </TabsTrigger>
          </TabsList>

          {/* Namoz Vaqtlari */}
          <TabsContent value="vaqtlar" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Moon className="w-6 h-6 text-primary" />
                  Besh vaqt namoz
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {namozVaqtlari.map((namoz, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{namoz.name}</h3>
                        <p 
                          className="text-lg text-primary font-arabic"
                          style={{ fontFamily: "'Amiri', serif" }}
                        >
                          {namoz.arabic}
                        </p>
                      </div>
                      <Moon className="w-8 h-8 text-primary/30" />
                    </div>
                    <Badge className="mb-3 bg-primary/10 text-primary border-0">
                      {namoz.rakatlar}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{namoz.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tahorat */}
          <TabsContent value="tahorat" className="space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                  <Droplets className="w-6 h-6" />
                  Tahorat olish tartibi
                </CardTitle>
                <p className="text-muted-foreground">
                  Namoz o'qish uchun avval tahorat olish farzdir. Quyida tahoratning to'liq tartibi berilgan.
                </p>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {tahoratSteps.map((step, index) => (
                <Card key={step.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{step.name}</h3>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <div className={cn(
                          "p-3 rounded-lg",
                          selectedGender === "erkak" 
                            ? "bg-primary/10 border border-primary/20" 
                            : "bg-accent/10 border border-accent/20"
                        )}>
                          <p className="text-sm">
                            <span className={cn(
                              "font-medium",
                              selectedGender === "erkak" ? "text-primary" : "text-accent"
                            )}>
                              {selectedGender === "erkak" ? "Erkaklar: " : "Ayollar: "}
                            </span>
                            {selectedGender === "erkak" ? step.menDetails : step.womenDetails}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Namoz o'qish */}
          <TabsContent value="namoz" className="space-y-6">
            {namozSteps.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-primary flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Accordion type="single" collapsible className="space-y-3">
                  {section.steps.map((step, index) => (
                    <AccordionItem 
                      key={step.id} 
                      value={step.id}
                      className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            step.isRukn 
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : step.isVojib
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                              : "bg-primary/10 text-primary"
                          )}>
                            {step.icon}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{step.name}</h3>
                              {step.isRukn && (
                                <Badge variant="destructive" className="text-xs">Rukn</Badge>
                              )}
                              {step.isVojib && (
                                <Badge className="bg-orange-500 text-xs">Vojib</Badge>
                              )}
                            </div>
                            {step.arabicName && (
                              <p 
                                className="text-sm text-muted-foreground font-arabic"
                                style={{ fontFamily: "'Amiri', serif" }}
                              >
                                {step.arabicName}
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{step.description}</p>

                          {step.arabic && (
                            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <p 
                                  className="text-xl md:text-2xl text-right leading-loose font-arabic text-foreground flex-1"
                                  style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                                  dir="rtl"
                                >
                                  {step.arabic}
                                </p>
                                <DuaAudioButton 
                                  arabicText={step.arabic} 
                                  label="Tinglash"
                                  size="sm"
                                  variant="outline"
                                  className="flex-shrink-0"
                                />
                              </div>
                              {step.transliteration && (
                                <p className="text-sm text-primary font-medium">
                                  {step.transliteration}
                                </p>
                              )}
                              {step.translation && (
                                <p className="text-sm text-muted-foreground italic">
                                  Ma'nosi: {step.translation}
                                </p>
                              )}
                            </div>
                          )}

                          {(step.menDetails || step.womenDetails) && (
                            <div className={cn(
                              "p-4 rounded-xl border-2",
                              selectedGender === "erkak" 
                                ? "bg-primary/5 border-primary/20" 
                                : "bg-accent/5 border-accent/20"
                            )}>
                              <div className="flex items-start gap-3">
                                {selectedGender === "erkak" ? (
                                  <User className="w-5 h-5 text-primary mt-0.5" />
                                ) : (
                                  <Users className="w-5 h-5 text-accent mt-0.5" />
                                )}
                                <div>
                                  <p className={cn(
                                    "font-medium mb-1",
                                    selectedGender === "erkak" ? "text-primary" : "text-accent"
                                  )}>
                                    {selectedGender === "erkak" ? "Erkaklar uchun:" : "Ayollar uchun:"}
                                  </p>
                                  <p className="text-foreground">
                                    {selectedGender === "erkak" ? step.menDetails : step.womenDetails}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="py-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Muhim eslatmalar
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Rukn</strong> - namozning asosiy qismlari, tark etilsa namoz buziladi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Vojib</strong> - tark etilsa sajdai sahv kerak
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Sunnat</strong> - bajarish savob, tark etish gunoh emas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Xushu'</strong> - namozda qalbni hozir qilish muhim
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NamozOrganish;
