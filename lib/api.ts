import { supabase } from './supabase';

export interface SearchFilters {
  openNow?: boolean;
  happyHour?: boolean;
  servesFood?: boolean;
  barType?: string;
}

export async function searchHotels(
  query: string,
  mode: 'nearby' | 'city',
  filters: SearchFilters = {}
) {
  console.log('🔍 searchHotels called with:', { query, mode, filters });
  
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*, bars(*)')
      .eq('has_bar', true)
      .limit(20);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} hotels`);
    return data || [];
    
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function getHotelById(id: string) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getBarsByHotelId(hotelId: string) {
  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .eq('hotel_id', hotelId);
  
  if (error) throw error;
  return data || [];
}