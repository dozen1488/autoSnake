const Promise = require("bluebird");
const getDatabaseConnection = require("./dataAccessLayer/getConnection");

const url = "mongodb://localhost:27017";
const dbName = "test";
const collectionName = "images";

(async () => {

    const DatabaseConnection = await getDatabaseConnection(url, dbName);

    const request = DatabaseConnection
        .collection(collectionName)
        .find({ result: 0 });

    const images = await Promise
        .promisify(
            request.toArray, { context: request }
        )();

    console.log(images);
})();
