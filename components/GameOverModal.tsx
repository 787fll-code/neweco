
import React from 'react';
import { Skull, RotateCcw } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

const GameOverModal: React.FC<Props> = ({ onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200] p-4">
      <div className="bg-white border-8 border-black shadow-[20px_20px_0px_0px_rgba(255,255,255,0.2)] max-w-lg w-full p-12 text-center relative overflow-hidden">
        
        {/* Retro Noise/Scanlines effect placeholder via border style or bg */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
        
        <div className="w-28 h-28 bg-black text-white border-4 border-black mx-auto mb-10 flex items-center justify-center">
          <Skull size={64} />
        </div>
        
        <h2 className="text-5xl font-black text-black mb-6 tracking-tighter uppercase italic">GAME OVER</h2>
        <h3 className="text-2xl font-black text-black mb-4 underline decoration-4 underline-offset-4">פשיטת רגל</h3>
        
        <p className="text-black font-bold mb-12 text-xl leading-snug">
          החובות הצטברו, המזומנים נגמרו, והבנק סגר את הברז.<br/>
          החיים הבוגרים הם אתגר קשוח - אבל תמיד אפשר להתחיל מחדש וליישם את מה שלמדת.
        </p>

        <button
          onClick={onRestart}
          className="w-full py-6 bg-black text-white font-black text-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] hover:bg-slate-800 flex items-center justify-center gap-4 transition-all active:shadow-none active:translate-x-2 active:translate-y-2"
        >
          <RotateCcw size={32} />
          RETRY / נסה שוב
        </button>
        
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">New Economy Simulation v1.0 - Fail state</p>
      </div>
    </div>
  );
};

export default GameOverModal;
