import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import Prayer from "./pages/Prayer";
import AI from "./pages/AI";
import Articles from "./pages/Articles";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Tasbih from "./pages/Tasbih";
import Media from "./pages/Media";
import Masjid from "./pages/Masjid";
import Qibla from "./pages/Qibla";
import Taqvim from "./pages/Taqvim";
import Duolar from "./pages/Duolar";
import Qazo from "./pages/Qazo";
import NamozTurlari from "./pages/NamozTurlari";
import Amallar from "./pages/Amallar";
import NamozOrganish from "./pages/NamozOrganish";
import Tajwid from "./pages/Tajwid";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/media" element={<Media />} />
          <Route path="/masjid" element={<Masjid />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/taqvim" element={<Taqvim />} />
          <Route path="/duolar" element={<Duolar />} />
          <Route path="/qazo" element={<Qazo />} />
          <Route path="/namoz-turlari" element={<NamozTurlari />} />
          <Route path="/amallar" element={<Amallar />} />
          <Route path="/namoz-organish" element={<NamozOrganish />} />
          <Route path="/tajwid" element={<Tajwid />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
