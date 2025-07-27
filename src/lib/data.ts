
'use server';

import type { Product, BlogPost, TeamMember, Order, OrderWithItems, Category, ProductReview, Banner, UserProfile, Settings, PageContent, Collection, CartItem, FullOrderForEmail, Media } from "@/types";
import { createSupabaseServerClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/order-confirmation-email";


// Product Functions
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
        imageUrl: p.image_url || 'https://placehold.co/600x600.png',
        imageUrls: [],
        reviews: [],
    })) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select(`
        *,
        categories (name),
        product_images (image_url),
        product_reviews (*)
    `).eq('slug', slug).order('created_at', { referencedTable: 'product_reviews', ascending: false }).single();

  if (error || !data) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  const imageUrls = data.product_images.map((img: { image_url: string }) => img.image_url);
  
  return { 
    ...data, 
    category: data.categories.name, 
    imageUrl: data.image_url || 'https://placehold.co/600x600.png',
    imageUrls: imageUrls.length > 0 ? imageUrls : [data.image_url || 'https://placehold.co/600x600.png'],
    reviews: data.product_reviews as ProductReview[] || []
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
        imageUrl: p.image_url || 'https://placehold.co/600x600.png',
        imageUrls: [],
        reviews: [],
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
        imageUrl: p.image_url || 'https://placehold.co/600x600.png',
        imageUrls: [],
        reviews: [],
    })) || [];

    return ids.map(id => products.find(p => p.id === id)).filter((p): p is Product => !!p);
}


type ProductInput = Omit<Product, 'id' | 'imageUrl' | 'imageUrls' | 'reviews' | 'category' | 'created_at'> & { image_url?: string };

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

// Category Functions
export async function getCategories(): Promise<Category[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

// Blog Post Functions
export async function getBlogPosts(): Promise<BlogPost[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }

    return data.map(p => ({ ...p, imageUrl: p.image_url || 'https://placehold.co/400x250.png' })) || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();

    if (error || !data) {
        console.error('Error fetching blog post by slug:', error);
        return null;
    }

    return { ...data, imageUrl: data.image_url || 'https://placehold.co/400x250.png' };
}

type BlogPostInput = Omit<BlogPost, 'id' | 'imageUrl'> & { image_url?: string };

export async function createBlogPost(postData: BlogPostInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('blog_posts').insert([postData]);

    if (error) {
        console.error('Error creating blog post:', error);
        throw new Error('Failed to create blog post.');
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
}

export async function updateBlogPost(id: string, postData: Partial<BlogPostInput>) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('blog_posts').update(postData).eq('id', id).select().single();

    if (error) {
        console.error('Error updating blog post:', error);
        throw new Error('Failed to update blog post.');
    }
    
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);
}

export async function deleteBlogPost(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
        console.error('Error deleting blog post:', error);
        throw new Error('Failed to delete blog post.');
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
}

// Team Member Functions
export async function getTeamMembers(): Promise<TeamMember[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data.map(m => ({ ...m, imageUrl: m.image_url || 'https://placehold.co/400x400.png' })) || [];
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
     if (error || !data) {
        console.error('Error fetching team member by id:', error);
        return null;
    }

    return { ...data, imageUrl: data.image_url || 'https://placehold.co/400x400.png' };
}

type TeamMemberInput = Omit<TeamMember, 'id' | 'imageUrl'> & { image_url?: string };

export async function createTeamMember(memberData: TeamMemberInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('team_members').insert([memberData]);

    if (error) {
        console.error('Error creating team member:', error);
        throw new Error('Failed to create team member.');
    }

    revalidatePath('/admin/team');
    revalidatePath('/about');
}

export async function updateTeamMember(id: string, memberData: Partial<TeamMemberInput>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('team_members').update(memberData).eq('id', id);

    if (error) {
        console.error('Error updating team member:', error);
        throw new Error('Failed to update team member.');
    }
    
    revalidatePath('/admin/team');
    revalidatePath('/about');
}

export async function deleteTeamMember(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('team_members').delete().eq('id', id);

    if (error) {
        console.error('Error deleting team member:', error);
        throw new Error('Failed to delete team member.');
    }

    revalidatePath('/admin/team');
    revalidatePath('/about');
}

