import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import alsamosLogo from "@/assets/alsamos-logo.png";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Muvaffaqiyat!", description: "Parolingiz yangilandi." });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <img src={alsamosLogo} alt="Alsamos Logo" className="w-14 h-14 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Noto'g'ri havola</h1>
          <p className="text-sm text-muted-foreground">
            Bu havola yaroqsiz yoki muddati tugagan. Iltimos, parolni tiklash jarayonini qayta boshlang.
          </p>
          <Link to="/forgot-password">
            <Button className="bg-gradient-hero">Parolni tiklash</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <img src={alsamosLogo} alt="Alsamos Logo" className="w-14 h-14 transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground tracking-tight">Alsamos Islam</span>
            <span className="text-xs text-muted-foreground font-medium">True Knowledge, True Guidance</span>
          </div>
        </Link>

        <Card className="shadow-medium border-border/60 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Yangi parol o'rnating</CardTitle>
            <CardDescription className="text-sm">
              Yangi parolingizni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  Yangi parol
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
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 font-semibold bg-gradient-hero shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Parolni yangilash
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/auth" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kirish sahifasiga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
