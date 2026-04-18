import cors from "cors";
import express from "express";
import { env } from "./env";
import { authRouter } from "./routes/auth";
import { booksRouter } from "./routes/books";
import { healthRouter } from "./routes/health";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      credentials: false
    })
  );
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      service: "litnest-api",
      docs: {
        health: "/health",
        auth: "/auth",
        books: "/books"
      }
    });
  });

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/books", booksRouter);

  return app;
}
