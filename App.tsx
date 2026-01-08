
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, History, CreditCard, PieChart, Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import FaceIDOverlay from './components/FaceIDOverlay';
import HistoryView from './components/HistoryView';
import CardsView from './components/CardsView';
import InsightsView from './components/InsightsView';
import { Account, Transaction, Recipient, TransactionType, Alert } from './types';
import { INITIAL_ACCOUNTS, INITIAL_RECIPIENTS, MOCK_TRANSACTIONS, MOCK_ALERTS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'history' | 'cards' | 'insights'>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const onExecuteAction = (type: string, data: any) => {
    if (type === 'transfer') {
      const amount = data.amount;
      setAccounts(prev => prev.map(a => a.type === 'checking' ? { ...a, balance: a.balance - amount } : a));
      setTransactions(prev => [{
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        description: `Transfer to ${data.recipientName}`,
        category: 'Transfer',
        type: TransactionType.TRANSFER,
        currency: 'USD'
      }, ...prev]);
    } else if (type === 'split') {
      const splitAmount = data.totalAmount / data.numPeople;
      setAccounts(prev => prev.map(a => a.type === 'checking' ? { ...a, balance: a.balance - splitAmount } : a));
      setTransactions(prev => [{
        id: `split-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: splitAmount,
        description: `Split: ${data.description || 'Shared Expense'}`,
        category: 'Dining',
        type: TransactionType.SPLIT,
        currency: 'USD'
      }, ...prev]);
    } else if (type === 'exchange') {
      const rate = data.fromCurrency === 'USD' ? 0.92 : 1.08;
      const converted = data.amount * rate;
      setAccounts(prev => prev.map(a => {
        if (a.currency === data.fromCurrency) return { ...a, balance: a.balance - data.amount };
        if (a.currency === data.toCurrency) return { ...a, balance: a.balance + converted };
        return a;
      }));
      setTransactions(prev => [{
        id: `exch-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: data.amount,
        description: `Exchange ${data.fromCurrency} to ${data.toCurrency}`,
        category: 'Exchange',
        type: TransactionType.EXCHANGE,
        currency: data.fromCurrency
      }, ...prev]);
    }
  };

  if (!isAuthenticated) return <FaceIDOverlay onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200 dark:border-slate-800 transition-colors duration-300">
      
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-600 dark:text-slate-400 active:scale-90 transition-all"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pt-2 bg-slate-50 dark:bg-slate-950">
        {activeTab === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} alerts={alerts} />}
        {activeTab === 'chat' && <ChatInterface accounts={accounts} transactions={transactions} recipients={INITIAL_RECIPIENTS} onExecute={onExecuteAction} />}
        {activeTab === 'history' && <HistoryView transactions={transactions} />}
        {activeTab === 'cards' && <CardsView />}
        {activeTab === 'insights' && <InsightsView transactions={transactions} />}
      </main>

      <nav className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 pb-8 pt-3 flex justify-around items-center z-40 transition-colors">
        <NavBtn act={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={22} />} label="Home" />
        <NavBtn act={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={22} />} label="History" />
        <div className="relative -top-6">
          <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-full shadow-2xl transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white scale-110' : 'bg-white dark:bg-slate-800 text-slate-400 shadow-slate-200 dark:shadow-black/40'}`}>
            <MessageSquare size={26} />
          </button>
          <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 transition-opacity ${activeTab === 'chat' ? 'opacity-100' : 'opacity-0'}`}>Nova</span>
        </div>
        <NavBtn act={activeTab === 'cards'} onClick={() => setActiveTab('cards')} icon={<CreditCard size={22} />} label="Cards" />
        <NavBtn act={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<PieChart size={22} />} label="Trends" />
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{ act: boolean, onClick: () => void, icon: any, label: string }> = ({ act, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${act ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
    {icon}
    <span className={`text-[8px] font-black mt-1 uppercase tracking-tighter transition-all ${act ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>{label}</span>
  </button>
);

export default App;
