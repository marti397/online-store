var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    imagePath: {type: String, required: true },
    title:  String,
    descr: String,
    price:   Number
});

module.exports = mongoose.model('Product', productSchema);