
import { TransactionType, Account, Transaction, Recipient, Alert } from './types';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Premium Checking', balance: 5240.50, type: 'checking', lastFour: '4421', currency: 'USD' },
  { id: '2', name: 'High Yield Savings', balance: 12850.25, type: 'savings', lastFour: '9001', currency: 'USD' },
  { id: '3', name: 'Euro Wallet', balance: 450.00, type: 'wallet', lastFour: '5582', currency: 'EUR' },
];

export const INITIAL_RECIPIENTS: Recipient[] = [
  { id: 'r1', name: 'Sarah Miller', email: 'sarah@example.com', phone: '555-0101' },
  { id: 'r2', name: 'John Davis', email: 'john@example.com', phone: '555-0102' },
  { id: 'r3', name: 'Alex Thompson', email: 'alex@example.com', phone: '555-0103' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-15', amount: 15.40, description: 'Starbucks Coffee', category: 'Dining', type: TransactionType.EXPENSE, currency: 'USD' },
  { id: 't2', date: '2024-05-14', amount: 2450.00, description: 'Payroll Deposit', category: 'Salary', type: TransactionType.INCOME, currency: 'USD' },
  { id: 't3', date: '2024-05-13', amount: 45.00, description: 'Uber Trip', category: 'Transport', type: TransactionType.EXPENSE, currency: 'USD' },
  { id: 't4', date: '2024-05-12', amount: 120.50, description: 'Whole Foods Market', category: 'Groceries', type: TransactionType.EXPENSE, currency: 'USD' },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'unusual_spending',
    title: 'Unusual Activity',
    message: 'We noticed a $120.50 charge at Whole Foods. This is 40% higher than your usual grocery spend.',
    severity: 'warning',
    date: '2024-05-12'
  },
  {
    id: 'a2',
    type: 'low_balance',
    title: 'Low Balance Alert',
    message: 'Your Euro Wallet is below €500. Consider topping it up for your upcoming trip.',
    severity: 'info',
    date: '2024-05-15'
  }
];
