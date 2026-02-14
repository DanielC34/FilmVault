-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create watchlists table
CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_count INTEGER DEFAULT 0,
  is_system_list BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create watchlist_items table
CREATE TABLE watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE NOT NULL,
  media_id TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  is_watched BOOLEAN DEFAULT false,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, media_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for watchlists
CREATE POLICY "Users can view own watchlists"
  ON watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own watchlists"
  ON watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlists"
  ON watchlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlists"
  ON watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for watchlist_items
CREATE POLICY "Users can view own watchlist items"
  ON watchlist_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own watchlist items"
  ON watchlist_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own watchlist items"
  ON watchlist_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own watchlist items"
  ON watchlist_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
