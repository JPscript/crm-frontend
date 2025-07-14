# 1. Build Stage: Construye la app Angular con Node 22
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Production Stage: Sirve con Nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Si tu build va en dist/mi-app, cambia la ruta aquí:
COPY --from=build /app/dist/crm-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
