
'use server';

import type { Product, BlogPost, TeamMember, Order, OrderWithItems, Category, ProductReview, Banner, UserProfile, Settings, PageContent, Collection, CartItem, FullOrderForEmail, Media, PageSeo, Testimonial, EmailTemplate, WishlistItem } from "@/types";
import { createSupabaseServerClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/generic-notification-email";
import GenericNotificationEmail from "@/components/emails/generic-notification-email";
import Razorpay from "razorpay";


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


type ProductInput = Omit<Product, 'id' | 'imageUrl' | 'reviews' | 'category' | 'created_at'>;

export async function createProduct(productData: ProductInput) {
    const supabase = createSupabaseServerClient();
    const { imageUrls, ...mainProductData } = productData;
    
    const { data: newProduct, error } = await supabase.from('products').insert([mainProductData]).select().single();

    if (error || !newProduct) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product.');
    }

    if (imageUrls && imageUrls.length > 0) {
        const productImages = imageUrls.map(url => ({
            product_id: newProduct.id,
            image_url: url
        }));
        const { error: imageError } = await supabase.from('product_images').insert(productImages);
        if (imageError) {
            console.error('Error adding product gallery images:', imageError);
            // Optionally, rollback product creation or log the issue
        }
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return newProduct;
}

export async function updateProduct(id: string, productData: Partial<ProductInput>) {
    const supabase = createSupabaseServerClient();
    const { imageUrls, ...mainProductData } = productData;

    const { data, error } = await supabase.from('products').update(mainProductData).eq('id', id).select().single();

    if (error || !data) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product.');
    }
    
    // First, remove all existing gallery images for this product
    const { error: deleteError } = await supabase.from('product_images').delete().eq('product_id', id);
    if (deleteError) {
        console.error("Failed to clear existing product gallery:", deleteError);
        throw new Error("Failed to update product gallery.");
    }
    
    // Then, insert the new ones if they exist
    if (imageUrls && imageUrls.length > 0) {
        const productImages = imageUrls.map(url => ({
            product_id: id,
            image_url: url
        }));
        const { error: imageError } = await supabase.from('product_images').insert(productImages);
        if (imageError) {
            console.error('Error adding new product gallery images:', imageError);
             throw new Error("Failed to update product gallery images.");
        }
    }


    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${data.slug}/edit`);
    revalidatePath('/shop');
    revalidatePath(`/shop/${data.slug}`);

    return data;
}

export async function deleteProduct(id: string) {
    const supabase = createSupabaseServerClient();
    // Deleting the product will cascade and delete related product_images due to the foreign key constraint
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
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (error || !data) {
        console.error('Error fetching category by id:', error);
        return null;
    }
    return data;
}

type CategoryInput = Omit<Category, 'id' | 'created_at'>;

export async function createCategory(categoryData: CategoryInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('categories').insert([categoryData]);
    if (error) {
        console.error('Error creating category:', error);
        throw new Error('Failed to create category.');
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/*/edit');
}

export async function updateCategory(id: string, categoryData: Partial<CategoryInput>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('categories').update(categoryData).eq('id', id);
    if (error) {
        console.error('Error updating category:', error);
        throw new Error('Failed to update category.');
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/*/edit');
}

export async function deleteCategory(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
        console.error('Error deleting category:', error);
        throw new Error('Failed to delete category.');
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/*/edit');
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
    customer_phone: string;
    total: number;
    shipping_fee: number;
    items: CartItem[];
    user_id?: string | null;
}

async function createShiprocketOrder(order: Order, items: CartItem[], phone: string) {
    try {
        const shiprocketEmail = process.env.SHIPROCKET_EMAIL;
        const shiprocketPassword = process.env.SHIPROCKET_PASSWORD;

        if (!shiprocketEmail || !shiprocketPassword) {
            console.warn("Shiprocket credentials not found. Skipping shipment creation.");
            return;
        }

        // 1. Authenticate with Shiprocket
        const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: shiprocketEmail, password: shiprocketPassword }),
        });

        if (!authResponse.ok) {
            throw new Error(`Shiprocket auth failed: ${authResponse.statusText}`);
        }

        const { token } = await authResponse.json();

        // 2. Format order details for Shiprocket
        const orderItems = items.map(item => ({
            name: item.name,
            sku: item.id.substring(0, 20), // SKU must be max 20 chars
            units: item.quantity,
            selling_price: item.price,
        }));
        
        const supabase = createSupabaseServerClient();
        const {data: userProfile} = await supabase.from('users').select('shipping_address').eq('id', order.user_id!).single();
        if(!userProfile || !userProfile.shipping_address) {
            throw new Error('Shipping address not found for user');
        }

        const payload = {
            order_id: order.id,
            order_date: new Date(order.created_at).toISOString().split('T')[0],
            billing_customer_name: order.customer_name,
            billing_last_name: "", // Shiprocket requires this field
            billing_address: userProfile.shipping_address.street,
            billing_city: userProfile.shipping_address.city,
            billing_pincode: userProfile.shipping_address.postal_code,
            billing_state: userProfile.shipping_address.state,
            billing_country: userProfile.shipping_address.country,
            billing_email: order.customer_email,
            billing_phone: phone,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: "Prepaid",
            sub_total: order.total,
            length: 10, // Placeholder dimensions
            breadth: 10,
            height: 10,
            weight: 0.5, // Placeholder weight in kg
        };

        // 3. Create shipment
        const createOrderResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!createOrderResponse.ok) {
            const errorBody = await createOrderResponse.json();
            console.error("Shiprocket order creation failed:", errorBody);
            throw new Error(`Shiprocket order creation failed: ${JSON.stringify(errorBody.errors)}`);
        }

        const shiprocketData = await createOrderResponse.json();
        console.log("Shiprocket order created successfully:", shiprocketData);

    } catch (error) {
        console.error("Error creating Shiprocket shipment:", error);
        // Do not re-throw the error, as we don't want to fail the entire customer order process
        // if shipping integration fails. Just log it for manual follow-up.
    }
}


export async function createOrder(orderData: NewOrder): Promise<string> {
    const supabase = createSupabaseServerClient();
    
    // First, check inventory for all items
    for (const item of orderData.items) {
        const { error } = await supabase.rpc('decrement_product_inventory', {
            p_product_id: item.id,
            p_quantity: item.quantity
        });

        if (error) {
            console.error('Error decrementing inventory:', error);
            // The RPC function raises an exception which is caught here.
            // We can make the error message more user-friendly.
            if (error.message.includes('Not enough stock')) {
                throw new Error(`Sorry, ${item.name} is out of stock. Please remove it from your cart and try again.`);
            }
            throw new Error('There was a problem with product inventory.');
        }
    }

    // If all inventory checks pass, proceed to create the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            total: orderData.total,
            shipping_fee: orderData.shipping_fee,
            status: 'Processing',
            user_id: orderData.user_id
        })
        .select('id, created_at, user_id, customer_name, customer_email, total')
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        // Here you would ideally have a way to rollback the inventory decrements.
        // For simplicity, we'll proceed but in a real-world app, a transaction across all operations is needed.
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
        // Rollback order creation if items fail
        await supabase.from('orders').delete().eq('id', orderId);
        // Note: inventory is not rolled back here. A full transactional function in SQL is the robust solution.
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
                react: GenericNotificationEmail({
                    siteName: settings?.site_name || 'Sundaraah Showcase',
                    subject: 'Your Sundaraah Order Confirmation',
                    bodyContent: `<p>Thank you for your order! Your order ID is ${orderId}.</p>`
                }),
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
    } else {
        console.warn("RESEND_API_KEY is not set. Skipping order confirmation email.");
    }
    
    // Create Shiprocket order in the background
    createShiprocketOrder(order, orderData.items, orderData.customer_phone);

    revalidatePath('/admin/orders');
    revalidatePath('/admin/products'); // Revalidate products to show new inventory
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
    
    const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

    if (error || !updatedOrder) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status.');
    }

    // If the order is fulfilled, trigger the notification email
    if (status === 'Fulfilled') {
        const eventTrigger = 'order_status_fulfilled';
        const { data: template } = await supabase
            .from('email_templates')
            .select('*')
            .eq('event_trigger', eventTrigger)
            .eq('is_active', true)
            .single();
        
        if (template) {
            await sendTemplatedEmail(template, updatedOrder);
        }
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

export async function getReviews(): Promise<ProductReview[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('product_reviews')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data.map(r => ({
        ...r,
        product_name: r.products?.name || 'Unknown Product'
    })) || [];
}

export async function deleteReview(id: string) {
    const supabase = createSupabaseServerClient();

    // To revalidate the product page, we need its slug.
    const { data: reviewData } = await supabase
        .from('product_reviews')
        .select('products(slug)')
        .eq('id', id)
        .single();

    const { error } = await supabase.from('product_reviews').delete().eq('id', id);

    if (error) {
        console.error('Error deleting review:', error);
        throw new Error('Failed to delete review.');
    }

    revalidatePath('/admin/reviews');
    if (reviewData?.products?.slug) {
        revalidatePath(`/shop/${reviewData.products.slug}`);
    }
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

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return data;
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

export async function updateUserProfile(userId: string, profileData: Partial<Omit<UserProfile, 'id' | 'email' | 'user_role'>>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId);

    if (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile.');
    }

    revalidatePath('/account');
}


// Settings Functions
export async function getSettings(): Promise<Settings> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    
    if (error || !data) {
        console.error('Error fetching settings:', error);
        // Provide sensible defaults if the settings row doesn't exist yet
        return { 
            id: 1,
            site_name: 'Sundaraah Showcase',
            header_logo_url: null,
            footer_logo_url: null,
            copyright_text: null,
            theme_colors: {
                primary: "hsl(347 65% 25%)",
                background: "hsl(30 50% 98%)",
                accent: "hsl(45 85% 55%)",
            },
            theme_fonts: {
                body: "PT Sans",
                headline: "Playfair Display",
            },
            whatsapp_number: null,
            whatsapp_enabled: true,
            shipping_fee: 50,
            free_shipping_threshold: 500,
            preloader_enabled: true,
            social_twitter_url: "#",
            social_twitter_enabled: true,
            social_facebook_url: "#",
            social_facebook_enabled: true,
            social_instagram_url: "#",
            social_instagram_enabled: true,
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
    
    // Check if the entry exists
    const { data: existing, error: selectError } = await supabase
        .from('page_content')
        .select('id')
        .match({ page, section })
        .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = 'single row not found'
        console.error(`Error checking for existing page content:`, selectError);
        throw new Error('Failed to check for page content.');
    }

    if (existing) {
        // Update existing entry
        const { error } = await supabase
            .from('page_content')
            .update({ content })
            .match({ page, section });
        
        if (error) {
            console.error(`Error updating content for ${page}.${section}:`, error);
            throw new Error('Failed to update page content.');
        }
    } else {
        // Insert new entry
        const { error } = await supabase
            .from('page_content')
            .insert({ page, section, content });

        if (error) {
            console.error(`Error inserting content for ${page}.${section}:`, error);
            throw new Error('Failed to insert page content.');
        }
    }
    
    revalidatePath('/', 'layout'); // Revalidate the whole site
}

// Page SEO Functions
export async function getPageSeo(pageIdentifier: string): Promise<PageSeo | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_identifier', pageIdentifier)
        .single();
    if (error) {
        console.error(`Error fetching SEO for page "${pageIdentifier}":`, error);
        return null;
    }
    return data;
}

export async function updatePageSeo(pageIdentifier: string, seoData: Partial<Omit<PageSeo, 'id' | 'page_identifier'>>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('pages')
        .update(seoData)
        .eq('page_identifier', pageIdentifier);
    if (error) {
        console.error(`Error updating SEO for page "${pageIdentifier}":`, error);
        throw new Error('Failed to update page SEO.');
    }
    revalidatePath(`/admin/seo/${pageIdentifier}`);
    revalidatePath(`/${pageIdentifier}`); // Revalidate public page
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

export async function uploadMedia(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No file provided.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be logged in to upload media.');
  }

  const filePath = `public/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error('Failed to upload file to storage.');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);
  
  if (!publicUrl) {
    throw new Error('Failed to get public URL for the uploaded file.');
  }

  const { error: dbError } = await supabase
    .from('media')
    .insert({
      user_id: user?.id,
      file_name: file.name,
      file_path: filePath,
      url: publicUrl,
      content_type: file.type,
    });
  
  if (dbError) {
    console.error('Database insert error:', dbError);
    // Attempt to clean up the orphaned file in storage
    await supabase.storage.from('media').remove([filePath]);
    throw new Error('Failed to save media information to database.');
  }

  revalidatePath('/admin/media');
}


