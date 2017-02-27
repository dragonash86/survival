var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//페이지 연결

//메인
app.get('/', function(req, res) {
    res.render('main');
});
//회원가입
app.get('/join', function(req, res) {
    res.render('join');
});

//회원가입 정보 받기
app.post('/joinForm', function(req, res) {
	var userId = req.body.userId;
	var userPw = req.body.userPw;
	var userNick = req.body.userNick;

	var userData = mongoose.Schema({
	    userId : {
	        type : String,
	        unique : true,
	        required : true
	    },
	    userPw : {
	        type : String,
	        required : true
	    },
	    userNick : {
	        type : String,
	        unique : true,
	        required : true
	    }
	});

	var User = mongoose.model('userData',userData);
	var user = new User({'userId':userId,'userPw':userPw,'userNick':userNick});
	user.save(function(err,silence) {
		 if(err){
         	console.log(err);
            res.status(500).send('Update error');
            return;
         }
         res.status(200).send("Inserted");
	});
});

//DB 커넥트
mongoose.connect("mongodb://yong.netb.co.kr:443/survival");
//mongoose.connect("mongodb://yong:171225@ds145389.mlab.com:45389/survival");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

//서버 시작
app.listen(3000);
console.log("Server running on port 3000");