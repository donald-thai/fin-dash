import { useMemo, useState } from "react";
import { filterData } from "../lib/parse";
import { byCategory, byMonth, getSum, money } from "../lib/metrics";
import type { Transaction } from "../lib/types";
import Breakdown from "./Breakdown";
import Trend from "./Trend";
import TransactionTable from "./TransactionTable";

export default function Dashboard({
  data,
  onStartOver,
}: {
  data: Transaction[];
  onStartOver: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => filterData(data, selected), [data, selected]);
  const categories = useMemo(() => byCategory(data), [data]); // unfiltered so every category stays clickable
  const months = useMemo(() => byMonth(filtered), [filtered]);

  const toggle = (category: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(category)) next.add(category);
      return next;
    });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Every cell uses the same px-10 gutter so content lines up with the screen edges */}
      <header className="flex items-center justify-between border-b border-black px-10 py-8">
        <span className="text-xl font-semibold">Fin-</span>
        <button type="button" onClick={onStartOver} className="cursor-pointer font-semibold">
          Start over
        </button>
      </header>
      <nav className="flex h-11 border-b border-black pl-10">
        <span className="flex items-center border-x border-black px-4 text-sm underline">Summary</span>
      </nav>
      {/* grid-rows: the KPI row hugs its content and the second row takes all leftover height */}
      <div className="grid flex-1 grid-cols-1 content-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        <div className="border-b border-black px-10 py-8">
          <p className="text-5xl font-semibold tabular-nums">{money(getSum(filtered))}</p>
          <p>total spent</p>
        </div>
        <div className="border-b border-black px-10 py-8 lg:border-l">
          <p className="text-5xl font-semibold tabular-nums">{filtered.length}</p>
          <p>transactions</p>
        </div>
        <div className="flex flex-col">
          <section className="flex flex-col gap-4 border-b border-black px-10 py-8">
            <h2>breakdown</h2>
            <Breakdown rows={categories} selected={selected} onToggle={toggle} />
          </section>
          <section className="flex flex-col gap-4 px-10 py-8">
            <h2>trend</h2>
            <Trend rows={months} />
          </section>
        </div>
        <div className="relative min-h-96 border-black px-10 lg:border-l lg:px-0">
          {/* No vertical padding on the scroller: the sticky header sits flush against the line above,
              so rows can't show through a gap. The side gutters are inset so the scrollbar stays inside them. */}
          <div className="overflow-auto scrollbar-none lg:absolute lg:inset-y-0 lg:right-10 lg:left-10">
            <TransactionTable data={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
