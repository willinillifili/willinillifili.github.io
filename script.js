function removeBanner() {
  $(".bannerMain,.bannerSub, .button").css("display", "none");
  $(".promoImage").css("display", "flex");
  $("#promo").attr("src", "./assets/promoespecial.jpg");
}

$(document).ready(function(){
  $(".button, .especiales").click(removeBanner);

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
    $("#promo").attr("src", "./assets/promoathmovil.jpg");
  });

  $("#promo").click(function(){
    src = $(this).attr('src');
    $(".overlay").css("display", "flex");
    $("#promoLarge").attr("src", src);
  });

  $(".back").click(function(){
    $(".overlay").css("display", "none");
  });


});
