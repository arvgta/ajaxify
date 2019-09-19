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

The plugin can take an arbitrary amount of IDs, however the last one in the DOM or the one specified by "maincontent" should specify the main content element


Options default values
{
// basic config parameters
    selector : "a:not(.no-ajaxy)",  //Selector for elements to trigger swapping - not those to be swapped - e.g. a selection of links
    maincontent : false, //Default main content is last element of selection, specify a value like "#content" to override
    forms : "form:not(.no-ajaxy)", // jQuery selection for ajaxifying forms - set to "false" to disable
    canonical : false, // Fetch current URL from "canonical" link if given, updating the History API.  In case of a re-direct...
    refresh : false, // Refresh the page if link clicked is current page
 
// visual effects settings
    requestDelay : 0, //in msec - Delay of Pronto request
    aniTime : 0, //in msec - must be set for animations to work
    aniParams : false, //Animation parameters - see below.  Default = off
    previewoff : true, // Plugin previews prefetched pages - set to "false" to enable or provide hints to selectively disable
    scrolltop : "s", // Smart scroll, true = always scroll to top of page, false = no scroll
    bodyClasses : false, // Copy body classes from target page, set to "true" to enable
    idleTime: 0, //in msec - master switch for slideshow / carousel - default "off"
    slideTime: 0, //in msec - time between slides
    menu: false, //Selector for links in the menu
    addclass: "jqhover", //Class that gets added dynamically to the highlighted element in the slideshow
 
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
    verbosity : 0,  //Debugging level to console: default off.  Can be set to 10 and higher (in case of logging enabled) 
    memoryoff : false, // strings - separated by ", " - if matched in any URLs - only these are NOT executed - set to "true" to disable memory completely
    cb : null, // callback handler on completion of each Ajax request - default null
    pluginon : true // Plugin set "on" or "off" (==false) manually
}


Animation parameters (aniParams):  Default is false (set off) - specify aniTime and override the following aniParams:
{
    opacity: 1, //no fade, set to 0 for maximum fade
    width: "100%", //in percent -  "100%" means no change
    height: "100%" //in percent -  "100%" means no change
}

More animation parameters:
You can specify any parameters that are understood by .animate() !
*/


 //Intuitively better understandable shorthand for String.indexOf() - String.iO()
String.prototype.iO = function(s) { return this.toString().indexOf(s) + 1; };

//Minified hoverIntent plugin
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):jQuery&&!jQuery.fn.hoverIntent&&a(jQuery)}(function(a){"use strict";var d,e,b={interval:100,sensitivity:6,timeout:0},c=0,f=function(a){d=a.pageX,e=a.pageY},g=function(a,b,c,h){return Math.sqrt((c.pX-d)*(c.pX-d)+(c.pY-e)*(c.pY-e))<h.sensitivity?(b.off(c.event,f),delete c.timeoutId,c.isActive=!0,a.pageX=d,a.pageY=e,delete c.pX,delete c.pY,h.over.apply(b[0],[a])):(c.pX=d,c.pY=e,c.timeoutId=setTimeout(function(){g(a,b,c,h)},h.interval),void 0)},h=function(a,b,c,d){return delete b.data("hoverIntent")[c.id],d.apply(b[0],[a])};a.fn.hoverIntent=function(d,e,i){var j=c++,k=a.extend({},b);a.isPlainObject(d)?(k=a.extend(k,d),a.isFunction(k.out)||(k.out=k.over)):k=a.isFunction(e)?a.extend(k,{over:d,out:e,selector:i}):a.extend(k,{over:d,out:d,selector:e});var l=function(b){var c=a.extend({},b),d=a(this),e=d.data("hoverIntent");e||d.data("hoverIntent",e={});var i=e[j];i||(e[j]=i={id:j}),i.timeoutId&&(i.timeoutId=clearTimeout(i.timeoutId));var l=i.event="mousemove.hoverIntent.hoverIntent"+j;if("mouseenter"===b.type){if(i.isActive)return;i.pX=c.pageX,i.pY=c.pageY,d.off(l,f).on(l,f),i.timeoutId=setTimeout(function(){g(c,d,i,k)},k.interval)}else{if(!i.isActive)return;d.off(l,f),i.timeoutId=setTimeout(function(){h(c,d,i,k.out)},k.timeout)}};return this.on({"mouseenter.hoverIntent":l,"mouseleave.hoverIntent":l},k.selector)}});

//Minified idle plugin
!function(n){"use strict";n.fn.idle=function(e){var t,o,i={idle:6e4,events:"mousemove keydown mousedown touchstart",onIdle:function(){},onActive:function(){}},u=!1,c=n.extend({},i,e),l=null;return n(this).on("idle:kick",{},function(n){l=o(c)}),t=function(n,e){return u&&(e.onActive.call(),u=!1),clearTimeout(n),o(e)},o=function(n){var e,t=setTimeout;return e=t(function(){u=!0,n.onIdle.call()},n.idle)},this.each(function(){l=o(c),n(this).on(c.events,function(n){l=t(l,c)})})}}(jQuery);

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
lastevent = null; //global variable for storing last event, used to prevent prefetch if link is already clicked

