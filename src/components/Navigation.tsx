import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  Home, 
  BookOpen, 
  ScrollText, 
  Clock, 
  Compass, 
  HandHeart, 
  Calendar, 
  Building2, 
  Circle, 
  ListChecks, 
  Play, 
  Bot,
  BookMarked,
  ChevronDown,
  Mic,
  type LucideIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import alsamosLogo from "@/assets/alsamos-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  path: string;
  label: string;
  icon: LucideIcon;
}

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const mainNavLinks: NavLink[] = [
    { path: "/", label: "Bosh sahifa", icon: Home },
    { path: "/quran", label: "Qur'on", icon: BookOpen },
    { path: "/hadith", label: "Hadis", icon: ScrollText },
    { path: "/prayer", label: "Namoz", icon: Clock },
    { path: "/qibla", label: "Qibla", icon: Compass },
    { path: "/ai", label: "AI", icon: Bot },
  ];

  const moreNavLinks: NavLink[] = [
    { path: "/namoz-turlari", label: "Namoz turlari", icon: BookMarked },
    { path: "/namoz-organish", label: "Namoz o'rganish", icon: BookOpen },
    { path: "/tajwid", label: "Tajwid qoidalari", icon: Mic },
    { path: "/amallar", label: "Amallar", icon: ListChecks },
    { path: "/duolar", label: "Duolar", icon: HandHeart },
    { path: "/taqvim", label: "Taqvim", icon: Calendar },
    { path: "/masjid", label: "Masjid", icon: Building2 },
    { path: "/tasbih", label: "Tasbeh", icon: Circle },
    { path: "/qazo", label: "Qazo", icon: ListChecks },
    { path: "/media", label: "Media", icon: Play },
  ];

  const allNavLinks = [...mainNavLinks, ...moreNavLinks];

  const isMoreActive = moreNavLinks.some(link => location.pathname === link.path);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/98 backdrop-blur-xl shadow-lg border-b border-border/60"
            : "bg-background backdrop-blur-lg border-b border-border/40"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <img
                src={alsamosLogo}
                alt="Alsamos Logo"
                className="w-10 h-10 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg lg:text-xl text-foreground tracking-tight">
                  Alsamos Islam
                </span>
                <span className="text-[10px] lg:text-xs text-muted-foreground hidden sm:block font-medium">
                  True Knowledge, True Guidance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isMoreActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    Ko'proq
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {moreNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link
                          to={link.path}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            location.pathname === link.path && "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Auth Buttons - Desktop */}
              <div className="hidden md:block">
                {user ? (
                  <Link to="/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">Profil</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Kirish
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button - Professional Hamburger */}
              <button
                className={cn(
                  "lg:hidden relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                  mobileMenuOpen 
                    ? "bg-primary" 
                    : "bg-accent/50 hover:bg-accent"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <span 
                  className={cn(
                    "w-5 h-0.5 rounded-full transition-all duration-300 ease-out",
                    mobileMenuOpen 
                      ? "bg-primary-foreground rotate-45 translate-y-2" 
                      : "bg-foreground"
                  )}
                />
                <span 
                  className={cn(
                    "w-5 h-0.5 rounded-full transition-all duration-300 ease-out",
                    mobileMenuOpen 
                      ? "bg-primary-foreground opacity-0 scale-0" 
                      : "bg-foreground opacity-100"
                  )}
                />
                <span 
                  className={cn(
                    "w-5 h-0.5 rounded-full transition-all duration-300 ease-out",
                    mobileMenuOpen 
                      ? "bg-primary-foreground -rotate-45 -translate-y-2" 
                      : "bg-foreground"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Tablet Navigation - Scrollable */}
          <div className="hidden md:flex lg:hidden pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 mx-auto">
              {allNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5",
                      location.pathname === link.path
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu - Slide from Right */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 lg:hidden bg-background shadow-2xl transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={alsamosLogo}
              alt="Alsamos Logo"
              className="w-8 h-8"
            />
            <span className="font-bold text-lg text-foreground">Menu</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-140px)] py-4 px-3">
          <div className="space-y-1">
            {allNavLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground hover:bg-accent/80 active:scale-[0.98]"
                  )}
                  style={{ 
                    animationDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                    animation: mobileMenuOpen ? 'slideInFromRight 0.3s ease-out forwards' : 'none',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(20px)'
                  }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isActive ? "bg-primary-foreground/20" : "bg-accent"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{link.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Footer - Auth */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          {user ? (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6 text-base rounded-xl border-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                Profilni ko'rish
              </Button>
            </Link>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full py-6 text-base shadow-lg rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Kirish / Ro'yxatdan o'tish
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Add CSS animation keyframes */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
