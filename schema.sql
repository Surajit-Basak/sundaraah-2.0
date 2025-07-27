
-- Enable RLS
alter table "public"."products" enable row level security;
alter table "public"."blog_posts" enable row level security;
alter table "public"."team_members" enable row level security;
alter table "public"."categories" enable row level security;
alter table "public"."orders" enable row level security;
alter table "public"."order_items" enable row level security;

--
-- PRODUCTS
--
create table if not exists public.products (
    id uuid default gen_random_uuid() not null,
    name text not null,
    description text,
    price numeric not null,
    inventory integer not null,
    image_url text,
    slug text not null,
    details text[] not null,
    category_id uuid,
    constraint products_pkey primary key (id),
    constraint products_slug_key unique (slug),
    constraint products_category_id_fkey foreign key (category_id) references categories (id) on delete set null
);
-- Create policy
create policy "Allow public read-only access" on public.products for select using (true);

--
-- CATEGORIES
--
create table if not exists public.categories (
    id uuid default gen_random_uuid() not null,
    name text not null,
    constraint categories_pkey primary key (id),
    constraint categories_name_key unique (name)
);
-- Create policy
create policy "Allow public read-only access" on public.categories for select using (true);


--
-- BLOG POSTS
--
create table if not exists public.blog_posts (
    id uuid default gen_random_uuid() not null,
    title text not null,
    slug text not null,
    date text not null,
    excerpt text not null,
    content text not null,
    image_url text,
    constraint blog_posts_pkey primary key (id),
    constraint blog_posts_slug_key unique (slug)
);
-- Create policy
create policy "Allow public read-only access" on public.blog_posts for select using (true);

--
-- TEAM MEMBERS
--
create table if not exists public.team_members (
    id uuid default gen_random_uuid() not null,
    name text not null,
    role text not null,
    bio text not null,
    image_url text,
    constraint team_members_pkey primary key (id)
);
-- Create policy
create policy "Allow public read-only access" on public.team_members for select using (true);

--
-- ORDERS
--
create table if not exists public.orders (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    customer_name text not null,
    customer_email text not null,
    total numeric not null,
    status text default 'Processing'::text not null,
    constraint orders_pkey primary key (id)
);
-- Create policy (for now, allow all for admin actions)
create policy "Allow admin full access" on public.orders for all using (true) with check (true);

--
-- ORDER ITEMS
--
create table if not exists public.order_items (
    id uuid default gen_random_uuid() not null,
    order_id uuid not null,
    product_id uuid not null,
    quantity integer not null,
    price numeric not null,
    constraint order_items_pkey primary key (id),
    constraint order_items_order_id_fkey foreign key (order_id) references orders (id) on delete cascade,
    constraint order_items_product_id_fkey foreign key (product_id) references products (id) on delete set null
);
-- Create policy (for now, allow all for admin actions)
create policy "Allow admin full access" on public.order_items for all using (true) with check (true);


--
-- SEED DATA
--
BEGIN;

-- Seed categories
INSERT INTO public.categories (name) VALUES
('Necklaces'),
('Earrings'),
('Bracelets'),
('Rings'),
('Anklets')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
    necklace_id uuid;
    earring_id uuid;
    bracelet_id uuid;
    ring_id uuid;
    anklet_id uuid;
BEGIN
    SELECT id INTO necklace_id FROM public.categories WHERE name = 'Necklaces';
    SELECT id INTO earring_id FROM public.categories WHERE name = 'Earrings';
    SELECT id INTO bracelet_id FROM public.categories WHERE name = 'Bracelets';
    SELECT id INTO ring_id FROM public.categories WHERE name = 'Rings';
    SELECT id INTO anklet_id FROM public.categories WHERE name = 'Anklets';

    -- Seed products
    INSERT INTO public.products (name, slug, description, price, inventory, details, category_id, image_url) VALUES
    ('Golden Sunstone Necklace', 'golden-sunstone-necklace', 'A radiant gold-plated necklace featuring a genuine sunstone pendant. Perfect for adding a touch of warmth and elegance to any outfit.', 185.00, 10, '{"18k Gold Plated", "Genuine Sunstone", "18-inch chain"}', necklace_id, 'https://placehold.co/600x600.png'),
    ('Silver Moonstone Earrings', 'silver-moonstone-earrings', 'Delicate sterling silver earrings with iridescent moonstone gems that catch the light beautifully.', 95.00, 15, '{"Sterling Silver", "Rainbow Moonstone", "Hypoallergenic"}', earring_id, 'https://placehold.co/600x600.png'),
    ('Rose Quartz Beaded Bracelet', 'rose-quartz-beaded-bracelet', 'A charming bracelet made with genuine rose quartz beads, known for promoting love and harmony.', 75.00, 20, '{"Genuine Rose Quartz", "Stretch-to-fit", "Hand-knotted"}', bracelet_id, 'https://placehold.co/600x600.png'),
    ('Minimalist Gold Band Ring', 'minimalist-gold-band-ring', 'A simple yet elegant 14k gold band, perfect for stacking or wearing alone for a classic look.', 120.00, 25, '{"14k Solid Gold", "2mm width", "Polished finish"}', ring_id, 'https://placehold.co/600x600.png'),
    ('Turquoise Charm Anklet', 'turquoise-charm-anklet', 'A beautiful silver anklet adorned with small turquoise charms, perfect for a bohemian-inspired look.', 60.00, 18, '{"Sterling Silver", "Natural Turquoise", "Adjustable length"}', anklet_id, 'https://placehold.co/600x600.png'),
    ('Emerald Drop Necklace', 'emerald-drop-necklace', 'A stunning necklace featuring a lab-created emerald drop on a fine gold chain. A classic piece for special occasions.', 250.00, 8, '{"14k Gold Chain", "Lab-Created Emerald", "Secure clasp"}', necklace_id, 'https://placehold.co/600x600.png'),
    ('Pearl Stud Earrings', 'pearl-stud-earrings', 'Classic freshwater pearl stud earrings with sterling silver posts. A timeless addition to any jewelry collection.', 80.00, 30, '{"Freshwater Pearls", "Sterling Silver", "Butterfly backs"}', earring_id, 'https://placehold.co/600x600.png'),
    ('Leather Wrap Bracelet', 'leather-wrap-bracelet', 'A stylish and versatile leather wrap bracelet with a silver-plated magnetic clasp.', 55.00, 22, '{"Genuine Leather", "Silver-plated clasp", "Unisex design"}', bracelet_id, 'https://placehold.co/600x600.png'),
    ('Opal Inlay Ring', 'opal-inlay-ring', 'A mesmerizing sterling silver ring with a vibrant opal inlay, reflecting a rainbow of colors.', 150.00, 12, '{"Sterling Silver", "Lab-grown Opal", "Comfort fit"}', ring_id, 'https://placehold.co/600x600.png'),
    ('Amethyst Pendant Necklace', 'amethyst-pendant-necklace', 'A deep purple amethyst pendant on a delicate silver chain. Known for its calming properties.', 110.00, 16, '{"Sterling Silver", "Genuine Amethyst", "16-inch chain"}', necklace_id, 'https://placehold.co/600x600.png');
