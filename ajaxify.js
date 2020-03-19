/* 
 * ajaxify.js
 * Ajaxify - A jQuery Ajax Plugin
 * https://4nf.org/
 *
 * Copyright Arvind Gupta; MIT Licensed
 */
 
/* INTERFACE: See also https://4nf.org/interface/

Simplest plugin call:

jQuery('#content').ajaxify();
Ajaxifies the whole site, dynamically replacing the element with the ID '#content' across pages

If several elements should be swapped, just specify their IDs like this:
jQuery('#content, #nav').ajaxify();

The plugin can take an arbitrary amount of IDs


Options default values
{
// basic config parameters
	selector : "a:not(.no-ajaxy)",	//Selector for elements to trigger swapping - not those to be swapped - e.g. a selection of links
	forms : "form:not(.no-ajaxy)", // jQuery selection for ajaxifying forms - set to "false" to disable
	canonical : false, // Fetch current URL from "canonical" link if given, updating the History API.  In case of a re-direct...
	refresh : false, // Refresh the page even if link clicked is current page
 
// visual effects settings
	requestDelay : 0, //in msec - Delay of Pronto request
	previewoff : true, // Plugin previews prefetched pages - set to "false" to enable or provide hints to selectively disable
	scrolltop : "s", // Smart scroll, true = always scroll to top of page, false = no scroll
	bodyClasses : false, // Copy body classes from target page, set to "true" to enable
 
// script and style handling settings, prefetch
	deltas : true, // true = deltas loaded, false = all scripts loaded
	asyncdef : false, // default async value for dynamically inserted external scripts, false = synchronous / true = asynchronous
	alwayshints: false, // strings, - separated by ", " - if matched in any external script URL - these are always loaded on every page load
	inline : true, // true = all inline scripts loaded, false = only specific inline scripts are loaded
	inlinehints : false, // strings - separated by ", " - if matched in any inline scripts - only these are executed - set "inline" to false beforehand
	inlineskip : "adsbygoogle", // strings - separated by ", " - if matched in any inline scripts - these are NOT are executed - set "inline" to true beforehand 
	inlineappend : true, // append scripts to the main content element, instead of "eval"-ing them
	style : true, // true = all style tags in the head loaded, false = style tags on target page ignored
	prefetchoff : false, // Plugin pre-fetches pages on hoverIntent - true = set off completely // strings - separated by ", " - hints to select out
 
// debugging & advanced settings
	verbosity : 0,	//Debugging level to console: default off.	Can be set to 10 and higher (in case of logging enabled)
	memoryoff : false, // strings - separated by ", " - if matched in any URLs - only these are NOT executed - set to "true" to disable memory completely
	cb : null, // callback handler on completion of each Ajax request - default null
	pluginon : true // Plugin set "on" or "off" (==false) manually
}


*/


//Intuitively better understandable shorthand for String.indexOf() - String.iO()
String.prototype.iO = function(s) { return this.toString().indexOf(s) + 1; };

//Minified hoverIntent plugin
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):jQuery&&!jQuery.fn.hoverIntent&&e(jQuery)}(function(e){"use strict";var t,n,i={interval:100,sensitivity:6,timeout:0},o=0,u=function(e){t=e.pageX,n=e.pageY},r=function(e,i,o,v){if(Math.sqrt((o.pX-t)*(o.pX-t)+(o.pY-n)*(o.pY-n))<v.sensitivity)return i.off(o.event,u),delete o.timeoutId,o.isActive=!0,e.pageX=t,e.pageY=n,delete o.pX,delete o.pY,v.over.apply(i[0],[e]);o.pX=t,o.pY=n,o.timeoutId=setTimeout(function(){r(e,i,o,v)},v.interval)};e.fn.hoverIntent=function(t,n,v){var a=o++,s=e.extend({},i);e.isPlainObject(t)?(s=e.extend(s,t),e.isFunction(s.out)||(s.out=s.over)):s=e.isFunction(n)?e.extend(s,{over:t,out:n,selector:v}):e.extend(s,{over:t,out:t,selector:n});var f=function(t){var n=e.extend({},t),i=e(this),o=i.data("hoverIntent");o||i.data("hoverIntent",o={});var v=o[a];v||(o[a]=v={id:a}),v.timeoutId&&(v.timeoutId=clearTimeout(v.timeoutId));var f=v.event="mousemove.hoverIntent.hoverIntent"+a;if("mouseenter"===t.type){if(v.isActive)return;v.pX=n.pageX,v.pY=n.pageY,i.off(f,u).on(f,u),v.timeoutId=setTimeout(function(){r(n,i,v,s)},s.interval)}else{if(!v.isActive)return;i.off(f,u),v.timeoutId=setTimeout(function(){!function(e,t,n,i){var o=t.data("hoverIntent");o&&delete o[n.id],i.apply(t[0],[e])}(n,i,v,s.out)},s.timeout)}};return this.on({"mouseenter.hoverIntent":f,"mouseleave.hoverIntent":f},s.selector)}});

//Module global variables
var lvl = 0, pass = 0, currentURL = "", rootUrl = getRootUrl(), api = window.history && window.history.pushState && window.history.replaceState,

