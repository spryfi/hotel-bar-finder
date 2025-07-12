'use client';

import { useState, useCallback } from 'react';
import { Hotel, SearchFilters, SearchMode } from '@/lib/types';
import { searchHotels } from '@/lib/api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    openNow: false,
    happyHour: false,
    servesFood: false,
    rooftop: false,
    liveMusic: false,
    outdoorSeating: false,
    barType: '',
    sortBy: 'distance'
  });
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (
    searchQuery: any
  ) => {
    if (!searchQuery.query && searchQuery.mode === 'city') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchHotels(searchQuery);
      setResults(result);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search hotels. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
    setFilters({
      openNow: false,
      happyHour: false,
      servesFood: false,
      rooftop: false,
      liveMusic: false,
      outdoorSeating: false,
      barType: '',
      sortBy: 'distance'
    });
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    hasSearched,
    performSearch,
    clearSearch
  };
}