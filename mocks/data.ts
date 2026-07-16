// Block Share App v2.0 - Mock Data
// Sample data for development and testing

import { User, HostProfile } from '@/types/user';
import { Item, Pool } from '@/types/item';
import { FoodSubscription } from '@/types/food';
import { Vote } from '@/types/vote';
import { BroadcastMessage, Chat } from '@/types/chat';
import { CommunityProject, ReferralCode } from '@/types/referral';

// Current user (mock)
export const MOCK_CURRENT_USER: User = {
  id: 'user-1',
  email: 'sarah@example.com',
  phone: '+1 604-555-0123',
  firstName: 'Sarah',
  lastName: 'Chen',
  isEmailVerified: true,
  isPhoneVerified: true,
  isPremium: true,
  createdAt: new Date('2024-06-15'),
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Love sharing and building community!',
  
  location: 'Vancouver, BC',
  address: {
    street: '123 Main Street',
    city: 'Vancouver',
    state: 'BC',
    postalCode: 'V6B 1A1',
    country: 'Canada',
    fullAddress: '123 Main Street, Vancouver, BC V6B 1A1',
    coordinates: { latitude: 49.2827, longitude: -123.1207 },
    isVerified: true,
  },
  
  buildingId: 'building-1',
  buildingName: 'The Gardens',
  blockId: 'block-1',
  blockNumber: '1234',
  
  isHost: false,
  hostProfile: undefined,
  
  creditBalance: 45.50,
  creditHistory: [
    { id: 'tx-1', odterId: 'user-1', type: 'earned', amount: 25.00, source: 'asset_contribution', description: 'Shared pressure washer for 3 months', createdAt: new Date('2024-12-01') },
    { id: 'tx-2', odterId: 'user-1', type: 'earned', amount: 15.00, source: 'referral', description: 'Referred Mike to Block Share', createdAt: new Date('2024-12-15') },
    { id: 'tx-3', odterId: 'user-1', type: 'spent', amount: -5.50, source: 'booking', description: 'Reserved kayak for weekend', createdAt: new Date('2025-01-10') },
    { id: 'tx-4', odterId: 'user-1', type: 'earned', amount: 11.00, source: 'parking_rental', description: 'Parking stall rental - January', createdAt: new Date('2025-01-15') },
  ],
  
  rating: {
    asLender: 4.9,
    asBorrower: 5.0,
    totalRatings: 12,
    reviews: [],
  },
  
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsUpdates: false,
    shareRadius: 2,
  },
  
  memberSince: new Date('2024-06-15'),
};

// Mock Host user
export const MOCK_HOST_USER: User = {
  ...MOCK_CURRENT_USER,
  id: 'user-host',
  firstName: 'Marcus',
  lastName: 'Thompson',
  email: 'marcus@example.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
  isHost: true,
  hostProfile: {
    odterId: 'user-host',
    status: 'active',
    buildingId: 'building-1',
    blockId: 'block-1',
    applicationDate: new Date('2024-05-01'),
    approvalDate: new Date('2024-05-03'),
    activationDate: new Date('2024-05-10'),
    trainingProgress: [
      { moduleId: 'module-1', completed: true, completedAt: new Date('2024-05-05'), quizScore: 100 },
      { moduleId: 'module-2', completed: true, completedAt: new Date('2024-05-06'), quizScore: 100 },
      { moduleId: 'module-3', completed: true, completedAt: new Date('2024-05-07'), quizScore: 100 },
      { moduleId: 'module-4', completed: true, completedAt: new Date('2024-05-08'), quizScore: 100 },
      { moduleId: 'module-5', completed: true, completedAt: new Date('2024-05-09'), quizScore: 100 },
      { moduleId: 'module-6', completed: true, completedAt: new Date('2024-05-10'), quizScore: 100 },
    ],
    trainingComplete: true,
    membersOnboarded: 23,
    messagessSent: 47,
    votesCreated: 5,
  },
};

