import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, Sparkles, KeyRound } from "lucide-react";
import { generatePKCE, generateState } from "@/lib/pkce";
import alsamosLogo from "@/assets/alsamos-logo.png";

const ALSAMOS_CLIENT_ID = "alsamos-islam";
const ALSAMOS_REDIRECT_URI = `${window.location.origin}/auth/callback`;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleAlsamosLogin = async () => {
    setIsOAuthLoading(true);
    try {
      const { codeVerifier, codeChallenge } = await generatePKCE();
      const state = generateState();

      sessionStorage.setItem("alsamos_code_verifier", codeVerifier);
      sessionStorage.setItem("alsamos_state", state);

      const params = new URLSearchParams({
        response_type: "code",
        client_id: ALSAMOS_CLIENT_ID,
        redirect_uri: ALSAMOS_REDIRECT_URI,
        scope: "openid profile email",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        mode: "login",
      });

      window.location.href = `https://accounts.alsamos.com/oauth/authorize?${params.toString()}`;
    } catch {
      toast({
        title: "Xatolik",
        description: "Alsamos orqali kirish amalga oshirilmadi.",
        variant: "destructive",
      });
      setIsOAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Xush kelibsiz!", description: "Siz muvaffaqiyatli kirdingiz." });
      navigate("/");
    } catch (error: any) {
      const msg = error.message.includes("Invalid login credentials")
        ? "Email yoki parol noto'g'ri. Iltimos, qaytadan urinib ko'ring."
        : error.message;
      toast({ title: "Xatolik", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Xatolik", description: "Parollar mos kelmayapti", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Xatolik", description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      toast({ title: "Hisob yaratildi!", description: "Endi tizimga kirishingiz mumkin." });
    } catch (error: any) {
      const msg = error.message.includes("User already registered")
        ? "Bu email allaqachon ro'yxatdan o'tgan. Iltimos, tizimga kiring."
        : error.message;
      toast({ title: "Xatolik", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <img
            src={alsamosLogo}
            alt="Alsamos Logo"
            className="w-14 h-14 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground tracking-tight">Alsamos Islam</span>
            <span className="text-xs text-muted-foreground font-medium">True Knowledge, True Guidance</span>
          </div>
        </Link>

        <Card className="shadow-medium border-border/60 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Xush kelibsiz</CardTitle>
            <CardDescription className="text-sm">
              Shaxsiy funksiyalarga kirish uchun hisobingizga kiring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Alsamos OAuth Button */}
            <Button
              onClick={handleAlsamosLogin}
              disabled={isOAuthLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
            >
              {isOAuthLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <img src={alsamosLogo} alt="" className="w-5 h-5" />
              )}
              Alsamos orqali kirish
            </Button>

            <div className="relative">
              <Separator className="my-1" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground font-medium">
                yoki
              </span>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="signin" className="text-sm font-medium gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Kirish
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-medium gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ro'yxatdan o'tish
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Parol
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Parolni unutdingizmi?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold bg-gradient-hero shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kirish
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Parol
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Parolni tasdiqlang
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold bg-gradient-hero shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hisob yaratish
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security note */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/40">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Ma'lumotlaringiz shifrlangan va xavfsiz saqlanadi
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Bosh sahifaga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
