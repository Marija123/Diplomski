var mongoose = require('mongoose');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');


module.exports.declineUser = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "DECLINED", image : null};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'User declined',
            text: 'Dear ' +  bla.name + " " + bla.surname + ",\nYou have been declined as authorized user. You can resend request by uploading picture of document!"
          };
        sendMail(mailOptions);

        res.status(200).json({"message": "Ok"});
    });
}

module.exports.authorizeUser = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'User approved',
            text: 'Dear ' +  bla.name + " " + bla.surname + ",\nYour account has been approved."
          };
        sendMail(mailOptions);

        res.status(200).json({"message": "Ok"});
    });
}


module.exports.declineController = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "DECLINED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'Controller declined',
            text: 'Dear ' +  bla.name + " " + bla.surname + ",\nYou have been declined as controller.\nYou can resend request on you profile!"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.authorizeController = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'Controller approved',
            text: 'Dear ' +  bla.name + " " + bla.surname + ", \n you have been approved as controller."
          };
        sendMail(mailOptions);

        res.status(200).json({"message": "Ok"});
    });
}


module.exports.declineAdmin = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "DECLINED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'Admin declined',
            text: 'Dear ' +  bla.name + " " + bla.surname + ",\nYou have been declined as admin.\nYou can resend request on you profile!"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.authorizeAdmin = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'Admin approved',
            text: 'Dear ' +  bla.name + " " + bla.surname + ",\nYou have been approved as admin."
          };
        sendMail(mailOptions);

        res.status(200).json({"message": "Ok"});
    });
}

module.exports.getAwaitingAdmins = function(req, res)
{
    User.find().exec().then(allUs => {
        var ret = [];
        allUs.forEach(el => {
            if(el.role == "Admin" && el.activated == "PENDING"){
                ret.push(el);
            }
        });
        res.send(ret);
    })
}


module.exports.getAwaitingControllers = function(req, res)
{
    User.find().exec().then(allUs => {
        var ret = [];
        allUs.forEach(el => {
            if(el.role == "Controller" && el.activated == "PENDING"){
                ret.push(el);
            }
        });
        res.send(ret);
    })
}

module.exports.getAwaitingClients = function(req, res)
{
    User.find().exec().then(allUs => {
        var ret = [];
        allUs.forEach(el => {
            if(el.role == "AppUser" && el.activated == "PENDING"){
                ret.push(el);
            }
        });
        res.send(ret);
    })
}


function sendMail(mailOptions){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pusgs2019app@gmail.com',
          pass: '12345Aa.'
        }
      });
      
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}