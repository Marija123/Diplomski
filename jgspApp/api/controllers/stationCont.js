var mongoose = require('mongoose');
var Station = mongoose.model('station');


module.exports.addStation = function(req, res)
{
    if(!req.body.Name || !req.body.Address || !req.body.Latitude || !req.body.Longitude ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var station = new Station();

    station.name = req.body.Name;
    station.address = req.body.Address;
    station.latitude = req.body.Latitude;
    station.longitude = req.body.Longitude;
    //user.image = req.body.image;
    //user.activated = req.body.activated;
    

    station.save(function(err){
        if(err)
        {
            res.status(404).json(err);
            return;
        }
    });



};