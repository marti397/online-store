var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderStatusSchema = new Schema({
    status:  String
});

module.exports = mongoose.model('Order-Status', orderStatusSchema);