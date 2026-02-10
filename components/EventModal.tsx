
import React, { useState, useEffect, useRef } from 'react';
import { GameEvent, PlayerState } from '../types';
import { Info, CheckCircle2, XCircle, Mail, Zap, Wallet, Heart, ArrowRight, Star, AlertCircle, ShoppingCart, HelpCircle, GraduationCap, Timer } from 'lucide-react';
import { sounds } from '../services/soundService';

interface Props {
  event: GameEvent;
  onChoice: (impact: any, isSuccess?: boolean) => void;
  playerState: PlayerState;
}

const EventModal: React.FC<Props> = ({ event, onChoice, playerState }) => {
  const isMiniGame = event.miniGameType === 'SCAMMER' || event.miniGameType === 'QUIZ';
  // Skip intro if it is a mission
  const shouldSkipIntro = event.type === 'MISSION';
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>(shouldSkipIntro ? 'playing' : 'intro');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    sounds.playClick();
    
    if (gameState === 'playing' && isMiniGame) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isMiniGame]);

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSuccess(false);
    setResultMessage("נגמר הזמן! לא הצלחת להשלים את המשימה.");
    setGameState('result');
    sounds.playError();
  };

  const typeConfig = {
    MISSION: {
      color: 'amber',
      icon: event.miniGameType === 'QUIZ' ? <GraduationCap size={32} /> : <Zap size={32} />,
      title: 'משימה (חובה)',
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-900',
      button: 'bg-amber-600 hover:bg-amber-700',
      tag: 'פעולה נדרשת'
    },
    DECISION: {
      color: 'purple',
      icon: <HelpCircle size={32} />,
      title: 'החלטה (חובה)',
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-900',
      button: 'bg-purple-600 hover:bg-purple-700',
      tag: 'בחירה גורלית'
    },
    OPPORTUNITY: {
      color: 'blue',
      icon: <ShoppingCart size={32} />,
      title: 'הזדמנות (אופציונלי)',
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-900',
      button: 'bg-blue-600 hover:bg-blue-700',
      tag: 'הצעה חד פעמית'
    },
    LUCK: {
      color: 'emerald',
      icon: <Star size={32} />,
      title: 'מזל (כפוי)',
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-900',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      tag: 'אירוע חיים'
    },
    START: { color: 'slate', icon: null, title: '', bg: '', border: '', text: '', button: '', tag: '' },
    EMPTY: { color: 'slate', icon: null, title: '', bg: '', border: '', text: '', button: '', tag: '' }
  };

  const config = typeConfig[event.type] || typeConfig.OPPORTUNITY;

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleScammerChoice = (index: number) => {
    const email = event.scammerData?.emails[index];
    if (!email) return;
    
    stopTimer();
    setSelectedOptionIndex(index);
    const success = !email.isScam;
    setIsSuccess(success);
    setResultMessage(email.reason);
    setGameState('result');
    
    if (success) sounds.playSuccess();
    else sounds.playError();
  };

  const handleQuizChoice = (index: number) => {
    const opt = event.quizData?.options[index];
    if (!opt) return;
    
    stopTimer();
    setSelectedOptionIndex(index);
    const success = opt.isCorrect;
    setIsSuccess(success);
    setResultMessage(event.quizData!.explanation);
    setGameState('result');
    
    if (success) sounds.playSuccess();
    else sounds.playError();
  };

  const handleSimpleLuck = () => {
    onChoice(event.impact);
    sounds.playSuccess();
  };

  const renderMiniStats = () => (
    <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 bg-white/60 p-3 rounded-2xl border border-black/10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Wallet size={12} className="text-blue-600" />
            </div>
            <span className="text-xs font-black mono-numbers text-slate-700">{playerState.money.toLocaleString()}₪</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <Heart size={12} className="text-red-500" />
            </div>
            <span className="text-xs font-black text-slate-700">{playerState.happiness}%</span>
          </div>
        </div>
        
        {gameState === 'playing' && isMiniGame && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black mono-numbers ${timer < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                <Timer size={16} />
                <span>00:{timer.toString().padStart(2, '0')}</span>
            </div>
        )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className={`max-w-xl w-full bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 lg:p-12 relative overflow-hidden ${config.bg}`}>
        
        {/* Type Tag */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${config.button}`}>
           {config.tag}
        </div>

        {/* Themed Header */}
        <div className="flex items-center gap-4 mb-8 mt-4">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${config.button} text-white`}>
              {config.icon}
           </div>
           <div className="text-right">
              <h4 className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${config.text}`}>{config.title}</h4>
              <h2 className="text-2xl lg:text-3xl font-black text-black leading-none">{event.title}</h2>
           </div>
        </div>

        {renderMiniStats()}

        {gameState === 'intro' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg lg:text-xl font-bold text-slate-800 leading-relaxed text-right">{event.description}</p>
              <div className="bg-white/80 p-5 border-2 border-dashed border-black/20 rounded-2xl flex items-start gap-3">
                 <Info className="text-blue-600 shrink-0 mt-1" size={20} />
                 <p className="text-sm font-bold text-slate-600 italic leading-snug text-right w-full">טיפ כלכלי: {event.intel}</p>
              </div>
            </div>

            <div className="space-y-3">
               {event.options ? (
                event.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => onChoice(opt.impact)}
                    className="w-full p-5 bg-white border-4 border-black text-right hover:bg-black hover:text-white transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center relative z-10">
                       <span className="font-black text-lg">{opt.label}</span>
                       <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </div>
                    {opt.description && <p className="text-xs font-bold mt-1 opacity-70">{opt.description}</p>}
                  </button>
                ))
              ) : (
                <button 
                  onClick={handleSimpleLuck}
                  className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all ${config.button}`}
                >
                  הבנתי, המשך
                </button>
              )}
            </div>
            
            {(event.type === 'MISSION' || event.type === 'DECISION') && (
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-amber-600 uppercase">
                    <AlertCircle size={14} />
                    אירוע חובה - עליך לבחור אחת מהאפשרויות
                </div>
            )}
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-6">
            <div className="space-y-4 mb-4">
              <p className="text-lg font-bold text-slate-800 leading-relaxed text-right">{event.description}</p>
            </div>
            
            {event.miniGameType === 'SCAMMER' && (
              <>
                <h3 className="text-xl font-black mb-4 flex items-center justify-end gap-2 italic text-right">
                   זהה את המייל האמין: <Mail className="text-amber-600 inline" />
                </h3>
                <div className="space-y-4">
                  {event.scammerData?.emails.map((email, i) => (
                    <button
                      key={i}
                      onClick={() => handleScammerChoice(i)}
                      className="w-full p-6 bg-white border-4 border-black text-right font-bold text-sm lg:text-base hover:bg-amber-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
                    >
                      {email.text}
                    </button>
                  ))}
                </div>
              </>
            )}
            {event.miniGameType === 'QUIZ' && (
              <>
                <h3 className="text-xl font-black mb-4 text-right">
                   {event.quizData?.question}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {event.quizData?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizChoice(i)}
                      className="w-full p-5 bg-white border-4 border-black text-right font-bold text-base hover:bg-blue-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-center">
               {isSuccess ? (
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-500 animate-bounce">
                    <CheckCircle2 size={48} />
                 </div>
               ) : (
                 <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center border-4 border-red-500">
                    <XCircle size={48} />
                 </div>
               )}
            </div>
            
            <div className="space-y-4">
               <h3 className={`text-3xl font-black uppercase italic ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                 {isSuccess ? 'נכון מאוד!' : 'טעות...'}
               </h3>
               <p className="text-lg font-bold text-slate-800 leading-relaxed px-4">{resultMessage}</p>
            </div>

            <button 
              onClick={() => onChoice(isSuccess ? (event.impact || { money: 500, happiness: 5 }) : { money: -250, happiness: -10 }, isSuccess)}
              className="w-full py-5 bg-black text-white font-black text-xl rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:bg-slate-800 transition-all"
            >
              קבל תוצאה והמשך
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
