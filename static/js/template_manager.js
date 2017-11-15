
$(document).ready(function(){

	function sendRatingToServer(websiteID, username, rating){

		console.log(""+websiteID+", "+username+", "+rating+"");

		$.ajax({
			url: '/websiteRating',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data:JSON.stringify({
				WebsiteID: websiteID,
				Username: username,
				Rating: rating
			}),
			success: function(msg){
				console.log("Rating successfully send")
			}
		});

	}
	window.sendRatingToServer=sendRatingToServer;

	function getUserWebsiteRating(username, websiteID){

		$.ajax({
			url: '/getUserRating',
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			data:{
				WebsiteID: websiteID,
				Username: username
			},
			success: function(msg){
				console.log(msg.data)

				websiteItem = msg.data
				$("#t_rating_"+websiteItem['WebsiteID']+"").val(websiteItem['Gewichtung'])

			}
		});

	}

	window.getUserWebsiteRating=getUserWebsiteRating;

	function acceptRequestWebsiteItem(websiteID,username){
		
		$.ajax({
			url: '/acceptRequestWebsiteItem',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data:JSON.stringify({
				WebsiteID: websiteID,
				Username: username
			}),
			success: function(msg){
				console.log(msg.data)
			}
		});
	}

	window.acceptRequestWebsiteItem=acceptRequestWebsiteItem;

	function getWebsites(username, isAdmin, showAsUser=false){

		console.log(showAsUser)

		$.ajax({
		url: '/websiteAvailable',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		data: {
			Username: username,
			ShowAsUser: showAsUser
		},
		success: function(msg){
					console.log(msg)
					for(web_id in msg){

						var id = web_id
						var websiteID = msg[web_id].WebsiteID
						//console.log(id)
						var webname = msg[web_id].Webname
						//console.log(webname)
						var country = msg[web_id].Country
						//console.log(country)
						var URL = msg[web_id].URL
						var showAsUser = msg[web_id].ShowAsUser
						//console.log(URL)
						/**
						template_card = {}
						$.get("static/templates/template_card.html", function (data) {
		            		template_card = $.parseHTML(data)
		            		$( ".result" ).html( data );
		        		});
		        		//data.getElementById("Webname").value = entry['url']
		            	$("#Webname", template_card).text(id);
		            	console.log($("#Webname", template_card).text())
		            	$("#card_display").append(template_card);
						**/
						user = localStorage.getItem('username')
						console.log(user)

						if(isAdmin == true){
							console.log("append new Admin Items")


							$("#card_display").append(
							            	"<div class='col-lg-6 col-md-6 mb-4' id='card_template_"+websiteID+"'>"+
										    	"<div class='card h-100'>"+
										    		"<div class='card-body'>"+
										          		"<h4 class='card-title'>"+
										            	""+webname+""+
										          		"</h4>"+
										          		"<h5><a href='http://"+URL+"'' id='URL'>"+URL+"</a></h5>"+
										          		"<p class='card-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>"+
										          		"<button id='b_acceptRequest_"+websiteID+"' type='button' class='btn btn-primary' style='color: black;'>Confirm Request</button>"+
										        	"</div>"+
										        	"<div class='card-footer'>"+
									          			"<small class='text-muted'>"+
									          				"<a href='#' id='"+websiteID+"_onestar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_twostar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_threestar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_fourstar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_fivestar'>&#9734;</a>"+
									          			"</small>"+
									          			"<input type='input' name='rating' id='t_rating_"+websiteID+"' style='color: black' placeholder='Rating'></input>"+
										       		"</div>"+
										      	"</div>"+
										      	"<script>"+
										      		"$(document).ready(function(){"+
										      			"if("+showAsUser+"==true){"+
										      				"$('#b_acceptRequest_"+websiteID+"').remove()"+
										      			"}"+
										      			"getUserWebsiteRating(user, "+websiteID+");"+
										      			"$('#b_acceptRequest_"+websiteID+"').click(function(){"+
										      				"acceptRequestWebsiteItem("+websiteID+",user);"+
										      				//Clear the Dashboard
										      				"$('#card_display').empty();"+
										      				"getWebsites(user, true, false)"+
										      			"});"+
										      			"$('#"+websiteID+"_onestar').click(function(){"+
										      				"console.log('"+websiteID+"_onestar');"+ 
										      				"console.log('"+user+"_onestar');"+
										      				"sendRatingToServer("+websiteID+",user,1.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_twostar').click(function(){"+
										      				"console.log('"+websiteID+"_twostar');"+ 
										      				"sendRatingToServer("+websiteID+",user,2.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_threestar').click(function(){"+
										      				"console.log('"+websiteID+"_threestar');"+ 
										      				"sendRatingToServer("+websiteID+",user,3.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_fourstar').click(function(){"+
										      				"console.log('"+websiteID+"_fourstar');"+ 
										      				"sendRatingToServer("+websiteID+",user,4.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_fivestar').click(function(){"+
										      				"console.log('"+websiteID+"_fivestar');"+ 
										      				"sendRatingToServer("+websiteID+",user,5.0);"+
										      			"});"+
										      		"});"+
										      	"</script>"+
										    "</div>" 
					    				);
						}else{
							console.log("append new Items")
							$("#card_display").append(
							            	"<div class='col-lg-6 col-md-6 mb-4' id='card_template_"+websiteID+"'>"+
										    	"<div class='card h-100'>"+
										    		"<div class='card-body'>"+
										          		"<h4 class='card-title'>"+
										            	""+webname+""+
										          		"</h4>"+
										          		"<h5><a href='http://"+URL+"'' id='URL'>"+URL+"</a></h5>"+
										          		"<p class='card-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>"+
										          		
										        	"</div>"+
										        	"<div class='card-footer'>"+
									          			"<small class='text-muted'>"+
									          				"<a href='#' id='"+websiteID+"_onestar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_twostar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_threestar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_fourstar'>&#9733;</a>"+
									          				"<a href='#' id='"+websiteID+"_fivestar'>&#9734;</a>"+
									          			"</small>"+
									          			"<input type='input' name='rating' id='t_rating_"+websiteID+"' style='color: black' placeholder='Rating'></input>"+
										       		"</div>"+
										      	"</div>"+
										      	"<script>"+
										      		"$(document).ready(function(){"+
										      			"getUserWebsiteRating(user, "+websiteID+");"+
										      			"$('#"+websiteID+"_onestar').click(function(){"+
										      				"console.log('"+websiteID+"_onestar');"+ 
										      				"console.log('"+user+"_onestar');"+
										      				"sendRatingToServer("+websiteID+",user,1.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_twostar').click(function(){"+
										      				"console.log('"+websiteID+"_twostar');"+ 
										      				"sendRatingToServer("+websiteID+",user,2.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_threestar').click(function(){"+
										      				"console.log('"+websiteID+"_threestar');"+ 
										      				"sendRatingToServer("+websiteID+",user,3.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_fourstar').click(function(){"+
										      				"console.log('"+websiteID+"_fourstar');"+ 
										      				"sendRatingToServer("+websiteID+",user,4.0);"+
										      			"});"+
										      			"$('#"+websiteID+"_fivestar').click(function(){"+
										      				"console.log('"+websiteID+"_fivestar');"+ 
										      				"sendRatingToServer("+websiteID+",user,5.0);"+
										      			"});"+
										      		"});"+
										      	"</script>"+
										    "</div>" 
					    				);

						}
		            	
					}
				}

			})	
			.done(function() {

				console.log($("#b_showItemsAsUser").length)

				if(isAdmin == true && $("#b_showItemsAsUser").length <= 0){

					$("#navbar_top").append(
											""+
											"<li class='nav-item' id='container_asUser'>"+
								              "<button id='b_showItemsAsUser' type='button' class='btn btn-primary' style='color: black'>Show Items as User</button>"+
								            "</li>"+
								            ""+
								            "<script>"+
									      		"$(document).ready(function(){"+
									      			"$('#b_showItemsAsUser').click(function(){"+
									      				"getWebsites('"+localStorage.getItem('username')+"', true, true);"+
									      			"});"+
									      		"});"+
											"</script>"+
								            "")
				}
				else if($("#b_showItemsAsUser").length > 0){
					$("#container_asUser").remove()
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}

	window.getWebsites=getWebsites;
	


	$("#b_addtemplate").click(function(){

		console.log("Added Template")

		$.get("static/templates/template_card.html", function (data) {
            $("#card_display").append(data);
        });


	});

	$("#b_addtemplate").click(function(){

		console.log("Added Template")

	});

	$("#b_addWebsiteRequest").click(function(){

	
		var url = $("#t_url").val();
		var webname = $("#t_webname").val();
		var country = $("#t_country").val();

		if(url == "" || webname == "" || country == "")
			console.log("url or webname is Empty");
		else{


			$.ajax({
				url: '/newWebsiteRequest',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data:JSON.stringify({
					URL: url,
					Webname: webname,
					Land: country
				}),

				success: function(msg){
					console.log("msg")
				}
			}).fail(function(failData){
				console.log(failData.responseText)
			});
		}
	});

});

