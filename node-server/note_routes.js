const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./notes.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

module.exports = function (app) {

    createTable();

    app.get('/notes', (req, res) => {
        if (req.query.search == undefined) {
            getAllNotes(res);
        } else {
            getFilteredNotes(res, req.query.search);
        }
    });

    function getAllNotes(res) {
        openDB();
        getNotes = 'SELECT * FROM notes';
        db.serialize(function () {
            db.all(getNotes, function (err, notes) {
                if (err != null) {
                    console.log(err);
                    getAllNotesCBError(res, err);
                }
                getAllNotesCB(res, notes);
                db.close();
            });
        });
    }

    function getAllNotesCB(res, notes) {
        // console.log('GET NOTES');
        res.status(200).send(notes);
    }

    function getAllNotesCBError(res, err) {
        console.log('GET NOTES ERROR');
        res.status(200).send([]);
    }

    function getFilteredNotes(res, filter) {
        openDB();
        filterNotes = 'SELECT * FROM notes WHERE heading LIKE $filter OR note_text LIKE $filter';
        const params = { $filter: '%' + filter + '%' }
        db.serialize(function () {
            db.all(filterNotes, params, function (err, notes) {
                if (err != null) {
                    console.log(err);
                    getFilteredNotesCBError(res, err);
                }
                getFilteredNotesCB(res, notes);
                db.close();
            });
        });
    }

    function getFilteredNotesCB(res, notes) {
        console.log('GET FILTERED NOTES');
        res.status(200).send(notes);
    }

    function getFilteredNotesCBError(res, err) {
        console.log('GET FILTERED NOTES ERROR');
        res.status(200).send([]);
    }

    app.post('/notes/add', (req, res) => {
        responeMessage = { 'success': true };
        createNote(req.body.heading, req.body.text);
        res.status(200).send(responeMessage);
    });

    function createNote(heading, noteText) {
        openDB();
        lastEdited = getCurrentDateTime();
        create = 'INSERT INTO notes(heading,note_text,last_edited) VALUES (?,?,?)';
        db.run(create, [heading, noteText, lastEdited], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`NOTE ${this.lastID} ADDED`);
        });
        closeDB();
    }

    function getCurrentDateTime() {
        var d = new Date();
        return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    }

    app.post('/notes/edit', (req, res) => {
        responeMessage = { 'success': true };
        editNote(req.body.id, req.body.heading, req.body.text);
        res.status(200).send(responeMessage);
    });

    function editNote(id, heading, noteText) {
        openDB();
        lastEdited = getCurrentDateTime();
        update = 'UPDATE notes SET heading=?, note_text=?, last_edited=? WHERE id=?';
        db.run(update, [heading, noteText, lastEdited, id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log('NOTE ' + id + ' UPDATED');
        });
        closeDB();
    }

    app.post('/notes/delete', (req, res) => {
        responeMessage = { 'success': true };
        deleteNote(req.body.id);
        res.status(200).send(responeMessage);
    });

    function deleteNote(id) {
        openDB();
        delNote = 'DELETE FROM notes WHERE id=?';
        db.run(delNote, [id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log('NOTE ' + id + ' DELETED');
        });
        closeDB();
    }

    function openDB() {
        db = new sqlite3.Database('./notes.db', (err) => {
            if (err) {
                console.error('Unable to connect to the SQlite DB notes.db');
                return console.error(err.message);
            }
        });
    }

    function closeDB() {
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }

    function createTable() {
        openDB();
        createTable = 'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, heading text, note_text text, last_edited text)';
        db.run(createTable);
        closeDB();
    }
};
