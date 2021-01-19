var express = require('express');
var router = express.Router();

var monk = require('monk');

var db = monk('localhost:27017/indopak');

router.get('/', function(req, res) {
    var collection = db.get('cart');
    collection.find({}, function(err, cart){
        if (err) throw err;
        res.json(cart);
    });
});

// Get User Cart
router.get('/:id', function(req, res) {
    // console.log("get/:id");
    var collection = db.get('cart');
    collection.findOne({ _id: req.params.id }, function(err, cart){
        if (err) throw err;
        res.json(cart);
    });
});

// Update Cart with some product id
router.post('/:id', function(req, res){
    // console.log("update cart",req.body);
    var collection = db.get('cart');
    collection.update({
            _id: req.params.id
        },
        {
            $set : {items :req.body.items}
        }, function(err, cart){
            if (err) throw err;
            res.json(cart);
        });
});

// Delete a product from cart
router.delete('/:id', function(req, res){
    var collection = db.get('cart');
    collection.remove({ _id: req.params.id }, function(err, cart){
        if (err) throw err;
        res.json(cart);
    });
});

module.exports = router;