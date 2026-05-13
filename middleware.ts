import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function middleware(request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role?.toLowerCase();
  const pathname = request.nextUrl.pathname;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Student route protection
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/student")) {
    if (role !== "student") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/student/:path*"]
};
