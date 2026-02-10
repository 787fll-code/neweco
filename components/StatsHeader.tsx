
import React, { useMemo } from 'react';
import { Wallet, Heart, Briefcase, Activity, Landmark, User as UserIcon, Compass } from 'lucide-react';
import { PlayerState } from '../types';
import { BUDGET_CATEGORIES } from '../constants';

interface Props { 
  state: PlayerState; 
  userName?: string;
}

const StatsHeader: React.FC<Props> = ({ state, userName }) => {
  // חישוב סה"כ תקציב מתוכנן
  const totalPlanned = useMemo(() => {
    const activeIds = state.activeBudgetCategoryIds || [];
    return activeIds.reduce((acc, id) => acc + (state.budget[id] || 0), 0);
  }, [state.budget, state.activeBudgetCategoryIds]);

  return (
    <div className="min-h-16 md:h-24 bg-white border-b border-slate-200 flex flex-wrap items-center px-4 md:px-12 py-2 md:py-0 gap-4 md:gap-10 sticky top-0 z-40 shadow-sm">
      {/* User Identity Section */}
      <div className="flex items-center gap-3 border-l border-slate-100 pl-6 h-12">
        <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 text-white rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg">
          <UserIcon size={18} className="md:size-[24px]" />
        </div>
        <div>
          <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wide">משתמש מחובר</p>
          <p className="text-sm md:text-xl font-black text-slate-800 tracking-tight truncate max-w-[100px] lg:max-w-none">
            {userName || 'אורח'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm">
          <Wallet size={18} className="md:size-[24px]" />
        </div>
        <div>
          <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wide">מזומן</p>
          <p className="text-sm md:text-2xl font-extrabold text-slate-800 tracking-tighter tabular-nums">{state.money.toLocaleString()}₪</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
        <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm">
          <Compass size={18} className="md:size-[24px]" />
        </div>
        <div>
          <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wide">סה"כ מתוכנן</p>
          <p className="text-sm md:text-2xl font-extrabold text-indigo-600 tracking-tighter tabular-nums">{totalPlanned.toLocaleString()}₪</p>
        </div>
      </div>

      {state.loans > 0 && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-red-100 text-red-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm border border-red-200">
            <Landmark size={18} className="md:size-[24px]" />
          </div>
          <div>
            <p className="text-[9px] md:text-[11px] font-bold text-red-400 uppercase tracking-wide">חוב לבנק</p>
            <p className="text-sm md:text-2xl font-extrabold text-red-600 tracking-tighter tabular-nums">{Math.round(state.loans).toLocaleString()}₪</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm">
          <Heart size={18} className="md:size-[24px]" fill={state.happiness < 30 ? "none" : "currentColor"} />
        </div>
        <div>
          <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wide">אושר</p>
          <p className="text-sm md:text-2xl font-extrabold text-slate-800 tracking-tighter">{state.happiness}%</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 mr-auto">
        <div className="text-right hidden md:block">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">סוג חשבון</p>
          <p className="text-sm font-extrabold text-slate-700">חשבון צעיר</p>
        </div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
          <Activity size={18} className="md:size-[20px]" />
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
