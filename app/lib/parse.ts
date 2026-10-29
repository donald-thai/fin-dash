import Papa from "papaparse";
import type { Transaction } from "./types";

const REQUIRED = ["Transaction Date", "Description", "Category", "Type", "Amount"];

export const parseCSV = (
  file: File,
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  Papa.parse<Transaction>(file, {
    header: true, // Automatically converts rows into JSON objects using the headers
    skipEmptyLines: true, // Prevents blank lines from throwing errors or creating empty blocks
    transform: function (value, columnName) {
      if ((columnName === "Transaction Date" || columnName === "Post Date") && value) {
        return new Date(value); // Converts the string to a JS Date Object
      } else if (columnName === "Amount") {
        return value.trim() === "" ? NaN : Number(value) * -1;
      } else if (columnName === "Description") {
        // The export HTML-escapes some merchant names (e.g. "LEE&amp;039;S")
        return value.replace(/&amp;039;/g, "'").replace(/&amp;/g, "&");
      } else if (columnName === "Category") {
        return value || "Uncategorized";
      }
      return value;
    },
    complete: (results) => {
      const missing = REQUIRED.filter((h) => !results.meta.fields?.includes(h));
      if (missing.length) {
        return setError("Not a valid Chase export. Missing columns: " + missing.join(", "));
      }
      if (results.errors.length) {
        const e = results.errors[0];
        return setError(`Malformed CSV (row ${(e.row ?? 0) + 2}): ${e.message}`);
      }
      // Card payments are not spending
      const rows = results.data.filter((t) => t.Type !== "Payment");
      const bad = rows.findIndex(
        (t) => !(t["Transaction Date"] instanceof Date) || isNaN(t["Transaction Date"].getTime()) || !Number.isFinite(t.Amount),
      );
      if (bad !== -1) return setError(`Invalid date or amount in row ${bad + 2}.`);
      if (!rows.length) return setError("No transactions found in this file.");
      setData(rows);
      setError(null);
    },
    error: (err) => {
      setError("Failed to parse file: " + err.message);
    },
  });
};

export const filterData = (data: Transaction[], selected: Set<string>) => {
  if (!selected.size) return data;
  return data.filter((transaction) => selected.has(transaction.Category));
};
