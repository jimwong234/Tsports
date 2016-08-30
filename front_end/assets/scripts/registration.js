//once the document has loaded
$(document).ready
(
 
 function()
 {

 
 $("form#UserRegistration").on("submit",
                               
                               function(e)
                               {
                               
                                   //Prevent Default Submittin
                                   e.preventDefault();
                                   
                                   //If the passwords aren't the same, give an error
                                   var pw = $("#password input").val();
                                   var cfpw = $("#cfpassword input").val();
                                   if(pw != cfpw)
                                   {
                                       var error = "";
                                       error += "Please enter the same password.";
                                       $("#error_mes").text(error);
                                       //may change form attributes here like height
                                       $("main").css("height","600px");
                                       $("#error_mes").show();
                                       $("#error_mes").css({
                                                               "top":"508px",
                                                               "border":"3px solid red",
                                                               "padding":"5px",
                                                               "border-radius":"4px"
                                                           });
                                       
                                       //Gives an error (A box saying 'Please enter the same password' )
                                       return false;
                                   }
                                   
                                   //The Form passed all Client-Side Validations
                                   else
                                   {
                                       //Remove any previous error messages that were displayed
                                       var error = "";
                                       $("#error_mes").text(error);
                                       $("#error_mes").hide();
                                       
                                       
                                       
                                       //Convert Form Data into an array
                                       var FormData = ($("#UserRegistration").serializeArray());
                                       
                                       
                                       //Submit the form via AJAX
                                       $.ajax({
                                              type: 'POST',
                                              url: "/UserRegistration",
                                              dataType: 'text',
                                              data: FormData,
                                              success: function (response)
                                              {
                                              
                                                  console.log(response);
                                              
                                                  //The registration was approved
                                                  if(response == "ok")
                                                  {
                                                    //Redirect to the login page (with a green check mark)
                                                    window.location.replace("/login.html" + "?approved=yes");

                                                  }
                                              
                                                  //Error (Email aready existed)
                                                  else if(response == "emailexists")
                                                  {
                                                      var error = "";
                                                      error += "Email Aready Exists";
                                                      $("#error_mes").text(error);
                                                      //may change form attributes here like height
                                                      $("main").css("height","600px");
                                                      $("#error_mes").show();
                                                      $("#error_mes").css({
                                                                              "top":"508px",
                                                                              "border":"3px solid red",
                                                                              "padding":"5px",
                                                                              "border-radius":"4px"
                                                                          });
                                                  }
                                              
                                                  else
                                                  {
                                                      var error = "";
                                                      error += "Error. Can't Sign up Right Now";
                                                      $("#error_mes").text(error);
                                                      //may change form attributes here like height
                                                      $("main").css("height","600px");
                                                      $("#error_mes").show();
                                                      $("#error_mes").css({
                                                                          "top":"508px",
                                                                          "border":"3px solid red",
                                                                          "padding":"5px",
                                                                          "border-radius":"4px"
                                                                          });
                                                  }

                                              }
                                              });
                                   }
                               
                               }
                               );
 
 } //End of ready function
 );

