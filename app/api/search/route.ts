import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const mode = searchParams.get('mode') || 'city';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = parseInt(searchParams.get('radius') || '50');
  
  // Parse filters
  const filters = {
    openNow: searchParams.get('openNow') === 'true',
    happyHour: searchParams.get('happyHour') === 'true',
    servesFood: searchParams.get('servesFood') === 'true',
    rooftop: searchParams.get('rooftop') === 'true',
    liveMusic: searchParams.get('liveMusic') === 'true',
    outdoorSeating: searchParams.get('outdoorSeating') === 'true',
    barType: searchParams.get('barType') || '',
    sortBy: searchParams.get('sortBy') || 'distance'
  };

  if (!query && mode === 'city') {
    return NextResponse.json(
      { error: 'Query parameter is required for city search' },
      { status: 400 }
    );
  }

  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    let hotelQuery = supabase
      .from('hotels')
      .select('*')
      .eq('has_bar', true);

    // Apply location filtering
    if (mode === 'city' && query) {
      const searchTerm = query.toLowerCase();
      if (searchTerm.includes('new york')) {
        hotelQuery = hotelQuery.eq('city', 'New York');
      } else if (searchTerm.includes('los angeles')) {
        hotelQuery = hotelQuery.eq('city', 'Los Angeles');
      } else if (searchTerm.includes('chicago')) {
        hotelQuery = hotelQuery.eq('city', 'Chicago');
      }
    }

    const { data: hotels, error } = await hotelQuery.limit(50);
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Get bars for all hotels
    const hotelIds = hotels?.map(hotel => hotel.id) || [];
    let allBars: any[] = [];
    
    if (hotelIds.length > 0) {
      const { data: barsData, error: barsError } = await supabase
        .from('bars')
        .select('*')
        .in('hotel_id', hotelIds);
      
      if (barsError) {
        console.warn('Bars query error:', barsError);
      } else {
        allBars = barsData || [];
      }
    }

    // Attach bars to hotels
    const hotelsWithBars = hotels?.map(hotel => ({
      ...hotel,
      bars: allBars.filter(bar => bar.hotel_id === hotel.id) || []
    })) || [];

    // Calculate distances for nearby search
    if (mode === 'nearby' && lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      hotelsWithBars.forEach(hotel => {
        if (hotel.latitude && hotel.longitude) {
          const distance = calculateDistance(
            userLat,
            userLng,
            hotel.latitude,
            hotel.longitude
          );
          (hotel as any).distance = distance;
        }
      });
    }

    // Apply sorting
    hotelsWithBars.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return ((a as any).distance || 0) - ((b as any).distance || 0);
        case 'rating':
          return (b.star_rating || 0) - (a.star_rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return NextResponse.json({
      hotels: hotelsWithBars,
      totalCount: hotelsWithBars.length,
      searchTime: Date.now()
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    );
  }
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: NextRequest) {
  // Handle advanced search with complex filters
  const body = await request.json();
  
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Use the custom search function for complex queries
    const { data, error } = await supabase.rpc('search_hotels_with_bars', {
      search_query: body.query || '',
      lat: body.location?.lat,
      lng: body.location?.lng,
      radius_miles: body.radius || 50,
      bar_filters: body.filters || {}
    });

    if (error) throw error;

    return NextResponse.json({
      hotels: data || [],
      totalCount: data?.length || 0,
      searchTime: Date.now()
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform advanced search' },
      { status: 500 }
    );
  }
}