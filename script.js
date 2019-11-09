function removeBanner() {
  $(".bannerMain,.bannerSub, .button").css("display", "none");
  $(".saleImage").css("display", "flex");
}

$(document).ready(function(){
  $(".button").click(removeBanner);

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


});
