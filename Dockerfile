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

# Copiar package.json y package-lock.json primero (para optimizar cache de Docker)
COPY package*.json ./
RUN npm ci

# Copiar archivos de configuración críticos
COPY tsconfig.json ./
COPY next.config.js ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
COPY next-env.d.ts ./

# Copiar el código fuente
COPY src/ ./src/
COPY public/ ./public/

# Next.js necesita las variables en build time
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios desde la etapa de build
COPY --from=builder /app/public ./public

# Copiar los archivos compilados
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
