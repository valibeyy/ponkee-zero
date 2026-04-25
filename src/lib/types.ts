export type ISODate = string;

export type Payment = {
  date: ISODate;
  amount: number;
};

export type Debt = {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate?: number;
  minimumPayment?: number;
  createdAt: number;
  payments: Payment[];
};

export type SortMode = "snowball" | "avalanche";
