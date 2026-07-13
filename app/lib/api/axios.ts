import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { refreshTokenPairSchema } from "../schemas/auth";
import { API_PATHS } from "./constants";
import { getErrorMessage } from "./errors";
import {
  clearAuthCookies,
  getServerAccessToken,
  getServerRefreshToken,
  setAuthCookies,
} from "./session";

export function getApiBaseUrl(server = typeof window === "undefined"): string {
  if (server) {
    return (
      process.env.API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8000"
    );
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

export function createPublicApiClient(): AxiosInstance {
  return axios.create({
    baseURL: getApiBaseUrl(true),
    headers: { "Content-Type": "application/json" },
  });
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = await getServerRefreshToken();
      if (!refreshToken) return null;

      const client = createPublicApiClient();
      const { data } = await client.post(API_PATHS.auth.refresh, {
        refreshToken,
      });

      const tokens = refreshTokenPairSchema.parse(data);
      await setAuthCookies(tokens);
      return tokens.access_token;
    } catch {
      await clearAuthCookies();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function createServerApiClient(): Promise<AxiosInstance> {
  const accessToken = await getServerAccessToken();

  const client = axios.create({
    baseURL: getApiBaseUrl(true),
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        original &&
        !original._retry &&
        !original.url?.includes(API_PATHS.auth.refresh)
      ) {
        original._retry = true;
        const newToken = await refreshAccessToken();

        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return client.request(original);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export async function serverRequest<T>(
  fn: (client: AxiosInstance) => Promise<T>
): Promise<T> {
  const client = await createServerApiClient();
  return fn(client);
}

export { getErrorMessage };
