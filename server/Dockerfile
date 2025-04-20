# server/Dockerfile
FROM node:16

# Set the working directory for the app
WORKDIR /app

# Copy package.json and package-lock.json for both client and server
COPY ./server/package.json ./server/package-lock.json ./server/
#COPY ./client/package.json ./client/package-lock.json ./client/

# Install dependencies for both client and server
RUN cd server && npm install
#RUN cd client && npm install

# Copy the entire server and client directories
COPY ./server ./server
#COPY ./client ./client

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
