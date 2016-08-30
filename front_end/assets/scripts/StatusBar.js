
$(document).ready
(
    function()
    {
 
 
             /*****************************************Search for User****************************************/
             $(document).on('input', '#header input',
                                function(event)
                                {
                                
                                //We are searching for a new user, remove the previous users shown
                                $('#SearchUserPreviewBox').remove();
                                
                                //Make it all lower-case
                                var UserInput = event.target.value.toLowerCase();
                                
                                //Only send ajax when user starts typing
                                if( UserInput.length != 0 )
                                {
                                $.ajax({
                                       type: 'POST',
                                       url: "/SearchUsers",
                                       dataType: 'JSON',
                                       //Send selected sport to server as JSON
                                       data: { "SearchUserString": UserInput },
                                       //Receives all the matching events
                                       success: function (response)
                                       {
                                           //console.log(response);
                                           
                                           //Only process if matched users were found
                                           if(response.length > 0)
                                           {
                                           
                                           //The box that contains all matched events
                                           //Make it scrollable
                                           var $SearchUserPreviewBox = $('<section>',
                                                                         {
                                                                         id: 'SearchUserPreviewBox'
                                                                         }
                                                                         );
                                           
                                           //insert $SearchUserPreviewBox after the search bar, but make it position absolute
                                           $SearchUserPreviewBox.insertAfter('#SearchBar input');
                                           
                                           //The <ul> inside which we will place the matched users
                                           var $UsersUL = $('<ul>',
                                                            {
                                                            id: 'SearchUsersUL'
                                                            }
                                                            );
                                           
                                           //UL contains all the user previews
                                           $SearchUserPreviewBox.append($UsersUL);
                                           
                                           
                                           //Loop over all the searched users and append them
                                           $.each(response,
                                                      function(index, item)
                                                      {
                                                      
                                                      var $User = $('<div>',
                                                                    {
                                                                    class: 'SearchedUser'
                                                                    }
                                                                    );
                                                      
                                                      var $Name = $('<p>',
                                                                    {
                                                                    //Make the first letter of each word capitalized
                                                                    text: item.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
                                                                    }
                                                                    );
                                                      
                                                      var $Image = $('<img>',
                                                                     {
                                                                     src: item.url,
                                                                     width: '30px',
                                                                     height: '30px',
                                                                     class:  'SearchedUserImage'
                                                                     }
                                                                     );
                                                      
                                                      //Attach a hidden input to user ID
                                                      //So that upon click, we can go to his profile
                                                      var $UserID = $('<input>',
                                                                      {
                                                                      type: 'hidden',
                                                                      name: 'SearchedUserID',
                                                                      value: item.userid
                                                                      }
                                                                      );
                                                      
                                                      
                                                      $User.append($Image);  //Append the Image
                                                      $User.append($Name);   //Append the name
                                                      $User.append($UserID);   //Append the friend id
                                                      
                                                      $UsersUL.append($User);   //Append the user to the list
                                                      
                                                      
                                                      }
                                                  
                                                  );
                                            }
                                       }
                                       }); //End of AJAX
                                }
                                
                                
                                }
                            );
             
             //When a user clicks on a searhed user
             $(document).on('click', '.SearchedUser ',
                                            function()
                                            {
                                                //Remove the displayed SearchUserPreviewBox
                                                $('#SearchUserPreviewBox').remove();
                                                
                                                //Store the clicked friend's ID in a cookie to be accessed by Profile_OthersView.js
                                                $.cookie("FriendIDClicked", $(this).children('input').val());
                                                
                                                //Go back to your friend's page
                                                window.location.replace("/Profile_OthersView.html");
                                            }
                            );
 
 
            /****************************************WebSockets***********************************/
            var NotificationSocket = io('/Notifications');
            var One2OneMessageSocket = io('/One2OneMessaging');
            /************************************************************************************/

             //This user is only listening to FriendNotification only concerning his userid in the "NotificationSocket" socket
             //Only accepts a FriendNotification when add user adds him
             NotificationSocket.on('FriendNotification' + $.cookie("UserID") ,
                                   
                                                       function(msg)
                                                       {
                                                           $('#FB_Friend_SVG p').show();
                                                           $('#FB_Friend_SVG p').text( msg );
                                                           document.getElementById('NotificationSound').play(); //Play Sound
                                                       }
                                   );

 
             //When the user clicks on the friend request icon
             //Show all requests
             $(document).on('click', '#FB_Friend_SVG',
                                            function()
                                            {
                                                //Since we clicked on it, our UNREAD friend requests is now zero so hide it
                                                $('#FB_Friend_SVG p').hide();
                            
                                                //If friend reqs not shown, display them
                                                if(  $('#FriendReqsPreviewBox').length == 0 )
                                                {
                                                    //First remove the ListpplMessagedPreviewBox if it is open
                                                    $('#ListpplMessagedPreviewBox').remove();

                                                    $.ajax({
                                                           type: 'GET',
                                                           url: "/GetFriendRequests",
                                                           dataType: 'JSON',
                                                           //Receives all the friend requests
                                                           success: function (response)
                                                           {
                                                                //console.log(response);
                                                           
                                                               //Only process if any friend requests exist
                                                               if(response.length > 0)
                                                               {
                                                               
                                                               //The box that contains all friend requests
                                                               var $FriendReqsPreviewBox = $('<section>',
                                                                                                         {
                                                                                                           id: 'FriendReqsPreviewBox'
                                                                                                         }
                                                                                             );
                                     
                                                               //Append $FriendReqsPreviewBox under the friend icon
                                                                $FriendReqsPreviewBox.insertAfter('#FB_Friend_SVG');
                                                           
                                                               //The <ul> inside which we will place the friend requests
                                                               var $FriendReqUL = $('<ul>',
                                                                                            {
                                                                                              id: 'FriendReqUL'
                                                                                            }
                                                                                    );
                                                               
                                                               //UL contains all the friend requests
                                                               $FriendReqsPreviewBox.append($FriendReqUL);
                                                               
                                                               
                                                               //Loop over all the friend requests
                                                               $.each(response,
                                                                          function(index, item)
                                                                          {
                                                                          
                                                                          var $Request = $('<div>',
                                                                                                {
                                                                                                  class: 'friendreq'
                                                                                                }
                                                                                           );
                                                                          
                                                                          var $Name = $('<div>',
                                                                                                {
                                                                                                //Make the first letter of each word capitalized
                                                                                                text: item.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
                                                                                                class: 'FriendReqName'
                                                                                                }
                                                                                        );
                                                                          
                                                                          var $Image = $('<img>',
                                                                                                 {
                                                                                                  src: item.url,
                                                                                                  width: '20px',
                                                                                                  height: '20px',
                                                                                                  class:  'FriendReqImage'
                                                                                                 }
                                                                                         );
                                                                      
                                                                          var $DivAccept_Reject = $('<div>',
                                                                                                           {
                                                                                                            class: 'Accept_Reject_icons'
                                                                                                           }
                                                                                                    );
                                                                      
                                                                      
                                                                          //icon to accept the request
                                                                          var $ImageAcceptRequest = $('<img>',
                                                                                                             {
                                                                                                             src: './assets/images/approvefriend.svg',
                                                                                                             width: '13px',
                                                                                                             height: '13px',
                                                                                                             class:  'AcceptFriendReq'
                                                                                                             }
                                                                                                    );
                                                                      
                                                                          //icon to reject the request
                                                                          var $ImageRejectRequest = $('<img>',
                                                                                                              {
                                                                                                              src: './assets/images/rejectfriend.svg',
                                                                                                              width: '13px',
                                                                                                              height: '13px',
                                                                                                              class:  'RejectFriendReq'
                                                                                                              }
                                                                                                    );
                                                                      
                                                                          $DivAccept_Reject.append($ImageAcceptRequest);
                                                                          $DivAccept_Reject.append($ImageRejectRequest);
                                                                      
                                                                          //Attach a hidden input to user ID
                                                                          //So that upon click, we can go to his profile
                                                                          var $UserID = $('<input>',
                                                                                                  {
                                                                                                    type: 'hidden',
                                                                                                    name: 'FriendRequestUserID',
                                                                                                    value: item.userid
                                                                                                  }
                                                                                          );
                                                                      
                                                                      
                                                                          $Request.append($Image);  //Append the Image
                                                                          $Request.append($Name);   //Append the name
                                                                          $Request.append($DivAccept_Reject);  //Append the accept and reject icons
                                                                          $Request.append($UserID);   //Append the friend id
                                                                          
                                                                          $FriendReqUL.append($Request);   //Append the Request to the list
                                                                          
                                                                          
                                                                          }
                                                                      
                                                                      );
                                                                    }
                                                          
                                                           }
                                                           }); //End of AJAX
                                            
                                                }
                            
                                                //Friend reqs are being displayed, toggle it
                                                else $('#FriendReqsPreviewBox').remove();
                            
                                            }
                            
                            );
             
             //Clicks one of the users in the Friend Request Preview Box
             $(document).on('click', '#FriendReqsPreviewBox .friendreq .FriendReqName',
                                                    function()
                                                    {
                                                        //Remove the displayed FriendReqsPreviewBox
                                                        $('#FriendReqsPreviewBox').remove();
                            
                                                        //Store the clicked friend's ID in a cookie to be accessed by Profile_OthersView.js
                                                        $.cookie("FriendIDClicked", $(this).siblings('input').val());
                                                        
                                                        //Go to his profile page
                                                        window.location.replace("/Profile_OthersView.html");
                                                    }
                            );
 
             //User Accepts Friend Request
             $(document).on('click', '.AcceptFriendReq ',
                                                    function()
                                                    {
                            
                                                        var friendidAccepting= $(this).parent().siblings('input').val();
                            
                                                        //The only friend request we have left
                                                        if($(this).parent().parent().siblings().length == 0)  $('#FriendReqsPreviewBox').remove();
                                                        
                                                        //Just Remove the friend request, we accepted
                                                        else  $(this).parent().parent().remove();
                            
                                                        //Tell the server the id of the user we accepted as a friend
                                                        $.ajax({
                                                                type: 'POST',
                                                                url: "/FriendAccepted",
                                                                data: { "friendidaccepted": friendidAccepting },
                                                                dataType: 'text',
                                                                //Receives the path of the user's profile picture in the server
                                                                success: function (response)
                                                                {
                                                               
                                                                }
                                                               }); //End of AJAX
 
                                                    }
                            );
 
             //User Rejects Friend Request
             $(document).on('click', '.RejectFriendReq ',
                                                    function()
                                                    {
                            
                                                    var friendidRejecting= $(this).parent().siblings('input').val();
                            
                                                    //The only friend request we have left
                                                    if($(this).parent().parent().siblings().length == 0)  $('#FriendReqsPreviewBox').remove();
                            
                                                    //Just Remove the friend request, we rejected it
                                                    else  $(this).parent().parent().remove();
                            
                                                    
                                                    //Tell the server the id of the user we rejected as a friend
                                                    $.ajax({
                                                           type: 'POST',
                                                           url: "/FriendRejected",
                                                           data: { "friendidrejected": friendidRejecting },
                                                           dataType: 'text',
                                                           //Receives the path of the user's profile picture in the server
                                                           success: function (response)
                                                           {
                                                           }
                                                           }); //End of AJAX
                                                    }
                            );

 
 
 
 
             //Get the window height for the chat box
             $Window_Height = $(window).height();
             $Window_Width = $(window).width();
             
             
             //Update window_height and the chat box if browser is resized
             $(window).resize
             (
                  function()
                  {
                      //Update Window_Height and Window_Width
                      $Window_Height = $(window).height();
                      $Window_Width = $(window).width();
              
                      //If the chatbox exists, reposition it when window is resized
                      if( $('#ChatBox').length > 0 )
                      {
                          $('#ChatBox').css('top', $Window_Height -  $('#ChatBox').height() );
                          $('#ChatBox').css('left',  $Window_Width - ( $('#ChatBox').width() + ( 0.03 * $Window_Width ) ) );
                          
                          $('#ChatBoxForm').css('top', $Window_Height -  $('#ChatBoxForm').height() );
                      
                      }
                  }
              );

 
 
             //When the user presses the "X" button on the chat, close it
             $(document).on('click', '#ChatBoxClose',
                            
                                                    function()
                                                    {
                                                        //Remove the ChatBox from the page and all the contents inside it
                                                        $('#ChatBox').remove();
                                                    }
                            );

 
 
             //When the user clicks "Message", make a ChatBox pop up at the bottom of the screen like facebook
             $(document).on('click', '#MessageUser',
                            
                                function()
                                {
                                    //Remove any chatbox currently open (ie. might be chatting with somebody else)
                                    $('#ChatBox').remove();
                            
                                    //If we clicked on MessageUser, then we have to be on their profile page so we have their id and name
                                    var UserChattingToName = $('#Profile_UserName').text();
                                    var UserChattingToID = $.cookie("FriendIDClicked");
                            
                                    //If a ChatBox exists, don't make a new one
                                    if( $('#ChatBox').length == 0 )
                                    {
                            
                                        //Make an AJAX call to get message history with this user (if any)
                                        $.ajax({
                                               type: 'POST',
                                               url: "/GetMessageHistoryWithUser",
                                               data: {Chattingtoid: UserChattingToID},
                                               dataType: 'JSON',
                                               //Receives the message history with the user
                                               success: function (response)
                                               {
                                                   //Pass the user's name, their id, and the message history to make a chatbox
                                                   //Convert JSON to JS object
                                                   CreateChatBox(UserChattingToName,UserChattingToID, response);
                                               }
                                               }); //End of AJAX
                            
                                    }
                                }

                            );
 
 
 
             //User clicks on the "FB_Message_SVG" in the status bar
             //Show list of all people they chatted to (like FB)
             $(document).on('click', '#FB_Message_SVG',
                            function()
                            {
                            
                                //Since we clicked on it, our UNREAD message requests is now zero so hide it
                                //The below AJAX request tells the server to update the message notifications in the DB
                                $('#FB_Message_SVG p').hide();
                            
                                //If list of people messaged not shown, display them
                                if(  $('#ListpplMessagedPreviewBox').length == 0 )
                                {
                                    //First remove the #FriendReqsPreviewBox if it is open
                                    $('#FriendReqsPreviewBox').remove();
                                
                                    $.ajax({
                                           type: 'GET',
                                           url: "/GetListPplMessaged",
                                           dataType: 'JSON',
                                           //Receives all the friend requests
                                           success: function (response)
                                           {
                                               //console.log(response);
                                               
                                               //Only process if we have any message list (ie. we messaged people before)
                                               if(response.length > 0)
                                               {

                                               //The box that contains all the people messaged
                                               var $ListpplMessagedPreviewBox = $('<section>',
                                                                                             {
                                                                                              id: 'ListpplMessagedPreviewBox'
                                                                                             }
                                                                                 );
                                               
                                               //Append $ListpplMessagedPreviewBox under the message icon
                                               $ListpplMessagedPreviewBox.insertAfter('#FB_Message_SVG');

                                               //The <ul> inside which we will place the list of people we message
                                               var $MessageUL = $('<ul>',
                                                                        {
                                                                         id: 'PplMessagedUL'
                                                                        }
                                                                 );

                                               //UL contains all the people we messaged
                                               $ListpplMessagedPreviewBox.append($MessageUL);

                                               
                                               //Loop over all the people we message
                                               $.each(response,
                                                      function(index, item)
                                                      {
                                                      
                                                      var $PersonMessaged = $('<div>',
                                                                                       {
                                                                                        class: 'PersonMessaged'
                                                                                       }
                                                                       );
                                                      
                                                      
                                                      var $Image = $('<img>',
                                                                             {
                                                                              src: item.url,
                                                                              width: '25px',
                                                                              height: '25px',
                                                                              class:  'PersonMessagedimg'
                                                                             }
                                                                     );
                                                      
                                                      //Contains the name of the person we messaged and our latest message exchanged
                                                      var $DivName_Message = $('<div>',
                                                                                    {
                                                                                     class: 'PersonMessagedInfo'
                                                                                    }
                                                                                );
                                                      
                                                      var $Name = $('<p>',
                                                                            {
                                                                            //Make the first letter of each word capitalized
                                                                            text: item.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
                                                                            class: 'PersonMessagedName'
                                                                            }
                                                                    );
                                                      
                                                      
                                                      //latest message exhanged witht that user
                                                      var $TheMessage= $('<p>',
                                                                                  {
                                                                                    text: item.chatmessage.substring(0,30) + "...",  //Only show the first 30 characters
                                                                                    class:  'PersonMessagedMessage'
                                                                                  }
                                                                                  );
                                                      
                                                      $DivName_Message.append($Name);
                                                      $DivName_Message.append($TheMessage);
                                                      
                                                      //Attach a hidden input to user ID of the person we messaged
                                                      var $UserID = $('<input>',
                                                                                {
                                                                                  type: 'hidden',
                                                                                  name: 'PersonMessagedUserID',
                                                                                  value: item.userid
                                                                                 }
                                                                      );
                                                      
                                                      
                                                      $PersonMessaged.append($Image);  //Append the Image
                                                      $PersonMessaged.append($DivName_Message);   //Append the name
                                                      $PersonMessaged.append($UserID);   //Append the friend id
                                                      
                                                      $MessageUL.append($PersonMessaged);   //Append the Request to the list
                                                      
                                                      
                                                      }
                                                      
                                                      );
                                                 }
                                           
                                               }
                                               }); //End of AJAX
                            
                                }
                                
                                //list of people messaged is being displayed, toggle it
                                else $('#ListpplMessagedPreviewBox').remove();
                            
                            }
                            
                            );
 
 
 
         //When the user clicks on a ".PersonMessaged" (a person from ListpplMessagedPreviewBox), make a ChatBox pop up at the bottom of the screen like facebook
         $(document).on('click', '.PersonMessaged',
                        
                        function()
                        {
                        
                            //Remove any chatbox currently open (ie. might be chatting with somebody else)
                            $('#ChatBox').remove();
                        
                            //If we clicked on '.PersonMessaged', get their name
                            var UserChattingToName = $(this).children('.PersonMessagedInfo').children('.PersonMessagedName').text();
                            var UserChattingToID = $(this).children('input[name="PersonMessagedUserID"]').val(); //Can't use the cookie for friendid
                        
                            //If a ChatBox exists, don't make a new one
                            if( $('#ChatBox').length == 0 )
                            {
                            
                                //Make an AJAX call to get message history with this user (if any)
                                $.ajax({
                                       type: 'POST',
                                       url: "/GetMessageHistoryWithUser",
                                       data: {Chattingtoid: UserChattingToID},
                                       dataType: 'JSON',
                                       //Receives the message history with the user
                                       success: function (response)
                                       {
                                           //Pass the user's name, their id, and the message history to make a chatbox
                                           //Convert JSON to JS object
                                           CreateChatBox(UserChattingToName,UserChattingToID, response);
                                       }
                                       }); //End of AJAX
                        
                            }
                        }
                        
                        );


 
 
             //Pressing enter sends the message
             $(window).keydown(
                                  function(event)
                                  {
                                    if(event.which==13 && $(event.target).is("textarea#ChatBoxMessage"))
                                    {
                                        event.preventDefault();
                                        var TypedMessage = $("#ChatBoxMessage").val();
                                        var chattingTo = $('#ChatBoxForm input[name="IDChattingTo"]').val(); //Don't use the cookie for friendid
                               
                                        //Append our message to the end of our chatbox
                                       var  $p = $('<p>',
                                                       {
                                                        text: TypedMessage,
                                                        class: 'ChatContentDatas'
                                                       }
                                                   );
                               
                                       //Its a message sent by us
                                       $p.addClass('MessageByMe');
                               
                                       $('#ChatBox #ChatContent').append($p);
                               
                                       //Calculate the height of the chatbox to scroll down automatically
                                       var HeightofChat = 0;
                                       $("#ChatBox #ChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
                                       $("#ChatBox #ChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message
                               
                               
                                        $("#ChatBoxMessage").val(""); //Clear #ChatBoxMessage after sending
                                       //Send our userid, the friendid (person we are chatting to), and the message to the server
                                       //using websockets
                                       One2OneMessageSocket.emit('/SendingMessage', {userid:  $.cookie("UserID"), chattingToid: chattingTo, chatmessage: TypedMessage });
                               
                                    }
                                  }
                             );
 

 
 
             //This user is only listening to ReceiveMessages concerning his userid in the "One2OneMessageSocket" socket
             //Only received messages directed towards him
             One2OneMessageSocket.on('ReceiveMessages' + $.cookie("UserID") ,
                                   
                                                               function(msg)
                                                               {
   
                                                                    //Received a message from somebody (that person's id is stored in msg.fromuserid)

                                                                    //Check if we currently have our chatbox open
                                                                    if(  $('#ChatBox').length > 0 )
                                                                    {
                                                                        //Our chatbox is open
                                     
                                                                        //Check if we are chatting with the user who sent us the message or with someone else
                                                                        if( $('#ChatBoxForm input[name="IDChattingTo"]').val() == msg.fromuserid )
                                                                         {
                                                                            //We are chatting with this person in real-time
                                                                            //Append the received message to the end of our convo
                                                                             var  $p = $('<p>',
                                                                                             {
                                                                                             text: msg.chatmessage,
                                                                                             class: 'ChatContentDatas'
                                                                                             }
                                                                                         );
                                     
                                                                             //Its not a message sent by us
                                                                             $p.addClass('MessageNotByMe');
                                     
                                                                             $('#ChatBox #ChatContent').append($p);
                                     
                                                                             //Calculate the height of the chatbox to scroll down automatically
                                                                             var HeightofChat = 0;
                                                                             $("#ChatBox #ChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
                                                                             $("#ChatBox #ChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message
                                     
                                     
                                                                             //Send our userid to the server to update UnreadNotifications, we read the received message
                                                                             //using One2OneMessageSocket websockets
                                                                             One2OneMessageSocket.emit('/ReadMessage', {userid:  $.cookie("UserID") });
                                     
            
                                                                         }
                                     
                                                                        //We are chatting with someone one
                                                                        //Only play a notification
                                                                        else
                                                                        {
                                                                             $('#FB_Message_SVG p').show();
                                                                             $('#FB_Message_SVG p').text( msg.nummessages );
                                                                             document.getElementById('NotificationSound').play(); //Play Sound
                                                                        }
                                                                    }
                                     
                                                                    //Our chatbox is not currently open
                                                                    //Make a notification
                                                                    else
                                                                    {
                                                                         $('#FB_Message_SVG p').show();
                                                                         $('#FB_Message_SVG p').text( msg.nummessages );
                                                                         document.getElementById('NotificationSound').play(); //Play Sound
                                                                    }
                                     
                                                               }
                                    );
 
 
 
 
 
 
 
 

 
 
 
    } //End of $(document).ready function

);



function CreateChatBox( NameChattingTo, IDChattingTo, MessageHistory )
{
    
        $Window_Height = $(window).height();
        $Window_Width = $(window).width();
    
    
        //Create a dynamic div for the chatbox header
        var $ChatBoxHeader = $('<div>',
                                       {
                                        id: 'ChatBoxHeader'
                                        }
                               );
        
        //Name of the user we want to message to
        var $UserName =  $('<p>',
                               {
                                text: NameChattingTo,
                                class: 'ChatBoxUserName'
                               }
                           );
        
        //"X" svg to close the chat
        var $CloseChat = $('<img>',
                                   {
                                    src: './assets/images/Close_Message.svg',
                                    width: '12px',
                                    id: 'ChatBoxClose'
                                   }
                           );
        
        
        //Append the $UserName and $CloseChat to the $ChatBoxHeader
        $ChatBoxHeader.append($UserName);
        $ChatBoxHeader.append($CloseChat);
        
        
        //Create a new div for the chat box
        //Chatbox is global now
        var  $ChatBox = $('<section>',
                                      {
                                       id: 'ChatBox'
                                      }
                         );
        
        //Append the $ChatBox to the page first
        $('body').append($ChatBox);
        
        
        //$ChatBox should be fixed on the bottom of the page
        //Position should be "Height of window" - "Height of chatbox"
        $ChatBox.css('top', $Window_Height - $ChatBox.height() );
        $ChatBox.css('left',  $Window_Width - ( $('#ChatBox').width() + ( 0.03 * $Window_Width ) ) );
        
        
        $ChatBox.append($ChatBoxHeader);
        
    
        
        var  $ChatContent = $('<div>',
                                      {
                                       id: 'ChatContent'
                                      }
                              );
        
        
        //Add an initial <br/> to prevent overlapping of chatheader and chatcontent
        $ChatContent.append(
                            $('<br/>', {})
                            );
    
    
    
        //Get Message Data from the web server, and append list of previous messages with the user
        $.each(MessageHistory,
                   function(index, item)
                   {
                   
                       //Message was sent by me
                       if(item.sentById == $.cookie("UserID"))
                       {
                           var  $p = $('<p>',
                                           {
                                            text: item.chatmessage,
                                            class: 'ChatContentDatas'
                                           }
                                       );
                           
                           //Add a class so it floats to the left
                           $p.addClass('MessageByMe');
                           
                           $ChatContent.append($p);
                       }
                       
                       //Message was sent by other user
                       else
                       {
                           var  $p = $('<p>',
                                           {
                                            text: item.chatmessage,
                                            class: 'ChatContentDatas'
                                           }
                                       );
                           
                           //Add a class so it floats to the right
                           $p.addClass('MessageNotByMe');
                           
                           $ChatContent.append($p);
                       }
                   
                   }
               );

    
    
        //Append $ChatContent to the $ChatBox
        $ChatBox.append($ChatContent);
    
    
        //Create a form input for the user to be able to type
        var $ChatBoxForm = $('<form>',
                                     {
                                     id: 'ChatBoxForm'
                                     }
                             );
    
    
        //Create a textarea element
        var $ChatBoxFormTextarea = $('<textarea>',
                                                 {
                                                     placeholder: 'Type a message...',
                                                     width:  $ChatBox.width() - 5,   //Width of the chatbox -3px
                                                     id: 'ChatBoxMessage'
                                                 }
                                     );
    
        //Attach a hidden input, ID of the person we are chatting to
        var $ChattingToID = $('<input>',
                                        {
                                         type: 'hidden',
                                         name: 'IDChattingTo',
                                         value: IDChattingTo
                                        }
                              );
    
        //Append the textarea to the form
        $ChatBoxForm.append($ChatBoxFormTextarea);
    
        //Append a hidden input of the id of the user we are chatting to
        $ChatBoxForm.append($ChattingToID);
    
        //Append the form to the ChatBox
        $ChatBox.append($ChatBoxForm);
    
        //position the form at the bottom of the ChatBox
        $ChatBoxForm.css('top', $Window_Height -  $ChatBoxForm.height() );
    
        //Calculate the height of the chatbox to scroll down automatically
        var HeightofChat = 0;
        $("#ChatBox #ChatContent").children().each(function(){HeightofChat = HeightofChat + $(this).outerHeight(true);})
        $("#ChatBox #ChatContent").animate({ scrollTop: HeightofChat }, "slow"); //scroll to the last message

    
}


















