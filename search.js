$( document ).ready(function() {
	var url = $.url();
	var query = url.param("q");
		
	if (typeof query != 'undefined')
	{
		$("#left").attr("src", "https://www.bing.com/search?q=" + encodeURIComponent(query));
		$("#right").attr("src", "https://www.google.com/search?q=" + encodeURIComponent(query));
		document.title = query.replace(/</g, "&lt;").replace(/>/g, "&gt;") + " - Double Shot Search";
	}
});