export async function deleteMedia(id: string, filePath: string) {
    const supabase = createSupabaseServerClient();

    const { error: storageError } = await supabase.storage.from('media').remove([filePath]);
    if (storageError) {
        console.error("Storage delete error:", storageError);
        throw new Error("Failed to delete file from storage.");
    }
    
    const { error: dbError } = await supabase.from('media').delete().eq('id', id);
    if (dbError) {
        console.error("Database delete error:", dbError);
        throw new Error("Failed to delete media record from database.");
    }

    revalidatePath('/admin/media');
}

// Testimonial Functions
export async function getTestimonials(onlyActive = false): Promise<Testimonial[]> {
    const supabase = createSupabaseServerClient();
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (onlyActive) {
        query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return data || [];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
    if (error || !data) {
        console.error('Error fetching testimonial by id:', error);
        return null;
    }
    return data;
}

type TestimonialInput = Omit<Testimonial, 'id' | 'created_at'>;

export async function createTestimonial(testimonialData: TestimonialInput) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('testimonials').insert([testimonialData]);
    if (error) {
        console.error('Error creating testimonial:', error);
        throw new Error('Failed to create testimonial.');
    }
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

export async function updateTestimonial(id: string, testimonialData: Partial<TestimonialInput>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('testimonials').update(testimonialData).eq('id', id);
    if (error) {
        console.error('Error updating testimonial:', error);
        throw new Error('Failed to update testimonial.');
    }
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

export async function deleteTestimonial(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) {
        console.error('Error deleting testimonial:', error);
        throw new Error('Failed to delete testimonial.');
    }
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

// Email Functions
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('email_templates').select('*').order('name');
    if (error) {
        console.error('Error fetching email templates:', error);
        return [];
    }
    return data || [];
}

export async function getEmailTemplateById(id: number): Promise<EmailTemplate | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('email_templates').select('*').eq('id', id).single();
    if (error || !data) {
        console.error('Error fetching email template by id:', error);
        return null;
    }
    return data;
}

