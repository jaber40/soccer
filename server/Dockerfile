# server/Dockerfile
FROM node:16

WORKDIR /app

COPY ./server/package.json ./server/package-lock.json ./

RUN npm install

COPY ./server ./

EXPOSE 5000

CMD ["node", "server.js"]