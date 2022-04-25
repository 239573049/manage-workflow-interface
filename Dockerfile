FROM node:slim AS web
WORKDIR /src
COPY ./ /src