var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlStation = require('../controllers/stationCont');
var ctrlLine = require('../controllers/lineCont');
//var ctrlDayTypeConf = require('../controllers/dayTypeCont');

router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//router.post('',ctrlDayTypeConf.saveDayType);

router.post('/addStation', ctrlStation.addStation);
router.get('/getAllStations', ctrlStation.getAllStations);
router.post('/changeStation', ctrlStation.changeStation);
router.delete('/removeStation/:_id',ctrlStation.removeStation);

router.post('/addLine', ctrlLine.addLine);
router.get('/getAllLines', ctrlLine.getAllLines);
router.post('/changeLine/:_id',ctrlLine.changeLine);
router.delete('/removeLine/:_id', ctrlLine.removeLine);

var ctrlPassengerType = require('../controllers/passengerTypeCont');
router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);

module.exports = router;