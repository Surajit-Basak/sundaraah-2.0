
'use server';

import type { Product, BlogPost, TeamMember } from "@/types";
import { createSupabaseServerClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function getProducts(): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    
    return data.map(p => ({ ...p, imageUrl: p.image_url || 'https://placehold.co/600x600.png' })) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (error || !data) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  return { ...data, imageUrl: data.image_url || 'https://placehold.co/600x600.png' };
}

type ProductInput = Omit<Product, 'id' | 'imageUrl'> & { image_url?: string };

export async function createProduct(productData: ProductInput) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').insert([productData]).select().single();

    if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product.');
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return data;
}

export async function updateProduct(id: string, productData: Partial<ProductInput>) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();

    if (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product.');
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${data.slug}/edit`);
    revalidatePath('/shop');
    revalidatePath(`/shop/${data.slug}`);

    return data;
}

export async function deleteProduct(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product.');
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('blog_posts').select('*');

    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }

    return data.map(p => ({ ...p, imageUrl: p.image_url || 'https://placehold.co/400x250.png' })) || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();

    if (error || !data) {
        console.error('Error fetching blog post by slug:', error);
        return undefined;
    }

    return { ...data, imageUrl: data.image_url || 'https://placehold.co/400x250.png' };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members').select('*');

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data.map(m => ({ ...m, imageUrl: m.image_url || 'https://placehold.co/400x400.png' })) || [];
}
