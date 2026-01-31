// Block Share App v2.0 - User Types
// Includes Host-centric operator model

export type HostStatus = 'none' | 'applied' | 'approved' | 'active' | 'inactive';

export interface TrainingProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: Date;
  quizScore?: number;
}

export interface HostProfile {
  userId: string;
  status: HostStatus;
  buildingId: string;
  blockId?: string;
  applicationDate?: Date;
  approvalDate?: Date;
  activationDate?: Date;
  trainingProgress: TrainingProgress[];
  trainingComplete: boolean;
  
  // Stats
  membersOnboarded: number;
  messagessSent: number;
  votesCreated: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'applied';
  amount: number;
  source: 'asset_contribution' | 'parking_rental' | 'service' | 'referral' | 'membership' | 'booking';
  description: string;
  createdAt: Date;
  relatedId?: string; // item ID, booking ID, etc.
}

export interface UserRating {
  asLender: number;
  asBorrower: number;
  totalRatings: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    reviewerId: string;
    reviewerName: string;
    type: 'lender' | 'borrower';
    createdAt: Date;
  }[];
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  shareRadius: number; // in kilometers
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  borrowRequests: boolean;
  chatMessages: boolean;
  communityUpdates: boolean;
  foodDeliveries: boolean;
  voteReminders: boolean;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
}

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isPremium?: boolean;
  createdAt: Date;
  avatar?: string;
  bio?: string;
  
  // Location
  location?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    isVerified?: boolean;
  };
  
  // Block/Building membership
  buildingId?: string;
  buildingName?: string;
  blockId?: string;
  blockNumber?: string;
  
  // Host status
  isHost: boolean;
  hostProfile?: HostProfile;
  
  // Credits
  creditBalance: number;
  creditHistory: CreditTransaction[];
  
  // Ratings
  rating?: UserRating;
  
  // Settings
  preferences?: UserPreferences;
  notificationSettings?: NotificationSettings;
  
  // Membership
  paymentPlan?: PaymentPlan;
  memberSince: Date;
}

export interface BlockIdentity {
  blockNumber: string;
  buildingName: string;
  neighbourhood: string;
  environmentalIcon: 'ocean' | 'lakes' | 'forest' | 'mountain' | 'prairie' | 'river';
  natureSymbol: 'salmon' | 'whale' | 'deer' | 'eagle' | 'bear' | 'owl' | 'beaver';
  storyStones: {
    id: string;
    title: string;
    content: string;
    addedBy: string;
    addedAt: Date;
  }[];
}

// Food Collective types
export interface FoodSubscription {
  id: string;
  userId: string;
  collectiveId: string;
  tier: 'family' | 'gathering' | 'celebration';
  status: 'active' | 'paused' | 'cancelled';
  startDate: Date;
  nextDelivery?: Date;
  giveOrGetChoice?: 'keep' | 'give';
}
