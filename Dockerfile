FROM node:slim AS managementweb
WORKDIR /src
COPY ./ /src
RUN npm i && npm run build
COPY ./ ./