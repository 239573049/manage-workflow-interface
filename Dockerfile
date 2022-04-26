FROM node:slim AS managementweb
WORKDIR /src
COPY ./ /src
