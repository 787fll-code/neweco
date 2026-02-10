
import { Career, House, TileType, GameEvent, ShopItem } from './types';

export const INITIAL_SALARY = 5300;
export const BASIC_EXPENSES = 0; // Everything is now dynamic
export const LOAN_INTEREST_RATE = 0.20; 
export const BANK_LOAN_INTEREST_RATE = 0.10; 

export const BUDGET_CATEGORIES = [
  { id: 'housing', label: 'דיור ואחזקה', color: 'bg-blue-500', icon: 'HomeIcon' },
  { id: 'food', label: 'מזון וקניות', color: 'bg-emerald-500', icon: 'ShoppingCart' },
  { id: 'transport', label: 'תחבורה', color: 'bg-amber-500', icon: 'Bike' },
  { id: 'entertainment', label: 'בילוי ופנאי', color: 'bg-purple-500', icon: 'Gamepad2' },
  { id: 'savings', label: 'חיסכון והשקעות', color: 'bg-indigo-500', icon: 'PiggyBank' },
  { id: 'misc', label: 'שונות', color: 'bg-slate-500', icon: 'Box' }
];

export const EXPENSE_BREAKDOWN = []; // Will be built dynamically

export const HOUSES: Record<string, House> = {
  'RENTAL': { id: 'RENTAL', name: 'דירת שותפים', price: 0, monthlyMaintenance: 3500, happinessBonus: 0 },
  'STUDIO_OWNED': { id: 'STUDIO_OWNED', name: 'דירת סטודיו', price: 950000, monthlyMaintenance: 900, happinessBonus: 15 },
  'SMALL_HOUSE': { id: 'SMALL_HOUSE', name: 'דירת 3 חדרים', price: 1850000, monthlyMaintenance: 1600, happinessBonus: 30 },
  'LUXURY_VILLA': { id: 'LUXURY_VILLA', name: 'וילה בקיסריה', price: 6500000, monthlyMaintenance: 7500, happinessBonus: 75 }
};

export const STOCK_MARKET = [
  { id: 'S&P500', name: 'מדד S&P 500', baseReturn: 0.008, volatility: 0.04, marketCap: '45.2T $', peRatio: '24.5', dividendYield: '1.3%', description: 'המדד המפורסם בעולם, המאגד את 500 החברות הגדולות ביותר בארה"ב.' },
  { id: 'NASDAQ', name: 'מדד נאסד"ק', baseReturn: 0.012, volatility: 0.06, marketCap: '22.8T $', peRatio: '35.2', dividendYield: '0.7%', description: 'מדד הממוקד בחברות טכנולוגיה וצמיחה.' },
  { id: 'TECH_BASKET', name: 'סל טכנולוגיה ישראלי', baseReturn: 0.015, volatility: 0.10, marketCap: '850B ₪', peRatio: '18.4', dividendYield: '1.1%', description: 'ריכוז של חברות הייטק וסטארט-אפים כחול-לבן.' },
  { id: 'GOLD', name: 'זהב', baseReturn: 0.003, volatility: 0.02, marketCap: '14.5T $', peRatio: 'N/A', dividendYield: 'אין', description: 'הנכס שנחשב ל"חוף מבטחים".' },
  { id: 'BITCOIN', name: 'BITCOIN', baseReturn: 0.04, volatility: 0.25, marketCap: '1.2T $', peRatio: 'N/A', dividendYield: 'אין', description: 'המטבע הדיגיטלי הראשון.' }
];

