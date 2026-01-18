import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bookmark, BookmarkCheck, Type, Palette, Info, Brain, Flame } from "lucide-react";
import { useSurah, useAyahTafsir } from "@/hooks/useQuran";
import { fetchVerseTranslation } from "@/services/quranService";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";
import WordByWordAnalysis from "@/components/WordByWordAnalysis";
import TajweedDisplay, { TAJWEED_LEGEND } from "@/components/TajweedDisplay";
import SocialShare from "@/components/SocialShare";
import AudioPlayer from "@/components/AudioPlayer";
import OfflineManager from "@/components/OfflineManager";
import ReadingSettingsPanel, { useReadingSettings } from "@/components/ReadingSettings";
import HifzMode from "@/components/HifzMode";
import StudyGroups from "@/components/StudyGroups";
import { useStreaks } from "@/hooks/useStreaks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuranReaderProps {
  surahNumber: number;
  onClose: () => void;
  searchQuery?: string;
}

const QuranReader = ({ surahNumber, onClose, searchQuery }: QuranReaderProps) => {
  const { data: surah, isLoading } = useSurah(surahNumber);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translations, setTranslations] = useState<{ [key: number]: string }>({});
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [showTajweed, setShowTajweed] = useState(false);
  const [expandedWordAnalysis, setExpandedWordAnalysis] = useState<number | null>(null);
  const [showHifzMode, setShowHifzMode] = useState(false);
  const [hasRecordedActivity, setHasRecordedActivity] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addBookmark, removeBookmark, isBookmarked, getBookmark } = useBookmarks();
  const { settings, setSettings } = useReadingSettings();
  const { streak, recordActivity } = useStreaks();

  const { data: tafsir, isLoading: isLoadingTafsir } = useAyahTafsir(
    surahNumber,
    selectedAyah
  );

  // Load translations when showTranslation is enabled
  useEffect(() => {
    if (showTranslation && surah?.verses) {
      surah.verses.forEach(async (verse) => {
        if (!translations[verse.numberInSurah]) {
          const translation = await fetchVerseTranslation(surahNumber, verse.numberInSurah);
          setTranslations(prev => ({ ...prev, [verse.numberInSurah]: translation }));
        }
      });
    }
  }, [showTranslation, surah, surahNumber]);

  // Record reading activity for streak tracking (once per session)
  useEffect(() => {
    if (surah && !hasRecordedActivity) {
      recordActivity.mutate();
      setHasRecordedActivity(true);
    }
  }, [surah, hasRecordedActivity]);

  // Apply brightness and warm filter to reader container only
  useEffect(() => {
    if (readerRef.current) {
      readerRef.current.style.filter = settings.warmColors ? 'sepia(20%)' : 'none';
      readerRef.current.style.opacity = `${settings.reducedBrightness / 100}`;
    }
  }, [settings.warmColors, settings.reducedBrightness]);

  const handleBookmark = (ayahNumber: number) => {
    if (isBookmarked(surahNumber, ayahNumber)) {
      const bookmark = getBookmark(surahNumber, ayahNumber);
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark({ surah_number: surahNumber, ayah_number: ayahNumber });
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-accent text-accent-foreground">$1</mark>');
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!surah) {
    return (
      <Card className="shadow-soft">
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Failed to load surah. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show Hifz Mode
  if (showHifzMode && surah.verses) {
    return (
      <HifzMode
        surahNumber={surahNumber}
        verses={surah.verses}
        surahName={surah.englishName}
        onClose={() => setShowHifzMode(false)}
      />
    );
  }

  // Get font family class based on settings
  const fontFamilyClass = settings.fontFamily === 'amiri' 
    ? 'font-amiri' 
    : settings.fontFamily === 'noto' 
    ? 'font-noto-arabic' 
    : 'font-arabic';

  return (
    <div ref={readerRef} className="space-y-4 transition-all duration-300">
      {/* Streak indicator */}
      {streak && (
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{streak.current_streak} day streak</span>
        </div>
      )}

      {/* Audio Player */}
      <AudioPlayer
        surahNumber={surahNumber}
        currentAyah={currentPlayingAyah}
        totalAyahs={surah.numberOfAyahs}
        onAyahChange={setCurrentPlayingAyah}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Reader */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{surah.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {surah.englishName} - {surah.englishNameTranslation}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {surah.numberOfAyahs} Ayahs • {surah.revelationType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ReadingSettingsPanel 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
                <StudyGroups 
                  surahNumber={surahNumber} 
                  ayahNumber={selectedAyah || undefined} 
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowHifzMode(true)}
                  className="gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Hifz Mode
                </Button>
                <OfflineManager
                  surahNumber={surahNumber}
                  surahName={surah.englishName}
                  numberOfAyahs={surah.numberOfAyahs}
                />
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="translation"
                  checked={showTranslation}
                  onCheckedChange={setShowTranslation}
                />
                <Label htmlFor="translation">Translation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="wordbyword"
                  checked={showWordByWord}
                  onCheckedChange={setShowWordByWord}
                />
                <Label htmlFor="wordbyword">Word Analysis</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="tajweed"
                  checked={showTajweed}
                  onCheckedChange={setShowTajweed}
                />
                <Label htmlFor="tajweed" className="flex items-center gap-1">
                  <Palette className="w-4 h-4" />
                  Tajweed Colors
                </Label>
                
                {/* Tajweed Legend */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <h4 className="font-semibold mb-2">Tajweed Rules</h4>
                    <div className="space-y-2">
                      {TAJWEED_LEGEND.map((rule) => (
                        <div key={rule.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: rule.color }}
                          />
                          <span className="text-sm font-medium">{rule.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {rule.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-6 space-y-6">
                {/* Bismillah */}
                {surahNumber !== 1 && surahNumber !== 9 && (
                  <div className="text-center py-4">
                    {showTajweed ? (
                      <TajweedDisplay 
                        text="بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" 
                        className={`text-3xl ${fontFamilyClass}`}
                        style={{ fontSize: `${settings.fontSize + 6}px` }}
                      />
                    ) : (
                      <p 
                        className={`text-3xl ${fontFamilyClass} text-primary`}
                        style={{ 
                          fontSize: `${settings.fontSize + 6}px`,
                          lineHeight: `${settings.lineSpacing}em`
                        }}
                      >
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                      </p>
                    )}
                  </div>
                )}

                {/* Verses */}
                {surah.verses?.map((verse) => (
                  <div
                    key={verse.number}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedAyah === verse.numberInSurah
                        ? "border-primary bg-primary-lighter"
                        : currentPlayingAyah === verse.numberInSurah
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {verse.numberInSurah}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAyah(verse.numberInSurah)}
                          >
                            <BookOpen className="w-4 h-4" />
                            <span className="ml-2 text-xs">Tafsir</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(verse.numberInSurah)}
                          >
                            {isBookmarked(surahNumber, verse.numberInSurah) ? (
                              <BookmarkCheck className="w-4 h-4 text-primary" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </Button>
                          <SocialShare
                            surahNumber={surahNumber}
                            surahName={surah.englishName}
                            ayahNumber={verse.numberInSurah}
                            arabicText={verse.text}
                            translation={translations[verse.numberInSurah]}
                          />
                        </div>
                        {/* Arabic Text with optional word-by-word toggle */}
                        {showWordByWord && expandedWordAnalysis === verse.numberInSurah ? (
                          <div className="space-y-4">
                            <WordByWordAnalysis
                              surahNumber={surahNumber}
                              ayahNumber={verse.numberInSurah}
                              arabicText={verse.text}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedWordAnalysis(null)}
                              className="w-full"
                            >
                              Hide Word Analysis
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {showTajweed ? (
                              <div 
                                className={`text-right mb-2 cursor-pointer hover:opacity-80 transition-opacity ${fontFamilyClass}`}
                                style={{ 
                                  fontSize: `${settings.fontSize}px`,
                                  lineHeight: `${settings.lineSpacing}em`
                                }}
                                onClick={() => showWordByWord && setExpandedWordAnalysis(verse.numberInSurah)}
                                title={showWordByWord ? "Click for word-by-word analysis" : ""}
                              >
                                <TajweedDisplay text={verse.text} />
                              </div>
                            ) : (
                              <p 
                                className={`text-right mb-2 cursor-pointer hover:text-primary transition-colors ${fontFamilyClass}`}
                                style={{ 
                                  fontSize: `${settings.fontSize}px`,
                                  lineHeight: `${settings.lineSpacing}em`
                                }}
                                onClick={() => showWordByWord && setExpandedWordAnalysis(verse.numberInSurah)}
                                title={showWordByWord ? "Click for word-by-word analysis" : ""}
                              >
                                {verse.text}
                              </p>
                            )}
                            {showWordByWord && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedWordAnalysis(verse.numberInSurah)}
                                className="mt-1"
                              >
                                <Type className="w-4 h-4 mr-2" />
                                Show Word Analysis
                              </Button>
                            )}
                          </div>
                        )}
                        {showTranslation && translations[verse.numberInSurah] && (
                          <p 
                            className="text-sm text-muted-foreground mt-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightText(translations[verse.numberInSurah]) 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tafsir Panel */}
        <Card className="shadow-soft">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Tafsir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-6">
                {!selectedAyah ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select an ayah to view its tafsir
                  </p>
                ) : isLoadingTafsir ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : tafsir && tafsir.length > 0 ? (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-primary">
                        Ayah {selectedAyah}
                      </p>
                    </div>
                    {tafsir.map((t, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          {t.author}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t.text}
                        </p>
                        {index < tafsir.length - 1 && (
                          <div className="border-t border-border mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Tafsir not available for this ayah
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuranReader;
