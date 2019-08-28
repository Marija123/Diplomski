var mongoose = require('mongoose');
var TicketType = mongoose.model('ticketType');
var User = mongoose.model('User');
var PassengerType = mongoose.model('passengerType');
var Ticket = mongoose.model('ticket');
var PayPal = mongoose.model('payPal');
var TicketPrices = mongoose.model('ticketPrices');
var nodemailer = require('nodemailer');
var FormData = require('form-data');
var fs = require('fs');


module.exports.validateTicket = function(req, res){

    if(req.params.email == undefined || req.params.email == ""){
        return res.status(400).json({"message": "You have to fill email address!"});
    }
    User.findOne({email : req.params.email}).then(aa => {
        if(aa != null && aa != undefined){
        if(aa._id != req.body.user)
        {
            let s = "User with email: " + req.params.email + " did not buy ticket with Id: " + req.body._id;
            return res.status(400).json({"message": s});
        }else {
            var dd = (new Date(req.body.purchaseTime));
            var today = new Date();
            TicketType.findById(req.body.ticketType).then(tt => {
                if(tt.name == "Hourly"){
                    var ddd = (new Date(req.body.purchaseTime));
                    ddd.setHours(dd.getHours() -1);
                    if(ddd < today)
                    {
                        let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                    }else{
                        let s = "Ticket with id '" + req.body._id + "' is valid!"
                        return res.status(200).json({"message": s});
                    }
                }else if(tt.name == "Daily")
                {
                    if(dd.getFullYear() < today.getFullYear())
                    {
                        let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                    }else if(dd.getFullYear() == today.getFullYear()) {
                        if(dd.getMonth() < today.getMonth()){
                            let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                        }else if(dd.getMonth() == today.getMonth())
                        {
                            if(dd.getDate() == today.getDate())
                            {
                                let s = "Ticket with id '" + req.body._id + "' is valid!"
                                return res.status(200).json({"message": s});
                            }else{
                                let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                                return res.status(400).json({"message": s});
                            }
                        }
                        
                    }
                }else if(tt.name == "Monthly")
                {
                    if(dd.getFullYear() < today.getFullYear())
                    {
                        let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                    }else if(dd.getFullYear() == today.getFullYear()) {
                        if(dd.getMonth() == today.getMonth())
                        {
                            let s = "Ticket with id '" + req.body._id + "' is valid!"
                            return res.status(200).json({"message": s});
                        }
                        else{
                            let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                            return res.status(400).json({"message": s});
                        }
                    }
                }else if(tt.name == "Yearly"){
                    if(dd.getFullYear() == today.getFullYear())
                    {

                     let s = "Ticket with id '" + req.body._id + "' is valid!"
                            return res.status(200).json({"message": s});
                    }
                    else{
                            let s = "Ticket with id '" + req.body._id + "' is not valid. Time is up!"
                            return res.status(400).json({"message": s});
                    }
                }
            });
        }
    }else {
        let s = "User with email: " + req.params.email + " did not buy ticket with Id: " + req.body._id;
            return res.status(400).json({"message": s});
    }
    })

}

module.exports.validateTicketNoUser = function(req, res){
    if(req.body._id == null || req.body._id == "")
    {
        return res.status(400).json({"message": "Ticket doesnt exists"})
    }

    var today = new Date();
    var dd = (new Date(req.body.purchaseTime));
    dd.setHours(dd.getHours() -1);
    if(dd < today)
    {
        return res.status(400).json({"message": "Ticket is not valid"});
    }else{
        return res.status(200).json({"message": "Ticket is valid"});
    }

    

}

module.exports.getTicket = function(req,res)
{
    Ticket.findOne({_id: req.params.id}).then(aa => {
        res.send(aa);
    })
    
}

module.exports.getPrice = function(req, res){


    User.findById(req.query.par).then(us => {
        PassengerType.findById(us.passengerType).then(pst => {
            TicketPrices.findById(req.query.parami).then(tp => {
                var cena = tp.price - (tp.price * pst.coefficient);
                res.send(cena.toString());
            })
        })
    })

}

module.exports.getAllTicketsForOneUser = function(req, res)
{
    Ticket.find().exec().then(listOfTickets => {
        
        User.findOne({email: req.params.email}).then(aa => {
            var userTickets = [];
        var brojac = 0;
            listOfTickets.forEach(element => {
            brojac++;
            if(element.user != undefined){
                if(element.user.equals(aa._id))
                {
                    userTickets.push(element);
                }
            }
               
                if(brojac == listOfTickets.length)
                {
                   

                    res.send(userTickets);
                   
                
                   
                }
            })
           

            })

        });

        
    
}



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
        if(req.body.user != "null" && req.body.user != "" && req.body.user != null){
            ticket.user = req.body.user;
        }
        
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

                    if(ticket.user == undefined)
                    {
                        ticket.purchaseTime.setHours(ticket.purchaseTime.getHours() - 2);
                   var dd = ticket.purchaseTime.toString();
                   var ddd = dd.split('GMT');
                   

                        var mailOptions = {
                            from: 'pusgs2019app@gmail.com',
                            to: req.body.mailZaSlanje,
                            subject: 'Ticket purchase',
                            text: 'Dear ' +  req.body.mailZaSlanje + ",\nYour purchase is successfull.\n" + "Ticket type : Hourly \n" + 
                                "Time of purchase: " + ddd[0].toString() + "\nTicket is valid for the next hour.\n\n" + "Thank you."
                            
                        
                        };
                        sendMail(mailOptions);
                    }
                    return res.status(200).json({"message" : "All good"});
                }
            });
        })
       

    });
    
    
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