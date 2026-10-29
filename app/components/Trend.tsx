import { money } from "../lib/metrics";

export default function Trend({ rows }: { rows: { label: string; total: number }[] }) {
  // Tallest month sets the scale; the 1 avoids dividing by zero on empty data
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="flex h-44 items-end gap-6 border-b border-black">
      {rows.map(({ label, total }) => (
        <div key={label} className="flex h-full flex-1 flex-col justify-end text-center text-xs">
          <span className="tabular-nums">{money(total)}</span>
          {/* Capped at 75% of the column height so the dollar label above it always fits */}
          <div className="mt-1 bg-black" style={{ height: `${(Math.max(total, 0) / max) * 75}%` }} />
          <span className="translate-y-5 pt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}
