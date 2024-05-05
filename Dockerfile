

# Stage 1: Build an Angular Docker Image
  FROM node:16.14.0-alpine 
  WORKDIR /app

  RUN npm install -g @angular/cli@16.2.0

  COPY package.json .
  RUN npm install
  COPY . .
  EXPOSE 4200
  CMD npm run start