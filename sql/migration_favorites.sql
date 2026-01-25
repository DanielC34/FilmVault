
-- Add column to identify system-protected lists
ALTER TABLE watchlists ADD COLUMN is_system_list BOOLEAN DEFAULT false;

-- Function to create a default "Favorites" vault for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.watchlists (user_id, title, description, is_system_list)
  VALUES (new.id, 'Favorites', 'Your top-tier cinematic picks.', true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();

-- Update existing users if any
INSERT INTO public.watchlists (user_id, title, description, is_system_list)
SELECT id, 'Favorites', 'Your top-tier cinematic picks.', true
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM watchlists WHERE user_id = profiles.id AND is_system_list = true
);

-- RLS: Prevent deletion or renaming of system lists
CREATE POLICY "System lists cannot be deleted"
  ON watchlists
  FOR DELETE
  USING (NOT is_system_list);

CREATE POLICY "System lists cannot be renamed"
  ON watchlists
  FOR UPDATE
  USING (NOT is_system_list)
  WITH CHECK (NOT is_system_list);
