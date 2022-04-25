FROM node:slim AS managementweb
WORKDIR /src
COPY ./ /src
RUN npm install && npm run build