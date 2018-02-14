var mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    request = require('request');

//mongoose.connect('mongodb://oldmanneill:gohomedrunk@ds235778.mlab.com:35778/url-shortener');
mongoose.connect('mongodb://localhost/apizzz');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

/*request('https://www.googleapis.com/customsearch/v1?key=AIzaSyD8l4vk5uqWWEPch0BQfMOqyR3RDeuCrb4&cx=012686465476344779243:leo8px30e1a&searchType:image&q=pigs', function (error, response, body) {
    if(error){
        console.log('something went wrong!');
        console.log(error);
    } else{
        if(response.statusCode == 200){
            var parsedData = JSON.parse(body);
            console.log(parsedData.items[0].pagemap.cse_image[0].src);
            console.log(parsedData.items[0].snippet);
            console.log(parsedData.items[0].link);
        }
    }
}); */

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

/*app.get('/:shortUrl?', function(req, res) {
    var name = req.params.shortUrl;
    Url.findById(name, function(err, foundUrl) {
        if (err) {
            res.redirect("/urlShortener");
        }
        else {
            var longUrl = foundUrl.longUrl;
            res.redirect(longUrl);
        }
    });
});*/

//create route
app.post("/apiSearch", function(req, res) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) { //this checks to see if the see history button is empty
        console.log('they want to see the last few searches');
    }
    else {

        var startingPoint = Number(req.body.search.page) * 10;
        var searchTerm = req.body.search.image;
        var googleSearch = "https://www.googleapis.com/customsearch/v1?key=AIzaSyD8l4vk5uqWWEPch0BQfMOqyR3RDeuCrb4&cx=012686465476344779243:leo8px30e1a&searchType:image&q=" + searchTerm + "&start=" + startingPoint;

        request(googleSearch, function(error, response, body) {
            if (error) {
                console.log('something went wrong!');
                console.log(error);
            }
            else {
                if (response.statusCode == 200) {
                    var parsedSearchData = JSON.parse(body);
                    //console.log('here is the data: '+ JSON.stringify(parsedSearchData));
                    var arr = [];
                    for (var i = 0; i < parsedSearchData.items.length; i++) {
                        if (parsedSearchData.items[i].pagemap.cse_image) {
                            arr.push({ image: parsedSearchData.items[i].pagemap.cse_image[0].src, snippet: parsedSearchData.items[i].snippet, link: parsedSearchData.items[i].link });
                        }
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
