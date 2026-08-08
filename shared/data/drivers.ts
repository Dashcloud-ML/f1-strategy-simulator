import { Driver } from "../types";

export const DRIVERS: Driver[] = [
  {
    driverId: "verstappen",
    name: "Max Verstappen",
    team: "Red Bull Racing",
    number: 1,
    skillRating: 97,
    countryCode: "NL",
  },
  {
    driverId: "norris",
    name: "Lando Norris",
    team: "McLaren",
    number: 4,
    skillRating: 94,
    countryCode: "GB",
  },
  {
    driverId: "leclerc",
    name: "Charles Leclerc",
    team: "Ferrari",
    number: 16,
    skillRating: 93,
    countryCode: "MC",
  },
];

export function getDriverById(driverId: string): Driver | undefined {
  return DRIVERS.find((d) => d.driverId === driverId);
}