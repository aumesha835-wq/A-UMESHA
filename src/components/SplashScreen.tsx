import React, { useEffect, useState } from 'react';
import { Leaf, Sparkles } from 'lucide-react';
import { Language } from '../types/plants';

interface SplashScreenProps {
  language: Language;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  language,
  onFinish,
}) => {
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    // Exactly 2 seconds splash screen
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFinish();
      }, 350); // slight smooth fade transition
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-white transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />

      {/* App Icon Container */}
      <div className="relative mb-6 flex flex-col items-center">
        {/* Pulsing outer ring */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-amber-400/20 blur-md animate-pulse" />

        {/* Icon card */}
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-800 p-0.5 shadow-2xl ring-4 ring-emerald-400/40 flex items-center justify-center transform active:scale-95">
          <div className="w-full h-full rounded-[22px] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
            <Leaf className="w-14 h-14 text-white transform -rotate-12 drop-shadow-[0_4px_12px_rgba(16,185,129,0.8)]" />
            <Sparkles className="w-6 h-6 text-amber-300 absolute top-2 right-2 animate-bounce" />
          </div>
        </div>
      </div>

      {/* App Title & Branding */}
      <div className="text-center space-y-2 z-10">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
            Plants
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
            AI Doctor
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-emerald-200">
          {language === 'kn'
            ? 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಬೆಳೆ ರೋಗ ರಕ್ಷಕ'
            : 'Smart AI Crop Doctor & Plantix Advisor'}
        </p>
      </div>

      {/* Loading indicator bar */}
      <div className="mt-8 w-44 space-y-2">
        <div className="h-1.5 w-full bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-800/60">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-green-300 to-amber-400 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>
        <p className="text-[11px] text-center text-slate-400 font-medium">
          {language === 'kn' ? 'ಆರಂಭವಾಗುತ್ತಿದೆ...' : 'Starting Plants...'}
        </p>
      </div>
    </div>
  );
};
