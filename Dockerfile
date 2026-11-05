FROM node:26-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

USER node

# Run node directly (not via npm) so SIGTERM reaches the graceful shutdown handler.
CMD ["node", "index.ts"]
