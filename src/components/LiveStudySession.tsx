import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare, BookOpen, Send, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveMessage {
  id: string;
  user_id: string;
  user_email: string;
  message: string;
  timestamp: string;
  surah?: number;
  ayah?: number;
}

interface LiveStudySessionProps {
  groupId: string;
  groupName: string;
  currentSurah?: number;
  currentAyah?: number;
}

const LiveStudySession = ({ groupId, groupName, currentSurah, currentAyah }: LiveStudySessionProps) => {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLive) return;

    // Subscribe to group notes for real-time updates
    const channel = supabase
      .channel(`live-session-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_notes',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          const newNote = payload.new as any;
          // Fetch user email
          const { data: userData } = await supabase.auth.getUser();
          
          setMessages((prev) => [...prev, {
            id: newNote.id,
            user_id: newNote.user_id,
            user_email: newNote.user_id === userData.user?.id ? 'You' : 'Member',
            message: newNote.note,
            timestamp: newNote.created_at,
            surah: newNote.surah_number,
            ayah: newNote.ayah_number,
          }]);
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state).map(key => {
          const presence = state[key] as any[];
          return presence[0]?.user_email || 'Anonymous';
        });
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        toast({
          title: "User joined",
          description: `${newPresences[0]?.user_email || 'Someone'} joined the session`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        toast({
          title: "User left",
          description: `${leftPresences[0]?.user_email || 'Someone'} left the session`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              user_email: user.email,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, isLive, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('group_notes').insert({
      group_id: groupId,
      user_id: user.id,
      note: newMessage,
      surah_number: currentSurah || 1,
      ayah_number: currentAyah || 1,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
  };

  const startSession = async () => {
    setIsLive(true);
    toast({
      title: "Live Session Started",
      description: "You are now connected to the study group",
    });
  };

  const endSession = () => {
    setIsLive(false);
    setMessages([]);
    setActiveUsers([]);
  };

  if (!isLive) {
    return (
      <Card className="border-2 border-dashed border-primary/30">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="w-12 h-12 text-primary/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Live Study Session</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Join a real-time collaborative reading session with your group
          </p>
          <Button onClick={startSession} className="gap-2">
            <Circle className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
            Start Live Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
            Live: {groupName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={endSession}>
            End Session
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {activeUsers.map((user, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              <Circle className="w-2 h-2 fill-green-500 mr-1" />
              {user}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Reading */}
        {currentSurah && (
          <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Currently reading: Surah {currentSurah}, Ayah {currentAyah || 1}
            </span>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="h-[200px] border rounded-lg p-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Share your thoughts about the verses...
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-primary">{msg.user_email}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  {msg.surah && (
                    <span className="text-[10px] text-muted-foreground">
                      Re: Surah {msg.surah}:{msg.ayah}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button size="icon" onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStudySession;
