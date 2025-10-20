# Etapa de dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app

# Recibir las variables como argumentos de build
ARG NEXT_TELEMETRY_DISABLED
ARG NEXT_PUBLIC_AWS_REGION
ARG NEXT_PUBLIC_AWS_USER_POOL_ID
ARG NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID
ARG AWS_USER_POOL_CLIENT_SECRET
ARG NODE_ENV
ARG AWS_DISABLE_SSL_VERIFICATION

# Exportarlas como variables de entorno (para que Next.js las lea)
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED
ENV NEXT_PUBLIC_AWS_REGION=$NEXT_PUBLIC_AWS_REGION
ENV NEXT_PUBLIC_AWS_USER_POOL_ID=$NEXT_PUBLIC_AWS_USER_POOL_ID
ENV NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=$NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID
ENV AWS_USER_POOL_CLIENT_SECRET=$AWS_USER_POOL_CLIENT_SECRET
ENV NODE_ENV=$NODE_ENV
ENV AWS_DISABLE_SSL_VERIFICATION=$AWS_DISABLE_SSL_VERIFICATION

# Copiar node_modules desde la etapa de dependencias
COPY --from=deps /app/node_modules ./node_modules
# Copiar todos los archivos del proyecto
COPY . .

# Next.js collects anonymous telemetry data about general usage, which we opt out from
ENV NEXT_TELEMETRY_DISABLED=1

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

# Install PM2 to manage node processes
RUN npm install pm2 --location=global

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy configuration files and public assets
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# TODO: Standalone output is not including packages used by custom server.js
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]
