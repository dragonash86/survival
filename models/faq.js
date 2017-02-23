/**
 * Created by Yangs on 2016. 11. 11..
 */
module.exports = function(sequelize, DataTypes) {
    var faq = sequelize.define('faq', {
        id : {
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_type : {
            type : DataTypes.ENUM('COMPANY','INDIVIDUAL'),
            allowNull: false
        },
        category : {
            type : DataTypes.STRING(30) ,
            allowNull : false
        },
        product_type : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        title : {
            type : DataTypes.TEXT ,
            allowNull: false
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        is_top : {
            type :  DataTypes.INTEGER(1),
            allowNull : false
        },
        reg_timestamp : {
            type : DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
        }
    }, {
        timestamps: false,
        tableName: 'faq',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM',
        comment : "FAQ 정보를 저장하는 테이블입니다. BOARD와 비슷한 특성이긴하나, 여러가지 요구사항으로 인한 기능들 해결을 위해 테이블을 분리하였습니다."
    });
    return faq;
};
