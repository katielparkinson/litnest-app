# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
RUN bun install

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/data

EXPOSE 3000
CMD ["bun", "run", "start"]
