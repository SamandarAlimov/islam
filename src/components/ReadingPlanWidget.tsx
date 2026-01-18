import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookOpen, Calendar, Trophy, Bell, Trash2 } from "lucide-react";
import { useReadingPlan, getDailySurahPlan } from "@/hooks/useReadingPlan";
import { useAllSurahs } from "@/hooks/useQuran";

interface ReadingPlanWidgetProps {
  onSurahSelect?: (surahNumber: number) => void;
}

const ReadingPlanWidget = ({ onSurahSelect }: ReadingPlanWidgetProps) => {
  const [selectedPlanType, setSelectedPlanType] = useState('30_days');
  const { activePlan, isLoadingPlan, createPlan, deletePlan, getProgress, getTodaySurahs } = useReadingPlan();
  const { data: allSurahs } = useAllSurahs();

  const planOptions = [
    { value: '30_days', label: '30 Days (Ramadan)', days: 30 },
    { value: '60_days', label: '60 Days', days: 60 },
    { value: '90_days', label: '90 Days', days: 90 },
    { value: '365_days', label: '1 Year', days: 365 },
  ];

  const handleCreatePlan = () => {
    const option = planOptions.find(o => o.value === selectedPlanType);
    if (option) {
      createPlan.mutate({ planType: selectedPlanType, totalDays: option.days });
    }
  };

  const progress = getProgress();
  const todaySurahs = getTodaySurahs();

  const getSurahName = (number: number) => {
    const surah = allSurahs?.find(s => s.number === number);
    return surah ? surah.englishName : `Surah ${number}`;
  };

  if (isLoadingPlan) {
    return (
      <Card className="shadow-soft">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activePlan) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Start a Reading Plan
          </CardTitle>
          <CardDescription>
            Complete the Quran in your chosen timeframe with daily guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Plan Duration</Label>
            <Select value={selectedPlanType} onValueChange={setSelectedPlanType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {planOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleCreatePlan} 
            className="w-full bg-gradient-hero"
            disabled={createPlan.isPending}
          >
            {createPlan.isPending ? 'Creating...' : 'Start Plan'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Reading Plan
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deletePlan.mutate()}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Day {activePlan.current_day} of {activePlan.total_days}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-primary">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {progress.completedCount} of {progress.totalSurahs} surahs completed
          </p>
        </div>

        {/* Today's Reading */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Today's Reading
          </h4>
          <div className="space-y-2">
            {todaySurahs.length > 0 ? (
              todaySurahs.map(surahNum => {
                const isCompleted = activePlan.completed_surahs?.includes(surahNum);
                return (
                  <button
                    key={surahNum}
                    onClick={() => onSurahSelect?.(surahNum)}
                    className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      isCompleted
                        ? 'bg-primary-lighter border-primary/30 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary-lighter/50'
                    }`}
                  >
                    <span className="font-medium">
                      {surahNum}. {getSurahName(surahNum)}
                    </span>
                    {isCompleted && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        ✓ Done
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Plan complete! 🎉
              </p>
            )}
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="notifications" className="text-sm">Daily Reminders</Label>
          </div>
          <Switch
            id="notifications"
            checked={activePlan.notifications_enabled}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingPlanWidget;
