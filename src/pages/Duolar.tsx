import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Heart, Sun, Moon, Utensils, Car, BookMarked } from "lucide-react";
import Layout from "@/components/Layout";

interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: string;
}

const DUAS: Dua[] = [
  // Morning & Evening
  {
    id: "1",
    title: "Uyqudan uyg'onganda",
    arabic: "الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-lazii ahyana ba'da ma amatana wa ilayhin-nushur",
    translation: "Bizni o'ldirganidan so'ng yana tiriltirgan Allohga hamd bo'lsin. Qaytish faqat Unga",
    reference: "Buxoriy",
    category: "morning"
  },
  {
    id: "2",
    title: "Ertalab o'qiladigan duo",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah",
    translation: "Tongga chiqib qoldik, mulk esa Allohniki, hamd Allohga",
    reference: "Muslim",
    category: "morning"
  },
  {
    id: "3",
    title: "Kechqurun o'qiladigan duo",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah",
    translation: "Kechga kirib qoldik, mulk esa Allohniki, hamd Allohga",
    reference: "Muslim",
    category: "evening"
  },
  // Food
  {
    id: "4",
    title: "Ovqat yeyishdan oldin",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "Allohning nomi bilan",
    reference: "Abu Dovud",
    category: "food"
  },
  {
    id: "5",
    title: "Ovqat yeb bo'lgach",
    arabic: "الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-lazii at'amanii haza wa razaqaniihi min ghayri hawlin minnii wa la quwwah",
    translation: "Meni bu bilan to'ydirgan va mendan hech kuch-quvvatsiz rizq bergan Allohga hamd",
    reference: "Termiziy",
    category: "food"
  },
  // Travel
  {
    id: "6",
    title: "Safarga chiqqanda",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-lazii sakhkhara lana haza wa ma kunna lahu muqriniin wa inna ila Rabbina lamunqalibun",
    translation: "Buni bizga bo'ysundirgan zot pokdir, aks holda biz buni qila olmas edik. Albatta biz Rabbimizga qaytguvchidirmiz",
    reference: "Zuxruf surasi, 13-14",
    category: "travel"
  },
  {
    id: "7",
    title: "Uydan chiqqanda",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah",
    translation: "Allohning nomi bilan, Allohga tavakkal qildim, kuch-quvvat faqat Allohdandir",
    reference: "Abu Dovud",
    category: "travel"
  },
  // Sleep
  {
    id: "8",
    title: "Uxlashdan oldin",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismikallahumma amutu wa ahya",
    translation: "Ey Alloh, Sening isming bilan o'laman va tirilaman",
    reference: "Buxoriy",
    category: "sleep"
  },
  {
    id: "9",
    title: "Ayatul Kursi (uxlashdan oldin)",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    transliteration: "Allahu la ilaha illa huwal-hayyul-qayyum...",
    translation: "Alloh - Undan o'zga hech qanday iloh yo'q. U tirik va barhayotdir...",
    reference: "Baqara surasi, 255",
    category: "sleep"
  },
  // Protection
  {
    id: "10",
    title: "Himoya so'rash duosi",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'uzzu bikalimatil-lahit-tammati min sharri ma khalaq",
    translation: "Yaratilgan narsalarning yomonliklaridan Allohning mukammal so'zlari bilan panoh tilayman",
    reference: "Muslim",
    category: "protection"
  },
  {
    id: "11",
    title: "Yomonlikdan saqlanish",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'uzzu bika minal-hammi wal-hazan",
    translation: "Ey Alloh, g'am-tashvish va qayg'udan Senga sig'inaman",
    reference: "Buxoriy",
    category: "protection"
  },
];

const CATEGORIES = [
  { id: "all", label: "Barchasi", icon: BookOpen },
  { id: "morning", label: "Ertalab", icon: Sun },
  { id: "evening", label: "Kechqurun", icon: Moon },
  { id: "food", label: "Ovqat", icon: Utensils },
  { id: "travel", label: "Safar", icon: Car },
  { id: "sleep", label: "Uxlash", icon: Moon },
  { id: "protection", label: "Himoya", icon: Heart },
];

const Duolar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDuas = DUAS.filter(dua => {
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Duolar To'plami
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kundalik hayotda o'qiladigan duolar - Qur'on va Hadislardan
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Duo qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Duas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDuas.map((dua) => (
              <Card key={dua.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{dua.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {CATEGORIES.find(c => c.id === dua.category)?.label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(dua.id)}
                      className={favorites.includes(dua.id) ? "text-red-500" : ""}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(dua.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Arabic */}
                  <div className="p-4 rounded-lg bg-primary/5 text-right">
                    <p className="text-2xl font-arabic leading-loose">{dua.arabic}</p>
                  </div>
                  
                  {/* Transliteration */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Talaffuz:</p>
                    <p className="text-sm italic">{dua.transliteration}</p>
                  </div>
                  
                  {/* Translation */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ma'nosi:</p>
                    <p className="text-sm">{dua.translation}</p>
                  </div>
                  
                  {/* Reference */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <BookMarked className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{dua.reference}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDuas.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Hech qanday duo topilmadi</p>
            </div>
          )}
      </div>
    </Layout>
  );
};

export default Duolar;