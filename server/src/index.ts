import { createServer } from "node:http";
import { createApp } from "./app";
import { runMigrations } from "./db/migrate";
import { env } from "./env";

runMigrations();

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, env.API_HOST, () => {
  console.log(`LitNest API listening on http://${env.API_HOST}:${env.PORT}`);
});
