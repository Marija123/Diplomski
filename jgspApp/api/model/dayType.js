var mongoose = require('mongoose');

var dayTypeSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true
    }
});

mongoose.model('DayType', dayTypeSchema);