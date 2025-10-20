"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
}

export async function createAccount(data){
    try {
        const { userId } = await auth();
        if(!userId) throw new Error("User not authenticated");

        const user = await db.user.findUnique({
            where: { clerkId: userId }
        });

        if(!user){
            throw new Error("User not found.");
        }

        // Convert balance to float before saving

        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)){
            throw new Error("Invalid balance value.");
        }

        // Check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id }
        });

        // If it's the first account, make it default regardless of user input
        // If not, use the user's preference

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

        // If this account should be default, unset other default accounts

        if(shouldBeDefault){
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            });
        }

        // Create the new account
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                isDefault: shouldBeDefault,
                userId: user.id
            }
        })

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };

    } catch (error) {
        throw new Error("Failed to create account: " + error.message);
    }
} 