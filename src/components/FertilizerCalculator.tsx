import React, { useState } from 'react';
import {
  Calculator,
  Droplets,
  Layers,
  Banknote,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types/plants';
import { cropList } from '../data/mockData';

interface FertilizerCalculatorProps {
  language: Language;
  preselectedCrop?: string;
}

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  language,
  preselectedCrop,
}) => {
  // Find matching crop or default to paddy
  const initialCrop = cropList.find((c) =>
    preselectedCrop ? c.nameEn.toLowerCase().includes(preselectedCrop.toLowerCase()) : false
  ) || cropList[0];

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCrop.id);
  const [areaValue, setAreaValue] = useState<number>(1);
  const [areaUnit, setAreaUnit] = useState<'acres' | 'guntas' | 'hectares'>('acres');
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  const selectedCrop = cropList.find((c) => c.id === selectedCropId) || cropList[0];
  const currentStage = selectedCrop.fertilizerStages[selectedStageIdx] || selectedCrop.fertilizerStages[0];

  // Convert all area units to Acres for standard NPK math
  // 1 Acre = 40 Guntas; 1 Hectare = 2.471 Acres
  let acresMultiplier = 1;
  if (areaUnit === 'guntas') {
    acresMultiplier = areaValue / 40;
  } else if (areaUnit === 'hectares') {
    acresMultiplier = areaValue * 2.471;
  } else {
    acresMultiplier = areaValue;
  }

  // Calculated values
  const ureaKg = Math.round(currentStage.ureaKgPerAcre * acresMultiplier * 10) / 10;
  const dapKg = Math.round(currentStage.dapKgPerAcre * acresMultiplier * 10) / 10;
  const mopKg = Math.round(currentStage.mopKgPerAcre * acresMultiplier * 10) / 10;

  // Water calculation: approximately 180 Liters of water per acre
  const totalWaterLiters = Math.round(180 * acresMultiplier);
  const sprayTanks = Math.ceil(totalWaterLiters / 15);

  // Approximate retail costs in India (Urea ~ ₹6/kg subsidized, DAP ~ ₹27/kg, MOP ~ ₹34/kg)
  const estimatedCostInr = Math.round(ureaKg * 6 + dapKg * 27 + mopKg * 34);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Calculator className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              {language === 'kn' ? 'ಗೊಬ್ಬರ & ಸಿಂಪರಣೆ ಲೆಕ್ಕಾಚಾರ ಯಂತ್ರ' : 'Fertilizer & Spray Calculator'}
              <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
                Plantix Algorithm
              </span>
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ತಕ್ಕಂತೆ ನಿಖರವಾದ ಯೂರಿಯಾ, ಡಿಎಪಿ, ಪೊಟ್ಯಾಶ್ ಮತ್ತು ಸ್ಪ್ರೇ ಟ್ಯಾಂಕ್ ಪ್ರಮಾಣ'
                : 'Scientific NPK dosage, water tank count & micronutrient schedule customized to your farm size'}
            </p>
          </div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Select Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {language === 'kn' ? '1. ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (Crop)' : '1. Select Crop'}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => {
                setSelectedCropId(e.target.value);
                setSelectedStageIdx(0);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cropList.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {language === 'kn' ? crop.nameKn : crop.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Area & Unit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {language === 'kn' ? '2. ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (Farm Area)' : '2. Farm Size / Area'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={areaValue}
                onChange={(e) => setAreaValue(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="acres">{language === 'kn' ? 'ಎಕರೆ (Acres)' : 'Acres'}</option>
                <option value="guntas">{language === 'kn' ? 'ಗುಂಟೆ (Guntas)' : 'Guntas (40/ac)'}</option>
                <option value="hectares">{language === 'kn' ? 'ಹೆಕ್ಟೇರ್ (Hectares)' : 'Hectares'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Growth Stage Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {language === 'kn' ? '3. ಬೆಳೆಯ ಹಂತ (Crop Stage)' : '3. Current Growth Stage'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {selectedCrop.fertilizerStages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStageIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedStageIdx === idx
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">
                    {stage.timingDays}
                  </span>
                  {selectedStageIdx === idx && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs font-bold">
                  {language === 'kn' ? stage.stageKn : stage.stageEn}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Results Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold">
              {language === 'kn'
                ? `${areaValue} ${areaUnit} ಜಮೀನಿಗೆ ಶಿಫಾರಸು ಮಾಡಿದ ಪೋಷಕಾಂಶಗಳು`
                : `Nutrient Dosage for ${areaValue} ${areaUnit}`}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            {language === 'kn' ? selectedCrop.nameKn : selectedCrop.nameEn}
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* NPK Big Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Urea */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-200 text-center">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                {language === 'kn' ? 'ಯೂರಿಯಾ (Nitrogen)' : 'Urea (46% N)'}
              </span>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-blue-950 font-mono">{ureaKg}</span>
                <span className="text-xs text-blue-800 ml-1 font-semibold">kg</span>
              </div>
              <p className="text-[10px] text-blue-600">
                {language === 'kn' ? 'ಎಲೆಗಳ ಹಸಿರು & ಗಿಡದ ಬೆಳವಣಿಗೆಗೆ' : 'For vegetative vigour & green foliage'}
              </p>
            </div>

            {/* DAP */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 p-4 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'kn' ? 'ಡಿ.ಎ.ಪಿ (Phosphorus)' : 'DAP (18-46-0)'}
              </span>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-emerald-950 font-mono">{dapKg}</span>
                <span className="text-xs text-emerald-800 ml-1 font-semibold">kg</span>
              </div>
              <p className="text-[10px] text-emerald-600">
                {language === 'kn' ? 'ಬೇರಿನ ಸದೃಢ ಬೆಳವಣಿಗೆಗೆ' : 'For deep root establishment'}
              </p>
            </div>

            {/* MOP Potash */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                {language === 'kn' ? 'ಪೊಟ್ಯಾಶ್ (Potassium)' : 'MOP / Potash (60% K)'}
              </span>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-amber-950 font-mono">{mopKg}</span>
                <span className="text-xs text-amber-800 ml-1 font-semibold">kg</span>
              </div>
              <p className="text-[10px] text-amber-600">
                {language === 'kn' ? 'ಕಾಳು ತುಂಬಲು & ರೋಗನಿರೋಧಕ ಶಕ್ತಿಗೆ' : 'Grain filling & pest resistance'}
              </p>
            </div>
          </div>

          {/* Water & Spray Tanks Calculator Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-3 bg-cyan-50/70 p-3.5 rounded-xl border border-cyan-200">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-cyan-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-cyan-900">
                  {language === 'kn' ? 'ಸಿಂಪರಣೆ ನೀರಿನ ಪ್ರಮಾಣ' : 'Spray Water Required'}
                </p>
                <p className="text-base font-bold text-cyan-950">
                  {totalWaterLiters} <span className="text-xs font-normal">Liters</span>
                  <span className="text-xs font-semibold text-cyan-700 ml-2">
                    ({sprayTanks} {language === 'kn' ? 'ಟ್ಯಾಂಕ್‌ಗಳು' : 'Tanks of 15L'})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-900">
                  {language === 'kn' ? 'ಅಂದಾಜು ಗೊಬ್ಬರದ ವೆಚ್ಚ' : 'Estimated Fertilizer Cost'}
                </p>
                <p className="text-base font-bold text-emerald-950">
                  ₹ {estimatedCostInr.toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({language === 'kn' ? 'ಸಬ್ಸಿಡಿ ದರದಲ್ಲಿ' : 'Govt subsidized rate'})
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Micronutrient Advisory Box */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{language === 'kn' ? 'ಲಘು ಪೋಷಕಾಂಶಗಳ ಶಿಫಾರಸು (Micronutrients):' : 'Micronutrient Advice:'}</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium pl-6">
              {language === 'kn'
                ? currentStage.micronutrientRecommendationKn
                : currentStage.micronutrientRecommendationEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
