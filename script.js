//menu item hover
$(document).ready(function(){
  $(".nav-item").hover(
    function(){
      $(this).children(".dropdown").css("display", "flex");
    },
    function(){
      $(this).children(".dropdown").css("display", "none");
    }
  );

  //mobile menu toggle
  $(".toggle").click(function() {
    let menu = $("#nav-items");
    let show = menu.attr("class");
    if (show === "") {
      menu.show();
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

  //main page categories scroll
  $(".arrow").click(function(){
    var carousel;
    var arrow = $(this); //clicked arrow
    var classes = arrow.attr("class")//will be used to identify arrow
    var otherArrow = arrow.siblings(".arrow"); //complementary arrow
    arrow.addClass("implode");
    otherArrow.removeClass("implode");/*gotta remove implode class because
    it impedes displaying other element*/
    otherArrow.css("display", "flex");
    if (classes.includes("right")) {
      var animation = "scroll-right";
      var carousel = $(this).next().children("div");//select carousel
    }
    if (classes.includes("left")){
       var animation = "scroll-left";
       var carousel = $(this).prev().children("div");//select carousel
     }
     carousel.attr("class", "cat-center flex-row");//clean out previous effect
     carousel.addClass(animation);//adds animation class
  })

  //searchbar focus reaction
  //cta button reaction
  $(".post button, .searchbar").hover(function(){
    $(this).addClass("lightup");
  }, function(){
    $(this).removeClass("lightup");
  });

  //yellow pages render directory
  const categories = ["abogados", "aires acondicionados", "alquiler", "auto",
    "auto essentials", "belleza y salud", "bienes raices", "camas", "cerrajero",
  "contabilidad y consultoria", "contratista", "dealer", "ebanisteria",
  "empleo", "empleos", "energia renovable", "estimador", "empleador"];

  for (cat of categories) {
    $("<div class='directory-item flex-column'><a href='./mega-paginas-results.html'>"+cat+"</a></div>")
    .insertBefore("#marker");
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
            '<div class="result-title"><a>'+res.title+'</a></div>'+
            '<div class="result-keywords"><a>'+res['keywords'][0]+'</a> <a>'+res['keywords'][1]+'</a></div>'+
            '<div class="result-location">'+res.city+', <a>'+res.country+'</a></div>'+
            '<div class="result-phone">'+res.phone+'</div>'+
          '</div>'+
        '</div>'
      ).insertBefore("#results-marker")
    }
});
