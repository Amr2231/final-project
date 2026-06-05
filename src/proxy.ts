import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define the home routes for each user role
const ROLE_HOME = {
  Admin: "/admin",
  Doctor: "/doctor",
  Receptionist: "/receptionist",
} as const;

// type to ensure we only use valid roles from ROLE_HOME
type Role = keyof typeof ROLE_HOME;
// type Role =
//   | "Admin"
//   | "Doctor"
//   | "Receptionist";

// Function to check if the current page is an authentication page
function isAuthPage(pathname: string) {
  return (
    pathname ==="/" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password") 
  );
}

// Content Security Policy to enhance security by restricting the sources of content 
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'  ", // change this in production to remove 'unsafe-eval' and 'unsafe-inline'
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self' http://localhost:3000 http://localhost:3001", // allow API calls to backend during development
  "worker-src 'self' blob:",
].join("; ");

// Helper function to apply the Content Security Policy header to responses [Any response that comes out of Middleware: It should have a Header:]
function withCSP(res: NextResponse) {
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}

// Main proxy function
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Get token and decode jwt
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // auth page
  if (isAuthPage(pathname)) {
    if (!token) return withCSP(NextResponse.next()); // still allow unauthenticated users to access auth pages
    const role = token.role as Role;
    const home = ROLE_HOME[role];
    if (!home) return withCSP(NextResponse.next());
    return withCSP(NextResponse.redirect(new URL(home, req.nextUrl.origin)));
  }

  // token expired
  if (token?.error === "RefreshTokenExpired") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    res.cookies.delete("next-auth.session-token");
    res.cookies.delete("__Secure-next-auth.session-token");
    return withCSP(res);
  }

  //  token is missing, user is not authenticated
  if (!token) {
    return withCSP(
      NextResponse.redirect(new URL("/login", req.nextUrl.origin)),
    );
  }

  // user is authenticated
  const role = token.role as Role;
  const home = ROLE_HOME[role];

  // role is not recognized or user doesn't have a role
  if (!home) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    res.cookies.delete("next-auth.session-token");
    res.cookies.delete("__Secure-next-auth.session-token");
    return withCSP(res);
  }

  // Allow any authenticated user to reach the unauthorized page
  if (pathname === "/unauthorized") {
    return withCSP(NextResponse.next());
  }

  // user is authenticated but trying to access a page outside of their role's home, redirect them to their home page 
  // protect from privilege escalation
  if (!pathname.startsWith(home)) {
    return withCSP(NextResponse.redirect(new URL(home, req.nextUrl.origin)));
  }
  return withCSP(NextResponse.next());
}

// Apply this middleware to all routes except for static files and API routes 
export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/doctor/:path*",
    "/receptionist/:path*",
    "/api/admin/:path*",
    "/api/doctor/:path*",
    "/api/receptionist/:path*",
    "/login",
    "/forgot-password",
    "/reset-password/:path*",
    "/unauthorized",
  ],
};
