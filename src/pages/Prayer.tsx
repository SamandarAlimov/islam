import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Compass } from "lucide-react";
import prayerFeature from "@/assets/prayer-feature.jpg";

const Prayer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample prayer times - in production this would use an API
  const prayerTimes = [
    { name: "Fajr", time: "05:23 AM", passed: true },
    { name: "Sunrise", time: "06:48 AM", passed: true },
    { name: "Dhuhr", time: "12:15 PM", passed: false, next: true },
    { name: "Asr", time: "03:42 PM", passed: false },
    { name: "Maghrib", time: "06:08 PM", passed: false },
    { name: "Isha", time: "07:33 PM", passed: false },
  ];

  const nextPrayer = prayerTimes.find(p => p.next);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Prayer Times
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accurate prayer times for your location. Never miss a prayer with our precise calculations.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-medium">
            <img 
              src={prayerFeature} 
              alt="Prayer Time" 
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Time & Location */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground">Tashkent, Uzbekistan</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lat: 41.2995° N, Lon: 69.2401° E
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Calculation Method: Umm al-Qura University, Makkah
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft bg-gradient-hero text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    Qibla Direction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">252° WSW</p>
                  <p className="text-sm opacity-90 mt-1">
                    Distance to Makkah: 3,847 km
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Prayer Times */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Today's Prayer Times</CardTitle>
                  <CardDescription>
                    {nextPrayer && `Next prayer: ${nextPrayer.name} at ${nextPrayer.time}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prayerTimes.map((prayer, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border transition-all ${
                          prayer.next
                            ? "border-primary bg-primary-lighter"
                            : prayer.passed
                            ? "border-border bg-muted/50 opacity-60"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {prayer.name}
                            </h3>
                            {prayer.next && (
                              <p className="text-xs text-primary font-medium mt-1">
                                Next Prayer
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                              {prayer.time}
                            </p>
                            {prayer.passed && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Passed
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Schedule */}
              <Card className="shadow-soft mt-6">
                <CardHeader>
                  <CardTitle>Monthly Schedule</CardTitle>
                  <CardDescription>View and export prayer times for the entire month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Monthly prayer schedule will be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Prayer;
