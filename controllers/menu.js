$(document).ready(function(){
	
	// add field to menuItem objects and refactor the menu data object
	
	let items = [];
	let logo = menu.logo;
	let menuItems = menu.menuItems;
	menuItems.forEach((menuItem) => {
		items.push({
			title : menuItem.title,
			url : menuItem.url,
			id: menuItem.title.replace(" ", "")
		});
	});
	data = { menuItems : items, logo : logo };
	var template = $("#menu").html();
	var output = Mustache.render(template, data);
	$("#menu").html(output);
	
	// handle mobile menu UI mechanics
	
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
	
	$(".menu-item").click(function() {
		if (menuIsShowing) {
			$(".menu-items").removeClass('showMenu');
			$(".menu-item").removeClass('showMenuItems');
			menuIsShowing = 0;
		}
	})
});