var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supplierSchema = new Schema({
    name: {type:String},
    address:{type:String},
    photo:String,
    email:String,
    comments:String
});

module.exports = mongoose.model('Supplier', supplierSchema);