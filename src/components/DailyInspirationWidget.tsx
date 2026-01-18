import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DailyContent {
  text: string;
  reference: string;
  translation?: string;
}

const hadithCollection: DailyContent[] = [
  {
    text: "Amallar niyatlarga bog'liqdir",
    reference: "Buxoriy, Muslim",
    translation: "Har bir amal niyatga qarab baholanadi"
  },
  {
    text: "Eng yaxshi so'z Allohning kitobi va eng yaxshi yo'l Muhammadning yo'lidir",
    reference: "Muslim",
    translation: "Qur'on va Sunnatga amal qilish eng to'g'ri yo'ldir"
  },
  {
    text: "Musulmon musulmonning birodardir",
    reference: "Buxoriy",
    translation: "Birodarlik va birlik muhimdir"
  },
  {
    text: "Kim Allohga va oxirat kuniga iymon keltirsa, yaxshi so'z aytsin yoki sukut saqlasin",
    reference: "Buxoriy, Muslim",
    translation: "So'zlarimizga ehtiyot bo'lish kerak"
  },
  {
    text: "Jannat onalarning oyoqlari ostidadir",
    reference: "Nasaiy",
    translation: "Onalarga hurmat eng ulug' amallardan"
  },
  {
    text: "Ilm o'rganish har bir musulmonga farzdir",
    reference: "Ibn Mojah",
    translation: "Bilim olish barchaga majburiydir"
  },
  {
    text: "Kuchli odam boshqalarni yiqitadigan emas, g'azab paytida o'zini tutib turadigan kishidir",
    reference: "Buxoriy, Muslim",
    translation: "Haqiqiy kuch - o'zini boshqarishda"
  }
];

const ayatCollection: DailyContent[] = [
  {
    text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    reference: "Inshiroh surasi, 6-oyat",
    translation: "Albatta, qiyinchilik bilan osonlik bor"
  },
  {
    text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    reference: "Taloq surasi, 3-oyat",
    translation: "Kim Allohga tavakkul qilsa, Alloh unga kifoya qiladi"
  },
  {
    text: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    reference: "Baqara surasi, 152-oyat",
    translation: "Meni zikr qilinglar, Men ham sizlarni zikr qilaman"
  },
  {
    text: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    reference: "Yusuf surasi, 87-oyat",
    translation: "Allohning rahmatidan umidsiz bo'lmanglar"
  },
  {
    text: "رَبِّ زِدْنِي عِلْمًا",
    reference: "Toho surasi, 114-oyat",
    translation: "Rabbim, ilmimni ziyoda qil"
  },
  {
    text: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    reference: "Hud surasi, 115-oyat",
    translation: "Sabr qil, Alloh yaxshilik qiluvchilarning ajrini zoe qilmaydi"
  },
  {
    text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    reference: "Baqara surasi, 153-oyat",
    translation: "Albatta, Alloh sabr qiluvchilar bilandir"
  }
];

const getDailyIndex = (collection: DailyContent[]) => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear % collection.length;
};

export const DailyInspirationWidget = () => {
  const [activeTab, setActiveTab] = useState<'ayat' | 'hadith'>('ayat');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const dailyAyat = ayatCollection[(getDailyIndex(ayatCollection) + refreshKey) % ayatCollection.length];
  const dailyHadith = hadithCollection[(getDailyIndex(hadithCollection) + refreshKey) % hadithCollection.length];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            Kunlik ilhom
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ayat' | 'hadith')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ayat" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Oyat
            </TabsTrigger>
            <TabsTrigger value="hadith" className="flex items-center gap-1">
              <Quote className="h-4 w-4" />
              Hadis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ayat" className="mt-0">
            <div className="space-y-3">
              <p className="text-xl font-arabic text-right leading-loose text-foreground">
                {dailyAyat.text}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {dailyAyat.translation}
              </p>
              <p className="text-xs text-primary font-medium">
                — {dailyAyat.reference}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="hadith" className="mt-0">
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-foreground">
                "{dailyHadith.text}"
              </p>
              {dailyHadith.translation && (
                <p className="text-sm text-muted-foreground italic">
                  {dailyHadith.translation}
                </p>
              )}
              <p className="text-xs text-primary font-medium">
                — {dailyHadith.reference}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
