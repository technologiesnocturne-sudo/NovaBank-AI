
import React from 'react';
import { Plus, Shield, Zap, Lock, Eye } from 'lucide-react';

const CardsView: React.FC = () => {
  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6 transition-colors">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Cards</h1>
        <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Debit Card */}
      <div className="relative h-52 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-[0.2em]">Platinum Debit</p>
              <Zap className="text-amber-400 fill-amber-400" size={20} />
            </div>
            <div className="text-2xl font-black italic tracking-tighter opacity-40">NOVABANK</div>
          </div>
          
          <div>
            <div className="flex space-x-4 mb-2">
              <span className="text-xl font-medium tracking-[0.15em]">••••</span>
              <span className="text-xl font-medium tracking-[0.15em]">••••</span>
              <span className="text-xl font-medium tracking-[0.15em]">••••</span>
              <span className="text-xl font-medium tracking-[0.15em]">4421</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1 opacity-60">Card Holder</p>
                <p className="text-sm font-bold tracking-wide">ALEX THOMPSON</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1 opacity-60">Expires</p>
                <p className="text-sm font-bold tracking-wide">05/28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-2 hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-colors">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full transition-colors"><Lock size={20} /></div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Freeze Card</span>
        </button>
        <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-2 hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-colors">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full transition-colors"><Eye size={20} /></div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Show Details</span>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">Security Features</h3>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex items-center space-x-4 border border-indigo-100 dark:border-indigo-900/30">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm transition-colors"><Shield size={20} /></div>
          <div>
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Virtual Card Shield</p>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">Automatic single-use cards for online shopping</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsView;
