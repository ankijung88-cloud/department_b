-- Add closed_days column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS closed_days JSON DEFAULT '[]';
