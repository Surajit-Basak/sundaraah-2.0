-- Create the products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    description TEXT,
    details TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for products
INSERT INTO products (name, slug, category, price, image_url, description, details) VALUES
('Golden Sunstone Necklace', 'golden-sunstone-necklace', 'Necklaces', 185.00, 'https://placehold.co/600x600.png', 'A radiant gold-plated necklace featuring a mesmerizing sunstone pendant. Perfect for adding a touch of warmth and elegance to any outfit.', '{"18k Gold Plated Sterling Silver", "Genuine Sunstone Crystal", "18-inch chain with 2-inch extender", "Lobster clasp closure"}'),
('Silver Moonstone Earrings', 'silver-moonstone-earrings', 'Earrings', 95.00, 'https://placehold.co/600x600.png', 'Delicate sterling silver earrings with luminous moonstone drops. These earrings capture the magic of moonlight.', '{"Solid 925 Sterling Silver", "Natural Rainbow Moonstone", "Lightweight and comfortable for all-day wear", "Hypoallergenic fish hook backs"}'),
('Rose Quartz Beaded Bracelet', 'rose-quartz-beaded-bracelet', 'Bracelets', 75.00, 'https://placehold.co/600x600.png', 'A beautiful bracelet made with genuine rose quartz beads, known as the stone of universal love. Finished with a golden accent bead.', '{"8mm Genuine Rose Quartz beads", "Durable elastic cord", "Fits most wrist sizes (6.5 - 7.5 inches)", "Gold-plated spacer bead"}'),
('Emerald Isle Ring', 'emerald-isle-ring', 'Rings', 250.00, 'https://placehold.co/600x600.png', 'A stunning statement ring featuring a lab-grown emerald set in a vintage-inspired golden band.', '{"14k Gold Vermeil", "High-quality Lab-Grown Emerald", "Intricate band detailing", "Available in sizes 5-9"}'),
('Bohemian Tassel Lariat', 'bohemian-tassel-lariat', 'Necklaces', 120.00, 'https://placehold.co/600x600.png', 'A long, versatile lariat necklace with delicate chain tassels. Perfect for layering or wearing as a standalone piece.', '{"18k Gold Plated", "Adjustable length", "Minimalist and chic design", "Can be styled multiple ways"}'),
('Pearl Drop Hoops', 'pearl-drop-hoops', 'Earrings', 110.00, 'https://placehold.co/600x600.png', 'Classic golden hoops get a modern update with detachable freshwater pearl charms.', '{"14k Gold Filled Hoops", "Genuine Freshwater Pearls", "Two-in-one style: wear with or without pearls", "Secure latch-back closure"}');
