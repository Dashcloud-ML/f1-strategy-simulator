import { TyreCompound, WeatherCondition } from "./weather";

/** Body of POST /simulate */
export interface SimulationRequest {
  circuitId: string;
  driverId: string;
  weather: WeatherCondition;
  startingTyre: TyreCompound;
  pitLap: number;
  nextTyre: TyreCompound;
}

export interface LapResult {
  lap: number;
  lapTimeSeconds: number;
  tyreWearPercent: number;
  position: number;
}

export interface SimulationResult {
  finishingPosition: number;
  totalRaceTimeSeconds: number;
  laps: LapResult[];
}