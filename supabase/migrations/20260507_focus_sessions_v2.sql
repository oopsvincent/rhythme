-- Migration: Add Focus Sessions V2 columns
-- Adds mood_before, mood_after, energy_start, energy_end, 
-- interruption_details, custom_task_text, and tags columns

-- Add mood tracking columns
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS mood_before smallint NULL CHECK (mood_before BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS mood_after smallint NULL CHECK (mood_after BETWEEN 1 AND 5);

-- Add energy tracking columns
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS energy_start smallint NULL CHECK (energy_start BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_end smallint NULL CHECK (energy_end BETWEEN 1 AND 5);

-- Add interruption details JSONB column (array of interruption objects)
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS interruption_details jsonb NULL DEFAULT '[]'::jsonb;

-- Add custom task text for sessions not linked to a task
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS custom_task_text text NULL;

-- Add tags for session categorization
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS tags text[] NULL;

-- Create index on started_at for efficient date range queries
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at 
  ON public.focus_sessions (user_id, started_at DESC);

-- Create index on tags for filtering (GIN index for array containment)
CREATE INDEX IF NOT EXISTS idx_focus_sessions_tags 
  ON public.focus_sessions USING gin (tags);
