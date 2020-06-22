$(document).ready(function() {
	let template = $("#proposals").html();
	var output = Mustache.render(template, proposals);
	$("#proposals").html(output);
	
	
	$(".propuesta").click(function() {
		var propuesta = $(this);
		$(".propuesta").css("display", "none");
		let id = propuesta.attr("id");
		let parent = propuesta.text();
		let data = {
			"parentTitle"      : parent,
			"subProposal" : subProposals[id] 
		};
		let output = Mustache.render(template, data);
		$(".sub-proposals").html(output);
		$(".sub-proposals").css("display", "flex");	
	});
	
	$(".sub-proposals").on("click", ".sub-proposal", function(){
		let contentID = $(this).attr("id");
		let title = $(this).text();
		// article page needs subProposal data if one of the subProposal links gets clicked.
		// things you gotta do when everything is left to the front-end.
		window.localStorage.setItem("content-id", contentID);
		window.localStorage.setItem("title", title);
		window.location.assign("./article.html")
	});
});