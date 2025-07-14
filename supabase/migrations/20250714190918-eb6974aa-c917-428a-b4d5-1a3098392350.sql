-- Create a temporary policy for admin access during development
-- This bypasses RLS for admin routes when using temporary login

-- Drop existing admin policy and recreate with temporary bypass
DROP POLICY IF EXISTS "Admins can manage all vendors" ON public.vendors;

-- Create new policy that allows access for temporary admin emails
CREATE POLICY "Temp admin access to vendors" ON public.vendors
  FOR ALL 
  USING (
    -- Allow access if user is a real admin OR if using temporary admin bypass
    public.is_admin(auth.uid()) OR 
    (auth.uid() IS NULL AND current_setting('app.temp_admin', true) = 'true')
  );

-- Set the temporary admin setting
SELECT set_config('app.temp_admin', 'true', false);