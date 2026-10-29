"use client";

import { useState } from "react";
import { parseCSV } from "./lib/parse";
import type { Transaction } from "./lib/types";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (data.length > 0) {
    return <Dashboard data={data} onStartOver={() => setData([])} />;
  }
  return <Landing onFile={(file) => parseCSV(file, setData, setError)} error={error} />;
}
