'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('hotel-favorites', []);

  const addFavorite = (hotelId: string) => {
    setFavorites(prev => [...prev.filter(id => id !== hotelId), hotelId]);
  };

  const removeFavorite = (hotelId: string) => {
    setFavorites(prev => prev.filter(id => id !== hotelId));
  };

  const isFavorite = (hotelId: string) => {
    return favorites.includes(hotelId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);

  const addRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search !== query);
      return [query, ...filtered].slice(0, 10); // Keep only last 10
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  };
}