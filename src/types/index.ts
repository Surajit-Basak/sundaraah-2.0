

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string; // This will come from the joined categories table
  category_id: string;
  price: number;
  imageUrl: string;
  imageUrls: string[]; // For multiple images
  description: string;
  details: string[];
  inventory: number;
  reviews: ProductReview[];
};

export type ProductReview = {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  title: string;
  comment: string | null;
  author_name: string | null;
  created_at: string;
}

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
  user_id?: string | null;
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

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_href: string | null;
  link_text: string | null;
  is_active: boolean;
  sort_order: number;
};
