
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
    mysql      = require('mysql');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Application initialization
var connection = mysql.createConnection({
  host     : '192.168.2.202',
  port     : '10536',
  user     : 'azx89dmdejr8gcfu',
  password : 'aadvmwqf8mifftakodiuec2b90a3awta',
  database : "demo_db"
});

// Database setup
connection.query('CREATE DATABASE IF NOT EXISTS demo_db', function (err) {
  if (err) throw err;
  connection.query('USE demo_db', function (err) {
    if (err) throw err;
    connection.query('CREATE TABLE IF NOT EXISTS user(' +
      'id INT NOT NULL AUTO_INCREMENT,' +  
      'name VARCHAR( 128 ) NOT NULL,' +
      'email VARCHAR( 128 ) NOT NULL,' +
      'des VARCHAR( 128 ) NOT NULL, PRIMARY KEY (  id )' +
    ')');
  });
});

// connection.connect();
app.get('/users', function (req, res) {
connection.query('select * from user', function(err, docs) {
    res.render('users', {users: docs, title: 'App42PaaS Express MySql Application'});
  });
});

// Add a new User
app.get("/users/new", function (req, res) {
  res.render("new", {
    title: 'App42PaaS Express MySql Application'
  });
});

// Save the Newly created User
app.post("/users", function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var des=req.body.des;
  connection.query('INSERT INTO user (name,email,des) VALUES (?,?,?);' , [name,email,des], function(err, docs) {
  if (err) res.json(err);
    res.redirect('users');
  });
});

// Create Node server 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// App root
app.get('/', function(req, res){
  res.redirect('/users', {
    title: 'App42PaaS Express MySql Application'
  });
});
