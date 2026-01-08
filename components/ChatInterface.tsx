
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, CheckCircle2, Users, RefreshCcw } from 'lucide-react';
import { generateBankingResponse } from '../services/geminiService';
import { Account, Transaction, Recipient } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  confirmation?: {
    type: 'transfer' | 'split' | 'exchange';
    data: any;
  };
}

interface ChatInterfaceProps {
  accounts: Account[];
  transactions: Transaction[];
  recipients: Recipient[];
  onExecute: (type: string, data: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ accounts, transactions, recipients, onExecute }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "I'm Nova. I can handle transfers, splitting checks, and currency exchange. Just ask." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (override?: string) => {
    const userMsg = override || input;
    if (!userMsg.trim() || isTyping) return;

    if (!override) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const hist = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const resp = await generateBankingResponse(userMsg, hist, { accounts, transactions });
    
    setIsTyping(false);
    let confirm: any = null;
    if (resp.functionCalls?.length) {
      const call = resp.functionCalls[0];
      if (call.name === 'requestTransfer') confirm = { type: 'transfer', data: call.args };
      else if (call.name === 'splitBill') confirm = { type: 'split', data: call.args };
      else if (call.name === 'exchangeCurrency') confirm = { type: 'exchange', data: call.args };
    }

    setMessages(prev => [...prev, { role: 'model', text: resp.text || "Action prepared. Please review.", confirmation: confirm }]);
  };

  const handleConfirm = (index: number) => {
    const msg = messages[index];
    if (!msg.confirmation) return;
    onExecute(msg.confirmation.type, msg.confirmation.data);
    setMessages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], confirmation: undefined };
      updated.push({ role: 'model', text: `Success! I've executed the ${msg.confirmation?.type}.` });
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-indigo-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-2">
                {msg.text && (
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-800'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                )}
                {msg.confirmation && (
                  <div className="bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center space-x-2 mb-3 text-indigo-600 dark:text-indigo-400">
                      {msg.confirmation.type === 'transfer' ? <CheckCircle2 size={18} /> : msg.confirmation.type === 'split' ? <Users size={18} /> : <RefreshCcw size={18} />}
                      <h4 className="font-black text-xs uppercase tracking-widest">{msg.confirmation.type} Request</h4>
                    </div>
                    <div className="space-y-1 mb-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                      {msg.confirmation.type === 'transfer' && (
                        <>
                          <div className="flex justify-between"><span>To</span><span className="text-indigo-600">{msg.confirmation.data.recipientName}</span></div>
                          <div className="flex justify-between"><span>Amount</span><span className="text-slate-900 dark:text-white">${msg.confirmation.data.amount}</span></div>
                        </>
                      )}
                      {msg.confirmation.type === 'split' && (
                        <>
                          <div className="flex justify-between"><span>Total</span><span>${msg.confirmation.data.totalAmount}</span></div>
                          <div className="flex justify-between"><span>Split with</span><span>{msg.confirmation.data.numPeople} people</span></div>
                          <div className="flex justify-between text-indigo-600"><span>Each pays</span><span>${(msg.confirmation.data.totalAmount / msg.confirmation.data.numPeople).toFixed(2)}</span></div>
                        </>
                      )}
                      {msg.confirmation.type === 'exchange' && (
                        <>
                          <div className="flex justify-between"><span>Exchange</span><span>{msg.confirmation.data.amount} {msg.confirmation.data.fromCurrency}</span></div>
                          <div className="flex justify-between text-indigo-600"><span>To</span><span>{msg.confirmation.data.toCurrency}</span></div>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleConfirm(i)} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all">Confirm</button>
                      <button onClick={() => setMessages(m => m.filter((_, idx) => idx !== i))} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-2">
              <Loader2 size={14} className="animate-spin text-indigo-500" />
              <span className="text-[10px] font-bold text-slate-400">Nova is analyzing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex space-x-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {["Check Balance", "Send $20 to Sarah", "Split $60 check", "Exchange 50 EUR"].map(tag => (
            <button key={tag} onClick={() => handleSend(tag)} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-indigo-100 dark:border-indigo-900/40 whitespace-nowrap active:scale-95 transition-all">{tag}</button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Nova to transfer, split, or exchange..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
          />
          <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
