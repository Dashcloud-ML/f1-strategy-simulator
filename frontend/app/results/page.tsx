"use client";

import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useWizard } from "@/lib/wizard-context";

export default function ResultsPage() {
  const { simulationRecord } = useWizard();

  if (!simulationRecord) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-graphite">Results</h1>
        <p className="mt-4 text-graphite-soft">
          No simulation to show yet —{" "}
          <Link href="/race-setup" className="text-circuit underline">start one here</Link>.
        </p>
      </div>
    );
  }

  const { result } = simulationRecord;

  return (
    <div>
      <p className="telemetry text-sm uppercase tracking-[0.2em] text-circuit">Result</p>
      <h1 className="mt-2 text-3xl font-bold text-graphite">
        P{result.finishingPosition} — {formatRaceTime(result.totalRaceTimeSeconds)}
      </h1>

      <div className="mt-4 flex gap-8 telemetry text-sm text-graphite-soft">
        <span>Circuit: {simulationRecord.race}</span>
        <span>Driver: {simulationRecord.driver}</span>
        <span>Pit lap: {simulationRecord.tyres.pitLap}</span>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite-soft">
          Lap Times
        </h2>
        <div className="mt-4 h-72 rounded border border-track-line bg-track-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.laps}>
              <CartesianGrid stroke="#E2E1DA" strokeDasharray="3 3" />
              <XAxis dataKey="lap" stroke="#4A4E57" fontSize={12} />
              <YAxis stroke="#4A4E57" fontSize={12} unit="s" />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}s`, "Lap time"]}
                labelFormatter={(lap) => `Lap ${lap}`}
              />
              <Line type="monotone" dataKey="lapTimeSeconds" stroke="#1E3A5F" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite-soft">
          Tyre Wear
        </h2>
        <div className="mt-4 h-72 rounded border border-track-line bg-track-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.laps}>
              <CartesianGrid stroke="#E2E1DA" strokeDasharray="3 3" />
              <XAxis dataKey="lap" stroke="#4A4E57" fontSize={12} />
              <YAxis stroke="#4A4E57" fontSize={12} unit="%" domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Tyre wear"]}
                labelFormatter={(lap) => `Lap ${lap}`}
              />
              <Line type="monotone" dataKey="tyreWearPercent" stroke="#FFB100" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <Link
        href="/race-setup"
        className="mt-10 inline-flex items-center rounded border border-track-line px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite hover:bg-track-bg"
      >
        Run Another Simulation
      </Link>
    </div>
  );
}

function formatRaceTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, "0")}`;
}