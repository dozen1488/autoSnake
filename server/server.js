#!/usr/bin/env node

const PORT = 3002;
const IMAGES_FILE_NAME = './images.json';
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const neiroArray = readImages();

app.use(express.static('./server-static'));
app.use(bodyParser.json());
app.listen(PORT);

app.post('/applyImages', (req, res) => {
    console.log(req, res);
});

console.log('Server is listening on port ' + PORT);

process.on('exit', () => {
    saveImages(neiroArray);
})


function readImages() {
    return JSON.parse(fs.readSync(IMAGES_FILE_NAME));
}

function saveImages(images) {
    fs.writeFileSync(IMAGES_FILE_NAME, JSON.stringify(images));
}