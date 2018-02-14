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
    search: String,
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
    var searchterm = JSON.stringify(req.body.search.image);
    var pagination = JSON.stringify(req.body.search.page);
        Api.create(req, function(err, newSearch) {
            if (err) {
                res.render("index");
            }
            else {
                res.render("show", { search: newSearch });
            }
        });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is running');
});