FROM node:20-alpine AS build

WORKDIR /src

COPY src ./src
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install -D
RUN yarn build

FROM node:20-alpine AS deps

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

FROM node:20-alpine

COPY package.json ./
COPY --from=deps /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]