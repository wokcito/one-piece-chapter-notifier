FROM node:24.5.0-alpine3.22 AS base
RUN apk add --no-cache chromium

FROM base AS builder
WORKDIR /app

COPY . .
RUN npm install --production
RUN npm run transpile

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./src
COPY --from=builder /app/package.json .

CMD ["node", "src/main.js"]
