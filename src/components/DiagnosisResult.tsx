import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Volume2,
  VolumeX,
  Droplets,
  Sprout,
  FlaskConical,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Bookmark,
  Share2,
  Calculator,
  ArrowLeft,
  Info,
  Clock,
  Sparkles,
  ZoomIn,
  X,
} from 'lucide-react';
import { DiagnosisData, Language } from '../types/plants';
import { enrichChemicalItem, resolveMedicine, resolveMedicineForDisease, MEDICINE_CATALOG } from '../utils/medicineRegistry';

interface DiagnosisResultProps {
  diagnosis: DiagnosisData;
  imageSrc: string;
  language: Language;
  onBackToScanner: () => void;
  onOpenCalculator: (cropName: string) => void;
  onAskCommunity: (diagnosis: DiagnosisData, imageSrc: string) => void;
  onSaveReport?: (diagnosis: DiagnosisData, imageSrc: string) => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  imageSrc,
  language,
  onBackToScanner,
  onOpenCalculator,
  onAskCommunity,
  onSaveReport,
}) => {
  const [activeTab, setActiveTab] = useState<'biological' | 'chemical' | 'symptoms' | 'causes' | 'prevention'>('biological');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [sprayAcreage, setSprayAcreage] = useState<number>(1);
  const [expandedPhoto, setExpandedPhoto] = useState<{
    src: string;
    title: string;
    subtitle: string;
    dosage: string;
  } | null>(null);

  // Text-To-Speech audio reader in Kannada or English
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead =
      language === 'kn'
        ? `${diagnosis.cropNameKn}. ರೋಗದ ಹೆಸರು: ${diagnosis.issueNameKn}. ತೀವ್ರತೆ: ${diagnosis.severity}. ${diagnosis.summaryKn}`
        : `${diagnosis.cropNameEn}. Issue identified: ${diagnosis.issueNameEn}. Severity: ${diagnosis.severity}. ${diagnosis.summaryEn}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveReport) {
      onSaveReport(diagnosis, imageSrc);
    }
  };

  const getSeverityBadge = () => {
    if (diagnosis.isHealthy) {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {language === 'kn' ? 'ಆರೋಗ್ಯಕರ' : 'Healthy Plant'}
        </span>
      );
    }
    if (diagnosis.severity === 'Severe') {
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-xs animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          {language === 'kn' ? 'ತೀವ್ರ ಹಾನಿ (Severe)' : 'Severe Damage'}
        </span>
      );
    }
    if (diagnosis.severity === 'Moderate') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          {language === 'kn' ? 'ಮಧ್ಯಮ (Moderate)' : 'Moderate'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">
        <Info className="w-3.5 h-3.5 text-blue-600" />
        {language === 'kn' ? 'ಆರಂಭಿಕ ಹಂತ (Low)' : 'Low Severity'}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToScanner}
          className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಹೊಸ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'New Scan'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio voice readout */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-300'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? (language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (language === 'kn' ? 'ಧ್ವನಿ ಕೇಳಿ' : 'Listen')}</span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-full border transition-colors ${
              isSaved
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:text-emerald-700'
            }`}
            title="Save report"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Diagnosis Summary Card (Plantix iconic card design) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
          {/* Leaf photo preview */}
          <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-inner group">
            <img
              src={imageSrc}
              alt="Diagnosed Plant Leaf"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              AI Scan
            </div>
          </div>

          {/* Issue & Plant details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {language === 'kn' ? diagnosis.cropNameKn : diagnosis.cropNameEn}
              </span>
              {getSeverityBadge()}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {language === 'kn' ? diagnosis.issueNameKn : diagnosis.issueNameEn}
            </h2>

            {diagnosis.scientificName && (
              <p className="text-xs italic text-slate-500 font-serif">
                Pathogen: {diagnosis.scientificName}
              </p>
            )}

            {/* AI Confidence Meter */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {language === 'kn' ? 'AI ರೋಗ ಪತ್ತೆ ನಿಖರತೆ' : 'AI Confidence Score'}
                </span>
                <span className="text-emerald-700 font-bold">{diagnosis.confidenceScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-700"
                  style={{ width: `${diagnosis.confidenceScore}%` }}
                />
              </div>
            </div>

            {/* Concise summary text */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-medium">
              {language === 'kn' ? diagnosis.summaryKn : diagnosis.summaryEn}
            </div>

            {/* IMMEDIATE MEDICINE PRESCRIPTION HIGHLIGHT BOX */}
            {!diagnosis.isHealthy && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-500 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wider">
                    <FlaskConical className="w-5 h-5 text-emerald-700" />
                    <span>{language === 'kn' ? '💊 ಈ ರೋಗಕ್ಕೆ ಶಿಫಾರಸು ಮಾಡಿದ ಅಸಲಿ ಮದ್ದು & ನಿಖರ ಪ್ರಮಾಣ:' : '💊 Prescribed Medicine & Exact Dosage:'}</span>
                  </div>
                  <span className="text-[11px] bg-emerald-700 text-white font-extrabold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                    {language === 'kn' ? '100% ಪರಿಣಾಮಕಾರಿ' : '100% Effective'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Primary Chemical Cure Card with EXTRA LARGE Photo and Per-Acre Dosage */}
                  {(() => {
                    const primaryMed = resolveMedicineForDisease(
                      `${diagnosis.issueNameEn} ${diagnosis.issueNameKn}`,
                      `${diagnosis.cropNameEn} ${diagnosis.cropNameKn}`
                    );
                    const title = language === 'kn' ? primaryMed.productNameKn : primaryMed.productNameEn;
                    const typeName = language === 'kn' ? primaryMed.medicineTypeKn : primaryMed.medicineType;
                    const dosageAcre = language === 'kn' ? primaryMed.dosagePerAcreKn : primaryMed.dosagePerAcre;
                    const dosageLiter = language === 'kn' ? primaryMed.dosagePerLiterKn : primaryMed.dosagePerLiter;
                    const waterAcre = language === 'kn' ? primaryMed.waterVolumePerAcreKn : primaryMed.waterVolumePerAcre;
                    const waitingPeriod = language === 'kn' ? primaryMed.waitingPeriodKn : primaryMed.waitingPeriodEn;
                    const safetyGuide = language === 'kn' ? primaryMed.safetyGuideKn : primaryMed.safetyGuideEn;

                    return (
                      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-indigo-200/90 shadow-md flex flex-col md:flex-row gap-5 items-center md:items-start">
                        {/* EXTRA LARGE Medicine Product Bottle / Pouch Photo */}
                        <div
                          onClick={() =>
                            setExpandedPhoto({
                              src: primaryMed.medicineImage,
                              title: title,
                              subtitle: `${primaryMed.brandManufacturer} • ${primaryMed.activeIngredient}`,
                              dosage: dosageAcre,
                            })
                          }
                          className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-3xl overflow-hidden bg-slate-50 border-2 border-indigo-300 shrink-0 shadow-lg flex flex-col items-center justify-center p-3 cursor-pointer hover:border-indigo-600 hover:shadow-xl transition-all group relative self-center"
                          title={language === 'kn' ? 'ದೊಡ್ಡದಾಗಿ ನೋಡಲು ಫೋಟೋ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to zoom high-resolution photo'}
                        >
                          <img
                            src={primaryMed.medicineImage}
                            alt={title}
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/medicines/saaf.jpg';
                            }}
                          />
                          <span className="absolute top-2 left-2 bg-emerald-700/95 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                            {language === 'kn' ? 'ಅಸಲಿ ಬಾಟಲಿ' : 'Original Pack'}
                          </span>
                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-bold shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                            {language === 'kn' ? 'ಫೋಟೋ ದೊಡ್ಡದು' : 'Zoom Photo'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2.5 w-full text-left">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200/90 px-2.5 py-0.5 rounded-lg">
                              {typeName}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                              {primaryMed.brandManufacturer}
                            </span>
                          </div>

                          <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                            {title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600">
                            <strong>{language === 'kn' ? 'ರಾಸಾಯನಿಕ ಸಂಯೋಜನೆ:' : 'Active Ingredient:'}</strong> {primaryMed.activeIngredient}
                          </p>

                          {/* PROMINENT PER ACRE DOSAGE HIGHLIGHT */}
                          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 sm:p-3.5 space-y-1.5 mt-1 shadow-xs">
                            <p className="text-xs sm:text-sm font-black text-emerald-950 flex flex-wrap items-center gap-1.5">
                              <span className="text-emerald-700 text-sm">🎯 {language === 'kn' ? 'ಪ್ರತಿ ಎಕರೆಗೆ ಸಿಂಪಡಿಸಬೇಕಾದ ನಿಖರ ಪ್ರಮಾಣ:' : 'Per Acre Spray Dosage:'}</span>
                              <span className="text-emerald-950 bg-emerald-200/80 px-2.5 py-0.5 rounded-lg font-black text-sm sm:text-base border border-emerald-400">
                                {dosageAcre}
                              </span>
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-800 pt-1 font-semibold">
                              <span>
                                💧 <strong>{language === 'kn' ? 'ಲೀಟರ್ ನೀರಿಗೆ:' : 'Per Liter:'}</strong> {dosageLiter}
                              </span>
                              <span>
                                🌾 <strong>{language === 'kn' ? 'ನೀರು / ಎಕರೆ:' : 'Water:'}</strong> {waterAcre}
                              </span>
                              <span>
                                ⏱️ <strong>{language === 'kn' ? 'ಕಾಯುವ ಅವಧಿ:' : 'Waiting Period:'}</strong> {waitingPeriod}
                              </span>
                            </div>
                          </div>

                          {/* Interactive Acre Dosage Quick-Selector */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700">
                                🚜 {language === 'kn' ? 'ನಿಮ್ಮ ಜಮೀನಿನ ಅಳತೆ ಆಯ್ಕೆಮಾಡಿ:' : 'Select Your Farm Size:'}
                              </span>
                              <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {sprayAcreage} {language === 'kn' ? 'ಎಕರೆ' : 'Acre(s)'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[0.5, 1, 2, 3, 5].map((acre) => (
                                <button
                                  key={acre}
                                  type="button"
                                  onClick={() => setSprayAcreage(acre)}
                                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                                    sprayAcreage === acre
                                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                  }`}
                                >
                                  {acre} {language === 'kn' ? 'ಎಕರೆ' : 'Acre'}
                                </button>
                              ))}
                            </div>
                            <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/80 font-medium leading-relaxed">
                              ✅ <strong>{sprayAcreage} {language === 'kn' ? 'ಎಕರೆಗೆ ಬೇಕಾಗುವ ಒಟ್ಟು ಅಳತೆ:' : 'Acre Total Requirement:'}</strong>{' '}
                              {sprayAcreage * 200} {language === 'kn' ? 'ಲೀಟರ್ ನೀರು ಮತ್ತು' : 'Liters water and'}{' '}
                              {Math.round(sprayAcreage * 13)} {language === 'kn' ? 'ಸ್ಪ್ರೇ ಟ್ಯಾಂಕ್‌ಗಳು (15 ಲೀಟರ್ ಪಂಪ್).' : 'knapsack pump tanks.'}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 italic pt-0.5">
                            🛡️ {safetyGuide}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Biological / Organic Remedy with Large Neem Oil / Bio image */}
                  {(language === 'kn' ? diagnosis.biologicalTreatmentKn : diagnosis.biologicalTreatmentEn)[0] && (() => {
                    const bioText = (language === 'kn' ? diagnosis.biologicalTreatmentKn : diagnosis.biologicalTreatmentEn)[0];
                    const isTrichoderma = bioText.toLowerCase().includes('trichoderma') || bioText.includes('ಟ್ರೈಕೋಡರ್ಮಾ') || bioText.toLowerCase().includes('wilt') || bioText.includes('ಸೊರಗು');
                    const bioImg = isTrichoderma ? '/medicines/trichoderma.jpg' : '/medicines/neem_oil.jpg';
                    const bioTitle = isTrichoderma
                      ? (language === 'kn' ? 'ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ (Trichoderma viride Bio)' : 'Trichoderma viride Bio-Fungicide')
                      : (language === 'kn' ? 'ಬೇವಿನ ಎಣ್ಣೆ 10,000 PPM (Neem Baan Organic)' : 'Neem Oil 10,000 PPM (Neem Baan)');
                    const bioDosage = isTrichoderma
                      ? (language === 'kn' ? '1.5 - 2.0 ಕೆಜಿ / ಎಕರೆ (ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದಲ್ಲಿ ಬೆರೆಸಿ)' : '1.5 - 2.0 kg / acre')
                      : (language === 'kn' ? '500 - 600 ML / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)' : '500 - 600 ml / acre');

                    return (
                      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center md:items-start">
                        <div
                          onClick={() =>
                            setExpandedPhoto({
                              src: bioImg,
                              title: bioTitle,
                              subtitle: isTrichoderma ? 'Trichoderma viride 2x10^8 CFU/g' : 'Azadirachtin 1.0% (10,000 PPM)',
                              dosage: bioDosage,
                            })
                          }
                          className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-slate-50 border-2 border-emerald-300 shrink-0 shadow-md flex flex-col items-center justify-center p-2.5 cursor-pointer hover:border-emerald-600 transition-all group relative self-center"
                          title={language === 'kn' ? 'ದೊಡ್ಡದಾಗಿ ನೋಡಲು ಫೋಟೋ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to zoom photo'}
                        >
                          <img
                            src={bioImg}
                            alt="Bio Remedy"
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold opacity-90 group-hover:opacity-100">
                            <ZoomIn className="w-3 h-3 text-emerald-300" />
                            {language === 'kn' ? 'ದೊಡ್ಡದು' : 'Zoom'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5 w-full text-left">
                          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                            {language === 'kn' ? '🌿 ಸಾವಯವ / ಜೈವಿಕ ಮದ್ದು' : '🌿 Organic / Bio Remedy'}
                          </span>
                          <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                            {bioTitle}
                          </h3>

                          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 text-xs space-y-1">
                            <p className="text-emerald-950 font-black">
                              🎯 {language === 'kn' ? 'ಪ್ರತಿ ಎಕರೆಗೆ ಪ್ರಮಾಣ:' : 'Per Acre Dosage:'}{' '}
                              <span className="text-emerald-900 underline font-black text-sm">
                                {bioDosage}
                              </span>
                            </p>
                            <p className="text-slate-700 text-xs font-medium leading-relaxed">
                              {bioText}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation for detailed cures */}
        <div className="flex border-t border-slate-200 bg-slate-50/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('biological')}
            className={`flex-1 min-w-[120px] py-3 px-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'biological'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'kn' ? 'ಜೈವಿಕ ಚಿಕಿತ್ಸೆ' : 'Biological'}</span>
          </button>

          <button
            onClick={() => setActiveTab('chemical')}
            className={`flex-1 min-w-[120px] py-3 px-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chemical'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'kn' ? 'ರಾಸಾಯನಿಕ ಮದ್ದು' : 'Chemical'}</span>
          </button>

          <button
            onClick={() => setActiveTab('symptoms')}
            className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'symptoms'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'kn' ? 'ಲಕ್ಷಣಗಳು' : 'Symptoms'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prevention')}
            className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'prevention'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'kn' ? 'ಮುನ್ನೆಚ್ಚರಿಕೆ' : 'Prevention'}</span>
          </button>

          <button
            onClick={() => setActiveTab('causes')}
            className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'causes'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'kn' ? 'ಕಾರಣಗಳು' : 'Causes'}</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-4 sm:p-5">
          {/* 1. BIOLOGICAL / ORGANIC TREATMENT */}
          {activeTab === 'biological' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <h3>{language === 'kn' ? 'ಸಾವಯವ & ಜೈವಿಕ ನಿಯಂತ್ರಣ ಮದ್ದುಗಳು' : 'Biological & Organic Remedies'}</h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {language === 'kn' ? '100% ನೈಸರ್ಗಿಕ & ವಿಷಮುಕ್ತ' : '100% Eco-Safe'}
                </span>
              </div>

              {/* Bio product visual card */}
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row gap-3 items-start">
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-emerald-50/50 border border-emerald-200 shrink-0 shadow-inner flex items-center justify-center p-1.5 self-center sm:self-start">
                  <img
                    src="/medicines/neem_oil.jpg"
                    alt="Neem Baan Organic Bio-Pesticide"
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {language === 'kn' ? 'ಮುಖ್ಯ ಸಾವಯವ ಮದ್ದು' : 'Primary Bio Remedy'}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {language === 'kn' ? 'ಬೇವಿನ ಎಣ್ಣೆ 10,000 PPM (Neem Baan Organic)' : 'Cold-Pressed Neem Oil 10,000 PPM (Neem Baan)'}
                  </h4>
                  <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2 text-xs">
                    <p className="text-emerald-950 font-black">
                      🎯 {language === 'kn' ? 'ಪ್ರತಿ ಎಕರೆಗೆ ಪ್ರಮಾಣ:' : 'Per Acre Dosage:'}{' '}
                      <span className="text-emerald-900 underline font-black">
                        {language === 'kn' ? '500 - 600 ML ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)' : '500 - 600 ml per acre (in 200L water)'}
                      </span>
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      💧 {language === 'kn' ? 'ಲೀಟರ್ ನೀರಿಗೆ:' : 'Per Liter:'} 3.0 {language === 'kn' ? 'ಮಿಲಿ (ಯಾವುದೇ ಕೀಟನಾಶಕ ಅವಶೇಷವಿಲ್ಲ)' : 'ml (Zero chemical residue)'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {((language === 'kn' ? diagnosis.biologicalTreatmentKn : diagnosis.biologicalTreatmentEn) || []).map((bio, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">{bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CHEMICAL TREATMENT */}
          {activeTab === 'chemical' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <h3>{language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಅಸಲಿ ರಾಸಾಯನಿಕ ಮದ್ದುಗಳು & ಪ್ರಮಾಣ' : 'Recommended Chemical Fungicides / Pesticides'}</h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {language === 'kn' ? '🌾 ನಿಖರ ಎಕರೆ ಲೆಕ್ಕಾಚಾರ' : '🌾 Exact Acre Calculations'}
                </span>
              </div>

              {diagnosis.isHealthy ? (
                <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium">
                  {language === 'kn'
                    ? 'ಗಿಡ ಆರೋಗ್ಯವಾಗಿದೆ. ಯಾವುದೇ ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ ಅಗತ್ಯವಿಲ್ಲ.'
                    : 'The plant is healthy! No chemical spraying is needed.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {((language === 'kn' ? diagnosis.chemicalTreatmentKn : diagnosis.chemicalTreatmentEn) || []).map((chem, idx) => {
                    const enriched = enrichChemicalItem(chem, diagnosis.issueNameEn);
                    return (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                          {/* Large Medicine Bottle / Pack Photo */}
                          <div
                            onClick={() =>
                              setExpandedPhoto({
                                src: enriched.medicineImage || '/medicines/saaf.jpg',
                                title: enriched.productName,
                                subtitle: enriched.activeIngredient,
                                dosage: enriched.dosagePerAcre || '',
                              })
                            }
                            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-slate-50 border-2 border-indigo-200 shrink-0 shadow-md flex items-center justify-center p-2 cursor-pointer hover:border-indigo-600 transition-all group relative self-center sm:self-start"
                            title={language === 'kn' ? 'ದೊಡ್ಡದಾಗಿ ನೋಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to zoom photo'}
                          >
                            <img
                              src={enriched.medicineImage || '/medicines/saaf.jpg'}
                              alt={enriched.productName}
                              className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/medicines/saaf.jpg';
                              }}
                            />
                            <span className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold opacity-90 group-hover:opacity-100">
                              <ZoomIn className="w-2.5 h-2.5 text-amber-300" />
                              {language === 'kn' ? 'ದೊಡ್ಡದು' : 'Zoom'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                {enriched.medicineType || (language === 'kn' ? 'ರಾಸಾಯನಿಕ ಮದ್ದು' : 'Chemical Medicine')}
                              </span>
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {enriched.activeIngredient}
                              </span>
                            </div>

                            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                              {enriched.productName}
                            </h4>

                            {/* HIGHLIGHTED PER ACRE DOSAGE BOX */}
                            <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-xl p-2.5 space-y-1">
                              <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                                <span className="text-emerald-700">🎯 {language === 'kn' ? 'ಪ್ರತಿ ಎಕರೆಗೆ ಸಿಂಪಡಿಸಬೇಕಾದ ಪ್ರಮಾಣ:' : 'Per Acre Spray Dosage:'}</span>
                                <span className="text-emerald-900 underline font-black text-xs sm:text-sm">
                                  {enriched.dosagePerAcre || (language === 'kn' ? '200-250 ML / ಎಕರೆ' : '200-250 ml/acre')}
                                </span>
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 pt-0.5">
                                <span>
                                  💧 <strong>{language === 'kn' ? 'ಲೀಟರ್ ನೀರಿಗೆ:' : 'Per Liter:'}</strong> {enriched.dosage}
                                </span>
                                <span>
                                  🌾 <strong>{language === 'kn' ? 'ನೀರು / ಎಕರೆ:' : 'Water Volume:'}</strong> 200 {language === 'kn' ? 'ಲೀಟರ್ (13-14 ಪಂಪ್)' : 'Liters (13-14 pumps)'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>
                                  <strong className="text-slate-900">{language === 'kn' ? 'ಕಾಯುವ ಅವಧಿ:' : 'Harvest Interval:'}</strong> {enriched.waitingPeriod}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 italic">
                                🛡️ {enriched.applicationMethod || (language === 'kn' ? 'ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಸಿಂಪಡಿಸಿ' : 'Spray early morning or late afternoon')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      {language === 'kn'
                        ? 'ಕೃಷಿ ಸಲಹೆ: ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವಾಗ ರಕ್ಷಣಾ ಮುಖವಾಡ ಮತ್ತು ಕೈಗವಸು ಧರಿಸಿ. ಬಿಸಿಲು ಹೆಚ್ಚಾಗುವ ಮುನ್ನ ಬೆಳಿಗ್ಗೆ 7-10 ಗಂಟೆ ಅಥವಾ ಸಂಜೆ 4-6 ಗಂಟೆ ವೇಳೆ ಎಲೆಯ ಎರಡೂ ಬದಿ ತೊಯ್ಯುವಂತೆ ಸಿಂಪಡಿಸಿ.'
                        : 'Agronomy safety tip: Always wear gloves and a safety mask. Spray early morning (7-10 AM) or evening (4-6 PM) to ensure optimal absorption and prevent evaporation.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. SYMPTOMS */}
          {activeTab === 'symptoms' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'kn' ? 'ಎಲೆಯ ರೋಗಲಕ್ಷಣಗಳು (Symptoms)' : 'Observable Disease Symptoms'}
              </h3>
              <div className="space-y-2">
                {((language === 'kn' ? diagnosis.symptomsKn : diagnosis.symptomsEn) || []).map((symp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{symp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CAUSES */}
          {activeTab === 'causes' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'kn' ? 'ರೋಗ ಉಂಟಾಗಲು ಕಾರಣಗಳು (Causes)' : 'Pathogen & Triggers'}
              </h3>
              <div className="space-y-2">
                {((language === 'kn' ? diagnosis.causesKn : diagnosis.causesEn) || []).map((cau, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{cau}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PREVENTION */}
          {activeTab === 'prevention' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'kn' ? 'ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ತಡೆಯುವ ಕ್ರಮಗಳು' : 'Long-term Preventative Agronomy'}
              </h3>
              <div className="space-y-2">
                {((language === 'kn' ? diagnosis.preventionTipsKn : diagnosis.preventionTipsEn) || []).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spray guide banner */}
        {diagnosis.sprayVolumeGuide && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">{language === 'kn' ? 'ಸಿಂಪರಣೆ ನೀರಿನ ಪ್ರಮಾಣ:' : 'Spray Water Guide:'}</span>
            <span className="font-mono text-emerald-800 font-bold">{diagnosis.sprayVolumeGuide}</span>
          </div>
        )}
      </div>

      {/* Action Footer (Plantix action buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onOpenCalculator(diagnosis.cropNameEn)}
          className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Calculator className="w-4 h-4 text-amber-300" />
          <span>{language === 'kn' ? 'ನನ್ನ ಜಮೀನಿಗೆ ಔಷಧ/ಗೊಬ್ಬರ ಲೆಕ್ಕ ಹಾಕಿ' : 'Calculate Farm Dosage (Calculator)'}</span>
        </button>

        <button
          onClick={() => onAskCommunity(diagnosis, imageSrc)}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>{language === 'kn' ? 'ಕೃಷಿ ವೇದಿಕೆಯಲ್ಲಿ ರೈತರಿಗೆ ಪ್ರಶ್ನಿಸಿ' : 'Ask Farming Community'}</span>
        </button>
      </div>

      {/* High-Resolution Medicine Photo Zoom Modal */}
      {expandedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-slate-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 sm:p-5 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  {language === 'kn' ? 'ಅಸಲಿ ಮದ್ದಿನ ಫೋಟೋ & ನಿಖರ ಅಳತೆ' : 'Original Medicine Photo & Dosage'}
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1.5 leading-snug">{expandedPhoto.title}</h3>
                <p className="text-xs text-emerald-100 font-medium">{expandedPhoto.subtitle}</p>
              </div>
              <button
                onClick={() => setExpandedPhoto(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Photo Display */}
            <div className="p-5 sm:p-6 bg-slate-50 flex flex-col items-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-md flex items-center justify-center">
                <img
                  src={expandedPhoto.src}
                  alt={expandedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Dosage information */}
              <div className="w-full mt-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                <p className="text-xs font-black text-emerald-950">
                  🎯 {language === 'kn' ? 'ಪ್ರತಿ ಎಕರೆಗೆ ಸಿಂಪಡಿಸಬೇಕಾದ ನಿಖರ ಪ್ರಮಾಣ:' : 'Prescribed Acre Dosage:'}
                </p>
                <p className="text-base sm:text-lg font-black text-emerald-800 underline">
                  {expandedPhoto.dosage}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setExpandedPhoto(null)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                {language === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
