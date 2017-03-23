var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var NaverStrategy = require('passport-naver').Strategy;
var flash = require('connect-flash');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : false}));
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
	res.redirect('/main');
});
app.get('/main', function(req, res) {
	if (req.user) {
		User.find({_id : req.user._id}, {_id : 0, last_logout : 0, user_id : 0, user_pw : 0, __v : 0 }, function(err, userValue) {
			res.render('main', {user:userValue[0]});
		});
	} else {
		res.redirect('/login');
	}
});
app.get('/adventure', function(req, res) {
	if (req.user) {
		User.find({_id : req.user._id}, {_id : 0, last_logout : 0, user_id : 0, user_pw : 0, __v : 0 }, function(err, userValue) {
			//로그있으면 게임화면에서 보여주고 읽은 로그로 데이터 이동
			var log = userValue[0].log;
			if (log.length !== 0) {
				User.update({_id : req.user._id}, {$set : {log : []}}, function(err) {
					User.update({_id : req.user._id}, {$push : {read_log : log}}, function(err) {
						if (err) throw err;
					});
				});
			}
			User.find({user_nick : userValue[0].match}, {_id : 0, hp : 1}, function(err, matchValue) {
				User.find({user_nick : userValue[0].attackAfter}, {_id : 0, user_nick:1, hp : 1}, function(err, attackAfterValue) {
					res.render('adventure', {user:req.user, userStat:userValue[0], matchStat:matchValue[0], attackAfter:attackAfterValue[0]});
				});
			});
		});
	} else {
		res.render('login');
	}
});
//로그아웃
app.get('/logout', function(req, res) {
	//마지막 로그아웃 시간 기록
	var dateUTC = new Date();
	var dateKTC = dateUTC.setHours(dateUTC.getHours() + 9);
	User.update({_id : req.user._id}, {$set : {last_logout : dateKTC}}, function(err) {
		if (err) throw err;
	});
	req.logout();
	req.session.save(function() {
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
    user_id : {type : String, unique : true},
    user_pw : {type : String},
    user_nick : {type : String, unique : true},
    map : {type : String},
    place : {type : String},
    lv : {type : Number},
    max_hp : {type : Number},
    hp : {type : Number},
    max_pw : {type : Number},
    pw : {type : Number},
    max_exp : {type : Number},
    exp : {type : Number},
    gold : {type : Number},
    pearl : {type : Number},
    item : [],
    state_1 : {type : String},
    state_2 : {type : String},
    state_3 : {type : String},
    state_4 : {type : String},
    state_5 : {type : String},
    log : [String],
    log_buy : [String],
    read_log : [String],
    match : {type : String},
    attackAfter : {type : String},
    attack : {type : Number},
    add_damage : {type : Number},
    kill : {type : Number},
    email : {type : String},
    sns : {type : String},
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
    item : [],
    death : [String]
});
var Map = mongoose.model('mapData', mapData);

app.get('/join', function(req, res) {
	res.render('join');
});
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
    	pw : 25,
    	max_exp : 10,
    	exp : 0,
    	attack : 1,
    	kill : 0,
    	add_damage : 0,
    	gold : 0,
    	pearl : 0,
    	match : "",
    	attackAfter : "",
    	item : [],
    	state_1 : "",
    	state_2 : "",
    	state_3 : "",
    	state_4 : "",
    	state_5 : "",
    	log : [],
    	log_buy : [],
    	read_log : [],
    	email : "",
    	sns : ""
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
	User.findOne({user_id : username}, function (err, user) {
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

//네이버 로그인
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { 
		return next(); 
	}
	res.redirect('/login');
}
app.get('/account', ensureAuthenticated, function(req, res) {
	res.render('account', {user : req.user});
});
passport.use(new NaverStrategy({
        clientID: "_SX5sVw5qJDBFgMAsJ8p",
        clientSecret: "JUbcQKTuCB",
        callbackURL: "/login/naver"
	}, function(accessToken, refreshToken, profile, done) {
	    User.findOne({email : profile._json.email}, function(err, user) {
	        if (!user) {
	        	var user = new User({
	        		user_nick : "",
			    	map : "한번도 참가 안 함",
			    	place : "",
			    	lv : 1,
			    	max_hp : 100,
			    	hp : 100,
			    	max_pw : 25,
			    	pw : 25,
			    	max_exp : 10,
			    	exp : 0,
			    	attack : 1,
			    	kill : 0,
			    	add_damage : 0,
			    	gold : 0,
			    	pearl : 0,
			    	match : "",
			    	attackAfter : "",
			    	item : [],
			    	state_1 : "",
			    	state_2 : "",
			    	state_3 : "",
			    	state_4 : "",
			    	state_5 : "",
			    	log : [],
			    	log_buy : [],
			    	read_log : [],
			    	email : profile.emails[0].value,
			    	sns : "naver"
			   	});
	            user.save(function(err) {
	                if (err) console.log(err);
	                return done(err, user);
	            });
	        } else {
	            return done(err, user);
	        }
	    });

    }
));
app.get('/login/naver', passport.authenticate('naver'), function(req, res) {
	if (req.user.user_nick !== "") {
		res.render('main', {user : req.user});
	} else {
		res.render('join_nick', {user : req.user});
	}
});
app.get('/join_nick', function(req, res) {
	res.render('join_nick', {user : req.user});
});
app.post('/joinNickForm', function(req, res) {
	User.update({_id : req.user._id}, {$set : {user_nick : req.body.userNick}}, function(err) {
		res.render('main', {user : req.user});
	});
});
app.get('/login/naver/callback', passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/login'
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
app.get('/moveForm', function(req, res) {
	if (req.user) {
		res.render('main');
	} else {
		res.render('login');
	}
});
app.get('/itemForm', function(req, res) {
	if (req.user) {
		res.render('/');
	} else {
		res.render('login');
	}
});
var startMap = "시작 지점";
//게임 참가
app.post('/joinGameForm', function(req, res) {
	if (req.user) {
	   	var startPlace = "안전 지대";
		User.update({_id : req.user._id}, {$set : {map : startMap, place : startPlace}}, function(err) {
			Map.update({place : startPlace}, {$addToSet : {user : req.session.passport.user.user_nick}}, function(err) {
				res.redirect('/adventure');
			});
		});
	} else {
		res.render('login');
	}
});
//이동
app.post('/moveForm', function(req, res) {
	if (req.user) {
		var currentPlace = req.body.moveValue;
		if (req.session.passport.user.pw > 0) {
			//파워 감소, 유저의 장소, 조우상대를 없앰
			User.update({_id : req.user._id}, {$inc : {pw : - 1}, $set : {place : currentPlace, match : null}}, function(err) {});
			//이동 시 유저의 원래 위치 없앰
			Map.update({user : req.session.passport.user.user_nick}, {$pull : {user : req.session.passport.user.user_nick}}, function(err) {
				if (err) throw err;
			});
			//맵에 유저의 새로운 위치를 등록
			Map.update({place : currentPlace}, {$push : {user : req.session.passport.user.user_nick}}, function(err) {
				if (err) throw err;
			});
			var action = Math.floor(Math.random() * 2) + 1;
			if (action === 1) {
				//랜덤한 아이템 획득
				Map.find({place : currentPlace}, {_id : 0, item : 1}, function(err, itemValue) {
					if (itemValue[0].item.length > 0) {
						var randNum = Math.floor(Math.random() * itemValue[0].item.length);
						var randomItem = itemValue[0].item[randNum];
						var randomItemName = randomItem.name;
						var randomItemCount = randomItem.count;
						var query = {$unset : {}};
						query.$unset["item." + randNum] = 1;
						Map.update({place : currentPlace}, query, function(err) {
							Map.update({place : currentPlace}, {$pull : {item : null}}, function(err) {
								var log = randomItemName + " " + randomItemCount + "개 획득";
								var count = 0;
								User.find({_id : req.user._id}, {_id : 0, item : 1}, function(err, hasItemValue) {
									for (var i = 0; i < hasItemValue[0].item.length; i++) {
										if (hasItemValue[0].item[i].name === randomItemName) {
											count = count + 1;
										}
									}
									if (count > 0) {
										User.update({_id : req.user._id, item : {$elemMatch: {name : randomItemName}}}, {$inc: {"item.$.count" : randomItemCount}, $push : {log : log}}, function(err, result) {
										});	
									} else {
										User.update({_id : req.user._id}, {$push : {item : randomItem, log : log}}, function(err) {
										});	
									}
									res.redirect('/adventure');
									return;
								});
							});
						});
					} else {
						User.update({_id : req.user._id}, {$push : {log : "이 장소엔 더 이상 쓸만한 게 없는 것 같다."}}, function(err) {
							res.redirect('/adventure');
							return;
						});
					}
					
				});
			} else if (action === 2) {
				//조우
				Map.find({place : currentPlace}, {_id : 0, user : 1 }, function(err, userValue) {
					var randNum = Math.floor(Math.random() * userValue[0].user.length);
					var match = userValue[0].user[randNum];
					if (match === req.session.passport.user.user_nick) {
						User.update({_id : req.user._id}, {$push : {log : "다른 사람들은 어디있는 걸까..?"}}, function(err) {
						});
					} else {
						User.update({_id : req.user._id}, {$set : {match : match}}, function(err) {
						});
					}
					res.redirect('/adventure');
					return;
				});
			}
		} else {
			res.send('<script>alert("파워가 부족합니다.");location.href="/adventure";</script>');
		}
	} else {
		res.render('login');
	}
});
app.post('/attackForm', function(req, res) {
	if (req.user) {
		User.find({_id : req.user._id}, {_id : 0, created_at : 0, last_logout : 0, user_id : 0, user_pw : 0, __v : 0}, function(err, userValue) {
			var attack = userValue[0].attack + userValue[0].add_damage;
			var expUp = 5;
			var match = userValue[0].match;
			var log = match + "에게 데미지 : " + attack + "! 경험치 : " + expUp + " 상승";
			User.update({user_nick : match}, {$inc : {hp : - attack}, $push : {log : req.session.passport.user.user_nick + "에게 데미지 : " + attack}}, function(err) {
				User.update({_id : req.user._id}, {$inc : {exp : expUp}, $set : {match : null, attackAfter : match}, $push : {log : log}}, function(err) {
					var upMaxHp = 10;
					var upAttack = 2;
					var upMaxPw = 5;
					var bonusHp = 10;
					var bonusPw = 10;
					var lvUpMsg = "레벨업 했습니다! 최대 생명력이 " + upMaxHp + ", 공격력이 " + upAttack + " 최대 파워가 " + upMaxPw + " 증가 했습니다. 보너스 생명력 " + bonusHp + ", 보너스 파워 " + bonusPw;
					//레벨업
					if (userValue[0].exp >= userValue[0].max_exp) {
						User.update({_id : req.user._id}, {$inc : {hp : bonusHp, max_hp : upMaxHp, max_exp : 10, attack : upAttack, lv : 1, pw : bonusPw, max_pw : upMaxPw}, $set : {exp : 0}, $push : {log : lvUpMsg}}, function(err) {
						});
					}
					//킬 카운트 & 사망 처리
					User.find({user_nick : match}, {_id : 0, hp : 1, place : 1}, function(err, matchValue) {
						if (matchValue[0].hp <= 0) {
							Map.update({place : matchValue[0].place}, {$push : {death : match}}, function(err) {
								User.update({_id : req.user._id}, {$inc : {kill : 1}, $set : {attackAfter : null}}, function(err) {
									//유저 사망시 아이템 임시로 랜덤으로 뿌려줌
									Map.find({map : startMap}, {_id : 0, place : 1}, function(err, result) {
										var randNum = Math.floor(Math.random() * result.length);
										Map.update({place : result[randNum].place}, {$pushAll : {item : [
											{name : "아메리카노", effect : "생명력", value : 10, count : 1},
											{name : "박카스", effect : "파워", value : 10, count : 1}
										]}}, function(err) {
											res.redirect('/adventure');
											return;
										});
									});
								});
							});
						} else {
							res.redirect('/adventure');
							return;
						}
					});
				});
			});
		});
	} else {
		res.render('login');
	}
});
app.post('/itemForm', function(req, res) {
	if (req.user) {
		User.find({_id : req.user._id}, {_id : 0, item : 1, hp : 1, max_hp : 1, pw : 1, max_pw : 1}, function(err, hasItemValue) {
			var count = 0;
			for (var i = 0; i < hasItemValue[0].item.length; i++) {
				if (hasItemValue[0].item[i].name === req.body.itemValue) {
					count = count + 1;
				}
			}
			if (count > 0) {
				User.findOne({_id : req.user._id}, {_id : 0, item : 1, state_1 : 1, item : {$elemMatch : {name : req.body.itemValue}}}, function(err, findItem) {
					var value = findItem.item[0].value;
					var name = findItem.item[0].name;
					var effect = findItem.item[0].effect;
					var state_1 = findItem.state_1;
					var userHp = hasItemValue[0].hp;
					var userMaxHp = hasItemValue[0].max_hp;
					var userPw = hasItemValue[0].pw;
					var userMaxPw = hasItemValue[0].max_pw;
					var effectQuery, log, query;
					if (effect === "생명력" || effect === "파워") {
						//최대값 초과로 회복 못하게 하기
						if (effect === "생명력") {
							if (userHp + value > userMaxHp) {
								value = userMaxHp - userHp;
							}
							effectQuery = "hp";
						} else if (effect === "파워") {
							if (userPw + value > userMaxPw) {
								value = userMaxPw - userPw;
							}
							effectQuery = "pw";
						}
						log = name + " 사용. " + effect + " " + value + " 회복";
						query = {$inc : {}, $push : {"log" : log}};
						query.$inc[effectQuery] = value;
						User.update({_id : req.user._id}, query, function(err) {
							User.update({_id : req.user._id, item : {$elemMatch: {name : name}}}, {$inc: {"item.$.count" : -1}}, function(err) {
								if (findItem.item[0].count === 1) {
									User.update({_id : req.user._id}, {$pull : {item : {name : name}}}, function(err) {
										res.redirect('/adventure');
										return;
									});
								} else {
									res.redirect('/adventure');
									return;
								}
							});
						});
					} else if (effect === "무기") {
						if (state_1 === "") {
							User.update({_id : req.user._id, item : {$elemMatch: {name : name}}}, {$set : {"item.$.state" : "착용 중"}}, function(err) {
								log = name + " 장착.";
								query = {$inc : {add_damage : value}, $set : {state_1 : name}, $push : {"log" : log}};
								User.update({_id : req.user._id}, query, function(err) {
									res.redirect('/adventure');
									return;
								});
							});
						} else {
							User.update({_id : req.user._id, item : {$elemMatch: {name : state_1}}}, {$set : {"item.$.state" : ""}}, function(err) {
								User.findOne({_id : req.user._id}, {_id : 0, item : 1, item : {$elemMatch : {name : state_1}}}, function(err, findItemPrev) {
									User.update({_id : req.user._id}, {$inc : {add_damage : -findItemPrev.item[0].value}}, function(err) {
										User.update({_id : req.user._id, item : {$elemMatch: {name : name}}}, {$set : {"item.$.state" : "착용 중"}}, function(err) {
											log = name + " 장착.";
											query = {$inc : {add_damage : value}, $set : {state_1 : name}, $push : {"log" : log}};
											User.update({_id : req.user._id}, query, function(err) {
												res.redirect('/adventure');
												return;
											});
										});
									});
								});
							});
						}
					} else {
						log = "사용할 수 없는 아이템입니다.";
						query = {$push : {"log" : log}};
						User.update({_id : req.user._id}, query, function(err) {
							res.redirect('/adventure');
							return;
						});
					}
				});
			} else {
				res.send('<script>alert("존재하지 않는 아이템 입니다.");location.href="/adventure";</script>');
				return;
			}
		});
	} else {
		res.render('login');
	}
});
app.post('/itemClearForm', function(req, res) {
	if (req.user) {
		User.find({_id : req.user._id}, {_id : 0, item : 1}, function(err, hasItemValue) {
			var count = 0;
			for (var i = 0; i < hasItemValue[0].item.length; i++) {
				if (hasItemValue[0].item[i].name === req.body.itemClearValue) {
					count = count + 1;
				}
			}
			if (count > 0) {
				User.findOne({_id : req.user._id}, {_id : 0, item : 1, item : {$elemMatch : {name : req.body.itemClearValue}}}, function(err, findItem) {
					var effect = findItem.item[0].effect;
					var name = findItem.item[0].name;
					var value = findItem.item[0].value;
					if (effect === "무기") {
						User.update({_id : req.user._id, item : {$elemMatch: {name : name}}}, {$set : {"item.$.state" : ""}}, function(err) {
							log = name + " 장착 해제";
							query = {$inc : {add_damage : -value}, $set : {"state_1" : ""}, $push : {"log" : log}};
							User.update({_id : req.user._id}, query, function(err) {
								res.redirect('/adventure');
								return;
							});
						});
					}
				});
			} else {
				res.send('<script>alert("존재하지 않는 아이템 입니다.");location.href="/adventure";</script>');
				return;
			}
		});
	} else {
		res.render('login');
	}
});
app.get('/buy', function(req, res) {
	if (req.user) {
		var buy = req.query.buy;
		var log;
		if (buy === "buy_1") {
			if (req.user.pearl >= 10) {
				log = Date()+" 10진주로 10,000골드 구매";
				User.update({_id : req.user._id}, {$inc : {gold : 10000, pearl : -10}, $push : {log_buy : log}}, function(err) {
					res.redirect('/main');
					return;
				});
			} else {
				res.send('<script>alert("진주가 부족합니다.");location.href="/main";</script>');
			}
		} else if (buy === "buy_2") {
			if (req.user.pearl >= 50) {
				log = Date()+" 50진주로 55,000골드 구매";
				User.update({_id : req.user._id}, {$inc : {gold : 55000, pearl : -50}, $push : {log_buy : log}}, function(err) {
					res.redirect('/main');
					return;
				});
			} else {
				res.send('<script>alert("진주가 부족합니다.");location.href="/main";</script>');
			}
		} else if (buy === "buy_3") {
			if (req.user.pearl >= 100) {
				log = Date()+" 100진주로 120,000골드 구매";
				User.update({_id : req.user._id}, {$inc : {gold : 120000, pearl : -100}, $push : {log_buy : log}}, function(err) {
					res.redirect('/main');
					return;
				});
			} else {
				res.send('<script>alert("진주가 부족합니다.");location.href="/main";</script>');
			}
		} else {
			res.send('<script>alert("잘못된 요청입니다.");location.href="/main";</script>');
		}
	} else {
		res.render('login');
	}
});