export const CAREERS: Career[] = [
  { id: 'entry', name: 'שליח באפליקציה', salary: 5300, category: 'SERVICE', requirements: { degrees: [], equipment: [] } },
  { id: 'waiter', name: 'מלצר במסעדת שף', salary: 8800, category: 'SERVICE', requirements: { degrees: [], equipment: [] } },
  { id: 'chef', name: 'טבח מקצועי', salary: 12500, category: 'SERVICE', requirements: { degrees: [], equipment: ['ערכת סכיני שף'] } },
  { id: 'qa_tester', name: 'בודק תוכנה (QA)', salary: 15500, category: 'TECH', requirements: { degrees: ['קורס QA'], equipment: ['מחשב נייד חזק'] } },
  { id: 'jr_dev', name: 'מפתח Fullstack ג\'וניור', salary: 23000, category: 'TECH', requirements: { degrees: ['תואר במדעי המחשב'], equipment: ['מחשב נייד חזק'] } }
];

export const SHOP_ITEMS: ShopItem[] = [
  { 
    id: 'knives', 
    name: 'ערכת סכיני שף', 
    price: 1200, 
    happiness: 5, 
    type: 'EQUIPMENT',
    description: 'ציוד חובה לכל מי שרוצה להתקדם במטבח המקצועי.'
  },
  { 
    id: 'laptop_pro', 
    name: 'מחשב נייד חזק', 
    price: 13500, 
    monthlyCost: 150,
    happiness: 15, 
    type: 'EQUIPMENT',
    description: 'כלי עבודה הכרחי לקריירה בטכנולוגיה. דורש ביטוח ותחזוקה.'
  },
  { 
    id: 'suit', 
    name: 'חליפת עסקים', 
    price: 4200, 
    monthlyCost: 200,
    happiness: 10, 
    type: 'EQUIPMENT',
    description: 'מראה מקצועי. דורש ניקוי יבש חודשי קבוע.'
  },
  { 
    id: 'car_used', 
    name: 'מכונית משומשת', 
    price: 45000, 
    monthlyCost: 1200,
    happiness: 30, 
    type: 'LIFESTYLE',
    description: 'חופש תנועה. כולל ביטוח, דלק וטסט.'
  },
  { 
    id: 'smartphone', 
    name: 'סמארטפון דגל', 
    price: 5800, 
    monthlyCost: 99,
    happiness: 25, 
    type: 'LIFESTYLE',
    description: 'הדגם הכי חדש. כולל חבילת גלישה וביטוח מסך.'
  },
  { 
    id: 'console', 
    name: 'קונסולת גיימינג', 
    price: 2800, 
    monthlyCost: 50,
    happiness: 20, 
    type: 'LIFESTYLE',
    description: 'בילוי מושלם. כולל מנוי משחקים חודשי.'
  },
  { 
    id: 'scooter', 
    name: 'קורקינט חשמלי', 
    price: 3200, 
    monthlyCost: 40,
    happiness: 15, 
    type: 'LIFESTYLE',
    description: 'תנועה מהירה בעיר. דורש טעינה ותחזוקת סוללה.'
  },
  { 
    id: 'coffee_machine', 
    name: 'מכונת אספרסו', 
    price: 1800, 
    monthlyCost: 120,
    happiness: 12, 
    type: 'LIFESTYLE',
    description: 'קפה איכותי. עלות קפסולות ותחזוקה חודשית.'
  }
];

