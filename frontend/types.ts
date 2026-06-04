export interface Expense {
    id: string;
    name: string;
    amount: number;
    category?: string;
}

export interface Debt {
    id: string;
    name: string;
    amount: number;
    interestRate?: number;
    minimumPayment?: number;
}

export interface Goal {
    id: string;
    name: string;
    target: number;
    current: number;
    targetDate?: string;
    type?: 'savings' | 'debt payoff' | 'purchase' | 'move out';
    achieved?: boolean;
    achievedAt?: string;
}

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    note?: string;
}

export interface ScoreHistoryEntry {
    score: number;
    label: string;
    calculatedAt: string;
}

export interface FinancialProfile {
    firstName: string;
    age: string;
    employmentSituation: string;
    income: number;
    fixedExpenses: Expense[];
    variableExpenses: Expense[];
    debts: Debt[];
    goals: Goal[];
    transactions: Transaction[];
    tonePreference: 'chill' | 'serious';
    quickWin: string;
    demoMode?: boolean;
    lastRecapAt?: string;
    scoreHistory?: ScoreHistoryEntry[];
    theme?: 'dark' | 'light';
    tooltipsCompleted?: boolean;
    firstThrivingAt?: string;
    privacyAcknowledged?: boolean;
    isGuest?: boolean;
    createdAt?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
    toolCalls?: { name: string; args: any }[];
    timestamp: number;
    confidence?: 'HIGH' | 'ESTIMATED' | 'HYPOTHETICAL';
    isRecap?: boolean;
}

export interface Part {
    text?: string;
    functionCall?: { name: string; args: any };
    functionResponse?: { name: string; response: any };
}

export interface Content {
    role: 'user' | 'model';
    parts: Part[];
}
