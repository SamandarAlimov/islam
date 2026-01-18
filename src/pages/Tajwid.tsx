import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Volume2,
  Mic,
  Music,
  Info,
  CheckCircle2
} from "lucide-react";
import TajweedDisplay, { TAJWEED_LEGEND } from "@/components/TajweedDisplay";
import DuaAudioButton from "@/components/DuaAudioButton";

interface TajweedRule {
  id: string;
  name: string;
  arabicName: string;
  color: string;
  colorClass: string;
  description: string;
  explanation: string;
  letters?: string[];
  examples: {
    arabic: string;
    transliteration: string;
    meaning: string;
    highlight: string;
  }[];
  subRules?: {
    name: string;
    description: string;
    example: string;
  }[];
}

const tajweedRules: TajweedRule[] = [
  {
    id: "ghunnah",
    name: "G'unnah",
    arabicName: "الغُنَّة",
    color: "hsl(var(--tajweed-ghunnah))",
    colorClass: "bg-green-500",
    description: "Burun orqali chiqadigan tovush (2 harakat)",
    explanation: "G'unnah - bu nun (ن) va mim (م) harflarida hosil bo'ladigan burun tovushi. Bu tovush 2 harakat (alif o'qish vaqti) davom etadi. G'unnah quyidagi holatlarda kuchli bo'ladi: idg'om bilan g'unnah, ixfo, va tashdidli nun/mim.",
    letters: ["ن", "م"],
    examples: [
      {
        arabic: "مِنَ النَّاسِ",
        transliteration: "Minan-naasi",
        meaning: "Odamlardan",
        highlight: "نَّ"
      },
      {
        arabic: "ثُمَّ",
        transliteration: "Summa",
        meaning: "So'ngra",
        highlight: "مَّ"
      }
    ],
    subRules: [
      { name: "Mushaddad Nun", description: "Tashdidli nun harfi", example: "إِنَّ" },
      { name: "Mushaddad Mim", description: "Tashdidli mim harfi", example: "ثُمَّ" },
    ]
  },
  {
    id: "idgham",
    name: "Idg'om",
    arabicName: "الإِدْغَام",
    color: "hsl(var(--tajweed-idgham))",
    colorClass: "bg-purple-500",
    description: "Harflarni bir-biriga qo'shib o'qish",
    explanation: "Idg'om - tanvin yoki sokin nundan keyin 6 ta harf (ي ر م ل و ن - YARMLUUN) kelganda qo'llaniladi. Idg'om ikki turga bo'linadi: g'unnali (ي ن م و) va g'unnasiz (ر ل).",
    letters: ["ي", "ر", "م", "ل", "و", "ن"],
    examples: [
      {
        arabic: "مَن يَعْمَلْ",
        transliteration: "May-ya'mal",
        meaning: "Kim qilsa",
        highlight: "ن يَ"
      },
      {
        arabic: "مِن رَّبِّهِمْ",
        transliteration: "Mir-rabbihim",
        meaning: "Robblaridan",
        highlight: "ن رَّ"
      }
    ],
    subRules: [
      { name: "G'unnali idg'om", description: "ي ن م و harflarida - g'unnah bilan", example: "مَن يَقُولُ" },
      { name: "G'unnasiz idg'om", description: "ر ل harflarida - g'unnasiz", example: "مِن لَّدُنْ" },
    ]
  },
  {
    id: "ikhfa",
    name: "Ixfo",
    arabicName: "الإِخْفَاء",
    color: "hsl(var(--tajweed-ikhfa))",
    colorClass: "bg-orange-500",
    description: "Yashirin o'qish (g'unnah bilan)",
    explanation: "Ixfo - tanvin yoki sokin nundan keyin 15 ta harf kelganda qo'llaniladi. Nun harfi to'liq aytilmaydi, lekin g'unnah saqlanadi. Bu harflar: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    letters: ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
    examples: [
      {
        arabic: "مِن قَبْلُ",
        transliteration: "Min qablu",
        meaning: "Oldindan",
        highlight: "ن قَ"
      },
      {
        arabic: "أَنتُمْ",
        transliteration: "Antum",
        meaning: "Sizlar",
        highlight: "أَن"
      }
    ]
  },
  {
    id: "iqlab",
    name: "Iqlob",
    arabicName: "الإِقْلَاب",
    color: "hsl(var(--tajweed-iqlab))",
    colorClass: "bg-blue-500",
    description: "Nun tovushini mim tovushiga aylantirish",
    explanation: "Iqlob - tanvin yoki sokin nundan keyin ب (bo) harfi kelganda qo'llaniladi. Nun tovushi mim tovushiga aylantiriladi va g'unnah bilan o'qiladi.",
    letters: ["ب"],
    examples: [
      {
        arabic: "مِن بَعْدِ",
        transliteration: "Mim ba'di",
        meaning: "Keyin",
        highlight: "ن بَ"
      },
      {
        arabic: "أَنبِئْهُم",
        transliteration: "Ambi'hum",
        meaning: "Ularga xabar ber",
        highlight: "نبِ"
      }
    ]
  },
  {
    id: "qalqalah",
    name: "Qalqala",
    arabicName: "القَلْقَلَة",
    color: "hsl(var(--tajweed-qalqalah))",
    colorClass: "bg-red-500",
    description: "Aks-sado tovushi (5 ta harfda)",
    explanation: "Qalqala - 5 ta harf (ق ط ب ج د - QUTBIJAD) sukun bilan kelganda hosil bo'ladigan aks-sado tovushi. Qalqala 3 darajaga bo'linadi: kichik (so'z o'rtasida), o'rta (so'z oxirida), va katta (so'z oxirida to'xtash bilan).",
    letters: ["ق", "ط", "ب", "ج", "د"],
    examples: [
      {
        arabic: "يَخْلُقْ",
        transliteration: "Yakhluq",
        meaning: "Yaratadi",
        highlight: "قْ"
      },
      {
        arabic: "أَحَدْ",
        transliteration: "Ahad",
        meaning: "Yagona",
        highlight: "دْ"
      }
    ],
    subRules: [
      { name: "Qalqala sug'ro", description: "So'z o'rtasida - kichik darajada", example: "يَجْعَلُونَ" },
      { name: "Qalqala kubro", description: "So'z oxirida - katta darajada", example: "الفَلَقْ" },
    ]
  },
  {
    id: "madd",
    name: "Madd",
    arabicName: "المَدّ",
    color: "hsl(var(--tajweed-madd))",
    colorClass: "bg-pink-500",
    description: "Cho'zib o'qish (2-6 harakat)",
    explanation: "Madd - ovoz harflarini (ا و ي) cho'zib o'qish. Madd tabiiy (2 harakat) va fariy (sababli, 4-6 harakat) turlarga bo'linadi. Madd harflari: alif (ا), vov (و), yo (ي).",
    letters: ["ا", "و", "ي"],
    examples: [
      {
        arabic: "قَالَ",
        transliteration: "Qoola",
        meaning: "Dedi",
        highlight: "ا"
      },
      {
        arabic: "يَقُولُونَ",
        transliteration: "Yaquuluuna",
        meaning: "Deydilar",
        highlight: "و"
      }
    ],
    subRules: [
      { name: "Madd tabiiy", description: "Oddiy cho'zish - 2 harakat", example: "قَالَ" },
      { name: "Madd muttasil", description: "Hamza birlashgan - 4-5 harakat", example: "جَاءَ" },
      { name: "Madd munfasil", description: "Hamza ajratilgan - 4-5 harakat", example: "فِي أَنفُسِهِمْ" },
      { name: "Madd lazim", description: "Sukun yoki tashdid bilan - 6 harakat", example: "الضَّالِّينَ" },
    ]
  },
  {
    id: "izhar",
    name: "Izhor",
    arabicName: "الإِظْهَار",
    color: "hsl(142, 76%, 36%)",
    colorClass: "bg-emerald-600",
    description: "Aniq va ochiq talaffuz qilish",
    explanation: "Izhor - tanvin yoki sokin nundan keyin 6 ta halqiy (tomoq) harf kelganda qo'llaniladi. Nun harfi to'liq va aniq aytiladi. Bu harflar: ء ه ع ح غ خ",
    letters: ["ء", "ه", "ع", "ح", "غ", "خ"],
    examples: [
      {
        arabic: "مِنْ عِندِ",
        transliteration: "Min 'indi",
        meaning: "Huzuridan",
        highlight: "نْ عِ"
      },
      {
        arabic: "أَنْعَمْتَ",
        transliteration: "An'amta",
        meaning: "Ne'mat berding",
        highlight: "نْعَ"
      }
    ]
  }
];

