var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productCategorySchema = new Schema({
    category:  String
});

module.exports = mongoose.model('Category', productCategorySchema);