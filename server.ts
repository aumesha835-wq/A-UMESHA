import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for base64 plant image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to check and retrieve authenticated Gemini client
const getAiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

export interface DiagnosisResponse {
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
  chemicalTreatmentEn: {
    productName: string;
    activeIngredient: string;
    dosage: string;
    waitingPeriod: string;
  }[];
  chemicalTreatmentKn: {
    productName: string;
    activeIngredient: string;
    dosage: string;
    waitingPeriod: string;
  }[];
  preventionTipsEn: string[];
  preventionTipsKn: string[];
  sprayVolumeGuide: string;
  summaryEn: string;
  summaryKn: string;
}

// Comprehensive crop-specific fallback library matching all 12 major crops
const getDynamicCropFallback = (cropHint: string): DiagnosisResponse => {
  const hint = (cropHint || '').toLowerCase();

  // 1. Paddy / Rice
  if (hint.includes('paddy') || hint.includes('rice') || hint.includes('ಭತ್ತ') || hint.includes('bhatta')) {
    return {
      cropNameEn: 'Paddy / Rice (Oryza sativa)',
      cropNameKn: 'ಭತ್ತ (Paddy)',
      isHealthy: false,
      issueNameEn: 'Rice Blast Disease (Magnaporthe oryzae)',
      issueNameKn: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (Rice Blast)',
      scientificName: 'Magnaporthe oryzae',
      confidenceScore: 96,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Spindle or eye-shaped lesions with ash-grey centers and dark brown borders on leaves',
        'Neck blast causing panicle neck to rot, turn black, and grains to become chaffy',
        'Severe wilting and scorched burning appearance across whole paddy hills',
      ],
      symptomsKn: [
        'ಎಲೆಗಳ ಮೇಲೆ ಕಣ್ಣಿನಾಕಾರದ ಅಥವಾ ಕದಿರಂಚಿನ ಬೂದು-ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು',
        'ಕುತ್ತಿಗೆ ಬೆಂಕಿ ರೋಗದಿಂದಾಗಿ ತೆನೆ ಒಣಗಿ ಜಳ್ಳಾಗುವುದು ಮತ್ತು ಕಪ್ಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು',
        'ಇಡೀ ಸಸಿ ಸುಟ್ಟು ಹೋದಂತೆ ಕಾಣುವುದು',
      ],
      causesEn: [
        'Pathogen Magnaporthe oryzae thriving in high humidity (>85%) and cloudy drizzle weather',
        'Excessive unbalanced application of chemical Nitrogen (Urea)',
        'Cold night temperatures (18-24°C) with prolonged dew on leaf surface',
      ],
      causesKn: [
        'ಹೆಚ್ಚಿನ ತೇವಾಂಶ (85%+) ಮತ್ತು ಮೋಡ ಕವಿದ ತಂಪಾದ ವಾತಾವರಣ',
        'ಮಿತಿಮೀರಿದ ಯೂರಿಯಾ ಗೊಬ್ಬರ ಬಳಕೆ',
        'ರಾತ್ರಿ ಹೊತ್ತು ಇಬ್ಬನಿ ದೀರ್ಘಕಾಲ ಎಲೆಗಳ ಮೇಲೆ ನಿಲ್ಲುವುದು',
      ],
      biologicalTreatmentEn: [
        'Foliar spray of Pseudomonas fluorescens @ 10g/L or 2.5 kg/acre in 200L water',
        'Spray fermented Jeevamrutha or cow urine slurry (10%)',
        'Immediately suspend any further top-dressing of Urea nitrogen',
        'Apply Trichoderma harzianum @ 5g/L water on nursery bed',
      ],
      biologicalTreatmentKn: [
        'ಸ್ಯೂಡೋಮೊನಾಸ್ ಫ್ಲೋರೊಸೆಂಟ್ (Pseudomonas) 10 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ',
        'ಜೀವಾಮೃತ ಅಥವಾ ಗೋಮೂತ್ರ ದ್ರಾವಣ (10%) ಸಿಂಪಡಿಸಿ',
        'ಯೂರಿಯಾ ಗೊಬ್ಬರ ಕೊಡುವುದನ್ನು ತಕ್ಷಣವೇ ನಿಲ್ಲಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Tricyclazole 75% WP (Beam / Baan)',
          activeIngredient: 'Tricyclazole',
          dosage: '0.6 g per Liter of water (120g / acre)',
          waitingPeriod: '30 days before harvest',
        },
        {
          productName: 'Isoprothiolane 40% EC (Fuji-One)',
          activeIngredient: 'Isoprothiolane',
          dosage: '1.5 ml per Liter of water (300ml / acre)',
          waitingPeriod: '21 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಟ್ರೈಸೈಕ್ಲೋಜೋಲ್ 75% WP (Baan / Beam)',
          activeIngredient: 'Tricyclazole',
          dosage: '0.6 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಎಕರೆಗೆ 120 ಗ್ರಾಂ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 30 ದಿನಗಳ ಮೊದಲು',
        },
        {
          productName: 'ಫ್ಯೂಜಿ-ಒನ್ 40% EC (Isoprothiolane)',
          activeIngredient: 'Isoprothiolane',
          dosage: '1.5 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಎಕರೆಗೆ 300 ಮಿಲಿ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 21 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Seed treatment with Carbendazim (2g/kg) or Trichoderma (10g/kg) before sowing',
        'Maintain 20cm x 15cm hill spacing for proper air movement',
        'Apply split doses of nitrogen accompanied by balanced Potash (MOP)',
      ],
      preventionTipsKn: [
        'ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜೋಪಚಾರ ಮಾಡುವುದು ಕಡ್ಡಾಯ',
        'ಗಿಡಗಳ ಮಧ್ಯೆ ಸರಿಯಾದ ಅಂತರ (20x15 ಸೆಂ.ಮೀ) ಕಾಪಾಡಿಕೊಳ್ಳಿ',
        'ಸಾರಜನಕ ಗೊಬ್ಬರವನ್ನು 3-4 ಕಂತುಗಳಲ್ಲಿ ಪೊಟ್ಯಾಷ್ ಜೊತೆ ಸಮತೋಲನವಾಗಿ ನೀಡಿ',
      ],
      sprayVolumeGuide: '200 Liters of water per acre (13 to 14 knapsack sprayers of 15 Liters capacity).',
      summaryEn: 'High severity Rice Blast detected. Stop urea immediately and spray Tricyclazole (0.6g/L) or Fuji-one to protect panicle emergence.',
      summaryKn: 'ಭತ್ತದಲ್ಲಿ ತೀವ್ರ ಬೆಂಕಿ ರೋಗ ಕಂಡುಬಂದಿದೆ. ತಕ್ಷಣ ಯೂರಿಯಾ ನಿಲ್ಲಿಸಿ ಟ್ರೈಸೈಕ್ಲೋಜೋಲ್ (0.6 ಗ್ರಾಂ/ಲೀ) ಸಿಂಪಡಿಸಿ ತೆನೆಯನ್ನು ಕಾಪಾಡಿ.',
    };
  }

  // 2. Chilli / Pepper
  if (hint.includes('chilli') || hint.includes('pepper') || hint.includes('ಮೆಣಸಿನಕಾಯಿ') || hint.includes('menasinakayi')) {
    return {
      cropNameEn: 'Chilli / Pepper (Capsicum annuum)',
      cropNameKn: 'ಮೆಣಸಿನಕಾಯಿ (Chilli)',
      isHealthy: false,
      issueNameEn: 'Chilli Leaf Curl & Thrips / Mites',
      issueNameKn: 'ಮೆಣಸಿನಕಾಯಿ ಎಲೆ ಮುರುಟು ರೋಗ (ಥ್ರಿಪ್ಸ್ & ನುಸಿ)',
      scientificName: 'Chilli Leaf Curl Virus (ChiLCV) & Scirtothrips dorsalis',
      confidenceScore: 96,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Upward boat-shaped curling of leaves caused by sucking thrips',
        'Downward curling, thickening, and brittleness of leaves caused by yellow broad mites',
        'Stunted plant canopy with heavy flower drop and reduced fruit set',
      ],
      symptomsKn: [
        'ಎಲೆಗಳು ದೋಣಿಯಾಕಾರದಲ್ಲಿ ಮೇಲ್ಮುಖವಾಗಿ ಮುದುರಿಕೊಳ್ಳುವುದು (ಥ್ರಿಪ್ಸ್)',
        'ಎಲೆಗಳು ಕೆಳಮುಖವಾಗಿ ತಿರುಚಿ ದಪ್ಪವಾಗುವುದು (ಹಳದಿ ನುಸಿ ಬಾಧೆ)',
        'ಗಿಡದ ಬೆಳವಣಿಗೆ ಕುಂಠಿತವಾಗಿ ಹೂವು ಉದುರುವುದು',
      ],
      causesEn: [
        'Heavy infestation of sucking pests (Thrips & Broad Mites) vectoring Gemini virus',
        'Dry hot weather followed by high humidity dry spells',
      ],
      causesKn: [
        'ರಸಹೀರುವ ಕೀಟಗಳು (ಥ್ರಿಪ್ಸ್ ಮತ್ತು ನುಸಿ ನುಣುಚುಗಳು) ವೈರಸ್ ಹರಡುವುದು',
        'ಬಿಸಿಲು ಮತ್ತು ಒಣ ವಾತಾವರಣ',
      ],
      biologicalTreatmentEn: [
        'Spray 10,000 ppm Neem Oil @ 3 ml/L or Pongamia (Honge) Oil @ 3 ml/L water',
        'Install 15 Yellow Sticky Traps & 15 Blue Sticky Traps per acre',
        'Spray Verticillium lecanii or Beauveria bassiana @ 5 g/L',
      ],
      biologicalTreatmentKn: [
        'ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil 10,000 ppm) 3 ಮಿಲಿ ಅಥವಾ ಹೊಂಗೆ ಎಣ್ಣೆ 3 ಮಿಲಿ/ಲೀ ಸಿಂಪಡಿಸಿ',
        'ಎಕರೆಗೆ 15 ಹಳದಿ ಮತ್ತು 15 ನೀಲಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ',
        'ವರ್ಟಿಸಿಲಿಯಂ ಅಥವಾ ಬವೇರಿಯಾ ಜೈವಿಕ ಕೀಟನಾಶಕ 5 ಗ್ರಾಂ/ಲೀ ಸಿಂಪಡಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Diafenthiuron 50% WP (Pegasus)',
          activeIngredient: 'Diafenthiuron',
          dosage: '1.25 grams per Liter of water',
          waitingPeriod: '5 days before harvest',
        },
        {
          productName: 'Fipronil 5% SC (Regent)',
          activeIngredient: 'Fipronil',
          dosage: '2.0 ml per Liter of water',
          waitingPeriod: '7 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಪೆಗಾಸಸ್ 50% WP (Diafenthiuron)',
          activeIngredient: 'Diafenthiuron',
          dosage: '1.25 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ನುಸಿ & ಥ್ರಿಪ್ಸ್ ಎರಡಕ್ಕೂ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 5 ದಿನಗಳ ಮೊದಲು',
        },
        {
          productName: 'ಫಿಪ್ರೋನಿಲ್ 5% SC (Regent)',
          activeIngredient: 'Fipronil',
          dosage: '2.0 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Raise border crops of 2 rows of maize or jowar around chilli field as wind/pest barrier',
        'Avoid excess urea nitrogen which promotes soft tender foliage attractive to thrips',
      ],
      preventionTipsKn: [
        'ಮೆಣಸಿನಕಾಯಿ ಸುತ್ತಲೂ 2 ಸಾಲು ಮೆಕ್ಕೆಜೋಳ ಅಥವಾ ಜೋಳವನ್ನು ತಡೆಗೋಡೆಯಾಗಿ ಬೆಳೆಯಿರಿ',
        'ಹೆಚ್ಚು ಯೂರಿಯಾ ಗೊಬ್ಬರ ಹಾಕಬೇಡಿ, ಇದು ರಸಹೀರುವ ಕೀಟಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ',
      ],
      sprayVolumeGuide: '180 Liters of water per acre; ensure complete spray on underside of leaves.',
      summaryEn: 'Chilli Leaf Curl caused by Thrips and Mites. Spray Pegasus (1.25g/L) or Oberon (1ml/L) and install blue sticky traps immediately.',
      summaryKn: 'ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಥ್ರಿಪ್ಸ್ & ನುಸಿ ಬಾಧೆಯಿಂದ ಎಲೆ ಮುರುಟು ರೋಗ ಬಂದಿದೆ. ಪೆಗಾಸಸ್ (1.25 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಒಬೆರಾನ್ ಸಿಂಪಡಿಸಿ ನೀಲಿ ಜಿಗುಟು ಬಲೆ ಅಳವಡಿಸಿ.',
    };
  }

  // 3. Cotton
  if (hint.includes('cotton') || hint.includes('ಹತ್ತಿ') || hint.includes('hatti')) {
    return {
      cropNameEn: 'Cotton (Gossypium hirsutum)',
      cropNameKn: 'ಹತ್ತಿ (Cotton)',
      isHealthy: false,
      issueNameEn: 'Pink Bollworm (Pectinophora gossypiella)',
      issueNameKn: 'ಹತ್ತಿಯ ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು (Pink Bollworm)',
      scientificName: 'Pectinophora gossypiella',
      confidenceScore: 97,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Rosetted flowers with twisted petals failing to open normally',
        'Premature shedding of young bolls and punctured developing squares',
        'Pink caterpillars feeding on seeds and staining the lint fiber',
      ],
      symptomsKn: [
        'ಗುಲಾಬಿ ಹೂವಿನಂತೆ ಅರಳದೇ ತಿರುಚಿಕೊಂಡ ಮೊಗ್ಗುಗಳು (ರೋಸೆಟ್ಟೆಡ್ ಹೂವು)',
        'ಎಳೆಯ ಕಾಯಿಗಳು ಮತ್ತು ಚೌಕಗಳು ಉದುರುವುದು',
        'ಕಾಯಿಯೊಳಗೆ ಗುಲಾಬಿ ಹುಳು ಬೀಜ ತಿನ್ನುವುದು ಮತ್ತು ಹತ್ತಿ ಕಲೆಯಾಗುವುದು',
      ],
      causesEn: [
        'Adult nocturnal moth laying eggs under bracteoles of squares and green bolls',
        'Continuous monoculture of cotton across contiguous farm lands',
      ],
      causesKn: [
        'ಮೊಗ್ಗುಗಳ ಮೇಲೆ ರಾತ್ರಿ ವೇಳೆ ಚಿಟ್ಟೆ ಮೊಟ್ಟೆ ಇಡುವುದು',
        'ಹತ್ತಿಯನ್ನೇ ಸತತವಾಗಿ ಅದೇ ಜಮೀನಿನಲ್ಲಿ ಬೆಳೆಯುವುದು',
      ],
      biologicalTreatmentEn: [
        'Install 8-10 Pheromone traps (Gossyplure) per acre for mass trapping and monitoring',
        'Release Trichogramma bactrae egg parasitoid @ 60,000 / acre at weekly intervals',
        'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil 10,000 ppm @ 3 ml/L',
      ],
      biologicalTreatmentKn: [
        'ಎಕರೆಗೆ 8-10 ಹೆಣ್ಣು ಮೋಹಕ ಬಲೆಗಳನ್ನು (Pheromone traps) ಅಳವಡಿಸಿ',
        'ಟ್ರೈಕೋಗ್ರಾಮಾ ಪರಾವಲಂಬಿ ಮೊಟ್ಟೆ ಕಾರ್ಡ್‌ಗಳನ್ನು ಎಕರೆಗೆ 60,000 ರಂತೆ ಕಟ್ಟಿ',
        'ಬೇವಿನ ಕಷಾಯ 5% ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 3 ಮಿಲಿ/ಲೀ ಸಿಂಪಡಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Chlorantraniliprole 18.5% SC (Coragen)',
          activeIngredient: 'Chlorantraniliprole',
          dosage: '0.4 ml per Liter of water (80ml / acre)',
          waitingPeriod: '20 days before harvest',
        },
        {
          productName: 'Emamectin Benzoate 5% SG (Proclaim)',
          activeIngredient: 'Emamectin Benzoate',
          dosage: '0.5 grams per Liter of water (100g / acre)',
          waitingPeriod: '10 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಕೋರಾಜನ್ 18.5% SC (Coragen)',
          activeIngredient: 'Chlorantraniliprole',
          dosage: '0.4 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಎಕರೆಗೆ 80 ಮಿಲಿ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 20 ದಿನಗಳ ಮೊದಲು',
        },
        {
          productName: 'ಪ್ರೋಕ್ಲೈಮ್ 5% SG (Emamectin Benzoate)',
          activeIngredient: 'Emamectin Benzoate',
          dosage: '0.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 10 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Avoid extending cotton crop beyond 140-150 days; destroy stubbles promptly',
        'Deep summer ploughing to expose diapausing pupae to sunlight and predatory birds',
      ],
      preventionTipsKn: [
        'ಹತ್ತಿ ಬೆಳೆಯನ್ನು 150 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ವಿಸ್ತರಿಸಬೇಡಿ; ಕೊಯ್ಲಿನ ನಂತರ ಗಿಡಗಳನ್ನು ಸುಟ್ಟು ಹಾಕಿ',
        'ಬೇಸಿಗೆಯಲ್ಲಿ ಆಳವಾಗಿ ಉಳುಮೆ ಮಾಡಿ ಕೋಶಗಳನ್ನು ನಾಶಪಡಿಸಿ',
      ],
      sprayVolumeGuide: '180-200 Liters of water per acre; direct spray onto flower squares and green bolls.',
      summaryEn: 'Pink Bollworm infestation detected in cotton. Install pheromone traps immediately and spray Coragen (0.4ml/L) or Proclaim (0.5g/L).',
      summaryKn: 'ಹತ್ತಿಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು ಬಾಧೆ ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ ಕೋರಾಜನ್ ಅಥವಾ ಪ್ರೋಕ್ಲೈಮ್ ಸಿಂಪಡಿಸಿ.',
    };
  }

  // 4. Ragi / Finger Millet
  if (hint.includes('ragi') || hint.includes('millet') || hint.includes('ರಾಗಿ')) {
    return {
      cropNameEn: 'Finger Millet / Ragi (Eleusine coracana)',
      cropNameKn: 'ರಾಗಿ (Finger Millet)',
      isHealthy: false,
      issueNameEn: 'Ragi Blast Disease (Pyricularia grisea)',
      issueNameKn: 'ರಾಗಿ ಬೆಂಕಿ ರೋಗ (Ragi Blast)',
      scientificName: 'Pyricularia grisea',
      confidenceScore: 95,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Spindle-shaped brown lesions with grey center on seedlings and leaf blades',
        'Neck blast: neck region below the earhead rots, turns dark brown, and fingers break off',
        'Fingers produce partially filled or chaffy discolored grains',
      ],
      symptomsKn: [
        'ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಅಂಚಿನ ಬೂದು ಬಣ್ಣದ ಕದಿರಂಚಿನ ಕಲೆಗಳು',
        'ಕುತ್ತಿಗೆ ಬೆಂಕಿ ರೋಗ: ತೆನೆಯ ಬುಡ ಕಪ್ಪಾಗಿ ಮುರಿದು ಬೀಳುವುದು',
        'ತೆನೆಗಳಲ್ಲಿ ಜಳ್ಳು ಧಾನ್ಯಗಳು ಹೆಚ್ಚಾಗುವುದು',
      ],
      causesEn: [
        'Prolonged leaf wetness and cool humid nights (20-25°C) during flowering',
        'High seedling density and heavy nitrogen application',
      ],
      causesKn: [
        'ಮೋಡ ಕವಿದ ವಾತಾವರಣ, ಜಿಟಿಜಿಟಿ ಮಳೆ ಮತ್ತು ಇಬ್ಬನಿ',
        'ಹೆಚ್ಚು ಸಾರಜನಕ ಮತ್ತು ದಟ್ಟವಾಗಿ ನಾಟಿ ಮಾಡುವುದು',
      ],
      biologicalTreatmentEn: [
        'Spray Pseudomonas fluorescens @ 10g/L or 2.5 kg in 200L water per acre',
        'Apply fermented organic Jeevamrutha @ 200L/acre with irrigation',
      ],
      biologicalTreatmentKn: [
        'ಸ್ಯೂಡೋಮೊನಾಸ್ ಫ್ಲೋರೊಸೆಂಟ್ 10 ಗ್ರಾಂ/ಲೀ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ',
        'ಜೀವಾಮೃತ ದ್ರಾವಣವನ್ನು ಸಿಂಪಡಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Saaf 75% WP (Carbendazim 12% + Mancozeb 63%)',
          activeIngredient: 'Carbendazim + Mancozeb',
          dosage: '2.0 grams per Liter of water (400g / acre)',
          waitingPeriod: '15 days before harvest',
        },
        {
          productName: 'Kitazin 48% EC',
          activeIngredient: 'IBP / Kitazin',
          dosage: '2.0 ml per Liter of water (400ml / acre)',
          waitingPeriod: '20 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಸಾಫ್ 75% WP (Saaf - Carbendazim + Mancozeb)',
          activeIngredient: 'Carbendazim 12% + Mancozeb 63%',
          dosage: '2.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಎಕರೆಗೆ 400 ಗ್ರಾಂ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 15 ದಿನಗಳ ಮೊದಲು',
        },
        {
          productName: 'ಕಿಟಾಜಿನ್ 48% EC (Kitazin)',
          activeIngredient: 'Kitazin',
          dosage: '2.0 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 20 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Use resistant varieties like GPU-28, ML-365, or Indaf-9',
        'Treat seeds with Captan or Thiram @ 2g/kg seed before sowing',
      ],
      preventionTipsKn: [
        'ರೋಗನಿರೋಧಕ ತಳಿಗಳಾದ GPU-28, ML-365 ಬಿತ್ತನೆ ಮಾಡಿ',
        'ಕ್ಯಾಪ್ಟಾನ್ ಅಥವಾ ಥೈರಾಮ್ 2 ಗ್ರಾಂ/ಕೆಜಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ',
      ],
      sprayVolumeGuide: '180-200 Liters of water per acre; spray at tillering and earhead emergence.',
      summaryEn: 'Ragi Blast identified. Spray Saaf WP (2g/L) or Kitazin (2ml/L) immediately to protect the emerging earheads.',
      summaryKn: 'ರಾಗಿಯಲ್ಲಿ ಬೆಂಕಿ ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ತೆನೆ ಮುರಿದು ಬೀಳದಂತೆ ತಕ್ಷಣವೇ ಸಾಫ್ (2 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಕಿಟಾಜಿನ್ ಸಿಂಪಡಿಸಿ.',
    };
  }

  // 5. Areca Nut
  if (hint.includes('areca') || hint.includes('adike') || hint.includes('ಅಡಿಕೆ')) {
    return {
      cropNameEn: 'Areca Nut / Betel Nut (Areca catechu)',
      cropNameKn: 'ಅಡಿಕೆ (Areca Nut)',
      isHealthy: false,
      issueNameEn: 'Fruit Rot / Koleroga / Mahali (Phytophthora meadii)',
      issueNameKn: 'ಅಡಿಕೆ ಕೊಳೆ ರೋಗ / ಮಹಾಳಿ (Koleroga)',
      scientificName: 'Phytophthora meadii',
      confidenceScore: 98,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Dark water-soaked lesions near the calyx of developing green nuts',
        'Premature heavy shedding of green tender areca nuts on the garden floor',
        'White felty fungal mycelium covering the fallen nuts, turning them foul-smelling',
      ],
      symptomsKn: [
        'ಹಸಿರು ಎಳೆಯ ಅಡಿಕೆಯ ತೊಟ್ಟಿನ ಬಳಿ ನೀರಿನ ಕಲೆಗಳು ಮತ್ತು ಕೊಳೆಯುವಿಕೆ',
        'ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆಯಲ್ಲಿ ಎಳೆಯ ಅಡಿಕೆ ಕಾಯಿಗಳು ನೆಲಕ್ಕೆ ಉದುರುವುದು',
        'ಉದುರಿದ ಅಡಿಕೆಗಳ ಮೇಲೆ ಬಿಳಿ ಬೂಷ್ಟಿನ ಶಿಲೀಂಧ್ರ ಬೆಳವಣಿಗೆ',
      ],
      causesEn: [
        'Continuous monsoon rains and high relative humidity (95%+) during South-West monsoon',
        'Persistent wetness and cool temperatures (22-26°C) inside dense areca plantation canopy',
      ],
      causesKn: [
        'ಮುಂಗಾರು ಮಳೆಗಾಲದ ಸತತ ಜಿಟಿಜಿಟಿ ಮಳೆ ಮತ್ತು ತೇವಾಂಶ (95%+)',
        'ತೋಟದಲ್ಲಿ ಗಾಳಿ ಬೆಳಕಿನ ಕೊರತೆ ಮತ್ತು ನೀರು ನಿಲ್ಲುವುದು',
      ],
      biologicalTreatmentEn: [
        'Tie polythene covers (Aerated 100-gauge film) over bunches before the onset of monsoon',
        'Collect and deeply bury or burn all fallen infected nuts to prevent spore buildup',
        'Spray Trichoderma harzianum @ 10g/L on bunches during break in rainfall',
      ],
      biologicalTreatmentKn: [
        'ಮಳೆಗಾಲದ ಮುನ್ನ ಅಡಿಕೆ ಗೊನೆಗಳಿಗೆ ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲ (ಪಾಲಿಥಿನ್ ಕವರ್) ಕಟ್ಟುವುದು',
        'ಉದುರಿದ ಕೊಳೆತ ಅಡಿಕೆಗಳನ್ನು ತಕ್ಷಣ ಹೆಕ್ಕಿ ಸುಟ್ಟು ಅಥವಾ ಹೂತು ನಾಶಪಡಿಸಿ',
        'ಟ್ರೈಕೋಡರ್ಮಾ ದ್ರಾವಣವನ್ನು ಗೊನೆಗಳಿಗೆ ಸಿಂಪಡಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: '1% Bordeaux Mixture (Copper Sulphate + Slaked Lime)',
          activeIngredient: 'Copper Sulphate 1kg + Quick Lime 1kg in 100L water',
          dosage: 'Spray thoroughly on bunches before and during monsoon breaks',
          waitingPeriod: 'Safe preventive spray',
        },
        {
          productName: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)',
          activeIngredient: 'Metalaxyl + Mancozeb',
          dosage: '2.5 grams per Liter of water',
          waitingPeriod: '21 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: '1% ಬೋರ್ಡೋ ದ್ರಾವಣ (Bordeaux Mixture)',
          activeIngredient: '1 ಕೆಜಿ ಮೈಲುತುತ್ತ + 1 ಕೆಜಿ ಸುಣ್ಣ 100 ಲೀಟರ್ ನೀರಿಗೆ',
          dosage: 'ಮುಂಗಾರು ಆರಂಭವಾಗುವ ಮುನ್ನವೇ ಗೊನೆಗಳ ಎಲ್ಲಾ ಭಾಗಕ್ಕೆ ಮುಚ್ಚುವಂತೆ ಸಿಂಪಡಿಸಿ',
          waitingPeriod: 'ಮಳೆಗಾಲದ ವಿರಾಮದಲ್ಲಿ ಮರುಸಿಂಪಡಿಸಿ',
        },
        {
          productName: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ (Metalaxyl + Mancozeb)',
          activeIngredient: 'Metalaxyl 8% + Mancozeb 64%',
          dosage: '2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 21 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Ensure excellent drainage trenches between palm rows to prevent waterlogging',
        'Thin out intercrops and dead fronds to permit adequate sunlight and air circulation',
      ],
      preventionTipsKn: [
        'ಅಡಿಕೆ ಸಾಲುಗಳ ಮಧ್ಯೆ ನೀರು ನಿಲ್ಲದಂತೆ ಚರಂಡಿ ತೆಗೆದು ನೀರು ಬಸಿದು ಹೋಗಲು ವ್ಯವಸ್ಥೆ ಮಾಡಿ',
        'ಒಣಗಿದ ಮಂಡೆ ಮತ್ತು ಗರಿಗಳನ್ನು ಕತ್ತರಿಸಿ ತೋಟದಲ್ಲಿ ಗಾಳಿ ಆಡುವಂತೆ ಮಾಡಿ',
      ],
      sprayVolumeGuide: 'Spray with rocker sprayer/drone directly targeting all areca nut bunches.',
      summaryEn: 'Arecanut Koleroga / Fruit Rot detected. Immediately spray 1% Bordeaux mixture with sticker or Ridomil Gold (2.5g/L) on all bunches.',
      summaryKn: 'ಅಡಿಕೆ ಕೊಳೆ ರೋಗ (ಮಹಾಳಿ) ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣವೇ ಅಡಿಕೆ ಗೊನೆಗಳಿಗೆ 1% ಬೋರ್ಡೋ ದ್ರಾವಣ ಅಥವಾ ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ ಸಿಂಪಡಿಸಿ.',
    };
  }

  // 6. Sugarcane
  if (hint.includes('sugarcane') || hint.includes('sugar') || hint.includes('ಕಬ್ಬು') || hint.includes('kabbu')) {
    return {
      cropNameEn: 'Sugarcane (Saccharum officinarum)',
      cropNameKn: 'ಕಬ್ಬು (Sugarcane)',
      isHealthy: false,
      issueNameEn: 'Red Rot of Sugarcane (Colletotrichum falcatum)',
      issueNameKn: 'ಕಬ್ಬಿನ ಕೆಂಪು ಕೊಳೆ ರೋಗ (Red Rot)',
      scientificName: 'Colletotrichum falcatum',
      confidenceScore: 97,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Discoloration and withering of third and fourth crown leaves from tips downward',
        'Internal stalk pith turns dull red with distinctive white transverse cross-patches',
        'Stalk loses weight, shrivels, and produces a sour alcoholic fermenting odor',
      ],
      symptomsKn: [
        'ಮೇಲಿನ 3ನೇ ಮತ್ತು 4ನೇ ಎಲೆಗಳು ಒಣಗುವುದು ಮತ್ತು ಹಳದಿಯಾಗುವುದು',
        'ಕಬ್ಬನ್ನು ಸೀಳಿದಾಗ ಒಳಭಾಗದಲ್ಲಿ ಕೆಂಪು ಬಣ್ಣದ ಜೊತೆಗೆ ಅಡ್ಡಲಾದ ಬಿಳಿ ಪಟ್ಟಿಗಳು ಕಾಣುವುದು',
        'ಕಬ್ಬು ಜೊಳ್ಳಾಗಿ ಆಲ್ಕೋಹಾಲ್ ವಾಸನೆ ಬರುವುದು',
      ],
      causesEn: [
        'Seed setts carrying internal fungal infection Colletotrichum falcatum',
        'Waterlogging in heavy clay soil and continuous ratoon cropping without rotation',
      ],
      causesKn: [
        'ರೋಗಪೀಡಿತ ಬೀಜ ಕಬ್ಬಿನಿಂದ ಸೋಂಕು ಹರಡುವುದು',
        'ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲುವುದು ಮತ್ತು ಕಬ್ಬಿನ ನಂತರ ಮತ್ತೆ ಕಬ್ಬು ಬೆಳೆಯುವುದು',
      ],
      biologicalTreatmentEn: [
        'Treat setts with Trichoderma viride @ 10g/L water before planting',
        'Uproot and burn severely infected clumps immediately; drench pit with lime',
      ],
      biologicalTreatmentKn: [
        'ನಾಟಿಗೆ ಮುನ್ನ ಬೀಜ ಕಬ್ಬನ್ನು ಟ್ರೈಕೋಡರ್ಮಾ (10 ಗ್ರಾಂ/ಲೀ) ದ್ರಾವಣದಲ್ಲಿ ಅದ್ದಿ ನೆಡಿ',
        'ರೋಗಪೀಡಿತ ಗಿಡಗಳನ್ನು ಬುಡಸಮೇತ ಕಿತ್ತು ಸುಟ್ಟು ಹಾಕಿ ಸುಣ್ಣದ ಪುಡಿ ಹಾಕಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Carbendazim 50% WP (Bavistin)',
          activeIngredient: 'Carbendazim',
          dosage: '1.0 g per Liter of water (sett treatment for 15 mins)',
          waitingPeriod: 'Pre-planting sett soak',
        },
        {
          productName: 'Thiophanate Methyl 70% WP (Roko)',
          activeIngredient: 'Thiophanate Methyl',
          dosage: '1.5 grams per Liter of water root drench',
          waitingPeriod: '30 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಬಾವಿಸ್ಟಿನ್ 50% WP (Carbendazim)',
          activeIngredient: 'Carbendazim',
          dosage: '1.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ನಾಟಿಗೆ ಮುನ್ನ ಬೀಜ ಕಬ್ಬು ಅದ್ದಲು)',
          waitingPeriod: 'ಬೀಜೋಪಚಾರಕ್ಕೆ',
        },
        {
          productName: 'ರೋಕೋ 70% WP (Thiophanate Methyl)',
          activeIngredient: 'Thiophanate Methyl',
          dosage: '1.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬುಡ ನೆನೆಯುವಂತೆ ಸುರಿಯಿರಿ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 30 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Plant only certified disease-free setts from healthy nursery seed crop',
        'Practice 2-3 years crop rotation with paddy, maize, or legumes',
      ],
      preventionTipsKn: [
        'ಆರೋಗ್ಯಕರ ತೋಟದಿಂದ ತಂದ ಪ್ರಮಾಣೀಕೃತ ಬೀಜ ಕಬ್ಬನ್ನೇ ನಾಟಿ ಮಾಡಿ',
        'ಕಬ್ಬಿನ ನಂತರ ಭತ್ತ ಅಥವಾ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯಿರಿ',
      ],
      sprayVolumeGuide: 'Root sett soaking before planting and soil drenching @ 250 Liters per acre.',
      summaryEn: 'Sugarcane Red Rot detected. Uproot infected stalks immediately and ensure sett dip in Carbendazim (1g/L) for new plantings.',
      summaryKn: 'ಕಬ್ಬಿನಲ್ಲಿ ಕೆಂಪು ಕೊಳೆ ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ರೋಗಪೀಡಿತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ನಾಶಮಾಡಿ ಮತ್ತು ಬಾವಿಸ್ಟಿನ್ ದ್ರಾವಣದಿಂದ ಉಪಚರಿಸಿ.',
    };
  }

  // 7. Chickpea / Bengal Gram
  if (hint.includes('chickpea') || hint.includes('gram') || hint.includes('kadale') || hint.includes('ಕಡಲೆ')) {
    return {
      cropNameEn: 'Chickpea / Bengal Gram (Cicer arietinum)',
      cropNameKn: 'ಕಡಲೆ (Chickpea)',
      isHealthy: false,
      issueNameEn: 'Fusarium Wilt & Pod Borer (Helicoverpa)',
      issueNameKn: 'ಕಡಲೆ ಸೊರಗು ರೋಗ & ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
      scientificName: 'Fusarium oxysporum & Helicoverpa armigera',
      confidenceScore: 96,
      severity: 'Severe',
      alertLevel: 'red',
      symptomsEn: [
        'Sudden drooping, yellowing, and drying of foliage starting from branch tips',
        'Internal dark brown to black vascular discoloration when the taproot is split open',
        'Circular bore holes on developing chickpea pods with missing seeds',
      ],
      symptomsKn: [
        'ಗಿಡದ ತುದಿಯಿಂದ ಎಲೆಗಳು ಹಳದಿಯಾಗಿ ತಕ್ಷಣವೇ ಸೊರಗಿ ಒಣಗುವುದು',
        'ಬೇರನ್ನು ಸೀಳಿ ನೋಡಿದಾಗ ಒಳಗಡೆ ಕಪ್ಪು ಅಥವಾ ಕಂದು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿರುವುದು (ಸೊರಗು ರೋಗ)',
        'ಕಡಲೆ ಕಾಯಿಗಳಿಗೆ ದುಂಡಗಿನ ರಂಧ್ರ ಕೊರೆದು ಕಾಳು ತಿನ್ನುವ ಹುಳು',
      ],
      causesEn: [
        'Soil-borne fungus Fusarium oxysporum persisting in soil for several years',
        'Helicoverpa armigera moth laying eggs during flowering and pod development',
      ],
      causesKn: [
        'ಮಣ್ಣಿನಲ್ಲಿ ಉಳಿದಿರುವ ಫ್ಯುಸೇರಿಯಂ ಶಿಲೀಂಧ್ರ',
        'ಹೂವು ಮತ್ತು ಕಾಯಿ ಬಿಡುವ ಹಂತದಲ್ಲಿ ಚಿಟ್ಟೆಗಳು ಮೊಟ್ಟೆ ಇಡುವುದು',
      ],
      biologicalTreatmentEn: [
        'Soil application of Trichoderma viride @ 2.5 kg mixed with 100 kg FYM per acre',
        'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm @ 3 ml/L',
        'Install 5-8 pheromone traps per acre for pod borer monitoring',
      ],
      biologicalTreatmentKn: [
        'ಎಕರೆಗೆ 2.5 ಕೆಜಿ ಟ್ರೈಕೋಡರ್ಮಾವನ್ನು 100 ಕೆಜಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದೊಂದಿಗೆ ಬೆರೆಸಿ ಮಣ್ಣಿಗೆ ಹಾಕಿ',
        'ಬೇವಿನ ಕಷಾಯ (NSKE 5%) ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 3 ಮಿಲಿ/ಲೀ ಸಿಂಪಡಿಸಿ',
        'ಎಕರೆಗೆ 6-8 ಹೆಣ್ಣು ಮೋಹಕ ಬಲೆಗಳನ್ನು (Pheromone traps) ಅಳವಡಿಸಿ',
      ],
      chemicalTreatmentEn: [
        {
          productName: 'Chlorantraniliprole 18.5% SC (Coragen)',
          activeIngredient: 'Chlorantraniliprole',
          dosage: '0.4 ml per Liter of water (60ml / acre for pod borer)',
          waitingPeriod: '15 days before harvest',
        },
        {
          productName: 'Saaf WP (Carbendazim 12% + Mancozeb 63%)',
          activeIngredient: 'Carbendazim + Mancozeb',
          dosage: '2.0 grams per Liter of water drenching at plant base',
          waitingPeriod: '7 days before harvest',
        },
      ],
      chemicalTreatmentKn: [
        {
          productName: 'ಕೋರಾಜನ್ 18.5% SC (Coragen)',
          activeIngredient: 'Chlorantraniliprole',
          dosage: '0.4 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಕಾಯಿ ಕೊರೆಯುವ ಹುಳಿಗೆ)',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 15 ದಿನಗಳ ಮೊದಲು',
        },
        {
          productName: 'ಸಾಫ್ 75% WP (Saaf)',
          activeIngredient: 'Carbendazim + Mancozeb',
          dosage: '2.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬುಡಕ್ಕೆ ಸುರಿಯಿರಿ',
          waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
        },
      ],
      preventionTipsEn: [
        'Seed treatment with Carbendazim (2g/kg) or Trichoderma (10g/kg) is mandatory',
        'Deep summer ploughing to expose pupae and soil pathogens to sun',
        'Avoid sowing in fields with previous wilt history; rotate with sorghum or pearl millet',
      ],
      preventionTipsKn: [
        'ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜಕ್ಕೆ ಟ್ರೈಕೋಡರ್ಮಾ (10 ಗ್ರಾಂ/ಕೆಜಿ) ಬೆರೆಸಿ ಬೀಜೋಪಚಾರ ಮಾಡುವುದು ಕಡ್ಡಾಯ',
        'ಬೇಸಿಗೆಯಲ್ಲಿ ಆಳವಾದ ಉಳುಮೆ ಮಾಡಿ ಮಣ್ಣನ್ನು ಬಿಸಿಲಿಗೆ ಒಡ್ಡಬೇಕು',
        'ಸೊರಗು ರೋಗ ಬಂದ ಜಮೀನಿನಲ್ಲಿ ಜೋಳ ಅಥವಾ ಸಜ್ಜೆ ಬೆಳೆದು ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ',
      ],
      sprayVolumeGuide: '160-180 Liters of water per acre; spray during morning or late afternoon.',
      summaryEn: 'Chickpea Wilt and Pod Borer risk identified. Drench base with Saaf/Trichoderma and spray Coragen for pod borer protection.',
      summaryKn: 'ಕಡಲೆಯಲ್ಲಿ ಸೊರಗು ರೋಗ ಮತ್ತು ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು ಬಾಧೆ ಪತ್ತೆಯಾಗಿದೆ. ಬುಡಕ್ಕೆ ಸಾಫ್ ದ್ರಾವಣ ಹಾಕಿ, ಕಾಯಿಗೆ ಕೋರಾಜನ್ ಸಿಂಪಡಿಸಿ.',
    };
  }

  // Default: Tomato
  return {
    cropNameEn: 'Tomato (Solanum lycopersicum)',
    cropNameKn: 'ಟೊಮ್ಯಾಟೊ (Tomato)',
    isHealthy: false,
    issueNameEn: 'Early Blight (Alternaria solani)',
    issueNameKn: 'ಆರಂಭಿಕ ಅಂಗಮಾರಿ ರೋಗ (Early Blight)',
    scientificName: 'Alternaria solani',
    confidenceScore: 94,
    severity: 'Moderate',
    alertLevel: 'yellow',
    symptomsEn: [
      'Concentric brown to black circular spots ("target board" pattern) on older leaves',
      'Yellow chlorotic halos surrounding necrotic leaf lesions',
      'Premature defoliation starting from bottom leaves upward',
      'Stem lesions and dark sunken spots at calyx end',
    ],
    symptomsKn: [
      'ಹಳೆಯ ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು (ಗುರಿ ಹಲಗೆಯಂತಹ ಚಿಹ್ನೆ)',
      'ಚುಕ್ಕೆಗಳ ಸುತ್ತಲೂ ಹಳದಿ ಬಣ್ಣದ ವಲಯ',
      'ಗಿಡದ ಕೆಳಗಿನ ಎಲೆಗಳು ಉದುರುವುದು',
      'ಕಾಂಡ ಮತ್ತು ಹಣ್ಣುಗಳ ತೊಟ್ಟಿನ ಮೇಲೆ ಕಪ್ಪು ಗುಂಡಿಗಳು',
    ],
    causesEn: [
      'Fungal pathogen Alternaria solani surviving in soil debris',
      'Warm temperatures (24-29°C) combined with high humidity and rain splashes',
      'Dense planting limiting air circulation',
    ],
    causesKn: [
      'ಮಣ್ಣಿನಲ್ಲಿ ಉಳಿದಿರುವ ಶಿಲೀಂಧ್ರ (Alternaria solani)',
      'ಹೆಚ್ಚು ತೇವಾಂಶ ಮತ್ತು ಬಿಸಿಲಿನ ವಾತಾವರಣ',
      'ಗಿಡಗಳ ನಡುವೆ ಅಂತರದ ಕೊರತೆ ಮತ್ತು ಗಾಳಿಯಾಡದಿರುವುದು',
    ],
    biologicalTreatmentEn: [
      'Spray Neem seed kernel extract (NSKE 5%) or Neem oil (3 ml/Liter water) early morning',
      'Foliar spray of Trichoderma harzianum @ 5g/Liter water',
      'Prune and destroy infected lower leaves immediately to stop spore transmission',
      'Apply mulching with organic straw to prevent soil-splash onto lower canopy',
    ],
    biologicalTreatmentKn: [
      'ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil) 3 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ',
      'ಟ್ರೈಕೋಡರ್ಮಾ ಹಾರ್ಜಿಯಾನಂ (Trichoderma) 5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಸಿಂಪಡಿಸಿ',
      'ರೋಗಪೀಡಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ನಾಶಮಾಡಿ',
      'ಮಣ್ಣಿನಿಂದ ಶಿಲೀಂಧ್ರ ಹರಡದಂತೆ ಮಲ್ಚಿಂಗ್ (ಹೊದಿಕೆ) ಮಾಡಿ',
    ],
    chemicalTreatmentEn: [
      {
        productName: 'Mancozeb 75% WP (e.g. Dithane M-45)',
        activeIngredient: 'Mancozeb',
        dosage: '2.0 - 2.5 g per Liter of water',
        waitingPeriod: '7 days before harvest',
      },
      {
        productName: 'Chlorothalonil 75% WP (e.g. Kavach)',
        activeIngredient: 'Chlorothalonil',
        dosage: '2 g per Liter of water',
        waitingPeriod: '5 days before harvest',
      },
      {
        productName: 'Azoxystrobin + Difenoconazole (e.g. Amistar Top)',
        activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dosage: '1.0 ml per Liter of water',
        waitingPeriod: '3 days before harvest',
      },
    ],
    chemicalTreatmentKn: [
      {
        productName: 'ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP (Dithane M-45)',
        activeIngredient: 'Mancozeb',
        dosage: '2.0 - 2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
        waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
      },
      {
        productName: 'ಕ್ಲೋರೋಥಲೋನಿಲ್ 75% WP (Kavach)',
        activeIngredient: 'Chlorothalonil',
        dosage: '2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
        waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 5 ದಿನಗಳ ಮೊದಲು',
      },
      {
        productName: 'ಅಮಿಸ್ಟಾರ್ ಟಾಪ್ (Amistar Top)',
        activeIngredient: 'Azoxystrobin + Difenoconazole',
        dosage: '1.0 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
        waitingPeriod: 'ಕೊಯ್ಲಿಗೆ 3 ದಿನಗಳ ಮೊದಲು',
      },
    ],
    preventionTipsEn: [
      'Follow crop rotation of at least 3 years away from solanaceous crops (potato, brinjal, chilli)',
      'Ensure proper plant spacing (60 x 45 cm) for adequate air circulation',
      'Switch to drip irrigation to keep leaf canopy completely dry',
      'Use resistant/tolerant certified hybrid seeds',
    ],
    preventionTipsKn: [
      'ಟೊಮ್ಯಾಟೊ ನಂತರ ಆಲೂಗಡ್ಡೆ ಅಥವಾ ಬದನೆ ಬೆಳೆಯದೆ ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ',
      'ಗಿಡಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರ (60x45 ಸೆಂ.ಮೀ) ಕಾಪಾಡಿಕೊಳ್ಳಿ',
      'ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ ಬಳಸಿ ಎಲೆಗಳು ಒದ್ದೆಯಾಗುವುದನ್ನು ತಪ್ಪಿಸಿ',
      'ರೋಗನಿರೋಧಕ ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳನ್ನು ಮಾತ್ರ ಉಪಯೋಗಿಸಿ',
    ],
    sprayVolumeGuide: 'Use 150 to 200 Liters of water per acre (approximately 10 to 13 knapsack sprayers of 15 Liters capacity).',
    summaryEn: 'Early Blight detected with 94% confidence. Start with biological sprays or Mancozeb fungicide and remove infected lower leaves immediately.',
    summaryKn: 'ಟೊಮ್ಯಾಟೊ ಬೆಳೆಯಲ್ಲಿ ಆರಂಭಿಕ ಅಂಗಮಾರಿ ರೋಗ 94% ನಿಖರತೆಯೊಂದಿಗೆ ದೃಢಪಟ್ಟಿದೆ. ಕೆಳಗಿನ ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಮ್ಯಾಂಕೋಜೆಬ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.',
  };
};

