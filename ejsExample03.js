var express = require('express');
var app = express();
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');

//var routes = require('./routes');
var members = require('./routes/members'); 

var mysql = require('mysql');
var connection  = require('express-myconnection'); 

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: 'darryl1975',
      port: 3306,
      database: 'test'
    };

//var connection = mysql.createConnection(dbOptions);

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));

// set view engine to ejs
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

/*------------------------------------------
    connection peer, register as middleware
    type : single, pool and request 
-------------------------------------------*/
app.use(connection(mysql, {
        
        host: 'localhost',
        user: 'root',
        password : 'darryl1975',
        port : 3306, //port mysql
        database:'test'

    }, 'pool'));

//Creating Router() object
var router = express.Router();

// Router middleware, mentioned it before defining routes.
router.use("/", function(req,res,next) {
  console.log("/" + req.method);
  next();
});

router.use("/home", function(req,res,next) {
  console.log("/home/" + req.method);
  next();
});

router.use("/about", function(req,res,next) {
  console.log("/about/" + req.method);
  next();
});

router.use("/sitemap", function(req,res,next) {
  console.log("/sitemap/" + req.method);
  next();
});


// This middle-ware will get the id param
// check if its 0 else go to next router.
router.use("/user/:id", function(req,res,next){
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});    
  }
  else next();
});

// Provide all routes here
router.get("/", function(req, res){
  // send back json data
  res.json({"message" : "Hello World"});
});

router.get('/home', function(req, res) {
    var product = [
        { name: 'Logitech UE Boom 2', description: 'Wireless & Waterproof Speaker' },
        { name: 'Maxtill SB-100', description: 'Powerful Soundbar Speaker' },
        { name: 'UNIC Wifi Projector', description: 'Wireless & Portable For Home Theatre' }, 
        { name: 'GoPro Hero 5 Black', description: '9PC Bundle Pack + Warranty' },
        { name: 'DOORAA', description: 'The Ultimate Full HD Selfie Camera' },
        { name: 'ONE PLUS 3', description: '64GB 5.5" QUAD CORE + Warranty' }
    ];
    var tagline = "UNBEATABLE! KNOCK-OUT DIGITAL items";

    res.render('pages/index', {
        page : req.url,
        product: product,
        tagline: tagline
    });

  //res.render('pages/index');
});


router.get('/about', function(req, res){
  res.render('pages/about', {
    page : req.url
  });
});

router.get('/sitemap', function(req, res){
  res.render('pages/sitemap', {
    page : req.url
  });
});

router.get("/user/:id", function(req, res){
  res.json({"message" : "Hello " + req.params.id});
});


router.get('/members', members.list);
router.get('/members/add', members.add);
router.post('/members/add', members.save);
router.get('/members/delete/:id', members.delete_member);
router.get('/members/edit/:id', members.edit);
router.post('/members/edit/:id',members.save_edit);

// Tell express to use this router with '/' before.
// You can put just '/' if you don't want any sub path before routes.
app.use("/", router);

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});


// last middleware - handle 404 error
app.use("*", function(req, res){
  res.status(404).send('404');
});

// listen on this port
// viewed at http://localhost:1337
/*
app.listen(1337, function() {
	console.log("Running at Port 1337");
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});