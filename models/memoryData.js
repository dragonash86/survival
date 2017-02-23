/**
* Created By Yangs on 2016-12-26
*/
module.exports = function (sequelize, DataTypes) {
    var board = sequelize.define('memoryData',{
        key : {
            type : DataTypes.STRING(20),
            primaryKey : true,
        } ,
        value : {
            type : DataTypes.STRING(50),
            allowNull : false
        } ,
        reg_timestamp : {
            type : DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
            allowNull : false
        }
    },{
        timestamps: false,
        tableName: 'memory_data',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    return board;
}
//CURRENT_TIMESTAMP