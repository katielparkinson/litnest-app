import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { createUser, getUserByEmail } from "../db/users";
import { requireAuth } from "../middleware/auth";
import { signAuthToken } from "../lib/jwt";
import { env } from "../env";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const result = registerSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: "Invalid registration payload" });
  }

  const email = result.data.email.toLowerCase();
  const existingUser = getUserByEmail(email);

  if (existingUser) {
    return response.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await Bun.password.hash(result.data.password);
  const user = createUser({
    id: randomUUID(),
    email,
    passwordHash
  });

  if (!user) {
    return response.status(500).json({ error: "Failed to create user" });
  }

  const token = await signAuthToken({ sub: user.id, email: user.email });

  return response.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
});

authRouter.post("/login", async (request, response) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: "Invalid login payload" });
  }

  const email = result.data.email.toLowerCase();
  const user = getUserByEmail(email);

  if (!user?.passwordHash) {
    return response.status(401).json({ error: "Invalid credentials" });
  }

  const isValidPassword = await Bun.password.verify(
    result.data.password,
    user.passwordHash
  );

  if (!isValidPassword) {
    return response.status(401).json({ error: "Invalid credentials" });
  }

  const token = await signAuthToken({ sub: user.id, email: user.email });

  return response.json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
});

authRouter.post("/logout", (_request, response) => {
  return response.status(204).send();
});

authRouter.get("/me", requireAuth, (request, response) => {
  return response.json({ user: request.user });
});

authRouter.get("/google", (_request, response) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return response.status(501).json({
      error: "Google OAuth is not configured yet"
    });
  }

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent"
  });

  return response.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  });
});

authRouter.get("/google/callback", (_request, response) => {
  return response.status(501).json({
    error: "Google OAuth callback is not implemented yet",
    nextStep: "Exchange the authorization code, upsert the user, and return a JWT"
  });
});
