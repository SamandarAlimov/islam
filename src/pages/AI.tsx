import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send, Sparkles, BookOpen, Scale, Heart, MessageCircle,
  Loader2, Mic, MicOff, Upload, AudioWaveform, StopCircle,
  FileAudio, Plus, Trash2, Clock, ChevronLeft, Menu,
  Moon, GraduationCap, Baby, Coins, Droplets, Plane, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";

type Message = { role: "user" | "assistant"; content: string; audioUrl?: string; audioBase64?: string; audioMimeType?: string };
type ChatSession = { id: string; title: string; messages: Message[]; createdAt: number };

const STORAGE_KEY = "alsamos-ai-history";

const loadHistory = (): ChatSession[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
};

const saveHistory = (sessions: ChatSession[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
};

const categories = [
  { name: "Namoz", icon: Heart, color: "from-rose-500/20 to-rose-600/10 text-rose-600 dark:text-rose-400" },
  { name: "Fiqh", icon: Scale, color: "from-blue-500/20 to-blue-600/10 text-blue-600 dark:text-blue-400" },
  { name: "Aqiyda", icon: BookOpen, color: "from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400" },
  { name: "Oila", icon: Baby, color: "from-pink-500/20 to-pink-600/10 text-pink-600 dark:text-pink-400" },
  { name: "Zakot", icon: Coins, color: "from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400" },
  { name: "Tahorat", icon: Droplets, color: "from-cyan-500/20 to-cyan-600/10 text-cyan-600 dark:text-cyan-400" },
  { name: "Ro'za", icon: Moon, color: "from-indigo-500/20 to-indigo-600/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Haj", icon: Plane, color: "from-orange-500/20 to-orange-600/10 text-orange-600 dark:text-orange-400" },
];

const sampleQuestions = [
  "Islomning beshta ustuni nima?",
  "Tayammum qanday qilinadi?",
  "Qur'onda sabr haqida nima deyilgan?",
  "Namozning farzlari nechta?",
  "Zakotni kechiktirish mumkinmi?",
  "Ro'za tutishning shartlari nima?",
];

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(loadHistory);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alsamos-ai`;
  const AUDIO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quran-audio-recognize`;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Save session when messages change
  useEffect(() => {
    if (messages.length === 0 || !currentSessionId) return;
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === currentSessionId ? { ...s, messages, title: messages[0]?.content.slice(0, 40) || s.title } : s
      );
      saveHistory(updated);
      return updated;
    });
  }, [messages, currentSessionId]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const newChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setAudioBlob(null);
    setSidebarOpen(false);
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveHistory(updated);
      return updated;
    });
    if (currentSessionId === id) newChat();
  };

  // ===== Chat streaming =====
  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ messages: userMessages }),
    });
    if (resp.status === 429) throw new Error("Juda ko'p so'rov. Biroz kuting.");
    if (resp.status === 402) throw new Error("AI xizmati uchun kredit yetarli emas.");
    if (!resp.ok || !resp.body) throw new Error("AI bilan bog'lanishda xatolik");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "", content = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, idx);
        buf = buf.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ") || line.trim() === "") continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") return;
        try {
          const c = JSON.parse(json).choices?.[0]?.delta?.content;
          if (c) {
            content += c;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
              return [...prev, { role: "assistant", content }];
            });
          }
        } catch { buf = line + "\n" + buf; break; }
      }
    }
  };

  const handleSubmit = async (text?: string) => {
    const q = (text || input).trim();
    if (!q || isLoading) return;
    setInput("");

    // Create session if new
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      const newSession: ChatSession = { id: sessionId, title: q.slice(0, 40), messages: [], createdAt: Date.now() };
      setSessions(prev => { const u = [newSession, ...prev]; saveHistory(u); return u; });
    }

    const userMsg: Message = { role: "user", content: q };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);
    try { await streamChat(updated); }
    catch (e) { toast({ variant: "destructive", title: "Xatolik", description: e instanceof Error ? e.message : "Xatolik" }); }
    finally { setIsLoading(false); }
  };

  // ===== Audio =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4" });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { setAudioBlob(new Blob(chunksRef.current, { type: mr.mimeType })); stream.getTracks().forEach(t => t.stop()); };
      mr.start();
      setIsRecording(true);
    } catch { toast({ variant: "destructive", title: "Xatolik", description: "Mikrofonga ruxsat berilmadi." }); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("audio/")) setAudioBlob(f);
    else if (f) toast({ variant: "destructive", title: "Xatolik", description: "Faqat audio fayllar qabul qilinadi." });
  };

  const blobToBase64 = useCallback(async (blob: Blob): Promise<string> => {
    const ab = await blob.arrayBuffer();
    const bytes = new Uint8Array(ab);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
    }
    return btoa(binary);
  }, []);

  const streamAudioRecognition = useCallback(async (base64: string, mimeType: string) => {
    const resp = await fetch(AUDIO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ audio: base64, mimeType }),
    });
    if (!resp.ok || !resp.body) throw new Error("Audio tahlilida xatolik");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "", content = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, idx);
        buf = buf.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") return;
        try {
          const c = JSON.parse(json).choices?.[0]?.delta?.content;
          if (c) {
            content += c;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
              return [...prev, { role: "assistant", content }];
            });
          }
        } catch { buf = line + "\n" + buf; break; }
      }
    }
  }, [AUDIO_URL]);

  const recognizeAudio = useCallback(async () => {
    if (!audioBlob || isRecognizing) return;
    setIsRecognizing(true);

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      const ns: ChatSession = { id: sessionId, title: "🎵 Oyat aniqlash", messages: [], createdAt: Date.now() };
      setSessions(prev => { const u = [ns, ...prev]; saveHistory(u); return u; });
    }

    try {
      const base64 = await blobToBase64(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setMessages(prev => [...prev, { 
        role: "user", 
        content: "", 
        audioUrl, 
        audioBase64: base64, 
        audioMimeType: audioBlob.type 
      }]);

      await streamAudioRecognition(base64, audioBlob.type);
    } catch (e) {
      toast({ variant: "destructive", title: "Xatolik", description: e instanceof Error ? e.message : "Xatolik" });
    } finally {
      setIsRecognizing(false);
      setAudioBlob(null);
    }
  }, [audioBlob, isRecognizing, currentSessionId, toast, blobToBase64, streamAudioRecognition]);

  const transcribeAudioMessage = useCallback(async (msgIdx: number) => {
    const msg = messages[msgIdx];
    if (!msg?.audioBase64 || !msg?.audioMimeType) return;
    
    // Update message to show loading state
    setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, content: "⏳ Matn aniqlanmoqda..." } : m));
    setIsLoading(true);

    try {
      const resp = await fetch(AUDIO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ audio: msg.audioBase64, mimeType: msg.audioMimeType }),
      });
      if (!resp.ok || !resp.body) throw new Error("Audio tahlilida xatolik");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", content = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) {
              content += c;
              setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, content } : m));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, content: "" } : m));
      toast({ variant: "destructive", title: "Xatolik", description: e instanceof Error ? e.message : "Xatolik" });
    } finally {
      setIsLoading(false);
    }
  }, [messages, AUDIO_URL, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navigation />

      <div className="flex-1 flex overflow-hidden pt-20 md:pt-24">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:relative z-40 h-full
          w-72 bg-card border-r border-border flex flex-col
          transition-transform duration-300
        `}>
          <div className="p-3 border-b border-border">
            <Button onClick={newChat} className="w-full bg-gradient-hero gap-2 font-medium">
              <Plus className="w-4 h-4" /> Yangi suhbat
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Hali suhbat tarixi yo'q</p>
              ) : sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => loadSession(s)}
                  role="button"
                  tabIndex={0}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all group flex items-center gap-2 cursor-pointer
                    ${currentSessionId === s.id
                      ? "bg-primary/10 text-foreground border border-primary/20"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0 opacity-50" />
                  <span className="flex-1 truncate">{s.title}</span>
                  <button
                    onClick={(e) => deleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main chat area */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">Alsamos AI</h1>
                <p className="text-[10px] text-muted-foreground">Islomiy bilimlar yordamchisi</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto text-[10px]">AI</Badge>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            {!hasMessages ? (
              /* Welcome screen */
              <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 max-w-3xl mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Assalomu alaykum!</h2>
                <p className="text-sm text-muted-foreground text-center mb-8 max-w-md">
                  Men Alsamos AI — Qur'on va hadislar asosida islomiy savollarga javob beraman. Savolingizni yozing yoki audio orqali oyat aniqlang.
                </p>

                {/* Category chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleSubmit(`${cat.name} haqida batafsil ma'lumot bering`)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cat.color} border border-border/50 hover:shadow-md transition-all text-sm font-medium`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {/* Sample questions */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmit(q)}
                      className="text-left p-3 md:p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="text-sm text-foreground">{q}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="max-w-3xl mx-auto py-4 px-4 space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[85%] md:max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md"
                        : "text-foreground"
                    }`}>
                      {msg.role === "user" && msg.audioUrl ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4 flex-shrink-0 opacity-80" />
                            <span className="text-xs font-medium opacity-80">Audio xabar</span>
                          </div>
                          <audio src={msg.audioUrl} controls className="w-full h-8 [&::-webkit-media-controls-panel]:bg-primary-foreground/20 rounded-lg" />
                          {!msg.content && msg.audioBase64 && (
                            <button
                              onClick={() => transcribeAudioMessage(idx)}
                              disabled={isLoading}
                              className="flex items-center gap-1.5 text-xs bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1.5 rounded-lg transition-colors mt-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Matnga o'tkazish
                            </button>
                          )}
                          {msg.content && msg.content !== "⏳ Matn aniqlanmoqda..." && (
                            <div className="border-t border-primary-foreground/20 pt-2 mt-1">
                              <p className="text-xs opacity-70 mb-1">📝 Aniqlangan matn:</p>
                              <div className="text-sm prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                          {msg.content === "⏳ Matn aniqlanmoqda..." && (
                            <div className="flex items-center gap-2 text-xs opacity-80 mt-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Matn aniqlanmoqda...
                            </div>
                          )}
                        </div>
                      ) : msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 text-sm leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audio recording overlay */}
          {(isRecording || audioBlob) && (
            <div className="border-t border-border bg-card/95 backdrop-blur px-4 py-3">
              <div className="max-w-3xl mx-auto flex items-center gap-3">
                {isRecording ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-sm font-mono font-semibold text-destructive">{formatTime(recordingTime)}</span>
                    <span className="text-xs text-muted-foreground flex-1">Yozib olinmoqda...</span>
                    <Button size="sm" variant="destructive" onClick={stopRecording}>
                      <StopCircle className="w-4 h-4 mr-1" /> To'xtatish
                    </Button>
                  </>
                ) : audioBlob ? (
                  <>
                    <FileAudio className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">Audio tayyor</p>
                      <p className="text-[10px] text-muted-foreground">{(audioBlob.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 max-w-[140px]" />
                    <Button size="sm" onClick={recognizeAudio} disabled={isRecognizing} className="bg-gradient-hero">
                      {isRecognizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><AudioWaveform className="w-4 h-4 mr-1" /> Aniqlash</>}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAudioBlob(null)}>✕</Button>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2 bg-muted/50 rounded-2xl border border-border px-4 py-2 focus-within:border-primary/40 focus-within:shadow-sm transition-all">
                {/* File upload */}
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted flex-shrink-0"
                  title="Audio fayl yuklash"
                >
                  <Upload className="w-5 h-5" />
                </button>

                {/* Mic */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                    isRecording ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={isRecording ? "To'xtatish" : "Audio yozib olish"}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    // Auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Savol yozing yoki audio yuboring..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-2 max-h-[120px] min-h-[24px]"
                  rows={1}
                  disabled={isLoading}
                />

                {/* Send */}
                <Button
                  onClick={() => handleSubmit()}
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90 rounded-xl w-9 h-9 flex-shrink-0"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                AI yordamchi — shaxsiy fatvo uchun malakali olimga murojaat qiling
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AI;
