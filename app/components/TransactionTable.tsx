import { useMemo, useState } from "react";
import { money } from "../lib/metrics";
import type { Transaction } from "../lib/types";

const COLUMNS = [
  { label: "Date", key: "Transaction Date" },
  { label: "Type", key: "Type" },
  { label: "Merchant", key: "Description" },
  { label: "Amount", key: "Amount" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

// Dates are compared as timestamps; everything else compares as its own value
const sortValue = (t: Transaction, key: SortKey) =>
  key === "Transaction Date" ? t[key].getTime() : t[key];

export default function TransactionTable({ data }: { data: Transaction[] }) {
  // dir: 1 = ascending, -1 = descending. Starts on amount, biggest first.
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "Amount", dir: -1 });

  const rows = useMemo(
    () =>
      // Copy first: sort() mutates, and `data` is shared state owned by the parent
      [...data].sort((a, b) => {
        const x = sortValue(a, sort.key);
        const y = sortValue(b, sort.key);
        // Numbers (dates, amounts) subtract; text (type, merchant) compares alphabetically
        const cmp = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
        return cmp * sort.dir; // multiplying by -1 flips the order
      }),
    [data, sort],
  );

  // Clicking the active column reverses it; clicking a new column starts ascending
  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  return (
    // border-separate (not collapse) so borders stay attached to the sticky header cells while scrolling
    <table className="w-full border-separate border-spacing-0 text-left text-sm">
      <thead>
        <tr>
          {COLUMNS.map(({ label, key }) => (
            <th
              key={key}
              aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
              // pt-6 is the top spacing, inside the opaque sticky cell, so nothing scrolls through it
              className={`sticky top-0 border-b border-black bg-white pt-6 pr-3 pb-2 font-semibold ${key === "Amount" ? "text-right" : ""}`}
            >
              <button type="button" onClick={() => toggle(key)} className="cursor-pointer">
                {label}
                {sort.key === key && (sort.dir === 1 ? " ↑" : " ↓")}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={i}>
            <td className="border-b border-neutral-200 py-2 pr-3 whitespace-nowrap">{t["Transaction Date"].toLocaleDateString("en-US")}</td>
            <td className="border-b border-neutral-200 py-2 pr-3">{t.Type}</td>
            <td className="border-b border-neutral-200 py-2 pr-3">{t.Description}</td>
            <td className="border-b border-neutral-200 py-2 text-right tabular-nums">{money(t.Amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
