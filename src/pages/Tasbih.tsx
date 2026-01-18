import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Volume2, ChevronLeft, ChevronRight } from "lucide-react";

const NAMES_OF_ALLAH = [
  { arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
  { arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
  { arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King" },
  { arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
  { arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
  { arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith" },
  { arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector" },
  { arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty" },
  { arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller" },
  { arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme" },
  { arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator" },
  { arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver" },
  { arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner" },
  { arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiver" },
  { arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer" },
  { arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower" },
  { arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider" },
  { arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener" },
  { arabic: "الْعَلِيمُ", transliteration: "Al-Alim", meaning: "The All-Knowing" },
  { arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Constrictor" },
  { arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander" },
  { arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser" },
  { arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter" },
  { arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Bestower of Honor" },
  { arabic: "الْمُذِلُّ", transliteration: "Al-Mudhill", meaning: "The Humiliator" },
  { arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing" },
  { arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing" },
  { arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge" },
  { arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just" },
  { arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One" },
  { arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The All-Aware" },
  { arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing" },
  { arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent" },
  { arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The All-Forgiving" },
  { arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative" },
  { arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High" },
  { arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Most Great" },
  { arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver" },
  { arabic: "الْمُقِيتُ", transliteration: "Al-Muqit", meaning: "The Sustainer" },
  { arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner" },
  { arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic" },
  { arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous" },
  { arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful" },
  { arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive" },
  { arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing" },
  { arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise" },
  { arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Most Loving" },
  { arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious" },
  { arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector" },
  { arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness" },
  { arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth" },
  { arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee" },
  { arabic: "الْقَوِيُّ", transliteration: "Al-Qawiyy", meaning: "The Most Strong" },
  { arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm" },
  { arabic: "الْوَلِيُّ", transliteration: "Al-Waliyy", meaning: "The Protecting Friend" },
  { arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy" },
  { arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Accounter" },
  { arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator" },
  { arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer" },
  { arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life" },
  { arabic: "الْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Taker of Life" },
  { arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living" },
  { arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Subsisting" },
  { arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder" },
  { arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble" },
  { arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", meaning: "The One" },
  { arabic: "الْأَحَدُ", transliteration: "Al-Ahad", meaning: "The Unique" },
  { arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal" },
  { arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Able" },
  { arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful" },
  { arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter" },
  { arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer" },
  { arabic: "الْأَوَّلُ", transliteration: "Al-Awwal", meaning: "The First" },
  { arabic: "الْآخِرُ", transliteration: "Al-Akhir", meaning: "The Last" },
  { arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest" },
  { arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden" },
  { arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor" },
  { arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted" },
  { arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness" },
  { arabic: "التَّوَّابُ", transliteration: "At-Tawwab", meaning: "The Acceptor of Repentance" },
  { arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger" },
  { arabic: "الْعَفُوُّ", transliteration: "Al-Afuww", meaning: "The Pardoner" },
  { arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate" },
  { arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "Owner of Sovereignty" },
  { arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ", transliteration: "Dhul-Jalali wal-Ikram", meaning: "Lord of Majesty and Generosity" },
  { arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable" },
  { arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer" },
  { arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient" },
  { arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher" },
  { arabic: "الْمَانِعُ", transliteration: "Al-Mani", meaning: "The Withholder" },
  { arabic: "الضَّارُّ", transliteration: "Ad-Darr", meaning: "The Distresser" },
  { arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Propitious" },
  { arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light" },
  { arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide" },
  { arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Incomparable" },
  { arabic: "الْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting" },
  { arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor" },
  { arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path" },
  { arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient" },
];

const DHIKR_OPTIONS = [
  { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah", count: 33 },
  { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah", count: 33 },
  { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest", count: 34 },
  { arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah", count: 100 },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness from Allah", count: 100 },
];

const Tasbih = () => {
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_OPTIONS[0]);
  const [count, setCount] = useState(0);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  const handleCount = () => {
    if (count < selectedDhikr.count) {
      setCount(count + 1);
    }
  };

  const resetCount = () => setCount(0);

  const nextName = () => {
    setCurrentNameIndex((prev) => (prev + 1) % NAMES_OF_ALLAH.length);
  };

  const prevName = () => {
    setCurrentNameIndex((prev) => (prev - 1 + NAMES_OF_ALLAH.length) % NAMES_OF_ALLAH.length);
  };

  const currentName = NAMES_OF_ALLAH[currentNameIndex];

  return (
    <Layout>
      <div className="pb-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tasbih & Dhikr
          </h1>
          <p className="text-muted-foreground">
            Digital counter and 99 Names of Allah
          </p>
        </div>

        <Tabs defaultValue="counter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="counter">Dhikr Counter</TabsTrigger>
            <TabsTrigger value="names">99 Names of Allah</TabsTrigger>
          </TabsList>

          <TabsContent value="counter" className="space-y-6">
            {/* Dhikr Selection */}
            <div className="flex flex-wrap gap-2 justify-center">
              {DHIKR_OPTIONS.map((dhikr) => (
                <Badge
                  key={dhikr.transliteration}
                  variant={selectedDhikr.transliteration === dhikr.transliteration ? "default" : "outline"}
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() => {
                    setSelectedDhikr(dhikr);
                    setCount(0);
                  }}
                >
                  {dhikr.transliteration}
                </Badge>
              ))}
            </div>

            {/* Counter Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="text-5xl md:text-6xl font-arabic text-primary mb-2">
                    {selectedDhikr.arabic}
                  </div>
                  <div className="text-xl text-muted-foreground">
                    {selectedDhikr.transliteration}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    "{selectedDhikr.meaning}"
                  </div>

                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - count / selectedDhikr.count)}
                        className="transition-all duration-200"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{count}</span>
                      <span className="text-sm text-muted-foreground">/ {selectedDhikr.count}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      size="lg"
                      className="w-32 h-32 rounded-full text-xl shadow-lg"
                      onClick={handleCount}
                      disabled={count >= selectedDhikr.count}
                    >
                      {count >= selectedDhikr.count ? "Done!" : "Tap"}
                    </Button>
                  </div>

                  <Button variant="outline" onClick={resetCount} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="names" className="space-y-6">
            {/* Featured Name */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-8">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={prevName}>
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  
                  <div className="text-center space-y-4">
                    <Badge variant="secondary" className="mb-2">
                      {currentNameIndex + 1} / 99
                    </Badge>
                    <div className="text-6xl md:text-7xl font-arabic text-primary">
                      {currentName.arabic}
                    </div>
                    <div className="text-xl font-semibold">
                      {currentName.transliteration}
                    </div>
                    <div className="text-muted-foreground">
                      "{currentName.meaning}"
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" onClick={nextName}>
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* All Names Grid */}
            <Card>
              <CardHeader>
                <CardTitle>All 99 Names</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {NAMES_OF_ALLAH.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentNameIndex(index)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          currentNameIndex === index 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs opacity-60">{index + 1}</span>
                          <div>
                            <div className="font-arabic text-lg">{name.arabic}</div>
                            <div className="text-xs opacity-80">{name.transliteration}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tasbih;
