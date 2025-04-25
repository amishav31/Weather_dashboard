const weatherAPI = "https://api.open-meteo.com/v1/forecast?latitude=26.8467&longitude=80.9462&current_weather=true";
const airQualityAPI = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=26.8467&longitude=80.9462&hourly=pm2_5,pm10";
const trafficAPI = "https://api.tomtom.com/traffic/services/5/incidentDetails?key=OSs8MdHT9bfR1pKKwHq8ErBcuNgZGMFA&bbox=80.9000,26.8000,81.0000,26.9000";

async function fetchWeather() {
  try {
    const res = await fetch(weatherAPI);
    const data = await res.json();
    const current = data.current_weather;

    document.getElementById('temperature').textContent = current.temperature;
    document.getElementById('wind').textContent = current.windspeed;
  } catch (error) {
    console.error(error);
  }
}

async function fetchAirQuality() {
  try {
    const res = await fetch(airQualityAPI);
    const data = await res.json();
    const pm25 = data.hourly.pm2_5[0];

    document.getElementById('aqi-value').textContent = pm25;

    let status = "", emoji = "", bgColor = "";

    if (pm25 <= 50) {
      status = "Good 😊";
      bgColor = "#00e400";
    } else if (pm25 <= 100) {
      status = "Moderate 😐";
      bgColor = "#ffff00";
    } else if (pm25 <= 150) {
      status = "Sensitive 😷";
      bgColor = "#ff7e00";
    } else if (pm25 <= 200) {
      status = "Unhealthy 🤢";
      bgColor = "#ff0000";
    } else {
      status = "Hazardous ☠️";
      bgColor = "#7e0023";
    }

    document.getElementById('aqi-status').textContent = status;
    document.getElementById('aqi-block').style.backgroundColor = bgColor;
  } catch (error) {
    console.error(error);
  }
}

async function fetchTraffic() {
  try {
    const res = await fetch(trafficAPI);
    const data = await res.json();
    const incidents = data.incidents || [];
    const list = document.getElementById('traffic-list');

    if (incidents.length === 0) {
      list.innerHTML = '<li>No incidents</li>';
    } else {
      list.innerHTML = incidents
        .slice(0, 3)
        .map(inc => `<li>${inc.properties.eventCode || 'Traffic Alert'}</li>`)
        .join('');
    }
  } catch (error) {
    console.error(error);
    document.getElementById('traffic-list').innerHTML = '<li>Data unavailable</li>';
  }
}

fetchWeather();
fetchAirQuality();
fetchTraffic();
setInterval(() => {
  fetchWeather();
  fetchAirQuality();
  fetchTraffic();
}, 300000); // Refresh every 5 min