export async function updateEmailTemplate(id: number, templateData: Partial<Omit<EmailTemplate, 'id' | 'created_at'>>) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('email_templates').update(templateData).eq('id', id);
    if (error) {
        console.error('Error updating email template:', error);
        throw new Error('Failed to update email template.');
    }
    revalidatePath('/admin/emails');
}

async function sendTemplatedEmail(template: EmailTemplate, order: Order) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.warn("RESEND_API_KEY is not set. Skipping templated email.");
        return;
    }

    try {
        const resend = new Resend(resendApiKey);
        const settings = await getSettings();
        const siteName = settings?.site_name || 'Sundaraah Showcase';
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

        // Replace placeholders
        let subject = template.subject.replace(/{{site_name}}/g, siteName);
        let body = template.body
            .replace(/{{customer_name}}/g, order.customer_name)
            .replace(/{{order_id}}/g, order.id.substring(0, 8).toUpperCase())
            .replace(/{{order_url}}/g, `${baseUrl}/account/orders/${order.id}`)
            .replace(/{{site_name}}/g, siteName);

        await resend.emails.send({
            from: `"${siteName}" <noreply@sundaraah.com>`,
            to: [order.customer_email],
            subject: subject,
            react: GenericNotificationEmail({
                siteName,
                subject,
                bodyContent: body,
            }),
        });
    } catch (emailError) {
        console.error(`Email sending failed for event ${template.event_trigger}:`, emailError);
    }
}

