# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
