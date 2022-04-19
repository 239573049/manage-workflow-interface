FROM node:slim AS build
WORKDIR /src
COPY ./ /src
RUN npm i
WORKDIR /src/build
RUN npm run build


FROM nginx AS managementweb
WORKDIR /var/www
COPY --from=build /src/build /var/www