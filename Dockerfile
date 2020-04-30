FROM node:12.16-alpine

WORKDIR /swapi-services

COPY extend-swapi/ ./extend-swapi/
COPY *.json ./

RUN apk add --no-cache dumb-init \
    && npm ci

EXPOSE 4006

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
