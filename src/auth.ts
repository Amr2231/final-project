import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JSON_HEADERS } from "./lib/shared/constants/api";
import { LoginResponse } from "./lib/types/auth";

let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;

let cachedRefreshedToken: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
} | null = null;

let latestRefreshToken: string | null = null;

const API = process.env.API;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        rememberMe: {},
      },
      authorize: async (credentials) => {
        const creds = credentials as {
          email?: string;
          password?: string;
          rememberMe?: string;
        };

        const response = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { ...JSON_HEADERS },
          body: JSON.stringify({
            email: creds.email,
            password: creds.password,
          }),
        });

        const payload: ApiResponse<LoginResponse> = await response.json();
        if (!response.ok || "code" in payload) {
          const p = payload as { message?: string; error?: string };
          throw new Error(p.message || p.error || "Login failed");
        }

        // reset globals on fresh login
        latestRefreshToken = null;
        cachedRefreshedToken = null;
        refreshPromise = null;

        return {
          id: String(payload.user.id),
          name: `${payload.user.first_name} ${payload.user.last_name}`,
          accessToken: payload.token,
          refreshToken: payload.refreshToken,
          rememberMe: creds.rememberMe === "true",
          username:
            payload.user.username ?? payload.user.email?.split("@")[0] ?? "",
          email: payload.user.email,
          role: payload.user.role,
          created_at: payload.user.created_at,
          account_status: payload.user.account_status,
        };
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore */
      }
      return baseUrl;
    },

    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.sub = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.rememberMe = user.rememberMe;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.created_at = user.created_at;
        token.account_status = user.account_status;
        token.username = user.username;
        token.expiresAt = Date.now() + 15 * 60 * 1000;
        token.loginAt = Date.now();
        token.error = undefined;
        return token;
      }

      if (trigger === "update" && session) {
        const first =
          session.firstName ?? (session as { first_name?: string }).first_name;
        const last =
          session.lastName ?? (session as { last_name?: string }).last_name;
        if (first !== undefined || last !== undefined) {
          token.name = `${first ?? ""} ${last ?? ""}`.trim();
        } else if (session.name) {
          token.name = session.name;
        }
        token.email = session.email ?? token.email;
        token.username = session.username ?? token.username;
      }

      if (latestRefreshToken && token.refreshToken !== latestRefreshToken) {
        token.refreshToken = latestRefreshToken;
      }

      if (!token.rememberMe) {
        const SESSION_LIMIT = 60 * 60 * 1000;
        const loginAt = token.loginAt as number | undefined;
        if (loginAt && Date.now() - loginAt > SESSION_LIMIT) {
          return { ...token, error: "RefreshTokenExpired" };
        }
      }

      if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
        return token;
      }

      if (cachedRefreshedToken && Date.now() < cachedRefreshedToken.expiresAt) {
        return {
          ...token,
          accessToken: cachedRefreshedToken.accessToken,
          refreshToken: cachedRefreshedToken.refreshToken,
          expiresAt: cachedRefreshedToken.expiresAt,
          error: undefined,
        };
      }

      if (!refreshPromise) {
        const currentRefreshToken = token.refreshToken as string;

        refreshPromise = fetch(`${API}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: currentRefreshToken }),
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Refresh failed");
            return res.json();
          })
          .catch((err) => {
            refreshPromise = null;
            throw err;
          });
      }

      try {
        const data = await refreshPromise;
        refreshPromise = null;

        const newExpiresAt = Date.now() + 15 * 60 * 1000;

        latestRefreshToken = data.refreshToken;

        cachedRefreshedToken = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: newExpiresAt,
        };

        setTimeout(() => {
          cachedRefreshedToken = null;
        }, 30 * 1000);

        return {
          ...token,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? token.refreshToken,
          expiresAt: newExpiresAt,
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshTokenExpired" };
      }
    },

    session: ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.role = token.role;
      session.rememberMe = token.rememberMe as boolean;
      session.user.id = token.sub ?? "";
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.created_at = token.created_at;
      session.user.account_status = token.account_status;
      session.user.role = token.role;
      session.user.username = token.username;
      session.error = token.error as string | undefined;
      return session;
    },
  },
};
