var express = require('express');
var router = express();

var monk = require('monk');

var db = monk('localhost:27017/indopak');

router.get('/', function(req, res) {
    var collection = db.get('user');
    collection.find({}, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

router.post('/', function(req, res) {
    var collection = db.get('user');
    collection.findOne({username:req.body.username}, function(err, user){
        if (err) throw err;
        if (req.body.password === user['password']) {
            if(user['authority'] === 1) {
                // Admin user
                res.json({'result': 2}); 
            }else if(user['authority'] === 0) {
                // Regular user
                res.json({'result': 1}); 
            }else{
                console.log('Wrong authority');
            }
        }else{
            res.json({'result': 0});
        }
    });
    console.log(res);
});

module.exports = router;