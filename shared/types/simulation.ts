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

/** A saved simulation — what POST /simulate persists and GET /simulation/{id} and GET /history return */
export interface SimulationRecord {
  simulationId: string;
  userId: string;
  race: string; // circuitId
  driver: string; // driverId
  weather: WeatherCondition;
  tyres: {
    starting: TyreCompound;
    pitLap: number;
    next: TyreCompound;
  };
  result: SimulationResult;
  createdAt: string; // ISO timestamp
}