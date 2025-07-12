'use client';

import { Hotel, SearchMode } from '@/lib/types';
import HotelCard from './HotelCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface HotelListProps {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  searchMode: SearchMode;
}

export default function HotelList({ hotels, loading, error, searchMode }: HotelListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍸</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hotels with bars found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search in a different area.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Clear Filters
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map(hotel => {
        return (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            bars={hotel.bars}
            distance={hotel.distance}
            showDistance={searchMode === 'nearby'}
          />
        );
      })}
    </div>
  );
}