var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
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
    max_exp : {type : Number},
    exp : {type : Number},
    item : [],
    log : [String],
    read_log : {type : String},
    match : {type : String},
    attackAfter : {type : String},
    attack : {type : Number},
    kill : {type : Number},
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
    	match : "",
    	attackAfter : "",
    	item : [],
    	log : [],
    	read_log : ""
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
app.get('/game', function(req, res) {
	if (req.user) {
		User.find({_id : req.session.passport.user._id}, {_id : 0, last_logout : 0, user_id : 0, user_pw : 0, __v : 0 }, function(err, userValue) {
			//로그있으면 게임화면에서 보여주고 읽은 로그로 데이터 이동
			var log = userValue[0].log;
			if (log.length !== 0) {
				User.update({_id : req.session.passport.user._id}, {$set : {log : []}}, function(err) {
					User.update({_id : req.session.passport.user._id}, {$push : {read_log : log}}, function(err) {
						if (err) throw err;
					});
				});
			}
			User.find({user_nick : userValue[0].match}, {_id : 0, hp : 1}, function(err, matchValue) {
				User.find({user_nick : userValue[0].attackAfter}, {_id : 0, user_nick:1, hp : 1}, function(err, attackAfterValue) {
					res.render('game', {user:req.user, userStat:userValue[0], matchStat:matchValue[0], attackAfter:attackAfterValue[0]});
				});	
			});
		});
	} else {
		res.render('login');
	}
});
var startMap = "시작 지점";
//게임 참가
app.post('/joinGameForm', function(req, res) {
	if (req.user) {
	   	var startPlace = "안전 지대";
		User.update({_id : req.session.passport.user._id}, {$set : {map : startMap, place : startPlace}}, function(err) {
			Map.update({place : startPlace}, {$addToSet : {user : req.session.passport.user.user_nick}}, function(err) {
				res.redirect('/game');
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
			User.update({_id : req.session.passport.user._id}, {$inc : {pw : - 1}, $set : {place : currentPlace, match : null}}, function(err) {});
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
						query.$unset["item."+randNum] = 1;
						Map.update({place : currentPlace}, query, function(err) {
							Map.update({place : currentPlace}, {$pull : {item : null}}, function(err) {
								var log = randomItemName+" "+randomItemCount+"개 획득";
								var count = 0;
								User.find({_id : req.session.passport.user._id}, {_id : 0, item : 1}, function(err, hasItemValue) {
									for (var i = 0; i < hasItemValue[0].item.length; i++) {
										if (hasItemValue[0].item[i].name === randomItemName) {
											count = count + 1;
										}
									}
									if (count > 0) {
										User.update({_id : req.session.passport.user._id, item : {$elemMatch: {name : randomItemName}}}, {$inc: {"item.$.count" : randomItemCount}}, function(err, result) {
										});	
									} else {
										User.update({_id : req.session.passport.user._id}, {$push : {item : randomItem, log : log}}, function(err) {
										});	
									}
									User.update({_id : req.session.passport.user._id}, {$push : {log : log}}, function(err) {
										res.redirect('/game');
										return;
									});
								});
							});
						});
					} else {
						User.update({_id : req.session.passport.user._id}, {$push : {log : "이 장소엔 더 이상 쓸만한 게 없는 것 같다."}}, function(err) {
							res.redirect('/game');
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

					} else {
						User.update({_id : req.session.passport.user._id}, {$set : {match : match}}, function(err) {
						});
					}
					res.redirect('/game');
					return;
				});
			}
		} else {
			res.send('<script>alert("파워가 부족합니다.");location.href="/game";</script>');
		}
	} else {
		res.render('login');
	}
});
app.post('/attackForm', function(req, res) {
	if (req.user) {
		User.find({_id : req.session.passport.user._id}, {_id : 0, created_at : 0, last_logout : 0, user_id : 0, user_pw : 0, __v : 0}, function(err, userValue) {
			var attack = userValue[0].attack;
			var expUp = 5;
			var match = userValue[0].match;
			var log = match+"에게 데미지 : "+attack+"! 경험치 : "+expUp+" 상승";
			User.update({user_nick : match}, {$inc : {hp : - attack}, $push : {log : req.session.passport.user.user_nick+"에게 데미지 : "+attack}}, function(err) {
				User.update({_id : req.session.passport.user._id}, {$inc : {exp : expUp}, $set : {match : null, attackAfter : match}, $push : {log : log}}, function(err) {
					var upMaxHp = 10;
					var upAttack = 2;
					var upMaxPw = 5;
					var bonusHp = 10;
					var bonusPw = 10;
					var lvUpMsg = "레벨업 했습니다! 최대 생명력이 "+upMaxHp+", 공격력이 "+upAttack+" 최대 파워가 "+upMaxPw+" 증가 했습니다. 보너스 생명력 "+bonusHp+", 보너스 파워 "+bonusPw;
					//레벨업
					if (userValue[0].exp >= userValue[0].max_exp) {
						User.update({_id : req.session.passport.user._id}, {$inc : {hp : bonusHp, max_hp : upMaxHp, max_exp : 10, attack : upAttack, lv : 1, pw : bonusPw, max_pw : upMaxPw}, $set : {exp : 0}, $push : {log : lvUpMsg}}, function(err) {
						});
					}
					//킬 카운트 & 사망 처리
					User.find({user_nick : match}, {_id : 0, hp : 1, place : 1}, function(err, matchValue) {
						if (matchValue[0].hp <= 0) {
							Map.update({place : matchValue[0].place}, {$push : {death : match}}, function(err) {
								User.update({_id : req.session.passport.user._id}, {$inc : {kill : 1}, $set : {attackAfter : null}}, function(err) {
									//유저 사망시 아이템 임시로 랜덤으로 뿌려줌
									Map.find({map : startMap}, {_id : 0, place : 1}, function(err, result) {
										var randNum = Math.floor(Math.random() * result.length);
										Map.update({place : result[randNum].place}, {$push : {item : {name : "아메리카노", effect : "생명력", value : 10, count : 1}}}, function(err) {
											res.redirect('/game');
											return;
										});
									});
								});
							});
						} else {
							res.redirect('/game');
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
		User.find({_id : req.session.passport.user._id}, {_id : 0, item : 1, hp : 1, max_hp : 1}, function(err, hasItemValue) {
			var count = 0;
			for (var i = 0; i < hasItemValue[0].item.length; i++) {
				if (hasItemValue[0].item[i].name === req.body.itemValue) {
					count = count + 1;
				}
			}
			if (count > 0) {
				User.findOne({_id : req.session.passport.user._id}, {_id : 0, item : 1, item : {$elemMatch : {name : req.body.itemValue}}}, function(err, findItem) {
					if (findItem.item[0].effect === "생명력") {
						var value = findItem.item[0].value;
						//최대체력 초과로 회복 못하게 하기
						if (hasItemValue[0].hp + value > hasItemValue[0].max_hp) {
							value = hasItemValue[0].max_hp - hasItemValue[0].hp;
						}
						var log = "체력이 "+value+" 회복됐다.";
						//아이템 다 쓰면 제거
						User.update({_id : req.session.passport.user._id}, {$inc : {hp : value}, $push : {log : log}}, function(err) {
							User.update({_id : req.session.passport.user._id, item : {$elemMatch: {name : findItem.item[0].name}}}, {$inc: {"item.$.count" : -1 }}, function(err, result) {
								if (findItem.item[0].count === 1) {
									User.update({_id : req.session.passport.user._id}, {$pull : {item : {name : findItem.item[0].name}}}, function(err) {
										res.redirect('/game');
										return;
									});
								} else {
									res.redirect('/game');
									return;
								}
							});
						});
					}
				});
			} else {
				res.send('<script>alert("존재하지 않는 아이템 입니다.");location.href="/game";</script>');
				return;
			}
		});
	} else {
		res.render('login');
	}
});
//DB셋팅용 임시소스
Map.update({place : "헤이븐"}, {$push : {item : {name : "아메리카노", effect : "생명력", value : 10, count : 1}}}, function(err) {});
//조회용 임시소스
// Map.find({map : "시작 지점"}, {_id : 0, place : 1}, function(err, result) {
// 	var randNum = Math.floor(Math.random() * result.length);
// 	console.log(result.length)
// 	console.log(randNum);
// 	console.log(result[randNum].place);
// });
// User.find({_id : "58be0a2156026f294c89be5a"}, {_id : 0, item : 1}, function(err, hasItemValue) {
// 	var count = 0;
// 	for (var i = 0; i < hasItemValue[0].item.length; i++) {
// 		if (hasItemValue[0].item[i].name === "과자") {
// 			count = count + 1;
// 		}
// 	}
// 	console.log(count);
// 	//console.log(hasItemValue[0].item.indexOf("과자"));
// });
// User.findOne({_id : "58be0a2156026f294c89be5a"}, {_id : 0, item : 1, item : {$elemMatch : {name : "과자"}}}, function(err, itemValue) {
// 	console.log(itemValue.item[0]);
// });
// User.findOne({_id : "58be0a2156026f294c89be5a"}, function(err, result) { 
// 	console.log(result.item);
// });
// User.update({_id : "58be0a2156026f294c89be5a", item : {$elemMatch: { name : "과자"}}}, {$inc: { "item.$.count" : -1 }}, function(err, result) {
// 	console.log(result);
// });

// User.find({_id : "58be0a2156026f294c89be5a"}, {_id : 0, item : 1}, function(err, itemValue) {
// 	console.log(itemValue[0].item[0].name);
// });
// User.find({'item.0.name' : "과자"}, {_id : 0, item : 1}, function(err, itemValue) {
// 	console.log(itemValue);
// });
// Map.find({place : '오금'}, {_id : 0, item : 1 }, function(err, itemValue) {
// 	var randNum = Math.floor(Math.random() * itemValue[0].item.length);
// 	//console.log("랜덤 넘버 : "+randNum);
// 	console.log(itemValue[0].item);
// 	console.log(itemValue[0].item.length);
// });
//코테이션 테스트 
//console.log('"<%= userStat.item['+'$(this).parent().index()'+'].name %>"');
//console.log("<%= userStat.item["+$(this).parent().index()+"].name %>");
//console.log('"<%= userStat.item[+"'$(this).parent().index()+'"+].name %>"');
// var randNum = 1
//console.log('"item.'+randNum+'"');// = 최종 "로 감싸짐
//'"<%= userStat.item['+$(this).parent().index()+'].name %>"'
//console.log('"<%= userStat.item['+$(this).parent().index()+'].name %>"');
// console.log('"<%= userStat.item['+randNum+'].name %>"');