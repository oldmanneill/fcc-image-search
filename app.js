var mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express(),
    methodOverride = require("method-override");

mongoose.connect('mongodb://oldmanneill:gohomedrunk@ds235778.mlab.com:35778/url-shortener');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var urlSchema = new mongoose.Schema({
    longUrl: String,
});
var Url = mongoose.model('Url', urlSchema);

//routes - index
app.get('/', function(req, res) {
    res.redirect('/urlShortener');
});
app.get('/urlShortener', function(req, res) {
    res.render('index');
});

app.get('/:shortUrl?', function(req, res) {
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
});

//create route
app.post("/urlShortener", function(req, res) {
    var properUrl = JSON.stringify(req.body.url.longUrl);
    if (properUrl.slice(1, 8) == "http://" || properUrl.slice(1, 9) == "https://") {
        Url.create(req.body.url, function(err, newUrl) {
            if (err) {
                res.render("index");
            }
            else {
                res.render("show", { url: newUrl });
            }
        });
    }
    
    else {
        var warning = "---- Try again! Your URL must start with either http:// or https:// -----";
        res.render('warning',{warning:warning});
    }
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is running');
});