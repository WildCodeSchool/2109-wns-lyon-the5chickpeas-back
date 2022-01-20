FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY ormconfig.json ormconfig.json
COPY tsconfig.json tsconfig.json
COPY src src

CMD npm dev