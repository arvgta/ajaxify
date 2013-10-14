/**
 * ajaxify.js
 *
 * Ajaxify Plugin
 *
 * Author: Arvind Gupta
 *
 * Copyright © 2013 Arvind Gupta <arvgta@gmail.com>
 * Released under the MIT License <http: www.opensource.org="" licenses="" mit-license.php="">
 *
 */
 
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */

(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery); 

// The All plugin
(function ($) {
 // The All class
var All = function() {
    this.a = function($this, t, fn) {
        $this.each(function(i) {
            t = t.split('*').join('$(this)');
            t += ';';
            eval(t);
        });
    };
}; //end All class

// Register jQuery function
$.fn.all = function(t, fn) {
    var $this = $(this);
    $.fn.all.o = $.fn.all.o ? $.fn.all.o : new All();
    $.fn.all.o.a($this, t, fn);
    return $this;
};

})(jQuery); //end All plugin

// The Log plugin
(function ($) {
// The Log class
var Log = function(options) { var con = window.console, verbosity, vp, //Private
    settings = $.extend({
        'verbosity'    : 0
    }, options);
    
    verbosity = settings['verbosity'];
    
    this.a = function(m, v) {
        if(v >= 0) vp = v;
        verbosity > vp && con && con.log(m);
    };
}; //end Log class 

// Register jQuery function
$.log = function(m, v, options) {
    $.log.o = $.log.o ? $.log.o : new Log(options);
    $.log.o.a(m, v);
};

})(jQuery); //end Log plugin

// The getPage plugin
(function ($) {
// The Page class
var Page = function() { var result1, heu, $pages = [], $page;
    var fetch = function(href) { 
        for(var i=0; i<$pages.length; i++) if($pages[i][0]==href) { 
            result1 = $pages[i][1]; 
            return; 
        }
        
        result1 = false; 
    };
    
    var isHtml = function(xhr) {  var ct=xhr.getResponseHeader("Content-Type");
        return ct && (ct.indexOf('text/html') + 1 || ct.indexOf('text/xml') + 1);
    };
    
    var _parseHTML = function(html, mode) { var r = 
        mode ? String(html)             
                .replace(/<\!DOCTYPE[^>]*>/i, '')
                .replace(/<(html|head|body|title|meta)([\s\>])/gi, '<div class="document-$1"$2')
                .replace(/<\/(html|head|body|title|meta)\>/gi,'</div>') 
             : String(html)
                  .replace(/<(script|link)([\s\>])/gi, '<div class="document-$1"$2')
                  .replace(/<\/(script|link)\>/gi,'</div>')
        ;
        
        r = $.trim(r); //Test if needed!
        return $(mode ? $.parseHTML(r, document, true) : $.parseHTML(r)) ;
    };
    
    var lDivs = function($this) { 
        var pF = function(s) { s.html(result1.find('#' + s.attr('id')).html()); };
        $this.all('fn(*)', pF);
           
        var pF2 = function(s) { $page.find('#' + s.attr('id')).remove(); };
        $this.all('fn(*)', pF2);
    };
    
    var lPage = function(hin, p, mode, post) {
            if(hin.indexOf('#')+1) hin=hin.split('#')[0];
            
            if(post) result1 = null; else fetch(hin);
            if(!result1) {            
                var xhr = $.ajax({
                        url: hin,
                        type: post ? 'POST' : 'GET',
                        data : post ? post.data : null,
                        success: function(h) {  
                            if(!h || !isHtml(xhr)) {
                            if(!mode) location = hin; //not HTML
                            }
                
                            result1 = _parseHTML(h, true);
                            
                            result1.find('.ignore').remove();
                
                            //Cache result1!
                            $pages.push([hin, result1]);
                
                            lPage2(p);
                        }
                });
                
                return;
            }
            
            lPage2(p);
            return;
    };
    
    var lPage2 = function(p) {
        $page = _parseHTML(result1.html(), false);
        p && p();
    };
    
    this.a = function($this, t, p, post) { 
        if(!t) return $page;
        
        if(t.indexOf('/') != -1) { 
            lPage(t, p, null, post); return; 
        }

        if(t == '+') lPage(p, null, true); 
        
        if(t.charAt(0) == '#') { result1.find(t).html(p); t = '-'; }
		
		if(t == '-') { lDivs($this); return $this; }
        
        return $page.find('.document-' + t);
    };        
}; //end Page class
 
// Register jQuery function
$.fn.getPage = function(t, p, post) {
    var $this = $(this);
    $.fn.getPage.o = $.fn.getPage.o ? $.fn.getPage.o : new Page();
    return $.fn.getPage.o.a($this, t, p, post);
};

})(jQuery); //end getPage plugin

