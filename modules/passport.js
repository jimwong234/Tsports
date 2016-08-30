var FackbookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport){
    passport.serializeUser(function(UserFBInfo, done){
        //FB to call our callback function with the retrieved info
        done(null, UserFBInfo);
    });
    passport.deserializeUser(function(UserFBInfo, done){
        done(null, UserFBInfo);
    });

    passport.use(new FackbookStrategy({
        clientID: '158282974577582',
        clientSecret: '07e16a0a1f9f0aa6f526659c6d9f9bb3',
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'emails', 'gender', 'name']
    },
    //facebook will send back the token and profile and then call our CB function done
    function(token,refreshToken,profile,done){
        //asynchronous function
        //waits for data to come back from FB
        process.nextTick(function(){
             //Return a JSON file containing the data from FB
            var JSON2Return = [];

            var object={};
            Object['fbid'] = profile.id;
            Object['firstname'] = profile.name.givenName;
            Object['lastname'] = profile.name.familyName;
            Object['gender'] = profile.gender;
            Object['email'] = profile.emails[0].value; //Emails is an array, take the first value
         
            JSON2Return.push(Object);
            //return the JSON containing the FB
            return done(null,JSON2Return);
         }
      );
    }));
}












