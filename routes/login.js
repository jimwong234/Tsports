var express = require('express');
var router = express.Router();

var Database = require('../modules/db');
var cb = require('../modules/GenericCB');

//Website User Login
router.post('/WebSiteUserLogin', function(req, res){
	console.log(req.body);
	//Server-Side Form Validation (Check if valid user login[email and password])
	var sql = 'SELECT * FROM users where (email = $1 and password = $2);';
	Database.query(sql,[req.body.email, req.body.password], UserLogin, res, req );
	
});

//Check if email already exists
function UserLogin(err, result,res, req){
    //The object to contain the ResponseText
    var TheObject = {};
    var JSON2Send = [];
        
    if (err){
        console.error(err);
        res.send("Error " + err);
    }
    //Valid user login
    else if(result.rowCount == 1 ){
        console.log('Valid Login');
        
        //Send it to AJAX
        TheObject['ResponseText'] = 'ok';
        JSON2Send.push(TheObject); //The "ResponseText" is always the first object in JSON2Send
        
        //Attach a cookie to the HTTP header to be stored in the browser
        res.cookie( 'UserID' , result.rows[0].id);
        res.cookie( 'UserEmail' , req.body.email);
        res.cookie( 'UserPass' , req.body.password);

        //Send JSON File to AJAX
        res.end( JSON.stringify(JSON2Send) );
    }
    //Invalid Login info
    else{
        console.log('InValid Login');

        TheObject['ResponseText'] = 'invalidlogin';
        JSON2Send.push(TheObject);
        //Send it to AJAX
        res.end( JSON.stringify(JSON2Send) );
    }
    
}

module.exports = router;