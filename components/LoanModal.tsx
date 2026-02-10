
import React from 'react';
import { Landmark, AlertTriangle, ArrowRightLeft, Undo2, Trophy, Percent, TrendingUp } from 'lucide-react';

interface Props {
  requiredAmount: number;
  interestRate: number;
  canCancel: boolean;
  onAccept: (amount: number) => void;
  onDecline: () => void;
  onCancel: () => void;
}

const LoanModal: React.FC<Props> = ({ requiredAmount, interestRate, canCancel, onAccept, onDecline, onCancel }) => {
  const loanOptions = [
    { amount: 5000 },
    { amount: 15000 },
    { amount: 50000 },
    { amount: 150000 },
    { amount: 500000 },
  ].filter(opt => opt.amount >= requiredAmount || opt.amount === 500000);

  const displayRate = (interestRate * 100).toFixed(0);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-10 overflow-hidden relative">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-black text-white border-4 border-black flex items-center justify-center">
            <Landmark size={48} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-black mb-4 uppercase tracking-tighter italic">
          {requiredAmount > 0 ? 'חסר לך כסף!' : 'שירותי בנקאות'}
        </h2>
        <p className="text-black font-bold text-center text-lg mb-8 leading-tight">
          {requiredAmount > 0 
            ? 'אין לך מספיק מזומן לביצוע הפעולה. הבנק מציע לך הלוואה מיידית.' 
            : 'ברוך הבא לסניף. כאן תוכל לקחת הלוואה בתנאים מועדפים.'}
        </p>

        <div className="space-y-4 mb-8">
          <div className={`border-4 p-4 flex items-start gap-3 ${interestRate < 0.15 ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500'}`}>
            <Percent className={interestRate < 0.15 ? 'text-blue-600' : 'text-red-600'} size={24} />
            <p className={`text-sm font-black uppercase leading-tight ${interestRate < 0.15 ? 'text-blue-900' : 'text-red-900'}`}>
              ריבית של {displayRate}% מתווספת בכל חודש!
              {interestRate < 0.15 && <span className="block text-[10px] mt-1 italic">בונוס: הגעת לסניף הבנק!</span>}
            </p>
          </div>
          <div className="bg-amber-50 border-4 border-amber-500 p-4 flex items-start gap-3">
            <Trophy className="text-amber-600 shrink-0 mt-1" size={24} />
            <p className="text-sm font-black uppercase leading-tight text-amber-900">
              חשוב: בעלי חוב נפסלים אוטומטית מלוח המובילים!
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8 max-h-[250px] overflow-y-auto no-scrollbar pr-2 custom-scroll">
          {loanOptions.map((opt, i) => {
            const interestAmount = opt.amount * interestRate;
            const totalRepayment = opt.amount + interestAmount;
            return (
              <button
                key={i}
                onClick={() => onAccept(opt.amount)}
                className="w-full p-5 bg-white hover:bg-slate-50 border-4 border-black flex flex-col transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
              >
                <div className="w-full flex justify-between items-center mb-2">
                  <div className="text-right">
                    <p className="font-black text-xl tracking-tighter">קבל {opt.amount.toLocaleString()} ₪</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">הלוואה מיידית</p>
                  </div>
                  <ArrowRightLeft size={24} className="text-black group-hover:text-blue-600 transition-colors" />
                </div>
                
                <div className="w-full pt-3 border-t-2 border-slate-100 flex justify-between items-center bg-slate-50/50 px-2 py-1 rounded-lg">
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">סה"כ להחזר (חודש הבא)</p>
                     <p className="text-sm font-black text-red-600 mono-numbers">{Math.round(totalRepayment).toLocaleString()} ₪</p>
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">ריבית</p>
                     <p className="text-sm font-bold text-slate-800 mono-numbers">+{Math.round(interestAmount).toLocaleString()} ₪</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
            {canCancel && (
                <button
                    onClick={onCancel}
                    className="w-full py-5 bg-black text-white font-black text-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1"
                >
                    <Undo2 size={24} />
                    ביטול / סגור
                </button>
            )}
            {requiredAmount > 0 && (
              <button
                  onClick={onDecline}
                  className="w-full py-3 text-black text-xs font-black uppercase tracking-widest hover:underline decoration-2"
              >
                  אני מוותר - סיום המשחק
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoanModal;