//Regexes for escaping fetched HTML of a whole page - best of Baluptons Ajaxify
//Makes it possible to pre-fetch an entire page
docType = /<\!DOCTYPE[^>]*>/i,
tagso = /<(html|head|link)([\s\>])/gi,
tagsod = /<(body)([\s\>])/gi,
tagsc = /<\/(html|head|body|link)\>/gi,

//Helper strings
div12 = '<div class="ajy-$1"$2',
divid12 = '<div id="ajy-$1"$2',
linki = '<link rel="stylesheet" type="text/css" href="*" />',
scri = '<script src="*"></script>',
linkr = 'link[href*="!"]', 
scrr = 'script[src*="!"]';
//inlineclass = "ajy-inline";

//Minified pO() function - for documentation of pO() please refer to https://4nf.org/po/
var funStr,logging=!1,codedump=!1;let getParamNames=()=>funStr.slice(funStr.indexOf("(")+1,funStr.indexOf(")"));function JSON2Str(n,t){let e="";return Object.entries(n).forEach(([n,o],r)=>{e+=`${r?",\n":""}`+("function"==typeof o?`_${n} = ${iLog(o.toString(),n)}`:`${n} = ${t?'settings["':""}${t?n+'"]':JSON.stringify(o)}`)}),e?`let ${e}${0!=t?";":""}`:""}function pO(n,t,e,o,r,s){let i,l,u,g,f,$,c,a,p="",d="",O="";if(!n||!o)return console.log("Error in pO(): Missing parameter");if(funStr=iLog(funStr=o.toString(),n),i=n.substr(0,1).toUpperCase()+n.substr(1,n.length-1),g=(l=getParamNames(o)).indexOf("$this")+1,f=l.indexOf("options")+1,u=l.replace("$this, ",""),u="$this"==l?"":u,e&&!f&&(u+=""===u?"options":", options"),t&&(p=JSON2Str(t)),e&&(d=`let settings = $.extend(${JSON.stringify(e)}, options);\n${JSON2Str(e,1)}`),r&&(O=JSON2Str(r,0)),a=`\n(function ($) { let ${i} = function(${$=e?"options":""}){\n        ${p}\n        ${d}\n        this.a = ${funStr};\n        ${O}\n    };\n\n    $.${c=g?"fn."+n:n} = function(${u}) {${g?"let $this = $(this);":""}\n        if(!$.${c}.o) $.${c}.o = new ${i}(${$});\n        return $.${c}.o.a(${l});\n    };\n})(jQuery);`,!0!==codedump&&codedump!==i.toLowerCase()||console.log(a),!s)try{jQuery.globalEval(a)}catch(n){console.log(`Error: ${n} | ${a}`)}}function showArgs(n){s="";for(var t=0;t<n.length;t++)null==n[t]?s+="null | ":s+=(null!=n[t]&&"function"!=typeof n[t]&&"object"!=typeof n[t]&&("string"!=typeof n[t]||n[t].length<=100)?n[t]:"string"==typeof n[t]?n[t].substr(0,100):typeof n[t])+" | ";return s}function iLog(n,t){if(n=n.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,""),!logging||"log"===t)return n;let e=n.indexOf("=>")<30?n.indexOf("=>")+1:0,o=n.indexOf("{")+1;e&&(n=n.replace(/(	|\r\n|\n|\r)/gm,""),(!o||o>e+5)&&(n=`${n.substr(0,e+2)}{ return ${n.substr(e+1)}}`),n="function ("+n.substr(0,n.indexOf("{")-3).trim().replace(/\(/g,"").replace(/\)/g,"")+")"+n.substr(n.indexOf("{")).trim()),o=n.indexOf("{");let r=n.substr(n.indexOf("("),n.indexOf(")")-n.indexOf("(")+1).replace(/"/g,'\\"').replace(/'/g,"\\'");return`${n.substr(0,o)}{$.log(lvl + " | ${t} | ${r} | " + showArgs(arguments)${2==logging?", -1, true, arguments":""}); try { lvl++; ${n.substr(o+1,n.length-o-2)}} finally {lvl--;}}`}pO("log",0,{verbosity:0},function(n,t,e,o){if(t>=0&&(verbosity=t),verbosity&&n&&lvl<=verbosity&&console&&1==e)return console.groupCollapsed(n),console.table(o),console.groupCollapsed("Trace"),console.trace(),console.groupEnd(),void console.groupEnd();verbosity&&n&&lvl<=verbosity&&console&&console.log(n)});

//getRootUrl() from Baluptons history.js
function getRootUrl(){var a=window.location.protocol+"//"+(window.location.hostname||window.location.host);if(window.location.port||!1)a+=":"+window.location.port;return a+="/",a;}

//Global helpers
function _trigger(t, e){ e = e ? e : jQuery.rq("e"); jQuery(window).trigger("pronto." + t, e); }
function _internal(url) {
	if (!url) return false;
	if (typeof(url) === "object") url = url.href;
	if (url==="") return true;
	return url.substring(0,rootUrl.length) === rootUrl || !url.iO(":");
}

function _copyAttributes(el, $S, flush) { //copy all attributes of element generically
	if (flush) [...el.attributes].forEach(e => el.removeAttribute(e.name)); //delete all old attributes
	[...$S[0].attributes].forEach(e => el.setAttribute(e.nodeName, e.nodeValue)); //low-level insertion
}

