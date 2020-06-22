 $(document).ready(function() {
	template = $('#article').html();
	let id = window.localStorage.getItem("content-id");
	console.log(id);
	let title = window.localStorage.getItem("title");
	let content = proposalContent[id]["content"];
	let media = proposalContent[id]["media"];
	let data = { 
		"title" : title,
		"content" : content,
		"media" : media
	};
	output = Mustache.render(template, data);
	$('#article').html(output);
   }); 