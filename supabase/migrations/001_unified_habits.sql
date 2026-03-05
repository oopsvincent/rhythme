-- Migration: Add unified frequency system to habits table
-- Run this in your Supabase SQL Editor

-- Add new columns to habits table
ALTER TABLE habits ADD COLUMN IF NOT EXISTS frequency_num SMALLINT;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS target_count INTEGER NOT NULL DEFAULT 1;

-- Migrate existing string frequency to numeric
UPDATE habits SET frequency_num = CASE
  WHEN frequency = 'daily' THEN 0
  WHEN frequency = 'weekly' THEN 1
  WHEN frequency = 'monthly' THEN 2
  ELSE 0
END
WHERE frequency_num IS NULL;

-- Make frequency_num NOT NULL after migration
ALTER TABLE habits ALTER COLUMN frequency_num SET NOT NULL;
