"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

export async function getCurrentBudget(accountId?: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();
    if (!user) throw new Error("User not found");

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        ...(accountId ? { accountId } : {}),
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await checkUser();
  if (!user) throw new Error("User not found");

  const existingBudget = await db.budget.findUnique({
    where: { userId: user.id },
  });

  let budget;

  if (existingBudget) {
    budget = await db.budget.update({
      where: { id: existingBudget.id },
      data: { amount },
    });
  } else {
    budget = await db.budget.create({
      data: {
        userId: user.id,
        amount,
      },
    });
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    data: { ...budget, amount: budget.amount.toNumber() },
  };
}
