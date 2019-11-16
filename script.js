function removeBanner() {
  $(".bannerMain,.bannerSub, .button").css("display", "none");
  $(".location").css("display", "none");
  $(".contact").css("display", "none");  
  $(".promoImage").css("display", "flex");
  $("#promo").attr("src", "./assets/promoespecial.jpg");
}

function removeAll() {
    $(".bannerMain,.bannerSub, .button").css("display", "none");
    $(".promoImage").css("display", "none");
    $(".location").css("display", "none");
    $(".contact").css("display", "none");
}

$(document).ready(function(){
  $(".button, .especiales").click(removeBanner);

  $(".localizacion").click(function() {
    removeAll();
    $(".location").css("display", "flex");
  });

  $(".contactenos").click(function(){
    removeAll();
    $(".contact").css("display", "flex");
  })

  $("#f1").click(function(){
    removeBanner();
    $("#promo").attr("src", "./assets/promoathmovil.jpg");
  });

  $("#f2").click(function(){
    removeBanner();
    $("#promo").attr("src", "./assets/promotexto.jpg");
  });

  $("#f3").click(function(){
    removeBanner();
    $("#promo").attr("src", "./assets/promodelivery.jpg");
  });

  $("#promo").click(function(){
    src = $(this).attr('src');
    $(".overlay").css("display", "flex");
    $("#promoLarge").attr("src", src);
  });

  $(".back").click(function(){
    $(".overlay").css("display", "none");
  });

  $(".feature").hover(function(){
    var text = $(this).children("div");
    text.css("color", "yellow");
  }, function(){
    var text = $(this).children("div");
    text.css("color", "white");
  })
});
