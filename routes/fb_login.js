var express = require('express');
var router = express.Router();

var Database = require('../modules/db');
var cb = require('../modules/GenericCB');

var passport = require('passport');

router.get('/auth/facebook',passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',passport.authenticate('facebook'),function(req,res){
    //Check if user already has an account with this email
    var sql = 'SELECT * FROM Users where (email = $1);';
    Database.query(sql, [req.user[0].email], FBLoginCB, res, req );
});

//Check if user already has an account with the email retrieved from FB, Don't use the FB ID
//If not, make an account
function FBLoginCB(err, result,res, req){
    if (err){
        console.error(err);
        //error go to home page
        res.redirect('/');
    } 
    //Row (Account) exists
    //Redirect to their profile
    else if( result.rowCount == 1 ){
        //Logging in
        //Attach a cookie to the HTTP header to be stored in the browser
        res.cookie( 'UserID' , result.rows[0].id);
        res.cookie( 'UserEmail' , result.rows[0].email);
        res.cookie( 'UserPass' , result.rows[0].password);
        res.redirect('/Profile_SelfView.html');
    }
    //User didn't login with FB before
    //Insert user info (+ email) in db
    else{
        //insert in the DB and return the SERIAL EventID (This is concurrent safe)
        var sql = 'INSERT INTO users (first_name, last_name, gender, email, password, fbid, createdAt, ProfileImage) ' + "VALUES($1, $2, $3, $4, $5, $6, now(), './assets/images/DefaultProfilePic.jpg') RETURNING id;";
        //The password and fbid are the same
        Database.query(sql, [req.user[0].firstname, req.user[0].lastname, req.user[0].gender, req.user[0].email, req.user[0].fbid ,req.user[0].fbid], GoToHomePageCB, res, req );    
    }   
}

function GoToHomePageCB(err, result,res, req){
    if (err){
        console.error(err);
        res.send("Error " + err);
    }else{
	    //Insert data into the UnreadNotifications table for the new user
	    //Initially numfriendreqs, nummessages, numnotifications are all zero
	    var sql = 'INSERT INTO UnreadNotifications (userid, numfriendreqs, nummessages, numnotifications) ' + "VALUES($1, 0, 0, 0);";
	    Database.query(sql, [result.rows[0].id], cb.GenericCB, res, req );

	    //Logging in
	    //Attach a cookie to the HTTP header to be stored in the browser
	    res.cookie( 'UserID' , result.rows[0].id);
	    res.cookie( 'UserEmail' , req.user[0].email);
	    res.cookie( 'UserPass' , req.user[0].fbid);
	    
	    //Redirect to their new profile
	    res.redirect('/Profile_SelfView.html');
    }   
}

module.exports = router;