const weatherAPI = "https://api.open-meteo.com/v1/forecast?latitude=26.8467&longitude=80.9462&current_weather=true";
const airQualityAPI = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=26.8467&longitude=80.9462&hourly=pm2_5,pm10";
const trafficAPI = "https://api.tomtom.com/traffic/services/5/incidentDetails?key=OSs8MdHT9bfR1pKKwHq8ErBcuNgZGMFA&bbox=80.9000,26.8000,81.0000,26.9000";

async function fetchWeather() {
  const res = await fetch(weatherAPI);
  const data = await res.json();
  const current = data.current_weather;

  document.getElementById('temperature').textContent = current.temperature;
  document.getElementById('wind').textContent = current.windspeed;
}

async function fetchAirQuality() {
  const res = await fetch(airQualityAPI);
  const data = await res.json();
  const pm25 = data.hourly.pm2_5[0];
  const pm10 = data.hourly.pm10[0];
  document.getElementById('pm25').textContent = pm25;
  document.getElementById('pm10').textContent = pm10;

  let aqiStatus = document.getElementById('aqi-status');
  aqiStatus.textContent = pm25 <= 50 ? 'Good' :
                          pm25 <= 100 ? 'Moderate' :
                          pm25 <= 150 ? 'Unhealthy for Sensitive Groups' :
                          pm25 <= 200 ? 'Unhealthy' :
                          pm25 <= 300 ? 'Very Unhealthy' : 'Hazardous';
}

async function fetchTraffic() {
  const res = await fetch(trafficAPI);
  const data = await res.json();
  const incidents = data.incidents || [];
  const list = document.getElementById('traffic-list');
  list.innerHTML = incidents.length === 0 ? '<li>No incidents currently.</li>' :
    incidents.map(i => `<li>${i.properties.eventCode || "Traffic Issue"}</li>`).join('');
}

fetchWeather();
fetchAirQuality();
fetchTraffic();
