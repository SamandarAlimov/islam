import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Radio, Tv, Newspaper, Play, Pause, Volume2, ExternalLink } from "lucide-react";

const RADIO_STATIONS = [
  { 
    name: "Quran Radio - Mishary Rashid", 
    url: "https://backup.qurango.net/radio/mishary", 
    reciter: "Mishary Rashid Alafasy",
    country: "Kuwait"
  },
  { 
    name: "Quran Radio - Abdul Basit", 
    url: "https://backup.qurango.net/radio/abdulbasit_mjwod", 
    reciter: "Abdul Basit Abdus Samad",
    country: "Egypt"
  },
  { 
    name: "Quran Radio - Sudais", 
    url: "https://backup.qurango.net/radio/sudais", 
    reciter: "Abdul Rahman Al-Sudais",
    country: "Saudi Arabia"
  },
  { 
    name: "Quran Radio - Shuraim", 
    url: "https://backup.qurango.net/radio/shuraim", 
    reciter: "Saud Al-Shuraim",
    country: "Saudi Arabia"
  },
  { 
    name: "Quran Radio - Maher Al Muaiqly", 
    url: "https://backup.qurango.net/radio/maher", 
    reciter: "Maher Al Muaiqly",
    country: "Saudi Arabia"
  },
  { 
    name: "Quran Radio - Saad Al-Ghamdi", 
    url: "https://backup.qurango.net/radio/saad", 
    reciter: "Saad Al-Ghamdi",
    country: "Saudi Arabia"
  },
];

const TV_CHANNELS = [
  { 
    name: "Makkah Live", 
    description: "24/7 live broadcast from Masjid Al-Haram",
    url: "https://www.youtube.com/watch?v=kQz8vfZLbDE",
    type: "Live Stream"
  },
  { 
    name: "Madinah Live", 
    description: "24/7 live broadcast from Masjid An-Nabawi",
    url: "https://www.youtube.com/watch?v=R4bV3lMUl6g",
    type: "Live Stream"
  },
  { 
    name: "Peace TV", 
    description: "Islamic lectures and educational content",
    url: "https://peacetv.tv",
    type: "Channel"
  },
  { 
    name: "Huda TV", 
    description: "English Islamic educational channel",
    url: "https://www.huda.tv",
    type: "Channel"
  },
  { 
    name: "Islam Channel", 
    description: "British Islamic TV channel",
    url: "https://www.islamchannel.tv",
    type: "Channel"
  },
];

const NEWS_SOURCES = [
  { 
    name: "IslamOnline", 
    description: "Comprehensive Islamic news and articles",
    url: "https://www.islamonline.net",
    category: "News & Articles"
  },
  { 
    name: "Muslim News", 
    description: "News for the Muslim community",
    url: "https://muslimnews.co.uk",
    category: "News"
  },
  { 
    name: "Islamic Relief", 
    description: "Humanitarian news and charity updates",
    url: "https://www.islamic-relief.org/news",
    category: "Charity"
  },
  { 
    name: "Yaqeen Institute", 
    description: "Islamic research and articles",
    url: "https://yaqeeninstitute.org",
    category: "Research"
  },
  { 
    name: "Seekers Guidance", 
    description: "Islamic answers and educational content",
    url: "https://seekersguidance.org",
    category: "Education"
  },
  { 
    name: "About Islam", 
    description: "Islamic counseling and Q&A",
    url: "https://aboutislam.net",
    category: "Q&A"
  },
];

const Media = () => {
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  const playStation = (url: string) => {
    if (currentStation === url && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = url;
      audio.play();
      setCurrentStation(url);
      setIsPlaying(true);
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Islamic Media
          </h1>
          <p className="text-muted-foreground">
            Quran Radio, Islamic TV Channels, and News
          </p>
        </div>

        <Tabs defaultValue="radio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="radio" className="gap-2">
              <Radio className="w-4 h-4" />
              Radio
            </TabsTrigger>
            <TabsTrigger value="tv" className="gap-2">
              <Tv className="w-4 h-4" />
              TV
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" />
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radio" className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary" />
                  Quran Radio Stations
                </CardTitle>
                <CardDescription>
                  24/7 Quran recitation from renowned reciters
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {RADIO_STATIONS.map((station) => (
                <Card 
                  key={station.url} 
                  className={`cursor-pointer transition-all ${
                    currentStation === station.url && isPlaying 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => playStation(station.url)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStation === station.url && isPlaying 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {currentStation === station.url && isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{station.reciter}</h3>
                        <p className="text-sm text-muted-foreground">{station.country}</p>
                      </div>
                    </div>
                    {currentStation === station.url && isPlaying && (
                      <div className="flex items-center gap-1 text-primary">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="text-xs">Live</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tv" className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-primary" />
                  Islamic TV Channels
                </CardTitle>
                <CardDescription>
                  Live streams and educational Islamic channels
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {TV_CHANNELS.map((channel) => (
                <Card 
                  key={channel.name}
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => openExternal(channel.url)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Tv className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{channel.type}</Badge>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-primary" />
                  Islamic News & Resources
                </CardTitle>
                <CardDescription>
                  Stay informed with reputable Islamic news sources
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {NEWS_SOURCES.map((source) => (
                <Card 
                  key={source.name}
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => openExternal(source.url)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{source.name}</h3>
                      <Badge variant="outline" className="text-xs">{source.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Media;
