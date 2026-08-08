import { LapResult, SimulationRequest, SimulationResult } from "@f1-sim/shared";
import { getCircuitById } from "../data/circuits";
import { getDriverById } from "../data/drivers";
import { TYRE_OPTIONS, WEATHER_OPTIONS } from "../data/referenceOptions";

export function runSimulation(request: SimulationRequest): SimulationResult {
  const circuit = getCircuitById(request.circuitId);
  const driver = getDriverById(request.driverId);
  const weather = WEATHER_OPTIONS.find((w) => w.id === request.weather);
  const startingTyre = TYRE_OPTIONS.find((t) => t.id === request.startingTyre);
  const nextTyre = TYRE_OPTIONS.find((t) => t.id === request.nextTyre);

  // Validate every lookup before doing any math — fail fast with a clear message
  // rather than crashing later with a confusing "undefined is not a function".
  if (!circuit) throw new Error(`Unknown circuitId: ${request.circuitId}`);
  if (!driver) throw new Error(`Unknown driverId: ${request.driverId}`);
  if (!weather) throw new Error(`Unknown weather: ${request.weather}`);
  if (!startingTyre) throw new Error(`Unknown startingTyre: ${request.startingTyre}`);
  if (!nextTyre) throw new Error(`Unknown nextTyre: ${request.nextTyre}`);
  if (request.pitLap < 1 || request.pitLap >= circuit.totalLaps) {
    throw new Error(`pitLap must be between 1 and ${circuit.totalLaps - 1}`);
  }

  const laps: LapResult[] = [];
  let totalTimeSeconds = 0;
  let tyreWearPercent = 0;

  for (let lap = 1; lap <= circuit.totalLaps; lap++) {
    const onSecondStint = lap > request.pitLap;
    const tyre = onSecondStint ? nextTyre : startingTyre;

    if (lap === request.pitLap + 1) {
      tyreWearPercent = 0; // fresh tyres after the stop
      totalTimeSeconds += circuit.pitLaneTimeLossSeconds;
    }

    const baseLapTime = circuit.lapRecordSeconds * weather.lapTimeModifier;
    const tyreWearPenalty = tyreWearPercent * 0.15; // seconds lost per % of wear
    const driverModifier = (100 - driver.skillRating) * 0.01;

    const lapTimeSeconds = baseLapTime + tyre.paceOffsetSeconds + tyreWearPenalty + driverModifier;
    totalTimeSeconds += lapTimeSeconds;

    tyreWearPercent = Math.min(
      100,
      tyreWearPercent + tyre.baseDegradationPerLap * circuit.tyreStressFactor * weather.degradationModifier * 100
    );

    laps.push({
      lap,
      lapTimeSeconds: Number(lapTimeSeconds.toFixed(3)),
      tyreWearPercent: Number(tyreWearPercent.toFixed(1)),
      position: 1, // TODO: multi-car field modelling — see note below
    });
  }

  return {
    finishingPosition: 1, // TODO: same as above
    totalRaceTimeSeconds: Number(totalTimeSeconds.toFixed(3)),
    laps,
  };
}