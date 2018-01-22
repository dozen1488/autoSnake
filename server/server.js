#!/usr/bin/env node
const getConnection = require("./dataAccessLayer/getConnection");
const express = require("express");
const bodyParser = require("body-parser");

const ImagesCollection = require("./dataAccessLayer/imagesCollection");
const networkTrainer = require("./networkTrainer");
const app = express();

const configuration = require("./configuration.json");

let databaseConnection = null;
let databaseCollections = [];

function getCollection(
    databaseCollections,
    radiusOfVision = configuration.defaultRadiusOfVision
) {
    if (!databaseCollections[radiusOfVision]) {
        databaseCollections[radiusOfVision] = new ImagesCollection({ databaseConnection, radiusOfVision});
    }

    return databaseCollections[radiusOfVision];
}

function endProgram() {
    if (databaseConnection) {
        databaseConnection.close();
        databaseConnection = null;
    }
    process.exit(0);
}

(async () => {
    app.use(express.static("./server-static"));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.listen(configuration.PORT);

    databaseConnection = await getConnection(
        configuration.URL,
        configuration.DB_NAME
    );

    app.get("/getNetwork", async (req, res) => {
        const collection = getCollection(databaseCollections, req.query.radiusOfVision);
        const images = await collection.getImages();
        const network = networkTrainer(images);
        res
            .status(200)
            .send(JSON.stringify(network));
    });

    app.post("/applyImages", async (req, res) => {
        const collection = getCollection(databaseCollections, req.body.radiusOfVision);
        await collection.pushImages(req.body.images);
        res
            .status(200)
            .end();
    });

    // eslint-disable-next-line no-console
    console.log("Server is listening on configuration " + configuration.PORT);
    // eslint-disable-next-line no-console
    console.log("PID is " + process.pid);

    process
        .on("SIGINT", endProgram)
        .on("SIGTERM", endProgram);
})();
