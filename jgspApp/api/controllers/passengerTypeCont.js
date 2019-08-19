var mongoose = require('mongoose');
var PassengerType = mongoose.model('passengerType');


module.exports.findAllPassengerType = function(req, res)
{
    var types = [];
    //  PassengerType.find().then(type => {
    //     res.send(type);
    //  });
    
     PassengerType.find().exec().then(type => { res.send(type);});
    console.log(type);
        // PassengerType.find().exec(function(err,passengerType) {

        //     res.status(200).json(passengerType);
        // });
    
};

// module.exports.findPTByName = function(name){
//     var Pas = new PassengerType();
//     PassengerType.findOne({name: name}, function(err, res){
//         console.log("id ", res._id);
//         return res._id;
//    });
//   // return Pas._id;
// }

// module.exports.findPTByName = function(name, done ){
//  PassengerType.findOne({name: name}, function(err, pt){
//    if(err) { return done(err);}
//    return done(null, pt);
//  });
// }



// module.exports.findPTByName = (name) =>{
//   PassengerType.findOne({
//         name: name
// });
//}
