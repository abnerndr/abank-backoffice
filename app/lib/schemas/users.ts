import { z } from "zod";
import { roleSchema } from "./auth";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullish(),
  avatar: z.string().nullish(),
  googleId: z.string().nullish(),
  isVerified: z.boolean(),
  roles: z.array(roleSchema).default([]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const userListSchema = z.object({
  data: z.array(userSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const userStatsSchema = z.object({
  total: z.number(),
  verified: z.number(),
  unverified: z.number(),
  withGoogle: z.number(),
});

export type User = z.infer<typeof userSchema>;
export type UserList = z.infer<typeof userListSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
