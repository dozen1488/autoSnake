const express = require('express');
const app = express();

app.use(express.static('./server-static'));

app.listen(3002);