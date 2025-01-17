# client/Dockerfile
FROM node:16

WORKDIR /app

COPY ./client/package.json ./client/package-lock.json ./

RUN npm install

COPY ./client ./

EXPOSE 3000

CMD ["npm", "start"]