var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'kkillyupkkillyupkkillyupson',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//페이지 연결
app.get('/', function(req, res) {
	res.render('main', {user:req.user});
});
app.get('/login', function(req, res) {
	if (req.user) {
		res.render('main');
	} else {
		res.render('login');
	}
});
app.get('/join', function(req, res) {res.render('join');});

//로그아웃
app.get('/logout', function(req, res){
	req.logout();
	req.session.save(function(){
		res.redirect('/login');
	});
});

//DB 커넥트
mongoose.connect("mongodb://yong.netb.co.kr:443/survival");
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

//전역 스키마 생성
var userData = mongoose.Schema({
    user_id : {type : String, unique : true, required : true},
    user_pw : {type : String, required : true},
    user_nick : {type : String, unique : true, required : true},
    game_id : {type : String},
    game_place : {type : String},
    created_at : {type : Date, default : Date.now}
});
//패스워드 비교 userData를 User에 담기 전에 이걸 써넣어야 로그인 사용가능
userData.methods.validPassword = function(password) {
    return this.user_pw == password;
};
var User = mongoose.model('userData',userData);
//회원가입
app.post('/joinForm', function(req, res) {
    var user = new User({
    	user_id : req.body.userId,
    	user_pw : req.body.userPw,
    	user_nick : req.body.userNick,
    	game_id : "한번도 참가 안 함",
    	game_place : ""
   	});
    user.save(function(err) {
        if (err) {
        	res.send('<script>alert("사용 중인 닉네임 또는 아이디 입니다.");location.href="/join";</script>');
        	return console.error(err);
        }
        else res.send('<script>alert("가입 완료");location.href="/";</script>');
    });
});
//로그인
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});
passport.use(new LocalStrategy({passReqToCallback : true},function (req, username, password, done) {
	User.findOne({ user_id : username }, function (err, user) {
		if (err) {
			return done(err); 
		}
		if (!user) {
			return done(null, false, req.flash('message', '아이디가 없습니다.'));
		}
		if (!user.validPassword(password)) {
			return done(null, false, req.flash('message', '비밀번호가 틀렸습니다.'));
		}
		return done(null, user);
   	});
}));
app.post('/loginForm', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));
//게임 참가
app.post('/gameStart', function(req, res) {
   	var start = "시작 지점";
	User.update({_id : req.session.passport.user._id}, {$set : {game_id : start, game_place : '안전 지대'} }, function(err, tasks) {
		if (err) throw err;
		console.log("update");
	});
});