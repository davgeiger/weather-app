const STORAGE_KEY = "saved-cities";

export function getSavedCities() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveCity(cityName, id) {
  let cities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const found = cities.find((city) => {
    return city.id === Number(id);
  });

  if (found === undefined) {
    let city = { id, cityName };
    cities = [...cities, city];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }
}

export function deleteSavedCity(city) {
  let cities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const filteredCites = cities.filter((element) => {
    return element.cityName !== city;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCites));
}
