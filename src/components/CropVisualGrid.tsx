import React, { useState } from 'react';
import { Camera, Sparkles, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { Language, CropInfo } from '../types/plants';
import { cropList } from '../data/mockData';

interface CropVisualGridProps {
  language: Language;
  onSelectCrop: (crop: CropInfo) => void;
}

export const CropVisualGrid: React.FC<CropVisualGridProps> = ({
  language,
  onSelectCrop,
}) => {
  // Track failed image URLs to fallback to clean botanical vector illustration
  const [imageErrors, setImageErrors] = useState<{ [id: string]: boolean }>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-2xl p-3.5 text-white shadow-md border border-emerald-700/60 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white drop-shadow-sm">
              {language === 'kn' ? 'ಬೆಳೆಯ ಫೋಟೋ ಒತ್ತಿ - ತಕ್ಷಣ ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Tap Crop Photo to Scan Leaf'}
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-100 font-medium">
            {language === 'kn'
              ? 'ಕೆಳಗಿನ ನಿಮ್ಮ ಬೆಳೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ➔ ಕ್ಯಾಮೆರಾ ಓಪನ್ ಆಗುತ್ತದೆ ➔ ಎಲೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಔಷಧ ಸಿಗುತ್ತದೆ!'
              : 'Tap your crop: Camera opens instantly, detects leaf disease & provides medicine!'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-bold shadow">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{language === 'kn' ? 'ತತ್ಕ್ಷಣ ಪತ್ತೆ' : 'Instant AI'}</span>
        </div>
      </div>

      {/* Grid of 12 Accurate Agricultural Crops */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
        {cropList.map((crop) => {
          const hasError = imageErrors[crop.id];

          return (
            <div
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectCrop(crop);
              }}
              className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {/* Crop Photo Container */}
              <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-900">
                {!hasError ? (
                  <img
                    src={crop.image}
                    alt={`${crop.nameEn} - ${crop.nameKn}`}
                    loading="lazy"
                    onError={() => handleImageError(crop.id)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-2 text-center">
                    <span className="text-4xl mb-1">{crop.iconEmoji}</span>
                    <span className="text-xs font-bold text-emerald-200">{crop.nameKn}</span>
                  </div>
                )}

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                {/* Crop Emoji Tag & Category badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow">
                  <span className="text-sm">{crop.iconEmoji}</span>
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {language === 'kn' ? crop.nameKn : crop.nameEn}
                  </span>
                </div>

                {/* Camera Scan Action Chip */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-600 group-hover:bg-amber-400 text-white group-hover:text-slate-950 font-black px-2.5 py-1 rounded-full text-[11px] shadow-lg transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{language === 'kn' ? 'ಸ್ಕ್ಯಾನ್' : 'Scan'}</span>
                </div>
              </div>

              {/* Crop Label & Details */}
              <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {language === 'kn' ? crop.nameKn : crop.nameEn}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold truncate ml-1">
                      {language === 'kn' ? crop.nameEn : crop.nameKn}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic font-serif truncate mt-0.5">
                    {crop.scientificName}
                  </p>
                </div>

                {/* Tap to open camera prompt */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-emerald-700 group-hover:text-emerald-900">
                  <span className="truncate flex items-center gap-1">
                    <Camera className="w-3 h-3 text-emerald-600" />
                    {language === 'kn' ? 'ಕ್ಯಾಮೆರಾ ಓಪನ್' : 'Open Camera'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-emerald-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
