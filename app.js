var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'kkillyupkkillyupkkillyupson',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//페이지 연결
app.get('/', function(req, res) {res.render('main');});
app.get('/login', function(req, res) {res.render('login');});
app.get('/join', function(req, res) {res.render('join');});

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

// //회원가입 & 로그인
// var userData = mongoose.Schema({
//     userid : {type : String, unique : true, required : true},
//     userpw : {type : String, required : true},
//     usernick : {type : String, unique : true, required : true},
//     createdat : {type : Date, default : Date.now}
// });
// var user = mongoose.model('userdata',userData);
// //회원 폼 처리
// app.post('/joinForm', function(req, res) {
// 	var userId = req.body.userId;
// 	var userPw = req.body.userPw;
// 	var userNick = req.body.userNick;

// 	var User = new user({
// 		userid : userId,
// 		userpw : userPw,
// 		usernick : userNick
// 	});
// 	User.isNew = false;
//     User.save(function(err,qwd) {
//         if(err) {
//         	res.send('<script>alert("사용 중인 닉네임 또는 아이디 입니다.");location.href="/join";</script>');
//         	return console.error(err);
//         }
//         else res.send('<script>alert("가입 완료");location.href="/";</script>');
//     });
// });

//회원가입
var userData = mongoose.Schema({
    user_id : {type : String, unique : true, required : true},
    user_pw : {type : String, required : true},
    user_nick : {type : String, unique : true, required : true},
    created_at : {type : Date, default : Date.now}
});
var User = mongoose.model('userData',userData);
app.post('/joinForm', function(req, res) {
    var user = new User({
    	user_id : req.body.userId,
    	user_pw : req.body.userPw,
    	user_nick : req.body.userNick
   	});
    user.save(function(err,silence) {
        if(err) {
        	res.send('<script>alert("사용 중인 닉네임 또는 아이디 입니다.");location.href="/join";</script>');
        	return console.error(err);
        }
        else res.send('<script>alert("가입 완료");location.href="/";</script>');
    });
});

//로그인 폼 처리
passport.use(new LocalStrategy(
	function(username, password, done) {
		var user = new User({
	    	user_id : username,
	    	user_pw : password
	   	});
		user.findOne({user_id : username}, function (err, user) {
			if(err) { return done(err); }
			if(!user) {
				return done(null, false, { message: '아이디가 없습니다.' });
			}
			if(!user.validPassword(password)) {
				return done(null, false, { message: '비밀번호가 틀렸습니다.' });
			}
			return done(null, user);
		});
	}
));
app.post('/loginForm', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false 
}));
