var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    imagePath: [String],
    title:  String,
    descr: String,
    details: String,
    price:   Number,
    type: String,
    style: String,
    quantityAvailable:Number,
    showOnWeb: Boolean,
    supplier:String,
    trueprice: Number
});

module.exports = mongoose.model('Product', productSchema);