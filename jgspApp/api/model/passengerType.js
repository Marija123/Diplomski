var mongoose = require('mongoose');


var passengerTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true
    },
    coefficient: {
        type: Number
    }
}, {collection: 'passengerType'});

mongoose.model('passengerType', passengerTypeSchema);

