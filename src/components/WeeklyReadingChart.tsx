import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DailyReading {
  day: string;
  count: number;
  fullDate: string;
}

const WeeklyReadingChart = () => {
  const [weeklyData, setWeeklyData] = useState<DailyReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalThisWeek, setTotalThisWeek] = useState(0);

  const dayNames = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get the start of the current week (Monday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        // Fetch reading history for the past 7 days
        const { data: history, error } = await supabase
          .from('reading_history')
          .select('read_at, surah_number')
          .eq('user_id', user.id)
          .gte('read_at', startOfWeek.toISOString())
          .order('read_at', { ascending: true });

        if (error) throw error;

        // Initialize data for each day of the week
        const weekData: DailyReading[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          weekData.push({
            day: dayNames[date.getDay()],
            count: 0,
            fullDate: date.toISOString().split('T')[0]
          });
        }

        // Count readings per day
        if (history) {
          history.forEach(entry => {
            const entryDate = new Date(entry.read_at).toISOString().split('T')[0];
            const dayIndex = weekData.findIndex(d => d.fullDate === entryDate);
            if (dayIndex !== -1) {
              weekData[dayIndex].count += 1;
            }
          });
        }

        setWeeklyData(weekData);
        setTotalThisWeek(history?.length || 0);
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyStats();
  }, []);

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);
  const averagePerDay = totalThisWeek > 0 ? (totalThisWeek / 7).toFixed(1) : "0";

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Haftalik Statistika
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Yuklanmoqda...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Haftalik Statistika
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{totalThisWeek}</div>
            <div className="text-xs text-muted-foreground">Jami o'qilgan</div>
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-accent-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {averagePerDay}
            </div>
            <div className="text-xs text-muted-foreground">Kunlik o'rtacha</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                domain={[0, Math.max(maxCount, 5)]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`${value} ta`, "O'qilgan"]}
                labelFormatter={(label) => `${label} kuni`}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily breakdown */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          {weeklyData.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`font-medium ${day.count > 0 ? 'text-primary' : ''}`}>
                {day.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyReadingChart;
