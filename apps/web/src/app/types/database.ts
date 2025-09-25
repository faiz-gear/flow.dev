/**
 * Database type definitions for flow.dev
 * Based on the Supabase schema
 */

export interface UserProfile {
  id: string; // UUID - references auth.users(id)
  updated_at: string; // ISO 8601 timestamp
  report_email: string | null;
  github_token_encrypted: string | null; // Legacy - kept for backward compatibility
  github_connected?: boolean; // New field for Supabase OAuth status
}

/**
 * Database table types for Supabase client
 */
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'updated_at'> & {
          updated_at?: string;
        };
        Update: Partial<Omit<UserProfile, 'id'>> & {
          updated_at?: string;
        };
      };
    };
  };
}

/**
 * GitHub OAuth related types
 */
export interface GitHubTokenData {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GitHubConnectionStatus {
  isConnected: boolean;
  connectedAt?: string;
  lastValidated?: string;
}