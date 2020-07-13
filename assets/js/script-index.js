(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.Mustache=factory())})(this,function(){"use strict";var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}function primitiveHasOwnProperty(primitive,propName){return primitive!=null&&typeof primitive!=="object"&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName)}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation="";var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr}else{nonSpace=true;lineHasNonSpace=true;indentation+=" "}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n"){stripSpace();indentation="";tagIndex=0;lineHasNonSpace=false}}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);if(type==">"){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace]}else{token=[type,value,start,scanner.pos]}tagIndex++;tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}stripSpace();openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){intermediateValue=context.view;names=name.split(".");index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]);intermediateValue=intermediateValue[names[index++]]}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit){value=intermediateValue;break}context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value},get:function get(key){return this._cache[key]},clear:function clear(){this._cache={}}}}Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=="undefined"){this.templateCache.clear()}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+":"+(tags||mustache.tags).join(":");var isCacheEnabled=typeof cache!=="undefined";var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens)}return tokens};Writer.prototype.render=function render(template,view,partials,tags){var tokens=this.parse(template,tags);var context=view instanceof Context?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,tags)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,tags){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,tags);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,"");var partialByNl=partial.split("\n");for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i]}}return partialByNl.join("\n")};Writer.prototype.renderPartial=function renderPartial(token,context,partials,tags){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace)}return this.renderTokens(this.parse(indentedValue,tags),context,partials,indentedValue,tags)}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return typeof value==="number"?String(value):mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};var mustache={name:"mustache.js",version:"4.0.1",tags:["{{","}}"],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache},get templateCache(){return defaultWriter.templateCache}};var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials,tags){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials,tags)};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});const menu = {
  logo : "./assets/megalogo.png",
  items : [
    {
      title : "acceder",
      url : "https://www.clasificadoselectronicos.com/cgi-bin/micuenta.cgi"
    },
    {
      title : "registrase",
      url : "https://www.clasificadoselectronicos.com/puertorico/regusuario.htm"
    },
    {
      title : "premium",
      url : "https://www.clasificadoselectronicos.com/html-files/premium.htm"
    },
  ]
}
const country = [
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
$(document).ready(function() {
	template = $('#menu').html();
	output = Mustache.render(template, menu);
	$('#menu').html(output);

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
	let toggle = 0;
  $(".toggle").click(function(e) {
    e.stopPropagation();
    let menu = $("#nav-items");
    let show = menu.attr("class");
    if (!toggle) {
      //menu.addClass("mobile-menu");
			menu.addClass("from-left");
			toggle = 1;
    }
    else {
			menu.removeClass("from-left");
			toggle = 0;
    }
  })
});
 $(document).ready(function() {
    // we initialize the countries data with default values for
    // COUNTRY, COUNTRY_CODE, etc. If country data is encoded in the URL,
    // we read it from there. In both cases, we load countries data into 'data'
    // object afterwards

    let COUNTRY_CODE = "PR";
    let COUNTRY = "puerto_rico";
 	  let FLAG = "./assets/images/flags/"+COUNTRY+".gif";
    let URL = window.location.href;

    if ( urlHasCountry() ) {
  		COUNTRY_CODE = URL.match("n=[A-Z][A-Z]")[0].substring(2);
  		COUNTRY = getCountryByCode(COUNTRY_CODE, country).name;
  		FLAG = "./assets/images/flags/"+COUNTRY+".gif";
  		if (COUNTRY) {
  			//changeCountry(COUNTRY, FLAG, countries);
  		}
  	}

    let data = {
      currentName : COUNTRY,
      currentURL : FLAG,
      country : country
    };

  	template = $('#country').html();
  	output = Mustache.render(template, data);
  	$('#country').html(output);

    adjustLinksToCountry();

    // handles toggling of countries menu
    let expanded  = 0;
    $(".current-country").click(function() {
      if (!expanded) {
        $(".country-dropdown").addClass("show-countries");
        expanded = 1;
      }

      else {
        $(".country-dropdown").removeClass("show-countries");
        expanded = 0;
      }
    })

    // handles change of countries when a country is selected from the menu

    $('.country-option').click(function () {
      let countryCode = $(this).attr("id");
      if (urlHasCountry()) newURL = URL.replace(COUNTRY_CODE, countryCode);
      else newURL = URL + "?n=" + countryCode;
      window.location.href = newURL;
    });

    // HELPER FUNCTIONS

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

    function changeCurrentCountry( newCountry ) {
      $('.current-country > .name').text(newCountry);
      $('.current-country > .flag > img')
      .attr("src", "assets/images/flags/" + newCountry + ".gif");
    }

    function urlHasCountry() {
      let URL = window.location.href;
      let pattern = /n=[A-Z][A-Z]/g;
      return pattern.test(URL);
    }

    function getCodeFromURL() {
      let URL = window.location.href;
      return URL.match("n=[A-Z][A-Z]")[0]
    }

    // adjust all hrefs on the page so that they contain
    // the current country code

    function adjustLinksToCountry() {
      let url = window.location.href;
      let hrefs = $('a').attr('href');
    }

  });
$(document).ready(function() {
  // category data is stored as COMMA SEPARATED text in div#data
  // the following couple of lines parse the data into js-friendly objects

  var parsedCategories = [];
  const services_data = $("#data").text();
  parsedCategories = services_data.replace(/\n/g, '').split(',');

  // the goal is to group the services in alphabetical order.
  // the final structure will be an object 'categories' which contains
  // member objects 'category'. Each 'category' object will contain an 'index'
  // field which stores the first letter of the service's name and a 'services'
  // object whith fields 'name' and 'quantity'.

  let categories = [];
  let currentLetter = 'a';
  let url = window.location.href;
  if (urlHasCountry()) countryCode = getCodeFromURL();
  else countryCode = "PR";  
  let query = "https://megapaginas.com/cgi-bin/mega.cgi?n="+countryCode+"&c=";
  var category = {
    index : currentLetter,
    services : []
  };

  for (let i = 1; i < parsedCategories.length; i++) {
    let firstLetter = parsedCategories[i - 1][0];
    if (firstLetter > currentLetter) {
        categories.push(category);
        var category = {
          index : firstLetter,
          services : []
        };
        currentLetter = firstLetter;
    }
    category.services.push({
      name : parsedCategories[i - 1],
      quantity : parsedCategories[i],
      url : query + parsedCategories[i - 1]
    });
    i++;
  }

  // loop exits before last category can be pushed.
  // need to improve this later.

  categories.push(category);

  let data = { categories : categories };
	template = $('#directory').html();
	output = Mustache.render(template, data);
	$('#directory').html(output);

  const isMobile = $("#device-check").css("display") == "block";

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

  // HELPER FUNCTIONS

  function calculateContainerHeight(container) {
  	var numberOfChildren = container.children().length;
  	var heightOfChildren = container.children().outerHeight();
  	return numberOfChildren * heightOfChildren;
  }

  function urlHasCountry() {
    let URL = window.location.href;
    let pattern = /n=[A-Z][A-Z]/g;
    return pattern.test(URL);
  }

  function getCodeFromURL() {
    let URL = window.location.href;
    return URL.match("n=[A-Z][A-Z]")[0].substring(2);
  }

});
