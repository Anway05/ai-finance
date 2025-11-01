// app/api/transaction/route.js
import aj from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  // ✅ Arcjet protection
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new Response("Rate limit exceeded or suspicious activity", { status: 429 });
  }

  // ✅ Clerk authentication
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ✅ Your normal business logic
  const body = await req.json();
  const { amount, type, accountId } = body;

  const transaction = await db.transaction.create({
    data: {
      amount,
      type,
      accountId,
      userId,
    },
  });

  return Response.json(transaction);
}
