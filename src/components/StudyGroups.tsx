import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Plus, 
  Copy, 
  LogOut, 
  Trash2,
  MessageSquare,
  Send,
  UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  invite_code: string;
  is_public: boolean;
  created_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

interface GroupNote {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number;
  note: string;
  created_at: string;
}

interface StudyGroupsProps {
  surahNumber?: number;
  ayahNumber?: number;
  onSelectGroup?: (groupId: string) => void;
}

const StudyGroups = ({ surahNumber, ayahNumber, onSelectGroup }: StudyGroupsProps) => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [notes, setNotes] = useState<GroupNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user and groups
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch groups user is member of
      const { data: memberData } = await supabase
        .from('study_group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (memberData && memberData.length > 0) {
        const groupIds = memberData.map(m => m.group_id);
        const { data: groupsData } = await supabase
          .from('study_groups')
          .select('*')
          .in('id', groupIds);

        if (groupsData) {
          setGroups(groupsData as StudyGroup[]);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Fetch group members and notes when group is selected
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchGroupData = async () => {
      const { data: membersData } = await supabase
        .from('study_group_members')
        .select('*')
        .eq('group_id', selectedGroup.id);

      if (membersData) {
        setMembers(membersData as GroupMember[]);
      }

      // Fetch notes for current surah/ayah if provided
      if (surahNumber) {
        let query = supabase
          .from('group_notes')
          .select('*')
          .eq('group_id', selectedGroup.id)
          .eq('surah_number', surahNumber)
          .order('created_at', { ascending: false });

        if (ayahNumber) {
          query = query.eq('ayah_number', ayahNumber);
        }

        const { data: notesData } = await query;
        if (notesData) {
          setNotes(notesData as GroupNote[]);
        }
      }
    };

    fetchGroupData();
  }, [selectedGroup, surahNumber, ayahNumber]);

  const createGroup = async () => {
    if (!userId || !newGroupName.trim()) return;

    const { data: groupData, error: groupError } = await supabase
      .from('study_groups')
      .insert({
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || null,
        owner_id: userId,
      })
      .select()
      .single();

    if (groupError) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
      return;
    }

    // Add creator as owner member
    await supabase
      .from('study_group_members')
      .insert({
        group_id: groupData.id,
        user_id: userId,
        role: 'owner',
      });

    setGroups(prev => [...prev, groupData as StudyGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateDialog(false);
    
    toast({
      title: "Success",
      description: "Study group created!",
    });
  };

  const joinGroup = async () => {
    if (!userId || !inviteCode.trim()) return;

    // Find group by invite code
    const { data: groupData, error: findError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single();

    if (findError || !groupData) {
      toast({
        title: "Error",
        description: "Invalid invite code",
        variant: "destructive",
      });
      return;
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('study_group_members')
      .select('id')
      .eq('group_id', groupData.id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      toast({
        title: "Already a member",
        description: "You're already in this group",
      });
      return;
    }

    // Join group
    const { error: joinError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: groupData.id,
        user_id: userId,
        role: 'member',
      });

    if (joinError) {
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
      return;
    }

    setGroups(prev => [...prev, groupData as StudyGroup]);
    setInviteCode('');
    setShowJoinDialog(false);
    
    toast({
      title: "Success",
      description: `Joined ${groupData.name}!`,
    });
  };

  const leaveGroup = async (groupId: string) => {
    if (!userId) return;

    await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    setGroups(prev => prev.filter(g => g.id !== groupId));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }

    toast({
      title: "Left group",
      description: "You have left the study group",
    });
  };

  const addNote = async () => {
    if (!userId || !selectedGroup || !surahNumber || !newNote.trim()) return;

    const { data, error } = await supabase
      .from('group_notes')
      .insert({
        group_id: selectedGroup.id,
        user_id: userId,
        surah_number: surahNumber,
        ayah_number: ayahNumber || 1,
        note: newNote.trim(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      return;
    }

    setNotes(prev => [data as GroupNote, ...prev]);
    setNewNote('');
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
  };

  if (!userId) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="w-4 h-4" />
            Study Groups
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Study Groups</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Sign in to use study groups</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          Study Groups
          {groups.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {groups.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Study Groups
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Create/Join Buttons */}
          <div className="flex gap-2">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1 gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                  <Button onClick={createGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <UserPlus className="w-4 h-4" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Enter invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                  <Button onClick={joinGroup} className="w-full">
                    Join Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Groups List */}
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No study groups yet</p>
              <p className="text-sm">Create or join a group to study together</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedGroup?.id === group.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        {group.description && (
                          <p className="text-sm text-muted-foreground">
                            {group.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyInviteCode(group.invite_code);
                          }}
                          title="Copy invite code"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            leaveGroup(group.id);
                          }}
                          title="Leave group"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Code: {group.invite_code}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Group Notes Section */}
          {selectedGroup && surahNumber && (
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes for Surah {surahNumber}
                {ayahNumber && `, Ayah ${ayahNumber}`}
              </h4>

              {/* Add Note */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addNote} disabled={!newNote.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Notes List */}
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.created_at).toLocaleDateString()}
                        {note.ayah_number && ` • Ayah ${note.ayah_number}`}
                      </p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No notes yet. Be the first to share!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StudyGroups;
