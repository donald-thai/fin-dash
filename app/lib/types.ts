export interface Transaction {
  "Transaction Date": Date;
  "Post Date": Date;
  Description: string;
  Category: string;
  Type: "Sale" | "Return" | "Fee" | string; // Payment rows are dropped at parse time
  Amount: number; // spend is positive, refunds negative
  Memo: string;
}
