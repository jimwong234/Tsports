//once the document has loaded
$(document).ready
(
    function()
    {
         /****************************************WebSockets***********************************/
         var socket = io();  //Connects to the root socket namespace
         var EventGroupChatSocket = io('/EventGroupChat');
         /************************************************************************************/
 
         //Get the user's basic info when they login: profile pic, name, UnreadNotifications icons
         $.ajax({
                type: 'GET',
                url: "/GetLoginUserInfo",  //URL to send to send to the server
                dataType: 'JSON',
                //Receives the path of the user's profile picture in the server
                success: function (response)
                {
                    //console.log(response);
                
                    //Change the src of the profile picture to the profile pic stored on the server
                    $( "#ProfilePic" ).attr('src', response[0].ProfileImage );
                
                    //Display the user's correct name
                    $( "#Profile_UserName" ).text(response[0].username);
                
                
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
                }); //End of AJAX
 
 
            //If we got re-directed here after successfuly creating an event
            //Check if the URL is /Profile_SelfView.html?EventSuccess=yes
            if (window.location.href.indexOf("?EventSuccess=yes") > -1)
            {
                //Show the approved calendar
                $('#EventSuccessful').show();
                 //Change the window url so it doesn't show again
                 window.history.pushState('CalendarRemoved', "CalendarRemoved", '/Profile_SelfView.html');
            }
 
            else
            {
                //Hide it
                $('#EventSuccessful').hide();
 
            }

 
         //Clicking on the sign out button, send a request to the server
         $(document).on('click', '#SignOut_Button',
                        
                                            function()
                                            {
                        
                                            $.ajax({
                                                   type: 'GET',
                                                   url: "/SignOut",  //URL to send to send to the server
                                                   dataType: 'text',
                                                   success: function (response)
                                                   {
                                                        //Go back to home page
                                                        window.location.replace("/");
                                                   }
                                                   }); //End of AJAX

                                            
                                            }
                        );
 
 
         //User can upload file without using submit button
         $('#file-input').change(function()
                                 {
                                    $('#UploadProfilePic').submit();
                                 }
                                ); 
 
 /**************************************paul*************************************************/
 
 //Clicking on the bodynav (About, Friends, Reviews) highlights it and underlines it
 $(document).on('click', '#allNav li',
                
                function()
                {
                    //Clear the background-color and border-bottom for the previously clicked item (if any)
                    $('.BodyNavClicked').removeClass('BodyNavClicked');
                    
                    //Add a class to change the background-color and border-bottom
                    $(this).addClass('BodyNavClicked');
                
                }
                
                
                );
 
/**************************************end paul*************************************************/
 
 
 
         //DataForm = [{"url": "./assets/images/PM.jpg","name": "Piers Morgan", "friendid":"2"}];

         //When the user clicks on the "Friends" Tab, show all the Friends of the user
         $(document).on('click', '#UserFriends',
                        
                                                function()
                                                {
                        
                                                    //Leave the EventID room [If was entered in the first place]
                                                    EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                        
                                                    //Remove all other displayed information about "About" (if exists)
                                                    $('#AboutUser').remove();
                        
                                                    //Remove all other displayed information about "Reviews" (if exists)
                                                    $('#ReviewsofUser').remove();
                                                    $('#SportingEventReview').remove();
                        
                                                    //Remove all other displayed information about "Upcoming Events" (if exists)
                                                    $('#EventsofUser').remove();
                                                    //Remove all info about the selected event
                                                    $('#SelectedEvent').remove();
                        
                                                    //Remove all other displayed information about "Searching Events" (if exists)
                                                    $('#SearchEventSection').remove();
                                                    
                                                    //Remove all other displayed information about "Creating Events" (if exists)
                                                    $('#CreateEventSection').remove();
                                                    //Remove the datepicker
                                                    $('.xdsoft_datetimepicker').remove();
                                                    //unwrap div with the class for blurring the background from #ProfileHeader
                                                    $('#ProfileHeader').unwrap();
                        
                        
                                                    //Remove all other displayed information about "Friends" (if exists)
                                                    //CUZ Referesh List
                                                    $('#FriendsofUser').remove();
                        
                                                    $('#EventSuccessful').hide();
                        
                                                    //Remove "change password" section
                                                    $('#PasswordChange').remove();
                        
                                                //Trigger AJAX and get friends info
                                                $.ajax({
                                                       type: 'GET',
                                                       url: "/GetUserFriends",  //URL to send to send to the server
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
                                                                                            $Friend.append($FriendsID);   //Append the friend id
                                                                       
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
                                                          //Store the clicked friend's ID in a cookie to be accessed by Profile_OthersView.js
                                                        $.cookie("FriendIDClicked", $(this).children('input').val());
                                                        
                                                        //Go back to your friend's page
                                                        window.location.replace("/Profile_OthersView.html");
                                                    }
                        );
 
 
 
 
             //When the user clicks on the "UserReviews" Tab, show all the reviews/ratings/comments of the user in different sports
             $(document).on('click', '#UserReviews',
                            
                                                    function()
                                                    {
                            
                                                        //Leave the EventID room [If was entered in the first place]
                                                        EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                            
                                                        //Remove all other displayed information about "About" (if exists)
                                                        $('#AboutUser').remove();
                            
                                                        //Remove all other displayed information about "Friends" (if exists)
                                                        $('#FriendsofUser').remove();
                            
                                                        //Remove all other displayed information about "Upcoming Events" (if exists)
                                                        $('#EventsofUser').remove();
                                                        //Remove all info about the selected event
                                                        $('#SelectedEvent').remove();
                            
                                                        //Remove all other displayed information about "Searching Events" (if exists)
                                                        $('#SearchEventSection').remove();
                                                        
                                                        //Remove all other displayed information about "Creating Events" (if exists)
                                                        $('#CreateEventSection').remove();
                                                        //Remove the datepicker
                                                        $('.xdsoft_datetimepicker').remove();
                                                        //unwrap div with the class for blurring the background from #ProfileHeader
                                                        $('#ProfileHeader').unwrap();
                            
                                                        $('#EventSuccessful').hide();
                            
                                                        //Remove section and create again (Refresh)
                                                        $('#ReviewsofUser').remove();
                                                        $('#SportingEventReview').remove();
                            
                                                        //Remove "change password" section
                                                        $('#PasswordChange').remove();
                            

                                                        //Get a list of all event sport types attended
                                                        $.ajax({
                                                               type: 'GET',
                                                               url: "/GetSportsAttended",
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
 
 

 
             //When the user clicks on a SportingEvent, show all the reviews/ratings/comments of the user in that specific sport
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
                                                           url: "/GetUserReviews",
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
 //Leave the EventID room [If was entered in the first place]
 EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
 
 //Remove all other displayed information about "Friends" (if exists)
 $('#FriendsofUser').remove();
 
 //Remove all other displayed information about "Reviews" (if exists)
 $('#ReviewsofUser').remove();
 $('#SportingEventReview').remove();
 
 //Remove all other displayed information about "Upcoming Events" (if exists)
 $('#EventsofUser').remove();
 //Remove all info about the selected event
 $('#SelectedEvent').remove();
 
 //Remove all other displayed information about "Searching Events" (if exists)
 $('#SearchEventSection').remove();
 
 //Remove all other displayed information about "Creating Events" (if exists)
 $('#CreateEventSection').remove();
 //Remove the datepicker
 $('.xdsoft_datetimepicker').remove();
 //unwrap div with the class for blurring the background from #ProfileHeader
 $('#ProfileHeader').unwrap();
 
 //Remove all other displayed information about "About" (if exists)
 //Refresh, get new data from the server
 $('#AboutUser').remove();
 
 $('#EventSuccessful').hide();
 
 //Remove "change password" section
 $('#PasswordChange').remove();
 }
 
 //Callback function of click event of "About" section.
 function requestUserInfo()
 {
 $.removeCookie("FriendIDClicked");
 
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
 
 
 
 var $edit = $('<button/>', {
               class: "edit_button",
               text: "Edit"
               });
 
 $form_input.append($info);
 
 $AboutSection.append($form_input);
 $AboutSection.append($edit);
 
 }
 
 
 //set css hover event of sport buttons when editting.
 function set() {
 $(".ck-button").hover(function() {
                       $(this).css({
                                   "color":"#000000",
                                   "outline":"none",
                                   "border":"1px solid #97D38D",
                                   "border-radius":"4px",
                                   "box-shadow":"0 0 10px #97D38D"
                                   });
                       }, function() {
                       $(this).css({
                                   "box-shadow":"none",
                                   "border":"none"
                                   });
                       });
 }
 
 //When edit button is clicked, display submit,cancel button and allow user to edit certain infos.
 $(document).on('click', '.edit_button',
                function()
                {
                //Allow user to edit their info (except for unchangable infos)
                $(".each_info input").removeAttr("disabled");
                $(".each_info textarea").removeAttr("disabled");
                $(".ck-button input").removeAttr("disabled");
                $(".dropdown-Campus").removeAttr("disabled");
                
                $(".edit_button").remove();
                
                //change color of sport buttons when editting.
                set();
                
                //display submit button (input with type=submit) and cancel button.
                var $submit = $('<input/>',
                                {
                                class: "submit_button",
                                type: "submit",
                                value: "Submit"
                                }
                                );
                
                var $cancel = $('<button/>',
                                {
                                class: "cancel_button",
                                text: "Cancel"
                                }
                                );
                $cancel.insertAfter('#info_input');
                $submit.insertAfter("#sports");
                }
                );
 
 //cancel editing. Go back to previous display.
 $(document).on('click', '.cancel_button',
                function()
                {
                console.log("here cancel button");
                requestUserInfo();
                }
                );
 
 
 //when submit button is clicked, get new infos from input,textarea,dropdowns, and send them to
 //the server in JSON file format (array of single dictionary; dictionary contains all information)
 $(document).on("submit", "#info_input",
                function(e)
                {
                e.preventDefault();
                
                var new_data = [];
                var data_dic = {};
                data_dic["First_Name"] = $("input.First_Name").val();
                data_dic["Last_Name"] = $("input.Last_Name").val();
                data_dic["Email_Address"] = $("input.Email_Address").val();
                data_dic["Gender"] = $("select.dropdown-Gender").val();
                
                var changed_info = $("form").serializeArray();
                
                //put info except for sports into data_dic
                for (var i = 0; i < 6; i++)
                {
                data_dic[changed_info[i].name] = changed_info[i].value;
                }
                
                var sportsInterested = [];
                
                for (i; i < changed_info.length; i++)
                {
                sportsInterested.push(changed_info[i].name);
                }
                
                data_dic["SportsInterested"] = sportsInterested;
                
                new_data.push(data_dic);
                
                //post new info about the user to the server
                $.ajax({
                       type: 'POST',
                       url: "/updateUserInfo",  //URL to send to the server
                       dataType: 'JSON',
                       data: changed_info,
                       //Receives the path of the user's profile picture in the server
                       success: function(response)
                       {
                       //remove previously displayed info
                       removeOtherDisplayedInfo();
                       
                       //here, pass new_data created above (data that contains new data)
                       DisplayUserInfo(new_data);
                       }
                       }); //End of AJAX
                
                }
                );
 

 
 
 
 
                        //Your Code should end here
 /***************************************************Paul******************************************************/

 
                  //Create a global variable to store the list of user's events
                  window.UserEventsList = [];
 
                 //When the user clicks on the "Events" tab, display the list of upcoming events the user has joined in
                 $(document).on('click', '#UserEvents',
                                
                                                    function()
                                                    {
                                
                                                        //Leave the EventID room [If was entered in the first place]
                                                        EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                                
                                                        //Remove all other displayed information about "About" (if exists)
                                                        $('#AboutUser').remove();
                                
                                                        //Remove all other displayed information about "Friends" (if exists)
                                                        $('#FriendsofUser').remove();
                                
                                                        //Remove all other displayed information about "Reviews" (if exists)
                                                        $('#ReviewsofUser').remove();
                                                        $('#SportingEventReview').remove();
                                
                                                        //Remove all other displayed information about "SearchEvent" (if exists)
                                                        $('#SearchEventSection').remove();
                                
                                                        //Remove all other displayed information about "Creating Events" (if exists)
                                                        $('#CreateEventSection').remove();
                                                        //Remove the datepicker
                                                        $('.xdsoft_datetimepicker').remove();
                                                        //unwrap div with the class for blurring the background from #ProfileHeader
                                                        $('#ProfileHeader').unwrap();
                                
                                
                                                        //Remove all other displayed information about "Events" (if exists)
                                                        //CUZ Referesh List
                                                        $('#EventsofUser').remove();
                                                        //Remove all info about the selected event
                                                        $('#SelectedEvent').remove();
                                
                                                        $('#EventSuccessful').hide();
                                
                                                        //Remove "change password" section
                                                        $('#PasswordChange').remove();
                                
                                
                                                    //Trigger AJAX and get events
                                                    $.ajax({
                                                           type: 'GET',
                                                           url: "/ViewEvents",
                                                           dataType: 'JSON',
                                                           success: function (response)
                                                           {
                                                           
                                                             //console.log(response);
                                                             //Store the JSON File containing all the events
                                                             window.UserEventsList = response;
                                       
                                                            //Create a section to show list of upcoming events the user has joined
                                                            var $EventsofUser = $('<section>',
                                                                                             {
                                                                                               id: 'EventsofUser'
                                                                                             }
                                                                                 );
                                                            
                                                            //insert $EventsofUser after the #ProfileHeader
                                                            $EventsofUser.insertAfter('#ProfileHeader');
                                
                                
                                
                                                            //The <ul> inside which we will place the events
                                                            var $EventsUL = $('<ul>',
                                                                                     {
                                                                                        id: 'EventsofUserUL'
                                                                                     }
                                                                             );
                                                            
                                                            //Append the $EventsUL to the page
                                                            $EventsofUser.append($EventsUL);

                                
                                
                                                            //Add the upcoming events the user has joined
                                                            //Loop over the events
                                                            $.each(response,
                                                                           function(index, item)
                                                                           {
                                                                           
                                                                               //$IndividualEvent is each of the individual events the user has joined
                                                                               var $IndividualEvent = $('<li>',
                                                                                                                {
                                                                                                                  class: 'IndividualEvent'
                                                                                                                }
                                                                                                );
                                                                   
                                                                   
                                                                   
                                                                               //$divLeft contains the event Date and Time
                                                                               var $divLeft = $('<div>',
                                                                                                                {
                                                                                                                  class: 'IndividualEventDateTime'
                                                                                                                }
                                                                                                        );
                                                                   
                                                                               //$divMiddle contains event Info (Event name, sport type, #ppl attending, #open spots)
                                                                               var $divMiddle = $('<div>',
                                                                                                        {
                                                                                                            class: 'IndividualEventInfo'
                                                                                                        }
                                                                                                );
                                                                   
                                                                               //$divRight contains more info about the event Info (The "+" SVG)
                                                                               var $divRight= $('<div>',
                                                                                                          {
                                                                                                            class: 'IndividualEventMoreDetail'
                                                                                                          }
                                                                                                );
                                                                   
                                                                               //Append the $IndividualEvent to the EventsUL
                                                                               $EventsUL.append($IndividualEvent);
                                                                   
                                                                   
                                                                               //Append the Left, Middle, and Right Divs to the $IndividualEvent
                                                                               $IndividualEvent.append($divLeft);
                                                                               $IndividualEvent.append($divMiddle);
                                                                               $IndividualEvent.append($divRight);
                                                                   
                                                                   
                                                                               //Add the Event DateTime to $divLeft
                                                                               $divLeft.append(
                                                                                                $('<p>',
                                                                                                          {
                                                                                                            text: item.EventDateTime
                                                                                                          }
                                                                                                 )
                                                                                               );
                                                                   
                                                                   
                                                                   
                                                                               //Add the Event Info to $divMiddle
                                                                               
                                                                   
                                                                               var $EventName= $('<h3>',
                                                                                                        {
                                                                                                          text: item.EventName
                                                                                                        }
                                                                                                );
                                                                   
                                                                               var $EventSVG= $('<img>',
                                                                                                         {
                                                                                                            src: './assets/images/' + item.EventType + '.svg',
                                                                                                            width: '20px'
                                                                                                         }
                                                                                               );
                                                                   
                                                                   
                                                                               var $EventAttendance= $('<p>',
                                                                                                                {
                                                                                                                  //Calculate #ppl attending
                                                                                                                  text: (item.EventNumPpl - item.EventNumSpotsLeft)  + " People Attending ",
                                                                                                                  class: 'EventAttendance'
                                                                                                                }
                                                                                                     );
                                                                   
                                                                   
                                                                               //Append the number of available spots
                                                                               $EventAttendance.append(
                                                                                                         $('<span>',
                                                                                                               {
                                                                                                                   text: item.EventNumSpotsLeft  + " Spots left!",
                                                                                                                   class: 'EventSpotsLeft'
                                                                                                               }
                                                                                                          )
                                                                                                      );
                                
                                                                   
                                                                               $divMiddle.append($EventName);
                                                                               $divMiddle.append($EventSVG);
                                                                               $divMiddle.append($EventAttendance);
                                                                   
                                                                   
                                                                   
                                                                   
                                                                               //Append an "X" sign next to each upcoming event joined
                                                                               //if clicked, "X" SVG means Leave Event
                                                                               $divRight.append(
                                                                                                $('<img>',
                                                                                                          {
                                                                                                              src: './assets/images/x.svg',
                                                                                                              width: '15px'
                                                                                                          }
                                                                                                  )
                                                                                                );
                                                                   
                                                                   
                                                                              //Make the "+" SVG a form
                                                                              //So when the user clicks it, track unique event ID using hidden input
                                                                   
                                                                               var $SelectedEventForm = $('<form>',
                                                                                                                    {
                                                                                                                      class: 'SelectedEventForm'
                                                                                                                    }
                                                                                                         );

                                                                               var $EventIDHidden= $('<input>',
                                                                                                             {
                                                                                                                type: 'hidden',
                                                                                                                name: 'EventID',
                                                                                                                value: item.EventID
                                                                                                             }
                                                                                                   );
                                                                   
                                                                               var $ShowSelectedEventSubmit= $('<input>',
                                                                                                                        {
                                                                                                                           type: 'submit',
                                                                                                                           class: 'ShowSelectedEventSubmit',
                                                                                                                           value: ""
                                                                                                                           //The value will be the "+" SVG
                                                                                                                        }
                                                                                                              );
                                                                   
                                                                   
                                                                               //Append the hidden input and submit button to the $SelectedEventForm
                                                                               $SelectedEventForm.append($EventIDHidden);
                                                                               $SelectedEventForm.append($ShowSelectedEventSubmit );
                                                                
                                                                   
                                                                               //Append the form to the $divRight
                                                                               $divRight.append($SelectedEventForm );
                                                                   
                                                                           }
                                                                   );

                                                        }
                                                        }); //End of AJAX
 
                                                    }
                                
                                
                                );
 
 
 
                 //When the user clicks on the "+" SVG for more details, show the user more info about that event
                 $(document).on('click', '#EventsofUser #EventsofUserUL .IndividualEvent .IndividualEventMoreDetail .SelectedEventForm',
                                
                                                    function(e)
                                                    {
                                                    
                                                        //Hide all displayed information about "Upcoming Events" first
                                                        //Don't remove it, it will be bad efficiency
                                                        $('#EventsofUser').hide();
                                
                                                        //Prevent the form from submitting the default "action"
                                                        e.preventDefault();
                                
                                                        //Create a section to show the specific event
                                                        var $SelectedEvent = $('<section>',
                                                                                          {
                                                                                            id: 'SelectedEvent'
                                                                                          }
                                                                              )
                                
                                                        //Show a back SVG on the top of the page
                                                        var $Return2Events =  $('<img>',
                                                                                       {
                                                                                           src: './assets/images/return-button.svg',
                                                                                           class: 'Return2Events',
                                                                                           width: '30px'
                                                                                       }
                                                                               );
                                
                                                        //insert $SelectedEvent after the #ProfileHeader
                                                        $SelectedEvent.insertAfter('#ProfileHeader');
                                                        $SelectedEvent.append($Return2Events);
                                
                                
                                                        //Find out which Event was clicked using the submitted form's hidden input to see the Event ID
                                                        var EventID = $(this).children('input[name=EventID]').attr('value');
                                
                                
                                                        //NO NEED to send this Event ID with AJAX to the server to get the Event Info (cuz HTTP Req|Res is slow)
                                                        //We already saved all the User's attending Events info in a global variable
                                
                                
                                                        //Loop over and find the clicked event
                                                        var JSONEvent = [];
                                                        $.each(UserEventsList,
                                                                               function(index, item)
                                                                               {
                                                                                    //we found that object
                                                                                    if(item.EventID == EventID)
                                                                                    {
                                                                                        JSONEvent = item;
                                                                                        return false; //We found it, break
                                                                                    }
                                                                               }
                                                               );

                                
                                                        var $EventName= $('<h3>',
                                                                                {
                                                                                  text: JSONEvent.EventName,
                                                                                  class: 'EventName'
                                                                                }
                                                                         );
                                
                                                        //Append the $EventName
                                                        $SelectedEvent.append($EventName);
                                
                                
                                                        //$BasicEventInfo_Wrapper wraps "EventSportName", "EventDateTime", "EventDuration", "EventLocation", "EventAttendance"
                                                        var $BasicEventInfo_Wrapper= $('<div>',
                                                                                              {
                                                                                                class: 'BasicEventInfo_Wrapper'
                                                                                              }
                                                                                       );
                                
                                
                                                        //$EventType is the Event SVG + Sport name
                                                        var $EventType= $('<div>',
                                                                                  {
                                                                                    class: 'EventSportName'
                                                                                  }
                                                                         );
                                
                                
                                                        var $EventSVG= $('<img>',
                                                                                 {
                                                                                   src: './assets/images/' + JSONEvent.EventType + '.svg',
                                                                                   width: '20px'
                                                                                 }
                                                                        );
                                
                                
                                                        var $EventSportName= $('<p>',
                                                                                     {
                                                                                       text: JSONEvent.EventType
                                                                                     }
                                                                              );

 
                                                       $EventType.append($EventSVG);
                                                       $EventType.append($EventSportName);
                                
                                
                                                        //Append the $EventName
                                                        $BasicEventInfo_Wrapper.append($EventType);
                               
                                
                                                        var $EventDateTime= $('<div>',
                                                                                      {
                                                                                       class: 'EventDateTime'
                                                                                      }
                                                                             );
                                
                                
                                                        var $EventCalendarSVG= $('<img>',
                                                                                         {
                                                                                           src: './assets/images/calendar.svg',
                                                                                           width: '18px'
                                                                                         }
                                                                                 );

                                                        var $EventDate= $('<p>',
                                                                                 {
                                                                                  text: JSONEvent.EventDateTime
                                                                                 }
                                                                         );
                                
                                
                                
//                                                        var TestDate = new Date(JSONEvent.EventDateTime);  //Works (Accepts the format)
//                                                        console.log(TestDate);
//                                                        var TimeA= formatAMPM(TestDate);  //Prints out the time (Ex: 3:00 pm)
//                                                        console.log(TimeA);
                                
                                
                                                        $EventDateTime.append($EventCalendarSVG);
                                                        $EventDateTime.append($EventDate);
                                
                                                        //Append the $EventDateTime
                                                        $BasicEventInfo_Wrapper.append($EventDateTime);
                                
                                
                                
                                
                                                        //The Event Duration is calculated from the Event DateTime and Event EndTime and sent back in the JSON
                                                        //Calculate this on Node.js server for efficiency (Can use moment.js [very good])
                                
                                                        var $EventDuration= $('<div>',
                                                                                      {
                                                                                        class: 'EventDuration'
                                                                                      }
                                                                              ).append(
                                                                                        $('<img>',
                                                                                                {
                                                                                                  src: './assets/images/clock.svg',
                                                                                                  width: '18px'
                                                                                                }
                                                                                          )
                                                                                      ).append(
                                                                                               $('<p>',
                                                                                                      {
                                                                                                       text: JSONEvent.Duration
                                                                                                      }
                                                                                                 )
                                                                                              );
                                
                                
                                                        //Append the $EventDuration
                                                        $BasicEventInfo_Wrapper.append($EventDuration);
                                
                                                        var $EventLocation= $('<div>',
                                                                                      {
                                                                                       class: 'EventLocation'
                                                                                      }
                                                                              ).append(
                                                                                        $('<img>',
                                                                                                 {
                                                                                                   src: './assets/images/location.svg',
                                                                                                   width: '15px'
                                                                                                 }
                                                                                         )
                                                                                       ).append(
                                                                                                  $('<p>',
                                                                                                          {
                                                                                                           text: JSONEvent.EventLocation
                                                                                                          }
                                                                                                   )
                                                                                               );

                                
                                                        //Append the $EventLocation
                                                        $BasicEventInfo_Wrapper.append($EventLocation);
                                
                                
                                                       var $EventAttendance= $('<p>',
                                                                                       {
                                                                                         //Calculate #ppl attending
                                                                                         text: (JSONEvent.EventNumPpl - JSONEvent.EventNumSpotsLeft)  + " People Attending ",
                                                                                         class: 'EventAttendance'
                                                                                       }
                                                                              );


                                                        //Append the number of available spots
                                                        $EventAttendance.append(
                                                                                   $('<span>',
                                                                                             {
                                                                                               text: JSONEvent.EventNumSpotsLeft  + " Spots left!",
                                                                                               class: 'EventSpotsLeft'
                                                                                             }
                                                                                     )
                                                                                );

                                
                                                        $BasicEventInfo_Wrapper.append($EventAttendance);
                                
                                
                                
                                
                                                        $SelectedEvent.append($BasicEventInfo_Wrapper);
                                
                                
                                                        var $EventDescription= $('<p>',
                                                                                       {
                                                                                        text: JSONEvent.EventDescription,
                                                                                        class: 'EventDescription'
                                                                                       }
                                                                                );
                                                        
                                                        
                                                        //Append the $EventDescription
                                                        $SelectedEvent.append($EventDescription);
                                
                                
                                                        //Add picture of the Event admin
                                                        var $EventAdmin = $('<div>',
                                                                                    {
                                                                                        id: 'EventAdmin'
                                                                                    }
                                                                          );
                                
                                                        //Add picture of the Event admin
                                                        var $EventAdminPic = $('<img>',
                                                                                    {
                                                                                        src: JSONEvent.EventAdminPic,
                                                                                        width: '100px',
                                                                                        height: '100px',
                                                                                        class:  'UserImages'
                                                                                    }
                                                                             );
                                
                                
                                                        var $EventAdminName = $('<p>',
                                                                                    {
                                                                                     text:  JSONEvent.EventAdminName
                                                                                    }
                                                                               );
                                
                                                        $EventAdmin.append($EventAdminPic);
                                                        $EventAdmin.append($EventAdminName);
                                
                                
                                                        $SelectedEvent.append($EventAdmin);
                                
                                
                                
                                
                                                    //All the users who joined this event
                                                    var $EventUsers = $('<div>',
                                                                                {
                                                                                 id: 'EventUsers'
                                                                                }
                                                                      );
                                    var JSONEventUsers = [];
                                    var IsEventRatingSubmitted;
                                
                                
                                    //Trigger AJAX
                                    //Send the EventID and get List of all the users in that event
                                    $.ajax({
                                           type: 'POST',
                                           url: "/GetEventUsers",  //URL to send to send to the server
                                           dataType: 'JSON',
                                           //Send the EventID of the event (hidden input Event ID) as a JSON File
                                           data: { eventID: EventID },
                                           success: function (response)
                                           {
                                                   JSONEventUsers = response; //To be used for the rating
                                           
                                                    //Loop over all the users in this event and append them
                                                    $.each(response,
                                                                           function(index, item)
                                                                           {
                                                           
                                                                               //Check if WE have submitted the event ratings or not
                                                                               if( item.friendid == $.cookie("UserID"))  IsEventRatingSubmitted = item.EventRatingSubmitted;
                                                           
                                                                               var $User = $('<div>',
                                                                                                       {
                                                                                                            class: 'EventUser'
                                                                                                       }
                                                                                               );
                                                           
                                                                               var $UserName = $('<p>',
                                                                                                       {
                                                                                                        text:  item.name
                                                                                                       }
                                                                                                   );
                                                           
                                                                               var $UserImage = $('<img>',
                                                                                                         {
                                                                                                           src: item.url,
                                                                                                           width: '80px',
                                                                                                           height: '80px',
                                                                                                           class:  'UserImages'
                                                                                                        }
                                                                                                );
                                                           
                                                                               //Attach a hidden input to the User ID
                                                                               //So that upon click, we can send this info to the server
                                                                               var $UserID = $('<input>',
                                                                                                              {
                                                                                                                type: 'hidden',
                                                                                                                name: 'FriendID',
                                                                                                                value: item.friendid
                                                                                                              }
                                                                                                  );
                                                           
                                                                               $User.append($UserImage);  //Append the Image
                                                                               $User.append($UserName);   //Append the name
                                                                               $User.append($UserID);   //Append the user id
                                                           
                                                                               
                                                                               $EventUsers.append($User);
                                                                           }
                                                           );

                                
                                                    //Append all the event users
                                                    $SelectedEvent.append($EventUsers);
                                           
                                           
                                                   //Now make an AJAX call to the server to get the group chat messages in the event
                                                   $.ajax({
                                                          type: 'POST',
                                                          url: "/GetEventMessages",  //URL to send to send to the server
                                                          dataType: 'JSON',
                                                          //Send the EventID of the event (hidden input Event ID) as a JSON File
                                                          data: { eventID: EventID },
                                                          success: function (response)
                                                          {
   
                                                              //Now add the group chat for users in this event
                                                              var $EventGroupChat = $('<div>',
                                                                                              {
                                                                                                id: 'EventGroupChat'
                                                                                              }
                                                                                      );
                                                              
                                                              //Append all $EventGroupChat to the <section>
                                                              $SelectedEvent.append($EventGroupChat);
                                                              
                                                              
                                                              //Get Message Data from the web server, and append list of previous messages with the user
                                                              var  $GroupChatContent = $('<div>',
                                                                                                 {
                                                                                                   id: 'GroupChatContent'
                                                                                                 }
                                                                                         );
                                                          
                                                          
                                                          
                                                          
                                                              //Loop over all the messages and append them
                                                              $.each(response,
                                                                             function(index, item)
                                                                             {
                                                                     
                                                                                //$EventChatMessage has the message and the image of the person who sent it
                                                                                var $EventChatMessage = $('<div>',
                                                                                                                 {
                                                                                                                    class: 'ChatContentDatas',
                                                                                                                 }
                                                                                                        );
                                                                     
                                                                     
                                                                     
                                                                                //Make an img tag for the profile pic of the person who sent it
                                                                                //Then append it to $EventChatMessage
                                                                                 var $SentByProfilePic = $('<img>',
                                                                                                                   {
                                                                                                                       src: item.ProfileImage,
                                                                                                                       width: '25px',
                                                                                                                       height: '25px',
                                                                                                                       class: 'EventMessageDisplayPic'
                                                                                                                   }
                                                                                                           );
                                                                     
                                                                                $EventChatMessage.append($SentByProfilePic);
                                                                     
                                                                     
                                                                                //Message was sent by me
                                                                                if(item.sentById == $.cookie("UserID"))
                                                                                {
                                                                     
                                                                                     var  $p = $('<p>',
                                                                                                         {
                                                                                                           text: item.chatmessage
                                                                                                         }
                                                                                                 );
                                                                     
                                                                                    //Add a class so it floats to the left
                                                                                    $EventChatMessage.addClass('MessageByMe');
                                                                     
                                                                                    $EventChatMessage.append($p);
                                                                                }
                                                                     
                                                                                 //Message was sent by other users
                                                                                 else
                                                                                 {
                                                                     
                                                                                     var  $p = $('<p>',
                                                                                                      {
                                                                                                       text: item.chatmessage
                                                                                                 
                                                                                                      }
                                                                                                 );
                                                                     
                                                                                     //Add a class so it floats to the right
                                                                                     $EventChatMessage.addClass('MessageNotByMe');
                                                                     
                                                                                     $EventChatMessage.append($p);
                                                                                 }
                                             
                                                                     
                                                                                    $GroupChatContent.append($EventChatMessage);
                                                 
                                                                             }
                                                                     );

                                                          
                                                              
                                                              //Append $GroupChatContent to the $EventGroupChat
                                                              $EventGroupChat.append($GroupChatContent);
                                                              
                                    
                                                              //Create a form input for all the users to be able to type
                                                              var $GroupChatForm = $('<form>',
                                                                                             {
                                                                                               id: 'GroupChatForm'
                                                                                             }
                                                                                     );
                                                              
                                                              
                                                              //Create a textarea element
                                                              var $GroupChatFormTextarea = $('<textarea>',
                                                                                                         {
                                                                                                           placeholder: 'Type a message...',
                                                                                                           width:  $EventGroupChat.width() - 10
                                                                                                         }
                                                                                             );
                                                              
                                                              //Append the textarea to the form
                                                              $GroupChatForm.append($GroupChatFormTextarea);
                                                              
                                                              //Append the form to the ChatBox
                                                              $EventGroupChat.append($GroupChatForm);
                                                          
                                                          
                                                              //Calculate the height of the chatbox to scroll down automatically
                                                              var HeightofChat = 0;
                                                              $("#EventGroupChat #GroupChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
                                                              $("#EventGroupChat #GroupChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message
                                                          
                                                          
                                                              //Chat History is now loaded
                                                              //Store the EventID in a cookie in order to leave socket room when needed
                                                              $.cookie("EventIDOpened", EventID);
                                                          
                                                          
                                                               //Tell the server to join the room for this EventID
                                                               EventGroupChatSocket.emit('JoinEventRoom', EventID);

          
                                                          
                                                              //We got the messages for this event
                                                              //Now check if this event is over or not yet
                                                          
                                                              var currentDate = new Date();
                                                              var eventEndDateTime = new Date(JSONEvent.CompleteEndTime);
                                                          
                                                          
                                                              //If the event is over AND more than 1 person attended the event AND Ratings haven't been submitted previously => display the Event Rating
                                                              if( currentDate > eventEndDateTime && ((JSONEvent.EventNumPpl - JSONEvent.EventNumSpotsLeft) > 1) &&  IsEventRatingSubmitted === 'no' )
                                                              {


                                                                  //Create a form input for all the users to be able to type
                                                                  var $EventRating = $('<div>',
                                                                                                 {
                                                                                                   id: 'EventRating'
                                                                                                 }
                                                                                         );

                                                                  $SelectedEvent.append($EventRating);
                                                          
                                                          
                                                                  //Create a form input for all the users to be able to type
                                                                  var $RatingHeader = $('<h3>',
                                                                                                 {
                                                                                                   text: 'Ratings Are Now Open!',
                                                                                                   id: 'RatingHeader'
                                                                                                 }
                                                                                        );
                                                          
                                                                   $EventRating.append($RatingHeader);
                                                          
                                                          
                                                                    //Make a Form for the ratings
                                                                    var $RatingForm = $('<form>',
                                                                                                {
                                                                                                 action: '/SubmitEventRatings',
                                                                                                 id: 'RatingForm',
                                                                                                 method: 'POST'
                                                                                                }
                                                                                        );
                                                                      
                                                                    $EventRating.append($RatingForm);
                                                          
                                                                      //Each person in the event can be rated and commented on [Except for the user on himself]
                                                                      //Loop over all the users in this event and append them
                                                                      $.each(JSONEventUsers,
                                                                                 function(index, item)
                                                                                 {
                                                                             
                                                                                     //All users in the event excluding the user himself
                                                                                     if( item.friendid !=  $.cookie("UserID") )
                                                                                     {
                                                              
                                                                             
                                                                                         var $UserRating = $('<div>',
                                                                                                                    {
                                                                                                                      class: 'EventRatingIndividualUser'
                                                                                                                    }
                                                                                                            );
                                                                             
                                                                                        $RatingForm.append($UserRating);
                                                                             
                                                                             
                                                                                         var $UserRatingInfo = $('<div>',
                                                                                                                         {
                                                                                                                          class: 'UserRatingInfo'
                                                                                                                         }
                                                                                                                );
                                                                             
                                                                                        $UserRating.append($UserRatingInfo);
                                                                             
                                                                                         
                                                                                         
                                                                                         var $UserImage =  $('<img>',
                                                                                                                     {
                                                                                                                        src: item.url,
                                                                                                                        width: '40px',
                                                                                                                        height: '40px'
                                                                                                                     }
                                                                                                            );
                                                                             
                                                                                         //Hidden input containing the user's ID
                                                                                         var $UserID = $('<input>',
                                                                                                                 {
                                                                                                                  type: 'hidden',
                                                                                                                  name: 'EventUserID',
                                                                                                                  value: item.friendid
                                                                                                                 }
                                                                                                         );
                                                                             
                                                                                         var $UserName =  $('<p>',
                                                                                                                 {
                                                                                                                     text:  item.name
                                                                                                                 }
                                                                                                            );
                                                                             
                                                                                         $UserRatingInfo.append($UserImage);
                                                                                         $UserRatingInfo.append($UserName);
                                                                                         $UserRatingInfo.append($UserID);
                                                                             
                                                                             
                                                                     
                                                                                        //The place where we enter our comment about the user
                                                                                        var $UserComment =   $('<textarea>',
                                                                                                                            {
                                                                                                                            placeholder: 'Comment on the User',
                                                                                                                            rows: 3,
                                                                                                                            maxlength: 400,
                                                                                                                            name: 'EventRatingComments',
                                                                                                                            autocomplete: 'off'
                                                                                                                            }
                                                                                                              );
                                                                             
                                                                                        $UserRating.append($UserComment);
                                                                             
                                                                             
                                                                                         //Rating the user using stars
                                                                                         var $UserStarRating =   $('<div>',
                                                                                                                            {
                                                                                                                             class: 'UserStarRating'
                                                                                                                            }
                                                                                                                   );
                                                                             
                                                                                         $UserRating.append($UserStarRating);
                                                                             
                                                                                         //Append 5 empty stars at first
                                                                                         for(var i = 1; i<6; i++)
                                                                                         {
                                                                                             var $Star =  $('<img>',
                                                                                                                 {
                                                                                                                     src: './assets/images/empty_star.svg',
                                                                                                                     width: '20px',
                                                                                                                     class: 'rate' + i  //Each star has a rate
                                                                                                                 }
                                                                                                            );
                                                                             
                                                                                              $UserStarRating.append($Star);
                                                                                         }
                                                                             
                                                                                            //Attach a hidden input containing the rating  value to submit with the form
                                                                                            var $UserRatingValue = $('<input>',
                                                                                                                             {
                                                                                                                              type: 'hidden',
                                                                                                                              name: 'ratingvalue',
                                                                                                                              class: 'ratingvalue',
                                                                                                                              value: 0  //The Value is initally 0
                                                                                                                             }
                                                                                                                     );
                                                                                             
                                                                                            $UserStarRating.append($UserRatingValue);
                                                                             
                                                                                      }
                                                                                 }
                                                                             );
                                                          
                                                                              //Add Form submit button
                                                                              var $SubmitRatings = $('<input>',
                                                                                                                 {
                                                                                                                  type: 'submit',
                                                                                                                  id: 'SubmitRatings',
                                                                                                                  value: 'Submit Ratings'
                                                                                                                 }
                                                                                                     );
                                                                              
                                                                              
                                                                              //Append it to the form
                                                                              $RatingForm.append($SubmitRatings);
                                                          
                                                          
                                                                              //Attach a hidden input containing the event ID which we are submitting the rating for
                                                                              var $EventIDRatingsSubmitted = $('<input>',
                                                                                                                       {
                                                                                                                        type: 'hidden',
                                                                                                                        name: 'EventID_RatingsSubmitted',
                                                                                                                        id: 'EventIDRatingsSubmitted',
                                                                                                                        value: EventID
                                                                                                                       }
                                                                                                               );
                                                                              
                                                                              $RatingForm.append($EventIDRatingsSubmitted);
                                                              }


                                                   
                                                          }
                                                          }); //End of AJAX 2 (Get Event Messages)
                                
                                            }
                                            }); //End of AJAX 1 (Get Event Users)
 

                                                    }
                                
                                );
 

 
 
 
                 //Clicking on the star ratings
                 $(document).on('click', '.UserStarRating img' ,
                                    function()
                                    {
                                         //Make the star the user clicked and all stars before it filled
                                         $(this).prevAll().andSelf().attr('src', './assets/images/filled_star.svg');
                                
                                        //Make all stars after the star the user clicked empty
                                        $(this).nextAll().attr('src', './assets/images/empty_star.svg');
                                
                                        //Update the value of the hidden input ".ratingvalue" based on the star chosen
                                        switch($(this).attr('class'))
                                        {
                                            case "rate1":
                                                        $(this).siblings('input').val(1); //Set the hidden input's rating value as 1
                                                        break;
                                
                                            case "rate2":
                                                        $(this).siblings('input').val(2);
                                                        break;
                                
                                            case "rate3":
                                                        $(this).siblings('input').val(3);
                                                        break;
                                
                                            case "rate4":
                                                        $(this).siblings('input').val(4);
                                                        break;
                                
                                            case "rate5":
                                                        $(this).siblings('input').val(5);
                                                        break;

                                        }
                                    }
                                
                                );
 
 
                 //When a user clicks on any of his friends|users, take them to their profile
                 $(document).on('click', '.EventUser ',
                                
                                                    function()
                                                    {
                                
                                                        //The cookie is called FriendIDClicked because I am utilizing one handler for efficiency
                                                        //Clicking on your friends pictures or a picture of a user attending the same event produces same results
                                                        
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
 
 
 
 
                 //When the user clicks on the "x" (Leave Event) SVG next to each event, delete that <li> Event and inform the server
                 $(document).on('click', '#EventsofUser #EventsofUserUL .IndividualEvent .IndividualEventMoreDetail img',
                
                                                                        function()
                                                                        {
                                
                                                                            var hiddeneventID = $(this).siblings('form').children("input[name='EventID']").val();
                                                                            $(this).parent().parent().remove();
                                    
                                                                            //Inform the server that the user is leaving this specific event
                                                                            $.ajax({
                                                                                   type: 'POST',
                                                                                   url: "/LeaveEvent",
                                                                                   dataType: 'text',
                                                                                   //Send the EventID of the event (hidden input Event ID) as a JSON File
                                                                                   data: { eventID: hiddeneventID },
                                                                                   
                                                                                   //If an admin leaves his own event, the whole event is cancelled
                                                                                   success: function (response)
                                                                                   {
                                                                                        //console.log(response);
                                                                                   
                                                                                           //Inform the user that since he was the admin, the whole event got cancelled
                                                                                           if(response == "UserWasAdmin")
                                                                                           alert("You were the Admin! You cancelled the Event!");
                                                        
                                                                                   }
                                                                                   }); //End of AJAX

                                                                        }
                                                                        
                                
                                );
 

 
                 //When the user clicks on the return SVG, return to display the list of upcoming events the user has joined in
                 $(document).on('click', '#SelectedEvent .Return2Events',
                                
                                                                        function()
                                                                        {
                                                                            //Remove all info about the selected event
                                                                            $('#SelectedEvent').remove();
                                                                            
                                                                            //Show all displayed information about "Upcoming Events" first
                                                                            $('#EventsofUser').show();
                                
                                                                            //Leave the EventID room
                                                                            EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                                
                                                                        }
                                
                                
                                );
 
 

 
                 //Pressing enter when in the event chat sends the message
                 $(window).keydown(
                                   function(event)
                                   {
                                       //If we press enter while the cursor is in the event GroupChatForm
                                       if(event.which==13 && $(event.target).is("#SelectedEvent #GroupChatForm textarea"))
                                       {
                                   
                                           event.preventDefault();
                                           var TypedMessage = $("#SelectedEvent #GroupChatForm textarea").val();
                                   
                                           //$EventChatMessage has the message and the image of the person who sent it
                                           var $EventChatMessage = $('<div>',
                                                                             {
                                                                              class: 'ChatContentDatas',
                                                                             }
                                                                     );
                                   
                                           
                                           //Make an img tag for the profile pic of the person who sent it (us)
                                           //Then append it to $EventChatMessage
                                           var $SentByProfilePic = $('<img>',
                                                                             {
                                                                              src:  $('#ProfilePic').prop('src'),  //Get the img from our profile
                                                                              width: '25px',
                                                                              height: '25px',
                                                                              class: 'EventMessageDisplayPic'
                                                                             }
                                                                     );
                                           
                                           $EventChatMessage.append($SentByProfilePic);
                                           
                                  
                                           var  $p = $('<p>',
                                                           {
                                                            text: TypedMessage
                                                           }
                                                       );
                                           
                                           //Add a class so it floats to the left
                                           $EventChatMessage.addClass('MessageByMe');
                                           
                                           $EventChatMessage.append($p);
                                
                                           $('#GroupChatContent').append($EventChatMessage);
                                

                                           //Calculate the height of the chatbox to scroll down automatically
                                           var HeightofChat = 0;
                                           $("#EventGroupChat #GroupChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
                                           $("#EventGroupChat #GroupChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message


                                            //Clear textarea after sending
                                           $("#SelectedEvent #GroupChatForm textarea").val("");
                                   
                                           //Send our userid, the eventID (event group chat we are using), and the message to the server
                                           //using websockets
                                            EventGroupChatSocket.emit('/SendGroupMessage', {userid:  $.cookie("UserID"), Chat_EventID: $.cookie("EventIDOpened"), chatmessage: TypedMessage });
                                   
                                       }
                                   }
                                   );
 
 

                 EventGroupChatSocket.on('ReceiveEventMessages' ,
                                         function(msg)
                                         {

                                             //Only append the message if
                                             //1) The Event group chat is open
                                             //2) The Event open is the same event which the group message was directed at
                                             if( $("#SelectedEvent #EventGroupChat").length > 0 && $.cookie("EventIDOpened") == msg.eventID )
                                             {
                                             
                                                    //$EventChatMessage has the message and the image of the person who sent it
                                                    var $EventChatMessage = $('<div>',
                                                                                      {
                                                                                      class: 'ChatContentDatas',
                                                                                      }
                                                                              );
                                                    
                                                    
                                                    
                                                    //Make an img tag for the profile pic of the person who sent it
                                                    //Then append it to $EventChatMessage
                                                    var $SentByProfilePic = $('<img>',
                                                                                      {
                                                                                      src: msg.SenderDP,
                                                                                      width: '25px',
                                                                                      height: '25px',
                                                                                      class: 'EventMessageDisplayPic'
                                                                                      }
                                                                              );
                                                    
                                                    $EventChatMessage.append($SentByProfilePic);
                                             
                                             
                                                        //Message sent by others
                                                        var  $p = $('<p>',
                                                                        {
                                                                            text: msg.chatmessage
                                                                        }
                                                                    );
                                                        
                                                        //Add a class so it floats to the right
                                                        $EventChatMessage.addClass('MessageNotByMe');
                                                        
                                                        $EventChatMessage.append($p);
                                             
                                                  
                                                        $('#GroupChatContent').append($EventChatMessage);
                                             
                                             
                                                         //Calculate the height of the chatbox to scroll down automatically
                                                         var HeightofChat = 0;
                                                         $("#EventGroupChat #GroupChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
                                                         $("#EventGroupChat #GroupChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message
                                             }

                                         }
                                         );

 
 

 
                 //When the user clicks on the "SearchEvent" SVG, Create a form element for the user to search
                 $(document).on('click', '#SearchEvent',
                                
                                                    function()
                                                    {
                                                        //Leave the EventID room (if was joined)
                                                        EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                                
                                                        //Remove all other displayed information about "About" (if exists)
                                                        $('#AboutUser').remove();
                                
                                                        //Remove all other displayed information about "Friends" (if exists)
                                                        $('#FriendsofUser').remove();
                                
                                                        //Remove all other displayed information about "Reviews" (if exists)
                                                        $('#ReviewsofUser').remove();
                                                        $('#SportingEventReview').remove();
                                
                                                        //Remove all other displayed information about "Upcoming Events" (if exists)
                                                        $('#EventsofUser').remove();
                                                        //Remove all info about the selected event
                                                        $('#SelectedEvent').remove();
                                
                                                        //Remove all other displayed information about "Creating Events" (if exists)
                                                        $('#CreateEventSection').remove();
                                                        //Remove the datepicker
                                                        $('.xdsoft_datetimepicker').remove();
                                                        //unwrap div with the class for blurring the background from #ProfileHeader
                                                        $('#ProfileHeader').unwrap();
                                
                                                        $('#EventSuccessful').hide();
                                
                                                        //Remove and re-create as a sort of refresh
                                                        $('#SearchEventSection').remove();
                                
                                                        //Remove "change password" section
                                                        $('#PasswordChange').remove();
                                
                                
                                
                                                            //Create a section to show the search form
                                                            var $SearchEvent = $('<section>',
                                                                                                {
                                                                                                    id: 'SearchEventSection'
                                                                                                }
                                                                                    );
                                
                                                            //insert $SearchEvent after the #ProfileHeader
                                                            $SearchEvent.insertAfter('#ProfileHeader');
                                
                                
                                
                                                            //Create a form for the user to be able to search events
                                                            var $SearchEventForm = $('<form>',
                                                                                             {
                                                                                                id: 'SearchEventForm'
                                                                                             }
                                                                                    ).append(
                                                                                             $('<input>',
                                                                                                           {
                                                                                                             type: 'text',
                                                                                                             id: 'SearchForEvents',
                                                                                                             placeholder: 'Search for events by using dropdown menu or typing',
                                                                                                             maxlength: 30,
                                                                                                            autocomplete: 'off'
                                                                                                            //Give the user the ability to both type and click from dropdown menu
                                                                                                            // readonly: ""
                                                                                                           }
                                                                                               )
                                                                                            );
                                
                                                            //Append it to the SearchEvent
                                                            $SearchEvent.append($SearchEventForm);
                                
                                
                                
                                
                                                            //Create a div for AvailableEventTypes
                                                            var $AvailableEventTypes = $('<div>',
                                                                                                 {
                                                                                                   id: 'AvailableEventTypes',
                                                                                                   //Initially hide it, only show it when user clicks on the input
                                                                                                   class: 'HideAvailableEventTypes'
                                                                                                 }
                                                                                         );
                                                            
                                
                                                            //Insert hidden $AvailableEventTypes after the search form input
                                                            $SearchEvent.append( $AvailableEventTypes );
                                                            
                                
                                
                                                            //Create a <ul> for AvailableEventTypes
                                                            var $AvailableEventTypesUL = $('<ul>',
                                                                                                   {
                                                                                                     id: 'AvailableEventTypesUL'
                                                                                                   }
                                                                                          );
                                                            
                                                            //Append the <ul> to the <div>
                                                            $AvailableEventTypes.append($AvailableEventTypesUL);
                                
                                
                                                            //Get all event types available
                                                            $.ajax({
                                                                   type: 'GET',
                                                                   url: "/GetAllSports",
                                                                   dataType: 'JSON',
                                                                   success: function (response)
                                                                   {
                                                                   
                                                                       //Loop over all the sporting events available and append them
                                                                       $.each(response,
                                                                              function(index, item)
                                                                              {
                                                                              
                                                                                  //Now add the available sports to each <li>
                                                                                  var $IndividualEventType = $('<li>',
                                                                                                                   {
                                                                                                                   class: 'IndividualEventType'
                                                                                                                   }
                                                                                                               );
                                                                                  
                                                                                  //Now add the SVG of the sport first
                                                                                  var $IndividualEventImg = $('<img>',
                                                                                                                      {
                                                                                                                      src: './assets/images/'+ item.SportType + '.svg',
                                                                                                                      width: '11px'
                                                                                                                      }
                                                                                                              );
                                                                                  
                                                                                  //Now add the name of the sport
                                                                                  var $IndividualEventName = $('<p>',
                                                                                                                   {
                                                                                                                   text: item.SportType
                                                                                                                   }
                                                                                                               );
                                                                                  
                                                                                  $IndividualEventType.append($IndividualEventImg);  //Append the Sport SVG to the <li>
                                                                                  $IndividualEventType.append($IndividualEventName);  //Append the sport name to the <li>
                                                                                  $AvailableEventTypesUL.append($IndividualEventType);  //Append the  <li> to the <ul>
                                                                              
                                                                              }
                                                                              );
                                                                   
                                                                   
                                                                   }
                                                                   }); //End of AJAX
                                
                                                    }
                                
                                
                                );
 
 
             /*****************************************Using the DropDown menu to search for events********************************************/
 
             //Clicking on the #SearchEventSection form input, opens the sport picker and clicking again toggles/closes it
             $(document).on('click', '#SearchEventSection #SearchForEvents',
                                                                function()
                                                                {
                                                                  //Toggle the sport picker
                                                                  $('#SearchEventSection #AvailableEventTypes').toggleClass( 'HideAvailableEventTypes' );
                                                                }
                            );
 
 
 
 
 
             //When the user clicks on any of the sports in the EventType input form, update the form value with that event
             $(document).on('click', '#SearchEventSection #AvailableEventTypes #AvailableEventTypesUL li',
                                                                function()
                                                                {
                                                                    //Change the form input value to that sport
                                                                    $('#SearchEventSection input').val( $(this).children('p').text() );
                                                                    
                                                                    //Add the sport event SVG to the form input
                                                                    $('#SearchEventSection input').css( 'background-image', 'url(' + $(this).children('img').attr('src') + ')');
                                                                    $('#SearchEventSection input').css( 'background-repeat' , 'no-repeat');
                                                                    $('#SearchEventSection input').css( 'background-size', '14px');
                                                                    $('#SearchEventSection input').css('background-position', '3px 5px');
                            
                            
                                                                    //hide the sport picker after clicking
                                                                    $('#SearchEventSection #AvailableEventTypes').toggleClass( 'HideAvailableEventTypes' );
                            
                            
                                                                    //We chose a new sport, remove the previous search's preview events shown
                                                                    $('#SearchEventsPreviewBox').remove();
                            
                            
                                                                    var SelectedEventSport = $(this).children('p').text().toLowerCase();
                            
                            
                                                                    //Send an AJAX to the server to get back events matching the clicked sport
                                                                    $.ajax({
                                                                           type: 'POST',
                                                                           url: "/SearchEventsByClick",
                                                                           dataType: 'JSON',
                                                                           //Send selected sport to server as JSON
                                                                           data: { "EventSportClicked": SelectedEventSport },
                                                                           //Receives all the matching events
                                                                           success: function (response)
                                                                           {
                                                                                SearchEventsDropDownResults(response);
                                                                           }
                                                                          }); //End of AJAX
                  
                            
                            
                            
                                                                }
                            );
 
 
 
 
 
            //When the user clicks on any of the preview events shown to get more details about that event
             $(document).on('click', '#SearchEventsPreviewBox #SearchEventsUL .IndividualEventPreview',
                                                            function()
                                                            {
                            
                                                            //Get the selected event ID from the hidden input
                                                            var SelectedEventID = $(this).children('input[name=EventID]').val();
                            
                            
                                                            //Send an AJAX to the server to get more details about selected event
                                                            $.ajax({
                                                                   type: 'POST',
                                                                   url: "/SearchEventsMoreDetail",
                                                                   dataType: 'JSON',
                                                                   //Send selected sport to server as JSON
                                                                   data: { "EventClicked": SelectedEventID },
                                                                   //Receives more details about the event
                                                                   success: function (response)
                                                                   {
                                                                
                                                                       //console.log(response[0]);
                                                                   
                                                                   //Hide all displayed information about "SearchEventSection" first
                                                                   //Don't remove it, it will be bad efficiency
                                                                   $('#SearchEventSection').hide();
                                                          
                                                                   
                                                                   //Create a section to show the specific event
                                                                   var $SelectedEvent = $('<section>',
                                                                                                      {
                                                                                                        id: 'SelectedEvent'
                                                                                                      }
                                                                                          )
                                                                   
                                                                   //Show a back SVG on the top of the page
                                                                   var $Return2Events =  $('<img>',
                                                                                                   {
                                                                                                     src: './assets/images/return-button.svg',
                                                                                                     class: 'Return2EventSearch',
                                                                                                     width: '30px'
                                                                                                    }
                                                                                           );
                                                                   
                                                                   $Return2Events.css( 'cursor', 'pointer' );
                                                                   $Return2Events.css( 'margin-bottom', '20px' );
                                                                   
                                                                   //insert $SelectedEvent after the #ProfileHeader
                                                                   $SelectedEvent.insertAfter('#ProfileHeader');
                                                                   $SelectedEvent.append($Return2Events);
                                                                   
                                                                   
                                                                   //Show a Join Event Button on the top of the page
                                                                   var $JoinEvent =  $('<p>',
                                                                                               {
                                                                                                 text: 'Join Event',
                                                                                                 class: 'JoinEvent'
                                                                                               }
                                                                                           );
                                                                   
                                                                   
                                                                   //Attach a hidden input containing the event ID
                                                                   //In the case of the user clicking "JoinEvent"
                                                                   var $eventid = $('<input>',
                                                                                           {
                                                                                             type: 'hidden',
                                                                                             name: 'TheEventID',
                                                                                             value: SelectedEventID
                                                                                           }
                                                                                   );
                                                                 
                                                                   $JoinEvent.append($eventid);
                                                                   $SelectedEvent.append($JoinEvent);
                                                                   
                                                                   
                                                                   
                                                          
                                                                   
                                                                   var $EventName= $('<h3>',
                                                                                             {
                                                                                              text: response[0].EventName,
                                                                                              class: 'EventName'
                                                                                             }
                                                                                     );
                                                                   
                                                                   //Append the $EventName
                                                                   $SelectedEvent.append($EventName);
                                                                   
                                                                   
                                                                   //$BasicEventInfo_Wrapper wraps "EventSportName", "EventDateTime", "EventDuration", "EventLocation", "EventAttendance"
                                                                   var $BasicEventInfo_Wrapper= $('<div>',
                                                                                                          {
                                                                                                            class: 'BasicEventInfo_Wrapper'
                                                                                                          }
                                                                                                  );
                                                                   
                                                                   
                                                                   //$EventType is the Event SVG + Sport name
                                                                   var $EventType= $('<div>',
                                                                                             {
                                                                                               class: 'EventSportName'
                                                                                             }
                                                                                     );
                                                                   
                                                                   
                                                                   var $EventSVG= $('<img>',
                                                                                            {
                                                                                             src: './assets/images/' + response[0].EventType + '.svg',
                                                                                             width: '20px'
                                                                                            }
                                                                                    );
                                                                   
                                                                   
                                                                   var $EventSportName= $('<p>',
                                                                                                  {
                                                                                                   text: response[0].EventType
                                                                                                  }
                                                                                          );
                                                                   
                                                                   
                                                                   $EventType.append($EventSVG);
                                                                   $EventType.append($EventSportName);
                                                                   
                                                                   
                                                                   //Append the $EventName
                                                                   $BasicEventInfo_Wrapper.append($EventType);
                                                                   
                                                                   
                                                                   var $EventDateTime= $('<div>',
                                                                                                 {
                                                                                                   class: 'EventDateTime'
                                                                                                 }
                                                                                         );
                                                                   
                                                                   
                                                                   var $EventCalendarSVG= $('<img>',
                                                                                                    {
                                                                                                    src: './assets/images/calendar.svg',
                                                                                                    width: '18px'
                                                                                                    }
                                                                                            );
                                                                   
                                                                   var $EventDate= $('<p>',
                                                                                             {
                                                                                             text: response[0].EventDateTime
                                                                                             }
                                                                                     );
                                                                   
                                                
                                                                   $EventDateTime.append($EventCalendarSVG);
                                                                   $EventDateTime.append($EventDate);
                                                                   
                                                                   //Append the $EventDateTime
                                                                   $BasicEventInfo_Wrapper.append($EventDateTime);
                                                                   
                                                                   
                                                                   //The Event Duration is calculated from the Event DateTime and Event EndTime and sent back in the JSON
                                                                   //Calculate this on Node.js server for efficiency
                                                                   var $EventDuration= $('<div>',
                                                                                                 {
                                                                                                 class: 'EventDuration'
                                                                                                 }
                                                                                         ).append(
                                                                                                  $('<img>',
                                                                                                            {
                                                                                                            src: './assets/images/clock.svg',
                                                                                                            width: '18px'
                                                                                                            }
                                                                                                    )
                                                                                                  ).append(
                                                                                                           $('<p>',
                                                                                                                 {
                                                                                                                 text: response[0].Duration
                                                                                                                 }
                                                                                                             )
                                                                                                           );
                                                                   
                                                                   
                                                                   //Append the $EventDuration
                                                                   $BasicEventInfo_Wrapper.append($EventDuration);
                                                                   
                                                                   var $EventLocation= $('<div>',
                                                                                                 {
                                                                                                   class: 'EventLocation'
                                                                                                 }
                                                                                         ).append(
                                                                                                  $('<img>',
                                                                                                            {
                                                                                                              src: './assets/images/location.svg',
                                                                                                              width: '15px'
                                                                                                            }
                                                                                                    )
                                                                                                  ).append(
                                                                                                           $('<p>',
                                                                                                                 {
                                                                                                                   text: response[0].EventLocation
                                                                                                                 }
                                                                                                             )
                                                                                                           );
                                                                   
                                                                   
                                                                   //Append the $EventLocation
                                                                   $BasicEventInfo_Wrapper.append($EventLocation);
                                                                   
                                                                   
                                                                   var $EventAttendance= $('<p>',
                                                                                               {
                                                                                               //Calculate #ppl attending
                                                                                               text: (response[0].EventNumPpl - response[0].EventNumSpotsLeft)  + " People Attending ",
                                                                                               class: 'EventAttendance'
                                                                                               }
                                                                                           );
                                                                   
                                                                   
                                                                   //Append the number of available spots
                                                                   $EventAttendance.append(
                                                                                           $('<span>',
                                                                                                     {
                                                                                                     text: response[0].EventNumSpotsLeft  + " Spots left!",
                                                                                                     class: 'EventSpotsLeft'
                                                                                                     }
                                                                                             )
                                                                                           );
                                                                   
                                                                   
                                                                   $BasicEventInfo_Wrapper.append($EventAttendance);
                                                                   
                                                                   
                                                                   
                                                                   
                                                                   $SelectedEvent.append($BasicEventInfo_Wrapper);
                                                                   
                                                                   
                                                                   var $EventDescription= $('<p>',
                                                                                                {
                                                                                                text: response[0].EventDescription,
                                                                                                class: 'EventDescription'
                                                                                                }
                                                                                            );
                                                                   
                                                                   
                                                                   //Append the $EventDescription
                                                                   $SelectedEvent.append($EventDescription);
                                                                   
                                                                   
                                                                   //Add picture of the Event admin
                                                                   var $EventAdmin = $('<div>',
                                                                                               {
                                                                                               id: 'EventAdmin'
                                                                                               }
                                                                                       );
                                                                   
                                                                   //Add picture of the Event admin
                                                                   var $EventAdminPic = $('<img>',
                                                                                                  {
                                                                                                  src: response[0].EventAdminPic,
                                                                                                  width: '100px',
                                                                                                  height: '100px',
                                                                                                  class:  'UserImages'
                                                                                                  }
                                                                                          );
                                                                   
                                                                   
                                                                   var $EventAdminName = $('<p>',
                                                                                                   {
                                                                                                   text:  response[0].EventAdminName
                                                                                                   }
                                                                                           );
                                                                   
                                                                   $EventAdmin.append($EventAdminPic);
                                                                   $EventAdmin.append($EventAdminName);
                                                                   
                                                                   
                                                                   $SelectedEvent.append($EventAdmin);
                                                                   
                                                                   
                                                                   
                                                                   
                                                                   //All the users who joined this event
                                                                   var $EventUsers = $('<div>',
                                                                                               {
                                                                                                 id: 'EventUsers'
                                                                                               }
                                                                                       );
                                                                   
                                                                   
                                                                   //Trigger AJAX
                                                                   //Send the EventID and get List of all the users in that event
                                                                   $.ajax({
                                                                          type: 'POST',
                                                                          url: "/GetEventUsers",
                                                                          dataType: 'JSON',
                                                                          //Send the EventID of the event (hidden input Event ID) as a JSON File
                                                                          data: { eventID: SelectedEventID },
                                                                          success: function (response)
                                                                          {
                                                                          //Loop over all the users in this event and append them
                                                                          $.each(response,
                                                                                 function(index, item)
                                                                                 {
                                                                                 
                                                                                 
                                                                                 var $User = $('<div>',
                                                                                                       {
                                                                                                         class: 'EventUser'
                                                                                                       }
                                                                                               );
                                                                                 
                                                                                 var $UserName = $('<p>',
                                                                                                           {
                                                                                                             text:  item.name
                                                                                                           }
                                                                                                   );
                                                                                 
                                                                                 var $UserImage = $('<img>',
                                                                                                            {
                                                                                                              src: item.url,
                                                                                                              width: '80px',
                                                                                                              height: '80px',
                                                                                                              class:  'UserImages'
                                                                                                            }
                                                                                                    );
                                                                                 
                                                                                 //Attach a hidden input to the User ID
                                                                                 //So that upon click, we can send this info to the server
                                                                                 var $UserID = $('<input>',
                                                                                                             {
                                                                                                             type: 'hidden',
                                                                                                             name: 'FriendID',
                                                                                                             value: item.friendid
                                                                                                             }
                                                                                                 );
                                                                                 
                                                                                 $User.append($UserImage);  //Append the Image
                                                                                 $User.append($UserName);   //Append the name
                                                                                 $User.append($UserID);   //Append the user id
                                                                                 
                                                                                 
                                                                                 $EventUsers.append($User);
                                                                                 }
                                                                                 );
                                                                          
                                                                          
                                                                          //Append all the event users
                                                                          $SelectedEvent.append($EventUsers);
                                                             
                                                                        
                                                                          
                                                                          }
                                                                          }); //End of AJAX 1 (Get Event Users)
                                                                   

                                                                        //No need to get the group chat messages because the user hasn't joined this event yet
                                                                        //so he/she can't view the group messages
                                                                
                                                                   
                                                                   }
                                                                   }); //End of AJAX
                            
                                                            
                                                            
                                                            
                                                            }
                            );
 
 
 
 
             //When the user clicks on the return SVG, return to continue searching events
             $(document).on('click', '#SelectedEvent .Return2EventSearch',
                                                                            function()
                                                                            {
                                                                                //Remove all info about the selected event
                                                                                $('#SelectedEvent').remove();
                                                                                
                                                                                //Show the search section
                                                                                $('#SearchEventSection').show();
                                                                            }
                            );
 

             //When the user clicks on the "Join Event Button"
             $(document).on('click', '.JoinEvent',
                                                    function()
                                                    {
                            
                                                //Only allow to join once
                                                if( $(this).text() == 'Join Event' )
                                                {
                                                    var EventToJoin = $(this).children('input').val();
 
                                                    //Change Join Event to Joined
                                                    $(this).text('Joined! View the event in your Events Tab!');
                                                    $(this).css('width','200px');
                            
                                    //We joined the event, remove it ffrom the search
                                    $('#SearchEventsPreviewBox #SearchEventsUL .IndividualEventPreview input[value=' +EventToJoin+ ']').parent().remove();
                            
                                                    //Send an AJAX to the server that the user joined this event
                                                    $.ajax({
                                                           type: 'POST',
                                                           url: "/JoinEvent",  //URL to send to send to the server
                                                           dataType: 'text',
                                                           data: { "EventToJoin": EventToJoin },
                                                           //Receives the path of the user's profile picture in the server
                                                           success: function (response)
                                                           {
                                                           
                                                           }
                                                           }); //End of AJAX
                                                    }
                                                }
                            );


 
 
 


         /******************************************Using manual typing to search for events********************************************/
 
         //When the user types an event sport name, dynamically update DOM as soon as we find a match
         //(Ex: "Soc" matches "soccer" and we load all the soccer events
         $(document).on('input', '#SearchEventSection input',
                                                            function(event)
                                                            {
                                                                //First remove the background image
                                                                //because if the user used the dropdown menu prior, the sport SVG will stay there
                                                                $('#SearchEventSection input').css('background-image', 'none');
                        
                                                                //hide the sport picker when typing
                                                                $('#SearchEventSection #AvailableEventTypes').addClass( 'HideAvailableEventTypes' );
                        
                                                                //We are searching for a new sport, remove the previous search's preview events shown
                                                                $('#SearchEventsPreviewBox').remove();
                        
                                                                //Make it all lower-case
                                                                var UserInput = event.target.value.toLowerCase();
                        
                                                                //Start Querying when the user starts typing
                                                                if(UserInput.length != 0)
                                                                {
                                                                        $.ajax({
                                                                               type: 'POST',
                                                                               url: "/SearchEventsByTyping",
                                                                               dataType: 'JSON',
                                                                               //Send selected sport to server as JSON
                                                                               data: { "SearchString": UserInput },
                                                                               //Receives all the matching events
                                                                               success: function (response)
                                                                               {
                                                                                    SearchEventsDropDownResults(response);
                                                                               }
                                                                               }); //End of AJAX
                                                                }
                        
      
                                                            }
                        
                        
                        );
 

             function SearchEventsDropDownResults(response)
             {
                    //Only process if matched events were found
                     if(response.length > 0)
                     {
                     
                     //The box that contains all matched events
                     var $SearchEventPreviewBox = $('<section>',
                                                    {
                                                    id: 'SearchEventsPreviewBox'
                                                    }
                                                    );
                     
                     //insert $SearchEventPreviewBox after the #SearchEventForm
                     $SearchEventPreviewBox.insertAfter('#SearchEventForm');
                     
                     //The <ul> inside which we will place the matched events
                     var $EventsUL = $('<ul>',
                                       {
                                       id: 'SearchEventsUL'
                                       }
                                       );
                     
                     //UL contains all the event previews
                     $SearchEventPreviewBox.append($EventsUL);
                     
                     
                     //Loop over the matched events
                     $.each(response,
                            function(index, item)
                            {
                            
                            //$IndividualEvent is each of the individual event preview
                            var $IndividualEvent = $('<li>',
                                                     {
                                                     class: 'IndividualEventPreview'
                                                     }
                                                     );
                            
                            var $EventIDHidden= $('<input>',
                                                  {
                                                  type: 'hidden',
                                                  name: 'EventID',
                                                  value: item.EventID
                                                  }
                                                  
                                                  );
                            
                            
                            //$divLeft contains the event Date and Time
                            var $divLeft = $('<div>',
                                             {
                                             class: 'IndividualEventDateTime'
                                             }
                                             );
                            
                            //$divMiddle contains event Info (Event name, sport type, #ppl attending, #open spots)
                            var $divMiddle = $('<div>',
                                               {
                                               class: 'IndividualEventInfo'
                                               }
                                               );
                            
                            
                            //Append the $IndividualEvent to the EventsUL
                            $EventsUL.append($IndividualEvent);
                            
                            
                            //Append the Middle, and Right Divs to the $IndividualEvent
                            $IndividualEvent.append($divLeft);
                            $IndividualEvent.append($divMiddle);
                            
                            
                            //Add the Event DateTime to $divLeft
                            $divLeft.append(
                                            $('<p>',
                                              {
                                              text: item.EventDateTime
                                              }
                                              )
                                            );
                            
                            
                            var $EventName= $('<h3>',
                                              {
                                              text: item.EventName
                                              }
                                              );
                            
                            var $EventSVG= $('<img>',
                                             {
                                             src: './assets/images/' + item.EventType + '.svg',
                                             width: '13px'
                                             }
                                             );
                            
                            
                            var $EventAttendance= $('<p>',
                                                    {
                                                    //Calculate #ppl attending
                                                    text: (item.EventNumPpl - item.EventNumSpotsLeft)  + " People Attending ",
                                                    class: 'EventAttendance'
                                                    }
                                                    );
                            
                            
                            //Append the number of available spots
                            $EventAttendance.append(
                                                    $('<span>',
                                                      {
                                                      text: item.EventNumSpotsLeft  + " Spots left!",
                                                      class: 'EventSpotsLeft'
                                                      }
                                                      )
                                                    );
                            
                            
                            $divMiddle.append($EventName);
                            $divMiddle.append($EventSVG);
                            $divMiddle.append($EventAttendance);
                            
                            
                            $IndividualEvent.append($EventIDHidden);
                            
                            }
                            );
                     
                     
                     }//Only run if response included matched events
             }
 
 
 
 
 
             //When the user clicks on the "AddEvent" SVG, Create a form element for the user to create events
             $(document).on('click', '#AddEvent',
                            
                                                function()
                                                {
                                                    //Leave the EventID room [If was entered in the first place]
                                                    EventGroupChatSocket.emit('LeaveRoom', $.cookie("EventIDOpened") );
                            
                                                    //Remove all other displayed information about "About" (if exists)
                                                    $('#AboutUser').remove();
                            
                                                    //Remove all other displayed information about "Friends" (if exists)
                                                    $('#FriendsofUser').remove();
                            
                                                    //Remove all other displayed information about "Reviews" (if exists)
                                                    $('#ReviewsofUser').remove();
                                                    $('#SportingEventReview').remove();
                            
                                                    //Remove all other displayed information about "Upcoming Events" (if exists)
                                                    $('#EventsofUser').remove();
                                                    //Remove all info about the selected event
                                                    $('#SelectedEvent').remove();
                            
                                                    //Remove all other displayed information about "SearchEvent" (if exists)
                                                    $('#SearchEventSection').remove();
                            
                                                    $('#EventSuccessful').hide();
                            
                                                    //Remove "change password" section
                                                    $('#PasswordChange').remove();
                            
                            
                            
                                                    //Only run function if CreateEventSection information is not displayed
                                                    if( $('#CreateEventSection').length == 0 )
                                                    {
                            
                            
                                                        //Create a section to show the add event form
                                                        var $CreateEvent = $('<section>',
                                                                                         {
                                                                                            id: 'CreateEventSection'
                                                                                         }
                                                                             );
                            
                                                        //Blur background first
                                                        $('#ProfileHeader').wrap('<div class="blur-all">');
                            
                            
                            
                                                        //insert $CreateEvent after the #ProfileHeader
                                                        //Update: insert $CreateEvent after the Blurred Background
                                                        $CreateEvent.insertAfter('.blur-all');
                            
                            
                            
                                                        //Create a form for the user to be able to create events
                                                        var $CreateEventForm = $('<form>',
                                                                                         {
                                                                                            id: 'CreateEventForm',
                                                                                            action: '/CreateNewEvent',
                                                                                            method: 'POST'
                                                                                         }
                                                                                 );
                            
                                                        //Append it to the CreateEvent
                                                        $CreateEvent.append($CreateEventForm);
                            
                            
                            
                            
                                                        //Creating input types
                            
                            
                            
                                                        //Create a label for Event Name
                                                        var $EventNameLabel = $('<label>',
                                                                                          {
                                                                                            id: 'EventNameLabel',
                                                                                            class: 'CreateEventLabel'
                                                                                          }
                                                                                ).append(
                                                                                         $('<span>',     //Whats shown next to the input
                                                                                                   {
                                                                                                      text: 'Event Name'
                                                                                                   }
                                                                                           )
                                                                                        ).append(
                                                                                                 $('<input>',     //Input for the EventName
                                                                                                           {
                                                                                                              type: 'text',
                                                                                                              name: 'EventName',
                                                                                                               required: "true",
                                                                                                             autocomplete: 'off'
                                                                                                           }
                                                                                                  )
                                                                                                );
                            
                            
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($EventNameLabel);
                            
                            
                            
                                                        //Create a label for Event Type
                                                        var $EventTypeLabel = $('<label>',
                                                                                        {
                                                                                          id: 'EventTypeLabel',
                                                                                          class: 'CreateEventLabel'
                                                                                        }
                                                                                ).append(
                                                                                         $('<span>',     //Whats shown next to the input
                                                                                                   {
                                                                                                     text: 'Event Type'
                                                                                                   }
                                                                                           )
                                                                                         ).append(
                                                                                                  $('<input>',     //Input for the EventType
                                                                                                            {
                                                                                                              type: 'text',
                                                                                                              name: 'EventType',
                                                                                                              required: "true",
                                                                                                            autocomplete: 'off'
                                                                                                            }
                                                                                                    )
                                                                                                  );
                            
                            
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($EventTypeLabel);
                            
                            
                                                    //Make the EventType input form readonly so the user can't type invalid sports
                                                    $('#EventTypeLabel input').prop("readonly", true);
                            
                            
                                                    //Default value for the sport picker is Football
                                                    //So the user, doesn't leave it empty
                                                    $('#EventTypeLabel input').val( 'football');
                                                    $('#EventTypeLabel input').css( 'background-image', 'url("./assets/images/football.svg")');
                                                    $('#EventTypeLabel input').css( 'background-repeat' , 'no-repeat');
                                                    $('#EventTypeLabel input').css( 'background-size', '14px');
                                                    $('#EventTypeLabel input').css('background-position', '3px 5px');
                            

                            
                                                    //Create a div for AvailableEventTypes
                                                    var $AvailableEventTypes = $('<div>',
                                                                                          {
                                                                                              id: 'AvailableEventTypes',
                                                                                              //Initially hide it, only show it when user clicks on the input
                                                                                              class: 'HideAvailableEventTypes'
                                                                                          }
                                                                                );
                            
                            
                                                    $EventTypeLabel.append($AvailableEventTypes);
                            
                            
                                                    //Create a <ul> for AvailableEventTypes
                                                    var $AvailableEventTypesUL = $('<ul>',
                                                                                         {
                                                                                            id: 'AvailableEventTypesUL'
                                                                                         }
                                                                                 );
                            
                                                     //Append the <ul> to the <div>
                                                     $AvailableEventTypes.append($AvailableEventTypesUL);
                            
                        
                                                    //Get all event types available
                                                    $.ajax({
                                                           type: 'GET',
                                                           url: "/GetAllSports",
                                                           dataType: 'JSON',
                                                           success: function (response)
                                                           {
                                                  
                                                            //Loop over all the sporting events available and append them
                                                            $.each(response,
                                                                           function(index, item)
                                                                           {

                                                                               //Now add the available sports to each <li>
                                                                               var $IndividualEventType = $('<li>',
                                                                                                                  {
                                                                                                                    class: 'IndividualEventType'
                                                                                                                  }
                                                                                                          );
                                                                   
                                                                               //Now add the SVG of the sport first
                                                                               var $IndividualEventImg = $('<img>',
                                                                                                                    {
                                                                                                                        src: './assets/images/'+ item.SportType + '.svg',
                                                                                                                        width: '11px'
                                                                                                                    }
                                                                                                            );
                                                                   
                                                                               //Now add the name of the sport
                                                                               var $IndividualEventName = $('<p>',
                                                                                                                   {
                                                                                                                     text: item.SportType
                                                                                                                   }
                                                                                                           );

                                                                               $IndividualEventType.append($IndividualEventImg);  //Append the Sport SVG to the <li>
                                                                               $IndividualEventType.append($IndividualEventName);  //Append the sport name to the <li>
                                                                               $AvailableEventTypesUL.append($IndividualEventType);  //Append the  <li> to the <ul>
                                                                   
                                                                           }
                                                                   );
                                                
                                
                                                           }
                                                           }); //End of AJAX
                            
                            
                        
                                                        //Create a label for Event Numppl
                                                        var $EventNumpplLabel = $('<label>',
                                                                                            {
                                                                                              id: 'EventNumpplLabel',
                                                                                              class: 'CreateEventLabel'
                                                                                            }
                                                                                ).append(
                                                                                         $('<span>',     //Whats shown next to the input
                                                                                                   {
                                                                                                      text: 'Number of people'
                                                                                                   }
                                                                                           )
                                                                                         ).append(
                                                                                                  $('<input>',     //Input for the EventName
                                                                                                              {
                                                                                                                type: 'number',
                                                                                                                name: 'EventNumppl',
                                                                                                                required: "true",
                                                                                                                autocomplete: 'off'
                                                                                                              }
                                                                                                    )
                                                                                                  );
                                                        
                                                        
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($EventNumpplLabel);
                            
                            
                            
                                                        //Create a label for Event DateTime
                                                        var $EventDateTimeLabel = $('<label>',
                                                                                              {
                                                                                                id: 'EventDateTimeLabel',
                                                                                                class: 'CreateEventLabel'
                                                                                              }
                                                                                  ).append(
                                                                                           $('<span>',     //Whats shown next to the input
                                                                                                     {
                                                                                                       text: 'Event Date & Time'
                                                                                                     }
                                                                                             )
                                                                                           ).append(
                                                                                                    $('<input>',     //Input for the EventDate and Time
                                                                                                                {
                                                                                                               //   type: 'datetime-local',
                                                                                                                    type: 'text',
                                                                                                                    class:'DateTimePicker_Event',
                                                                                                                    name: 'EventDateTime',
                                                                                                                    required: "true",
                                                                                                                   autocomplete: 'off'
                                                                                                                }
                                                                                                      )
                                                                                                    );
                            
                            
                                                        //Append it to the CreateEventForm
                                                        //Once its appended and ready in the DOM, call the .datetimepicker()
                                                        $CreateEventForm.append($EventDateTimeLabel).ready(
                                                                                                           function() {
                                                                                                                        $('.DateTimePicker_Event').datetimepicker({
                                                                                                                                                                      formatTime:'g:i A', //Use AM | PM
                                                                                                                                                                      format:'M d Y h:i A',
                                                                                                                                                                      step:15,
                                                                                                                                                                      minDate:'0' //Can't choose past Dates for creating event
                                                                                                                                                                  });
                                                                                                                      }
                                                                                                           );
                            
                            
                                                        //Create a label for Event EndTime
                                                        var $EventEndTimeLabel = $('<label>',
                                                                                            {
                                                                                              id: 'EventEndTimeLabel',
                                                                                              class: 'CreateEventLabel'
                                                                                            }
                                                                                    ).append(
                                                                                             $('<span>',     //Whats shown next to the input
                                                                                                       {
                                                                                                         text: 'Event End Time'
                                                                                                       }
                                                                                               )
                                                                                             ).append(
                                                                                                      $('<input>',     //Input for the Event EndTime
                                                                                                                    {
                                                                                                                      type: 'text',
                                                                                                                      class:'TimePicker_Event',
                                                                                                                      name: 'EventEndTime',
                                                                                                                      required: "true",
                                                                                                                      autocomplete: 'off'
                                                                                                                    }
                                                                                                        )
                                                                                                      );
                                                        
                                                        
                                                        //Append it to the CreateEventForm
                                                        //Once its appended and ready in the DOM, call the .datetimepicker()
                                                        $CreateEventForm.append($EventEndTimeLabel).ready(
                                                                                                          function() {
                                                                                                                  $('.TimePicker_Event').datetimepicker({
                                                                                                                                                            datepicker:false, //Can't pick dates
                                                                                                                                                            step:15,
                                                                                                                                                            formatTime:'g:i A', //Use AM | PM
                                                                                                                                                            format: 'h:i A'
                                                                                                                                                        });
                                                                                                                    }
                                                                                                          );
                            
                            
                            
                            
                            
                                                        //Create a label for Event Location
                                                        var $EventLocationLabel = $('<label>',
                                                                                               {
                                                                                                 id: 'EventLocationLabel',
                                                                                                 class: 'CreateEventLabel'
                                                                                               }
                                                                                   ).append(
                                                                                            $('<span>',     //Whats shown next to the input
                                                                                                      {
                                                                                                        text: 'Event Location'
                                                                                                      }
                                                                                              )
                                                                                            ).append(
                                                                                                     $('<input>',     //Input for the Event Location
                                                                                                                   {
                                                                                                                    type: 'text',
                                                                                                                    class:'TimePicker_Event',
                                                                                                                    name: 'EventLocation',
                                                                                                                    required: "true",
                                                                                                                    autocomplete: 'off'
                                                                                                                   }
                                                                                                       )
                                                                                                     );
                                                        
                                                        
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($EventLocationLabel);

                            
                                                        //Create a label for Event Description
                                                        var $EventDescriptionLabel = $('<label>',
                                                                                                {
                                                                                                  id: 'EventDescriptionLabel',
                                                                                                  class: 'CreateEventLabel'
                                                                                                }
                                                                                    ).append(
                                                                                             $('<span>',     //Whats shown next to the input
                                                                                                       {
                                                                                                         text: 'Event Description'
                                                                                                       }
                                                                                               )
                                                                                             ).append(
                                                                                                      $('<textarea>',     //Input for the Event Description
                                                                                                                    {
                                                                                                                      placeholder: 'Brief Description of event',
                                                                                                                      rows: 4,
                                                                                                                      maxlength: 400,
                                                                                                                      name: 'EventDescription',
                                                                                                                      required: "true",
                                                                                                                      autocomplete: 'off'
                                                                                                                    }
                                                                                                        )
                                                                                                      );
                                                        
                                                        
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($EventDescriptionLabel);
                            
                            
                            
                                                        //Add the submit button
                                                        //Create a label for Event Description
                                                        var $CreateEventSubmit = $('<input>',
                                                                                               {
                                                                                                 type: 'submit',
                                                                                                 id: 'CreateEventSubmit',
                                                                                                 value: 'Create Event'
                                                                                               }
                                                                                   );
                                                        
                                                        
                                                        //Append it to the CreateEventForm
                                                        $CreateEventForm.append($CreateEventSubmit);
                            
                            
                            
                                                        //Append the close event SVG sign
                                                        var $CloseEvent = $('<img>',
                                                                                   {
                                                                                       src: './assets/images/Close_Message.svg',
                                                                                       width: '15px',
                                                                                       id: 'CloseEventButton'
                                                                                   }
                                                                           );
                            
                            
                                                        //Append it to the CreateEvent
                                                        $CreateEvent.append($CloseEvent);
                            
                            

                            
                            
                            
                                                    }
                            
                                                }
                            
                            
                            );

 
 
 
             //Clicking on the CloseEventButton SVG, it removes the event
             $(document).on('click', '#CloseEventButton',
                            
                                                        function()
                                                        {
                                                            $('.BodyNavClicked').removeClass('BodyNavClicked');
                            
                                                            //Remove the datepicker
                                                            $('.xdsoft_datetimepicker').remove();
                                                            //Remove the event creation section
                                                            $('#CreateEventSection').remove();
             
                                                            //unwrap div with the class for blurring the background from #ProfileHeader
                                                            $('#ProfileHeader').unwrap();

                                                        }
                            );
 
 
 
 
             //Clicking on the #EventTypeLabel form input, opens the sport picker and clicking again toggles/closes it
             $(document).on('click', '#EventTypeLabel input',
                            
                                                            function()
                                                            {
                                                                //Toggle the sport picker
                                                                $('#AvailableEventTypes').toggleClass( 'HideAvailableEventTypes' );
                                                            }
                            );
 
 
             //Clicking on any .CreateEventLabel form input
             $(document).on('click', '#CreateEventForm .CreateEventLabel',
                            
                                                            function()
                                                            {
                                                                //Only remove the sport picker, if we did NOT click on #EventTypeLabel
                                                                if( $(this).attr('id') != 'EventTypeLabel' )
                                                                {
                                                                    //If the sport picker is not hidden, and is being shown
                                                                    if( !$('#AvailableEventTypes').hasClass( 'HideAvailableEventTypes' ) )
                                                                    {
                                                                       //Hide the sport picker
                                                                       $('#AvailableEventTypes').addClass( 'HideAvailableEventTypes' );
                                                                    }
                                                                }
                                                            }
                            );
 
 

             //When the user clicks on any of the sports in the EventType input form, update the form value with that event
             $(document).on('click', '#AvailableEventTypes #AvailableEventTypesUL li',
                                                                                     function()
                                                                                     {
                                                                                       //Change the form input value to that sport
                                                                                       $('#EventTypeLabel input').val( $(this).children('p').text() );
                            
                                                    //Add the sport event SVG to the form input
                                                    $('#EventTypeLabel input').css( 'background-image', 'url(' + $(this).children('img').attr('src') + ')');
                                                    $('#EventTypeLabel input').css( 'background-repeat' , 'no-repeat');
                                                    $('#EventTypeLabel input').css( 'background-size', '14px');
                                                    $('#EventTypeLabel input').css('background-position', '3px 5px');
                                                                                     }
                            );
 
 
             $.datetimepicker.setLocale('en');
 
 
 
 
 
 
 /**************************************added by Paul: PARHAM HERE (4) start*************************************************/
 
/***** Change Password section START *****/
 
 //When click on "change password" button, show up section for changing password of user.
 $(document).on("click", "#Change_Pass", showChangePassToUser);
 
 //Show section for changing password of user.
 function showChangePassToUser()
 {
 //Remove other displayed info to display "change password" section.
 removeOtherDisplayedInfo();
 
 var $changePassSection = $("<section/>",
                            {
                            id: "PasswordChange" //Please don't change this ID
                            }
                            );
 
 $changePassSection.insertAfter("#ProfileHeader");
 
 //create form to send the server
 $form_pass = $("<form/>",
                {
                id: "form_pass"
                }
                );
 
 $header = $("<p/>",
             {
             text: "Change Password"
             }
             );
 
 //There are three inputs: current password, new password, confirm new password.
 $currentPass = $("<input>",
                  {
                  type: "password",
                  name: "currentPass",
                  class: "password",
                  value: "",
                  placeholder: "Type current password",
                  pattern: ".{6,13}",
                  required: "true"
                  }
                  );
 
 $newPass = $("<input>",
              {
              type: "password",
              name: "newPass",
              class: "password",
              value: "",
              placeholder: "Type new password",
              pattern: ".{6,13}",
              required: "true"
              }
              );
 
 $confirmPass = $("<input>",
                  {
                  type: "password",
                  name: "confirmNewPass",
                  class: "password",
                  value: "",
                  placeholder: "Confirm new password",
                  pattern: ".{6,13}",
                  required: "true"
                  }
                  );
 
 $change_button = $("<input>",
                    {
                    class: "change_button",
                    type: "submit",
                    value: "Change"
                    }
                    );
 
 $form_pass.append($header);
 $form_pass.append($currentPass);
 $form_pass.append($newPass);
 $form_pass.append($confirmPass);
 $form_pass.append($change_button);
 
 //error message placeholder.
 $error_msg = $("<div/>",
                {
                id: "error_msg"
                }
                );
 
 
 
 $changePassSection.append($form_pass);
 $changePassSection.append($error_msg);
 
 
 
 }
 
 //Request to server when submiting new password.
 $(document).on("submit", "#form_pass",
                function(e)
                {
                e.preventDefault();
                
                //Format into JSON.
                // Format for "change password" section:
                // {"currentPass":<current password>, "newPass":<new password>,
                // "confirmNewPass": <confirm new password>}
                var pass_info  = $("#form_pass").serializeArray();
                
                var data = [];
                var data_dic = {};
                
                $.each(pass_info,
                       function(index, item)
                       {
                       data_dic[item.name] = item.value;
                       }
                       );
                
                //request to server, and the server will send the following status in JSON to the user:
                // status -2: failed to change password since current password doesn't match to the actual one.
                // status -1: failed to change password since new password and its confirmation don't match.
                // status 0: successed to change password.
                $.ajax({
                       type: 'POST',
                       url: "/ChangePassword",  //URL to send to the server
                       dataType: 'JSON',
                       data: data_dic,
                       success: function(response)
                       {
                       
                       console.log(response.status);
                       
                       $("#passwordChangeApproved").remove();
                       $("#error_msg").hide();
                       
                       //send proper error msg on fail, or display approved image on success.
                       if (response.status === -2)
                       {
                       $("#error_msg").text("Please enter the correct current password.");
                       $("#error_msg").show();
                       $("#error_msg").css({
                                           "border":"3px solid red",
                                           "padding":"5px",
                                           "border-radius":"4px"
                                           });
                       
                       }
                       else if (response.status === -1)
                       {
                       $("#error_msg").text("Please enter the same new password.");
                       $("#error_msg").show();
                       $("#error_msg").css({
                                           "border":"3px solid red",
                                           "padding":"5px",
                                           "border-radius":"4px"
                                           });
                       
                       }
                       else
                       {
                       var $ApprovedTick = $('<img>',
                                             {
                                             src: '../assets/images/approved.svg',  //The image url
                                             alt: "Approved",
                                             width: '50px',
                                             id: 'passwordChangeApproved'
                                             }
                                             );
                       
                       //Append it to the header
                       $ApprovedTick.insertBefore('#form_pass');
                       }
                       }
                       }); //End of AJAX
                
                
                }
                );
 
/***** Change Password section END *****/
 
/**************************************added by Paul: PARHAM HERE (4) start*************************************************/


 
    } //End of $(document).ready function




);









