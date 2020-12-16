(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.Mustache=factory())})(this,function(){"use strict";var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}function primitiveHasOwnProperty(primitive,propName){return primitive!=null&&typeof primitive!=="object"&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName)}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation="";var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr}else{nonSpace=true;lineHasNonSpace=true;indentation+=" "}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n"){stripSpace();indentation="";tagIndex=0;lineHasNonSpace=false}}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);if(type==">"){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace]}else{token=[type,value,start,scanner.pos]}tagIndex++;tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}stripSpace();openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){intermediateValue=context.view;names=name.split(".");index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]);intermediateValue=intermediateValue[names[index++]]}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit){value=intermediateValue;break}context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value},get:function get(key){return this._cache[key]},clear:function clear(){this._cache={}}}}Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=="undefined"){this.templateCache.clear()}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+":"+(tags||mustache.tags).join(":");var isCacheEnabled=typeof cache!=="undefined";var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens)}return tokens};Writer.prototype.render=function render(template,view,partials,tags){var tokens=this.parse(template,tags);var context=view instanceof Context?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,tags)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,tags){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,tags);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,"");var partialByNl=partial.split("\n");for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i]}}return partialByNl.join("\n")};Writer.prototype.renderPartial=function renderPartial(token,context,partials,tags){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace)}return this.renderTokens(this.parse(indentedValue,tags),context,partials,indentedValue,tags)}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return typeof value==="number"?String(value):mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};var mustache={name:"mustache.js",version:"4.0.1",tags:["{{","}}"],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache},get templateCache(){return defaultWriter.templateCache}};var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials,tags){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials,tags)};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});
$(document).ready(function(){const menu = {
    logo : "logo",
    item : [
      {
        title : "conectate",
        url : "https://www.clasificadoselectronicos.com/cgi-bin/micuenta.cgi",
        type : "onboarding"
      },
      {
        title : "registrate",
        url : "https://www.clasificadoselectronicos.com/puertorico/regusuario.htm",
        type : "onboarding"
      },
      {
        title : "premium",
        url : "https://www.clasificadoselectronicos.com/html-files/premium.htm",
        type : "onboarding"
      },
      {
        title : "contacto",
        url : "https://www.clasificadoselectronicos.com/contacto.htm",
        type: ""
      },
      {
        title : "categorias",
        url : "",
        type: "dropdown active"
      },
    ],
    category : [
      {
        title : "vehiculos",
        subcategories : [
          {
              title : "autos",
              url : "https://clasitronicos.com/cgi-bin/getcars.cgi?n=PR"
          },
          {
              title : "motoras",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=motoras"
          },
          {
              title : "botes",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=botes"
          },
          {
              title : "clasicos",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=antiguos"
          },
          {
              title : "aviones",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=aviones"
          },
          {
              title : "remolques",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=remolques"
          },
          {
              title : "pickups",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=pickups"
          },
          {
              title : "vanes",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=vanes"
          },

        ]
      },
      {
        title : "bienes raices",
        subcategories : [
          {
              title : "condominios",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=condominios"
          },
          {
              title : "casas venta",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=casasventas"
          },
          {
              title : "apartamentos",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=apartamentosalquiler"
          },
          {
              title : "casas renta",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=casasalquiler"
          },
          {
              title : "comerciales",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=comerciales"
          },
          {
              title : "vacaciones",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=vacaciones"
          },
          {
              title : "terrenos",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=terrenos"
          }
        ]
      },
      {
        title : "mucho mas",
        subcategories : [
          {
              title : "mascotas",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=mascotas"
          },
          {
              title : "muebles",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=muebles"
          },
          {
              title : "ropa",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=ropa"
          },
          {
              title : "enceres",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=enceres"
          },
          {
              title : "instrumentos",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=instrumentos"
          },
          {
              title : "libros",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=libros"
          },
          {
              title : "clases",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=clases"
          },
          {
              title : "mucho mas",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=miscelaneos"
          },
        ]
      },
      {
        title : "negocios",
        subcategories : [
          {
              title : "mega paginas",
              url : "https://clasitronicos.com/yellowpages.html"
          },
          {
              title : "servicios",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=servicios"
          },
          {
              title : "empleos",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=empleos"
          },
          {
              title : "salud",
              url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=salud"
          },
          {
              title : "actividades",
              url : ""
          }
        ]
      },

    ]
};
const searchbar = `<div class="search menu-section pointer search-mobile mobile-only">
  <form
  action="https://www.clasitronicos.com/cgi-bin/getadx.cgi"
  method="post"
  class="centralize-row">
  <input type="text" placeholder="que (y donde).." name="keyword">
  <input type="hidden" name="country" size="12" value="PR">
  <button type="submit">
    <span>
      <i class="fa fa-search fa-sm"></i>
      <span>
  </button>
</div>`
const listing_breadcrumbs = {
  crumbs : [
    {
      name : "Autos",
      url : "https://clasitronicos.com/cgi-bin/getcars.cgi?db=1&n=PR"
    },
    {
      name : "Toyota",
      url : "https://clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=autos&k=Toyota"
    },
    {
      name : "Camry",
      url : "https://clasitronicos.com/cgi-bin/getadx.cgi?n=PR&c=autos&k=camry"
    },
  ],
  years : [{year : "1997"},{year : "1998"},{year : "2001"},{year : "2012"},
  {year : "2018"}],
  colors: [{color: "Black"},{color:"Blanco"},{color: "Rojo"}],
  searchbar : searchbar
};
const listing = {
  ads : [
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      type : "premium",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      type : "premium",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      type : "premium",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    },
    {
      province : "bayamon",
      price : "170,000",
      title : "2020 Toyota Camry XSE Auto (Natl)",
      keywords : [
        {
          keyword : "toyota",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Toyota&c=dealers",
        },
        {
          keyword : "camry",
          url : "https://www.clasitronicos.com/cgi-bin/getadx.cgi?n=PR&k=Camry&c=dealers",
        },
      ],
      teaser : "Esto es un resumen de la descripcion del ...",
      views : "15",
      vendor: "All Brand Auto",
      phone : "(787) 946-7575",
      image : "./assets/corolla.jpg",
    }
  ],
  filters: ["Año   ▼  ", "Color ▼",  "Ordenar Por ▼ "]
};

const googleAdFixed =`<div style="width:WIDTHpx; height:HEIGHTpx;"
                           class="ad-listing not-featured ad-listing-width googleAd">
                          <script async
                                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">
                          </script>
                        <!-- VariableGoogle -->
                        <ins class="adsbygoogle"
                             style="display:inline-block;width:WIDTHpx;height:HEIGHTpx;"
                             data-ad-client="ca-pub-5552515189039838"
                             data-ad-slot="1633405477"
                             data-auto-ad-size="false"></ins>
                          <script>
                           (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                        </div>`;

const googleAdInfeed = `<div style="width:WIDTHpx;height:HEIGHTpx;" class="ad-listing not-featured ad-listing-width googleAd">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block;width:WIDTHpx;height:HEIGHTpx;"
     data-ad-format="fluid"
     data-ad-layout-key="-d6-2+7t-22+mj"
     data-ad-client="ca-pub-5552515189039838"
     data-ad-slot="9204863727"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>`;

  template = $('#menu').html();
	output = Mustache.render(template, menu);
	$('#menu').html(output);

  let menuIsShowing = { state : 0 };

  $(".snackbar, .dropdown").click(function(e){
    e.preventDefault();
    e.stopPropagation();
    toggle(menuIsShowing, ".categories", "showMenu showMenuDsktp", "removeClass",
               "addClass");
    if(window.innerWidth < 700) {
      let menuShowing = $('.categories').hasClass('showMenu');
      menuShowing ? $('.snackbar').addClass('black') :
      $('.snackbar').removeClass('black');
    }
  });

  let subIsShowing = { state : 0 };
  $(".category-item").click(function(){
    let subcategories = $(this).children(".subcategories");
    toggle(subIsShowing, subcategories, "", "slideUp", "slideDown");
  })

  /*let dropDownShowing = { state : 0 };
  $(".dropdown").click(function(e) {
    let isMobile = $(".items").css("display") === "none";
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    dropDownShowing.state ?
    $(".categories").css("display", "none")
    : $(".categories").css("display", "grid");
    dropDownShowing.state = !dropDownShowing.state;
  });*/

  $("html, body").click(function() {
    let isMobile = $(".items").css("display") === "none";
    let subcategories = $(this).children(".subcategories");
    if (isMobile) {
      toggle(subIsShowing, subcategories, "", "slideUp", "slideDown");
      return;
    }
    $(".categories").css("display", "none");
  })

/* HELPER FUNCTIONS */

/* pre: @initialToggleState is an object with the toggle state
        @element is a string selector or a dom node. It represents the element
        that will receive the toggle action.
        @arg is the argument that will be passed to the toggle actions
        @toggleAction1 & 2 are the names of the methods of @element that will
        be called when the toggle event is trigerred */

function toggle(initialToggleState, element, arg, toggleAction1,
                    toggleAction2) {
  initialToggleState.state ?
  $(element)[toggleAction1](arg) : $(element)[toggleAction2](arg);
  initialToggleState.state = !initialToggleState.state;
}

function toggleSnackbarColor(initialToggleState) {
  initialToggleState.state ?
  $(".snackbar").css("color", "white") : $(".snackbar").css("color", "black");
  initialToggleState.state = !initialToggleState.state;
}

function isMobile() {
  return isMobile = $(".items").css("display") === "none";
}
  const filterData = parsedFilterData()
  if (filterData.filters.length == 0 ) {
    filterData.hasData = false;
    if (window.innerWidth > 700) $('#listado').css('grid-row', '4');
  }

  const hasFilters = filterData.hasData;
  data = {
    parentCategories : filterData.parentCategories,
    filters : filterData.filters,
    hasFilters : hasFilters
  };

  template = $('#listing-breadcrumbs-container').html();
	output = Mustache.render(template, data);
	$('#listing-breadcrumbs-container').html(output);

  function parsedFilterData() {
    const filterData = [];
    filterData.hasData = true;
    filterData.parentCategories = [];
    filterData.filters = [];
    const parsedData = [];
    rawData = $("#filter-data").text().trim();
    if (!rawData) {
      filterData.hasData = false;
      return filterData;
    }

    /* splitting by ',#,' and then by ',' will yield arrays where:

      - the first array contains the parent categories. Ex:
        the user has just selected "camry". Then the first array
        is ['autos', 'toyota']

      - the following arrays contain the data for the types of filters. The
        first element will be a string with the type name. The following elements
        will be the type values. They should be extracted in pairs of
        '... value, quantity, ...' Ex:
        The user has selected "camry". Then one of the following arrays is
        ['anio','1999','1','2003','2','2005','7'...]
    */

    rawDataSplit = rawData.split(",#,");
    const result = [] // we will use this to store the arrays resulting from
    // splitting the elements of @rawDataSplit by ','
    rawDataSplit.forEach((elem) => {
      result.push(elem.split(','));
    });

    const parentCategories = result.shift();

    // remember to fix this asapx
    $(".bc-category").text(parentCategories[0]);

    filterData.parentCategories = [
      {
        value : parentCategories[1],
        name : 'category'
      },
      {
        value : parentCategories[2],
        name : 'keyword'
      },
    ];

    result.forEach( result => {
      let filter = {}
      filter.selectionName = result.shift();
      filter.name = result.shift();
      filter.values = [];
      for (let i = 0; i < result.length - 1; i++) {
        filter.values.push({
          value : result[i],
          quantity : result[i+1]
        });
        i++;
      }
      filterData.filters.push(filter);
    });
    console.log(filterData);
    return filterData;
  }

 /*template = $('#popup-searchbar').html();
	output = Mustache.render(template, popup_searchbar);
	$('#popup-searchbar').html(output);*/

  let screenSize = { isMobile : false };
  screenSize.isMobile = window.innerWidth < 1000 ? true : false;
  window.addEventListener("resize", () => {
    screenSize.isMobile = window.innerWidth < 1000 ? true : false;
  })

  // handles toggling of searchbar in mobile
  let searchbarShowing = 0;
  $("#search-icon-mobile, .search-icon-mobile").click( function(e) {
    e.stopPropagation();
    if (!searchbarShowing) {
      shiftEverythingDown();
      $("#popup-searchbar").addClass("showSearch");
      searchbarShowing = 1;
    }

    else {
      shiftEverythingUp();
      $("#popup-searchbar").removeClass("showSearch");
      searchbarShowing = 0;
    }

  });

  $("input, button").click(function(e) {
    e.stopPropagation();
  });

  function shiftEverythingDown() {
    if (screenSize.isMobile) {
      $(".breadcrumbs").css("grid-row", "8 / span 2");
      $(".filters").css("grid-row", "10 / span 2");
      $(".listado").css("grid-row", "12 / span 2");
    }

    else {
      $(".breadcrumbs").css("grid-row", "5 / 6");
      $(".filters").css("grid-row", "6");
      $(".listado").css("grid-row", "7");
    }
  }

  function shiftEverythingUp() {
    if (screenSize.isMobile) {
      $(".breadcrumbs").css("grid-row", "4 / span 2");
      $(".filters").css("grid-row", "6 / span 2");
      $(".listado").css("grid-row", "9 / span 2");
    }

    else {
      $(".breadcrumbs").css("grid-row", "3 / 4");
      $(".filters").css("grid-row", "4");
      $(".listado").css("grid-row", "5");
    }
  }
 paid_ads = parsePaidAds()
 const hasPaidAds = paid_ads.length > 1;
 data = {
   ads : listing.ads,
   paid_ads : paid_ads,
   paidAdsSection : hasPaidAds
 };

 template = $('#listado').html();
	output = Mustache.render(template, data);
	$('#listado').html(output);

 // keep track of ad list state
 const adList = {
   columns : 3,
   selected : 3,
   adHeight : 129,
   adWidth : '100%',
   paidAds : {
     length : $(".paid-ad").length,
     list : $(".paid-ad"),
     cyclePosition : 0,
     intervalId :0
   }
 }

 const paidAds = adList.paidAds;
 initialize()

 if (paidAds.length > 1) cyclePaidAds(adList.columns, 0, paidAds.length, paidAds.list);

 $(window).on("resize", function() {
   if (window.innerWidth > 700) {
     handleAdWidth();
     setMenuWidth();
     cyclePaidAds(adList.columns, 0, paidAds.length, paidAds.list);
   }
 });

 // handles the column changer
 $(".col-changer").on("click", function(e){
      $(".col-changer").removeClass("selected");
      $(this).addClass("selected");
      switch(e.target.id) {
        case "tres":
          adList.selected = 3;
        break;
        case "cuatro":
          adList.selected = 4;
        break;
      }
      handleAdWidth();
      setMenuWidth();
      cyclePaidAds(adList.selected, 0, paidAds.length, paidAds.list);
});

/* HELPER FUNCTIONS */

/**
  * Adjust width of center section and ad width according to screen size.
  * @todo refactor as much of this into css as possible. This is only in
  * javascript because it was the quickest way to handle complex
  * requirements of the responsive behavior.
*/

function handleAdWidth() {
  console.log('handleAdWidth');
  adList.columns = adList.selected;
  let columns = adList.selected;
  if (window.innerWidth > 900) {
      if (columns === 3) {
        if (window.innerWidth < 1250) {
          $('.center').css("grid-column", "2 / 12");
        }else if (window.innerWidth > 1600) {
          $('.center').css("grid-column", "4 / 10");
        }else {
          $('.center').css("grid-column", "3 / 11");
        }
      } else if (columns === 4)  {
        if (window.innerWidth > 1430) {
          $('.center').css("grid-column", "3 / 11");
        }else if (window.innerWidth <= 1430 && window.innerWidth > 1279) {
          $('.center').css("grid-column", "2 / 12");
        }else if (window.innerWidth <= 1279) {
          $('.center').css({
            "grid-column" : "1 / 13",
            "margin" : "0px 10px",
          });
        }
    }
    setAdWidth(adList.selected);
    setPaidAdWidth(adList.selected);
    setImageDimensions();
  } if (window.innerWidth <= 900 && window.innerWidth > 700) {
    $('.center').css("grid-column", "1 / 13");
    setAdWidth(3);
    setPaidAdWidth(3);
    setImageDimensions();
    adList.columns = 3;
  } else if (window.innerWidth <= 700) {
    let width = String(window.innerWidth);
    adList.adWidth = width;
    $('.center').css('grid-column', '1 / 4');
    $(".ad-listing").css("width", "100%");
    $(".not-featured").css("width", width + 'px');
    $(".not-featured").css("overflow", "hidden");
    $(".ad-listing").css("height", "129px");
    setPaidAdWidth(2);
    adList.columns = 2;
  }
}

/**
  * Set the width of the ads so that they maintain a 1:1.15
  * width to height ratio.
  * @param {Number} columns Number of columns in the ad listing grid
*/

function setAdWidth(columns) {
  adList.columns = columns;
  let padding = 0;

  switch(columns) {
    case 2:
      padding = 27;
    break;

    case 3:
      padding = 28;
    break;

    case 4:
      padding = 29;
    break;

    default:
      return;
  }

  let adsContainerWidth = $(".ads").innerWidth();
  let adWidth = (adsContainerWidth / columns) - padding;
  let adHeight = adWidth * 1.15;

  /* update the adList fields so they can be used by ads loaded afterwards
     such as the google ads */

  adList.adWidth = adWidth;
  adList.adHeight = adHeight;

  $(".not-featured").css("width", String(adWidth) + "px");
  $(".not-featured").css("height", String(adHeight) + "px");
}

/**
  * Adjust menu dimensions based on screen width
  * @todo refactor this behavior into css.
*/

function setMenuWidth() {
  if (window.innerWidth > 700) {
    let menuStart = 0;
    let center = document
                 .querySelector('.center')
                 .style.gridColumn.split(' / ');
    $('.logo').css("grid-column", center[0] + ' / span 1');
    $('.publicar').css("grid-column", String(Number(center[0]) + 1) + ' / span 1');
    $('.items').css("grid-column", String(Number(center[0]) + 3) + ' / ' + center[1]);
    $('.snackbar').css("grid-column", String(Number(center[1]) - 1));
    if (window.innerWidth < 950) {
        $('.items').css("grid-column", String(Number(center[1]) - 2));
    }
  }else {
    $('.logo').css("grid-column", "3");
    $('.snackbar').css("grid-column", "1");
  }
}

function setImageDimensions() {
  let imageWidth = $('.ad-image').innerWidth();
  let imageHeight = imageWidth / 1.6;
  $('.ad-image').css("height", String(imageHeight) + "px");
}

function attachPremiumLabels() {
  $(".premium").children(".premium-label").css("display", "flex");
}

function parsePaidAds() {
  let rawData = $("#paid-ads-data").text();
  if (!rawData.trim()) return [];
  let splitData = rawData.split(",");

  // we intend to divide the list into objects of url source/destination pairs

  let paidAdsTuples = [];
  for (let i = 0; i < splitData.length; i+=2) {
    paidAdsTuples.push({
      source : splitData[i].trim(),
      destination :  splitData[i + 1].trim()
    });
  }
  return paidAdsTuples;
}

function setPaidAdWidth(ads) {
  let paidAds = $(".paid-ad");
  ads = ads > paidAds.length ? paidAds.length : ads;
  paidAds.css("display", "none");
  for (let i = 0; i < ads; i++) {
    paidAds[i].style.display = "block";
  }
}

function cyclePaidAds(ads, cyclePosition, length, adList) {
  clearInterval(paidAds.intervalId);
  paidAds.intervalId = setInterval(function(){
    adList.css("display", "none");
    for (let i = 0; i < ads; i++) {
      adList[cyclePosition % length].style.display = "block";
      cyclePosition++;
    }
  }, 6000);
}

/**
  * Insert  google ads into the listing grid
  * @param {Number} frequency Number of normal ads between each google ad.
*/

function placeGoogleAds(frequency) {
  console.log('placeGoogleAds');
  let ads = $('.not-featured');
  let googleAd = window.innerWidth > 700 ? googleAdFixed : googleAdInfeed;

  googleAd = googleAd.replace(/WIDTH/g, String(adList.adWidth))
                     .replace(/HEIGHT/g, String(adList.adHeight))

  // first ad should always be google ad

  $('.ads').prepend(googleAd);

  for (let i = 0; i < ads.length; i++) {
    if ((i + 1) % frequency === 0) {
      ads.eq(i).after(googleAd);
    }
  }
}

async function initialize() {
  await handleAdWidth();
  await placeGoogleAds(4);
  await setMenuWidth();
  await attachPremiumLabels();
  handleMissingVendor();
}

function handleMissingVendor() {
  let vendor = $('.vendor');
  let teaser = $('.listing-row.teaser');
  for (let i = 0; i < vendor.length; i++) {
    if (!vendor[i].textContent) {
      teaser[i].style.display = 'flex';
    }
  }
}
});