//Minified pO() function - for documentation of pO() please refer to https://4nf.org/po/
function getParamNames(){return funStr.slice(funStr.indexOf("(")+1,funStr.indexOf(")"))}function JSON2Str(n,r){var t="var ",e=0;for(var o in n)if(n.hasOwnProperty(o)){var i=n[o];t+=e?",\n":"",t+="function"==typeof i?"_"+o+" = "+iLog(i.toString(),o):o+" = "+(r?'settings["':"")+(r?o+'"]':JSON.stringify(i)),e++}return t+";"}function pO(n,r,t,e,o,i){var s="",a="",f="",l="",u="",g="",p=!1,c=!1,v=mbp;if(!n||!e)return void alert("Error in pO(): Missing parameter");if(funStr=e.toString(),funStr=iLog(funStr,n),s=n.substr(0,1).toUpperCase()+n.substr(1,n.length-1),u=getParamNames(e),p=u.iO("$this"),c=u.iO("options"),g=u.replace("$this, ",""),g="$this"==u?"":g,t&&!c&&(g+=""===g?"options":", options"),r&&(a=JSON2Str(r)),t&&(f="var settings = $.extend("+JSON.stringify(t)+", options);\n",f+=JSON2Str(t,1)),o&&(l=JSON2Str(o)),t||(v=v.replace(/\(options/g,"(")),p||(v=v.replace("var $this = $(this);","")),v=v.replace(/fnn/g,p?"fn."+n:n).replace(/Name/g,s).replace("funStr",funStr).replace("pVars",a).replace("pSettings",f).replace("pFns",l).replace("args",u).replace("arg0",g),codedump&&console.log(v),!i)try{jQuery.globalEval(v)}catch(S){alert("Error : "+S+" | "+v)}}function showArgs(n){s="";for(var r=0;r<n.length;r++)null==n[r]?s+="null | ":s+=(void 0!=n[r]&&"function"!=typeof n[r]&&"object"!=typeof n[r]&&("string"!=typeof n[r]||n[r].length<=100)?n[r]:"string"==typeof n[r]?n[r].substr(0,100):typeof n[r])+" | ";return s}function iLog(n,r){var t=n.indexOf("{");return logging&&"log"!==r?(n=n.substr(0,t)+'{ $.log(lvl++ + " | '+r+" | "+n.substr(n.indexOf("("),n.indexOf(")")-n.indexOf("(")+1)+' | " + showArgs(arguments));\n'+n.substr(t+1,n.length-t-2)+"\n lvl--;}",n.replace(/return /g,"return --lvl, ").replace(/return;/g,"return --lvl, undefined;")):n}var funStr,logging=!1,codedump=!1,mbp="(function ($) { var Name = function(options){ \npVars \npSettings \n this.a = funStr; \npFns }; \n$.fnn = function(arg0) {var $this = $(this); \nif(!$.fnn.o) $.fnn.o = new Name(options); \nreturn $.fnn.o.a(args);}; \n})(jQuery);";pO("log",0,{verbosity:0},function(n,r){r&&(verbosity=r),verbosity&&n&&lvl<verbosity&&console&&console.log(n)});

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

function _root(u) { return u.iO("?") ? u.split("?")[0] : u; }

function _copyAttributes(el, $S, flush) { //copy all attributes of element generically
    if (flush) //delete all old attributes
        while(el.attributes.length > 0)
            el.removeAttribute(el.attributes[0].name);

    var attr, attributes = Array.prototype.slice.call($S[0].attributes); //slice performs a copy, too;
	
    while (attr = attributes.pop()) { //fetch one of all the attributes at a time
        el.setAttribute(attr.nodeName, attr.nodeValue); //low-level insertion
    }
}

function _searchHints(txt, hints) { //search for text in given hints, which may be array of strings or comma separated string
    if (!txt || !hints) return; //validate both are given - otherwise quick return
    if (typeof hints === "string") hints = hints.split(", "); //from here on only an array is allowed
	
    for (var i = 0; i < hints.length; i++) //search hints array
        if (txt.iO(hints[i])) return true; //if single hint found within passed text - return true
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
pO("memory", 0, { memoryoff: false }, function (h) {
     if (!h || memoryoff === true) return false; //validate input, if memoryoff set to true return false quickly
     if (memoryoff === false) return h; //if memoryoff set to false return the URL quickly
     var lnk= $.rq("v", $.rq("e")); //getting clicked link for reading class attribute
     return (_searchHints(h, memoryoff) || _searchHints(lnk.getAttribute("class"), memoryoff)) ? false : h; //apply hints mechanism -> found: return false, otherwise return URL (added class attribute check)
});
		
// The stateful Pages plugin
// Usage - parameter "h" values:
// <URL> - returns page with specified URL from internal array
// <jQuery object> - saves the passed page in internal array
// false - returns false
pO("pages", { d: [], i: -1 }, 0, function (h) {
    if (typeof h === "string") { //URL or "f" passed
        if(h === "f") d = []; //"f" ? -> flush internal array
        else { //URL passed
            i = _iPage(h); //get page index
            if(i === -1) return; //not found return nothing
            return d[i][1]; //return entire page
        }
    }
	
    if (typeof h === "object") { //jQuery object passed [href, <page>]
        i = _iPage(h[0]); //check whether href in array already?
        if(i === -1) d.push(h); //no -> add to array
        else d[i] = h; //update complete object
    }
	
    if (typeof h === "boolean") return false; //false in - false out
}, {
    iPage: function (h) { //get index of page, -1 if not found
        for (var i = 0; i < d.length; i++)
            if (d[i][0] == h) return i;
        return -1;
    }
}
);

// The GetPage plugin
// First parameter (o) is a switch: 
// empty - returns cache
// <URL> - loads HTML via Ajax, second parameter "p" must be callback
// + - pre-fetches page, second parameter "p" must be URL, third parameter "p2" must be callback 
// - - loads page into DOM and handle scripts, second parameter "p" must hold selection to load
// x - returns XHR
// otherwise - returns selection of current page to client

pO("getPage", { xhr: 0, cb: 0, plus: 0 }, 0, function (o, p, p2) { 
    if (!o) return $.cache1(); //nothing passed -> return currently cached page

    if (o.iO("/")) { //URL
        cb = p; //second parameter "p" must be callback
        if(plus == o) return; //same URL as in "plus" variable? -> return
        return _lPage(o); //load page with the URL and return it
    }
    if (o === "+")  { //pre-fetch page
        plus = p; //store second parameter "p" in "plus" variable
        cb = p2; //third parameter "p2" must be callback 
        return _lPage(p, true); //load page with the URL, indicating a pre-fetch in second parameter (true)
    }
	
    if (o === "-") return _lSel(p); //load page into DOM, handle scripts and fetch canonical URL. "p" must hold selection to load
    if (o === "x") return xhr; //return xhr object dynamically

    if (!$.cache1()) return;
    if (o === "body") return $.cache1().find("#ajy-" + o);
    if (o === "script") return $.cache1().find(o); //scripts are not escaped

    return $.cache1().find(o === "title" ?  "title:first" : ".ajy-" + o); //default -> return element requested from cached page

}, {
    lSel: function ($t) { //load selection specified in "$t" into DOM, handle scripts and fetch canonical URL
        pass++; //central increment of "pass" variable
        _lDivs($t); //load selection specified in "$t" into DOM
        $.scripts(true); //invoke delta-loading of JS
        $.scripts("s"); //invoke delta-loading of CSS
        return $.scripts("c"); //return canonical URL
    },
		
    lPage: function (h, pre) { //fire Ajax load, check for hash first, "pre" indicates a prefetch
         if (h.iO("#")) h = h.split("#")[0]; //get first part before hash
         if ($.rq("is") || !$.cache1(h)) return _lAjax(h, pre); //if request is a POST or page not in cache, really fire the Ajax request
		 
         plus = 0; //otherwise reset "plus" variable
         if (cb) return cb(); //fire callback, if given
    },
		
    ld: function ($t, $h) { //load HTML of target selection into DOM
        if(typeof $h[0] == "undefined") { //target element absent or corrupted
            $.log("Inserting placeholder for ID: " + $t.attr("id"));
            var tagN = $t.prop("tagName").toLowerCase();
            $t = $t.replaceWith("<" + tagN + " id='" + $t.attr("id") + "'></" + tagN + ">"); //insert empty hidden element with id as a placeholder
            return; //Skip this element and continue - skip the rest of the _ld() function
        }
		
        var $c = $h.clone(); //we want to preserve the original target element
        $c.find("script").remove(); //prevent double firing of scripts
        _copyAttributes($t[0], $c, true); //copy tag attributes of element, flushing the first parameter initially
        $t.html($c.html()); //inject element into primary DOM
    },
		
    lDivs: function ($t) { //load target selections into DOM
        if ($.cache1()) $t.each(function() { //iterate through elements
            _ld($(this), $.cache1().find("#" + $(this).attr("id"))); //load target element into DOM
        });
    },
		
    lAjax: function (hin, pre) { //execute Ajax load
        var ispost = $.rq("is"); //POST?
                
        xhr = $.ajax({ //central AJAX load, for both POSTs and GETs
        url: hin, //URL
        type: ispost ? "POST" : "GET", //POST or GET?
        data: ispost ? $.rq("d") : null, //fetch data from $.rq
        success: function(h) { //success -> "h" holds HTML
            if (!h || !_getState(xhr)) { //HTML empty or not HTML or XML? (changed isHtml just to check if request is successful)
                 if (!pre) location.href = hin; //If not a pre-fetch -> jump to URL as an escape
            }
            
            $.cache1($(_parseHTML(h))); //Clean HTML and load it into cache
            $.pages([hin, $.cache1()]); //Load object into $.pages, too
            plus = 0; //Reset "plus" variable, indicating no pre-fetch has happened

            if (cb) return(cb()); //Call callback if given
        },
        error: function(jqXHR, status, error) {
        // Try to parse response text
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
		
    isHtml: function (x) { //restrict interesting MIME types - only HTML / XML
        var d;
        return (d = x.getResponseHeader("Content-Type")), d && (d.iO("text/html") || d.iO("text/xml"));
    },
	
    getState: function(x) {
            return x.readyState; // return xhr readyState
    },
		
    parseHTML: function (h) { //process fetched HTML
        return $.parseHTML($.trim(_replD(h)), null, true); //trim escaped HTML of entire page
    },
		
    replD: function (h) { //pre-process HTML so it can be loaded by jQuery
        return String(h).replace(docType, "").replace(tagso, div12).replace(tagsod, divid12).replace(tagsc, "</div>");
    }
}
);

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
        init: function (s) { //main intialisation of Pronto and its sub-plugins
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
    }
);

// The stateful Scripts plugin
// First parameter "o" is switch:
// i - initailise options
// c - fetch canonical URL
// jQuery object - handle one inline script
// otherwise - delta loading
pO("scripts", { $s : false, cd0 : 0 }, { canonical: false, inline: true, inlinehints: false, inlineskip: "adsbygoogle", inlineappend: true, style: true }, function (o) {
    if (o === "i") { //Initalise
        if(!$s) $s = $(); //Start off with empty internal jQuery object
        return true;
    }
    
    if (o === "s") return _allstyle($s.y); //Handle style tags
            
    if (o === "1") { //Initial load initialisation
        $.detScripts($s); //Fetch scripts from DOM, "pass" variable will be 0
        cd0 = $.cd("g").get(0); //Load main content element node into "cd0"
        return _addScripts($s, settings); //Load scripts from DOM into addScripts and initialise it
    }
            
    if (o === "c") { //Canonical URL handling
        if (canonical && $s.can) return $s.can.attr("href"); //Return "href" only
        else return false; //No canonical found
    }
	
    if (o==="d") return $.detScripts($s); //fetch all scripts
    
    if (o instanceof jQuery) return _onetxt(o); //process one inline script only
	
    $.scripts("d"); //fetch all scripts
    _addScripts($s, settings); //delta-loading
}, {
    allstyle: function ($s) { //Style tag handling
        if (!style || !$s) return; //Style shut off or selection empty -> return
        $("head").find("style").remove(); //Remove all style tags in the DOM first
        $s.each(function() { //Iterate through selection
            var d = $(this).text(); //Grab text
            _addstyle(d); //Add single style tag
        });
    },
    onetxt: function ($s) { //Add one inline JS script - pre-processing / validation
        var txt = $s.text(), t = $s.prop("type"); //Extract text and type
        if (!txt.iO(").ajaxify(") && 
            ((inline && !_searchHints(txt, inlineskip)) || $s.hasClass("ajaxy") || 
            _searchHints(txt, inlinehints))
        ) _addtext(txt, t, $s); //Check constraints
    },
    addtext: function (t, type, $s) { //Add one inline JS script - main function
        if(!t || !t.length) return; //Ensure input
        if(inlineappend || (type && !type.iO("text/javascript"))) try { return _apptext($s); } catch (e) { }
        
        try { $.globalEval(t); } catch (e1) { //instead of appending, try an eval
            try { eval(t); } catch (e2) {
                $.log("Error in inline script : " + t + "\nError code : " + e2);
            }
        }
    },
    apptext: function ($s) {  
        $s.clone().appendTo($.cd("g"));
    },
    addstyle: function (t) { //add a single style tag
        $("head").append('<style>' + t + '</style>');
    },
    addScripts: function ($s, st) { //Delta-loading of sylesheets and external JS files
        $s.c.addAll("href", st); //Stylesheets
        $s.j.addAll("src", st); //External JS files
    }
}
);
// The DetScripts plugin - stands for "detach scripts"
// Works on "$s" jQuery object that is passed in and fills it
// Fetches all stylesheets in the head
// Fetches the canonical URL
// Fetches all external scripts on the page
// Fetches all inline scripts on the page
pO("detScripts", { head: 0, lk: 0, j: 0 }, 0, function ($s) {
    head = pass ? $.getPage("head") : $("head"); //If "pass" is 0 -> fetch head from DOM, otherwise from target page
    lk = head.find(pass ? ".ajy-link" : "link"); //If "pass" is 0 -> fetch links from DOM, otherwise from target page
    j = pass ? $.getPage("script") : $("script"); //If "pass" is 0 -> fetch JSs from DOM, otherwise from target page
    $s.c = _rel(lk, "stylesheet"); //Extract stylesheets
    $s.y = head.find("style"); //Extract style tags
    $s.can = _rel(lk, "canonical"); //Extract canonical tag
	$s.j = j; //Assign JSs to internal selection
    }, {
    rel: function(lk, v) { //Extract files that have specific "rel" attribute only
        return $(lk).filter(function(){return($(this).attr("rel").iO(v));});
    }
    }
);


// The AddAll plugin
// Works on a new selection of scripts to apply delta-loading to it 
// pk parameter:
// href - operate on stylesheets in the new selection
// src - operate on JS scripts
pO("addAll", { $scriptsO: [], $sCssO: [], $sO: [], PK: 0 }, { deltas: true, asyncdef: false, alwayshints: false }, function ($this, pk) {
    if(!$this.length) return; //ensure input
    if(deltas === "n") return true; //If delta-loading disabled, return quickly
	
    PK = pk; //Copy "primary key" into internal variable

    if(deltas === false) return _allScripts($this); //process all scripts
    //deltas presumed to be "true" -> proceed with normal delta-loading
	
    if(PK == "href") { //Stylesheets
        $scriptsO = $sCssO; //Copy old
    } else { //JS scripts
        $scriptsO = $sO; //Copy old
    }

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
        
        if(PK != "href") {  
            $.scripts($t); //Inline JS script? -> inject into DOM
        }
    });
    }, {
    allScripts: function ($t) {
        $t.each(function() { //Iterate through selection
            _iScript($(this)); //Write out single script
        });
        
        return true;
    },
    newArray: function ($t) { //Fill new array on initial load
        $t.each(function() { //Iterate through selection
            if($(this).attr(PK)) $scriptsO.push($(this).attr(PK)); //Copy over external sheet URLs only	 
        });
    },
    classAlways: function ($t, url) { return $t.attr("data-class") == "always" || _searchHints(url, alwayshints); }, //Check for data-class = "always" and alwayshints
    iScript: function ($S) { //insert single script - pre-processing
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
    findScript: function (url) { //Find URL in old array
        if(!url) return false;
        for(var i = 0; i < $scriptsO.length; i++)  //Iterate through old array
            if(url == $scriptsO[i]) return true; //Match found -> common!
		
		return false;
    },
    removeScript: function ($S) { //Remove single script from DOM
        $((PK == "href" ? linkr : scrr).replace("!", $S)).remove(); //Remove script (stylesheet or external JS)
    }
    }
);

// The Cd plugin
// Manages various operations on the main content element
// Second parameter (p) is callback
// First parameter (o) is switch:
// s - stop current animation on the main content element
// g - fetch main content element
// i - initialise (main content element, aniParams, frm)
// 1 - invoke first phase of animation
// 2 - invoke second phase of animation
// 3 - invoke third and last phase of animation
pO("cd", { cd: 0, aniTrue: 0, frm: 0, cdwidth: 0 }, { maincontent: false, aniParams: false, aniTime: 0 }, function (o, p) {
    if(!o) return; //Ensure operator
	
    if(o === "s") return cd.stop(true, true); //Stop current animation on the main content element
    
    if(o === "g") return cd; //Fetch main content element

    if(o === "i") { //Initialise (main content element, aniParams, frm)
        cd = maincontent ? p.filter(maincontent) : p.last(); //Set to maincontent if given otherwise last element in DOM of selection
        aniTrue = aniTime && aniParams; //aniTime and aniParams has to be set for animations to work
        cdwidth = cd.width(); //Abbreviate cd width
        if(!aniTrue) return; //Animations not enabled -> return
		
        aniParams = $.extend({ //override default aniParams with user aniParams
            opacity: 1, // default - no fade
            width: "100%", // default - no change in width
            height: "100%" // default - no change in height
        }, aniParams);
		
        aniParams = $.extend({ //calculate marginRight
            marginRight: cdwidth - aniParams.width //making the content element width self-managing
        }, aniParams);
		
        frm = $.extend({}, aniParams); //store in "frm" ("from" jQuery object) with aniParams
		
        for(var key in frm) { //iterate through "frm" collection
            if (frm.hasOwnProperty(key)) { //real key?
                var keyval = cd.css(key), keyOval = frm[key]; //Populate old / new key value

                if((key === "height") && keyOval.iO("%")) { //Treat "height" specially
                    keyval = 10000 / +keyOval.substr(0, keyOval.iO("%")-1) + "%"; //Calculate new height
                }

                frm[key] = keyval; //Store keyval in "frm"
            }
        }     
    }
	
    if(!p) return; //Ensure data - further operations require data
	
    if(!aniTrue) { p(); return; } //Call callback, if animations disabled
	
    if (o === "1" || o === "2" || o === "3") { //Phases of animation
        cd.stop(true, true); //stop animation of main content element
        if(o === "3")  { p(); return; } //if last phase, do not spawn a new animation
        cd.animate(o === "1" ? aniParams : frm, aniTime, p); //new animation
    }
});

// The Slides plugin - stands for slideshow / carousel
// Enable a slideshow on the main content element
// idleTime must be set to enable the slideshow
// Switch (o) values:
// i - initailise
pO("slides", { timer: false, currEl: 0, currentLink: 0}, { idleTime: 0, slideTime: 0, menu: false, addclass: "jqhover"}, function (o) {
    if(!o || !idleTime) return; //Ensure data
	
    if (o === "i") { //Initialise
        $(document).idle({ onIdle: _onIdle, onActive: _onActive, idle: idleTime }); //Initialise idle plugin
        $(window).on("popstate", _onActive); // Set handler for popState
    }
}, {
    onIdle: function(){ //User was not active for given idleTime
        if(timer !== false) return; //Already idle -> nothing to do		
        _trigger("idle"); //Fire generic event		
        _slide1(true); //Commence slideshow - perform a single slide - indicating pushState
        timer = setInterval(_slide1, slideTime); //"_slide1" to be called periodically, indicating replaceState
    },
    onActive: function(){ //User has become active again
        _trigger("active"); //Fire generic event
        if(currEl) currEl.removeClass(addclass); //Remove class from currEl
        if(timer !== false) clearInterval(timer); //If timer set -> clear timer
        timer = false; //reset timer value
    },
    slide1: function(push) { //Perform a single slide - "push" indicates History API modus: pushState, otherwise replaceState
        currentLink = _nextLink(); //Get next URL from menu 
        $().pronto( push ? { href: currentLink } : currentLink); //Call Pronto to change to that page programmatically
    }, 
    nextLink: function() { //Fetch next URL and manage transition to next page
        var wasPrev = false, firstValue = false, firstLink = false, nextLink = false, lnk; //Declare variables needed with defaults
        $(menu).each(function(i, v){ //Iterate through menu
            var el = $(this).parent(); //Get parent of menu element
            if(nextLink) return(true); //nextLink already found -> return
            lnk = v.href; //fetch href of element
            if(!_internal(lnk)) return; //verify internal
            el.removeClass(addclass); //remove old highlight
            if(!firstValue) firstValue = $(this).parent(); //populate firstValue
            if(!firstLink) firstLink = lnk; //populate firstLink
            if(wasPrev) { 
                nextLink = lnk;
                currEl = el;
                el.addClass(addclass);
            }
            else if(currentURL == lnk) wasPrev = true;
        });
			
        if(!nextLink) { //end of menu found
             firstValue.addClass(addclass); //highlight firstValue
             nextLink = firstLink; //start at the top again
             currEl = firstValue; //set currEl to top value
        }
		
        return nextLink; //return next URL
    }
});

// The Rq plugin - stands for request
// Stores all kinds of and manages data concerning the pending request
// Simplifies the Pronto plugin by managing request data separately, instead of passing it around...
// Second parameter (p) : data
// First parameter (o) values:
// = - check whether internally stored "href" ("h") variable is the same as the global currentURL
// v - validate value passed in "p", which is expected to be a click event value - also performs "i" afterwards
// i - initialise request defaults and return "l" (currentTarget)
// h - access internal href hard
// l - get internal "l" (currentTarget)
// e - set / get internal "e" (event)
// p - set / get internal "p" (push flag)
// is - set / get internal "ispost" (flag whether request is a POST)
// d - set / get internal "d" (data for central $.ajax())
// can - set / get internal "can" ("href" of canonical URL)
// can? - check whether simple canonical URL is given and return, otherwise return value passed in "p"
pO("rq", { ispost: 0, data: 0, push: 0, can: 0, e: 0, l: 0, h: 0}, 0, function (o, p) {
    if(o === "=") { 
        return h === currentURL; //check whether internally stored "href" ("h") variable is the same as the global currentURL
    }
    
    if(o === "v") { //validate value passed in "p", which is expected to be a click event value - also performs "i" afterwards
        if(!p) return false; //ensure data
        e = p; //store event internally
        l = e.currentTarget; //extract currentTarget
        h = l.href; //extract href
        if(!_internal(h)) return false; //if not internal -> report failure
        o = "i"; //continue with "i"
    }
    
    if(o === "i") { //initialise request defaults and return "l" (currentTarget)
        ispost = false; //GET assumed
        data = null; //reset data
        push = false; //reset push
        can = false; //reset can (canonical URL)
        return l; //return "l" (currentTarget)
    }
    
    if(o === "h") { // Access href hard
        if(p) {
            e = 0;  // Reset e
            h = p;  // Poke in href hard
        }
        
        return h; //href
    }
    
    if(o === "l") return l; //return "l" (currentTarget)
    if(o === "e") { //set / get internal "e" (event)
        if(p) e = p;
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
	
    if(o === "can") { //set internal "can" ("href" of canonical URL)
        if(p !== undefined) can = p;
        return can;
    }
	
    if(o === "can?") return can && can !== p && !p.iO("#") && !p.iO("?") ? can : p; //get internal "can" ("href" of canonical URL)
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
    }).submit(function(q) { //override submit handler
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
                
        $.rq("i"); //initialise request
               
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
    k: function () { //Serialise data
        var o = fm.serialize();
        var n = $("input[name][type=submit]", fm);
        if (n.length === 0) return o;
        var p = n.attr("name") + "=" + n.val();
        if (o.length > 0) {
            o += "&" + p;
        } else {
            o = p;
        }
        
        return o;
    },
    b: function (m, n) { //copy URL parameters
        if (m.indexOf("?") > 0) {
            m = m.substring(0, m.indexOf("?"));
        }
        return m + "?" + n;
    }
});


// The RqTimer plugin - stands for request Timer
// Works on requestDelay setting
// Switch (p) values:
// - - clear Timer
// function - set Timer according to requestDelay, using function in p as a callback
pO("rqTimer", { requestTimer: 0 }, { requestDelay: 0 }, function (o) {
    if(!o) return; //ensure operator

    if(o === "-" && requestTimer) return clearTimeout(requestTimer); //clear timer
    if(typeof(o) === "function") requestTimer = setTimeout(o, requestDelay); //set timer
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
  iOffset: function (h) { //get index of page, -1 if not found
        for (var i = 0; i < d.length; i++)
            if (d[i][0] == h) return i;
        return -1;
    }
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

}, { scrll: function (o) { $(window).scrollTop(o); } }
);

// The hApi plugin - manages operatios on the History API centrally
// Second parameter (p) - set global currentURL
// Switch (o) values:
// = - perform a replaceState, using currentURL
// otherwise - perform a pushState, using currentURL
pO("hApi", 0, 0, function (o, p) {
    if(!o) return; //ensure operator
    if(p) currentURL = p; //if p given -> update current URL

    if(o === "=") history.replaceState({ url: currentURL }, "state-" + currentURL, currentURL); //perform replaceState
    else history.pushState({ url: currentURL }, "state-" + currentURL, currentURL); //perform pushState
});

// The Pronto plugin - Pronto variant of Ben Plum's Pronto plugin - low level event handling in general
// Works on a selection, passed to Pronto by the selection, which specifies, which elements to Ajaxify
// Last element in order of the DOM should be the main content element, unless overriden by "maincontent"
// Switch (h) values:
// i - initialise Pronto
// <object> - fetch href part and continue with _request()
// <URL> - set "h" variable of $.rq hard and continue with _request()
pO("pronto", { $gthis: 0 }, { selector: "a:not(.no-ajaxy)", prefetchoff: false, refresh: false, previewoff: true, cb: 0, bodyClasses: false }, function ($this, h) {
     if(!h) return; //ensure data
     
     if(h === "i") { //request to initialise
         var s = settings; //abbreviation
         if(!$this.length) $.log("Warning - empty content selector passed!");
         $gthis = $this; //copy selection to global selector
         $.cd(0, 0, s); //initialise content element sub-plugin
         $.frms(0, 0, s); //initialise forms sub-plugin
         $.slides(0, s); //initialise slideshow sub-plugin
         $.rqTimer(0, s); //initialise request timer sub-plugin
         $.scrolly(0, s); //initialise scroll effects sub-plugin
         $.cd("i", $gthis); //second phase of initialisation of content element sub-plugin
         _init_p(); //initialise Pronto sub-plugin
         return $this; //return jQuery selector for chaining
     }
     
     if(typeof(h) === "object") { //jump to internal page programmatically -> handler for forms sub-plugin
          $.rq("h", h.href);
          _request();
          return;
     }
     
     if(h.iO("/")) { //jump to internal page programmatically -> default handler
         $.rq("h", h);				 
         _request(true);
     }
}, { 
 init_p: function() {
    $.hApi("=", window.location.href); // Set initial state
    $(window).on("popstate", _onPop); // Set handler for popState
    if (prefetchoff !== true) {
        $(document).hoverIntent(_prefetch, function(){}, selector); //this type of call also handles dynamically inserted links
        //  $(document).on("touchstart", selector, _prefetch); // for touchscreens - same thing  
        $(document).one("touchstart", function(){ prefetchoff = true;}); //reversed change from line above because history is not pushing for mobile devices
    }
	
    var $body = $("body"); //abbreviation
    $body.on("click.pronto", selector, _click); // Real click handler -> _click()
    $.frms("d", $body); // Select forms in whole body
    $.frms("a"); // Ajaxify forms
    $.frms("d", $gthis); // Every further pass - select forms in content div(s) only
    $.slides("i"); // Init slideshow
  }, 
 prefetch: function(e) { //...target page on hoverIntent
       if(prefetchoff === true) return;
       var lnk = $.rq("v", e); // validate internal URL
       if ($.rq("=") || !lnk || _searchHints(lnk.href, prefetchoff) || _searchHints(lnk.getAttribute("class"), prefetchoff)) return; //same page, no data or selected out (added class attribute check)
       var leventlnk=$.rq("v", lastevent); //getting last event link for comparison
       if (lnk.href==leventlnk.href) return; //if links are same, stop prefetch
        
       lastevent = e; //store last event
       fn("+", lnk.href, function() { //prefetch page
            if (previewoff === true) return(false);
            if (!_isInDivs(lnk) && (previewoff === false || !_searchHints(lnk.href, previewoff) || _searchHints(lnk.getAttribute("class"), prefetchoff))) _click(e, true);
       });
  },
 isInDivs: function(lnk) {
      var is = false;
      $gthis.each(function() {
          if ($(lnk).parents("#" + $(this).attr("id")).length > 0) is = true;
      });      
         
      return is;
  },
 stopBubbling: function(e) { // Stop "bubbling-up"
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
 },
 click: function(e, mode) { //...handler for normal clicks
      var link = $.rq("v", e);  // validate internal URL
      if(!link || _exoticKey(e)) return; // Ignore everything but normal click
      lastevent = e; //store last event
      if(link.href.substr(-1) ==="#") return true;
      if(_hashChange(link)) { // only hash part has changed
          $.hApi("=", link.href); // commit new URL to History API
          return true; // Enable default behaviour and return - does not invoke a full page load!
      }

      $.scrolly("+"); // Capture old vertical position of scroll bar
      _stopBubbling(e); // preventDefault and stop bubbling-up from here on, no matter what comes next
      if($.rq("=")) $.hApi("="); // if new URL is same as old URL, commit to History API
      if(refresh || !$.rq("=")) _request(); // Continue with _request() when not the same URL or "refresh" parameter set hard
  }, 
 request: function(notPush) { // ... new url
      $.rq("p", !notPush); // mode for hApi - replaceState / pushState
      _trigger("request"); // Fire request event
      fn($.rq("h"), function(err) { // Call "fn" - handler of parent
          if (err) { 
              $.log("Error in _request : " + err); 
              _trigger("error", err); 
          }
          
          _render(); // continue with _render()
      });
  },
 render: function() { // Clear and set timer
      $.rqTimer("-"); // Clear
      _trigger("beforeload");
      $.rqTimer(function() { $.cd("1", _doRender); }); // Set.  Animate to
  },
 onPop: function(e) { // Handle back/forward navigation
      $.rq("i"); //Initialise request in general
      $.rq("e", e); //Initialise request event
      $.scrolly("+");
            
      var data = e.originalEvent.state, url = data ? data.url : 0;
           
      if (!url || url === currentURL) return;  // Check if data exists
      _trigger("request"); // Fire request event
      fn(url, _render); // Call "fn" - handler of parent, continue with _render()
  },
 doRender: function() { // Render HTML
      _trigger("load");  // Fire load event
      if(bodyClasses) { var classes = fn("body").attr("class"); $("body").attr("class", classes ? classes : null); } //Replace body classes from target page
      $.rq("can", fn("-", $gthis)); // Update DOM and fetch canonical URL
      let title = fn("title"); //get title
      $("title").html((title != undefined) ? title.html() : ''); //set title.html if it's not undefined
      $.cd("2", _doRender2); // Animate back - continue with _doRender2()
  },
 doRender2: function() { // Continue render
      var e = $.rq("e"), // Fetch event 
      url = _getURL(e); // Get URL from event
      url = $.rq("can?", url); // Fetch canonical if no hash or parameters in URL
      $.frms("a"); // Ajaxify forms - in content divs only
           
      $.hApi($.rq("p") ? "+" : "=", url); // Push new state to the stack on new url
      $.cd("3", function() { // Stop animations + finishing off
         $.scrolly("!"); // Scroll to respective ID if hash in URL, or previous position on page
         _gaCaptureView(url); // Trigger analytics page view
         _trigger("render"); // Fire render event
         if(cb) cb(); // Callback users handler, if specified
      });
  },
 getURL: function(e) { // Get URL from event
      return typeof e !== "string" ? e.currentTarget.href || e.originalEvent.state.url : e;					
  },
 gaCaptureView: function(url) { // Google Analytics support
      url = "/" + url.replace(rootUrl,"");
      if (typeof window.ga !== "undefined") window.ga("send", "pageview", url); // the new analytics API
      else if (typeof window._gaq !== "undefined") window._gaq.push(["_trackPageview", url]);  // the old API					
  },
 exoticKey: function(e) { //not a real click, or target = "_blank", or WP-Admin link
      var url = _getURL(e); // Get URL from event
      return (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.currentTarget.target === "_blank"
          || url.iO("wp-login") || url.iO("wp-admin"));
  },
 hashChange: function(link) { // only hash has changed
      return (link.hash && link.href.replace(link.hash, "") === window.location.href.replace(location.hash, "") || link.href === window.location.href + "#");
  }
});

var fn = jQuery.getPage; //fn is passed to Pronto as a jQuery sub-plugin, that is a callback
