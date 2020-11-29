# GAN Integrity backend code challenge

The script `index.js` uses a local api to perform various operations on a set of cities. Your task is to implement an api so that the script runs successfully all the way to the end.

Run `npm install` and `npm run start` to start the script.

Your api can load the required data from [here](addresses.json).

In the distance calculations you can assume the earth is a perfect sphere and has a radius is 6371 km.

Once you are done, please provide us with a link to a git repo with your code, ready to run.


# Solution

### The stack used for solving the challenge:
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)
- [Docker](https://docs.docker.com/get-docker/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)


### How to run the app:

#### *To run the app with Docker:*

Make sure you are using the *Uri for Docker setup* in
- [backend/database/mongo.js](backend/database/mongo.js)
- [backend/services/publisher.js](backend/services/publisher.js)
- [backend/services/consumer.js](backend/services/consumer.js)

In the ***backend*** folder, run:
```
docker-compose up --build
```

#### IMPORTANT!
If you spin up the docker again, it will import the seed data again! ***It might make the test case fail!***

To avoid it, comment out the ***mongo-seed*** part in the [docker-compose.yml](docker-compose.yml)


The script `index.js` should run without error!


#### *To run the app locally without Docker:*


Make sure you are using the *Uri for local setup* in
- [backend/database/mongo.js](backend/database/mongo.js)
- [backend/services/publisher.js](backend/services/publisher.js)
- [backend/services/consumer.js](backend/services/consumer.js)


You need to start manually the MongoDB and the RabbitMQ server.

Info here:
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)


#### Prerequisite

After the MongoDB install, run the following command in the ***database-seed*** folder:
```
mongoimport --host mongodb --db challenge --collection cities --type json --file /addresses.json --jsonArray
```

After, run the following:

```
npm install pm2 -g
```

In the ***backend*** folder, run:
```
pm2 start process.yml
```

The script `index.js` should run without error!
