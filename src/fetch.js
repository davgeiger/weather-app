const baseURL = "https://api.weatherapi.com/v1";
const endpoint_forecast = "/forecast.json";

const API_KEY = "13c229db6b6d457fb73142207261004";
const lang = "de";
const forecastDays = 3;

export async function fetchForecast(cityName) {
  const url = `${baseURL}${endpoint_forecast}?key=${API_KEY}&lang=${lang}&q=${cityName}&days=${forecastDays}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}
