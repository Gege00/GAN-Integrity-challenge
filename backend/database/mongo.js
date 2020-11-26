'use strict';

const { MongoClient } = require('mongodb');

// Uri for the Docker setup
const mongoUri = `mongodb://mongodb:27017/challenge`;


//const mongoUri = `mongodb://localhost:27017/challenge`;

const mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
mongoClient.connect();
const mongodb = mongoClient.db();

module.exports = mongodb;
