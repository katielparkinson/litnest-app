import { SignJWT, jwtVerify } from "jose";
import { env } from "../env";
import type { AuthTokenPayload } from "../types";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signAuthToken(payload: AuthTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

export async function verifyAuthToken(token: string) {
  const result = await jwtVerify<AuthTokenPayload>(token, secret, {
    algorithms: ["HS256"]
  });

  return result.payload;
}
