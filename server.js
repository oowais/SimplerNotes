const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/app/routes/notes.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});
const app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
const port = 8000;
app.use(bodyParser.json());
require('./src/app/routes')(app, db);
app.listen(port, () => {
    console.log('Live on ' + port);
});
