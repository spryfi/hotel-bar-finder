export interface Hotel {
  id: string;
  name: string;
  brand?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  starRating?: number;
  distance?: number; // In miles, calculated for nearby searches
}

export interface Bar {
  id: string;
  hotelId: string;
  name?: string; // If different from hotel name
  type: 'bar' | 'lounge' | 'rooftop' | 'poolside' | 'restaurant_bar';
  servesFood: boolean;
  hours: {
    [day: string]: { open: string; close: string; }
  };
  happyHour?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  features: string[]; // 'live_music', 'sports_tv', 'outdoor_seating', etc.
  phoneNumber?: string;
  description?: string;
}

export interface SearchFilters {
  openNow: boolean;
  happyHour: boolean;
  servesFood: boolean;
  rooftop: boolean;
  liveMusic: boolean;
  outdoorSeating: boolean;
  barType: string; // '' for all, or specific type
  sortBy: string; // 'distance', 'rating', 'name'
}

export interface SearchResult {
  hotels: Hotel[];
  totalCount: number;
  searchTime: number;
}

export type SearchMode = 'nearby' | 'city';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export interface FavoriteHotel {
  hotelId: string;
  addedAt: string;
}

// API Response types for future Supabase integration
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}