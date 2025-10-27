# ----------- Stage 1: Builder -----------
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# ----------- Stage 2: Production -----------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app ./

EXPOSE 5000

CMD ["node", "server.js"]
