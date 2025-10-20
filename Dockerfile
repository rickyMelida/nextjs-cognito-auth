# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
