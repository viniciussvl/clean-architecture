FROM node:16.15
WORKDIR /usr/src/clean-architecture
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start