//once the document has loaded
$(document).ready
(
 
     function()
     {
 
         //If this page was loaded after the user registered and was approved
         //(ie. the url includes "?approved=yes")
         if (window.location.href.indexOf("?approved=yes") > -1)
         {
 
             //Append the green approved check mark
             var $ApprovedTick = $('<img>',
                                           {
                                             src: '../assets/images/approved.svg',  //The image url
                                             alt: "Approved",
                                             width: '50px',
                                             id: 'RegistrationApproved'
                                           }
                                   );
 
             //Append it to the header
             $('header').append($ApprovedTick);
 
         }
 
 
         $("form#UserLoginForm").on("submit",
                                    
                                    function(e)
                                    {

                                        //Prevent Default Submittin
                                        e.preventDefault();
                                        
                                        
                                        //Remove any previous error messages that were displayed
                                        var error = "";
                                        $("#error_mes").text(error);
                                        $("#error_mes").hide();

                                        //Convert Form Data into an array
                                        var FormData = ($("#UserLoginForm").serializeArray());

                                        //Submit the form via AJAX
                                       $.ajax({
                                                  type: 'POST',
                                                  url: "/WebSiteUserLogin",  //URL to send to send to the server
                                                  dataType: 'JSON',
                                                  data: FormData,
                                                  success: function (response)
                                                  {
                                              
                                                        //No need to touch response, use it as received
                                                        //response[0].KeyName
                               
                   
                                                      //The login was approved
                                                      if(response[0].ResponseText == "ok")
                                                      {
                                                         //console.log('Success');
                                              
                                                         //Load User's Profile Information
                                                          window.location.replace("/Profile_SelfView.html");
                                                         //There will be an AJAX in the script for that page
                                              
                                                      }

                                                      //Invalid username or password
                                                      else if(response[0].ResponseText == "invalidlogin")
                                                      {
                                                          var error = "";
                                                          error += "Invalid Username or Password";
                                                          $("#error_mes").text(error);
                                                          $("#error_mes").show();
                                                          $("#error_mes").css({
                                                                              "border":"3px solid red",
                                                                              "padding":"5px",
                                                                              "border-radius":"4px"
                                                                              });
                                                      }

                                                      else
                                                      {
                                                          var error = "";
                                                          error += "Can't login right now";
                                                         $("#error_mes").text(error);
                                                          $("#error_mes").show();
                                                          $("#error_mes").css({
                                                                              "border":"3px solid red",
                                                                              "padding":"5px",
                                                                              "border-radius":"4px"
                                                                              });
                                                      }
                                    
                                                }
                                              });
                                    
                                        
                                    }
                                    );
 
 
 
     } //End of ready function
 );
















