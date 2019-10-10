var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});

var products = [
    new Product({
        imagePath: '/images/products/im1.jpg',
        title: 'Stelen',
        descr: 'Ciara Spiral Hair Tie in Brown and Silver',
        details:'Set of hair ties from Stelen. Elasticized spiral construction with metallic finish. Sold as pair.',
        price: 140,
        type: 'brazaletes',
        style: 'casual'
    }),
    new Product({
        imagePath: '/images/products/im2.jpg',
        title: 'Stelen',
        descr: 'Ciara Spiral Hair Tie in Gold and Bronze',
        details: 'Set of hair ties from Stelen. Elasticized spiral construction with metallic finish. Sold as pair.',
        price: 140,
        type: 'brazaletes',
        style: 'ejecutiva'
    }),
    new Product({
        imagePath: '/images/products/im3.jpg',
        title: 'Farrow',
        descr: 'Fendy Pearl Hair Pin',
        details: 'Feminine hairpin from Farrow. Pearlescent beaded motif. Silvertone jumbo pin back holds medium to thick hair.',
        price: 360,
        type: 'collares',
        style: 'especiales'
    }),
    new Product({
        imagePath: '/images/products/im4.jpg',
        title: 'Farrow',
        descr: 'Renée Hair Clip in Tortoise',
        details: 'Rectangular alligator clip from Farrow. Acetate front with brown flecks and rounded edges. Goldtone spring back with toothed edges for gripping hair. Best for fine to medium thickness hair.',
        price: 360,
        type: 'aretes',
        style: 'invierno'
    }),
    new Product({
        imagePath: '/images/products/im5.jpg',
        title: 'Loren Stewart',
        descr: 'Baby Gucci Anklet',
        details: 'Classic anklet from Loren Stewart. Delicate 14k yellow gold gucci chain. Clasp closure and triangular logo charm. Handmade.',
        price: 1340,
        type: 'cinturones',
        style: 'noche'
    }),
    new Product({
        imagePath: '/images/products/im6.jpg',
        title: 'Sylvain Le Hen',
        descr: 'Agrafe 017 XL Hair Pin',
        details: 'Angular hair pin from Sylvain Le Hen. Mirrored metallic finish. Hand-soldered twist at side with hand-mounted side screw. Stamped HDA logo at back.',
        price: 1600,
        type: 'anillos',
        style: 'especiales'
    }),
    new Product({
        imagePath: '/images/products/im7.jpg',
        title: 'Maryam Nassir Zadeh',
        descr: 'Bruno Leather Belt in Auburn Snake',
        details:'Classic belt from Maryam Nassir Zadeh. Snake-embossed calfskin. Wrapped round buckle. Six notches. Pointed end.',
        price: 900,
        type: 'cinturones',
        style: 'ejecutiva'
    }),
    new Product({
        imagePath: '/images/products/im8.jpg',
        title: 'Farrow',
        descr: 'Ilana Acetate Hair Tie',
        details:'Contemporary hair tie from Farrow. Curved oval plate in multicolored acetate hugs ponytail. Covered elastic band. ',
        price: 100,
        type: 'anillos',
        style: 'invierno'
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

