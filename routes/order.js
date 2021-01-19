var express = require('express');
var router = express();

var monk = require('monk');

var db = monk('localhost:27017/indopak');

router.get('/', function(req, res) {
    var collection = db.get('order');
    collection.find({}, function(err, order){
        if (err) throw err;
        res.json(order);
    });
});

router.post('/:id', function(req, res){
    // console.log("Update order");
    var collection = db.get('order');
    collection.update({_id: req.params.id},
        {
            $set : {orders :req.body.orders}
        }, function(err, order){
            if (err) throw err;
            res.json(order);
        });
});

module.exports = router;