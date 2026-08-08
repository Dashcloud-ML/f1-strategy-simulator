import { TyreOption, WeatherOption } from "../types";

export const WEATHER_OPTIONS: WeatherOption[] = [
  { id: "dry", label: "Dry", lapTimeModifier: 1.0, degradationModifier: 1.0 },
  { id: "overcast", label: "Overcast", lapTimeModifier: 1.01, degradationModifier: 0.95 },
  { id: "light_rain", label: "Light Rain", lapTimeModifier: 1.08, degradationModifier: 0.7 },
  { id: "heavy_rain", label: "Heavy Rain", lapTimeModifier: 1.25, degradationModifier: 0.5 },
];

export const TYRE_OPTIONS: TyreOption[] = [
  { id: "soft", label: "Soft", paceOffsetSeconds: 0, baseDegradationPerLap: 0.045 },
  { id: "medium", label: "Medium", paceOffsetSeconds: 0.5, baseDegradationPerLap: 0.03 },
  { id: "hard", label: "Hard", paceOffsetSeconds: 0.9, baseDegradationPerLap: 0.018 },
  { id: "intermediate", label: "Intermediate", paceOffsetSeconds: 2.5, baseDegradationPerLap: 0.025 },
  { id: "wet", label: "Wet", paceOffsetSeconds: 4.0, baseDegradationPerLap: 0.02 },
];