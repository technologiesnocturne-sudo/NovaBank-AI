
import React from 'react';
import { Wallet, CreditCard, TrendingUp, AlertTriangle, Zap, Bell, ChevronRight, Settings } from 'lucide-react';
import { Account, Transaction, Alert, TransactionType } from '../types';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, alerts }) => {
  const totalBalanceUSD = accounts.reduce((sum, acc) => {
    const rate = acc.currency === 'EUR' ? 1.08 : 1;
    return sum + (acc.balance * rate);
  }, 0);

  return (
    <div className="p-4 pb-28 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Alex Thompson</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <Bell size={20} className="text-slate-600 dark:text-slate-400" />
            {alerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>}
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <Settings size={20} className="text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Assets (USD)</p>
              <h2 className="text-4xl font-black">${totalBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
            <Zap className="text-indigo-300 animate-pulse" size={28} />
          </div>
          <div className="flex space-x-3 mt-8">
            <button className="flex-1 py-3 bg-white text-indigo-700 rounded-2xl text-sm font-bold shadow-lg shadow-black/10 active:scale-95 transition-all">Quick Transfer</button>
            <button className="flex-1 py-3 bg-indigo-500/40 text-white rounded-2xl text-sm font-bold backdrop-blur-md border border-white/20 active:scale-95 transition-all">Pay Bills</button>
          </div>
        </div>
      </div>

      {/* AI Intelligence Alerts */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Zap size={16} fill="currentColor" />
          <h3 className="text-xs font-black uppercase tracking-widest">Nova Intelligence</h3>
        </div>
        <div className="grid gap-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-4 rounded-2xl border flex items-start space-x-4 transition-colors ${
              alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30'
            }`}>
              <div className={`p-2 rounded-xl ${alert.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'}`}>
                {alert.severity === 'warning' ? <AlertTriangle size={20} /> : <Zap size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-sm dark:text-white">{alert.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">My Accounts</h3>
          <button className="text-xs font-bold text-indigo-600">View All</button>
        </div>
        <div className="space-y-2">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-600">
                  {acc.type === 'checking' ? <CreditCard size={20} /> : <TrendingUp size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{acc.name}</p>
                  <p className="text-xs text-slate-500">•••• {acc.lastFour} • {acc.currency}</p>
                </div>
              </div>
              <p className="font-black text-slate-800 dark:text-white">
                {acc.currency === 'EUR' ? '€' : '$'}{acc.balance.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History Mini-list */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
          {transactions.slice(0, 3).map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                  {tx.type === TransactionType.INCOME ? <ChevronRight className="-rotate-90" size={18} /> : <ChevronRight className="rotate-90" size={18} />}
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{tx.description}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800 dark:text-white'}`}>
                {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
