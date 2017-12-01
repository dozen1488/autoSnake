#!/usr/bin/env node

const PORT = 3002;
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const neiroArray = [];

app.use(express.static('./server-static'));
app.use(bodyParser.json());
app.listen(PORT);

app.post('/applyImages', (req, res) => {
    console.log(req, res);
});

console.log('Server is listening on port ' + PORT);