import React from 'react';
import { Leaf, Globe, CloudRain, AlertTriangle, ShieldCheck, Smartphone, Lock } from 'lucide-react';
import { Language, WeatherInfo } from '../types/plants';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  weather: WeatherInfo;
  onOpenScan: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  weather,
  onOpenScan,
  onOpenPrivacyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md">
      {/* Top utility bar */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs border-b border-emerald-800/40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate text-emerald-200">
            <CloudRain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{weather.location}: {weather.temp}°C</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* On-device private badge */}
            {onOpenPrivacyModal && (
              <button
                onClick={onOpenPrivacyModal}
                className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-700/60 transition-colors"
                title="100% Private on-device storage"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>{language === 'kn' ? '100% ಖಾಸಗಿ' : 'Private'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-900 rounded-md p-0.5 border border-emerald-700/60">
              <button
                onClick={() => onLanguageChange('kn')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                  language === 'kn'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                  language === 'en'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md ring-2 ring-emerald-400/30">
            <Leaf className="w-6 h-6 text-white transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Plants
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-700 text-emerald-100 px-1.5 py-0.5 rounded">
                  Plantix AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              {language === 'kn' ? 'AI ಬೆಳೆ ವೈದ್ಯ & ರೋಗ ರಕ್ಷಕ' : 'Smart AI Crop Doctor & Agronomist'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick action scan badge */}
          <button
            onClick={onOpenScan}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95 hover:shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-950" />
            <span>{language === 'kn' ? 'ರೋಗ ಪತ್ತೆ ಸ್ಕ್ಯಾನ್' : 'Diagnose Leaf'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
