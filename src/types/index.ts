export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  details: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  content: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
};
