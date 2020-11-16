var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId , ref: 'User'},
    cart:{type: Object, required: true},
    address:{type: String, required: true},
    name:{type: String, required: true},
    paymentId:{type: String, required: true},
    orderId:{type: String, required: true},
    orderStatus: String,
    email: String,
    comments: String,
    isguest: {type: Boolean, default: false},
    orderDate:{type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);