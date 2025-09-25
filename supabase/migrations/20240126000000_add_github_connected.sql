-- Add github_connected column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS github_connected BOOLEAN DEFAULT false;