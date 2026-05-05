# Use the official Node.js image as the base image
FROM node:lts

# Set the working directory in the image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# The server listens on port 3000
EXPOSE 80

# Command to run the app
CMD ["npm", "start"]