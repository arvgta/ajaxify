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

$.ajax({ url: 'http://4nf.org/js/pP.min.js', async: false, crossDomain: true});
 
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */

(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery); 

var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 =  '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />', scri='<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]', scrr = 'script[src*="!"]';
var addAll = ' | $scriptsO = [], $scriptsN = [], pass = 0 | { "deltas": true } | (same) \
if(!$this.allScripts("PK", deltas)) { if(pass) $this.classAlways("PK");\
if(same) ®_sameScripts($scriptsN, "PK"); $scriptsN = []; $this.newArray($scriptsN, $scriptsO, "PK", pass);\
pass++; _findCommon($scriptsO, $scriptsN); _freeOld($scriptsO, "PK"); _realNew($scriptsN, "PK"); $scriptsO = $scriptsN.slice() }';

pU('http://4nf.org/js/ajaxifysub.js');

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
