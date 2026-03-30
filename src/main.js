const baseURL = "http://api.weatherapi.com/v1";
const endpoint_current = "/current.json";
const endpoint_forecast = "/forecast.json";

const API_KEY = "3f222dfacdc7496d8f2111550263003";
const city = "Weingarten";
const lang = "de";
const forecastDays = 1;

const spinner = document.querySelector(".lds-roller");
spinner.style.display = "none";

async function fetchCurrentWeather() {
  const url = `${baseURL}${endpoint_current}?key=${API_KEY}&lang=${lang}&q=${city}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}

async function fetchForecast() {
  const url = `${baseURL}${endpoint_forecast}?key=${API_KEY}&lang=${lang}&q=${city}&days=${forecastDays}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}

function displayData(data_current, data_forecast) {
  const titleEl = document.querySelector(".overview__title");
  const currenttempEl = document.querySelector(".overview__temperature");
  const tempNameEl = document.querySelector(".overview__temp-name");
  const tempsEl = document.querySelector(".overview__temps");

  const cityName = data_current.location.name;
  const temp = data_current.current.temp_c;
  const tempName = data_current.current.condition.text;
  const minTemp = data_forecast.forecast.forecastday[0].day.mintemp_c;
  const maxTemp = data_forecast.forecast.forecastday[0].day.maxtemp_c;

  titleEl.innerText = cityName;
  currenttempEl.innerText = temp;
  tempNameEl.innerText = tempName;
  tempsEl.innerText = `H: ${maxTemp}° T: ${minTemp}°`;
}

async function main() {
  spinner.style.display = "block";
  const data_current = await fetchCurrentWeather();
  const data_forecast = await fetchForecast();
  spinner.style.display = "none";

  displayData(data_current, data_forecast);
}

main();