function Hints(hints) {	var myHints = (typeof hints === 'string' && hints.length > 0) ? hints.split(", ") : false; //hints are passed as a comma separated string
	this.find = t => (!t || !myHints) ? false : myHints.some(h => t.iO(h)) //iterate through hints within passed text (t)
}

// The stateful Cache plugin
// Usage - parameter "o" values: 
// none - returns currently cached page
// <URL> - returns page with specified URL
// <jQuery object> - saves the page in cache
// f - flushes the cache
pO("cache1", { d: false }, 0, function (o) {
	if (!o) return d; //nothing passed -> return currently cached page

	if (typeof o === "string") { //URL or "f" passed
		if(o === "f") { //"f" passed -> flush
			$.pages("f"); //delegate flush to $.pages
			$.log("Cache flushed");
		} else d = $.pages($.memory(o)); //URL passed -> look up page in memory

		return d; //return cached page
	}

	if (typeof o === "object") { //jQuery object passed (whole page)
		d = o; //store object internally
		return d; //return it
	}
});

// The stateful Memory plugin
// Usage: $.memory(<URL>) - returns the same URL if not turned off internally
pO("memory", 0, { memoryoff: false, hints: 0 }, function (h) {
	if(!hints) hints = new Hints(memoryoff); //create Hints object during first pass
	if (!h || memoryoff === true) return false; //validate input, if memoryoff set to true return false quickly
	if (memoryoff === false) return h; //if memoryoff set to false return the URL quickly
	return hints.find(h) ? false : h; //apply hints mechanism -> found: return false, otherwise return URL
});

// The stateful Pages plugin
// Usage - parameter "h" values:
// <URL> - returns page with specified URL from internal array
// <jQuery object> - saves the passed page in internal array
// false - returns false
pO("pages", { d: [], i: -1 }, 0, function (h) {
	if (typeof h === "string") { //URL or "f" passed
		if(h === "f") d = []; //"f" ? -> flush internal array
		else if((i=_iPage(h)) !== -1) return d[i][1]; //get page index - return entire page / not found - do nothing
	}

	if (typeof h === "object") { //jQuery object passed [href, <page>]
		if((i=_iPage(h)) === -1) d.push(h); //check whether href in array already? / no -> add to array
		else d[i] = h; //yes -> update complete object
	}

	if (typeof h === "boolean") return false; //false in - false out
}, 
{	 iPage: h => d.findIndex(e => e[0] == h) //find index of page within array
});

// The GetPage plugin
// First parameter (o) is a switch:
// empty - returns cache
// <URL> - loads HTML via Ajax, second parameter "p" must be callback
// + - pre-fetches page, second parameter "p" must be URL, third parameter "p2" must be callback 
// - - loads page into DOM and handle scripts, second parameter "p" must hold selection to load
// x - returns XHR
// otherwise - returns selection of current page to client

pO("getPage", { xhr: 0, cb: 0, plus: 0, rt: "", ct: 0 }, 0, function (o, p, p2) { 
	if (!o) return $.cache1(); //nothing passed -> return currently cached page

	if (o.iO("/")) { //URL
		cb = p; //second parameter "p" must be callback
		if(plus == o) return; //same URL as in "plus" variable? -> return
		return _lPage(o); //load page with the URL and return it
	}
	if (o === "+")	{ //pre-fetch page
		plus = p; //store second parameter "p" in "plus" variable
		cb = p2; //third parameter "p2" must be callback
		return _lPage(p, true); //load page with the URL, indicating a pre-fetch in second parameter (true)
	}

	if (o === "a") { if (xhr && xhr.readyState !== 4) xhr.abort(); return; }
	if (o === "s") return ((xhr) ? xhr.readyState : 4) + rt; //return xhr ready state together with request type(rt)
	if (o === "-") return _lSel(); //load page into DOM, handle scripts and fetch canonical URL. "p" must hold selection to load
	if (o === "x") return xhr; //return xhr object dynamically

	if (!$.cache1()) return;
	if (o === "body") return $.cache1().find("#ajy-" + o);
	if (o === "script") return $.cache1().find(o); //scripts are not escaped

	return $.cache1().find(o === "title" ?	"title:first" : ".ajy-" + o); //default -> return element requested from cached page

}, {
	lSel: () => ( //load selection specified in "$t" into DOM, handle scripts and fetch canonical URL
		pass++, //central increment of "pass" variable
		_ldBody(), //load body of target into main DOM
		//$("body > script").remove("." + inlineclass), //remove all previously dynamically added inline scripts
		$.scripts(true), //invoke delta-loading of JS
		$.scripts("s"), //invoke delta-loading of CSS
		$.scripts("c") //return canonical URL
	),

	lPage: (h, pre) => { //fire Ajax load, check for hash first, "pre" indicates a prefetch
		if (h.iO("#")) h = h.split("#")[0]; //get first part before hash
		if ($.rq("is") || !$.cache1(h)) return _lAjax(h, pre); //if request is a POST or page not in cache, really fire the Ajax request

		plus = 0; //otherwise reset "plus" variable
		if (cb) return cb(); //fire callback, if given
	},

	ld: ($t, $h) => { //load HTML of target selection into main DOM
		var $c = $h.clone(); //we want to preserve the original target element
		$c.find("script").remove(); //prevent double firing of scripts
		_copyAttributes($t[0], $c, true); //copy tag attributes of element, flushing the first parameter initially
		$t.html($c.html()); //inject element into primary DOM
	},

	ldBody: () => $.cache1() && $.cache1().find("#ajy-body").attr("tagName", "body") && _ld($("body"), $.cache1().find("#ajy-body")),

	lAjax: (hin, pre) => { //execute Ajax load
		var ispost = $.rq("is"); //POST?
		if (pre) rt="p"; else rt="c"; //store request type (p-prefetch, c-click)

		xhr = $.ajax({ //central AJAX load, for both POSTs and GETs
		url: hin, //URL
		type: ispost ? "POST" : "GET", //POST or GET?
		data: ispost ? $.rq("d") : null, //fetch data from $.rq
		success: h => { //success -> "h" holds HTML
			if (!h || !_isHtml(xhr)) { //HTML empty or not HTML or XML?
				if (!pre) location.href = hin; //If not a pre-fetch -> jump to URL as an escape
			}

			$.cache1($(_parseHTML(h))); //Clean HTML and load it into cache
			$.pages([hin, $.cache1()]); //Load object into $.pages, too
			plus = 0; //Reset "plus" variable, indicating no pre-fetch has happened

			if (cb) return(cb()); //Call callback if given
		},
		error: (jqXHR, status, error) => {
		// Try to parse response text
			if (status === 'abort') {plus=0; return;} // handler for fn("a") aborted requests, to avoid error
			try {
				xhr = jqXHR; //make xhr accessible asap for user in pronto.error handler
				_trigger("error", error); //raise general pronto.error event
				$.log("Response text : " + xhr.responseText); //log out debugging information
				$.cache1($(_parseHTML(xhr.responseText))); //attempt to gracefully fill $.cache1
				$.pages([hin, $.cache1()]); //commit to $.pages
				if(cb) return cb(error);  //finally, call user's bespoke callback function
			} catch (e) {}
		},
		async: true //Explicitly not synchronous!
		});
	},

	isHtml: x => (ct = x.getResponseHeader("Content-Type")) && (ct.iO("html") || ct.iO("form-")), //restrict interesting MIME types - only (X)HTML / FORM-family
	parseHTML: h => $.parseHTML($.trim(_replD(h)), null, true), //process fetched HTML, trim escaped HTML of entire page
	replD: h => String(h).replace(docType, "").replace(tagso, div12).replace(tagsod, divid12).replace(tagsc, "</div>") //pre-process HTML so it can be loaded by jQuery
});

