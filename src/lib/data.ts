import type { Product, BlogPost, TeamMember } from "@/types";
import { createSupabaseServerClient } from "./supabase/server";

const staticProducts: Product[] = [
  {
    id: "1",
    name: "Golden Sunstone Necklace",
    slug: "golden-sunstone-necklace",
    category: "Necklaces",
    price: 185.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "A radiant gold-plated necklace featuring a mesmerizing sunstone pendant. Perfect for adding a touch of warmth and elegance to any outfit.",
    details: [
      "18k Gold Plated Sterling Silver",
      "Genuine Sunstone Crystal",
      "18-inch chain with 2-inch extender",
      "Lobster clasp closure",
    ],
  },
  {
    id: "2",
    name: "Silver Moonstone Earrings",
    slug: "silver-moonstone-earrings",
    category: "Earrings",
    price: 95.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "Delicate sterling silver earrings with luminous moonstone drops. These earrings capture the magic of moonlight.",
    details: [
      "Solid 925 Sterling Silver",
      "Natural Rainbow Moonstone",
      "Lightweight and comfortable for all-day wear",
      "Hypoallergenic fish hook backs",
    ],
  },
  {
    id: "3",
    name: "Rose Quartz Beaded Bracelet",
    slug: "rose-quartz-beaded-bracelet",
    category: "Bracelets",
    price: 75.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "A beautiful bracelet made with genuine rose quartz beads, known as the stone of universal love. Finished with a golden accent bead.",
    details: [
      "8mm Genuine Rose Quartz beads",
      "Durable elastic cord",
      "Fits most wrist sizes (6.5 - 7.5 inches)",
      "Gold-plated spacer bead",
    ],
  },
  {
    id: "4",
    name: "Emerald Isle Ring",
    slug: "emerald-isle-ring",
    category: "Rings",
    price: 250.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "A stunning statement ring featuring a lab-grown emerald set in a vintage-inspired golden band.",
    details: [
      "14k Gold Vermeil",
      "High-quality Lab-Grown Emerald",
      "Intricate band detailing",
      "Available in sizes 5-9",
    ],
  },
  {
    id: "5",
    name: "Bohemian Tassel Lariat",
    slug: "bohemian-tassel-lariat",
    category: "Necklaces",
    price: 120.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "A long, versatile lariat necklace with delicate chain tassels. Perfect for layering or wearing as a standalone piece.",
    details: [
      "18k Gold Plated",
      "Adjustable length",
      "Minimalist and chic design",
      "Can be styled multiple ways",
    ],
  },
  {
    id: "6",
    name: "Pearl Drop Hoops",
    slug: "pearl-drop-hoops",
    category: "Earrings",
    price: 110.0,
    imageUrl: "https://placehold.co/600x600.png",
    description: "Classic golden hoops get a modern update with detachable freshwater pearl charms.",
    details: [
      "14k Gold Filled Hoops",
      "Genuine Freshwater Pearls",
      "Two-in-one style: wear with or without pearls",
      "Secure latch-back closure",
    ],
  },
];

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Layering Necklaces",
    slug: "art-of-layering-necklaces",
    date: "October 26, 2023",
    imageUrl: "https://placehold.co/400x250.png",
    excerpt: "Master the trend of necklace layering with our simple tips and tricks. From choosing the right lengths to mixing metals, we cover it all.",
    content: "<p>Layering necklaces is more than just a trend; it's a form of self-expression. The key to a perfect stack is variety and balance. Start with a simple choker or a short, delicate chain as your base. This will be the highest piece in your arrangement.</p><p>Next, add a mid-length necklace. This could be a pendant necklace, like our Golden Sunstone Necklace, which adds a focal point to your stack. The ideal length is usually 18 to 20 inches, allowing it to sit comfortably below your first piece.</p><p>Finally, add a longer chain, perhaps 22 inches or more, to complete the look. Don't be afraid to mix metals! A touch of silver with gold can create a modern and eclectic vibe. Remember, the goal is to create a look that is uniquely you.</p>",
  },
  {
    id: "2",
    title: "Caring for Your Handcrafted Jewelry",
    slug: "caring-for-handcrafted-jewelry",
    date: "September 15, 2023",
    imageUrl: "https://placehold.co/400x250.png",
    excerpt: "Your beautiful jewelry deserves the best care. Learn how to clean, store, and protect your handcrafted pieces to keep them sparkling for years.",
    content: "<p>Handcrafted jewelry is special, and with the right care, it can last a lifetime. Here are our top tips: </p><ul><li><strong>Storage:</strong> Store each piece separately in a soft pouch or a lined jewelry box to prevent scratching and tangling.</li><li><strong>Cleaning:</strong> Use a soft, lint-free cloth to gently wipe your jewelry after each wear. For a deeper clean, use mild soap and warm water, then dry thoroughly. Avoid harsh chemicals.</li><li><strong>Protection:</strong> Put your jewelry on last, after applying lotions, perfumes, and hairspray. Remove it before swimming, bathing, or exercising.</li></ul>",
  },
  {
    id: "3",
    title: "The Meaning Behind Gemstones",
    slug: "meaning-behind-gemstones",
    date: "August 02, 2023",
    imageUrl: "https://placehold.co/400x250.png",
    excerpt: "From the love-attracting properties of Rose Quartz to the calming energy of Moonstone, discover the stories and meanings behind your favorite gems.",
    content: "<p>Gemstones have been cherished for centuries not just for their beauty, but for their perceived powers and meanings.</p><ul><li><strong>Rose Quartz:</strong> Known as the stone of unconditional love, it's believed to open the heart and promote self-love and deep inner healing.</li><li><strong>Moonstone:</strong> A stone for new beginnings, Moonstone is a gem of inner growth and strength. It's said to soothe emotional instability and stress.</li><li><strong>Sunstone:</strong> This radiant stone is linked to luck and good fortune. It's believed to instill good nature, heighten intuition, and allow the real self to shine through happily.</li></ul>",
  },
];

const teamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Aanya Sharma",
        role: "Founder & Lead Designer",
        imageUrl: "https://placehold.co/400x400.png",
        bio: "Aanya started Sundaraah with a passion for creating beautiful, meaningful jewelry. Her designs are inspired by nature and ancient artistry, blending timeless elegance with modern style."
    },
    {
        id: "2",
        name: "Rohan Verma",
        role: "Master Artisan",
        imageUrl: "https://placehold.co/400x400.png",
        bio: "With over 20 years of experience, Rohan is the hands behind the craft. His meticulous attention to detail and skill in metalworking brings Aanya's visions to life."
    },
    {
        id: "3",
        name: "Priya Singh",
        role: "Customer Happiness Manager",
        imageUrl: "https://placehold.co/400x400.png",
        bio: "Priya ensures that every customer's experience is as beautiful as our jewelry. She's here to help with any questions, from styling advice to order inquiries."
    }
]

export async function getProducts(): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return staticProducts;
    }
    
    // The data from supabase will have image_url, which needs to be mapped to imageUrl
    return data.map(p => ({ ...p, imageUrl: p.image_url || 'https://placehold.co/600x600.png' })) || staticProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (error || !data) {
    console.error('Error fetching product by slug:', error);
    return staticProducts.find((p) => p.slug === slug);
  }

  return { ...data, imageUrl: data.image_url || 'https://placehold.co/600x600.png' };
}

export function getBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getTeamMembers() {
    return teamMembers;
}
