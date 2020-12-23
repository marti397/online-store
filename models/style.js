var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productStyleSchema = new Schema({
    style:  String
});

module.exports = mongoose.model('Style', productStyleSchema);