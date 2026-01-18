import { useQuery } from '@tanstack/react-query';
import {
  fetchAllSurahs,
  fetchSurahWithVerses,
  fetchAyahTafsir,
  fetchSurahTafsir,
  searchVerses,
  type Surah,
  type SurahWithTafsir,
  type TafsirText,
} from '@/services/quranService';

// Hook to fetch all surahs
export const useAllSurahs = () => {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: fetchAllSurahs,
    staleTime: Infinity, // Surah list never changes
  });
};

// Hook to fetch specific surah with verses
export const useSurah = (surahNumber: number | null) => {
  return useQuery({
    queryKey: ['surah', surahNumber],
    queryFn: () => fetchSurahWithVerses(surahNumber!),
    enabled: surahNumber !== null,
    staleTime: Infinity,
  });
};

// Hook to fetch tafsir for specific ayah
export const useAyahTafsir = (surahNumber: number | null, ayahNumber: number | null) => {
  return useQuery({
    queryKey: ['tafsir', 'ayah', surahNumber, ayahNumber],
    queryFn: () => fetchAyahTafsir(surahNumber!, ayahNumber!),
    enabled: surahNumber !== null && ayahNumber !== null,
    staleTime: Infinity,
  });
};

// Hook to fetch tafsir for entire surah
export const useSurahTafsir = (surahNumber: number | null) => {
  return useQuery({
    queryKey: ['tafsir', 'surah', surahNumber],
    queryFn: () => fetchSurahTafsir(surahNumber!),
    enabled: surahNumber !== null,
    staleTime: Infinity,
  });
};

// Hook for search
export const useQuranSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchVerses(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
