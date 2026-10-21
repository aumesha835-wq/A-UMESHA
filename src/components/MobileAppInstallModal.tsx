import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Apple,
  Download,
  Share,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { Language } from '../types/plants';

interface MobileAppInstallModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const MobileAppInstallModal: React.FC<MobileAppInstallModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'apk'>('android');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-1.5">
                Plants Mobile App
                <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
                  Android & iOS
                </span>
              </h3>
              <p className="text-xs text-emerald-100/90 font-medium">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿಕೊಳ್ಳಿ'
                  : 'Install Plants app directly on your phone'}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android (ಆಂಡ್ರಾಯ್ಡ್)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone / iOS</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'apk'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>APK / Code</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          {/* ANDROID TAB */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'kn' ? 'ಆಂಡ್ರಾಯ್ಡ್ ಮೊಬೈಲ್ ಇನ್‌ಸ್ಟಾಲ್ ವಿಧಾನ:' : 'Instant Android Installation:'}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {language === 'kn'
                    ? 'ಕೆಳಗಿನ "Install App" ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ಕ್ರೋಮ್ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೆನು (⋮) ಒತ್ತಿ "Install app" / "ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ" ಆಯ್ಕೆಮಾಡಿ.'
                    : 'Click "Install App" below or tap Chrome menu (⋮) and select "Install app" or "Add to Home screen".'}
                </p>
              </div>

              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Download className="w-5 h-5 text-amber-300" />
                  <span>{language === 'kn' ? 'ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ (Install App)' : 'Install Plants on Android'}</span>
                </button>
              ) : (
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">
                    {language === 'kn' ? 'ಹಂತಗಳು (Steps):' : 'Manual Install Steps:'}
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>{language === 'kn' ? 'Chrome ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೇಲಿನ ಬಲ ಮೂಲೆಯ ಮೂರು ಚುಕ್ಕೆಗಳನ್ನು (⋮) ಒತ್ತಿ.' : 'Tap the top-right menu (⋮) in Chrome.'}</li>
                    <li>{language === 'kn' ? '"Install app" ಅಥವಾ "Add to Home screen" ಒತ್ತಿ.' : 'Select "Install app" or "Add to Home screen".'}</li>
                    <li>{language === 'kn' ? 'ಈಗ ನಿಮ್ಮ ಮೊಬೈಲ್ ಮುಖಪುಟದಲ್ಲಿ Plants ಆಪ್ ಐಕಾನ್ ಲಭ್ಯವಿರುತ್ತದೆ!' : 'The Plants app is now ready on your phone home screen!'}</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* IOS TAB */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Apple className="w-4 h-4 text-slate-900" />
                  <span>
                    {language === 'kn' ? 'iPhone / iPad ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವ ವಿಧಾನ:' : 'Install on Apple iPhone / iPad:'}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </div>
                    <p className="text-slate-700">
                      {language === 'kn'
                        ? 'Safari ಬ್ರೌಸರ್‌ನ ಕೆಳಭಾಗದಲ್ಲಿರುವ ಶೇರ್ ಬಟನ್ ಒತ್ತಿ (Share icon ⎋).'
                        : 'Tap the Share button (⎋) at the bottom of Safari.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </div>
                    <p className="text-slate-700">
                      {language === 'kn'
                        ? 'ಮೆನುವಿನಲ್ಲಿ ಕೆಳಗೆ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ "Add to Home Screen" (ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ) ಒತ್ತಿ.'
                        : 'Scroll down and tap "Add to Home Screen" (⊞).'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </div>
                    <p className="text-slate-700">
                      {language === 'kn'
                        ? 'ಮೇಲಿನ ಬಲಭಾಗದಲ್ಲಿರುವ "Add" ಒತ್ತಿರಿ. ಆಪ್ ಸಿದ್ಧವಾಗುತ್ತದೆ!'
                        : 'Tap "Add" in top right corner. The native iOS Plants app will appear on your Home Screen!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NATIVE APK / CAPACITOR CODE TAB */}
          {activeTab === 'apk' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ Android Studio ಅಥವಾ Xcode ಮೂಲಕ ನೇರ APK / IPA ಬಿಲ್ಡ್ ಮಾಡಲು ಈ ಕೆಳಗಿನ ಕಮಾಂಡ್ ರನ್ ಮಾಡಿ:'
                  : 'To compile directly into a native Android APK or iOS Xcode project with Capacitor:'}
              </p>
              <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5 overflow-x-auto">
                <p># 1. Build web assets</p>
                <p className="text-white">npm run build</p>
                <p># 2. Add Android or iOS native shell</p>
                <p className="text-white">npx cap add android</p>
                <p className="text-white">npx cap add ios</p>
                <p># 3. Open in Android Studio to build APK</p>
                <p className="text-white">npx cap open android</p>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'kn'
                  ? 'ಗಮನಿಸಿ: `capacitor.config.json` ಫೈಲ್ ಅನ್ನು ಈಗಾಗಲೇ ಈ ಪ್ರಾಜೆಕ್ಟ್‌ನಲ್ಲಿ ಕಾನ್ಫಿಗರ್ ಮಾಡಲಾಗಿದೆ.'
                  : 'Note: `capacitor.config.json` is already fully configured in your project.'}
              </p>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
