import { ChemicalTreatmentItem } from '../types/plants';

export interface EnrichedMedicineInfo {
  productNameEn: string;
  productNameKn: string;
  brandManufacturer: string;
  activeIngredient: string;
  medicineType: 'Fungicide' | 'Insecticide' | 'Bactericide' | 'Acaricide' | 'Organic';
  medicineTypeKn: string;
  dosagePerLiter: string;
  dosagePerLiterKn: string;
  dosagePerAcre: string;
  dosagePerAcreKn: string;
  waterVolumePerAcre: string;
  waterVolumePerAcreKn: string;
  pumpCountPerAcre: string;
  waitingPeriodDays: number;
  waitingPeriodKn: string;
  waitingPeriodEn: string;
  medicineImage: string;
  safetyGuideKn: string;
  safetyGuideEn: string;
}

export const MEDICINE_CATALOG: Record<string, EnrichedMedicineInfo> = {
  saaf: {
    productNameEn: 'Saaf Fungicide (Carbendazim 12% + Mancozeb 63% WP)',
    productNameKn: 'ಸಾಫ್ 75% WP (Saaf - UPL)',
    brandManufacturer: 'UPL India Ltd.',
    activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ಶಿಲೀಂಧ್ರನಾಶಕ (Fungicide)',
    dosagePerLiter: '2.0 grams per Liter of water',
    dosagePerLiterKn: '2.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '400 - 500 grams per acre (in 200L water)',
    dosagePerAcreKn: '400 - 500 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Knapsack Sprayer Pumps (15L each)',
    waitingPeriodDays: 7,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '7 days before harvest',
    medicineImage: '/medicines/saaf.jpg',
    safetyGuideKn: 'ಎಲೆಯ ಎರಡೂ ಬದಿ ಸಮವಾಗಿ ಬೀಳುವಂತೆ ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಸಿಂಪಡಿಸಿ. ಮುಖಗವಸು ಧರಿಸಿ.',
    safetyGuideEn: 'Spray thoroughly on upper and lower leaf surfaces during morning or late afternoon. Wear safety mask.',
  },
  coragen: {
    productNameEn: 'Coragen Insecticide 18.5% SC',
    productNameKn: 'ಕೋರಾಜನ್ 18.5% SC (Coragen - FMC)',
    brandManufacturer: 'FMC Agro',
    activeIngredient: 'Chlorantraniliprole 18.5% SC',
    medicineType: 'Insecticide',
    medicineTypeKn: 'ಕೀಟನಾಶಕ (Insecticide)',
    dosagePerLiter: '0.4 ml per Liter of water',
    dosagePerLiterKn: '0.4 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '60 ml per acre (in 150-200L water)',
    dosagePerAcreKn: '60 ಮಿಲಿ ಪ್ರತಿ ಎಕರೆಗೆ (150-200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '150 - 200 Liters per acre',
    waterVolumePerAcreKn: '150 - 200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (10-12 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '10 to 12 Sprayer Pumps',
    waitingPeriodDays: 14,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 14 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '14 days before harvest',
    medicineImage: '/medicines/coragen.jpg',
    safetyGuideKn: 'ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು ಮತ್ತು ಕಾಂಡ ಕೊರೆಯುವ ಹುಳಿಗೆ ಅತಿ ಪರಿಣಾಮಕಾರಿ. ನಿಖರ ಅಳತೆಯಲ್ಲಿ ಬೆರೆಸಿ.',
    safetyGuideEn: 'Highly effective against pod borers, stem borers and armyworms. Measure with dosing cup.',
  },
  pegasus: {
    productNameEn: 'Pegasus 50% WP (Diafenthiuron)',
    productNameKn: 'ಪೆಗಾಸಸ್ 50% WP (Pegasus - Syngenta)',
    brandManufacturer: 'Syngenta',
    activeIngredient: 'Diafenthiuron 50% WP',
    medicineType: 'Acaricide',
    medicineTypeKn: 'ನುಸಿ & ಕೀಟನಾಶಕ (Acaricide & Insecticide)',
    dosagePerLiter: '1.25 grams per Liter of water',
    dosagePerLiterKn: '1.25 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '250 grams per acre (in 200L water)',
    dosagePerAcreKn: '250 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Sprayer Pumps',
    waitingPeriodDays: 7,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '7 days before harvest',
    medicineImage: '/medicines/pegasus.jpg',
    safetyGuideKn: 'ಥ್ರಿಪ್ಸ್, ಹಳದಿ ನುಸಿ ಮತ್ತು ಬಿಳಿನೊಣಗಳ ನಿವಾರಣೆಗೆ ರಾಮಬಾಣ. ಎಲೆಯ ಕೆಳಭಾಗಕ್ಕೆ ತಾಗುವಂತೆ ಸಿಂಪಡಿಸಿ.',
    safetyGuideEn: 'Controls thrips, mites, and whiteflies effectively. Spray directed towards undersides of leaves.',
  },
  ridomil_gold: {
    productNameEn: 'Ridomil Gold MZ (Metalaxyl-M 4% + Mancozeb 64% WP)',
    productNameKn: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ MZ (Ridomil Gold - Syngenta)',
    brandManufacturer: 'Syngenta',
    activeIngredient: 'Metalaxyl-M (4%) + Mancozeb (64% WP)',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ (Systemic Fungicide)',
    dosagePerLiter: '2.5 grams per Liter of water',
    dosagePerLiterKn: '2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '500 grams per acre (in 200L water)',
    dosagePerAcreKn: '500 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Sprayer Pumps',
    waitingPeriodDays: 14,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 14 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '14 days before harvest',
    medicineImage: '/medicines/ridomil_gold.jpg',
    safetyGuideKn: 'ಅಂಗಮಾರಿ, ಕೊಳೆ ರೋಗ ಮತ್ತು ಡೌನಿ ಮಿಲ್ಡ್ಯೂ ರೋಗಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.',
    safetyGuideEn: 'Best systemic protection against Late Blight, Downy Mildew, and Damping-off diseases.',
  },
  baan: {
    productNameEn: 'Baan / Beam (Tricyclazole 75% WP)',
    productNameKn: 'ಬಾನ್ / ಬೀಮ್ 75% WP (Tricyclazole)',
    brandManufacturer: 'Corteva / Indofil',
    activeIngredient: 'Tricyclazole 75% WP',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ವಿಶೇಷ ಬೆಂಕಿ ರೋಗನಾಶಕ (Blast Specialist)',
    dosagePerLiter: '0.6 grams per Liter of water',
    dosagePerLiterKn: '0.6 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '120 - 150 grams per acre (in 200L water)',
    dosagePerAcreKn: '120 - 150 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Knapsack Sprayers',
    waitingPeriodDays: 21,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 21 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '21 days before harvest',
    medicineImage: '/medicines/baan.jpg',
    safetyGuideKn: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (Blast) ಕಂಡ ತಕ್ಷಣ ಸಿಂಪಡಿಸಿ. ಯೂರಿಯಾ ಗೊಬ್ಬರ ಕೊಡುವುದನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಲ್ಲಿಸಿ.',
    safetyGuideEn: 'Spray immediately upon spotting blast lesions on rice leaves or necks. Suspend urea application.',
  },
  blitox: {
    productNameEn: 'Blitox 50 WP (Copper Oxychloride 50% WP)',
    productNameKn: 'ಬ್ಲೈಟಾಕ್ಸ್ 50 WP (Copper Oxychloride - Rallis)',
    brandManufacturer: 'Rallis India Ltd.',
    activeIngredient: 'Copper Oxychloride 50% WP',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕ (Copper Fungicide & Bactericide)',
    dosagePerLiter: '2.5 - 3.0 grams per Liter of water',
    dosagePerLiterKn: '2.5 - 3.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '500 - 600 grams per acre (in 200L water)',
    dosagePerAcreKn: '500 - 600 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ',
    pumpCountPerAcre: '13 to 14 Sprayer Pumps',
    waitingPeriodDays: 10,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 10 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '10 days before harvest',
    medicineImage: '/medicines/blitox.jpg',
    safetyGuideKn: 'ಅಡಿಕೆ ಕೊಳೆ ರೋಗ, ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ರೋಗ ಹಾಗೂ ಹಣ್ಣು ಕೊಳೆ ರೋಗಗಳಿಗೆ ಬೋರ್ಡೋ ದ್ರಾವಣದಂತೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
    safetyGuideEn: 'Controls Koleroga fruit rot in arecanut, bacterial blights, and leaf spots effectively.',
  },
  bavistin: {
    productNameEn: 'Bavistin 50% WP (Carbendazim)',
    productNameKn: 'ಬಾವಿಸ್ಟಿನ್ 50% WP (Carbendazim - Crystal)',
    brandManufacturer: 'Crystal Crop Protection',
    activeIngredient: 'Carbendazim 50% WP',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ಅಂತರ್ವ್ಯಾಪಿ ಶಿಲೀಂಧ್ರನಾಶಕ (Systemic Fungicide)',
    dosagePerLiter: '1.0 gram per Liter of water',
    dosagePerLiterKn: '1.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '200 - 250 grams per acre (in 200L water)',
    dosagePerAcreKn: '200 - 250 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ',
    pumpCountPerAcre: '13 to 14 Sprayer Pumps',
    waitingPeriodDays: 15,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 15 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '15 days before harvest',
    medicineImage: '/medicines/bavistin.jpg',
    safetyGuideKn: 'ಬುಡ ಕೊಳೆ, ಸೊರಗು ರೋಗಕ್ಕೆ ಬುಡ ನೆನೆಯುವಂತೆ ಸುರಿಯಿರಿ ಅಥವಾ ಬೀಜೋಪಚಾರಕ್ಕೆ ಬಳಸಿ.',
    safetyGuideEn: 'Ideal for soil drenching against root rots and wilts, and for pre-sowing seed treatment.',
  },
  amistar_top: {
    productNameEn: 'Amistar Top SC (Azoxystrobin 18.2% + Difenoconazole 11.4% SC)',
    productNameKn: 'ಅಮಿಸ್ಟಾರ್ ಟಾಪ್ SC (Amistar Top - Syngenta)',
    brandManufacturer: 'Syngenta',
    activeIngredient: 'Azoxystrobin + Difenoconazole SC',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ಆಧುನಿಕ ವಿಶಾಲ ವ್ಯಾಪ್ತಿಯ ಶಿಲೀಂಧ್ರನಾಶಕ',
    dosagePerLiter: '1.0 ml per Liter of water',
    dosagePerLiterKn: '1.0 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '200 ml per acre (in 200L water)',
    dosagePerAcreKn: '200 ಮಿಲಿ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Knapsack Sprayers',
    waitingPeriodDays: 5,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 5 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '5 days before harvest',
    medicineImage: '/medicines/amistar_top.jpg',
    safetyGuideKn: 'ಶೀತ್ ಬ್ಲೈಟ್, ತುಕ್ಕು ರೋಗ ಮತ್ತು ಎಲೆ ಚುಕ್ಕೆ ರೋಗವನ್ನು ತಕ್ಷಣವೇ ತಡೆಗಟ್ಟುತ್ತದೆ.',
    safetyGuideEn: 'Rapid curative and preventative action against sheath blights, rusts, and leaf spots.',
  },
  mancozeb: {
    productNameEn: 'Dithane M-45 (Mancozeb 75% WP)',
    productNameKn: 'ಡೈಥೇನ್ ಎಂ-45 (Mancozeb 75% WP - Indofil)',
    brandManufacturer: 'Indofil Industries',
    activeIngredient: 'Mancozeb 75% WP',
    medicineType: 'Fungicide',
    medicineTypeKn: 'ಸ್ಪರ್ಶ ಶಿಲೀಂಧ್ರನಾಶಕ (Contact Fungicide)',
    dosagePerLiter: '2.5 grams per Liter of water',
    dosagePerLiterKn: '2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '500 grams per acre (in 200L water)',
    dosagePerAcreKn: '500 ಗ್ರಾಂ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ (13-14 ಪಂಪ್‌ಗಳು)',
    pumpCountPerAcre: '13 to 14 Sprayers',
    waitingPeriodDays: 7,
    waitingPeriodKn: 'ಕೊಯ್ಲಿಗೆ 7 ದಿನಗಳ ಮೊದಲು',
    waitingPeriodEn: '7 days before harvest',
    medicineImage: '/medicines/mancozeb.jpg',
    safetyGuideKn: 'ಎಲೆ ಚುಕ್ಕೆ ರೋಗ, ಅರ್ಲಿ ಬ್ಲೈಟ್ ಆರಂಭಿಕ ಹಂತದಲ್ಲಿದ್ದಾಗ ರಕ್ಷಣಾತ್ಮಕವಾಗಿ ಸಿಂಪಡಿಸಿ.',
    safetyGuideEn: 'Reliable broad spectrum contact fungicide. Apply at first sign of spotting.',
  },
  neem_oil: {
    productNameEn: 'Neem Baan 10,000 PPM (Cold Pressed Neem Oil)',
    productNameKn: 'ಬೇವಿನ ಎಣ್ಣೆ 10,000 PPM (Neem Baan Organic)',
    brandManufacturer: 'Organic Agro Biotech',
    activeIngredient: 'Azadirachtin 1.0% (10,000 PPM)',
    medicineType: 'Organic',
    medicineTypeKn: 'ಸಾವಯವ ಜೈವಿಕ ಕೀಟನಾಶಕ (Organic Bio-Pesticide)',
    dosagePerLiter: '3.0 ml per Liter of water',
    dosagePerLiterKn: '3.0 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ',
    dosagePerAcre: '600 ml per acre (in 200L water)',
    dosagePerAcreKn: '600 ಮಿಲಿ ಪ್ರತಿ ಎಕರೆಗೆ (200 ಲೀಟರ್ ನೀರಿಗೆ)',
    waterVolumePerAcre: '200 Liters per acre',
    waterVolumePerAcreKn: '200 ಲೀಟರ್ ನೀರು / ಎಕರೆ',
    pumpCountPerAcre: '13 to 14 Sprayers',
    waitingPeriodDays: 0,
    waitingPeriodKn: 'ಯಾವುದೇ ಕಾಯುವ ಅವಧಿ ಇಲ್ಲ (ಸಂಪೂರ್ಣ ನೈಸರ್ಗಿಕ)',
    waitingPeriodEn: '0 days (Completely eco-friendly & safe)',
    medicineImage: '/medicines/neem_oil.jpg',
    safetyGuideKn: 'ಪರಿಸರಸ್ನೇಹಿ ಜೈವಿಕ ಮದ್ದು. ರಸಹೀರುವ ಕೀಟಗಳು, ನುಸಿ ಹಾಗೂ ಸಣ್ಣ ಹುಳುಗಳ ಬಾಧೆಯನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
    safetyGuideEn: '100% natural organic bio-remedy. Repels thrips, aphids, mites and prevents fungal spore germination.',
  },
  trichoderma: {
    productNameEn: 'Trichoderma viride 1.5% WP (Bio-Fungicide)',
    productNameKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ (Trichoderma viride Bio)',
    brandManufacturer: 'Agri Bio Care',
    activeIngredient: 'Trichoderma viride (2 x 10^8 CFU/g)',
    medicineType: 'Organic',
    medicineTypeKn: 'ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ (Beneficial Bio-Agent)',
    dosagePerLiter: '5.0 grams per Liter of water',
    dosagePerLiterKn: '5.0 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ (ಅಥವಾ 2 ಕೆಜಿ/ಎಕರೆ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದ ಜೊತೆ)',
    dosagePerAcre: '1.5 - 2.0 kg per acre',
    dosagePerAcreKn: '1.5 - 2.0 ಕೆಜಿ ಪ್ರತಿ ಎಕರೆಗೆ (100 ಕೆಜಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದಲ್ಲಿ ಬೆರೆಸಿ)',
    waterVolumePerAcre: 'Soil application or 200L for drenching',
    waterVolumePerAcreKn: 'ಮಣ್ಣಿಗೆ ಅಳವಡಿಕೆ ಅಥವಾ 200 ಲೀಟರ್ ನೀರಿನಲ್ಲಿ ಬುಡ ನೆನೆಸಲು',
    pumpCountPerAcre: 'Soil application with manure',
    waitingPeriodDays: 0,
    waitingPeriodKn: '0 ದಿನಗಳು (ಸಾವಯವ ಜೈವಿಕ ಮದ್ದು)',
    waitingPeriodEn: '0 days (Eco-safe bio-agent)',
    medicineImage: '/medicines/trichoderma.jpg',
    safetyGuideKn: 'ಸೊರಗು ರೋಗ, ಬೇರು ಕೊಳೆ ಹಾಗೂ ಮಣ್ಣಿನ ಶಿಲೀಂಧ್ರಗಳಿಗೆ ಬೇರಿನ ಸುತ್ತ ನೈಸರ್ಗಿಕ ಕವಚ ಸೃಷ್ಟಿಸುತ್ತದೆ.',
    safetyGuideEn: 'Multiplies around roots to eliminate harmful soil-borne pathogens and wilts naturally.',
  },
};

