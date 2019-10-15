var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    email: {type: String, required: true },
    password: {type: String, required: true },
    name: {type: String, required: true },
    phone: {type: String, required: true }
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}
userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);