const makhrajRules = [
  {
    id: "jawf",
    name: "Javf (Bo'shliq)",
    arabicName: "الجَوْف",
    description: "Og'iz va tomoq bo'shlig'idan chiqadigan harflar",
    letters: ["ا", "و", "ي"],
    explanation: "Madd harflari - alif, vov va yo bo'shliqdan chiqadi"
  },
  {
    id: "halq",
    name: "Halq (Tomoq)",
    arabicName: "الحَلْق",
    description: "Tomoqdan chiqadigan harflar",
    letters: ["ء", "ه", "ع", "ح", "غ", "خ"],
    explanation: "6 ta harf tomoqning turli qismlaridan chiqadi"
  },
  {
    id: "lisan",
    name: "Lison (Til)",
    arabicName: "اللِّسَان",
    description: "Tildan chiqadigan harflar",
    letters: ["ق", "ك", "ج", "ش", "ي", "ض", "ل", "ن", "ر", "ط", "د", "ت", "ص", "ز", "س", "ظ", "ذ", "ث"],
    explanation: "Ko'pchilik harflar tilning turli qismlari bilan hosil bo'ladi"
  },
  {
    id: "shafatain",
    name: "Shafatayn (Lablar)",
    arabicName: "الشَّفَتَيْن",
    description: "Lablardan chiqadigan harflar",
    letters: ["ف", "و", "ب", "م"],
    explanation: "4 ta harf lablar yordamida hosil bo'ladi"
  },
  {
    id: "khayshum",
    name: "Xayshum (Burun)",
    arabicName: "الخَيْشُوم",
    description: "Burun bo'shlig'idan chiqadigan tovush",
    letters: ["غ", "ن", "م"],
    explanation: "G'unnah tovushi burun bo'shlig'idan chiqadi"
  }
];

