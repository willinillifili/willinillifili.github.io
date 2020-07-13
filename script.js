$(document).ready(function(){
  const isMobile = $("#device-check").css("display") == "block";

  //sticky navbar
  var bannerPos = $(".mp-banner").offset().top;
  $(document).scroll(function() {
    if ($(this).scrollTop() >= bannerPos - 75) {
      $(".navbar").addClass("fill-navbar");
    }
    else {
      $(".navbar").removeClass("fill-navbar");
    }
  });

  //menu item hover
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
      //menu.addClass("mobile-menu");
    }
    else {
      menu.css("display", "none");
      menu.attr("class", "");
    }
  })

  //menu item navigate to corresponding tile
  $(".main-category").click(function(){
    var text = $(this).text().trim();
    var pos = $(".cat-title:contains("+text+")").offset().top;
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

  $(".country").hover(function(e){
    $(".countries-dropdown").removeClass("pullup-fx");
    $(".countries-dropdown").addClass("dropdown-fx")
  }, function() {
    $(".countries-dropdown").removeClass("dropdown-fx");
    $(".countries-dropdown").addClass("pullup-fx");
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
  $(document).click(function(){
    $(".nav-items").hide();
    $(".countries-dropdown").addClass("pullup-fx");
    $(".countries-dropdown").removeClass("dropdown-fx");
    $("#nav-items").removeClass("nav-items");
  });

  //expand/collapse categories
  /*$(".category-dropdown-arrow").click(function() {
    var categories = $(this).next();
    if ()
  });*/

  //get categories and corresponding quantites from div#data.
  //we assume data in div#data is formatted as
  //'category1,quantity1,category2,quantity2...'.
  //Further, we assume there are no blank spaces between commas.
  //we'll modify this later so that data can be written to div#data with spaces
  //between commas
  var parsedCategoriesData = [];
  const data = $("#data").text();
  parsedCategoriesData = data.replace(/\n/g, '').split(',');

  //format parsedCategoriesData as an array of values of the form [category, #],
  //store resulting array in categories
  var categories = [];
  for (let i = 0; i < parsedCategoriesData.length; i++) {
    category = parsedCategoriesData[i];
    quantity = parsedCategoriesData[i+1];
    var temp = [];
    temp.push(category);
    temp.push(quantity);
    categories.push(temp);
    i++; //skip to start of next "category, quantity" pair
  }

  //render. Place in alpabetical order
  currentLetter = 'a';
  query = "https://megapaginas.com/cgi-bin/mega.cgi?n=PR&c="
  for (cat of categories) {
    let firstLetter = cat[0][0];
    let category = cat[0];
    let quantity = cat[1];
    if (firstLetter > currentLetter) {
      //insert new Letter Separator
      $("<div class='directory-item letter-index flex-row'>"+
                firstLetter +
                '<span class="category-dropdown-arrow">' +
                  '<img alt="dd-arrow" src="./assets/icons/dd-arrow.png"/>' +
                '</span>' +
              '</div>').insertBefore("#marker");
      //then insert new category container. This could be inside previous
      //jquery function. I find it to be more readable like this.
      $('<div id="cat-container-'+firstLetter+'"'+
      'class="categories-container"></div>').insertBefore("#marker")
      currentLetter = firstLetter;
    }
    $("<div class='directory-item flex-column category-item'>"+
    "<a href='"+ query + category +"'>"+category+" ("+quantity+")"+
    "</a></div>").appendTo("#cat-container-" + currentLetter);
  }

  //click handler for category expansion
  $(".letter-index").click(function() {
    var categoriesContainer = $(this).next();
    var arrow = $(this).children(".category-dropdown-arrow");
    var items = categoriesContainer.children(".category-item");
    var directoryItemHeight = items.outerHeight();
    const expanded = items.hasClass("show-items");
    const categoriesAreExpanded = categoriesContainer.css("display") == "flex";
    if (isMobile) {

      if (!categoriesAreExpanded) {
        arrow.addClass("rotate");
        categoriesContainer.css("display", "flex");
        toggle = 1;
      }

      else {
        arrow.removeClass("rotate");
        categoriesContainer.css("display", "none");
        toggle = 0;
      }

    }

    else {
    	if (items.length > 1 && !isMobile) {
        renderHeight = calculateContainerHeight(categoriesContainer) / 2;
        renderWidth = categoriesContainer.width() / 2;

    	  //if there are an odd number of categories we add extra unit of height
        //to avoid default third column from flex-wrap

    	  if (items.length % 2 == 1) {
            renderHeight = renderHeight + directoryItemHeight;
          }
      }

    	if (items.length == 1 && !isMobile) {
    		renderHeight = directoryItemHeight;
    	}

    	if (!expanded) {
        arrow.addClass("rotate");
    	  categoriesContainer.css("height", ""+renderHeight+"");
        $(".category-item").css("width", ""+renderWidth+"");
    	  categoriesContainer.addClass("show-categories");
    	  items.addClass("show-items");
      }

    	else if (expanded){
    		arrow.removeClass("rotate");
    	  categoriesContainer.css("height", "0px");
    		items.removeClass("show-items");
    		//categoriesContainer.removeClass("show-categories");
    	}

      // We want categories to be displayed as two-column tables.
    	// strategy is to set categoriesContainer height to half of
    	// auto height and let flex wrap do the rest.
    }
  });

  //serve yellowpages ads
  const ads = [
    "elpocillo3.jpg",
    "aguadillapet.jpg",
    "anascoautopaint.jpg",
    "pmextreme.jpg",
    "solano.jpg"];


  for (ad of ads) {
    var width = Math.floor((Math.random() * 50) + 10);
    width = width - width % 10;
    $('<div class="premium-ad" style="width:'+width+'%;">'+
            '<img alt="premium" src="./assets/ads/'+ad+'"/>' +
          '</div>').insertBefore("#premium-ads-insert");
  }

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


/* helpers */

// replicates behavior of css height : auto

function calculateContainerHeight(container) {
	var numberOfChildren = container.children().length;
	var heightOfChildren = container.children().outerHeight();
	return numberOfChildren * heightOfChildren;
}
