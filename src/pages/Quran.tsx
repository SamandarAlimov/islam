import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Volume2, BookMarked } from "lucide-react";
import quranFeature from "@/assets/quran-feature.jpg";
import { useAllSurahs } from "@/hooks/useQuran";
import QuranReader from "@/components/QuranReader";

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [verseSearchQuery, setVerseSearchQuery] = useState("");
  const { data: surahs, isLoading } = useAllSurahs();

  // Filter surahs based on search
  const filteredSurahs = surahs?.filter((surah) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      surah.name.toLowerCase().includes(query) ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  if (selectedSurah) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <QuranReader 
            surahNumber={selectedSurah} 
            onClose={() => setSelectedSurah(null)}
            searchQuery={verseSearchQuery}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The Noble Qur'an
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read, listen, and understand the Qur'an with authentic translations, 
              word-by-word analysis, and scholarly Tafsir from Ibn Kathir, At-Tabari, and more.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-medium">
            <img 
              src={quranFeature} 
              alt="Quran" 
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Search */}
          <Card className="mb-8 shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by Surah name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search within verses (enter and select surah)..."
                    value={verseSearchQuery}
                    onChange={(e) => setVerseSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Complete Text</CardTitle>
                <CardDescription>
                  All 114 Surahs in original Uthmani script with multiple translations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-3">
                  <Volume2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Audio Recitations</CardTitle>
                <CardDescription>
                  Listen to renowned reciters including Mishary, Sudais, and Afasy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-3">
                  <BookMarked className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Scholarly Tafsir</CardTitle>
                <CardDescription>
                  In-depth explanations from Ibn Kathir, At-Tabari, and Al-Jalalayn
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Surahs List */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Browse Surahs</CardTitle>
              <CardDescription>
                {isLoading 
                  ? "Loading all 114 Surahs..." 
                  : `All 114 Surahs of the Holy Qur'an${searchQuery ? ` (${filteredSurahs?.length || 0} results)` : ""}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSurahs?.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => setSelectedSurah(surah.number)}
                      className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                            {surah.number}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {surah.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {surah.englishName} - {surah.englishNameTranslation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {surah.numberOfAyahs} verses
                          </p>
                          <p className="text-xs text-muted-foreground">{surah.revelationType}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredSurahs?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No surahs found matching your search.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </Layout>
  );
};

export default Quran;
