import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";

interface PrayerTime {
  name: string;
  nameUz: string;
  time: string;
  passed: boolean;
  next?: boolean;
}

interface Location {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

const PrayerTimesWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      updatePrayerStatus();
    }
  }, [currentTime, prayerTimes.length]);

  const fetchPrayerTimes = async () => {
    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchTimesFromAPI(latitude, longitude);
          },
          async () => {
            // Default to Tashkent if location denied
            await fetchTimesFromAPI(41.2995, 69.2401);
            setLocation({ city: "Toshkent", country: "O'zbekiston", lat: 41.2995, lng: 69.2401 });
          }
        );
      } else {
        await fetchTimesFromAPI(41.2995, 69.2401);
        setLocation({ city: "Toshkent", country: "O'zbekiston", lat: 41.2995, lng: 69.2401 });
      }
    } catch {
      setLoading(false);
    }
  };

  const fetchTimesFromAPI = async (lat: number, lng: number) => {
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4`
      );
      const data = await response.json();

      if (data.code === 200) {
        const timings = data.data.timings;
        const meta = data.data.meta;
        
        setLocation({
          city: meta.timezone?.split('/')[1]?.replace('_', ' ') || "Noma'lum",
          country: "",
          lat,
          lng
        });

        const prayers: PrayerTime[] = [
          { name: "Fajr", nameUz: "Bomdod", time: timings.Fajr, passed: false },
          { name: "Sunrise", nameUz: "Quyosh", time: timings.Sunrise, passed: false },
          { name: "Dhuhr", nameUz: "Peshin", time: timings.Dhuhr, passed: false },
          { name: "Asr", nameUz: "Asr", time: timings.Asr, passed: false },
          { name: "Maghrib", nameUz: "Shom", time: timings.Maghrib, passed: false },
          { name: "Isha", nameUz: "Xufton", time: timings.Isha, passed: false },
        ];

        setPrayerTimes(prayers);
      }
    } catch {
      // Use fallback times
      setPrayerTimes([
        { name: "Fajr", nameUz: "Bomdod", time: "05:30", passed: false },
        { name: "Sunrise", nameUz: "Quyosh", time: "07:00", passed: false },
        { name: "Dhuhr", nameUz: "Peshin", time: "12:30", passed: false },
        { name: "Asr", nameUz: "Asr", time: "15:45", passed: false },
        { name: "Maghrib", nameUz: "Shom", time: "18:15", passed: false },
        { name: "Isha", nameUz: "Xufton", time: "19:45", passed: false },
      ]);
      setLocation({ city: "Toshkent", country: "O'zbekiston", lat: 41.2995, lng: 69.2401 });
    } finally {
      setLoading(false);
    }
  };

  const updatePrayerStatus = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const updatedTimes = prayerTimes.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      return {
        ...prayer,
        passed: currentMinutes > prayerMinutes,
        next: false
      };
    });

    // Find next prayer
    const nextPrayerIndex = updatedTimes.findIndex(p => !p.passed);
    if (nextPrayerIndex !== -1) {
      updatedTimes[nextPrayerIndex].next = true;
      
      // Calculate countdown
      const [hours, minutes] = updatedTimes[nextPrayerIndex].time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      const diffMinutes = prayerMinutes - currentMinutes;
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      
      if (diffHours > 0) {
        setCountdown(`${diffHours} soat ${remainingMinutes} daqiqa`);
      } else {
        setCountdown(`${remainingMinutes} daqiqa`);
      }
    } else {
      setCountdown("Ertangi Bomdod");
    }

    // Only update state if there are actual changes
    const hasChanges = updatedTimes.some((p, i) => 
      p.passed !== prayerTimes[i]?.passed || p.next !== prayerTimes[i]?.next
    );
    
    if (hasChanges) {
      setPrayerTimes(updatedTimes);
    }
  };

  const nextPrayer = prayerTimes.find(p => p.next);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Namoz vaqtlari
          </CardTitle>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {location.city}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Keyingi namoz</p>
                <p className="text-lg font-bold text-primary">{nextPrayer.nameUz}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{nextPrayer.time}</p>
                <p className="text-xs text-muted-foreground">{countdown} qoldi</p>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times List */}
        <div className="grid grid-cols-3 gap-2">
          {prayerTimes.filter(p => p.name !== 'Sunrise').map((prayer) => (
            <div
              key={prayer.name}
              className={`p-2 rounded-lg text-center transition-all ${
                prayer.next
                  ? "bg-primary text-primary-foreground"
                  : prayer.passed
                  ? "bg-muted/50 text-muted-foreground"
                  : "bg-muted/30"
              }`}
            >
              <p className="text-xs font-medium">{prayer.nameUz}</p>
              <p className={`text-sm font-bold ${prayer.next ? "" : ""}`}>
                {prayer.time}
              </p>
            </div>
          ))}
        </div>

        {/* Link to full page */}
        <Link 
          to="/prayer" 
          className="mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
        >
          Batafsil <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default PrayerTimesWidget;
