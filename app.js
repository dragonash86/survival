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

//회원가입
var userData = mongoose.Schema({
    user_id : {type : String, unique : true, required : true},
    user_pw : {type : String, required : true},
    user_nick : {type : String, unique : true, required : true},
    created_at : {type : Date, default : Date.now}
});
userData.methods.validPassword = function(password) {
    return this.user_pw == password;
};
var User = mongoose.model('userData',userData);
app.post('/joinForm', function(req, res) {
    var user = new User({
    	user_id : req.body.userId,
    	user_pw : req.body.userPw,
    	user_nick : req.body.userNick
   	});
    user.save(function(err,silence) {
        if (err) {
        	res.send('<script>alert("사용 중인 닉네임 또는 아이디 입니다.");location.href="/join";</script>');
        	return console.error(err);
        }
        else res.send('<script>alert("가입 완료");location.href="/";</script>');
    });
});
passport.serializeUser(function (user, done) {
	console.log('serialize');
    done(null, user);
});
passport.deserializeUser(function (user, done) {
	console.log('deserialize');
	done(null, user);
});
passport.use(new LocalStrategy(function (username, password, done) {
	var Users = mongoose.model('userData',userData);
	Users.findOne({ user_id : username }, function (err, user) {
		if (err) { 
			return done(err); 
		}
		if (!user) {
			return done(null, false, { message: '아이디가 없습니다.' });
		}
		if (!user.validPassword(password)) {
			return done(null, false, { message: '비밀번호가 틀렸습니다.' });
		}
		return done(null, user);
   	});
}));
app.post('/loginForm', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false 
}));

// var userSchema = new mongoose.Schema({
// 	user_id: String,
// 	user_pw: String
// });
// userSchema.methods.comparePassword = function comparePassword(password, cb) {
// 	if (password === this.user_pw) {
// 		cb(null, true);
// 	} else {
// 		cb('error');
// 	}
// };
// var Users = mongoose.model('userSchema',userSchema);
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function (user, done) {
// 	done(null, user);
// });
// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		Users.findOne({'user_id' : username}, function (err, user) {
// 			console.log(err,'여기까지 err');
// 			console.log(user,'여기까지 user');
// 			if (err) { return done(err); }
// 			if (!user) {
// 				return done(null, false, { message: '아이디가 없습니다.' });
// 			}
// 			if (!user.validPassword(password)) {
// 				return done(null, false, { message: '비밀번호가 틀렸습니다.' });
// 			}
// 			return done(null, user);
// 		});
// 	}
// ));
// app.post('/loginForm', passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/login',
// 	failureFlash: false 
// }));
