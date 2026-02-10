
import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Database, Trash2, Edit3, Save, X, Search, 
  Briefcase, Wallet, Heart, LogOut, RefreshCcw, ShieldX, 
  Plus, ShoppingBag, DollarSign, Activity, Check, AlertCircle, Package,
  Eye, EyeOff, Key, Layout, MapPin, Zap, Star, Coins, Landmark, TrendingUp,
  HelpCircle, Sparkles, Loader2, BarChart3, Percent, Monitor, GraduationCap, Laptop,
  Compass, Palette
} from 'lucide-react';
import { User, Career, ShopItem, GameEvent, BudgetCategory } from '../types';
import { sounds } from '../services/soundService';
import { generateEventContent } from '../services/geminiService';

interface Props {
  onLogout: () => void;
  isEmbed?: boolean;
  onUpdateCareers?: (careers: Career[]) => void;
  onUpdateShop?: (items: ShopItem[]) => void;
  onUpdateMissions?: (items: GameEvent[]) => void;
  onUpdateLuck?: (items: GameEvent[]) => void;
  onUpdateOpportunities?: (items: GameEvent[]) => void;
  onUpdateDecisions?: (items: GameEvent[]) => void;
  onUpdateStocks?: (items: any[]) => void;
  onUpdateBankRate?: (rate: number) => void;
  onUpdateBudgetCategories?: (cats: BudgetCategory[]) => void;
  onInspectUser?: (user: User) => void;
}

