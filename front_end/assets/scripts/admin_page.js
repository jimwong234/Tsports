$(document).ready(function(){
	$('#ResultShowBoard').hide();
	$('#AdminName').text("Hello Admin: "+$.cookie("AdminName")+"!");

	/**************** Users button ****************/
	$('#AllUsers').click(function(){
		//empty orginal list
		$('#ResultShowBoard').empty();
		//send get req to server for users info json
		$.ajax({
			type:'GET',
			url:'/getAllUsersInfo',
			dataType:'JSON',
			success:getAllUsersInfoCB
		});
	});	

	function getAllUsersInfoCB(res){
		var $ul = $('<ul>',{
			'id':'allUsersInfo' 
		});
		var len = res.length;
		for(var i = 0;i < len;i++){
			//retrieve each user and add to the ul
			var $li = $('<li>',{
				'class':'user_info'
			});
			var $name = $('<span>',{
				'class':'user_name'
			});
			$name.append(res[i].first_name + ' ' + res[i].last_name);
			var $birthday = $('<span>',{
				'class':'user_birthday'
			});
			$birthday.append('Birthday: '+res[i].birthday);
			var $email = $('<span>',{
				'class':'user_email'
			});
			$email.append(res[i].email);
			var $campus = $('<span>',{
				'class':'user_campus'
			});
			$campus.append('Campus: '+res[i].campus);
			var $gender = $('<span>',{
				'class':'user_gender'
			});
			$gender.append('Gender: '+res[i].gender);
			var $weight = $('<span>',{
				'class':'user_weight'
			});
			$weight.append('Weight: ' + res[i].weight);
			var $height = $('<span>',{
				'class':'user_height'
			});
			$height.append('Height: ' + res[i].height);
			var $phone = $('<span>',{
				'class':'user_phone'
			});
			$phone.append('Phone: '+res[i].phone);
			var $profileimg = $('<img>',{
				'class':'user_img',
				'src':res[i].profileimage
			});
			var $deleteimg = $('<img>',{
				'class':'user_delete',
				'src':'/assets/images/delete_users_icon.png'
			});
			//form for changing password
			var $changepsform = $('<form>',{
				'class':'changepsform'
			});
			var $pstext = $('<span>',{
				'class':'ps_text',
			});
			$pstext.append('Password:');
			var $password = $('<input>',{
				'class':'user_password',
				'type':'text',
				'name':'password',
				'disabled':"disabled"
			});
			$password.val('');
			var $pshid = $('<span>',{
				'class':'ps_hid',
			});
			$pshid.append(res[i].password);
			var $changebtn = $('<input>',{
				'class':'changebtn',
				'type':'image',
				'src':'./assets/images/changeps.png'
			});
			
			$changepsform.append($pstext);
			$changepsform.append($password);
			$changepsform.append($changebtn);
			
			$li.append($profileimg);
			$li.append($name);
			$li.append($birthday);
			$li.append($campus);
			$li.append($gender);
			$li.append($weight);
			$li.append($height);
			$li.append($changepsform);
			$li.append($phone);
			$li.append($email);
			$li.append($deleteimg);
			$li.append($pshid);
			$ul.append($li);
		}
		$('#ResultShowBoard').append($ul);
		$('#ResultShowBoard').show();
	}

	$(document).on('click','.user_delete',function(){
    	var email = $(this).siblings(".user_email").text();
    	var password = $(this).siblings(".ps_hid").text();
    	var Object = {
    		'email':email,
    		'password':password
    	};
    	$.ajax({
    		type:'POST',
    		url:'/deleteUserInfo',
    		dataType:'text',
    		data:Object,
    		success:function(res){
    			if(res == 'ok'){
    				//delete user successfully 
    				//refresh the page
    				$('#ResultShowBoard').empty();
    				$.ajax({
						type:'GET',
						url:'/getAllUsersInfo',
						dataType:'JSON',
						success:getAllUsersInfoCB
					});
    			}else{
    				//user not found
    				console.log('err');
    			}
    		}
    	});
	});

	var oldPassword;
	$(document).on('click','.changebtn',function(e){
		e.preventDefault();
		if($(this).siblings('.user_password').attr('disabled') == 'disabled'){
			$(this).siblings('.user_password').css("border-color","red");
			//save the old password
			oldPassword = $(this).parent().siblings('.ps_hid').text();
			//remove disabled attribute for admin to change the password
			$(this).siblings('.user_password').removeAttr("disabled");
			//console.log(oldPassword);
		}else{
			$(this).siblings('.user_password').css("border-color","grey");
			$(this).siblings('.user_password').attr("disabled","disabled");
			var newPassword = $(this).siblings('.user_password').val();
			var email = $(this).parent().siblings('.user_email').text();
			var Object = {
				'oldPassword':oldPassword,
				'newPassword':newPassword,
				'email':email
			};
			$.ajax({
				type:'POST',
				url:'/updateUserPassword',
				dataType:'text',
				data:Object,
				success:function(res){
					if(res == 'ok'){
						//update password successfully
						//refresh the page
	    				$('#ResultShowBoard').empty();
	    				$.ajax({
							type:'GET',
							url:'/getAllUsersInfo',
							dataType:'JSON',
							success:getAllUsersInfoCB
						});
					}else{
						//update failed
						console.log('err');
					}
				}
			});
		}		
	});
	/**************** Users button ****************/

	/**************** Events button ****************/
	$('#AllEvents').click(function(){
		//empty orginal list
		$('#ResultShowBoard').empty();
		//send get req to server for users info json
		$.ajax({
			type:'GET',
			url:'/getAllEventsInfo',
			dataType:'JSON',
			success:getAllEventsInfoCB
		});
	});

	function getAllEventsInfoCB(res){
		var $ul = $('<ul>',{
			'id':'allEventsInfo' 
		});
		var len = res.length;
		for(var i = 0;i < len;i++){
			//retrieve each user and add to the ul
			var $li = $('<li>',{
				'class':'event_info'
			});
			var $name = $('<span>',{
				'class':'event_name'
			});
			$name.append(res[i].name);
			var $ownername = $('<span>',{
				'class':'owner_name'
			});
			$ownername.append('Owned By: ' + res[i].ownername);
			var $attendance = $('<span>',{
				'class':'attendance'
			});
			$attendance.append(res[i].attendance + ' People Attending');
			var $numppl = $('<span>',{
				'class':'numppl'
			});
			$numppl.append((res[i].numppl - res[i].attendance) + ' Spots left!');
			var $location = $('<span>',{
				'class':'location'
			});
			$location.append('Location: ' + res[i].location);
			var $eventtype = $('<img>',{
				'class':'eventtype',
				'src':'/assets/images/' + res[i].eventtype + '.svg'
			});
			var $datetime = $('<span>',{
				'class':'datetime'
			});
			$datetime.append(res[i].datetime);
			var $hours = $('<span>',{
				'class':'hours'
			});
			$hours.append('End at: ' + res[i].endtime);
			var $EventCalendarSVG= $('<img>',{
                  src: './assets/images/calendar.svg',
                  width: '18px',
                  class:'eventCalendar'
            });
            var $ClockSVG= $('<img>',{
                  src: './assets/images/clock.svg',
                  width: '18px',
                  class:'clock'
            });
            var $deleteimg = $('<img>',{
				'class':'event_delete',
				'src':'/assets/images/x.svg'
			});
			var $eventid = $('<span>',{
				'class':'eventid'
			});
			$eventid.append(res[i].eventid);

			$li.append($eventtype);
			$li.append($name);
			$li.append($ownername);
			$li.append($attendance);
			$li.append($numppl);
			$li.append($location);
			$li.append($EventCalendarSVG);
			$li.append($datetime);
			$li.append($ClockSVG);
			$li.append($hours);
			$li.append($deleteimg);
			$li.append($eventid);
			$ul.append($li);
		}
		$('#ResultShowBoard').append($ul);
		$('#ResultShowBoard').show();
	}
	
	$(document).on('click','.event_delete',function(){
		//delete event based on eventid
    	var eventid = $(this).siblings(".eventid").text();
    	var Object = {
    		'eventid':eventid,
    	};
    	$.ajax({
    		type:'POST',
    		url:'/deleteEventInfo',
    		dataType:'text',
    		data:Object,
    		success:function(res){
    			if(res == 'ok'){
    				//delete event successfully 
    				//refresh the page
    				$('#ResultShowBoard').empty();
    				$.ajax({
						type:'GET',
						url:'/getAllEventsInfo',
						dataType:'JSON',
						success:getAllEventsInfoCB
					});
    			}else{
    				//user not found
    				console.log('err');
    			}
    		}
    	});
	});

	/**************** Events button ****************/


	/**************** Status button ****************/
	$('#CurrentStatus').click(function(){
		//empty orginal list
		$('#ResultShowBoard').empty();
		//send get req to server for status info json
		$.ajax({
			type:'GET',
			url:'/getStatusInfo',
			dataType:'JSON',
			success:getStatusInfoCB
		});
	});

	function getStatusInfoCB(res){
		if(res.stats == 'ok'){
			var $div = $('<div>',{
				'id':'allStatusInfo' 
			});
			
			var $numberOfUsersText = $('<span>',{
				'id':'numberOfUsersText'
			});
			$numberOfUsersText.append('Total Users:');

			var $numberOfUsers = $('<span>',{
				'id':'numberOfUsers'
			});
			$numberOfUsers.append(res.totalUsers);

			var $numberOfEventsText = $('<span>',{
				'id':'numberOfEventsText'
			});
			$numberOfEventsText.append('Total Events:');
			var $numberOfEvents = $('<span>',{
				'id':'numberOfEvents'
			});
			$numberOfEvents.append(res.totalEvents);

			var $popularSportsText = $('<span>',{
				'id':'popularSportsText'
			});
			$popularSportsText.append('Popular Sports:');
			var $popularSports = $('<span>',{
				'id':'popularSports'
			});
			$popularSports.append(res.popularSport);

			var $headerText = $('<span>',{
				'id':'headerText'
			});
			$headerText.append('Current Status');

			$div.append($numberOfUsersText);
			$div.append($numberOfUsers);
			$div.append($numberOfEventsText);
			$div.append($numberOfEvents);
			$div.append($popularSportsText);
			$div.append($popularSports);
			$div.append($headerText);

			$('#ResultShowBoard').append($div);
			$('#ResultShowBoard').show();
	
		}else{
			console.log('err');
		}
	}

	/**************** Status button ****************/

	/**************** SignOut button ****************/
	$(document).on('click','#SignOut_Button',function(){
        $.ajax({
               type: 'GET',
               url: "/AdminSignOut",  //URL to send to send to the server
               dataType:'text',
               success:function(response){
	               //Go back to home page
	               window.location.replace("/");
               }
        }); //End of AJAX
 	});

	/**************** SignOut button ****************/



});
