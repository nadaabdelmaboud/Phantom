FROM node:latest as builder

WORKDIR /app

COPY ./src ./

# Copy dependency definitions
COPY nest-cli.json tsconfig.json package.json tsconfig.build.json ./

RUN npm i 

CMD ["npm","run", "start:dev"]

