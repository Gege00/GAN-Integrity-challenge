FROM keymetrics/pm2:latest-alpine


WORKDIR /home/app


RUN npm install

CMD [ "pm2-dev", "process.yml" ]
