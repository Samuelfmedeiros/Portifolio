// RLS policies for Mission Control Supabase
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
