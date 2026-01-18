import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Trash2, WifiOff, Wifi, HardDrive, 
  CheckCircle, Loader2 
} from "lucide-react";
import {
  saveSurahOffline,
  getOfflineSurah,
  getAllOfflineSurahs,
  deleteOfflineSurah,
  getOfflineStorageSize,
  isOnline,
  addNetworkListeners,
  saveAudioOffline,
} from "@/services/offlineStorage";
import { fetchSurahWithVerses, fetchVerseTranslation, getAyahAudioUrl } from "@/services/quranService";

interface OfflineManagerProps {
  surahNumber: number;
  surahName: string;
  numberOfAyahs: number;
}

const OfflineManager = ({ surahNumber, surahName, numberOfAyahs }: OfflineManagerProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [includeTranslation, setIncludeTranslation] = useState(true);

  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => setOnline(true),
      () => setOnline(false)
    );

    checkIfSaved();
    updateStorageInfo();

    return cleanup;
  }, [surahNumber]);

  const checkIfSaved = async () => {
    const saved = await getOfflineSurah(surahNumber);
    setIsSaved(!!saved);
  };

  const updateStorageInfo = async () => {
    const { used } = await getOfflineStorageSize();
    setStorageUsed(used);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (!online) {
      toast({ 
        title: "No internet connection", 
        description: "Please connect to the internet to download",
        variant: "destructive" 
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Fetch surah data
      const surahData = await fetchSurahWithVerses(surahNumber);
      let progress = 20;
      setDownloadProgress(progress);

      // Add translations if requested
      if (includeTranslation && surahData.verses) {
        const totalVerses = surahData.verses.length;
        for (let i = 0; i < totalVerses; i++) {
          const verse = surahData.verses[i];
          const translation = await fetchVerseTranslation(surahNumber, verse.numberInSurah);
          verse.translation = translation;
          progress = 20 + Math.floor((i / totalVerses) * 40);
          setDownloadProgress(progress);
        }
      }
      setDownloadProgress(60);

      // Download audio if requested
      if (includeAudio && surahData.verses) {
        const totalVerses = surahData.verses.length;
        for (let i = 0; i < totalVerses; i++) {
          const verse = surahData.verses[i];
          const audioUrl = getAyahAudioUrl(surahNumber, verse.numberInSurah, 'alafasy');
          await saveAudioOffline(surahNumber, verse.numberInSurah, 'alafasy', audioUrl);
          progress = 60 + Math.floor((i / totalVerses) * 30);
          setDownloadProgress(progress);
        }
      }
      setDownloadProgress(90);

      // Save to IndexedDB
      await saveSurahOffline({
        number: surahData.number,
        name: surahData.name,
        englishName: surahData.englishName,
        englishNameTranslation: surahData.englishNameTranslation,
        numberOfAyahs: surahData.numberOfAyahs,
        revelationType: surahData.revelationType,
        verses: surahData.verses?.map(v => ({
          number: v.number,
          numberInSurah: v.numberInSurah,
          text: v.text,
          translation: v.translation,
        })) || [],
        savedAt: Date.now(),
      });

      setDownloadProgress(100);
      setIsSaved(true);
      updateStorageInfo();
      
      toast({ 
        title: "Downloaded successfully!", 
        description: `${surahName} is now available offline` 
      });
    } catch (error) {
      toast({ 
        title: "Download failed", 
        description: "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOfflineSurah(surahNumber);
      setIsSaved(false);
      updateStorageInfo();
      toast({ title: "Removed from offline storage" });
    } catch (error) {
      toast({ 
        title: "Failed to delete", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isSaved ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              Saved Offline
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Save Offline
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Offline Access</DialogTitle>
          <DialogDescription>
            Download {surahName} for offline reading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Network Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            {online ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-sm">Connected to internet</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Offline mode</span>
              </>
            )}
          </div>

          {/* Storage Info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <HardDrive className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">Storage used: {formatBytes(storageUsed)}</span>
          </div>

          {/* Options */}
          {!isSaved && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="translation" className="text-sm">Include translation</Label>
                <Switch
                  id="translation"
                  checked={includeTranslation}
                  onCheckedChange={setIncludeTranslation}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="audio" className="text-sm">Include audio (larger download)</Label>
                <Switch
                  id="audio"
                  checked={includeAudio}
                  onCheckedChange={setIncludeAudio}
                />
              </div>
            </div>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <Progress value={downloadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Downloading... {downloadProgress}%
              </p>
            </div>
          )}

          {/* Status */}
          {isSaved && (
            <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Available offline</p>
                  <p className="text-xs text-muted-foreground">
                    {surahName} • {numberOfAyahs} ayahs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isSaved ? (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            ) : (
              <Button 
                onClick={handleDownload}
                disabled={isDownloading || !online}
                className="flex-1"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineManager;
