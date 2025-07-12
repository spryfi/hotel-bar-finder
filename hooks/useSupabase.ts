'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient, getCurrentUser } from '@/lib/supabase';
import { User } from '@supabase/auth-helpers-nextjs';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Subscribe to auth changes
    const supabase = createSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error };
}

export function useSupabaseRealtime(
  table: string,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createSupabaseClient();
    
    const channel = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table 
        }, 
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}

export function useFavoritesSupabase() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { getUserFavorites } = await import('@/lib/supabase');
      const { data, error } = await getUserFavorites(user.id);
      
      if (error) throw error;
      
      const favoriteIds = data?.map(fav => fav.hotel_id) || [];
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (hotelId: string) => {
    if (!user) return;
    
    try {
      const { addToFavorites } = await import('@/lib/supabase');
      const { error } = await addToFavorites(user.id, hotelId);
      
      if (error) throw error;
      
      setFavorites(prev => [...prev, hotelId]);
    } catch (err) {
      console.error('Error adding favorite:', err);
    }
  };

  const removeFavorite = async (hotelId: string) => {
    if (!user) return;
    
    try {
      const { removeFromFavorites } = await import('@/lib/supabase');
      const { error } = await removeFromFavorites(user.id, hotelId);
      
      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== hotelId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite: (hotelId: string) => favorites.includes(hotelId),
    refreshFavorites
  };
}