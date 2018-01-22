const MongoClient = require("mongodb").MongoClient;
const Promise = require("bluebird");

module.exports = (url, dbName) => Promise.promisify(
    MongoClient.connect, {
        context: MongoClient
    }
)(url)
    .then(client => client.db(dbName));
