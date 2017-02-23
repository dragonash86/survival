module.exports = function (sequelize, DataTypes) {
    var blogCrawler = sequelize.define('blogCrawler',{
        url : {
            type : DataTypes.STRING(50),
            primaryKey : true,
            allowNull : false
        } ,
        title  : {
            type : DataTypes.TEXT('TINY'),
            allowNull : false
        },
        content : {
            type :DataTypes.TEXT('TINY'),
            allowNull : false
        },
        reg_timestamp : {
            type : DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
            allowNull : false
        }
        /*
        id : {
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey : true,
            autoIncrement : true
        } ,

        */
    },{
        timestamps: false,
        tableName: 'blog_crawler',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM',
        comment : "알약 블로그 크롤링 데이터가 저장되는 테이블입니다.",
        indexs : [
            {
                unique: true,
                fields: ['reg_timestamp']
            }
        ]
    });
    return blogCrawler;
}