
-- Add target_user_id column to notifications (null = all users)
ALTER TABLE public.notifications ADD COLUMN target_user_id uuid DEFAULT NULL;

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can read notifications" ON public.notifications;

-- New policy: users can see notifications targeted to them OR to everyone (null)
CREATE POLICY "Users can read their notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (target_user_id IS NULL OR target_user_id = auth.uid());

-- Allow admin to also read all
CREATE POLICY "Admin can read all notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (is_admin());