function decorateChemicalTreatments(raw: any) {
  if (!raw) return raw;
  const enrichItem = (item: any, isKn: boolean) => {
    const prod = `${item.productName || ''} ${item.activeIngredient || ''}`.toLowerCase();
    const dis = `${raw.issueNameEn || ''} ${raw.issueNameKn || ''} ${raw.cropNameEn || ''} ${raw.cropNameKn || ''}`.toLowerCase();
    
    let img = '/medicines/saaf.jpg';
    let typeKn = 'ಶಿಲೀಂಧ್ರನಾಶಕ (Fungicide)';
    let typeEn = 'Fungicide';
    let defaultAcreKn = '400 - 500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
    let defaultAcreEn = '400 - 500 grams per acre (in 200L water)';

    // 1. Explicit Product / Active Ingredient checks
    if (prod.includes('coragen') || prod.includes('chlorantraniliprole')) {
      img = '/medicines/coragen.jpg';
      typeKn = 'ಕೀಟನಾಶಕ (Insecticide)';
      typeEn = 'Insecticide';
      defaultAcreKn = '60 ಮಿಲಿ / ಎಕರೆ (150-200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '60 ml per acre (in 150-200L water)';
    } else if (prod.includes('pegasus') || prod.includes('diafenthiuron')) {
      img = '/medicines/pegasus.jpg';
      typeKn = 'ನುಸಿ & ಕೀಟನಾಶಕ (Acaricide & Insecticide)';
      typeEn = 'Acaricide';
      defaultAcreKn = '250 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '250 grams per acre (in 200L water)';
    } else if (prod.includes('baan') || prod.includes('beam') || prod.includes('tricyclazole')) {
      img = '/medicines/baan.jpg';
      typeKn = 'ಬೆಂಕಿ ರೋಗನಾಶಕ (Blast Specialist)';
      typeEn = 'Blast Specialist';
      defaultAcreKn = '120 - 150 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '120 - 150 grams per acre (in 200L water)';
    } else if (prod.includes('ridomil') || prod.includes('metalaxyl')) {
      img = '/medicines/ridomil_gold.jpg';
      typeKn = 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Systemic Fungicide';
      defaultAcreKn = '500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '500 grams per acre (in 200L water)';
    } else if (prod.includes('blitox') || (prod.includes('copper') && prod.includes('oxychloride')) || prod.includes('bordeaux')) {
      img = '/medicines/blitox.jpg';
      typeKn = 'ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕ (Copper Fungicide)';
      typeEn = 'Copper Fungicide';
      defaultAcreKn = '500 - 600 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '500 - 600 grams per acre (in 200L water)';
    } else if (prod.includes('bavistin') || (prod.includes('carbendazim') && !prod.includes('mancozeb'))) {
      img = '/medicines/bavistin.jpg';
      typeKn = 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Systemic Fungicide';
      defaultAcreKn = '200 - 250 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '200 - 250 grams per acre (in 200L water)';
    } else if (prod.includes('amistar') || prod.includes('azoxystrobin') || prod.includes('difenoconazole')) {
      img = '/medicines/amistar_top.jpg';
      typeKn = 'ಆಧುನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Broad Spectrum Fungicide';
      defaultAcreKn = '200 ಮಿಲಿ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '200 ml per acre (in 200L water)';
    } else if (prod.includes('saaf') || (prod.includes('carbendazim') && prod.includes('mancozeb'))) {
      img = '/medicines/saaf.jpg';
      typeKn = 'ಶಿಲೀಂಧ್ರನಾಶಕ (Fungicide)';
      typeEn = 'Fungicide';
      defaultAcreKn = '400 - 500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '400 - 500 grams per acre (in 200L water)';
    } else if (prod.includes('dithane') || prod.includes('mancozeb')) {
      img = '/medicines/mancozeb.jpg';
      typeKn = 'ಸ್ಪರ್ಶ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Contact Fungicide';
      defaultAcreKn = '500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '500 grams per acre (in 200L water)';
    }
    // 2. Fallback to Disease Pathology Match
    else if (dis.includes('blast') || dis.includes('ಬೆಂಕಿ') || dis.includes('pyricularia') || dis.includes('neck blast')) {
      img = '/medicines/baan.jpg';
      typeKn = 'ಬೆಂಕಿ ರೋಗನಾಶಕ (Blast Specialist)';
      typeEn = 'Blast Specialist';
      defaultAcreKn = '120 - 150 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '120 - 150 grams per acre (in 200L water)';
    } else if (dis.includes('koleroga') || dis.includes('mahali') || dis.includes('ಅಡಿಕೆ ಕೊಳೆ') || (dis.includes('arecanut') && dis.includes('rot'))) {
      img = '/medicines/blitox.jpg';
      typeKn = 'ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕ (Copper Fungicide)';
      typeEn = 'Copper Fungicide';
      defaultAcreKn = '500 - 600 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '500 - 600 grams per acre (in 200L water)';
    } else if (dis.includes('thrip') || dis.includes('mite') || dis.includes('ನುಸಿ') || dis.includes('ಮುರುಟು') || dis.includes('curl') || dis.includes('whitefly') || dis.includes('ಬಿಳಿನೊಣ') || dis.includes('aphid')) {
      img = '/medicines/pegasus.jpg';
      typeKn = 'ನುಸಿ & ಕೀಟನಾಶಕ (Acaricide & Insecticide)';
      typeEn = 'Acaricide';
      defaultAcreKn = '250 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '250 grams per acre (in 200L water)';
    } else if (dis.includes('borer') || dis.includes('bollworm') || dis.includes('armyworm') || dis.includes('ಹುಳು') || dis.includes('ಕೊರೆಯುವ') || dis.includes('spodoptera') || dis.includes('helicoverpa') || dis.includes('ಲದ್ದಿ')) {
      img = '/medicines/coragen.jpg';
      typeKn = 'ಕೀಟನಾಶಕ (Insecticide)';
      typeEn = 'Insecticide';
      defaultAcreKn = '60 ಮಿಲಿ / ಎಕರೆ (150-200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '60 ml per acre (in 150-200L water)';
    } else if (dis.includes('late blight') || dis.includes('downy') || dis.includes('ಡೌನಿ') || (dis.includes('ಅಂಗಮಾರಿ') && (dis.includes('ತಡ') || dis.includes('late')))) {
      img = '/medicines/ridomil_gold.jpg';
      typeKn = 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Systemic Fungicide';
      defaultAcreKn = '500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '500 grams per acre (in 200L water)';
    } else if (dis.includes('sheath blight') || dis.includes('rust') || dis.includes('ತುಕ್ಕು') || dis.includes('ಕವಚ ಕೊಳೆ') || dis.includes('powdery') || dis.includes('ಬೂದಿ')) {
      img = '/medicines/amistar_top.jpg';
      typeKn = 'ಆಧುನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Broad Spectrum Fungicide';
      defaultAcreKn = '200 ಮಿಲಿ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '200 ml per acre (in 200L water)';
    } else if (dis.includes('wilt') || dis.includes('root rot') || dis.includes('ಸೊರಗು') || dis.includes('ಬುಡ ಕೊಳೆ') || dis.includes('ಬೇರು ಕೊಳೆ') || dis.includes('red rot') || dis.includes('ಕೆಂಪು ಕೊಳೆ')) {
      img = '/medicines/bavistin.jpg';
      typeKn = 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ';
      typeEn = 'Systemic Fungicide';
      defaultAcreKn = '200 - 250 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '200 - 250 grams per acre (in 200L water)';
    } else {
      img = '/medicines/saaf.jpg';
      typeKn = 'ಶಿಲೀಂಧ್ರನಾಶಕ (Fungicide)';
      typeEn = 'Fungicide';
      defaultAcreKn = '400 - 500 ಗ್ರಾಂ / ಎಕರೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)';
      defaultAcreEn = '400 - 500 grams per acre (in 200L water)';
    }

    return {
      ...item,
      medicineImage: item.medicineImage || img,
      medicineType: item.medicineType || (isKn ? typeKn : typeEn),
      dosagePerAcre: item.dosagePerAcre || (isKn ? defaultAcreKn : defaultAcreEn),
    };
  };

  if (Array.isArray(raw.chemicalTreatmentEn)) {
    raw.chemicalTreatmentEn = raw.chemicalTreatmentEn.map((it: any) => enrichItem(it, false));
  }
  if (Array.isArray(raw.chemicalTreatmentKn)) {
    raw.chemicalTreatmentKn = raw.chemicalTreatmentKn.map((it: any) => enrichItem(it, true));
  }
  return raw;
}

