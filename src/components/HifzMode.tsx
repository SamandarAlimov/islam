import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Volume2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Verse {
  numberInSurah: number;
  text: string;
  number: number;
}

interface HifzProgress {
  id: string;
  surah_number: number;
  ayah_number: number;
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  next_review_date: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

interface HifzModeProps {
  surahNumber: number;
  verses: Verse[];
  surahName: string;
  onClose: () => void;
}

const RECITER_URLS: Record<string, string> = {
  mishary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy',
  sudais: 'https://cdn.islamic.network/quran/audio/64/ar.abdurrahmaansudais',
  abubakr: 'https://cdn.islamic.network/quran/audio/64/ar.shaatree',
};

const HifzMode = ({ surahNumber, verses, surahName, onClose }: HifzModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(3);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [showArabic, setShowArabic] = useState(true);
  const [progress, setProgress] = useState<HifzProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reciter, setReciter] = useState('mishary');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const currentVerse = verses[currentIndex];

  // Fetch hifz progress
  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('hifz_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber);

      if (!error && data) {
        setProgress(data as HifzProgress[]);
      }
      setIsLoading(false);
    };

    fetchProgress();
  }, [surahNumber]);

  // Calculate global verse number
  const getGlobalVerseNumber = (surahNum: number, ayahNum: number) => {
    const versesBeforeSurah = [
      0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750,
      1802, 1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932,
      3159, 3252, 3340, 3409, 3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970,
      4058, 4133, 4218, 4272, 4325, 4414, 4473, 4510, 4545, 4583, 4612, 4630,
      4675, 4735, 4784, 4846, 4901, 4979, 5075, 5104, 5126, 5150, 5163, 5177,
      5188, 5199, 5217, 5229, 5241, 5271, 5323, 5375, 5419, 5447, 5475, 5495,
      5551, 5591, 5622, 5672, 5718, 5760, 5789, 5808, 5844, 5869, 5891, 5908,
      5931, 5948, 5967, 5993, 6023, 6043, 6058, 6079, 6090, 6098, 6106, 6125,
      6130, 6138, 6146, 6157, 6168, 6176, 6179, 6188, 6193, 6197, 6204, 6207,
      6213, 6221, 6225, 6230
    ];
    return versesBeforeSurah[surahNum - 1] + ayahNum;
  };

  // Audio handling
  useEffect(() => {
    if (!currentVerse) return;
    
    const globalVerseNum = getGlobalVerseNumber(surahNumber, currentVerse.numberInSurah);
    const audioUrl = `${RECITER_URLS[reciter]}/${globalVerseNum}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentVerse, reciter, surahNumber]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      if (currentLoop < loopCount - 1) {
        setCurrentLoop(prev => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        setCurrentLoop(0);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentLoop, loopCount]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const getVerseProgress = (ayahNumber: number): HifzProgress | undefined => {
    return progress.find(p => p.ayah_number === ayahNumber);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-500';
      case 'review': return 'bg-blue-500';
      case 'learning': return 'bg-amber-500';
      default: return 'bg-muted';
    }
  };

  const updateProgress = async (quality: 'again' | 'hard' | 'good' | 'easy') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your memorization progress",
        variant: "destructive",
      });
      return;
    }

    const currentProgress = getVerseProgress(currentVerse.numberInSurah);
    let newStatus: 'new' | 'learning' | 'review' | 'mastered' = 'learning';
    let newInterval = 1;
    let newEaseFactor = currentProgress?.ease_factor || 2.5;
    const newReps = (currentProgress?.repetitions || 0) + 1;

    // Spaced repetition algorithm (simplified SM-2)
    switch (quality) {
      case 'again':
        newInterval = 1;
        newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
        newStatus = 'learning';
        break;
      case 'hard':
        newInterval = Math.ceil((currentProgress?.interval_days || 1) * 1.2);
        newEaseFactor = Math.max(1.3, newEaseFactor - 0.15);
        newStatus = 'review';
        break;
      case 'good':
        newInterval = Math.ceil((currentProgress?.interval_days || 1) * newEaseFactor);
        newStatus = newReps >= 5 ? 'mastered' : 'review';
        break;
      case 'easy':
        newInterval = Math.ceil((currentProgress?.interval_days || 1) * newEaseFactor * 1.3);
        newEaseFactor = newEaseFactor + 0.15;
        newStatus = newReps >= 3 ? 'mastered' : 'review';
        break;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    const progressData = {
      user_id: user.id,
      surah_number: surahNumber,
      ayah_number: currentVerse.numberInSurah,
      repetitions: newReps,
      ease_factor: newEaseFactor,
      interval_days: newInterval,
      next_review_date: nextReviewDate.toISOString().split('T')[0],
      status: newStatus,
      last_reviewed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('hifz_progress')
      .upsert(progressData, { onConflict: 'user_id,surah_number,ayah_number' })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } else {
      setProgress(prev => {
        const existing = prev.findIndex(p => p.ayah_number === currentVerse.numberInSurah);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data as HifzProgress;
          return updated;
        }
        return [...prev, data as HifzProgress];
      });

      toast({
        title: "Progress saved",
        description: `Next review in ${newInterval} day${newInterval > 1 ? 's' : ''}`,
      });

      // Move to next verse
      if (currentIndex < verses.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCurrentLoop(0);
      }
    }
  };

  const masteredCount = progress.filter(p => p.status === 'mastered').length;
  const progressPercent = (masteredCount / verses.length) * 100;

  return (
    <Card className="shadow-soft">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Hifz Mode - {surahName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Exit Hifz Mode
          </Button>
        </div>
        
        {/* Progress Overview */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Memorization Progress</span>
            <span>{masteredCount} / {verses.length} verses mastered</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Current Verse Display */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-lg px-4 py-1">
            Verse {currentVerse?.numberInSurah} of {verses.length}
          </Badge>
          
          <div 
            className={`p-8 rounded-lg border-2 transition-all ${
              getVerseProgress(currentVerse?.numberInSurah)?.status === 'mastered'
                ? 'border-green-500 bg-green-500/5'
                : 'border-border'
            }`}
          >
            {showArabic ? (
              <p className="text-3xl leading-loose font-arabic text-right">
                {currentVerse?.text}
              </p>
            ) : (
              <div className="flex items-center justify-center h-24">
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => setShowArabic(true)}
                >
                  <BookOpen className="w-6 h-6 mr-2" />
                  Reveal Verse
                </Button>
              </div>
            )}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button 
              size="lg" 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(prev => Math.min(verses.length - 1, prev + 1))}
              disabled={currentIndex === verses.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Loop Controls */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Loop: {currentLoop + 1} / {loopCount}</span>
            </div>
            <Slider
              value={[loopCount]}
              onValueChange={([value]) => setLoopCount(value)}
              min={1}
              max={10}
              step={1}
              className="w-32"
            />
          </div>

          {/* Hide/Show Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowArabic(!showArabic)}
          >
            {showArabic ? 'Hide Verse (Test Memory)' : 'Show Verse'}
          </Button>
        </div>

        {/* Review Buttons */}
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            How well did you remember this verse?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="border-red-500 hover:bg-red-500/10"
              onClick={() => updateProgress('again')}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Again
            </Button>
            <Button
              variant="outline"
              className="border-amber-500 hover:bg-amber-500/10"
              onClick={() => updateProgress('hard')}
            >
              Hard
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 hover:bg-blue-500/10"
              onClick={() => updateProgress('good')}
            >
              Good
            </Button>
            <Button
              variant="outline"
              className="border-green-500 hover:bg-green-500/10"
              onClick={() => updateProgress('easy')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Easy
            </Button>
          </div>
        </div>

        {/* Verse Progress Grid */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Progress Overview</p>
          <div className="flex flex-wrap gap-1">
            {verses.map((verse, index) => {
              const verseProgress = getVerseProgress(verse.numberInSurah);
              return (
                <button
                  key={verse.numberInSurah}
                  className={`w-6 h-6 rounded text-xs font-medium transition-all ${
                    index === currentIndex
                      ? 'ring-2 ring-primary'
                      : ''
                  } ${getStatusColor(verseProgress?.status)}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {verse.numberInSurah}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-muted" /> New
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500" /> Learning
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500" /> Review
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" /> Mastered
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HifzMode;
