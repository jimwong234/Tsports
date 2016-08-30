$(document).ready(function(){
	$("form#AdminLoginForm").on('submit',function(e){
		//Prevent Default Submitting
        e.preventDefault();
        var formData = $("form#AdminLoginForm").serializeArray();

        //Remove any previous error messages that were displayed
        var error = "";
        $("#error_mes").text(error);
        $("#error_mes").hide();
 
        $.ajax({
        	type:'POST',
        	url:'/WebsiteAdminLogin',
        	dataType:'text',
        	data:formData,
        	success:function(response){
        		if(response == "ok"){
        			//login successfully
        			window.location.replace("/admin_page.html");
        		}
        		else if(response == "loginfailed"){
        			//login failed (account||password incorrect)
        			var error = "";
		          	error += "Invalid Username or Password";
		          	$("#error_mes").text(error);
		         	$("#error_mes").show();
		         	$("#error_mes").css({
			        	"border":"3px solid red",
		              	"padding":"5px",
		              	"border-radius":"4px",
		              	"margin-left":"100px"
		            });
        		}else{
        			//login failed (query database error)
        			var error = "";
	                error += "Can't login right now";
	                $("#error_mes").text(error);
	                $("#error_mes").show();
	                $("#error_mes").css({
		                "border":"3px solid red",
		                "padding":"5px",
		                "border-radius":"4px",
		                "margin-left":"100px"
                    });

        		}
        	}
        });
	});
});