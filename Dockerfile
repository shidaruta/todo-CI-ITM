# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build   # Produces ./dist or ./build depending on your setup

# Stage 2: Build backend + include frontend static
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy frontend build into backend's public/static folder
COPY --from=frontend-build /app/frontend/dist ./public

# Expose port
EXPOSE 3000

# Start the backend
CMD ["node", "server.js"]  # or whatever your entry point is
