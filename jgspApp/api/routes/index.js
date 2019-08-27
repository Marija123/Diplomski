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
var ctrlVehicle = require('../controllers/vehicleCont');
var ctrlDayType = require('../controllers/dayTypeCont');
var ctrlPricelist = require('../controllers/pricelistCont');
var ctrlPassengerType = require('../controllers/passengerTypeCont');
var ctrlTimetable = require('../controllers/timetableCont');
var ctrlAutoriz = require('../controllers/authorizationCont');
var ctrlTicket = require('../controllers/ticketCont');

router.post('/addPricelist', ctrlPricelist.addPricelist);
router.get('/getPricelist',  ctrlPricelist.getPricelist);
router.get('/getTicketPrices',ctrlPricelist.getTicketPrices);


router.get('/getAllTicketTypes', ctrlTicket.getAllTicketTypes);
router.post('/checkValidity', ctrlTicket.checkValidity);
router.get('/getTypeUser/:_id', ctrlTicket.getTypeUser);
router.post('/buyTicket', ctrlTicket.buyTicket);

router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/getAwaitingAdmins', ctrlAutoriz.getAwaitingAdmins);
router.get('/getAwaitingControllers', ctrlAutoriz.getAwaitingControllers);
router.get('/getAwaitingClients', ctrlAutoriz.getAwaitingClients);
router.post('/authorizeAdmin', ctrlAutoriz.authorizeAdmin);
router.post('/declineAdmin', ctrlAutoriz.declineAdmin);
router.post('/authorizeController', ctrlAutoriz.authorizeController);
router.post('/declineController', ctrlAutoriz.declineController);
router.post('/authorizeUser', ctrlAutoriz.authorizeUser);
router.post('/declineUser', ctrlAutoriz.declineUser);


router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/edit', ctrlAuth.edit);
router.post('/editPassword', ctrlAuth.editPassword);
router.post('/resendReqest', ctrlProfile.resendReqest);
//router.post('',ctrlDayTypeConf.saveDayType);

router.post('/addStation', ctrlStation.addStation);
router.get('/getAllStations', ctrlStation.getAllStations);
router.post('/changeStation', ctrlStation.changeStation);
router.delete('/removeStation/:_id',ctrlStation.removeStation);

router.post('/addLine', ctrlLine.addLine);
router.get('/getAllLines', ctrlLine.getAllLines);
router.post('/changeLine/:_id',ctrlLine.changeLine);
router.delete('/removeLine/:_id', ctrlLine.removeLine);

router.post('/addVehicle', ctrlVehicle.addVehicle);
router.get('/getAllVehicles', ctrlVehicle.getAllVehicles);
router.get('/getAllAvailableVehicles', ctrlVehicle.getAllAvailableVehicles);
router.delete('/removeVehicle/:_id', ctrlVehicle.removeVehicle);

router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);


router.get('/getAllDayTypes',ctrlDayType.findAllDayType);
router.get('/getAllTimetables', ctrlTimetable.getAllTimetables);

router.get('/FindVehicleId', ctrlTimetable.FindVehicleId);
router.post('/addTimetable', ctrlTimetable.addTimetable);
router.post('/changeTimetable', ctrlTimetable.changeTimetable);
router.delete('/deleteTimetable/:_id', ctrlTimetable.deleteTimetable);

module.exports = router;