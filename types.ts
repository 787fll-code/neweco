
export type TileType = 'MISSION' | 'OPPORTUNITY' | 'LUCK' | 'START' | 'EMPTY' | 'BANK' | 'STOCKS' | 'DECISION';

export interface User {
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  state: PlayerState;
}

export interface Investment {
  stockId: string;
  stockName: string;
  amount: number;
  purchasePrice: number;
}

export interface Career {
  id: string;
  name: string;
  salary: number;
  category: 'SERVICE' | 'TECH' | 'LEGAL' | 'CREATIVE' | 'MEDICAL' | 'FINANCE' | 'ARCHITECTURE' | 'TRADES' | 'EDUCATION' | 'PILOT' | 'SECURITY';
  requirements: {
    degrees: string[];
    equipment: string[];
  };
}

export interface House {
  id: string;
  name: string;
  price: number;
  monthlyMaintenance: number;
  happinessBonus: number;
}

export interface Appearance {
  gender: 'MALE' | 'FEMALE';
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  shoes: string;
  face: 'SMILE' | 'SMIRK' | 'CHILL' | 'NERD' | 'SERIOUS' | 'ELITE';
}

export interface Transaction {
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  dateLabel: string;
  category?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  monthlyCost?: number; // New: Recurring cost per month
  happiness: number;
  type: 'EQUIPMENT' | 'LIFESTYLE';
  description: string;
  icon?: string;
}

export interface BudgetCategory {
  id: string;
  label: string;
  color: string;
  isCustom?: boolean;
}

export interface PlayerState {
  money: number;
  savings: number; 
  happiness: number;
  currentPosition: number;
  tilesTraversed: number;
  job: Career;
  degrees: string[];
  inventory: string[];
  investments: Investment[];
  loans: number;
  failedMissionsCount: number;
  gameOver: boolean;
  houseType: string;
  appearance: Appearance;
  recentTransactions: Transaction[];
  budget: Record<string, number>;
  activeBudgetCategoryIds: string[];
  customBudgetCategories: BudgetCategory[];
  history: {
    money: number;
    happiness: number;
    month: number;
  }[];
}

export interface GameEvent {
  type: TileType;
  title: string;
  description: string;
  intel: string;
  miniGameType?: 'SCAMMER' | 'QUIZ';
  scammerData?: {
    emails: { text: string; isScam: boolean; reason: string }[];
  };
  quizData?: {
    question: string;
    options: { label: string; isCorrect: boolean }[];
    explanation: string;
  };
  options?: {
    label: string;
    description?: string;
    impact: any;
  }[];
  impact?: any;
}
