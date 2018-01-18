#!/usr/bin/env node

const getConnection = require("./dataAccessLayer/getConnection");
const express = require("express");
const bodyParser = require("body-parser");

const ImagesCollection = require("./dataAccessLayer/imagesCollection");
const networkTrainer = require("./networkTrainer");
const app = express();

const PORT = 3002;
const url = "mongodb://localhost:27017";
const dbName = "test";
let databaseConnection = null;


function endProgram() {
    if (databaseConnection) {
        databaseConnection.close();
    }
    process.exit(0);
}

(async () => {
    app.use(express.static("./server-static"));
    app.use(bodyParser.json());
    app.listen(PORT);

    databaseConnection = await getConnection(url, dbName);
    const collection = new ImagesCollection({ databaseConnection });
    const trainingImages = await collection.getImages();

    app.get("/getNetwork", (req, res) => {
        const network = networkTrainer(trainingImages);
        res
            .status(200)
            .send(JSON.stringify(network));
    });

    app.post("/applyImages", (req, res) => {
        trainingImages.pushImages(req.body);
        res
            .status(200)
            .end();
    });
    // eslint-disable-next-line no-console
    console.log("Server is listening on port " + PORT);
    // eslint-disable-next-line no-console
    console.log("PID is " + process.pid);

    process
        .on("SIGINT", endProgram)
        .on("SIGTERM", endProgram);
})();
