"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

const serializeDecimal = (obj: any) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export const getAccountWithTransactions = async (accountId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await checkUser();
  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
};

export const updateDefaultAccount = async (accountId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();
    if (!user) throw new Error("User not found");

    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDecimal(account) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update default account" };
  }
};

export const bulkDeleteTransactions = async (transactionIds: string[]) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();
    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    for (const transaction of transactions) {
      await db.$transaction(async (tx) => {
        await tx.transaction.delete({
          where: { id: transaction.id },
        });

        const balanceChange =
          transaction.type === "EXPENSE"
            ? transaction.amount.toNumber()
            : -transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to bulk delete transactions" };
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();
    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) throw new Error("Account not found");

    await db.$transaction(async (tx) => {
      await tx.account.delete({
        where: { id: accountId },
      });

      const remaining = await tx.account.findMany({
        where: { userId: user.id },
      });

      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        await tx.account.update({
          where: { id: remaining[0].id },
          data: { isDefault: true },
        });
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete account" };
  }
};
