var mongoose = require('mongoose');

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

module.exports = mongoose.model('userData', userData);


// var userDataIns = new userData({userId: "1111",userPw: "111",userNick: "asd"});
// userDataIns.save(function(err, userDataIns){
  
// });




// app.post('/join', function(req, res) {
//     res.json(req.body);
// });


// app.post('/MemberInsert', function(req,res) {
//   var inputId = req.body.inputId; 
//   var inputPw = req.body.inputPw;
//   var inputNick = req.body.inputNick;
//   db.member.insert({"inputId":inputId,"inputPw":inputPw,"inputNick":inputNick},function(err,data) {
//     res.json();
//   });
// });




module.exports = function (sequelize, DataTypes) {
    var board = sequelize.define('board',{
        id : {
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey : true,
            autoIncrement : true
        } ,
        board : {
            type : DataTypes.STRING(50),
            allowNull : false
        } ,
        title  : {
            type : DataTypes.STRING(255),
            allowNull : false
        },
        content : {
            type :DataTypes.TEXT('long'),
            allowNull : false
        },
        category : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        upload_user : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        thumbnail_img : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        thumbnail_text : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        reg_timestamp : {
            type : DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
            allowNull : false
        }
    },{
        timestamps: false,
        tableName: 'board',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM',
        comment : "홈페이지에서 필요한 각종 게시판 정보들이 들어갑니다."
    });
    return board;
}



//데이터 배열 17 02 27
//회원가입 정보 받기
var users = [];
app.post('/joinForm', function(req, res) {
    var user = {
        userId:req.body.userId,
        userPw:req.body.userPw,
        userNick:req.body.userNick
    };
    users.push(user);
    //res.send(users);
    console.log(user[0]);

    //회원 DB
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

    var userData = mongoose.model("userData", userData);
    var userDataIns = new userData({userId: "qwe",userPw: "123",userNick: "asd"});
    userDataIns.save(function(err, userDataIns){
        
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