export const MISSION_LIBRARY: GameEvent[] = [
  {
    type: 'MISSION',
    title: "זהה את הנוכל: בנקאות",
    description: "מישהו מנסה לגנוב את פרטי הגישה שלך. מי מהשולחים הוא נוכל?",
    intel: "בנקים לעולם לא מבקשים סיסמה דרך קישור במייל.",
    miniGameType: 'SCAMMER',
    scammerData: {
      emails: [
        { text: "מאת: BankPoalim_Security@gmail.com. 'חשבונך נחסם עקב פעילות חשודה. לחץ כאן לעדכון סיסמה'.", isScam: true, reason: "הבנק לא משתמש בכתובת gmail." },
        { text: "מאת: support@bankpoalim.co.il. 'הודעה חדשה מחכה לך בתיבת המכתבים באתר הבנק. היכנס לאתר הרשמי לצפייה'.", isScam: false, reason: "מייל אינפורמטיבי המפנה לאתר הרשמי ללא בקשת פרטים." }
      ]
    },
    impact: { money: 500, happiness: 10 }
  },
  {
    type: 'MISSION',
    title: "זהה את הנוכל: דואר ישראל",
    description: "קיבלת הודעה על חבילה שממתינה לך. האם היא אמיתית?",
    intel: "הודעות על תשלום מכס קטן (2 שקלים) הן לרוב עוקץ לגניבת פרטי אשראי.",
    miniGameType: 'SCAMMER',
    scammerData: {
      emails: [
        { text: "מאת: IsraelPost-Service@bit.ly. 'חבילה מספר IL-9983 מעוכבת. שלם עמלה של 2.50₪ לשחרור'.", isScam: true, reason: "כתובת הקישור (bit.ly) היא קיצור לינקים ולא אתר רשמי." },
        { text: "מאת: info@israelpost.co.il. 'החבילה שלך הגיעה למרכז ההפצה ותימסר בתוך 3 ימי עסקים'.", isScam: false, reason: "מייל סטנדרטי ללא בקשת תשלום מיידית בלינק חשוד." }
      ]
    },
    impact: { money: 500, happiness: 5 }
  }
];

export const DECISION_LIBRARY: GameEvent[] = [
  {
    type: 'DECISION',
    title: "צמא בדרך לעבודה",
    description: "אתה צמא מאוד. האם תבחר בבקבוק המים המעוצב בפיצוצייה או במים מהברזיה הקרובה?",
    intel: "החלטות קטנות מצטברות להון גדול.",
    options: [
      { label: "מים מינרליים (15 ₪)", impact: { money: -15, happiness: 5 } },
      { label: "מים מהברזיה (0 ₪)", impact: { money: 0, happiness: -2 } }
    ]
  }
];

export const OPPORTUNITY_LIBRARY: GameEvent[] = [
  {
    type: 'OPPORTUNITY',
    title: "מדד ה-S&P 500 בירידה!",
    description: "השוק חווה תיקון. זו הזדמנות לקנות נכסים ב'הנחה'.",
    intel: "כשכולם מפחדים, זה הזמן לקנות.",
    options: [
      { label: "השקע 10,000₪ במדד", impact: { money: -10000, investment: { stockId: 'S&P500', stockName: 'מדד S&P 500', cost: 12000, isDiscount: true }, happiness: 10 } },
      { label: "שמור על המזומן", impact: {} }
    ]
  }
];

export const LUCK_LIBRARY: GameEvent[] = [
  {
    type: 'LUCK',
    title: "זכייה בפיס!",
    description: "קיבלת הודעה מפתיעה על זכייה בסכום כספי.",
    intel: "כסף מהיר (Windfall) כדאי להשקיע מיד.",
    impact: { money: 10000, happiness: 35 }
  }
];

const createMixedProbabilityPool = (totalSize: number = 2000) => {
    let pool: TileType[] = [];
    const counts = {
        MISSION: Math.floor(totalSize * 0.20),
        DECISION: Math.floor(totalSize * 0.20),
        OPPORTUNITY: Math.floor(totalSize * 0.15),
        EMPTY: Math.floor(totalSize * 0.25),
        LUCK: Math.floor(totalSize * 0.10),
        BANK: Math.floor(totalSize * 0.05),
        STOCKS: Math.floor(totalSize * 0.05)
    };
    
    Object.entries(counts).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) pool.push(type as TileType);
    });
    
    while (pool.length < totalSize) pool.push('EMPTY');
    
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool;
};

const POOL_SIZE = 2000;
const PROBABILITY_POOL = createMixedProbabilityPool(POOL_SIZE);

export const BOARD_FLAVORS: Record<string, (index: number) => TileType> = {
  'BASIC': (i) => {
    if (i === 0) return 'EMPTY';
    if (i % 50 === 0) return 'START';
    const pos = i % POOL_SIZE;
    return PROBABILITY_POOL[pos];
  }
};
