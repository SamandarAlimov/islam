import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Star, 
  Circle, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset
} from "lucide-react";

interface PrayerType {
  id: string;
  name: string;
  arabic: string;
  description: string;
  ruling: string;
  details: string[];
  examples?: string[];
}

const FARZ_PRAYERS: PrayerType[] = [
  {
    id: "farz-ayn",
    name: "Farz Ayn",
    arabic: "فرض عين",
    description: "Har bir musulmonga shaxsan vojib bo'lgan amallar",
    ruling: "Tark etish katta gunoh, inkor etish kufr",
    details: [
      "Besh vaqt namoz o'qish",
      "Ramazon oyida ro'za tutish",
      "Zakot berish (nisob miqdoriga yetganda)",
      "Hajga borish (imkoniyat bo'lganda)",
      "Janoza namozi (kifoya bo'lmasa)"
    ],
    examples: [
      "Bomdod namozi - 2 rakat farz",
      "Peshin namozi - 4 rakat farz",
      "Asr namozi - 4 rakat farz",
      "Shom namozi - 3 rakat farz",
      "Xufton namozi - 4 rakat farz"
    ]
  },
  {
    id: "farz-kifoya",
    name: "Farz Kifoya",
    arabic: "فرض كفاية",
    description: "Jamiyatda ba'zilar bajarsa, boshqalardan soqit bo'ladigan farzlar",
    ruling: "Hech kim bajarmasa, hammasi gunohkor bo'ladi",
    details: [
      "Janoza namozi o'qish",
      "Salomga javob berish",
      "Aksirgan kishiga 'yarhamukalloh' deyish",
      "Ilm o'rganish va o'rgatish",
      "Amr bil ma'ruf va nahy anil munkar"
    ]
  }
];

const VOJIB_PRAYERS: PrayerType[] = [
  {
    id: "vojib-namoz",
    name: "Vojib namozlar",
    arabic: "واجب",
    description: "Farzdan keyingi darajadagi majburiy amallar",
    ruling: "Tark etish gunoh, lekin inkor etish kufr emas",
    details: [
      "Vitr namozi - 3 rakat",
      "Hayit namozlari (Ro'za va Qurbon hayiti)",
      "Sajdai sahv (namozda xato qilinganda)",
      "Sajdai tilovat (Qur'on o'qiganda)",
      "Nazr namozi (o'ziga vojib qilgan kishi uchun)"
    ],
    examples: [
      "Vitr namozi - Xuftondan keyin 3 rakat",
      "Hayit namozi - 2 rakat, takbirlar bilan",
      "Sajdai sahv - Namoz oxirida 2 sajda"
    ]
  }
];

const SUNNAT_PRAYERS: PrayerType[] = [
  {
    id: "sunnat-muakkada",
    name: "Sunnat Muakkada",
    arabic: "سنة مؤكدة",
    description: "Payg'ambarimiz (s.a.v) doimiy ravishda bajargan sunnatlar",
    ruling: "Tark etish makruh, doimiy tark etish gunoh",
    details: [
      "Bomdod farzidan oldin 2 rakat",
      "Peshin farzidan oldin 4 rakat",
      "Peshin farzidan keyin 2 rakat",
      "Shom farzidan keyin 2 rakat",
      "Xufton farzidan keyin 2 rakat"
    ],
    examples: [
      "Bomdod - 2 rakat sunnat (eng fazilatli)",
      "Peshin - 4+2 rakat sunnat",
      "Shom - 2 rakat sunnat",
      "Xufton - 2 rakat sunnat"
    ]
  },
  {
    id: "sunnat-ghayr-muakkada",
    name: "Sunnat G'ayr Muakkada",
    arabic: "سنة غير مؤكدة",
    description: "Payg'ambarimiz (s.a.v) ba'zan bajargan sunnatlar",
    ruling: "Bajarish savobli, tark etish gunoh emas",
    details: [
      "Asr farzidan oldin 4 rakat",
      "Shom farzidan oldin 2 rakat",
      "Xufton farzidan oldin 2 rakat",
      "Zuho (Chosht) namozi",
      "Avvobin namozi"
    ]
  }
];

const NAFL_PRAYERS: PrayerType[] = [
  {
    id: "nafl-general",
    name: "Nafl namozlar",
    arabic: "نفل",
    description: "Ixtiyoriy ravishda o'qiladigan qo'shimcha namozlar",
    ruling: "O'qish savobli, o'qimaslik gunoh emas",
    details: [
      "Tahajjud namozi - kechasi o'qiladi",
      "Isroq namozi - quyosh chiqqandan keyin",
      "Zuho (Chosht) namozi - kun o'rtasida",
      "Avvobin namozi - Shomdan keyin",
      "Tahiyyatul masjid - Masjidga kirganda"
    ],
    examples: [
      "Tahajjud - 2 dan 12 rakatgacha",
      "Zuho - 2 dan 12 rakatgacha",
      "Avvobin - 6 rakat",
      "Tahiyyatul masjid - 2 rakat"
    ]
  },
  {
    id: "special-nafl",
    name: "Maxsus nafl namozlar",
    arabic: "صلوات خاصة",
    description: "Muayyan vaqt yoki sabablarga bog'liq nafl namozlar",
    ruling: "Sababiga ko'ra o'qish tavsiya etiladi",
    details: [
      "Istixora namozi - biror ishda maslahat so'rash",
      "Tawba namozi - tavba qilish uchun",
      "Hojat namozi - ehtiyoj uchun",
      "Shukr namozi - ne'mat uchun shukr",
      "Kusuf/Xusuf - Quyosh/Oy tutilganda"
    ]
  }
];

