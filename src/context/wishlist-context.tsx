
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getWishlistItems, addToWishlist, removeFromWishlist } from '@/lib/data';
import type { WishlistItem } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isUpdatingWishlist: boolean;
  toggleWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();

  const fetchWishlist = useCallback(async (userId: string) => {
    setIsLoading(true);
    const items = await getWishlistItems(userId);
    setWishlist(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        fetchWishlist(currentUser.id);
      } else {
        setWishlist([]);
        setIsLoading(false);
      }
    });

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
        if(user) {
            setUser(user);
            fetchWishlist(user.id);
        } else {
            setIsLoading(false);
        }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You must be logged in to manage your wishlist.",
      });
      return;
    }

    setIsUpdatingWishlist(true);
    const isInWishlist = wishlist.some(item => item.product_id === productId);

    try {
      if (isInWishlist) {
        await removeFromWishlist(user.id, productId);
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
        toast({ title: "Removed from wishlist." });
      } else {
        await addToWishlist(user.id, productId);
        // We optimistically add, but a full refetch ensures data consistency
        await fetchWishlist(user.id); 
        toast({ title: "Added to wishlist!" });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem updating your wishlist.",
        });
    } finally {
        setIsUpdatingWishlist(false);
    }
  };

  const value = {
    wishlist,
    isLoading,
    isUpdatingWishlist,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
