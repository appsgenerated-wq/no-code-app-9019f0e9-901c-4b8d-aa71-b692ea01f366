# Use the official Node.js image as a base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the current directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=1111

# Expose the port the app runs on
EXPOSE 1111

# Start the application in production mode
CMD ["npm", "run", "start:prod"]