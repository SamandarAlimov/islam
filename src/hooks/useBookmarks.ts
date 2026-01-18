import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Bookmark {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number | null;
  note: string | null;
  created_at: string;
}

export const useBookmarks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Bookmark[];
    },
  });

  const addBookmark = useMutation({
    mutationFn: async ({ surah_number, ayah_number, note }: { 
      surah_number: number; 
      ayah_number?: number; 
      note?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          surah_number,
          ayah_number: ayah_number || null,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({
        title: "Bookmark added",
        description: "Verse saved to your bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeBookmark = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({
        title: "Bookmark removed",
        description: "Verse removed from your bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isBookmarked = (surahNumber: number, ayahNumber?: number) => {
    return bookmarks?.some(
      b => b.surah_number === surahNumber && 
      (ayahNumber === undefined || b.ayah_number === ayahNumber)
    );
  };

  const getBookmark = (surahNumber: number, ayahNumber?: number) => {
    return bookmarks?.find(
      b => b.surah_number === surahNumber && 
      (ayahNumber === undefined || b.ayah_number === ayahNumber)
    );
  };

  return {
    bookmarks,
    isLoading,
    addBookmark: addBookmark.mutate,
    removeBookmark: removeBookmark.mutate,
    isBookmarked,
    getBookmark,
  };
};
