import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)} mi`;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function calculateDistance(
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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function isOpenNow(hours: { open: string; close: string }): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(hours.open.replace(':', ''));
  const closeTime = parseInt(hours.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function isBarOpen(hours: any): boolean {
  if (!hours) return false;
  
  const now = new Date();
  const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
  let currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = hours[currentDay];
  if (!todayHours) return false;
  
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMin;
  let closeTime = closeHour * 60 + closeMin;
  
  // Handle past midnight closing
  if (closeTime < openTime) closeTime += 24 * 60;
  if (currentTime < openTime) currentTime += 24 * 60;
  
  return currentTime >= openTime && currentTime < closeTime;
}

export function getBarStatus(hours: any): { isOpen: boolean; message: string; closingTime?: string } {
  if (!hours) return { isOpen: false, message: 'Hours not available' };
  
  const now = new Date();
  const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
  const todayHours = hours[currentDay];
  
  if (!todayHours) return { isOpen: false, message: 'Closed today' };
  
  const isOpen = isBarOpen(hours);
  
  if (isOpen) {
    const closeTime = formatTime(todayHours.close);
    return { 
      isOpen: true, 
      message: `Open until ${closeTime}`,
      closingTime: closeTime
    };
  } else {
    const openTime = formatTime(todayHours.open);
    return { 
      isOpen: false, 
      message: `Closed - Opens at ${openTime}` 
    };
  }
}

export function getHappyHourStatus(happyHour: any): string | null {
  if (!happyHour) return null;
  
  const now = new Date();
  const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
  
  if (!happyHour.days.includes(currentDay)) return null;
  
  const startTime = formatTime(happyHour.startTime);
  const endTime = formatTime(happyHour.endTime);
  
  return `Happy Hour ${startTime}-${endTime}`;
}