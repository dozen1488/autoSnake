#!/usr/bin/env node

const PORT = 3002;
const IMAGES_FILE_NAME = "./images.json";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");

const networkTrainer = require("./networkTrainer");

const app = express();

let trainingImages = readImages();

app.use(express.static("./server-static"));
app.use(bodyParser.json());
app.listen(PORT);

app.get("/getNetwork", (req, res) => {
    const network = networkTrainer(trainingImages);
    res
        .status(200)
        .send(JSON.stringify(network));
});

app.post("/applyImages", (req, res) => {
    trainingImages = req.body;
    res
        .status(200)
        .end();
});

console.log("Server is listening on port " + PORT);
console.log("PID is " + process.pid);

process
    .on("SIGINT", () => {
        saveImages(trainingImages);
    })
    .on("SIGTERM", () => {
        saveImages(trainingImages);
    });

function readImages() {
    try {
        return _.uniqWith(JSON.parse(fs.readFileSync(IMAGES_FILE_NAME)), _.isEqual);
    } catch (ex) {
        return [];
    }
}

function saveImages(images) {
    fs.writeFileSync(IMAGES_FILE_NAME, JSON.stringify(_.uniqWith(images, _.isEqual), null, "\t"));
    process.exit(0);
}
