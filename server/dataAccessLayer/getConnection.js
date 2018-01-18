const MongoClient = require("mongodb").MongoClient;
const Promise = require("bluebird");

const url = "mongodb://localhost:27017";
const dbName = "test";

module.exports = (url, dbName) => Promise.promisify(
    MongoClient.connect, {
        context: MongoClient
    }
)(url)
    .then(client => client.db(dbName));
