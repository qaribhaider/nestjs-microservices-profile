FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/metrics/prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm prisma generate

COPY apps/metrics apps/metrics
COPY libs libs

RUN cd apps/metrics && pnpm install

RUN pnpm run build metrics