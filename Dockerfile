# Multi-stage build for React + Vite (SWC) app
# - Stage 1 builds the app using Node 20 (matches Vite/react-router/plugin engines)
# - Stage 2 serves the production build with nginx

########################################
# Stage 1 — Build
########################################
FROM node:20.19.0-alpine AS build

# Optional build args (useful if behind a proxy or to change npm registry)
ARG NPM_REGISTRY=""
ARG HTTP_PROXY=""
ARG HTTPS_PROXY=""

# Set working directory
WORKDIR /app

# Install small build essentials (some packages may need them)
RUN apk add --no-cache python3 make g++ git

# If provided, configure npm to use a different registry or proxy (safe to override via build args)
# NOTE: do not hardcode secrets in production — pass them as build args from CLI if required.
RUN if [ -n "$NPM_REGISTRY" ]; then npm config set registry "$NPM_REGISTRY"; fi \
 && if [ -n "$HTTP_PROXY" ]; then npm config set proxy "$HTTP_PROXY"; fi \
 && if [ -n "$HTTPS_PROXY" ]; then npm config set https-proxy "$HTTPS_PROXY"; fi

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Use npm ci for reproducible, faster installs (requires package-lock.json)
# --prefer-offline reduces network calls when possible
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

########################################
# Stage 2 — Serve with nginx
########################################
FROM nginx:alpine

# Remove default nginx content (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
