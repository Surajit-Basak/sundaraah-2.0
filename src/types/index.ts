
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
  created_at: string;
};

export interface CartItem extends Product {
  quantity: number;
}

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

export type FullOrderForEmail = Omit<Order, 'id' | 'created_at'> & {
  id: string;
  created_at: string;
  order_items: CartItem[];
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

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  user_role: 'admin' | 'user';
};

export type Settings = {
  id?: number;
  site_name: string;
  theme_colors: {
    primary: string;
    background: string;
    accent: string;
  };
  whatsapp_number: string | null;
  whatsapp_enabled: boolean;
};

export type PageContent = {
  id: number;
  page: string;
  section: string;
  content: { [key: string]: any } | null;
};

export type PageSeo = {
  id: number;
  page_identifier: string;
  seo_title: string | null;
  meta_description: string | null;
};

export type Collection = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    products?: Product[]; // For holding related products
}

export type Media = {
  id: string;
  user_id: string | null;
  file_name: string | null;
  file_path: string | null;
  url: string | null;
  alt_text: string | null;
  content_type: string | null;
  created_at: string;
};
