
import React from 'react';
import { TrendingDown, TrendingUp, BarChart3, Receipt, Wallet } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  salary: number;
  expenses: number;
  inventory: string[];
  investmentsResults?: { name: string, change: number, profit: number, stockId: string }[];
  recentTransactions: Transaction[];
  onClose: (keep: boolean) => void;
}

const MonthlySummary: React.FC<Props> = ({ salary, expenses, inventory, investmentsResults, recentTransactions, onClose }) => {
  const totalInvestmentProfit = investmentsResults?.reduce((acc, curr) => acc + curr.profit, 0) || 0;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-xl flex items-center justify-center z-[60] p-4">
      <div className="bg-white border-4 lg:border-8 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] lg:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full p-6 lg:p-12 relative overflow-y-auto max-h-[95vh] custom-scroll">
        
        <h2 className="text-3xl lg:text-5xl font-black text-center text-black mb-8 lg:mb-12 italic underline decoration-4 lg:decoration-8 underline-offset-4 lg:underline-offset-8 uppercase tracking-tighter">דוח תזרים חודשי</h2>
        
        <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12 text-right">
          <div className="flex justify-between items-center p-4 lg:p-6 border-4 border-black bg-emerald-50 text-emerald-900">
            <div className="flex items-center gap-3 lg:gap-4">
              <TrendingUp size={window.innerWidth < 768 ? 24 : 32} />
              <span className="font-black text-sm lg:text-xl uppercase tracking-widest">הכנסת שכר</span>
            </div>
            <span className="text-xl lg:text-3xl font-black tabular-nums">+{salary.toLocaleString()} ₪</span>
          </div>

          <div className="p-6 lg:p-8 border-4 border-black bg-red-50 text-red-900">
            <div className="flex items-center justify-between mb-4 lg:mb-6 border-b-2 border-red-200 pb-3 lg:pb-4">
              <span className="text-xl lg:text-3xl font-black tabular-nums">-{expenses.toLocaleString()} ₪</span>
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="font-black text-sm lg:text-xl uppercase tracking-widest">סה"כ הוצאות תחזוקה</span>
                <TrendingDown size={window.innerWidth < 768 ? 24 : 32} />
              </div>
            </div>
            <p className="text-xs font-bold opacity-60 text-right italic">
              הוצאות אלו כוללות שכירות, אחזקת רכב, מנויים וציוד בבעלותך.
            </p>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-3xl border-4 border-black">
              <div className="flex justify-between items-center">
                  <span className={`text-2xl lg:text-4xl font-black mono-numbers ${salary - expenses >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(salary - expenses).toLocaleString()} ₪
                  </span>
                  <div className="flex items-center gap-3">
                      <span className="font-black text-lg uppercase tracking-widest">יתרה לתנועה</span>
                      <Wallet size={24} />
                  </div>
              </div>
          </div>

          {recentTransactions.length > 0 && (
            <div className="p-6 lg:p-8 border-4 border-black bg-slate-50 text-slate-900">
                <h3 className="text-base lg:text-xl font-black uppercase tracking-widest mb-4 lg:mb-6 flex items-center justify-end gap-3 lg:gap-4 border-b-2 border-slate-200 pb-3 lg:pb-4">
                    פעולות החודש <Receipt size={window.innerWidth < 768 ? 24 : 32} />
                </h3>
                <div className="space-y-2 lg:space-y-3 max-h-[150px] overflow-y-auto no-scrollbar">
                    {recentTransactions.map((tx, i) => (
                        <div key={i} className="flex justify-between text-xs lg:text-sm">
                            <span className={`font-black ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString()} ₪
                            </span>
                            <span className="font-bold opacity-70">{tx.description}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {investmentsResults && investmentsResults.length > 0 && (
            <div className="p-6 lg:p-8 border-4 border-black bg-blue-50 text-blue-900">
              <h3 className="text-base lg:text-xl font-black uppercase tracking-widest mb-4 lg:mb-6 flex items-center justify-end gap-3 lg:gap-4 border-b-2 border-blue-200 pb-3 lg:pb-4">
                ביצועי תיק מניות <BarChart3 size={window.innerWidth < 768 ? 24 : 32} />
              </h3>
              <div className="space-y-3 lg:space-y-4 text-sm lg:text-lg">
                {investmentsResults.map((inv, i) => (
                  <div key={i} className="flex justify-between items-center text-right">
                    <div className="flex gap-3 lg:gap-4 items-center font-black">
                        <span className={inv.change >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                            {inv.change >= 0 ? '▲' : '▼'} {(inv.change * 100).toFixed(1)}%
                        </span>
                        <span className="tabular-nums">
                          {inv.profit >= 0 ? '+' : ''}{inv.profit.toLocaleString()} ₪
                        </span>
                    </div>
                    <span className="font-black">{inv.name}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t-2 border-blue-200 pt-3 lg:pt-4 mt-4 lg:mt-6">
                    <span className={`text-xl lg:text-2xl font-black ${totalInvestmentProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {totalInvestmentProfit >= 0 ? '+' : ''}{totalInvestmentProfit.toLocaleString()} ₪
                    </span>
                    <span className="font-black">סה״כ רווח/הפסד השקעות</span>
                </div>
              </div>
              <div className="mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <button onClick={() => onClose(true)} className="py-3 lg:py-4 bg-white border-4 border-black font-black text-sm lg:text-base hover:bg-black hover:text-white transition-all">המשך להחזיק במניות</button>
                  <button onClick={() => onClose(false)} className="py-3 lg:py-4 bg-black text-white border-4 border-black font-black text-sm lg:text-base hover:bg-slate-800 transition-all">מכור את כל התיק עכשיו</button>
              </div>
            </div>
          )}
        </div>

        {(!investmentsResults || investmentsResults.length === 0) && (
            <button
              onClick={() => onClose(true)}
              className="w-full py-5 lg:py-6 bg-black text-white font-black text-xl lg:text-2xl border-4 border-black hover:bg-slate-800 transition-all active:translate-x-1 active:translate-y-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] lg:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              אשר דוח והמשך &gt;
            </button>
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;
