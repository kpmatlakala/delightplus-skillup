-- Migration: Migrate all learners to unified users table
-- Date: 2026-03-17

-- This migration assumes all learner data is now in public.users
-- Remove cet.learners table if it exists
DROP TABLE IF EXISTS cet.learners CASCADE;
