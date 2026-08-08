export type WeatherCondition = "dry" | "overcast" | "light_rain" | "heavy_rain";

export interface WeatherOption {
  id: WeatherCondition;
  label: string;
  /** Multiplier on base lap time. 1.0 = no effect */
  lapTimeModifier: number;
  /** Multiplier on tyre degradation rate */
  degradationModifier: number;
}

export type TyreCompound = "soft" | "medium" | "hard" | "intermediate" | "wet";

export interface TyreOption {
  id: TyreCompound;
  label: string;
  /** Seconds slower per lap than the fastest compound, at zero wear */
  paceOffsetSeconds: number;
  /** Wear accumulated per lap (0-1 scale), before circuit/weather modifiers */
  baseDegradationPerLap: number;
}