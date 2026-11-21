// Comprehensive agronomic profile based on Indian Council of Agricultural Research (ICAR) benchmarks
export const CROPS_DATABASE = [
  {
    id: 'maize',
    name: 'Maize (मक्का / Corn)',
    hindiName: 'मक्का',
    category: 'Cereal',
    season: 'Kharif',
    growthDurationDays: '90–120 days',
    idealConditions: {
      N: { min: 70, max: 110, opt: 90 },
      P: { min: 40, max: 65, opt: 50 },
      K: { min: 20, max: 55, opt: 45 },
      ph: { min: 5.8, max: 7.4, opt: 6.5 },
      temperature: { min: 18, max: 32, opt: 24 },
      humidity: { min: 55, max: 80, opt: 65 },
      rainfall: { min: 60, max: 160, opt: 90 }
    },
    soilTypes: ['Well-drained Loam', 'Sandy Loam', 'Alluvial'],
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '50-60 kg / acre (applied in 3 splits: basal, knee-high, tasseling)',
      dap: '35-40 kg / acre (at basal preparation)',
      mop: '20-25 kg / acre (potash at planting)'
    },
    irrigationGuidance: 'Maize is sensitive to waterlogging. Ensure furrow drainage. Critical irrigation stages: Tasseling and Silking.',
    farmingTips: 'Scout regularly for Fall Armyworm (FAW). Intercropping with legumes (mungbean) enhances soil nitrogen.',
    marketDemand: 'High (Feed, starch processing, and commercial export)'
  },
  {
    id: 'rice',
    name: 'Rice (धान / Paddy)',
    hindiName: 'धान',
    category: 'Cereal',
    season: 'Kharif',
    growthDurationDays: '115-135 days',
    idealConditions: {
      N: { min: 60, max: 100, opt: 80 },
      P: { min: 35, max: 60, opt: 48 },
      K: { min: 35, max: 55, opt: 40 },
      ph: { min: 5.5, max: 7.2, opt: 6.4 },
      temperature: { min: 20, max: 37, opt: 26 },
      humidity: { min: 70, max: 95, opt: 82 },
      rainfall: { min: 150, max: 300, opt: 220 }
    },
    soilTypes: ['Clayey', 'Clay Loam', 'Alluvial', 'Silty Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '55-65 kg / acre (applied in 3 splits: basal, tillering, panicle initiation)',
      dap: '40-50 kg / acre (at basal preparation)',
      mop: '25-30 kg / acre (potash at transplanting)'
    },
    irrigationGuidance: 'Maintain 2-5 cm standing water layer during vegetative and flowering phases. Drain field 10 days before harvest.',
    farmingTips: 'Incorporate zinc sulphate (10 kg/acre) if leaves display khaira rust symptoms. Adopt System of Rice Intensification (SRI) for water efficiency.',
    marketDemand: 'Very High (Staple crop across MSP and commercial mandis)'
  },
  {
    id: 'wheat',
    name: 'Wheat (गेहूं)',
    hindiName: 'गेहूं',
    category: 'Cereal',
    season: 'Rabi',
    growthDurationDays: '110-125 days',
    idealConditions: {
      N: { min: 100, max: 140, opt: 120 },
      P: { min: 45, max: 70, opt: 55 },
      K: { min: 30, max: 55, opt: 42 },
      ph: { min: 6.0, max: 7.5, opt: 6.8 },
      temperature: { min: 12, max: 25, opt: 18 },
      humidity: { min: 45, max: 70, opt: 58 },
      rainfall: { min: 40, max: 100, opt: 65 }
    },
    soilTypes: ['Alluvial', 'Loamy', 'Clay Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '60-70 kg / acre (50% basal, 25% first irrigation, 25% second irrigation)',
      dap: '45-50 kg / acre (basal)',
      mop: '20-25 kg / acre'
    },
    irrigationGuidance: 'Crucial irrigation at Crown Root Initiation (CRI) stage (21 days after sowing), followed by tillering and grain filling stages.',
    farmingTips: 'Zero tillage sowing directly after paddy harvest preserves residual soil moisture and reduces fuel expenses by 30%.',
    marketDemand: 'Very High (Guaranteed Government Procurement under MSP)'
  },
  {
    id: 'chickpea',
    name: 'Chickpea / Gram (चना)',
    hindiName: 'चना',
    category: 'Pulses',
    season: 'Rabi',
    growthDurationDays: '95-115 days',
    idealConditions: {
      N: { min: 20, max: 45, opt: 32 },
      P: { min: 55, max: 80, opt: 68 },
      K: { min: 65, max: 95, opt: 80 },
      ph: { min: 6.0, max: 7.8, opt: 7.0 },
      temperature: { min: 14, max: 26, opt: 20 },
      humidity: { min: 35, max: 60, opt: 45 },
      rainfall: { min: 30, max: 80, opt: 50 }
    },
    soilTypes: ['Black Soil', 'Sandy Loam', 'Clay Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '10-15 kg / acre (legume fixes atmospheric N via Rhizobium)',
      dap: '35-40 kg / acre',
      mop: '15-20 kg / acre'
    },
    irrigationGuidance: 'Requires minimal water (1-2 irrigations max). Avoid irrigation during active flowering to prevent flower drop.',
    farmingTips: 'Treat seeds with Rhizobium and Trichoderma bio-fungicide to prevent vascular wilt disease.',
    marketDemand: 'Very High (Stable high market realization in pulses)'
  },
  {
    id: 'cotton',
    name: 'Cotton (कपास)',
    hindiName: 'कपास',
    category: 'Cash Crop',
    season: 'Kharif',
    growthDurationDays: '150-180 days',
    idealConditions: {
      N: { min: 90, max: 140, opt: 115 },
      P: { min: 35, max: 60, opt: 46 },
      K: { min: 15, max: 35, opt: 24 },
      ph: { min: 6.5, max: 8.2, opt: 7.2 },
      temperature: { min: 22, max: 36, opt: 28 },
      humidity: { min: 50, max: 80, opt: 65 },
      rainfall: { min: 60, max: 110, opt: 80 }
    },
    soilTypes: ['Deep Black Soil (Regur)', 'Alluvial Soil with good drainage'],
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '60-70 kg / acre in 4 splits',
      dap: '40 kg / acre',
      mop: '25 kg / acre'
    },
    irrigationGuidance: 'Drip irrigation recommended. Avoid stagnant water around root collars to prevent boll rot.',
    farmingTips: 'Install yellow sticky traps (5/acre) and pheromone traps for pink bollworm monitoring.',
    marketDemand: 'High (Textile mills and commodity export hubs)'
  },
  {
    id: 'mustard',
    name: 'Mustard (सरसों / Rai)',
    hindiName: 'सरसों',
    category: 'Oilseed',
    season: 'Rabi',
    growthDurationDays: '105-120 days',
    idealConditions: {
      N: { min: 60, max: 90, opt: 75 },
      P: { min: 35, max: 55, opt: 45 },
      K: { min: 30, max: 50, opt: 40 },
      ph: { min: 6.0, max: 7.5, opt: 6.7 },
      temperature: { min: 10, max: 25, opt: 17 },
      humidity: { min: 45, max: 70, opt: 55 },
      rainfall: { min: 25, max: 60, opt: 40 }
    },
    soilTypes: ['Light Loam', 'Alluvial', 'Sandy Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '45-50 kg / acre',
      dap: '30-35 kg / acre',
      mop: '15-20 kg / acre'
    },
    irrigationGuidance: 'Requires 2 irrigations: First at rosette/pre-flowering stage, second at siliquae (pod) development.',
    farmingTips: 'Essential to apply elemental sulphur (10-15 kg/acre) or gypsum to increase oil content by 2-3%.',
    marketDemand: 'High (Strong domestic edible oil market demand)'
  },
  {
    id: 'potato',
    name: 'Potato (आलू)',
    hindiName: 'आलू',
    category: 'Vegetable / Tuber',
    season: 'Rabi',
    growthDurationDays: '80-100 days',
    idealConditions: {
      N: { min: 110, max: 150, opt: 130 },
      P: { min: 60, max: 90, opt: 75 },
      K: { min: 100, max: 150, opt: 125 },
      ph: { min: 5.2, max: 6.8, opt: 5.9 },
      temperature: { min: 14, max: 24, opt: 18 },
      humidity: { min: 60, max: 85, opt: 70 },
      rainfall: { min: 50, max: 90, opt: 65 }
    },
    soilTypes: ['Sandy Loam rich in organic matter', 'Loose Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '75-85 kg / acre in 2 splits',
      dap: '60 kg / acre',
      mop: '50-60 kg / acre (High Potash consumer for tuber bulking)'
    },
    irrigationGuidance: 'Light, frequent furrow or drip irrigation every 7-10 days. Stop irrigation 10-12 days before dehaulming.',
    farmingTips: 'Earthing up is mandatory at 25-30 days to avoid greening of tubers caused by sunlight exposure.',
    marketDemand: 'Consistent High Demand with cold storage options'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (गन्ना)',
    hindiName: 'गन्ना',
    category: 'Commercial',
    season: 'Perennial / Annual',
    growthDurationDays: '300-360 days',
    idealConditions: {
      N: { min: 120, max: 180, opt: 150 },
      P: { min: 50, max: 80, opt: 65 },
      K: { min: 50, max: 90, opt: 70 },
      ph: { min: 6.0, max: 7.8, opt: 6.8 },
      temperature: { min: 21, max: 38, opt: 29 },
      humidity: { min: 60, max: 88, opt: 75 },
      rainfall: { min: 110, max: 200, opt: 150 }
    },
    soilTypes: ['Deep Alluvial', 'Loamy Soil', 'Black Clayey Loam'],
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '90-110 kg / acre in 3 splits',
      dap: '60 kg / acre at trench opening',
      mop: '40 kg / acre'
    },
    irrigationGuidance: 'Irrigate every 10-12 days during summer peak vegetative tillering.',
    farmingTips: 'Trash mulching between rows conserves 35% soil moisture and suppresses weed germination.',
    marketDemand: 'Assured Sugar Mill Crushing Contracts'
  },
  {
    id: 'lentil',
    name: 'Lentil / Masoor (मसूर)',
    hindiName: 'मसूर',
    category: 'Pulses',
    season: 'Rabi',
    growthDurationDays: '100-115 days',
    idealConditions: {
      N: { min: 15, max: 40, opt: 25 },
      P: { min: 50, max: 75, opt: 62 },
      K: { min: 35, max: 60, opt: 46 },
      ph: { min: 6.0, max: 7.6, opt: 6.8 },
      temperature: { min: 12, max: 23, opt: 17 },
      humidity: { min: 40, max: 65, opt: 50 },
      rainfall: { min: 30, max: 65, opt: 45 }
    },
    soilTypes: ['Loamy', 'Clay Loam', 'Alluvial'],
    imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '10-12 kg / acre',
      dap: '30-35 kg / acre',
      mop: '12-15 kg / acre'
    },
    irrigationGuidance: 'Very low water footprint; typically 1 light irrigation at pod initiation is sufficient.',
    farmingTips: 'Ideal crop for residual moisture conditions after paddy harvest (paira/utera cropping system in Eastern India).',
    marketDemand: 'High domestic market value'
  },
  {
    id: 'jute',
    name: 'Jute (पटसन / पाट)',
    hindiName: 'पटसन',
    category: 'Fiber',
    season: 'Kharif',
    growthDurationDays: '120-135 days',
    idealConditions: {
      N: { min: 65, max: 95, opt: 78 },
      P: { min: 35, max: 55, opt: 45 },
      K: { min: 30, max: 50, opt: 38 },
      ph: { min: 6.2, max: 7.4, opt: 6.7 },
      temperature: { min: 24, max: 36, opt: 30 },
      humidity: { min: 75, max: 92, opt: 84 },
      rainfall: { min: 140, max: 220, opt: 175 }
    },
    soilTypes: ['Sandy Loam to Clayey Alluvial (River basin silt)'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    fertilizerDosage: {
      urea: '40-50 kg / acre',
      dap: '25-30 kg / acre',
      mop: '20 kg / acre'
    },
    irrigationGuidance: 'Requires moist soil; thrives in warm humid monsoon rains with intermittent ponding.',
    farmingTips: 'Harvest at 50% flowering stage to obtain optimal tensile strength fiber during retting.',
    marketDemand: 'Steady demand from packaging & jute mills'
  }
];
