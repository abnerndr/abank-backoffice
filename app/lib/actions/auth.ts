"use server";

import {
  createPublicApiClient,
  createServerApiClient,
  getErrorMessage,
} from "../api/axios";
import { API_PATHS } from "../api/constants";
import {
  clearAuthCookies,
  hasAuthSession,
  setAuthCookies,
} from "../api/session";
import {
  isAdminUser,
  loginSchema,
  tokenPairSchema,
  userProfileSchema,
} from "../schemas/auth";
import type { ActionResult } from "../types/common";
import type { UserProfile } from "../schemas/auth";

export async function loginAction(
  input: unknown
): Promise<ActionResult<UserProfile>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const client = createPublicApiClient();
    const { data } = await client.post(API_PATHS.auth.login, parsed.data);
    const tokens = tokenPairSchema.parse(data);
    await setAuthCookies(tokens);

    const authed = await createServerApiClient();
    const profileRes = await authed.get(API_PATHS.auth.me);
    const profile = userProfileSchema.parse(profileRes.data);

    if (!isAdminUser(profile)) {
      await clearAuthCookies();
      return {
        ok: false,
        error: "Acesso restrito a administradores.",
      };
    }

    return { ok: true, data: profile };
  } catch (error) {
    await clearAuthCookies();
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    if (await hasAuthSession()) {
      const client = await createServerApiClient();
      await client.post(API_PATHS.auth.logout).catch(() => undefined);
    }

    await clearAuthCookies();
    return { ok: true, data: undefined };
  } catch (error) {
    await clearAuthCookies();
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getSessionAction(): Promise<
  ActionResult<UserProfile | null>
> {
  try {
    if (!(await hasAuthSession())) {
      return { ok: true, data: null };
    }

    const client = await createServerApiClient();
    const profileRes = await client.get(API_PATHS.auth.me);
    const profile = userProfileSchema.parse(profileRes.data);

    if (!isAdminUser(profile)) {
      await clearAuthCookies();
      return { ok: true, data: null };
    }

    return { ok: true, data: profile };
  } catch {
    await clearAuthCookies();
    return { ok: true, data: null };
  }
}
