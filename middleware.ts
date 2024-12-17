import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected by authentication
const protectedPaths = ["/favorites", "/bookings", "/reviews", "/reservations", "/properties/create", "/properties/my", "/profile", "/admin"];

// Add paths that should be accessible only to non-authenticated users
const authPaths = ["/auth/sign-in", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  // Check if the path is auth-only (login/register)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // If trying to access protected route without token, redirect to sign-in
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // If trying to access auth routes with token, redirect to home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    "/favorites",
    "/bookings",
    "/reviews",
    "/reservations",
    "/rentals/create",
    "/rentals/my",
    "/profile",
    "/admin",
    "/auth/sign-in",
    "/auth/register",
  ],
};
