// proxy.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Wrap Clerk middleware and expose as Proxy default export
const handler = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow all other requests
  return NextResponse.next();
});

export default function proxy(req) {
  return handler(req);
}

// Tell Next.js which paths to run proxy on
export const config = {
  matcher: [
    // Run on everything except static assets and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and trpc routes
    "/(api|trpc)(.*)",
  ],
};