import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type exports for our database
export type Hotel = {
  id: string
  name: string
  brand: string
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  has_bar: boolean
}

export type Bar = {
  id: string
  hotel_id: string
  name: string
  type: string
  serves_food: boolean
  hours: any
  has_happy_hour: boolean
  features: string[]
}