
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, X, Terminal, Sparkles, Cpu, Info } from 'lucide-react';
import { getAdvisorGuidance } from '../services/geminiService';
import { PlayerState } from '../types';
import { sounds } from '../services/soundService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface Props { 
  state: PlayerState; 
  onUse: (cost: number) => void; 
  isFree?: boolean;
}

const AIAdvisorPanel: React.FC<Props> = ({ state, onUse, isFree = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [usesLeft, setUsesLeft] = useState(5); // Increased for better UX
  const scrollRef = useRef<HTMLDivElement>(null);

  const ADVISOR_COST = isFree ? 0 : 150;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || (state.money < ADVISOR_COST && !isFree) || loading || usesLeft <= 0) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    onUse(ADVISOR_COST);
    if (!isFree) setUsesLeft(prev => prev - 1);
    sounds.playClick();

    const guidance = await getAdvisorGuidance(state, userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: guidance }]);
    setLoading(false);
    sounds.playSuccess();
  };

  return (
    <div className="fixed bottom-10 left-10 z-[120]">
      {isOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl w-96 overflow-hidden flex flex-col h-[600px] border border-blue-500/30">
          <div className="bg-blue-600/20 p-6 flex justify-between items-center border-b border-blue-500/20">
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-blue-500" />
              <div>
                <h3 className="font-black text-white text-sm tracking-widest uppercase">EDDIE ADVISOR</h3>
                <span className="text-[10px] font-bold text-blue-400 uppercase">
                  {isFree ? 'גישה חופשית (סניף בנק)' : `שימושים: ${usesLeft}/5`}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-300 hover:text-white p-2 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
            {messages.length === 0 && (
                <div className="text-center py-10">
                    <Sparkles className="mx-auto text-blue-400 mb-4 opacity-20" size={48} />
                    <p className="text-blue-200/40 text-xs font-black uppercase tracking-[0.2em]">ממתין לשאילתה...</p>
                </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl font-bold text-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-blue-100' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
                <div className="flex justify-end items-center gap-3">
                    <div className="text-[10px] font-black text-blue-400 animate-pulse uppercase tracking-widest">EDDIE מקליד...</div>
                    <div className="bg-blue-600 p-4 rounded-2xl">
                        <Loader2 className="animate-spin text-white" size={18} />
                    </div>
                </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 border-t border-blue-500/20">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={(usesLeft > 0 || isFree) ? "שאל את המערכת..." : "נגמרו השימושים"}
                disabled={(usesLeft <= 0 && !isFree) || loading}
                className="w-full pr-4 pl-14 py-4 bg-slate-800 border border-blue-500/30 rounded-2xl font-bold text-white focus:outline-none focus:border-blue-400 transition-colors text-right"
              />
              <button disabled={(usesLeft <= 0 && !isFree) || loading || !query} className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50">
                <Send size={18} className="rotate-180" />
              </button>
            </form>
            <div className="mt-4 flex justify-between text-[10px] font-black uppercase text-blue-300/60 italic">
              <span>Cost: {ADVISOR_COST}₪</span>
              <span>Secure AI Hub</span>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="h-16 lg:h-20 px-6 lg:px-8 bg-blue-600 text-white rounded-full lg:rounded-[32px] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all border-4 border-white/10 group relative"
        >
          <div className="flex flex-col items-end">
            <span className="text-sm lg:text-lg font-black leading-tight">העוזר הפיננסי</span>
            <span className="text-[9px] font-bold opacity-60 tracking-widest uppercase">AI Advisor</span>
          </div>
          <Bot size={32} className="group-hover:rotate-12 transition-transform" />
          
          {!isFree && (
            <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded-full border-2 border-slate-900 shadow-lg">{usesLeft}</div>
          )}
          {isFree && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full border-2 border-slate-900 animate-bounce shadow-lg">FREE</div>
          )}
        </button>
      )}
    </div>
  );
};

export default AIAdvisorPanel;
