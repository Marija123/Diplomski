var mongoose = require('mongoose');
var TicketType = mongoose.model('ticketType');
var User = mongoose.model('User');
var PassengerType = mongoose.model('passengerType');
var Ticket = mongoose.model('ticket');
var PayPal = mongoose.model('payPal');

module.exports.buyTicket = function(req, res)
{

    var pp = new PayPal();
    pp.payementId = req.body.payementId;
    pp.createTime = new Date(req.body.createTime);
    pp.payerEmail = req.body.payerEmail;
    pp.payerName = req.body.payerName;
    pp.payerSurname =req.body.payerSurname;
    pp.currencyCode = req.body.currencyCode;
    pp.value = req.body.value;

    pp.save(function(err){
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        var ticket = new Ticket();

        ticket.payPal = pp._id;
        ticket.user = req.body.user;
        ticket.name = "karta";
        ticket.ticketPrice = req.body.ticketPrices;
        ticket.purchaseTime = new Date(req.body.purchaseTime);
        TicketType.findOne({name : req.body.ticketType}).then(ab => {
            ticket.ticketType = ab._id;
            ticket.save(function(err){
                if(err)
                {
                    res.status(404).json(err);
                    return;
                }else{
                    return res.status(200).json({"message" : "All good"});
                }
            });
        })
       

    });
    
    
}

module.exports.getTypeUser = function(req, res)
{
    if(req.params._id == "" || req.params._id == "null")
    {
        return res.status(400).json({"message": "error. all fields required"});
    }

    User.findOne({email : req.params._id}).then(us => {
        PassengerType.findOne({_id: us.passengerType}).then(pass => {
            res.send(pass);
        })
    })
}

module.exports.getAllTicketTypes = function(req, res){

    TicketType.find().exec().then(data => {res.send(data)});

}

module.exports.checkValidity = function(req, res)
{
    if(req.body.name == "null" || req.body.name == "")
    {
        if(req.body.id == "1")
        {
            return res.status(200).json({"message": "Ok"});
        }
        else {
            return res.status(200).json({"message": "notOk"});
        }
    }else {
        User.findOne({email : req.body.name}).then(aa => {
            if(aa != null)
            {
                if(aa.activated != "ACTIVATED")
                {
                    return res.status(200).json({"message": "notOk"});
                }else{
                    return res.status(200).json({"message": "Ok"});
                }
            }
        })
    }
}