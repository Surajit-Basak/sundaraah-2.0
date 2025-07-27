-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image_url text,
  description text,
  details text[],
  inventory integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
USING (true);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  date text,
  image_url text,
  excerpt text,
  content text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blog posts
CREATE POLICY "Allow public read access to blog posts"
ON blog_posts
FOR SELECT
USING (true);

-- Create team_members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  image_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to team members
CREATE POLICY "Allow public read access to team members"
ON team_members
FOR SELECT
USING (true);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  total numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamp with time zone DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for orders and order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- For now, let's assume admins can do anything. We would lock this down further.
CREATE POLICY "Allow all access to admins"
ON orders
FOR ALL
USING (true);

CREATE POLICY "Allow all access to admins"
ON order_items
FOR ALL
USING (true);

-- MOCK DATA
-- Insert some mock products if the table is empty
INSERT INTO products (name, slug, category, price, description, details, inventory) VALUES
('Golden Sunstone Necklace', 'golden-sunstone-necklace', 'Necklaces', 185.00, 'A radiant gold-plated necklace featuring a stunning sunstone pendant. Perfect for adding a touch of warmth and elegance to any outfit.', '{"18k Gold Plated", "Genuine Sunstone", "18-inch chain"}', 10),
('Azure Drop Earrings', 'azure-drop-earrings', 'Earrings', 75.00, 'Elegant silver earrings with beautiful azure blue gemstones that dangle gracefully.', '{"Sterling Silver", "Azure Gemstones", "Lightweight"}', 15),
('Crimson Heart Ring', 'crimson-heart-ring', 'Rings', 95.00, 'A beautiful ring with a crimson heart-shaped stone, set in a delicate rose gold band.', '{"Rose Gold Band", "Crimson Stone", "Available in all sizes"}', 20),
('Midnight Bloom Bracelet', 'midnight-bloom-bracelet', 'Bracelets', 120.00, 'An intricate bracelet with dark, floral-themed charms and obsidian beads.', '{"Oxidized Silver", "Obsidian Beads", "Adjustable Length"}', 12),
('Forest Whisper Anklet', 'forest-whisper-anklet', 'Anklets', 55.00, 'A delicate anklet with tiny leaf charms and green aventurine stones.', '{"Bronze Chain", "Green Aventurine", "Hand-finished"}', 25),
('Celestial Halo Studs', 'celestial-halo-studs', 'Earrings', 65.00, 'Simple yet stunning stud earrings with a celestial halo design, perfect for everyday wear.', '{"14k White Gold", "Cubic Zirconia", "Hypoallergenic"}', 30);

-- Insert some mock blog posts if the table is empty
INSERT INTO blog_posts (title, slug, date, excerpt, content) VALUES
('The Art of Layering Necklaces', 'art-of-layering', 'October 15, 2023', 'Discover the secrets to perfectly layering your necklaces for a chic, personalized look.', 'Content for layering...'),
('Choosing the Right Metal for You', 'choosing-your-metal', 'October 08, 2023', 'Gold, silver, or rose gold? We break down which metal tones best suit your skin.', 'Content for metals...'),
('A Guide to Gemstone Meanings', 'gemstone-meanings', 'October 01, 2023', 'Explore the symbolism and history behind your favorite gemstones.', 'Content for gemstones...');

-- Insert some mock team members if the table is empty
INSERT INTO team_members (name, role, bio) VALUES
('Aisha Khan', 'Founder & Lead Designer', 'Aisha started Sundaraah from her small studio, with a dream to share her passion for handcrafted jewelry.'),
('Rohan Verma', 'Master Artisan', 'With over 20 years of experience, Rohan is the heart of our workshop, turning designs into reality.'),
('Priya Sharma', 'Customer Experience Lead', 'Priya ensures that every customer has a delightful experience with Sundaraah, from browsing to unboxing.');

-- Insert mock orders
INSERT INTO orders (id, customer_name, customer_email, total, status, created_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Priya Sharma', 'priya.sharma@example.com', 260.00, 'Fulfilled', '2023-10-26 10:00:00+00');
INSERT INTO orders (id, customer_name, customer_email, total, status, created_at) VALUES
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Rahul Kapoor', 'rahul.kapoor@example.com', 95.00, 'Processing', '2023-10-25 14:30:00+00');

-- Insert mock order items
-- Order 1: Priya Sharma
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
    p.id, 
    1, 
    185.00 
FROM products p WHERE p.slug = 'golden-sunstone-necklace';

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
    p.id, 
    1, 
    75.00 
FROM products p WHERE p.slug = 'azure-drop-earrings';

-- Order 2: Rahul Kapoor
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
    'b2c3d4e5-f6a7-8901-2345-67890abcdef1', 
    p.id, 
    1, 
    95.00 
FROM products p WHERE p.slug = 'crimson-heart-ring';
