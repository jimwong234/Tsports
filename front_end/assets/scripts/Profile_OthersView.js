//once the document has loaded
$(document).ready
(
    function()
    {
 
        //Get the logged-in user's basic info when they login: profile pic, name, UnreadNotifications icons
         $.ajax({
                type: 'GET',
                url: "/GetLoginUserInfo",  //URL to send to send to the server
                dataType: 'JSON',
                //Receives the path of the user's profile picture in the server
                success: function (response)
                {
                    //console.log(response);
                //Only process if any friend requests exist
                if(response.length > 0)
                {
                    //Now display the correct icon notification numbers
                    //If its zero, never display the red icon
                    if(response[0].numfriendreqs == 0)
                    {
                        $('#FB_Friend_SVG p').hide(); //hide it
                    }
                    
                    else
                    {
                        $('#FB_Friend_SVG p').show();
                        $('#FB_Friend_SVG p').text( response[0].numfriendreqs );
                    }
                    
                    
                    if(response[0].nummessages == 0)
                    {
                        $('#FB_Message_SVG p').hide(); //hide it
                    }
                    
                    else
                    {
                        $('#FB_Message_SVG p').show();
                        $('#FB_Message_SVG p').text( response[0].nummessages );
                    }
                    
                    
                    if(response[0].numnotifications == 0)
                    {
                        $('#FB_Notification_SVG p').hide(); //hide it
                    }
                    
                    else
                    {
                        $('#FB_Notification_SVG p').show();
                        $('#FB_Notification_SVG p').text( response[0].numnotifications );
                    }
                }
                    
                }
                }); //End of AJAX
 
 
 
 
 
         //Get the information for the profile being viewed using "FriendIDClicked" cookie:
         //The name and the path of the profile picture in the server
          $.ajax({
                type: 'GET',
                url: "/GetDisplayedProfileInfo",
               // data: $.cookie("FriendIDClicked"), //Send the ID of the user we want to see
                dataType: 'JSON', //DataType being received
                success: function (response)
                {
                    //console.log(response);
                 //Only process if any friend requests exist
                 if(response.length > 0)
                 {
                 
                     //Change the src of the profile picture to the profile pic stored on the server
                     $( "#ProfilePic" ).attr('src', response[0].ProfileImage );
                     
                     //Display the user's correct name
                     $( "#Profile_UserName" ).text(response[0].username);
                     
                         //See if this user is our friend or not
                         $.ajax({
                                type: 'GET',
                                url: "/GetIsFriendorNot",
                                dataType: 'text', //DataType being received
                                success: function (response)
                                {
                                    //hide the "Add Friend" button
                                    if(response == "yesfriend")
                                    {
                                        $('#AddFriend').hide();
                                    }
                                
                                    //We added the profile we are viewing
                                    else if(response == "pendingfriend")
                                    {
                                        $('#AddFriend p').text('Friend Requested');
                                    }
                                
                                    //notfriend
                                    //Show the "Add Friend" Button
                                    else if(response == "notfriend")
                                    {
                                        $('#AddFriend').show();
                                    }
                                
                                    //This user added us
                                    else if(response == "ThisUserAddedYou")
                                    {
                                        $('#AddFriend p').text('User Requested to be Friends');
                                    }
                                
                                }
                                }); //End of AJAX
                 }
                 
                }
                }); //End of AJAX
 
 
 
         //Clicking on the sign out button, send a request to the server
         $(document).on('click', '#SignOut_Button',
                        
                        function()
                        {
                        
                        $.ajax({
                               type: 'GET',
                               url: "/SignOut",  //URL to send to send to the server
                               dataType: 'text',
                               //Receives the path of the user's profile picture in the server
                               success: function (response)
                               {
                                    //Go back to home page
                                    window.location.replace("/");
                               }
                               }); //End of AJAX

                        }
                        );

 
 
 
         //Clicking on the bodynav (About, Friends, Reviews) highlights it and underlines it
         $(document).on('click', '#BodyNav ul li',
                
                                        function()
                                        {
                        
                                            //Clear the background-color and border-bottom for the previously clicked item (if any)
                                            $('.BodyNavClicked').removeClass('BodyNavClicked');
                        
                                            //Add a class to change the background-color and border-bottom
                                            $(this).addClass('BodyNavClicked');
                        
                                        }
                
                
                );
 
 
 
         /****************************************WebSockets***********************************/
         var NotificationSocket = io('/Notifications');
         /************************************************************************************/

         //Add a friend
         $(document).on('click', '#AddFriend',
                        
                                    function()
                                    {
                                        var buttonValue = $('#AddFriend p').text();
                        
                                        //Only proceed if we haven't already added the user
                                        if(buttonValue == "Add Friend")
                                        {
                                            //Send our userid and the friendid (person we want to add) to the server
                                            //using websockets
                                            NotificationSocket.emit('/AddAsFriend', {userid:  $.cookie("UserID"), friendid: $.cookie("FriendIDClicked") });
                                            $('#AddFriend p').text('Friend Requested');
                                        }
                                    }
                        );
 
 



 
 
         //DataForm = [{"url": "./assets/images/PM.jpg","name": "Piers Morgan", "friendid":"2"}];
         //When the user clicks on the "Friends" Tab, show all the Friends of the user
         $(document).on('click', '#UserFriends',
                        
                                                function()
                                                {
                        
                                                    //Remove all other displayed information about "Reviews" (if exists)
                                                    $('#ReviewsofUser').remove();
                                                    //Remove previously shown sporting events (if clicked previously)
                                                    $('#SportingEventReview').remove();
                        
                        
                                                    //Remove all other displayed information about "About" (if exists)
                                                    $('#AboutUser').remove();
                        
                        
                                                    //Remove all other displayed information about "Friends" (if exists)
                                                    //CUZ Referesh List
                                                    $('#FriendsofUser').remove();
                        
                        
                                        //Trigger AJAX and get friends info
                                        $.ajax({
                                               type: 'GET',
                                               url: "/GetDisplayedProfileUserFriends",  //URL to send to send to the server
                                               dataType: 'JSON',
                                               success: function (response)
                                               {
                        
                                                    //Create a section for the User's friends' images
                                                    var $FriendsSection = $('<section>',
                                                                                         {
                                                                                            id: 'FriendsofUser'
                                                                                         }
                                                                         );

                                                    //insert $FriendsSection after the #ProfileHeader
                                                    $FriendsSection.insertAfter('#ProfileHeader');
                        
                        
                                                    //Loop over all the Friend Images and append them
                                                    $.each(response,
                                                                            function(index, item)
                                                                           {
                                                           
                                                                                //$Friend has the image and the friend name
                                                                               var $Friend = $('<div>',
                                                                                                        {
                                                                                                          class: 'Friend'
                                                                                                        }
                                                                                                    );
                                                           
                                                                               var $FriendName = $('<p>',
                                                                                                           {
                                                                                                             text:  item.name
                                                                                                           }
                                                                                                  );
                                                           
                                                                               var $FriendImage = $('<img>',
                                                                                                          {
                                                                                                          src: item.url,
                                                                                                          width: '100px',
                                                                                                          height: '100px',
                                                                                                          class:  'FriendImage'
                                                                                                          }
                                                                                                  );
                                                           
                                                                               //Attach a hidden input to the friend (His user ID)
                                                                               //So that upon click, we can send this info to the server
                                                                               var $FriendsID = $('<input>',
                                                                                                          {
                                                                                                            type: 'hidden',
                                                                                                            name: 'FriendID',
                                                                                                            value: item.friendid
                                                                                                           }
                                                                                                  );
                                                           
                                                                                $Friend.append($FriendImage);  //Append the Image
                                                                                $Friend.append($FriendName);   //Append the name
                                                                                $Friend.append($FriendsID);   //Append the hidden friend id
                                                           
                                                                                $FriendsSection.append($Friend);
                                                                           }
                                                          );
                        
                        
                                                        //Show a "See More" button in the end
                                                        var $ShowMoreFriends = $('<p>',
                                                                                {
                                                                                  text: 'Show more',
                                                                                  id: 'MoreFriendsButton'
                                                                                }
                                                                        );
                        
                                                        //Append the button
                                                        $FriendsSection.append($ShowMoreFriends);
                                                   
                                               }
                                               }); //End of AJAX
                        
                        
                                                }
                        
                        
                        );
 
             //When a user clicks on any of his friends, take them to their profile
             $(document).on('click', '.Friend ',
                                                function()
                                                {
                                            //Only display that user's profile if it isn't yourself
                                            if( $(this).children('input').val() !=  $.cookie("UserID") )
                                            {
                                                    //Store the clicked friend's ID in a cookie to be accessed by Profile_OthersView.js
                                                    $.cookie("FriendIDClicked", $(this).children('input').val());
                                                    
                                                    //Go back to your friend's page
                                                    window.location.replace("/Profile_OthersView.html");
                                            }
                                                }
                            );
 
 
 
             //When the user clicks on the "UserReviews" Tab, show all the reviews/ratings/comments of the user in different sports
             $(document).on('click', '#UserReviews',
                            
                                                    function()
                                                    {
                            
                                                        //Remove all other displayed information about "Friends" (if exists)
                                                        $('#FriendsofUser').remove();
                            
                                                        //Remove all other displayed information about "About" (if exists)
                                                        $('#AboutUser').remove();
                            
                                                        //Remove displayed information about "Reviews" [To Refresh]
                                                        $('#ReviewsofUser').remove();
                                                        $('#SportingEventReview').remove();
                            
                            
                                                        //Get a list of all event sport types attended
                                                        $.ajax({
                                                               type: 'GET',
                                                               url: "/GetFriendSportsAttended",
                                                               dataType: 'JSON',
                                                               //Receives the path of the user's profile picture in the server
                                                               success: function (response)
                                                               {
                                                               
                                                                   //Create a section to show the sports the user has been rated in
                                                                   var $ReviewsSection = $('<section>',
                                                                                           {
                                                                                           id: 'ReviewsofUser'
                                                                                           }
                                                                                           );
                                                                   
                                                                   //Create element for Sports the user has played
                                                                   var $SportsPlayed = $('<ul>',
                                                                                                 {
                                                                                                 id: 'SportsPlayed'
                                                                                                 }
                                                                                         );
                                                                   
                                                                   //insert the <ul> SportsPlayed to the $ReviewsSection
                                                                   $ReviewsSection.append($SportsPlayed);
                                                                   
                                                                   //insert $ReviewsSection after the #ProfileHeader
                                                                   $ReviewsSection.insertAfter('#ProfileHeader');
                                                                   
                                                                   
                                                                   //Loop over all the sporting events (that this user HAS ATTENDED/played) and append them
                                                                   $.each(response,
                                                                                  function(index, item)
                                                                                  {
                                                                                  
                                                                                  //$Friend has the image and the friend name
                                                                                  var $sport = $('<li>',
                                                                                                 {
                                                                                                 class: 'SportingEvent'
                                                                                                 }
                                                                                                 );
                                                                                  
                                                                                  //$Friend has the image and the friend name
                                                                                  var $sportImage = $('<img>',
                                                                                                      {
                                                                                                      src: './assets/images/'+ item.SportType + '.svg',
                                                                                                      width: '30px'
                                                                                                      }
                                                                                                      );
                                                                                  
                                                                                  //Hidden input containing the user's ID
                                                                                  var $sportID = $('<input>',
                                                                                                   {
                                                                                                   type: 'hidden',
                                                                                                   name: 'SportTypeID',
                                                                                                   value: item.SportTypeID
                                                                                                   }
                                                                                                   );
                                                                                  
                                                                                  
                                                                                  
                                                                                  $sport.append($sportImage);  //Append the sportImage to the <li>
                                                                                  $sport.append($sportID);  //Append the sportID to the <li>
                                                                                  
                                                                                  $SportsPlayed.append($sport);  //Append the SportingEvent to the <ul>
                                                                                  
                                                                                  }
                                                                          );
                                                               }
                                                               }); //End of AJAX
                            
                                                    }
                            
                            
                            );
 

 
 
             //When the user clicks on a SportingEvent, show all the reviews/ratings/comments of the user viewed in that specific sport
             $(document).on('click', '.SportingEvent',
                            
                                                function()
                                                {
                                                   //Remove previously shown sporting events (if clicked previously)
                                                    $('#SportingEventReview').remove();
                            
                                                   //First highlight and underline the selected sporting event
                            
                                                   //Clear the background-color and border-bottom for the previously clicked item (if any)
                                                   $('.SportingEventClicked').removeClass('SportingEventClicked');
                            
                                                   //Add a class to change the background-color and border-bottom
                                                   $(this).addClass('SportingEventClicked');
                            
                            
                                                    //The sport ID clicked on is stored in a hidden input
                                                    var SportIDClicked = $(this).children('input').val();
                                                    
                                                    //Get a list of all reviews of the user in this sport ID
                                                    $.ajax({
                                                           type: 'POST',
                                                           url: "/GetFriendUserReviews",
                                                           data: { "SportID": SportIDClicked }, //Send the sport ID clicked on
                                                           dataType: 'JSON',
                                                           success: function (response)
                                                           {
                                                           
                                                           // console.log(response);
                                                           //Create a section
                                                           var $SportingEventReview = $('<section>',
                                                                                        {
                                                                                        id: 'SportingEventReview'
                                                                                        }
                                                                                        );
                                                           
                                                           //Insert this specific sporting event review after the section #ReviewsofUser
                                                           $SportingEventReview.insertAfter('#ReviewsofUser');
                                                           
                                                           
                                                           
                                                           
                                                           var $StarRatings = $('<div>',
                                                                                {
                                                                                id: 'StarRatings'
                                                                                }
                                                                                );
                                                           
                                                           
                                                           //Append it to the #SportingEventReview Section
                                                           $SportingEventReview.append($StarRatings);
                                                           
                                                           //Display the average number of stars this user received for this event
                                                           for(var i=0; i < response[0].SportRating; i++)
                                                           {
                                                           
                                                           //Create a star SVG four times
                                                           var $star = $('<img>',
                                                                         {
                                                                         src: './assets/images/filled_star.svg',
                                                                         width: '15px'
                                                                         }
                                                                         );
                                                           
                                                           //Append it to StarRatings
                                                           $StarRatings.append($star);
                                                           }
                                                           
                                                           
                                                           //Comments
                                                           var $Comments = $('<div>',
                                                                             {
                                                                             id: 'Comments'
                                                                             }
                                                                             );
                                                           
                                                           
                                                           //<ul> to add <li> comments
                                                           var $CommentsUL = $('<ul>',
                                                                               {
                                                                               
                                                                               }
                                                                               );
                                                           
                                                           //Append the comments to the page
                                                           $SportingEventReview.append($Comments);
                                                           
                                                           $Comments.append($CommentsUL);
                                                           
                                                           
                                                           //Add the comments left by other users for this specific sport to the page
                                                           $.each(response,
                                                                  function(index, item)
                                                                  {
                                                                  
                                                                  //The first object in the response contains the SportRating only
                                                                  if(index > 0)
                                                                  {
                                                                  //$comment is each individual comment
                                                                  var $comment = $('<li>',
                                                                                   {
                                                                                   class: 'Individual_Comment'
                                                                                   }
                                                                                   );
                                                                  
                                                                  
                                                                  
                                                                  //The Time of the comment
                                                                  var $commentTime = $('<p>',
                                                                                       {
                                                                                       text: item.CommentDate,
                                                                                       class: 'commentTime'
                                                                                       }
                                                                                       );
                                                                  
                                                                  //The Content of the comment
                                                                  var $commentContent = $('<p>',
                                                                                          {
                                                                                          text: item.Comment,
                                                                                          class: 'commentContent'
                                                                                          }
                                                                                          );
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  $comment.append($commentTime);  //Append the time to the <li>
                                                                  $comment.append($commentContent);  //Append the content to the <li>
                                                                  
                                                                  
                                                                  //Append the <li> comment to the <ul>
                                                                  $CommentsUL.append($comment);
                                                                  }
                                                                  }
                                                                  );
                                                           
                                                           }
                                                           }); //End of AJAX
                            
                            
                            
                                                }
                            
                            
                            );

 
 
                 /***************************************************Paul******************************************************/
 
 
 /****** START of About section *******/
 var sport_list = ["cycling", "waterpolo", "squash", "boxing", "taekwondo", "basketball",
                   "tabletennis", "tennis", "volleyball",
                   "football", "swimming"];
 
 var about_order = ["First_Name", "Last_Name", "Email_Address", "Birthday", "Gender",
                    "Phone_number", "Height", "Weight", "Campus", "About_Me", "Sports"];
 
 
 //When the user clicks on the "About" Tab, show all info about the user
 $('#UserAbout').on('click', requestUserInfo);
 
 //Get info from the server and create campus HTML element to display.
 function createCampusinfo(response)
 {
 $dropdown = $("<div/>", {
               class: "dropdown"
               });
 
 $select = $("<select/>", {
             required: "required",
             name: "Campus",
             class: "dropdown-Campus",
             disabled: "disabled"
             });
 
 //option: default(placeholder for option), St.George, Missisauga, Scarborough
 $option0 = $("<option/>", {
              value: "default",
              text: "Campus"
              });
 
 $option1 = $("<option/>", {
              value: "stgeorge",
              text: "St.George"
              });
 
 $option2 = $("<option/>", {
              value: "missisauga",
              text: "Missisauga"
              });
 
 $option3 = $("<option/>", {
              value: "scarborough",
              text: "Scarborough"
              });
 
 //Set selected when it's chosen by user
 if (response[0].Campus === "stgeorge")
 {
 $option1.attr("selected", "selected");
 }
 else if (response[0].Campus === "missisauga")
 {
 $option2.attr("selected", "selected");
 }
 else if (response[0].Campus === "scarborough")
 {
 $option3.attr("selected", "selected");
 }
 else
 {
 //"Campus" is shown as a default.
 $option0.attr("selected", "selected");
 }
 
 $select.append($option0);
 $select.append($option1);
 $select.append($option2);
 $select.append($option3);
 
 $dropdown.append($select);
 
 return $dropdown;
 
 }
 
 
 //Create info of gender in html elements using jquery.
 function createGenderInfo(response)
 {
 //dropdown for gender choice.
 $dropdown = $("<div/>", {
               class: "dropdown"
               });
 
 $select = $("<select/>", {
             required: "required",
             name: "gender",
             class: "dropdown-Gender",
             disabled: "disabled"
             });
 
 //option for male and female
 $option1 = $("<option/>", {
              value: "male",
              text: "Male"
              });
 
 $option2 = $("<option/>", {
              value: "female",
              text: "Female"
              });
 
 //display user's gender.
 if (response[0].Gender === "male")
 {
 $option1.attr("selected", "selected");
 }
 else
 {
 $option2.attr("selected", "selected");
 }
 
 $select.append($option1);
 $select.append($option2);
 
 $dropdown.append($select);
 
 return $dropdown;
 }
 
 
 function removeOtherDisplayedInfo()
 {
 //Remove all other displayed information about "Friends" (if exists)
 $('#FriendsofUser').remove();
 
 //Remove all other displayed information about "Reviews" (if exists)
 $('#ReviewsofUser').remove();
 $('#SportingEventReview').remove();
 
 //Remove all other displayed information about "About" (if exists)
 //Refresh, get new data from the server
 $('#AboutUser').remove();
 
 }
 
 //Callback function of click event of "About" section.
 function requestUserInfo()
 {
 
 //Get info about the user from the server
 $.ajax({
        type: 'GET',
        url: "/GetUserAboutInfo",  //URL to send to the server
        dataType: 'JSON'
        //Receives the path of the user's profile picture in the server
        }).done(function(response) {
                //remove previously displayed info
                removeOtherDisplayedInfo();
                
                //display user info
                DisplayUserInfo(response);
                }); //End of AJAX
 
 }
 
 //Display user's info on success of ajax request.
 function DisplayUserInfo(response)
 {
 //Create a section to info about the user
 var $AboutSection = $('<section>',
                       {
                       id: 'AboutUser'  //Please don't change this ID
                       }
                       );
 
 //insert $AboutSection after the #ProfileHeader
 $AboutSection.insertAfter('#ProfileHeader');
 
 //Paul ADD CODE HERE
 $form_input = $('<form/>',
                 {
                 id: "info_input"
                 }
                 );
 
 //for every each user's info, display
 for (var i = 0; i < about_order.length - 1; i++)
 {
 var $div = $('<div/>',
              {
              class: "each_info"
              }
              );
 
 if (about_order[i] === "Email_Address" ||
     about_order[i] === "Last_Name" ||
     about_order[i] === "First_Name")
 {
 $div = $('<div/>',
          {
          class: "each_info_stable"
          }
          );
 }
 
 var $label = $('<label/>',
                {
                class: about_order[i]
                }
                );
 
 var $label_text = $('<span/>',
                     {
                     class: "label",
                     text: about_order[i].replace("_", " ") + ":"
                     }
                     );
 
 var $info;
 
 //Display About me section as <textarea>
 if (about_order[i] === "About_Me")
 {
 $info = $('<textarea>',
           {
           name: about_order[i],
           placeholder: "Brief Personal Description",
           class: about_order[i],
           text: response[0][about_order[i]],
           rows: 6,
           cols: 35,
           disabled: "disabled"
           }
           );
 }
 else if (about_order[i] === "Campus")
 {
 $info = createCampusinfo(response);
 }
 else if (about_order[i] === "Gender")
 {
 $info = createGenderInfo(response);
 }
 else if (about_order[i] === "Birthday")
 {
 
 $info = $("<input>",
           {
           type: "date",
           name: about_order[i],
           class: about_order[i],
           pattern: "^(19|20)\d\d[- /.](0[1-9]|1[012])" +
           "[- /.](0[1-9]|[12][0-9]|3[01])",
           value: response[0].Birthday,
           required: "true",
           disabled: "disabled"
           }
           );
 }
 else if (about_order[i] === "Height" || about_order[i] === "Weight")
 {
 var unit = {"Height":"cm", "Weight":"kg"};
 $info = $("<input>",
           {
           type: "text",
           name: about_order[i],
           class: about_order[i],
           value: response[0][about_order[i]],
           placeholder: unit[about_order[i]],
           pattern: "[0-9]{1,3}",
           required: "true",
           disabled: "disabled"
           }
           );
 }
 else if (about_order[i] === "Phone_number")
 {
 $info = $("<input>",
           {
           type: "text",
           name: about_order[i],
           class: about_order[i],
           value: response[0][about_order[i]],
           placeholder: "ex.(647)123-9999",
           pattern: "[0-9]{10}|(\([0-9]{3}\))?([0-9]{3})?-?[0-9]{3}-[0-9]{4}|\([0-9]{3}\)[0-9]{7}",
           required: "true",
           disabled: "disabled"
           }
           );
 }
 else
 {
 $info = $('<input>',
           {
           type: "text",
           name: about_order[i],
           class: about_order[i],
           value: response[0][about_order[i]],
           disabled: "disabled"
           }
           );
 }
 
 
 
 $label.append($label_text);
 $label.append($info);
 $div.append($label);
 
 $form_input.append($div);
 
 }
 
 
 
 $info = $('<section/>', {
           id: "sports"
           });
 
 
 var $p_text = $('<p/>', {
                 text: "Sports:"
                 });
 
 var $div_collection = $('<div/>',{
                         id:"ck-collection"
                         })
 
 
 //console.log(response[0]);
 
 var len = sport_list.length;
 
 for(var i = 0;i < len;i++){
 var $div_ckbtn = $('<div/>',{
                    class:"ck-button"
                    });
 
 var $input_ckb = $('<input>',{
                    type:"checkbox",
                    id:sport_list[i],
                    name:sport_list[i],
                    value:sport_list[i],
                    disabled: "disabled",
                    checked: "checked"
                    });
 
 
 if (response[0].SportsInterested.indexOf(sport_list[i]) === -1)
 {
 $input_ckb.removeAttr("checked");
 }
 
 var $label_sport = $('<label/>',{
                      for:sport_list[i]
                      });
 
 var $img = $('<img>',{
              width:"20",
              height:"20",
              src:"assets/images/" + sport_list[i] + ".svg"
              });
 
 $label_sport.append($img);
 $label_sport.append(sport_list[i]);
 
 $div_ckbtn.append($input_ckb);
 $div_ckbtn.append($label_sport);
 
 $div_collection.append($div_ckbtn);
 }
 
 $info.append($p_text);
 $info.append($div_collection);
 
 $form_input.append($info);
 
 $AboutSection.append($form_input);
 }
 
/****** END of About section *******/
 
 
 //Your Code should end here
 /***************************************************Paul******************************************************/
 
 
 
 
 } //End of $(document).ready function
 
 
 
 
 );


























