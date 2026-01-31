// Block Share App v2.0 - Food Collective Types
// The Beef Community Collective and future food programs

export type SubscriptionTier = 'family' | 'gathering' | 'celebration';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type GiveOrGetChoice = 'keep' | 'give' | 'pending';

export interface FoodCollective {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  heroImageUrl?: string;
  
  // Philosophy
  philosophy: {
    title: string;
    description: string;
  }[];
  
  // Four Pillars (for Beef Collective)
  pillars: {
    icon: string;
    title: string;
    description: string;
  }[];
  
  // Pricing
  subscriptionTiers: SubscriptionTierDetails[];
  
  // Delivery
  deliverySchedule: string; // e.g., "Every 2 weeks"
  deliveryAreas: string[];
  
  // Give or Get options
  giveOrGetOptions: FreebieOption[];
  
  isActive: boolean;
  createdAt: Date;
}

export interface SubscriptionTierDetails {
  id: SubscriptionTier;
  name: string;
  price: number; // monthly
  weight: string; // e.g., "6.5kg"
  servings: string; // e.g., "2-3 people"
  savings: string; // e.g., "22%"
  description: string;
  includes: string[];
}

export interface FreebieOption {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: 'broth' | 'spice' | 'tool' | 'kids' | 'other';
}

export interface FoodSubscription {
  id: string;
  userId: string;
  collectiveId: string;
  collectiveName: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  
  // Dates
  startDate: Date;
  nextDelivery?: Date;
  pausedUntil?: Date;
  
  // Current delivery
  currentDelivery?: {
    id: string;
    scheduledDate: Date;
    status: 'upcoming' | 'preparing' | 'delivered';
    contents: string[];
    giveOrGetChoice: GiveOrGetChoice;
    selectedFreebie?: string;
  };
  
  // History
  deliveryHistory: {
    id: string;
    date: Date;
    contents: string[];
    giveOrGetChoice: GiveOrGetChoice;
  }[];
  
  // Stats
  totalDeliveries: number;
  totalSaved: number;
  neighborsHelped: number; // times chose "give"
}

export interface DeliverySchedule {
  id: string;
  collectiveId: string;
  buildingId: string;
  deliveryDate: Date;
  pickupLocation: string;
  pickupInstructions?: string;
  hostId: string;
  
  subscribers: string[]; // user IDs
  confirmedPickups: string[]; // user IDs who confirmed
  
  status: 'scheduled' | 'in_transit' | 'delivered' | 'completed';
}

// The Beef Community Collective data
export const BEEF_COLLECTIVE: FoodCollective = {
  id: 'beef-collective',
  name: 'The Beef Community Collective',
  tagline: 'Farm to Family. Fair for All.',
  description: '100% grass-fed beef at one flat price. Every cut, same price. $14/kg.',
  
  philosophy: [
    { title: 'Food Can Be Fair', description: 'Premium quality shouldn\'t mean premium prices.' },
    { title: 'Everyone Deserves to Eat Well', description: 'Nutritious food is a right, not a privilege.' },
    { title: 'Pricing for Premium Products is Past Its "Best-Before Date"', description: 'The old model of charging more for better cuts doesn\'t serve families.' },
    { title: 'Commerce Can Care for Communities', description: 'Business can build community, not just extract from it.' },
    { title: 'Flat Pricing is Fairer for Families', description: 'Every cut at one price means everyone can enjoy the best.' },
    { title: 'Kitchen Table is Where Communities Begin', description: 'Shared meals build shared futures.' },
  ],
  
  pillars: [
    { icon: '⚖️', title: 'Flat Pricing', description: 'No premiums. Every cut $14/kg.' },
    { icon: '🌾', title: 'FairShare Food', description: 'Farm to family, no middlemen.' },
    { icon: '🤝', title: 'Collective Power', description: 'Prosperity over pricing.' },
    { icon: '❤️', title: 'Caring Commerce', description: 'Food for families first.' },
  ],
  
  subscriptionTiers: [
    {
      id: 'family',
      name: 'Family Table',
      price: 89,
      weight: '6.5kg',
      servings: '2-3 people',
      savings: '22%',
      description: 'Perfect for couples and small families',
      includes: ['Mix of ground, steaks, and roasts', 'Recipe cards', 'Freebie item'],
    },
    {
      id: 'gathering',
      name: 'Gathering',
      price: 149,
      weight: '10.5kg',
      servings: '4-5 people',
      savings: '35%',
      description: 'Ideal for families with kids',
      includes: ['Larger variety of cuts', 'Bulk ground beef', 'Recipe cards', 'Freebie item'],
    },
    {
      id: 'celebration',
      name: 'Celebration',
      price: 249,
      weight: '18kg',
      servings: '5+ people',
      savings: '42%',
      description: 'For large families and entertainers',
      includes: ['Full range of premium cuts', 'Party-size portions', 'Recipe cards', 'Premium freebie'],
    },
  ],
  
  deliverySchedule: 'Every 2 weeks',
  deliveryAreas: ['Vancouver', 'Burnaby', 'Richmond', 'North Vancouver'],
  
  giveOrGetOptions: [
    { id: 'bone-broth', name: 'Artisan Bone Broth', description: 'Rich, slow-simmered beef bone broth', category: 'broth' },
    { id: 'spice-rub', name: 'Signature Spice Rub', description: 'Our house blend for steaks and roasts', category: 'spice' },
    { id: 'meat-thermometer', name: 'Digital Meat Thermometer', description: 'Never overcook again', category: 'tool' },
    { id: 'kids-apron', name: 'Kids Chef Apron', description: 'Get the little ones cooking!', category: 'kids' },
  ],
  
  isActive: true,
  createdAt: new Date('2024-01-01'),
};
