import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, BookText, Clock, Sparkles, ArrowRight } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import quranFeature from "@/assets/quran-feature.jpg";
import hadithFeature from "@/assets/hadith-feature.jpg";
import prayerFeature from "@/assets/prayer-feature.jpg";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedDashboard from "@/components/AuthenticatedDashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Complete Qur'an",
      description: "All 114 Surahs with Uthmani script, translations, audio recitations, and scholarly Tafsir",
      link: "/quran",
      image: quranFeature,
    },
    {
      icon: BookText,
      title: "Hadith Library",
      description: "Sahih Bukhari, Muslim, and major collections with authenticity ratings and commentary",
      link: "/hadith",
      image: hadithFeature,
    },
    {
      icon: Clock,
      title: "Prayer Times",
      description: "Accurate prayer times based on your location with Qibla compass and monthly schedules",
      link: "/prayer",
      image: prayerFeature,
    },
  ];

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Show authenticated dashboard
  if (isAuthenticated) {
    return (
      <Layout>
        <AuthenticatedDashboard />
      </Layout>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden -mt-28 md:-mt-32 lg:-mt-36 pt-36 md:pt-44 lg:pt-52">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-6 shadow-glow">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Powered by AI • Authenticated Sources</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Alsamos Islam
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
            True Knowledge, True Guidance
          </p>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Your comprehensive Islamic knowledge platform. Access authentic Qur'an, Hadith, scholarly references, and AI-powered Islamic assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quran">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-glow shadow-glow">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Qur'an
              </Button>
            </Link>
            <Link to="/ai">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask Islamic AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Islamic Knowledge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access authentic Islamic resources with modern technology and AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={idx} to={feature.link}>
                  <Card className="shadow-soft hover:shadow-medium transition-all h-full group cursor-pointer overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* AI Assistant Card */}
          <Card className="shadow-medium bg-gradient-hero text-primary-foreground">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AI Islamic Scholar</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Get instant answers with authentic citations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-primary-foreground/90">
                Ask any Islamic question and receive scholarly answers with proper references from Qur'an, 
                authentic Hadith, and opinions from different Madhabs. Our AI never issues Fatwa but provides 
                educational references to help you understand Islamic rulings.
              </p>
              <Link to="/ai">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-glow">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Asking Questions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore More
            </h2>
            <p className="text-lg text-muted-foreground">
              Dive deeper into Islamic knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/articles">
              <Card className="shadow-soft hover:shadow-medium transition-all group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    Islamic Articles
                  </CardTitle>
                  <CardDescription>
                    In-depth articles on Aqeedah, Fiqh, Seerah, and more
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/prayer">
              <Card className="shadow-soft hover:shadow-medium transition-all group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    Qibla Compass
                  </CardTitle>
                  <CardDescription>
                    Find accurate Qibla direction from anywhere
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/quran">
              <Card className="shadow-soft hover:shadow-medium transition-all group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    Daily Ayah
                  </CardTitle>
                  <CardDescription>
                    Receive daily verses with translations
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/hadith">
              <Card className="shadow-soft hover:shadow-medium transition-all group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    Hadith of the Day
                  </CardTitle>
                  <CardDescription>
                    Learn from authentic Prophetic traditions
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">Alsamos Islam</span>
                  <span className="text-xs text-muted-foreground">True Knowledge, True Guidance</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Part of Alsamos Corp. — "MAKE IT REAL"
              </p>
              <p className="text-sm text-muted-foreground">
                Email: alsamos.company@gmail.com<br />
                Phone: +998 93 300 77 09
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/quran" className="hover:text-primary transition-colors">Qur'an</Link></li>
                <li><Link to="/hadith" className="hover:text-primary transition-colors">Hadith</Link></li>
                <li><Link to="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
                <li><Link to="/prayer" className="hover:text-primary transition-colors">Prayer Times</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://islam.alsamos.com" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="https://cloud.alsamos.com" className="hover:text-primary transition-colors">Alsamos Cloud</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Alsamos Corp. All rights reserved. Domain: islam.alsamos.com</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
