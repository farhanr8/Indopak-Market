var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// // Connect to mongoDB
// var monk = require('monk');
// var db = monk('localhost:27017/vidzy');

// router.get('/', function(req, res, next) {
//   res.redirect('/videos');
// });

// // Query functionality
// router.get("/videos", function (req, res) {
// 	console.log(req.query);
// 	if ((!req.query.search && !req.query.genre) ||
// 	  	(req.query.search == "" && req.query.genre == "all")) {

// 		var collection = db.get("videos");
// 		collection.find({}, function (err, videos) {
// 			if (err) throw err;
// 			res.render("index", { videos: videos });
// 		});

// 	} else if (req.query.search != "" && req.query.genre == "all") {

// 		var collection = db.get("videos");
// 		var regex = new RegExp([req.query.search].join(""), "i");
// 		collection.find({ title: regex }, function (err, videos) {
// 		if (err) throw err;
// 			res.render("index", { videos: videos });
// 		});

// 	} else if (req.query.search != "" && req.query.genre != "all") {

// 		var collection = db.get("videos");
// 		var regex = new RegExp([req.query.search].join(""), "i");
// 		var regexG = new RegExp([req.query.genre].join(""), "i");
// 		collection.find({ title: regex, genre: regexG }, function (err, videos) {
// 			if (err) throw err;
// 			res.render("index", { videos: videos });
// 		});

// 	} else if (req.query.search == "" && req.query.search != "all") {

// 		var collection = db.get("videos");
// 		var regexG = new RegExp([req.query.genre].join(""), "i");
// 		collection.find({ genre: regexG }, function (err, videos) {
// 			if (err) throw err;
// 			res.render("index", { videos: videos });
// 		});

// 	}
// });

// // router.get('/videos', function(req, res) {
// // 	var collection = db.get('videos');
// // 	collection.find({}, function(err, videos){
// // 		if (err) throw err;
// // 	  	res.render('index', { videos : videos })
// // 	});
// // });

// // New video
// router.get('/videos/new', function(req, res, next) {
//   res.render('new');
// });

// // Insert the new video
// router.post("/videos", function (req, res) {
// 	var collection = db.get("videos");
// 	collection.insert({
// 		title: req.body.title,
// 		genre: req.body.genre,
// 		image: req.body.image,
// 		description: req.body.desc,
// 	}, function (err, video) {
// 		if (err) throw err;
// 		res.redirect("/videos");
// 	  }
// 	);
//   });

// // Video description
// router.get("/videos/:id", function (req, res) {
// 	var collection = db.get("videos");
// 	collection.findOne({ _id: req.params.id }, function (err, video) {
// 	  if (err) throw err;
// 	  //res.json(video);
// 	  res.render("show", { video: video });
// 	});
// });

// // Delete video
// router.delete("/videos/:id", function (req, res) {
// 	var collection = db.get("videos");
// 	collection.remove({ _id: req.params.id }, function (err, video) {
// 	  if (err) throw err;
// 	  res.redirect("/");
// 	});
// });

// // Edit page
// router.get("/videos/:id/edit", function (req, res) {
// 	var collection = db.get("videos");
// 	collection.findOne({ _id: req.params.id }, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 			return;
// 		}
// 		res.render("edit", { result: result });
// 	});
// });

// // Save edit
// router.post("/videos/:id/save_edit", function (req, res) {
// 	console.log(req.body);
// 	var collection = db.get("videos");
// 	collection.findOneAndUpdate({ _id: req.params.id },
// 		{
// 			$set: {
// 			title: req.body.title,
// 			genre: req.body.genre,
// 			image: req.body.image,
// 			description: req.body.desc,
// 			},
// 		}).then((updatedDoc) => {
// 			console.log("Updated!");
// 			res.redirect("/");
// 		}
// 	);
// });