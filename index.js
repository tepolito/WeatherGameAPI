const DARKSKY_API_URL ="https://api.darksky.net/forecast/";
let i=0;
var skycons = new Skycons({"color": "red"});
var skyconsBig = new Skycons({"color": "yellow"});
const ICON_ARR=[];
var index =0;

function generateRandomNumber()
{
	return Math.floor((Math.random() * 7) + 1);
}

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
				var deferreds = getDataFromDarkSky(lat, long)

				$.when.apply(null, deferreds).done(function() 
				{
					//$("div").append("<p>All done!</p>");
					startGame();
				});
				//getDataFromDarkSky(lat, long);
			}

			else
			{
				alert(status);
			}
		});
	
}

function getDataFromDarkSky(lat, long)
{
	var promises = [];

	$('.calendar').html('');
	for(let i =0;i<30;i++)
	{
		//console.log(loc, typeof loc);
		let d =Math.floor(Date.now()/1000 + i*86400);
		//console.log(d, typeof d);
		//i++;
	promises.push(
		$.ajax(
		{
		    type:"GET",
		    url: `https://api.darksky.net/forecast/d9477455529c72ec124ab386f26597e8/${lat}, ${long},${d}`,
		    success: function(data) {
		    	console.log(data)
		    //	ICON_ARR.push(addSkycon(data));
		    	addSkycon(data)
		    	//console.log(ICON_ARR[i]);
		    },
		    dataType: 'jsonp'
	  })
		)

	}

	//$('.calendar').css('overflow', 'hidden');

	return promises;
}

function addSkycon(data)
{
	let icon = data.currently.icon.toUpperCase().replace(/-/g, '_');
	let date = Date.now();

	$('.calendar').append(`<canvas id="${date}"></canvas>`);

	ICON_ARR.push({id:date, icon:icon});

	skycons.add(document.getElementById(date), Skycons[icon]);
}

function createToday()
{
	
	if(!ICON_ARR[index])
	{
		return;
	}

	skyconsBig.set(document.getElementById('today'), Skycons[ICON_ARR[index].icon]);
	dataUrl = document.getElementById('today').toDataURL();
  	document.getElementById('calendar-info').style.background='url('+dataUrl+')';
	console.log(index);
	skyconsBig.play();
	scrollCalendar();
	index++;
}

function scrollCalendar()
{
	
	console.log(ICON_ARR[index]);
	let id = ICON_ARR[index].id;
	$('.calendar').animate({
            scrollLeft: $("#"+id).offset().left+ $('.calendar').scrollLeft()

        },
            'slow');
	
	
}

function startGame()
{
	//setInterval(createToday, 500);
	createToday();
	$(window).scroll(function()  //makes it so the screen is locked in place. no scroll
	{
        $(this).scrollTop($(window).scrollTop()).scrollLeft($(window).scrollLeft());
    });
}

/*$(function() 
{
    $('.js-mover-button').click(function() 
    {
        var deferreds = getDataFromDarkSky(lat, long)

        $.when.apply(null, deferreds).done(function() 
        {
            $("div").append("<p>All done!</p>");
        });
    });
});*/
/*function addSkycon(data)
{

	var s1 =data.currently.icon.toUpperCase().replace(/-/g, '_') + i; //create canvas id 
	i++; //increment the id number
	//console.log(s1);

	//$('.calendar').append(`<canvas id="${s1}"></canvas>`);
	
	if(i <= 10)   // take of the id number
	{
		var s2=s1.slice(0, -1); 
	}
	else
	{
		var s2=s1.slice(0,-2); 
	}
	//console.log(s2, typeof s2);
	 let sky = skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY);
	 console.log(`sky is ${sky}`);

	 $('.calendar').append(sky);
	//skycons.add(document.getElementById(s1), Skycons[s2]); //add the skycon to the body

	return s1;

}
*/

function watchButtonPress()
{

	$('.mover-container').on('click', $('.js-mover-button'), function (event)
	{
		console.log('mover button is working');

		createToday();

		let rndNum = generateRandomNumber();
		if(rndNum == 1)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 2)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-1`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 3)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-1`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 4)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-1`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 5)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-1`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 6)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-1`);
			$('.mover-container').removeClass(`rnd-loc-7`);		
		}
		else if(rndNum == 7)
		{
			$('.mover-container').toggleClass(`rnd-loc-${rndNum}`);
			$('.mover-container').removeClass(`rnd-loc-2`);
			$('.mover-container').removeClass(`rnd-loc-3`);
			$('.mover-container').removeClass(`rnd-loc-4`);
			$('.mover-container').removeClass(`rnd-loc-5`);
			$('.mover-container').removeClass(`rnd-loc-6`);
			$('.mover-container').removeClass(`rnd-loc-1`);		
		}	
	})
	
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

		$('.info-container').hide();
		$('.location-form').hide();
		$('.today-container').show();

		//setTimeout(function(){ createToday() } , 2000);

		//getDataFromDarkSky(loc); //send the location data to the dark sky api
	});
}

function inputHandler()
{
	$('.today-container').hide();
	watchSubmit();
	watchButtonPress();
}

$(inputHandler());
//getDataFromGoogleMaps('seattle');

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
  skycons.remove("icon2"); */

  