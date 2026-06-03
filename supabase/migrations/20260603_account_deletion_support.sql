-- 20260603_account_deletion_support.sql

-- Create the stored procedure to delete user data inside a transaction
CREATE OR REPLACE FUNCTION delete_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Step 1: Delete child records (foreign keys/dependencies) - order matters
  DELETE FROM public.habit_logs WHERE user_id = target_user_id;
  DELETE FROM public.daily_logs WHERE user_id = target_user_id;
  DELETE FROM public.focus_sessions WHERE user_id = target_user_id;
  DELETE FROM public.mood_logs WHERE user_id = target_user_id;
  DELETE FROM public.journals WHERE user_id = target_user_id;
  DELETE FROM public.tasks WHERE user_id = target_user_id;
  DELETE FROM public.user_goals WHERE user_id = target_user_id;
  DELETE FROM public.weekly_plan WHERE user_id = target_user_id;
  DELETE FROM public.weekly_review WHERE user_id = target_user_id;
  DELETE FROM public.notifications WHERE user_id = target_user_id;
  DELETE FROM public.push_subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.user_preferences WHERE user_id = target_user_id;

  -- Step 2: Delete main records
  DELETE FROM public.habits WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM public.account_subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.billing_events WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;   -- Security best practice

COMMENT ON FUNCTION delete_user_data(UUID) IS 'Deletes all user data in a single transaction. Called only from protected backend endpoint.';

-- Create security definer function to check if the user has a password in auth.users
CREATE OR REPLACE FUNCTION user_has_password(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_pass BOOLEAN;
BEGIN
  SELECT (encrypted_password IS NOT NULL AND encrypted_password <> '')
  INTO has_pass
  FROM auth.users
  WHERE id = target_user_id;
  
  RETURN COALESCE(has_pass, FALSE);
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

COMMENT ON FUNCTION user_has_password(UUID) IS 'Checks if a user has a password configured in auth.users securely bypassing RLS.';
