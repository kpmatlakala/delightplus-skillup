-- Migration: Add profile fields to users table
-- Date: 2026-03-17

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS phone text;
