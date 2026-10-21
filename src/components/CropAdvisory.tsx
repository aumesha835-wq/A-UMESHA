import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Layers,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Camera,
  Calculator,
  Search,
} from 'lucide-react';
import { Language, CropInfo } from '../types/plants';
import { cropList } from '../data/mockData';

interface CropAdvisoryProps {
  language: Language;
  onSelectCropForScan: (cropName: string) => void;
  onSelectCropForCalc: (cropName: string) => void;
}

export const CropAdvisory: React.FC<CropAdvisoryProps> = ({
  language,
  onSelectCropForScan,
  onSelectCropForCalc,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Cereals', 'Vegetables', 'Cash Crops'];

  const filteredCrops = cropList.filter((crop) => {
    const matchesCategory = categoryFilter === 'All' || crop.category === categoryFilter;
    const matchesSearch =
      crop.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.nameKn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* If a crop is selected, show detail handbook */}
      {selectedCrop ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedCrop(null)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'kn' ? 'ಎಲ್ಲಾ ಬೆಳೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ' : 'Back to All Crops'}</span>
          </button>

          {/* Hero Banner for Selected Crop */}
          <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <img
              src={selectedCrop.image}
              alt={selectedCrop.nameEn}
              className="w-full h-44 sm:h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full w-fit mb-1 border border-emerald-500/30">
                {language === 'kn' ? selectedCrop.categoryKn : selectedCrop.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                {language === 'kn' ? selectedCrop.nameKn : selectedCrop.nameEn}
              </h2>
              <p className="text-xs text-slate-300 italic font-serif">
                {selectedCrop.scientificName}
              </p>
            </div>
          </div>

          {/* Key Facts bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'kn' ? 'ಋತುಮಾನ' : 'Season'}
              </span>
              <p className="font-bold text-slate-900 mt-0.5">
                {language === 'kn' ? selectedCrop.seasonKn : selectedCrop.seasonEn}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {language === 'kn' ? 'ಬೆಳೆಯ ಅವಧಿ' : 'Duration'}
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{selectedCrop.durationDays}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs col-span-2 sm:col-span-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                {language === 'kn' ? 'ಸೂಕ್ತ ಮಣ್ಣು' : 'Ideal Soil'}
              </span>
              <p className="font-bold text-slate-900 mt-0.5 truncate">
                {language === 'kn' ? selectedCrop.idealSoilKn : selectedCrop.idealSoil}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons for this Crop */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelectCropForScan(selectedCrop.nameEn)}
              className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>{language === 'kn' ? 'ಈ ಬೆಳೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Scan Leaf of this Crop'}</span>
            </button>

            <button
              onClick={() => onSelectCropForCalc(selectedCrop.nameEn)}
              className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Calculator className="w-4 h-4 text-emerald-950" />
              <span>{language === 'kn' ? 'ಗೊಬ್ಬರ ಲೆಕ್ಕ ಹಾಕಿ' : 'Calculate Fertilizer'}</span>
            </button>
          </div>

          {/* Common Diseases & Pests Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>
                {language === 'kn'
                  ? `${selectedCrop.nameKn} - ಸಾಮಾನ್ಯ ರೋಗ ಮತ್ತು ಕೀಟಗಳು`
                  : `Common Threats for ${selectedCrop.nameEn}`}
              </span>
            </h3>

            <div className="space-y-3">
              {selectedCrop.commonPests.map((pest) => (
                <div
                  key={pest.id}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === 'kn' ? pest.nameKn : pest.nameEn}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {pest.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {language === 'kn' ? pest.shortDescKn : pest.shortDescEn}
                  </p>

                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-medium">
                    <strong>{language === 'kn' ? 'ಪರಿಹಾರ / ಔಷಧ:' : 'Remedy:'}</strong>{' '}
                    {language === 'kn' ? pest.remedyKn : pest.remedyEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Crops Catalog Browse View */
        <div className="space-y-4">
          {/* Header Title */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              {language === 'kn' ? 'ಬೆಳೆ ರಕ್ಷಣಾ ಕೈಪಿಡಿ (Crops Guide)' : 'Crops Advisory & Protection Guide'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'kn'
                ? 'ಪ್ರಮುಖ ಕೃಷಿ ಬೆಳೆಗಳ ಸಮಗ್ರ ರೋಗ, ಕೀಟ ಮತ್ತು ಪೋಷಕಾಂಶ ಮಾಹಿತಿ'
                : 'Complete agronomic handbook for high yield and disease protection'}
            </p>
          </div>

          {/* Search & Category Pills */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'kn' ? 'ಬೆಳೆಯ ಹೆಸರನ್ನು ಹುಡುಕಿ...' : 'Search crops...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All'
                    ? language === 'kn' ? 'ಎಲ್ಲಾ ಬೆಳೆಗಳು' : 'All Crops'
                    : cat === 'Cereals'
                    ? language === 'kn' ? 'ಧಾನ್ಯಗಳು' : 'Cereals'
                    : cat === 'Vegetables'
                    ? language === 'kn' ? 'ತರಕಾರಿಗಳು' : 'Vegetables'
                    : language === 'kn' ? 'ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು' : 'Cash Crops'}
                </button>
              ))}
            </div>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  <img
                    src={crop.image}
                    alt={crop.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {language === 'kn' ? crop.categoryKn : crop.category}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {language === 'kn' ? crop.nameKn : crop.nameEn}
                    </h3>
                    <p className="text-[11px] text-slate-500 italic font-serif">
                      {crop.scientificName}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                      <span><strong>{language === 'kn' ? 'ಅವಧಿ:' : 'Duration:'}</strong> {crop.durationDays}</span>
                      <span>•</span>
                      <span><strong>{language === 'kn' ? 'ಋತುಮಾನ:' : 'Season:'}</strong> {language === 'kn' ? crop.seasonKn : crop.seasonEn}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>{language === 'kn' ? 'ಮಾರ್ಗದರ್ಶಿ ಓದಿ' : 'View Advisory Guide'}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
