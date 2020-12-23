var productStyle = require('../models/style');

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chrm11:chrm11@online-store.gyt5p.mongodb.net/online-store-db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var styles = [
    new productStyle({
        style: "casual"
    })
];

var done = 0;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    styles.forEach(function(item, index, array){
        item.save(function (err, result) {
            if (err) return console.error(err);
            done++;
            if (done == array.length){
                mongoose.disconnect();
            }
          });
    });
});