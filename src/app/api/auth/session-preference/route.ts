// import { getServerSession } from "next-auth";
// import { authOptions } from "@/auth";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// // post route to set session cookie with remember me option
// export async function POST(req: NextRequest) {
//   const { rememberMe } = await req.json();
//   const session = await getServerSession(authOptions);

//   // If there is no session, return an unauthorized error
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Get the session token from cookies and set it again with the appropriate options based on rememberMe
//   const cookieStore = await cookies();
//   const tokenName =
//     process.env.NODE_ENV === "production"
//       ? "__Secure-next-auth.session-token"
//       : "next-auth.session-token";

//   // If there is no token, return an error
//   const token = cookieStore.get(tokenName)?.value;

//   // If there is no token, return an error
//   if (!token) {
//     return NextResponse.json({ error: "No session token" }, { status: 400 });
//   }

//   // Set the session token cookie with appropriate options based on rememberMe
//   const res = NextResponse.json({ ok: true });

//   // Set cookie options: httpOnly, secure in production, sameSite strict, path /, and maxAge if rememberMe is true
//   res.cookies.set(tokenName, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     ...(rememberMe ? { maxAge: 7 * 24 * 60 * 60 } : {}),
//   });

//   return res;
// }

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const REMEMBER_ME_MAX_AGE = 7 * 24 * 60 * 60; // 7 أيام بالثواني
const SESSION_MAX_AGE = 60 * 60; // ساعة واحدة بالثواني

export async function POST(req: NextRequest) {
  const { rememberMe } = await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maxAge = rememberMe ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE;

  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

  // اقرأ الـ cookie الحالية
  const sessionCookie = req.cookies.get(cookieName);
  if (!sessionCookie) {
    return NextResponse.json(
      { error: "No session cookie found" },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });

  // أعد كتابة نفس الـ cookie بـ maxAge الصح
  res.cookies.set(cookieName, sessionCookie.value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge, // ← هنا بيتغير بناءً على rememberMe
  });

  return res;
}