// The main plugin - Ajaxify
// Is passed the global options 
// Checks for necessary pre-conditions - otherwise gracefully degrades
// Initialises sub-plugins
// Calls Pronto
pO("ajaxify", 0, { pluginon: true, deltas: true, verbosity: 0 }, function ($this, options) {
	var o = options;
	if (!o || typeof(o) !== "string") {
		$(function () { //on DOMReady
			if (_init(settings)) { //sub-plugins initialisation
				$this.pronto("i", settings); //Pronto initialisation
				if (deltas) $.scripts("1"); //delta-loading initialisation
			}
		});
	}
	else return $().pronto(o);
}, {
	init: s => { //main intialisation of Pronto and its sub-plugins
		if (!api || !pluginon) { //History API not defined or Ajaxify turned off manually -> exit / gracefully degrade
			$.log("Gracefully exiting...");
			return false;
		}
		$.log("Ajaxify loaded...", verbosity, s); //verbosity steers, whether this initialisation message is output and initial verbosity
		$.scripts("i", s); //Initialse sub-plugins...
		$.cache1(0, s);
		$.memory(0, s);
		return true; //Return success
	}
});

// The stateful Scripts plugin
// First parameter "o" is switch:
// i - initailise options
// c - fetch canonical URL
// jQuery object - handle one inline script
// otherwise - delta loading
pO("scripts", { $s : false, inlhints: 0, skphints: 0, txt: 0 }, { canonical: false, inline: true, inlinehints: false, inlineskip: "adsbygoogle", inlineappend: true, style: true }, function (o) {
	if (o === "i") { //Initalise
		if(!$s) $s = $(); //Start off with empty internal jQuery object
		if(!inlhints) inlhints = new Hints(inlinehints); //create Hints object during initialisation
		if(!skphints) skphints = new Hints(inlineskip); //create Hints object during initialisation
		return true;
	}

	if (o === "s") return _allstyle($s.y); //Handle style tags

	if (o === "1") { //Initial load initialisation
		$.detScripts($s); //Fetch scripts from DOM, "pass" variable will be 0
		return _addScripts($s, settings); //Load scripts from DOM into addScripts and initialise it
	}

	if (o === "c") return canonical && $s.can ? $s.can.attr("href") : false; //Canonical URL handling - return href
	if (o === "d") return $.detScripts($s); //fetch all scripts
	if (o instanceof jQuery) return _onetxt(o); //process one inline script only

	if ($.scripts("d")) return; //fetch all scripts
	_addScripts($s, settings); //delta-loading
}, {
	allstyle: $s =>	 //Style tag handling
		!style || !$s || ( //Style shut off or selection empty -> return
		$("head").find("style").remove(), //Remove all style tags in the DOM first
		$s.each(function() { //Iterate through selection
			var d = $(this).text(); //Grab text
			_addstyle(d); //Add single style tag
		})
		)
	,
	onetxt: $s => //Add one inline JS script - pre-processing / validation
		(!(txt = $s.text()).iO(").ajaxify(") && //Extract text and type, avoid unwanted recursion
			((inline && !skphints.find(txt)) || $s.hasClass("ajaxy") || //Check hints, class "ajaxy"
			inlhints.find(txt))
		) && _addtxt($s) //Check constraints
	,
	addtxt: $s => { //Add one inline JS script - main function
		if(!txt || !txt.length) return; //Ensure input
		if(inlineappend || ($s.prop("type") && !$s.prop("type").iO("text/javascript"))) try { return _apptxt($s); } catch (e) { }

		try { $.globalEval(txt); } catch (e1) { //instead of appending, try an eval
			try { eval(txt); } catch (e2) {
				$.log("Error in inline script : " + txt + "\nError code : " + e2);
			}
		}
	},
	apptxt: $s => $s.clone()./*addClass(inlineclass).*/appendTo("body"), //Add one inline script
	addstyle: t => $("head").append('<style>' + t + '</style>'), //add a single style tag
	addScripts: ($s, st) => ( $s.c.addAll("href", st), $s.j.addAll("src", st) )//Delta-loading of sylesheets("href") and external JS files("src")
});
// The DetScripts plugin - stands for "detach scripts"
// Works on "$s" jQuery object that is passed in and fills it
// Fetches all stylesheets in the head
// Fetches the canonical URL
// Fetches all external scripts on the page
// Fetches all inline scripts on the page
pO("detScripts", { head: 0, lk: 0, j: 0 }, 0, function ($s) {
	head = pass ? fn("head") : $("head"); //If "pass" is 0 -> fetch head from DOM, otherwise from target page
	if (!head) return true;
	lk = head.find(pass ? ".ajy-link" : "link"); //If "pass" is 0 -> fetch links from DOM, otherwise from target page
	j = pass ? fn("script") : $("script"); //If "pass" is 0 -> fetch JSs from DOM, otherwise from target page
	$s.c = _rel(lk, "stylesheet"); //Extract stylesheets
	$s.y = head.find("style"); //Extract style tags
	$s.can = _rel(lk, "canonical"); //Extract canonical tag
	$s.j = j; //Assign JSs to internal selection
	}, { //rel - Extract files that have specific "rel" attribute only
	rel: (lk, v) => $(lk).filter(function(){return($(this).attr("rel").iO(v));})
});


