const sqlite3 = require('sqlite3').verbose();
dummy_notes = [{ 'id': 1, 'heading': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, l', 'note_text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, lacus nibh vulputate est, ut suscipit tortor urna eget nisl. Nullam ut luctus sapien, eget malesuada libero. Vestibulum massa sapien, suscipit vel facilisis non, scelerisque at velit. Maecenas euismod felis sapien, vel vehicula sapien malesuada in.', 'last_edited': '04-05-2019 00:20' }, { 'id': 2, 'heading': 'Donec eu mi tortor. Curabitur nec est eu tellus gravida luctus eget a ex. Quisque sapien augue, matt', 'note_text': 'Donec eu mi tortor. Curabitur nec est eu tellus gravida luctus eget a ex. Quisque sapien augue, mattis vitae orci vitae, venenatis lobortis magna. Praesent ut scelerisque nunc. Nullam sed quam risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', 'last_edited': '04-05-2019 00:20' }, { 'id': 3, 'heading': 'Donec felis dui, ultricies id fringilla quis, fermentum sit amet mauris. Nulla et est sem. Suspendis', 'note_text': 'Donec felis dui, ultricies id fringilla quis, fermentum sit amet mauris. Nulla et est sem. Suspendisse tempus facilisis sodales. Ut molestie dolor urna, vel maximus neque mattis id. Nunc eleifend augue bibendum, placerat lorem vitae, molestie magna. Ut bibendum arcu eu enim egestas lacinia.', 'last_edited': '04-05-2019 00:20' }, { 'id': 4, 'heading': 'Etiam in velit id quam consectetur feugiat sed vitae dui. Ut a sem consequat, dictum ex nec, ferment', 'note_text': 'Etiam in velit id quam consectetur feugiat sed vitae dui. Ut a sem consequat, dictum ex nec, fermentum tellus. Phasellus egestas elit ex, vel accumsan eros tristique vel. Aenean fringilla scelerisque aliquam.', 'last_edited': '04-05-2019 00:20' }, { 'id': 5, 'heading': 'Donec nisl lacus, commodo quis ante a, tempor vestibulum turpis. Nunc sit amet nunc arcu. Aenean iac', 'note_text': 'Donec nisl lacus, commodo quis ante a, tempor vestibulum turpis. Nunc sit amet nunc arcu. Aenean iaculis porta finibus. Vivamus pulvinar mattis ligula et gravida. Praesent viverra ultricies risus quis aliquam.', 'last_edited': '04-05-2019 00:20' }, { 'id': 6, 'heading': 'Curabitur a enim nunc. Suspendisse tempor, ex id blandit efficitur, libero arcu sagittis justo, in b', 'note_text': 'Curabitur a enim nunc. Suspendisse tempor, ex id blandit efficitur, libero arcu sagittis justo, in bibendum eros magna sit amet leo. Etiam tempus nibh nec enim gravida lacinia', 'last_edited': '04-05-2019 00:20' }, { 'id': 7, 'heading': 'Etiam fringilla, risus quis dignissim gravida, magna erat cursus augue, in sodales velit diam a tort', 'note_text': 'Etiam fringilla, risus quis dignissim gravida, magna erat cursus augue, in sodales velit diam a tortor. Phasellus dui risus, ultrices vel turpis sed, cursus iaculis mauris. Praesent eros justo, fermentum nec sapien quis, pretium rhoncus nibh. Phasellus cursus est ipsum, et porttitor massa porttitor pulvinar. ', 'last_edited': '04-05-2019 00:31' }]

module.exports = function (app, db) {

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
        console.log('GET NOTES');
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
        db = new sqlite3.Database('./src/app/routes/notes.db', (err) => {
            if (err) {
                console.error('Unable to connect to the SQlite DB./src/app/routes/db.');
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
