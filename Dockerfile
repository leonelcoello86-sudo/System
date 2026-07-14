FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev && cd backend && npm install --omit=dev
COPY . .
RUN cd backend && npm run docs
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 5000
CMD ["node", "backend/server.js"]
