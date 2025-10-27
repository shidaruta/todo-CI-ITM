# Stage 1: Build React app
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static files
FROM node:20-alpine AS production

WORKDIR /app

# Install small static server
RUN npm install -g serve

# Copy build output
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["npx", "serve", "-s", "dist", "-l", "5173"]