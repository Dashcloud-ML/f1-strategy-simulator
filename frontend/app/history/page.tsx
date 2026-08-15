"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SimulationRecord } from "@f1-sim/shared";
import { api } from "@/lib/api";

const ANONYMOUS_USER_ID = "anonymous"; // matches the placeholder in backend/src/handlers/simulate.ts

export default function HistoryPage() {
  const [records, setRecords] = useState<SimulationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getHistory(ANONYMOUS_USER_ID);
        if (!cancelled) setRecords(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-graphite-soft">Loading history…</p>;
  if (error) return <p className="text-red-600">Couldn&apos;t load history: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-graphite">Simulation History</h1>

      {records.length === 0 ? (
        <p className="mt-4 text-graphite-soft">
          No simulations yet —{" "}
          <Link href="/race-setup" className="text-circuit underline">run your first one</Link>.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-track-line rounded border border-track-line bg-track-surface">
          {records.map((record) => (
            <li key={record.simulationId}>
              <Link
                href={`/results?id=${record.simulationId}`}
                className="flex items-center justify-between p-4 hover:bg-track-bg"
              >
                <div>
                  <p className="font-display font-semibold text-graphite">
                    {record.race} — {record.driver}
                  </p>
                  <p className="mt-1 text-sm text-graphite-soft">
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="telemetry text-right text-sm">
                  <p className="text-circuit">P{record.result.finishingPosition}</p>
                  <p className="text-graphite-soft">
                    {(record.result.totalRaceTimeSeconds / 60).toFixed(1)} min
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}