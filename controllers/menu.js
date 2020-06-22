$(document).ready(function(){
	var template = $("#menu").html();
	var output = Mustache.render(template, menu);
	$("#menu").html(output);
	
	var menuIsShowing = 0;
	$(".snackbar").click(function() {
		if (!menuIsShowing) {
			$(".menu-items").addClass('showMenu');
			$(".menu-item").addClass('showMenuItems');
			menuIsShowing = 1;
		}
		
		else {
			$(".menu-items").removeClass('showMenu');
			$(".menu-item").removeClass('showMenuItems');
			menuIsShowing = 0;
		}
	});
});