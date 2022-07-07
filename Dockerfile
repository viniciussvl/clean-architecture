FROM node:16.15
WORKDIR /usr/src/clean-architecture
COPY ./package.json .
RUN npm install --production --legacy-peer-deps