import React, { useState, useEffect, useRef } from 'react';
import { Home, Camera, BookOpen, Calculator, Users, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Language } from '../types/plants';

export type TabType = 'home' | 'scan' | 'crops' | 'calc' | 'community';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  // Navigation visibility state: starts CLOSED/DOWNWARD per user requirement:
  // "app open aadamele mobile navigation controls buttuns clos aaguva haage andre avu kelagade hoguva reehiaagi kodu"
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const touchStartY = useRef<number | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-close after 8 seconds when opened, so screen remains uncluttered
  useEffect(() => {
    if (isOpen) {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 8000);
    }
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, [isOpen]);

  // Global listener for touch-swipe UP from the bottom edge of mobile screen
  // "nantara adann mobile na koneya bhaagadinda melakke eledaaga avu baruva reethiyaagi maadikodu"
  useEffect(() => {
    const handleGlobalTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const windowHeight = window.innerHeight;
      // If touch started in the bottom 120px of mobile screen
      if (touch.clientY > windowHeight - 120) {
        touchStartY.current = touch.clientY;
      } else {
        touchStartY.current = null;
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const endY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - endY;

      // Swiped UP from bottom (> 20px) -> OPEN NAV!
      if (diff > 20) {
        setIsOpen(true);
      }
      // Swiped DOWN -> CLOSE NAV!
      else if (diff < -20) {
        setIsOpen(false);
      }
      touchStartY.current = null;
    };

    window.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleGlobalTouchStart);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  const handleManualTabSelect = (tab: TabType) => {
    onTabChange(tab);
    // Smoothly close after tab selection to keep clean screen
    if (tab === 'scan') {
      setIsOpen(false);
    }
  };

  const tabs = [
    {
      id: 'home' as TabType,
      labelEn: 'Home',
      labelKn: 'ಮುಖಪುಟ',
      icon: Home,
    },
    {
      id: 'crops' as TabType,
      labelEn: 'Crops',
      labelKn: 'ಬೆಳೆಗಳು',
      icon: BookOpen,
    },
    // Center prominent scan button
    {
      id: 'scan' as TabType,
      labelEn: 'AI Doctor',
      labelKn: 'ರೋಗ ಪತ್ತೆ',
      icon: Camera,
      isCenter: true,
    },
    {
      id: 'calc' as TabType,
      labelEn: 'Calc',
      labelKn: 'ಗೊಬ್ಬರ',
      icon: Calculator,
    },
    {
      id: 'community' as TabType,
      labelEn: 'Community',
      labelKn: 'ಸಮುದಾಯ',
      icon: Users,
    },
  ];

  return (
    <>
      {/* 1. Pull-Up Bottom Handle Trigger (Visible when Navigation is closed) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center transition-all duration-300 pointer-events-none ${
          isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Pull up navigation menu"
          className="pointer-events-auto flex items-center gap-2 bg-slate-900/95 hover:bg-emerald-900 text-white px-5 py-2 rounded-t-2xl shadow-[0_-6px_25px_rgba(0,0,0,0.4)] border-t-2 border-x-2 border-emerald-500/50 active:scale-95 transition-all text-xs font-black tracking-wide backdrop-blur-md group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
          <ChevronUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform animate-bounce" />
          <span>
            {language === 'kn' ? 'ಮೆನು ನೋಡಿ ▲ ಮೇಲಕ್ಕೆ ಎಳೆಯಿರಿ' : 'Menu ▲ Swipe Up'}
          </span>
        </button>
      </div>

      {/* 2. Slideable Mobile Navigation Controls Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Top Handle / Close Bar */}
        <div className="flex justify-center -mb-1">
          <button
            onClick={() => setIsOpen(false)}
            title="Hide Navigation"
            className="bg-slate-950 text-slate-300 hover:text-white px-4 py-1 rounded-t-xl text-[11px] font-black flex items-center gap-1.5 shadow-lg border-t-2 border-x-2 border-slate-700 active:scale-95 transition-all"
          >
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'kn' ? 'ಮೆನು ಮುಚ್ಚಿ ▼' : 'Hide Menu ▼'}</span>
          </button>
        </div>

        {/* Navigation Bar Body */}
        <nav className="bg-white/95 backdrop-blur-lg border-t-2 border-slate-300 shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
          <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 relative">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              if (tab.isCenter) {
                return (
                  <div key={tab.id} className="relative -top-5 flex flex-col items-center">
                    <button
                      onClick={() => handleManualTabSelect(tab.id)}
                      aria-label="Scan Crop Leaf"
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-90 ${
                        isActive
                          ? 'bg-gradient-to-tr from-amber-500 to-emerald-600 ring-4 ring-emerald-300 scale-105'
                          : 'bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 ring-4 ring-white shadow-emerald-900/30'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                      <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                      </span>
                    </button>
                    <span
                      className={`text-[11px] font-black mt-1 tracking-tight ${
                        isActive ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {language === 'kn' ? tab.labelKn : tab.labelEn}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => handleManualTabSelect(tab.id)}
                  className={`flex-1 flex flex-col items-center py-1 transition-colors ${
                    isActive
                      ? 'text-emerald-700 font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      isActive ? 'bg-emerald-100/80 text-emerald-700' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  </div>
                  <span className="text-[11px] mt-0.5 font-bold">
                    {language === 'kn' ? tab.labelKn : tab.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};
