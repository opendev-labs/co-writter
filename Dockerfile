# Build Stage
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_NANOPI_BASE_URL
ENV VITE_NANOPI_BASE_URL=$VITE_NANOPI_BASE_URL
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# For Single Page Application (React Router) at root /
RUN printf 'server {\n    listen 80;\n    location / {\n        root /usr/share/nginx/html;\n        index index.html;\n        try_files $uri $uri/ /index.html;\n    }\n    location /nanopi-api/ {\n        proxy_pass http://host.docker.internal:11434/api/;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_buffering off;\n    }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
