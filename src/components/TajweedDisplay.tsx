import { useMemo, CSSProperties } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TajweedDisplayProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

// Tajweed rules with colors
const TAJWEED_RULES = {
  // Ghunnah (nasalization) - Green
  ghunnah: {
    pattern: /[نم](?=[ًٌٍَُِّْ]*[نم])|[نم]ّ/g,
    color: "hsl(var(--tajweed-ghunnah))",
    name: "Ghunnah",
    description: "Nasalization for 2 counts",
  },
  // Idgham (assimilation) - Purple
  idgham: {
    pattern: /[نْ](?=[يرملون])|[مْ](?=[م])/g,
    color: "hsl(var(--tajweed-idgham))",
    name: "Idgham",
    description: "Merging with the following letter",
  },
  // Ikhfa (concealment) - Orange
  ikhfa: {
    pattern: /[نْ](?=[تثجدذزسشصضطظفقك])|[مْ](?=[ب])/g,
    color: "hsl(var(--tajweed-ikhfa))",
    name: "Ikhfa",
    description: "Hidden pronunciation with nasalization",
  },
  // Iqlab (conversion) - Blue
  iqlab: {
    pattern: /[نْ](?=[ب])/g,
    color: "hsl(var(--tajweed-iqlab))",
    name: "Iqlab",
    description: "Noon converts to Meem sound",
  },
  // Qalqalah (echoing) - Red
  qalqalah: {
    pattern: /[قطبجد]ْ/g,
    color: "hsl(var(--tajweed-qalqalah))",
    name: "Qalqalah",
    description: "Echoing sound when letter has sukoon",
  },
  // Madd (prolongation) - Pink
  madd: {
    pattern: /[اوي](?=[ّْ])|[آ]|ا(?=ۤ)/g,
    color: "hsl(var(--tajweed-madd))",
    name: "Madd",
    description: "Prolongation of vowel sound",
  },
};

// Color legend for display
export const TAJWEED_LEGEND = [
  { name: "Ghunnah", color: "hsl(var(--tajweed-ghunnah))", description: "Nasalization (2 counts)" },
  { name: "Idgham", color: "hsl(var(--tajweed-idgham))", description: "Merging letters" },
  { name: "Ikhfa", color: "hsl(var(--tajweed-ikhfa))", description: "Hidden/concealed" },
  { name: "Iqlab", color: "hsl(var(--tajweed-iqlab))", description: "Noon → Meem" },
  { name: "Qalqalah", color: "hsl(var(--tajweed-qalqalah))", description: "Echoing sound" },
  { name: "Madd", color: "hsl(var(--tajweed-madd))", description: "Prolongation" },
];

const TajweedDisplay = ({ text, className = "", style }: TajweedDisplayProps) => {
  const coloredText = useMemo(() => {
    // Split text into characters for processing
    const chars = text.split('');
    const segments: Array<{ text: string; rule?: typeof TAJWEED_RULES[keyof typeof TAJWEED_RULES] }> = [];
    
    let currentText = '';
    let i = 0;
    
    while (i < chars.length) {
      let matched = false;
      
      // Check each rule
      for (const [key, rule] of Object.entries(TAJWEED_RULES)) {
        const substring = text.slice(i);
        const match = substring.match(rule.pattern);
        
        if (match && match.index === 0) {
          // Push any accumulated plain text
          if (currentText) {
            segments.push({ text: currentText });
            currentText = '';
          }
          // Push the matched tajweed text
          segments.push({ text: match[0], rule });
          i += match[0].length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        currentText += chars[i];
        i++;
      }
    }
    
    // Push remaining text
    if (currentText) {
      segments.push({ text: currentText });
    }
    
    return segments;
  }, [text]);

  return (
    <TooltipProvider delayDuration={200}>
      <span className={`font-arabic ${className}`} dir="rtl" style={style}>
        {coloredText.map((segment, index) => (
          segment.rule ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span
                  style={{ color: segment.rule.color }}
                  className="cursor-help transition-all hover:brightness-110"
                >
                  {segment.text}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-sm">
                <p className="font-semibold">{segment.rule.name}</p>
                <p className="text-xs text-muted-foreground">{segment.rule.description}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        ))}
      </span>
    </TooltipProvider>
  );
};

export default TajweedDisplay;
