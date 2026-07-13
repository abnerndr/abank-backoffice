"use server";

import { revalidatePath } from "next/cache";
import { getErrorMessage, serverRequest } from "../api/axios";
import { API_PATHS } from "../api/constants";
import {
  userListSchema,
  userSchema,
  userStatsSchema,
} from "../schemas/users";
import type { ActionResult } from "../types/common";
import type { User, UserList, UserStats } from "../schemas/users";

export async function getUsersAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: boolean;
}): Promise<ActionResult<UserList>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(API_PATHS.users.list, {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search: params.search || undefined,
          isVerified: params.isVerified,
          sortBy: "createdAt",
          sortOrder: "DESC",
        },
      });
      return userListSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getUserStatsAction(): Promise<ActionResult<UserStats>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(API_PATHS.users.stats);
      return userStatsSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getUserByIdAction(
  id: string
): Promise<ActionResult<User>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(API_PATHS.users.byId(id));
      return userSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function verifyUserAction(id: string): Promise<ActionResult<User>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.put(API_PATHS.users.verify(id));
      return userSchema.parse(response);
    });

    revalidatePath("/usuarios");
    revalidatePath(`/usuarios/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
