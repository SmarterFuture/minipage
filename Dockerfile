# FROM node:20-alpine
FROM oven/bun:slim

WORKDIR /app

COPY package*.json ./
RUN bun install

COPY . .

EXPOSE 18080

CMD ["bun", "run", "server.js"]

