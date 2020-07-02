$(document).ready(function(){
  //menu item hover

	//sticky navbar
	var bannerPos = $(".banner").offset().top;
  $(document).scroll(function() {
    if ($(this).scrollTop() >= bannerPos - 75) {
      $(".top-bar").addClass("fill-navbar");
    }
    else {
      $(".top-bar").removeClass("fill-navbar");
    }
  });

	if ($(".toggle").css("display") != "none") {
      cat = $(".category");
      cat.scrollLeft(0);
      cat.next().height(.1);
      cat.next().width(.1);
      cat.prev().width(30);
      cat.prev().height(30);
      cat.next().css("display", "flex");
  }

	//stop event bubbling on searchbar clicke
	$("input, button").click(function(e) {
		e.stopPropagation();
	});

  window.onbeforeunload = function(e) {
		//i.e. we are on mobile. weak condition but ill think of something else later.
    if ($(".toggle").css("display") != "none")
    {
      /*cat = $(".category");
      cat.scrollLeft(0);
      cat.next().height(.1);
      cat.next().width(.1);
      cat.prev().width(30);
      cat.prev().height(30);
      cat.next().css("display", "flex");*/
    }
  }

  $(".subcategory").click(function(e){
    e.stopPropagation();
  })

  $(".nav-item").hover(
    function(){
      $(this).children(".dropdown").css("display", "flex");
    },
    function(){
      $(this).children(".dropdown").css("display", "none");
    }
  );

  //mobile menu toggle
  $(".toggle").click(function(e) {
    e.stopPropagation();
    let menu = $("#nav-items");
    let show = menu.attr("class");
    if (show === "") {
      menu.css("display", "flex");
      menu.attr("class", "nav-items");
      menu.removeClass("fadeOut");
      menu.addClass("fadeIn");
    }
    else {
      menu.removeClass("fadeIn");
      menu.addClass("fadeOut");
      menu.css("display", "none");
      menu.attr("class", "");
    }
  })

  //menu item navigate to corresponding tile
  $(".dd-main, .main-category").click(function(){
    var text = $(this).text().trim();
    let pos = $(".cat-title:contains("+text+")").offset().top;
    $("html, body").animate({
      scrollTop: pos
    });
    $("#nav-items").attr("class", "");
    $("#nav-items").css("display", "none");
  })

  //handle countries menu toggle
  /*$(".country").click(function (e) {
    e.stopPropagation();
    var countriesDropdown = $(".countries-dropdown");
    countriesDropdown.toggle();
    countriesDropdown.addClass("dropdown
  });*/

  //desktop countries dropdown menu
  $(".country").hover(function(e){
    e.stopPropagation();
    $(".countries-dropdown").removeClass("pullup-fx");
    $(".countries-dropdown").addClass("dropdown-fx")
  }, function() {
    $(".countries-dropdown").removeClass("dropdown-fx");
    $(".countries-dropdown").addClass("pullup-fx");
  });

  //categories dropdown menu
  $(".tb-categories").hover(function(e){
    $(".categories-dropdown").removeClass("pullup-fx");
    $(".categories-dropdown").addClass("dropdown-fx")
  }, function() {
    $(".categories-dropdown").removeClass("dropdown-fx");
    $(".categories-dropdown").addClass("pullup-fx");
  });

  //countries dropdown for mobile
  var toggle = 1;
  $(".mobile-country").click(function(e){
    e.stopPropagation();
    if (toggle === 1) {
      $(".countries-dropdown").removeClass("pullup-fx");
      $(".countries-dropdown").addClass("dropdown-fx")
      toggle = 0;
    }
    else if (toggle === 0) {
      $(".countries-dropdown").removeClass("dropdown-fx");
      $(".countries-dropdown").addClass("pullup-fx");
      toggle = 1;
    }
  });

  //menus hide by clicking anything on the srcreen
  $(document).click(function(e){
    $(".nav-items").hide();
    $(".countries-dropdown").addClass("pullup-fx");
    $(".countries-dropdown").removeClass("dropdown-fx");
    $("#nav-items").removeClass("nav-items");
  });

  //we construct this dictionary of countries and country codes
  //it will function as a 'local DB' from which we can extract data to adjust
  //the urls on our page.
  const countries = [
    {
      name: "argentina",
      code: "AR"
    },
    {
      name: "bolivia",
      code: "BO"
    },
    {
      name: "california",
      code: "CA",
      state: true
    },
    {
      name: "chile",
      code: "CH"
    },
    {
      name: "colombia",
      code: "CO"
    },
    {
      name: "costa_rica",
      code: "CR"
    },
    {
      name: "cuba",
      code: "CU"
    },
    {
      name: "ecuador",
      code: "EC"
    },
    {
      name: "el_salvador",
      code: "EL"
    },
    {
      name: "espana",
      code: "ES"
    },
    {
      name: "florida",
      code: "FL",
      state: true
    },
    {
      name: "guatemala",
      code: "GU"
    },
    {
      name: "honduras",
      code: "HO"
    },
    {
      name: "illinois",
      code: "IL",
      state: true
    },
    {
      name: "mexico",
      code: "MX"
    },
    {
      name: "nicaragua",
      code: "NI"
    },
    {
      name: "panama",
      code: "PN"
    },
    {
      name: "paraguay",
      code: "PG"
    },
    {
      name: "peru",
      code: "PE"
    },
    {
      name: "puerto_rico",
      code: "PR"
    },
    {
      name: "republica_dominicana",
      code: "RD"
    },
    {
      name: "texas",
      code: "TX"
    },
    {
      name: "uruguay",
      code: "UR"
    },
    {
      name: "venezuela",
      code: "VE"
    },
  ];

  //set previously clicked country if returning from another page
  //and adjust queries accordingly
  if (sessionStorage.getItem("country")) {
    let name  = sessionStorage.getItem("country");
    let flag = sessionStorage.getItem("flag");
    $(".country, .mobile-country").children("span").text(name);
    $(".country, .mobile-country").children(".flag").children("img")
	.attr("src", flag);
    c = getCountryFromDB(name, countries);
    adjustQueriesToCountry(c);
  }

  //constructs countries menu
  for (country of countries) {
    title = country.name;
    //url = "'https://www.clasificadoselectronicos.com/"+country+".htm'";
    if (title.indexOf("_") > -1) { //check if contains underscore
      title = title.replace("_", " ");
    }
    countryItem = '<div id="'+country.code+'"class="flex-row dd-country">'+
        '<div class="flag">'+
          '<img alt="flag" src="./assets/flags/'+country.name+'.gif"></img></div>' +
          '<span>'+title+'</span>' +
          '</div>';
      if (country.state) $(countryItem).insertAfter(".united-states");
      $(countryItem).insertBefore(".countries-marker");
    }

	/* adjust page to country in url */
	
	let URL = window.location.href;
	if (URL.indexOf("?") > -1) {
		let COUNTRY_CODE = URL.match("n=[A-Z][A-Z]")[0].substring(2);
		let COUNTRY = getCountryByCode(COUNTRY_CODE, countries).name;
		let FLAG = "./assets/flags/"+COUNTRY+".gif";
		if (COUNTRY) {
			changeCountry(COUNTRY, FLAG, countries);
		}
	}
	
    //handle change country: updates hyperlinks and displayed country info
    $(".dd-country").click(function(e) {
      $(".countries-dropdown").removeClass("dropdown-fx");
      $(".countries-dropdown").addClass("pullup-fx");
	  chosenCountry = $(this);
      chosenCountryName = chosenCountry.children("span").text();
      chosenCountryCopy = chosenCountryName //saves name before underscore reinsert
      chosenCountryFlag = chosenCountry
      .children("div")
      .children("img")
      .attr("src");
	  let code = chosenCountry.attr("id");
	  
	  /* get current country code from url */
	  let URL = window.location.href;
	  if (URL.indexOf("?") > -1) {
		let COUNTRY_CODE = URL.match("n=[A-Z][A-Z]")[0].substring(2);
		if (COUNTRY_CODE) { 
			let newURL = URL.replace(COUNTRY_CODE, code);  
			window.location.href = newURL; 
		}
	  }
      sessionStorage.setItem("country", chosenCountryName); //cache
      sessionStorage.setItem("flag", chosenCountryFlag); //cache
      //change topbar country info
      topbar = $(".country");
      topbar.children(".flag").children("img").attr("src", chosenCountryFlag);
      topbar.children("span").text(chosenCountryName);
      //same but for mobile. this is redundant, should be improved
      topbar = $(".mobile-country");
      topbar.children(".flag").children("img").attr("src", chosenCountryFlag);
      topbar.children("span").text(chosenCountryName);
      //get country data from DB, where our dictionary named 'countries'
      //acts as DB
      country = getCountryFromDB(chosenCountryName, countries);
      //adjust all queries to chosen country
      adjustQueriesToCountry(country);
      //now notify the user that country changed
      snack = $(".countries-snackbar");
      snack.children("span").text(chosenCountryCopy);
      snack.parent().css("display", "flex");
      snack.parent().hide();
      snack.parent().fadeIn();
      setTimeout(function(){snack.parent().fadeOut()}, 1500);
    });

  //main page categories scroll
  var animation;
  $(".arrow").click(function(e){
    e.stopPropagation();
    var carousel;
    var arrow = $(this); //clicked arrow
    if (arrow.css("width") === "30px") return; //disable for mobile
    var classes = arrow.attr("class")//will be used to identify arrow
    var otherArrow = arrow.siblings(".arrow"); //complementary arrow
    arrow.addClass("implode");
    otherArrow.removeClass("implode");/*gotta remove implode class because
    it impedes displaying other element*/
    otherArrow.css("display", "flex");
    if (classes.includes("right")) {
      var carousel = $(this).next().children("div");//select carousel
      animation = "scroll-right";
      if (carousel.attr('id') === "bienesraices") {
        animation = "scroll-right-bienesraices";
      }
      if (carousel.attr('id') === "negocios") {
        animation = "scroll-right-negocios";
      }
    }
    if (classes.includes("left")){
      var carousel = $(this).prev().children("div");//select carousel
      animation = "scroll-left";
      if (carousel.attr('id') === "bienesraices") {
        animation = "scroll-left-bienesraices";
      }
      if (carousel.attr('id') === "negocios") {
        animation = "scroll-left-negocios";
      }
     }
     carousel.attr("class", "cat-center flex-row");//clean out previous effect
     carousel.addClass(animation);//adds animation class
  })

  //handle arrow shrink/grow according to scroll position
  //initialize

  $(".category").scroll(function() {
    width = this.scrollWidth; //doesn't take into account margins and padding
    outer = Math.floor($(this).outerWidth(true));//floor it to get an integer for trueWidth
    trueScrollWidth = width - outer;
    progress = this.scrollLeft/trueScrollWidth;
    leftArrow = $(this).next();
    rightArrow = $(this).prev();
    scaleDown(rightArrow, progress);
    scaleUp(leftArrow, progress);
    sessionStorage.setItem("scrollPos", this.scrollLeft);
  });

  //searchbar focus reaction
  //cta button reaction
  $(".post button, .searchbar").hover(function(){
    $(this).addClass("lightup");
  }, function(){
    $(this).removeClass("lightup");
  });

  //yellow pages render directory

  //yellowpages render results
  const results = [
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
    {
      title: "Negocio 1",
      keywords: ["eficiencia", "precision"],
      country : "PR",
      city: "San Juan",
      phone: 787676565,
    },
  ]
  for (res of results) {
  $('    <div class="result flex-row">'+
          '<div class="result-image">'+
          '<img alt="result" src="./assets/placeholder.jpg"/>'+
          '</div>'+
          '<div class="result-info">'+
            '<div class="result-title"><a href="./megapaginas-anuncio.html">'+res.title+'</a></div>'+
            '<div class="result-keywords"><a href="./megapaginas-anuncio.html">'+res['keywords'][0]+'</a> <a>'+res['keywords'][1]+'</a></div>'+
            '<div class="result-location">'+res.city+', <a href="./megapaginas-anuncio.html">'+res.country+'</a></div>'+
            '<div class="result-phone">'+res.phone+'</div>'+
          '</div>'+
        '</div>'
      ).insertBefore("#results-marker")
    }

    //serve ad-page photo sub-carousel
    var subCarouselPhotoURLs = ["front.jpg", "front1.jpg", "front2.jpg", "front3.jpg"]
    for (img of subCarouselPhotoURLs) {
      $('<div class="sub-carousel-photo"><img alt="" src="./assets/'+img+'"></div>')
      .insertBefore("#sub-carousel-photos-marker");
    }
    //higlight first photo, which is 'current' by default
    $(".sub-carousel-photo").first().addClass("current");

    //higlight most recently clicked photo, and display it on carousel
    $(".sub-carousel-photo").click(function() {
      var clicked = $(this);
      $(".current").removeClass("current"); //unhighlight previously selected photo
      clicked.addClass("current");//voila
      var url = clicked.children().attr("src");//get clicked image url
      $(".photo-carousel").children().attr("src", url)//update photo carousel
    })

    //handle carousel navigation
    $(".photo-carousel-arrow").click(function(){
      let clicked = $(this);
      let arrow = clicked.attr("id"); //determine which arrow was clicked
      let current = $(".current"); //get currently displayed photo from sub-carousel
      let carousel = $(".photo-carousel"); //cache photo carousel
      var next;
      if (arrow == "photo-carousel-arrow-right") next = current.next() //get next photo url
      if (arrow == "photo-carousel-arrow-left") next = current.prev() //get next photo url
      nextURL = next.children().attr("src");
      if (nextURL) {
        current.removeClass("current");
        carousel.children().attr("src", nextURL); //update photo carousel
        next.addClass("current")//highlight
      }
    });

    //serve comments
    const comments = ['comm1', 'comm2', 'comm3', 'comm4', 'comm5'];
    const numOfComments = comments.length;
    $("#num-of-comments").text(numOfComments);
    for (comm of comments) {
      $('<div class="comment flex-row">'+
      '<div class="comment-profile-picture">' +
                '<img alt="profile-pic" src="./assets/profile-icon.png"/>'+
              '</div>'+
              '<div class="comment-box">'+
                '<div class="comment-header">' +
                  '<div class="comment-username">' +
                    'User0'+
                  '</div>' +
                  '<div class="comment-timestamp">' +
                    'Lun 2 de Febrero del 2019' +
                  '</div>' +
                '</div>' +
                '<div class="comment-text">' +
                '<span class="reply">@user1 &nbsp</span>'+
                  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam' +
                  'nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,' +
                '</div>' +
                '<div class="comment-options">' +
                  '<div class="comment-like">Me Gusta' +
                  '</div>' +
                  '<div class="comment-reply">Responder' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>').insertBefore("#comments-insert-point");
        }
});

//HELPER FUNCTIONS
//fetches country from local "DB" (which is the 'countries' array)
function getCountryFromDB( countryName, DB ) {
  if (countryName.indexOf(" ") > -1) {
    countryName = countryName.replace(" ", "_");
  }
  //now get country from countries array (i.e. local DB)
  matching = DB.filter( obj => {
    return obj.name === countryName;
  });
  return matching[0];
}

function getCountryByCode( countryCode, DB ) {
  if (countryCode.indexOf(" ") > -1) {
    countryCode = countryCode.replace(" ", "_");
  }
  //now get country from countries array (i.e. local DB)
  matching = DB.filter( obj => {
    return obj.code === countryCode;
  });
  return matching[0];
}

//scales the size of am element, assuming the scale
//factor is between one and zero
function scaleDown(domElem, scaleFactor) {
  if (scaleFactor >= 1) return; //we do not want to give the arrows zero width
  scale = 1 - scaleFactor;
  domElem.width(30*scale);
  domElem.height(30*scale);
}

//change all queries based on country
function adjustQueriesToCountry( country ) {
  //change search query
  searchbarCountryField = $(".searchbar")
  .children("form")
  .children('input[name="country"]');
  searchbarCountryField.attr("value", country.code);
  //change 'publish ad' button's hyperlink
  $("#publish-ad").attr("onclick",
  "window.location.href =" +
  "'https://www.clasificadoselectronicos.com/cgi-bin/formanunciox.cgi?n="+
  country.code+"';")
  //now change queries from categories
  allTileCategories = $(".subcategory");
  allMenuCategories = $(".dd-category");
  //first the tile categories
  for (tileCat of allTileCategories) {
    query = tileCat.attributes['onclick']['value'];//get current query
    currentParameter = query.match("n=[A-Z][A-Z]");//get current param
    if (currentParameter) { //if it exists replace it
      newParameter = "n="+country.code;
      query = query.replace(currentParameter, newParameter);
      $(tileCat).attr("onclick", query); //place in new query
    }
  }
  //now the menu categories. Code is almost identical
  //if possible this loop's body should be inside previous loop.
  for (menuCat of allMenuCategories) {
    //get current query
    query = menuCat['children'][0]['attributes']['href']['value'];
    currentParameter = query.match("n=[A-Z][A-Z]");//get current param
    if (currentParameter) { //if it exists replace it
      newParameter = "n="+country.code;
      query = query.replace(currentParameter, newParameter);
      $(menuCat).children("a").attr("href", query); //place in new query
    }
  }
}

function scaleUp(domElem, scaleFactor) {
  scaleFactor = scaleFactor + 0.00001; //avoid 0;
  domElem.width(30*scaleFactor);
  domElem.height(30*scaleFactor);
}

/* Handles country change */
function changeCountry(name, flag, DB) {
      chosenCountryName = name;
      chosenCountryCopy = name //saves name before underscore reinsert
      chosenCountryFlag = flag;
      sessionStorage.setItem("country", chosenCountryName); //cache
      sessionStorage.setItem("flag", chosenCountryFlag); //cache
      //change topbar country info
      topbar = $(".country");
      topbar.children(".flag").children("img").attr("src", chosenCountryFlag);
      topbar.children("span").text(chosenCountryName);
      //same but for mobile. this is redundant, should be improved
      topbar = $(".mobile-country");
      topbar.children(".flag").children("img").attr("src", chosenCountryFlag);
      topbar.children("span").text(chosenCountryName);
      //get country data from DB, where our dictionary named 'countries'
      //acts as DB
      country = getCountryFromDB(chosenCountryName, DB);
      //adjust all queries to chosen country
      adjustQueriesToCountry(country);
	}
