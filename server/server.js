#!/usr/bin/env node

const PORT = 3002;
const express = require('express');
const app = express();

app.use(express.static('./server-static'));

app.listen(PORT);

console.log('Server is listening on port ' + PORT);