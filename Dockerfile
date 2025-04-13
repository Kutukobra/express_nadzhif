FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json .

COPY . .

EXPOSE 8080

ENTRYPOINT [ "npm", "start" ]