// Block Share App v2.0 - Referral Types

export interface CommunityProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  ccReward: number; // CC awarded to referrer when unlock triggers
}

export interface ReferralCode {
  code: string; // e.g. VAN-B7-SARAH03
  webUrl: string; // https://app.blockshare.ca/join?ref=CODE&project=save-the-pond
  project: CommunityProject;
  stats: {
    totalReferrals: number;
    pendingReferrals: number;
    creditedReferrals: number;
    totalCCEarned: number;
  };
  referrals: ReferralEvent[];
}

export interface ReferralEvent {
  id: string;
  referredName: string; // first name only for privacy
  status: 'pending' | 'credited' | 'rejected';
  ccAmount: number;
  createdAt: Date;
  creditedAt?: Date;
}