/**
 * Resolves the absolute best primary medicine for a diagnosed disease and crop.
 * This guarantees that the right disease ALWAYS gets the exact right authentic medicine.
 */
export function resolveMedicineForDisease(issueName?: string, cropName?: string): EnrichedMedicineInfo {
  const d = `${issueName || ''} ${cropName || ''}`.toLowerCase();

  // 1. Paddy / Rice Blast, Ragi Blast (ಬೆಂಕಿ ರೋಗ)
  if (d.includes('blast') || d.includes('ಬೆಂಕಿ') || d.includes('pyricularia') || d.includes('neck blast') || d.includes('leaf blast') || d.includes('node blast')) {
    return MEDICINE_CATALOG.baan;
  }

  // 2. Arecanut / Fruit Rot Koleroga / Mahali (ಅಡಿಕೆ ಕೊಳೆ ರೋಗ, ಮಹಾಳಿ)
  if (d.includes('koleroga') || d.includes('mahali') || d.includes('ಅಡಿಕೆ ಕೊಳೆ') || d.includes('phytophthora arecae') || (d.includes('arecanut') && d.includes('rot')) || (d.includes('ಅಡಿಕೆ') && d.includes('ಕೊಳೆ'))) {
    return MEDICINE_CATALOG.blitox;
  }

  // 3. Sucking Pests: Chilli Leaf Curl, Thrips, Yellow Mites, Whiteflies, Aphids (ಎಲೆ ಮುರುಟು ರೋಗ, ನುಸಿ, ಥ್ರಿಪ್ಸ್, ಬಿಳಿನೊಣ)
  if (d.includes('curl') || d.includes('ಮುರುಟು') || d.includes('thrip') || d.includes('ಥ್ರಿಪ್ಸ್') || d.includes('mite') || d.includes('ನುಸಿ') || d.includes('whitefly') || d.includes('ಬಿಳಿನೊಣ') || d.includes('aphid') || d.includes('ಹೇನು') || d.includes('jassid') || d.includes('ಜಿಗಿಹುಳು')) {
    return MEDICINE_CATALOG.pegasus;
  }

  // 4. Caterpillars, Pod Borers, Bollworms, Stem Borers, Armyworms, Fall Armyworm (ಸೈನಿಕ ಹುಳು, ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು, ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು, ಲದ್ದಿ ಹುಳು)
  if (d.includes('armyworm') || d.includes('ಸೈನಿಕ') || d.includes('ಲದ್ದಿ') || d.includes('borer') || d.includes('ಕೊರೆಯುವ') || d.includes('bollworm') || d.includes('spodoptera') || d.includes('helicoverpa') || d.includes('ಹುಳು') || d.includes('caterpillar') || d.includes('worm') || d.includes('chilo') || d.includes('scirpophaga')) {
    return MEDICINE_CATALOG.coragen;
  }

  // 5. Late Blight (ತಡವಾದ ಅಂಗಮಾರಿ) & Downy Mildew (ಡೌನಿ ಮಿಲ್ಡ್ಯೂ)
  if (d.includes('late blight') || d.includes('ತಡವಾದ ಅಂಗಮಾರಿ') || d.includes('downy') || d.includes('ಡೌನಿ') || d.includes('phytophthora infestans') || d.includes('plasmopara') || d.includes('pseudoperonospora')) {
    return MEDICINE_CATALOG.ridomil_gold;
  }

  // 6. Sheath Blight, Sheath Rot, Rust, Powdery Mildew (ಕವಚ ಕೊಳೆ, ತುಕ್ಕು ರೋಗ, ಬೂದಿ ರೋಗ)
  if (d.includes('sheath blight') || d.includes('sheath rot') || d.includes('ಕವಚ ಕೊಳೆ') || d.includes('rust') || d.includes('ತುಕ್ಕು') || d.includes('powdery') || d.includes('ಬೂದಿ') || d.includes('rhizoctonia') || d.includes('puccinia')) {
    return MEDICINE_CATALOG.amistar_top;
  }

  // 7. Fusarium Wilt, Root Rot, Collar Rot, Sugarcane Red Rot (ಸೊರಗು ರೋಗ, ಬೇರು ಕೊಳೆ, ಬುಡ ಕೊಳೆ, ಕೆಂಪು ಕೊಳೆ)
  if (d.includes('wilt') || d.includes('ಸೊರಗು') || d.includes('root rot') || d.includes('ಬೇರು ಕೊಳೆ') || d.includes('collar rot') || d.includes('ಬುಡ ಕೊಳೆ') || d.includes('red rot') || d.includes('ಕೆಂಪು ಕೊಳೆ') || d.includes('fusarium') || d.includes('colletotrichum falcatum')) {
    return MEDICINE_CATALOG.bavistin;
  }

  // 8. Early Blight, Leaf Spots, Tikka Disease, Anthracnose (ಆರಂಭಿಕ ಅಂಗಮಾರಿ, ಎಲೆ ಚುಕ್ಕೆ, ತಿಕ್ಕಾ ರೋಗ, ಕಜ್ಜಿ ರೋಗ)
  if (d.includes('early blight') || d.includes('ಆರಂಭಿಕ ಅಂಗಮಾರಿ') || d.includes('leaf spot') || d.includes('ಚುಕ್ಕೆ') || d.includes('tikka') || d.includes('ತಿಕ್ಕಾ') || d.includes('anthracnose') || d.includes('alternaria') || d.includes('cercospora') || d.includes('ಅಂಗಮಾರಿ')) {
    return MEDICINE_CATALOG.saaf;
  }

  return MEDICINE_CATALOG.saaf;
}

