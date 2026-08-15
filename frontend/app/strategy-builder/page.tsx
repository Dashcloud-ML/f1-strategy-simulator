"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Circuit, TyreOption, WeatherOption, TyreCompound, WeatherCondition } from "@f1-sim/shared";
import { api } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";

export default function StrategyBuilderPage() {
  const {
    circuitId, weather, startingTyre, pitLap, nextTyre,
    setWeather, setStartingTyre, setPitLap, setNextTyre,
  } = useWizard();

  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [weatherOptions, setWeatherOptions] = useState<WeatherOption[]>([]);
  const [tyreOptions, setTyreOptions] = useState<TyreOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [circuitsData, options] = await Promise.all([
          api.getCircuits(),
          api.getWeatherOptions(),
        ]);
        if (!cancelled) {
          setCircuits(circuitsData);
          setWeatherOptions(options.weather);
          setTyreOptions(options.tyres);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load strategy data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-graphite-soft">Loading strategy options…</p>;
  if (error) return <p className="text-red-600">Couldn&apos;t load strategy data: {error}</p>;

  const circuit = circuits.find((c) => c.circuitId === circuitId);

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
            {weatherOptions.map((w) => (
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
            {tyreOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Pit Lap (1–{maxPitLap})</span>
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
            {tyreOptions.map((t) => (
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