import { Flame, Trophy, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStreaks, BADGE_DEFINITIONS } from "@/hooks/useStreaks";
import { Skeleton } from "@/components/ui/skeleton";

const StreakDisplay = () => {
  const { streak, badges, isLoadingStreak, isLoadingBadges } = useStreaks();

  if (isLoadingStreak || isLoadingBadges) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const earnedBadgeTypes = badges?.map(b => b.badge_type) || [];

  return (
    <div className="space-y-4">
      {/* Streak Stats */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Reading Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {streak?.current_streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {streak?.longest_streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">Longest</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-500">
                {streak?.total_reading_days || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {BADGE_DEFINITIONS.map((badge) => {
              const isEarned = earnedBadgeTypes.includes(badge.type);
              return (
                <div
                  key={badge.type}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    isEarned 
                      ? 'bg-amber-500/10 border border-amber-500/20' 
                      : 'bg-muted/30 opacity-40'
                  }`}
                  title={`${badge.name}: ${badge.description}`}
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-[10px] text-center font-medium truncate w-full">
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
          
          {badges && badges.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Recent:</p>
              <div className="flex flex-wrap gap-2">
                {badges.slice(0, 3).map((badge) => (
                  <Badge key={badge.id} variant="secondary" className="text-xs">
                    {BADGE_DEFINITIONS.find(b => b.type === badge.badge_type)?.icon} {badge.badge_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakDisplay;
