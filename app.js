var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//페이지 연결
app.get('/', function(req, res) {
    res.render('main');
});
app.get('/join', function(req, res) {
    res.render('join');
});


app.post('/join', function(req, res) {
    res.json(req.body);
});


//DB 커넥트
mongoose.connect("mongodb://yong:171225@ds145389.mlab.com:45389/survival");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});



// //회원 DB
// var userData = mongoose.Schema({
// 	userId:String,
// 	userPw:String,
// 	userNick:String
// });

// var userData = mongoose.model("userData", userData);
// var userDataIns = new userData({userId: "qwe",userPw: "123",userNick: "asd"});
// userDataIns.save(function(err, userDataIns){
	
// });


app.listen(3000);
console.log("Server running on port 3000");