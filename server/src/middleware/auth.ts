import type { NextFunction, Request, Response } from "express";
import { getUserById } from "../db/users";
import { verifyAuthToken } from "../lib/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

function getBearerToken(request: Request) {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = getBearerToken(request);

  if (!token) {
    return response.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const payload = await verifyAuthToken(token);
    const user = getUserById(payload.sub);

    if (!user) {
      return response.status(401).json({ error: "User no longer exists" });
    }

    request.user = { id: user.id, email: user.email };
    next();
  } catch {
    return response.status(401).json({ error: "Invalid token" });
  }
}
