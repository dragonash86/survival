/**
 * Created by Yangs on 2016-12-05.
 */
var Q = require('q');
var request = require('request');
var PSS_REQUEST_URI = "http://localhost:801/sendReport";

function trim(str){
    return str.replace(/^\s*|\s*$/g, '');
}

module.exports = {
    send : function ( title , content , email , userTel , comapnyName , isCompany) {
        var deferred = Q.defer();
        var parameter = {
            'UserEmail' : email,
            'UserTitle' : title,
            'UserContent' : content,
            'ProductType' : 'ASP',
            'ProductName' : isCompany == true ? 'ALYAC_CO_MAIL' : 'ALYAC_FREE_MAIL' ,
            'ACC_TYPE' : '4',
            'COM_NAME' : comapnyName != null ? comapnyName : '',
            'UserTel' : userTel
        };
        console.log(parameter);
        var httpConfig = {
            method : 'POST',
            uri : PSS_REQUEST_URI,
            formData : parameter,
            rejectUnauthorized: false,
            header : {
                'Content-Type' : 'multipart/form-data; boundary=---------------------------9d13a23b368',
            }
        };
        request.post(httpConfig , function (err,httpResponse,body) {
            if(err){
                deferred.reject(err);
            }else{
                if (trim(body) == 'TRUE'){
                    // console.log()
                    deferred.resolve(body);
                }else {
                    deferred.reject({result : false});
                }
            }
        });
        return deferred.promise;
    }
}

