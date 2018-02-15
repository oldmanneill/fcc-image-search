var mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    request = require('request');

mongoose.connect('mongodb://oldmanneill:whatthebogus@ds235778.mlab.com:35778/image_search');
//mongoose.connect('mongodb://localhost/apizzz');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


var searchSchema = new mongoose.Schema({
    image: String,
    created: { type: Date, default: Date.now }
});
var Api = mongoose.model('Api_search', searchSchema);

//routes - index
app.get('/', function(req, res) {
    res.redirect('/apiSearch');
});
app.get('/apiSearch', function(req, res) {
    res.render('index');
});

//create route
app.post("/apiSearch", function(req, res) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) { //this checks to see if the see history button is empty
        Api.find({}).select("created image _id").sort({ created: -1 }).limit(10).exec((err, apis) => { //retrieves the last 10 searches from database
            if (err) {
                console.log('error');
            }
            else {
                res.render('history', { apis: apis });
            }
        });
    }
    else {
        if (!Number(req.body.search.page)) {//check for someone not entering a page starting number
            var startingPoint = 1;
        }
        else {
            var startingPoint = (Number(req.body.search.page) * 10) - 9;
        }
        var searchTerm = req.body.search.image;
        var googleSearch = "https://www.googleapis.com/customsearch/v1?key=AIzaSyD8l4vk5uqWWEPch0BQfMOqyR3RDeuCrb4&cx=012686465476344779243:leo8px30e1a&searchType:image&q=" + searchTerm + "&start=" + startingPoint;

        request(googleSearch, function(error, response, body) {
            if (error) {
                console.log('something went wrong!');
                console.log(error);
            }
            else {
                if (response.statusCode == 200) {
                    // console.log(body.queries);
                    var parsedSearchData = JSON.parse(body);
                    var arr = [];
                    if (parsedSearchData.items) {
                        for (var i = 0; i < parsedSearchData.items.length; i++) {
                            if (parsedSearchData.items[i].pagemap.cse_image) { //checks for the case in which no image is stored...if there was no image, the result would have thrown an error.
                                arr.push({ image: parsedSearchData.items[i].pagemap.cse_image[0].src, snippet: parsedSearchData.items[i].snippet, link: parsedSearchData.items[i].link });
                            }
                        }
                    }
                    else {
                        arr.push("no results found!");
                    }
                    Api.create(req.body.search, function(err, newSearch) {
                        if (err) {
                            console.log(err);
                            res.render("index");
                        }
                        else {
                            res.render("show", { arr: arr });
                        }
                    });
                }
            }
        });
    }
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is running');
});
