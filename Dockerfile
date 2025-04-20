# Dockerfile (in root)

FROM node:16
WORKDIR /app

COPY ./server/package.json ./server/package-lock.json ./
RUN npm install

COPY ./server ./server

EXPOSE 5000
CMD ["node", "server/server.js"]