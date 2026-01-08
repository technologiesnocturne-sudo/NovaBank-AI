
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Lightbulb, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface InsightsViewProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

const InsightsView: React.FC<InsightsViewProps> = ({ transactions }) => {
  const spendingByCategory = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const data = [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 600 },
    { month: 'Apr', value: 800 },
    { month: 'May', value: 500 },
  ];

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Financial Insights</h1>

      {/* AI Recommendation Card */}
      <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-black/40 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md"><Lightbulb size={18} className="text-amber-300" /></div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Suggestion</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Save $124.50 this month</h3>
          <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
            Nova noticed you spent 15% more on Dining out compared to last month. Switching two dinners to home-cooked meals could boost your savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Income</p>
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <ArrowDown className="rotate-[-45deg]" size={14} />
            <span className="text-lg font-bold">$4,250.00</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Expenses</p>
          <div className="flex items-center space-x-1 text-rose-500 dark:text-rose-400">
            <ArrowUp className="rotate-[45deg]" size={14} />
            <span className="text-lg font-bold">$2,815.40</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center space-x-2">
          <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
          <span>Spending Breakdown</span>
        </h3>
        <div className="h-64 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {spendingByCategory.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
            {spendingByCategory.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Income Flow</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <Tooltip cursor={false} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
