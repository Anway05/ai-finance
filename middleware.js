import arcjet, { createMiddleware, detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
])


const aj = arcjet({
  key: process.env.ARCJET_KEY,
  // charecteristics: ["userId"], // Track based on Clerk userId

  rules: [
    // Shield protection for content and security
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "GO_HTTP", // For Inngest
        // See the full list at https://arcjet.com/bot-list
      ],
    })
  ]
})

const clerk =  clerkMiddleware(async(auth,req) => {
  const { userId } = await auth();

  if(!userId && isProtectedRoute(req)) {

    const { redirectToSignIn } = await auth();

    return redirectToSignIn()
  }
  return NextResponse.next();
});

// Chain middlewares - Arcjet runs first, then Clerk
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    // Match all routes including the landing page
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}