import aj from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const decision = await aj.protect(req, { userId, requested: 1 });
  if (decision.isDenied()) {
    return new NextResponse("Rate limit exceeded or suspicious activity", { status: 429 });
  }

  const body = await req.json();
  const { amount, type, accountId, category, description, date } = body;

  const transaction = await db.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      accountId,
      category: category || "other",
      description: description || "",
      date: date ? new Date(date) : new Date(),
      userId,
    },
  });

  return NextResponse.json(transaction);
}
