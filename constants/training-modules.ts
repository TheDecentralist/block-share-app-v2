// Block Share App v2.0 - Host Training Modules
// 6 modules required for Host activation

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "5 min"
  keyPoints: string[];
  quizQuestions: QuizQuestion[];
  order: number;
  requiredToActivate: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'module-1',
    title: 'Block Share Philosophy',
    description: 'Understand the vision of "Citizens, not Consumers" and why neighbourhood sharing matters.',
    duration: '5 min',
    order: 1,
    requiredToActivate: true,
    keyPoints: [
      'Block Share creates abundance through sharing, not accumulation',
      '"Smart Sharing vs. Dumb Duplicate Ownership" saves money and builds community',
      'Every item shared is a connection made between neighbours',
      'We measure success in "life reclaimed" — hours saved from earning money for unused items',
    ],
    quizQuestions: [
      {
        id: 'q1-1',
        question: 'What is the core philosophy of Block Share?',
        options: [
          'Buy more, own more',
          'Citizens, not Consumers',
          'Every person for themselves',
          'Profit over people',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q1-2',
        question: 'What does "Smart Sharing" mean?',
        options: [
          'Sharing only expensive items',
          'Sharing items you use constantly',
          'Pooling resources to avoid duplicate ownership of rarely-used items',
          'Charging high fees for borrowing',
        ],
        correctAnswer: 2,
      },
      {
        id: 'q1-3',
        question: 'How does Block Share measure success?',
        options: [
          'Number of items owned',
          'Money earned from sharing',
          'Life reclaimed — time and money saved',
          'Number of buildings enrolled',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'How Pools Work',
    description: 'Learn the three-tier pool system: Building, Block, and City-Wide sharing.',
    duration: '4 min',
    order: 2,
    requiredToActivate: true,
    keyPoints: [
      'Building Pools are for items shared within a single residential building',
      'Block Pools expand sharing across adjacent buildings and homes',
      'City-Wide Network connects specialized items across the entire network',
      'Items flow up: what starts in a building can become available block-wide',
    ],
    quizQuestions: [
      {
        id: 'q2-1',
        question: 'What is a Building Pool?',
        options: [
          'A swimming pool in the building',
          'Items shared within a single residential building',
          'A financial investment pool',
          'Items shared across the entire city',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q2-2',
        question: 'In what order do pools expand?',
        options: [
          'City → Block → Building',
          'Block → Building → City',
          'Building → Block → City-Wide',
          'All pools are the same',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Onboarding New Members',
    description: 'How to welcome and help new residents join the sharing community.',
    duration: '6 min',
    order: 3,
    requiredToActivate: true,
    keyPoints: [
      'Welcome new members personally — a warm greeting makes all the difference',
      'Help them download the app and create their profile',
      'Encourage them to share ONE item to start — low barrier to entry',
      'Introduce them to neighbours who share similar interests',
      'Follow up after their first borrow to ensure a good experience',
    ],
    quizQuestions: [
      {
        id: 'q3-1',
        question: 'What\'s the best first step when onboarding a new member?',
        options: [
          'Send them a long email with rules',
          'Welcome them personally and offer to help',
          'Tell them to figure it out themselves',
          'Require them to share 10 items immediately',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q3-2',
        question: 'What should you encourage new members to do first?',
        options: [
          'Share one item to start',
          'Borrow as much as possible',
          'Read all documentation',
          'Pay for premium membership',
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'module-4',
    title: 'Facilitating Votes',
    description: 'Guide your community through democratic decision-making with ranked-choice voting.',
    duration: '5 min',
    order: 4,
    requiredToActivate: true,
    keyPoints: [
      'Block Share uses ranked-choice voting for fair decisions',
      'Members rank their preferences rather than picking just one option',
      'Votes are used for pool priorities, item selection, and rule changes',
      'As Host, you create votes and encourage participation',
      'Results are transparent and explained clearly',
    ],
    quizQuestions: [
      {
        id: 'q4-1',
        question: 'What type of voting does Block Share use?',
        options: [
          'First-past-the-post',
          'Ranked-choice voting',
          'Host decides everything',
          'Random selection',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q4-2',
        question: 'What decisions can be made through voting?',
        options: [
          'Only pool priorities',
          'Only item selection',
          'Pool priorities, item selection, and rule changes',
          'Nothing — the Host decides',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'module-5',
    title: 'Handling Common Issues',
    description: 'How to resolve disputes and handle common problems between neighbours.',
    duration: '6 min',
    order: 5,
    requiredToActivate: true,
    keyPoints: [
      'Most issues are misunderstandings that resolve with communication',
      'Listen to both sides before suggesting solutions',
      'Damaged items: document, communicate, facilitate resolution',
      'Late returns: gentle reminders first, then direct conversation',
      'Escalate to Block Share support if you can\'t resolve locally',
    ],
    quizQuestions: [
      {
        id: 'q5-1',
        question: 'What\'s the first step when handling a dispute?',
        options: [
          'Immediately escalate to Block Share support',
          'Take one side based on who you know better',
          'Listen to both sides before suggesting solutions',
          'Tell them to sort it out themselves',
        ],
        correctAnswer: 2,
      },
      {
        id: 'q5-2',
        question: 'How should you handle a late return?',
        options: [
          'Immediately ban the borrower',
          'Gentle reminders first, then direct conversation',
          'Ignore it',
          'Publicly shame them',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'module-6',
    title: 'Food Collective Coordination',
    description: 'Manage delivery logistics and coordinate group food orders in your building.',
    duration: '4 min',
    order: 6,
    requiredToActivate: false, // Optional for activation
    keyPoints: [
      'Food Collectives like The Beef Community Collective deliver to building pickup points',
      'As Host, you manage the delivery location and notify residents',
      'Coordinate delivery timing to minimize disruption',
      'Help residents choose their "Give or Get" freebie options',
      'Encourage group ordering for additional discounts',
    ],
    quizQuestions: [
      {
        id: 'q6-1',
        question: 'What is your role in Food Collective deliveries?',
        options: [
          'Deliver the food yourself',
          'Manage pickup location and notify residents',
          'Cook the food',
          'Nothing — it\'s automated',
        ],
        correctAnswer: 1,
      },
    ],
  },
];

export const getModuleById = (id: string): TrainingModule | undefined => {
  return TRAINING_MODULES.find(m => m.id === id);
};

export const getRequiredModules = (): TrainingModule[] => {
  return TRAINING_MODULES.filter(m => m.requiredToActivate);
};
