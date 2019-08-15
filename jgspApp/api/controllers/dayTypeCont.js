var mongoose = require('mongoose');
var DayType = mongoose.model('DayType');

var sendJSONresponse = function(res, status, content)
{
    res.status(status);
    res.json(content);
}

module.exports.saveDayType = function(req, res)
{
    var dayType = new DayType();
    var dayType1 = new DayType();
    var dayType2 = new DayType();

   dayType.name = "Weekday";
   dayType1.name = "Saturday";
   dayType2.name = "Sunday";

    dayType.save(function(err){
        
        res.status(200);
        
    });

    dayType1.save(function(err){
        
        res.status(200);
        
    });

    dayType2.save(function(err){
        
        res.status(200);
        
    });
};


