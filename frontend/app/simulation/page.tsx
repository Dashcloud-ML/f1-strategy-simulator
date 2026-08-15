"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";

export default function SimulationPage() {
  const router = useRouter();
  const {
    circuitId, driverId, weather, startingTyre, pitLap, nextTyre, setSimulationRecord,
  } = useWizard();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!circuitId || !driverId || !weather || !startingTyre || pitLap === null || !nextTyre) {
      setError("Missing strategy inputs — go back and complete Strategy Builder first.");
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const record = await api.runSimulation({
          circuitId: circuitId!, driverId: driverId!, weather: weather!,
          startingTyre: startingTyre!, pitLap: pitLap!, nextTyre: nextTyre!,
        });
        if (!cancelled) {
          setSimulationRecord(record);
          router.push("/results");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Simulation failed");
      }
    }

    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return <p className="telemetry text-graphite-soft">Running simulation…</p>;
}