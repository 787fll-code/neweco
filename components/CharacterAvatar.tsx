
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Binary, 
  Dna,
  Zap,
  Target,
  Orbit,
  Radiation,
  Box,
  Fingerprint
} from 'lucide-react';
import { Appearance } from '../types';

interface Props { 
  inventory: string[]; 
  appearance: Appearance;
  minimal?: boolean;
}

const CharacterAvatar: React.FC<Props> = ({ inventory, appearance, minimal = false }) => {
  const [rotation, setRotation] = useState({ x: -10, y: 0 });
  const [autoRotate, setAutoRotate] = useState(0);
  const [pulse, setPulse] = useState(0);
  
  const has = (name: string) => inventory.includes(name);
  const isBusiness = has('חליפת עסקים');
  const hasLaptop = has('מחשב נייד חזק');
  const hasProSneakers = has('נעלי ספורט מעוצבות');
  const hasWatch = has('שעון יוקרה זהוב');
  const isFemale = appearance.gender === 'FEMALE';

  // Animated effects for the "Living" interface
  useEffect(() => {
    if (minimal) return;
    const rotateInterval = setInterval(() => {
      setAutoRotate(prev => (prev + 0.4) % 360);
      setPulse(prev => (prev + 0.05) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(rotateInterval);
  }, [minimal]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (minimal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 45;
    const rotateX = ((centerY - y) / centerY) * 25;
    setRotation({ x: rotateX - 10, y: rotateY });
  }, [minimal]);

  const handleMouseLeave = () => {
    setRotation({ x: -10, y: 0 });
  };

  const Cube = ({ w, h, d, color, className = "", children = null, style = {} }: any) => {
    // Dynamic lighting based on rotation
    const brightness = 1 + Math.sin((autoRotate + rotation.y) * Math.PI / 180) * 0.2;
    
    return (
      <div 
        className={`absolute ${className}`} 
        style={{ 
          width: w, 
          height: h, 
          transformStyle: 'preserve-3d',
          left: '50%',
          top: '50%',
          marginLeft: -w/2,
          marginTop: -h/2,
          ...style
        }}
      >
        {/* Front Face with Shine */}
        <div className="absolute inset-0 border border-white/10 shadow-inner overflow-hidden" style={{ transform: `translateZ(${d/2}px)`, backgroundColor: color, filter: `brightness(${brightness})` }}>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full animate-[shimmer_3s_infinite]"></div>
          {children}
        </div>
        {/* Other Faces */}
        <div className="absolute inset-0 border border-black/20" style={{ transform: `rotateY(180deg) translateZ(${d/2}px)`, backgroundColor: color, filter: 'brightness(0.4)' }}></div>
        <div className="absolute inset-0 border border-black/20" style={{ width: d, left: `calc(50% - ${d/2}px)`, transform: `rotateY(90deg) translateZ(${w/2}px)`, backgroundColor: color, filter: 'brightness(0.6)' }}></div>
        <div className="absolute inset-0 border border-black/20" style={{ width: d, left: `calc(50% - ${d/2}px)`, transform: `rotateY(-90deg) translateZ(${w/2}px)`, backgroundColor: color, filter: 'brightness(0.6)' }}></div>
        <div className="absolute inset-0 border border-white/10" style={{ height: d, top: `calc(50% - ${d/2}px)`, transform: `rotateX(90deg) translateZ(${h/2}px)`, backgroundColor: color, filter: 'brightness(1.1)' }}></div>
        <div className="absolute inset-0 border border-black/40" style={{ height: d, top: `calc(50% - ${d/2}px)`, transform: `rotateX(-90deg) translateZ(${h/2}px)`, backgroundColor: color, filter: 'brightness(0.3)' }}></div>
      </div>
    );
  };

  const FaceRenderer = ({ type }: { type: Appearance['face'] }) => {
    switch (type) {
      case 'SMILE':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 pt-1">
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
            </div>
            <div className="w-5 h-2.5 border-b-[3px] border-slate-900 rounded-full"></div>
          </div>
        );
      case 'SMIRK':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 pt-1">
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
            </div>
            <div className="w-4 h-1.5 bg-slate-900 rounded-full rotate-[15deg] ml-3 mt-1"></div>
          </div>
        );
      case 'CHILL':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 pt-2">
            <div className="flex gap-5">
              <div className="w-3 h-0.5 bg-slate-900"></div>
              <div className="w-3 h-0.5 bg-slate-900"></div>
            </div>
            <div className="w-2 h-0.5 bg-slate-900 opacity-60"></div>
          </div>
        );
      case 'NERD':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 pt-1">
            <div className="flex gap-0.5 items-center">
              <div className="w-5 h-4 border-2 border-slate-900 bg-blue-100/40 rounded-sm"></div>
              <div className="w-1.5 h-0.5 bg-slate-900"></div>
              <div className="w-5 h-4 border-2 border-slate-900 bg-blue-100/40 rounded-sm"></div>
            </div>
            <div className="w-3.5 h-1.5 bg-slate-900 rounded-full"></div>
          </div>
        );
      case 'SERIOUS':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 pt-2">
            <div className="flex gap-5">
              <div className="w-3 h-1.5 bg-slate-900 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-slate-900 rounded-sm"></div>
            </div>
            <div className="w-6 h-1 bg-slate-900 rounded-full"></div>
          </div>
        );
      case 'ELITE':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 pt-1">
            <div className="w-11/12 h-5 bg-slate-950 rounded-sm shadow-xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
               <div className="w-full h-px bg-white/5 -rotate-[12deg]"></div>
            </div>
            <div className="w-4 h-1.5 bg-slate-900 rounded-full rotate-[-6deg] ml-2"></div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center gap-4">
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          </div>
        );
    }
  };

  const characterContent = (
    <div 
      className="relative preserve-3d transition-transform duration-700 ease-out" 
      style={{ 
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + (rotation.y === 0 ? autoRotate : 0)}deg) scale(${1 + Math.sin(pulse) * 0.02})`, 
        transformStyle: 'preserve-3d' 
      }}
    >
      {/* TORSO */}
      <div style={{ transform: 'translateY(-10px)', transformStyle: 'preserve-3d' }}>
        <Cube w={isFemale ? 48 : 52} h={68} d={30} color={isBusiness ? "#0f172a" : appearance.shirt}>
           {isBusiness && (
             <div className="w-full h-full flex flex-col items-center pt-1">
                <div className="w-10 h-12 bg-white/90" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
                <div className="w-2.5 h-16 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] mt-[-6px] rounded-b-lg"></div>
                {/* Executive Core Light */}
                <div className="absolute top-10 w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)] border border-white/50 animate-pulse"></div>
             </div>
           )}
        </Cube>
      </div>

      {/* LEGS */}
      <div style={{ transform: 'translateY(42px) translateX(-16px)', transformStyle: 'preserve-3d' }}>
         <Cube w={18} h={42} d={18} color={appearance.pants} />
         <div style={{ transform: 'translateY(24px) translateZ(6px)', transformStyle: 'preserve-3d' }}>
            <Cube w={20} h={10} d={26} color={hasProSneakers ? "#3b82f6" : appearance.shoes} />
         </div>
      </div>
      <div style={{ transform: 'translateY(42px) translateX(16px)', transformStyle: 'preserve-3d' }}>
         <Cube w={18} h={42} d={18} color={appearance.pants} />
         <div style={{ transform: 'translateY(24px) translateZ(6px)', transformStyle: 'preserve-3d' }}>
            <Cube w={20} h={10} d={26} color={hasProSneakers ? "#3b82f6" : appearance.shoes} />
         </div>
      </div>

      {/* HEAD */}
      <div style={{ transform: 'translateY(-62px)', transformStyle: 'preserve-3d' }}>
        <Cube w={32} h={36} d={30} color={appearance.skin}>
           <FaceRenderer type={appearance.face} />
        </Cube>
        {/* HAIR - Short/Top Part */}
        <div style={{ transform: 'translateY(-14px)', transformStyle: 'preserve-3d' }}>
           <Cube w={36} h={16} d={34} color={appearance.hair} />
        </div>
        {/* FEMALE HAIR - Back/Long Part */}
        {isFemale && (
          <div style={{ transform: 'translateZ(-14px) translateY(10px)', transformStyle: 'preserve-3d' }}>
            <Cube w={36} h={45} d={10} color={appearance.hair} />
          </div>
        )}
      </div>

      {/* ARMS */}
      <div style={{ transform: 'translateX(-34px) translateY(-25px) rotateZ(10deg)', transformStyle: 'preserve-3d' }}>
         <Cube w={16} h={48} d={16} color={isBusiness ? "#0f172a" : appearance.shirt} />
         <div style={{ transform: 'translateY(26px)', transformStyle: 'preserve-3d' }}>
            <Cube w={17} h={14} d={17} color={appearance.skin} />
         </div>
      </div>
      <div style={{ transform: 'translateX(34px) translateY(-25px) rotateZ(-10deg)', transformStyle: 'preserve-3d' }}>
         <Cube w={16} h={48} d={16} color={isBusiness ? "#0f172a" : appearance.shirt} />
         <div style={{ transform: 'translateY(26px)', transformStyle: 'preserve-3d' }}>
            <Cube w={17} h={14} d={17} color={appearance.skin}>
               {hasWatch && (
                 <div className="absolute top-1 w-full h-3 bg-amber-400 border border-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse"></div>
               )}
            </Cube>
         </div>
      </div>

      {/* GLASS-TECH LAPTOP */}
      {hasLaptop && !minimal && (
        <div style={{ transform: 'translateY(15px) translateZ(38px)', transformStyle: 'preserve-3d' }}>
           <Cube w={75} h={5} d={60} color="rgba(71, 85, 105, 0.8)">
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
           </Cube>
           <div style={{ transform: 'translateY(-28px) translateZ(-28px) rotateX(-98deg)', transformStyle: 'preserve-3d' }}>
              <Cube w={75} h={55} d={3} color="rgba(15, 23, 42, 0.5)">
                 <div className="w-full h-full p-3 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 overflow-hidden">
                    <div className="w-full h-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_80%)]"></div>
                    <div className="absolute inset-2 space-y-1.5 opacity-30">
                       <div className="w-2/3 h-1 bg-blue-400 rounded-full"></div>
                       <div className="w-full h-1 bg-blue-400 rounded-full"></div>
                       <div className="w-1/2 h-1 bg-blue-400 rounded-full"></div>
                    </div>
                 </div>
              </Cube>
           </div>
        </div>
      )}
    </div>
  );

  if (minimal) {
    return (
      <div className="relative w-28 h-28 overflow-visible flex items-center justify-center" style={{ perspective: '1000px' }}>
        {characterContent}
      </div>
    );
  }

  return (
    <div className="bg-slate-950 rounded-[56px] border-[6px] border-slate-900 p-10 relative overflow-hidden flex flex-col items-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] group w-full max-w-[340px] lg:max-w-none transition-all duration-500 hover:border-blue-600/40">
      
      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_75%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
      
      {/* Animated Scanline */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.15)_50%,transparent_100%)] animate-[scan_8s_linear_infinite] pointer-events-none"></div>

      {/* Futuristic HUD Header */}
      <div className="w-full border-b-2 border-white/5 pb-6 mb-8 flex justify-between items-end relative z-10">
        <div className="text-right">
          <h4 className="text-[11px] font-black uppercase text-blue-500 tracking-[0.5em] flex items-center gap-3 mb-2">
            <Cpu size={16} className="animate-spin-slow" />
            ENTITY_PROFILE
          </h4>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
            </div>
            <p className="text-[12px] font-black text-white tracking-[0.15em]">SYNC_MODE: <span className="text-emerald-400">OPTIMAL</span></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="flex gap-1.5 h-6 items-end">
              {[0.4, 0.7, 0.5, 0.9, 0.3].map((h, i) => (
                <div key={i} className="w-1.5 bg-blue-500/30 rounded-full overflow-hidden">
                   <div className="w-full bg-blue-400 animate-[pulse_1.5s_infinite]" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.2}s` }}></div>
                </div>
              ))}
           </div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal_Str: 100%</span>
        </div>
      </div>

      <div 
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        className="relative w-full aspect-square flex items-center justify-center overflow-visible cursor-crosshair touch-none"
        style={{ perspective: '1500px' }}
      >
        {/* Floating Geometry HUD */}
        <div className="absolute inset-0 pointer-events-none z-20">
           <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/20 rounded-tr-3xl"></div>
           <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/20 rounded-bl-3xl"></div>
           
           {/* Floating Data Tags */}
           <div className="absolute top-1/4 left-0 -translate-x-4 bg-slate-900/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-[bounce_3s_infinite]">
              <Target size={12} className="text-blue-400" />
              <span className="text-[9px] font-black text-white/80 mono-numbers">ID_7739</span>
           </div>
           <div className="absolute bottom-1/4 right-0 translate-x-4 bg-slate-900/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-[bounce_4s_infinite]">
              <span className="text-[9px] font-black text-emerald-400 mono-numbers">VAL_NET</span>
              <Orbit size={12} className="text-emerald-400" />
           </div>
        </div>

        {/* The 3D Base Platform */}
        <div 
           className="absolute bottom-10 w-64 h-64 bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] border-2 border-blue-500/10 rounded-full"
           style={{ 
             transform: 'rotateX(75deg) translateZ(-60px)', 
             backgroundSize: '30px 30px', 
             backgroundImage: 'linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)' 
           }}
        >
          <div className="absolute inset-2 border border-blue-400/20 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-10 border-2 border-dashed border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>
        
        {characterContent}
      </div>

      {/* Stats Footer Detail */}
      <div className="w-full mt-10 space-y-6 relative z-10 border-t-2 border-white/5 pt-8">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${isFemale ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>{isFemale ? 'Female' : 'Male'} Unit</span>
              <Radiation size={16} className="text-blue-500 animate-spin-slow" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural_Linkage</span>
           </div>
           <span className="text-[10px] font-black text-blue-400 mono-numbers">UP_LINK: STABLE</span>
        </div>
        
        {/* Progress System */}
        <div className="space-y-2">
           <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
              <span>Evolution_Phase</span>
              <span>Lvl {Math.floor(inventory.length / 2) + 1}</span>
           </div>
           <div className="relative h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 via-blue-400 to-cyan-400 transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(100, (inventory.length + 1) * 20)}%` }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
           </div>
        </div>
        
        <div className="flex justify-around items-center pt-2">
           <div className="flex flex-col items-center gap-1">
              <Fingerprint size={14} className="text-slate-600" />
              <span className="text-[7px] font-black text-slate-500">BIO_LOCK</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Box size={14} className="text-slate-600" />
              <span className="text-[7px] font-black text-slate-500">ASSET_PKG</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Binary size={14} className="text-slate-600" />
              <span className="text-[7px] font-black text-slate-500">DATA_STR</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterAvatar;
