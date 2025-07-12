'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { SearchMode } from '@/lib/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface SearchBarProps {
  mode: SearchMode;
  onSearch: (query: string) => void;
  initialValue?: string;
  loading?: boolean;
}

export default function SearchBar({ mode, onSearch, initialValue = '', loading = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const placeholder = mode === 'nearby' 
    ? 'Allow location access to find nearby hotels...' 
    : 'Enter city name (e.g., New York, Los Angeles)';

  const icon = mode === 'nearby' 
    ? <MapPinIcon className="w-5 h-5" />
    : <MagnifyingGlassIcon className="w-5 h-5" />;

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Mock city suggestions - in real app, this would be an API call
  useEffect(() => {
    if (mode === 'city' && query.length > 2) {
      const cities = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
        'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
        'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
      ];
      
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'nearby') {
      console.log('🎯 Find Nearby clicked!', { searchMode: mode });
    }
    
    if (mode === 'nearby') {
      console.log('🎯 Find Nearby clicked!');
      console.log('📍 Current search mode:', mode);
    } else {
      console.log('🚀 SearchBar handleSubmit called with:', { mode, query });
    }
    
    if (mode === 'nearby') {
      console.log('🔄 Requesting geolocation...');
      // Request geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('✅ Geolocation success:', position.coords);
            console.log('🧪 Running Supabase test...');
            onSearch(`${position.coords.latitude},${position.coords.longitude}`);
          },
          (error) => {
            console.error('❌ Geolocation error:', error);
            alert('Unable to access your location. Please try searching by city instead.');
          }
        );
      } else {
        console.error('❌ Geolocation not supported');
        alert('Geolocation is not supported by this browser. Please try searching by city instead.');
      }
    } else {
      console.log('🏙️ City search with query:', query);
      onSearch(query);
    }
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('💡 Suggestion clicked:', suggestion);
    setQuery(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          {loading ? <LoadingSpinner size="sm" /> : icon}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={mode === 'nearby' || loading}
          className="w-full pl-12 pr-24 py-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
        />
        
        <button
          type="submit"
          disabled={loading || (mode === 'city' && query.length < 2)}
          className="absolute inset-y-0 right-0 px-6 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] disabled:bg-gray-400 text-white font-medium rounded-r-xl transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {mode === 'nearby' ? 'Find Nearby' : 'Search'}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}