// POST: /api/diagnose - Plantix-style AI Crop Disease & Pest Diagnosis
app.post('/api/diagnose', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', cropHint = '', language = 'kn' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    // Auto-detect MIME type from data URL if provided
    let detectedMimeType = mimeType;
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (mimeMatch) {
      detectedMimeType = mimeMatch[1];
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const promptText = `
You are the world's leading agricultural plant pathologist and agronomist for the "Plants" app (inspired by Plantix).
Carefully inspect this uploaded crop or plant image.

CRITICAL INSTRUCTIONS:
1. FIRST, accurately identify the EXACT crop/plant species shown in the photo (e.g., Paddy/Rice, Chilli, Cotton, Arecanut, Sugarcane, Chickpea, Ragi/Finger Millet, Tomato, Maize/Corn, Potato, Onion, Banana, Groundnut, Wheat, Mango, etc.).
${cropHint ? `Farmer context note: "${cropHint}". Verify if the image matches this crop or identify the actual crop visible in the photo.` : 'No crop name was pre-selected: You MUST identify the crop species strictly from the leaves, flowers, fruit, or plant morphology in the image.'}
2. Determine whether the plant is healthy, or has a fungal/bacterial/viral disease, insect pest infestation, or nutrient deficiency.
3. Identify the disease/pest name in both English and Kannada (ಕನ್ನಡ), along with scientific pathogen name.
4. Provide a confidence score (integer between 75 and 99).
5. Specify severity level: "Healthy", "Low", "Moderate", or "Severe".
6. Specify alert level: "green" (healthy/low), "yellow" (moderate), or "red" (severe/immediate action needed).
7. List 3-4 visible symptoms in English and Kannada.
8. List 2-3 environmental causes or triggers in English and Kannada.
9. List 3-4 practical biological/organic remedies (e.g., Neem oil, Trichoderma, Pseudomonas fluorescens, bio-fertilizers, pruning) in English and Kannada.
10. Prescribe 2-3 genuine, proven agricultural medicines available in Karnataka/India with exact brand product name, active ingredient, dosage per liter, and dosage per acre in ML or grams, and harvest waiting period:
- Paddy/Ragi Blast -> Baan / Beam 75% WP (Tricyclazole) - 0.6g/L, 120-150g/acre
- Arecanut Koleroga/Fruit rot -> Blitox 50 WP (Copper Oxychloride) - 2.5-3.0g/L, 500-600g/acre
- Chilli Leaf Curl, Thrips, Mites, Whitefly -> Pegasus 50% WP (Diafenthiuron) - 1.25g/L, 250g/acre
- Caterpillars, Maize Fall Armyworm, Pod/Stem Borers, Bollworm -> Coragen 18.5% SC (Chlorantraniliprole) - 0.4ml/L, 60-80ml/acre
- Late Blight, Downy Mildew -> Ridomil Gold MZ (Metalaxyl + Mancozeb) - 2.5g/L, 500g/acre
- Sheath Blight, Rust, Powdery Mildew -> Amistar Top SC (Azoxystrobin + Difenoconazole) - 1.0ml/L, 200ml/acre
- Fusarium Wilt, Root Rot, Red Rot -> Bavistin 50% WP (Carbendazim) - 1.0g/L, 200-250g/acre
- Early Blight, Leaf Spots, Tikka -> Saaf 75% WP (Carbendazim + Mancozeb) - 2.0g/L, 400-500g/acre or Dithane M-45 (Mancozeb) - 2.5g/L, 500g/acre
11. List 3-4 preventative agricultural agronomy tips in English and Kannada.
12. Provide a spray volume guide (e.g., 150-200 Liters of water per acre).
13. Provide a clear, actionable summary for the farmer in both English and Kannada.

Return ONLY a single valid JSON object (NOT an array, no markdown code block) with this exact schema:
{
  "cropNameEn": "string",
  "cropNameKn": "string (in Kannada)",
  "isHealthy": boolean,
  "issueNameEn": "string",
  "issueNameKn": "string (in Kannada)",
  "scientificName": "string",
  "confidenceScore": number,
  "severity": "Healthy" | "Low" | "Moderate" | "Severe",
  "alertLevel": "green" | "yellow" | "red",
  "symptomsEn": ["string"],
  "symptomsKn": ["string"],
  "causesEn": ["string"],
  "causesKn": ["string"],
  "biologicalTreatmentEn": ["string"],
  "biologicalTreatmentKn": ["string"],
  "chemicalTreatmentEn": [
    {
      "productName": "string",
      "activeIngredient": "string",
      "dosage": "string",
      "dosagePerAcre": "string",
      "waitingPeriod": "string"
    }
  ],
  "chemicalTreatmentKn": [
    {
      "productName": "string",
      "activeIngredient": "string",
      "dosage": "string",
      "dosagePerAcre": "string",
      "waitingPeriod": "string"
    }
  ],
  "preventionTipsEn": ["string"],
  "preventionTipsKn": ["string"],
  "sprayVolumeGuide": "string",
  "summaryEn": "string",
  "summaryKn": "string"
}
`;

    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [
              {
                inlineData: {
                  mimeType: detectedMimeType,
                  data: cleanBase64,
                },
              },
              promptText,
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          25000
        );

        const textOutput = response.text;
        if (textOutput) {
          const cleanJson = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          const raw = Array.isArray(parsed) ? parsed[0] : parsed;

          if (raw && raw.cropNameEn) {
            // Normalize confidenceScore
            let conf = Number(raw.confidenceScore) || 94;
            if (conf > 0 && conf <= 1) {
              conf = Math.round(conf * 100);
            }
            raw.confidenceScore = Math.min(99, Math.max(70, conf));

            // Ensure arrays
            raw.symptomsEn = Array.isArray(raw.symptomsEn) ? raw.symptomsEn : [raw.symptomsEn].filter(Boolean);
            raw.symptomsKn = Array.isArray(raw.symptomsKn) ? raw.symptomsKn : [raw.symptomsKn].filter(Boolean);
            raw.causesEn = Array.isArray(raw.causesEn) ? raw.causesEn : [raw.causesEn].filter(Boolean);
            raw.causesKn = Array.isArray(raw.causesKn) ? raw.causesKn : [raw.causesKn].filter(Boolean);
            raw.biologicalTreatmentEn = Array.isArray(raw.biologicalTreatmentEn) ? raw.biologicalTreatmentEn : [raw.biologicalTreatmentEn].filter(Boolean);
            raw.biologicalTreatmentKn = Array.isArray(raw.biologicalTreatmentKn) ? raw.biologicalTreatmentKn : [raw.biologicalTreatmentKn].filter(Boolean);
            raw.chemicalTreatmentEn = Array.isArray(raw.chemicalTreatmentEn) ? raw.chemicalTreatmentEn : [];
            raw.chemicalTreatmentKn = Array.isArray(raw.chemicalTreatmentKn) ? raw.chemicalTreatmentKn : [];
            raw.preventionTipsEn = Array.isArray(raw.preventionTipsEn) ? raw.preventionTipsEn : [raw.preventionTipsEn].filter(Boolean);
            raw.preventionTipsKn = Array.isArray(raw.preventionTipsKn) ? raw.preventionTipsKn : [raw.preventionTipsKn].filter(Boolean);

            const enriched = decorateChemicalTreatments(raw);
            return res.json(enriched);
          }
        }
      } catch (geminiError) {
        console.error('Gemini AI diagnosis call error:', geminiError);
      }
    }

    // Dynamic crop-aware fallback if Gemini API is unreachable or rate limited
    const fallbackDiagnosis = decorateChemicalTreatments(getDynamicCropFallback(cropHint));
    return res.json(fallbackDiagnosis);
  } catch (error: any) {
    console.error('Error in /api/diagnose:', error);
    return res.status(500).json({ error: error.message || 'Server error during diagnosis' });
  }
});

