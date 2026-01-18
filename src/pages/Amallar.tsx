import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Heart, 
  Circle, 
  XCircle, 
  Ban,
  Scroll,
  Search,
  BookOpen,
  ArrowRight,
  X
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { amallarData, AmalDetail, AmalCategory, searchAmals } from "@/data/amallarData";
import AmalDetailModal from "@/components/AmalDetailModal";

const iconMap: Record<string, React.ReactNode> = {
  AlertCircle: <AlertCircle className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Circle: <Circle className="w-6 h-6" />,
  XCircle: <XCircle className="w-6 h-6" />,
  Ban: <Ban className="w-6 h-6" />,
};

const Amallar = () => {
  const [activeTab, setActiveTab] = useState("farz");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmal, setSelectedAmal] = useState<AmalDetail | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AmalCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAmals(searchQuery);
  }, [searchQuery]);

  const handleAmalClick = (amal: AmalDetail, category: AmalCategory) => {
    setSelectedAmal(amal);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAmal(null);
    setSelectedCategory(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Scroll className="w-5 h-5" />
            <span className="text-sm font-medium">Islomiy amallar</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Amallar Hukmlari
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
            Islomda amallar farz, vojib, sunnat, mustahab, muboh, makruh va harom turlarga bo'linadi.
            Har bir turkumning o'ziga xos hukmi va fazilati bor.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Amallarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Qidiruv natijalari: {searchResults.length} ta topildi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(({ category, amal }, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                    "border-2",
                    category.borderColor
                  )}
                  onClick={() => handleAmalClick(amal, category)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        category.bgColor,
                        category.color
                      )}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge className={cn("text-xs mb-1", category.bgColor, category.color, "border-0")}>
                          {category.title.split(" ")[0]}
                        </Badge>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {amal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {amal.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-primary text-sm">
                          <span>Batafsil</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12 mb-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Hech narsa topilmadi</h3>
            <p className="text-muted-foreground">"{searchQuery}" so'rovi bo'yicha amallar topilmadi</p>
          </div>
        )}

        {/* Stats */}
        {!searchQuery && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
              {Object.entries(amallarData).map(([key, cat]) => (
                <Card 
                  key={key} 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105",
                    cat.bgColor,
                    cat.borderColor,
                    activeTab === key && "ring-2 ring-offset-2 ring-primary"
                  )}
                  onClick={() => setActiveTab(key)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn("flex justify-center mb-2", cat.color)}>
                      {iconMap[cat.iconName]}
                    </div>
                    <p className={cn("font-bold text-lg", cat.color)}>{cat.items.length}</p>
                    <p className="text-xs text-muted-foreground">{cat.title.split(" ")[0]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full flex-wrap h-auto gap-2 p-2 bg-muted/50">
                {Object.entries(amallarData).map(([key, cat]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className={cn(
                      "flex items-center gap-2 data-[state=active]:shadow-md transition-all"
                    )}
                  >
                    {iconMap[cat.iconName]}
                    <span className="hidden sm:inline">{cat.title.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(amallarData).map(([key, cat]) => (
                <TabsContent key={key} value={key} className="space-y-6">
                  {/* Category Header */}
                  <Card className={cn("border-2", cat.borderColor, cat.bgColor)}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={cn("p-3 rounded-xl", cat.color, "bg-background")}>
                          {iconMap[cat.iconName]}
                        </div>
                        <div>
                          <CardTitle className={cn("text-2xl", cat.color)}>{cat.title}</CardTitle>
                          <p className="text-muted-foreground mt-1">{cat.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Items Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.items.map((item, index) => (
                      <Card 
                        key={index}
                        className={cn(
                          "cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                          "border",
                          cat.borderColor
                        )}
                        onClick={() => handleAmalClick(item, cat)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              cat.bgColor,
                              cat.color
                            )}>
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                              {item.details && (
                                <Badge variant="outline" className={cn("mt-2 text-xs", cat.color)}>
                                  {item.details}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium">
                                <span>Dalillarni ko'rish</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <Card className="bg-muted/30">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span>Jami: <strong className={cat.color}>{cat.items.length}</strong> ta amal</span>
                        <span>•</span>
                        <span className={cat.color}>{cat.title}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Total Summary */}
            <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="py-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-4">Umumiy ma'lumot</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {Object.entries(amallarData).map(([key, cat]) => (
                      <div key={key} className={cn("px-4 py-2 rounded-lg", cat.bgColor)}>
                        <span className={cn("font-bold", cat.color)}>{cat.items.length}</span>
                        <span className="text-muted-foreground ml-1">{cat.title.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Jami: <strong className="text-primary">
                      {Object.values(amallarData).reduce((acc, cat) => acc + cat.items.length, 0)}
                    </strong> ta amal
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AmalDetailModal
        amal={selectedAmal}
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default Amallar;
