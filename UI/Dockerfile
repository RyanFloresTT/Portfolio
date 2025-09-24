FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first for better layer caching
COPY UI/package*.json ./
RUN npm ci --silent

# Copy source code
COPY UI/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/UI/browser /usr/share/nginx/html
COPY UI/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