// The addScript plugin
(function ($) {

// The Script class
var Script = function(options) { var //Private
    
    insert = function($Script, PK) {
        if(PK == 'href') {
            $('head').append('<link rel="stylesheet" type="text/css" ' + PK + '="' + $Script + '" />');
        } else {
            $('head').append('<script type="text/javascript" ' + PK + '="' + $Script + '" />');
        }
        $.log(PK + ' + : ' + $Script);
    },
    
    remove = function($Script, PK) {
        if(PK == 'href' ) $("link["+ PK + "*='" + $Script + "']").remove();
        else $("script["+ PK + "*='" + $Script + "']").remove();
        $.log(PK + ' - : ' + $Script);
    },
    
    find = function($Script, $Scripts) { //Find and flag common if found
        if(!$Script) return false;
        for(var i = 0; i < $Scripts.length; i++) { 
            if($Scripts[i][0] == $Script) {
                $Scripts[i][1] = 1;  //Found -> flag as common
                return true;
            }
        }
        
        return false;
    };
    
    //Protected
    this.a = function($Script, operator, PK, $Scripts) { 
        switch(operator) {
            case 'f' : return find($Script, $Scripts);
            case 'i' : return insert($Script, PK);
            case 'r' : return remove($Script, PK);
            default : $.log('Bad operator in Script');
        }
    }; //end "a" function
    
}; //end Script class

// Register jQuery function
$.addScript = function(newScript, operator, PK, Scripts) {
    $.addScript.o = $.addScript.o ? $.addScript.o : new Script();
    if(newScript) return $.addScript.o.a(newScript, operator, PK, Scripts);
};

})(jQuery); //end addScript plugin


