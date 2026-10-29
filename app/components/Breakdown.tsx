import { money } from "../lib/metrics";

export default function Breakdown({
  rows,
  selected,
  onToggle,
}: {
  rows: { category: string; total: number }[];
  selected: Set<string>;
  onToggle: (category: string) => void;
}) {
  // Denominator for the percentages (all categories, not just selected ones)
  const sum = rows.reduce((s, r) => s + r.total, 0);
  // Largest category = 100% bar width; the 1 avoids dividing by zero on empty data
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <ul className="flex-1 space-y-1">
      {rows.map(({ category, total }) => {
        // With no filter every row is "active"; with a filter only selected rows are,
        // and the rest are grayed out but stay clickable
        const active = !selected.size || selected.has(category);
        return (
          <li key={category}>
            <button
              type="button"
              aria-pressed={selected.has(category)}
              onClick={() => onToggle(category)}
              className="grid w-full cursor-pointer grid-cols-[9rem_1fr_9rem] items-center gap-3 py-1 text-left text-sm hover:bg-neutral-100"
            >
              <span className={active ? "" : "text-neutral-400"}>{category}</span>
              <span className="h-3 bg-neutral-100">
                <span
                  className={`block h-full ${active ? "bg-black" : "bg-neutral-300"}`}
                  // Bar width is relative to the biggest category; negative net totals clamp to 0
                  style={{ width: `${(Math.max(total, 0) / max) * 100}%` }}
                />
              </span>
              <span className={`text-right tabular-nums ${active ? "" : "text-neutral-400"}`}>
                {money(total)} · {Math.round((total / sum) * 100)}%
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
