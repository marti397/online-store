var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});

var products = [
    new Product({
        imagePath: 'https://www.dhresource.com/0x0s/f2-albu-g7-M00-4E-43-rBVaSVtzd1yAenlvAAKFHR5_IfM139.jpg/ashion-accessories-manilai-fashion-handmade.jpg',
        title: 'Uno',
        descr: 'Uno text',
        price: 33
    }),
    new Product({
        imagePath: 'https://images-na.ssl-images-amazon.com/images/I/71YeR45qTQL._UX522_.jpg',
        title: 'Dos',
        descr: 'Dos text',
        price: 22
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    products.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });

});