// Mock items
export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'Pressure Washer',
    description: 'Electric pressure washer, 2000 PSI. Great for patios, driveways, and cars.',
    category: 'tools',
    condition: 'excellent',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    media: [],
    ownerId: 'user-1',
    ownerName: 'Sarah C.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=1',
    location: 'The Gardens',
    poolType: 'building',
    buildingId: 'building-1',
    createdAt: new Date('2024-09-01'),
    tags: ['cleaning', 'outdoor'],
    rating: { average: 4.8, count: 6 },
    distance: 0.1,
  },
  {
    id: 'item-2',
    title: 'Camping Tent (4-person)',
    description: 'Coleman tent, sleeps 4. Easy setup, waterproof. Includes stakes and rain fly.',
    category: 'camping',
    condition: 'good',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
    media: [],
    ownerId: 'user-2',
    ownerName: 'Mike R.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=4',
    location: 'The Gardens',
    poolType: 'building',
    buildingId: 'building-1',
    createdAt: new Date('2024-08-15'),
    tags: ['camping', 'outdoor', 'summer'],
    rating: { average: 4.5, count: 3 },
    distance: 0.1,
  },
  {
    id: 'item-3',
    title: 'Stand-Up Paddleboard',
    description: 'Inflatable SUP with paddle and pump. Great for calm water.',
    category: 'watercraft',
    condition: 'excellent',
    status: 'borrowed',
    imageUrl: 'https://images.unsplash.com/photo-1526188717906-ab4a2f949f48?w=400',
    media: [],
    ownerId: 'user-3',
    ownerName: 'Lisa M.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=5',
    location: 'Harbour View',
    poolType: 'block',
    blockId: 'block-1',
    createdAt: new Date('2024-07-20'),
    tags: ['water', 'summer', 'fitness'],
    borrowedUntil: new Date('2025-02-05'),
    rating: { average: 5.0, count: 8 },
    distance: 0.3,
  },
  {
    id: 'item-4',
    title: 'Party Folding Tables (set of 3)',
    description: '6-foot folding tables, perfect for events and gatherings.',
    category: 'party',
    condition: 'good',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    media: [],
    ownerId: 'user-host',
    ownerName: 'Marcus T.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=3',
    location: 'The Gardens',
    poolType: 'building',
    buildingId: 'building-1',
    createdAt: new Date('2024-10-01'),
    tags: ['party', 'event', 'furniture'],
    rating: { average: 4.7, count: 11 },
    distance: 0.1,
  },
  {
    id: 'item-5',
    title: 'Electric Drill Set',
    description: 'DeWalt cordless drill with 2 batteries and full bit set.',
    category: 'tools',
    condition: 'excellent',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
    media: [],
    ownerId: 'user-4',
    ownerName: 'James K.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=6',
    location: 'Cedar Heights',
    poolType: 'block',
    blockId: 'block-1',
    createdAt: new Date('2024-11-05'),
    tags: ['tools', 'DIY'],
    rating: { average: 4.9, count: 15 },
    distance: 0.5,
  },
  {
    id: 'item-6',
    title: 'Patio Heater',
    description: 'Propane patio heater. Keeps outdoor spaces warm on cool evenings.',
    category: 'patio',
    condition: 'good',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    media: [],
    ownerId: 'user-5',
    ownerName: 'Emma W.',
    ownerAvatar: 'https://i.pravatar.cc/150?img=9',
    location: 'The Gardens',
    poolType: 'building',
    buildingId: 'building-1',
    createdAt: new Date('2024-09-20'),
    tags: ['patio', 'outdoor', 'winter'],
    rating: { average: 4.6, count: 7 },
    distance: 0.1,
  },
];

// Mock food subscription
export const MOCK_FOOD_SUBSCRIPTION: FoodSubscription = {
  id: 'sub-1',
  odterId: 'user-1',
  collectiveId: 'beef-collective',
  collectiveName: 'The Beef Community Collective',
  tier: 'gathering',
  status: 'active',
  startDate: new Date('2024-10-01'),
  nextDelivery: new Date('2025-02-06'),
  
  currentDelivery: {
    id: 'delivery-1',
    scheduledDate: new Date('2025-02-06'),
    status: 'upcoming',
    contents: ['2kg Ground Beef', '1.5kg Sirloin Steaks', '2kg Chuck Roast', '1kg Stewing Beef', '2kg Short Ribs', '2kg Beef Bones'],
    giveOrGetChoice: 'pending',
    selectedFreebie: undefined,
  },
  
  deliveryHistory: [
    { id: 'dh-1', date: new Date('2025-01-23'), contents: ['Ground Beef', 'Steaks', 'Roast'], giveOrGetChoice: 'keep' },
    { id: 'dh-2', date: new Date('2025-01-09'), contents: ['Ground Beef', 'Ribs', 'Stewing Beef'], giveOrGetChoice: 'give' },
  ],
  
  totalDeliveries: 8,
  totalSaved: 234.50,
  neighborsHelped: 3,
};

