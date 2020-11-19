var Supplier = require('../models/supplier');

var mongoose = require('mongoose');
mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});

var mySupplier = [ 
    new Supplier({
        name: "Dia Na Jewelry",
        address:"4337#, 2 Building C",
        photo:"IMG_9455.jpg",
        email:"dianna8188@126.com",
        comments:"We Chat - Yang Qi Bang 13516921218, Weng Xiao Zhen 13777921359"
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    mySupplier.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });
});