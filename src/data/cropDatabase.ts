import { CropProfile, PestDisease } from '../types';

export const PEST_DATABASE: PestDisease[] = [
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    type: 'Insect',
    cropsAffected: ['maize', 'sorghum', 'rice', 'pearl-millet', 'sugarcane'],
    tempRange: [18, 32],
    humidityThreshold: 60,
    rainSensitivity: 'Favors Dry',
    vulnerableStages: ['seedling', 'vegetative', 'whorl', 'tasseling'],
    severityDefault: 'Severe',
    symptoms: [
      'Window-pane feeding damage on young leaves',
      'Extensive ragged holes in leaf blades',
      'Moist yellowish-brown frass (droppings) deep inside whorl',
      'Damaged emerging tassels and ear tips'
    ],
    organicControl: [
      'Apply handful of clean dry sand or wood ash mixed with chili powder into plant whorls',
      'Spray Neem Seed Kernel Extract (NSKE 5%) or cold-pressed Neem oil (30ml/15L water with mild soap)',
      'Release Trichogramma egg parasitoids (50,000/ha)',
      'Spray Bacillus thuringiensis (Bt) kurstaki at 2g/L late in evening'
    ],
    chemicalControl: [
      'Emamectin benzoate 5% SG @ 4g per 15L backpack sprayer',
      'Chlorantraniliprole 18.5% SC @ 6ml per 15L water (directed into central whorl)',
      'Spinetoram 11.7% SC @ 8ml per 15L sprayer'
    ],
    phiDays: 14,
    scoutingAdvice: 'Check 20 consecutive plants in 5 field locations; look for fresh sawdust-like frass inside the central leaf funnel.'
  },
  {
    id: 'late-blight',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    type: 'Fungal',
    cropsAffected: ['potato', 'tomato', 'eggplant'],
    tempRange: [12, 22],
    humidityThreshold: 85,
    rainSensitivity: 'Favors Wet',
    vulnerableStages: ['vegetative', 'flowering', 'fruiting', 'tuber_bulking'],
    severityDefault: 'Severe',
    symptoms: [
      'Water-soaked dark lesions on leaf tips or margins expanding rapidly',
      'Delicate white fungal down/mildew visible on leaf undersides in high humidity or morning dew',
      'Brown to black greasy girdling lesions on stems',
      'Firm, brown granular rot on potato tubers and tomato green fruits'
    ],
    organicControl: [
      'Spray Bordeaux mixture (1%) or Copper Oxychloride 50% WP (35g/15L sprayer) preventively',
      'Prune lower canopy leaves touching wet soil to improve airflow',
      'Ensure wide row ridge spacing and avoid overhead furrow flooding'
    ],
    chemicalControl: [
      'Preventive: Mancozeb 75% WP @ 35-40g per 15L knapsack tank',
      'Curative (systemic): Metalaxyl 8% + Mancozeb 64% WP @ 30g per 15L sprayer',
      'Cymoxanil + Mancozeb @ 30g per 15L sprayer during active spread'
    ],
    phiDays: 7,
    scoutingAdvice: 'Scout first in low-lying, damp field hollows or shaded tree borders immediately after morning dew burns off.'
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    type: 'Fungal',
    cropsAffected: ['rice'],
    tempRange: [20, 28],
    humidityThreshold: 88,
    rainSensitivity: 'Favors Wet',
    vulnerableStages: ['seedling', 'tillering', 'panicle_initiation', 'heading'],
    severityDefault: 'Severe',
    symptoms: [
      'Spindle-shaped elliptical lesions with gray/whitish centers and reddish-brown borders',
      'Lesions coalesce causing complete leaf blast drying (burnt appearance)',
      'Blackish necrotic lesions on panicle neck (neck blast) causing chaffy unfilled grains'
    ],
    organicControl: [
      'Avoid excessive split urea / chemical nitrogen applications during foggy spells',
      'Foliar spray of Pseudomonas fluorescens @ 10g/L or fermented cow urine (10%)',
      'Burn or compost infected stubble post-harvest'
    ],
    chemicalControl: [
      'Tricyclazole 75% WP @ 12-15g per 15L knapsack sprayer',
      'Isoprothiolane 40% EC @ 25ml per 15L water',
      'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 15ml per 15L sprayer'
    ],
    phiDays: 21,
    scoutingAdvice: 'Inspect top two leaf blades and panicle nodes early morning when dew persists for more than 8 hours.'
  },
  {
    id: 'whitefly',
    name: 'Silverleaf Whitefly',
    scientificName: 'Bemisia tabaci',
    type: 'Insect',
    cropsAffected: ['cotton', 'tomato', 'chili', 'cassava', 'soybean', 'eggplant', 'black-gram', 'green-gram', 'sesame'],
    tempRange: [24, 36],
    humidityThreshold: 45,
    rainSensitivity: 'Favors Dry',
    vulnerableStages: ['seedling', 'vegetative', 'flowering'],
    severityDefault: 'High',
    symptoms: [
      'Clouds of tiny white flying insects when shaking canopy foliage',
      'Yellow chlorotic mottling, leaf curling, and stunted growth',
      'Sticky honeydew on foliage leading to black sooty mold growth',
      'Vector for Yellow Mosaic Virus and Cotton Leaf Curl Virus'
    ],
    organicControl: [
      'Install bright Yellow Sticky Traps @ 15 traps per acre at canopy height',
      'Spray 2% Neem oil + liquid dish detergent (45ml/15L) targeting leaf undersides',
      'Foliar spray of entomopathogenic fungus Beauveria bassiana @ 5g/L'
    ],
    chemicalControl: [
      'Diafenthiuron 50% WP @ 20g per 15L sprayer',
      'Pyriproxyfen 10% EC @ 20ml per 15L sprayer (insect growth regulator)',
      'Acetamiprid 20% SP @ 4g per 15L sprayer'
    ],
    phiDays: 14,
    scoutingAdvice: 'Turn over 20 random leaves per acre; count nymphs and adults on middle canopy foliage before sunrise.'
  },
  {
    id: 'aphids',
    name: 'Crop Aphids',
    scientificName: 'Aphis spp. / Lipaphis erysimi',
    type: 'Insect',
    cropsAffected: ['mustard', 'wheat', 'cotton', 'maize', 'tomato', 'potato', 'chili', 'pigeon-pea', 'cumin'],
    tempRange: [15, 26],
    humidityThreshold: 55,
    rainSensitivity: 'Favors Dry',
    vulnerableStages: ['vegetative', 'flowering', 'pod_formation', 'siliqua_bulking'],
    severityDefault: 'High',
    symptoms: [
      'Dense colonies of tiny green, black, or yellowish soft-bodied insects clustering on young shoots and flowers',
      'Curled, crinkled leaves with stunted shoot terminal growth',
      'Abundant sticky honeydew attracting black sooty mold and ants'
    ],
    organicControl: [
      'Strong water jet stream to dislodge early colonies',
      'Neem Seed Kernel Extract (NSKE 5%) @ 50ml/L or soap-oil emulsion (10ml oil + 2ml soap/L)',
      'Conserve natural predators: Ladybird beetles (Coccinella) and Chrysoperla lacewings'
    ],
    chemicalControl: [
      'Imidacloprid 17.8% SL @ 5ml per 15L knapsack sprayer',
      'Thiamethoxam 25% WG @ 4g per 15L sprayer',
      'Dimethoate 30% EC @ 25ml per 15L sprayer'
    ],
    phiDays: 14,
    scoutingAdvice: 'Inspect apical shoots and flower inflorescence clusters especially on field borders facing prevailing wind.'
  },
  {
    id: 'early-blight',
    name: 'Early Blight',
    scientificName: 'Alternaria solani',
    type: 'Fungal',
    cropsAffected: ['potato', 'tomato', 'eggplant', 'chili'],
    tempRange: [22, 32],
    humidityThreshold: 75,
    rainSensitivity: 'Favors Wet',
    vulnerableStages: ['vegetative', 'flowering', 'fruiting'],
    severityDefault: 'Moderate',
    symptoms: [
      'Concentric target-board rings on brown circular leaf spots starting on oldest bottom leaves',
      'Yellow chlorotic halos surrounding lesions',
      'Progressive defoliation from ground level upwards leaving sun-scalded fruit'
    ],
    organicControl: [
      'Remove and bury infected bottom leaves touching the ground',
      'Maintain mulch layer (straw) to prevent soil splash onto foliage during rain',
      'Foliar spray with Trichoderma viride @ 5g/L'
    ],
    chemicalControl: [
      'Chlorothalonil 75% WP @ 30g per 15L knapsack tank',
      'Mancozeb 75% WP @ 35g per 15L sprayer',
      'Difenoconazole 25% EC @ 10ml per 15L sprayer'
    ],
    phiDays: 7,
    scoutingAdvice: 'Check the lowest 3-4 leaves in dense canopy rows for target-ring spots after intermittent light rains.'
  },
  {
    id: 'stem-borer',
    name: 'Yellow Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    type: 'Insect',
    cropsAffected: ['rice', 'maize', 'sorghum', 'sugarcane'],
    tempRange: [22, 32],
    humidityThreshold: 70,
    rainSensitivity: 'Any',
    vulnerableStages: ['seedling', 'tillering', 'heading', 'panicle_initiation'],
    severityDefault: 'Severe',
    symptoms: [
      'Dead heart: Central shoot withers and dries up during vegetative stage (pulls out easily)',
      'White head: Emerged panicles completely white and empty of grains at reproductive stage',
      'Tiny entry pinholes on lower stem nodes with brownish caterpillar frass'
    ],
    organicControl: [
      'Install light traps @ 1 per acre to catch adult moths',
      'Install sex pheromone traps with lures @ 8 traps per acre',
      'Clip seedling leaf tips before transplanting to remove egg masses',
      'Release Trichogramma japonicum egg parasitoid @ 100,000/ha weekly'
    ],
    chemicalControl: [
      'Cartap hydrochloride 4% G @ 7.5 kg/acre in standing water',
      'Chlorantraniliprole 0.4% G @ 4 kg/acre broadcast with sand',
      'Fipronil 5% SC @ 30ml per 15L sprayer'
    ],
    phiDays: 28,
    scoutingAdvice: 'Look for brownish felt-like egg masses on leaf tips and count % of dead hearts across 50 hills.'
  },
  {
    id: 'pod-borer',
    name: 'Gram Pod Borer / Fruit Borer',
    scientificName: 'Helicoverpa armigera',
    type: 'Insect',
    cropsAffected: ['chickpea', 'tomato', 'cotton', 'pigeon-pea', 'chili', 'maize', 'soybean', 'green-gram', 'black-gram'],
    tempRange: [20, 35],
    humidityThreshold: 50,
    rainSensitivity: 'Favors Dry',
    vulnerableStages: ['vegetative', 'flowering', 'pod_formation', 'fruiting'],
    severityDefault: 'Severe',
    symptoms: [
      'Round entry holes bored into developing chickpea/pigeon-pea pods or tomato fruits',
      'Larva feeds with anterior body inside the pod and posterior outside',
      'Heavy flower drop and perforated immature pods with missing seeds'
    ],
    organicControl: [
      'Install Helicoverpa pheromone traps (Helilure) @ 5 traps per acre for early detection',
      'Plant African tall marigold as trap crop around field borders (1 row every 16 rows)',
      'Spray HaNPV (Nuclear Polyhedrosis Virus) @ 250 LE/ha with 0.1% jaggery late in afternoon',
      'Spray Neem formulation (Azadirachtin 10,000 ppm) @ 20ml per 15L sprayer'
    ],
    chemicalControl: [
      'Flubendiamide 39.35% SC @ 5ml per 15L backpack sprayer',
      'Indoxacarb 14.5% SC @ 10ml per 15L sprayer',
      'Chlorantraniliprole 18.5% SC @ 6ml per 15L sprayer'
    ],
    phiDays: 14,
    scoutingAdvice: 'Count eggs on tender foliage and young larvae per meter row; 1 larva per meter is economic threshold.'
  },
  {
    id: 'tikka-leaf-spot',
    name: 'Tikka Leaf Spot (Cercospora)',
    scientificName: 'Cercospora arachidicola / C. personatum',
    type: 'Fungal',
    cropsAffected: ['groundnut'],
    tempRange: [22, 30],
    humidityThreshold: 80,
    rainSensitivity: 'Favors Wet',
    vulnerableStages: ['vegetative', 'flowering', 'pod_formation'],
    severityDefault: 'High',
    symptoms: [
      'Early leaf spot: Circular reddish-brown spots with prominent bright yellow halo',
      'Late leaf spot: Dark brown to carbon-black spots on leaf undersides without yellow halo',
      'Severe defoliation leaving bare stems, reducing pod filling and kernel weight'
    ],
    organicControl: [
      'Seed treatment with Trichoderma viride @ 10g/kg kernel before sowing',
      'Crop rotation with non-legumes (sorghum, pearl millet, maize)',
      'Foliar spray of 5% neem leaf extract + 1% cow urine'
    ],
    chemicalControl: [
      'Carbendazim 12% + Mancozeb 63% WP @ 30g per 15L knapsack tank',
      'Tebuconazole 25.9% EC @ 15ml per 15L sprayer',
      'Hexaconazole 5% SC @ 25ml per 15L sprayer'
    ],
    phiDays: 15,
    scoutingAdvice: 'Inspect canopy 30-40 days after sowing following humid rainy spells.'
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    scientificName: 'Erysiphe spp. / Leveillula taurica',
    type: 'Fungal',
    cropsAffected: ['chili', 'eggplant', 'tomato', 'mustard', 'cumin', 'black-gram', 'green-gram', 'sesame'],
    tempRange: [18, 28],
    humidityThreshold: 55,
    rainSensitivity: 'Favors Dry',
    vulnerableStages: ['flowering', 'fruiting', 'pod_formation', 'vegetative'],
    severityDefault: 'Moderate',
    symptoms: [
      'White talcum powder-like fungal patches on leaf surfaces, petioles, and young stems',
      'Leaves curl upward, turn chlorotic yellow, dry out and drop prematurely',
      'Severely affected cumin, chili, or mustard plants become stunted with shriveled seed formation'
    ],
    organicControl: [
      'Foliar spray of wettable sulfur 80% WDG @ 30g per 15L water',
      'Spray sour buttermilk / fermented whey (50ml/L water) in early morning',
      'Foliar application of Potassium bicarbonate @ 3g/L'
    ],
    chemicalControl: [
      'Wettable Sulfur 80% WP @ 35g per 15L knapsack sprayer',
      'Hexaconazole 5% SC @ 15ml per 15L sprayer',
      'Azoxystrobin 23% SC @ 10ml per 15L sprayer'
    ],
    phiDays: 10,
    scoutingAdvice: 'Check sheltered foliage in sunny, warm afternoons where morning humidity was moderate.'
  }
];

