// Block Share App v2.0 - Item Types
// Extended categories and pool hierarchy support

export type ItemCategory = 
  // Tier I - Core
  | 'vehicles' | 'bikes' | 'ebikes' | 'tools'
  // Tier II - Lifestyle  
  | 'camping' | 'watercraft' | 'patio' | 'party'
  // Specialized
  | 'emergency' | 'medical'
  // Original (from v1)
  | 'sports' | 'kitchen' | 'garden' | 'furniture' | 'spaces' | 'wanted';

export type ItemCondition = 'excellent' | 'good' | 'fair';

export type ItemStatus = 'available' | 'borrowed' | 'unavailable';

export type PoolType = 'building' | 'block' | 'citywide';

export interface MediaFile {
  id: string;
  uri: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  status: ItemStatus;
  imageUrl?: string;
  media: MediaFile[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  
  // Location
  location: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Pool membership
  poolType: PoolType;
  buildingId?: string;
  blockId?: string;
  
  // Metadata
  createdAt: Date;
  borrowedUntil?: Date;
  tags: string[];
  isWanted?: boolean;
  
  // Rating
  rating?: {
    average: number;
    count: number;
  };
  
  // Computed
  distance?: number; // in kilometers
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  message: string;
  requestedFrom: Date;
  requestedUntil: Date;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'cancelled';
  createdAt: Date;
  respondedAt?: Date;
}

export interface Rating {
  id: string;
  itemId?: string;
  borrowRequestId?: string;
  raterId: string;
  raterName: string;
  ratedUserId: string;
  rating: number; // 1-5
  comment?: string;
  type: 'item' | 'lender' | 'borrower';
  createdAt: Date;
}

export interface Pool {
  id: string;
  name: string;
  type: PoolType;
  buildingId?: string;
  blockId?: string;
  members: string[]; // user IDs
  items: string[]; // item IDs
  hostId?: string;
  createdAt: Date;
  
  // Stats
  totalItems: number;
  totalBorrows: number;
  activeMembers: number;
}
