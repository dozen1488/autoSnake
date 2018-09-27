#!/usr/bin/env node

const PORT = 3002;
const IMAGES_FILE_NAME = "./images.json";
const NETWORK_FILE_NAME = "./network.json";

const { Network } = require("synaptic");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");

const networkTrainer = require("./networkTrainer");
const mergeImages = require("./mergeImages");
const app = express();

let network = readNetwork() || networkTrainer(null, []);
let trainingImages = readImages();

app.use(express.static("./server-static"));
app.use(bodyParser.json());
app.listen(PORT);

app.get("/getNetwork", (req, res) => {
    res
        .status(200)
        .send(JSON.stringify(network.toJSON()));
});

app.post("/applyImages", (req, res) => {
    trainingImages = mergeImages(trainingImages, req.body);
    network = networkTrainer(network, trainingImages);
    res
        .status(200)
        .end();
});

console.log("Server is listening on port " + PORT);
console.log("PID is " + process.pid);

process
    .on("SIGINT", () => {
        saveNetwork(network.toJSON());
        saveImages(trainingImages);
        process.exit(0);
    })
    .on("SIGTERM", () => {
        saveNetwork(network.toJSON());
        saveImages(trainingImages);
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

function saveNetwork(network) {
    fs.writeFileSync(NETWORK_FILE_NAME, JSON.stringify(network, null, "\t"));
}

function saveImages(images) {
    fs.writeFileSync(IMAGES_FILE_NAME, JSON.stringify(_.uniqWith(images, _.isEqual), null, "\t"));
}
