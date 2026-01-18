-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create reading plans table for Quran completion tracking
CREATE TABLE public.reading_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL DEFAULT '30_days',
  total_days INTEGER NOT NULL DEFAULT 30,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_surahs INTEGER[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading history table
CREATE TABLE public.reading_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for reading_plans
CREATE POLICY "Users can view their own reading plans" 
ON public.reading_plans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading plans" 
ON public.reading_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading plans" 
ON public.reading_plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading plans" 
ON public.reading_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for reading_history
CREATE POLICY "Users can view their own reading history" 
ON public.reading_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading history" 
ON public.reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading history" 
ON public.reading_history FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_reading_plans_user_id ON public.reading_plans(user_id);
CREATE INDEX idx_reading_plans_active ON public.reading_plans(user_id, is_active);
CREATE INDEX idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_read_at ON public.reading_history(user_id, read_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_reading_plans_updated_at
BEFORE UPDATE ON public.reading_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();