const STORAGE_KEY = "saved-cities";

export function getSavedCities() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (cities.includes(city)) return;

  cities = [...cities, city];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}
