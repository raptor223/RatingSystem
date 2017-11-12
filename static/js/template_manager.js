
$(document).ready(function(){

	$.ajax({
		url: '/websiteAvailable',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		
		success: function(msg){
			console.log(msg)
			for(web_id in msg){

				var id = web_id
				//console.log(id)
				var webname = msg[web_id].Webname
				//console.log(webname)
				var country = msg[web_id].Country
				//console.log(country)
				var URL = msg[web_id].URL
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

            	$("#card_display").append(
							            	"<div class='col-lg-6 col-md-6 mb-4' id='card_template'>"+
										    	"<div class='card h-100'>"+
										    		"<div class='card-body'>"+
										          		"<h4 class='card-title'>"+
										            	""+webname+""+
										          		"</h4>"+
										          		"<h5><a href='http://"+URL+"'' id='URL'>"+URL+"</a></h5>"+
										          		"<p class='card-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>"+
										        	"</div>"+
										        	"<div class='card-footer'>"+
									          			"<small class='text-muted'>&#9733; &#9733; &#9733; &#9733; &#9734;</small>"+
										       		"</div>"+
										      	"</div>"+
										    "</div>" 
			    );












			}
		}
	})	
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	

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

