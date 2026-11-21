import axios from 'axios';

const DISTRICT_COORDINATES = {
  'Bhagalpur': { lat: 25.2425, lon: 86.9842 },
  'Patna': { lat: 25.5941, lon: 85.1376 },
  'Purnia': { lat: 25.7771, lon: 87.4753 },
  'Muzaffarpur': { lat: 26.1209, lon: 85.3647 },
  'Gaya': { lat: 24.7955, lon: 85.0002 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Ludhiana': { lat: 30.9010, lon: 75.8573 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Indore': { lat: 22.7196, lon: 75.8577 }
};

export async function getForecast(req, res, next) {
  try {
    const district = req.query.district || 'Bhagalpur';
    const coords = DISTRICT_COORDINATES[district] || DISTRICT_COORDINATES['Bhagalpur'];

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;

    const response = await axios.get(url, { timeout: 6000 });
    const data = response.data;

    res.json({
      success: true,
      district,
      current: data.current,
      daily: data.daily
    });
  } catch (err) {
    // Return standard fallback if network error
    res.json({
      success: true,
      district: req.query.district || 'Bhagalpur',
      current: {
        temperature_2m: 27,
        apparent_temperature: 28,
        relative_humidity_2m: 64,
        wind_speed_10m: 10,
        weather_code: 0
      },
      fallback: true
    });
  }
}
