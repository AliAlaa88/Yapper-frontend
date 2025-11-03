# -------- DEPENDENCIES STAGE --------
# Separate stage for dependencies to maximize cache reuse
FROM node:24-alpine AS deps

WORKDIR /app

ENV HUSKY=0

# Copy only dependency files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including dev) for build stage
RUN npm ci --prefer-offline --no-audit


# -------- BUILDER STAGE --------
FROM node:24-alpine AS builder

WORKDIR /app

ENV HUSKY=0
ENV NODE_ENV=production

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build the Nuxt app (generates .output directory with bundled server)
RUN npm run build


# -------- PRODUCTION STAGE --------
FROM node:24-alpine AS production

WORKDIR /app

# Create non-root user BEFORE copying files
RUN addgroup -S nodejs && adduser -S nuxtjs -G nodejs

# Switch to non-root user BEFORE copying to avoid chown
USER nuxtjs

# Copy only the built output (includes standalone server with minimal deps)
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

# Expose the default Nuxt port
EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the production server (Nitro bundles everything needed)
CMD ["node", ".output/server/index.mjs"]