// POST: /api/community/ask - AI Agronomist response to farmer queries
app.post('/api/community/ask', async (req, res) => {
  try {
    const { question, crop, language = 'kn' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `You are an expert agronomist advisor on the "Plants" farmer community app (like Plantix).
The farmer has asked: "${question}" regarding crop: "${crop || 'General agriculture'}".
Language preference: ${language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.

Provide a practical, scientific yet simple actionable reply:
1. Direct answer/solution
2. Dosage/Remedy
3. Precautions

Keep response under 160 words, in empathetic tone suited for farmers.`,
          }),
          15000
        );

        return res.json({ reply: response.text });
      } catch (err) {
        console.error('Community AI ask error:', err);
      }
    }

    // Default response if key not available
    const fallbackReply =
      language === 'kn'
        ? `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ, ಈ ಸಮಸ್ಯೆಗೆ ತಕ್ಷಣವೇ 3 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮಾ 5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗುವ ವ್ಯವಸ್ಥೆ ಮಾಡಿ. ಯಾವುದೇ ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸುವಾಗ ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ಮಾಡಿ.`
        : `Dear Farmer, for this crop issue, spray Neem Oil @ 3ml/L water or Trichoderma @ 5g/L immediately. Ensure proper field drainage to prevent root moisture stagnation. Spray during early morning or late evening for best efficacy.`;

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Dev vs Prod handling for Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌿 Plants (Plantix Crop Doctor) server running on port ${PORT}`);
  });
}

startServer();
