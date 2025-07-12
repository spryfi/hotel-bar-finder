'use client';

import { SearchFilters as SearchFiltersType } from '@/lib/types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  resultCount: number;
}

export default function SearchFilters({ filters, onFiltersChange, resultCount }: SearchFiltersProps) {
  const filterOptions = [
    { key: 'openNow', label: 'Open Now', icon: '🟢' },
    { key: 'happyHour', label: 'Happy Hour', icon: '🍹' },
    { key: 'servesFood', label: 'Serves Food', icon: '🍽️' },
    { key: 'rooftop', label: 'Rooftop', icon: '🏙️' },
    { key: 'liveMusic', label: 'Live Music', icon: '🎵' },
    { key: 'outdoorSeating', label: 'Outdoor', icon: '🌿' },
  ];

  const barTypes = [
    { value: '', label: 'All Types' },
    { value: 'bar', label: 'Bar' },
    { value: 'lounge', label: 'Lounge' },
    { value: 'rooftop', label: 'Rooftop' },
    { value: 'poolside', label: 'Poolside' },
    { value: 'restaurant_bar', label: 'Restaurant Bar' },
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'name', label: 'Name' },
  ];

  const toggleFilter = (key: keyof SearchFiltersType) => {
    onFiltersChange({
      ...filters,
      [key]: !filters[key]
    });
  };

  const updateBarType = (barType: string) => {
    onFiltersChange({
      ...filters,
      barType
    });
  };

  const updateSortBy = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {resultCount > 0 ? `${resultCount} hotels found` : 'Filters'}
        </h2>
        
        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) => updateSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filterOptions.map(option => (
          <button
            key={option.key}
            onClick={() => toggleFilter(option.key as keyof SearchFiltersType)}
            className={`filter-pill ${
              filters[option.key as keyof SearchFiltersType] 
                ? 'filter-pill-active' 
                : 'filter-pill-inactive'
            }`}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Bar Type Filter */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Bar Type</h3>
        <div className="flex flex-wrap gap-2">
          {barTypes.map(type => (
            <button
              key={type.value}
              onClick={() => updateBarType(type.value)}
              className={`filter-pill ${
                filters.barType === type.value 
                  ? 'filter-pill-active' 
                  : 'filter-pill-inactive'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}