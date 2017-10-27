const DARKSKY_API_URL ="https://api.darksky.net/forecast/";
let i=0;
var skycons = new Skycons({"color": "red"});

function getDataFromGoogleMaps(locationText)
{
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':locationText}, function (results, status)
		{
			if(status == 'OK')
			{
				let long = results[0].geometry.location.lng();
				let lat = results[0].geometry.location.lat();

				console.log(lat, long);
				getDataFromDarkSky(lat, long);
				//return results[0].geometry.location.toString();
			}

			else
			{
				alert(status);
			}
		});
	
}

function getDataFromDarkSky(lat, long)
{

	$('.calendar').html('');
	for(let i =0;i<30;i++)
	{
		//console.log(loc, typeof loc);
		let d =Math.floor(Date.now()/1000 + i*86400);
		//console.log(d, typeof d);
		//i++;
	$.ajax({
	    type:"GET",
	    url: `https://api.darksky.net/forecast/6a31534b1bd30234128d6f4e569d2fa9/${lat}, ${long},${d}`,
	    success: function(data) {
	    	console.log(data);
	    	addSkycon(data);
	    },
	    dataType: 'jsonp',
	  });
	}
}

/*
  var skycons = new Skycons({"color": "pink"});
  // on Android, a nasty hack is needed: {"resizeClear": true}

  // you can add a canvas by it's ID...
  skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY);

  // ...or by the canvas DOM element itself.
  skycons.add(document.getElementById("icon2"), Skycons.RAIN);

  // if you're using the Forecast API, you can also supply
  // strings: "partly-cloudy-day" or "rain".

  // start animation!
  skycons.play();

  // you can also halt animation with skycons.pause()

  // want to change the icon? no problem:
  skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);

  // want to remove one altogether? no problem:
  skycons.remove("icon2");

  */


function addSkycon(data)
{

	var s1 =data.currently.icon.toUpperCase().replace(/-/g, '_') + i; //create canvas id 
	i++; //increment the id number
	//console.log(s1);

	$('.calendar').append(`<canvas id="${s1}"></canvas>`);
	
	if(i <= 10)   // take of the id number
	{
		var s2=s1.slice(0, -1); 
	}
	else
	{
		var s2=s1.slice(0,-2); 
	}
	//console.log(s2, typeof s2);

	skycons.add(document.getElementById(s1), Skycons[s2]); //add the skycon to the body

}


function watchButtonPress()
{

	$('.mover-contatiner').on('click', $('.js-mover-button'), function (event)
	{
		console.log('mover button is working');
		$('.ball').toggleClass('left');
	})
	
	   /*if(event.keyCode == 68) 
	   { // when d key is pressed 
	    
	      $('.ball').addClass('left')
	      console.log('keypress worked');
	  	}*/
}	



function watchSubmit()
{
	$('.js-location-form').submit(function (event) //when Enter is pressed
	{
		event.preventDefault();

		const queryText = $(event.currentTarget).find(".js-location-text"); //get the value in the text box

		const query = queryText.val();

		console.log(query);

		const loc = getDataFromGoogleMaps(query); //get the latitude and longitude 

		//getDataFromDarkSky(loc); //send the location data to the dark sky api
	});
}

function inputHandler()
{
	watchSubmit();
	watchButtonPress();
}

$(inputHandler());
//getDataFromGoogleMaps('seattle');