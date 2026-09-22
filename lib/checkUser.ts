import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: email,
        name: name,
        imageUrl: user.imageUrl || null,
      },
    });

    return newUser;
  } catch (error: any) {
    console.error("Error in checkUser:", error);
    if (process.env.NODE_ENV !== "production") {
      return null;
    }
    if (error.code === "P2002") {
      const email = user.emailAddresses?.[0]?.emailAddress;

      let existingUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (!existingUser && email) {
        existingUser = await db.user.findUnique({
          where: {
            email: email,
          },
        });

        if (existingUser) {
          existingUser = await db.user.update({
            where: { id: existingUser.id },
            data: { clerkUserId: user.id },
          });
        }
      }

      if (existingUser) {
        return existingUser;
      }
    }
    throw error;
  }
};
