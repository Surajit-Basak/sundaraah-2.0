-- Drop the table if it exists to start fresh (optional)
DROP TABLE IF EXISTS products;

-- Create the products table
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT,
    details TEXT[],
    image_url TEXT,
    inventory INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comments to columns for clarity
COMMENT ON COLUMN products.id IS 'Unique identifier for each product';
COMMENT ON COLUMN products.name IS 'The name of the product';
COMMENT ON COLUMN products.slug IS 'URL-friendly version of the product name';
COMMENT ON COLUMN products.description IS 'Detailed description of the product';
COMMENT ON COLUMN products.price IS 'Price of the product';
COMMENT ON COLUMN products.category IS 'Category the product belongs to (e.g., "Necklaces")';
COMMENT ON COLUMN products.details IS 'Array of product details or specifications';
COMMENT ON COLUMN products.image_url IS 'URL for the main product image';
COMMENT ON COLUMN products.inventory IS 'Number of items in stock';
COMMENT ON COLUMN products.created_at IS 'Timestamp of when the product was created';


-- 1. Enable Row Level Security (RLS) on the table
-- This is a key security feature in Supabase.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy for public read access
-- This policy allows anyone (even unauthenticated users) to view the products.
CREATE POLICY "Allow public read access" 
ON products
FOR SELECT 
USING (true);

-- 3. Create a policy for allowing authenticated users to manage products
-- This is a placeholder and should be replaced with a more secure policy
-- that checks for an 'admin' role once you have user authentication set up.
-- For now, it allows any logged-in user to perform C-U-D operations.
CREATE POLICY "Allow authenticated users to manage products" 
ON products
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
