
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  EXCHANGE = 'exchange',
  SPLIT = 'split'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment' | 'wallet';
  lastFour: string;
  currency: string;
}

export interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Alert {
  id: string;
  type: 'unusual_spending' | 'low_balance' | 'bill_reminder';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
}

export interface AppState {
  user: {
    name: string;
    isAuthenticated: boolean;
  };
  accounts: Account[];
  transactions: Transaction[];
  recipients: Recipient[];
  alerts: Alert[];
  theme: 'light' | 'dark';
}
