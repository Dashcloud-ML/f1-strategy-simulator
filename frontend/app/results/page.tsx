"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { SimulationRecord } from "@f1-sim/shared";
import { api } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";

export default function ResultsPage() {
  // useSearchParams needs a Suspense boundary around it — see explanation below.
  return (
    <Suspense fallback={<p className="text-graphite-soft">Loading results…</p>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const simulationId = searchParams.get("id");
  const { simulationRecord: contextRecord } = useWizard();

  const [fetchedRecord, setFetchedRecord] = useState<SimulationRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(simulationId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!simulationId) return; // no ?id= in the URL — we'll use context instead

    let cancelled = false;

    async function load() {
      try {
        const record = await api.getSimulation(simulationId!);
        if (!cancelled) setFetchedRecord(record);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load simulation");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [simulationId]);

  // A ?id= in the URL always wins over whatever's in context — an explicit
  // link (e.g. from History) should show that exact simulation, not a stale one.
  const simulationRecord = simulationId ? fetchedRecord : contextRecord;

  if (loading) return <p className="text-graphite-soft">Loading results…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

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
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite-soft">Lap Times</h2>
        <div className="mt-4 h-72 rounded border border-track-line bg-track-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.laps}>
              <CartesianGrid stroke="#E2E1DA" strokeDasharray="3 3" />
              <XAxis dataKey="lap" stroke="#4A4E57" fontSize={12} />
              <YAxis stroke="#4A4E57" fontSize={12} unit="s" />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}s`, "Lap time"]} labelFormatter={(l) => `Lap ${l}`} />
              <Line type="monotone" dataKey="lapTimeSeconds" stroke="#1E3A5F" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite-soft">Tyre Wear</h2>
        <div className="mt-4 h-72 rounded border border-track-line bg-track-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.laps}>
              <CartesianGrid stroke="#E2E1DA" strokeDasharray="3 3" />
              <XAxis dataKey="lap" stroke="#4A4E57" fontSize={12} />
              <YAxis stroke="#4A4E57" fontSize={12} unit="%" domain={[0, 100]} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, "Tyre wear"]} labelFormatter={(l) => `Lap ${l}`} />
              <Line type="monotone" dataKey="tyreWearPercent" stroke="#FFB100" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-10 flex gap-4">
        <Link
          href="/race-setup"
          className="inline-flex items-center rounded bg-signal px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite hover:bg-signal-strong"
        >
          Run Another Simulation
        </Link>
        <Link
          href="/history"
          className="inline-flex items-center rounded border border-track-line px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite hover:bg-track-bg"
        >
          View History
        </Link>
      </div>
    </div>
  );
}

function formatRaceTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, "0")}`;
}