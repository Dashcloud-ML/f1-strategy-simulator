import { runSimulation } from "../engine/simulationEngine";
import { SimulationRequest } from "@f1-sim/shared";

describe("runSimulation", () => {
  const baseRequest: SimulationRequest = {
    circuitId: "monza",
    driverId: "verstappen",
    weather: "dry",
    startingTyre: "medium",
    pitLap: 25,
    nextTyre: "hard",
  };

  it("returns one lap result per circuit lap", () => {
    const result = runSimulation(baseRequest);
    expect(result.laps).toHaveLength(53); // Monza's totalLaps
  });

  it("accumulates a positive total race time", () => {
    const result = runSimulation(baseRequest);
    expect(result.totalRaceTimeSeconds).toBeGreaterThan(0);
  });

  it("throws on an unknown circuit", () => {
    expect(() => runSimulation({ ...baseRequest, circuitId: "nowhere" })).toThrow(/Unknown circuitId/);
  });

  it("throws on an out-of-range pit lap", () => {
    expect(() => runSimulation({ ...baseRequest, pitLap: 999 })).toThrow(/pitLap must be between/);
  });
});