
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn, Cpu, Eye, EyeOff } from 'lucide-react';
import { sounds } from '../services/soundService';
import { User, PlayerState } from '../types';
import { CAREERS, BUDGET_CATEGORIES } from '../constants';

interface Props {
  onLogin: (user: User) => void;
  onSignUp: (user: User) => void;
  logo?: React.ReactNode;
}

const getFreshDefaultState = (): PlayerState => ({
  money: 5000,
  savings: 0,
  happiness: 50,
  currentPosition: 0,
  tilesTraversed: 0,
  job: { ...CAREERS[0] },
  degrees: [],
  inventory: [],
  investments: [],
  loans: 0,
  failedMissionsCount: 0,
  gameOver: false,
  houseType: 'RENTAL',
  appearance: {
    gender: 'MALE',
    skin: '#FFDBAC',
    hair: '#2d1b0d',
    shirt: '#3b82f6',
    pants: '#1e293b',
    shoes: '#111111',
    face: 'SMILE'
  },
  budget: {},
  // Added missing properties to satisfy PlayerState interface
  activeBudgetCategoryIds: BUDGET_CATEGORIES.map(c => c.id),
  customBudgetCategories: [],
  recentTransactions: [],
  history: [{ month: 0, money: 5000, happiness: 50 }]
});

const AuthScreen: React.FC<Props> = ({ onLogin, onSignUp, logo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    sounds.playClick();

    const users: User[] = JSON.parse(localStorage.getItem('economy_users') || '[]');
    const lowerEmail = email.toLowerCase().trim();

    if (isLogin) {
      let user = users.find(u => u.email.toLowerCase() === lowerEmail && u.password === password);
      const isMasterAdmin = (lowerEmail === 'neweco@gmail.com' && password === 'admin123');

      if (isMasterAdmin) {
        if (!user) {
          const adminUser: User = {
            email: lowerEmail,
            password: password,
            role: 'ADMIN',
            state: getFreshDefaultState()
          };
          users.push(adminUser);
          localStorage.setItem('economy_users', JSON.stringify(users));
          user = adminUser;
        }
        onLogin(user);
        sounds.playSuccess();
        return;
      }

      if (user) {
        onLogin(user);
        sounds.playSuccess();
      } else {
        setError('אימייל או סיסמה לא נכונים.');
        sounds.playError();
      }
    } else {
      if (users.find(u => u.email.toLowerCase() === lowerEmail)) {
        setError('המשתמש כבר קיים במערכת');
        sounds.playError();
        return;
      }
      
      const newUser: User = {
        email: lowerEmail,
        password,
        role: lowerEmail === 'neweco@gmail.com' ? 'ADMIN' : 'USER',
        state: getFreshDefaultState()
      };
      
      users.push(newUser);
      localStorage.setItem('economy_users', JSON.stringify(users));
      onSignUp(newUser);
      sounds.playSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>

      <div className="max-w-md w-full bg-slate-900 border-4 border-slate-800 rounded-[48px] p-10 relative z-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <Cpu size={120} className="text-blue-500" />
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 rounded-full"></div>
            {logo || (
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] border-4 border-white/10">
                    <ShieldCheck size={40} className="text-white" />
                </div>
            )}
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase text-center">
            כלכלה חדשה <br/> <span className="text-blue-500 text-sm tracking-[0.4em]">Secure Access</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-4">User Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 pr-4 pl-12 text-white font-bold focus:border-blue-500 outline-none transition-all text-right"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-4">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 pr-12 pl-12 text-white font-bold focus:border-blue-500 outline-none transition-all text-right"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-black text-center animate-pulse bg-red-500/10 py-2 rounded-lg">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isLogin ? 'התחברות' : 'רישום למערכת'}
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); sounds.playClick(); }}
            className="text-slate-400 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            {isLogin ? 'אין לך חשבון? הירשם כאן' : 'כבר רשום? התחבר עכשיו'}
            <ArrowRight size={14} className={isLogin ? '' : 'rotate-180'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
