const express = require('express');
var cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

const port = 8000;

app.use(bodyParser.json());

require('./src/app/routes')(app, {});
app.listen(port, () => {
    console.log('Live on ' + port);
});
