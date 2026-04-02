const baseURL = "http://api.weatherapi.com/v1";
const endpoint_current = "/current.json";
const endpoint_forecast = "/forecast.json";

const API_KEY = "3f222dfacdc7496d8f2111550263003";
const city = "Weingarten";
const lang = "de";
const forecastDays = 3;

export async function fetchCurrentWeather() {
  const url = `${baseURL}${endpoint_current}?key=${API_KEY}&lang=${lang}&q=${city}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}

export async function fetchForecast() {
  const url = `${baseURL}${endpoint_forecast}?key=${API_KEY}&lang=${lang}&q=${city}&days=${forecastDays}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}
