// Service for fetching Quran data from multiple APIs

export interface Word {
  text: string;
  translation: string;
  transliteration: string;
}

export interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
  translation?: string;
  words?: Word[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  verses?: Verse[];
}

export interface TafsirText {
  text: string;
  author: string;
}

export interface SurahWithTafsir extends Surah {
  tafsir?: { [ayahNumber: number]: TafsirText[] };
}

// Fetch all surahs metadata
export const fetchAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    return data.data.map((surah: any) => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// Fetch specific surah with verses (Arabic text with audio)
export const fetchSurahWithVerses = async (surahNumber: number): Promise<SurahWithTafsir> => {
  try {
    // Fetch Arabic text (Uthmani script)
    const arabicResponse = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
    );
    const arabicData = await arabicResponse.json();

    const surah = arabicData.data;
    
    return {
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
      verses: surah.ayahs.map((ayah: any) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        audio: ayah.audio || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${ayah.number}.mp3`,
      })),
    };
  } catch (error) {
    console.error('Error fetching surah verses:', error);
    throw error;
  }
};

// Fetch tafsir for a specific ayah
export const fetchAyahTafsir = async (
  surahNumber: number,
  ayahNumber: number
): Promise<TafsirText[]> => {
  const tafsirs: TafsirText[] = [];
  
  try {
    // Fetch Ibn Kathir tafsir from quranapi.pages.dev
    const ibnKathirResponse = await fetch(
      `https://quranapi.pages.dev/api/ibn_kathir_${surahNumber}_${ayahNumber}.json`
    );
    if (ibnKathirResponse.ok) {
      const ibnKathirData = await ibnKathirResponse.json();
      if (ibnKathirData.text) {
        tafsirs.push({
          text: ibnKathirData.text,
          author: 'Ibn Kathir',
        });
      }
    }
  } catch (error) {
    console.error('Error fetching Ibn Kathir tafsir:', error);
  }

  try {
    // Fetch from api.quran-tafseer.com (Al-Tafsir Al-Muyassar)
    const muyassarResponse = await fetch(
      `https://api.quran-tafseer.com/tafseer/1/${surahNumber}/${ayahNumber}`
    );
    if (muyassarResponse.ok) {
      const muyassarData = await muyassarResponse.json();
      if (muyassarData.text) {
        tafsirs.push({
          text: muyassarData.text,
          author: 'Al-Tafsir Al-Muyassar',
        });
      }
    }
  } catch (error) {
    console.error('Error fetching Muyassar tafsir:', error);
  }

  return tafsirs;
};

// Fetch tafsir for entire surah
export const fetchSurahTafsir = async (surahNumber: number): Promise<{ [ayahNumber: number]: TafsirText[] }> => {
  try {
    const surah = await fetchSurahWithVerses(surahNumber);
    const tafsirMap: { [ayahNumber: number]: TafsirText[] } = {};

    // Fetch tafsir for each ayah
    if (surah.verses) {
      for (const verse of surah.verses) {
        const tafsirs = await fetchAyahTafsir(surahNumber, verse.numberInSurah);
        if (tafsirs.length > 0) {
          tafsirMap[verse.numberInSurah] = tafsirs;
        }
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return tafsirMap;
  } catch (error) {
    console.error('Error fetching surah tafsir:', error);
    throw error;
  }
};

// Available reciters with proper codes
export const RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', code: 'ar.alafasy' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', code: 'ar.abdurrahmaansudais' },
  { id: 'abubakar', name: 'Abu Bakr Al-Shatri', code: 'ar.abdulbasitmurattal' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', code: 'ar.husary' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', code: 'ar.minshawi' },
];

// Get audio URL for specific ayah
export const getAyahAudioUrl = (surahNumber: number, ayahNumber: number, reciter: string = 'alafasy'): string => {
  const reciterData = RECITERS.find(r => r.id === reciter) || RECITERS[0];
  return `https://cdn.islamic.network/quran/audio/128/${reciterData.code}/${surahNumber}_${ayahNumber}.mp3`;
};

// Get full surah audio URL
export const getSurahAudioUrl = (surahNumber: number, reciter: string = 'alafasy'): string => {
  const reciterMap: { [key: string]: string } = {
    alafasy: 'Alafasy_128kbps',
    sudais: 'Abdul_Basit_Murattal_192kbps',
    mishari: 'Mishary_Rashid_Alafasy_128kbps',
  };
  
  const reciterCode = reciterMap[reciter] || reciterMap.alafasy;
  const surahPadded = surahNumber.toString().padStart(3, '0');
  return `https://download.quranicaudio.com/quran/${reciterCode}/${surahPadded}.mp3`;
};

// Fetch translation for a verse
export const fetchVerseTranslation = async (
  surahNumber: number,
  ayahNumber: number,
  edition: string = 'en.sahih'
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${edition}`
    );
    const data = await response.json();
    return data.data?.text || '';
  } catch (error) {
    console.error('Error fetching translation:', error);
    return '';
  }
};

// Fetch word-by-word analysis
export const fetchWordByWord = async (
  surahNumber: number,
  ayahNumber: number
): Promise<Word[]> => {
  try {
    const response = await fetch(
      `https://api.quranwbw.com/v1/ayah/${surahNumber}:${ayahNumber}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.words || [];
  } catch (error) {
    console.error('Error fetching word-by-word:', error);
    return [];
  }
};

// Search verses by keyword
export const searchVerses = async (query: string, language: string = 'en'): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=${language}`
    );
    const data = await response.json();
    return data.search?.results || [];
  } catch (error) {
    console.error('Error searching verses:', error);
    return [];
  }
};
