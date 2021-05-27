var url = "https://squad.fandom.com/api.php"
const request = require('request');

module.exports = {
    generatelogintoken: function(cookieJar, callback) {
    
        var token_params = {
            action: "query",
            meta : "tokens",
            type: "login",
            format: "json"
        };


        request.get({ url: url, jar: cookieJar, qs: token_params}, function(err, res, body){
            if(err){
                throw err;
            }
            var data = JSON.parse(body);
            callback(cookieJar, data.query.tokens.logintoken);
        })


    },
    generatecsrftoken: function(cookieJar, callback) {
    
        var token_params = {
            action: "query",
            meta : "tokens",
            format: "json"
        };


        request.get({ url: url, jar: cookieJar, qs: token_params}, function(err, res, body){
            if(err){
                throw err;
            }
            var data = JSON.parse(body);
            console.log("CSRF Token Generated Successfully")
            callback(cookieJar, data.query.tokens.csrftoken);
        })


    }
}
