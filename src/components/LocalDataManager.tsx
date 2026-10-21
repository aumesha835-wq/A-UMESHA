import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  HardDrive,
  Download,
  Upload,
  Trash2,
  Lock,
  CheckCircle2,
  X,
  FileJson,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Language, SavedScan } from '../types/plants';

interface LocalDataManagerProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  savedScans: SavedScan[];
  onClearData: () => void;
  onImportData: (importedScans: SavedScan[]) => void;
}

export const LocalDataManager: React.FC<LocalDataManagerProps> = ({
  language,
  isOpen,
  onClose,
  savedScans,
  onClearData,
  onImportData,
}) => {
  const [storageSizeKb, setStorageSizeKb] = useState<number>(0);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const scansStr = localStorage.getItem('plants_saved_scans') || '';
      const totalBytes = new Blob([scansStr]).size;
      setStorageSizeKb(Math.round(totalBytes / 1024));
    } catch {
      setStorageSizeKb(0);
    }
  }, [savedScans]);

  // Export all local farm scans to JSON file
  const handleExportData = () => {
    try {
      const exportPayload = {
        app: 'Plants',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        totalScans: savedScans.length,
        scans: savedScans,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `plants_farm_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage(
        language === 'kn'
          ? 'ಬ್ಯಾಕ್‌ಅಪ್ ಫೈಲ್ ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!'
          : 'Backup file exported to your device downloads!'
      );
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Import JSON backup from device
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.scans && Array.isArray(parsed.scans)) {
          onImportData(parsed.scans);
          setStatusMessage(
            language === 'kn'
              ? `${parsed.scans.length} ಬೆಳೆ ವರದಿಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಮದು ಮಾಡಲಾಗಿದೆ!`
              : `Successfully imported ${parsed.scans.length} scans from backup!`
          );
          setTimeout(() => setStatusMessage(null), 3500);
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        setStatusMessage(
          language === 'kn'
            ? 'ಅಮಾನ್ಯ ಬ್ಯಾಕ್‌ಅಪ್ ಫೈಲ್!'
            : 'Invalid backup file format!'
        );
        setTimeout(() => setStatusMessage(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-1.5">
                {language === 'kn' ? '100% ಆನ್-ಡಿವೈಸ್ ಖಾಸಗಿ ಸಂಗ್ರಹಣೆ' : '100% On-Device Private Data'}
              </h3>
              <p className="text-xs text-emerald-200/90 font-medium">
                {language === 'kn'
                  ? 'ಲಕ್ಷಾಂತರ ರೈತರ ಡೇಟಾ ಅವರವರ ಮೊಬೈಲ್‌ನಲ್ಲೇ ಸುರಕ್ಷಿತ'
                  : 'Zero central storage. Your farm data stays only on your phone.'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Alert if any */}
        {statusMessage && (
          <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Privacy Guarantee Card */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/90 space-y-2.5 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'kn' ? 'ಡೇಟಾ ಗೌಪ್ಯತೆಯ ಭರವಸೆ (Privacy Guarantee):' : 'Strict Local-First Architecture:'}
              </span>
            </div>
            <p className="leading-relaxed text-slate-700">
              {language === 'kn'
                ? 'ಈ ಆಪ್ ಅನ್ನು ಲಕ್ಷಾಂತರ ಜನರು ಬಳಸಿದರೂ ಯಾರೊಬ್ಬರ ಡೇಟಾವೂ ಯಾವುದೇ ಕೇಂದ್ರೀಯ ಸರ್ವರ್‌ಗೆ ಹೋಗುವುದಿಲ್ಲ. ನಿಮ್ಮ ಜಮೀನಿನ ಫೋಟೋಗಳು, ರೋಗ ಪತ್ತೆ ವರದಿಗಳು ಮತ್ತು ಗೊಬ್ಬರದ ಲೆಕ್ಕಗಳು ಕೇವಲ ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ.'
                : 'Even with millions of farmers using this app, no user data or farm photos are saved on any central database. All your scan history and reports remain 100% offline and private inside your personal phone storage.'}
            </p>
          </div>

          {/* Current Device Storage Statistics */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-slate-500" />
                {language === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿರುವ ವರದಿಗಳು:' : 'Local Scans on this Phone:'}
              </span>
              <span className="font-extrabold text-slate-900 font-mono">
                {savedScans.length} {language === 'kn' ? 'ವರದಿಗಳು' : 'Reports'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                {language === 'kn' ? 'ಬಳಸಿದ ಆಫ್‌ಲೈನ್ ಮೆಮೊರಿ:' : 'Phone Storage Used:'}
              </span>
              <span className="font-bold text-emerald-700 font-mono">
                ~{storageSizeKb} KB
              </span>
            </div>
          </div>

          {/* Action Buttons: Export / Import / Clear */}
          <div className="space-y-2.5 pt-1">
            {/* Export Backup */}
            <button
              onClick={handleExportData}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'kn' ? 'ನನ್ನ ಡೇಟಾವನ್ನು ಬ್ಯಾಕ್‌ಅಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'Download My Local Farm Backup (.json)'}
              </span>
            </button>

            {/* Import Backup */}
            <label className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'kn' ? 'ಹಿಂದಿನ ಬ್ಯಾಕ್‌ಅಪ್ ರಿಸ್ಟೋರ್ ಮಾಡಿ' : 'Restore from Backup File'}
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            {/* Clear All Data */}
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-2 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn' ? 'ಮೊಬೈಲ್‌ನಿಂದ ಹಳೆಯ ವರದಿಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ' : 'Clear Local Scan History on this Device'}
                </span>
              </button>
            ) : (
              <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-950 space-y-2">
                <p className="font-bold">
                  {language === 'kn'
                    ? 'ಖಚಿತಪಡಿಸಿ: ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಿಂದ ಎಲ್ಲಾ ಸ್ಕ್ಯಾನ್ ವರದಿಗಳನ್ನು ಅಳಿಸಬೇಕೇ?'
                    : 'Confirm: Erase all diagnostic records from this phone?'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearData();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                  >
                    {language === 'kn' ? 'ಹೌದು, ಅಳಿಸಿ' : 'Yes, Erase'}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    {language === 'kn' ? 'ಬೇಡ' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors mt-2"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