// The addScripts plugin
(function ($) {

// The Scripts class
var Scripts = function(options) { var //Private
    //Build up two two dimensional arrays, old and new - [PK, flag]
    //Flag: 0 = new, 1 = common, 2 = old
    $scriptsO = [], PK, pass = 0,
    
    settings = $.extend({
        'deltas'    : true,
    }, options);
    
    //Protected
    this.a = function($newScripts, PK, same) { $.log("Entering Scripts a()");
        if(!settings['deltas']) {  //No deltas -> just add all scripts
            $newScripts.each(function(){
                $.addScript($(this)[0], 'i', PK);
            });
            
            return; //Quick return - no tampering of private variables
        }
        
        if(pass) $newScripts.each(function(){ 
            if($(this).attr('data-class') == 'always') { $.log('Class always detected!');
                $.addScript($(this).attr(PK), 'i', PK);
                $(this).remove();
            }
        });
        
       
        
        if(PK=='src') {  pass++; return; }
        
        if(same) { //Add all old scripts and return quickly 
            for(var i = 0; i < $scriptsN.length; i++) { //Old Array is master
                if($scriptsN[i][1] == 0) { $.addScript($scriptsN[i][0], 'i', PK); $.log('Adding old script : ' +  $scriptsN[i][0]); }
            }
            
            return;
        }
        
        //Delta loading start - delta was true
        $scriptsN = [];
        
        //Initialise new Array freshly
        $newScripts.each(function(){
            $scriptsN.push([$(this).attr(PK), 0]); //assume new
            if(!pass) $scriptsO.push([$(this).attr(PK), 0]); //only on first pass - copy to old Array
        });
        
        pass++;
        
        //A priori we're expecting just "old new" and "old common" (0/1)
        
        // Pass 1 - find common
        for(var i = 0; i < $scriptsO.length; i++) { //Old Array is master
            $scriptsO[i][1] = 2; // State: default -> old
            // Try to find in new Array -> if found -> common -> State = 1 IN BOTH arrays -> do nothing
            if($.addScript($scriptsO[i][0], 'f', PK, $scriptsN)) $scriptsO[i][1] = 1;
        }
        
        // Pass 2 - free "Old old"
        for(var i = 0; i < $scriptsO.length; i++) { //Old Array is master
            if($scriptsO[i][1] == 2) { 
                if($scriptsO[i][0]) $.addScript($scriptsO[i][0], 'r', PK);
                $scriptsO.splice(i, 1); //...and variable
            }
        }
        
        // Pass 3 - Genuinely new? -> reiterate new Array, creating where State still is 0
        for(var i = 0; i < $scriptsN.length; i++) { //New Array is master
            if($scriptsN[i][1] == 0) $.addScript($scriptsN[i][0], 'i', PK);
        }
                
        // Pass 4 - New becomes old
        $scriptsO = $scriptsN.slice();
            
    }; //end "a" function
    
    $.addScript(null, null, null, settings);
    
}; //end Scripts class

// Register jQuery function
$.fn.addScripts = function(pk, same, options) {
    $this = $(this);
    if(pk == 'href') { 
        $.fn.addScripts.h = $this.length ? $.fn.addScripts.h : new Scripts(options);
        if($this.length) $.fn.addScripts.h.a($this, pk, same);
    } else {
        $.fn.addScripts.s = $this.length ? $.fn.addScripts.s : new Scripts(options);
        if($this.length) $.fn.addScripts.s.a($this, pk, same);
    }
    return $this;
};

})(jQuery); //end addScripts plugin

// The Scripts plugin
(function ($) {

// The Scripts class
var Scripts = function(options) { var //Private
    delta, $script, $scripts = {}, $scriptsO = {}, pass = 0,
    
    settings = $.extend({
        'deltas'    : true
    }, options),
    
    det = function(same) { if(same) return; $.log('Entering det');
        var links = $().getPage('link'),
            jss = $().getPage('script');
            
        $scripts.c = links.filter(function() { 
                return $(this).attr('rel').indexOf('stylesheet') != -1; });
        $scripts.s = jss.filter(function() { 
                return $(this).attr('src'); });
        $scripts.t = jss.filter(function() { 
                return !($(this).attr('src')); });
    }, 
    
    _inline = function(txt) { var strs = settings['inline-hints'], r = false;
        strs = strs.split(', ');
        for(var i=0; i<strs.length; i++) if(txt.indexOf(strs[i]) + 1) r = true;
        return r;
    },
    
    addtxts = function() { $.log('Entering addtxts');
        $scripts.t.each(function(){ var txt = $(this).html();
            if(txt.indexOf(').ajaxify(')==-1 //Recognise own inline script, as we don't want a recursion :-)
                && (settings['inline'] || $(this).hasClass('ajaxy') || _inline(txt))) { 
                //$.log('inline script : ' + txt);
                 try {
                    $.globalEval(txt);
                } catch(e) {
                    alert(e);
                }
            }
            
            return true;
        });
    },
    
    add = function(same) { $.log('Entering scripts.add()');
        $scripts.c.addScripts('href', same);
        $scripts.s.addScripts('src', same);
        addtxts();
    };
        
    //Protected
    this.a = function(same) {
        det(same);
        if(pass++) add(same); else { $scripts.c.addScripts('href'); $scripts.s.addScripts('src'); }   
        $scriptsO.t = null;
    };
    
    delta = settings['deltas'];
    $().addScripts('href', null, settings);
    $().addScripts('src', null, settings); 
    
    
}; //end Scripts class

// Register jQuery function
$.scripts = function(options, same) {
    $.scripts.o = $.scripts.o ? $.scripts.o : new Scripts(options);
    $.scripts.o.a(same);
};

})(jQuery); //end Scripts plugin

