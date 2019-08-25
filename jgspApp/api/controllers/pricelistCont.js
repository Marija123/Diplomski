var mongoose = require('mongoose');
var Pricelist = mongoose.model('pricelist');
var TicketPrices = mongoose.model('ticketPrices');
var TicketType = mongoose.model('ticketType');


module.exports.getTicketPrices = function(req,res)
{
    
    
        var ret = [];
        TicketPrices.find().exec().then(bb => {
            bb.forEach(element => {
                if(element.pricelist._id == req.query.parami){
                    ret.push(element);
                }
            })
    
            var rr = [];
            TicketType.find().exec().then(bla => {
              bla.forEach(zz => {
                if(zz.name == "Hourly"){
                    ret.forEach(mm =>{
                        if(mm.ticketType._id == zz.id){
                            rr.push(mm);
                        }
                    })
                }
              })
                
              bla.forEach(zz => {
                if(zz.name == "Daily"){
                    ret.forEach(mm =>{
                        if(mm.ticketType._id == zz.id){
                            rr.push(mm);
                        }
                    })
                }
              })
    
              bla.forEach(zz => {
                if(zz.name == "Monthly"){
                    ret.forEach(mm =>{
                        if(mm.ticketType._id == zz.id){
                            rr.push(mm);
                        }
                    })
                }
              })
    
              bla.forEach(zz => {
                if(zz.name == "Yearly"){
                    ret.forEach(mm =>{
                        if(mm.ticketType._id == zz.id){
                            rr.push(mm);
                        }
                    })
                }
              })
              res.send(rr);
    
                
          })  
    
        })
    }




module.exports.getPricelist = function(req, res)
{


     Pricelist.find().exec().then(pric => {
        var lala = pric.reverse();

        var ret = lala.find(checkAdult);

         TicketPrices.find().exec().then(pr => {
            pr.forEach(element => {
                if(element.pricelist._id == ret.id)
                {
                    ret.ticketPricess.push(element.id);
                }
            });
               
            res.send(ret);
         });

        
        
    });
    

}

function checkAdult(age) {
    var today = new Date();
    if(age.startOfValidity.getFullYear() <= today.getFullYear() && age.startOfValidity.getMonth() <= today.getMonth() && age.startOfValidity.getDate() <= today.getDate())
    {
        if(age.endOfValidity.getFullYear() >= today.getFullYear() &&  age.endOfValidity.getMonth() >= today.getMonth() && age.endOfValidity.getDate() >= today.getDate())
        {
            return age;
        }
    }
}

module.exports.addPricelist = function(req, res)
{
    if(req.body.Hourly <= 0 || req.body.Daily <=0 || req.body.Monthly<=0 || req.body.Yearly<=0)
    {
        

        return res.status(400).json({ "message": "Prices can't be less then 1!"})
    }

    if(req.body.PriceList.StartOfValidity == "" || req.body.PriceList.EndOfValidity == ""  || req.body.PriceList.EndOfValidity == null || req.body.PriceList.StartOfValidity == null)
    {
      

        return res.status(400).json({ "message": "Start or end of validity can't be empty!"})

    }
    var today = new Date();

    var st = new Date(req.body.PriceList.StartOfValidity);
    var et = new Date(req.body.PriceList.EndOfValidity);

    if(st.getFullYear() < today.getFullYear())
    {
        return res.status(400).json({ "message": "You can't make pricelist for past!"});
        
    }else{ 
        if(st.getMonth() < today.getMonth()){
            return res.status(400).json({ "message": "You can't make pricelist for past!"});
        }else{
            if(st.getDate() < today.getDate())
            {
                return res.status(400).json({ "message": "You can't make pricelist for past!"});
            }
        }

    }

    if(st.getFullYear() > et.getFullYear())
    {
        return res.status(400).json({"message": "Start of validity is bigger then end of validity!"});
       
    }else{ 
        if(st.getMonth() > et.getMonth()){
            return res.status(400).json({"message": "Start of validity is bigger then end of validity!"});
        }else{
            if(st.getDate() > et.getDate())
            {
                return res.status(400).json({"message": "Start of validity is bigger then end of validity!"});
            }
        }

    }



  
   


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

