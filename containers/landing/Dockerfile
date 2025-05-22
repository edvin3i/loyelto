FROM node:24-alpine AS builder
WORKDIR /app
COPY srcs/frontend/webapp/loyelto-web/ ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.28
RUN rm /etc/nginx/conf.d/default.conf
COPY containers/landing/config/loyel.to.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY srcs/frontend/webapp/loyelto-web/apitest.html ./usr/share/nginx/html/apitest.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]