export const CROP_PROFILES: CropProfile[] = [
  {
    id: 'maize',
    name: 'Maize (Corn / Makka)',
    scientificName: 'Zea mays',
    category: 'Cereal',
    icon: '🌽',
    baseTemp: 10.0,
    optimalTempRange: [18, 32],
    totalDaysToMaturity: 115,
    growingPeriodRange: [90, 125],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [450, 750],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Clay Loam", "Sandy Loam", "Black Cotton", "Red Laterite"],
    soilPhRange: [5.8, 7.5],
    optimalElevationM: [0, 2400],
    primarySuitabilityAreas: [
      "Punjab & Haryana (Ludhiana, Jalandhar, Karnal alluvial plains)",
      "Karnataka (Davangere, Haveri, Belagavi, Shimoga)",
      "Telangana (Nizamabad, Karimnagar, Warangal)",
      "Bihar (Khagaria, Begusarai, Samastipur rabi maize hub)",
      "Madhya Pradesh (Chhindwara, Dhar, Betul)"
],
    otherSuitabilityAreas: [
      "Andhra Pradesh (Guntur, Krishna, West Godavari)",
      "Rajasthan (Banswara, Dungarpur, Bhilwara)",
      "Uttar Pradesh (Bahraich, Gonda, Bulandshahr)",
      "Maharashtra (Nashik, Aurangabad, Jalgaon)",
      "Odisha (Mayurbhanj, Nabarangpur, Koraput)",
      "Gujarat (Panchmahal, Dahod)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Main Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Northern, Central & Peninsular Plains",
            "notes": "Sow with onset of monsoon rains; ensure ridge-and-furrow drainage against waterlogging."
      },
      {
            "seasonName": "Rabi / Winter Maize",
            "months": "October - November",
            "agroEcologicalZone": "Bihar, Eastern UP, AP & Telangana",
            "notes": "Produces exceptionally high grain yields under bright winter sun with furrow irrigation."
      },
      {
            "seasonName": "Spring / Zaid Summer",
            "months": "February - March",
            "agroEcologicalZone": "Punjab, Haryana & Western UP",
            "notes": "Short duration spring crop following potato or sugarcane harvest with assured irrigation."
      }
],
    yieldExpectation: '4.0 - 7.5 tonnes/hectare (semi-irrigated to irrigated)',
    stages: [
      {
            "id": "germination",
            "name": "Germination & Emergence (VE-V1)",
            "description": "Coleoptile emerges from soil; first true leaf unfolds with rounded tip.",
            "startDas": 0,
            "endDas": 10,
            "gddRequired": 120,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal placement of Phosphorus (DAP/NPK) and Zinc Sulfate near seed furrow.",
            "pestRisks": [
                  "Cutworms",
                  "Seedling maggots"
            ],
            "scoutingChecklist": [
                  "Check plant population and uniform emergence",
                  "Look for cut seedlings at soil line"
            ]
      },
      {
            "id": "early_vegetative",
            "name": "Early Vegetative & Whorl (V2-V6)",
            "description": "Rapid leaf emergence. Growing point moves above soil line at V6 stage; ear shoots initiate.",
            "startDas": 11,
            "endDas": 30,
            "gddRequired": 350,
            "waterNeeds": "Medium",
            "kc": 0.7,
            "nutrientFocus": "First split Nitrogen top-dressing (Urea) side-dressed 5cm away from plant line.",
            "pestRisks": [
                  "fall-armyworm",
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Examine whorls for pinholes or sawdust-like frass",
                  "Critical weed control window"
            ]
      },
      {
            "id": "rapid_vegetative",
            "name": "Rapid Vegetative & Stem Elongation (V7-V12)",
            "description": "Plant undergoes explosive vertical height expansion. Strong brace roots develop.",
            "startDas": 31,
            "endDas": 50,
            "gddRequired": 680,
            "waterNeeds": "High",
            "kc": 1.0,
            "nutrientFocus": "Second split Nitrogen top-dressing before canopy closure; check Zinc status.",
            "pestRisks": [
                  "fall-armyworm",
                  "stem-borer"
            ],
            "scoutingChecklist": [
                  "Whorl damage check",
                  "Ear shoot development check"
            ]
      },
      {
            "id": "tasseling_silking",
            "name": "Tasseling & Silking (VT-R1)",
            "description": "Tassels shed pollen while moist silk threads emerge from ear. Most moisture-critical period!",
            "startDas": 51,
            "endDas": 68,
            "gddRequired": 950,
            "waterNeeds": "Critical",
            "kc": 1.2,
            "nutrientFocus": "Potassium uptake peaks; avoid moisture or heat stress which dries out silks prematurely.",
            "pestRisks": [
                  "fall-armyworm",
                  "pod-borer"
            ],
            "scoutingChecklist": [
                  "Silk health and pollination coverage",
                  "Inspect ear tips for caterpillars"
            ]
      },
      {
            "id": "grain_fill",
            "name": "Grain Filling / Dough Stage (R2-R4)",
            "description": "Kernels transition from blister to milky fluid to dense dough. Starch accumulates rapidly.",
            "startDas": 69,
            "endDas": 95,
            "gddRequired": 1350,
            "waterNeeds": "High",
            "kc": 1.05,
            "nutrientFocus": "Maintain upper canopy stay-green trait; protect against leaf blights.",
            "pestRisks": [
                  "Northern corn leaf blight",
                  "Ear rots"
            ],
            "scoutingChecklist": [
                  "Look for cigar-shaped leaf lesions",
                  "Check kernel starch accumulation"
            ]
      },
      {
            "id": "maturity_harvest",
            "name": "Physiological Maturity & Harvest (R6)",
            "description": "Black layer forms at kernel tip base indicating starch transfer is complete. Husks turn straw-yellow.",
            "startDas": 96,
            "endDas": 115,
            "gddRequired": 1650,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "No fertilizer needed. Allow cobs to field-dry to 14-15% grain moisture for safe storage.",
            "pestRisks": [
                  "Weevils",
                  "Ear molds in late rain"
            ],
            "scoutingChecklist": [
                  "Check black layer formation on kernels",
                  "Monitor stalk strength for lodging risk"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('maize'))
  },
  {
    id: 'rice',
    name: 'Rice (Paddy / Dhan)',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    icon: '🌾',
    baseTemp: 10.0,
    optimalTempRange: [22, 34],
    totalDaysToMaturity: 120,
    growingPeriodRange: [105, 145],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [900, 1500],
    droughtTolerance: 'Low',
    suitableSoils: ["Clay Loam", "Silty Clay", "Black Cotton"],
    soilPhRange: [5.0, 7.2],
    optimalElevationM: [0, 1200],
    primarySuitabilityAreas: [
      "West Bengal (Burdwan, Hooghly, Midnapore, Bankura)",
      "Punjab (Ludhiana, Patiala, Sangrur, Amritsar)",
      "Andhra Pradesh (Krishna, Guntur, East Godavari deltas)",
      "Tamil Nadu (Thanjavur, Tiruvarur Cauvery delta)",
      "Odisha (Mahanadi delta, Cuttack, Bargarh)"
],
    otherSuitabilityAreas: [
      "Chhattisgarh (Raipur, Durg, Bilaspur - Rice Bowl of Central India)",
      "Bihar (Rohtas, Buxar, Purnea, Katihar)",
      "Assam (Brahmaputra Valley, Nagaon, Kamrup)",
      "Haryana (Karnal, Kaithal, Kurukshetra)",
      "Kerala (Kuttanad & Palakkad)",
      "Telangana (Nalgonda, Karimnagar, Nizamabad)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Aman Rice",
            "months": "June - July (Nursery in May)",
            "agroEcologicalZone": "Major Monsoon Rice Belts Across India",
            "notes": "Main monsoon crop; transplant 21-25 day old seedlings with 2-3 seedlings per hill."
      },
      {
            "seasonName": "Rabi / Boro Rice",
            "months": "November - December",
            "agroEcologicalZone": "Eastern India (West Bengal, Assam, Bihar) & Coastal AP",
            "notes": "Winter sown irrigated boro rice yielding high solar radiation gains."
      },
      {
            "seasonName": "Zaid / Aus Rice",
            "months": "March - April",
            "agroEcologicalZone": "Eastern & Southern Coastal Deltas",
            "notes": "Early summer crop with short duration mature before heavy monsoon storms."
      }
],
    yieldExpectation: '4.5 - 7.0 tonnes/hectare (puddle transplanted)',
    stages: [
      {
            "id": "nursery",
            "name": "Nursery & Seedling Stage",
            "description": "Pre-germinated seeds sown in wet nursery beds. Develops 3-4 leaves ready for transplanting.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 280,
            "waterNeeds": "Medium",
            "kc": 0.8,
            "nutrientFocus": "Basal application of DAP and Zinc Sulfate in nursery bed.",
            "pestRisks": [
                  "stem-borer",
                  "rice-blast"
            ],
            "scoutingChecklist": [
                  "Check seedling vigor",
                  "Clip leaf tips to discard stem borer egg masses"
            ]
      },
      {
            "id": "tillering",
            "name": "Active Tillering",
            "description": "Transplanted seedlings produce auxiliary tillers from nodes. Canopy covers water surface.",
            "startDas": 26,
            "endDas": 55,
            "gddRequired": 650,
            "waterNeeds": "High",
            "kc": 1.15,
            "nutrientFocus": "First and second split Urea top dressings; maintain shallow standing water (2-5cm).",
            "pestRisks": [
                  "stem-borer",
                  "rice-blast"
            ],
            "scoutingChecklist": [
                  "Dead hearts on tillers",
                  "Spindle-shaped blast lesions on leaves"
            ]
      },
      {
            "id": "panicle_initiation",
            "name": "Panicle Initiation & Booting",
            "description": "Reproductive phase begins deep inside leaf sheath. Flag leaf expands fully.",
            "startDas": 56,
            "endDas": 75,
            "gddRequired": 950,
            "waterNeeds": "Critical",
            "kc": 1.25,
            "nutrientFocus": "Muriate of Potash (MOP) top-dressing to strengthen panicle neck against lodging.",
            "pestRisks": [
                  "rice-blast",
                  "stem-borer"
            ],
            "scoutingChecklist": [
                  "Inspect flag leaf for blast lesions",
                  "Check leaf sheath for sheath rot"
            ]
      },
      {
            "id": "flowering",
            "name": "Heading & Flowering (Anthesis)",
            "description": "Panicles emerge from boot leaf; pollination occurs in morning hours.",
            "startDas": 76,
            "endDas": 92,
            "gddRequired": 1200,
            "waterNeeds": "Critical",
            "kc": 1.2,
            "nutrientFocus": "Avoid any moisture stress during flowering to prevent sterile/chaffy grains.",
            "pestRisks": [
                  "rice-blast",
                  "stem-borer"
            ],
            "scoutingChecklist": [
                  "Neck blast symptoms at panicle base",
                  "White heads"
            ]
      },
      {
            "id": "grain_filling",
            "name": "Milk to Dough & Grain Ripening",
            "description": "Grain transitions from milky fluid to firm starch. Panicles turn golden straw color.",
            "startDas": 93,
            "endDas": 120,
            "gddRequired": 1550,
            "waterNeeds": "Low",
            "kc": 0.8,
            "nutrientFocus": "Drain field water 10-12 days before harvest to promote uniform ripening.",
            "pestRisks": [
                  "Grain discolouration"
            ],
            "scoutingChecklist": [
                  "Harvest when 85% of grains in panicles have turned golden"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('rice'))
  },
  {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    icon: '🌾',
    baseTemp: 4.5,
    optimalTempRange: [15, 25],
    totalDaysToMaturity: 130,
    growingPeriodRange: [110, 145],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [400, 600],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Clay Loam", "Sandy Loam", "Silty Clay"],
    soilPhRange: [6.0, 7.8],
    optimalElevationM: [0, 3200],
    primarySuitabilityAreas: [
      "Uttar Pradesh (Aligarh, Meerut, Bulandshahr, Mathura, Agra)",
      "Punjab (Ludhiana, Sangrur, Patiala, Bathinda)",
      "Haryana (Karnal, Hisar, Sirsa, Kurukshetra)",
      "Madhya Pradesh (Malwa Plateau, Hoshangabad, Sehore, Ujjain Sharbati wheat)"
],
    otherSuitabilityAreas: [
      "Rajasthan (Sri Ganganagar, Hanumangarh, Bharatpur, Kota)",
      "Bihar (Patna, Nalanda, Buxar, Rohtas)",
      "Gujarat (Ahmedabad, Mehsana, Anand - Bhal wheat tract)",
      "Maharashtra (Nashik, Ahmednagar, Pune)",
      "West Bengal (Murshidabad, Malda)",
      "Himachal Pradesh (Kangra, Mandi valleys)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Rabi / Winter",
            "months": "November (First fortnight)",
            "agroEcologicalZone": "North-Western & Central Plains of India",
            "notes": "Optimal sowing window: Nov 1-15 for timely sown varieties; avoids terminal heat during grain fill."
      },
      {
            "seasonName": "Late Sown Rabi",
            "months": "December (First fortnight)",
            "agroEcologicalZone": "Eastern UP & Bihar rice-wheat systems",
            "notes": "Follows late rice harvest; requires heat-tolerant cultivars."
      }
],
    yieldExpectation: '4.2 - 6.5 tonnes/hectare (irrigated)',
    stages: [
      {
            "id": "cri",
            "name": "Crown Root Initiation (CRI)",
            "description": "Crown roots initiate 2cm below soil line. The most critical irrigation stage in wheat!",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 240,
            "waterNeeds": "Critical",
            "kc": 0.4,
            "nutrientFocus": "First irrigation at 21 DAS followed by split Urea top-dressing.",
            "pestRisks": [
                  "Termites"
            ],
            "scoutingChecklist": [
                  "Dig up 3 plants to inspect crown root formation",
                  "Check weed emergence"
            ]
      },
      {
            "id": "tillering_jointing",
            "name": "Tillering & Stem Jointing",
            "description": "Substantial tiller production; first nodes appear above ground level.",
            "startDas": 26,
            "endDas": 60,
            "gddRequired": 620,
            "waterNeeds": "High",
            "kc": 0.85,
            "nutrientFocus": "Second split Nitrogen before second irrigation at late tillering.",
            "pestRisks": [
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Monitor tiller count per meter row",
                  "Look for early aphid colonies"
            ]
      },
      {
            "id": "booting_heading",
            "name": "Booting, Heading & Flowering",
            "description": "Ear heads emerge from flag leaf sheath; pollination takes place under cool weather.",
            "startDas": 61,
            "endDas": 90,
            "gddRequired": 1050,
            "waterNeeds": "Critical",
            "kc": 1.15,
            "nutrientFocus": "Irrigation during flowering is essential, but avoid watering during high winds to prevent lodging.",
            "pestRisks": [
                  "aphids",
                  "Yellow rust"
            ],
            "scoutingChecklist": [
                  "Inspect flag leaf for yellow rust stripes",
                  "Aphid counts on ear heads"
            ]
      },
      {
            "id": "grain_fill_maturity",
            "name": "Milk, Dough & Harvesting",
            "description": "Grains accumulate starch. Straw turns golden brown as kernels harden.",
            "startDas": 91,
            "endDas": 130,
            "gddRequired": 1600,
            "waterNeeds": "Medium",
            "kc": 0.7,
            "nutrientFocus": "Light irrigation at dough stage to protect against terminal heat stress.",
            "pestRisks": [
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Pinch grain with thumbnail; hard dough means ready for harvest"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('wheat'))
  },
  {
    id: 'cotton',
    name: 'Cotton (Kapas)',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    icon: '☁️',
    baseTemp: 15.0,
    optimalTempRange: [24, 35],
    totalDaysToMaturity: 165,
    growingPeriodRange: [150, 180],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [600, 900],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Black Cotton", "Clay Loam", "Silty Clay"],
    soilPhRange: [6.5, 8.2],
    optimalElevationM: [0, 800],
    primarySuitabilityAreas: [
      "Gujarat (Surendranagar, Rajkot, Amreli, Bhavnagar Saurashtra belt)",
      "Maharashtra (Vidarbha & Marathwada - Yavatmal, Akola, Wardha, Jalgaon)",
      "Telangana (Adilabad, Warangal, Karimnagar)",
      "Andhra Pradesh (Guntur, Kurnool)"
],
    otherSuitabilityAreas: [
      "Punjab (Bathinda, Mansa, Fazilka, Muktsar irrigated cotton belt)",
      "Haryana (Sirsa, Hisar, Fatehabad, Jind)",
      "Karnataka (Raichur, Ballari, Haveri, Dharwad)",
      "Madhya Pradesh (Khargone, Khandwa, Barwani Nimar cotton belt)",
      "Odisha (Bolangir, Kalahandi)",
      "Rajasthan (Sri Ganganagar, Hanumangarh)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "May - June (Pre-monsoon / Monsoon onset)",
            "agroEcologicalZone": "Deep black soils & irrigated canal tracts across India",
            "notes": "Early pre-monsoon sowing in North India minimizes whitefly and leaf curl pressure."
      }
],
    yieldExpectation: '1.8 - 3.2 tonnes/hectare seed cotton (Kapas)',
    stages: [
      {
            "id": "seedling",
            "name": "Emergence & Seedling (0-30 DAS)",
            "description": "Hypocotyl pushes cotyledons above ground. Taproot develops deep into soil.",
            "startDas": 0,
            "endDas": 30,
            "gddRequired": 350,
            "waterNeeds": "Low",
            "kc": 0.45,
            "nutrientFocus": "Basal Phosphorus and Potash; gap filling within 10 days of emergence.",
            "pestRisks": [
                  "whitefly",
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Inspect leaf undersides for sucking pests",
                  "Check plant stand"
            ]
      },
      {
            "id": "squaring",
            "name": "Squaring & Vegetative Branching (31-60 DAS)",
            "description": "Sympodial fruiting branches emerge; pyramid-shaped flower buds (squares) form.",
            "startDas": 31,
            "endDas": 60,
            "gddRequired": 750,
            "waterNeeds": "Medium",
            "kc": 0.75,
            "nutrientFocus": "First top-dressing of Nitrogen; install yellow sticky traps for whiteflies.",
            "pestRisks": [
                  "whitefly",
                  "pod-borer"
            ],
            "scoutingChecklist": [
                  "Count % flared squares and shed squares",
                  "Whitefly nymph counts"
            ]
      },
      {
            "id": "flowering_boll",
            "name": "Peak Flowering & Boll Development (61-105 DAS)",
            "description": "White flowers turn pink after pollination. Green bolls expand to full size.",
            "startDas": 61,
            "endDas": 105,
            "gddRequired": 1400,
            "waterNeeds": "Critical",
            "kc": 1.15,
            "nutrientFocus": "Foliar spray of 2% DAP or 1% Potassium Nitrate (13-0-45) to prevent boll dropping.",
            "pestRisks": [
                  "pod-borer",
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Inspect developing green bolls for pink bollworm entry",
                  "Check flower rosette formation"
            ]
      },
      {
            "id": "boll_bursting",
            "name": "Boll Bursting & Fiber Picking (106-165 DAS)",
            "description": "Bolls split open exposing fluffy white lint fiber. Requires dry, sunny weather.",
            "startDas": 106,
            "endDas": 165,
            "gddRequired": 2000,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "Cease all irrigation 20 days prior to picking to avoid staining lint.",
            "pestRisks": [
                  "Cotton stainer bug"
            ],
            "scoutingChecklist": [
                  "Pick clean dry bolls in morning after dew evaporates"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('cotton'))
  },
  {
    id: 'mustard',
    name: 'Mustard (Sarson / Rai)',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    icon: '🌼',
    baseTemp: 5.0,
    optimalTempRange: [15, 26],
    totalDaysToMaturity: 115,
    growingPeriodRange: [100, 125],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [250, 400],
    droughtTolerance: 'High',
    suitableSoils: ["Sandy Loam", "Clay Loam", "Red Laterite"],
    soilPhRange: [6.0, 7.5],
    optimalElevationM: [0, 1500],
    primarySuitabilityAreas: [
      "Rajasthan (Bharatpur, Alwar, Sri Ganganagar, Tonk, Jaipur - Mustard Heart of India)",
      "Haryana (Bhiwani, Hisar, Mahendragarh, Rohtak)",
      "Uttar Pradesh (Mathura, Agra, Aligarh, Hathras)",
      "Madhya Pradesh (Morena, Bhind, Gwalior Chambal belt)"
],
    otherSuitabilityAreas: [
      "Gujarat (Banaskantha, Patan, Mehsana)",
      "West Bengal (Nadia, Murshidabad)",
      "Bihar (Begusarai, Samastipur)",
      "Punjab (Bathinda, Mansa)",
      "Assam (Nagaon, Morigaon)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Rabi / Winter",
            "months": "October (First fortnight)",
            "agroEcologicalZone": "Semi-arid & irrigated subtropics across India",
            "notes": "Sowing between Oct 1-15 allows crop to escape peak mustard aphid infestation."
      }
],
    yieldExpectation: '1.5 - 2.4 tonnes/hectare',
    stages: [
      {
            "id": "rosette",
            "name": "Emergence & Rosette Stage",
            "description": "Round cotyledons emerge followed by spreading ground-hugging leaf rosette.",
            "startDas": 0,
            "endDas": 30,
            "gddRequired": 280,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal application of Sulfur (20 kg/ha Elemental Sulfur) essential for mustard oil synthesis.",
            "pestRisks": [
                  "Mustard sawfly"
            ],
            "scoutingChecklist": [
                  "Thin plants to maintain 10-15cm intra-row spacing at 15 DAS"
            ]
      },
      {
            "id": "flowering",
            "name": "Stem Elongation & Bright Yellow Flowering",
            "description": "Canopy surges vertically with vibrant yellow blooms attracting honeybee pollinators.",
            "startDas": 31,
            "endDas": 65,
            "gddRequired": 680,
            "waterNeeds": "High",
            "kc": 0.9,
            "nutrientFocus": "Top-dress remaining Urea before first irrigation at flowering stage.",
            "pestRisks": [
                  "aphids",
                  "powdery-mildew"
            ],
            "scoutingChecklist": [
                  "Scout central inflorescence twigs for aphid colonies",
                  "Count aphids per plant"
            ]
      },
      {
            "id": "siliqua_maturity",
            "name": "Siliqua (Pod) Bulking & Maturity",
            "description": "Green siliquae pods swell with seeds. Plants turn golden straw yellow.",
            "startDas": 66,
            "endDas": 115,
            "gddRequired": 1250,
            "waterNeeds": "Medium",
            "kc": 0.6,
            "nutrientFocus": "Avoid late irrigation which causes lodging and shrivels seed oil content.",
            "pestRisks": [
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Harvest when 75% of siliquae turn golden yellow to avoid shattering losses"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('mustard'))
  },
  {
    id: 'onion',
    name: 'Onion (Pyaz)',
    scientificName: 'Allium cepa',
    category: 'Vegetable',
    icon: '🧅',
    baseTemp: 7.0,
    optimalTempRange: [15, 30],
    totalDaysToMaturity: 130,
    growingPeriodRange: [115, 145],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [400, 650],
    droughtTolerance: 'Low',
    suitableSoils: ["Sandy Loam", "Clay Loam"],
    soilPhRange: [6.0, 7.2],
    optimalElevationM: [0, 2000],
    primarySuitabilityAreas: [
      "Maharashtra (Nashik - Lasalgaon Asia's biggest onion market, Ahmednagar, Pune, Solapur)",
      "Karnataka (Dharwad, Gadag, Chitradurga, Bagalkot)",
      "Gujarat (Bhavnagar - Mahuva dehydrated onion hub, Rajkot, Junagadh)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Khandwa, Indore, Shajapur, Sagar)",
      "Bihar (Nalanda, Patna)",
      "Rajasthan (Alwar, Sikar)",
      "Andhra Pradesh (Kurnool)",
      "Tamil Nadu (Dindigul, Tiruppur small onion belt)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon Onion",
            "months": "July - August (Transplanting)",
            "agroEcologicalZone": "Maharashtra & Karnataka raised beds",
            "notes": "Short duration kharif onion on raised broad beds to prevent water stagnation."
      },
      {
            "seasonName": "Late Kharif / Rangda",
            "months": "October - November",
            "agroEcologicalZone": "Western Maharashtra & Gujarat",
            "notes": "Transplanted before winter; fetches premium post-monsoon prices."
      },
      {
            "seasonName": "Rabi / Winter Onion",
            "months": "December - January",
            "agroEcologicalZone": "All India Major Onion Tracts",
            "notes": "Main storing onion; highest bulb storage life and solid dry matter."
      }
],
    yieldExpectation: '20 - 35 tonnes/hectare',
    stages: [
      {
            "id": "transplant",
            "name": "Transplanting & Root Establishment",
            "description": "Pencil-thick nursery seedlings transplanted into moist beds. Fibrous roots anchor.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 250,
            "waterNeeds": "High",
            "kc": 0.6,
            "nutrientFocus": "Basal dose of FYM (20t/ha), DAP, Potash and Sulfur (30kg/ha).",
            "pestRisks": [
                  "Thrips"
            ],
            "scoutingChecklist": [
                  "Dip roots in Carbendazim solution before transplanting",
                  "Check for damping off"
            ]
      },
      {
            "id": "vegetative",
            "name": "Vegetative Foliage Growth",
            "description": "Production of hollow cylindrical green leaves. Every new leaf corresponds to a bulb scale.",
            "startDas": 26,
            "endDas": 65,
            "gddRequired": 650,
            "waterNeeds": "High",
            "kc": 0.9,
            "nutrientFocus": "Nitrogen split top-dressing; stop nitrogen application 60 days after transplanting.",
            "pestRisks": [
                  "Thrips",
                  "Purple blotch"
            ],
            "scoutingChecklist": [
                  "Part central leaves to scout for minute yellow thrips nymphs in leaf sheaths"
            ]
      },
      {
            "id": "bulb_initiation",
            "name": "Bulb Initiation & Sizing",
            "description": "Basal leaf sheaths thicken and swell forming the onion bulb.",
            "startDas": 66,
            "endDas": 105,
            "gddRequired": 1150,
            "waterNeeds": "Critical",
            "kc": 1.05,
            "nutrientFocus": "Foliar spray of 00-00-50 (Sulfate of Potash) to encourage bulb firmness and outer skin shine.",
            "pestRisks": [
                  "Purple blotch",
                  "Stemphylium blight"
            ],
            "scoutingChecklist": [
                  "Look for purplish sunken leaf spots",
                  "Ensure uniform moisture without waterlogging"
            ]
      },
      {
            "id": "curing",
            "name": "Tops Fall & Bulb Curing",
            "description": "50-70% of neck tops break and collapse. Outer scales dry into papery protective tunic.",
            "startDas": 106,
            "endDas": 130,
            "gddRequired": 1450,
            "waterNeeds": "Low",
            "kc": 0.5,
            "nutrientFocus": "Withhold irrigation 15 days before harvest to allow neck closure and prevent storage rotting.",
            "pestRisks": [
                  "Basal rot"
            ],
            "scoutingChecklist": [
                  "Harvest when 50% tops have fallen; cure under shade for 7-10 days"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('onion'))
  },
  {
    id: 'tomato',
    name: 'Tomato (Tamatar)',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    icon: '🍅',
    baseTemp: 10.0,
    optimalTempRange: [20, 30],
    totalDaysToMaturity: 110,
    growingPeriodRange: [90, 130],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [400, 600],
    droughtTolerance: 'Low',
    suitableSoils: ["Sandy Loam", "Clay Loam", "Red Laterite"],
    soilPhRange: [6.0, 7.0],
    optimalElevationM: [0, 2000],
    primarySuitabilityAreas: [
      "Andhra Pradesh (Chittoor - Madanapalle Asia's largest tomato market, Anantapur)",
      "Karnataka (Kolar, Chikkaballapur, Belagavi)",
      "Maharashtra (Nashik, Pune, Satara)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Shivpuri, Sagar, Jabalpur)",
      "Himachal Pradesh (Solan, Sirmaur off-season hill tomato belt)",
      "Odisha (Mayurbhanj, Keonjhar)",
      "Gujarat (Anand, Kheda)",
      "Bihar (Vaishali, Samastipur)",
      "Punjab (Amritsar, Hoshiarpur)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Peninsular and Central India",
            "notes": "Ridge planting with staking required to keep fruit off wet monsoon soil."
      },
      {
            "seasonName": "Rabi / Winter",
            "months": "October - November",
            "agroEcologicalZone": "Plains of India",
            "notes": "Main winter crop producing high brix, deep red firm fruit."
      },
      {
            "seasonName": "Summer / Off-Season",
            "months": "February - March",
            "agroEcologicalZone": "Irrigated valleys & Northern hills (Solan)",
            "notes": "Requires drip irrigation and shade-net or mulching against heat."
      }
],
    yieldExpectation: '35 - 60 tonnes/hectare (staked drip-irrigated)',
    stages: [
      {
            "id": "transplant",
            "name": "Transplant & Root Establishment",
            "description": "Seedlings planted in raised beds; taproot and adventitious roots anchor.",
            "startDas": 0,
            "endDas": 20,
            "gddRequired": 220,
            "waterNeeds": "Medium",
            "kc": 0.5,
            "nutrientFocus": "Basal 19-19-19 water soluble fertilizer and neem cake.",
            "pestRisks": [
                  "whitefly",
                  "Cutworms"
            ],
            "scoutingChecklist": [
                  "Yellow sticky traps for whitefly vectors",
                  "Check seedling vigor"
            ]
      },
      {
            "id": "vegetative",
            "name": "Vegetative Growth & Staking",
            "description": "Rapid stem elongation, branching, and flower cluster initiation.",
            "startDas": 21,
            "endDas": 45,
            "gddRequired": 550,
            "waterNeeds": "High",
            "kc": 0.8,
            "nutrientFocus": "Calcium Nitrate fertigation to prevent Blossom End Rot later.",
            "pestRisks": [
                  "whitefly",
                  "early-blight"
            ],
            "scoutingChecklist": [
                  "Remove lower suckers",
                  "Tie vines to support trellis"
            ]
      },
      {
            "id": "flowering_fruitset",
            "name": "Flowering & Fruit Setting",
            "description": "Bright yellow flowers open; bees vibrate flowers for buzz pollination.",
            "startDas": 46,
            "endDas": 70,
            "gddRequired": 900,
            "waterNeeds": "Critical",
            "kc": 1.15,
            "nutrientFocus": "Potassium Nitrate and Boron foliar spray for flower retention.",
            "pestRisks": [
                  "pod-borer",
                  "late-blight"
            ],
            "scoutingChecklist": [
                  "Check fruit calyx for fruit borer caterpillars",
                  "Inspect foliage for water-soaked blight spots"
            ]
      },
      {
            "id": "harvesting",
            "name": "Fruit Enlargement & Harvesting",
            "description": "Fruit transitions from mature green to breaker stage to full crimson red.",
            "startDas": 71,
            "endDas": 110,
            "gddRequired": 1400,
            "waterNeeds": "High",
            "kc": 0.9,
            "nutrientFocus": "Consistent watering to prevent fruit cracking during sudden rain.",
            "pestRisks": [
                  "late-blight",
                  "early-blight"
            ],
            "scoutingChecklist": [
                  "Pick fruit at breaker stage for long distance transport"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('tomato'))
  },
  {
    id: 'potato',
    name: 'Potato (Aloo)',
    scientificName: 'Solanum tuberosum',
    category: 'Tuber',
    icon: '🥔',
    baseTemp: 7.0,
    optimalTempRange: [15, 22],
    totalDaysToMaturity: 95,
    growingPeriodRange: [80, 110],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [350, 500],
    droughtTolerance: 'Low',
    suitableSoils: ["Sandy Loam", "Clay Loam"],
    soilPhRange: [5.2, 6.8],
    optimalElevationM: [0, 3000],
    primarySuitabilityAreas: [
      "Uttar Pradesh (Agra, Aligarh, Kannauj, Farrukhabad potato capital, Hathras)",
      "West Bengal (Hooghly, Burdwan, Bankura, Midnapore)",
      "Punjab (Jalandhar, Kapurthala seed potato hub)"
],
    otherSuitabilityAreas: [
      "Bihar (Nalanda, Vaishali, Patna)",
      "Gujarat (Deesa, Banaskantha, Sabarkantha cold-storage hub)",
      "Madhya Pradesh (Indore, Ujjain, Dewas processing potato)",
      "Assam (Barpeta, Nagaon)",
      "Karnataka (Hassan)",
      "Himachal Pradesh & Uttarakhand (Shimla hill seed potato)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Rabi / Autumn Winter",
            "months": "October - November",
            "agroEcologicalZone": "Indo-Gangetic Plains (UP, WB, Punjab, Bihar)",
            "notes": "Main potato crop; cool nights (15-18\u00b0C) trigger rapid tuberization."
      },
      {
            "seasonName": "Spring Crop",
            "months": "January (First fortnight)",
            "agroEcologicalZone": "North-Western Plains following early paddy/mustard",
            "notes": "Short cycle spring crop harvested before peak summer heat."
      }
],
    yieldExpectation: '25 - 40 tonnes/hectare',
    stages: [
      {
            "id": "emergence",
            "name": "Sprout Development & Emergence",
            "description": "Eyes on certified seed tubers sprout; stems and root system establish.",
            "startDas": 0,
            "endDas": 20,
            "gddRequired": 200,
            "waterNeeds": "Low",
            "kc": 0.45,
            "nutrientFocus": "Basal NPK (half N, full P & K) and Zinc Sulfate placed in ridges.",
            "pestRisks": [
                  "Cutworms"
            ],
            "scoutingChecklist": [
                  "Check uniform emergence",
                  "Dig gently to verify healthy sprout vigor"
            ]
      },
      {
            "id": "earthing_up",
            "name": "Vegetative Growth & Earthing Up",
            "description": "Dense leafy canopy forms. Mounding soil around stems initiates stolons.",
            "startDas": 21,
            "endDas": 45,
            "gddRequired": 480,
            "waterNeeds": "Medium",
            "kc": 0.75,
            "nutrientFocus": "Top-dress remaining Nitrogen followed immediately by deep earthing up.",
            "pestRisks": [
                  "late-blight",
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Earth up soil to cover stolons and prevent greening of tubers"
            ]
      },
      {
            "id": "tuber_bulking",
            "name": "Tuber Initiation & Bulking",
            "description": "Stolon tips swell into tubers. Rapid starch synthesis during cool nights.",
            "startDas": 46,
            "endDas": 75,
            "gddRequired": 850,
            "waterNeeds": "High",
            "kc": 1.15,
            "nutrientFocus": "Maintain constant soil moisture; dry spells cause tuber cracking.",
            "pestRisks": [
                  "late-blight",
                  "early-blight"
            ],
            "scoutingChecklist": [
                  "Check lower leaves for dark water-soaked late blight lesions"
            ]
      },
      {
            "id": "skin_curing",
            "name": "Tuber Maturation & Skin Curing",
            "description": "Haulms (vines) yellow or cut down. Tuber skin thickens and cures.",
            "startDas": 76,
            "endDas": 95,
            "gddRequired": 1150,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "Stop irrigation 10-12 days before harvest; dehaulm to firm tuber skin.",
            "pestRisks": [
                  "Tuber rot"
            ],
            "scoutingChecklist": [
                  "Rub thumbnail on tuber skin; if skin does not peel, ready for digging"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('potato'))
  },
  {
    id: 'soybean',
    name: 'Soybean (Bhatma)',
    scientificName: 'Glycine max',
    category: 'Legume',
    icon: '🌱',
    baseTemp: 10.0,
    optimalTempRange: [20, 30],
    totalDaysToMaturity: 95,
    growingPeriodRange: [85, 110],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [450, 700],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Black Cotton", "Clay Loam"],
    soilPhRange: [6.0, 7.5],
    optimalElevationM: [0, 1000],
    primarySuitabilityAreas: [
      "Madhya Pradesh (Indore, Ujjain, Dewas, Sehore - Soybean State of India)",
      "Maharashtra (Latur, Nanded, Akola, Amravati, Washim Marathwada-Vidarbha belt)",
      "Rajasthan (Kota, Baran, Jhalawar Hadoti region)"
],
    otherSuitabilityAreas: [
      "Karnataka (Belagavi, Bidar, Dharwad)",
      "Telangana (Adilabad, Nizamabad, Kamareddy)",
      "Gujarat (Dahod, Panchmahal, Sabarkantha)",
      "Chhattisgarh (Rajnandgaon, Durg, Bemetara)",
      "Andhra Pradesh (Adilabad borders)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Wet Season",
            "months": "June (Second fortnight) - July",
            "agroEcologicalZone": "Black soils of Central & Western India",
            "notes": "Sow after 75-100mm monsoon rainfall has saturated root zone; inoculate with Bradyrhizobium."
      }
],
    yieldExpectation: '2.0 - 3.2 tonnes/hectare',
    stages: [
      {
            "id": "emergence",
            "name": "Emergence & Unifoliate (VE-VC)",
            "description": "Cotyledons emerge pulling hypocotyl upward; first unifoliate leaves unfold.",
            "startDas": 0,
            "endDas": 12,
            "gddRequired": 140,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal DAP and single super phosphate (SSP for Sulfur). Seed Rhizobium culture.",
            "pestRisks": [
                  "Stem fly"
            ],
            "scoutingChecklist": [
                  "Check root nodulation at 15-20 DAS",
                  "Look for stem fly wilting"
            ]
      },
      {
            "id": "trifoliate",
            "name": "Trifoliate Vegetative (V1-V4)",
            "description": "True trifoliate leaves emerge rapidly. Nitrogen-fixing root nodules become active pink.",
            "startDas": 13,
            "endDas": 35,
            "gddRequired": 420,
            "waterNeeds": "Medium",
            "kc": 0.75,
            "nutrientFocus": "Critical weed control window; apply pre-emergence or early post-emergence herbicide.",
            "pestRisks": [
                  "Girdle beetle",
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Look for ring girdles cut on stems by Girdle beetle"
            ]
      },
      {
            "id": "flowering_pod",
            "name": "Flowering & Pod Initiation (R1-R3)",
            "description": "Small purple/white flowers open in axils; flat green pods begin developing.",
            "startDas": 36,
            "endDas": 65,
            "gddRequired": 800,
            "waterNeeds": "High",
            "kc": 1.1,
            "nutrientFocus": "Avoid moisture stress during flowering; foliar spray of 19-19-19 or Boron.",
            "pestRisks": [
                  "pod-borer",
                  "Spodoptera litura"
            ],
            "scoutingChecklist": [
                  "Check defoliating caterpillars and pod entry holes"
            ]
      },
      {
            "id": "seed_fill_maturity",
            "name": "Full Seed & Pod Maturity (R5-R8)",
            "description": "Beans swell to maximum volume. Leaves yellow, senesce, and drop cleanly off stems.",
            "startDas": 66,
            "endDas": 95,
            "gddRequired": 1250,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "Harvest when pods rattle when shaken; delay causes pod shattering.",
            "pestRisks": [
                  "Pod blight"
            ],
            "scoutingChecklist": [
                  "Check grain moisture ~14% for harvesting"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('soybean'))
  },
  {
    id: 'pigeon-pea',
    name: 'Pigeon Pea (Arhar / Tur)',
    scientificName: 'Cajanus cajan',
    category: 'Legume',
    icon: '🌿',
    baseTemp: 10.0,
    optimalTempRange: [20, 35],
    totalDaysToMaturity: 160,
    growingPeriodRange: [140, 180],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [500, 750],
    droughtTolerance: 'High',
    suitableSoils: ["Black Cotton", "Clay Loam", "Red Laterite"],
    soilPhRange: [6.0, 8.0],
    optimalElevationM: [0, 1800],
    primarySuitabilityAreas: [
      "Maharashtra (Latur, Nanded, Akola, Yavatmal, Osmanabad)",
      "Karnataka (Kalaburagi Tur Bowl of Karnataka, Bidar, Yadgir)",
      "Madhya Pradesh (Narsinghpur, Chhindwara, Hoshangabad)"
],
    otherSuitabilityAreas: [
      "Uttar Pradesh (Bundelkhand, Kanpur Dehat, Fatehpur)",
      "Gujarat (Bharuch, Vadodara, Panchmahal)",
      "Telangana (Adilabad, Vikarabad, Rangareddy)",
      "Andhra Pradesh (Prakasam, Guntur)",
      "Bihar (Bhojpur, Rohtas)",
      "Odisha (Kalahandi, Rayagada)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Rainfed & semi-arid central and southern India",
            "notes": "Sow with onset of monsoon; deep taproot penetrates heavy clay cracking soils."
      }
],
    yieldExpectation: '1.5 - 2.8 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Seedling & Canopy Establishment",
            "description": "Slow initial aboveground growth while taproot drives 1-2 meters deep.",
            "startDas": 0,
            "endDas": 45,
            "gddRequired": 450,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal DAP and Rhizobium culture; intercropped with soybean, cotton, or sorghum.",
            "pestRisks": [
                  "aphids"
            ],
            "scoutingChecklist": [
                  "Weed control in first 35 days",
                  "Check nodulation"
            ]
      },
      {
            "id": "branching",
            "name": "Profuse Branching & Canopy Expansion",
            "description": "Bushy indeterminate canopy spreads vigorously.",
            "startDas": 46,
            "endDas": 95,
            "gddRequired": 1050,
            "waterNeeds": "Medium",
            "kc": 0.8,
            "nutrientFocus": "Sulfur top-dressing; nil nitrogen needed due to deep symbiotic nodules.",
            "pestRisks": [
                  "whitefly",
                  "Sterility mosaic mite"
            ],
            "scoutingChecklist": [
                  "Look for pale yellow bushy leaves caused by Sterility Mosaic"
            ]
      },
      {
            "id": "flowering_pod",
            "name": "Flowering & Pod Formation",
            "description": "Abundant yellow-and-red flowers open. Critical pest management period in tur!",
            "startDas": 96,
            "endDas": 135,
            "gddRequired": 1600,
            "waterNeeds": "High",
            "kc": 1.1,
            "nutrientFocus": "Foliar spray of 2% DAP or Potassium Nitrate at 50% flowering.",
            "pestRisks": [
                  "pod-borer",
                  "Maruca vitrata"
            ],
            "scoutingChecklist": [
                  "Install pheromone traps",
                  "Check webs and bored pods"
            ]
      },
      {
            "id": "maturity",
            "name": "Pod Hardening & Senescence",
            "description": "Pods turn mottled brown. Grains harden ready for dhal milling.",
            "startDas": 136,
            "endDas": 160,
            "gddRequired": 2000,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "Harvest when 80% pods have dried to brown.",
            "pestRisks": [
                  "Bruchild beetle"
            ],
            "scoutingChecklist": [
                  "Check moisture content before storage"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('pigeon-pea'))
  },
  {
    id: 'green-gram',
    name: 'Green Gram (Moong)',
    scientificName: 'Vigna radiata',
    category: 'Legume',
    icon: '🟢',
    baseTemp: 10.0,
    optimalTempRange: [25, 35],
    totalDaysToMaturity: 68,
    growingPeriodRange: [60, 75],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [250, 400],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Sandy Loam", "Clay Loam"],
    soilPhRange: [6.2, 7.5],
    optimalElevationM: [0, 1500],
    primarySuitabilityAreas: [
      "Rajasthan (Nagaur, Jaipur, Ajmer, Pali)",
      "Madhya Pradesh (Hoshangabad, Harda, Sehore summer moong)",
      "Maharashtra (Jalna, Beed, Latur, Parbhani)"
],
    otherSuitabilityAreas: [
      "Karnataka (Gadag, Dharwad, Koppal)",
      "Bihar (Purnea, Katihar, Bhagalpur)",
      "Punjab & Haryana (Ludhiana, Hisar short summer window)",
      "Gujarat (Kutch, Surendranagar)",
      "Andhra Pradesh (Guntur, Krishna)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Rajasthan & Peninsular India",
            "notes": "Rainfed kharif crop with rapid maturity."
      },
      {
            "seasonName": "Zaid / Summer Moong",
            "months": "March - April",
            "agroEcologicalZone": "Indo-Gangetic Plains (MP, Punjab, Haryana, UP, Bihar)",
            "notes": "Catch crop sown after wheat harvest with 3-4 irrigations; high yields and fixes atmospheric nitrogen."
      }
],
    yieldExpectation: '1.0 - 1.8 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Emergence & Seedling (0-15 DAS)",
            "description": "Rapid germination and trifoliate leaf establishment.",
            "startDas": 0,
            "endDas": 15,
            "gddRequired": 180,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal Single Super Phosphate (SSP) and Rhizobium seed inoculation.",
            "pestRisks": [
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Scout for whiteflies transmitting Yellow Mosaic Virus"
            ]
      },
      {
            "id": "vegetative_flower",
            "name": "Branching & Peak Flowering (16-40 DAS)",
            "description": "Profuse yellow flowers open within 30-35 days.",
            "startDas": 16,
            "endDas": 40,
            "gddRequired": 450,
            "waterNeeds": "Medium",
            "kc": 0.9,
            "nutrientFocus": "Foliar spray of 1% DAP or Micronutrients.",
            "pestRisks": [
                  "pod-borer",
                  "powdery-mildew"
            ],
            "scoutingChecklist": [
                  "Inspect buds and developing green pods"
            ]
      },
      {
            "id": "pod_maturity",
            "name": "Pod Filling & Synchronous Harvest (41-68 DAS)",
            "description": "Cylindrical pods turn dark brown/black. Ripe seeds ready for picking.",
            "startDas": 41,
            "endDas": 68,
            "gddRequired": 800,
            "waterNeeds": "Low",
            "kc": 0.55,
            "nutrientFocus": "Stop irrigation as pods start blackening to avoid secondary vegetative flush.",
            "pestRisks": [
                  "pod-borer"
            ],
            "scoutingChecklist": [
                  "Harvest when 85% pods turn black"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('green-gram'))
  },
  {
    id: 'black-gram',
    name: 'Black Gram (Urad)',
    scientificName: 'Vigna mungo',
    category: 'Legume',
    icon: '⚫',
    baseTemp: 10.0,
    optimalTempRange: [25, 35],
    totalDaysToMaturity: 75,
    growingPeriodRange: [70, 85],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [300, 450],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Black Cotton", "Clay Loam"],
    soilPhRange: [6.5, 7.8],
    optimalElevationM: [0, 1200],
    primarySuitabilityAreas: [
      "Madhya Pradesh (Damoh, Sagar, Jabalpur, Narsinghpur)",
      "Uttar Pradesh (Jhansi, Lalitpur, Jalaun Bundelkhand)",
      "Andhra Pradesh (Guntur, Krishna rice-fallow urad)"
],
    otherSuitabilityAreas: [
      "Tamil Nadu (Thanjavur, Tiruvarur delta fallow)",
      "Maharashtra (Nanded, Latur, Osmanabad)",
      "Rajasthan (Bhilwara, Chittorgarh)",
      "West Bengal (Murshidabad, Nadia)",
      "Gujarat (Panchmahal, Dahod)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Central & Northern India",
            "notes": "Main rainfed crop on black and loamy soils."
      },
      {
            "seasonName": "Rabi / Rice Fallow Urad",
            "months": "October - November",
            "agroEcologicalZone": "Coastal Andhra Pradesh & Tamil Nadu Cauvery Delta",
            "notes": "Relay sown in standing rice 3-5 days before paddy harvest, utilizing residual soil moisture."
      }
],
    yieldExpectation: '0.9 - 1.6 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Seedling & Trifoliate (0-18 DAS)",
            "description": "Initial vegetative development with dark green hairy leaves.",
            "startDas": 0,
            "endDas": 18,
            "gddRequired": 200,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal Phosphorus and Sulfur; Rhizobium culture.",
            "pestRisks": [
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Yellow Mosaic Virus detection on young trifoliate leaves"
            ]
      },
      {
            "id": "flowering",
            "name": "Branching & Flowering (19-45 DAS)",
            "description": "Yellow flowers develop in tight clusters.",
            "startDas": 19,
            "endDas": 45,
            "gddRequired": 500,
            "waterNeeds": "Medium",
            "kc": 0.9,
            "nutrientFocus": "Foliar 2% DAP spray at flower initiation.",
            "pestRisks": [
                  "pod-borer",
                  "powdery-mildew"
            ],
            "scoutingChecklist": [
                  "Check flower drop and pod borer larvae"
            ]
      },
      {
            "id": "pod_maturity",
            "name": "Pod Darkening & Harvest (46-75 DAS)",
            "description": "Cylindrical hairy pods turn dull black.",
            "startDas": 46,
            "endDas": 75,
            "gddRequired": 900,
            "waterNeeds": "Low",
            "kc": 0.55,
            "nutrientFocus": "Harvest in early morning to prevent pod shattering.",
            "pestRisks": [
                  "Pod borer"
            ],
            "scoutingChecklist": [
                  "Pick when pods turn black and dry"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('black-gram'))
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (Ganna)',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crop',
    icon: '🎋',
    baseTemp: 12.0,
    optimalTempRange: [24, 38],
    totalDaysToMaturity: 330,
    growingPeriodRange: [300, 360],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [1500, 2200],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Clay Loam", "Black Cotton", "Silty Clay"],
    soilPhRange: [6.5, 8.0],
    optimalElevationM: [0, 1000],
    primarySuitabilityAreas: [
      "Uttar Pradesh (Muzaffarnagar, Meerut, Bijnor, Lakhimpur Kheri, Bareilly)",
      "Maharashtra (Kolhapur, Pune, Ahmednagar, Satara, Solapur sugar belt)",
      "Karnataka (Belagavi, Mandya, Bagalkot, Mysuru)"
],
    otherSuitabilityAreas: [
      "Tamil Nadu (Cuddalore, Villupuram, Erode)",
      "Bihar (West Champaran, Gopalganj, Sitamarhi)",
      "Gujarat (Surat, Navsari, Bharuch)",
      "Andhra Pradesh (Visakhapatnam, West Godavari)",
      "Punjab (Jalandhar, Gurdaspur)",
      "Haryana (Yamunanagar, Karnal)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Autumn Planting",
            "months": "October - November",
            "agroEcologicalZone": "Northern & Central India Plains",
            "notes": "Gives 15-20% higher cane yield and sugar recovery compared to spring planting."
      },
      {
            "seasonName": "Spring Planting",
            "months": "February - March",
            "agroEcologicalZone": "Subtropical India (UP, Punjab, Haryana, Bihar)",
            "notes": "Main planting season in Northern India after winter chills subside."
      },
      {
            "seasonName": "Eksali / Adsali",
            "months": "July - August (Adsali 18-month) or Jan - Feb (Eksali)",
            "agroEcologicalZone": "Tropical Maharashtra & Karnataka",
            "notes": "High tonnage cane grown under perennial canal or drip irrigation."
      }
],
    yieldExpectation: '70 - 120 tonnes/hectare',
    stages: [
      {
            "id": "germination",
            "name": "Sett Germination & Sprouting (0-45 DAS)",
            "description": "Buds on three-budded setts germinate; sett roots anchor.",
            "startDas": 0,
            "endDas": 45,
            "gddRequired": 450,
            "waterNeeds": "Medium",
            "kc": 0.5,
            "nutrientFocus": "Basal DAP and MOP; dip setts in Carbendazim and Trichoderma.",
            "pestRisks": [
                  "Early shoot borer",
                  "Termites"
            ],
            "scoutingChecklist": [
                  "Check % bud sprouting in furrows",
                  "Dead heart counts"
            ]
      },
      {
            "id": "tillering",
            "name": "Tillering & Formative Phase (46-120 DAS)",
            "description": "Mother shoots produce tillers. Critical for final millable stalk population.",
            "startDas": 46,
            "endDas": 120,
            "gddRequired": 1100,
            "waterNeeds": "High",
            "kc": 0.85,
            "nutrientFocus": "Split application of Urea; partial earthing up to suppress late tillers.",
            "pestRisks": [
                  "Early shoot borer",
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Check dead hearts",
                  "Irrigate every 8-10 days in summer"
            ]
      },
      {
            "id": "grand_growth",
            "name": "Grand Growth & Cane Elongation (121-270 DAS)",
            "description": "Canes elongate vertically at 1-2 cm per day. Stems thicken with internodes.",
            "startDas": 121,
            "endDas": 270,
            "gddRequired": 2400,
            "waterNeeds": "Critical",
            "kc": 1.25,
            "nutrientFocus": "Heavy water demand; trash mulching in alternate furrows to conserve soil moisture.",
            "pestRisks": [
                  "Top borer",
                  "fall-armyworm"
            ],
            "scoutingChecklist": [
                  "Trash detrashing of dry lower leaves",
                  "Propping canes against lodging"
            ]
      },
      {
            "id": "ripening",
            "name": "Ripening & Sugar Synthesis (271-330 DAS)",
            "description": "Vegetative growth slows down as sucrose accumulates rapidly in stalk pith.",
            "startDas": 271,
            "endDas": 330,
            "gddRequired": 3100,
            "waterNeeds": "Low",
            "kc": 0.75,
            "nutrientFocus": "Withhold irrigation 20 days prior to harvesting to maximize brix reading (>18%).",
            "pestRisks": [
                  "Pyrilla bug"
            ],
            "scoutingChecklist": [
                  "Brix refractometer check on middle internodes"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('sugarcane'))
  },
  {
    id: 'sesame',
    name: 'Sesame (Til)',
    scientificName: 'Sesamum indicum',
    category: 'Oilseed',
    icon: '🌻',
    baseTemp: 12.0,
    optimalTempRange: [25, 36],
    totalDaysToMaturity: 88,
    growingPeriodRange: [80, 95],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [300, 450],
    droughtTolerance: 'Extreme',
    suitableSoils: ["Sandy Loam", "Clay Loam", "Red Laterite"],
    soilPhRange: [5.5, 7.8],
    optimalElevationM: [0, 1200],
    primarySuitabilityAreas: [
      "Gujarat (Amreli, Bhavnagar, Junagadh, Rajkot)",
      "West Bengal (Nadia, Murshidabad, Hooghly summer til)",
      "Rajasthan (Pali, Nagaur, Jodhpur)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Chhatarpur, Tikamgarh, Rewa)",
      "Tamil Nadu (Villupuram, Cuddalore, Thanjavur)",
      "Uttar Pradesh (Jhansi, Hamirpur, Mahoba)",
      "Andhra Pradesh (Visakhapatnam, Srikakulam)",
      "Odisha (Mayurbhanj, Dhenkanal)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Western & Central dry tracts",
            "notes": "Rainfed kharif crop with exceptional heat and drought tolerance."
      },
      {
            "seasonName": "Summer / Pre-Monsoon Til",
            "months": "February - March",
            "agroEcologicalZone": "West Bengal, Odisha & Southern rice fallows",
            "notes": "Produces bright white high-oil seeds under sunny summer weather."
      }
],
    yieldExpectation: '0.6 - 1.2 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Emergence & Thinning (0-20 DAS)",
            "description": "Tiny seeds germinate; thinning to 10cm spacing is critical.",
            "startDas": 0,
            "endDas": 20,
            "gddRequired": 240,
            "waterNeeds": "Low",
            "kc": 0.35,
            "nutrientFocus": "Basal NPK and Sulfur.",
            "pestRisks": [
                  "Ants",
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Thinning at 12 DAS to prevent spindly growth"
            ]
      },
      {
            "id": "flowering",
            "name": "Branching & Tubular Flowering (21-55 DAS)",
            "description": "Foxglove-like tubular flowers open in leaf axils.",
            "startDas": 21,
            "endDas": 55,
            "gddRequired": 580,
            "waterNeeds": "Medium",
            "kc": 0.8,
            "nutrientFocus": "Top-dress remaining Nitrogen; foliar Boron spray.",
            "pestRisks": [
                  "Antigastra shoot borer",
                  "powdery-mildew"
            ],
            "scoutingChecklist": [
                  "Look for webbed leaves and bored capsules"
            ]
      },
      {
            "id": "capsule_maturity",
            "name": "Capsule Bulking & Harvest (56-88 DAS)",
            "description": "Four-chambered capsules ripen from base to top.",
            "startDas": 56,
            "endDas": 88,
            "gddRequired": 950,
            "waterNeeds": "Low",
            "kc": 0.45,
            "nutrientFocus": "Harvest when bottom capsules turn yellow before splitting.",
            "pestRisks": [
                  "Capsule shatter"
            ],
            "scoutingChecklist": [
                  "Tie cut sheaves upright in field shocks to dry"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('sesame'))
  },
  {
    id: 'cumin',
    name: 'Cumin (Jeera)',
    scientificName: 'Cuminum cyminum',
    category: 'Cash Crop',
    icon: '🧂',
    baseTemp: 5.0,
    optimalTempRange: [15, 26],
    totalDaysToMaturity: 110,
    growingPeriodRange: [100, 115],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [180, 300],
    droughtTolerance: 'High',
    suitableSoils: ["Sandy Loam", "Clay Loam"],
    soilPhRange: [6.8, 8.2],
    optimalElevationM: [0, 800],
    primarySuitabilityAreas: [
      "Gujarat (Unjha Asia\u2019s largest cumin seed mandi, Banaskantha, Patan, Surendranagar)",
      "Rajasthan (Jodhpur, Nagaur, Barmer, Jalore, Jaisalmer)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Mandsaur, Neemuch border tracts)",
      "Gujarat (Kutch, Morbi, Jamnagar)",
      "Rajasthan (Bikaner, Pali, Sirohi)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Rabi / Winter",
            "months": "November (First fortnight)",
            "agroEcologicalZone": "Arid & semi-arid dry winter regions of Gujarat & Rajasthan",
            "notes": "Requires cool, crisp dry climate; vulnerable to cloudy weather and high humidity."
      }
],
    yieldExpectation: '0.7 - 1.2 tonnes/hectare',
    stages: [
      {
            "id": "germination",
            "name": "Emergence & Thread-like Leaves (0-25 DAS)",
            "description": "Slow germination; fine thread-like cotyledons emerge.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 220,
            "waterNeeds": "Low",
            "kc": 0.35,
            "nutrientFocus": "Light irrigation for emergence; avoid crust formation.",
            "pestRisks": [
                  "Damping off"
            ],
            "scoutingChecklist": [
                  "Treat seeds with Trichoderma viride before sowing"
            ]
      },
      {
            "id": "vegetative_umbel",
            "name": "Branching & Umbel Flowering (26-70 DAS)",
            "description": "Umbel inflorescences bear tiny pink-white flowers.",
            "startDas": 26,
            "endDas": 70,
            "gddRequired": 600,
            "waterNeeds": "Medium",
            "kc": 0.75,
            "nutrientFocus": "Top-dress light Nitrogen; watch out for morning dew/cloudiness.",
            "pestRisks": [
                  "aphids",
                  "powdery-mildew",
                  "Alternaria blight"
            ],
            "scoutingChecklist": [
                  "Critical: Check for cumin blight during cloudy weather"
            ]
      },
      {
            "id": "seed_maturity",
            "name": "Seed Hardening & Harvest (71-110 DAS)",
            "description": "Aromatic ribbed seeds harden and turn light brownish gray.",
            "startDas": 71,
            "endDas": 110,
            "gddRequired": 1000,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Withhold all water as seeds mature to prevent fungal seed darkening.",
            "pestRisks": [
                  "Powdery mildew"
            ],
            "scoutingChecklist": [
                  "Harvest early morning by uprooting plants when seeds turn brown"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('cumin'))
  },
  {
    id: 'sorghum',
    name: 'Sorghum (Jowar)',
    scientificName: 'Sorghum bicolor',
    category: 'Cereal',
    icon: '🌾',
    baseTemp: 10.0,
    optimalTempRange: [22, 34],
    totalDaysToMaturity: 110,
    growingPeriodRange: [95, 120],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [350, 600],
    droughtTolerance: 'High',
    suitableSoils: ["Black Cotton", "Clay Loam", "Red Laterite"],
    soilPhRange: [5.5, 8.2],
    optimalElevationM: [0, 2200],
    primarySuitabilityAreas: [
      "Maharashtra (Solapur, Ahmednagar, Pune, Jalgaon, Osmanabad)",
      "Karnataka (Vijayapura, Bagalkot, Kalaburagi, Raichur)",
      "Andhra Pradesh & Telangana (Kurnool, Mahabubnagar)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Khargone, Khandwa, Barwani)",
      "Rajasthan (Ajmer, Pali, Tonk, Nagaur)",
      "Tamil Nadu (Coimbatore, Tiruppur, Dindigul)",
      "Gujarat (Banaskantha, Kutch, Surendranagar)",
      "Uttar Pradesh (Bundelkhand dry tracts)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Peninsular and Central India",
            "notes": "Rainfed grain and fodder sorghum with onset of monsoon."
      },
      {
            "seasonName": "Rabi / Winter Jowar (Maldandi)",
            "months": "September (Late) - October",
            "agroEcologicalZone": "Deep black soils of Maharashtra and Northern Karnataka",
            "notes": "Maldandi winter sorghum producing premium sweet pearly grain on conserved soil moisture."
      }
],
    yieldExpectation: '2.2 - 4.2 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Emergence & Seedling (Stage 0-1)",
            "description": "Leaves emerge. Vigorous root establishment.",
            "startDas": 0,
            "endDas": 20,
            "gddRequired": 220,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal NPK and seed treatment against shoot fly.",
            "pestRisks": [
                  "Sorghum shoot fly"
            ],
            "scoutingChecklist": [
                  "Look for dead heart symptoms caused by shoot fly in first 28 days"
            ]
      },
      {
            "id": "differentiation_boot",
            "name": "Growing Point Differentiation & Boot (Stage 2-4)",
            "description": "Panicle initiates deep inside stem; flag leaf expands fully.",
            "startDas": 21,
            "endDas": 60,
            "gddRequired": 680,
            "waterNeeds": "High",
            "kc": 0.85,
            "nutrientFocus": "Split Nitrogen top-dressing before boot stage.",
            "pestRisks": [
                  "stem-borer",
                  "fall-armyworm"
            ],
            "scoutingChecklist": [
                  "Check stem borer entry holes and pinhole leaf feeding"
            ]
      },
      {
            "id": "flowering_grain",
            "name": "Flowering & Grain Filling (Stage 5-7)",
            "description": "Panicles bloom from top downwards; seeds enter soft dough stage.",
            "startDas": 61,
            "endDas": 90,
            "gddRequired": 1150,
            "waterNeeds": "Critical",
            "kc": 1.1,
            "nutrientFocus": "Avoid moisture stress during anthesis to ensure plump grains.",
            "pestRisks": [
                  "Sorghum midge",
                  "Head bugs"
            ],
            "scoutingChecklist": [
                  "Inspect florets for midge fly activity in early morning"
            ]
      },
      {
            "id": "maturity",
            "name": "Physiological Maturity & Harvest (Stage 8-9)",
            "description": "Black spot appears at seed hilar base. Panicles turn golden.",
            "startDas": 91,
            "endDas": 110,
            "gddRequired": 1450,
            "waterNeeds": "Low",
            "kc": 0.55,
            "nutrientFocus": "Cut panicles and dry under sun for safe threshing.",
            "pestRisks": [
                  "Grain mold in unseasonal late rain"
            ],
            "scoutingChecklist": [
                  "Check black layer formation on grains"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('sorghum'))
  },
  {
    id: 'pearl-millet',
    name: 'Pearl Millet (Bajra)',
    scientificName: 'Pennisetum glaucum',
    category: 'Cereal',
    icon: '🌾',
    baseTemp: 10.0,
    optimalTempRange: [25, 38],
    totalDaysToMaturity: 85,
    growingPeriodRange: [75, 95],
    growingPeriodDurationCategory: 'Short (<90d)',
    waterRequirementMm: [250, 400],
    droughtTolerance: 'Extreme',
    suitableSoils: ["Sandy Loam", "Red Laterite", "Clay Loam"],
    soilPhRange: [6.0, 8.5],
    optimalElevationM: [0, 1800],
    primarySuitabilityAreas: [
      "Rajasthan (Jaipur, Barmer, Jodhpur, Nagaur, Alwar, Jhunjhunu)",
      "Uttar Pradesh (Agra, Aligarh, Firozabad, Budaun)",
      "Gujarat (Banaskantha, Sabarkantha, Anand)",
      "Haryana (Bhiwani, Mahendragarh, Hisar)"
],
    otherSuitabilityAreas: [
      "Maharashtra (Dhule, Nashik, Aurangabad, Ahmednagar dry tracts)",
      "Madhya Pradesh (Morena, Bhind, Sheopur)",
      "Karnataka (Bagalkot, Koppal, Vijayapura)",
      "Tamil Nadu (Villupuram, Cuddalore, Virudhunagar)",
      "Andhra Pradesh (Anantapur, Kurnool)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Arid & semi-arid dry zones across India",
            "notes": "Fastest growing cereal in arid lands; survives prolonged dry spells."
      },
      {
            "seasonName": "Summer Bajra",
            "months": "February - March",
            "agroEcologicalZone": "Gujarat & Western Rajasthan irrigated patches",
            "notes": "Grown under tube-well irrigation; yields high grain and green nutritious fodder."
      }
],
    yieldExpectation: '2.0 - 3.5 tonnes/hectare',
    stages: [
      {
            "id": "seedling",
            "name": "Seedling & Active Tillering",
            "description": "Rapid germination in hot dry soil; produces 3-5 vigorous basal tillers.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 280,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal Nitrogen and Zinc. Thinning to single plants at 15 DAS.",
            "pestRisks": [
                  "Shoot fly"
            ],
            "scoutingChecklist": [
                  "Thin out excess seedlings",
                  "Check shoot fly dead hearts"
            ]
      },
      {
            "id": "booting_flowering",
            "name": "Booting & Panicle Flowering",
            "description": "Stiff cylindrical spike emerges; protogynous flowers pollinate.",
            "startDas": 26,
            "endDas": 55,
            "gddRequired": 680,
            "waterNeeds": "Medium",
            "kc": 0.85,
            "nutrientFocus": "Split Nitrogen application at 30 DAS.",
            "pestRisks": [
                  "Downy mildew (Green ear)",
                  "Ergot"
            ],
            "scoutingChecklist": [
                  "Check floral spikes for green ear transformation or ergot honeydew"
            ]
      },
      {
            "id": "grain_maturity",
            "name": "Grain Hardening & Harvest",
            "description": "Caryopsis grains turn slate gray and harden inside protective glumes.",
            "startDas": 56,
            "endDas": 85,
            "gddRequired": 1150,
            "waterNeeds": "Low",
            "kc": 0.5,
            "nutrientFocus": "Harvest when grain moisture drops below 20%.",
            "pestRisks": [
                  "Birds"
            ],
            "scoutingChecklist": [
                  "Cut heads and dry on threshing floor"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('pearl-millet'))
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Bengal Gram / Chana)',
    scientificName: 'Cicer arietinum',
    category: 'Legume',
    icon: '🧆',
    baseTemp: 5.0,
    optimalTempRange: [15, 26],
    totalDaysToMaturity: 110,
    growingPeriodRange: [95, 125],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [250, 400],
    droughtTolerance: 'High',
    suitableSoils: ["Black Cotton", "Clay Loam", "Sandy Loam"],
    soilPhRange: [6.0, 8.0],
    optimalElevationM: [0, 2400],
    primarySuitabilityAreas: [
      "Madhya Pradesh (Vidisha, Ujjain, Sagar, Raisen - Pulse Bowl of MP)",
      "Maharashtra (Latur, Osmanabad, Nanded, Jalna)",
      "Rajasthan (Bikaner, Churu, Hanumangarh, Sri Ganganagar)",
      "Uttar Pradesh (Bundelkhand - Banda, Hamirpur, Jalaun)"
],
    otherSuitabilityAreas: [
      "Karnataka (Vijayapura, Kalaburagi, Bagalkot, Raichur)",
      "Andhra Pradesh (Kurnool, Anantapur, Prakasam)",
      "Gujarat (Jamnagar, Rajkot, Junagadh)",
      "Haryana (Bhiwani, Sirsa, Mahendragarh)",
      "Chhattisgarh (Rajnandgaon, Bemetara)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Rabi / Post-Monsoon Winter",
            "months": "October (Late) - November",
            "agroEcologicalZone": "Conserved residual subsoil moisture tracts across India",
            "notes": "Sow when soil temperature drops below 28\u00b0C; inoculate with Mesorhizobium ciceri."
      }
],
    yieldExpectation: '1.5 - 2.5 tonnes/hectare',
    stages: [
      {
            "id": "seedling_branching",
            "name": "Seedling & Primary Branching",
            "description": "Erect bushy growth with glandular hairs secreting malic and oxalic acids.",
            "startDas": 0,
            "endDas": 35,
            "gddRequired": 300,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal DAP and single super phosphate for root nodules.",
            "pestRisks": [
                  "Fusarium wilt",
                  "Cutworms"
            ],
            "scoutingChecklist": [
                  "Nipping/topping terminal buds at 30-35 DAS to stimulate profuse branching"
            ]
      },
      {
            "id": "flowering_pod",
            "name": "Flowering & Pod Formation",
            "description": "Small pinkish flowers develop into inflated rhomboid pods.",
            "startDas": 36,
            "endDas": 75,
            "gddRequired": 720,
            "waterNeeds": "Medium",
            "kc": 0.85,
            "nutrientFocus": "Critical irrigation stage if available; avoid over-watering which induces vegetative lodging.",
            "pestRisks": [
                  "pod-borer"
            ],
            "scoutingChecklist": [
                  "Install Helilure pheromone traps; scout for Helicoverpa caterpillars"
            ]
      },
      {
            "id": "pod_hardening",
            "name": "Pod Hardening & Senescence",
            "description": "Pods turn yellow-brown; seeds inside rattle when dry.",
            "startDas": 76,
            "endDas": 110,
            "gddRequired": 1200,
            "waterNeeds": "Low",
            "kc": 0.5,
            "nutrientFocus": "Pull plants early morning when dew prevents pod shattering.",
            "pestRisks": [
                  "Bruchild beetle"
            ],
            "scoutingChecklist": [
                  "Check seed moisture 10-12% for safe storage"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('chickpea'))
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut / Mungfali)',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed',
    icon: '🥜',
    baseTemp: 12.0,
    optimalTempRange: [24, 34],
    totalDaysToMaturity: 115,
    growingPeriodRange: [105, 125],
    growingPeriodDurationCategory: 'Medium (90-120d)',
    waterRequirementMm: [450, 650],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Sandy Loam", "Red Laterite", "Clay Loam"],
    soilPhRange: [5.8, 7.2],
    optimalElevationM: [0, 1200],
    primarySuitabilityAreas: [
      "Gujarat (Junagadh, Rajkot, Amreli, Jamnagar Saurashtra groundnut heartland)",
      "Andhra Pradesh (Anantapur, Chittoor, Kurnool Rayalaseema belt)",
      "Tamil Nadu (Tiruvannamalai, Villupuram, Vellore)",
      "Rajasthan (Bikaner, Jaipur)"
],
    otherSuitabilityAreas: [
      "Karnataka (Tumakuru, Ballari, Chitradurga, Belagavi)",
      "Telangana (Mahabubnagar, Gadwal, Wanaparthy)",
      "Maharashtra (Dhule, Jalgaon, Kolhapur, Satara)",
      "Odisha (Jajpur, Cuttack, Balasore coastal belt)",
      "Madhya Pradesh (Khargone, Shivpuri)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "June - July",
            "agroEcologicalZone": "Light sandy and red soils across India",
            "notes": "Requires friable loose topsoil so developing pegs can easily enter the ground."
      },
      {
            "seasonName": "Rabi / Summer Groundnut",
            "months": "November - December (Rabi) or Jan - Feb (Summer)",
            "agroEcologicalZone": "Gujarat Saurashtra & Coastal AP/Tamil Nadu",
            "notes": "High yield summer peanut with assured sprinkler irrigation and high sunshine hours."
      }
],
    yieldExpectation: '2.0 - 3.8 tonnes/hectare in-shell pods',
    stages: [
      {
            "id": "emergence",
            "name": "Emergence & Early Branching",
            "description": "Seedlings emerge; quadrifoliate leaves unfold on spreading branches.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 260,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal Phosphorus and Gypsum (200 kg/ha) at sowing.",
            "pestRisks": [
                  "White grub",
                  "Collart rot"
            ],
            "scoutingChecklist": [
                  "Check uniform emergence",
                  "Look for wilted plants pulled by white grubs"
            ]
      },
      {
            "id": "pegging",
            "name": "Flowering & Peg Penetration",
            "description": "Bright orange flowers self-pollinate; gynophores (pegs) elongate and push down into soil.",
            "startDas": 26,
            "endDas": 60,
            "gddRequired": 650,
            "waterNeeds": "Critical",
            "kc": 0.85,
            "nutrientFocus": "Crucial: Apply Gypsum (200 kg/ha) at 40-45 DAS to provide Calcium for pod shell formation.",
            "pestRisks": [
                  "tikka-leaf-spot",
                  "Spodoptera litura"
            ],
            "scoutingChecklist": [
                  "Avoid inter-cultivation/hoeing after pegging starts to avoid breaking pegs"
            ]
      },
      {
            "id": "pod_bulking",
            "name": "Sub-surface Pod Bulking & Maturity",
            "description": "Peg tips expand horizontally underground into 2-kernel pods.",
            "startDas": 61,
            "endDas": 115,
            "gddRequired": 1350,
            "waterNeeds": "High",
            "kc": 1.05,
            "nutrientFocus": "Ensure moist topsoil so pegs can absorb calcium directly from soil water.",
            "pestRisks": [
                  "tikka-leaf-spot",
                  "Rust"
            ],
            "scoutingChecklist": [
                  "Pull 3 test plants; scrape inner shell: dark brown/black inner wall means ripe"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('groundnut'))
  },
  {
    id: 'chili',
    name: 'Chili / Hot Pepper (Mirch)',
    scientificName: 'Capsicum annuum',
    category: 'Cash Crop',
    icon: '🌶️',
    baseTemp: 12.0,
    optimalTempRange: [22, 33],
    totalDaysToMaturity: 140,
    growingPeriodRange: [120, 160],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [500, 750],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Black Cotton", "Clay Loam", "Sandy Loam", "Red Laterite"],
    soilPhRange: [6.2, 7.8],
    optimalElevationM: [0, 2000],
    primarySuitabilityAreas: [
      "Andhra Pradesh (Guntur Asia\u2019s largest dry chili yard, Prakasam, Krishna)",
      "Telangana (Khammam, Warangal, Mahabubabad)",
      "Karnataka (Byadagi, Haveri, Dharwad GI Byadgi chili belt)"
],
    otherSuitabilityAreas: [
      "Madhya Pradesh (Khargone, Barwani Bedia chili market)",
      "Rajasthan (Jodhpur, Nagaur Mathania chili)",
      "West Bengal (Cooch Behar, Jalpaiguri)",
      "Maharashtra (Nandurbar, Nagpur)",
      "Odisha (Ganjam, Sambalpur)",
      "Gujarat (Anand, Vadodara)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Monsoon",
            "months": "July - August (Transplanting)",
            "agroEcologicalZone": "Southern & Central Indian dry spice belts",
            "notes": "Ridge and furrow transplanting; multiple pickings over 3-4 months."
      },
      {
            "seasonName": "Rabi / Winter",
            "months": "October - November",
            "agroEcologicalZone": "Frost-free peninsular plains",
            "notes": "Produces bright color retention and high oleoresin content."
      }
],
    yieldExpectation: '2.5 - 4.5 tonnes/hectare dry pods (irrigated)',
    stages: [
      {
            "id": "transplant",
            "name": "Transplanting & Establishment",
            "description": "4-5 week old nursery seedlings planted on raised ridges with furrow irrigation.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 280,
            "waterNeeds": "Medium",
            "kc": 0.5,
            "nutrientFocus": "Basal DAP, MOP, and Neem cake. Drench roots with Trichoderma.",
            "pestRisks": [
                  "Thrips",
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Blue sticky traps for thrips; yellow sticky traps for whiteflies"
            ]
      },
      {
            "id": "branching_squaring",
            "name": "Canopy Branching & Squaring",
            "description": "Dichotomous branching; white flowers initiate in axils.",
            "startDas": 26,
            "endDas": 60,
            "gddRequired": 680,
            "waterNeeds": "High",
            "kc": 0.8,
            "nutrientFocus": "Split Nitrogen top-dress; foliar Micronutrient spray with Zinc and Boron.",
            "pestRisks": [
                  "Thrips",
                  "early-blight"
            ],
            "scoutingChecklist": [
                  "Check upward leaf curling caused by thrips (Murda disease)"
            ]
      },
      {
            "id": "flowering_fruiting",
            "name": "Flowering & Fruit Setting",
            "description": "Continuous flushes of flowers and glossy green elongated pods.",
            "startDas": 61,
            "endDas": 100,
            "gddRequired": 1200,
            "waterNeeds": "Critical",
            "kc": 1.1,
            "nutrientFocus": "Foliar Potassium Nitrate (13-0-45) and Calcium to prevent fruit rot.",
            "pestRisks": [
                  "pod-borer",
                  "Anthracnose (Die back)"
            ],
            "scoutingChecklist": [
                  "Check fruit tips for circular sunken necrotic spots (Die back)"
            ]
      },
      {
            "id": "ripening_harvest",
            "name": "Pod Ripening & Multiple Pickings",
            "description": "Pods ripen from deep green to bright red. Picked at 10-15 day intervals.",
            "startDas": 101,
            "endDas": 140,
            "gddRequired": 1650,
            "waterNeeds": "Medium",
            "kc": 0.85,
            "nutrientFocus": "Maintain light irrigations between pickings; sun dry on clean tarpaulins.",
            "pestRisks": [
                  "Fruit rot"
            ],
            "scoutingChecklist": [
                  "Harvest ripe red pods with stalks attached"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('chili'))
  },
  {
    id: 'eggplant',
    name: 'Eggplant (Brinjal / Baingan)',
    scientificName: 'Solanum melongena',
    category: 'Vegetable',
    icon: '🍆',
    baseTemp: 12.0,
    optimalTempRange: [22, 32],
    totalDaysToMaturity: 130,
    growingPeriodRange: [110, 150],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [450, 700],
    droughtTolerance: 'Moderate',
    suitableSoils: ["Clay Loam", "Sandy Loam", "Black Cotton"],
    soilPhRange: [5.8, 7.5],
    optimalElevationM: [0, 1800],
    primarySuitabilityAreas: [
      "West Bengal (Nadia, North 24 Parganas, Hooghly)",
      "Odisha (Ganjam, Cuttack, Balasore)",
      "Gujarat (Anand, Vadodara, Kheda)",
      "Bihar (Vaishali, Samastipur, Muzaffarpur)"
],
    otherSuitabilityAreas: [
      "Karnataka (Belagavi, Kolar, Haveri)",
      "Maharashtra (Pune, Nashik, Ahmednagar)",
      "Uttar Pradesh (Varanasi, Lucknow peri-urban vegetable clusters)",
      "Andhra Pradesh (Krishna, Guntur)",
      "Tamil Nadu (Dharmapuri, Salem)"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Kharif / Rainy Season",
            "months": "June - July",
            "agroEcologicalZone": "All India warm tropical plains",
            "notes": "Transplant seedlings on raised ridges to avoid monsoon stem rot."
      },
      {
            "seasonName": "Rabi / Winter",
            "months": "October - November",
            "agroEcologicalZone": "Plains of Eastern & Southern India",
            "notes": "Main winter crop with high glossy fruit production."
      },
      {
            "seasonName": "Summer / Spring",
            "months": "February - March",
            "agroEcologicalZone": "Irrigated tracts across India",
            "notes": "Requires frequent light irrigations and shoot borer protection."
      }
],
    yieldExpectation: '25 - 45 tonnes/hectare',
    stages: [
      {
            "id": "transplant",
            "name": "Transplant & Early Canopy",
            "description": "Seedlings establish deep roots and thick herbaceous stems.",
            "startDas": 0,
            "endDas": 25,
            "gddRequired": 280,
            "waterNeeds": "Medium",
            "kc": 0.5,
            "nutrientFocus": "Basal NPK and FYM in planting pits.",
            "pestRisks": [
                  "whitefly"
            ],
            "scoutingChecklist": [
                  "Yellow sticky traps for whitefly vectors"
            ]
      },
      {
            "id": "flowering",
            "name": "Flowering & Continuous Fruit Set",
            "description": "Star-shaped violet flowers open; glossy calyx forms fruit base.",
            "startDas": 26,
            "endDas": 65,
            "gddRequired": 750,
            "waterNeeds": "High",
            "kc": 0.9,
            "nutrientFocus": "Top-dress Nitrogen and Potash after first harvest flush.",
            "pestRisks": [
                  "Brinjal shoot & fruit borer (Leucinodes orbonalis)"
            ],
            "scoutingChecklist": [
                  "Clip drooping withered shoots containing shoot borer larvae and bury them"
            ]
      },
      {
            "id": "harvesting",
            "name": "Multiple Flushes & Extended Harvesting",
            "description": "Fruits harvested when tender, firm, and with high gloss before seeds harden.",
            "startDas": 66,
            "endDas": 130,
            "gddRequired": 1500,
            "waterNeeds": "High",
            "kc": 1.05,
            "nutrientFocus": "Light irrigation after every harvest picking keeps plants in vegetative flush.",
            "pestRisks": [
                  "fruit-borer",
                  "powdery-mildew"
            ],
            "scoutingChecklist": [
                  "Harvest every 4-5 days before fruits lose glossiness"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('eggplant'))
  },
  {
    id: 'cassava',
    name: 'Cassava (Tapioca / Maravalli)',
    scientificName: 'Manihot esculenta',
    category: 'Tuber',
    icon: '🍠',
    baseTemp: 13.0,
    optimalTempRange: [25, 35],
    totalDaysToMaturity: 270,
    growingPeriodRange: [240, 300],
    growingPeriodDurationCategory: 'Long (>120d)',
    waterRequirementMm: [500, 900],
    droughtTolerance: 'Extreme',
    suitableSoils: ["Red Laterite", "Sandy Loam", "Clay Loam"],
    soilPhRange: [5.0, 7.0],
    optimalElevationM: [0, 1500],
    primarySuitabilityAreas: [
      "Kerala (Kollam, Thiruvananthapuram, Pathanamthitta, Malappuram)",
      "Tamil Nadu (Salem - Sago Tapioca capital, Namakkal, Dharmapuri, Erode)",
      "Andhra Pradesh (East & West Godavari)"
],
    otherSuitabilityAreas: [
      "Assam & Meghalaya (Warm humid hill terraces)",
      "Odisha (Gajapati, Koraput, Rayagada)",
      "Karnataka (Dakshina Kannada, Udupi, Uttara Kannada)",
      "Tripura & Mizoram"
],
    plantingSeasonWindows: [
      {
            "seasonName": "Main Rainy Season",
            "months": "May - June (Pre-monsoon)",
            "agroEcologicalZone": "Western Ghats, Coastal Kerala & Tamil Nadu",
            "notes": "Planted using stem setts on mounds or ridges."
      },
      {
            "seasonName": "September / Autumn",
            "months": "September - October",
            "agroEcologicalZone": "Irrigated Salem / Tamil Nadu sago processing cluster",
            "notes": "Grown under drip irrigation for industrial starch extraction."
      }
],
    yieldExpectation: '25 - 40 tonnes/hectare fresh tubers',
    stages: [
      {
            "id": "sprouting",
            "name": "Stem Sprouting & Fibrous Rooting",
            "description": "Stem setts sprout buds and produce fibrous adventitious roots.",
            "startDas": 0,
            "endDas": 45,
            "gddRequired": 450,
            "waterNeeds": "Low",
            "kc": 0.4,
            "nutrientFocus": "Basal FYM and wood ash (Potash); dip setts in copper fungicide.",
            "pestRisks": [
                  "whitefly",
                  "Termites"
            ],
            "scoutingChecklist": [
                  "Check % sett sprouting",
                  "Monitor for Cassava Mosaic Virus transmitted by whitefly"
            ]
      },
      {
            "id": "canopy_bulking",
            "name": "Canopy Expansion & Tuber Bulking",
            "description": "Dense palmate leaves expand; 4-8 fibrous roots swell into starch tubers.",
            "startDas": 46,
            "endDas": 180,
            "gddRequired": 1800,
            "waterNeeds": "Medium",
            "kc": 0.8,
            "nutrientFocus": "Heavy Potash application (MOP 100 kg/ha) essential for tuber starch synthesis.",
            "pestRisks": [
                  "whitefly",
                  "Red spider mites"
            ],
            "scoutingChecklist": [
                  "Scout leaf undersides for spider mites during dry periods"
            ]
      },
      {
            "id": "maturity",
            "name": "Peak Tuber Bulking & Flexible Harvest Window",
            "description": "Tubers achieve maximum starch density. Flexible harvest window of 3-4 months.",
            "startDas": 181,
            "endDas": 270,
            "gddRequired": 2800,
            "waterNeeds": "Low",
            "kc": 0.6,
            "nutrientFocus": "Tops defoliate naturally; can be harvested based on sago mill demand.",
            "pestRisks": [
                  "Tuber rot in waterlogged depressions"
            ],
            "scoutingChecklist": [
                  "Dig sample plant to evaluate tuber thickness and starch content"
            ]
      }
],
    commonPests: PEST_DATABASE.filter(p => p.cropsAffected.includes('cassava'))
  }
];

export const PRESET_FARM_LOCATIONS = [
  {
    "name": "Ludhiana, Punjab",
    "region": "Indo-Gangetic Plain",
    "country": "India",
    "lat": 30.901,
    "lon": 75.8573,
    "elevation": 247,
    "majorCrops": [
      "Wheat",
      "Rice (Paddy)",
      "Cotton",
      "Maize",
      "Mustard",
      "Potato"
    ]
  },
  {
    "name": "Nashik",
    "region": "Maharashtra",
    "country": "India",
    "lat": 19.9975,
    "lon": 73.7898,
    "elevation": 600,
    "majorCrops": [
      "Onion",
      "Tomato",
      "Soybean",
      "Chili",
      "Groundnut",
      "Sugarcane"
    ]
  },
  {
    "name": "Guntur",
    "region": "Andhra Pradesh",
    "country": "India",
    "lat": 16.3067,
    "lon": 80.4365,
    "elevation": 33,
    "majorCrops": [
      "Chili",
      "Cotton",
      "Rice",
      "Black Gram",
      "Tobacco",
      "Chickpea"
    ]
  },
  {
    "name": "Karnal",
    "region": "Haryana",
    "country": "India",
    "lat": 29.6857,
    "lon": 76.9905,
    "elevation": 252,
    "majorCrops": [
      "Wheat",
      "Rice (Basmati)",
      "Mustard",
      "Sugarcane",
      "Potato"
    ]
  },
  {
    "name": "Indore",
    "region": "Madhya Pradesh",
    "country": "India",
    "lat": 22.7196,
    "lon": 75.8577,
    "elevation": 553,
    "majorCrops": [
      "Soybean",
      "Wheat (Sharbati)",
      "Chickpea",
      "Onion",
      "Potato"
    ]
  },
  {
    "name": "Kalaburagi",
    "region": "Karnataka",
    "country": "India",
    "lat": 17.3297,
    "lon": 76.8343,
    "elevation": 454,
    "majorCrops": [
      "Pigeon Pea (Tur)",
      "Sorghum (Jowar)",
      "Chickpea",
      "Green Gram",
      "Cotton"
    ]
  },
  {
    "name": "Bharatpur",
    "region": "Rajasthan",
    "country": "India",
    "lat": 27.2152,
    "lon": 77.503,
    "elevation": 183,
    "majorCrops": [
      "Mustard",
      "Pearl Millet (Bajra)",
      "Wheat",
      "Green Gram",
      "Sesame"
    ]
  },
  {
    "name": "Burdwan (Purba Bardhaman)",
    "region": "West Bengal",
    "country": "India",
    "lat": 23.2324,
    "lon": 87.8615,
    "elevation": 30,
    "majorCrops": [
      "Rice (Paddy)",
      "Potato",
      "Sesame",
      "Mustard",
      "Eggplant"
    ]
  },
  {
    "name": "Farrukhabad",
    "region": "Uttar Pradesh",
    "country": "India",
    "lat": 27.3826,
    "lon": 79.5828,
    "elevation": 156,
    "majorCrops": [
      "Potato",
      "Wheat",
      "Maize",
      "Sugarcane",
      "Watermelon"
    ]
  },
  {
    "name": "Muzaffarpur",
    "region": "Bihar",
    "country": "India",
    "lat": 26.1209,
    "lon": 85.3647,
    "elevation": 60,
    "majorCrops": [
      "Maize (Rabi & Kharif)",
      "Rice",
      "Wheat",
      "Litchi",
      "Vegetables"
    ]
  }
];
