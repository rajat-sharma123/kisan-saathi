import { 
  MANDI_PRICES_DATABASE, 
  MANDI_LOCATIONS, 
  COMMODITIES_CATALOG, 
  generateDistrictPrices, 
  generateHistoricalTrends, 
  generateMandiComparison 
} from '../data/mandiData.js';

export const mandiService = {
  getLocations() {
    return MANDI_LOCATIONS;
  },

  getCommodities() {
    return COMMODITIES_CATALOG;
  },

  getAllPrices() {
    return MANDI_PRICES_DATABASE;
  },

  filterPrices({ state = 'All', district = 'All', crop = 'All', searchQuery = '' }) {
    let results = [];

    // 1. If state and district are specified
    if (state !== 'All' && district !== 'All') {
      const seeded = MANDI_PRICES_DATABASE.filter(item => 
        item.state.toLowerCase() === state.toLowerCase() && 
        item.district.toLowerCase() === district.toLowerCase()
      );
      if (seeded.length > 0) {
        results = seeded;
      } else {
        // Generate realistic AGMARKNET records for this district
        results = generateDistrictPrices(state, district, crop);
      }
    } 
    // 2. If state is specified but district is 'All'
    else if (state !== 'All' && district === 'All') {
      const seeded = MANDI_PRICES_DATABASE.filter(item => item.state.toLowerCase() === state.toLowerCase());
      if (seeded.length > 0) {
        results = seeded;
      } else {
        // Pick first 3 districts of that state to showcase
        const stateLoc = MANDI_LOCATIONS.find(l => l.state.toLowerCase() === state.toLowerCase());
        const sampleDistricts = stateLoc ? stateLoc.districts.slice(0, 3) : ['Central'];
        results = sampleDistricts.flatMap(d => generateDistrictPrices(state, d, crop));
      }
    } 
    // 3. If all states & districts
    else {
      results = [...MANDI_PRICES_DATABASE];
    }

    // Apply crop filter
    if (crop !== 'All') {
      results = results.filter(item => 
        item.cropKey === crop || 
        item.crop.toLowerCase().includes(crop.toLowerCase())
      );
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.crop.toLowerCase().includes(query) ||
        item.mandi.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query) ||
        (item.variety && item.variety.toLowerCase().includes(query))
      );
    }

    return results;
  },

  getHistoricalTrend(cropKey = 'wheat', state = 'Bihar', district = 'Bhagalpur', timeRange = '30D') {
    return generateHistoricalTrends(cropKey, state, district, timeRange);
  },

  getMandiComparison(state = 'Bihar', district = 'Bhagalpur', cropKey = 'wheat') {
    return generateMandiComparison(state, district, cropKey);
  },

  getBestMandiOpportunity(selectedCropKey = 'wheat', state = 'Bihar', district = 'Bhagalpur') {
    const comparison = generateMandiComparison(state, district, selectedCropKey);
    if (!comparison || comparison.length < 2) return null;

    const sorted = [...comparison].sort((a, b) => b.price - a.price);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const diff = highest.price - lowest.price;

    return {
      highestMandi: {
        mandi: highest.fullName || highest.mandi,
        modalPrice: highest.price,
        distance: highest.distance
      },
      lowestMandi: {
        mandi: lowest.fullName || lowest.mandi,
        modalPrice: lowest.price,
        distance: lowest.distance
      },
      priceDifference: diff,
      opportunityNote: diff > 0
        ? `${highest.fullName || highest.mandi} (${highest.distance}) is offering ₹${diff}/quintal higher for ${highest.cropName || selectedCropKey} than ${lowest.fullName || lowest.mandi}. Estimated transport cost is ₹${Math.round(diff * 0.35)}/Q, yielding a net arbitrage profit of ₹${Math.round(diff * 0.65)}/Q.`
        : `Rates across reporting mandis in ${district || state} are closely aligned with minimal spread.`
    };
  }
};
