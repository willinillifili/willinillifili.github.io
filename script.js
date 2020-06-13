$(document).ready(function() {

  var ideas = $("#ideas");
  var ideasColor = ideas.css("color");
  var first = $('.first')
  let leftShift = (window.innerWidth/2) - 50;
  $('.logoMob').css('left', leftShift + 'px');
  $("#toProps, #nuestro").click(function() {
    window.location.replace('./plan.html');
  });

  $("#toIntro, #valoresColores").click(function(){
    $('#first').css('display', 'none');
    $('#second').css('display', 'flex');
  });

  $('.proposal').hover(function() {
    link = $(this).children('a');
    origColor = $(link).css('color');
    $(link).css('color', 'gray');
  }, function () {
    $(link).css('color', origColor);
  });

  $(".material-icons-outlined, .proposal, .proposal > a").click(function(){
    let _class = $(this).attr('class');
    if (_class === "material-icons-outlined") {
       arrowDown = $(this);
       var proposal = arrowDown.parent();
       subproposal = proposal.next();

       display = subproposal.css("display");
    }

    if (_class === "proposal") {
      var proposal = $(this);
      subproposal = proposal.next();
      display = subproposal.css("display");
    }

    if (display === "none") {
      arrowDown.css("transform", "rotate(180deg)");
      subproposal.css("display", "inline-block");
    }

    else {
      arrowDown.css("transform", "rotate(0deg)");
      subproposal.css("display", "none");
     }
  });

  var listCollection = $("li");
  len = listCollection.length;
  var props = [];
  /*for (let i = 0; i < len; i++){
    li = $(listCollection[i]);
    //prop = li.text().replace("chevron_right","").trim();
    //props.push(prop);
  }*/

  $("li").click(function(){
    const proposal = $(this).text().replace("chevron_right","");
    const proposalIndex = $("li").index(this);
    const parentProposal = $(this)
    .parent()
    .parent()
    .prev()
    .children("a")
    .text();
    localStorage.setItem("proposal", proposal);
    localStorage.setItem("parentProposal", parentProposal);
    localStorage.setItem("index", proposalIndex);
    window.location.replace("./propuesta.html");
  });

  if (localStorage.getItem("proposal")) {
    const proposal = localStorage.getItem("proposal").trim();
    $("#pParProp").text(localStorage.getItem("parentProposal"));
    $("#pProp").text(proposal);
    text = $(".propContent:contains('" + proposal + "')")
    .children("p").text();
    $("#propText").text(text);
    $("#proposal").click(function(){
      index = props.indexOf(proposal);
      localStorage.setItem("proposal", props[index + 1]);
      window.location.reload();
    });
  }

  /*var navSides = $('.navSides');
  $('.mobile-toggler').click(function(){
    let isdisplayed = navSides.css('display');
    if (isdisplayed === "none") {
      $('.navSides, .navbarOptions').css('display', 'flex');
    }
    else {
      $('.navSides, .navbarOptions').css('display', 'none');
    }
  });*/
});
