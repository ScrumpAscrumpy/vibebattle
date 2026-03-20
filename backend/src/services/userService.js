import { prisma } from "../lib/prisma.js";
import { ensureMvpSeedData } from "./bootstrapService.js";
import { HttpError } from "../utils/httpError.js";

function assertUserExists(user, details) {
  if (!user) {
    throw new HttpError(404, "User not found", details);
  }

  return user;
}

export async function findUserById(userId) {
  await ensureMvpSeedData();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return assertUserExists(user, {
    code: "USER_NOT_FOUND",
    userId,
  });
}

export async function findUserByRole(role) {
  await ensureMvpSeedData();
  const user = await prisma.user.findFirst({
    where: { role },
    orderBy: { createdAt: "asc" },
  });

  return assertUserExists(user, {
    code: "USER_NOT_FOUND",
    role,
  });
}

export async function getCurrentUserRecord(req) {
  if (req.currentUser) {
    return req.currentUser;
  }

  return findUserByRole("BUYER");
}

export async function getFixedBuyerUser() {
  return findUserByRole("BUYER");
}

export async function getFixedCoderUser() {
  return findUserByRole("CODER");
}
