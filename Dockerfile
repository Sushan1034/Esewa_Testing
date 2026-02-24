# Stage 1: Build the React frontend
FROM node:20-alpine AS build-stage

WORKDIR /app/client

# Copy client package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy client source and build
COPY client/ ./
RUN npm run build

# Stage 2: Serve the app with Node.js backend
FROM node:20-alpine

WORKDIR /app

# Copy server package files and install production dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server source
COPY server/ ./

# Copy built frontend from Stage 1
COPY --from=build-stage /app/client/dist /app/client/dist

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
