// Agricultural plant pathology knowledge base
export const PLANT_DISEASES_DB = [
  {
    id: 'rice_blast',
    crop: 'Rice',
    diseaseName: 'Leaf Blast (पत्ती का झुलसा रोग)',
    pathogen: 'Magnaporthe oryzae (Fungus)',
    severity: 'High',
    confidence: 0.92,
    symptoms: [
      'Spindle-shaped or diamond-shaped lesions with grayish-white centers and brownish margins',
      'Lesions coalesce rapidly causing leaves to dry and wither (burnt appearance)',
      'Nodes turn black and break easily under wind stress (neck blast stage)'
    ],
    possibleCauses: [
      'Prolonged leaf wetness (>10 hours) and high relative humidity (>90%)',
      'Excessive chemical nitrogen application without balancing potassium',
      'Cloudy, drizzle weather with nighttime temperatures around 20-24°C'
    ],
    recommendedActions: [
      'Immediately suspend any pending top-dressing of urea / nitrogen fertilizers',
      'Spray Tricyclazole 75% WP @ 0.6 g/liter of water OR Isoprothiolane 40% EC @ 1.5 ml/liter',
      'Ensure spray coverage under leaf canopies using a hollow cone nozzle'
    ],
    prevention: [
      'Treat seeds before sowing with Carbendazim 50% WP @ 2 g/kg seed or Pseudomonas fluorescens @ 10 g/kg',
      'Use blast-resistant varieties recommended by ICAR-NRRI (e.g., Swarna-Sub1, Sahbhagi Dhan)',
      'Maintain balanced NPK ratio (4:2:1) and apply potassium in split doses'
    ],
    expertVerificationRequired: true,
    kvkAdvisory: 'If neck blast symptoms appear on panicles, immediately contact KVK Bhagalpur (Toll-Free 1800-180-1551).'
  },
  {
    id: 'wheat_yellow_rust',
    crop: 'Wheat',
    diseaseName: 'Yellow Rust / Stripe Rust (पीला रतुआ)',
    pathogen: 'Puccinia striiformis f. sp. tritici (Fungus)',
    severity: 'Severe',
    confidence: 0.94,
    symptoms: [
      'Parallel linear stripes of bright yellow-orange pustules along leaf veins',
      'Yellow powder adheres to fingers when rubbing infected foliage',
      'Severe infection leads to chlorosis and premature leaf desiccation'
    ],
    possibleCauses: [
      'Cool temperatures (10-18°C) accompanied by morning fog or high dew',
      'Wind-borne urediniospores arriving from sub-mountainous or northern tracts',
      'High soil moisture with prolonged cloudy canopy'
    ],
    recommendedActions: [
      'Spray Propiconazole 25% EC (Tilt) @ 1 ml/liter of water immediately upon first spot detection',
      'Alternatively spray Tebuconazole 25.9% EC @ 1 ml/liter',
      'Do not delay spraying; stripe rust can spread through an entire 5-acre plot in 4-6 days'
    ],
    prevention: [
      'Sow rust-resistant wheat cultivars (e.g. HD 3086, DBW 187, DBW 222, PBW 725)',
      'Avoid late sowing; complete sowing between Nov 1 and Nov 25 in Indo-Gangetic Plains',
      'Practice community-level surveillance with adjacent farmers'
    ],
    expertVerificationRequired: true,
    kvkAdvisory: 'Report yellow rust pockets to the nearest District Agricultural Officer for regional containment.'
  },
  {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    diseaseName: 'Early Blight (अगेती झुलसा)',
    pathogen: 'Alternaria solani (Fungus)',
    severity: 'Moderate',
    confidence: 0.89,
    symptoms: [
      'Concentric circular target-board rings on older lower leaves',
      'Yellow chlorotic halos surrounding brown necrotic spots',
      'Stem lesions and dark leathery sunken rot at the fruit stem end'
    ],
    possibleCauses: [
      'Alternating wet and dry periods with warm temperatures (24-29°C)',
      'Overhead sprinkler irrigation splashing soil fungal spores onto lower leaves',
      'Nutrient-stressed plants with potassium deficiency'
    ],
    recommendedActions: [
      'Prune off and safely destroy severely infected lower leaves away from the field',
      'Spray Mancozeb 75% WP @ 2.5 g/liter OR Chlorothalonil 75% WP @ 2 g/liter',
      'Switch from overhead sprinkler to drip irrigation or furrow watering'
    ],
    prevention: [
      'Mulch plant bases with organic straw to prevent soil-to-leaf rain splash',
      'Follow 3-year crop rotation with non-solanaceous crops (avoid potato or brinjal)',
      'Ensure adequate plant spacing (60 cm x 45 cm) for aerated canopy drying'
    ],
    expertVerificationRequired: false,
    kvkAdvisory: 'Manageable with regular prophylactic bio-fungicide sprays (Trichoderma viride).'
  },
  {
    id: 'potato_late_blight',
    crop: 'Potato',
    diseaseName: 'Late Blight (पिछेती झुलसा)',
    pathogen: 'Phytophthora infestans (Oomycete)',
    severity: 'Severe',
    confidence: 0.95,
    symptoms: [
      'Water-soaked irregular pale-green spots enlarging rapidly into purplish-brown lesions',
      'Delicate white fungal mildew visible on leaf undersides during early mornings',
      'Foul odor in heavily infested fields; tubers show reddish-brown dry granular rot'
    ],
    possibleCauses: [
      'High relative humidity (>85%) and temperature between 12-22°C for 2 consecutive days',
      'Persistent fog, cloudiness, or dew (Smith Period weather criteria)',
      'Infected seed tubers carrying dormant mycelium'
    ],
    recommendedActions: [
      'Prophylactic spray: Mancozeb 75% WP @ 2.5 g/liter before weather turns cloudy/foggy',
      'Curative spray: Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 3 g/liter OR Dimethomorph 50% WP @ 1 g/liter',
      'Cut and burn haulms (stems) 10 days before harvest if late blight occurs late in season'
    ],
    prevention: [
      'Source certified disease-free seed tubers from verified government seed nurseries',
      'Plant late-blight tolerant cultivars such as Kufri Mohan, Kufri Girdhari, or Kufri Khyati',
      'Earthing up properly to prevent zoospores washing down into soil to contact tubers'
    ],
    expertVerificationRequired: true,
    kvkAdvisory: 'High-alert disease! Check the Central Potato Research Institute (CPRI) Indo-Blightcast warning.'
  },
  {
    id: 'cotton_leaf_curl',
    crop: 'Cotton',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV / पत्ती मरोड़ रोग)',
    pathogen: 'Cotton leaf curl virus (Begomovirus transmitted by Whitefly)',
    severity: 'High',
    confidence: 0.91,
    symptoms: [
      'Upward or downward cupping and curling of leaf margins',
      'Thickening and enation of main veins on leaf undersides forming leaf-like outgrowths',
      'Severe plant stunting, reduction in squares, and drop of floral buds'
    ],
    possibleCauses: [
      'High whitefly (*Bemisia tabaci*) vector population driven by hot, humid weather',
      'Nearby alternate weed hosts (e.g. *Parthenium hysterophorus*, *Sida cordifolia*)',
      'Cultivation of susceptible non-Bt or non-resistant cotton hybrids'
    ],
    recommendedActions: [
      'Install yellow sticky traps (8-10 traps/acre) to monitor and capture whitefly adults',
      'Spray Diafenthiuron 50% WP @ 1.2 g/liter OR Pyriproxyfen 10% EC @ 2 ml/liter to control whitefly nymphs',
      'Rogue out and bury virus-infected plants during early vegetative phase'
    ],
    prevention: [
      'Grow CLCuV tolerant certified Bt-cotton hybrids',
      'Maintain weed-free field boundaries and eliminate Congress grass',
      'Avoid excessive chemical nitrogen which produces lush soft growth favored by whiteflies'
    ],
    expertVerificationRequired: true,
    kvkAdvisory: 'Whitefly resistance management is vital. Rotate chemical insecticide classes.'
  },
  {
    id: 'maize_fall_armyworm',
    crop: 'Maize',
    diseaseName: 'Fall Armyworm (फॉल आर्मीवॉर्म कीट प्रकोप)',
    pathogen: 'Spodoptera frugiperda (Pest Insect)',
    severity: 'High',
    confidence: 0.93,
    symptoms: [
      'Pin-hole and windowing patterns on young whorl leaves',
      'Extensive ragged feeding holes with abundant moist yellowish-brown sawdust-like frass',
      'Destruction of growing central shoot / tassel leading to "dead heart"'
    ],
    possibleCauses: [
      'Warm temperatures (25-32°C) promoting fast pest reproduction cycles',
      'Monoculture continuous maize cultivation in adjacent farm tracts',
      'Absence of natural predatory wasps and birds'
    ],
    recommendedActions: [
      'Apply 5% neem seed kernel extract (NSKE) or Azadirachtin 1500 ppm @ 5 ml/liter into leaf whorls',
      'For severe whorl infestation: Apply Chlorantraniliprole 18.5% SC (Coragen) @ 0.4 ml/liter directed into whorls',
      'Handpick egg masses and caterpillars in smallholdings using sand-lime whorl dust'
    ],
    prevention: [
      'Install pheromone traps @ 4 traps/acre for adult moth monitoring',
      'Intercrop maize with cowpea, pigeonpea, or desmodium as push-pull strategy',
      'Deep summer ploughing to expose pupae to predatory birds and solar heat'
    ],
    expertVerificationRequired: false,
    kvkAdvisory: 'Regular whorl scouting at 7-day intervals is critical for early stage containment.'
  }
];
