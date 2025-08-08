FROM node:24.5.0-alpine3.22 AS base
RUN apk add --no-cache chromium

FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --production

FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run transpile

FROM base AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./src

CMD ["node", "src/main.js"]
