import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, BookMarked, History, BarChart3, BookOpen, 
  Calendar, Trophy, LogOut, Star 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useReadingHistory, useReadingPlan } from "@/hooks/useReadingPlan";
import { useAllSurahs } from "@/hooks/useQuran";
import ReadingPlanWidget from "@/components/ReadingPlanWidget";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { bookmarks, isLoading: isLoadingBookmarks } = useBookmarks();
  const { history, isLoading: isLoadingHistory } = useReadingHistory();
  const { activePlan, getProgress } = useReadingPlan();
  const { data: allSurahs } = useAllSurahs();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      setIsLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/');
  };

  const getSurahName = (number: number) => {
    const surah = allSurahs?.find(s => s.number === number);
    return surah ? surah.englishName : `Surah ${number}`;
  };

  const getStats = () => {
    const surahsRead = new Set(history?.map(h => h.surah_number) || []).size;
    const totalReadings = history?.length || 0;
    const bookmarksCount = bookmarks?.length || 0;
    const progress = getProgress();

    return { surahsRead, totalReadings, bookmarksCount, progress };
  };

  const stats = getStats();

  // Get favorite surahs (most read)
  const getFavoriteSurahs = () => {
    if (!history) return [];
    const surahCounts: { [key: number]: number } = {};
    history.forEach(h => {
      surahCounts[h.surah_number] = (surahCounts[h.surah_number] || 0) + 1;
    });
    return Object.entries(surahCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([surah, count]) => ({ surah: parseInt(surah), count }));
  };

  const favoriteSurahs = getFavoriteSurahs();

  if (isLoading) {
    return (
      <Layout showAIChat={false}>
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showAIChat={false}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Profile Header */}
          <Card className="shadow-soft mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.surahsRead}</p>
                <p className="text-sm text-muted-foreground">Surahs Read</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <History className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.totalReadings}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <BookMarked className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.bookmarksCount}</p>
                <p className="text-sm text-muted-foreground">Bookmarks</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.progress.percentage}%</p>
                <p className="text-sm text-muted-foreground">Plan Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Reading Plan */}
            <div className="lg:col-span-1">
              <ReadingPlanWidget onSurahSelect={(num) => navigate(`/quran?surah=${num}`)} />
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <Tabs defaultValue="bookmarks" className="w-full">
                  <CardHeader className="pb-0">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="bookmarks">
                        <BookMarked className="w-4 h-4 mr-2" />
                        Bookmarks
                      </TabsTrigger>
                      <TabsTrigger value="history">
                        <History className="w-4 h-4 mr-2" />
                        History
                      </TabsTrigger>
                      <TabsTrigger value="favorites">
                        <Star className="w-4 h-4 mr-2" />
                        Favorites
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <TabsContent value="bookmarks" className="mt-0">
                      {isLoadingBookmarks ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                        </div>
                      ) : bookmarks && bookmarks.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {bookmarks.map(bookmark => (
                            <button
                              key={bookmark.id}
                              onClick={() => navigate(`/quran?surah=${bookmark.surah_number}`)}
                              className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter transition-all text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {getSurahName(bookmark.surah_number)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Ayah {bookmark.ayah_number || 'All'}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(bookmark.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {bookmark.note && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{bookmark.note}"
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No bookmarks yet</p>
                          <Button variant="link" onClick={() => navigate('/quran')}>
                            Start reading the Quran
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-0">
                      {isLoadingHistory ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                        </div>
                      ) : history && history.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {history.map(item => (
                            <button
                              key={item.id}
                              onClick={() => navigate(`/quran?surah=${item.surah_number}`)}
                              className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter transition-all text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {getSurahName(item.surah_number)}
                                  </p>
                                  {item.ayah_number && (
                                    <p className="text-sm text-muted-foreground">
                                      Ayah {item.ayah_number}
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.read_at).toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No reading history yet</p>
                          <Button variant="link" onClick={() => navigate('/quran')}>
                            Start reading the Quran
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-0">
                      {favoriteSurahs.length > 0 ? (
                        <div className="space-y-3">
                          {favoriteSurahs.map(({ surah, count }, index) => (
                            <button
                              key={surah}
                              onClick={() => navigate(`/quran?surah=${surah}`)}
                              className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter transition-all text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground">
                                    {getSurahName(surah)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Read {count} times
                                  </p>
                                </div>
                                <Star className="w-5 h-5 text-primary" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No favorites yet</p>
                          <p className="text-sm text-muted-foreground">
                            Your most read surahs will appear here
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
