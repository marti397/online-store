var Discount = require('../models/discount');

var mongoose = require('mongoose');
mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});

var discounts = [
    new Discount({
        code: "galletita",
        isPercent: false,
        amount: 50,
        expireDate: 'no',
        isActive: true
    }),  
    new Discount({
        code: "pistacho",
        isPercent: true,
        amount: 10,
        expireDate: 'no',
        isActive: true
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    discounts.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });
});