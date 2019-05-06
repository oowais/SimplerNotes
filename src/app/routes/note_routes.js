module.exports = function (app, db) {
    app.post('/notes', (req, res) => {
        // You'll create your note here.
        console.log(req.body)
        res.status(200).send('{"result":true, "count":42}')
    });
};