const AdminDashboard: React.FC<Props> = (props) => {
  const { onLogout, isEmbed = false, onInspectUser } = props;
  const [activeSection, setActiveSection] = useState<'users' | 'careers' | 'shop' | 'board' | 'budget'>('users');
  
  const [users, setUsers] = useState<User[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [budgetLibrary, setBudgetLibrary] = useState<BudgetCategory[]>([]);
  const [missions, setMissions] = useState<GameEvent[]>([]);
  const [luck, setLuck] = useState<GameEvent[]>([]);
  const [opportunities, setOpportunities] = useState<GameEvent[]>([]);
  const [decisions, setDecisions] = useState<GameEvent[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [bankRate, setBankRate] = useState<number>(0.1);
  
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [editingShop, setEditingShop] = useState<ShopItem | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);
  const [editingEvent, setEditingEvent] = useState<{ item: GameEvent, type: string } | null>(null);
  const [editingStock, setEditingStock] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showPasswordsMap, setShowPasswordsMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem('economy_users') || '[]'));
    setCareers(JSON.parse(localStorage.getItem('economy_careers') || '[]'));
    setShopItems(JSON.parse(localStorage.getItem('economy_shop') || '[]'));
    setBudgetLibrary(JSON.parse(localStorage.getItem('economy_budget_categories') || '[]'));
    setMissions(JSON.parse(localStorage.getItem('economy_missions') || '[]'));
    setLuck(JSON.parse(localStorage.getItem('economy_luck') || '[]'));
    setOpportunities(JSON.parse(localStorage.getItem('economy_opportunities') || '[]'));
    setDecisions(JSON.parse(localStorage.getItem('economy_decisions') || '[]'));
    setStocks(JSON.parse(localStorage.getItem('economy_stocks') || '[]'));
    setBankRate(parseFloat(localStorage.getItem('economy_bank_rate') || '0.1'));
  }, []);

  const save = (key: string, data: any, updateFn?: (d: any) => void) => {
    localStorage.setItem(key, JSON.stringify(data));
    if (updateFn) updateFn(data);
  };

  const handleDeleteUser = (email: string) => {
    if (!window.confirm(`האם למחוק את המשתמש ${email}?`)) return;
    const next = users.filter(u => u.email !== email);
    setUsers(next);
    localStorage.setItem('economy_users', JSON.stringify(next));
    sounds.playError();
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const next = users.map(u => u.email === editingUser.email ? editingUser : u);
    setUsers(next);
    localStorage.setItem('economy_users', JSON.stringify(next));
    setEditingUser(null);
    sounds.playSuccess();
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget) return;
    
    let next = [...budgetLibrary];
    if (isAddingNew) {
      next.push(editingBudget);
    } else {
      next = next.map(b => b.id === editingBudget.id ? editingBudget : b);
    }
    
    setBudgetLibrary(next);
    save('economy_budget_categories', next, props.onUpdateBudgetCategories);
    setEditingBudget(null);
    setIsAddingNew(false);
    sounds.playSuccess();
  };

  const handleDeleteBudget = (id: string) => {
    if (!window.confirm("למחוק קטגוריה זו מהמאגר הגלובלי?")) return;
    const next = budgetLibrary.filter(b => b.id !== id);
    setBudgetLibrary(next);
    save('economy_budget_categories', next, props.onUpdateBudgetCategories);
    sounds.playError();
  };

  const handleSaveCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCareer) return;
    let next = [...careers];
    if (isAddingNew) {
      next.push(editingCareer);
    } else {
      next = next.map(c => c.id === editingCareer.id ? editingCareer : c);
    }
    setCareers(next);
    save('economy_careers', next, props.onUpdateCareers);
    setEditingCareer(null);
    setIsAddingNew(false);
    sounds.playSuccess();
  };

  const handleDeleteCareer = (id: string) => {
    if (!window.confirm("האם למחוק קריירה זו?")) return;
    const next = careers.filter(c => c.id !== id);
    setCareers(next);
    save('economy_careers', next, props.onUpdateCareers);
    sounds.playError();
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;
    let next = [...shopItems];
    if (isAddingNew) {
      next.push(editingShop);
    } else {
      next = next.map(item => item.id === editingShop.id ? editingShop : item);
    }
    setShopItems(next);
    save('economy_shop', next, props.onUpdateShop);
    setEditingShop(null);
    setIsAddingNew(false);
    sounds.playSuccess();
  };

  const handleDeleteShop = (id: string) => {
    if (!window.confirm("האם למחוק פריט זה מהחנות?")) return;
    const next = shopItems.filter(item => item.id !== id);
    setShopItems(next);
    save('economy_shop', next, props.onUpdateShop);
    sounds.playError();
  };

  const handleAIEventGeneration = async () => {
    if (!editingEvent) return;
    setIsGeneratingAI(true);
    sounds.playRoll();
    try {
      const generated = await generateEventContent(editingEvent.type);
      setEditingEvent({
        ...editingEvent,
        item: {
          ...editingEvent.item,
          title: generated.title || editingEvent.item.title,
          description: generated.description || editingEvent.item.description,
          intel: generated.intel || editingEvent.item.intel,
          impact: generated.impact || editingEvent.item.impact
        }
      });
      sounds.playSuccess();
    } catch (error) {
      alert("נכשלה יצירת תוכן AI. נסה שוב.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    const { item, type } = editingEvent;
    let next: GameEvent[] = [];
    let storageKey = '';
    let updateFn: any;

    if (type === 'MISSION') { next = [...missions]; storageKey = 'economy_missions'; updateFn = props.onUpdateMissions; }
    else if (type === 'LUCK') { next = [...luck]; storageKey = 'economy_luck'; updateFn = props.onUpdateLuck; }
    else if (type === 'OPPORTUNITY') { next = [...opportunities]; storageKey = 'economy_opportunities'; updateFn = props.onUpdateOpportunities; }
    else if (type === 'DECISION') { next = [...decisions]; storageKey = 'economy_decisions'; updateFn = props.onUpdateDecisions; }

    if (isAddingNew) {
      next.push({ ...item });
    } else {
      next = next.map(ev => ev.title === item.title ? item : ev);
    }

    if (type === 'MISSION') setMissions(next);
    else if (type === 'LUCK') setLuck(next);
    else if (type === 'OPPORTUNITY') setOpportunities(next);
    else if (type === 'DECISION') setDecisions(next);

    save(storageKey, next, updateFn);
    setEditingEvent(null);
    setIsAddingNew(false);
    sounds.playSuccess();
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStock) return;
    let next = [...stocks];
    if (isAddingNew) {
      next.push(editingStock);
    } else {
      next = next.map(s => s.id === editingStock.id ? editingStock : s);
    }
    setStocks(next);
    save('economy_stocks', next, props.onUpdateStocks);
    setEditingStock(null);
    setIsAddingNew(false);
    sounds.playSuccess();
  };

  const handleDeleteStock = (id: string) => {
    if (!window.confirm("האם למחוק מניה זו מהבורסה?")) return;
    const next = stocks.filter(s => s.id !== id);
    setStocks(next);
    save('economy_stocks', next, props.onUpdateStocks);
    sounds.playError();
  };

  const handleDeleteEvent = (title: string, type: string) => {
    if (!window.confirm("האם למחוק אירוע זה?")) return;
    if (type === 'MISSION') { const n = missions.filter(m => m.title !== title); setMissions(n); save('economy_missions', n, props.onUpdateMissions); }
    if (type === 'LUCK') { const n = luck.filter(m => m.title !== title); setLuck(n); save('economy_luck', n, props.onUpdateLuck); }
    if (type === 'OPPORTUNITY') { const n = opportunities.filter(m => m.title !== title); setOpportunities(n); save('economy_opportunities', n, props.onUpdateOpportunities); }
    if (type === 'DECISION') { const n = decisions.filter(m => m.title !== title); setDecisions(n); save('economy_decisions', n, props.onUpdateDecisions); }
    sounds.playError();
  };

  return (
    <div className={`flex flex-col font-sans h-full overflow-hidden ${!isEmbed ? 'min-h-screen bg-slate-50' : ''}`} dir="rtl">
      {!isEmbed && (
        <header className="bg-slate-900 text-white p-6 shadow-2xl flex justify-between items-center z-20">
          <div className="flex items-center gap-6">
             <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Settings size={24} /></div>
             <div className="text-right">
                <h1 className="text-xl font-black italic tracking-tighter uppercase">Admin Panel // Economy OS</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">מערכת ניהול תוכן ומשתמשים</p>
             </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl font-black text-xs transition-all">התנתקות <LogOut size={16} /></button>
        </header>
      )}

      <main className={`flex-1 p-6 md:p-12 w-full space-y-10 overflow-y-auto custom-scroll ${!isEmbed ? 'max-w-7xl mx-auto' : ''}`}>
        
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="text-right flex-1">
              <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">מרכז שליטה // CORE</h2>
              <p className="font-bold text-slate-500">ניהול שחקנים, לוח משחק ותוכן</p>
           </div>
           
           <div className="flex bg-slate-200/50 p-2 rounded-3xl border-2 border-slate-200 flex-wrap">
              <button onClick={() => setActiveSection('users')} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 ${activeSection === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><Users size={16} /> משתמשים</button>
              <button onClick={() => setActiveSection('board')} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 ${activeSection === 'board' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><Layout size={16} /> לוח ואירועים</button>
              <button onClick={() => setActiveSection('budget')} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 ${activeSection === 'budget' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><Compass size={16} /> קטגוריות תקציב</button>
              <button onClick={() => setActiveSection('careers')} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 ${activeSection === 'careers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><Briefcase size={16} /> קריירות</button>
              <button onClick={() => setActiveSection('shop')} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2 ${activeSection === 'shop' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><ShoppingBag size={16} /> חנות</button>
           </div>
        </header>

        {activeSection === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-[40px] border-2 border-slate-200 shadow-sm overflow-hidden text-right">
                <header className="p-8 border-b-2 border-slate-100 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="חפש משתמש..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 py-3 pr-12 rounded-2xl text-sm font-bold text-right outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <h3 className="font-black text-xl italic uppercase">ניהול שחקנים וסיסמאות</h3>
                </header>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                            <tr>
                                <th className="p-6">אימייל שחקן</th>
                                <th className="p-6">סיסמה</th>
                                <th className="p-6">מזומן</th>
                                <th className="p-6">אושר</th>
                                <th className="p-6 text-left">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.filter(u=>u.email.includes(search)).map(u => (
                                <tr key={u.email} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold">{u.email}</td>
                                    <td className="p-6 font-black text-blue-600">
                                        <div className="flex items-center gap-3 justify-end">
                                            <span className="mono-numbers text-sm">{showPasswordsMap[u.email] ? u.password : '••••••••'}</span>
                                            <button onClick={() => setShowPasswordsMap(p => ({...p, [u.email]: !p[u.email]}))} className="text-slate-300 hover:text-blue-500">
                                                {showPasswordsMap[u.email] ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-6 font-black text-emerald-600 tabular-nums">{u.state?.money.toLocaleString()}₪</td>
                                    <td className="p-6 font-black text-red-500">{u.state?.happiness}%</td>
                                    <td className="p-6 text-left">
                                        <div className="flex gap-2 justify-start">
                                            <button onClick={()=>onInspectUser?.(u)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-1 font-bold text-xs" title="צפה בדשבורד"><Monitor size={18} /> דשבורד</button>
                                            <button onClick={()=>setEditingUser(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 size={18} /></button>
                                            <button onClick={()=>handleDeleteUser(u.email)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {activeSection === 'budget' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center text-right">
                <button onClick={() => { setIsAddingNew(true); setEditingBudget({ id: `bc_${Date.now()}`, label: '', color: 'bg-blue-500' }); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl"><Plus size={20} /> הוסף קטגוריית תקציב גלובלית</button>
                <h3 className="font-black text-2xl italic uppercase underline decoration-4 underline-offset-8">מאגר קטגוריות תקציב</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {budgetLibrary.map(cat => (
                    <div key={cat.id} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 flex justify-between items-center group hover:border-blue-500 transition-all">
                        <div className="flex gap-2">
                           <button onClick={() => { setIsAddingNew(false); setEditingBudget(cat); }} className="p-3 bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"><Edit3 size={18} /></button>
                           <button onClick={() => handleDeleteBudget(cat.id)} className="p-3 bg-slate-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"><Trash2 size={18} /></button>
                        </div>
                        <div className="text-right flex items-center gap-4">
                            <span className="text-xl font-black">{cat.label}</span>
                            <div className={`w-6 h-6 rounded-full ${cat.color} shadow-lg`} />
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        {activeSection === 'board' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 justify-end text-blue-600">
                        <div className="text-right">
                            <h4 className="font-black text-xl italic uppercase leading-none">מערכת בנקאות</h4>
                            <p className="text-[10px] font-bold text-slate-400">ניהול ריבית הלוואות מרכזית</p>
                        </div>
                        <Landmark size={32} />
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                        <label className="text-[11px] font-black uppercase text-slate-500 block mb-4 flex items-center justify-end gap-2">
                             ריבית שנתית נוכחית לסניף (%) <Percent size={14} />
                        </label>
                        <div className="flex items-center gap-4">
                             <input 
                                type="range" 
                                min="1" 
                                max="30" 
                                step="0.5"
                                value={bankRate * 100} 
                                onChange={(e)=>{ const r = parseFloat(e.target.value)/100; setBankRate(r); save('economy_bank_rate', r, props.onUpdateBankRate); }} 
                                className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                             />
                             <span className="mono-numbers font-black text-3xl text-blue-600 w-24 text-center">{(bankRate * 100).toFixed(1)}%</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-right mt-4 leading-relaxed">
                            שינוי זה משפיע על כל ההלוואות החדשות שנלקחות בסניף הבנק (משבצת כחולה).
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-xl space-y-6 flex flex-col">
                    <div className="flex items-center gap-3 justify-end text-purple-600">
                        <div className="text-right">
                            <h4 className="font-black text-xl italic uppercase leading-none">בורסה ומסחר</h4>
                            <p className="text-[10px] font-bold text-slate-400">ניהול רשימת הנכסים הפיננסיים</p>
                        </div>
                        <TrendingUp size={32} />
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-60 no-scrollbar">
                       {stocks.map(s => (
                           <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex justify-between items-center group">
                               <div className="flex gap-2">
                                   <button onClick={() => { setIsAddingNew(false); setEditingStock(s); }} className="p-2 text-blue-600 hover:bg-white rounded-xl shadow-sm transition-all"><Edit3 size={16}/></button>
                                   <button onClick={() => handleDeleteStock(s.id)} className="p-2 text-red-600 hover:bg-white rounded-xl shadow-sm transition-all"><Trash2 size={16}/></button>
                               </div>
                               <div className="text-right">
                                   <p className="font-black text-sm">{s.name}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                       Yield: {(s.baseReturn * 100).toFixed(1)}% | Risk: {s.volatility > 0.1 ? 'HIGH' : 'LOW'}
                                   </p>
                               </div>
                           </div>
                       ))}
                    </div>
                    
                    <button 
                        onClick={() => { setIsAddingNew(true); setEditingStock({ id: `s_${Date.now()}`, name: '', baseReturn: 0.01, volatility: 0.05, marketCap: '1.0B ₪', peRatio: '15.0', dividendYield: '2.0%', description: '' }); }}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-purple-600 transition-all shadow-lg"
                    >
                        <Plus size={18}/> הוסף נכס חדו לבורסה
                    </button>
                </div>
             </div>

             <div className="space-y-6">
                <header className="flex justify-between items-center text-right">
                    <button onClick={() => { setIsAddingNew(true); setEditingEvent({ type: 'LUCK', item: { type: 'LUCK', title: '', description: '', intel: '', impact: { money: 1000, happiness: 10 } } }); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-blue-600 transition-all"><Plus size={16} /> הוסף אירוע</button>
                    <h3 className="font-black text-2xl italic uppercase underline decoration-4 underline-offset-8">ספריות אירועים ומשבצות לוח</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-6 rounded-[32px] border-4 border-amber-100 space-y-4">
                      <div className="flex items-center gap-3 justify-end text-amber-600"><h4 className="font-black">משימות (Mission)</h4><Zap size={20} /></div>
                      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {missions.map(m => (
                            <div key={m.title} className="p-4 bg-amber-50 rounded-2xl flex justify-between items-center border border-amber-200">
                                <div className="flex gap-2"><button onClick={()=>setEditingEvent({ item: m, type: 'MISSION' })} className="p-1.5 text-blue-600 hover:bg-white rounded-lg"><Edit3 size={14}/></button><button onClick={()=>handleDeleteEvent(m.title, 'MISSION')} className="p-1.5 text-red-600 hover:bg-white rounded-lg"><Trash2 size={14}/></button></div>
                                <span className="font-bold text-sm text-right flex-1">{m.title}</span>
                            </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[32px] border-4 border-emerald-100 space-y-4">
                      <div className="flex items-center gap-3 justify-end text-emerald-600"><h4 className="font-black">מזל (Luck)</h4><Star size={20} /></div>
                      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {luck.map(m => (
                            <div key={m.title} className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center border border-emerald-200">
                                <div className="flex gap-2"><button onClick={()=>setEditingEvent({ item: m, type: 'LUCK' })} className="p-1.5 text-blue-600 hover:bg-white rounded-lg"><Edit3 size={14}/></button><button onClick={()=>handleDeleteEvent(m.title, 'LUCK')} className="p-1.5 text-red-600 hover:bg-white rounded-lg"><Trash2 size={14}/></button></div>
                                <span className="font-bold text-sm text-right flex-1">{m.title}</span>
                            </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[32px] border-4 border-blue-100 space-y-4">
                      <div className="flex items-center gap-3 justify-end text-blue-600"><h4 className="font-black">הזדמנויות (Opportunity)</h4><Coins size={20} /></div>
                      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {opportunities.map(m => (
                            <div key={m.title} className="p-4 bg-blue-50 rounded-2xl flex justify-between items-center border border-blue-200">
                                <div className="flex gap-2"><button onClick={()=>setEditingEvent({ item: m, type: 'OPPORTUNITY' })} className="p-1.5 text-blue-600 hover:bg-white rounded-lg"><Edit3 size={14}/></button><button onClick={()=>handleDeleteEvent(m.title, 'OPPORTUNITY')} className="p-1.5 text-red-600 hover:bg-white rounded-lg"><Trash2 size={14}/></button></div>
                                <span className="font-bold text-sm text-right flex-1">{m.title}</span>
                            </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[32px] border-4 border-purple-100 space-y-4">
                      <div className="flex items-center gap-3 justify-end text-purple-600"><h4 className="font-black">החלטות (Decision)</h4><HelpCircle size={20} /></div>
                      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {decisions.map(m => (
                            <div key={m.title} className="p-4 bg-purple-50 rounded-2xl flex justify-between items-center border border-purple-200">
                                <div className="flex gap-2"><button onClick={()=>setEditingEvent({ item: m, type: 'DECISION' })} className="p-1.5 text-blue-600 hover:bg-white rounded-lg"><Edit3 size={14}/></button><button onClick={()=>handleDeleteEvent(m.title, 'DECISION')} className="p-1.5 text-red-600 hover:bg-white rounded-lg"><Trash2 size={14}/></button></div>
                                <span className="font-bold text-sm text-right flex-1">{m.title}</span>
                            </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSection === 'careers' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center text-right">
                <button onClick={() => { setIsAddingNew(true); setEditingCareer({ id: `c_${Date.now()}`, name: '', salary: 5000, category: 'SERVICE', requirements: { degrees: [], equipment: [] } }); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl"><Plus size={20} /> הוסף קריירה חדשה</button>
                <h3 className="font-black text-2xl italic uppercase underline decoration-4 underline-offset-8">מערך הקריירות</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careers.map(job => (
                    <div key={job.id} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 flex justify-between items-center group hover:border-blue-500 hover:shadow-2xl transition-all">
                        <div className="flex-1 text-right">
                            <h4 className="text-2xl font-black mb-1">{job.name}</h4>
                            <p className="text-emerald-600 font-black text-lg mb-4">{job.salary.toLocaleString()}₪ / חודש</p>
                        </div>
                        <div className="flex flex-col gap-2 mr-6">
                            <button onClick={() => { setIsAddingNew(false); setEditingCareer(job); }} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"><Edit3 size={20} /></button>
                            <button onClick={() => handleDeleteCareer(job.id)} className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        {activeSection === 'shop' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center text-right">
                <button onClick={() => { setIsAddingNew(true); setEditingShop({ id: `s_${Date.now()}`, name: '', price: 1000, happiness: 10, type: 'LIFESTYLE', description: '' }); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl"><Plus size={20} /> הוסף פריט לחנות</button>
                <h3 className="font-black text-2xl italic uppercase underline decoration-4 underline-offset-8">מלאי החנות</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shopItems.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[32px] border-4 border-slate-100 flex flex-col justify-between hover:border-blue-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-2">
                               <button onClick={() => { setIsAddingNew(false); setEditingShop(item); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16} /></button>
                               <button onClick={() => handleDeleteShop(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                            <h4 className="font-black text-xl text-right">{item.name}</h4>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-slate-100 font-black text-xl">
                            <span className="text-[10px] text-slate-400 uppercase">{item.type}</span>
                            <span>{item.price.toLocaleString()}₪</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {editingBudget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSaveBudget} className="bg-white rounded-[40px] border-4 border-slate-900 p-10 max-w-md w-full space-y-6 shadow-2xl">
             <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setEditingBudget(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
                <h2 className="text-2xl font-black italic">ניהול קטגוריית תקציב // BUDGET</h2>
             </div>
             <div className="space-y-4 text-right">
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Label</label><input required value={editingBudget.label} onChange={(e)=>setEditingBudget({...editingBudget, label: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Color (Tailwind Class)</label><input required value={editingBudget.color} onChange={(e)=>setEditingBudget({...editingBudget, color: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-right" placeholder="bg-blue-500" /></div>
                <div className="flex items-center gap-4 justify-end">
                    <span className="text-xs font-bold text-slate-400">תצוגה מקדימה:</span>
                    <div className={`w-8 h-8 rounded-full ${editingBudget.color} border-2 border-white shadow-lg`} />
                </div>
             </div>
             <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Save size={18} /> שמור קטגוריה</button>
          </form>
        </div>
      )}

      {editingCareer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSaveCareer} className="bg-white rounded-[40px] border-4 border-slate-900 p-10 max-w-md w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setEditingCareer(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
                <h2 className="text-2xl font-black italic">ניהול קריירה // CAREER</h2>
             </div>
             <div className="space-y-4 text-right">
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Job Name</label><input required value={editingCareer.name} onChange={(e)=>setEditingCareer({...editingCareer, name: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Monthly Salary (₪)</label><input type="number" required value={editingCareer.salary} onChange={(e)=>setEditingCareer({...editingCareer, salary: parseInt(e.target.value)})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Category</label>
                    <select value={editingCareer.category} onChange={(e)=>setEditingCareer({...editingCareer, category: e.target.value as any})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-bold text-right outline-none">
                        <option value="SERVICE">שירותים</option>
                        <option value="TECH">טכנולוגיה</option>
                        <option value="LEGAL">משפטים</option>
                        <option value="MEDICAL">רפואה</option>
                        <option value="FINANCE">פיננסים</option>
                        <option value="EDUCATION">חינוך</option>
                    </select>
                </div>
             </div>
             <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Save size={18} /> שמור קריירה</button>
          </form>
        </div>
      )}

      {editingShop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSaveShop} className="bg-white rounded-[40px] border-4 border-slate-900 p-10 max-w-md w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setEditingShop(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
                <h2 className="text-2xl font-black italic">ניהול מוצר // SHOP ITEM</h2>
             </div>
             <div className="space-y-4 text-right">
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Item Name</label><input required value={editingShop.name} onChange={(e)=>setEditingShop({...editingShop, name: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Price (₪)</label><input type="number" required value={editingShop.price} onChange={(e)=>setEditingShop({...editingShop, price: parseInt(e.target.value)})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Happiness Bonus (%)</label><input type="number" required value={editingShop.happiness} onChange={(e)=>setEditingShop({...editingShop, happiness: parseInt(e.target.value)})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Type</label>
                    <select value={editingShop.type} onChange={(e)=>setEditingShop({...editingShop, type: e.target.value as any})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-bold text-right outline-none">
                        <option value="LIFESTYLE">לייף סטייל</option>
                        <option value="EQUIPMENT">ציוד מקצועי</option>
                    </select>
                </div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Description</label><textarea value={editingShop.description} onChange={(e)=>setEditingShop({...editingShop, description: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" rows={2} /></div>
             </div>
             <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Save size={18} /> שמור מוצר</button>
          </form>
        </div>
      )}

      {editingStock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSaveStock} className="bg-white rounded-[40px] border-4 border-slate-900 p-10 max-w-md w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setEditingStock(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
                <h2 className="text-2xl font-black italic">ניהול מניה // ASSET</h2>
             </div>
             <div className="space-y-4 text-right">
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">שם המניה / המדד</label><input required value={editingStock.name} onChange={(e)=>setEditingStock({...editingStock, name: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-black text-slate-400 block mb-1">תשואה בסיסית (0.01 = 1%)</label><input type="number" step="0.001" value={editingStock.baseReturn} onChange={(e)=>setEditingStock({...editingStock, baseReturn: parseFloat(e.target.value)})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-center" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 block mb-1">תנודתיות / סיכון (0.05+ = גבוה)</label><input type="number" step="0.001" value={editingStock.volatility} onChange={(e)=>setEditingStock({...editingStock, volatility: parseFloat(e.target.value)})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-center" /></div>
                </div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">תיאור קצר</label><textarea value={editingStock.description} onChange={(e)=>setEditingStock({...editingStock, description: e.target.value})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" rows={2} /></div>
                <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1">שווי שוק</label><input value={editingStock.marketCap} onChange={(e)=>setEditingStock({...editingStock, marketCap: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-[10px] font-bold text-center" /></div>
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1">מכפיל רווח</label><input value={editingStock.peRatio} onChange={(e)=>setEditingStock({...editingStock, peRatio: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-[10px] font-bold text-center" /></div>
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1">דיבידנד</label><input value={editingStock.dividendYield} onChange={(e)=>setEditingStock({...editingStock, dividendYield: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-[10px] font-bold text-center" /></div>
                </div>
             </div>
             <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition-all"><Save size={18} /> שמור מניה</button>
          </form>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSaveEvent} className="bg-white rounded-[40px] border-4 border-slate-900 p-10 max-w-md w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
                <h2 className="text-2xl font-black italic">ניהול אירוע // EVENT</h2>
             </div>
             
             <button 
                type="button"
                onClick={handleAIEventGeneration}
                disabled={isGeneratingAI}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
             >
                {isGeneratingAI ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {isGeneratingAI ? 'מג\'נרט תוכן...' : 'צור תוכן חכם עם AI'}
             </button>

             <div className="space-y-4 text-right">
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">סוג אירוע</label>
                    <select value={editingEvent.type} onChange={(e)=>setEditingEvent({...editingEvent, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-bold text-right outline-none">
                        <option value="LUCK">מזל (Luck)</option>
                        <option value="MISSION">משימה (Mission)</option>
                        <option value="OPPORTUNITY">הזדמנות (Opportunity)</option>
                        <option value="DECISION">החלטה (Decision)</option>
                    </select>
                </div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">כותרת האירוע</label><input required value={editingEvent.item.title} onChange={(e)=>setEditingEvent({...editingEvent, item: {...editingEvent.item, title: e.target.value}})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">תיאור לשחקן</label><textarea required value={editingEvent.item.description} onChange={(e)=>setEditingEvent({...editingEvent, item: {...editingEvent.item, description: e.target.value}})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" rows={3} /></div>
                <div><label className="text-[10px] font-black text-slate-400 block mb-1">טיפ "EDDIE"</label><input value={editingEvent.item.intel} onChange={(e)=>setEditingEvent({...editingEvent, item: {...editingEvent.item, intel: e.target.value}})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-right" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-black text-slate-400 block mb-1">שינוי כסף</label><input type="number" value={editingEvent.item.impact?.money || 0} onChange={(e)=>setEditingEvent({...editingEvent, item: {...editingEvent.item, impact: {...editingEvent.item.impact, money: parseInt(e.target.value)}}})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-center" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 block mb-1">שינוי אושר</label><input type="number" value={editingEvent.item.impact?.happiness || 0} onChange={(e)=>setEditingEvent({...editingEvent, item: {...editingEvent.item, impact: {...editingEvent.item.impact, happiness: parseInt(e.target.value)}}})} className="w-full border-2 border-slate-200 p-3 rounded-xl font-black text-center" /></div>
                </div>
             </div>
             <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Save size={18} /> שמור אירוע</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
