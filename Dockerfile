FROM node:12.18.3
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install && \
    rm -rf /tmp/* /var/tmp/*

COPY ./docker-utils/entrypoint/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY . /app

EXPOSE 3000

CMD npm run start
