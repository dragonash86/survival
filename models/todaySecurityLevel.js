/**
 * Created by Yangs on 2016. 11. 11..
 */
module.exports = function(sequelize, DataTypes) {
    var todaySecurityLevel = sequelize.define('todaySecurityLevel', {
        id : {
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: 'DATE',
            allowNull: false
        },
        level : {
            type : DataTypes.ENUM('NORMAL','CAUTION' , 'WARNING' , 'DANGER') ,
            allowNull: false
        },
        upload_user : {
            type : DataTypes.STRING(50),
            allowNull: false
        },
        comment : {
            type : DataTypes.STRING(50),
            allowNull: false
        },
        reg_timestamp : {
            type : DataTypes.DATE,
            allowNull : false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()')
        }
    }, {
        timestamps: false,
        tableName: 'today_security_level',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM',
        comment : "시큐리티 홈페이지 상단에 표기되는 정보입니다."
    });
    return todaySecurityLevel;
};
