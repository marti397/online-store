var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    imagePath: {type: String, required: true },
    title:  String,
    descr: String,
    details: String,
    price:   Number,
    type: String,
    style: String,
});

module.exports = mongoose.model('Product', productSchema);