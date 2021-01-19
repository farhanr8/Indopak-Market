var express = require('express');
var router = express.Router();

var monk = require('monk');

var db = monk('localhost:27017/indopak');

router.get('/', function(req, res) {
    var collection = db.get('user');
    collection.find({}, function(err, users){
        if (err) throw err;
        res.json(users);
    });
});

// Get specific account
router.get('/:username', function(req, res) {
    var collection = db.get('user');
    collection.findOne({ username: req.params.username }, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});


// Update account (excluding username and password)
router.put('/:username', function(req, res){
    var collection = db.get('user');
    collection.update({ username: req.params.username },
        {
            username: req.body.username,
            authority: req.body.authority,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
        }, function(err, user){
            if (err) throw err;
            res.json(user);
        });
});


// Create an account
router.post('/', function(req, res){
    var collection = db.get('user');
    var collection_cart = db.get('cart');
    var collection_order = db.get('order');
    collection.findOne({username:req.body.username}, function(err, user){
        if (err) {
            throw err;
        } else if(user) {
            res.json({'message': false,'result':0});
        } else {
            collection.insert({
                username: req.body.username,
                password: req.body.password,
                authority: 0,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address
            }, function(err, user){
                if (err) throw err;
                res.json({'message': true,'result':1}); 
            });

            // initialize new user's cart
            collection_cart.insert({
                username: req.body.username,
                items: {}
            },function(err,cart){
                if(err) throw err;
            });
            // initialize new user's order
            collection_order.insert({
                username: req.body.username,
                orders: []
            },function(err,cart){
                if(err) throw err;
            });
        }
    });
});

// Update password
router.post('/:id', function(req, res){
    var collection = db.get('user');
    collection.update({ _id: req.params.id },
        {
            $set : {password :req.body.password}
        }, function(err, user){
            if (err) throw err;
            res.json(user);
        });
});

module.exports = router;