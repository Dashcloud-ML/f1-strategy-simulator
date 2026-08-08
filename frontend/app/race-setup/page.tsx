"use client";

import Link from "next/link";
import { CIRCUITS, DRIVERS } from "@f1-sim/shared";
import { useWizard } from "@/lib/wizard-context";

export default function RaceSetupPage() {
  const { circuitId, driverId, setCircuitId, setDriverId } = useWizard();
  const canContinue = circuitId !== null && driverId !== null;

  return (
    <div>
      <p className="telemetry text-sm uppercase tracking-[0.2em] text-circuit">Step 1</p>
      <h1 className="mt-2 text-3xl font-bold text-graphite">Race Setup</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Circuit</span>
          <select
            className="mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={circuitId ?? ""}
            onChange={(e) => setCircuitId(e.target.value)}
          >
            <option value="" disabled>Select a circuit</option>
            {CIRCUITS.map((c) => (
              <option key={c.circuitId} value={c.circuitId}>
                {c.name} ({c.totalLaps} laps)
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-graphite-soft">Driver</span>
          <select
            className="mt-2 w-full rounded border border-track-line bg-track-surface p-3"
            value={driverId ?? ""}
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option value="" disabled>Select a driver</option>
            {DRIVERS.map((d) => (
              <option key={d.driverId} value={d.driverId}>
                {d.name} — {d.team}
              </option>
            ))}
          </select>
        </label>
      </div>

      {canContinue ? (
        <Link
          href="/strategy-builder"
          className="mt-8 inline-flex items-center rounded bg-signal px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite hover:bg-signal-strong"
        >
          Continue to Strategy Builder
        </Link>
      ) : (
        <p className="mt-8 text-sm text-graphite-soft">Select a circuit and driver to continue.</p>
      )}
    </div>
  );
}