// The AddAll plugin
// Works on a new selection of scripts to apply delta-loading to it 
// pk parameter:
// href - operate on stylesheets in the new selection
// src - operate on JS scripts
pO("addAll", { $scriptsO: [], $sCssO: [], $sO: [], PK: 0, hints: 0 }, { deltas: true, asyncdef: false, alwayshints: false }, function ($this, pk) {
	if(!hints) hints = new Hints(alwayshints); //create Hints object during first pass
	if(!$this.length) return; //ensure input
	if(deltas === "n") return true; //If delta-loading disabled, return quickly

	PK = pk; //Copy "primary key" into internal variable

	if(deltas === false) return _allScripts($this); //process all scripts
	//deltas presumed to be "true" -> proceed with normal delta-loading

	$scriptsO = PK == "href" ? $sCssO : $sO; //Copy old.  If PK is "href" - stylesheets, otherwise JS

	if(!pass) _newArray($this); //Fill new array on initial load, nothing more
	else $this.each(function() { //Iterate through selection
		var $t = $(this), url = $t.attr(PK), async = $t.attr("async"), defer = $t.attr("defer");
		if(_classAlways($t, url)) { //Class always handling
			_removeScript(url); //remove from DOM
			_iScript($t); //insert back single external script in the head
			return;
		}
		if(url) { //URL?
			if(!_findScript(url)) { // Test, whether new
				$scriptsO.push(url); //If yes: Push to old array
				_iScript($t);
			}
			//Otherwise nothing to do
			return;
		}

		if(PK != "href") $.scripts($t); //Inline JS script? -> inject into DOM
	});
}, {
	allScripts: $t => 
		$t.each(function() { //Iterate through scripts
			_iScript($(this)); //Write out single script
		}) && true //Always return true
	,
	newArray: $t =>	 //Fill new array on initial load
		$t.each(function() { //Iterate through selection
			if($(this).attr(PK)) $scriptsO.push($(this).attr(PK)); //Copy over external sheet URLs only
		})
	,
	classAlways: ($t, url) => $t.attr("data-class") == "always" || hints.find(url), //Check for data-class = "always" and alwayshints
	iScript: $S => { //insert single script - pre-processing
		var url = $S.attr(PK);

		if(PK == "href") return $(linki.replace("*", url)).appendTo("head"); //insert single stylesheet
		if(!url) return $.scripts($S); //insert single inline script

		//Insert single external JS script - we have to go low level to avoid a warning coming from jQuery append()
		//But we'll do our best to support all salient attributes
		var script = document.createElement("script");
		script.async = asyncdef; //initialise with asyncdef - may be overwritten in _copyAttributes
		_copyAttributes(script, $S); //copy all attributes of script element generically
		document.head.appendChild(script); //it doesn't matter much, if we append to head or content element
	},
	findScript: url => !url ? false : $scriptsO.some(e => e == url), //Find URL in old array, on first positive match return true
	removeScript: $S => $((PK == "href" ? linkr : scrr).replace("!", $S)).remove() //Remove script (stylesheet or external JS) from DOM
});


