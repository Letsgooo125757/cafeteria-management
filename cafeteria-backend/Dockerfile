# syntax=docker/dockerfile:1

# Use a specific Node.js version for reproducibility.
FROM node:22.14.0-alpine AS base

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache.
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code.
COPY . .

# Use the non-root 'node' user from the base image.
USER node

# Expose the port the app run on.
EXPOSE 5000

# The command to run the application
CMD ["npm", "start"]