// Razorpay Integration
export async function createRazorpayOrder(options: { amount: number; currency: string; }) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are not configured.');
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const order = await razorpay.orders.create({
            amount: options.amount * 100, // Amount in the smallest currency unit (paise for INR)
            currency: options.currency,
            receipt: `receipt_order_${new Date().getTime()}`,
        });

        return {
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID,
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error('Could not create payment order.');
    }
}

// Wishlist Functions
export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
            id,
            user_id,
            product_id,
            created_at,
            product:products (
                *,
                category:categories (name)
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching wishlist items:', error);
        return [];
    }
    
    // Transform the data to match the WishlistItem type structure
    return data.map((item: any) => ({
        ...item,
        product: {
            ...item.product,
            category: item.product.category.name,
            imageUrl: item.product.image_url || 'https://placehold.co/600x600.png',
            imageUrls: [],
            reviews: [],
        }
    }));
}


export async function addToWishlist(userId: string, productId: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: userId, product_id: productId });
    
    if (error) {
        // Ignore unique constraint violation error (already in wishlist)
        if (error.code === '23505') return;
        console.error('Error adding to wishlist:', error);
        throw new Error('Failed to add item to wishlist.');
    }
    revalidatePath('/wishlist');
}

export async function removeFromWishlist(userId: string, productId: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .match({ user_id: userId, product_id: productId });

    if (error) {
        console.error('Error removing from wishlist:', error);
        throw new Error('Failed to remove item from wishlist.');
    }
    revalidatePath('/wishlist');
}

export async function getWishlistAnalytics(): Promise<Product[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc('get_wishlist_counts');
    
    if (error) {
        console.error('Error fetching wishlist analytics:', error);
        return [];
    }

    return data.map((p: any) => ({
        ...p,
        imageUrl: p.image_url || 'https://placehold.co/600x600.png',
        category: p.category_name,
        imageUrls: [],
        reviews: []
    }));
}
