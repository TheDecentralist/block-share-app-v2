// Block Share App v2.0 - Chat & Messaging Types
// Includes Host broadcast messaging

export type MessageType = 'direct' | 'broadcast' | 'system';
export type BroadcastScope = 'building' | 'block';
export type MessageTemplate = 'welcome' | 'reminder' | 'delivery' | 'vote' | 'custom';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  readAt?: Date;
  
  // For direct messages
  recipientId?: string;
  
  // For broadcast messages
  scope?: BroadcastScope;
  targetId?: string; // building or block ID
}

export interface BroadcastMessage {
  id: string;
  hostId: string;
  hostName: string;
  scope: BroadcastScope;
  targetId: string; // building or block ID
  targetName: string;
  template?: MessageTemplate;
  subject?: string;
  content: string;
  scheduledFor?: Date;
  sentAt?: Date;
  readBy: string[]; // user IDs who have read
  totalRecipients: number;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string | undefined>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Optional: related to a borrow request
  borrowRequestId?: string;
  itemId?: string;
  itemTitle?: string;
}

export interface ChatMessage extends Message {
  chatId: string;
}

// Host messaging templates
export const MESSAGE_TEMPLATES: Record<MessageTemplate, { subject: string; content: string }> = {
  welcome: {
    subject: 'Welcome to Block Share! 🎉',
    content: 'Welcome to our sharing community! I\'m your Block Host and I\'m here to help you get started. Feel free to reach out if you have any questions about borrowing or sharing items.',
  },
  reminder: {
    subject: 'Quick Reminder 📢',
    content: 'Just a friendly reminder about [TOPIC]. Let me know if you have any questions!',
  },
  delivery: {
    subject: 'Food Delivery Update 📦',
    content: 'Your Beef Collective delivery is arriving on [DATE]. Pickup will be at [LOCATION]. Don\'t forget to make your "Give or Get" choice in the app!',
  },
  vote: {
    subject: 'Your Vote Needed! 🗳️',
    content: 'We have an active vote that needs your input: [VOTE TOPIC]. Please take a moment to rank your preferences in the app. Voting closes on [DATE].',
  },
  custom: {
    subject: '',
    content: '',
  },
};