// The Rq plugin - stands for request
// Stores all kinds of and manages data concerning the pending request
// Simplifies the Pronto plugin by managing request data separately, instead of passing it around...
// Second parameter (p) : data
// First parameter (o) values:
// = - check whether internally stored "href" ("h") variable is the same as the global currentURL
// ! - update last request ("l") variable with passed href
// ? - Edin's intelligent plausibility check - can spawn an external XHR abort
// v - validate value passed in "p", which is expected to be a click event value - also performs "i" afterwards
// i - initialise request defaults and return "c" (currentTarget)
// h - access internal href hard
// e - set / get internal "e" (event)
// p - set / get internal "p" (push flag)
// is - set / get internal "ispost" (flag whether request is a POST)
// d - set / get internal "d" (data for central $.ajax())
// C - set / get internal "can" ("href" of canonical URL)
// c - check whether simple canonical URL is given and return, otherwise return value passed in "p"
pO("rq", { ispost: 0, data: 0, push: 0, can: 0, e: 0, c: 0, h: 0, l: false}, 0, function (o, p) {
	if(o === "=") {
		if(p) return h === currentURL //check whether internally stored "href" ("h") variable is the same as the global currentURL
		|| h === l; //or href of last request ("l")
		return h === currentURL; //for click requests
	}

	if(o === "!") return l = h; //store href in "l" (last request)

	if(o === "?") { //Edin previously called this "isOK" - powerful intelligent plausibility check
		let xs=fn("s");
		if (!xs.iO("4") && !p) fn("a"); //if xhr is not idle and new request is standard one, do xhr.abort() to set it free
		if (xs==="1c" && p) return false; //if xhr is processing standard request and new request is prefetch, cancel prefetch until xhr is finished
		if (xs==="1p" && p) return true; //if xhr is processing prefetch request and new request is prefetch do nothing (see [options] comment below)
		//([semaphore options for requests] fn("a") -> abort previous, proceed with new | return false -> leave previous, stop new | return true -> proceed)
		return true;
	}

	if(o === "v") { //validate value passed in "p", which is expected to be a click event value - also performs "i" afterwards
		if(!p) return false; //ensure data
		_setE(p); //Set event and href in one go
		if(!_internal(h)) return false; //if not internal -> report failure
		o = "i"; //continue with "i"
	}

	if(o === "i") { //initialise request defaults and return "c" (currentTarget)
		ispost = false; //GET assumed
		data = null; //reset data
		push = true; //assume we want to push URL to the History API
		can = false; //reset can (canonical URL)
		return h; //return "h" (href)
	}

	if(o === "h") { // Access href hard
		if(p) {
			if (typeof p === "string") e = 0; // Reset e -> default handler
			h = (p.href) ? p.href : p;	// Poke in href hard
		}

		return h; //href
	}

	if(o === "e") { //set / get internal "e" (event)
		if(p) _setE(p);	//Set event and href in one go
		return e ? e : h; // Return "e" or if not given "h"
	}

	if(o === "p") { //set / get internal "p" (push flag)
		if(p !== undefined) push = p;
		return push;
	}

	if(o === "is") { //set / get internal "ispost" (flag whether request is a POST)
		if(p !== undefined) ispost = p;
		return ispost;
	}

	if(o === "d") { //set / get internal "d" (data for central $.ajax())
		if(p) data = p;
		return data;
	}

	if(o === "C") { //set internal "can" ("href" of canonical URL)
		if(p !== undefined) can = p;
		return can;
	}

	if(o === "c") return can && can !== p && !p.iO("#") && !p.iO("?") ? can : p; //get internal "can" ("href" of canonical URL)
}, {
	setE: p =>	//Set event and href in one go
		h = typeof (e = p) !== "string" ? e.currentTarget.href || e.currentTarget.action || e.originalEvent.state.url : e //extract href (link/form submit/history pop)
});

// The Frms plugin - stands for forms
// Ajaxify all forms in the specified divs
// Switch (o) values:
// d - set divs variable
// a - Ajaxify all forms in divs
pO("frms", { fm: 0, divs: 0}, { forms: "form:not(.no-ajaxy)" }, function (o, p) {
	if (!forms || !o) return; //ensure data

	if(o === "d") divs = p; //set divs variable
	if(o === "a") divs.find(forms).filter(function() { //Ajaxify all forms in divs
		return(_internal($(this).attr("action"))); //ensure "action"
	}).submit( q => { //override submit handler
		fm = $(q.target); // fetch target
		if (!fm.is("form")) { //is form? -> found
			fm = fm.filter("input[type=submit]").parents("form:first"); //for multiple fields 
			if (fm.length === 0) { //failed?
				return(true); //degrade to default handler
			}
		}

		p = _k(); //Serialise data
		var g = "get", //assume GET
		m = fm.attr("method"); //fetch method attribute
		if (m.length > 0 && m.toLowerCase() == "post") g = "post"; //Override with "post"

		var h, a = fm.attr("action"); //fetch action attribute
		if (a && a.length > 0) h = a; //found -> store
		else h = currentURL; //not found -> select current URL

		$.rq("v", q); //validate request

		if (g == "get") h = _b(h, p); //GET -> copy URL parameters
		else {
			$.rq("is", true); //set is POST in request data
			$.rq("d", p); //save data in request data
		}

		_trigger("submit", h); //raise pronto.submit event
		$().pronto({ href: h }); //programmatically change page

		return(false); //success -> disable default behaviour
	});
}, {
	k: () => { //Serialise data
		let o = fm.serialize(), 
			n = $("input[name][type=submit]", fm);

		if (!n.length) return o; else n = `${n.attr("name")}=${n.val()}`;
		return (o.length) ? `${o}&${n}` : n;
	},
	b: (m, n) => { //copy URL parameters
		if (m.iO("?")) m = m.substring(0, m.iO("?"));
		return `${m}?${n}`;
	}
});

