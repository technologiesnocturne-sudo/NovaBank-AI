
import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface HistoryViewProps {
  transactions: Transaction[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6 transition-colors">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">History</h1>
        <button className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${tx.type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {tx.type === TransactionType.INCOME ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{tx.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date} • {tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Completed</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
