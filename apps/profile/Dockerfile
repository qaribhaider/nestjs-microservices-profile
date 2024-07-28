FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install

COPY apps/profile apps/profile
COPY libs libs

RUN cd apps/profile && pnpm install

RUN pnpm run build profile

ENV NODE_ENV=development