/**
 * Supabase Auth User Type
 * Complete type definition for the Supabase user object
 */

export interface SupabaseUser {
  // Core Identity
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  phone_confirmed_at?: string;
  
  // Confirmation & Recovery
  confirmed_at?: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  
  // Authentication
  last_sign_in_at?: string;
  invited_at?: string;
  
  // Metadata
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  
  // Identities (OAuth providers)
  identities?: Identity[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Session related
  is_anonymous?: boolean;
}

/**
 * App Metadata - System level metadata set by Supabase
 * Cannot be modified by users directly
 */
export interface AppMetadata {
  provider?: string;
  providers?: string[];
  [key: string]: string | string[] | number | boolean | null | undefined;
}

/**
 * User Metadata - Custom user data
 * Can be set during signup or updated by users
 */
export interface UserMetadata {
  // Common OAuth fields
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  sub?: string;
  
  // Custom fields can be added here
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Identity - OAuth provider connection
 */
export interface Identity {
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Identity Data - Data from OAuth providers
 */
export interface IdentityData {
  email?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  sub?: string;
  
  // Provider specific fields
  full_name?: string;
  avatar_url?: string;
  picture?: string;
  name?: string;
  preferred_username?: string;
  provider_id?: string;
  
  // Additional provider data
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Supabase Session Type
 */
export interface SupabaseSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  user: SupabaseUser;
}

/**
 * Auth Response Type
 */
export interface AuthResponse {
  data: {
    user: SupabaseUser | null;
    session: SupabaseSession | null;
  };
  error: AuthError | null;
}

/**
 * Auth Error Type
 */
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Type guard to check if user exists
 */
export function isAuthenticatedUser(user: SupabaseUser | null): user is SupabaseUser {
  return user !== null && typeof user.id === 'string';
}

/**
 * Type guard to check if user has email
 */
export function hasEmail(user: SupabaseUser): user is SupabaseUser & { email: string } {
  return typeof user.email === 'string' && user.email.length > 0;
}

/**
 * Type guard to check if user has phone
 */
export function hasPhone(user: SupabaseUser): user is SupabaseUser & { phone: string } {
  return typeof user.phone === 'string' && user.phone.length > 0;
}

/**
 * Type guard to check if email is verified
 */
export function isEmailVerified(user: SupabaseUser): boolean {
  return !!user.email_confirmed_at;
}

/**
 * Type guard to check if phone is verified
 */
export function isPhoneVerified(user: SupabaseUser): boolean {
  return !!user.phone_confirmed_at;
}

/**
 * Helper type for user with required email
 */
export type UserWithEmail = SupabaseUser & {
  email: string;
};

/**
 * Helper type for user with required phone
 */
export type UserWithPhone = SupabaseUser & {
  phone: string;
};

/**
 * Helper type for verified user
 */
export type VerifiedUser = SupabaseUser & {
  email: string;
  email_confirmed_at: string;
};

/**
 * Minimal user type for basic operations
 */
export type MinimalUser = Pick<SupabaseUser, 'id' | 'email' | 'created_at'>;

/**
 * Public user profile (safe to expose)
 */
export type PublicUserProfile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  username?: string;
  created_at: string;
};

/**
 * Extract public profile from user
 */
export function getPublicProfile(user: SupabaseUser): PublicUserProfile {
  return {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    username: user.user_metadata?.preferred_username,
    created_at: user.created_at,
  };
}