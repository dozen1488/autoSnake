#!/usr/bin/env node

const PORT = 3002;
const IMAGES_FILE_NAME = "./images.json";
const NETWORK_FILE_NAME = "./network.json";

const { Network } = require("synaptic");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const { QLearner } = require('../crossPlatformModels/src/qLearningClass.ts');

const trainNetwork = require("./networkTrainer");
const app = express();

const qLearner = new QLearner();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("./server-static"));
app.listen(PORT);

app.get("/getNetwork", (req, res) => {
    res
        .status(200)
        .send(JSON.stringify(qLearner.serialize()));
});

app.post("/applyImages", (req, res) => {
    const rawQlearner = req.body;
    const acceptedQlearner = QLearner.deserialize(rawQlearner);
    qLearner.saveNewData(acceptedQlearner.historyTransaction);
    qLearner.network = trainNetwork(qLearner);
    res
        .status(200)
        .end();
});

console.log("Server is listening on port " + PORT);
console.log("PID is " + process.pid);

process
    .on("SIGINT", () => {
        saveData(network.toJSON());
        // saveImages(trainingImages);
        process.exit(0);
    })
    .on("SIGTERM", () => {
        saveData(network.toJSON());
        // saveImages(trainingImages);
        process.exit(0);
    });

function readImages() {
    try {
        return _.uniqWith(JSON.parse(fs.readFileSync(IMAGES_FILE_NAME)), _.isEqual);
    } catch (ex) {
        return [];
    }
}

function readNetwork() {
    try {
        return Network.fromJSON(fs.readFileSync(NETWORK_FILE_NAME));
    } catch (ex) {
        return null;
    }
}

function saveData(data) {
    fs.writeFileSync(NETWORK_FILE_NAME, JSON.stringify(data, null, "\t"));
}

function saveImages(images) {
    fs.writeFileSync(IMAGES_FILE_NAME, JSON.stringify(_.uniqWith(images, _.isEqual), null, "\t"));
}
