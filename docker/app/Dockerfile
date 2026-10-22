# ============================================================
# Stage 1: Builder — install deps & compile TypeScript
# ============================================================
FROM node:22-alpine AS builder

LABEL maintainer="BookMyShow Backend Team"
LABEL description="BookMyShow backend — build stage"

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY pnpm-lock.yaml package.json ./

# Enable pnpm via corepack (ships with Node 22)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code and TypeScript config
COPY src/ ./src/
COPY tsconfig.json ./

# Compile TypeScript to JavaScript
RUN pnpm run build

# ============================================================
# Stage 2: Production — minimal runtime image
# ============================================================
FROM node:22-alpine AS production

LABEL maintainer="BookMyShow Backend Team"
LABEL description="BookMyShow backend — production runtime"
LABEL org.opencontainers.image.source="https://github.com/bookmyshow/backend"

WORKDIR /app

# Copy dependency manifests
COPY pnpm-lock.yaml package.json ./

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Use the built-in non-root "node" user for security
USER node

# Expose the application port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
