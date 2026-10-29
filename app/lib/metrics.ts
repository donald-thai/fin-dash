import type { Transaction } from "./types";

export const getSum = (data: Transaction[]) => {
  return data.reduce((sum, transaction) => sum + transaction["Amount"], 0);
};

// Net spend per category (refunds subtract), biggest first
export const byCategory = (data: Transaction[]) => {
  const totals = new Map<string, number>();
  for (const t of data) totals.set(t.Category, (totals.get(t.Category) ?? 0) + t.Amount);
  return [...totals].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
};

// Net spend per calendar month, oldest first
export const byMonth = (data: Transaction[]) => {
  const totals = new Map<string, number>();
  for (const t of data) {
    const d = t["Transaction Date"];
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // sortable
    totals.set(key, (totals.get(key) ?? 0) + t.Amount);
  }
  return [...totals]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => {
      const [y, m] = key.split("-").map(Number);
      const label = new Date(y, m - 1).toLocaleString("en-US", { month: "short", year: "numeric" });
      return { label, total };
    });
};

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
