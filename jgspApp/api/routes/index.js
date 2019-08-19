var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
//var ctrlDayTypeConf = require('../controllers/dayTypeCont');

router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//router.post('',ctrlDayTypeConf.saveDayType);

var ctrlPassengerType = require('../controllers/passengerTypeCont');
router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);

module.exports = router;