import { display } from "./display";

import { getSavedCities, saveCity } from "./storage";

const cities = getSavedCities();

async function main() {
  display(cities);
}

main();
