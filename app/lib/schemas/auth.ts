import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export const tokenPairSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  refresh_expires_in: z.number(),
});

export const refreshTokenPairSchema = tokenPairSchema;

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullish(),
  avatar: z.string().nullish(),
  isVerified: z.boolean(),
  roles: z.array(roleSchema).default([]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TokenPair = z.infer<typeof tokenPairSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

export function isAdminUser(profile: UserProfile): boolean {
  return profile.roles.some((role) => role.name === "admin");
}
