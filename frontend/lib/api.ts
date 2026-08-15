import type {
  Circuit, Driver, SimulationRecord, SimulationRequest, TyreOption, WeatherOption,
} from "@f1-sim/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCircuits: () => request<Circuit[]>("/circuits"),
  getDrivers: () => request<Driver[]>("/drivers"),
  getWeatherOptions: () =>
    request<{ weather: WeatherOption[]; tyres: TyreOption[] }>("/weather-options"),
  runSimulation: (body: SimulationRequest) =>
    request<SimulationRecord>("/simulate", { method: "POST", body: JSON.stringify(body) }),
  getSimulation: (simulationId: string) => request<SimulationRecord>(`/simulation/${simulationId}`),
  getHistory: (userId: string) => request<SimulationRecord[]>(`/history?userId=${encodeURIComponent(userId)}`),
};