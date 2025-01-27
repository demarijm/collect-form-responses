# Use the official Bun image as the base image
FROM imbios/bun-node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["bun", "start"]