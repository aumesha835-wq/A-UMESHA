import React from 'react';
import {
  Camera,
  Upload,
  CloudRain,
  AlertTriangle,
  Calculator,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  History,
  Droplets,
  Wind,
  Smartphone,
  Download,
  Lock,
  HardDrive,
} from 'lucide-react';
import { Language, WeatherInfo, SavedScan, CropInfo } from '../types/plants';
import { CropVisualGrid } from './CropVisualGrid';

interface HomeScreenProps {
  language: Language;
  weather: WeatherInfo;
  recentScans: SavedScan[];
  onOpenScan: () => void;
  onOpenUpload: () => void;
  onSelectCropToScan: (crop: CropInfo) => void;
  onOpenPrivacyModal?: () => void;
  onNavigateTab: (tab: 'crops' | 'calc' | 'community') => void;
  onSelectSavedScan: (scan: SavedScan) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  weather,
  recentScans,
  onOpenScan,
  onOpenUpload,
  onSelectCropToScan,
  onOpenPrivacyModal,
  onNavigateTab,
  onSelectSavedScan,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">

      {/* 1. Main Action Hero Banner (Plantix signature style) */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white p-5 sm:p-6">
        {/* Background decorative leaf watermark */}
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none">
          <svg className="w-56 h-56 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4C6.2 19 6 17.5 6 16c0-5.5 4.5-10 10-10 1.5 0 3 .2 4.4.6C18.6 3.8 15.5 2 12 2zm8 10c0 4.4-3.6 8-8 8-1.5 0-3-.4-4.2-1.2C9.4 17.4 11 15 11 12c0-3.3-2.7-6-6-6-.5 0-1 .1-1.5.2C4.5 4.1 8 2.5 12 2.5c5.2 0 9.5 4.3 9.5 9.5H20z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'kn' ? 'AI ಬೆಳೆ ವೈದ್ಯ & ರೋಗ ಪತ್ತೆ' : 'AI Crop Doctor'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            {language === 'kn'
              ? 'ಯಾವುದೇ ಬೆಳೆಯನ್ನು ಫೋಟೋ ತೆಗೆದು ಹಾಕಬಹುದು'
              : 'Take or Upload a Photo of Any Crop'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/95 font-medium leading-relaxed">
            {language === 'kn'
              ? '📸 ಯಾವುದೇ ರೋಗವಿದ್ದರೂ ತಕ್ಷಣವೇ AI ಪತ್ತೆ ಹಚ್ಚಿ, ಸಿಂಪಡಿಸಬೇಕಾದ ಅಸಲಿ ಮದ್ದು, ಪ್ರತಿ ಎಕರೆಗೆ ಬೇಕಾದ ನಿಖರ ML ಪ್ರಮಾಣ ಮತ್ತು ಮದ್ದಿನ ಫೋಟೋ ಸಮೇತ ಸಂಪೂರ್ಣ ಪರಿಹಾರ ನೀಡುತ್ತದೆ!'
              : '📸 Instant AI diagnosis for any crop disease: prescribes exact medicines, per-acre dosage in ML/grams, with authentic product photos!'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={onOpenScan}
              className="py-3 px-5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span>{language === 'kn' ? 'ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Open Camera Scanner'}</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="py-3 px-4 bg-emerald-900/60 hover:bg-emerald-900/80 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-400/30 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>{language === 'kn' ? 'ಗ್ಯಾಲರಿಯಿಂದ ಫೋಟೋ' : 'Upload Leaf'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CORE USER FEATURE: VISUAL CROP PHOTO CARDS (Tap any crop -> opens camera) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
        <CropVisualGrid
          language={language}
          onSelectCrop={onSelectCropToScan}
        />
      </div>

      {/* 3. Weather & Pest Risk Radar (Plantix Weather feature) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-emerald-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              {language === 'kn' ? 'ಕೃಷಿ ಹವಾಮಾನ & ರೋಗ ಮುನ್ಸೂಚನೆ' : 'Agro Weather & Disease Radar'}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {weather.location}
          </span>
        </div>

        {/* Weather numbers */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-center">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">
              {language === 'kn' ? 'ತಾಪಮಾನ' : 'Temperature'}
            </span>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">{weather.temp}°C</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              {language === 'kn' ? 'ತೇವಾಂಶ' : 'Humidity'}
            </span>
            <p className="text-base sm:text-lg font-extrabold text-blue-900">{weather.humidity}%</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-emerald-600" />
              {language === 'kn' ? 'ಗಾಳಿ' : 'Wind'}
            </span>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">{weather.windSpeedKmH} <span className="text-[10px]">km/h</span></p>
          </div>
        </div>

        {/* Pest Alert Callout */}
        <div className="flex items-start gap-2.5 bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'kn' ? weather.pestRiskWarningKn : weather.pestRiskWarningEn}
          </p>
        </div>
      </div>

      {/* 4. Featured Farming Tools Cards (Plantix core modules) */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 uppercase tracking-wider">
          {language === 'kn' ? 'ಮುಖ್ಯ ಕೃಷಿ ಸಲಕರಣೆಗಳು' : 'Essential Farming Tools'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Fertilizer Calculator */}
          <div
            onClick={() => onNavigateTab('calc')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              {language === 'kn' ? 'ಗೊಬ್ಬರದ ಲೆಕ್ಕಾಚಾರ' : 'Fertilizer Calculator'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {language === 'kn'
                ? 'ಎಕರೆವಾರು ಯೂರಿಯಾ, ಡಿಎಪಿ, ಪೊಟ್ಯಾಶ್ ಮತ್ತು ಸ್ಪ್ರೇ ಟ್ಯಾಂಕ್ ಲೆಕ್ಕ'
                : 'Exact NPK, micronutrients & spray tank count for your farm size.'}
            </p>
          </div>

          {/* Crops Guide */}
          <div
            onClick={() => onNavigateTab('crops')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700">
              {language === 'kn' ? 'ಬೆಳೆ ರಕ್ಷಣಾ ಕೈಪಿಡಿ' : 'Crop Guide & Advisory'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {language === 'kn'
                ? 'ಭತ್ತ, ಟೊಮ್ಯಾಟೊ, ರಾಗಿ, ಹತ್ತಿ, ಮೆಕ್ಕೆಜೋಳ ಬೆಳೆಗಳ ಸಮಗ್ರ ಮಾಹಿತಿ'
                : 'A-to-Z disease identification, seasonal calendar & high-yield practices.'}
            </p>
          </div>

          {/* Ask Krishi Agronomist */}
          <div
            onClick={() => onNavigateTab('community')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700">
              {language === 'kn' ? 'ರೈತರ ಸಮುದಾಯ ವೇದಿಕೆ' : 'Krishi Community'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {language === 'kn'
                ? 'ಫೋಟೋ ಹಾಕಿ ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳಿಂದ ನೇರ ಸಲಹೆ ಮತ್ತು ಉತ್ತರ ಪಡೆಯಿರಿ'
                : 'Connect with farmers & agronomists. Get instant AI answers.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Recent Diagnostic Scans History (Plantix Scan History) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              {language === 'kn' ? 'ಇತ್ತೀಚಿನ ರೋಗ ಪತ್ತೆ ಇತಿಹಾಸ' : 'Recent Diagnostic History'}
            </h3>
          </div>
          <button
            onClick={onOpenScan}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>{language === 'kn' ? '+ ಹೊಸ ಸ್ಕ್ಯಾನ್' : '+ New Scan'}</span>
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p>
              {language === 'kn'
                ? 'ಇನ್ನೂ ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ಮಾಡಿಲ್ಲ. ಮೊದಲ ಬೆಳೆ ರೋಗ ಪತ್ತೆಗಾಗಿ ಕ್ಯಾಮೆರಾ ಬಟನ್ ಒತ್ತಿ!'
                : 'No recent scans yet. Click the camera button to diagnose your first leaf!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentScans.slice(0, 4).map((scan) => (
              <div
                key={scan.id}
                onClick={() => onSelectSavedScan(scan)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={scan.imageThumbnail}
                    alt="Scan thumbnail"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === 'kn' ? scan.data.issueNameKn : scan.data.issueNameEn}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'kn' ? scan.data.cropNameKn : scan.data.cropNameEn} •{' '}
                      <span className="text-emerald-700 font-semibold">{scan.data.confidenceScore}%</span>
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. 100% On-Device Data Privacy Card (User Requirement Guarantee) */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5 text-white">
              {language === 'kn' ? '100% ಖಾಸಗಿ & ಆನ್-ಡಿವೈಸ್ ಸ್ಟೋರೇಜ್' : '100% Private On-Device Storage'}
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-400/30 font-mono">
                No Server DB
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              {language === 'kn'
                ? 'ಲಕ್ಷಾಂತರ ರೈತರು ಬಳಸಿದರೂ ಯಾರ ಡೇಟಾವೂ ಕೇಂದ್ರ ಸರ್ವರ್‌ಗೆ ಹೋಗುವುದಿಲ್ಲ. ಎಲ್ಲವೂ ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲೇ ಸುರಕ್ಷಿತ!'
                : 'No central database collection. Your farm scans remain strictly on your personal device.'}
            </p>
          </div>
        </div>

        {onOpenPrivacyModal && (
          <button
            onClick={onOpenPrivacyModal}
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'kn' ? 'ಡೇಟಾ ನಿರ್ವಹಣೆ' : 'Manage Data'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
