$(document).ready(function() {
	footerTemplate = $("footer").html();
	output = Mustache.render(footerTemplate, footer);
	$("footer").html(output);
})