var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType');

var sendJSONresponse = function(res, status, content)
{
    res.status(status);
    res.json(content);
}

module.exports.edit = function(req,res)
{
    if(!req.body.Name || !req.body.Email  || !req.body.Surname || !req.body.Address  || !req.body.Birthday ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    const nesto= {email: req.body.Email, name: req.body.Name, address: req.body.Address, birthday : new Date(req.body.Birthday)}
    User.findOneAndUpdate({_id : req.body.Id}, nesto).then(bla => {
       return res.status(200).json({
            "message" : "Successfully edited"
        });
    })
}

module.exports.register = function(req, res)
{
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.surname || !req.body.address  || !req.body.birthday || !req.body.role) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.surname = req.body.surname;
    user.address = req.body.address;
    user.birthday = req.body.birthday;
    //user.image = req.body.image;
    //user.activated = req.body.activated;
    user.role = req.body.role;
if(user.role == "AppUser"){

    PT.findOne({name: req.body.passengerType}).then(bla => {
        user.passengerType = bla.id;

        user.setPassword(req.body.password);

    user.save(function(err){
        if(!err)
        {
            User.find({}).populate('passengerType');
        }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
    });

}else {
    user.setPassword(req.body.password);

    user.save(function(err){
        if(!err)
        {
            User.find({}).populate('passengerType');
        }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
}
};

module.exports.login = function(req, res){
    if(!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    passport.authenticate('local', function(err, user, info){
        var token;
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            res.status(401).json(info);
        }
    })(req,res);
};