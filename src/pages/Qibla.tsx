import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, Navigation, Locate, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const Qibla = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [isLocating, setIsLocating] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const { toast } = useToast();

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - 
              Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);
    
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;
    
    return qibla;
  };

  const calculateDistance = (lat: number, lng: number): string => {
    const R = 6371; // Earth's radius in km
    const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
    const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) * Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance > 1000 
      ? `${(distance / 1000).toFixed(1)} ming km` 
      : `${distance.toFixed(0)} km`;
  };

  const handleLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setQiblaDirection(calculateQiblaDirection(latitude, longitude));
          setDistance(calculateDistance(latitude, longitude));
          setIsLocating(false);
          toast({
            title: "Qibla yo'nalishi aniqlandi",
            description: "Kompas Ka'ba tomon yo'naltirildi",
          });
        },
        (error) => {
          setIsLocating(false);
          toast({
            title: "Xatolik",
            description: "Joylashuvni aniqlashda xatolik yuz berdi. Iltimos, GPS-ni yoqing.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Device orientation for compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading(event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const needleRotation = qiblaDirection !== null 
    ? qiblaDirection - compassHeading 
    : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Qibla Kompasi
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ka'ba yo'nalishini aniqlang va to'g'ri yo'nalishda namoz o'qing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compass Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Compass className="w-5 h-5 text-primary" />
                  Qibla Kompasi
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {/* Compass */}
                <div className="relative w-72 h-72 mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5" />
                  
                  {/* Direction markers */}
                  <div className="absolute inset-4 rounded-full border-2 border-border">
                    {['N', 'E', 'S', 'W'].map((dir, i) => (
                      <span
                        key={dir}
                        className="absolute font-bold text-lg"
                        style={{
                          top: i === 0 ? '8px' : i === 2 ? 'auto' : '50%',
                          bottom: i === 2 ? '8px' : 'auto',
                          left: i === 3 ? '8px' : i === 1 ? 'auto' : '50%',
                          right: i === 1 ? '8px' : 'auto',
                          transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)',
                        }}
                      >
                        {dir}
                      </span>
                    ))}
                  </div>

                  {/* Compass needle / Qibla indicator */}
                  <div 
                    className="absolute inset-8 flex items-center justify-center transition-transform duration-300"
                    style={{ transform: `rotate(${needleRotation}deg)` }}
                  >
                    <div className="relative w-full h-full">
                      {/* Needle pointing to Qibla */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[60px] border-l-transparent border-r-transparent border-b-primary" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[40px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                    </div>
                  </div>

                  {/* Center circle with Kaaba icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <span className="text-2xl">🕋</span>
                    </div>
                  </div>
                </div>

                {/* Qibla Direction Info */}
                {qiblaDirection !== null && (
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-bold text-primary">
                      {Math.round(qiblaDirection)}°
                    </p>
                    <p className="text-muted-foreground">
                      Qibla yo'nalishi (shimoldan soat strelkasi bo'yicha)
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleLocate} 
                  disabled={isLocating}
                  className="mt-6 gap-2"
                  size="lg"
                >
                  {isLocating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Aniqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Locate className="w-4 h-4" />
                      Joylashuvni aniqlash
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Joylashuv Ma'lumotlari
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {location ? (
                    <>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Sizning koordinatalaringiz</p>
                        <p className="font-mono text-lg">
                          {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10">
                        <p className="text-sm text-muted-foreground">Ka'bagacha masofa</p>
                        <p className="font-bold text-2xl text-primary">{distance}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Joylashuvni aniqlash uchun yuqoridagi tugmani bosing
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Foydalanish bo'yicha ko'rsatma</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Telefoningizni tekis joyga qo'ying</li>
                    <li>"Joylashuvni aniqlash" tugmasini bosing</li>
                    <li>GPS ruxsatini bering</li>
                    <li>Kompas strelkasi ko'rsatgan tomonga yuzlaning</li>
                    <li>Ka'ba tomonga yuz o'girib namoz o'qing</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-3 block">🕌</span>
                  <p className="text-sm text-muted-foreground italic">
                    "Qayerda bo'lsangiz, yuzingizni Masjidul-Harom tomonga bururing"
                  </p>
                  <p className="text-xs text-primary mt-2">— Baqara surasi, 144-oyat</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Qibla;