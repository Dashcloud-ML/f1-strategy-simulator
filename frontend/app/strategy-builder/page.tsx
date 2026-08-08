"use client";

import Link from "next/link";
import { CIRCUITS, WEATHER_OPTIONS, TYRE_OPTIONS } from "@f1-sim/shared";
import type { TyreCompound, WeatherCondition } from "@f1-sim/shared";
import { useWizard } from "@/lib/wizard-context";

export default function StrategyBuilderPage() {
  const {
    circuitId, weather, startingTyre, pitLap, nextTyre,
    setWeather, setStartingTyre, setPitLap, setNextTyre,
  } = useWizard();

  const circuit = CIRCUITS.find((c) => c.circuitId === circuitId);

  if (!circuit) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-graphite">Strategy Builder</h1>
        <p className="mt-4 text-graphite-soft">
          Pick a circuit and driver first —{" "}
          <Link href="/race-setup" className="text-circuit underline">go to Race Setup</Link>.
        </p>
      </div>
    );
  }

  const maxPitLap = circuit.totalLaps - 1;
  const canContinue = weather !== null && startingTyre !== null && pitLap !== null && nextTyre !== null;

  return (
    <div>
      <p className="telemetry text-sm uppercase tracking-[0.2em] text-circuit">Step 2</p>
      <h1 className="mt-2 text-3xl font-bold text-graphite">Strategy Builder</h1>
      <p className="mt-2 text-sm text-graphite-soft">{circuit.name} — {circuit.totalLaps} laps</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Weather</span>
          <select
            className="mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={weather ?? ""}
            onChange={(e) => setWeather(e.target.value as WeatherCondition)}
          >
            <option value="" disabled>Select weather</option>
            {WEATHER_OPTIONS.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Starting Tyre</span>
          <select
            className="mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={startingTyre ?? ""}
            onChange={(e) => setStartingTyre(e.target.value as TyreCompound)}
          >
            <option value="" disabled>Select starting tyre</option>
            {TYRE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">
            Pit Lap (1–{maxPitLap})
          </span>
          <input
            type="number"
            min={1}
            max={maxPitLap}
            className="telemetry mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={pitLap ?? ""}
            onChange={(e) => setPitLap(Number(e.target.value))}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Next Tyre</span>
          <select
            className="mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={nextTyre ?? ""}
            onChange={(e) => setNextTyre(e.target.value as TyreCompound)}
          >
            <option value="" disabled>Select next tyre</option>
            {TYRE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
      </div>

      {canContinue ? (
        <Link
          href="/simulation"
          className="mt-8 inline-flex items-center rounded bg-signal px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite hover:bg-signal-strong"
        >
          Run Simulation
        </Link>
      ) : (
        <p className="mt-8 text-sm text-graphite-soft">Fill in all four fields to continue.</p>
      )}
    </div>
  );
}