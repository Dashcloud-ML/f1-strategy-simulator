export interface Driver {
  driverId: string;
  name: string;
  team: string;
  number: number;
  /** 0-100 rating used by the simulation engine to modify pace/consistency */
  skillRating: number;
  countryCode: string;
}