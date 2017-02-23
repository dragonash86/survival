/**
 * Created by YangsAnalysis on 2016-12-18.
 */
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
//CURRENT_TIMESTAMP