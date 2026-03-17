
-- public.users — Extended auth user table required by CET schema
CREATE TABLE IF NOT EXISTS public.users (
  id            uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      text        UNIQUE,
  display_name  text,
  bio           text,
  avatar_url    text,
  location      text,
  website       text,
  role          text        NOT NULL DEFAULT 'user',
  reputation    integer     NOT NULL DEFAULT 0,
  app_metadata  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own row" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own row" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users can insert own row" ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Auto-create public.users row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(split_part(NEW.email, '@', 1), 'user') || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user'),
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