// The stateful Offsets plugin
// Usage: 
// 1) $.offsets(<URL>) - returns offset of specified URL from internal array
// 2) $.offsets() - saves the current URL + offset in internal array
pO("offsets", { d: [], i: -1 }, 0, function (h) {
	if (typeof h === "string") { //Lookup page offset
		h = h.iO("?") ? h.split("?")[0] : h; //Handle root URL only from dynamic pages
		i = _iOffset(h); //Fetch offset
		if(i === -1) return 0; // scrollTop if not found
		return d[i][1]; //Return offset that was found
	}

	//Add page offset
	var u = currentURL, us1 = u.iO("?") ? u.split("?")[0] : u, us = us1.iO("#") ? us1.split("#")[0] : us1, os = [us, $(window).scrollTop()];
	i = _iOffset(us); //get page index
	if(i === -1) d.push(os); //doesn't exist -> push to array
	else d[i] = os; //exists -> overwrite
}, {
  iOffset: h => d.findIndex(e => e[0] == h) //find index of page within array
}
);

// The Scrolly plugin - manages scroll effects centrally
// scrolltop values: "s" - "smart" (default), true - always scroll to top, false - no scroll
// Switch (o) values:
// + - add current page to offsets
// - - scroll to current page offset
pO("scrolly", 0, { scrolltop: "s" }, function (o) {
	if(!o) return; //ensure operator
  
	var op = o; //cache operator

	if(o === "+" || o === "!") o = currentURL; //fetch currentURL for "+" and "-" operators

	if(op !== "+" && o.iO("#") && (o.iO("#") < o.length - 1)) { //if hash in URL and not standalone hash
		var $el = $("#" + o.split("#")[1]); //fetch the element
		if (!$el.length) return; //nothing found -> return quickly
		_scrll($el.offset().top); // ...animate to ID
		return;
	}

	if(scrolltop === "s") { //smart scroll enabled
		if(op === "+") $.offsets(); //add page offset
		if(op === "!") _scrll($.offsets(o)); //scroll to stored position of page

		return;
	}

	if(op !== "+" && scrolltop) _scrll(0); //otherwise scroll to top of page

	//default -> do nothing

}, {
	scrll: o => $(window).scrollTop(o)
});

// The hApi plugin - manages operatios on the History API centrally
// Second parameter (p) - set global currentURL
// Switch (o) values:
// = - perform a replaceState, using currentURL
// otherwise - perform a pushState, using currentURL
pO("hApi", 0, 0, function (o, p) {
	if(!o) return; //ensure operator
	if(p) currentURL = p; //if p given -> update current URL

	if(o === "=") history.replaceState({ url: currentURL }, "state-" + currentURL, currentURL); //perform replaceState
	else if (currentURL !== window.location.href) history.pushState({ url: currentURL }, "state-" + currentURL, currentURL); //perform pushState
});