// The Ajaxify plugin
(function ($) { var

// The Ajaxify class
Ajaxify = function($this, options) { var //Private
    settings = $.extend({
        selector: "a:not(.no-ajaxy)",
        requestKey: "pronto",
        requestDelay: 0,
        verbosity: 0,
        deltas: true,
        inline: false,
        cb: null,
        on: true
    }, options),  

    //Helper functions
   
    cPage = function(e) { //Handle scripts on page
        $.scripts(settings, e && e.same); 
        if(settings['cb']) settings['cb']();
    },
    
    initPage = function(e){
        $.log('Statechange: ');
        var href = location.href;
        $.log(href);
        cPage(e);
    };
    
    // Run constructor
    $(function () { //on DOMready
       var supported = window.history && window.history.pushState && window.history.replaceState;
       $.log('Entering ajaxify...', 1, settings);
       if(!supported) { $.log('HTML5 History API not supported properly - exiting'); return; }
       if(!$.parseHTML) { $.log('Probably jQuery version too low - 1.8+ is required - exiting'); return; }
       if(!settings['on']) { $.log('Plugin set off manually - exiting'); return; }
       
       $this.pronto(settings);
       $(window).on("pronto.render", initPage);
	
       $().getPage(location.href, cPage);
    });
	
}; //end Ajaxify class

// Register jQuery function
$.fn.ajaxify = function(options) { 
    $this = $(this);
    new Ajaxify($this, options);
	return $this;
};
    
})(jQuery); //end Ajaxify plugin


/*
* Pronto Plugin
* @author Ben Plum, Arvind Gupta
* @version 0.6.3
*
* Copyright © 2013 Ben Plum: mr@benplum.com, Arvind Gupta: arvgta@gmail.com
* Released under the MIT License
*/
 
