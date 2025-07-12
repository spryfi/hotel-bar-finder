'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HeartIcon, 
  MapPinIcon, 
  PhoneIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Hotel, Bar } from '@/lib/types';
import { formatDistance, formatTime, getBarStatus, getHappyHourStatus } from '@/lib/utils';
import { useFavorites } from '@/hooks/useLocalStorage';

// Visual Hours Display Component
function HoursDisplay({ bar }: { bar: any }) {
  const barStatus = getBarStatus(bar.hours);
  const happyHourInfo = bar.happy_hour ? getHappyHourStatus(bar.happy_hour) : null;
  
  // Get today's hours
  const now = new Date();
  const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
  const todayHours = bar.hours?.[currentDay];
  
  const kitchenClosesEarly = bar.serves_food && todayHours;
  const kitchenCloseTime = kitchenClosesEarly ? "10:00 PM" : null; // Default kitchen close time
  
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Bar Hours Today</p>
          <p className={`text-xs font-medium ${
            barStatus?.isOpen ? 'text-green-600' : 'text-red-600'
          }`}>
            {barStatus?.isOpen ? '🟢' : '🔴'} {barStatus?.message || 'Hours unavailable'}
          </p>
          {happyHourInfo && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              🍹 {happyHourInfo}
            </p>
          )}
        </div>
        <div className="text-2xl">🍸</div>
      </div>
      
      {bar.serves_food && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Kitchen Hours</p>
              <p className="text-xs text-gray-600">
                {kitchenCloseTime ? `🍽️ Last orders at ${kitchenCloseTime}` : '🍽️ Full menu available'}
              </p>
            </div>
            <div className="text-lg">🍽️</div>
          </div>
        </div>
      )}
      
      {/* Priority Status Row */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${barStatus?.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
            {barStatus?.isOpen ? '✅ Open Now' : '❌ Currently Closed'}
          </span>
          <span className="text-gray-600">
            {bar.serves_food ? '🍽️ Full Menu' : '🥜 Bar Snacks'}
          </span>
        </div>
      </div>
    </div>
  );
}

interface HotelCardProps {
  hotel: Hotel;
  bars?: any[]; // Bar data from the joined query
  distance?: number;
  showDistance?: boolean;
}

export default function HotelCard({ hotel, bars, distance, showDistance = false }: HotelCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  
  const isFavorite = favorites.includes(hotel.id);
  
  // Get primary bar (first bar or main one)
  const primaryBar = bars && bars.length > 0 ? bars[0] : null;
  const barStatus = primaryBar ? getBarStatus(primaryBar.hours) : null;
  const happyHourInfo = primaryBar?.happy_hour ? getHappyHourStatus(primaryBar.happy_hour) : null;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      removeFavorite(hotel.id);
    } else {
      addFavorite(hotel.id);
    }
  };

  const openDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    const address = `${hotel.address}, ${hotel.city}, ${hotel.state}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const callHotel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hotel.phone) {
      window.location.href = `tel:${hotel.phone}`;
    }
  };

  const shareHotel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      const barName = primaryBar?.name || 'their bar';
      navigator.share({
        title: `${hotel.name} - Hotel Bar Finder`,
        text: `Check out ${hotel.name} with ${barName} in ${hotel.city}`,
        url: window.location.origin + `/hotels/${hotel.id}`
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/hotels/${hotel.id}`);
      alert('Link copied to clipboard!');
    }
  };

  // Generate status badges
  const badges = [
    { text: 'Has Bar', color: 'bg-[var(--accent-500)]' },
    ...(primaryBar && primaryBar.serves_food 
      ? [{ text: 'Full Menu', color: 'bg-green-500' }]
      : [{ text: 'Bar Snacks', color: 'bg-orange-500' }]
    )
  ];
  
  // Add star rating badge if available
  if (hotel.star_rating) {
    badges.push({ 
      text: `${hotel.star_rating} Star`, 
      color: 'bg-blue-500' 
    });
  }

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-hover">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-200">
          {!imageError ? (
            <img
              src={`https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600`}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)]">
              <div className="text-white text-4xl">🏨</div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}
              >
                {badge.text}
              </span>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Hotel Info */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {hotel.name}
                </h3>
                {hotel.brand && (
                  <p className="text-sm text-gray-500">{hotel.brand}</p>
                )}
              </div>
              {hotel.star_rating && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {'★'.repeat(hotel.star_rating)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">
                {hotel.address}, {hotel.city}, {hotel.state}
              </span>
            </div>

            {showDistance && distance && (
              <div className="text-sm text-gray-600">
                📍 {formatDistance(distance)} away
              </div>
            )}
            
            {/* Bar Status */}
            {barStatus && (
              <div className={`flex items-center text-sm mt-2 ${
                barStatus.isOpen ? 'text-green-600' : 'text-red-600'
              }`}>
                <ClockIcon className="w-4 h-4 mr-1" />
                <span className="mr-1">{barStatus.isOpen ? '🟢' : '🔴'}</span>
                {barStatus.message}
              </div>
            )}
          </div>

          {/* Bar Details */}
          {/* Visual Hours Display */}
          {primaryBar && (
            <div className="border-t border-gray-100 pt-4 mb-4">
              <HoursDisplay bar={primaryBar} />
            </div>
          )}
          
          {/* Contact Info */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            
            {hotel.phone && (
              <div className="text-sm text-gray-600 mt-1">
                📞 {hotel.phone}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link 
              href={`/hotels/${hotel.id}`}
              className="flex-1 py-2 px-4 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-medium rounded-lg transition-colors duration-200 text-center"
            >
              View Details
            </Link>
            
            <button
              onClick={openDirections}
              className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
            >
              <MapPinIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            {hotel.phone && (
              <button
                onClick={callHotel}
                className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
              >
                <PhoneIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <button
              onClick={shareHotel}
              className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
            >
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}