END $$;


-- Seed Blog Posts
INSERT INTO public.blog_posts (title, slug, date, excerpt, content, image_url) VALUES
('The Art of Layering Necklaces', 'art-of-layering-necklaces', 'July 15, 2024', 'Discover the secrets to creating the perfect layered necklace look. From choosing the right lengths to mixing metals, we cover it all.', '<p>Layering necklaces is a beautiful way to express your personal style. Start with a delicate choker, add a mid-length pendant, and finish with a longer chain. Dont be afraid to mix gold and silver for a modern twist!</p>', 'https://placehold.co/400x250.png'),
('Caring for Your Handcrafted Jewelry', 'caring-for-jewelry', 'June 28, 2024', 'Learn the best practices for cleaning and storing your precious pieces to ensure they last a lifetime.', '<p>To keep your jewelry sparkling, gently wipe it with a soft cloth after each wear. Store pieces separately in a fabric-lined box to prevent scratches. For a deeper clean, use mild soap and warm water, but avoid harsh chemicals.</p>', 'https://placehold.co/400x250.png'),
('The Meaning Behind Gemstones', 'gemstone-meanings', 'June 10, 2024', 'From the calming energy of amethyst to the passionate fire of ruby, explore the rich symbolism and history of your favorite gems.', '<p>Gemstones have been cherished for centuries not just for their beauty, but for their meanings. Amethyst is believed to bring peace, while rose quartz is the stone of unconditional love. Choose a gem that resonates with you personally.</p>', 'https://placehold.co/400x250.png');

-- Seed Team Members
INSERT INTO public.team_members (name, role, bio, image_url) VALUES
('Ananya Sharma', 'Founder & Lead Designer', 'Ananya started Sundaraah from her small studio, driven by a passion for creating meaningful, handcrafted jewelry that tells a story.', 'https://placehold.co/400x400.png'),
('Rohan Verma', 'Master Artisan', 'With over 20 years of experience, Rohan is the heart of our workshop, turning Ananyas designs into tangible works of art.', 'https://placehold.co/400x400.png'),
('Priya Singh', 'Customer Experience Lead', 'Priya ensures every customer feels like part of the Sundaraah family, handling everything from inquiries to custom orders with a smile.', 'https://placehold.co/400x400.png');

-- Seed Orders
DO $$
DECLARE
    order1_id uuid;
    order2_id uuid;
    product1_id uuid;
    product2_id uuid;
    product3_id uuid;
BEGIN
    -- Get some product IDs
    SELECT id INTO product1_id FROM public.products WHERE slug = 'golden-sunstone-necklace';
    SELECT id INTO product2_id FROM public.products WHERE slug = 'silver-moonstone-earrings';
    SELECT id INTO product3_id FROM public.products WHERE slug = 'rose-quartz-beaded-bracelet';

    -- Insert Order 1
    INSERT INTO public.orders (customer_name, customer_email, total, status)
    VALUES ('Alice Johnson', 'alice@example.com', 280.00, 'Fulfilled')
    RETURNING id INTO order1_id;

    -- Insert items for Order 1
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES
        (order1_id, product1_id, 1, 185.00),
        (order1_id, product2_id, 1, 95.00);

    -- Insert Order 2
    INSERT INTO public.orders (customer_name, customer_email, total, status)
    VALUES ('Bob Williams', 'bob@example.com', 170.00, 'Processing')
    RETURNING id INTO order2_id;

    -- Insert items for Order 2
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES
        (order2_id, product2_id, 1, 95.00),
        (order2_id, product3_id, 1, 75.00);
END $$;


COMMIT;
