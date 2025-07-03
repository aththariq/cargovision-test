import { NextRequest, NextResponse } from "next/server";

// Define routes that require authentication
const protectedMatcher = [
  "/dashboard/:path*",
  "/containers/:path*",
  "/reports/:path*",
  "/analytics/:path*",
  "/chat/:path*",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check token in cookies (set client-side after login)
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Build redirect URL preserving the original destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: protectedMatcher,
}; 