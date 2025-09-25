FROM node:20-alpine

WORKDIR /app

COPY src ./src
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install -D

CMD ["yarn", "dev-docker"]

