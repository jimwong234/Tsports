//import required modules for unit testing.
var expect = require("chai").expect;
var request = require("supertest");
var app = require("../server.js");

//define global constant of server URL.
var host = "http://localhost:3000";

describe("<TSports features tester>", function() {
	
	//keep cookies from logined user
	var cookies = [];
  
	//login with existing user (name: tester two; id=183)
	before(function(done){
		
		var login_info = {"email":"tester2@tsports.com", "password":"123123"};
		
		request(host)
			.post("/WebSiteUserLogin")
			.send(login_info)
			.expect(200)
			.end(function(err,res){
				if (err) {
					done(err);
				}
				//console.log(res);
				expect(JSON.parse(res.text)[0].ResponseText).to.equal("ok");
				
				//store cookies
				var cookie_pass = res.headers['set-cookie'].pop().split(';')[0];
				var cookie_email = res.headers['set-cookie'].pop().split(';')[0];
				var cookie_id = res.headers['set-cookie'].pop().split(';')[0];
				
				cookies.push(cookie_pass + "; " + cookie_id + "; FriendIDClicked=184");
				
				console.log(cookies);

				done();
			});
	});
  
	//test registration feature.
	describe("1)Registration feature", function() {
	  

		  
		var register_info = {"firstname":"register","lastname":"test",
								"birthday":"1999-12-31","gender":"male",
								"campus":"missisauga","height":"190",
								"weight":"80","email":"tester@tsports.com",
								"phone":"4162220000","password":"123123",
								"cfpassword":"123123","about":"registration test",
								"squash":"3"};

		it("request /UserRegistration: message -> 'ok'", function(done) {
			
			//send registration request for testing
			request(host)
				.post("/UserRegistration")
				.send(register_info)
				.expect(200) //expect status code: 200.
				.end(function(err,res){
					if (err) {
						done(err);
					}
					//console.log(res);
					// "ok" is returned on success
					expect(res.text).to.equal("ok");
					done();
				});
		
		});
		
		it("registration with email of existing user: message -> 'emailexists'", function(done){
			
			request(host)
				.post("/UserRegistration")
				.send(register_info)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					//console.log(res);
					//if "emailexists" is returned to res.body, 
					//then server successfully blocked second registration with same email.
					expect(res.text).to.equal("emailexists");
					done();
				});

		});
		
		//delete "register test" user from the database to test registration feature.
		it("Delete existing sample user from the database", function(done) {
			
			request(host)
				.get("/deleteUser")
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					//console.log(res);
					expect(res.text).to.equal("DELETED");
					done();
				});
		});
		
		
	});

	//login feature
	describe("2)Login feature", function() {
		
		//logout previously logined user before testing login feature.
		before(function(done){
			request(host)
				.get("/SignOut")
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					expect(res.text).to.equal("Signed Out");
					done();
				});
		});
	  
		//login with existing user
		it("Login with the normal existing user: message-> 'ok'", function(done){
			
			var login_info = {"email":"tester2@tsports.com", "password":"123123"};
			
			request(host)
				.post("/WebSiteUserLogin")
				.send(login_info)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					//console.log(res);
					expect(JSON.parse(res.text)[0].ResponseText).to.equal("ok");
					done();
				});
		});
		
		
		
		//login with non-existing user -> invalidlogin
		it("Login with non-existing user: message -> 'invalidlogin'", function(done){
			var wrong_login = {"email":"wrong@wrong.com", "password":"454545"};
			
			request(host)
				.post("/WebSiteUserLogin")
				.send(wrong_login)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					//console.log(res);
					expect(JSON.parse(res.text)[0].ResponseText).to.equal("invalidlogin");
					done();
				});
		});
		
		//Test sign out.
		it("Logout: /SignOut", function(done){
			request(host)
				.get("/SignOut")
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					expect(res.text).to.equal("Signed Out");
					done();
				});
		});
		
		
	});
  
  
	//Features related to getting/changing the user's information
	describe("3)Get/change the user information", function() {
		
		it("Get the user's basic info when login: /GetLoginUserInfo", function(done){	
			var req = request(host).get("/GetLoginUserInfo");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					expect(JSON.parse(res.text)[0].ProfileImage).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].username).to.equal("tester two");
					expect(JSON.parse(res.text)[0].numfriendreqs).to.equal(0);
					expect(JSON.parse(res.text)[0].nummessages).to.equal(0);
					expect(JSON.parse(res.text)[0].numnotifications).to.equal(0);
					
					setTimeout(done,100);
				});
		});
		
		//tester two is a friend of tester three (has only one friend)
		//Test if GetUserFriends get proper list of friend.
		//Note: "/GetDisplayedProfileUserFriends" also works in the same way.
		it("Get the user's friends list: /GetUserFriends", function(done){	
			var req = request(host).get("/GetUserFriends");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					
					expect(JSON.parse(res.text)[0].url).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].name).to.equal("tester three");
					expect(JSON.parse(res.text)[0].friendid).to.equal(184);
					
					setTimeout(done,100);
				});
		});
		
		//Using sample eventid=18, test if request gets all the users who are attending eventid=18.
		it("Get all the users who are attending event: /GetEventUsers", function(done){	
			var req = request(host).post("/GetEventUsers");
			
			req.set('Accept', 'application/json')
				.send({"eventID":18})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}				
					expect(JSON.parse(res.text)[0].url).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].name).to.equal("tester two");
					expect(JSON.parse(res.text)[0].friendid).to.equal(183);
					expect(JSON.parse(res.text)[0].EventRatingSubmitted).to.equal("no");
					
					expect(JSON.parse(res.text)[1].url).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[1].name).to.equal("tester three");
					expect(JSON.parse(res.text)[1].friendid).to.equal(184);
					expect(JSON.parse(res.text)[1].EventRatingSubmitted).to.equal("no");
					
					setTimeout(done,100);
				});
		});
		
		//Test if correct profile info of friend is responded by the server.
		it("Get friend's profile: /GetDisplayedProfileInfo", function(done){	
			var req = request(host).get("/GetDisplayedProfileInfo");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}	
					expect(JSON.parse(res.text)[0].ProfileImage).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].username).to.equal("tester three");
					
					setTimeout(done,100);
				});
		});
		
		//Test if about info is correctly responded by the server.
		it("Get friend's profile about info: /GetUserAboutInfo", function(done){	
			var req = request(host).get("/GetUserAboutInfo");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}				
					expect(JSON.parse(res.text)[0].Campus).to.equal("missisauga");
					expect(JSON.parse(res.text)[0].First_Name).to.equal("tester");
					expect(JSON.parse(res.text)[0].Last_Name).to.equal("three");
					expect(JSON.parse(res.text)[0].Phone_number).to.equal("4165552222");
					expect(JSON.parse(res.text)[0].Email_Address).to.equal("tester3@tsports.com");
					expect(JSON.parse(res.text)[0].Birthday).to.equal("2016-06-30");
					expect(JSON.parse(res.text)[0].Height).to.equal(165);
					expect(JSON.parse(res.text)[0].Weight).to.equal('50');
					expect(JSON.parse(res.text)[0].Gender).to.equal("female");
					expect(JSON.parse(res.text)[0].About_Me).to.equal("TESTER THREE. DO NOT DELETE ME.");
					
					var sports = ["cycling","boxing","basketball"];
					for (var i = 0; i < sports.length; i++) {
						expect(JSON.parse(res.text)[0].SportsInterested[i]).to.equal(sports[i]);
					}
					
					setTimeout(done,100);
				});
		});
		
		//Test if change password feature works well.
		it("Change the user's password: /ChangePassword", function(done){	
			var req = request(host).post("/ChangePassword");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.send({"currentPass":"123123", "newPass":"989898", "confirmNewPass":"989898"})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}				
					//status 0 means success.
					expect(JSON.parse(res.text).status).to.equal(0);
					
					setTimeout(done,100);
				});
		});
		
		//set password back to previous one.
		after(function(done){
			var req = request(host).post("/ChangePassword");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.send({"currentPass":"989898", "newPass":"123123", "confirmNewPass":"123123"})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}				
					//status 0 means success.
					expect(JSON.parse(res.text).status).to.equal(0);
					
					setTimeout(done,100);
				});
			
		});
		
		
	});
  
  
	describe("4)Event related feature", function() {
		
		//Tester Two creates new event.
		it("Create Event: /CreateNewEvent", function(done){
			var event_info = {"EventName":"TEST_CREATE", "EventType":"football", "EventNumppl":"11", 
							"EventDateTime": "Jul 28 2016 03:30 PM", "EventEndTime":"05:30 PM", "EventLocation":"TESTER_FIELD", 
							"EventDescription":"TEST_CREATE_EVENT"};
							
			var req = request(host).post("/CreateNewEvent");
			
			req.set('cookie', cookies)
				.send(event_info)
				.expect(302)
				.end(function(err,res){
					if (err) {
						done(err);
					}							
					expect(res.text).to.equal("Found. Redirecting to /Profile_SelfView.html?EventSuccess=yes");
					

					setTimeout(done,100);
				});
			
		});
	});
	
	//search features
	describe("5)Search related features", function(){
		
		//test search user feature. Type "tester" on the search bar and expect what we will get.
		//There should be only two users with first name of "tester", so only one is expected.
		it("Search User: /SearchUsers", function(done) {
			var req = request(host).post("/SearchUsers");
			
			req.set('cookie', cookies)
				.send({"SearchUserString":"tester"})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}							
					expect(JSON.parse(res.text)[0].url).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].name).to.equal("tester three");
					expect(JSON.parse(res.text)[0].userid).to.equal(184);

					setTimeout(done,100);
				});
		});
		
		//Test search event feature. /SearchyEventsByTyping uses same function (work in similar way).
		it("Search Events by click: /SearchEventsByClick", function(done) {
			var req = request(host).post("/SearchEventsByClick");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.send({EventSportClicked:"tennis"})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}							
					expect(JSON.parse(res.text)[0].EventName).to.equal("Event_Test2");
					expect(JSON.parse(res.text)[0].EventID).to.equal(41);
					expect(JSON.parse(res.text)[0].EventType).to.equal("tennis");
					expect(JSON.parse(res.text)[0].EventDateTime).to.equal("01 Sep 2017 04:46 PM");
					expect(JSON.parse(res.text)[0].EventNumPpl).to.equal(8);

					setTimeout(done,100);
				});
		});
	});
  
	//Test live messaging features.
	describe("6)Live messaging features", function(){
		
		//get log of group messages within eventID=18 (sample event for test)
		it("Get log of group messages within eventID=18: /GetEventMessages", function(done){
			var req = request(host).post("/GetEventMessages");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.send({eventID:18})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}												
					expect(JSON.parse(res.text)[0].sentById).to.equal(183);
					expect(JSON.parse(res.text)[0].ProfileImage).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[0].chatmessage).to.equal("GROUP CHAT TEST");
					
					expect(JSON.parse(res.text)[1].sentById).to.equal(184);
					expect(JSON.parse(res.text)[1].ProfileImage).to.equal("./assets/images/DefaultProfilePic.jpg");
					expect(JSON.parse(res.text)[1].chatmessage).to.equal("GROUP CHAT TEST2");

					setTimeout(done,100);
				});
		});
		
		//get log of 1-to-1 messages with user=184 (current user=183)
		it("Get log of 1-to-1 messages with user=184: /GetMessageHistoryWithUser", function(done){
			var req = request(host).post("/GetMessageHistoryWithUser");
			
			req.set('Accept', 'application/json')
				.set('cookie', cookies)
				.send({Chattingtoid:184})
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}						
					expect(JSON.parse(res.text)[0].sentById).to.equal(184);
					expect(JSON.parse(res.text)[0].chatmessage).to.equal("TEST: HELLO");
					
					expect(JSON.parse(res.text)[1].sentById).to.equal(183);
					expect(JSON.parse(res.text)[1].chatmessage).to.equal("TEST: HELLO BACK");

					setTimeout(done,100);
				});
		});
		
	});
	
	describe("7)Security: SQL injection", function(){
		
		//logout previously logined user before testing login feature.
		before(function(done){
			request(host)
				.get("/SignOut")
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					expect(res.text).to.equal("Signed Out");
					done();
				});
		});
		
		it("SQL injection attempt: injection should fail", function(done){
			//try on sql injection.
			var login_info = {"email":"no@no.com and password = '123333'); DELETE FROM Users WHERE id=64; -- ", 
							"password":"123123"};
		
			request(host)
				.post("/WebSiteUserLogin")
				.send(login_info)
				.expect(200)
				.end(function(err,res){
					if (err) {
						done(err);
					}
					expect(JSON.parse(res.text)[0].ResponseText).to.equal("invalidlogin");
					done();
				});
		});
		
	});
  
  
  
  


});