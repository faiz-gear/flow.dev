import { createClient } from '@/app/utils/supabase/server';
import { UserProfile, GitHubConnectionStatus } from '@/app/types/database';

/**
 * Database utilities for user profile management
 */

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Check GitHub connection status for user
 * With Supabase OAuth, this checks the user's identities
 */
export async function getGitHubConnectionStatus(userId: string): Promise<GitHubConnectionStatus> {
  try {
    const supabase = createClient();

    // Get the user and check their identities
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || user.id !== userId) {
      return { isConnected: false };
    }

    // Check if GitHub is in the user's identities
    const hasGitHub = user.identities?.some(identity => identity.provider === 'github');

    if (!hasGitHub) {
      // Also check our database for backward compatibility
      const profile = await getUserProfile(userId);
      if (!profile?.github_connected) {
        return { isConnected: false };
      }
    }

    const profile = await getUserProfile(userId);

    return {
      isConnected: true,
      connectedAt: profile?.updated_at,
      lastValidated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error checking GitHub connection status:', error);
    return { isConnected: false };
  }
}

/**
 * Update user profile fields
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }

  return true;
}

/**
 * Set GitHub connection status
 */
export async function setGitHubConnectionStatus(userId: string, connected: boolean): Promise<boolean> {
  return updateUserProfile(userId, {
    github_connected: connected,
    github_token_encrypted: connected ? undefined : null, // Clear token when disconnecting
  });
}