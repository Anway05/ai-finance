import { TransactionType, RecurringInterval, TransactionStatus } from "@prisma/client";

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number | any;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number | any;
  description?: string | null;
  date: Date;
  category: string;
  receiptUrl?: string | null;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval | null;
  nextRecurringDate?: Date | null;
  lastProcessed?: Date | null;
  status: TransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
}

export interface Budget {
  id: string;
  amount: number | any;
  lastAlertSent?: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DateRangeOption {
  label: string;
  days?: number;
}
