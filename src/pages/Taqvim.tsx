import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Moon, Sun, Star } from "lucide-react";
import Layout from "@/components/Layout";

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah"
];

const GREGORIAN_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

const IMPORTANT_DATES = [
  { hijriMonth: 0, day: 1, name: "Yangi Hijriy Yil", type: "holiday" },
  { hijriMonth: 0, day: 10, name: "Oshura kuni", type: "fasting" },
  { hijriMonth: 2, day: 12, name: "Mavlid an-Nabiy", type: "holiday" },
  { hijriMonth: 6, day: 27, name: "Isro va Me'roj", type: "holiday" },
  { hijriMonth: 7, day: 15, name: "Sha'bon o'rtasi", type: "special" },
  { hijriMonth: 8, day: 1, name: "Ramazon boshlanishi", type: "fasting" },
  { hijriMonth: 8, day: 27, name: "Laylatul Qadr", type: "special" },
  { hijriMonth: 9, day: 1, name: "Ro'za hayit", type: "holiday" },
  { hijriMonth: 11, day: 8, name: "Arafat kuni", type: "fasting" },
  { hijriMonth: 11, day: 10, name: "Qurbon hayit", type: "holiday" },
];

// Simple Hijri date conversion (approximate)
const gregorianToHijri = (date: Date): { year: number; month: number; day: number } => {
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + 
            Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - 
             Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  
  return { year, month: month - 1, day };
};

const Taqvim = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  const hijriDate = gregorianToHijri(today);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Islomiy Taqvim
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hijriy va Milodiy taqvimlar, muhim sana va bayramlar
            </p>
          </div>

          {/* Current Hijri Date Display */}
          <Card className="shadow-soft mb-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bugungi Hijriy sana</p>
                    <p className="text-2xl font-bold text-foreground">
                      {hijriDate.day} {HIJRI_MONTHS[hijriDate.month]} {hijriDate.year} H
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bugungi Milodiy sana</p>
                    <p className="text-2xl font-bold text-foreground">
                      {today.getDate()} {GREGORIAN_MONTHS[today.getMonth()]} {today.getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {GREGORIAN_MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        aspect-square p-1 flex items-center justify-center rounded-lg text-sm
                        ${day === null ? '' : 'hover:bg-muted cursor-pointer'}
                        ${isToday(day!) ? 'bg-primary text-primary-foreground font-bold' : ''}
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Muhim Sanalar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {IMPORTANT_DATES.map((date, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{date.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {date.day} {HIJRI_MONTHS[date.hijriMonth]}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            date.type === 'holiday' ? 'default' : 
                            date.type === 'fasting' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {date.type === 'holiday' ? 'Bayram' : 
                           date.type === 'fasting' ? 'Ro\'za' : 'Maxsus'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hijri Months Overview */}
          <Card className="shadow-soft mt-6">
            <CardHeader>
              <CardTitle>Hijriy Oylar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {HIJRI_MONTHS.map((month, index) => (
                  <div 
                    key={month}
                    className={`
                      p-3 rounded-lg text-center transition-colors cursor-pointer
                      ${index === hijriDate.month 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 hover:bg-muted'}
                    `}
                  >
                    <p className="text-xs text-muted-foreground mb-1">{index + 1}</p>
                    <p className="font-medium text-sm">{month}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </Layout>
  );
};

export default Taqvim;