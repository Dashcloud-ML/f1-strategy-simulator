export interface Circuit {
  circuitId: string;
  name: string;
  country: string;
  totalLaps: number;
  lapRecordSeconds: number;
  /** 0 (easy) to 1 (hard) — affects how much positions change lap to lap */
  overtakingDifficulty: number;
  /** 0-1 — how hard this circuit is on tyres, feeds the degradation model */
  tyreStressFactor: number;
  pitLaneTimeLossSeconds: number;
}