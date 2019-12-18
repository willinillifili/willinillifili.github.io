$(document).ready(function(){
  $(".nav-item").hover(
    function(){
      $(this).children(".dropdown").css("display", "flex");
    },
    function(){
      $(this).children(".dropdown").css("display", "none");
    }
  );

  $(".toggle").click(function() {
    let menu = $("#nav-items");
    let show = menu.attr("class");
    if (show === "") menu.attr("class", "nav-items");
    else menu.attr("class", "");
  })

  $(".nav-item").click(function(){
    var text = $(this).children("span").text().trim();
    var pos = $(".cat-title:contains("+text+")").offset().top;
    $("html, body").animate({
      scrollTop: pos
    });
    $("#nav-items").attr("class", "");
  })
  
});
