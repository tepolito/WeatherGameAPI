const DARKSKY_API_URL ="https://api.darksky.net/forecast/";
let i=0;
var skycons = new Skycons({"color": "black"});
var skyconsBig = new Skycons({"color": "black"});
const ICON_ARR=[];
var index =0;
var currentDay;

function getDataFromGoogleMaps(locationText)
{
	//alert('getDataFromGoogleMaps called');
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
					ICON_ARR.forEach(function (sky)
					{
						$('.calendar').append(`<span class="contains-calendar-day"><canvas class="lil-guy" id="${sky.id}"></canvas> <span  class="calendarWDay" id="0${sky.id}">${sky.wordDay}</span></span>`);
						skycons.add(document.getElementById(sky.id), Skycons[sky.icon]);
					})
					
					startGame();
				});
			}

			else
			{
				alert(status);
			}
		});

	//alert("getDataFromGoogleMaps works");
	
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
		    	console.log(`i is ${i}`);
		    	addSkycon(data, i)

		    },
		    dataType: 'jsonp'
	  })
		)

	}

	return promises;
}

function addSkycon(data, i)
{
	let icon = data.currently.icon.toUpperCase().replace(/-/g, '_');
	let temp = data.currently.temperature;
	let stat = data.currently.summary;
	let tempHigh = data.daily.data['0'].apparentTemperatureHigh;
	let tempLow = data.daily.data['0'].apparentTemperatureLow;
	let date = Date.now();

	let day = new Date(data.currently.time*1000);
	console.log(day.customFormat("#hh#:#mm#"));
	let wordDay = day.customFormat("#DDD#");
	let sunrise = new Date(data.daily.data['0'].sunriseTime*1000).customFormat("#hh#:#mm# #AMPM#");
	let sunset = new Date(data.daily.data['0'].sunsetTime*1000).customFormat("#hh#:#mm# #AMPM#");
	day = day.customFormat("#MM#/#DD#");

	
	ICON_ARR[i] = {id:i, icon:icon, temp:temp, stat:stat, day:day, wordDay:wordDay, tempHigh:tempHigh, tempLow:tempLow, sunrise:sunrise, sunset:sunset};

}

function createToday()
{
	
	if(!ICON_ARR[index])
	{
		return;
	}

	$('.js-calendar-info').html('');

	skyconsBig.set(document.getElementById('today'), Skycons[ICON_ARR[index].icon]);

  	changeInfo(index)

	console.log(index);
	skyconsBig.play();
	changeCurrentDay(index);
	scrollCalendar();
	//changeBackground(index);
	watchCalendarClick();
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

function watchCalendarClick()
{
	$(".calendar").on("click", "canvas", function (e)
	{

		console.log($(this).attr('id'));
		let ind = $(this).attr('id');

		skyconsBig.set(document.getElementById('today'), Skycons[ICON_ARR[ind].icon]);

		skyconsBig.play();

		changeInfo(ind);
		changeCurrentDay(ind);
		//changeBackground(ind);
		init();
	})
}

function startGame()
{
	createToday();
	$(window).scroll(function()  //makes it so the screen is locked in place. no scroll
	{
        $(this).scrollTop($(window).scrollTop()).scrollLeft($(window).scrollLeft());
    });
}

function changeBackground(i)
{
	gif = ICON_ARR[i].icon;
	console.log(`gif = ${gif}`);

	switch(gif)
	{
		case 'CLEAR_DAY': setBackground('images/clear_sun_field.jpg');

						  //setSound('audio/Bird-tweet-sound.mp3');
						  break;

		case 'PARTLY_CLOUDY_DAY': setBackground('images/partly_cloudy_field.jpg');

						  //setSound('audio/Bird-tweet-sound.mp3');
						  break;

		case 'RAIN': setBackground('images/rain.jpg');

						  //setSound('audio/rain.mp3');
						  break;

		case 'PARTLY_CLOUDY_NIGHT': setBackground('images/partly_cloudy_field_night.jpg');

						  //setSound('audio/owl.wav');
						  break;

		case 'CLEAR_NIGHT': setBackground('images/clear_night_field.jpg');

						  //setSound('audio/owl.wav');
						  break;

		case 'SNOW': setBackground('images/snow.jpg');

						  //setSound('audio/jingle-sound.mp3');
						  break;

		case 'FOG': setBackground('images/fog.jpg');

						  //setSound('audio/fog-horn.mp3');
						  break;	

		case 'CLOUDY': setBackground('images/overcast_field.jpg');

						  //setSound('audio/fog-horn.mp3');
						  break;

		case 'WIND': setBackground('images/wind.jpg');

						  //setSound('audio/fog-horn.mp3');
						  break;				  				  					  				  					  					  				  					  				  	
	}
}

function setBackground(path)
{
	$('#canvastree').css('background', 'url('+path+')');
	$('#canvastree').css('background-size', 'cover');
	$('#canvastree').css('background-position', 'center');
}

function setSound(path)
{
	var sound = new Howl({src: [`'${path}'`]});
	sound.play();
}

function changeInfo(indi)
{
	$('.js-calendar-info').html('');

	$('.js-calendar-info').append(`<p class='c-info'>${ICON_ARR[indi].day}</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>Temperature: ${ICON_ARR[indi].temp}F</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>The high is: ${ICON_ARR[indi].tempHigh}F</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>The low is: ${ICON_ARR[indi].tempLow}F</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>Summary: The weather is ${ICON_ARR[indi].stat}</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>The sun will rise at: ${ICON_ARR[indi].sunrise}</p>`);
  	$('.js-calendar-info').append(`<p class='c-info'>The sun will set at: ${ICON_ARR[indi].sunset}</p>`);
}

function changeCurrentDay(indi)
{
	ICON_ARR.forEach(function(skys)
	{
		$(`#0${skys.id}`).hasClass('currentDay')
		{
			$(`#0${skys.id}`).removeClass('currentDay');
		}
	})
	$(`#0${indi}`).toggleClass('currentDay');
}

function watchSubmit()
{
	$(".js-location-form").submit(function (event)
	{
		event.preventDefault();

		//alert("watchSubmit works");

		const queryText = $(event.currentTarget).find(".js-location-text"); //get the value in the text box

		const query = queryText.val();

		console.log(query);

		$('.city').text(query);

		const loc = getDataFromGoogleMaps(query); //get the latitude and longitude 

		$('.info-container').hide();
		$('.location-form').hide();
		$('.js-calendar-info').show();
		$('.today-container').show();
		$('.city').show();

	});
}

function inputHandler()
{
	$('.js-calendar-info').hide();
	$('.today-container').hide();
	$('.city').hide();
	watchSubmit();
}

$(inputHandler());

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

Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  YY = ((YYYY=this.getFullYear())+"").slice(-2);
  MM = (M=this.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=this.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
  h=(hhh=this.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  hhhh = hhh<10?('0'+hhh):hhh;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=this.getMinutes())<10?('0'+m):m;
  ss=(s=this.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};

var now = new Date;
console.log( now.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#" ) );

var time = new Date().getTime();
var date = new Date(time);
console.log(date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#"))
  