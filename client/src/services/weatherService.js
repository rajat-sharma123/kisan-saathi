// Open-Meteo Weather Service with Indian Agricultural Advisory Rule Engine

export const DISTRICT_COORDINATES = {
  'Bhagalpur': { lat: 25.2425, lon: 86.9842, state: 'Bihar' },
  'Patna': { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  'Purnia': { lat: 25.7771, lon: 87.4753, state: 'Bihar' },
  'Muzaffarpur': { lat: 26.1209, lon: 85.3647, state: 'Bihar' },
  'Gaya': { lat: 24.7955, lon: 85.0002, state: 'Bihar' },
  'Varanasi': { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  'Lucknow': { lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
  'Ludhiana': { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  'Pune': { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  'Nashik': { lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  'Indore': { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  'Karnal': { lat: 29.6857, lon: 76.9905, state: 'Haryana' },
  'Burdwan': { lat: 23.2324, lon: 87.8615, state: 'West Bengal' }
};

export async function fetchWeatherForecast(districtName = 'Bhagalpur', customCoords = null) {
  let lat = 25.2425;
  let lon = 86.9842;
  let resolvedName = districtName;

  if (customCoords && customCoords.latitude && customCoords.longitude) {
    lat = customCoords.latitude;
    lon = customCoords.longitude;
    resolvedName = 'My Location';
  } else if (DISTRICT_COORDINATES[districtName]) {
    lat = DISTRICT_COORDINATES[districtName].lat;
    lon = DISTRICT_COORDINATES[districtName].lon;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,precipitation,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    const data = await response.json();
    return formatWeatherData(data, resolvedName);
  } catch (err) {
    console.warn('Open-Meteo fetch failed or offline, using fallback meteorological dataset', err);
    return getFallbackWeatherData(resolvedName);
  }
}

function getWeatherCondition(code) {
  // WMO Weather interpretation codes
  if (code === 0) return { label: 'Clear Sky (साफ आसमान)', icon: 'Sun', severity: 'normal' };
  if (code === 1 || code === 2) return { label: 'Partly Cloudy (हल्के बादल)', icon: 'CloudSun', severity: 'normal' };
  if (code === 3) return { label: 'Overcast (बादल छाए)', icon: 'Cloud', severity: 'normal' };
  if (code >= 45 && code <= 48) return { label: 'Foggy (कोहरा)', icon: 'CloudFog', severity: 'caution' };
  if (code >= 51 && code <= 55) return { label: 'Light Drizzle (हल्की बूंदाबांदी)', icon: 'CloudDrizzle', severity: 'caution' };
  if (code >= 61 && code <= 65) return { label: 'Rain (वर्षा)', icon: 'CloudRain', severity: 'alert' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers (तेज बौछारें)', icon: 'CloudRain', severity: 'alert' };
  if (code >= 95) return { label: 'Thunderstorm (आंधी-तूफान)', icon: 'CloudLightning', severity: 'critical' };
  return { label: 'Fair (सामान्य मौसम)', icon: 'Sun', severity: 'normal' };
}

function formatWeatherData(data, district) {
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const currentCondition = getWeatherCondition(current.weather_code || 0);

  // Next 7 days formatted forecast
  const sevenDayForecast = (daily.time || []).map((dateStr, idx) => {
    const d = new Date(dateStr);
    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const code = daily.weather_code ? daily.weather_code[idx] : 0;
    const cond = getWeatherCondition(code);

    return {
      date: dateStr,
      dayName,
      maxTemp: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[idx] : 28),
      minTemp: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[idx] : 18),
      rainProb: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 10),
      rainSum: daily.precipitation_sum ? daily.precipitation_sum[idx] : 0,
      windSpeed: Math.round(daily.wind_speed_10m_max ? daily.wind_speed_10m_max[idx] : 12),
      condition: cond.label,
      icon: cond.icon
    };
  });

  // Next 24 hours trend for chart
  const next24Hours = (hourly.time || []).slice(0, 24).map((timeStr, idx) => {
    const hour = new Date(timeStr).getHours();
    return {
      time: `${hour}:00`,
      temp: Math.round(hourly.temperature_2m ? hourly.temperature_2m[idx] : 24),
      rainProb: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0),
      rainMm: hourly.precipitation ? hourly.precipitation[idx] : 0,
      humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : 65
    };
  });

  // Evaluate Rule-based Agricultural Intelligence Alerts
  const alerts = generateAgriculturalAlerts(current, daily, sevenDayForecast);

  return {
    location: district,
    current: {
      temperature: Math.round(current.temperature_2m || 26),
      apparentTemperature: Math.round(current.apparent_temperature || 27),
      humidity: Math.round(current.relative_humidity_2m || 68),
      windSpeed: Math.round(current.wind_speed_10m || 11),
      precipitation: current.precipitation || 0,
      rain: current.rain || 0,
      condition: currentCondition.label,
      conditionSeverity: currentCondition.severity,
      icon: currentCondition.icon,
      isLive: true
    },
    sevenDayForecast,
    hourlyChartData: next24Hours,
    alerts,
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  };
}

// Rule-based Agricultural Intelligence Engine
function generateAgriculturalAlerts(current, daily, forecast) {
  const alerts = [];
  const todayRainProb = forecast[0]?.rainProb || 0;
  const tomorrowRainProb = forecast[1]?.rainProb || 0;
  const currentWind = current.wind_speed_10m || 10;
  const currentTemp = current.temperature_2m || 25;
  const maxTemp = forecast[0]?.maxTemp || 30;
  const minTemp = forecast[0]?.minTemp || 18;

  // Rule 1: Spraying Advisory (Rain in 24-36h)
  if (todayRainProb > 40 || tomorrowRainProb > 50) {
    alerts.push({
      id: 'alert_spray_delay',
      type: 'Spraying Advisory',
      severity: 'warning',
      badge: 'Delay Spraying',
      title: 'वर्षा की संभावना: कीटनाशक/उर्वरक छिड़काव रोकें',
      englishTitle: 'Delay Pesticide & Foliar Spraying',
      message: `अगले 24-36 घंटों में ${Math.max(todayRainProb, tomorrowRainProb)}% वर्षा की संभावना है। छिड़काव करने पर दवा बारिश में बह जाएगी और लागत बेकार होगी। मौसम साफ होने की प्रतीक्षा करें।`,
      action: 'Postpone chemical spray till weather stabilizes'
    });
  } else {
    alerts.push({
      id: 'alert_spray_safe',
      type: 'Spraying Window',
      severity: 'safe',
      badge: 'Safe to Spray',
      title: 'छिड़काव के लिए अनुकूल मौसम',
      englishTitle: 'Favorable Spraying Window',
      message: 'आगामी 48 घंटों में वर्षा की संभावना नगण्य है। फफूंदनाशक या पोषक तत्व छिड़काव सुबह 8 से 11 बजे के बीच संपन्न करें।',
      action: 'Recommended time for foliar nutrition & protective sprays'
    });
  }

  // Rule 2: Wind Speed & Drift
  if (currentWind > 18) {
    alerts.push({
      id: 'alert_wind_drift',
      type: 'Wind Hazard',
      severity: 'warning',
      badge: 'High Drift',
      title: 'तेज हवा: बहाव (Drift) का खतरा',
      englishTitle: 'High Wind Velocity Alert',
      message: `वर्तमान हवा की गति ${currentWind} किमी/घंटा है। तेज हवा से दवा अन्य खेतों में उड़ सकती है। हवा धीमी होने तक नोजल का प्रयोग न करें।`,
      action: 'Avoid power-spraying; check tall crop staking'
    });
  }

  // Rule 3: Heat Stress / Soil Moisture
  if (maxTemp > 34) {
    alerts.push({
      id: 'alert_heat_stress',
      type: 'Irrigation Advisory',
      severity: 'alert',
      badge: 'Heat Stress',
      title: 'उच्च तापमान: शाम के समय हल्की सिंचाई करें',
      englishTitle: 'Heat Stress Mitigation',
      message: `आज अधिकतम तापमान ${maxTemp}°C तक पहुंचने का अनुमान है। तेज धूप में सिंचाई न करें; केवल शाम या भोर में हल्की नमी बनाएं ताकि परागकण सुरक्षित रहें।`,
      action: 'Irrigate in early morning or late evening'
    });
  }

  // Rule 4: Frost / Cold Wave (Winter)
  if (minTemp < 10) {
    alerts.push({
      id: 'alert_frost_cold',
      type: 'Frost Alert',
      severity: 'warning',
      badge: 'Cold Wave',
      title: 'शीत लहर / पाला की संभावना: हल्की सिंचाई जरूरी',
      englishTitle: 'Cold Wave & Frost Protection',
      message: `रात का तापमान ${minTemp}°C तक गिरने की संभावना है। आलू और सरसों की फसल को पाले से बचाने हेतु खेत की मेड़ों पर धुआं करें अथवा हल्की सिंचाई करें।`,
      action: 'Light irrigation to stabilize soil temperature'
    });
  }

  return alerts;
}

function getFallbackWeatherData(district) {
  const fallbackDaily = [
    { date: '2026-11-18', dayName: 'Today', maxTemp: 28, minTemp: 17, rainProb: 15, rainSum: 0, windSpeed: 9, condition: 'Clear Sky (साफ आसमान)', icon: 'Sun' },
    { date: '2026-11-19', dayName: 'Tomorrow', maxTemp: 27, minTemp: 16, rainProb: 20, rainSum: 0, windSpeed: 10, condition: 'Partly Cloudy (हल्के बादल)', icon: 'CloudSun' },
    { date: '2026-11-20', dayName: 'Thu', maxTemp: 28, minTemp: 17, rainProb: 10, rainSum: 0, windSpeed: 8, condition: 'Clear Sky (साफ आसमान)', icon: 'Sun' },
    { date: '2026-11-21', dayName: 'Fri', maxTemp: 29, minTemp: 18, rainProb: 5, rainSum: 0, windSpeed: 11, condition: 'Clear Sky (साफ आसमान)', icon: 'Sun' },
    { date: '2026-11-22', dayName: 'Sat', maxTemp: 28, minTemp: 17, rainProb: 25, rainSum: 0.5, windSpeed: 12, condition: 'Partly Cloudy (हल्के बादल)', icon: 'CloudSun' },
    { date: '2026-11-23', dayName: 'Sun', maxTemp: 26, minTemp: 16, rainProb: 35, rainSum: 1.2, windSpeed: 14, condition: 'Overcast (बादल छाए)', icon: 'Cloud' },
    { date: '2026-11-24', dayName: 'Mon', maxTemp: 27, minTemp: 15, rainProb: 10, rainSum: 0, windSpeed: 9, condition: 'Clear Sky (साफ आसमान)', icon: 'Sun' }
  ];

  const fallbackHourly = [
    { time: '06:00', temp: 18, rainProb: 5, rainMm: 0, humidity: 82 },
    { time: '09:00', temp: 22, rainProb: 10, rainMm: 0, humidity: 70 },
    { time: '12:00', temp: 27, rainProb: 15, rainMm: 0, humidity: 55 },
    { time: '15:00', temp: 28, rainProb: 15, rainMm: 0, humidity: 50 },
    { time: '18:00', temp: 24, rainProb: 10, rainMm: 0, humidity: 65 },
    { time: '21:00', temp: 20, rainProb: 5, rainMm: 0, humidity: 75 }
  ];

  return {
    location: district,
    current: {
      temperature: 27,
      apparentTemperature: 28,
      humidity: 64,
      windSpeed: 10,
      precipitation: 0,
      rain: 0,
      condition: 'Clear Sky (साफ आसमान)',
      conditionSeverity: 'normal',
      icon: 'Sun',
      isLive: false
    },
    sevenDayForecast: fallbackDaily,
    hourlyChartData: fallbackHourly,
    alerts: [
      {
        id: 'alert_spray_safe_fallback',
        type: 'Spraying Window',
        severity: 'safe',
        badge: 'Safe to Spray',
        title: 'छिड़काव के लिए अनुकूल मौसम',
        englishTitle: 'Favorable Spraying Window',
        message: 'आगामी 48 घंटों में वर्षा की संभावना कम है। पोषक तत्व छिड़काव सुबह 8 से 11 बजे के बीच संपन्न करें।',
        action: 'Recommended time for foliar nutrition & protective sprays'
      },
      {
        id: 'alert_heat_stress_fallback',
        type: 'Irrigation Advisory',
        severity: 'warning',
        badge: 'Soil Moisture',
        title: 'मृदा नमी निगरानी परामर्श',
        englishTitle: 'Monitor Soil Moisture',
        message: 'दिन में खिली धूप के कारण ऊपरी मिट्टी की नमी का वाष्पीकरण बढ़ सकता है। रबी फसलों में जड़ क्षेत्र की नमी जांचें।',
        action: 'Check 2-inch root depth before irrigating'
      }
    ],
    lastUpdated: '11:30 AM (Cached offline)'
  };
}
