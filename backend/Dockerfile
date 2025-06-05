FROM node:20

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/. .

# Copy frontend source and build it
COPY frontend /frontend
WORKDIR /frontend
RUN npm install && npm run build

# Copy built frontend files to backend public directory
WORKDIR /app
RUN rm -rf public && mkdir public && cp -r /frontend/dist/* ./public/

EXPOSE 3000

CMD ["node", "src/index.js"]