// The Pronto plugin - Pronto variant of Ben Plum's Pronto plugin - low level event handling in general
// Works on a selection, passed to Pronto by the selection, which specifies, which elements to Ajaxify
// Switch (h) values:
// i - initialise Pronto
// <object> - fetch href part and continue with _request()
// <URL> - set "h" variable of $.rq hard and continue with _request()
pO("pronto", { $body: 0, requestTimer: 0, pfohints: 0 }, { selector: "a:not(.no-ajaxy)", prefetchoff: false, refresh: false, previewoff: true, cb: 0, bodyClasses: false, requestDelay: 0, passCount: false }, function ($this, h) {
	if(!h) return; //ensure data

	if(h === "i") { //request to initialise
		var s = settings; //abbreviation
		if($this.length) $.log("Main selector no longer needed");
		if(!pfohints) pfohints = new Hints(prefetchoff); //create Hints object during initialisation
		$.frms(0, 0, s); //initialise forms sub-plugin
		if($.slides) $.slides(0, s); //initialise optional slideshow sub-plugin
		$.scrolly(0, s); //initialise scroll effects sub-plugin
		_init_p(); //initialise Pronto sub-plugin
		return $this; //return jQuery selector for chaining
	}

	if(typeof(h) === "object") { //jump to internal page programmatically -> handler for forms sub-plugin
		$.rq("h", h);
		_request();
		return;
	}

	if(h.iO("/")) { //jump to internal page programmatically -> default handler
		$.rq("h", h);				 
		_request(true);
	}
}, { 
	init_p: () => {
		$.hApi("=", window.location.href); // Set initial state
		$(window).on("popstate", _onPop); // Set handler for popState
		if (prefetchoff !== true) {
			$(document).hoverIntent(_prefetch, () => {}, selector); //this type of call also handles dynamically inserted links
			$(document).on("touchstart", selector, _prefetch); // for touchscreens - same thing
		}

		$body = $("body"); //abbreviation
		$body.on("click.pronto", selector, _click); // Real click handler -> _click()
		$.frms("d", $body); // Select forms in whole body
		$.frms("a"); // Ajaxify forms
		//$.frms("d", $gthis); // Every further pass - select forms in content div(s) only
		if($.slides) $.slides("i"); // Init slideshow
	}, 
	prefetch: e => { //...target page on hoverIntent
		if(prefetchoff === true) return;
		if (!$.rq("?", true)) return; //semaphore check for prefetch requests
		var href = $.rq("v", e); // validate internal URL
		if ($.rq("=", true) || !href || pfohints.find(href)) return; //same page, no data or selected out
		fn("+", href, () => {});
	},
	stopBubbling: e => ( // Stop "bubbling-up"
		e.preventDefault(),
		e.stopPropagation(),
		e.stopImmediatePropagation()
	),
	click: (e, notPush) => { //...handler for normal clicks
		if(!$.rq("?")) return; //semaphore check for click requests
		var href = $.rq("v", e);  // validate internal URL
		if(!href || _exoticKey()) return; // Ignore everything but normal click
		if(href.substr(-1) ==="#") return true;
		if(_hashChange()) { // only hash part has changed
			$.hApi("=", href); // commit new URL to History API
			return true; // Enable default behaviour and return - does not invoke a full page load!
		}

		$.scrolly("+"); // Capture old vertical position of scroll bar
		_stopBubbling(e); // preventDefault and stop bubbling-up from here on, no matter what comes next
		if($.rq("=")) $.hApi("="); // if new URL is same as old URL, commit to History API
		if(refresh || !$.rq("=")) _request(notPush); // Continue with _request() when not the same URL or "refresh" parameter set hard
	}, 
	request: notPush => { // ... new url
		$.rq("!"); //we're serious about this request - disable further fetches on same URL
		if(notPush) $.rq("p", false); // mode for hApi - replaceState / pushState
		_trigger("request"); // Fire request event
		fn($.rq("h"), err => { // Call "fn" - handler of parent
			if (err) { 
				$.log("Error in _request : " + err); 
				_trigger("error", err); 
			}

			_render(); // continue with _render()
		});
	},
	render: () => { // Clear and set timer for requestDelay
		_trigger("beforeload");
		if(requestDelay) { //only needs handling if requestDelay set (not 0)
			if(requestTimer) clearTimeout(requestTimer); // Clear
			requestTimer = setTimeout(_doRender, requestDelay); // Set - unconditionally
		} else _doRender(); //requestDelay is 0 -> continue
	},
	onPop: e => { // Handle back/forward navigation
		$.rq("i"); //Initialise request in general
		$.rq("e", e); //Initialise request event
		$.rq("p", false); //We don't want to re-push
		$.scrolly("+");

		var data = e.originalEvent.state, url = data ? data.url : 0;
			
		if (!url || url === currentURL) return;	 // Check if data exists
		_trigger("request"); // Fire request event
		fn(url, _render); // Call "fn" - handler of parent, continue with _render()
	},
	doRender: () => { // Render HTML
		_trigger("load");  // Fire load event
		if(bodyClasses) { var classes = fn("body").attr("class"); $("body").attr("class", classes ? classes : null); } //Replace body classes from target page
		$.rq("C", fn("-")); // Update DOM and fetch canonical URL

		var href = $.rq("h"), // Retrieve href 
		href = $.rq("c", href); // Fetch canonical if no hash or parameters in URL
		$.frms("a"); // Ajaxify forms

		$.hApi($.rq("p") ? "+" : "=", href); // Push new state to the stack on new url
		if (fn("title")) $("title").html(fn("title").html()); // Update title

		// Stop animations + finishing off
		$.scrolly("!"); // Scroll to respective ID if hash in URL, or previous position on page
		_gaCaptureView(href); // Trigger analytics page view
		_trigger("render"); // Fire render event
		if(passCount) $("#" + passCount).html("Pass: " + pass);
		if(cb) cb(); // Callback users handler, if specified
	},
	gaCaptureView: href => { // Google Analytics support
		href = "/" + href.replace(rootUrl,"");
		if (typeof window.ga !== "undefined") window.ga("send", "pageview", href); // the new analytics API
		else if (typeof window._gaq !== "undefined") window._gaq.push(["_trackPageview", href]);  // the old API
	},
	exoticKey: () => { //not a real click, or target = "_blank", or WP-Admin link
		var href = $.rq("h"), e = $.rq("e"); //Shorthands for href and event
		return (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.currentTarget.target === "_blank"
			|| href.iO("wp-login") || href.iO("wp-admin"));
	},
	hashChange: () => { // only hash has changed
		var e = $.rq("e");
		return (e.hash && e.href.replace(e.hash, "") === window.location.href.replace(location.hash, "") || e.href === window.location.href + "#");
	}
});

var fn = jQuery.getPage; //fn is passed to Pronto as a jQuery sub-plugin, that is a callback
