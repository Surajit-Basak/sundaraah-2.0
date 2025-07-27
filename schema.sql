
-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2) NOT NULL,
  image_url text,
  details text[],
  inventory integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id)
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  date text,
  image_url text,
  excerpt text,
  content text
);

-- Create team_members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  image_url text,
  bio text
);

-- Create orders table
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    total numeric(10, 2) NOT NULL,
    status text NOT NULL DEFAULT 'Processing'
);

-- Create order_items table
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id),
    product_id uuid NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL
);


-- Enable RLS for all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to team_members" ON team_members FOR SELECT USING (true);

-- For now, allow admin full access (assuming an admin role, which we'll set up)
-- This is a placeholder; real auth policies will be more secure.
CREATE POLICY "Allow full access for admins on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow full access for admins on order_items" ON order_items FOR ALL USING (true);


-- Insert some initial data
INSERT INTO categories (id, name) VALUES
('a8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Necklaces'),
('b8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Earrings'),
('c8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Bracelets'),
('d8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Rings'),
('e8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Anklets');


INSERT INTO products (name, slug, description, price, details, inventory, category_id) VALUES
('Golden Sunstone Necklace', 'golden-sunstone-necklace', 'A radiant gold-plated necklace featuring a mesmerizing sunstone pendant. Perfect for adding a touch of sunshine to any outfit.', 185.00, '{"18k Gold Plated", "Genuine Sunstone", "18-inch chain"}', 10, 'a8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Silver Moonstone Earrings', 'silver-moonstone-earrings', 'Elegant sterling silver earrings with luminous moonstone gems that shimmer with every movement.', 120.00, '{"925 Sterling Silver", "Rainbow Moonstone", "Secure lever-back"}', 15, 'b8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Rose Gold Charm Bracelet', 'rose-gold-charm-bracelet', 'A delicate rose gold bracelet, perfect for personalizing with your favorite charms.', 95.00, '{"14k Rose Gold Plated", "Adjustable length", "Lobster clasp"}', 20, 'c8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Minimalist Gold Band', 'minimalist-gold-band', 'A simple yet stunning 14k gold band, perfect for stacking or wearing alone for a classic look.', 250.00, '{"Solid 14k Gold", "2mm width", "Polished finish"}', 12, 'd8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Azure Beaded Anklet', 'azure-beaded-anklet', 'A vibrant anklet made with azure beads and sterling silver accents, evoking the colors of the sea.', 75.00, '{"925 Sterling Silver", "Czech glass beads", "Durable cord"}', 30, 'e8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Emerald Drop Pendant', 'emerald-drop-pendant', 'A breathtaking necklace featuring a lab-created emerald in a classic teardrop shape, set in sterling silver.', 210.00, '{"925 Sterling Silver", "Lab-created Emerald", "20-inch chain"}', 8, 'a8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Geometric Hoop Earrings', 'geometric-hoop-earrings', 'Modern and chic, these gold-plated hoop earrings feature a unique hexagonal design.', 85.00, '{"18k Gold Plated", "Lightweight design", "2-inch diameter"}', 25, 'b8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Leather and Steel Bracelet', 'leather-and-steel-bracelet', 'A rugged yet stylish bracelet combining braided genuine leather with a sleek stainless steel magnetic clasp.', 65.00, '{"Genuine Leather", "Stainless Steel", "Magnetic Clasp"}', 18, 'c8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f'),
('Opal Statement Ring', 'opal-statement-ring', 'A mesmerizing ring featuring a large, iridescent lab-grown opal set in a decorative silver band.', 195.00, '{"925 Sterling Silver", "Lab-grown Opal", "Intricate band detailing"}', 9, 'd8e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f');


INSERT INTO team_members (name, role, image_url, bio) VALUES
('Aisha Khan', 'Founder & CEO', 'https://placehold.co/400x400.png', 'With a lifelong passion for design and artistry, Aisha founded Sundaraah to bring unique, handcrafted jewelry to the world.'),
('Rohan Verma', 'Master Artisan', 'https://placehold.co/400x400.png', 'Rohan is the heart of our workshop, with over 20 years of experience in traditional jewelry making techniques.'),
('Priya Sharma', 'Customer Happiness Lead', 'https://placehold.co/400x400.png', 'Priya ensures every customer has a wonderful experience, from browsing our collections to unboxing their new treasure.');

INSERT INTO blog_posts (title, slug, date, excerpt, content) VALUES
('The Art of Layering Necklaces', 'art-of-layering-necklaces', 'June 15, 2024', 'Discover our top tips for creating the perfect layered necklace look, from choosing lengths to mixing metals.', '<h1>The Art of Layering Necklaces</h1><p>Layering necklaces is a trend that''s here to stay. It allows you to express your personal style and create a look that''s uniquely yours. Here are our top tips...</p>'),
('Caring for Your Handcrafted Jewelry', 'caring-for-jewelry', 'May 28, 2024', 'Keep your Sundaraah pieces sparkling for years to come with our simple and effective care guide.', '<h1>Caring for Your Handcrafted Jewelry</h1><p>Your jewelry is an investment. To keep it looking its best, follow these simple steps...</p>'),
('Meet the Maker: Rohan Verma', 'meet-the-maker-rohan', 'May 10, 2024', 'Go behind the scenes and learn about the inspiration and process of our Master Artisan, Rohan Verma.', '<h1>Meet the Maker: Rohan Verma</h1><p>We sat down with Rohan to discuss his journey, his passion, and what makes Sundaraah jewelry so special...</p>');

INSERT INTO orders (id, customer_name, customer_email, total, status) VALUES 
('f4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Priya Kumar', 'priya.kumar@example.com', 305.00, 'Fulfilled'),
('g4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Amit Singh', 'amit.singh@example.com', 95.00, 'Processing'),
('h4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', 'Sunita Sharma', 'sunita.sharma@example.com', 445.00, 'Cancelled');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('f4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', (SELECT id from products WHERE slug = 'golden-sunstone-necklace'), 1, 185.00),
('f4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', (SELECT id from products WHERE slug = 'silver-moonstone-earrings'), 1, 120.00),
('g4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', (SELECT id from products WHERE slug = 'rose-gold-charm-bracelet'), 1, 95.00),
('h4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', (SELECT id from products WHERE slug = 'minimalist-gold-band'), 1, 250.00),
('h4e8f8f8-8f8f-8f8f-8f8f-8f8f8f8f8f8f', (SELECT id from products WHERE slug = 'opal-statement-ring'), 1, 195.00);
