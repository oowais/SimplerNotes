dummy_notes = [{ 'id': 1, 'heading': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, l', 'note_text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, lacus nibh vulputate est, ut suscipit tortor urna eget nisl. Nullam ut luctus sapien, eget malesuada libero. Vestibulum massa sapien, suscipit vel facilisis non, scelerisque at velit. Maecenas euismod felis sapien, vel vehicula sapien malesuada in.', 'last_edited': '04-05-2019 00:20' }, { 'id': 2, 'heading': 'Donec eu mi tortor. Curabitur nec est eu tellus gravida luctus eget a ex. Quisque sapien augue, matt', 'note_text': 'Donec eu mi tortor. Curabitur nec est eu tellus gravida luctus eget a ex. Quisque sapien augue, mattis vitae orci vitae, venenatis lobortis magna. Praesent ut scelerisque nunc. Nullam sed quam risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', 'last_edited': '04-05-2019 00:20' }, { 'id': 3, 'heading': 'Donec felis dui, ultricies id fringilla quis, fermentum sit amet mauris. Nulla et est sem. Suspendis', 'note_text': 'Donec felis dui, ultricies id fringilla quis, fermentum sit amet mauris. Nulla et est sem. Suspendisse tempus facilisis sodales. Ut molestie dolor urna, vel maximus neque mattis id. Nunc eleifend augue bibendum, placerat lorem vitae, molestie magna. Ut bibendum arcu eu enim egestas lacinia.', 'last_edited': '04-05-2019 00:20' }, { 'id': 4, 'heading': 'Etiam in velit id quam consectetur feugiat sed vitae dui. Ut a sem consequat, dictum ex nec, ferment', 'note_text': 'Etiam in velit id quam consectetur feugiat sed vitae dui. Ut a sem consequat, dictum ex nec, fermentum tellus. Phasellus egestas elit ex, vel accumsan eros tristique vel. Aenean fringilla scelerisque aliquam.', 'last_edited': '04-05-2019 00:20' }, { 'id': 5, 'heading': 'Donec nisl lacus, commodo quis ante a, tempor vestibulum turpis. Nunc sit amet nunc arcu. Aenean iac', 'note_text': 'Donec nisl lacus, commodo quis ante a, tempor vestibulum turpis. Nunc sit amet nunc arcu. Aenean iaculis porta finibus. Vivamus pulvinar mattis ligula et gravida. Praesent viverra ultricies risus quis aliquam.', 'last_edited': '04-05-2019 00:20' }, { 'id': 6, 'heading': 'Curabitur a enim nunc. Suspendisse tempor, ex id blandit efficitur, libero arcu sagittis justo, in b', 'note_text': 'Curabitur a enim nunc. Suspendisse tempor, ex id blandit efficitur, libero arcu sagittis justo, in bibendum eros magna sit amet leo. Etiam tempus nibh nec enim gravida lacinia', 'last_edited': '04-05-2019 00:20' }, { 'id': 7, 'heading': 'Etiam fringilla, risus quis dignissim gravida, magna erat cursus augue, in sodales velit diam a tort', 'note_text': 'Etiam fringilla, risus quis dignissim gravida, magna erat cursus augue, in sodales velit diam a tortor. Phasellus dui risus, ultrices vel turpis sed, cursus iaculis mauris. Praesent eros justo, fermentum nec sapien quis, pretium rhoncus nibh. Phasellus cursus est ipsum, et porttitor massa porttitor pulvinar. ', 'last_edited': '04-05-2019 00:31' }]


module.exports = function (app, db) {
    app.get('/notes', (req, res) => {
        if (req.query.search == undefined){
            res.status(200).send(dummy_notes);
        } else {
            res.status(200).send([{ 'id': 1, 'heading': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, l', 'note_text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, nulla at lacinia maximus, lacus nibh vulputate est, ut suscipit tortor urna eget nisl. Nullam ut luctus sapien, eget malesuada libero. Vestibulum massa sapien, suscipit vel facilisis non, scelerisque at velit. Maecenas euismod felis sapien, vel vehicula sapien malesuada in.', 'last_edited': '04-05-2019 00:20' }]);
        }
    });

    app.post('/notes/add', (req, res) => {
        console.log(req.body);
        responeMessage = { 'success': true };
        res.status(200).send(responeMessage);
    });

    app.post('/notes/edit', (req, res) => {
        console.log(req.body);
        responeMessage = { 'success': true };
        res.status(200).send(responeMessage);
    });

    app.post('/notes/delete', (req, res) => {
        console.log(req.body);
        responeMessage = { 'success': true };
        res.status(200).send(responeMessage);
    });
};
