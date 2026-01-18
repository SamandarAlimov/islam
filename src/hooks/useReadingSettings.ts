import { useState, useEffect } from 'react';

export interface ReadingSettings {
  fontSize: number;
  lineSpacing: number;
  nightMode: boolean;
  warmColors: boolean;
  brightness: number;
  arabicFont: 'default' | 'amiri' | 'noto';
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 24,
  lineSpacing: 1.8,
  nightMode: false,
  warmColors: false,
  brightness: 100,
  arabicFont: 'default',
};

export const useReadingSettings = () => {
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('reading-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('reading-settings', JSON.stringify(settings));
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--reading-font-size', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--reading-line-spacing', `${settings.lineSpacing}`);
    document.documentElement.style.setProperty('--reading-brightness', `${settings.brightness}%`);
    
    // Apply night mode
    if (settings.nightMode) {
      document.documentElement.classList.add('reading-night-mode');
    } else {
      document.documentElement.classList.remove('reading-night-mode');
    }
    
    // Apply warm colors
    if (settings.warmColors) {
      document.documentElement.classList.add('reading-warm-mode');
    } else {
      document.documentElement.classList.remove('reading-warm-mode');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSettings, resetSettings };
};
