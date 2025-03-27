# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source and build
COPY . .
RUN yarn build  # Only if your project needs a build step (e.g., TypeScript)

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist  # Adjust if your build outputs elsewhere
COPY --from=builder /app/node_modules ./node_modules

# Copy other necessary files (like .env, templates, etc.)
COPY .env .
COPY public ./public

EXPOSE 3001

CMD ["yarn", "start"]