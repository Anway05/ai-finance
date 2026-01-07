"use server";

import { db }from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

const serializeDecimal = (obj) => {

    const serialized = { ...obj };
    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}

export const getAccountWithTransactions = async (accountId) => {

    const { userId } = await auth();

    if(!userId) throw new Error("Unauthorized");

    const user = await checkUser();

    if(!user) throw new Error("User not found");

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

    if(!account) return null;

    return{
        ...serializeDecimal(account),
        transactions: account.transactions.map(serializeDecimal),
    }
}

export const updateDefaultAccount = async (accountId) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();

    if (!user) {
      throw new Error("User not found");
    }

    // First, unset any existing default account
    await db.account.updateMany({
        where: {
            userId: user.id,
            isDefault: true,
        },
        data: {
            isDefault: false,
        },
    })
    // Set the specified account as default

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
    return{ success: true, data: serializeTransaction(account)};
} catch(error) {
    return { success: false, error: error.message };
}
}

export const bulkDeleteTransactions = async (transactionIds) => {
    try {
        const { userId } = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await checkUser();

        if(!user) throw new Error("User not found");

    } catch (error) {
        
    }
}

export const deleteAccount = async (accountId) => {
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

        // Delete account and ensure another default account is set if needed
        await db.$transaction(async (tx) => {
            await tx.account.delete({
                where: { id: accountId },
            });

            // If user has remaining accounts and none is default, set one as default
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
    } catch (error) {
        return { success: false, error: error.message };
    }
}