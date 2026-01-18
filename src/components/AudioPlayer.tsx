import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Settings2
} from "lucide-react";
import { RECITERS, getAyahAudioUrl, getSurahAudioUrl } from "@/services/quranService";
import { getOfflineAudio } from "@/services/offlineStorage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AudioPlayerProps {
  surahNumber: number;
  currentAyah: number;
  totalAyahs: number;
  onAyahChange: (ayahNumber: number) => void;
}

const AudioPlayer = ({ 
  surahNumber, 
  currentAyah, 
  totalAyahs, 
  onAyahChange 
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('alafasy');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [continuousPlay, setContinuousPlay] = useState(true);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const loadAudio = async (surah: number, ayah: number) => {
    // Try offline first
    const offlineUrl = await getOfflineAudio(surah, ayah, selectedReciter);
    if (offlineUrl) {
      return offlineUrl;
    }
    return getAyahAudioUrl(surah, ayah, selectedReciter);
  };

  const playAyah = async (ayahNumber: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const url = await loadAudio(surahNumber, ayahNumber);
    const audio = new Audio(url);
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackSpeed;
    
    audio.onended = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (continuousPlay && ayahNumber < totalAyahs) {
        onAyahChange(ayahNumber + 1);
        playAyah(ayahNumber + 1);
      } else if (repeatMode === 'all' && ayahNumber >= totalAyahs) {
        onAyahChange(1);
        playAyah(1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAyah(currentAyah);
    }
  };

  const handlePrevious = () => {
    if (currentAyah > 1) {
      const newAyah = currentAyah - 1;
      onAyahChange(newAyah);
      if (isPlaying) {
        playAyah(newAyah);
      }
    }
  };

  const handleNext = () => {
    if (currentAyah < totalAyahs) {
      const newAyah = currentAyah + 1;
      onAyahChange(newAyah);
      if (isPlaying) {
        playAyah(newAyah);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (isPlaying) {
      playAyah(currentAyah);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      {/* Reciter Selection */}
      <div className="flex items-center justify-between mb-4">
        <Select value={selectedReciter} onValueChange={handleReciterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select reciter" />
          </SelectTrigger>
          <SelectContent>
            {RECITERS.map(reciter => (
              <SelectItem key={reciter.id} value={reciter.id}>
                {reciter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Settings Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Continuous play</Label>
                <Switch
                  checked={continuousPlay}
                  onCheckedChange={setContinuousPlay}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Playback speed</Label>
                <Select 
                  value={playbackSpeed.toString()} 
                  onValueChange={(v) => setPlaybackSpeed(parseFloat(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>Ayah {currentAyah} / {totalAyahs}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleRepeatMode}
            className={repeatMode !== 'none' ? 'text-primary' : ''}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute text-[10px] font-bold">1</span>
            )}
          </Button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentAyah <= 1}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentAyah >= totalAyahs}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
