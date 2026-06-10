import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const ROLE_HOME = {
  Admin: "/admin",
  Doctor: "/doctor",
  Receptionist: "/receptionist",
} as const;

type Role = keyof typeof ROLE_HOME;

function isAuthPage(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password")
  );
}

const isProd = process.env.NODE_ENV === "production";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  isProd
    ? `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL}`
    : "connect-src 'self' http://localhost:3000 http://localhost:3001",
  "worker-src 'self' blob:",
].join("; ");

function withCSP(res: NextResponse) {
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}

function clearSession(res: NextResponse) {
  res.cookies.delete({ name: "next-auth.session-token", path: "/" });
  res.cookies.delete({
    name: "__Secure-next-auth.session-token",
    path: "/",
    secure: true,
  });
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // صفحات الـ auth
  if (isAuthPage(pathname)) {
    if (!token) return withCSP(NextResponse.next());
    const role = token.role as Role;
    const home = ROLE_HOME[role];
    if (!home) return withCSP(NextResponse.next());
    return withCSP(NextResponse.redirect(new URL(home, req.nextUrl.origin)));
  }

  // token expired
  if (token?.error === "RefreshTokenExpired") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res));
  }

  // مفيش token
  if (!token) {
    return withCSP(
      NextResponse.redirect(new URL("/login", req.nextUrl.origin)),
    );
  }

  // ← جديد: الأكونت متقفل
  if (token.account_status === "locked") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res));
  }

  const role = token.role as Role;
  const home = ROLE_HOME[role];

  if (!home) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res));
  }

  if (pathname === "/unauthorized") {
    return withCSP(NextResponse.next());
  }

  if (!pathname.startsWith(home)) {
    return withCSP(NextResponse.redirect(new URL(home, req.nextUrl.origin)));
  }

  return withCSP(NextResponse.next());
}

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
