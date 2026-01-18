import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Calendar, 
  Target,
  TrendingUp,
  CheckCircle2,
  Clock
} from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface QazoPrayer {
  name: string;
  nameUz: string;
  total: number;
  completed: number;
}

interface QazoFasting {
  total: number;
  completed: number;
}

const STORAGE_KEY = "qazo-tracker";

const Qazo = () => {
  const { toast } = useToast();
  
  const [prayers, setPrayers] = useState<QazoPrayer[]>([
    { name: "Fajr", nameUz: "Bomdod", total: 0, completed: 0 },
    { name: "Dhuhr", nameUz: "Peshin", total: 0, completed: 0 },
    { name: "Asr", nameUz: "Asr", total: 0, completed: 0 },
    { name: "Maghrib", nameUz: "Shom", total: 0, completed: 0 },
    { name: "Isha", nameUz: "Xufton", total: 0, completed: 0 },
    { name: "Witr", nameUz: "Vitr", total: 0, completed: 0 },
  ]);

  const [fasting, setFasting] = useState<QazoFasting>({ total: 0, completed: 0 });
  const [yearsToCalculate, setYearsToCalculate] = useState<number>(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setPrayers(data.prayers || prayers);
      setFasting(data.fasting || fasting);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prayers, fasting }));
  }, [prayers, fasting]);

  const calculateFromYears = () => {
    if (yearsToCalculate <= 0) return;
    
    const daysPerYear = 365;
    const totalDays = yearsToCalculate * daysPerYear;
    const ramadanDays = yearsToCalculate * 30;

    setPrayers(prev => prev.map(p => ({
      ...p,
      total: p.name === "Witr" ? totalDays : totalDays,
      completed: 0
    })));
    
    setFasting({ total: ramadanDays, completed: 0 });
    
    toast({
      title: "Hisoblandi",
      description: `${yearsToCalculate} yillik qazo namozlar va ro'zalar hisoblandi`,
    });
  };

  const updatePrayer = (index: number, field: 'total' | 'completed', delta: number) => {
    setPrayers(prev => prev.map((p, i) => {
      if (i !== index) return p;
      const newValue = Math.max(0, p[field] + delta);
      if (field === 'completed' && newValue > p.total) return p;
      return { ...p, [field]: newValue };
    }));
  };

  const updateFasting = (field: 'total' | 'completed', delta: number) => {
    setFasting(prev => {
      const newValue = Math.max(0, prev[field] + delta);
      if (field === 'completed' && newValue > prev.total) return prev;
      return { ...prev, [field]: newValue };
    });
  };

  const resetAll = () => {
    setPrayers(prev => prev.map(p => ({ ...p, total: 0, completed: 0 })));
    setFasting({ total: 0, completed: 0 });
    toast({
      title: "Tozalandi",
      description: "Barcha ma'lumotlar o'chirildi",
    });
  };

  const totalPrayers = prayers.reduce((acc, p) => acc + p.total, 0);
  const completedPrayers = prayers.reduce((acc, p) => acc + p.completed, 0);
  const overallProgress = totalPrayers > 0 ? (completedPrayers / totalPrayers) * 100 : 0;
  const fastingProgress = fasting.total > 0 ? (fasting.completed / fasting.total) * 100 : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Qazo Hisoblagich
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Qazo namozlar va ro'zalarni hisoblab boring va ularni ada eting
            </p>
          </div>

          {/* Quick Calculator */}
          <Card className="shadow-soft mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Tezkor Hisoblash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="years">Necha yillik qazo?</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    value={yearsToCalculate || ""}
                    onChange={(e) => setYearsToCalculate(parseInt(e.target.value) || 0)}
                    placeholder="Masalan: 5"
                    className="mt-1"
                  />
                </div>
                <Button onClick={calculateFromYears} className="gap-2">
                  <Target className="w-4 h-4" />
                  Hisoblash
                </Button>
                <Button variant="outline" onClick={resetAll} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Tozalash
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Namozlar</p>
                      <p className="text-2xl font-bold">{completedPrayers} / {totalPrayers}</p>
                    </div>
                  </div>
                  <Badge variant={overallProgress >= 100 ? "default" : "secondary"}>
                    {Math.round(overallProgress)}%
                  </Badge>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ro'zalar</p>
                      <p className="text-2xl font-bold">{fasting.completed} / {fasting.total}</p>
                    </div>
                  </div>
                  <Badge variant={fastingProgress >= 100 ? "default" : "secondary"}>
                    {Math.round(fastingProgress)}%
                  </Badge>
                </div>
                <Progress value={fastingProgress} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Prayer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {prayers.map((prayer, index) => {
              const progress = prayer.total > 0 ? (prayer.completed / prayer.total) * 100 : 0;
              const isComplete = progress >= 100;
              
              return (
                <Card 
                  key={prayer.name} 
                  className={`shadow-soft transition-all ${isComplete ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        <div>
                          <h3 className="font-semibold">{prayer.nameUz}</h3>
                          <p className="text-xs text-muted-foreground">{prayer.name}</p>
                        </div>
                      </div>
                      <Badge variant={isComplete ? "default" : "outline"}>
                        {Math.round(progress)}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {/* Total */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Jami:</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updatePrayer(index, 'total', -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-mono">{prayer.total}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updatePrayer(index, 'total', 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Completed */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">O'qildi:</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updatePrayer(index, 'completed', -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-mono text-primary font-bold">
                            {prayer.completed}
                          </span>
                          <Button 
                            variant="default" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updatePrayer(index, 'completed', 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Fasting Card */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Qazo Ro'zalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Fasting */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="font-medium">Jami ro'zalar:</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateFasting('total', -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-16 text-center text-xl font-mono">{fasting.total}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateFasting('total', 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Completed Fasting */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                  <span className="font-medium">Tutilgan ro'zalar:</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateFasting('completed', -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-16 text-center text-xl font-mono text-primary font-bold">
                      {fasting.completed}
                    </span>
                    <Button 
                      variant="default" 
                      size="icon"
                      onClick={() => updateFasting('completed', 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Umumiy progress</span>
                  <span className="font-medium">{fasting.total - fasting.completed} kun qoldi</span>
                </div>
                <Progress value={fastingProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Motivational Note */}
          <Card className="shadow-soft mt-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6 text-center">
              <span className="text-3xl mb-3 block">🤲</span>
              <p className="text-muted-foreground italic">
                "Kim bir namozni unutan bo'lsa yoki uyqudan qolib ketgan bo'lsa, 
                uni eslab qolganda o'qisin"
              </p>
              <p className="text-xs text-primary mt-2">— Sahih al-Buxoriy</p>
            </CardContent>
          </Card>
        </div>
    </Layout>
  );
};

export default Qazo;