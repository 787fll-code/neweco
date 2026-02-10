
import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  PiggyBank, 
  TrendingUp, 
  ArrowRightLeft, 
  X, 
  Info,
  BadgePercent,
  ChevronLeft,
  Banknote,
  CreditCard,
  History,
  AlertCircle
} from 'lucide-react';
import { PlayerState } from '../types';
import { BANK_LOAN_INTEREST_RATE } from '../constants';

interface Props {
  player: PlayerState;
  onTakeLoan: (amount: number) => void;
  onDeposit: (amount: number) => void;
  onClose: () => void;
}

const BankBranchModal: React.FC<Props> = ({ player, onTakeLoan, onDeposit, onClose }) => {
  const [activeTab, setActiveTab] = useState<'loans' | 'savings' | 'credit'>('loans');

  const creditScore = player.loans > 0 ? 'נמוך' : player.money > 50000 ? 'מעולה' : 'טוב';
  const scoreColor = player.loans > 0 ? 'text-red-500' : player.money > 50000 ? 'text-emerald-500' : 'text-blue-500';

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-[110] p-0 md:p-4">
      <div className="bg-white border-0 md:border-8 border-slate-800 shadow-none md:shadow-[24px_24px_0px_0px_rgba(30,41,59,1)] w-full max-w-5xl h-full md:h-[85vh] flex flex-col relative overflow-hidden rounded-none md:rounded-[48px]">
        
        <header className="p-8 md:p-12 flex justify-between items-start border-b-8 border-slate-100 shrink-0 bg-white">
          <div className="text-right">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">מרכז בנקאות פרטית // BANK</h2>
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                 <Landmark size={32} />
              </div>
            </div>
            <p className="font-bold text-slate-500 text-sm md:text-base">שירותי VIP לניהול הון, מינוף וצמיחה פיננסית</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl transition-all border-4 border-slate-200 active:translate-y-1">
            <X size={28} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-20 md:w-56 border-l-8 border-slate-100 bg-slate-50 flex flex-col">
            {[
                { id: 'loans', label: 'הלוואות', icon: <Banknote size={28} /> },
                { id: 'savings', label: 'פיקדונות', icon: <PiggyBank size={28} /> },
                { id: 'credit', label: 'כרטיס אשראי', icon: <CreditCard size={28} /> }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white border-r-8 border-slate-900 text-slate-900 shadow-inner' : 'hover:bg-slate-100 text-slate-300'}`}
                >
                  {tab.icon}
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">{tab.label}</span>
                </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar custom-scroll space-y-10">
            
            {/* Dynamic Status Banner */}
            <div className="bg-slate-950 text-white p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl border-4 border-slate-800">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center border-2 border-blue-500/30">
                    <ShieldCheck size={32} className="text-blue-400" />
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">דירוג אשראי של הלקוח</p>
                     <p className={`text-3xl font-black italic ${scoreColor}`}>{creditScore}</p>
                  </div>
               </div>
               <div className="h-12 w-1 bg-white/10 hidden md:block"></div>
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">יתרה נזילה זמינה</p>
                  <p className="text-3xl font-black mono-numbers text-emerald-400">{player.money.toLocaleString()} ₪</p>
               </div>
            </div>

            {activeTab === 'loans' && (
              <div className="space-y-8 animate-in slide-in-from-left duration-300">
                <div className="text-right">
                   <h3 className="text-3xl font-black mb-2 italic">מסלולי מימון מיוחדים</h3>
                   <p className="text-slate-500 font-bold">הלוואות בתנאי ריבית מועדפת ({(BANK_LOAN_INTEREST_RATE * 100).toFixed(0)}%) ללקוחות הסניף בלבד.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[15000, 75000, 300000].map(amount => (
                    <button 
                      key={amount}
                      onClick={() => onTakeLoan(amount)}
                      className="group p-8 bg-white border-4 border-slate-100 rounded-[32px] flex flex-col items-center gap-4 hover:border-slate-900 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1"
                    >
                      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                        <Banknote size={32} className="text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <div className="text-center">
                         <p className="text-2xl font-black mono-numbers">{amount.toLocaleString()} ₪</p>
                         <p className="text-[10px] font-black text-emerald-600 uppercase mt-1">ריבית { (BANK_LOAN_INTEREST_RATE * 100).toFixed(0) }% שנתית</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-8 bg-amber-50 border-4 border-amber-200 rounded-[32px] flex items-start gap-6">
                  <AlertCircle className="text-amber-500 shrink-0 mt-1" size={28} />
                  <div className="text-right">
                    <h4 className="font-black text-amber-900 mb-1">לפני שאתה לוקח הלוואה:</h4>
                    <p className="text-sm font-bold text-amber-800 leading-relaxed">
                        הלוואה היא כלי עוצמתי לצמיחה אם משתמשים בה להשקעות (לימודים, מניות, נדל"ן). 
                        אבל זכור - עליך להחזיר אותה, והריבית תנגוס לך ברווחים בכל חודש.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'savings' && (
              <div className="space-y-8 animate-in slide-in-from-left duration-300">
                <div className="text-right">
                   <h3 className="text-3xl font-black mb-2 italic">פיקדון בנקאי "סגור"</h3>
                   <p className="text-slate-500 font-bold">השקעה בסיכון אפס. קבל 5% תשואה מובטחת על כל שקל שתפקיד.</p>
                </div>

                <div className="bg-slate-50 p-10 rounded-[48px] border-8 border-white shadow-inner text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12">
                      <PiggyBank size={200} />
                   </div>
                   
                   <div className="relative z-10">
                       <div className="inline-flex p-6 bg-white rounded-3xl border-4 border-slate-100 mb-6 shadow-xl">
                         <TrendingUp size={48} className="text-emerald-500" />
                       </div>
                       <h4 className="text-4xl font-black mb-2 italic">סך הכל בחיסכון:</h4>
                       <p className="text-6xl font-black mono-numbers text-slate-900 mb-10">{player.savings.toLocaleString()} ₪</p>
                       
                       <div className="flex flex-col md:flex-row gap-4 justify-center">
                          <button 
                            onClick={() => onDeposit(15000)}
                            disabled={player.money < 15000}
                            className={`px-10 py-6 rounded-3xl font-black text-xl transition-all shadow-xl ${player.money >= 15000 ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                          >
                            הפקד 15,000 ₪
                          </button>
                          <button 
                            onClick={() => onDeposit(player.money)}
                            disabled={player.money < 5000}
                            className={`px-10 py-6 rounded-3xl font-black text-xl transition-all border-4 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white shadow-xl ${player.money >= 5000 ? 'bg-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                          >
                            הפקד את כל היתרה
                          </button>
                       </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-emerald-50 border-4 border-emerald-100 rounded-3xl flex items-center gap-4">
                      <BadgePercent size={32} className="text-emerald-500" />
                      <div className="text-right">
                         <p className="font-black text-emerald-900">תשואה מובטחת</p>
                         <p className="text-xs font-bold text-emerald-700">5% ריבית מתווספת בכל payday</p>
                      </div>
                   </div>
                   <div className="p-6 bg-blue-50 border-4 border-blue-100 rounded-3xl flex items-center gap-4">
                      <ShieldCheck size={32} className="text-blue-500" />
                      <div className="text-right">
                         <p className="font-black text-blue-900">ביטחון מלא</p>
                         <p className="text-xs font-bold text-blue-700">הפיקדון מבוטח ע"י המדינה</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'credit' && (
                <div className="space-y-8 animate-in slide-in-from-left duration-300">
                    <div className="text-right">
                        <h3 className="text-3xl font-black mb-2 italic">כרטיס אשראי GOLD</h3>
                        <p className="text-slate-500 font-bold">אשראי מיידי לביצוע רכישות בחנות גם כשאין לך מזומן.</p>
                    </div>

                    <div className="relative h-64 w-full max-w-md mx-auto perspective-1000">
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-[32px] p-10 border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                            <div className="flex justify-between items-start">
                                <Landmark size={32} className="text-blue-400" />
                                <div className="w-16 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg border-2 border-white/20"></div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-[0.4em] opacity-50 mb-1">CREDIT LINE STATUS</p>
                                <p className="text-2xl font-black mono-numbers tracking-widest">**** **** **** 2025</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-lg font-black uppercase italic tracking-tighter">PLAYER ONE</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                                    <div className="w-8 h-8 rounded-full bg-amber-500/80 -ml-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-slate-900 p-8 rounded-[40px] text-right space-y-4 shadow-xl">
                        <h4 className="font-black text-xl mb-4 flex items-center gap-3 justify-end">
                            פרטי הכרטיס <Info size={20} className="text-blue-500" />
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
                                <span className="font-black text-xl mono-numbers">10,000 ₪</span>
                                <span className="font-bold text-slate-400">מסגרת אשראי:</span>
                            </div>
                            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
                                <span className="font-black text-xl text-red-500">25%</span>
                                <span className="font-bold text-slate-400">ריבית על פיגור:</span>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 pt-4 italic">כרטיס האשראי מאפשר לך לקנות בחנות גם אם המזומן נגמר, אך החוב יתווסף ללוח המובילים כחוב מעיק.</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="p-8 bg-slate-50 border-t-8 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
           <div className="flex items-center gap-4 text-slate-500">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border-2 border-slate-100">
                <Info size={24} className="text-blue-600" />
             </div>
             <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 italic">Financial Education Advisory</p>
                <p className="text-[10px] font-bold text-slate-400">הייעוץ של EDDIE בחינם עבור לקוחות המרכז בנקאות פרטית.</p>
             </div>
           </div>
           <button 
             onClick={onClose}
             className="w-full md:w-auto px-16 py-5 bg-slate-900 text-white font-black text-xl rounded-2xl hover:bg-blue-600 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
           >
             צא מהסניף
           </button>
        </footer>
      </div>
    </div>
  );
};

export default BankBranchModal;
