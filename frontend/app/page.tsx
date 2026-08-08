import Link from "next/link";

const STEPS = [
  { label: "Circuit & Driver", detail: "Pick a track and a driver from the grid." },
  { label: "Weather", detail: "Dry through heavy rain — each shifts pace and degradation." },
  { label: "Tyres & Pit Stop", detail: "Choose your starting compound, pit lap and next compound." },
  { label: "Run It", detail: "See finishing position, race time, lap chart and tyre wear." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-10 py-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="telemetry text-sm uppercase tracking-[0.2em] text-circuit">
            Lap 1 / Strategy Locked In
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.05] text-graphite md:text-6xl">
            Call the strategy.
            <br />
            Run the race.
          </h1>
          <p className="mt-5 max-w-md text-graphite-soft">
            Set your tyres, your pit lap and the weather — then watch a lap-by-lap
            simulation decide whether it was the right call.
          </p>
          <Link
            href="/race-setup"
            className="mt-8 inline-flex items-center rounded bg-signal px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-graphite transition hover:bg-signal-strong"
          >
            Start a Simulation
          </Link>
        </div>

        <div className="rounded border border-track-line bg-graphite p-6 text-track-bg">
          <p className="telemetry text-xs uppercase tracking-widest text-signal">Box Box Box</p>
          <dl className="mt-4 space-y-3 telemetry text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Pit Lap</dt>
              <dd>25 / 53</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Tyre</dt>
              <dd>MEDIUM &rarr; HARD</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Est. Loss</dt>
              <dd>22.4s</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-graphite-soft">
          How it works
        </h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.label} className="rounded border border-track-line bg-track-surface p-5">
              <p className="telemetry text-xs text-circuit">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display font-semibold text-graphite">{step.label}</p>
              <p className="mt-1 text-sm text-graphite-soft">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}