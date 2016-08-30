var express = require('express');
var router = express.Router();

var Database = require('../modules/db');

router.post('/WebsiteAdminLogin',function(req,res){
	var sql = 'SELECT * FROM admins WHERE account = $1 and password = $2';
	Database.query(sql,[req.body.account,req.body.password],AdminLoginCB,res,req);
});

function AdminLoginCB(err,result,res,req){
    if(err){
        console.log(err);
        res.send(err);
    }
    else if(result.rowCount == 1){
        //find the admin account&password from the db
        //add a cookie to http header to store admin's name
        res.cookie( 'AdminName' , result.rows[0].name);
        res.send("ok");
        
    }else{
        //not found
        res.send("loginfailed");
    }
}

router.get('/getAllUsersInfo',function(req,res){
        var sql = 'SELECT * FROM users';
        Database.query(sql,[],GetAllUsersCB,res,req);
        });

function GetAllUsersCB(err,result,res,req){
    var JSON2Send = [];
    //console.log(result);
    if(err){
        console.log(err);
        res.send(err);
    }
    else if(result.rowCount == 0){
        //no users in the table
        res.end(JSON.stringify(JSON2Send));
    }else{
        //at least one user in the table
        var len = result.rowCount;
        for(var i = 0;i < len;i++){
            var Object = {};
            Object.first_name = result.rows[i].first_name;
            Object.last_name = result.rows[i].last_name;
            if(result.rows[i].birthday != null){
                //convert date to year/month/day format
                var date = '';
                var month = result.rows[i].birthday.getUTCMonth() + 1;
                var day = result.rows[i].birthday.getUTCDate();
                var year = result.rows[i].birthday.getUTCFullYear();
                date = year + "/" + month + "/" + day;
                Object.birthday = date;
            }else{
                Object.birthday = null;
            }
            
            Object.gender = result.rows[i].gender;
            Object.height = result.rows[i].height;
            Object.weight = result.rows[i].weight;
            Object.email = result.rows[i].email;
            Object.phone = result.rows[i].phone;
            Object.campus = result.rows[i].campus;
            Object.password = result.rows[i].password;
            Object.profileimage = result.rows[i].profileimage;
            JSON2Send.push(Object);
        }
        res.end(JSON.stringify(JSON2Send));
    }
}

router.post('/deleteUserInfo',function(req,res){
         var sql = "DELETE FROM users WHERE email = $1 and password = $2;";
         Database.query(sql,[req.body.email,req.body.password],deleteUserCB,res,req);
         });

function deleteUserCB(err,result,res,req){
    if(err){
        console.log(err);
        res.send(err);
    }else{
        res.send('ok');
    }
}


router.post('/updateUserPassword',function(req,res){
         var sql = "UPDATE users SET password = $1,hashedpassword = $2 WHERE email = $3 AND password = $4;";
         var hashedpassword = bcrypt.hashSync(req.body.newPassword);
         Database.query(sql,[req.body.newPassword,hashedpassword,req.body.email,req.body.oldPassword],updateUserPasswordCB,res,req);
         });

function updateUserPasswordCB(err,result,res,req){
    if(err){
        console.log(err);
        res.send(err);
    }else{
        res.send('ok');
    }
}

router.get('/getAllEventsInfo',function(req,res){
        //natural join users and event tables
        var sql = "SELECT first_name||' '||last_name AS ownername,eventid,name,location,numppl,attendance,datetime,endtime,eventtype FROM users u JOIN event e ON u.id = e.eventadminid;";
        Database.query(sql,[],GetAllEventsCB,res,req);
        });

function GetAllEventsCB(err,result,res,req){
    var JSON2Send = [];
    //console.log(result);
    if(err){
        console.log(err);
        res.send(err);
    }
    else if(result.rowCount == 0){
        //no users in the table
        res.end(JSON.stringify(JSON2Send));
    }else{
        //at least one user in the table
        var len = result.rowCount;
        for(var i = 0;i < len;i++){
            var Object = {};
            Object.ownername = result.rows[i].ownername;
            Object.name = result.rows[i].name;
            Object.location = result.rows[i].location;
            Object.numppl = result.rows[i].numppl;
            Object.attendance = result.rows[i].attendance;
            
            //convert date to year/month/day format
            var date = '';
            var month = result.rows[i].datetime.getUTCMonth() + 1;
            var day = result.rows[i].datetime.getUTCDate();
            var year = result.rows[i].datetime.getUTCFullYear();
            var hour = result.rows[i].datetime.getHours();
            var minute = result.rows[i].datetime.getMinutes();
            date = year + "-" + month + "-" + day + '  ' +formatAMPM(result.rows[i].datetime);
            Object.datetime = date;
            
            Object.endtime = result.rows[i].endtime;
            Object.eventtype = result.rows[i].eventtype;
            //store eventid for delete api
            Object.eventid = result.rows[i].eventid;
            //console.log(Object.eventid);
            JSON2Send.push(Object);
        }
        //console.log(JSON2Send);
        res.end(JSON.stringify(JSON2Send));
    }
}

function formatAMPM(date)
{
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

router.post('/deleteEventInfo',function(req,res){
         var sql = 'DELETE FROM event WHERE eventid = $1;';
         Database.query(sql,[req.body.eventid],DeleteEventCB,res,req);
         });

function DeleteEventCB(err,result,res,req){
    if(err){
        console.log(err);
        res.send(err);
    }else{
        res.send('ok');
    }
}

router.get('/getStatusInfo',function(req,res){
        var sql = 'SELECT * FROM users;';
        Database.query(sql,[],getStatusInfoCB,res,req);
        });


var JSON2Send = {};

function getStatusInfoCB(err,result,res,req){
    if(err){
        JSON2Send.stats = err;
    }else{
        JSON2Send.totalUsers = result.rowCount;
        var sql = 'SELECT * FROM event;';
        Database.query(sql,[],getEventCB,res,req);
    }
}

function getEventCB(err,result,res,req){
    if(err){
        JSON2Send.stats = err;
    }else{
        JSON2Send.stats = 'ok';
        JSON2Send.totalEvents = result.rowCount;
        if(result.rowCount > 0){
            //arr for storing # of sports
            var count = [0,0,0,0,0,0,0,0,0,0,0,0,0];
            for(var i = 0;i < result.rowCount;i++){
                count[parseInt(result.rows[i].eventtypeid)]++;
            }
            var largest = Math.max.apply(Math, count);
            //sportids for storing the max sportid
            var sportids = [];
            for(var i = 0;i < count.length;i++){
                if(count[i] == largest){
                    sportids.push(i);
                }
            }
            JSON2Send.popularSport = " ";
            var arrSports = ['cycling','waterpolo','squash','boxing','taekwondo',
                             'basketball','tabletennis','tennis','volleyball','football','swimming'];
            for(var i = 0;i < sportids.length;i++){
                if(i < sportids.length - 1){
                    JSON2Send.popularSport += arrSports[sportids[i]-1] + "<br>";
                }
                else{
                    JSON2Send.popularSport += arrSports[sportids[i]-1];
                }
            }
            
        }else{
            JSON2Send.popularSport = '';
        }
        res.end(JSON.stringify(JSON2Send));
    }
}

router.get('/AdminSignOut', function(req,res){
  //clear all the cookies
  res.clearCookie('AdminName');
  //AJAX will go to the homepage
  res.send("Signed Out");
});

module.exports = router;
