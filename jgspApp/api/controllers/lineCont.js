var mongoose = require('mongoose');
var Line = mongoose.model('line');
var ST = mongoose.model('station');



module.exports.removeLine = function(req, res)
{
    
    if(!req.params._id ) {
        return res.status(400).json( {"message": "You have to select line you want to remove"});
    }


    Line.findById(req.params._id).then(aa => {
        if(aa == null || aa == undefined)
        {
            return res.status(404).json({"message" : "Line that you are trying to remove either do not exist or was previously deleted by another user."});
        }else{
            Line.findOneAndRemove({_id: req.params._id}).then(aa => {
               
                    return res.status(200).json({"message" : "Line successfully removed."});
                
            });
        }
    })

   
}


module.exports.changeLine = function(req, res){
    if(!req.params._id ||  !req.body.LineNumber || !req.body.ColorLine || req.body.Stations.length<=1 ) {
        return res.status(404).json({"message": "All fields are required"});
        
    }

    if(req.body.Stations == null || req.body.Stations.length < 2)
    {
        return res.status(400).json({"message": "You must add at least two stations per line"});
    }

    Line.findById(req.params._id).then(bla => {
        if( bla == null || bla == undefined)
        {
            return res.status(400).json({"message": "Line that you are trying to edit either do not exist or was previously deleted by another user."});
        }else {
            if(bla.__v != req.body.Version)
            {
                return res.status(409).json({"message" : "CONFLICT You are trying to edit a Line that has been changed recently. Try again. "})
            }else {
                const nest = { lineNumber : req.body.LineNumber, stations: req.body.Stations, __v: (req.body.Version+1)}
                Line.findOneAndUpdate({_id : req.params._id}, nest).then(bla => {
                  

                      return   res.status(200).json({ "message" : "Line successfully updated." });
                    
                   
                })
            }
        }
    })


   

}


module.exports.getAllLines= function(req,res)
{
    Line.find().exec().then(type => { res.send(type);});
}



module.exports.addLine = function(req, res)
{
    if(!req.body.LineNumber || !req.body.ColorLine || req.body.Stations<=1 ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var line = new Line();

    line.lineNumber = req.body.LineNumber;
    line.colorLine = req.body.ColorLine;

    var stat = [];
    req.body.Stations.forEach(function(element) {

        line.stations.push(element.Id);
    //     ST.findOne({_id: element.Id}).then(bla => {
    //         line.stations.push(bla.id);
    //   });
    });

    line.save(function(err){
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        res.status(200).json({
            "message" : "Line successfully added."
        });
    
    });


};