const MAKRUH_TIMES = [
  {
    time: "Quyosh chiqayotganda",
    icon: Sunrise,
    description: "Quyosh to'liq chiqqunicha namoz o'qish makruh"
  },
  {
    time: "Quyosh tepada turganda",
    icon: Sun,
    description: "Zavol vaqti - Quyosh eng tepada turgan payt"
  },
  {
    time: "Quyosh botayotganda",
    icon: Sunset,
    description: "Quyosh to'liq botqunicha namoz o'qish makruh"
  }
];

const NamozTurlari = () => {
  const [activeTab, setActiveTab] = useState("farz");

  const renderPrayerCard = (prayer: PrayerType, color: string) => (
    <Card key={prayer.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {prayer.name}
              <span className="text-muted-foreground font-amiri text-xl">
                {prayer.arabic}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {prayer.description}
            </p>
          </div>
          <Badge variant="outline" className={color}>
            {prayer.ruling.split(',')[0]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Tafsilotlar
          </h4>
          <ul className="space-y-1">
            {prayer.details.map((detail, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <Circle className="h-2 w-2 mt-1.5 fill-current" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
        
        {prayer.examples && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Misollar
            </h4>
            <ul className="space-y-1">
              {prayer.examples.map((example, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Star className="h-3 w-3 mt-1 text-amber-500" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout showAIChat={false}>
      <div className="container mx-auto px-4 pb-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Namoz Turlari</h1>
          <p className="text-muted-foreground">
            Farz, Vojib, Sunnat va Nafl namozlar haqida to'liq ma'lumot
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="farz" className="text-xs sm:text-sm">
              Farz
            </TabsTrigger>
            <TabsTrigger value="vojib" className="text-xs sm:text-sm">
              Vojib
            </TabsTrigger>
            <TabsTrigger value="sunnat" className="text-xs sm:text-sm">
              Sunnat
            </TabsTrigger>
            <TabsTrigger value="nafl" className="text-xs sm:text-sm">
              Nafl
            </TabsTrigger>
            <TabsTrigger value="makruh" className="text-xs sm:text-sm">
              Makruh
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <TabsContent value="farz" className="mt-0">
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Farz haqida</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Farz - Alloh taolo tomonidan qat'iy buyurilgan amallar. Bajarish majburiy, 
                  tark etish katta gunoh, inkor etish esa kufr hisoblanadi.
                </p>
              </div>
              {FARZ_PRAYERS.map(prayer => renderPrayerCard(prayer, "border-red-500 text-red-600"))}
            </TabsContent>

            <TabsContent value="vojib" className="mt-0">
              <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-orange-700 dark:text-orange-400">Vojib haqida</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vojib - Farzdan keyingi darajadagi majburiy amallar. Hanafiy mazhabida farz va 
                  vojib orasida farq bor. Tark etish gunoh, lekin inkor etish kufr emas.
                </p>
              </div>
              {VOJIB_PRAYERS.map(prayer => renderPrayerCard(prayer, "border-orange-500 text-orange-600"))}
            </TabsContent>

            <TabsContent value="sunnat" className="mt-0">
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-green-700 dark:text-green-400">Sunnat haqida</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sunnat - Payg'ambarimiz Muhammad (s.a.v) ning amallari. Muakkada (kuchli) va 
                  g'ayr muakkada (oddiy) turlarga bo'linadi. Bajarish katta savob.
                </p>
              </div>
              {SUNNAT_PRAYERS.map(prayer => renderPrayerCard(prayer, "border-green-500 text-green-600"))}
            </TabsContent>

            <TabsContent value="nafl" className="mt-0">
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">Nafl haqida</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nafl - Ixtiyoriy ravishda o'qiladigan qo'shimcha namozlar. O'qish katta savob, 
                  o'qimaslik esa gunoh emas. Allohga yaqinlashish uchun eng yaxshi vosita.
                </p>
              </div>
              {NAFL_PRAYERS.map(prayer => renderPrayerCard(prayer, "border-blue-500 text-blue-600"))}
            </TabsContent>

            <TabsContent value="makruh" className="mt-0">
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">Makruh vaqtlar</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Makruh vaqtlarda nafl namoz o'qish taqiqlanadi. Farz namozlarni o'z vaqtida 
                  o'qish kerak va bu vaqtlarga to'g'ri kelmaydi.
                </p>
              </div>

              <div className="grid gap-4">
                {MAKRUH_TIMES.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="p-3 bg-yellow-500/10 rounded-full">
                        <item.icon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.time}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Besh vaqt namoz jadvali
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Namoz</th>
                          <th className="text-center py-2">Sunnat</th>
                          <th className="text-center py-2">Farz</th>
                          <th className="text-center py-2">Sunnat</th>
                          <th className="text-center py-2">Vojib</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Bomdod</td>
                          <td className="text-center text-green-600">2</td>
                          <td className="text-center text-red-600">2</td>
                          <td className="text-center">-</td>
                          <td className="text-center">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Peshin</td>
                          <td className="text-center text-green-600">4</td>
                          <td className="text-center text-red-600">4</td>
                          <td className="text-center text-green-600">2</td>
                          <td className="text-center">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Asr</td>
                          <td className="text-center text-blue-600">(4)</td>
                          <td className="text-center text-red-600">4</td>
                          <td className="text-center">-</td>
                          <td className="text-center">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Shom</td>
                          <td className="text-center">-</td>
                          <td className="text-center text-red-600">3</td>
                          <td className="text-center text-green-600">2</td>
                          <td className="text-center">-</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Xufton</td>
                          <td className="text-center text-blue-600">(4)</td>
                          <td className="text-center text-red-600">4</td>
                          <td className="text-center text-green-600">2</td>
                          <td className="text-center text-orange-600">3</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        Farz
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        Vojib (Vitr)
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        Sunnat Muakkada
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        Sunnat G'ayr Muakkada
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NamozTurlari;
