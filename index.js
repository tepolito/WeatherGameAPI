const DARKSKY_API_URL ="https://api.darksky.net/forecast/";

function watchSubmit()
{
	$('.js-location-form').submit(function (event)
	{
		event.preventDefault();

		const queryText = $(event.currentTarget).find(".js-location-text");

		const query = queryText.val();

		console.log(query);
	});
}

$(watchSubmit());