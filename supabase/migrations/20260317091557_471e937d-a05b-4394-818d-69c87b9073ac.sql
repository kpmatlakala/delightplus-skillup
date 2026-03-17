
-- Fix search_path on set_updated_at and handle_new_user
CREATE OR REPLACE FUNCTION cet.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = cet AS $$ BEGIN new.updated_at = now(); RETURN new; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(split_part(NEW.email, '@', 1), 'user') || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user'),
    now(), now()
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
