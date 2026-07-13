import { cookies } from "next/headers";
import type { TokenPair } from "../schemas/auth";
import { COOKIE_NAMES } from "./constants";

function cookieOptions(maxAgeSeconds: number) {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** API sends TTL in seconds (defaults) or milliseconds (.env.example). */
export function tokenTtlToMaxAgeSeconds(ttl: number): number {
  const seconds =
    ttl > 10_000 && ttl % 1_000 === 0 ? Math.floor(ttl / 1_000) : Math.floor(ttl);
  return Math.max(60, seconds);
}

export async function getServerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.accessToken)?.value;
}

export async function getServerRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.refreshToken)?.value;
}

export async function hasAuthSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(
    cookieStore.get(COOKIE_NAMES.accessToken)?.value ||
      cookieStore.get(COOKIE_NAMES.refreshToken)?.value
  );
}

export async function setAuthCookies(tokens: TokenPair): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAMES.accessToken,
    tokens.access_token,
    cookieOptions(tokenTtlToMaxAgeSeconds(tokens.expires_in))
  );
  cookieStore.set(
    COOKIE_NAMES.refreshToken,
    tokens.refresh_token,
    cookieOptions(tokenTtlToMaxAgeSeconds(tokens.refresh_expires_in))
  );
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: COOKIE_NAMES.accessToken, path: "/" });
  cookieStore.delete({ name: COOKIE_NAMES.refreshToken, path: "/" });
}
