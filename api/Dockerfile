# ./api/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

EXPOSE 3001

# Dev command (with hot-reload if needed)
CMD ["yarn", "dev"]

# For production:
# CMD ["yarn", "start"]