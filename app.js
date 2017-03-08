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

//로그아웃
app.get('/logout', function(req, res) {
	//마지막 로그아웃 시간 기록
	var dateUTC = new Date();
	var dateKTC = dateUTC.setHours(dateUTC.getHours() + 9);
	User.update({_id : req.session.passport.user._id}, {$set : {last_logout : dateKTC}}, function(err) {
		if (err) throw err;
	});
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
    map : {type : String},
    place : {type : String},
    lv : {type : Number},
    max_hp : {type : Number},
    hp : {type : Number},
    max_pw : {type : Number},
    pw : {type : Number},
    created_at : {type : Date, default : Date.now},
    last_logout : {type : Date}
});
//패스워드 비교 userData를 User에 담기 전에 이걸 써넣어야 로그인 사용가능
userData.methods.validPassword = function(password) {
    return this.user_pw == password;
};
var User = mongoose.model('userData', userData);
var mapData = mongoose.Schema({
    map : {type : String},
    place : {type : String},
    user : [String],
    item : [String],
    death : [String]
});
var Map = mongoose.model('mapData', mapData);
//회원가입
app.post('/joinForm', function(req, res) {
    var user = new User({
    	user_id : req.body.userId,
    	user_pw : req.body.userPw,
    	user_nick : req.body.userNick,
    	map : "한번도 참가 안 함",
    	place : "",
    	lv : 1,
    	max_hp : 100,
    	hp : 100,
    	max_pw : 25,
    	pw : 25
   	});
    user.save(function(err) {
        if (err) {
        	res.send('<script>alert("사용 중인 닉네임 또는 아이디 입니다.");location.href="/join";</script>');
        	return console.error(err);
        }
        else res.send('<script>alert("가입 완료");location.href="/";</script>');
    });
});
app.get('/join', function(req, res) {
	res.render('join');
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
app.get('/login', function(req, res) {
	if (req.user) {
		res.render('main');
	} else {
		res.render('login');
	}
});
//게임 참가
app.post('/joinGameForm', function(req, res) {
   	var startMap = "시작 지점";
   	var startPlace = "안전 지대";
	User.update({_id : req.session.passport.user._id}, {$set : {map : startMap, place : startPlace}}, function(err) {
		if (err) throw err;
	});
	Map.update({place : startPlace}, {$addToSet : {user : req.session.passport.user.user_nick}}, function(err) {
		if (err) throw err;
	});
	res.redirect('/game');
});
app.get('/game', function(req, res) {
	//var id = User.findOne({_id:req.session.passport.user._id})._conditions._id;
	res.render('game', {user:req.user});
});
//이동
Map.find({place : '오금'}, {_id: 0 , user : 1}, function(err, docs) {
	console.log(docs);
});

app.post('/moveForm', function(req, res) {
	var currentPlace = req.body.moveValue;
	if (req.session.passport.user.pw > 0) {
		User.update({_id : req.session.passport.user._id}, {$inc : {pw : - 1}, $set : {place : currentPlace}}, function(err) {
			if (err) throw err;
		});
		//이동 시 유저의 원래 위치를 없앰
		Map.update({user : req.session.passport.user.user_nick}, {$pull : {user : req.session.passport.user.user_nick}}, function(err) {
			if (err) throw err;
		});
		//유저의 새로운 위치를 등록
		Map.update({place : currentPlace}, {$addToSet : {user : req.session.passport.user.user_nick}}, function(err) {
			if (err) throw err;
		});
		//res.send(req.session.passport.user.pw);
		res.redirect('/game');
	} else {
		res.send('<script>alert("파워가 부족합니다.");location.href="/game";</script>');
	}
});