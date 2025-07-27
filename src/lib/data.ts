
'use server';

import type { Product, BlogPost, TeamMember, Order, OrderWithItems, Category } from "@/types";
import { createSupabaseServerClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function getProducts(): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').select(`
        *,
        categories (
            name
        )
    `);

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    
    return data.map(p => ({ 
        ...p, 
        category: p.categories.name, 
        imageUrl: p.image_url || 'https://placehold.co/600x600.png' 
    })) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select(`
        *,
        categories (
            name
        )
    `).eq('slug', slug).single();

  if (error || !data) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  return { 
    ...data, 
    category: data.categories.name, 
    imageUrl: data.image_url || 'https://placehold.co/600x600.png' 
  };
}

export async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (name)
        `)
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4);

    if (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
    
    return data.map(p => ({ 
        ...p, 
        category: p.categories.name, 
        imageUrl: p.image_url || 'https://placehold.co/600x600.png' 
    })) || [];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (name)
        `)
        .in('id', ids);

    if (error) {
        console.error('Error fetching products by ids:', error);
        return [];
    }
    
    const products = data.map(p => ({ 
        ...p, 
        category: p.categories.name, 
        imageUrl: p.image_url || 'https://placehold.co/600x600.png' 
    })) || [];

    // Preserve the order of the original IDs array
    return ids.map(id => products.find(p => p.id === id)).filter((p): p is Product => !!p);
}


type ProductInput = Omit<Product, 'id' | 'imageUrl' | 'category'> & { image_url?: string };

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

export async function getCategories(): Promise<Category[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
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

export async function getOrders(): Promise<Order[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data;
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products (
                    *,
                    categories (name)
                )
            )
        `)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching order by id:', error);
        return null;
    }
    
    // Transform the order items to include the full product object.
    const transformedItems = data.order_items.map((item: any) => ({
        ...item,
        product: item.products ? {
            ...item.products,
            category: item.products.categories.name,
            imageUrl: item.products.image_url || 'https://placehold.co/100x100.png'
        } : null
    }));

    return { ...data, order_items: transformedItems };
}


type NewOrder = {
    customer_name: string;
    customer_email: string;
    total: number;
    items: { product_id: string; quantity: number; price: number }[];
    user_id?: string | null;
}
export async function createOrder(orderData: NewOrder): Promise<string> {
    const supabase = createSupabaseServerClient();

    // Create the main order record
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            total: orderData.total,
            status: 'Processing',
            user_id: orderData.user_id
        })
        .select('id')
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        throw new Error('Failed to create order.');
    }

    const orderId = order.id;

    // Create the order items records
    const orderItems = orderData.items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // If items fail, we should ideally delete the order record to avoid orphans.
        await supabase.from('orders').delete().eq('id', orderId);
        throw new Error('Failed to create order items.');
    }

    revalidatePath('/admin/orders');
    if (orderData.user_id) {
        revalidatePath('/account');
    }


    return orderId;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders by user id:', error);
        return [];
    }

    return data;
}
