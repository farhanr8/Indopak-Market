var express = require('express');
var router = express.Router();

var monk = require('monk');

var db = monk('localhost:27017/indopak');

router.get('/', function(req, res) {
	var collection = db.get('products');
	collection.find({}, function(err, videos){
		if (err) throw err;
	  	res.json(videos);
	});
});

// Add product
router.post('/', function(req, res){
    var collection = db.get('products');
    collection.insert({
        name: req.body.name,
        class: req.body.class,
        picture: req.body.picture,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description
    }, function(err, product){
        if (err) throw err;
        res.json(product);
    });
});

// Edit existing product
router.get('/:id', function(req, res) {
    var collection = db.get('products');
    collection.findOne({ _id: req.params.id }, function(err, product){
        if (err) throw err;
        res.json(product);
    });
});

// Update existing product
router.put('/:id', function(req, res){
    var collection = db.get('products');
    collection.update({_id: req.params.id},
        {
            $set:{
            name: req.body.name,
            class: req.body.class,
            picture: req.body.picture,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
            }
        }, function(err, product){
            if (err) throw err;
            res.json(product);
        });
});

router.post('/:id', function(req, res){
    var collection = db.get('products');
    collection.update({_id: req.params.id},
        {
            $set:{
            name: req.body.name,
            class: req.body.class,
            picture: req.body.picture,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
            }
        }, function(err, product){
            if (err) throw err;
            res.json(product);
        });
});

// Delete Product
router.delete('/:id', function(req, res){
	var collection = db.get('products');
	collection.remove({ _id: req.params.id }, function(err, video){
		if (err) throw err;
		res.json(video);
	});
});

module.exports = router;