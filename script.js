$(document).ready(function(){
  $(".nav-item").hover( //menu item hover
    function(){
      $(this).children(".dropdown").css("display", "flex");
    },
    function(){
      $(this).children(".dropdown").css("display", "none");
    }
  );

  $(".toggle").click(function() { //mobile menu toggle
    let menu = $("#nav-items");
    let show = menu.attr("class");
    if (show === "") {
      menu.css("display", "flex");
      menu.attr("class", "nav-items");
    }
    else {
      menu.css("display", "none");
      menu.attr("class", "");
    }
  })

  $(".nav-item").click(function(){ //menu item navigate to corresponding tile
    var text = $(this).children("span").text().trim();
    var pos = $(".cat-title:contains("+text+")").offset().top;
    $("html, body").animate({
      scrollTop: pos
    });
    $("#nav-items").attr("class", "");
  })

  $(".arrow").click(function(){ //main page categories scroll
    var carousel;
    var arrow = $(this);
    if (arrow.attr("id") === "left") {
      var carousel = $(this).prev().children("div");//select carousel
      carousel.attr("class", "cat-center flex-row");//clean out previous effect
      var animation = "scroll-left";
    }
    else {
      var carousel = $(this).next().children("div");//select carousel
      carousel.attr("class", "cat-center flex-row");//clean out previous effect
      var animation = "scroll-right";
    }
    $(carousel).addClass(animation);//adds animation class
  })

  //yellow pages render directory
  const categories = ["abogados", "aires acondicionados", "alquiler", "auto",
    "auto essentials", "belleza y salud", "bienes raices", "camas", "cerrajero",
  "contabilidad y consultoria", "contratista", "dealer", "ebanisteria",
  "empleo", "empleos", "energia renovable", "estimador", "empleador"];

  for (cat of categories) {
    $("<div class='directory-item flex-column'><a href='./result.html'>"+cat+"</a></div>")
    .insertBefore("#marker");
  }

});
