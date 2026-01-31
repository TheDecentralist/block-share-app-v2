// Block Share App v2.0 - Categories
// Extended from original 9 to 16 categories

import { ItemCategory } from '@/types/item';

export const CATEGORIES: { id: ItemCategory; name: string; emoji: string; description: string }[] = [
  // Tier I - Core categories
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', description: 'Cars, vans, trucks' },
  { id: 'bikes', name: 'Bikes', emoji: '🚲', description: 'City, mountain, cargo bikes' },
  { id: 'ebikes', name: 'E-Bikes', emoji: '⚡', description: 'Electric bikes & scooters' },
  { id: 'tools', name: 'Tools', emoji: '🔧', description: 'Power & hand tools' },
  
  // Tier II - Lifestyle categories
  { id: 'camping', name: 'Camping', emoji: '⛺', description: 'Tents, sleeping bags, gear' },
  { id: 'watercraft', name: 'Water', emoji: '🛶', description: 'Kayaks, paddleboards, canoes' },
  { id: 'patio', name: 'Patio', emoji: '🏡', description: 'Outdoor furniture, heaters' },
  { id: 'party', name: 'Party', emoji: '🎉', description: 'Tables, chairs, decorations' },
  
  // Specialized categories
  { id: 'emergency', name: 'Emergency', emoji: '🆘', description: 'First aid, backup power' },
  { id: 'medical', name: 'Medical', emoji: '🏥', description: 'Mobility aids, recovery' },
  
  // Original categories (kept from v1)
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Balls, racquets, fitness' },
  { id: 'kitchen', name: 'Kitchen', emoji: '🍳', description: 'Appliances, cookware' },
  { id: 'garden', name: 'Garden', emoji: '🌱', description: 'Lawn equipment, planters' },
  { id: 'furniture', name: 'Furniture', emoji: '🪑', description: 'Extra chairs, tables' },
  { id: 'spaces', name: 'Spaces', emoji: '🏠', description: 'Storage, parking, workspace' },
  { id: 'wanted', name: 'Wanted', emoji: '🔍', description: 'Items neighbors are seeking' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {} as Record<ItemCategory, typeof CATEGORIES[0]>);

export const CONDITIONS = [
  { id: 'excellent', name: 'Excellent', color: '#27AE60', description: 'Like new' },
  { id: 'good', name: 'Good', color: '#F39C12', description: 'Normal wear' },
  { id: 'fair', name: 'Fair', color: '#E74C3C', description: 'Well used' },
] as const;

export const POOL_TYPES = [
  { id: 'building', name: 'My Building', icon: '🏢', description: 'Items in your building' },
  { id: 'block', name: 'My Block', icon: '🏘️', description: 'Items in your block' },
  { id: 'nearby', name: 'Nearby', icon: '📍', description: 'Items within walking distance' },
] as const;
