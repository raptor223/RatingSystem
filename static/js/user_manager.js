
$(document).ready(function(){

	$("#b_addadmin").click(function(){

		var username = $("#t_username").val();
		var password = $("#t_password").val();

		if(username == "" || password == "")
			console.log("Username or Password is Empty");
		else{


			$.ajax({
				url: '/accountAdmin',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data:JSON.stringify({
					Username: username,
					Password: password,
				}),

				success: function(msg){
					console.log("msg")
				}
			})
		}

	})

	$("#b_adduser").click(function(){

		var username = $("#t_username").val();
		var password = $("#t_password").val();

		if(username == "" || password == "")
			console.log("Username or Password is Empty");
		else{


			$.ajax({
				url: '/account',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data:JSON.stringify({
					Username: username,
					Password: password,
				}),

				success: function(msg){
					console.log("msg")
				}
			})
		}
	});

});