/*
 * Mongoose is a stateful driver for MongoDB
 * It doesn’t automatically maintain a global connection pool
 * You can have multiple mongoose instances, each connected separately.
 * It needs to “attach” models to that specific connection.
 */

// ✅ Creates a connection pool (a set of database connections)
// ✅ Keeps them alive between queries
// ✅ Automatically reconnects if dropped
// ✅ Handles concurrency & pooling under the hood
// ✅ Get user by email

import { CreateUserInput, IUser } from "@/shared/interfaces/user";
import prisma from "@/shared/lib/prisma";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByGoogleid(googleId: string) {
  return await prisma.user.findFirst({
    where: { googleId, providers: { has: "google" } },
  });
}

export async function createUser(data: CreateUserInput) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password ?? null,
      image: data.image,
      ...(data.googleId ? { googleId: data.googleId } : {}),
      providers: data.providers ?? ["google"],
    },
  });
}

export async function linkGoogleProvider(
  userId: string,
  googleId: string,
  image?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      providers: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      googleId,
      // only set image if user doesn't already have one
      image: user.image ?? image ?? undefined,
      providers: user.providers.includes("google")
        ? user.providers
        : [...user.providers, "google"],
    },
  });
}
