(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.Mustache=factory())})(this,function(){"use strict";var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}function primitiveHasOwnProperty(primitive,propName){return primitive!=null&&typeof primitive!=="object"&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName)}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation="";var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr}else{nonSpace=true;lineHasNonSpace=true;indentation+=" "}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n"){stripSpace();indentation="";tagIndex=0;lineHasNonSpace=false}}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);if(type==">"){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace]}else{token=[type,value,start,scanner.pos]}tagIndex++;tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}stripSpace();openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){intermediateValue=context.view;names=name.split(".");index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]);intermediateValue=intermediateValue[names[index++]]}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit){value=intermediateValue;break}context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value},get:function get(key){return this._cache[key]},clear:function clear(){this._cache={}}}}Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=="undefined"){this.templateCache.clear()}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+":"+(tags||mustache.tags).join(":");var isCacheEnabled=typeof cache!=="undefined";var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens)}return tokens};Writer.prototype.render=function render(template,view,partials,tags){var tokens=this.parse(template,tags);var context=view instanceof Context?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,tags)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,tags){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,tags);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,"");var partialByNl=partial.split("\n");for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i]}}return partialByNl.join("\n")};Writer.prototype.renderPartial=function renderPartial(token,context,partials,tags){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace)}return this.renderTokens(this.parse(indentedValue,tags),context,partials,indentedValue,tags)}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return typeof value==="number"?String(value):mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};var mustache={name:"mustache.js",version:"4.0.1",tags:["{{","}}"],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache},get templateCache(){return defaultWriter.templateCache}};var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials,tags){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials,tags)};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});
const menu = {
	logo : "assets/images/logoLowRes.png",
	
	menuItems : [
		{
			"title" : 'comienzo',
			"url"   : 'index.html'
		},
	
		{
			"title" : 'nuestro plan',
			"url"   : 'plan.html'
		},
	
		{
			"title": '¿estadidad?',
			"url": 'estadidad.html'
		},
	
		{
			"title": 'reto',
			"url": 'reto.html'
		},
	
		{
			"title": 'candidatos',
			"url": 'pronto.html'
		},
	
		{
			"title": 'ensayos',
			"url": 'pronto.html'
		},
	
		{
			"title": 'contacto',
			"url": 'contacto.html'
		},
	
		{
			"title": 'noticias',
			"url": 'noticias.html'
		}	
	]
};const proposalContent = {
	"11" : {
			"content" : "Un problema fundamental se encuentra en nuestro sistema electoral. Este sistema se llama pluralidad por voto sencillo y es el mas fácil de implementar. Es por eso que casi todas las democracias lo usan. Sin embargo, si lo sometemos a un análisis matemático basado en la ciencia de la votación, resulta ser el menos exacto y menos preciso en recoger el sentir del pueblo. Su limitación fundamental es que funciona correctamente solamente si hay dos candidatos por puesto. Si hay tres candidatos, un voto por el menor de los candidatos ayuda al candidato mas diferente y opuesto. Es por eso que las democracias actuales tienden a dos partidos. La mejor ilustración criolla de este problema son los llamados melones. Estos son los independentistas que votan popular porque saben que un voto por la independencia ayuda a la estadidad. Sin embargo, esta misma debilidad sistemática lo vemos en otros países. Ocurre siempre que hay un tercer candidato, como en las elecciones que trajeron al poder a Bill Clinton y a George Bush hijo. Este grave defecto se llama el efecto de spoiler. Spoiler es una palabra que no tiene una traducción directa en el español pero es algo parecido a un aguafiestas o un estropeador. Siempre que hay un tercer candidato, este causa que el candidato major mas distinto gane. Parte de este problema se puede corregir usando elecciones de segunda ronda. En este caso, si ningún candidato saca una mayoría, los dos candidatos con más votos van a unas segundas elecciones. Tales elecciones quisas hubieran cambiado el resultado de las elecciones pasadas. Sin embargo, las elecciones de segunda ronda tienen el defecto de que ayudan a consolidar el sistema de dos partidos. Para que haya cambio, necesitamos un sistema de votación que sea mas sensitivo a ideas nuevas e ideas minoritarias. Una posibilidad es lo que usa Yelp, Amazon, YouTube, deportes olímpicos como gimnasia, y hasta las Naciones Unidas. Es el sistema de votación por puntos o por estrellas donde cada elector le da a cada candidato cero o más puntos y donde se puede votar por mas de un candidato. Puede ser tan sencillo como darle un si, no o dejar en blanco. El candidato que mas puntos recibe gana. Matemáticamente esta manera de votar es mas eficiente y mas sensitivo a la voluntad del pueblo. Hay otros cambios que necesitamos hacer para mejorar nuestra democracia.",
			"media" : ""
	},
	
	"12" : {
			"content" : "El congreso federal Estadounidense al igual que 44 de los estados de esa unión tienen elecciones cada dos años. Esto obliga al gobierno a tener que darnos cuentas mas a menudo, lo cual debería disminuir la corrupción.",
			"media" : ""
	},
	
	"13" : {
			"content" : "Deberíamos tener una legislatura ciudadana que trabaje dos meses al año y que permita que sus miembros continúen en sus empleos, profesiones y negocios. Esto motivaría que personas exitosas con más experiencia y habilidades puedan contribuir a solucionar los problemas de nuestro país. Actualmente tenemos demasiados políticos profesionales que no saben como el mundo real y la economía funcionan. La mayoría de los estados de Norte América tienen legislaturas tiempo parcial. Si Tejas puede tener una legislatura tiempo parcial, nosotros también podemos.",
			"media" : ""
	},
	
	"14" : {
			"content" : "La mayoría de las legislaturas del mundo tienen una cantidad de representantes igual a la raíz cúbica de la población. Usando esta formula deberíamos tener 150 legisladores. Esto permitiría que nuestros representantes fueran más accesibles al pueblo. Propongo que tengamos al menos 100 representantes en la camara baja.",
			"media" : ""
	},
	
	"15" : {
			"content" : "Por último, el poder gubernamental no debería estar concentrado en una sola institución gigantesca. El gobierno de nuestra isla debería tomar la forma de una federación de pequeñas provincias, no un estado unitario centralizado. Deberíamos consolidar los municipios a dies o doce y transferir una gran parte del poder gubernamental a ese nivel. Esto le daría mas importancia a la legislatura municipal que está mas cerca del pueblo. Ademas, esto crearía un balance de poder y cada nivel podría fiscalizar al otro nivel. Al nivel mas bajo podríamos crear ciudades verdaderas que representaran las zonas mas pobladas, como lo hacen en muchos otras partes del mundo.",
			"media" : ""
	},
	
	"21" : {
			"content" : "Necesitamos libertad educativa basada en mas opciones. Para hacer esto tenemos que privatizar la educación. En 50 años fuimos de ser analfabeta a ser uno de los pueblos mas educados del planeta. Esa fue la base de nuestro crecimiento espectacular durante los años 50 y 60. Sin embargo, el departamento de educación, que se creó hace como 70 años ahora es un dinosauro que ha detenido nuestro progreso. Cuando mis abuelos eran niños había una sola escuela por municipio y los niños caminaban a la escuela a pie y descalzo. Cuando hay una sola alternativa para un servicio eso se llama un monopolio natural. L a carretera al frente de mi casa es un ejemplo de un monopolio natural. El gobierno tenía que asegurar que esa escuela fuera buena. Hoy tenemos varios autos por familia y hay muchas escuelas para escoger. Eso se presta para soluciones basadas en el mercado libre. Ya no hay necesidad que el estado controle la educación. Es tiempo de privatizar la educación usando vales educativos y permitir que el estudiante vaya a la escuela privada de su preferencia",
			"media" : ""
	},
	
	"31" : {
			"content" : "En Puerto Rico, y también en los Estados Unidos, las ayudas se le dan al que no trabaja. Cuando alguien que no trabajaba consigue trabajo, el estado le da un batazo económico y le quita todas las ayudas. Muchas veces si alguien consigue trabajo su condición económica empeora. Esto es un gran desincentivo al trabajo. Nadie va a trabajar para estar mas pobre. Esto crea un umbral, una barrera económica, que es difícil traspasar. Si es justo ayudar al que no trabaja, es más justo ayudar al que sí trabaja. Se le deben dar ayudas a todas las familias de Puerto Rico donde al menos uno de los miembros trabaje por lo menos 30 horas por semana.",
			"media" : ""
	},
	
	"32" : {
			"content" : "En segundo lugar, las ayudas se deben dar en una forma que le de al que las recibe, opciones. Tener opciones se llama tener libertad. Esto se justifica porque para recibir ayudas el individuo tendría que trabajar. Actualmente se dan ayudas al que no trabaja. El que recibe cupones de alimento puede ir a cualquier supermercado para comprar alimentos. Eso se llama un vale. Deberíamos sustituir las ayudas económicas actuales del gobierno por un plan de vales para todo aquel que trabaje mas de 30 horas a la semana basado en un sistema de puntos. Todas las ayudas actuales se pueden substituir por tres vales. Cada familia usará los vales para buscar vivienda, comida y plan medico en el mercado libre. Un cupón para renta permitiría que las familias salgan de los residenciales. Un cupón para plan médico permitiría que esa persona contratara con la aseguradora de su preferencia. Esto podría crear un sistema de salud mas eficiente. En adición al vale cada familia puede aportar mas dinero para conseguir mejor servicios. Los vales eliminarían la necesidad de mantener la burocracia que administra el sistemas de ayudas actuales y estos ahorros se podrían usar para bajar las contribuciones. El vale es una forma de dinero y el dinero es un voto económico. ",
			"media" : ""
	},
	
	"33" : {
			"content" : "Necesitamos sustituir el sistema de contribuciones sobre ingreso actual con un impuesto de tasa única de alrededor de 15 o 20% El sistema tendría dos renglones, uno que no paga nada y uno que pagara una tasa fija alrededor del 15%. El renglón de cero es necesario porque no es costo efectivo obligar que alguien con pocos ingresos pague. En vez, esas personas contribuirían a través del IVU. El bajar los impuestos lograría que personas productivas se quedasen en el país y atraería talento del extranjero. Actualmente inversionistas extranjeros, personas que trabajan por internet y algunos médicos solo pagan el 4% y esto ha atraído inversión y talento a nuestra isla. Un beneficio parecido se le debería dar a toda la población. Cuando se le quita dinero al que trabaja para darselo al que no trabaja, no deja de ser hurto solo porque lo hace el gobierno. Una taza de impuestos alta es inmoral y promueve la corrupción.",
			"media" : ""
	},
	
	"34" : {
			"content" : "Por último, las ayudes se le deben dar solamente al que trabaje. Para que esto sea posible hay que eliminar todo obstáculo al trabajo. Uno de los obstáculo más grande al trabajo es la ley del salario mínimo. Desafortunadamente, hay muchas personas en Puerto Rico que no pueden producir lo suficiente para que una empresa privada justifique pagarle a esa persona el salario mínimo actual. Casi una cuarta parte de los puertorriqueños no han completado escuela superior. La ley de salario mínimo es una barrera para la entrada de esas personas a la fuerza laboral. Esa es una importante razón por la cual hay tanto desempleo en Puerto Rico. El no poder conseguir un primer empleo condena esas personas a una pobreza perpetua ya que el que trabaja consigue destreza que lo ayuda a conseguir mejores empleos. El efecto de eliminar el salario mínimo va a ser permitir que más personas entren a la fuerza laboral y salgan de la pobreza. La ley del salario mínimo es un intento por compenzar por las perdidas de ayudas que experimenta el pobre que comienza a trabajar. Sin embargo, las ayudas por vale son una manera mas efectiva de ayudar al pobre trabajador y sustituirían el salario mínimo ya que estas personas estarían recibiendo una ayuda relacionada a las horas trabajadas. La única diferencia es que esta ayuda salarial ahora lo pagaría el gobierno en forma de vales en ves de la empresa privada. Eso estimularía la economía.",
			"media" : ""
	},
	
	"41" : {
			"content" : "Necesitamos implementar la pena capital para segundo asesinato. Esta es una ley antisicaria. Cuando el bajo mundo tiene mas poder que el gobierno, el gobierno nunca podrá controlar el bajo mundo. Actualmente, después que alguien mata a una persona, todos los otros asesinatos van de gratis. No existe disuasivo. No tenemos ninguna condena más allá de la cadena perpetua. Esto permite que los sicarios hagan sus malhechorías sin impunidad. También crea un descontrol en nuestras cárceles. ¿Qué otro castigo se le puede dar a alguien que está en la cárcel por cadena perpetua? Puede matar al quien quiera en la cárcel o fuera y nada le va a pasar. Eso no es justicia. Es inmoral permitir que gente violenta que han matado a varias personas continúen teniendo contacto con potenciales víctimas. Una sociedad que permite eso no va a prosperar. El hay bendito debería estar enfocado en esas futuras víctimas, no en el malhechor.",
			"media" : ""
	},
	
	"42" : {
			"content" : "La policía es la cara del gobierno en nuestras comunidades. Su propósito no debería ser solamente hacer valer la ley. Su propósito no es solamente castigar al malo. El gobierno debe fomentar en los jóvenes el pensar que el trabajo duro produce éxito. Un manera efectiva para hacer esto es implementar un programa de deportes auspiciado por la fuerza policiaca donde los oficiales puedan interactuar con los jóvenes en el ámbito de los deportes en un ambiente que fomente disciplina y liderato. En el pasado, programas como este han sido sumamente efectivo en evitar que jóvenes en ambientes desventajado caigan en un ciclo de crimen y de violencia y han sido instrumental en dirigirlos hacia el éxito. En otros siglos todos los jóvenes varones recibían entrenamiento militar. El entrenamiento fisiculturista podría producir resultados parecidos.",
			"media" : ""
	}
};const footer = {
	copyright : "Copyright Raul Lopez, M.D, todos los derechos reservados. 2020"
};$(document).ready(function(){
	var template = $("#menu").html();
	var output = Mustache.render(template, menu);
	$("#menu").html(output);
	
	var menuIsShowing = 0;
	$(".snackbar").click(function() {
		if (!menuIsShowing) {
			$(".menu-items").addClass('showMenu');
			$(".menu-item").addClass('showMenuItems');
			menuIsShowing = 1;
		}
		
		else {
			$(".menu-items").removeClass('showMenu');
			$(".menu-item").removeClass('showMenuItems');
			menuIsShowing = 0;
		}
	});
}); $(document).ready(function() {
	template = $('#article').html();
	let id = window.localStorage.getItem("content-id");
	console.log(id);
	let title = window.localStorage.getItem("title");
	let content = proposalContent[id]["content"];
	let media = proposalContent[id]["media"];
	let data = { 
		"title" : title,
		"content" : content,
		"media" : media
	};
	output = Mustache.render(template, data);
	$('#article').html(output);
   }); $(document).ready(function() {
	footerTemplate = $("footer").html();
	output = Mustache.render(footerTemplate, footer);
	$("footer").html(output);
})