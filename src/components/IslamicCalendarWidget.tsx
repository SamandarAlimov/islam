import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Star, Moon, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
}

interface ImportantDate {
  day: number;
  month: number;
  name: string;
  description: string;
  type: 'holiday' | 'fasting' | 'special';
}

const hijriMonths = [
  "Muharram",
  "Safar", 
  "Rabi'ul-Avval",
  "Rabi'us-Soniy",
  "Jumadal-Ula",
  "Jumadas-Soniy",
  "Rajab",
  "Sha'bon",
  "Ramazon",
  "Shavvol",
  "Zulqa'da",
  "Zulhijja"
];

const importantDates: ImportantDate[] = [
  { day: 1, month: 1, name: "Yangi Hijriy yil", description: "Islomiy yangi yil boshlanishi", type: "holiday" },
  { day: 10, month: 1, name: "Oshuro kuni", description: "Muharram oyining 10-kuni", type: "fasting" },
  { day: 12, month: 3, name: "Mavlid", description: "Payg'ambarimiz tug'ilgan kun", type: "holiday" },
  { day: 27, month: 7, name: "Me'roj kechasi", description: "Osmon safari kechasi", type: "special" },
  { day: 15, month: 8, name: "Baro'at kechasi", description: "Sha'bon oyining 15-kechasi", type: "special" },
  { day: 1, month: 9, name: "Ramazon boshlanishi", description: "Muborak oy boshlanishi", type: "holiday" },
  { day: 27, month: 9, name: "Qadr kechasi", description: "Ming oydan afzal kecha", type: "special" },
  { day: 1, month: 10, name: "Ro'za hayit", description: "Iyd al-Fitr", type: "holiday" },
  { day: 9, month: 12, name: "Arafa kuni", description: "Zulhijja 9-kun", type: "fasting" },
  { day: 10, month: 12, name: "Qurbon hayit", description: "Iyd al-Adho", type: "holiday" },
];

const gregorianToHijri = (date: Date): HijriDate => {
  // Simplified Hijri calculation (approximate)
  const gregorianEpoch = 1721425.5;
  const hijriEpoch = 1948439.5;
  
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  
  const l = Math.floor(jd - hijriEpoch + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l1) / 5316) * Math.floor(50 * l1 / 17719) + 
            Math.floor(l1 / 5670) * Math.floor(43 * l1 / 15238);
  const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - 
             Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  const month = Math.floor(24 * l2 / 709);
  const day = l2 - Math.floor(709 * month / 24);
  const year = 30 * n + j - 30;

  return {
    day: day,
    month: month,
    monthName: hijriMonths[month - 1] || hijriMonths[0],
    year: year
  };
};

const getDaysUntil = (currentHijri: HijriDate, targetMonth: number, targetDay: number): number => {
  let daysUntil = 0;
  
  if (targetMonth > currentHijri.month || 
      (targetMonth === currentHijri.month && targetDay >= currentHijri.day)) {
    // Same year
    const monthsDiff = targetMonth - currentHijri.month;
    daysUntil = monthsDiff * 30 + (targetDay - currentHijri.day);
  } else {
    // Next year
    const monthsUntilEndOfYear = 12 - currentHijri.month;
    const daysInCurrentMonth = 30 - currentHijri.day;
    const monthsFromStart = targetMonth - 1;
    daysUntil = daysInCurrentMonth + (monthsUntilEndOfYear * 30) + (monthsFromStart * 30) + targetDay;
  }
  
  return Math.max(0, daysUntil);
};

const NOTIFICATION_STORAGE_KEY = 'islamic-calendar-notifications';

const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    toast.error("Bu brauzer bildirishnomalarni qo'llab-quvvatlamaydi");
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    toast.error("Bildirishnomalar bloklangan. Brauzer sozlamalaridan ruxsat bering.");
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

const sendNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'islamic-calendar',
    });
  }
};

export const IslamicCalendarWidget = () => {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<(ImportantDate & { daysUntil: number })[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Check notification permission and saved preference
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    
    const savedPreference = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (savedPreference === 'true' && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const hijri = gregorianToHijri(today);
    setHijriDate(hijri);

    // Calculate upcoming events
    const upcoming = importantDates
      .map(event => ({
        ...event,
        daysUntil: getDaysUntil(hijri, event.month, event.day)
      }))
      .filter(event => event.daysUntil <= 60) // Show events within 60 days
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3);

    setUpcomingEvents(upcoming);
    
    // Check for today's events and send notification
    if (notificationsEnabled) {
      const todayEvents = upcoming.filter(e => e.daysUntil === 0);
      todayEvents.forEach(event => {
        const notifiedKey = `notified-${event.name}-${hijri.year}`;
        if (!localStorage.getItem(notifiedKey)) {
          sendNotification(
            `🌙 ${event.name}`,
            `Bugun ${event.description}. Muborak bo'lsin!`
          );
          localStorage.setItem(notifiedKey, 'true');
        }
      });
      
      // Check for upcoming events (1 day before)
      const tomorrowEvents = upcoming.filter(e => e.daysUntil === 1);
      tomorrowEvents.forEach(event => {
        const reminderKey = `reminder-${event.name}-${hijri.year}`;
        if (!localStorage.getItem(reminderKey)) {
          sendNotification(
            `📅 Ertaga: ${event.name}`,
            `Ertaga ${event.description} bo'ladi.`
          );
          localStorage.setItem(reminderKey, 'true');
        }
      });
    }
  }, [notificationsEnabled]);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        setNotificationPermission('granted');
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
        toast.success("Bildirishnomalar yoqildi! Muhim sanalar haqida xabar olasiz.");
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false');
      toast.info("Bildirishnomalar o'chirildi");
    }
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      sendNotification(
        '🌙 Test bildirishnomasi',
        'Islomiy taqvim bildirishnomalari ishlayapti!'
      );
      toast.success("Test bildirishnomasi yuborildi");
    }
  };

  const getTypeColor = (type: ImportantDate['type']) => {
    switch (type) {
      case 'holiday': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'fasting': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'special': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-muted';
    }
  };

  const getTypeLabel = (type: ImportantDate['type']) => {
    switch (type) {
      case 'holiday': return 'Bayram';
      case 'fasting': return "Ro'za";
      case 'special': return 'Maxsus';
      default: return '';
    }
  };

  if (!hijriDate) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Islomiy taqvim
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleNotifications}
              title={notificationsEnabled ? "Bildirishnomalarni o'chirish" : "Bildirishnomalarni yoqish"}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        {notificationsEnabled && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Muhim sanalar haqida bildirishnoma olasiz
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              onClick={testNotification}
            >
              (test)
            </Button>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Hijri Date */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary">
            {hijriDate.day}
          </p>
          <p className="text-lg font-medium text-foreground">
            {hijriDate.monthName}
          </p>
          <p className="text-sm text-muted-foreground">
            {hijriDate.year} Hijriy
          </p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Star className="h-4 w-4" />
              Yaqinlashayotgan sanalar
            </p>
            <div className="space-y-2">
              {upcomingEvents.map((event, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.day} {hijriMonths[event.month - 1]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getTypeColor(event.type)}`}>
                      {getTypeLabel(event.type)}
                    </Badge>
                    {event.daysUntil === 0 ? (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Bugun!
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {event.daysUntil} kun
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingEvents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            60 kun ichida muhim sanalar yo'q
          </p>
        )}
      </CardContent>
    </Card>
  );
};
