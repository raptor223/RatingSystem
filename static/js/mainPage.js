
//var loggedIn = false;

$(document).ready(function(){

	localStorage.setItem("loggedIn", false);
	checkSignedIn()

	$("#b_login").click(function(){

		var username = $("#top_username").val()
		var password = $("#top_password").val()

		$.ajax({
				url: '/accountSignin',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data:JSON.stringify({
					Username: username,
					Password: password,
				}),
				success: function(msg){
					//IF ADMIN 
					console.log("IsAdmin: "+msg.admin)

					if(msg.admin == true){
						//$.getscript("template_manager.js",function(){
							$(function(){
								getWebsites(username, msg.admin, false);
							});
								
							
						//});
					}else{
						$(function(){
								console.log("Not Admin, so get Items")
								getWebsites(username, msg.admin, true);
						});
					}
				}
		});
		

		if(typeof(Storage) !== "undefined"){
			localStorage.setItem("username", $("#top_username").val());
			localStorage.setItem("password", $("#top_password").val());
			
			localStorage.setItem("loggedIn", "true");		
		}

		checkSignedIn();
	});
	

	function checkSignedIn(){

		if(localStorage.getItem("loggedIn") == "false"){
			$("#navbar_top").append(
				""+
				"<li class='nav-item' id='container_username'>"+
	              "<input class='input' id='top_username' placeholder='Username' style='margin: 2%'>"+
	            "</li>"+
	            "<li id='container_password'>"+
	              "<input class='password' id='top_password' placeholder='Password' style='margin: 2%; '>"+
	            "</li>"+
	            "<li id='container_button'>"+
	              "<button id='b_login' type='button' class='btn btn-primary' style='color: black; '>Login</button>"+
	            "</li>"+
	            "")
		}else{

			$("#navbar_top").append(
				""+
				"<li class='nav-item' id='l_username'>"+
	              "<a class='nav-link' href='#'>Username:</a>"+
	            "</li>"+
	            "<li id='container_username'>"+
	              "<a class='nav-link' href='#'>"+localStorage.getItem("username")+"</a>"+
	            "</li>"
	            )

			$("#container_username").remove()
			$("#container_password").remove()
			$("#b_login").remove()
		}

	}
});

