$(document).ready(function(){
	let proposalSection = $("#proposals").offset().top - 100;
	$("#propuestas, #nuestroplan, #plan-link").on("click", function(e) {
		e.preventDefault();
		$("html, body").scrollTop(proposalSection);
	});
});