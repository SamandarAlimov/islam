import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DuaAudioButtonProps {
  arabicText: string;
  label?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  className?: string;
  showReciterSelect?: boolean;
}

// Qorilar ro'yxati - EveryAyah.com formatida
export const RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', folder: 'Alafasy_128kbps' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', folder: 'Husary_128kbps' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'abdulbasit', name: 'Abdul Basit Mujawwad', folder: 'Abdul_Basit_Mujawwad_128kbps' },
  { id: 'shuraim', name: "Sa'ud Ash-Shuraim", folder: 'Saood_ash-Shuraym_128kbps' },
  { id: 'ghamdi', name: "Sa'ad Al-Ghamdi", folder: 'Ghamadi_40kbps' },
];

// Map Arabic text to Quran surah/ayah IDs
const getQuranAudioId = (arabic: string): string | null => {
  // Fotiha surasi (complete)
  if (arabic.includes("الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ")) {
    return "fatiha";
  }
  // Ixlos surasi
  if (arabic.includes("قُلْ هُوَ اللَّهُ أَحَدٌ")) {
    return "ikhlas";
  }
  // Sano duosi
  if (arabic.includes("سُبْحَانَكَ اللَّهُمَّ")) {
    return "sana";
  }
  // Ta'avvuz va Basmala
  if (arabic.includes("أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ")) {
    return "taawwuz";
  }
  // Tahiyyot
  if (arabic.includes("التَّحِيَّاتُ لِلَّهِ")) {
    return "tahiyyat";
  }
  // Salavot
  if (arabic.includes("اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ")) {
    return "salavat";
  }
  // Rabbana atina duo
  if (arabic.includes("رَبَّنَا آتِنَا فِي الدُّنْيَا")) {
    return "rabbana";
  }
  return null;
};

// Get EveryAyah audio URLs based on reciter
const getAudioUrls = (id: string, reciterFolder: string): string[] => {
  const baseUrl = `https://everyayah.com/data/${reciterFolder}`;
  
  if (id === "fatiha") {
    return [
      `${baseUrl}/001001.mp3`,
      `${baseUrl}/001002.mp3`,
      `${baseUrl}/001003.mp3`,
      `${baseUrl}/001004.mp3`,
      `${baseUrl}/001005.mp3`,
      `${baseUrl}/001006.mp3`,
      `${baseUrl}/001007.mp3`,
    ];
  }
  
  if (id === "ikhlas") {
    return [
      `${baseUrl}/112001.mp3`,
      `${baseUrl}/112002.mp3`,
      `${baseUrl}/112003.mp3`,
      `${baseUrl}/112004.mp3`,
    ];
  }
  
  // For duas that aren't Quranic verses, use Bismillah as example
  if (id === "sana" || id === "taawwuz" || id === "tahiyyat" || id === "salavat" || id === "rabbana") {
    // These are common duas - we'll use appropriate Quranic audio
    return [`${baseUrl}/001001.mp3`];
  }
  
  return [];
};

// Local storage key for selected reciter
const RECITER_STORAGE_KEY = 'selectedReciter';

const DuaAudioButton = ({ 
  arabicText, 
  label = "Tinglash",
  size = "sm",
  variant = "ghost",
  className,
  showReciterSelect = true
}: DuaAudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(RECITER_STORAGE_KEY) || 'alafasy';
    }
    return 'alafasy';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef(0);
  const audioUrlsRef = useRef<string[]>([]);

  // Save reciter preference
  useEffect(() => {
    localStorage.setItem(RECITER_STORAGE_KEY, selectedReciter);
  }, [selectedReciter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getReciterFolder = () => {
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    return reciter?.folder || 'Alafasy_128kbps';
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    currentIndexRef.current = 0;
    setIsPlaying(false);
  };

  const playNextAudio = () => {
    if (currentIndexRef.current >= audioUrlsRef.current.length) {
      stopAudio();
      return;
    }

    const audio = new Audio(audioUrlsRef.current[currentIndexRef.current]);
    audioRef.current = audio;
    
    audio.onended = () => {
      currentIndexRef.current++;
      playNextAudio();
    };
    
    audio.onerror = () => {
      console.error("Audio error, trying next");
      currentIndexRef.current++;
      playNextAudio();
    };
    
    audio.play().catch(() => {
      currentIndexRef.current++;
      playNextAudio();
    });
  };

  const handlePlay = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoading(true);
    const reciterFolder = getReciterFolder();
    
    try {
      const quranId = getQuranAudioId(arabicText);
      
      if (quranId) {
        audioUrlsRef.current = getAudioUrls(quranId, reciterFolder);
        currentIndexRef.current = 0;
        setIsPlaying(true);
        setIsLoading(false);
        playNextAudio();
      } else {
        // For individual short phrases, use Bismillah
        const baseUrl = `https://everyayah.com/data/${reciterFolder}`;
        const audioUrl = `${baseUrl}/001001.mp3`;
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = () => {
          console.error("Audio playback error");
          setIsPlaying(false);
          setIsLoading(false);
        };
        
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (isPlaying) {
      stopAudio();
    }
  };

  const currentReciter = RECITERS.find(r => r.id === selectedReciter);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        size={size}
        variant={variant}
        onClick={handlePlay}
        disabled={isLoading}
        className={cn(
          "gap-2 transition-all",
          isPlaying && "text-primary bg-primary/10",
          showReciterSelect && "rounded-r-none"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        {size !== "icon" && (isPlaying ? "To'xtatish" : label)}
      </Button>
      
      {showReciterSelect && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size={size} 
              variant={variant}
              className="rounded-l-none border-l px-2"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Qori tanlang
            </div>
            {RECITERS.map((reciter) => (
              <DropdownMenuItem
                key={reciter.id}
                onClick={() => handleReciterChange(reciter.id)}
                className={cn(
                  "cursor-pointer",
                  selectedReciter === reciter.id && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  {selectedReciter === reciter.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                  <span className={selectedReciter !== reciter.id ? "ml-4" : ""}>
                    {reciter.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DuaAudioButton;
