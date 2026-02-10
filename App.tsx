import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Star,
  Zap,
  Flag,
  ShoppingBag,
  Home as HomeIcon,
  User as UserIcon,
  Heart,
  Bot,
  Briefcase,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  PieChart,
  Trophy,
  Crown,
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  AlertCircle,
  X,
  ShieldAlert,
  ArrowLeftRight,
  CreditCard,
  Banknote,
  MinusCircle,
  PlusCircle,
  Landmark,
  GraduationCap,
  History,
  Activity,
  Layers,
  ArrowUp,
  PiggyBank,
  Clock,
  LayoutDashboard,
  HelpCircle,
  ArrowRight,
  Monitor,
  Sparkles,
  Smartphone,
  Watch,
  Gamepad2,
  Bike,
  Coffee,
  Glasses,
  Scale,
  LogOut,
  Settings,
  RefreshCcw,
  Box,
  Palette,
  Compass,
  BarChart,
  Target,
  ArrowDown,
  Plus,
  Settings2,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Receipt
} from 'lucide-react';

import { PlayerState, GameEvent, TileType, Investment, Appearance, Transaction, Career, ShopItem, User, BudgetCategory } from './types';
import { 
  BASIC_EXPENSES, 
  CAREERS as DEFAULT_CAREERS, 
  STOCK_MARKET as DEFAULT_STOCKS,
  SHOP_ITEMS as DEFAULT_SHOP_ITEMS,
  HOUSES,
  BOARD_FLAVORS,
  MISSION_LIBRARY as DEFAULT_MISSIONS,
  DECISION_LIBRARY as DEFAULT_DECISIONS,
  LUCK_LIBRARY as DEFAULT_LUCK,
  OPPORTUNITY_LIBRARY as DEFAULT_OPPORTUNITIES,
  LOAN_INTEREST_RATE,
  BANK_LOAN_INTEREST_RATE as DEFAULT_BANK_RATE,
  INITIAL_SALARY,
  BUDGET_CATEGORIES as DEFAULT_BUDGET_CATEGORIES
} from './constants';

import { sounds } from './services/soundService';

import StatsHeader from './components/StatsHeader';
import EventModal from './components/EventModal';
import MonthlySummary from './components/MonthlySummary';
import AIAdvisorPanel from './components/AIAdvisorPanel';
import LoanModal from './components/LoanModal';
import GameOverModal from './components/GameOverModal';
import CharacterAvatar from './components/CharacterAvatar';
import StockMarketModal from './components/StockMarketModal';
import BankBranchModal from './components/BankBranchModal';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';

const LOGO_SRC = "https://i.ibb.co/Nn6NWHXg/11.png"; 

const Logo = ({ className = "w-16 h-16", dark = false }: { className?: string, dark?: boolean }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img 
      src={LOGO_SRC} 
      alt="כלכלה חדשה" 
      className={`w-full h-full object-contain filter ${dark ? '' : 'brightness-110'}`}
      style={{ 
        mixBlendMode: dark ? 'normal' : 'multiply',
      }}
      onError={(e) => {
          e.currentTarget.style.display = 'none';
      }}
    />
  </div>
);

