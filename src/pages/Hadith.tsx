import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookText, CheckCircle, Info } from "lucide-react";
import { useState } from "react";
import hadithFeature from "@/assets/hadith-feature.jpg";

const Hadith = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const collections = [
    { name: "Sahih Bukhari", hadiths: 7563, description: "Most authentic Hadith collection" },
    { name: "Sahih Muslim", hadiths: 7190, description: "Second most authentic collection" },
    { name: "Sunan Abu Dawood", hadiths: 5274, description: "Comprehensive Fiqh collection" },
    { name: "Jami' at-Tirmidhi", hadiths: 3956, description: "Detailed commentary included" },
  ];

  const sampleHadiths = [
    {
      id: 1,
      collection: "Sahih Bukhari",
      book: "Book of Faith",
      number: 8,
      authenticity: "Sahih",
      text: "The Prophet (ﷺ) said, 'None of you will have faith till he loves me more than his father, his children and all mankind.'",
      narrator: "Anas bin Malik"
    },
    {
      id: 2,
      collection: "Sahih Muslim",
      book: "Book of Purification",
      number: 223,
      authenticity: "Sahih",
      text: "The Prophet (ﷺ) said, 'Cleanliness is half of faith.'",
      narrator: "Abu Malik Al-Ash'ari"
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Hadith Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore authentic Hadith from Sahih Bukhari, Muslim, and other major collections. 
              Each Hadith includes narrator chains, authenticity ratings, and scholarly commentary.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-medium">
            <img 
              src={hadithFeature} 
              alt="Hadith Manuscripts" 
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Search */}
          <Card className="mb-8 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by keyword, narrator, or topic..."
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

          {/* Collections */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Major Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, idx) => (
                <Card key={idx} className="shadow-soft hover:shadow-medium transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <BookText className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {collection.name}
                    </CardTitle>
                    <CardDescription>{collection.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-muted-foreground">
                      {collection.hadiths.toLocaleString()} Hadiths
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sample Hadiths */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Hadiths</h2>
            <div className="space-y-6">
              {sampleHadiths.map((hadith) => (
                <Card key={hadith.id} className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-primary text-primary">
                            {hadith.collection}
                          </Badge>
                          <Badge 
                            variant="default" 
                            className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {hadith.authenticity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {hadith.book} • Hadith {hadith.number}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4 text-lg">
                      {hadith.text}
                    </p>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Narrator:</span> {hadith.narrator}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hadith;
