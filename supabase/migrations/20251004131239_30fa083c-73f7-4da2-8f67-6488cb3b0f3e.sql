-- Create quiz_attempts table for storing quiz results
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 15,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this quiz app)
CREATE POLICY "Anyone can view quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_quiz_attempts_score ON public.quiz_attempts(score DESC, created_at DESC);
CREATE INDEX idx_quiz_attempts_email ON public.quiz_attempts(email);