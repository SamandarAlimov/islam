import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  Globe, 
  Search,
  Locate,
  Star,
  Users
} from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  facilities: string[];
  prayerTimes?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
  };
}

const SAMPLE_MOSQUES: Mosque[] = [
  {
    id: "1",
    name: "Toshkent Jome Masjidi",
    address: "Toshkent shahri, Mirzo Ulug'bek tumani",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 245,
    facilities: ["Parking", "Wudu Area", "Women Section", "Library"],
    prayerTimes: { fajr: "05:30", dhuhr: "13:00", asr: "16:30", maghrib: "19:45", isha: "21:15", jummah: "13:00" }
  },
  {
    id: "2", 
    name: "Minor Masjidi",
    address: "Toshkent shahri, Yakkasaroy tumani",
    distance: "2.5 km",
    rating: 4.9,
    reviews: 520,
    facilities: ["Parking", "Wudu Area", "Women Section", "Madrasah", "Library"],
    prayerTimes: { fajr: "05:30", dhuhr: "13:00", asr: "16:30", maghrib: "19:45", isha: "21:15", jummah: "13:00" }
  },
  {
    id: "3",
    name: "Xo'ja Ahror Vali Masjidi",
    address: "Toshkent shahri, Olmazor tumani",
    distance: "3.8 km",
    rating: 4.7,
    reviews: 189,
    facilities: ["Parking", "Wudu Area", "Women Section"],
    prayerTimes: { fajr: "05:30", dhuhr: "13:00", asr: "16:30", maghrib: "19:45", isha: "21:15", jummah: "13:00" }
  },
];

const Masjid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const filteredMosques = SAMPLE_MOSQUES.filter(mosque =>
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mosque.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
          toast({
            title: "Joylashuv aniqlandi",
            description: "Yaqin atrofdagi masjidlar ko'rsatilmoqda",
          });
        },
        (error) => {
          setIsLocating(false);
          toast({
            title: "Xatolik",
            description: "Joylashuvni aniqlashda xatolik yuz berdi",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Masjid Topish
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Yaqin atrofdagi masjidlarni toping va namoz vaqtlarini bilib oling
            </p>
          </div>

          {/* Search and Location */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Masjid nomi yoki manzil bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleLocate}
              disabled={isLocating}
              className="gap-2"
            >
              <Locate className="w-4 h-4" />
              {isLocating ? "Aniqlanmoqda..." : "Joylashuvni aniqlash"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mosque List */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Yaqin Masjidlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {filteredMosques.map((mosque) => (
                        <Card 
                          key={mosque.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedMosque?.id === mosque.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{mosque.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="w-4 h-4" />
                                  {mosque.address}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm text-primary font-medium flex items-center gap-1">
                                    <Navigation className="w-4 h-4" />
                                    {mosque.distance}
                                  </span>
                                  <span className="text-sm flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    {mosque.rating} ({mosque.reviews})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {mosque.facilities.map((facility) => (
                                    <Badge key={facility} variant="secondary" className="text-xs">
                                      {facility}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Selected Mosque Details */}
            <div>
              <Card className="shadow-soft sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Namoz Vaqtlari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMosque ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedMosque.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedMosque.address}</p>
                      </div>
                      
                      {selectedMosque.prayerTimes && (
                        <div className="space-y-2">
                          {Object.entries(selectedMosque.prayerTimes).map(([prayer, time]) => (
                            <div 
                              key={prayer}
                              className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                            >
                              <span className="capitalize font-medium">
                                {prayer === 'jummah' ? "Juma" : prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                              </span>
                              <span className="text-primary font-semibold">{time}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 space-y-2">
                        <Button className="w-full gap-2">
                          <Navigation className="w-4 h-4" />
                          Yo'nalishni ko'rsatish
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                          <Phone className="w-4 h-4" />
                          Bog'lanish
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Ma'lumotlarni ko'rish uchun masjidni tanlang
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Masjid;