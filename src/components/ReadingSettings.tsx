import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Moon, 
  Sun, 
  Type, 
  Eye, 
  Palette,
  Settings2,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface ReadingSettings {
  fontSize: number;
  nightMode: boolean;
  warmColors: boolean;
  reducedBrightness: number;
  lineSpacing: number;
  fontFamily: 'default' | 'amiri' | 'noto';
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 24,
  nightMode: false,
  warmColors: false,
  reducedBrightness: 100,
  lineSpacing: 2,
  fontFamily: 'default',
};

const STORAGE_KEY = 'quran-reading-settings';

export const useReadingSettings = () => {
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Apply night mode to document (this affects CSS variables for theming)
    if (settings.nightMode) {
      document.documentElement.classList.add('reading-night-mode');
    } else {
      document.documentElement.classList.remove('reading-night-mode');
    }
    // Note: brightness and warm filter are now applied directly to the reader container
    // in QuranReader.tsx, not globally on the document
  }, [settings]);

  return { settings, setSettings };
};

interface ReadingSettingsProps {
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
}

const ReadingSettingsPanel = ({ settings, onSettingsChange }: ReadingSettingsProps) => {
  const updateSetting = <K extends keyof ReadingSettings>(
    key: K, 
    value: ReadingSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Reading Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Reading Settings
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Night Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Night Mode
              </Label>
              <Switch
                checked={settings.nightMode}
                onCheckedChange={(checked) => updateSetting('nightMode', checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Dark background for comfortable reading in low light
            </p>
          </div>

          {/* Warm Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Warm Colors
              </Label>
              <Switch
                checked={settings.warmColors}
                onCheckedChange={(checked) => updateSetting('warmColors', checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Reduce blue light to ease eye strain
            </p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Arabic Font Size: {settings.fontSize}px
            </Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={16}
              max={48}
              step={2}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Line Spacing: {settings.lineSpacing}x
            </Label>
            <Slider
              value={[settings.lineSpacing]}
              onValueChange={([value]) => updateSetting('lineSpacing', value)}
              min={1.5}
              max={3}
              step={0.25}
            />
          </div>

          {/* Brightness */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Brightness: {settings.reducedBrightness}%
            </Label>
            <Slider
              value={[settings.reducedBrightness]}
              onValueChange={([value]) => updateSetting('reducedBrightness', value)}
              min={50}
              max={100}
              step={5}
            />
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Arabic Font Style
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(['default', 'amiri', 'noto'] as const).map((font) => (
                <Button
                  key={font}
                  variant={settings.fontFamily === font ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('fontFamily', font)}
                  className="capitalize"
                >
                  {font === 'default' ? 'Default' : font === 'amiri' ? 'Amiri' : 'Noto'}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onSettingsChange(DEFAULT_SETTINGS)}
          >
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReadingSettingsPanel;
