#!/usr/bin/env node

const PORT = 3002;
const IMAGES_FILE_NAME = './images.json';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('lodash');

const neiroTrainer = require('./neiroTrainer');

const app = express();

const neiroArray = readImages();

app.use(express.static('./server-static'));
app.use(bodyParser.json());
app.listen(PORT);

app.get('/getNetwork', (req, res) => {
    const network = neiroTrainer(neiroArray);
    res
        .status(200)
        .send(
            JSON.stringify(
                network
            )   
        );
})

app.post('/applyImages', (req, res) => {
    neiroArray.push.apply(neiroArray, req.body);
    res
        .status(200)
        .end();
});

console.log('Server is listening on port ' + PORT);
console.log('PID is ' + process.pid);

process
.on('SIGINT', () => {
    saveImages(neiroArray);
})
.on('SIGTERM', () => {
    saveImages(neiroArray);
});

function readImages() {
    return JSON.parse(fs.readFileSync(IMAGES_FILE_NAME));
}

function saveImages(images) {
    fs.writeFileSync(IMAGES_FILE_NAME, JSON.stringify(images, null, '\t'));
    process.exit(0);
}