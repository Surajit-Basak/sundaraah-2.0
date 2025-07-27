

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string; // This will come from the joined categories table
  category_id: string;
  price: number;
  imageUrl: string;
  image_url?: string; // from supabase
  description: string;
  details: string[];
  inventory: number;
};

export type Category = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
  image_url?: string; // from supabase
  excerpt: string;
  content: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  image_url?: string; // from supabase
  bio: string;
};

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'Processing' | 'Fulfilled' | 'Cancelled';
};

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: Product | null;
}

export type OrderWithItems = Order & {
    order_items: OrderItem[];
}
