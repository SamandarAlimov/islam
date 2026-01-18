import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ReadingPlan {
  id: string;
  user_id: string;
  plan_type: string;
  total_days: number;
  start_date: string;
  current_day: number;
  completed_surahs: number[];
  is_active: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingHistory {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number | null;
  read_at: string;
}

// Calculate daily surahs for a given plan
export const getDailySurahPlan = (totalDays: number = 30): number[][] => {
  const totalSurahs = 114;
  const surahsPerDay = Math.ceil(totalSurahs / totalDays);
  const plan: number[][] = [];
  
  for (let day = 0; day < totalDays; day++) {
    const start = day * surahsPerDay + 1;
    const end = Math.min((day + 1) * surahsPerDay, totalSurahs);
    const dailySurahs: number[] = [];
    for (let s = start; s <= end; s++) {
      dailySurahs.push(s);
    }
    if (dailySurahs.length > 0) {
      plan.push(dailySurahs);
    }
  }
  
  return plan;
};

export const useReadingPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activePlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: ['reading-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as ReadingPlan | null;
    },
  });

  const createPlan = useMutation({
    mutationFn: async ({ planType, totalDays }: { planType: string; totalDays: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Deactivate existing plans
      await supabase
        .from('reading_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      const { data, error } = await supabase
        .from('reading_plans')
        .insert({
          user_id: user.id,
          plan_type: planType,
          total_days: totalDays,
          completed_surahs: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-plan'] });
      toast({ title: 'Success', description: 'Reading plan created!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateProgress = useMutation({
    mutationFn: async ({ surahNumber }: { surahNumber: number }) => {
      if (!activePlan) throw new Error('No active plan');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const completedSurahs = [...(activePlan.completed_surahs || [])];
      if (!completedSurahs.includes(surahNumber)) {
        completedSurahs.push(surahNumber);
      }

      // Calculate current day based on progress
      const plan = getDailySurahPlan(activePlan.total_days);
      let currentDay = 1;
      for (let day = 0; day < plan.length; day++) {
        const daySurahs = plan[day];
        if (daySurahs.every(s => completedSurahs.includes(s))) {
          currentDay = day + 2;
        }
      }
      currentDay = Math.min(currentDay, activePlan.total_days);

      const { error } = await supabase
        .from('reading_plans')
        .update({
          completed_surahs: completedSurahs,
          current_day: currentDay,
        })
        .eq('id', activePlan.id);

      if (error) throw error;

      // Add to reading history
      await supabase.from('reading_history').insert({
        user_id: user.id,
        surah_number: surahNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-plan'] });
      queryClient.invalidateQueries({ queryKey: ['reading-history'] });
    },
  });

  const deletePlan = useMutation({
    mutationFn: async () => {
      if (!activePlan) throw new Error('No active plan');
      
      const { error } = await supabase
        .from('reading_plans')
        .delete()
        .eq('id', activePlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-plan'] });
      toast({ title: 'Plan deleted' });
    },
  });

  const getProgress = () => {
    if (!activePlan) return { percentage: 0, completedCount: 0, totalSurahs: 114 };
    const completedCount = activePlan.completed_surahs?.length || 0;
    return {
      percentage: Math.round((completedCount / 114) * 100),
      completedCount,
      totalSurahs: 114,
    };
  };

  const getTodaySurahs = () => {
    if (!activePlan) return [];
    const plan = getDailySurahPlan(activePlan.total_days);
    const dayIndex = activePlan.current_day - 1;
    return plan[dayIndex] || [];
  };

  return {
    activePlan,
    isLoadingPlan,
    createPlan,
    updateProgress,
    deletePlan,
    getProgress,
    getTodaySurahs,
  };
};

export const useReadingHistory = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['reading-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.id)
        .order('read_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ReadingHistory[];
    },
  });

  return { history, isLoading };
};
