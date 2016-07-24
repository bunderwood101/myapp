var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});

app.use('', express.static('html'));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('images'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});

app.get("/about", function(request, response) {
  response.end("Welcome to the about page!");
});

// app.get("*", function(request, response) {
//   response.end("404!");
// });


// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

// define interactions with client
io.sockets.on('connection', function(socket){
    console.log("connected");
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.chat);
          socket.broadcast.emit('chatlog', {'chat': data.chat});
    });


    socket.on('playerField', function(data){
        process.stdout.write("PlayerID: " + data.PlayerID + "   Initiative: " + data.Initiative);

          socket.broadcast.emit('InitiativeUpdate', data);
    });
});
