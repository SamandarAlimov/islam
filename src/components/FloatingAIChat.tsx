import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useVoiceInput, useVoiceOutput } from "@/hooks/useVoice";

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "As-salamu alaykum! I'm your Islamic AI assistant. Ask me anything about Islam, and I'll provide answers with authentic references from the Qur'an and Hadith. You can type or use voice input!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, isSupported: voiceInputSupported, toggleListening } = useVoiceInput({
    onResult: (text) => {
      setInput(text);
    },
    onError: (error) => {
      toast({ title: 'Voice Error', description: error, variant: 'destructive' });
    },
  });

  const { isSpeaking, isSupported: voiceOutputSupported, speak, stop } = useVoiceOutput({
    rate: 0.9,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update input with transcript while speaking
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    let assistantContent = "";
    const addAssistantMessage = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alsamos-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) addAssistantMessage(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setIsLoading(false);
      
      // Speak the response if voice output is enabled
      if (voiceOutputEnabled && assistantContent) {
        speak(assistantContent);
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      toggleListening();
      // Auto-send if there's input after stopping
      if (input.trim()) {
        setTimeout(() => sendMessage(), 100);
      }
    } else {
      toggleListening();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glow",
          "bg-gradient-hero text-primary-foreground",
          "flex items-center justify-center transition-transform hover:scale-110",
          isOpen && "scale-0"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-card rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-hero text-primary-foreground p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Alsamos AI Scholar</h3>
              <p className="text-xs opacity-90">Voice & text - authentic Islamic knowledge</p>
            </div>
            <div className="flex items-center gap-2">
              {voiceOutputSupported && (
                <button
                  onClick={() => {
                    if (isSpeaking) stop();
                    setVoiceOutputEnabled(!voiceOutputEnabled);
                  }}
                  className={cn(
                    "p-1 rounded-lg transition",
                    voiceOutputEnabled ? "bg-white/30" : "hover:bg-white/20"
                  )}
                  title={voiceOutputEnabled ? "Disable voice responses" : "Enable voice responses"}
                >
                  {voiceOutputEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg max-w-[85%]",
                    msg.role === "assistant"
                      ? "bg-primary-lighter text-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="bg-primary-lighter text-foreground p-3 rounded-lg max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            {isListening && (
              <div className="mb-2 p-2 bg-primary-lighter rounded-lg text-sm text-center animate-pulse">
                🎤 Listening... Speak now
              </div>
            )}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isListening ? "Listening..." : "Ask about Islam..."}
                className="flex-1"
                disabled={isLoading || isListening}
              />
              {voiceInputSupported && (
                <Button
                  onClick={handleVoiceToggle}
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  className={isListening ? "bg-destructive hover:bg-destructive/90" : ""}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-hero"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChat;
