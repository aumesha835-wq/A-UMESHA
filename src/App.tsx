import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CameraScanner } from './components/CameraScanner';
import { DiagnosisResult } from './components/DiagnosisResult';
import { FertilizerCalculator } from './components/FertilizerCalculator';
import { CropAdvisory } from './components/CropAdvisory';
import { CommunityForum } from './components/CommunityForum';
import { SplashScreen } from './components/SplashScreen';
import { LocalDataManager } from './components/LocalDataManager';
import { Language, DiagnosisData, SavedScan, CropInfo } from './types/plants';
import { mockWeather } from './data/mockData';

export default function App() {
  // 1. 2-second splash screen on app launch with app icon
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // 2. Language preference - defaults to Kannada ('kn')
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('plants_language');
    return (saved as Language) || 'kn';
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisData | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [selectedCropForScanner, setSelectedCropForScanner] = useState<CropInfo | null>(null);
  const [calcCropHint, setCalcCropHint] = useState<string>('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [communityPrefill, setCommunityPrefill] = useState<{
    cropName: string;
    issueTitle: string;
    imageUrl?: string;
  } | null>(null);

  // 3. User Requirement: 100% On-Device Storage for Lakhs of Users
  // Each user's diagnostic scan history is strictly saved locally in their mobile localStorage.
  // We do not pollute new users with external data.
  const [savedScans, setSavedScans] = useState<SavedScan[]>(() => {
    try {
      const stored = localStorage.getItem('plants_saved_scans');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read saved scans from device storage:', e);
    }
    return [];
  });

  // Save language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('plants_language', lang);
  };

  // Save new scan to device local storage
  const handleSaveScan = (diagnosis: DiagnosisData, imageSrc: string) => {
    const newScan: SavedScan = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      imageThumbnail: imageSrc,
      data: diagnosis,
    };
    const updated = [newScan, ...savedScans.filter((s) => s.id !== newScan.id)];
    setSavedScans(updated);
    try {
      localStorage.setItem('plants_saved_scans', JSON.stringify(updated.slice(0, 30)));
    } catch (e) {
      console.warn('Local storage write issue:', e);
    }
  };

  // Handlers
  const handleDiagnosisComplete = (data: DiagnosisData, imageSrc: string) => {
    setCurrentDiagnosis(data);
    setCurrentImageSrc(imageSrc);
    handleSaveScan(data, imageSrc);
  };

  // User taps ANY crop photo on Home Screen -> opens camera immediately with that crop
  const handleSelectCropToScan = (crop: CropInfo) => {
    setSelectedCropForScanner(crop);
    setCurrentDiagnosis(null);
    setActiveTab('scan');
  };

  const handleOpenScannerGeneral = () => {
    setSelectedCropForScanner(null);
    setCurrentDiagnosis(null);
    setActiveTab('scan');
  };

  const handleOpenCalculator = (cropName: string) => {
    setCalcCropHint(cropName);
    setCurrentDiagnosis(null);
    setActiveTab('calc');
  };

  const handleAskCommunity = (diagnosis: DiagnosisData, imageSrc: string) => {
    setCommunityPrefill({
      cropName: language === 'kn' ? diagnosis.cropNameKn : diagnosis.cropNameEn,
      issueTitle: language === 'kn' ? diagnosis.issueNameKn : diagnosis.issueNameEn,
      imageUrl: imageSrc,
    });
    setCurrentDiagnosis(null);
    setActiveTab('community');
  };

  const handleSelectSavedScan = (scan: SavedScan) => {
    setCurrentDiagnosis(scan.data);
    setCurrentImageSrc(scan.imageThumbnail);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'scan') {
      setCurrentDiagnosis(null);
    }
    setActiveTab(tab);
  };

  return (
    <>
      {/* 2-second Splash Screen on launch */}
      {showSplash && (
        <SplashScreen
          language={language}
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* Main Outer Viewport Framing with Sleek Black Border */}
      <div className="min-h-screen bg-slate-950 flex justify-center items-start p-1 sm:p-3">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-[98vh] bg-slate-100 text-slate-900 font-sans flex flex-col border-2 sm:border-[3px] border-black rounded-2xl sm:rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.85),0_15px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Top Header */}
          <Header
            language={language}
            onLanguageChange={handleLanguageChange}
            weather={mockWeather}
            onOpenScan={handleOpenScannerGeneral}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {currentDiagnosis && currentImageSrc ? (
              <DiagnosisResult
                diagnosis={currentDiagnosis}
                imageSrc={currentImageSrc}
                language={language}
                onBackToScanner={handleOpenScannerGeneral}
                onOpenCalculator={handleOpenCalculator}
                onAskCommunity={handleAskCommunity}
                onSaveReport={handleSaveScan}
              />
            ) : activeTab === 'scan' ? (
              <CameraScanner
                language={language}
                selectedCrop={selectedCropForScanner}
                onChangeCrop={() => setActiveTab('home')}
                onDiagnosisComplete={handleDiagnosisComplete}
                onCancel={() => setActiveTab('home')}
              />
            ) : activeTab === 'crops' ? (
              <CropAdvisory
                language={language}
                onSelectCropForScan={() => {
                  handleOpenScannerGeneral();
                }}
                onSelectCropForCalc={(crop) => {
                  setCalcCropHint(crop);
                  setActiveTab('calc');
                }}
              />
            ) : activeTab === 'calc' ? (
              <FertilizerCalculator
                language={language}
                preselectedCrop={calcCropHint}
              />
            ) : activeTab === 'community' ? (
              <CommunityForum
                language={language}
                prefillQuestion={communityPrefill}
                onClearPrefill={() => setCommunityPrefill(null)}
              />
            ) : (
              <HomeScreen
                language={language}
                weather={mockWeather}
                recentScans={savedScans}
                onOpenScan={handleOpenScannerGeneral}
                onOpenUpload={handleOpenScannerGeneral}
                onSelectCropToScan={handleSelectCropToScan}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                }}
                onSelectSavedScan={handleSelectSavedScan}
              />
            )}
          </main>

          {/* Mobile Bottom Navigation (Auto-closed downwards on open, swipe-up from bottom edge to show) */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            language={language}
          />

          {/* 100% On-Device Private Data Manager Modal */}
          <LocalDataManager
            language={language}
            isOpen={isPrivacyModalOpen}
            onClose={() => setIsPrivacyModalOpen(false)}
            savedScans={savedScans}
            onClearData={() => {
              setSavedScans([]);
              localStorage.removeItem('plants_saved_scans');
            }}
            onImportData={(imported) => {
              setSavedScans(imported);
              localStorage.setItem('plants_saved_scans', JSON.stringify(imported));
            }}
          />
        </div>
      </div>
    </>
  );
}
