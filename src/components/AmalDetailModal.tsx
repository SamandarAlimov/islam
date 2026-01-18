import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Quote, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  Sparkles,
  FileText,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AmalDetail, AmalCategory } from "@/data/amallarData";

interface AmalDetailModalProps {
  amal: AmalDetail | null;
  category: AmalCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

const AmalDetailModal = ({ amal, category, isOpen, onClose }: AmalDetailModalProps) => {
  if (!amal || !category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                  category.bgColor,
                  category.color
                )}>
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <Badge className={cn("mb-2", category.bgColor, category.color, "border-0")}>
                    {category.title}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                    {amal.name}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1">{amal.description}</p>
                </div>
              </div>
            </DialogHeader>

            {/* Full Description */}
            {amal.fullDescription && (
              <Card className="mb-6 bg-muted/30 border-0">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Batafsil ma'lumot</h3>
                      <p className="text-muted-foreground leading-relaxed">{amal.fullDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Importance */}
            {amal.importance && (
              <Card className={cn("mb-6 border-2", category.borderColor)}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Target className={cn("w-5 h-5 mt-1 flex-shrink-0", category.color)} />
                    <div>
                      <h3 className={cn("font-semibold mb-2", category.color)}>Ahamiyati</h3>
                      <p className="text-muted-foreground leading-relaxed">{amal.importance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How To */}
            {amal.howTo && amal.howTo.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Qanday bajariladi
                </h3>
                <div className="grid gap-2">
                  {amal.howTo.map((step, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                    >
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {amal.benefits && amal.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Foydalari va fazilatlari
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {amal.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20"
                    >
                      <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Dalillar Section */}
            <div>
              <h3 className="font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Dalillar (Qur'on va Hadis)
              </h3>

              <div className="space-y-4">
                {amal.dalillar.map((dalil, index) => (
                  <Card 
                    key={index}
                    className={cn(
                      "overflow-hidden border-2 transition-all hover:shadow-lg",
                      dalil.type === "quran" 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-accent/30 bg-accent/5"
                    )}
                  >
                    <CardContent className="p-0">
                      {/* Dalil Header */}
                      <div className={cn(
                        "px-4 py-3 flex items-center gap-3",
                        dalil.type === "quran" 
                          ? "bg-primary/10" 
                          : "bg-accent/10"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          dalil.type === "quran" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-accent text-accent-foreground"
                        )}>
                          {dalil.type === "quran" ? (
                            <BookOpen className="w-4 h-4" />
                          ) : (
                            <Quote className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            dalil.type === "quran" 
                              ? "border-primary/50 text-primary" 
                              : "border-accent/50 text-accent"
                          )}>
                            {dalil.type === "quran" ? "Qur'oni Karim" : "Hadisi Sharif"}
                          </Badge>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {dalil.source}
                          </p>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      {dalil.arabic && (
                        <div className="px-4 py-4 bg-background/50">
                          <p 
                            className="text-xl md:text-2xl text-right leading-loose font-arabic text-foreground"
                            style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                            dir="rtl"
                          >
                            {dalil.arabic}
                          </p>
                        </div>
                      )}

                      {/* Translation */}
                      <div className="px-4 py-4 border-t border-border/50">
                        <p className="text-muted-foreground leading-relaxed">
                          <Quote className="w-4 h-4 inline-block mr-2 text-muted-foreground/50" />
                          {dalil.text}
                        </p>
                        {dalil.translation && (
                          <p className="text-sm text-muted-foreground/70 mt-2 italic">
                            {dalil.translation}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Related Amals */}
            {amal.relatedAmals && amal.relatedAmals.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Bog'liq amallar:</h4>
                <div className="flex flex-wrap gap-2">
                  {amal.relatedAmals.map((related, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {related.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AmalDetailModal;
