export type Language = 'kn' | 'en';

export interface ChemicalTreatmentItem {
  productName: string;
  activeIngredient: string;
  dosage: string;
  dosagePerAcre?: string;
  waitingPeriod: string;
  medicineImage?: string;
  medicineType?: string;
  applicationMethod?: string;
}

export interface DiagnosisData {
  cropNameEn: string;
  cropNameKn: string;
  isHealthy: boolean;
  issueNameEn: string;
  issueNameKn: string;
  scientificName: string;
  confidenceScore: number;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'Severe';
  alertLevel: 'green' | 'yellow' | 'red';
  symptomsEn: string[];
  symptomsKn: string[];
  causesEn: string[];
  causesKn: string[];
  biologicalTreatmentEn: string[];
  biologicalTreatmentKn: string[];
  chemicalTreatmentEn: ChemicalTreatmentItem[];
  chemicalTreatmentKn: ChemicalTreatmentItem[];
  preventionTipsEn: string[];
  preventionTipsKn: string[];
  sprayVolumeGuide: string;
  summaryEn: string;
  summaryKn: string;
}

export interface SavedScan {
  id: string;
  timestamp: number;
  imageThumbnail: string;
  data: DiagnosisData;
}

export interface PestOrDisease {
  id: string;
  nameEn: string;
  nameKn: string;
  type: 'disease' | 'pest' | 'deficiency';
  severity: 'Low' | 'Moderate' | 'Severe';
  thumbnail: string;
  shortDescEn: string;
  shortDescKn: string;
  remedyEn: string;
  remedyKn: string;
}

export interface FertilizerStage {
  stageEn: string;
  stageKn: string;
  timingDays: string;
  ureaKgPerAcre: number;
  dapKgPerAcre: number;
  mopKgPerAcre: number;
  micronutrientRecommendationEn: string;
  micronutrientRecommendationKn: string;
}

export interface CropInfo {
  id: string;
  nameEn: string;
  nameKn: string;
  scientificName: string;
  category: 'Cereals' | 'Vegetables' | 'Cash Crops' | 'Plantation' | 'Pulses';
  categoryKn: string;
  image: string;
  seasonEn: string;
  seasonKn: string;
  durationDays: string;
  idealSoil: string;
  idealSoilKn: string;
  iconEmoji?: string;
  sampleDiseases?: {
    id: string;
    nameEn: string;
    nameKn: string;
    image: string;
    data: DiagnosisData;
  }[];
  commonPests: PestOrDisease[];
  fertilizerStages: FertilizerStage[];
}

export interface CommunityComment {
  id: string;
  authorName: string;
  isAgronomist?: boolean;
  text: string;
  timeAgo: string;
  upvotes: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  location: string;
  cropNameEn: string;
  cropNameKn: string;
  title: string;
  description: string;
  imageUrl?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isSolved: boolean;
  timeAgo: string;
  comments: CommunityComment[];
}

export interface WeatherInfo {
  location: string;
  temp: number;
  conditionEn: string;
  conditionKn: string;
  humidity: number;
  rainChance: number;
  windSpeedKmH: number;
  pestRiskLevel: 'High' | 'Medium' | 'Low';
  pestRiskWarningEn: string;
  pestRiskWarningKn: string;
}
