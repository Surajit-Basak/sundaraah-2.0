
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
  wishlist_count?: number; // For wishlist analytics
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
  product_name?: string; // For admin view
  products?: { name: string }; // For admin view
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
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
  shipping_fee: number;
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

export type Address = {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
};

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  user_role: 'admin' | 'user';
  dob?: string | null;
  billing_address?: Address | null;
  shipping_address?: Address | null;
};

export type Settings = {
  id: number;
  site_name: string;
  header_logo_url: string | null;
  footer_logo_url: string | null;
  favicon_url: string | null;
  copyright_text: string | null;
  theme_colors: {
    primary: string;
    background: string;
    accent: string;
  };
  theme_fonts: {
    body: string;
    headline: string;
  };
  whatsapp_number: string | null;
  whatsapp_enabled: boolean;
  shipping_fee: number;
  free_shipping_threshold: number;
  preloader_enabled: boolean;
  social_twitter_url: string | null;
  social_twitter_enabled: boolean;
  social_facebook_url: string | null;
  social_facebook_enabled: boolean;
  social_instagram_url: string | null;
  social_instagram_enabled: boolean;
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

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  is_active: boolean;
  created_at: string;
};

export type EmailTemplate = {
  id: number;
  name: string;
  event_trigger: string;
  subject: string;
  body: string;
  is_active: boolean;
  created_at: string;
};

export type WishlistItem = {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product: Product;
}
