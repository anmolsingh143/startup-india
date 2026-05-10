import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/courses(.*)",
  "/achievers",
  "/career-hub",
  "/certification",
  "/contact",
  "/api/razorpay/webhook",
]);

// Admin user IDs - add your Clerk user IDs here
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isEmployee = role === "admin" || role === "employee";

  // 1. Protect Admin Routes
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    const isExplicitAdmin = ADMIN_USER_IDS.includes(userId);

    // Strict Check: User must be an explicit admin OR have the internal role
    if (isExplicitAdmin || isEmployee) {
      return NextResponse.next();
    }

    // Unauthorized - Redirect to home
    console.warn(`Unauthorized admin access attempt by User: ${userId}`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Redirect Employees away from Student Dashboard
  if (userId && isEmployee && req.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 3. Protect all other non-public routes
  if (!isPublicRoute(req)) {
    if (!userId) {
      return (await auth()).redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