if (jQuery) (function($) {

var $this, $window = $(window),
currentURL = '',
requestTimer = null,
post = null;

// Default Options
var options = {
    selector: "a",
    requestKey: "pronto",
    requestDelay: 0,
    forms: true,
    turbo: true,
    scrollTop: false
};

// Private Methods

// Init
function _init(opts) { 
     $.extend(options, opts || {});
     options.$body = $("body");
     options.$container = $(options.container);

     // Capture current url & state
     currentURL = window.location.href;

     // Set initial state
     _saveState();

     // Bind state events
     $window.on("popstate", _onPop);

     if(options.turbo) $(options.selector).hoverIntent( _prefetch );
     options.$body.on("click.pronto", options.selector, _click);
     ajaxify_forms();
}

function _prefetch(e) {
     var link = e.currentTarget;
     //alert(link.href);
     if(window.location.protocol !== link.protocol || window.location.host !== link.host) return;
     $().getPage('+', link.href);
}

function b(m, n) {
    if (m.indexOf("?") > 0) {
        m = m.substring(0, m.indexOf("?"))
    }
    
    return m + "?" + n
}

function k(m) {
    var o = m.serialize();
    var n;
        n = $("input[name][type=submit]", m);

    if (n.length == 0) { $.log('Nothing found in function k() !');
        return o
    }
    
    var p = n.attr("name") + "=" + n.val();
    if (o.length > 0) {
        o += "&" + p
    } else {
        o = p
    }
    
    return o
}

function ajaxify_forms(s) { 
if(!options.forms) return;

// capture submit
$('form').submit(function(q) {

    var f = $(q.target);
    if (!f.is("form")) {
        f = f.filter("input[type=submit]").parents("form:first");
        if (f.length == 0) {
            return true
        }
    }
    
    var p = k(f);
    var q = "get", m = f.attr("method");
    if (m.length > 0 && m.toLowerCase() == "post") q = "post";
    
    var h, a = f.attr("action");
    if ( a != null && a.length > 0) h = a;
    else h = currentURL;
    
    if (q == "get") h = b(h, p);
    else { post = {};  post.data = p; }
    
    $.log('Action href : ' + h);
    $window.trigger("pronto.submit", h);
    _request(h);
     
     // prevent submitting again
     return false;
});
}

// Handle link clicks
function _click(e) {
     var link = e.currentTarget; post = null;

     // Ignore everything but normal click
     if ( (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
     || (window.location.protocol !== link.protocol || window.location.host !== link.host)
     ) {
          return;
     }
     
     // Update state on hash change
     if (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#') {
        _saveState();
        return;
     }

     e.preventDefault();
     e.stopPropagation();

     if (currentURL == link.href) {
         _saveState();
     } else {
         _request(link.href);
     } 
}

// Request new url
function _request(url) { 
     // Fire request event
     $window.trigger("pronto.request");

     var req2 = function(){ 	
         _render(url, 0, true);
     };

     $().getPage(url, req2, post);
}

// Handle back/forward navigation
function _onPop(e) {
     var data = e.originalEvent.state;

     // Check if data exists
     if (data !== null && data.url !== currentURL) {
         // Fire request event
         $window.trigger("pronto.request");  
         var req3 = function(){ 	
             _render(data.url, data.scroll, false);
         };

         $().getPage(data.url, req3);
     }
}

function _render(url, scrollTop, doPush) {      
     if (requestTimer !== null) {
          clearTimeout(requestTimer);
          requestTimer = null;
     }
     
     requestTimer = setTimeout(function() {
       _doRender(url, scrollTop, doPush)
     }, options.requestDelay);
}

function _doPush(url, doPush) {
     // Update current url
     currentURL = url;

     // Push new states to the stack on new url
     if (doPush) {
          history.pushState(
               (options.scrollTop ? {
                    url: currentURL,
                    scroll: 0
          } : { url: currentURL}
        ), "state-"+currentURL, currentURL);
     } else {
     
     // Set state if moving back/forward
     _saveState();
     }
}
   
// Render HTML
function _doRender(url, scrollTop, doPush) { 
     // Fire load event
     $window.trigger("pronto.load");

     // Trigger analytics page view
     _gaCaptureView(url);

     // Update current state
     _saveState();

     // Update title
     $('title').html($().getPage('title').html());

     // Update DOM
     $this.getPage('-');
     ajaxify_forms();     
     
     // Scroll to hash if given
     if(url.indexOf('#') + 1) { 
         $('html, body').animate({
            scrollTop: $( '#' + url.split('#')[1] ).offset().top
         }, 500);
     }

     _doPush(url, doPush);

     //$.log('Trigger pronto render : ' + (post ? 1 : 0));
     
     // Fire render event
     var event = jQuery.Event("pronto.render");
     event.same = post ? true : false;
     $window.trigger(event);

     //Set Scroll position
     if(options.scrollTop) $window.scrollTop(scrollTop);
}

// Save current state
function _saveState() {
     // Update state
     if(options.scrollTop) {
          history.replaceState({
          url: currentURL,
          scroll: $window.scrollTop()
     }, "state-"+currentURL, currentURL);
     } else {
          history.replaceState({
               url: currentURL
          }, "state-"+currentURL, currentURL);
     }
}

// Google Analytics support
function _gaCaptureView(url) {
     if (typeof _gaq === "undefined") _gaq = [];
     _gaq.push(['_trackPageview'], url);
}

// Define Plugin
$.fn.pronto = function(opts) {
     $this = $(this);
     _init(opts);
     return $this;
};
})(jQuery);
