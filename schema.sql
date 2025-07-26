-- Create products table
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    details TEXT[],
    image_url TEXT,
    inventory INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    date TEXT,
    image_url TEXT,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create team_members table
CREATE TABLE team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to products
CREATE POLICY "Allow public read access" ON products
FOR SELECT USING (true);

-- Enable Row Level Security (RLS) for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to blog_posts
CREATE POLICY "Allow public read access for blog posts" ON blog_posts
FOR SELECT USING (true);

-- Enable Row Level Security (RLS) for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to team_members
CREATE POLICY "Allow public read access for team members" ON team_members
FOR SELECT USING (true);
