// RLS policies for Portifolio Samuel Supabase
// Run via Supabase SQL Editor or Management API

// Enable RLS on tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

// Allow anonymous inserts on messages (contact form)
CREATE POLICY "allow_anon_insert_messages" ON messages
  FOR INSERT TO anon
  WITH CHECK (true);

// Allow public reads on analytics
CREATE POLICY "allow_public_read_analytics" ON analytics
  FOR SELECT TO anon
  USING (true);

// Allow anon to upsert analytics
CREATE POLICY "allow_anon_upsert_analytics" ON analytics
  FOR INSERT TO anon
  WITH CHECK (true);

-- Analytics: ensure unique constraint on page_path
ALTER TABLE analytics ADD CONSTRAINT IF NOT EXISTS analytics_page_path_unique UNIQUE (page_path);

-- Analytics: increment page view counter (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION increment_page_view(page text)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics (page_path, view_count, last_access)
  VALUES (page, 1, NOW())
  ON CONFLICT (page_path)
  DO UPDATE SET view_count = analytics.view_count + 1, last_access = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
