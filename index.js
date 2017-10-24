const DARKSKY_API_URL ="https://api.darksky.net/forecast/";
let i=0;
var skycons = new Skycons({"color": "pink"});

function getDataFromDarkSky()
{
	let d =Math.floor(Date.now()/1000 + i*86400);
	console.log(d, typeof d);
	i++;
	$.ajax({
    type:"GET",
    url: `https://api.darksky.net/forecast/6a31534b1bd30234128d6f4e569d2fa9/42.3601,-71.0589,${d}`,
    success: function(data) {
    	console.log(data);
    	addSkycon(data);
      //$('.text').text(JSON.stringify(data));
    },
    dataType: 'jsonp',
  });
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

	var s1 =data.currently.icon.toUpperCase().replace(/-/g, '_') + i;

	console.log(s1);

	$('body').append(`<canvas id="${s1}" width="128" height="128"></canvas>`);
	var s2=s1.slice(0, -1);
	console.log(s2, typeof s2);

	skycons.add(document.getElementById(s1), Skycons[s2]);
	//skycons.add(s, Skycons[s]);
	skycons.play();

}

function watchSubmit()
{
	$('.js-location-form').submit(function (event)
	{
		event.preventDefault();

		const queryText = $(event.currentTarget).find(".js-location-text");

		const query = queryText.val();

		console.log(query);

		getDataFromDarkSky();
	});
}

$(watchSubmit());