"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { SimulationRecord, TyreCompound, WeatherCondition } from "@f1-sim/shared";

interface WizardContextValue {
  circuitId: string | null;
  driverId: string | null;
  weather: WeatherCondition | null;
  startingTyre: TyreCompound | null;
  pitLap: number | null;
  nextTyre: TyreCompound | null;
  simulationRecord: SimulationRecord | null;
  setCircuitId: (id: string) => void;
  setDriverId: (id: string) => void;
  setWeather: (w: WeatherCondition) => void;
  setStartingTyre: (t: TyreCompound) => void;
  setPitLap: (lap: number) => void;
  setNextTyre: (t: TyreCompound) => void;
  setSimulationRecord: (r: SimulationRecord) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [circuitId, setCircuitId] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [startingTyre, setStartingTyre] = useState<TyreCompound | null>(null);
  const [pitLap, setPitLap] = useState<number | null>(null);
  const [nextTyre, setNextTyre] = useState<TyreCompound | null>(null);
  const [simulationRecord, setSimulationRecord] = useState<SimulationRecord | null>(null);

  return (
    <WizardContext.Provider
      value={{
        circuitId, driverId, weather, startingTyre, pitLap, nextTyre, simulationRecord,
        setCircuitId, setDriverId, setWeather, setStartingTyre, setPitLap, setNextTyre, setSimulationRecord,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside <WizardProvider>");
  return ctx;
}