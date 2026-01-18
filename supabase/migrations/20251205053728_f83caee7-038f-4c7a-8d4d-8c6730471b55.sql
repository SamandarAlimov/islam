-- Create study groups table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study group members table
CREATE TABLE public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group notes table
CREATE TABLE public.group_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hifz progress table
CREATE TABLE public.hifz_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  repetitions INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'mastered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

-- Enable RLS
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hifz_progress ENABLE ROW LEVEL SECURITY;

-- Study groups policies
CREATE POLICY "Users can view groups they're members of"
ON public.study_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = study_groups.id AND user_id = auth.uid()
  ) OR is_public = true
);

CREATE POLICY "Users can create groups"
ON public.study_groups FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their groups"
ON public.study_groups FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their groups"
ON public.study_groups FOR DELETE
USING (auth.uid() = owner_id);

-- Study group members policies
CREATE POLICY "Members can view group members"
ON public.study_group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.study_group_members m
    WHERE m.group_id = study_group_members.group_id AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups"
ON public.study_group_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can leave groups"
ON public.study_group_members FOR DELETE
USING (auth.uid() = user_id);

-- Group notes policies
CREATE POLICY "Members can view group notes"
ON public.group_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = group_notes.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Members can create notes"
ON public.group_notes FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = group_notes.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own notes"
ON public.group_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.group_notes FOR DELETE
USING (auth.uid() = user_id);

-- Hifz progress policies
CREATE POLICY "Users can view their own hifz progress"
ON public.hifz_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hifz progress"
ON public.hifz_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hifz progress"
ON public.hifz_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hifz progress"
ON public.hifz_progress FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_notes_updated_at
BEFORE UPDATE ON public.group_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hifz_progress_updated_at
BEFORE UPDATE ON public.hifz_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();