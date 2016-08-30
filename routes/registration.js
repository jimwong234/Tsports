var express = require('express');
var router = express.Router();

var Database = require('../modules/db');
var cb = require('../modules/GenericCB');


router.post('/UserRegistration', function(req, res){
	//Server-Side Form Validation (Check if e-mail already exists)
	var sql = 'SELECT * FROM users where email = $1;';
	Database.query(sql, [req.body.email], NewUserCB, res, req );
});

//Check if email already exists
function NewUserCB(err, result,res, req){
    if (err){
    	console.error(err);
        res.send("Error " + err);
    }
    //Row (Email) already exists
    //Send an error message to AJAX
    else if(result.rowCount == 1){
        //Send it to AJAX
        res.send( "emailexists" );
    }
    //Email doesn't exist
    //Insert user info in database
    else{
        //New User
        //insert in the DB
        //hash the password before storing it
        var hashedPass = bcrypt.hashSync(req.body.password);
        var sql = 'INSERT INTO users (first_name, last_name, birthday, gender, height, weight, email, phone, campus, password, about, createdAt, ProfileImage,hashedpassword) ' + "VALUES($1, $2, $3::date, $4, $5, $6, $7, $8, $9, $10, $11, now(), './assets/images/DefaultProfilePic.jpg',$12);";
        Database.query(sql, [req.body.firstname, req.body.lastname,req.body.birthday, req.body.gender, req.body.height, req.body.weight, req.body.email, req.body.phone, req.body.campus, req.body.password, req.body.about,hashedPass ], GetUserIDCB, res, req );
    }   
}


//Get the user's ID to enter it in the Interests table for sports preferences
function GetUserIDCB(err, result,res, req){
    if (err){
        console.error(err);
        res.send("Error " + err);     
    }else{
        var sql = 'SELECT id FROM users where email = $1;';
        Database.query(sql, [req.body.email], InsertUserSportPrefCB, res, req );
    }   
}


function InsertUserSportPrefCB(err, result,res, req){
    if (err){
        console.error(err);
        res.send("Error " + err);
    }
    else{ 
        //Get each sport submitted by form
        var SportsInterested=[];
        if(req.body.hasOwnProperty('cycling')){
            SportsInterested.push(1); //The code for cycling
        }
        if(req.body.hasOwnProperty('waterpolo')){
            SportsInterested.push(2); //The code for waterpolo
        }
        if(req.body.hasOwnProperty('squash')){
            SportsInterested.push(3); //The code for squash
        }
        if(req.body.hasOwnProperty('boxing')){
            SportsInterested.push(4); //The code for boxing
        }
        if(req.body.hasOwnProperty('taekwondo')){
            SportsInterested.push(5); //The code for taekwondo
        }
        if(req.body.hasOwnProperty('basketball')){
            SportsInterested.push(6); //The code for basketball
        }
        if(req.body.hasOwnProperty('tabletennis')){
            SportsInterested.push(7); //The code for tabletennis
        }
        if(req.body.hasOwnProperty('tennis')){
            SportsInterested.push(8); //The code for tennis
        }
        if(req.body.hasOwnProperty('volleyball')){
            SportsInterested.push(9); //The code for volleyball
        }
        if(req.body.hasOwnProperty('football')){
            SportsInterested.push(10); //The code for football
        }
        if(req.body.hasOwnProperty('swimming')){
            SportsInterested.push(11); //The code for swimming
        }

        //Insert all the preferred sports
        for(var i=0; i<SportsInterested.length; i++){   
            var sql = 'INSERT INTO Interests (userid, sportid) ' + "VALUES($1, $2);";
            Database.query(sql, [result.rows[0].id, SportsInterested[i]], cb.GenericCB, res, req );
        }
        
        //Insert data into the UnreadNotifications table for that userid
        //Initially numfriendreqs, nummessages, numnotifications are all zero
        var sql = 'INSERT INTO UnreadNotifications (userid, numfriendreqs, nummessages, numnotifications) ' + "VALUES($1, 0, 0, 0);";
        Database.query(sql, [result.rows[0].id], GenericCB, res, req );

        //Send it to AJAX
        res.send( "ok" );
    }
    
}

module.exports = router;