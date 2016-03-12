var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/message_board');

mongoose.connection.on('error', function(err){});

var Schema = mongoose.Schema
var MessageSchema = new mongoose.Schema({
  name: String,
  message: String,
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

var CommentSchema = new mongoose.Schema({
  _message: {type: Schema.ObjectId, ref: "Message"},
  name: String,
  comment: String
})

MessageSchema.path('name').required(true, 'Name cannot be blank')
MessageSchema.path('message').required(true, 'Message cannot be blank')

mongoose.model('Message', MessageSchema)
var Message = mongoose.model('Message')

mongoose.model('Comment', CommentSchema)
var Comment = mongoose.model('Comment')


CommentSchema.path('name').required(true, "Name cannot be blank");
CommentSchema.path('comment').required(true, "Comment cannot be blank");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var route = require('./routes/index.js')(app, Message,Comment);

var server = app.listen(8000, function(){
  console.log('listening on port 8000')
})
