'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';
import HotelList from '@/components/hotels/HotelList';
import SearchFilters from '@/components/search/SearchFilters';
import { Hotel, SearchMode, SearchFilters as SearchFiltersType } from '@/lib/types';
import { searchHotels } from '@/lib/api';
import { useSearch } from '@/hooks/useSearch';

export default function HomePage() {
  console.log('🚀 HomePage component is rendering');
  console.log('🚀 App is running - HomePage component loaded');
  
  const [searchMode, setSearchMode] = useState<SearchMode>('nearby');
  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    hasSearched,
    performSearch
  } = useSearch();

  // Test function to fetch hotels from Supabase
  const testSupabaseConnection = async () => {
    console.log('🔍 Testing Supabase connection...');
    
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('has_bar', true)
        .limit(10);

      if (error) {
        console.error('❌ Query error:', error);
      } else {
        console.log('✅ Hotels found:', data.length);
        console.log('🏨 First hotel:', data[0]);
      }
      
      return data || [];
    } catch (err) {
      console.error('💥 Failed to fetch hotels:', err);
      throw err;
    }
  };

  // Handle search mode toggle
  const handleSearchModeChange = (mode: SearchMode) => {
    console.log('🔄 Search mode changed to:', mode);
    setSearchMode(mode);
  };

  const handleSearch = async (searchQuery: string) => {
    console.log('🔍 handleSearch called with:', { 
      searchQuery, 
      searchMode,
      timestamp: new Date().toISOString()
    });
    setQuery(searchQuery);
    
    // Test Supabase connection when "Find Nearby" is clicked
    if (searchMode === 'nearby') {
      console.log('🧪 Starting Supabase connection test...');
      try {
        const hotels = await testSupabaseConnection();
        console.log('✅ Supabase test completed successfully!');
        console.log(`📊 Test results: Found ${hotels.length} hotels in database`);
      } catch (error) {
        console.error('❌ Supabase test failed:', error);
        console.log('🔧 Make sure your .env.local file has correct Supabase credentials');
      }
    }
    
    console.log('🎯 Proceeding with search execution...');
    
    // Create search query object
    const searchQueryObj = {
      mode: searchMode,
      query: searchQuery,
      city: searchMode === 'city' ? searchQuery.split(',')[0].trim() : null,
      filters: filters
    };
    
    await performSearch(searchQueryObj);
    console.log('✅ Search execution completed');
  };

  const handleFiltersChange = async (newFilters: SearchFiltersType) => {
    console.log('🎛️ Filters changed:', newFilters);
    setFilters(newFilters);
    if (hasSearched) {
      const searchQueryObj = {
        mode: searchMode,
        query: query,
        city: searchMode === 'city' ? query.split(',')[0].trim() : null,
        filters: newFilters
      };
      await performSearch(searchQueryObj);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-700)]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-playfair">
            Never Check Into a 
            <span className="text-gradient block mt-2">Dry Hotel</span>
            Again
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover hotels with exceptional bars, lounges, and rooftop experiences. 
            Perfect for business travelers and cocktail enthusiasts.
          </p>
          
          {/* Search Interface */}
          <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button
                onClick={() => handleSearchModeChange('nearby')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  searchMode === 'nearby'
                    ? 'bg-[var(--accent-500)] text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                📍 Near Me
              </button>
              <button
                onClick={() => handleSearchModeChange('city')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  searchMode === 'city'
                    ? 'bg-[var(--accent-500)] text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                🔍 By City
              </button>
            </div>
            
            <SearchBar
              mode={searchMode}
              onSearch={handleSearch}
              initialValue={query}
              loading={loading}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(hasSearched || loading) && (
        <section className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              resultCount={results.length}
            />
            
            <HotelList
              hotels={results}
              loading={loading}
              error={error}
              searchMode={searchMode}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}