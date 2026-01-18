import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_reading_days: number;
  created_at: string;
  updated_at: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string | null;
  earned_at: string;
}

export const BADGE_DEFINITIONS = [
  { type: 'first_read', name: 'First Step', description: 'Read your first Surah', icon: '📖', requirement: 1 },
  { type: 'streak_3', name: 'Getting Started', description: 'Maintain a 3-day streak', icon: '🔥', requirement: 3 },
  { type: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⭐', requirement: 7 },
  { type: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🏆', requirement: 30 },
  { type: 'streak_100', name: 'Century Champion', description: 'Maintain a 100-day streak', icon: '👑', requirement: 100 },
  { type: 'surahs_10', name: 'Explorer', description: 'Read 10 different Surahs', icon: '🗺️', requirement: 10 },
  { type: 'surahs_30', name: 'Scholar', description: 'Read 30 different Surahs', icon: '📚', requirement: 30 },
  { type: 'surahs_114', name: 'Khatim', description: 'Complete all 114 Surahs', icon: '🎓', requirement: 114 },
  { type: 'hifz_10', name: 'Memory Maker', description: 'Memorize 10 verses', icon: '🧠', requirement: 10 },
  { type: 'hifz_100', name: 'Hafiz in Training', description: 'Memorize 100 verses', icon: '💎', requirement: 100 },
];

export const useStreaks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: streak, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['user-streak'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserStreak | null;
    },
  });

  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ['user-badges'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as UserBadge[];
    },
  });

  const recordActivity = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      if (streak) {
        const lastDate = streak.last_activity_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = streak.current_streak;
        
        if (lastDate === today) {
          // Already recorded today
          return streak;
        } else if (lastDate === yesterdayStr) {
          // Continuing streak
          newStreak += 1;
        } else {
          // Streak broken, start fresh
          newStreak = 1;
        }

        const longestStreak = Math.max(newStreak, streak.longest_streak);

        const { data, error } = await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today,
            total_reading_days: streak.total_reading_days + 1,
          })
          .eq('id', streak.id)
          .select()
          .single();

        if (error) throw error;

        // Check for new badges
        await checkAndAwardBadges(user.id, newStreak);

        return data;
      } else {
        // Create new streak record
        const { data, error } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today,
            total_reading_days: 1,
          })
          .select()
          .single();

        if (error) throw error;

        // Award first read badge
        await awardBadge(user.id, 'first_read');

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-streak'] });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    },
  });

  const checkAndAwardBadges = async (userId: string, currentStreak: number) => {
    const streakBadges = [
      { type: 'streak_3', requirement: 3 },
      { type: 'streak_7', requirement: 7 },
      { type: 'streak_30', requirement: 30 },
      { type: 'streak_100', requirement: 100 },
    ];

    for (const badge of streakBadges) {
      if (currentStreak >= badge.requirement) {
        await awardBadge(userId, badge.type);
      }
    }
  };

  const awardBadge = async (userId: string, badgeType: string) => {
    const badgeDef = BADGE_DEFINITIONS.find(b => b.type === badgeType);
    if (!badgeDef) return;

    try {
      await supabase
        .from('user_badges')
        .upsert({
          user_id: userId,
          badge_type: badgeType,
          badge_name: badgeDef.name,
          badge_description: badgeDef.description,
        }, { onConflict: 'user_id,badge_type' });

      toast({
        title: `🎉 Badge Earned: ${badgeDef.name}!`,
        description: badgeDef.description,
      });
    } catch (error) {
      // Badge might already exist, ignore
    }
  };

  return {
    streak,
    badges,
    isLoadingStreak,
    isLoadingBadges,
    recordActivity,
  };
};
