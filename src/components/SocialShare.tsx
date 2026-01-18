import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Twitter, Facebook, MessageCircle, Mail, Check } from "lucide-react";

interface SocialShareProps {
  surahNumber: number;
  surahName: string;
  ayahNumber?: number;
  arabicText?: string;
  translation?: string;
}

const SocialShare = ({ 
  surahNumber, 
  surahName, 
  ayahNumber, 
  arabicText, 
  translation 
}: SocialShareProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getShareText = () => {
    let text = `📖 ${surahName}`;
    if (ayahNumber) text += ` (${surahNumber}:${ayahNumber})`;
    if (arabicText) text += `\n\n${arabicText}`;
    if (translation) text += `\n\n${translation}`;
    text += `\n\n— Alsamos Islam`;
    return text;
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/quran?surah=${surahNumber}`;
    if (ayahNumber) url += `&ayah=${ayahNumber}`;
    return url;
  };

  const handleCopy = async () => {
    const text = getShareText();
    await navigator.clipboard.writeText(`${text}\n\n${getShareUrl()}`);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Quran Verse: ${surahName}${ayahNumber ? ` ${surahNumber}:${ayahNumber}` : ''}`);
    const body = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran: ${surahName}`,
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch (err) {
        // User cancelled or share failed
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Verse</DialogTitle>
          <DialogDescription>
            Share this verse with others on social media or copy the link
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="font-semibold text-sm mb-2">{surahName} {ayahNumber ? `(${surahNumber}:${ayahNumber})` : ''}</p>
            {arabicText && (
              <p className="text-lg font-arabic text-right leading-loose mb-2">{arabicText}</p>
            )}
            {translation && (
              <p className="text-sm text-muted-foreground">{translation}</p>
            )}
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={shareToTwitter}
            >
              <Twitter className="w-5 h-5" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={shareToFacebook}
            >
              <Facebook className="w-5 h-5" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={shareToWhatsApp}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={shareByEmail}
            >
              <Mail className="w-5 h-5" />
              <span className="text-xs">Email</span>
            </Button>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <Input 
              value={getShareUrl()} 
              readOnly 
              className="flex-1"
            />
            <Button onClick={handleCopy} variant="secondary">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Native Share (if available) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button onClick={handleNativeShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShare;
