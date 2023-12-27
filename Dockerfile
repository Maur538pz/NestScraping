
FROM  ghcr.io/puppeteer/puppeteer:21.6.1

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . . 
CMD ["nest","build","node","dist/main"]

# Etapa de construcción
FROM ghcr.io/puppeteer/puppeteer:21.6.1 AS builder

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de ejecución
FROM node:20.10.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node","dist/main"]
