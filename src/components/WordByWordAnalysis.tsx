import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchWordByWord, Word } from "@/services/quranService";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface WordByWordAnalysisProps {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
}

const WordByWordAnalysis = ({ surahNumber, ayahNumber, arabicText }: WordByWordAnalysisProps) => {
  const [activeWord, setActiveWord] = useState<number | null>(null);

  const { data: words, isLoading } = useQuery({
    queryKey: ['word-by-word', surahNumber, ayahNumber],
    queryFn: () => fetchWordByWord(surahNumber, ayahNumber),
    staleTime: Infinity,
  });

  // Fallback: split Arabic text into words if API doesn't return data
  const arabicWords = arabicText.split(' ').filter(w => w.trim());

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 justify-end" dir="rtl">
        {arabicWords.map((_, i) => (
          <Skeleton key={i} className="h-20 w-20" />
        ))}
      </div>
    );
  }

  // Use API words if available, otherwise use split text
  const displayWords = words && words.length > 0 
    ? words 
    : arabicWords.map(text => ({ text, translation: '', transliteration: '' }));

  return (
    <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
      {displayWords.map((word, index) => (
        <Tooltip key={index} open={activeWord === index}>
          <TooltipTrigger asChild>
            <button
              className={`group relative p-3 rounded-lg border transition-all text-center min-w-[80px] ${
                activeWord === index
                  ? 'border-primary bg-primary-lighter shadow-md'
                  : 'border-border hover:border-primary/50 hover:bg-primary-lighter/50'
              }`}
              onClick={() => setActiveWord(activeWord === index ? null : index)}
              onMouseEnter={() => setActiveWord(index)}
              onMouseLeave={() => setActiveWord(null)}
            >
              <p className="text-2xl font-arabic text-foreground mb-1">
                {word.text}
              </p>
              {word.transliteration && (
                <p className="text-xs text-muted-foreground italic">
                  {word.transliteration}
                </p>
              )}
              {word.translation && (
                <p className="text-xs text-primary font-medium mt-1">
                  {word.translation}
                </p>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs p-4">
            <div className="space-y-2">
              <p className="text-lg font-arabic text-center">{word.text}</p>
              {word.transliteration && (
                <p className="text-sm text-muted-foreground text-center italic">
                  {word.transliteration}
                </p>
              )}
              {word.translation && (
                <p className="text-sm font-medium text-center">
                  {word.translation}
                </p>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Word {displayWords.length - index} of {displayWords.length}
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default WordByWordAnalysis;
