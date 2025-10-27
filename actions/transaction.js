"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

export async function createTransaction(data){
    try {
        const { userId } = await auth();

        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkId: userId },
        })

        if(!user) throw new Error("User not found");

        const account = await db.account.findUnique({
            where: { 
                id: data.accountId, 
                userId: user.id 
            },
        })

        if(!account){
            throw new Error("Account not found");
        }

        // Calculate new balance
        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

    } catch (error) {
        
    }
}