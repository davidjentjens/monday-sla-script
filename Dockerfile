# Step 1: Use the official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

RUN npm install rimraf -D

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the TypeScript application (if needed)
RUN npm run build

# Step 7: Expose the port (if applicable)
# EXPOSE 3000  # Uncomment this if your app runs on a specific port

# Step 8: Define the default command to run your app
CMD ["npm", "start"]