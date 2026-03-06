import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";
import alsamosLogo from "@/assets/alsamos-logo.png";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "Yuborildi!", description: "Email manzilingizga parolni tiklash havolasi yuborildi." });
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Parolni tiklash</CardTitle>
            <CardDescription className="text-sm">
              {sent
                ? "Email manzilingizga parolni tiklash havolasi yuborildi"
                : "Email manzilingizni kiriting va biz sizga parolni tiklash havolasini yuboramiz"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>{email}</strong> manziliga havola yuborildi. Iltimos, emailingizni tekshiring.
                </p>
                <Button variant="outline" onClick={() => setSent(false)} className="w-full h-11">
                  Boshqa email yuborish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button
                  type="submit"
                  className="w-full h-11 font-semibold bg-gradient-hero shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Havola yuborish
                </Button>
              </form>
            )}
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

export default ForgotPassword;
