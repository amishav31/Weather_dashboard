const weatherAPI = "https://api.open-meteo.com/v1/forecast?latitude=26.8467&longitude=80.9462&current_weather=true";
const airQualityAPI = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=26.8467&longitude=80.9462&hourly=pm2_5,pm10";
const trafficAPI = "https://api.tomtom.com/traffic/services/5/incidentDetails?key=OSs8MdHT9bfR1pKKwHq8ErBcuNgZGMFA&bbox=80.9000,26.8000,81.0000,26.9000";

async function fetchWeather() {
  try {
    const res = await fetch(weatherAPI);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    const data = await res.json();
    const current = data.current_weather;

    document.getElementById('temperature').textContent = `${current.temperature}°C`;
    document.getElementById('wind').textContent = `${current.windspeed} km/h`;
  } catch (error) {
    console.error(error);
    document.getElementById('weather-info').textContent = 'Weather data unavailable';
  }
}

async function fetchAirQuality() {
  try {
    const res = await fetch(airQualityAPI);
    if (!res.ok) throw new Error('Failed to fetch air quality data');
    const data = await res.json();
    const pm25 = data.hourly.pm2_5[0];
    const pm10 = data.hourly.pm10[0];

    document.getElementById('pm25').textContent = pm25;
    document.getElementById('pm10').textContent = pm10;

    const aqiStatus = document.getElementById('aqi-status');
    let status = '';
    let bgColor = '';
    let emoji = '';

    if (pm25 <= 50) {
      status = 'Good';
      bgColor = '#00e400';
      emoji = '😊';
    } else if (pm25 <= 100) {
      status = 'Moderate';
      bgColor = '#ffff00';
      emoji = '😐';
    } else if (pm25 <= 150) {
      status = 'Unhealthy for Sensitive Groups';
      bgColor = '#ff7e00';
      emoji = '😷';
    } else if (pm25 <= 200) {
      status = 'Unhealthy';
      bgColor = '#ff0000';
      emoji = '🤢';
    } else if (pm25 <= 300) {
      status = 'Very Unhealthy';
      bgColor = '#8f3f97';
      emoji = '🤮';
    } else {
      status = 'Hazardous';
      bgColor = '#7e0023';
      emoji = '☠️';
    }

    aqiStatus.innerHTML = `${status} ${emoji}`;
    document.getElementById('aqi-card').style.backgroundColor = bgColor;
  } catch (error) {
    console.error(error);
    document.getElementById('aqi-status').textContent = 'Air Quality data unavailable';
  }
}

async function fetchTraffic() {
  try {
    const res = await fetch(trafficAPI);
    if (!res.ok) throw new Error('Failed to fetch traffic data');
    const data = await res.json();
    const incidents = data.incidents || [];
    const list = document.getElementById('traffic-list');
    
    if (incidents.length === 0) {
      list.innerHTML = '<li>No incidents currently.</li>';
    } else {
      list.innerHTML = incidents.map(i => `<li>${i.properties.eventCode || "Traffic Issue"}</li>`).join('');
    }
  } catch (error) {
    console.error(error);
    document.getElementById('traffic-list').innerHTML = '<li>Traffic data unavailable</li>';
  }
}

fetchWeather();
fetchAirQuality();
fetchTraffic();