const categoryConfig: Record<string, { label: string, color: string, bg: string }> = {
  'SERVICE': { label: 'שירותים', color: 'text-blue-600', bg: 'bg-blue-50' },
  'TECH': { label: 'טכנולוגיה', color: 'text-purple-600', bg: 'bg-purple-50' },
  'LEGAL': { label: 'משפטים', color: 'text-slate-700', bg: 'bg-slate-100' },
  'CREATIVE': { label: 'קריאייטיב', color: 'text-pink-600', bg: 'bg-pink-50' },
  'MEDICAL': { label: 'רפואה', color: 'text-red-600', bg: 'bg-red-50' },
  'FINANCE': { label: 'פיננסים', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'ARCHITECTURE': { label: 'אדריכלות', color: 'text-orange-600', bg: 'bg-orange-50' },
  'TRADES': { label: 'מקצועות חופשיים', color: 'text-amber-600', bg: 'bg-amber-50' },
  'EDUCATION': { label: 'חינוך', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'PILOT': { label: 'תעופה', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'SECURITY': { label: 'ביטחון', color: 'text-rose-700', bg: 'bg-rose-50' }
};

const navItemsBase = [
  { id: 'board', label: 'לוח', icon: <MapIcon size={24} /> },
  { id: 'budget', label: 'תקציב', icon: <Compass size={24} /> },
  { id: 'career', label: 'קריירה', icon: <Briefcase size={24} /> },
  { id: 'shop', label: 'חנות', icon: <ShoppingBag size={24} /> },
  { id: 'profile', label: 'פרופיל', icon: <UserIcon size={24} /> },
  { id: 'leaderboard', label: 'דירוג', icon: <Trophy size={24} /> }
];

const createInitialPlayerState = (initialJob: Career): PlayerState => ({
  money: 5000,
  savings: 0,
  happiness: 50,
  currentPosition: 0,
  tilesTraversed: 0,
  job: { ...initialJob },
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
  activeBudgetCategoryIds: DEFAULT_BUDGET_CATEGORIES.map(c => c.id),
  customBudgetCategories: [],
  recentTransactions: [],
  history: [{ month: 0, money: 5000, happiness: 50 }]
});

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<'auth' | 'landing' | 'customization' | 'playing'>('landing');
  
  const [careers, setCareers] = useState<Career[]>(() => {
    const saved = localStorage.getItem('economy_careers');
    return saved ? JSON.parse(saved) : DEFAULT_CAREERS;
  });
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('economy_shop');
    return saved ? JSON.parse(saved) : DEFAULT_SHOP_ITEMS;
  });
  const [budgetLibrary, setBudgetLibrary] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('economy_budget_categories');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET_CATEGORIES;
  });
  const [missionLibrary, setMissionLibrary] = useState<GameEvent[]>(() => {
    const saved = localStorage.getItem('economy_missions');
    return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
  });
  const [luckLibrary, setLuckLibrary] = useState<GameEvent[]>(() => {
    const saved = localStorage.getItem('economy_luck');
    return saved ? JSON.parse(saved) : DEFAULT_LUCK;
  });
  const [opportunityLibrary, setOpportunityLibrary] = useState<GameEvent[]>(() => {
    const saved = localStorage.getItem('economy_opportunities');
    return saved ? JSON.parse(saved) : DEFAULT_OPPORTUNITIES;
  });
  const [decisionLibrary, setDecisionLibrary] = useState<GameEvent[]>(() => {
    const saved = localStorage.getItem('economy_decisions');
    return saved ? JSON.parse(saved) : DEFAULT_DECISIONS;
  });
  const [stockMarket, setStockMarket] = useState<any[]>(() => {
    const saved = localStorage.getItem('economy_stocks');
    return saved ? JSON.parse(saved) : DEFAULT_STOCKS;
  });
  const [bankRate, setBankRate] = useState<number>(() => {
    const saved = localStorage.getItem('economy_bank_rate');
    return saved ? parseFloat(saved) : DEFAULT_BANK_RATE;
  });

  const [player, setPlayer] = useState<PlayerState>(() => createInitialPlayerState(careers[0]));

  // Dynamic Budget Calculation
  useEffect(() => {
    if (gameState === 'playing') {
      const houseExp = HOUSES[player.houseType]?.monthlyMaintenance || 0;
      let transportExp = 0;
      let entertainmentExp = 0;
      let techExp = 0;
      let foodExp = 1800; // Minimum survival food cost
      let miscExp = 500;

      player.inventory.forEach(itemName => {
        const item = shopItems.find(si => si.name === itemName);
        if (item?.monthlyCost) {
           if (item.type === 'LIFESTYLE') {
             if (item.name.includes('מכונית') || item.name.includes('קורקינט')) transportExp += item.monthlyCost;
             else if (item.name.includes('קונסולה')) entertainmentExp += item.monthlyCost;
             else if (item.name.includes('סמארטפון')) techExp += item.monthlyCost;
             else miscExp += item.monthlyCost;
           } else {
             miscExp += item.monthlyCost;
           }
        }
      });

      const newBudget = {
        housing: houseExp,
        food: foodExp,
        transport: transportExp,
        entertainment: entertainmentExp,
        tech: techExp,
        misc: miscExp
      };

      if (JSON.stringify(newBudget) !== JSON.stringify(player.budget)) {
        setPlayer(prev => ({ ...prev, budget: newBudget }));
      }
    }
  }, [player.inventory, player.houseType, shopItems, gameState]);

  useEffect(() => { localStorage.setItem('economy_careers', JSON.stringify(careers)); }, [careers]);
  useEffect(() => { localStorage.setItem('economy_shop', JSON.stringify(shopItems)); }, [shopItems]);
  useEffect(() => { localStorage.setItem('economy_budget_categories', JSON.stringify(budgetLibrary)); }, [budgetLibrary]);
  useEffect(() => { localStorage.setItem('economy_missions', JSON.stringify(missionLibrary)); }, [missionLibrary]);
  useEffect(() => { localStorage.setItem('economy_luck', JSON.stringify(luckLibrary)); }, [luckLibrary]);
  useEffect(() => { localStorage.setItem('economy_opportunities', JSON.stringify(opportunityLibrary)); }, [opportunityLibrary]);
  useEffect(() => { localStorage.setItem('economy_decisions', JSON.stringify(decisionLibrary)); }, [decisionLibrary]);
  useEffect(() => { localStorage.setItem('economy_stocks', JSON.stringify(stockMarket)); }, [stockMarket]);
  useEffect(() => { localStorage.setItem('economy_bank_rate', bankRate.toString()); }, [bankRate]);

  const userDisplayName = useMemo(() => {
    const target = inspectingUser || currentUser;
    if (!target || !target.email) return 'אורח';
    return target.email.split('@')[0];
  }, [currentUser, inspectingUser]);

  const calculateNetWorth = (p: PlayerState) => {
    const invVal = p.investments.reduce((acc: number, inv) => acc + (inv.amount || 0), 0);
    return (p.money || 0) + (p.savings || 0) + invVal - (p.loans || 0);
  };

  const totalPlannedBudget = useMemo(() => {
    const budgetEntries = Object.values(player.budget || {}) as number[];
    return budgetEntries.reduce((acc: number, val: number) => acc + val, 0);
  }, [player.budget]);

  const financialBalanceStatus = useMemo(() => {
    const diff = (player.money || 0) - totalPlannedBudget;
    if (diff < 0) return { label: 'חריגה מהתקציב!', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle size={18} /> };
    if (diff < 1000) return { label: 'תקציב דחוק', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertCircle size={18} /> };
    return { label: 'מאוזן', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <Check size={18} /> };
  }, [player.money, totalPlannedBudget]);

  const sortedLeaderboard = useMemo(() => {
    const users: User[] = JSON.parse(localStorage.getItem('economy_users') || '[]');
    const list = users.map(u => ({
      name: u.email.split('@')[0],
      money: calculateNetWorth(u.state),
      color: 'bg-slate-100 text-slate-600',
      isPlayer: u.email === (currentUser?.email),
      hasDebt: u.state.loans > 0
    }));
    return list.sort((a, b) => b.money - a.money);
  }, [player, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN' && !inspectingUser) {
      const users: User[] = JSON.parse(localStorage.getItem('economy_users') || '[]');
      const updatedUsers = users.map(u => u.email === currentUser.email ? { ...u, state: player } : u);
      localStorage.setItem('economy_users', JSON.stringify(updatedUsers));
    }
  }, [player, currentUser, inspectingUser]);

  const handleLogin = (user: User) => {
    setCurrentUser({ ...user });
    setPlayer(user.state);
    setGameState('playing');
  };

  const handleInspectUser = (user: User) => {
    setInspectingUser(user);
    setPlayer(user.state);
    setActiveTab('board');
  };

  const stopInspecting = () => {
    setInspectingUser(null);
    if (currentUser) setPlayer(currentUser.state);
    setActiveTab('admin');
  };

  const handleSignUpInit = (user: User) => {
    setCurrentUser({ ...user });
    setPlayer(user.state);
    setGameState('customization');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setInspectingUser(null);
    setGameState('landing');
    setPlayer(createInitialPlayerState(careers[0]));
    sounds.playClick();
  };

  const handleSelfReset = () => {
    if (inspectingUser) return;
    if (!window.confirm("האם אתה בטוח שברצונך לאפס את ההתקדמות שלך? כל הכסף והרכוש יימחקו.")) return;
    setPlayer(createInitialPlayerState(careers[0]));
    setGameState('customization');
    sounds.playError();
  };

  const [happinessChange, setHappinessChange] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showStockMarket, setShowStockMarket] = useState(false);
  const [showBankBranch, setShowBankBranch] = useState(false);
  const [isBankLoan, setIsBankLoan] = useState(false);
  const [pendingImpact, setPendingImpact] = useState<any>(null);
  const [monthlyResults, setMonthlyResults] = useState<{ name: string, change: number, profit: number, stockId: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'career' | 'shop' | 'profile' | 'leaderboard' | 'admin' | 'budget'>('board');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const [shopCategory, setShopCategory] = useState<'ALL' | 'EQUIPMENT' | 'LIFESTYLE'>('ALL');

  const navItems = useMemo(() => {
    const items = [...navItemsBase];
    if (currentUser?.role === 'ADMIN' && !inspectingUser) {
        items.push({ id: 'admin', label: 'ניהול', icon: <Settings size={24} /> });
    }
    return items;
  }, [currentUser, inspectingUser]);

  useEffect(() => {
    if (scrollRef.current && activeTab === 'board' && gameState === 'playing' && player) {
      const container = scrollRef.current;
      const playerTile = container.querySelector(`[data-tile="${player.tilesTraversed}"]`) as HTMLElement;
      if (playerTile) {
        const containerWidth = container.offsetWidth;
        const tileLeft = playerTile.offsetLeft;
        const tileWidth = playerTile.offsetWidth;
        container.scrollTo({ left: tileLeft - (containerWidth / 2) + (tileWidth / 2), behavior: 'smooth' });
      }
    }
  }, [player?.tilesTraversed, activeTab, gameState]);

  const handleRoll = () => {
    if (inspectingUser) return;
    if (!player || rolling || isProcessingMove || currentEvent || showMonthly || showLoanModal || showStockMarket || showBankBranch || player.gameOver) return;
    setRolling(true);
    sounds.playRoll();
    setTimeout(() => {
      let roll = Math.floor(Math.random() * 6) + 1;
      const currentPosInMonth = player.tilesTraversed % 50;
      const stepsToPayday = 50 - currentPosInMonth;
      if (roll > stepsToPayday) roll = stepsToPayday;
      setRolling(false);
      setLastRoll(roll);
      setIsProcessingMove(true);
      setTimeout(() => movePlayerStepByStep(roll), 1000);
    }, 800);
  };

  const movePlayerStepByStep = async (steps: number) => {
    if (steps <= 0) { setIsProcessingMove(false); return; }
    let currentSteps = 0;
    const animate = async () => {
      if (currentSteps < steps) {
        currentSteps++;
        setPlayer(prev => {
          const nextTiles = prev.tilesTraversed + 1;
          if (nextTiles > 0 && nextTiles % 50 === 0) { calculateMonthlyResults(prev.investments); setShowMonthly(true); sounds.playSuccess(); }
          return { ...prev, tilesTraversed: nextTiles, currentPosition: nextTiles % 50 };
        });
        sounds.playMove();
        setTimeout(animate, 2000 / steps);
      } else {
        setTimeout(() => { checkTileEffect(player.tilesTraversed + steps); setIsProcessingMove(false); }, 1000);
      }
    };
    animate();
  };

  const calculateMonthlyResults = (investments: Investment[]) => {
    const results = investments.map(inv => {
      const stock = stockMarket.find(s => s.id === inv.stockId);
      if (!stock) return { name: inv.stockName, change: 0, profit: 0, stockId: inv.stockId };
      const change = stock.baseReturn + (Math.random() - 0.5) * 2 * stock.volatility;
      return { name: inv.stockName, change, profit: Math.round(inv.amount * change), stockId: inv.stockId };
    });
    setMonthlyResults(results);
  };

  const checkTileEffect = (targetIndex: number) => {
    const type = BOARD_FLAVORS['BASIC'](targetIndex);
    if (type === 'EMPTY' || type === 'START') return;
    if (type === 'BANK') { setShowBankBranch(true); sounds.playClick(); return; }
    if (type === 'STOCKS') { setShowStockMarket(true); sounds.playClick(); return; }
    
    let library: GameEvent[] = [];
    if (type === 'MISSION') library = missionLibrary;
    if (type === 'DECISION') library = decisionLibrary;
    if (type === 'LUCK') library = luckLibrary;
    if (type === 'OPPORTUNITY') library = opportunityLibrary;
    
    if (library.length > 0) {
      const randomIndex = Math.floor(Math.random() * library.length);
      setCurrentEvent({ ...library[randomIndex] });
      sounds.playClick();
    }
  };

  const getMonthLabel = (tiles: number) => `חודש ${Math.floor(tiles / 50) + 1}`;

  const handleStockTrade = (stockId: string, amount: number, isBuy: boolean) => {
    if (inspectingUser) return;
    setPlayer(prev => {
      let newMoney = prev.money;
      let newInvestments = [...prev.investments];
      const stock = stockMarket.find(s => s.id === stockId);
      if (!stock) return prev;
      if (isBuy) {
        if (newMoney < amount) return prev;
        newMoney -= amount;
        const existingIndex = newInvestments.findIndex(inv => inv.stockId === stockId);
        if (existingIndex !== -1) newInvestments[existingIndex] = { ...newInvestments[existingIndex], amount: newInvestments[existingIndex].amount + amount };
        else newInvestments.push({ stockId, stockName: stock.name, amount, purchasePrice: amount });
      } else {
        const invIndex = newInvestments.findIndex(inv => inv.stockId === stockId);
        if (invIndex === -1) return prev;
        newMoney += newInvestments[invIndex].amount;
        newInvestments.splice(invIndex, 1);
      }
      const tx: Transaction = {
        description: isBuy ? `קניית ${stock.name}` : `מכירת ${stock.name}`,
        amount: amount,
        type: isBuy ? 'EXPENSE' : 'INCOME',
        dateLabel: getMonthLabel(prev.tilesTraversed)
      };
      return { ...prev, money: newMoney, investments: newInvestments, recentTransactions: [tx, ...prev.recentTransactions].slice(0, 15) };
    });
    sounds.playSuccess();
  };

  const handleBankAction = (type: 'loan' | 'deposit', amount: number) => {
    if (inspectingUser) return;
    setPlayer(prev => {
      if (type === 'loan') {
        const tx: Transaction = {
          description: 'קבלת הלוואה מהבנק',
          amount: amount,
          type: 'INCOME',
          dateLabel: getMonthLabel(prev.tilesTraversed)
        };
        return { ...prev, money: prev.money + amount, loans: prev.loans + amount, recentTransactions: [tx, ...prev.recentTransactions].slice(0, 15) };
      } else {
        if (prev.money < amount) return prev;
        const tx: Transaction = {
          description: 'הפקדה לחיסכון',
          amount: amount,
          type: 'EXPENSE',
          dateLabel: getMonthLabel(prev.tilesTraversed)
        };
        return { ...prev, money: prev.money - amount, savings: prev.savings + amount, recentTransactions: [tx, ...prev.recentTransactions].slice(0, 15) };
      }
    });
    sounds.playSuccess();
  };

  const applyImpact = (impact: any, isSuccess: boolean = true) => {
    if (inspectingUser) { setCurrentEvent(null); return; }
    if (!impact) { if (!isSuccess) handleMissionFailure(); setCurrentEvent(null); return; }
    let moneyImpact = impact.money || 0;
    if (isSuccess && currentEvent?.type === 'MISSION' && moneyImpact > 0) {
        const scaleFactor = player.job.salary / INITIAL_SALARY;
        moneyImpact = Math.round(moneyImpact * scaleFactor);
    }
    if (player.money + moneyImpact < 0) {
      setPendingImpact({ ...impact, money: moneyImpact, isSuccess });
      setIsBankLoan(false); setShowLoanModal(true); sounds.playError();
      return;
    }
    if (impact.happiness) { setHappinessChange(impact.happiness); setTimeout(() => setHappinessChange(0), 2000); }
    if (!isSuccess) handleMissionFailure();
    setPlayer(prev => {
      let newMoney = prev.money + moneyImpact;
      let newHappiness = Math.min(100, Math.max(0, prev.happiness + (impact.happiness || 0)));
      let newInventory = [...prev.inventory];
      let newDegrees = [...prev.degrees];
      let newInvestments = [...prev.investments];
      let newHouseType = impact.house || prev.houseType;
      if (impact.inventory && !newInventory.includes(impact.inventory)) newInventory.push(impact.inventory);
      if (impact.degree && !newDegrees.includes(impact.degree)) newDegrees.push(impact.degree);
      if (impact.investment) newInvestments.push({ stockId: impact.investment.stockId, stockName: impact.investment.stockName, amount: impact.investment.cost, purchasePrice: impact.investment.cost });
      if (impact.marketCrash) {
        const multiplier = 1 - ((20 + Math.random() * 30) / 100);
        newInvestments = newInvestments.map(inv => ({ ...inv, amount: Math.round(inv.amount * multiplier) }));
      }
      const tx: Transaction = { description: impact.marketCrash ? "קריסת בורסה" : (currentEvent?.title || "פעולה"), amount: Math.abs(moneyImpact), type: moneyImpact >= 0 ? 'INCOME' : 'EXPENSE', dateLabel: getMonthLabel(prev.tilesTraversed) };
      return { ...prev, money: newMoney, happiness: newHappiness, inventory: newInventory, degrees: newDegrees, investments: newInvestments, houseType: newHouseType, recentTransactions: [tx, ...prev.recentTransactions].slice(0, 15) };
    });
    setCurrentEvent(null); setPendingImpact(null);
  };

  const handleMissionFailure = () => {
    setPlayer(prev => {
        const newCount = prev.failedMissionsCount + 1;
        if (newCount >= 3 && prev.job.id !== 'entry') {
            sounds.playError(); alert("פוטרת מעבודתך.");
            return { ...prev, failedMissionsCount: 0, job: careers[0] };
        }
        return { ...prev, failedMissionsCount: newCount };
    });
  };

  const handleSellItem = (itemName: string) => {
    if (inspectingUser) return;
    const item = shopItems.find(si => si.name === itemName);
    if (!item) return;

    if (window.confirm(`האם למכור את ${itemName} עבור ${(item.price / 2).toLocaleString()}₪?`)) {
      setPlayer(prev => {
        const nextInv = prev.inventory.filter(i => i !== itemName);
        const sellPrice = Math.floor(item.price / 2);
        const tx: Transaction = {
          description: `מכירת ${itemName}`,
          amount: sellPrice,
          type: 'INCOME',
          dateLabel: getMonthLabel(prev.tilesTraversed)
        };
        return { 
          ...prev, 
          inventory: nextInv, 
          money: prev.money + sellPrice, 
          happiness: Math.max(0, prev.happiness - (item.happiness / 2)),
          recentTransactions: [tx, ...prev.recentTransactions].slice(0, 15)
        };
      });
      sounds.playSuccess();
    }
  };

  const processMonthlyPayment = (keepStocks: boolean) => {
    if (inspectingUser) { setShowMonthly(false); return; }
    sounds.playClick();
    setPlayer(prev => {
      const invProfitTotal = monthlyResults.reduce((acc: number, curr) => acc + curr.profit, 0);
      const newLoanTotal = prev.loans + (prev.loans * LOAN_INTEREST_RATE);
      const savingsRefund = prev.savings + Math.round(prev.savings * 0.05);
      
      let newMoney = prev.money + prev.job.salary - totalPlannedBudget + savingsRefund;
      let newInvestments = [...prev.investments];
      const monthLabel = getMonthLabel(prev.tilesTraversed - 1);
      
      const monthTxs: Transaction[] = [
        { description: 'משכורת', amount: prev.job.salary, type: 'INCOME', dateLabel: monthLabel }, 
        { description: 'הוצאות מחיה', amount: totalPlannedBudget, type: 'EXPENSE', dateLabel: monthLabel }
      ];

      if (savingsRefund > 0) monthTxs.push({ description: 'פדיון חיסכון', amount: savingsRefund, type: 'INCOME', dateLabel: monthLabel });
      
      if (keepStocks) {
        newInvestments = newInvestments.map(inv => { const res = monthlyResults.find(r => r.stockId === inv.stockId); return { ...inv, amount: inv.amount + (res?.profit || 0) }; });
      } else {
        const totalValue = prev.investments.reduce((acc: number, inv: Investment) => acc + inv.amount, 0) + invProfitTotal;
        if (totalValue > 0) { monthTxs.push({ description: 'מימוש מניות', amount: totalValue, type: 'INCOME', dateLabel: monthLabel }); newMoney += totalValue; }
        newInvestments = [];
      }
      return { 
        ...prev, 
        money: Math.max(0, newMoney), 
        savings: 0, 
        loans: newLoanTotal, 
        history: [...prev.history, { month: Math.floor(prev.tilesTraversed / 50), money: Math.max(0, newMoney), happiness: prev.happiness }].slice(-10), 
        gameOver: newMoney < 0, 
        investments: newInvestments, 
        recentTransactions: [...monthTxs, ...prev.recentTransactions].slice(0, 15) 
      };
    });
    setShowMonthly(false);
  };

  const getTileConfig = (index: number) => {
    const pos = index % 50;
    if (pos === 0) return { color: 'bg-slate-900 text-white border-slate-700', icon: <Flag size={24} />, label: 'Payday' };
    const type = BOARD_FLAVORS['BASIC'](index);
    switch(type) {
        case 'MISSION': return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Zap size={24} />, label: 'משימה' };
        case 'DECISION': return { color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <HelpCircle size={24} />, label: 'החלטה' };
        case 'LUCK': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <Star size={24} />, label: 'מזל' };
        case 'OPPORTUNITY': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Coins size={24} />, label: 'הזדמנות' };
        case 'BANK': return { color: 'bg-indigo-600 text-white border-indigo-700', icon: <Landmark size={24} />, label: 'בנק' };
        case 'STOCKS': return { color: 'bg-purple-600 text-white border-purple-700', icon: <TrendingUp size={24} />, label: 'בורסה' };
        default: return { color: 'bg-slate-50 text-slate-300 border-slate-200/50', icon: null, label: 'דרך' };
    }
  };

  const netWorth = useMemo(() => calculateNetWorth(player), [player]);
  const filteredShopItems = useMemo(() => shopCategory === 'ALL' ? shopItems : shopItems.filter(item => item.type === shopCategory), [shopCategory, shopItems]);

  const getShopIcon = (id: string) => {
    switch (id) {
        case 'knives': return <Zap size={24} />;
        case 'laptop_pro': return <Monitor size={24} />;
        case 'suit': return <Briefcase size={24} />;
        case 'smartphone': return <Smartphone size={24} />;
        case 'car_used': return <Bike size={24} />;
        case 'console': return <Gamepad2 size={24} />;
        case 'scooter': return <Bike size={24} />;
        case 'coffee_machine': return <Coffee size={24} />;
        default: return <ShoppingBag size={24} />;
    }
  };

  if (gameState === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans overflow-y-auto no-scrollbar scroll-smooth" dir="rtl">
        <nav className="fixed top-0 left-0 w-full p-4 lg:p-10 flex justify-between items-center z-[200] bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
           <div className="flex items-center gap-4 lg:gap-6">
              <button onClick={() => setGameState('auth')} className="px-5 py-2 lg:px-8 lg:py-3 bg-blue-600 text-white font-black text-xs lg:text-sm rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">כניסת שחקנים</button>
           </div>
           <div className="flex items-center gap-4">
              <h1 className="text-xl lg:text-2xl font-black italic uppercase hidden md:block">כלכלה חדשה</h1>
              <Logo className="w-10 h-10 lg:w-12 lg:h-12" />
           </div>
        </nav>

        <header className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 lg:px-24 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[800px] lg:h-[800px] bg-blue-600/10 rounded-full blur-[80px] lg:blur-[160px] animate-pulse"></div>
            
            <div className="relative z-10 space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-5xl">
               <div className="inline-block relative">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 animate-pulse"></div>
                  <Logo className="w-32 h-32 lg:w-48 lg:h-48 mx-auto relative hover:scale-110 transition-transform duration-500" />
               </div>
               
               <div className="space-y-6 lg:space-y-8">
                  <div className="flex items-center justify-center gap-2 lg:gap-4 mb-2">
                     <div className="h-0.5 w-10 lg:w-32 bg-blue-500 rounded-full"></div>
                     <h2 className="text-blue-500 font-black tracking-[0.2em] lg:tracking-[0.4em] uppercase text-[10px] lg:text-sm italic">Next-Gen Financial Simulation</h2>
                     <div className="h-0.5 w-10 lg:w-32 bg-blue-500 rounded-full"></div>
                  </div>
                  <h1 className="text-5xl lg:text-[140px] font-black italic leading-[0.8] mb-4 tracking-tighter">כלכלה <br/> <span className="text-blue-500">חדשה</span></h1>
                  
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <p className="text-lg lg:text-4xl font-bold text-slate-300 leading-tight italic">
                      <span className="text-red-400">הבעיה:</span> בני נוער מסיימים את מערכת החינוך ללא כלים פיננסיים בסיסיים והבנה של העולם האמיתי.
                    </p>
                    <p className="text-lg lg:text-4xl font-bold text-white leading-tight italic">
                      <span className="text-emerald-400">הפתרון:</span> סימולטור למידה המעניק מבט אמיתי, חווייתי ומלמד לעולם הכלכלי של הגדולים.
                    </p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 justify-center pt-8">
                  <button onClick={() => { sounds.playSuccess(); setGameState('auth'); }} className="px-8 py-5 lg:px-16 lg:py-8 bg-blue-600 text-white font-black text-xl lg:text-4xl rounded-2xl lg:rounded-[32px] hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.5)] flex items-center justify-center gap-4 lg:gap-6 group">
                     הצטרף לסימולציה <ArrowRight size={24} className="group-hover:translate-x-[-10px] transition-transform hidden lg:block" />
                  </button>
                  <a href="#about" className="px-8 py-5 lg:px-16 lg:py-8 bg-white/5 border-2 lg:border-4 border-white/10 text-white font-black text-xl lg:text-4xl rounded-2xl lg:rounded-[32px] hover:bg-white/10 transition-all flex items-center justify-center gap-4 lg:gap-6">
                     קרא עוד <ArrowDown size={24} className="hidden lg:block" />
                  </a>
               </div>
            </div>
        </header>

        <section id="about" className="py-24 lg:py-40 px-6 lg:px-24 bg-white text-slate-900 text-right">
           <div className="max-w-7xl mx-auto space-y-24 lg:space-y-40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                 <div className="space-y-6 lg:space-y-10">
                    <h3 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter border-r-4 lg:border-r-8 border-blue-600 pr-6 lg:pr-8">למה זה קריטי?</h3>
                    <p className="text-xl lg:text-3xl font-bold text-slate-600 leading-relaxed">
                       מערכת החינוך מלמדת היסטוריה, אבל לא מלמדת איך להימנע מחובות, איך עובדת ריבית דריבית, ומהו ערך הכסף בשוק ההון המודרני.
                       <br/><br/>
                       <span className="text-blue-600 font-black">אנחנו כאן כדי לסגור את הפער הזה ולתת לכם יתרון במגרש של הגדולים.</span>
                    </p>
                 </div>
                 <div className="bg-slate-100 rounded-[32px] lg:rounded-[64px] p-12 lg:p-20 aspect-square flex items-center justify-center border-4 lg:border-8 border-slate-200 shadow-inner group overflow-hidden">
                    <ShieldAlert size={180} className="text-red-500/20 group-hover:scale-110 transition-transform duration-700 lg:size-[280px]" />
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                 <div className="bg-slate-900 rounded-[32px] lg:rounded-[64px] p-12 lg:p-20 aspect-square flex items-center justify-center border-4 lg:border-8 border-slate-800 shadow-2xl relative overflow-hidden group order-2 lg:order-1">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Monitor size={180} className="text-blue-400 opacity-20 relative z-10 lg:size-[280px]" />
                    <Sparkles size={40} className="absolute top-8 left-8 text-blue-500 animate-pulse lg:size-20 lg:top-12 lg:left-12" />
                 </div>
                 <div className="space-y-6 lg:space-y-10 order-1 lg:order-2">
                    <h3 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter border-r-4 lg:border-r-8 border-slate-900 pr-6 lg:pr-8">חווית הלמידה</h3>
                    <p className="text-xl lg:text-3xl font-bold text-slate-600 leading-relaxed">
                       סימולטור "כלכלה חדשה" הוא ארגז חול פיננסי. כאן ניתן לחוות משברים, השקעות מוצלחות, וקידום מקצועי - הכל בתוך סביבה בטוחה ומלמדת.
                    </p>
                    <ul className="space-y-4 lg:space-y-8 mt-8 lg:mt-12">
                       {[
                         { icon: <TrendingUp size={24}/>, text: "בורסה דינמית המדמה את שוק ההון" },
                         { icon: <Briefcase size={24}/>, text: "מסלולי קריירה המבוססים על כישורים" },
                         { icon: <Compass size={24}/>, text: "ניהול תקציב חודשי חכם 'מצפן כלכלי'" },
                         { icon: <Bot size={24}/>, text: "EDDIE - יועץ AI פיננסי מקצועי" }
                       ].map((item, i) => (
                         <li key={i} className="flex items-center justify-end gap-4 lg:gap-6 text-lg lg:text-2xl font-black text-slate-800">
                           {item.text}
                           <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-50 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm border-2 border-blue-100">{item.icon}</div>
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        <footer className="py-24 lg:py-40 bg-slate-950 text-center px-6 border-t border-white/10 relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
           <div className="max-w-4xl mx-auto space-y-10 lg:space-y-16 relative z-10">
              <Logo className="w-32 h-32 lg:w-40 lg:h-40 mx-auto opacity-80" />
              <h2 className="text-4xl lg:text-8xl font-black italic mb-6 lg:mb-8 tracking-tighter uppercase">העתיד שלכם מתחיל כאן</h2>
              <p className="text-xl lg:text-3xl text-slate-400 font-bold max-w-2xl mx-auto italic">אלפי בני נוער כבר משחקים ובונים את היסודות לעתיד פיננסי בטוח. מה איתך?</p>
              <button onClick={() => setGameState('auth')} className="px-12 py-6 lg:px-24 lg:py-10 bg-blue-600 text-white font-black text-2xl lg:text-5xl rounded-3xl lg:rounded-[40px] hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_30px_80px_rgba(37,99,235,0.6)]">
                 התחל בסימולציה עכשיו
              </button>
              <div className="pt-16 lg:pt-24 opacity-30 font-black uppercase text-[10px] lg:text-[12px] tracking-[0.4em] lg:tracking-[0.6em]">
                 © 2025 NEON_ECONOMY // REAL_WORLD_VISION // LOGO_PROTECTED
              </div>
           </div>
        </footer>
      </div>
    );
  }

  if (gameState === 'auth') return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUpInit} logo={<Logo className="w-20 h-20 lg:w-24 lg:h-24" dark={true} />} />;

  if (gameState === 'customization') {
    return (
      <div className="app-container bg-slate-950 flex flex-col items-center justify-center p-0 lg:p-4 overflow-y-auto no-scrollbar">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 min-h-full">
            <div className="flex flex-col items-center justify-center p-6 lg:p-8 bg-slate-900/50 rounded-b-[32px] lg:rounded-[48px] border-b lg:border border-blue-500/20 shadow-2xl">
                <CharacterAvatar inventory={[]} appearance={player.appearance} />
                <h2 className="text-lg lg:text-2xl font-black text-white mt-4 lg:mt-8 tracking-widest uppercase italic text-center">תצוגה מקדימה // PREVIEW</h2>
            </div>
            <div className="space-y-6 lg:space-y-8 p-8 lg:p-12 bg-white rounded-t-[32px] lg:rounded-[48px] shadow-2xl flex flex-col justify-center">
                <h1 className="text-2xl lg:text-4xl font-black italic uppercase leading-none mb-2 text-right">עצב את הדמות // CHARACTER</h1>
                <div className="space-y-4 lg:space-y-6 max-h-[400px] lg:max-h-[500px] overflow-y-auto no-scrollbar px-2 custom-scroll">
                    <div className="space-y-2 text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">מגדר</p>
                        <div className="flex flex-wrap gap-2 lg:gap-3 justify-end">
                            <button onClick={() => { setPlayer(p => ({ ...p, appearance: { ...p.appearance, gender: 'MALE' } })); sounds.playClick(); }} className={`px-5 py-2 lg:px-6 lg:py-3 rounded-xl border-2 lg:border-4 transition-all font-black uppercase text-[10px] lg:text-xs ${player.appearance.gender === 'MALE' ? 'bg-blue-600 border-blue-500 text-white scale-110 shadow-lg' : 'bg-slate-100 border-slate-100 text-slate-400'}`}>בן</button>
                            <button onClick={() => { setPlayer(p => ({ ...p, appearance: { ...p.appearance, gender: 'FEMALE' } })); sounds.playClick(); }} className={`px-5 py-2 lg:px-6 lg:py-3 rounded-xl border-2 lg:border-4 transition-all font-black uppercase text-[10px] lg:text-xs ${player.appearance.gender === 'FEMALE' ? 'bg-pink-600 border-pink-500 text-white scale-110 shadow-lg' : 'bg-slate-100 border-slate-100 text-slate-400'}`}>בת</button>
                        </div>
                    </div>
                    {[
                        { label: 'צבע עור', key: 'skin', options: ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524'] },
                        { label: 'עיצוב פנים', key: 'face', options: ['SMILE', 'SMIRK', 'CHILL', 'NERD', 'SERIOUS', 'ELITE'] },
                        { label: 'צבע שיער', key: 'hair', options: ['#2d1b0d', '#4e342e', '#fbc02d', '#757575'] },
                        { label: 'צבע חולצה', key: 'shirt', options: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'] }
                    ].map(row => (
                        <div key={row.key} className="space-y-2 text-right">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{row.label}</p>
                            <div className="flex flex-wrap gap-2 lg:gap-3 justify-end">
                                {row.options.map(opt => (
                                    <button key={opt} onClick={() => { setPlayer(p => ({ ...p, appearance: { ...p.appearance, [row.key]: opt } })); sounds.playClick(); }} className={`rounded-xl border-2 lg:border-4 transition-all ${player.appearance[row.key as keyof Appearance] === opt ? 'border-blue-500 scale-110 shadow-lg' : 'border-slate-100'}`} style={{ width: '36px', height: '36px', backgroundColor: row.key !== 'face' ? opt : 'transparent' }}>{row.key === 'face' && <span className="text-[8px] lg:text-[10px] font-black">{opt}</span>}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => { setGameState('playing'); sounds.playSuccess(); }} className="w-full py-5 lg:py-6 bg-slate-900 text-white font-black text-xl lg:text-2xl rounded-2xl hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4">סיום ואישור <Check /></button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {inspectingUser && (
        <div className="bg-amber-500 text-black py-2 px-4 flex justify-between items-center z-[300]">
           <div className="flex items-center gap-2 font-black uppercase text-xs">
              <ShieldAlert size={16} /> מצב צפייה במשתמש: {inspectingUser.email}
           </div>
           <button onClick={stopInspecting} className="bg-black text-white px-3 py-1 rounded-lg font-bold text-xs">חזרה לניהול</button>
        </div>
      )}
      {happinessChange !== 0 && (
          <div className="fixed bottom-24 lg:bottom-32 right-6 lg:right-12 z-[200] animate-in slide-in-from-right-full duration-500 pointer-events-none">
              <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-[20px] lg:rounded-[24px] font-black text-xs lg:text-sm shadow-2xl flex items-center gap-2 lg:gap-3 border-2 ${happinessChange > 0 ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
                  {happinessChange > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  <span className="mono-numbers text-sm lg:text-lg">{happinessChange > 0 ? '+' : ''}{happinessChange}% אושר</span>
              </div>
          </div>
      )}
      <div className="app-grid flex-1 overflow-hidden relative">
        <div className="hidden lg:flex w-[360px] bg-white border-l border-slate-200 overflow-y-auto custom-scroll p-8 flex-col gap-8 z-50">
           <div className="space-y-6">
              <header className="flex justify-between items-center px-2">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{userDisplayName}</h3>
                 {!inspectingUser && <button onClick={handleLogout} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={16} /></button>}
              </header>
              
              <div className="flex flex-col items-center gap-4 bg-slate-50 py-10 rounded-[48px] border-4 border-slate-100 shadow-inner">
                 <Logo className="w-24 h-24" dark={true} />
                 <div className="text-center">
                    <h2 className="text-xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">כלכלה חדשה</h2>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.4em] mt-1">Real World Simulator</p>
                 </div>
              </div>

              <CharacterAvatar inventory={player.inventory} appearance={player.appearance} />
           </div>
           <div className="space-y-6">
               <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">סטטוס תעסוקתי</p>
                   <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-200 shadow-sm space-y-4 text-right">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 ${categoryConfig[player.job.category]?.bg || 'bg-white'} ${categoryConfig[player.job.category]?.color || 'text-blue-600'} rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-sm`}><Briefcase size={22} /></div>
                         <div><h4 className="font-black text-slate-800 text-lg leading-none">{player.job.name}</h4><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{categoryConfig[player.job.category]?.label || 'כללי'}</p></div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         <div className="bg-white rounded-xl p-3 border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">שכר חודשי</p><p className="mono-numbers font-black text-emerald-600">{player.job.salary.toLocaleString()}₪</p></div>
                      </div>
                   </div>
               </div>
               <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">פרופיל פיננסי</p>
                   <div className="bg-slate-900 rounded-[28px] p-6 text-white shadow-xl relative overflow-hidden group text-right">
                      <div className="flex justify-between items-start mb-6">
                         <div><p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-1">הון נקי</p><p className={`text-2xl font-black mono-numbers ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>{netWorth.toLocaleString()}₪</p></div>
                         <Scale size={20} className="text-blue-500/50" />
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2"><span className="text-slate-500 font-bold">מזומן נזיל</span><span className="mono-numbers font-black text-emerald-400">{player.money.toLocaleString()}₪</span></div>
                         <div className="flex justify-between items-center text-[11px]"><span className="text-slate-500 font-bold">השקעות</span><span className="mono-numbers font-black text-blue-300">{(player.savings + (player.investments ? player.investments.reduce((a:number,c)=>a+(c.amount || 0),0) : 0)).toLocaleString()}₪</span></div>
                      </div>
                   </div>
               </div>
           </div>
        </div>

        <div className="app-sidebar order-last lg:order-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 lg:bg-white text-white lg:text-slate-900 shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>
              <div className="scale-75 lg:scale-100">{tab.icon}</div><span className="text-[9px] lg:text-[11px] font-black lg:hidden uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
          {activeTab !== 'admin' && <StatsHeader state={player} userName={userDisplayName} />}
          <div className="flex-1 relative overflow-hidden">
            {activeTab === 'board' && (
              <div className="w-full h-full flex flex-col items-center justify-start lg:justify-center overflow-y-auto no-scrollbar pt-2 lg:pt-0">
                
                {/* התרעה פיננסית אינטראקטיבית */}
                <div className="w-full max-w-4xl px-4 lg:px-0 mt-4 animate-in slide-in-from-top duration-500">
                    <div className={`p-4 rounded-[28px] border-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl ${financialBalanceStatus.bg} ${financialBalanceStatus.border}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${financialBalanceStatus.color} bg-white shadow-sm border-2 ${financialBalanceStatus.border}`}>
                                {financialBalanceStatus.icon}
                            </div>
                            <div className="text-right">
                                <h4 className={`font-black text-lg ${financialBalanceStatus.color}`}>{financialBalanceStatus.label}</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">מאזן מזומן מול תכנון חודשי</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8 bg-white/50 px-6 py-2 rounded-2xl border-2 border-slate-100">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">מזומן זמין</p>
                                <p className="font-black text-slate-900 tabular-nums">{player.money.toLocaleString()}₪</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">תכנון חודשי</p>
                                <p className="font-black text-indigo-600 tabular-nums">{totalPlannedBudget.toLocaleString()}₪</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">יתרה לתכנון</p>
                                <p className={`font-black tabular-nums ${player.money - totalPlannedBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {(player.money - totalPlannedBudget).toLocaleString()}₪
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border-y border-slate-200/60 relative overflow-hidden h-[45vh] lg:h-[55vh] w-full shadow-inner perspective-board">
                  <div ref={scrollRef} className="flex gap-8 lg:gap-12 overflow-x-auto py-16 lg:py-40 no-scrollbar px-[45%] w-full board-track-3d">
                    {Array.from({ length: 1001 }).map((_, i) => {
                      const config = getTileConfig(i); const isCurrent = player.tilesTraversed === i; const stepInMonth = (i % 50) === 0 && i !== 0 ? 50 : (i % 50);
                      return (
                        <div key={i} data-tile={i} className={`relative flex-shrink-0 w-28 lg:w-52 h-40 lg:h-72 border-2 rounded-[20px] lg:rounded-[40px] transition-all duration-700 flex flex-col items-center justify-center py-4 lg:py-10 tile-3d ${isCurrent ? 'active z-20 glow-active' : 'bg-white border-slate-100 opacity-60'}`}>
                          <div className="absolute top-3 right-3 bg-slate-900 text-white text-[7px] lg:text-[12px] font-black px-2 py-0.5 rounded-full mono-numbers">{stepInMonth}</div>
                          <div className={`w-10 h-10 lg:w-24 lg:h-24 flex items-center justify-center rounded-lg lg:rounded-[32px] ${config.color} border-2 mb-2 lg:mb-10 tile-icon-float shadow-sm`}>{config.icon && React.cloneElement(config.icon as React.ReactElement<any>, { size: (window.innerWidth < 768 ? 16 : 32) })}</div>
                          <p className="text-[9px] lg:text-lg font-black text-slate-800 tracking-tight text-center px-1 uppercase">{config.label}</p>
                          {isCurrent && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] billboard animate-bounce-marker pointer-events-none">
                               <div className="absolute bottom-6 w-16 h-4 bg-black/20 rounded-full blur-md transform rotateX(90deg)"></div>
                               <div className="transform scale-[0.6] lg:scale-[1.0] -translate-y-12"><CharacterAvatar inventory={player.inventory} appearance={player.appearance} minimal={true} /></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 lg:gap-8 py-6 lg:pb-0 shrink-0">
                   <div className={`w-20 h-20 lg:w-36 lg:h-36 bg-white border-4 lg:border-8 border-slate-100 rounded-[24px] lg:rounded-[56px] flex items-center justify-center shadow-2xl transition-all ${rolling ? 'dice-rolling' : ''}`}><span className="text-4xl lg:text-7xl font-black text-slate-800 mono-numbers">{rolling ? '?' : lastRoll || '?'}</span></div>
                   <button onClick={handleRoll} disabled={rolling || isProcessingMove || !!currentEvent || showMonthly || showLoanModal || showStockMarket || showBankBranch || player.gameOver} className="bg-slate-900 text-white px-12 lg:px-40 py-4 lg:py-6 text-lg lg:text-2xl font-black rounded-xl lg:rounded-[36px] hover:bg-blue-600 shadow-2xl transition-all active:scale-95 flex items-center gap-6">גלגל קוביה</button>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
                <div className="p-6 lg:p-20 overflow-y-auto h-full text-right pb-32 no-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <header className="flex flex-col md:flex-row justify-between items-end gap-6 text-right">
                            <div className="flex-1">
                                <h2 className="text-3xl lg:text-7xl font-black mb-4 italic uppercase tracking-tighter leading-none flex items-center justify-end gap-6">מצפן כלכלי // BUDGET <Compass size={64} className="text-blue-600" /></h2>
                                <p className="text-slate-500 font-bold max-w-2xl text-lg lg:text-xl">ניהול תזרים מזומנים אוטומטי. ההוצאות שלך נגזרות ישירות מהרכוש והנכסים שברשותך.</p>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                            <div className="bg-white p-10 lg:p-14 rounded-[56px] border-4 lg:border-8 border-slate-900 shadow-2xl space-y-10">
                                <h3 className="text-3xl lg:text-4xl font-black mb-8 flex items-center justify-end gap-4 underline decoration-8 italic">פירוט התחייבויות חודשיות</h3>
                                <div className="space-y-6">
                                    {Object.entries(player.budget).filter(([_, val]) => (val as number) > 0).map(([catId, val]) => {
                                        const cat = budgetLibrary.find(c => c.id === catId) || { label: catId, color: 'bg-slate-400' };
                                        return (
                                            <div key={catId} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                                                <span className="mono-numbers font-black text-2xl text-red-600">-{ (val as number).toLocaleString() }₪</span>
                                                <div className="flex items-center gap-4">
                                                   <span className="text-lg font-black uppercase text-slate-800">{cat.label}</span>
                                                   <div className={`w-4 h-4 rounded-full ${cat.color}`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {totalPlannedBudget === 0 && (
                                        <div className="text-center py-20">
                                            <Sparkles size={48} className="mx-auto text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold italic text-xl">אין לך כרגע הוצאות קבועות. נקה ראש!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-10 lg:p-14 rounded-[56px] border-4 lg:border-8 border-slate-700 shadow-2xl space-y-12">
                                <h3 className="text-3xl lg:text-4xl font-black mb-8 flex items-center justify-end gap-4 italic">ניתוח תזרים <BarChart size={32}/></h3>
                                <div className="space-y-10">
                                    <div className="bg-white/5 p-10 rounded-[40px] space-y-4 border border-white/5">
                                        <p className="text-xs lg:text-sm font-black text-blue-400 uppercase tracking-widest">סה"כ משיכה חודשית</p>
                                        <p className="text-5xl lg:text-7xl font-black mono-numbers tracking-tighter text-red-400">
                                          -{totalPlannedBudget.toLocaleString()}₪
                                        </p>
                                        <p className="text-xs lg:text-base font-bold text-slate-500 italic mt-4">הכנסה חודשית (נטו): {player.job.salary.toLocaleString()}₪</p>
                                    </div>
                                    
                                    <div className="bg-emerald-500/10 p-8 rounded-[32px] border-2 border-emerald-500/20">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-2xl font-black ${player.job.salary - totalPlannedBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {(player.job.salary - totalPlannedBudget).toLocaleString()}₪
                                            </span>
                                            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">יתרה חודשית לאחר הוצאות</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="p-6 lg:p-20 overflow-y-auto h-full no-scrollbar pb-32">
                <div className="max-w-5xl mx-auto text-right">
                  <header className="mb-16"><h2 className="text-3xl lg:text-7xl font-black mb-6 italic uppercase leading-none flex items-center justify-end gap-6">דירוג הון // RANK <Trophy className="text-amber-500" size={64} /></h2><p className="text-slate-500 font-bold text-lg lg:text-xl">דירוג בזמן אמת של כל המשתמשים במערכת לפי הון נקי (שווי נכסים פחות חובות).</p></header>
                  <div className="space-y-6">
                    {sortedLeaderboard.map((p, i) => (
                      <div key={i} className={`p-8 lg:p-12 rounded-[48px] border-4 lg:border-8 flex items-center justify-between transition-all ${p.isPlayer ? 'bg-blue-600 border-blue-600 text-white shadow-2xl scale-[1.03]' : 'bg-white border-slate-100 text-slate-800 hover:border-slate-300'}`}>
                         <p className="text-2xl lg:text-4xl font-black mono-numbers">{p.money.toLocaleString()}₪</p>
                         <div className="flex items-center gap-6 lg:gap-12"><h3 className="text-lg lg:text-3xl font-black truncate max-w-[150px] lg:max-w-none text-right">{p.name}</h3><div className={`w-14 lg:w-20 h-14 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center ${p.color}`}><UserIcon size={window.innerWidth < 1024 ? 24 : 40} /></div><div className="w-10 lg:w-16 h-10 lg:h-16 flex items-center justify-center font-black text-xl lg:text-4xl mono-numbers opacity-30">#{i + 1}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'shop' && (
              <div className="p-6 lg:p-14 overflow-y-auto h-full no-scrollbar pb-32">
                <div className="max-w-full mx-auto space-y-12">
                  <header className="flex flex-col md:flex-row justify-between items-end gap-8 text-right">
                    <div className="flex-1">
                      <h2 className="text-3xl lg:text-6xl font-black mb-4 italic uppercase tracking-tighter leading-none">המרקט // MARKETPLACE</h2>
                      <p className="text-slate-500 font-bold max-w-2xl text-base lg:text-lg">רכישות כאן משפיעות על האושר והקריירה שלך, אך היזהר מהוצאות תחזוקה חודשיות!</p>
                    </div>
                    <div className="flex bg-slate-200/50 p-1.5 rounded-[24px] border-2 border-slate-300/50 shadow-inner">
                      {[
                        { id: 'ALL', label: 'הכל', icon: <Layers size={16} /> },
                        { id: 'EQUIPMENT', label: 'מקצועי', icon: <Briefcase size={16} /> },
                        { id: 'LIFESTYLE', label: 'האושר שלי', icon: <Heart size={16} /> }
                      ].map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setShopCategory(cat.id as any)} 
                          className={`px-5 py-2.5 rounded-[18px] font-black text-[11px] uppercase transition-all flex items-center gap-2 ${shopCategory === cat.id ? 'bg-white text-slate-900 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {cat.icon}
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                    {filteredShopItems.map(item => {
                      const owned = player.inventory.includes(item.name); 
                      const canAfford = player.money >= item.price;
                      return (
                        <div key={item.id} className={`group bg-white rounded-[40px] p-6 lg:p-8 border-2 lg:border-4 transition-all relative overflow-hidden flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] ${owned ? 'border-emerald-500/30' : 'border-slate-100 hover:border-blue-500'}`}>
                           {owned && (
                             <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
                               <div className="bg-emerald-500 text-white px-5 py-2 rounded-full font-black text-sm shadow-xl flex items-center gap-2 transform rotate-[-8deg]">
                                 <CheckCircle2 size={18} /> בבעלותך
                               </div>
                             </div>
                           )}
                           
                           <div className="mb-6 relative z-0">
                              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all border-2 ${owned ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 border-slate-100 group-hover:border-blue-200'}`}>
                                {getShopIcon(item.id)}
                              </div>
                              <h3 className="text-xl lg:text-2xl font-black mb-2 text-right tracking-tight">{item.name}</h3>
                              <p className="text-xs lg:text-sm font-bold text-slate-400 text-right leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                              
                              {item.monthlyCost && (
                                <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 mb-4 flex justify-between items-center">
                                    <span className="mono-numbers font-black text-red-600 text-xs">-{item.monthlyCost}₪/חודש</span>
                                    <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">תחזוקה</span>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">
                                  <span className="text-emerald-500">+{item.happiness}%</span>
                                  <span>אושר</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${item.happiness * 2}%` }} />
                                </div>
                              </div>
                           </div>

                           <div className="space-y-5 mt-auto">
                              <div className="flex justify-between items-baseline border-t-2 border-slate-50 pt-4">
                                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Price</span>
                                 <p className={`text-2xl lg:text-3xl font-black mono-numbers tracking-tighter ${!canAfford && !owned ? 'text-red-500' : 'text-slate-900'}`}>
                                    {item.price.toLocaleString()}₪
                                 </p>
                              </div>
                              <button 
                                onClick={() => applyImpact({ money: -item.price, happiness: item.happiness, inventory: item.name })} 
                                disabled={owned || !canAfford} 
                                className={`w-full py-3.5 lg:py-4 rounded-[20px] font-black uppercase text-sm tracking-widest transition-all ${owned ? 'opacity-0' : !canAfford ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-dashed border-slate-200 shadow-none' : 'bg-slate-950 text-white hover:bg-blue-600 active:scale-95 shadow-lg shadow-blue-900/10'}`}
                              >
                                {owned ? '' : !canAfford ? 'יתרה נמוכה' : 'רכוש'}
                              </button>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="p-6 lg:p-14 overflow-y-auto h-full no-scrollbar pb-32 text-right">
                <div className="max-w-5xl mx-auto space-y-12">
                   <header>
                      <h2 className="text-3xl lg:text-6xl font-black italic uppercase leading-none mb-4">קריירה // OPPORTUNITIES</h2>
                      <p className="text-slate-500 font-bold text-base lg:text-xl">מציאת משרה חדשה היא הדרך המהירה ביותר להגדיל את התזרים החודשי.</p>
                   </header>

                   <div className="space-y-6">
                      {careers.map(job => {
                        const isCurrent = player.job.id === job.id;
                        const missingDegrees = job.requirements.degrees.filter(d => !player.degrees.includes(d));
                        const missingItems = job.requirements.equipment.filter(e => !player.inventory.includes(e));
                        const canApply = missingDegrees.length === 0 && missingItems.length === 0;
                        const config = categoryConfig[job.category] || categoryConfig.SERVICE;

                        return (
                          <div key={job.id} className={`group p-6 lg:p-8 rounded-[40px] border-2 lg:border-4 flex flex-col md:flex-row items-center gap-6 lg:gap-10 transition-all relative overflow-hidden ${isCurrent ? 'bg-blue-50 border-blue-600 shadow-xl scale-[1.01]' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}>
                             {isCurrent && (
                               <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg animate-pulse">
                                 Current Role
                               </div>
                             )}

                             <div className={`w-20 h-20 lg:w-28 lg:h-28 rounded-[28px] flex items-center justify-center shrink-0 border-2 lg:border-4 transition-all ${isCurrent ? 'bg-blue-600 border-blue-300 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-200 group-hover:text-blue-200 group-hover:border-blue-100'}`}>
                                <Briefcase size={window.innerWidth < 1024 ? 32 : 44}/>
                             </div>

                             <div className="flex-1 text-right space-y-3">
                                <div>
                                   <div className="flex flex-wrap items-center justify-end gap-3 mb-1">
                                      <span className={`px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest ${config.bg} ${config.color} border border-current/20`}>
                                        {config.label}
                                      </span>
                                      <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{job.name}</h3>
                                   </div>
                                   <p className="text-slate-400 font-bold text-base lg:text-xl">משכורת: <span className="text-emerald-600 font-black mono-numbers">{job.salary.toLocaleString()}₪</span></p>
                                </div>

                                <div className="space-y-2">
                                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">דרישות // REQS</p>
                                   <div className="flex flex-wrap gap-2 justify-end">
                                      {job.requirements.degrees.length === 0 && job.requirements.equipment.length === 0 && (
                                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-xl font-black text-[10px]">פתוח לכולם</div>
                                      )}
                                      {job.requirements.degrees.map(d => {
                                        const owned = player.degrees.includes(d);
                                        return (
                                          <div key={d} className={`px-3 py-1.5 rounded-xl text-[10px] font-black border flex items-center gap-2 transition-all ${owned ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                                            {owned ? <Check size={12} /> : <GraduationCap size={12} />}
                                            {d}
                                          </div>
                                        );
                                      })}
                                      {job.requirements.equipment.map(e => {
                                        const owned = player.inventory.includes(e);
                                        return (
                                          <div key={e} className={`px-3 py-1.5 rounded-xl text-[10px] font-black border flex items-center gap-2 transition-all ${owned ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                                            {owned ? <Check size={12} /> : <Box size={12} />}
                                            {e}
                                          </div>
                                        );
                                      })}
                                   </div>
                                </div>
                             </div>

                             <button 
                                onClick={() => { sounds.playSuccess(); setPlayer(p => ({...p, job})); }} 
                                disabled={isCurrent || !canApply} 
                                className={`px-8 py-4 rounded-[20px] font-black text-sm uppercase transition-all shadow-lg shrink-0 ${isCurrent ? 'bg-emerald-500 text-white cursor-default' : !canApply ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-dashed border-slate-200 shadow-none' : 'bg-slate-950 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-blue-900/10'}`}
                             >
                               {isCurrent ? 'בתפקיד' : canApply ? 'התחל לעבוד' : 'חסרים תנאים'}
                             </button>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="p-6 lg:p-20 overflow-y-auto h-full text-right pb-32 no-scrollbar">
                <div className="max-w-7xl mx-auto space-y-16">
                   <header><h2 className="text-4xl lg:text-7xl font-black mb-6 italic uppercase tracking-tighter">תיק נכסים // PORTFOLIO</h2><p className="text-slate-500 font-bold text-lg lg:text-xl">ניהול הון, זהות דיגיטלית והיסטוריה פיננסית.</p></header>
                   <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 lg:gap-16">
                      <div className="bg-white p-10 lg:p-14 rounded-[56px] border-4 lg:border-8 border-slate-900 shadow-2xl xl:col-span-2 space-y-12">
                         <h3 className="text-3xl font-black mb-8 flex items-center justify-end gap-4 underline decoration-8">עריכת דמות // APPEARANCE <Palette size={32}/></h3>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                            <div className="flex justify-center bg-slate-50 rounded-[48px] p-10 border-4 border-slate-100 shadow-inner">
                                <CharacterAvatar inventory={player.inventory} appearance={player.appearance} minimal={true} />
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">מגדר</p>
                                    <div className="flex flex-wrap gap-4 justify-end">
                                        <button onClick={() => setPlayer(p => ({ ...p, appearance: { ...p.appearance, gender: 'MALE' } }))} className={`px-10 py-3.5 rounded-2xl border-4 transition-all text-xs font-black ${player.appearance.gender === 'MALE' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-100 border-slate-100 text-slate-400'}`}>בן</button>
                                        <button onClick={() => setPlayer(p => ({ ...p, appearance: { ...p.appearance, gender: 'FEMALE' } }))} className={`px-10 py-3.5 rounded-2xl border-4 transition-all text-xs font-black ${player.appearance.gender === 'FEMALE' ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-slate-100 border-slate-100 text-slate-400'}`}>בת</button>
                                    </div>
                                </div>
                                {[
                                    { label: 'צבע עור', key: 'skin', options: ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524'] },
                                    { label: 'עיצוב פנים', key: 'face', options: ['SMILE', 'SMIRK', 'CHILL', 'NERD', 'SERIOUS', 'ELITE'] },
                                    { label: 'צבע שיער', key: 'hair', options: ['#2d1b0d', '#4e342e', '#fbc02d', '#757575'] },
                                    { label: 'צבע חולצה', key: 'shirt', options: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'] }
                                ].map(row => (
                                    <div key={row.key} className="space-y-3">
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{row.label}</p>
                                        <div className="flex flex-wrap gap-3 justify-end">
                                            {row.options.map(opt => (
                                                <button key={opt} onClick={() => setPlayer(p => ({ ...p, appearance: { ...p.appearance, [row.key]: opt } }))} className={`w-12 h-12 rounded-2xl border-4 transition-all ${player.appearance[row.key as keyof Appearance] === opt ? 'border-blue-500 scale-110 shadow-xl' : 'border-slate-100 hover:border-slate-300'}`} style={{ backgroundColor: row.key !== 'face' ? opt : 'transparent' }}>{row.key === 'face' && <span className="text-[10px] font-black">{opt[0]}</span>}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                      </div>
                      <div className="bg-slate-900 text-white p-10 lg:p-14 rounded-[56px] border-4 lg:border-8 border-slate-700 shadow-2xl h-fit">
                         <h3 className="text-3xl font-black mb-10 flex items-center justify-end gap-4 italic">פיננסי // ASSETS <Wallet size={32}/></h3>
                         <div className="space-y-8">
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                               <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">מזומן נזיל</p>
                               <p className="text-4xl font-black mono-numbers tabular-nums">{player.money.toLocaleString()}₪</p>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                               <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">פיקדונות וחסכונות</p>
                               <p className="text-4xl font-black mono-numbers tabular-nums">{player.savings.toLocaleString()}₪</p>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                               <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">הלוואות וחובות</p>
                               <p className="text-4xl font-black mono-numbers text-red-400 tabular-nums">-{Math.round(player.loans).toLocaleString()}₪</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white p-10 lg:p-14 rounded-[56px] border-4 lg:border-8 border-slate-900 shadow-2xl">
                      <h3 className="text-3xl font-black mb-10 flex items-center justify-end gap-4 underline decoration-8">רכוש וציוד // INVENTORY <Box size={32}/></h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-8">
                         {player.inventory.length === 0 ? <p className="col-span-full py-16 text-slate-300 font-bold italic text-center text-xl">אין עדיין רכוש בבעלותך</p> : player.inventory.map(item => {
                           const itemData = shopItems.find(si => si.name === item);
                           return (
                             <div key={item} className="p-8 bg-slate-50 rounded-[32px] border-4 border-slate-100 flex flex-col items-center text-center gap-6 hover:border-blue-500 hover:bg-blue-50 transition-all relative group">
                                <div className="p-4 bg-white rounded-2xl shadow-md text-blue-600"><Check size={32}/></div>
                                <span className="font-black text-sm lg:text-base text-slate-700">{item}</span>
                                {itemData && (
                                    <button 
                                      onClick={() => handleSellItem(item)}
                                      className="mt-2 text-[10px] font-black text-red-500 hover:text-red-700 underline uppercase tracking-widest"
                                    >
                                      מכור נכס
                                    </button>
                                )}
                             </div>
                           );
                         })}
                      </div>
                   </div>
                   <div className="bg-amber-50 p-12 lg:p-16 rounded-[56px] border-4 lg:border-8 border-amber-900 flex flex-col xl:flex-row justify-between items-center gap-10">
                      <div className="text-right flex-1">
                         <h3 className="text-3xl lg:text-5xl font-black text-amber-900 mb-4 flex items-center justify-end gap-6">אזור סכנה // RESET <AlertCircle size={48}/></h3>
                         <p className="text-amber-800 font-bold text-lg lg:text-xl">איפוס המשחק ימחק את כל ההתקדמות שלך לצמיתות. חשוב פעמיים!</p>
                      </div>
                      <button onClick={handleSelfReset} className="px-16 py-6 bg-amber-900 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center gap-4 active:scale-95">איפוס משחק <RefreshCcw size={28}/></button>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'admin' && currentUser?.role === 'ADMIN' && !inspectingUser && (
                <div className="w-full h-full overflow-hidden">
                    <AdminDashboard 
                        onLogout={handleLogout} 
                        isEmbed={true} 
                        onUpdateCareers={setCareers} 
                        onUpdateShop={setShopItems}
                        onUpdateMissions={setMissionLibrary}
                        onUpdateLuck={setLuckLibrary}
                        onUpdateOpportunities={setOpportunityLibrary}
                        onUpdateDecisions={setDecisionLibrary}
                        onUpdateStocks={setStockMarket}
                        onUpdateBankRate={setBankRate}
                        onUpdateBudgetCategories={setBudgetLibrary}
                        onInspectUser={handleInspectUser}
                    />
                </div>
            )}
          </div>
        </div>
      </div>

      {currentEvent && <EventModal event={currentEvent} onChoice={applyImpact} playerState={player} />}
      {showMonthly && <MonthlySummary salary={player.job.salary} expenses={totalPlannedBudget} inventory={player.inventory} investmentsResults={monthlyResults} recentTransactions={player.recentTransactions} onClose={processMonthlyPayment} />}
      {showLoanModal && <LoanModal requiredAmount={pendingImpact?.money ? -pendingImpact.money : 0} interestRate={isBankLoan ? bankRate : LOAN_INTEREST_RATE} canCancel={true} onAccept={(amt) => { setPlayer(p => ({...p, money: p.money + amt, loans: p.loans + amt})); setShowLoanModal(false); if (pendingImpact) applyImpact(pendingImpact, pendingImpact.isSuccess); }} onDecline={() => setPlayer(p => ({ ...p, gameOver: true }))} onCancel={() => { setShowLoanModal(false); setPendingImpact(null); }} />}
      {showStockMarket && <StockMarketModal player={player} onTrade={handleStockTrade} onClose={() => setShowStockMarket(false)} />}
      {showBankBranch && <BankBranchModal player={player} onTakeLoan={(amt) => handleBankAction('loan', amt)} onDeposit={(amt) => handleBankAction('deposit', amt)} onClose={() => setShowBankBranch(false)} />}
      {player?.gameOver && <GameOverModal onRestart={() => window.location.reload()} />}
      <AIAdvisorPanel state={player} isFree={showBankBranch} onUse={(cost) => setPlayer(p => ({ ...p, money: p.money - cost }))} />
    </div>
  );
};

export default App;