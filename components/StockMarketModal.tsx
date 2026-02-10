
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShoppingCart, 
  DollarSign, 
  X, 
  History, 
  Info, 
  Briefcase,
  LineChart as ChartIcon,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { STOCK_MARKET } from '../constants';
import { PlayerState, Investment } from '../types';

interface Props {
  player: PlayerState;
  onTrade: (stockId: string, amount: number, isBuy: boolean) => void;
  onClose: () => void;
}

// Generate some fake historical data points for the graph
const generateHistoricalData = (baseReturn: number, volatility: number) => {
  const data = [];
  let currentPrice = 100;
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const years = ['2024', '2025'];
  
  // Create 12 months of data
  for (let i = 0; i < 12; i++) {
    const change = baseReturn + (Math.random() - 0.5) * volatility * 2;
    currentPrice = currentPrice * (1 + change);
    data.push({
      date: `${months[i]} 2024`,
      shortDate: months[i].substring(0, 3),
      price: Math.round(currentPrice * 100) / 100
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border-2 border-blue-500/50 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Calendar size={12} />
          {label}
        </p>
        <p className="text-xl font-black text-white mono-numbers flex items-center gap-2">
          <span className="text-emerald-400">₪</span>
          {payload[0].value.toLocaleString()}
        </p>
        <div className="mt-2 pt-2 border-t border-white/10">
           <p className="text-[8px] font-bold text-slate-500 uppercase">ביצועי שוק היסטוריים</p>
        </div>
      </div>
    );
  }
  return null;
};

const StockMarketModal: React.FC<Props> = ({ player, onTrade, onClose }) => {
  const [selectedStockId, setSelectedStockId] = useState(STOCK_MARKET[0].id);

  // Generate a fixed session performance snapshot for each stock when the modal is opened
  const sessionSnapshots = useMemo(() => {
    return STOCK_MARKET.reduce((acc, stock) => {
      const change = (stock.baseReturn * 0.5 + (Math.random() - 0.5) * stock.volatility) * 100;
      acc[stock.id] = {
        change: change.toFixed(2),
        isUp: change >= 0
      };
      return acc;
    }, {} as Record<string, { change: string, isUp: boolean }>);
  }, []);

  const selectedStock = useMemo(() => 
    STOCK_MARKET.find(s => s.id === selectedStockId) || STOCK_MARKET[0]
  , [selectedStockId]);

  const chartData = useMemo(() => 
    generateHistoricalData(selectedStock.baseReturn, selectedStock.volatility)
  , [selectedStockId]);

  const currentInvestment = player.investments.find(inv => inv.stockId === selectedStock.id);
  const canAfford = player.money >= 10000;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[110] p-0 lg:p-4">
      <div className="bg-white border-0 lg:border-8 border-black shadow-none lg:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] w-full max-w-7xl h-full lg:h-[90vh] flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:p-10 border-b-8 border-black shrink-0">
           <div className="text-right">
              <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">בורסה לניירות ערך // STOCKS</h2>
              <p className="font-bold text-slate-500 mt-2 text-sm lg:text-base">ניהול תיק השקעות, היסטוריית מדדים ומסחר פעיל</p>
           </div>
           <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1">
              <X size={32} />
           </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Sidebar - Stock List */}
          <div className="w-full lg:w-96 border-b-8 lg:border-b-0 lg:border-l-8 border-black overflow-y-auto no-scrollbar bg-slate-50 p-4 lg:p-8 space-y-4">
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 px-2">נכסים זמינים</h3>
             {STOCK_MARKET.map(stock => {
               const isActive = selectedStockId === stock.id;
               const owned = player.investments.find(inv => inv.stockId === stock.id);
               const snapshot = sessionSnapshots[stock.id];
               return (
                 <button 
                  key={stock.id}
                  onClick={() => setSelectedStockId(stock.id)}
                  className={`w-full p-6 border-4 border-black transition-all flex justify-between items-center group ${isActive ? 'bg-black text-white shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] translate-x-[-4px] translate-y-[-4px]' : 'bg-white hover:bg-slate-100'}`}
                 >
                    <div className="text-right flex-1">
                       <div className="flex items-center justify-between mb-1">
                          <p className="font-black text-lg">{stock.name}</p>
                          <span className={`flex items-center gap-1 text-[10px] font-black ${snapshot.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                             {snapshot.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                             {snapshot.change}%
                          </span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <p className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                             {owned ? `בבעלותך: ${owned.amount.toLocaleString()}₪` : 'לחץ לפרטים וניתוח'}
                          </p>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white/40' : 'text-slate-300'}`}>
                             Cap: {(stock as any).marketCap} | P/E: {(stock as any).peRatio} | Div: {(stock as any).dividendYield}
                          </p>
                       </div>
                    </div>
                 </button>
               );
             })}
          </div>

          {/* Main Panel - Details & Chart */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-10 custom-scroll">
             
             {/* Stock Info Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-right">
                <div className="text-right flex-1">
                   <div className="flex items-center gap-4 mb-2 flex-wrap justify-end">
                      <div className={`px-4 py-2 rounded-xl border-4 border-black font-black text-sm uppercase ${selectedStock.volatility > 0.1 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {selectedStock.volatility > 0.1 ? 'סיכון גבוה' : 'יציב'}
                      </div>
                      <h3 className="text-4xl lg:text-6xl font-black italic uppercase leading-none">{selectedStock.name}</h3>
                   </div>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs lg:text-sm">
                     תשואה חודשית צפויה: {(selectedStock.baseReturn * 100).toFixed(1)}% | תנודתיות: {(selectedStock.volatility * 100).toFixed(1)}%
                   </p>
                </div>
             </div>

             {/* Chart Section */}
             <div className="bg-slate-950 border-8 border-black p-4 lg:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] rounded-[40px] relative overflow-hidden">
                <div className="absolute top-6 left-10 flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                   LIVE MARKET PERFORMANCE
                </div>
                <div className="h-64 lg:h-96 w-full mt-8">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                        <XAxis 
                          dataKey="shortDate" 
                          stroke="#94a3b8" 
                          fontFamily="JetBrains Mono" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontFamily="JetBrains Mono" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          domain={['auto', 'auto']}
                          dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#10b981" 
                          strokeWidth={6} 
                          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} 
                          activeDot={{ r: 8, fill: '#fff', stroke: '#10b981', strokeWidth: 4 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                   <span>12M Performance History</span>
                   <span className="text-emerald-500">Asset Growth Index</span>
                </div>
             </div>

             {/* History & Context */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                   <h4 className="font-black text-xl mb-4 flex items-center gap-3 justify-end text-right">
                      היסטוריה ורקע // HISTORY
                      <History size={24} />
                   </h4>
                   <p className="text-slate-600 font-bold leading-relaxed text-right">
                     {selectedStock.description}
                   </p>
                </div>
                <div className="bg-slate-50 border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                   <h4 className="font-black text-xl mb-4 flex items-center gap-3 justify-end text-right">
                      סטטוס השקעה // STATUS
                      <Info size={24} />
                   </h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                         <span className="font-black text-xl mono-numbers">{currentInvestment ? currentInvestment.amount.toLocaleString() : 0} ₪</span>
                         <span className="font-bold text-slate-400">יתרה בבעלות:</span>
                      </div>
                      <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                         <span className="font-black text-xl mono-numbers text-blue-600">{player.money.toLocaleString()} ₪</span>
                         <span className="font-bold text-slate-400">מזומן פנוי:</span>
                      </div>
                      <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                         <span className="font-black text-xl mono-numbers">{(selectedStock as any).dividendYield}</span>
                         <span className="font-bold text-slate-400">תשואת דיבידנד:</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Trade Footer */}
        <footer className="p-6 lg:p-10 border-t-8 border-black bg-white shrink-0">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 w-full md:w-auto">
                 <button 
                    onClick={() => onTrade(selectedStock.id, 10000, true)}
                    disabled={!canAfford}
                    className={`flex-1 md:w-56 py-6 rounded-2xl border-4 border-black font-black text-xl uppercase flex items-center justify-center gap-3 transition-all ${canAfford ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none' : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'}`}
                 >
                    <ShoppingCart size={24} />
                    קנה 10K
                 </button>
                 <button 
                    onClick={() => onTrade(selectedStock.id, currentInvestment?.amount || 0, false)}
                    disabled={!currentInvestment || currentInvestment.amount <= 0}
                    className={`flex-1 md:w-56 py-6 rounded-2xl border-4 border-black font-black text-xl uppercase flex items-center justify-center gap-3 transition-all ${currentInvestment ? 'bg-black text-white hover:bg-slate-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none' : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'}`}
                 >
                    <DollarSign size={24} />
                    מכור הכל
                 </button>
              </div>
              <button 
                onClick={onClose}
                className="w-full md:w-auto px-12 py-6 bg-slate-900 text-white font-black text-xl rounded-2xl border-4 border-black hover:bg-blue-600 transition-all"
              >
                סיום מסחר
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default StockMarketModal;
