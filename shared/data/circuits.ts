import { Circuit } from "../types";

// Small set for now — expand once the engine and UI are working end-to-end.
export const CIRCUITS: Circuit[] = [
  {
    circuitId: "monza",
    name: "Autodromo Nazionale Monza",
    country: "Italy",
    totalLaps: 53,
    lapRecordSeconds: 80.9,
    overtakingDifficulty: 0.2,
    tyreStressFactor: 0.4,
    pitLaneTimeLossSeconds: 22,
  },
  {
    circuitId: "monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    totalLaps: 78,
    lapRecordSeconds: 71.4,
    overtakingDifficulty: 0.95,
    tyreStressFactor: 0.3,
    pitLaneTimeLossSeconds: 20,
  },
  {
    circuitId: "silverstone",
    name: "Silverstone Circuit",
    country: "United Kingdom",
    totalLaps: 52,
    lapRecordSeconds: 87.1,
    overtakingDifficulty: 0.4,
    tyreStressFactor: 0.8,
    pitLaneTimeLossSeconds: 24,
  },
];

export function getCircuitById(circuitId: string): Circuit | undefined {
  return CIRCUITS.find((c) => c.circuitId === circuitId);
}