const practiceVerses = [
  {
    surah: "Al-Fotiha",
    ayah: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    rules: ["Madd", "G'unnah"]
  },
  {
    surah: "Al-Ixlos",
    ayah: 1,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    rules: ["Qalqala", "Izhor"]
  },
  {
    surah: "Al-Ixlos",
    ayah: 4,
    arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    rules: ["Idg'om", "Ixfo"]
  },
  {
    surah: "An-Nos",
    ayah: 1,
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    rules: ["Qalqala", "G'unnah", "Madd"]
  },
  {
    surah: "Al-Fotiha",
    ayah: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    rules: ["Madd lazim", "Izhor", "Ixfo"]
  }
];

const Tajwid = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Tajwid ilmi</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Tajwid Qoidalari
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Qur'oni Karimni to'g'ri va chiroyli o'qish san'ati. Har bir harf o'z joyidan, 
            o'z sifati bilan o'qilishi lozim.
          </p>
        </div>

        {/* Color Legend */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Ranglar ma'nosi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {TAJWEED_LEGEND.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="w-full flex-wrap h-auto gap-2 p-2 bg-muted/50">
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Asosiy qoidalar
            </TabsTrigger>
            <TabsTrigger value="makhraj" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Maxraj (Chiqish joyi)
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Amaliyot
            </TabsTrigger>
          </TabsList>

          {/* Asosiy Qoidalar */}
          <TabsContent value="rules" className="space-y-6">
            <Accordion type="single" collapsible className="space-y-4">
              {tajweedRules.map((rule) => (
                <AccordionItem 
                  key={rule.id} 
                  value={rule.id}
                  className="border-2 rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: rule.color }}
                      >
                        {rule.letters?.[0]}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{rule.name}</h3>
                          <span 
                            className="text-lg font-arabic"
                            style={{ fontFamily: "'Amiri', serif" }}
                          >
                            {rule.arabicName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Tushuntirish */}
                      <div className="bg-muted/50 rounded-xl p-4">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          Tushuntirish
                        </h4>
                        <p className="text-muted-foreground">{rule.explanation}</p>
                      </div>

                      {/* Harflar */}
                      {rule.letters && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Tegishli harflar:</h4>
                          <div className="flex flex-wrap gap-2">
                            {rule.letters.map((letter, index) => (
                              <div 
                                key={index}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-arabic border-2"
                                style={{ 
                                  borderColor: rule.color,
                                  color: rule.color,
                                  fontFamily: "'Amiri', serif"
                                }}
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Misollar */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Misollar:</h4>
                        <div className="grid gap-3">
                          {rule.examples.map((example, index) => (
                            <div 
                              key={index}
                              className="bg-background rounded-xl p-4 border"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p 
                                    className="text-2xl text-right mb-2 font-arabic"
                                    style={{ fontFamily: "'Amiri', serif" }}
                                    dir="rtl"
                                  >
                                    <TajweedDisplay text={example.arabic} />
                                  </p>
                                  <p className="text-sm text-primary font-medium">
                                    {example.transliteration}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Ma'nosi: {example.meaning}
                                  </p>
                                </div>
                                <DuaAudioButton 
                                  arabicText={example.arabic}
                                  size="icon"
                                  variant="outline"
                                  showReciterSelect={false}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub-rules */}
                      {rule.subRules && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Turlari:</h4>
                          <div className="grid gap-2">
                            {rule.subRules.map((sub, index) => (
                              <div 
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg"
                                style={{ backgroundColor: `${rule.color}10` }}
                              >
                                <CheckCircle2 
                                  className="w-5 h-5 flex-shrink-0" 
                                  style={{ color: rule.color }}
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-foreground">{sub.name}</span>
                                  <span className="text-muted-foreground"> - {sub.description}</span>
                                </div>
                                <span 
                                  className="text-lg font-arabic"
                                  style={{ fontFamily: "'Amiri', serif" }}
                                >
                                  {sub.example}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Maxraj */}
          <TabsContent value="makhraj" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mic className="w-6 h-6 text-primary" />
                  Harflarning chiqish joylari (Maxorij)
                </CardTitle>
                <p className="text-muted-foreground">
                  Har bir Arab harfi ma'lum bir joydan chiqadi. To'g'ri talaffuz uchun 
                  maxrajlarni bilish muhim.
                </p>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {makhrajRules.map((makhraj) => (
                <Card key={makhraj.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{makhraj.name}</h3>
                          <span 
                            className="text-lg font-arabic text-primary"
                            style={{ fontFamily: "'Amiri', serif" }}
                          >
                            {makhraj.arabicName}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{makhraj.description}</p>
                        <p className="text-sm text-muted-foreground mb-3">{makhraj.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                          {makhraj.letters.map((letter, index) => (
                            <div 
                              key={index}
                              className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-arabic text-primary border border-primary/20"
                              style={{ fontFamily: "'Amiri', serif" }}
                            >
                              {letter}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Amaliyot */}
          <TabsContent value="practice" className="space-y-6">
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <Music className="w-6 h-6" />
                  Amaliy mashqlar
                </CardTitle>
                <p className="text-muted-foreground">
                  Quyidagi oyatlarni o'qib, tajwid qoidalarini amalda qo'llang. 
                  Rangli harflarni bosib qoidani ko'ring.
                </p>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {practiceVerses.map((verse, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {verse.surah} : {verse.ayah}
                        </Badge>
                        <div className="flex flex-wrap gap-1.5">
                          {verse.rules.map((rule, rIndex) => (
                            <Badge 
                              key={rIndex} 
                              className="text-xs"
                              variant="secondary"
                            >
                              {rule}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <DuaAudioButton 
                        arabicText={verse.arabic}
                        label="Tinglash"
                        size="sm"
                        variant="outline"
                      />
                    </div>
                    <div className="bg-muted/50 rounded-xl p-6">
                      <p 
                        className="text-2xl md:text-3xl text-right leading-loose font-arabic"
                        style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                        dir="rtl"
                      >
                        <TajweedDisplay text={verse.arabic} />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="py-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Tajwidni o'rganish bo'yicha maslahatlar
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Ustoz bilan o'rganing</strong> - Tajwidni malakali 
                  ustoz bilan o'rganish eng yaxshi usul
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Har kuni mashq qiling</strong> - Muntazam amaliyot 
                  tajwidni mustahkamlaydi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Qori tinglang</strong> - Mashhur qorilarni tinglash 
                  to'g'ri talaffuzni o'rganishga yordam beradi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">O'zingizni yozib oling</strong> - O'z qiroatingizni 
                  yozib olib tahlil qiling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tajwid;
