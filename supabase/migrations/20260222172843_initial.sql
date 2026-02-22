-- ============================================
-- hitokuchi - Initial Migration
-- ============================================

-- ============================================
-- 1. Tables
-- ============================================

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- whiskeys
CREATE TABLE whiskeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  distillery TEXT,
  country TEXT NOT NULL,
  type TEXT NOT NULL,
  abv NUMERIC,
  price_range TEXT CHECK (price_range IN ('low', 'medium', 'high', 'premium')),
  description TEXT,
  image_url TEXT,
  flavor_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  whiskey_id UUID NOT NULL REFERENCES whiskeys(id) ON DELETE CASCADE,
  rating INT2 NOT NULL CHECK (rating BETWEEN 1 AND 5),
  taste_tags TEXT[] NOT NULL DEFAULT '{}',
  drinking_style TEXT CHECK (drinking_style IN ('straight', 'rock', 'highball', 'mizuwari')),
  would_repeat TEXT NOT NULL CHECK (would_repeat IN ('yes', 'maybe', 'no')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, whiskey_id)
);

-- bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  whiskey_id UUID NOT NULL REFERENCES whiskeys(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, whiskey_id)
);

-- ============================================
-- 2. Indexes
-- ============================================

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_whiskey_id ON reviews(whiskey_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_whiskey_id ON bookmarks(whiskey_id);
CREATE INDEX idx_whiskeys_country ON whiskeys(country);
CREATE INDEX idx_whiskeys_type ON whiskeys(type);

-- ============================================
-- 3. RLS Policies
-- ============================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: anyone can select"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles: user can update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- whiskeys
ALTER TABLE whiskeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whiskeys: anyone can select"
  ON whiskeys FOR SELECT
  USING (true);

CREATE POLICY "whiskeys: admin can insert"
  ON whiskeys FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "whiskeys: admin can update"
  ON whiskeys FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "whiskeys: admin can delete"
  ON whiskeys FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews: anyone can select"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "reviews: user can insert own"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: user can update own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: user can delete own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks: anyone can select"
  ON bookmarks FOR SELECT
  USING (true);

CREATE POLICY "bookmarks: user can insert own"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks: user can delete own"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Trigger: auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'ユーザー'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Trigger: auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_whiskeys_updated_at
  BEFORE UPDATE ON whiskeys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
