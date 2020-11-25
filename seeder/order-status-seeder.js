var orderStatus = require('../models/order-status');

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chrm11:chrm11@online-store.gyt5p.mongodb.net/online-store-db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var myorderStatus = [
    new orderStatus({
        status: "processing"
    }),  
    new orderStatus({
        status: "shipped"
    }),
    new orderStatus({
        status: "lost"
    }),
    new orderStatus({
        status: "delivered"
    }),
    new orderStatus({
        status: "returned"
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    myorderStatus.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });
});