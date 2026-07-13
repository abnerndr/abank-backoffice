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

export async function getServerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.accessToken)?.value;
}

export async function getServerRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.refreshToken)?.value;
}

export async function setAuthCookies(tokens: TokenPair): Promise<void> {
  const cookieStore = await cookies();
  const accessMaxAge = Math.max(60, Math.floor(tokens.expires_in / 1000));
  const refreshMaxAge = Math.max(
    60,
    Math.floor(tokens.refresh_expires_in / 1000)
  );

  cookieStore.set(
    COOKIE_NAMES.accessToken,
    tokens.access_token,
    cookieOptions(accessMaxAge)
  );
  cookieStore.set(
    COOKIE_NAMES.refreshToken,
    tokens.refresh_token,
    cookieOptions(refreshMaxAge)
  );
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
}