// Mock active vote
export const MOCK_ACTIVE_VOTE: Vote = {
  id: 'vote-1',
  poolId: 'building-1',
  poolName: 'The Gardens',
  createdById: 'user-host',
  createdByName: 'Marcus T.',
  
  type: 'item_selection',
  title: 'Which vehicle should we add to our building pool?',
  description: 'We have budget to add one shared vehicle. Help us choose!',
  
  options: [
    { id: 'opt-1', title: 'Electric Sedan', description: 'Tesla Model 3 or similar. Great for city driving and trips.' },
    { id: 'opt-2', title: 'Hybrid SUV', description: 'Toyota RAV4 Hybrid. Good for families and Costco runs.' },
    { id: 'opt-3', title: 'Electric Cargo Van', description: 'Ford E-Transit. Perfect for moving and large items.' },
  ],
  
  ballots: [],
  status: 'active',
  startsAt: new Date('2025-01-25'),
  endsAt: new Date('2025-02-08'),
  createdAt: new Date('2025-01-25'),
  eligibleVoters: 47,
  remindersSent: 1,
};

// Mock building members (for Host view)
export const MOCK_BUILDING_MEMBERS = [
  { id: 'user-1', name: 'Sarah Chen', unit: '301', avatar: 'https://i.pravatar.cc/150?img=1', lastActive: new Date('2025-01-30'), itemsShared: 3 },
  { id: 'user-2', name: 'Mike Rodriguez', unit: '205', avatar: 'https://i.pravatar.cc/150?img=4', lastActive: new Date('2025-01-29'), itemsShared: 2 },
  { id: 'user-3', name: 'Lisa Martinez', unit: '412', avatar: 'https://i.pravatar.cc/150?img=5', lastActive: new Date('2025-01-28'), itemsShared: 4 },
  { id: 'user-4', name: 'James Kim', unit: '108', avatar: 'https://i.pravatar.cc/150?img=6', lastActive: new Date('2025-01-30'), itemsShared: 1 },
  { id: 'user-5', name: 'Emma Wilson', unit: '503', avatar: 'https://i.pravatar.cc/150?img=9', lastActive: new Date('2025-01-25'), itemsShared: 2 },
];

// Save the Pond community project
export const SAVE_THE_POND_PROJECT: CommunityProject = {
  id: 'save-the-pond',
  name: 'Save the Pond',
  tagline: 'Restore Trout Lake for our neighbourhood',
  description: 'Join neighbours working to restore Trout Lake\'s ecosystem through clean-ups, native planting, and advocacy. Every new member who completes onboarding helps fund the cause.',
  ccReward: 20,
};

// Mock referral code for current user
export const MOCK_REFERRAL_CODE: ReferralCode = {
  code: 'VAN-B1-SARAH03',
  webUrl: 'https://app.blockshare.ca/join?ref=VAN-B1-SARAH03&project=save-the-pond',
  project: SAVE_THE_POND_PROJECT,
  stats: {
    totalReferrals: 3,
    pendingReferrals: 1,
    creditedReferrals: 2,
    totalCCEarned: 40,
  },
  referrals: [
    {
      id: 'ref-1',
      referredName: 'Mike',
      status: 'credited',
      ccAmount: 20,
      createdAt: new Date('2024-12-15'),
      creditedAt: new Date('2024-12-15'),
    },
    {
      id: 'ref-2',
      referredName: 'Priya',
      status: 'credited',
      ccAmount: 20,
      createdAt: new Date('2025-01-08'),
      creditedAt: new Date('2025-01-09'),
    },
    {
      id: 'ref-3',
      referredName: 'Tom',
      status: 'pending',
      ccAmount: 20,
      createdAt: new Date('2025-01-28'),
    },
  ],
};

// Mock broadcast messages
export const MOCK_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'broadcast-1',
    hostId: 'user-host',
    hostName: 'Marcus T.',
    scope: 'building',
    targetId: 'building-1',
    targetName: 'The Gardens',
    template: 'delivery',
    subject: 'Beef Collective Delivery Thursday! 📦',
    content: 'Your Beef Collective delivery is arriving Thursday, Feb 6th. Pickup will be in the lobby from 4-7pm. Don\'t forget to make your "Give or Get" choice in the app!',
    sentAt: new Date('2025-01-28'),
    readBy: ['user-1', 'user-2', 'user-4'],
    totalRecipients: 47,
    createdAt: new Date('2025-01-28'),
  },
];
