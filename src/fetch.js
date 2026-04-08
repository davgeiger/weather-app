const baseURL = "http://api.weatherapi.com/v1";
const endpoint_current = "/current.json";
const endpoint_forecast = "/forecast.json";

const API_KEY = "3f222dfacdc7496d8f2111550263003";
const lang = "de";
const forecastDays = 3;

export async function fetchForecast(cityName) {
  const url = `${baseURL}${endpoint_forecast}?key=${API_KEY}&lang=${lang}&q=${cityName}&days=${forecastDays}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}
