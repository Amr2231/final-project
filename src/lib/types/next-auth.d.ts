import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    refreshToken?: string;
    accessToken: string;
    role: string;
    username: string;
    created_at: string;
    account_status: string;
    rememberMe: boolean;
  }

  interface Session extends DefaultSession {
    accessToken: string;
    error?: string;
    role: string;
    user: DefaultSession["user"] &
      User & {
        id: string;
        username: string;
      };
    rememberMe: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    refreshToken?: string;
    accessToken: string;
    role: string;
    username: string;
    created_at: string;
    account_status: string;
    error?: "RefreshTokenExpired" | "AccessTokenExpired" | "UnknownError";
    expiresAt?: number;
  }
}
