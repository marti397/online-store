var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscountCodesSchema = new Schema({
    code: { type: String, required: true, unique: true },
    isPercent: { type: Boolean, required: true, default: true },
    amount: { type: Number, required: true }, // if is percent, then number must be ≤ 100, else it’s amount of discount
    expireDate: { type: String, required: true, default: '' },
    isActive: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('DiscountCodes', DiscountCodesSchema);