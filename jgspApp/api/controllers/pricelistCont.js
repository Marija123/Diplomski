var mongoose = require('mongoose');
var Pricelist = mongoose.model('pricelist');
var TicketPrices = mongoose.model('ticketPrices');
var TicketType = mongoose.model('ticketType');

module.exports.getPricelist = function(req, res)
{
    Pricelist.find().exec().then(type => { res.send(type);});

}

module.exports.addPricelist = function(req, res)
{
    if(req.body.Hourly <= 0 || req.body.Daily <=0 || req.body.Monthly<=0 || req.body.Yearly<=0)
    {
        sendJSONresponse(res, 400, {
            "message": "Prices can't be less then 1!"
        });
        return;
    }

    if(req.body.PriceList.StartOfValidity == "" || req.body.PriceList.EndOfValidity == ""  || req.body.PriceList.EndOfValidity == null || req.body.PriceList.StartOfValidity == null)
    {
        sendJSONresponse(res, 400, {
            "message": "Start or end of validity can't be empty!"
        });
        return;
    }


    // if(req.body.PriceList.StartOfValidity.Value.Date < Date.now.Date)
    // {
    //     sendJSONresponse(res, 400, {
    //         "message": "You can't make pricelist for past!"
    //     });
    //     return;
    // }

    // if(req.body.PriceList.StartOfValidity> req.body.PriceList.EndOfValidity)
    // {
    //     sendJSONresponse(res, 400, {
    //         "message": "Start of validity is bigger then end of validity!"
    //     });
    //     return;
    // }


    var pricelist = new Pricelist();

    pricelist.startOfValidity = new Date(req.body.PriceList.StartOfValidity);
    pricelist.endOfValidity= new Date(req.body.PriceList.EndOfValidity);

    pricelist.save(function(err){
        var tp1 = new TicketPrices();
    
        TicketType.findOne({'name' : "Hourly"}).then(mm => {
            tp1.ticketType = mm._id;
            tp1.price = req.body.Hourly;
            tp1.pricelist = pricelist._id;
            tp1.save();
        });

  

        var tp2 = new TicketPrices();
        TicketType.findOne({'name' : "Daily"}).then(mm => {
            tp2.ticketType =mm._id;
            tp2.price = req.body.Daily;
            tp2.pricelist = pricelist._id;
            tp2.save();
        });
    

        var tp3 = new TicketPrices();
        TicketType.findOne({name : "Monthly"}).then(mm => {
            tp3.ticketType = mm._id;
            tp3.price = req.body.Monthly;
            tp3.pricelist = pricelist._id;
            tp3.save();
        });

        var tp4 = new TicketPrices();
        TicketType.findOne({name : "Yearly"}).then(mm => {
            tp4.ticketType = mm._id;
            tp4.price = req.body.Yearly;
            tp4.pricelist = pricelist._id;
            tp4.save();
        });


    
    if(err)
    {
        res.status(404).json(err);
        return;
    }

    res.status(200).json({
        "message" : "Pricelist successfully added."
    });
    });

    


}

