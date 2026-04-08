import { displayCities, displayMain } from "./display";
import { showSpinner } from "./spinner";
import { getSavedCities, saveCity } from "./storage";

saveCity("Mannheim");
saveCity("Weingarten");
saveCity("Ravensburg");
const cities = getSavedCities();

async function main() {
  showSpinner();
  displayMain();
  displayCities(cities);
}

main();
