const express = require('express');
const router = express.Router();

 router.get('/meet/:meetingid', function (req, res, next) {
     res.render('meeting', {title: 'Express', params: req.params, query: req.query});
 });

router.get('/live_Prescence_with_video', function (req, res) {
    user = req.query.user;
    client = req.query.client;
    console.log(user + ' .... '+ client)
    res.sendfile('./views/live_Prescence_with_video.html');
});

router.get('/live_Prescence_with_video_hbs', function (req, res) {
    user = req.query.user;
    client = req.query.client;
    console.log(user + ' .... '+ client)
    res.render('live_Prescence_with_video', {title: 'Express', params: req.params, query: req.query});
});
router.get('/index', function (req, res) {
     res.sendfile('./views/index.html');
});
router.get('/collab', function (req, res) {
     res.sendfile('./views/collab.html');
});


module.exports = router;

//router.get('/live_Prescence_with_video_WAL-JESDALE', function (req, res) {
//    user = req.query.user;
//    client = req.query.client;
//    console.log(user + ' .... '+ client)
//    res.sendfile('./views/live_Prescence_with_video_WAL-JESDALE.html');
//    });
//
//router.get('/live_Prescence_with_video_WAL-BALPERN', function (req, res) {
//    user = req.query.user;
//    client = req.query.client;
//    console.log(user + ' .... '+ client)
//    res.sendfile('./views/live_Prescence_with_video_WAL-BALPERN.html');
//});