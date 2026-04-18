import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  API_HOST: z.string().default("0.0.0.0"),
  CORS_ORIGIN: z.string().default("*"),
  JWT_SECRET: z.string().min(1).default("dev-litnest-jwt-secret"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  LITNEST_APP_URL: z.string().default("http://localhost:8081"),
  SQLITE_PATH: z.string().min(1).default("./data/litnest.sqlite")
});

export const env = envSchema.parse(process.env);
