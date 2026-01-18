import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, User } from "lucide-react";
import { useState } from "react";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All Articles",
    "Aqeedah",
    "Fiqh",
    "Hadith",
    "Tafsir",
    "Seerah",
    "Islamic History",
    "Morality"
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding Tawheed: The Foundation of Islamic Belief",
      excerpt: "An in-depth exploration of the concept of Tawheed (monotheism) in Islam, its categories, and its fundamental importance in Islamic theology.",
      category: "Aqeedah",
      author: "Dr. Ahmad Hassan",
      readTime: "12 min read",
      date: "March 15, 2024",
      featured: true
    },
    {
      id: 2,
      title: "The Five Pillars of Islam: A Comprehensive Guide",
      excerpt: "Detailed explanation of the five pillars of Islam, their significance, and how they form the foundation of Muslim worship and practice.",
      category: "Fiqh",
      author: "Sheikh Muhammad Ali",
      readTime: "18 min read",
      date: "March 10, 2024",
      featured: true
    },
    {
      id: 3,
      title: "Prophetic Medicine: Healing Through Sunnah",
      excerpt: "Exploring the medical wisdom found in authentic Hadith and how the Prophet (ﷺ) approached health and wellness.",
      category: "Hadith",
      author: "Dr. Fatima Rahman",
      readTime: "10 min read",
      date: "March 5, 2024",
      featured: false
    },
    {
      id: 4,
      title: "Understanding Surah Al-Fatiha: The Opening Chapter",
      excerpt: "A detailed Tafsir of Surah Al-Fatiha, examining its meanings, themes, and the wisdom behind each verse.",
      category: "Tafsir",
      author: "Sheikh Omar Abdullah",
      readTime: "15 min read",
      date: "March 1, 2024",
      featured: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Islamic Knowledge Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore in-depth articles on Islamic theology, jurisprudence, history, and spirituality. 
              All content is carefully researched and referenced from authentic sources.
            </p>
          </div>

          {/* Search */}
          <Card className="mb-8 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles by topic or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-gradient-hero">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category, idx) => (
              <Badge
                key={idx}
                variant={idx === 0 ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  idx === 0 
                    ? "bg-primary hover:bg-primary/90" 
                    : "hover:bg-primary-lighter hover:border-primary"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.filter(a => a.featured).map((article) => (
                <Card key={article.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="mb-3">
                      <Badge variant="outline" className="border-primary text-primary">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{article.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Articles</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2">
                          <Badge variant="outline" className="border-primary text-primary">
                            {article.category}
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {article.excerpt}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Articles;
