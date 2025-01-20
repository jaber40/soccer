# server/Dockerfile
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY ./server/package.json ./server/package-lock.json ./

# Install dependencies for the server
RUN npm install

# Copy the entire server directory into the container
COPY ./server ./server

# Copy the entire client directory into the container
COPY ./client ./client

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
