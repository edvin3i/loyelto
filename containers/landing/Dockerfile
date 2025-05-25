FROM node:24-alpine as builder
WORKDIR /app

# Copy only web app package files
COPY srcs/frontend/webapp/loyelto-web/package*.json ./
RUN npm ci

# Copy only web app source - NOT the entire srcs/ directory
COPY srcs/frontend/webapp/loyelto-web/ ./
RUN npm run build

FROM nginx:1.28
COPY --from=builder /app/dist /usr/share/nginx/html
