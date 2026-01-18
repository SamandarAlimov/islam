import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, BookOpen, Scale, Heart, MessageCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "user" | "assistant"; content: string };

const AI = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alsamos-ai`;

  const categories = [
    { name: "Namoz", icon: Heart, description: "Namoz va ibodat haqida" },
    { name: "Fiqh", icon: Scale, description: "Islom huquqi va ahkomlari" },
    { name: "Aqiyda", icon: BookOpen, description: "E'tiqod va ilohiyot" },
    { name: "Oila", icon: MessageCircle, description: "Nikoh, farzand tarbiyasi" },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (resp.status === 429) {
      throw new Error("Juda ko'p so'rov. Iltimos, biroz kuting.");
    }
    if (resp.status === 402) {
      throw new Error("AI xizmati uchun kredit yetarli emas.");
    }
    if (!resp.ok || !resp.body) {
      throw new Error("AI bilan bog'lanishda xatolik");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch { /* ignore */ }
      }
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion("");
    const userMsg: Message = { role: "user", content: userQuestion };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      await streamChat(updatedMessages);
    } catch (error) {
      console.error("AI error:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: error instanceof Error ? error.message : "AI bilan bog'lanishda xatolik yuz berdi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Layout showAIChat={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Islom Yordamchisi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Islomiy Savollar So'rang
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Qur'on, ishonchli hadislar va olimlar ijmosiga asoslangan javoblar oling. 
              Turli mazhablar fikrlari bilan birga.
            </p>
          </div>

          {/* Important Notice */}
          <Card className="mb-6 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4 pb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Muhim:</span> Bu AI yordamchi ilmiy ma'lumotlar beradi, lekin shaxsiy fatvo uchun malakali olimga murojaat qiling.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-soft sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Mavzular</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {categories.map((category, idx) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuestion(`${category.name} haqida savol: `)}
                          className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-foreground">
                                {category.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-lg">Savolingizni yozing</CardTitle>
                    <CardDescription className="text-sm">
                      Islomiy savolingizga batafsil javob oling
                    </CardDescription>
                  </div>
                  {messages.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Tozalash
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Messages */}
                  {messages.length > 0 && (
                    <ScrollArea 
                      ref={scrollRef}
                      className="mb-4 h-[400px] pr-4"
                    >
                      <div className="space-y-4">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`p-4 rounded-2xl max-w-[85%] ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-muted/60 border border-border rounded-bl-md"
                              }`}
                            >
                              {msg.role === "assistant" && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    Alsamos AI
                                  </Badge>
                                </div>
                              )}
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                          <div className="flex justify-start">
                            <div className="bg-muted/60 border border-border p-4 rounded-2xl rounded-bl-md">
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Javob yozilmoqda...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}

                  {/* Empty State */}
                  {messages.length === 0 && (
                    <div className="mb-4 p-8 bg-muted/30 rounded-xl text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Assalomu alaykum!</h3>
                      <p className="text-sm text-muted-foreground">
                        Men Alsamos AI - islomiy bilimlar yordamchisi. Qur'on va hadislardan ma'lumotlar bilan yordam beraman.
                      </p>
                    </div>
                  )}

                  {/* Input */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Masalan: Namoz qilishning shartlari nima? Zakot qachon beriladi?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      className="min-h-24 resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={!question.trim() || isLoading}
                      className="w-full bg-gradient-hero hover:opacity-90"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Javob qidirilmoqda...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Savol berish
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Example Questions */}
              <Card className="shadow-soft mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Namuna savollar</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Islomning beshta ustuni nima?",
                      "Tayammum qanday qilinadi?",
                      "Qur'onda sabr haqida nima deyilgan?",
                      "Zakotni kechiktirish mumkinmi?",
                      "Namozning farzlari nechta?",
                      "Ro'za tutishning shartlari",
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuestion(q)}
                        disabled={isLoading}
                        className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm text-foreground disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AI;