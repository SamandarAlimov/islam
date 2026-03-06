import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import alsamosLogo from "@/assets/alsamos-logo.png";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("Tasdiqlanmoqda...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const savedState = sessionStorage.getItem("alsamos_state");
      const codeVerifier = sessionStorage.getItem("alsamos_code_verifier");

      if (!code || !state || state !== savedState) {
        toast({
          title: "Xatolik",
          description: "Autentifikatsiya jarayonida xatolik yuz berdi.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      try {
        setStatus("Kirish amalga oshirilmoqda...");

        // Exchange code for token via edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alsamos-oauth-callback`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, code_verifier: codeVerifier }),
          }
        );

        if (!response.ok) {
          throw new Error("Token almashinuvida xatolik");
        }

        const data = await response.json();

        if (data.session) {
          toast({
            title: "Xush kelibsiz!",
            description: "Alsamos orqali muvaffaqiyatli kirdingiz.",
          });
        }

        // Cleanup
        sessionStorage.removeItem("alsamos_state");
        sessionStorage.removeItem("alsamos_code_verifier");

        navigate("/");
      } catch (error: any) {
        toast({
          title: "Xatolik",
          description: error.message || "Kirish amalga oshirilmadi.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <img src={alsamosLogo} alt="Alsamos" className="w-16 h-16 animate-pulse" />
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">{status}</p>
        </div>
        <p className="text-sm text-muted-foreground">Iltimos, kuting...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