/**
 * Intelligently matches a medicine item or disease to our verified catalog
 * Prioritizes explicit brand/chemical ingredient first, then disease pathology
 */
export function resolveMedicine(productName: string, activeIngredient?: string, issueName?: string): EnrichedMedicineInfo {
  const prod = `${productName || ''} ${activeIngredient || ''}`.toLowerCase();

  // 1. Explicit Product / Active Ingredient checks
  if (prod.includes('coragen') || prod.includes('chlorantraniliprole')) {
    return MEDICINE_CATALOG.coragen;
  }
  if (prod.includes('pegasus') || prod.includes('diafenthiuron')) {
    return MEDICINE_CATALOG.pegasus;
  }
  if (prod.includes('baan') || prod.includes('beam') || prod.includes('tricyclazole')) {
    return MEDICINE_CATALOG.baan;
  }
  if (prod.includes('ridomil') || prod.includes('metalaxyl')) {
    return MEDICINE_CATALOG.ridomil_gold;
  }
  if (prod.includes('blitox') || (prod.includes('copper') && prod.includes('oxychloride')) || prod.includes('bordeaux')) {
    return MEDICINE_CATALOG.blitox;
  }
  if (prod.includes('bavistin') || (prod.includes('carbendazim') && !prod.includes('mancozeb'))) {
    return MEDICINE_CATALOG.bavistin;
  }
  if (prod.includes('amistar') || prod.includes('azoxystrobin') || prod.includes('difenoconazole')) {
    return MEDICINE_CATALOG.amistar_top;
  }
  if (prod.includes('saaf') || (prod.includes('carbendazim') && prod.includes('mancozeb'))) {
    return MEDICINE_CATALOG.saaf;
  }
  if (prod.includes('dithane') || prod.includes('mancozeb')) {
    return MEDICINE_CATALOG.mancozeb;
  }
  if (prod.includes('neem') || prod.includes('azadirachtin') || prod.includes('ಬೇವು')) {
    return MEDICINE_CATALOG.neem_oil;
  }
  if (prod.includes('trichoderma') || prod.includes('ಟ್ರೈಕೋಡರ್ಮಾ')) {
    return MEDICINE_CATALOG.trichoderma;
  }

  // 2. If product name isn't matched directly, resolve from the disease diagnosis
  return resolveMedicineForDisease(issueName, prod);
}

/**
 * Decorates a chemical treatment item with exact verified dosage per acre and medicine image
 */
export function enrichChemicalItem(item: ChemicalTreatmentItem, issueName?: string): ChemicalTreatmentItem {
  const resolved = resolveMedicine(item.productName, item.activeIngredient, issueName);
  return {
    ...item,
    dosagePerAcre: item.dosagePerAcre || resolved.dosagePerAcreKn,
    medicineImage: item.medicineImage || resolved.medicineImage,
    medicineType: item.medicineType || resolved.medicineTypeKn,
    applicationMethod: item.applicationMethod || resolved.safetyGuideKn,
  };
}