// Order Functions
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
    
    const transformedItems = data.order_items.map((item: any) => ({
        ...item,
        product: item.products ? {
            ...item.products,
            category: item.products.categories.name,
            imageUrl: item.products.image_url || 'https://placehold.co/100x100.png',
            imageUrls: [],
            reviews: []
        } : null
    }));

    return { ...data, order_items: transformedItems };
}

type NewOrder = {
    customer_name: string;
    customer_email: string;
    total: number;
    items: CartItem[];
    user_id?: string | null;
}
export async function createOrder(orderData: NewOrder): Promise<string> {
    const supabase = createSupabaseServerClient();
    
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            total: orderData.total,
            status: 'Processing',
            user_id: orderData.user_id
        })
        .select('id, created_at')
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        throw new Error('Failed to create order.');
    }

    const orderId = order.id;

    const orderItems = orderData.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        await supabase.from('orders').delete().eq('id', orderId);
        throw new Error('Failed to create order items.');
    }
    
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        try {
            const resend = new Resend(resendApiKey);
            const settings = await getSettings();
            await resend.emails.send({
                from: `"${settings?.site_name || 'Sundaraah'}" <noreply@sundaraah.com>`,
                to: [orderData.customer_email],
                subject: 'Your Sundaraah Order Confirmation',
                react: OrderConfirmationEmail({
                    order: { ...order, ...orderData, order_items: orderData.items },
                    siteName: settings?.site_name || 'Sundaraah Showcase',
                }),
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
    } else {
        console.warn("RESEND_API_KEY is not set. Skipping order confirmation email.");
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

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status.');
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
}


// Product Review Functions
type ReviewInput = Omit<ProductReview, 'id' | 'created_at'>;

export async function createProductReview(reviewData: ReviewInput, productSlug: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('product_reviews').insert([reviewData]).select().single();

    if (error) {
        console.error('Error creating product review:', error);
        throw new Error('Failed to create product review.');
    }
    
    revalidatePath(`/shop/${productSlug}`);

    return data;
}

// Banner Functions
export async function getBanners(): Promise<Banner[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
    
    if (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
    return data || [];
}

export async function getBannerById(id: string): Promise<Banner | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('banners').select('*').eq('id', id).single();
    if (error || !data) {
        console.error('Error fetching banner by id:', error);
        return null;
    }
    return data;
}

type BannerInput = Omit<Banner, 'id'>;

export async function createBanner(bannerData: BannerInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('banners').insert([bannerData]);
    if (error) {
        console.error('Error creating banner:', error);
        throw new Error('Failed to create banner.');
    }
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

export async function updateBanner(id: string, bannerData: Partial<BannerInput>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('banners').update(bannerData).eq('id', id);
    if (error) {
        console.error('Error updating banner:', error);
        throw new Error('Failed to update banner.');
    }
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

export async function deleteBanner(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) {
        console.error('Error deleting banner:', error);
        throw new Error('Failed to delete banner.');
    }
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

// User Functions
export async function getUsers(): Promise<UserProfile[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('users').select('*').order('email');

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }
    return data || [];
}

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('users')
        .update({ user_role: role })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user role:', error);
        throw new Error('Failed to update user role.');
    }

    revalidatePath('/admin/users');
}

// Settings Functions
export async function getSettings(): Promise<Settings | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) {
        console.error('Error fetching settings:', error);
        // Provide sensible defaults if the settings row doesn't exist yet
        return { 
            site_name: 'Sundaraah Showcase',
            theme_colors: {
              primary: "hsl(347 65% 25%)",
              background: "hsl(30 50% 98%)",
              accent: "hsl(45 85% 55%)",
            },
            whatsapp_number: '', 
            whatsapp_enabled: false 
        };
    }
    return data;
}

export async function updateSettings(settingsData: Partial<Omit<Settings, 'id'>>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('settings').update(settingsData).eq('id', 1);
    if (error) {
        console.error('Error updating settings:', error);
        throw new Error('Failed to update settings.');
    }
    revalidatePath('/', 'layout'); // Revalidate the whole site to apply changes
}

