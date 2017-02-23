/**
 * Created by Yangs on 2016. 11. 26
 */
module.exports = function(sequelize, DataTypes) {
    var db_update = sequelize.define('dbUpdate', {
        content : {
            type : DataTypes.TEXT('long') ,
            allowNull : false ,
        },
        type : {
            type : DataTypes.ENUM('BIT','TERA') ,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'db_update',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM',
        comment : "알약 DB 업데이트 정보를 캐슁하는 테이블입니다."
    });
    return db_update;
};
