FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/package.json
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile

COPY shared shared
COPY apps/api apps/api

RUN pnpm --filter @document-flow/shared build
RUN pnpm --filter api build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/package.json
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --prod --frozen-lockfile --filter api...

COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/apps/api/dist apps/api/dist

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "dist/main.js"]