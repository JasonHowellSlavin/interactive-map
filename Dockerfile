# Use official Node.js 20 Alpine image (includes Node.js and npm)
FROM node:20-alpine

# Verify Node.js and npm are installed
RUN node --version && npm --version

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including TypeScript)
RUN npm install --production=false

# Copy application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server (runs compiled JavaScript from dist/)
CMD ["npm", "start"]

