 $(document).ready(function() {
	let sections = [];
	let indeces = [];
	essaySections = essay["sections"];
	essaySections.forEach((section) => {
		let contentId = section["content-id"];
		let paragraphs = [];
		$("#" + contentId).children("p").each(function(){
			paragraphs.push({ text : $(this).text() });
		})
		sections.push({
			title: section.title,
			contentId : contentId,
			paragraphs: paragraphs
		})
		indeces.push(
			{ 
				title : section.title,
				contentId : contentId,
			}
		);
	});	
	data = {
		title : essay["title"],
		media : essay["media"],
		indeces  : indeces,
		sections : sections
	}
	template = $('#essay').html();
	output = Mustache.render(template, data);
	$("#essay").html(output);
	
	$("li.index-item").click(function(){
		let ID = $(this).attr("value");
		let position = $("#" + ID).offset().top - 30;
		$("html, body").scrollTop(position);
	});
}); 