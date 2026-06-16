# syntax=docker/dockerfile:1

# ---- Build stage: produce the static Vite bundle ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* values at build time, so they are passed as build args.
# VITE_API_BASE_URL defaults to /api (served same-origin via the nginx proxy below).
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---- Runtime stage: unprivileged nginx — no root, listens on 8080 ----
FROM nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