// Page Content Functions
export async function getPageContent(page: string): Promise<PageContent[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', page);

    if (error) {
        console.error(`Error fetching content for page "${page}":`, error);
        return [];
    }
    return data || [];
}

export async function updatePageContent(page: string, section: string, content: any) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('page_content')
        .update({ content })
        .match({ page, section });

    if (error) {
        console.error(`Error updating content for ${page}.${section}:`, error);
        throw new Error('Failed to update page content.');
    }
    revalidatePath('/', 'layout'); // Revalidate the whole site
}

// Collection Functions
export async function getCollections(): Promise<Collection[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
    return data || [];
}

export async function getCollectionById(id: string): Promise<Collection | null> {
    const supabase = createSupabaseServerClient();
    // This query now also fetches the associated products
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        products (
            id
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
        console.error('Error fetching collection by id:', error);
        return null;
    }

    return data;
}

type CollectionInput = Omit<Collection, 'id' | 'created_at' | 'products'>;

export async function createCollection(collectionData: CollectionInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('collections').insert([collectionData]);
    if (error) {
        console.error('Error creating collection:', error);
        throw new Error('Failed to create collection.');
    }
    revalidatePath('/admin/collections');
}

export async function updateCollection(id: string, collectionData: Partial<CollectionInput>) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('collections').update(collectionData).eq('id', id).select().single();
    if (error) {
        console.error('Error updating collection:', error);
        throw new Error('Failed to update collection.');
    }
    revalidatePath('/admin/collections');
    revalidatePath(`/admin/collections/${data.id}/edit`);
}

export async function deleteCollection(id: string) {
    const supabase = createSupabaseServerClient();
    // Also need to delete from the join table
    await supabase.from('product_collections').delete().eq('collection_id', id);
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) {
        console.error('Error deleting collection:', error);
        throw new Error('Failed to delete collection.');
    }
    revalidatePath('/admin/collections');
}


export async function addProductToCollection(collectionId: string, productId: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('product_collections')
        .insert({ collection_id: collectionId, product_id: productId });

    if (error) {
        console.error('Error adding product to collection:', error);
        throw new Error('Failed to add product to collection.');
    }
    revalidatePath(`/admin/collections/${collectionId}/edit`);
}

export async function removeProductFromCollection(collectionId: string, productId: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('product_collections')
        .delete()
        .match({ collection_id: collectionId, product_id: productId });
    
    if (error) {
        console.error('Error removing product from collection:', error);
        throw new Error('Failed to remove product from collection.');
    }
    revalidatePath(`/admin/collections/${collectionId}/edit`);
}

// Media Library Functions
export async function getMedia(): Promise<Media[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching media:', error);
        return [];
    }
    return data || [];
}

export async function uploadMedia(formData: FormData): Promise<Media> {
    const supabase = createSupabaseServerClient();
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file provided.');
    }

    const { data: { user } } = await supabase.auth.getUser();

    // Create a unique file path
    const filePath = `public/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage in the 'media' bucket
    const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
            contentType: file.type,
        });
    
    if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Failed to upload file to storage.');
    }

    // Get public URL from the 'media' bucket
    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
    
    if (!publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file.');
    }

    // Insert into media table
    const { data, error: dbError } = await supabase
        .from('media')
        .insert({
            user_id: user?.id,
            file_name: file.name,
            file_path: filePath,
            url: publicUrl,
            content_type: file.type,
        })
        .select()
        .single();
    
    if (dbError) {
        console.error('Database insert error:', dbError);
        // Attempt to delete the file from storage if DB insert fails
        await supabase.storage.from('media').remove([filePath]);
        throw new Error('Failed to save media information to database.');
    }

    revalidatePath('/admin/media');
    return data;
}

export async function deleteMedia(id: string, filePath: string) {
    const supabase = createSupabaseServerClient();

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage.from('media').remove([filePath]);
    if (storageError) {
        console.error("Storage delete error:", storageError);
        throw new Error("Failed to delete file from storage.");
    }
    
    // 2. Delete from database
    const { error: dbError } = await supabase.from('media').delete().eq('id', id);
    if (dbError) {
        console.error("Database delete error:", dbError);
        throw new Error("Failed to delete media record from database.");
    }

    revalidatePath('/admin/media');
}
