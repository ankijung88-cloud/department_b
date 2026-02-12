-- 1. Ensure new columns exist (idempotent)
ALTER TABLE products ADD COLUMN IF NOT EXISTS closed_days JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. Enable Row Level Security (RLS) on the products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts (optional but recommended for clean slate)
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Admin Manage Products" ON products;

-- 4. Create Policy: Allow Public Read Access (Everyone can view products)
CREATE POLICY "Public Read Products"
ON products
FOR SELECT
USING (true);

-- 5. Create Policy: Allow Authenticated Users (Admins) to Insert/Update/Delete
CREATE POLICY "Admin Manage Products"
ON products
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
