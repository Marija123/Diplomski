var mongoose = require('mongoose');
var Timetable = mongoose.model('timetable');
var Line = mongoose.model('line');
var Vehicle = mongoose.model('vehicle');
var DayType = mongoose.model('dayType');

module.exports.deleteTimetable = function(req, res)
{
    if(!req.params._id)
    {
        return res.status(400).json({ "message": "All fields are required"});
    }
    Timetable.findOneAndRemove({_id: req.params._id}).then(bla =>{

        Vehicle.find().then(aa => {
            aa.forEach(el => {
               el.timetables.forEach(t => {
                   if(t == req.params._id)
                   {
                      el.timetables.remove(t);
                        Vehicle.findOneAndUpdate({_id : el._id}, {timetables : el.timetables}).then(abc => {});
                   }
               })
            })
            return res.status(200).json({
                "message" : "Station successfully removed."
        });
            
        });
       
});
}



module.exports.changeTimetable = function(req, res)
{
    if(req.body.Departures == "" || req.body.Id == "")
    {
        return res.status(400).json({ "message": "All fields are required"});
    }

    const nestp = {departures : req.body.Departures};
    Timetable.findOneAndUpdate({_id: req.body.Id}, nestp).then(aaa => {
        return res.status(200).json({ "message": "Timetable successfully changed"});
    })
}

module.exports.FindVehicleId = function(req, res)
{
    if(req.query.parami)
    {
        Timetable.find().exec().then(allTT => {
          var tt =  allTT.find(el => el.line == req.query.parami);
          var ret = "-1";
          if(tt)
          {
            ret = tt.vehicle;
          }

         res.send(ret);
        })
    }
}

module.exports.getAllTimetables = function(req,  res)
{
    Timetable.find().exec().then(type => { res.send(type);});
   console.log(type);
}

module.exports.addTimetable = function(req, res)
{
    if(req.body.Departures=="" || !req.body.Vehicles[0] || req.body.LineId =="" )
    {
        return res.status(400).json({ "message": "All fields are required"});
    }

    var timetable = new Timetable();

    timetable.departures = req.body.Departures;
    Line.findById(req.body.LineId).exec().then(l => {
        timetable.line = l._id;
        Vehicle.findById(req.body.Vehicles[0].Id).exec().then(v => {
            timetable.vehicle = v._id;
            
            DayType.findById(req.body.DayTypeId).exec().then(d => {
                timetable.dayType = d._id;

                timetable.save(function(err){
                    if(err)
                    {
                        res.status(404).json(err);
                        return;
                    }

                    var list = v.timetables;
                    list.push(timetable._id);
                    const nest = { timetables : list}
                   
                        Vehicle.findByIdAndUpdate({_id: v._id},nest).then(bla => {
                            res.status(200).json({
                                "message" : "Timetable successfully added."
                            });
                        })
                        
                        
                    });
                })
            })
        })
    }


