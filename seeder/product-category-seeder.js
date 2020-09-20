var productCategory = require('../models/category');

var mongoose = require('mongoose');
mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});

var categories = [
    new productCategory({
        category: "collares"
    }),  
    new productCategory({
        category: "aretes"
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    categories.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });
});