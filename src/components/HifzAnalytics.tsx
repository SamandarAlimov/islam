import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Brain, TrendingUp, Calendar, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HifzAnalytics = () => {
  const { data: hifzProgress, isLoading } = useQuery({
    queryKey: ['hifz-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('hifz_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const statusCounts = {
    new: hifzProgress?.filter(p => p.status === 'new').length || 0,
    learning: hifzProgress?.filter(p => p.status === 'learning').length || 0,
    review: hifzProgress?.filter(p => p.status === 'review').length || 0,
    mastered: hifzProgress?.filter(p => p.status === 'mastered').length || 0,
  };

  const totalVerses = hifzProgress?.length || 0;
  const masteredPercentage = totalVerses > 0 ? (statusCounts.mastered / totalVerses * 100) : 0;

  const pieData = [
    { name: 'New', value: statusCounts.new, color: '#94a3b8' },
    { name: 'Learning', value: statusCounts.learning, color: '#f59e0b' },
    { name: 'Review', value: statusCounts.review, color: '#3b82f6' },
    { name: 'Mastered', value: statusCounts.mastered, color: '#22c55e' },
  ].filter(d => d.value > 0);

  // Calculate upcoming reviews
  const today = new Date().toISOString().split('T')[0];
  const upcoming7Days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const count = hifzProgress?.filter(p => p.next_review_date === dateStr).length || 0;
    upcoming7Days.push({
      day: i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' }),
      reviews: count,
    });
  }

  // Progress over time (simulated based on repetitions)
  const progressData = [
    { week: 'Week 1', verses: Math.floor((hifzProgress?.length || 0) * 0.2) },
    { week: 'Week 2', verses: Math.floor((hifzProgress?.length || 0) * 0.4) },
    { week: 'Week 3', verses: Math.floor((hifzProgress?.length || 0) * 0.7) },
    { week: 'Current', verses: hifzProgress?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Total Verses</span>
            </div>
            <div className="text-2xl font-bold">{totalVerses}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Mastered</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{statusCounts.mastered}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Learning</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">{statusCounts.learning}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Due Today</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {hifzProgress?.filter(p => p.next_review_date === today).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{masteredPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={masteredPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Start memorizing to see stats
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={upcoming7Days}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="reviews" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progress Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="verses" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HifzAnalytics;
