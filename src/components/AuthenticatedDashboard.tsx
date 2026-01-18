import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Bot, Compass, BookText, Calendar, 
  Flame, Trophy, ArrowRight, User, Star, Bookmark,
  Moon, Mic, HandHeart, Calculator
} from "lucide-react";
import { useStreaks, BADGE_DEFINITIONS } from "@/hooks/useStreaks";
import { useReadingPlan, getDailySurahPlan } from "@/hooks/useReadingPlan";
import { useAllSurahs } from "@/hooks/useQuran";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PrayerTimesWidget from "./PrayerTimesWidget";
import { DailyInspirationWidget } from "./DailyInspirationWidget";
import { IslamicCalendarWidget } from "./IslamicCalendarWidget";

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
}

const AuthenticatedDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentSurahs, setRecentSurahs] = useState<number[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const { streak, badges, isLoadingStreak, isLoadingBadges } = useStreaks();
  const { activePlan, getProgress, getTodaySurahs } = useReadingPlan();
  const { data: allSurahs } = useAllSurahs();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileData) setProfile(profileData);

    // Fetch recent reading history
    const { data: historyData } = await supabase
      .from('reading_history')
      .select('surah_number')
      .eq('user_id', user.id)
      .order('read_at', { ascending: false })
      .limit(5);
    
    if (historyData) {
      const uniqueSurahs = [...new Set(historyData.map(h => h.surah_number))];
      setRecentSurahs(uniqueSurahs.slice(0, 3));
    }

    // Fetch bookmark count
    const { count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (count !== null) setBookmarkCount(count);
  };

  const getSurahName = (number: number) => {
    const surah = allSurahs?.find(s => s.number === number);
    return surah ? surah.englishName : `Surah ${number}`;
  };

  const quickLinks = [
    { icon: BookOpen, title: "Qur'on", description: "O'qish va tinglash", link: "/quran", color: "text-emerald-600" },
    { icon: Bot, title: "AI Yordamchi", description: "Savollaringizga javob", link: "/ai", color: "text-blue-600" },
    { icon: BookText, title: "Hadislar", description: "Sahih to'plamlar", link: "/hadith", color: "text-purple-600" },
    { icon: Compass, title: "Qibla", description: "Yo'nalish topish", link: "/qibla", color: "text-rose-600" },
    { icon: Calendar, title: "Taqvim", description: "Islomiy sana", link: "/taqvim", color: "text-cyan-600" },
  ];

  const utilityLinks = [
    { icon: Mic, title: "Tajwid", link: "/tajwid" },
    { icon: HandHeart, title: "Amallar", link: "/amallar" },
    { icon: Moon, title: "Duolar", link: "/duolar" },
    { icon: Calculator, title: "Tasbih", link: "/tasbih" },
  ];

  const earnedBadgeTypes = badges?.map(b => b.badge_type) || [];
  const progress = getProgress();
  const todaySurahs = getTodaySurahs();

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Xayrli tong";
    if (hour < 17) return "Xayrli kun";
    if (hour < 21) return "Xayrli kech";
    return "Xayrli tun";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {greetingTime()}, {profile?.display_name || "Foydalanuvchi"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Bugun qanday ilm o'rganmoqchisiz?
          </p>
        </div>
        <Link to="/profile">
          <Button variant="outline" className="gap-2">
            <User className="w-4 h-4" />
            Profilim
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{streak?.current_streak || 0}</p>
                <p className="text-xs text-muted-foreground">Kunlik streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">{streak?.total_reading_days || 0}</p>
                <p className="text-xs text-muted-foreground">Jami kun</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">{badges?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Yutuqlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bookmark className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{bookmarkCount}</p>
                <p className="text-xs text-muted-foreground">Xatcho'plar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tezkor havolalar</CardTitle>
              <CardDescription>Eng ko'p ishlatiladigan bo'limlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link key={idx} to={item.link}>
                      <div className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-lighter/50 transition-all group cursor-pointer">
                        <Icon className={`w-6 h-6 ${item.color} mb-2 group-hover:scale-110 transition-transform`} />
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reading Plan */}
          {activePlan && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      O'qish rejasi
                    </CardTitle>
                    <CardDescription>
                      {activePlan.current_day}-kun / {activePlan.total_days} kun
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{progress.percentage}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress.percentage} className="h-2" />
                
                <div>
                  <p className="text-sm font-medium mb-2">Bugungi o'qish:</p>
                  <div className="flex flex-wrap gap-2">
                    {todaySurahs.slice(0, 4).map(surahNum => {
                      const isCompleted = activePlan.completed_surahs?.includes(surahNum);
                      return (
                        <Link key={surahNum} to={`/quran?surah=${surahNum}`}>
                          <Badge 
                            variant={isCompleted ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {surahNum}. {getSurahName(surahNum)}
                            {isCompleted && " ✓"}
                          </Badge>
                        </Link>
                      );
                    })}
                    {todaySurahs.length > 4 && (
                      <Badge variant="secondary">+{todaySurahs.length - 4} more</Badge>
                    )}
                  </div>
                </div>

                <Link to="/quran">
                  <Button variant="outline" className="w-full gap-2">
                    Davom ettirish <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recent Surahs */}
          {recentSurahs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Yaqinda o'qilgan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentSurahs.map(surahNum => (
                    <Link key={surahNum} to={`/quran?surah=${surahNum}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-3">
                        {surahNum}. {getSurahName(surahNum)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Inspiration Widget */}
          <DailyInspirationWidget />

          {/* Prayer Times Widget */}
          <PrayerTimesWidget />

          {/* Islamic Calendar Widget */}
          <IslamicCalendarWidget />

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Yutuqlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {BADGE_DEFINITIONS.slice(0, 5).map((badge) => {
                  const isEarned = earnedBadgeTypes.includes(badge.type);
                  return (
                    <div
                      key={badge.type}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        isEarned 
                          ? 'bg-amber-500/10 border border-amber-500/20' 
                          : 'bg-muted/30 opacity-40'
                      }`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      <span className="text-xl">{badge.icon}</span>
                    </div>
                  );
                })}
              </div>
              
              {badges && badges.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Oxirgi yutuq:</p>
                  <Badge variant="secondary" className="text-xs">
                    {BADGE_DEFINITIONS.find(b => b.type === badges[0]?.badge_type)?.icon} {badges[0]?.badge_name}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Utility Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Boshqa vositalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {utilityLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link key={idx} to={item.link}>
                      <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/50 transition-all text-center group">
                        <Icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="text-xs font-medium">{item.title}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Prompt */}
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Bot className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold">AI Yordamchi</p>
                  <p className="text-xs text-primary-foreground/80">Istalgan savol bering</p>
                </div>
              </div>
              <Link to="/ai">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-glow">
                  Savol berish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedDashboard;
