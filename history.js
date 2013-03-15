/**
 * history.js
 *
 * History API Plugin
 *
 * Author: Arvind Gupta
 *
 */

(function ($) { 

var bHistory, //plugin-global Balupton History.js object
html, //plugin-global html - avoids passing around

// The Log class
log = new function() { var con = window.console, verbosity; //Private
    //Protected
    this.set = function(v) { verbosity = v; };
    this.w = function(m, v) {
        if(!v) v = 1;
        verbosity >= v && con && con.log(m);
    }
}, //end Log class

// The Page class
page = new function() { var $data; //Private
    gTitle = function() { return $data.find('.document-title:first').text(); };
    
    //Protected
    this.updateTitle = function() {
        document.title = gTitle(); 
        document.getElementsByTagName('title')[0].innerHTML = 
            document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
    },
    
    this.informGA = function() { 
        typeof window._gaq !== 'undefined'  && 
        window._gaq.push(['_trackPageview', 
            bHistory.getState().url.replace(bHistory.getRootUrl(), '')]); 
    },
    
    this.gClasses = function() { return $data.find('.document-script, .document-link'); }
    this.find = function(i) { return $data.find(i).html(); };
    
    this.load = function() { 
        var result = String(html)
            .replace(/<\!DOCTYPE[^>]*>/i, '')
            .replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,
                '<div class="document-$1"$2')
            .replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>')
        ;
        
        $data = $(result); 
    };
}, //end Page class

// The Scripts class
scripts = new function() { var //Private
    delta, div, $script, $scripts, $scriptsO,

    det = function() {
        var d = page.gClasses();
        $scripts = (d.length ? d.detach() : d);
    },
    
    findText = function(t) { var r = false;
        $scriptsO.each(function(){ var $s = $(this);
            if($s.attr('src') == t || $s.attr('href') == t || $s.text() == t ) r = true;
        });
            
        return r;
    },
    
    add1 = function(a) { var o =  a == 'text' ? $script.text() : $script.attr(a);
        if(!o || (delta && findText(o))) return false;
        
        log.w('script: ' + a + ' // ' + o, 2);
            
        if(a == 'href') { 
            $('head link').last().after('<link rel="stylesheet" type="text/css" href="' + o + '" />');
            return true;
        }
            
        var node = document.createElement('script');
        if(a == 'src') node.src = o;
        if(a == 'text') node.appendChild(document.createTextNode(o));
            
        div.get(0).appendChild(node);
        
        return true;
    },
		
    add = function() { 
        if(!div) return;
        $scripts.each(function(){
            $script = $(this); 
            
            var rel = $script.attr('rel');
            if( (rel && rel.indexOf('stylesheet') != -1 && add1('href'))
               || add1('src')
               || add1('text')
            ) return true;
        });
    };
        
    //Protected
    this.set = function(d) { delta = d; };
    this.handle = function(d) { div = d;
        det();
        add();
        $scriptsO = $scripts;
    };
}, //end Scripts class

// The History_API class
History_API = new function() { var //Private
    parseLink = function(l) { 
        log.w('parseLink(\'' + l.href + '\')'); 
        if($.isUrlInternal(l.href) && !$(l).find('.no-ajaxy').length && l.href.indexOf('#') == -1) 
            addClicker(l);
    },
		
    addClicker = function(l) { 
        log.w('addClicker(\'' + l.href + '\')');            
        $(l).click(function(e) { 
            bHistory.pushState(null, l.title||null, l.href);
            e.preventDefault(); 
            return false
        }); 
    };
    
    //Protected
    this.setupClicks = function(s) {
        log.w('setupClicks() on selection with ID: ' + $(s).attr('id')); 
        s.find('a').each(function() { 
            parseLink(this); 
        });
        
        log.w('setupClicks succeeded!');        
    };
}, //end History_API class

// The History class
History = function($this, options) { var //Private 
    settings = $.extend({
        'first' : 'body',
        'verbosity'    : 0,
        'completedEventName' : 'statechangecomplete',
        'scripts' : true,
        'cb' : null
    }, options),        
        
    //Getters
    gId = function() { return $thisId1; },
    gD = function() { return $(gId()); },
    gS1 = function() { return settings['first']; },

    //Local variables
    $thisId1 = gS1(), 
    pass = 0, //Handling very first page load
              
    //Helper functions
    hello = function() { 
        scripts.set(settings['scripts']);
        log.set(settings['verbosity']);
        log.w('Entering History, selection : ' + gId()); 
    },
        
    _callback = function() { var cb = settings['cb'];
        $this; if(cb) cb(); 
        if(pass) $(window).trigger(settings['completedEventName']);
    }, 
    
    handleDiv = function() { 
        if(pass) gD().html(page.find(gId())); //Load in div
        History_API.setupClicks(pass ? gD() : $(gS1()));
    },

    allDivs = function() {
        if(!pass && gS1()) { handleDiv(); return; }
        
        $this.each(function(){
            $thisId1 = '#' + $(this).attr('id');
            handleDiv();
        });
    },
    
    cPage = function() { //Build up new page
        page.load();
        allDivs();
        scripts.handle(pass ? gD() : null);
        if(pass) {
            page.updateTitle();
            page.informGA();
        }
        
        _callback();
    },
		
    cURL = function(href) { //Load in URL content via GET
        var xhr = $.get(href, function(h) { 
            if(pass && (!h || xhr.getResponseHeader("Content-Type").indexOf('text/html') == -1)) {
                    location = href; //not HTML
                    return;
            }
            
            html = h;
            cPage();
            if(!pass) window.onstatechange = stateChange; //Hook into state changes
        });
    },
        
    stateChange = function(){ pass = 1; //Handling subsequent page loads
        log.w('Statechange: ');
        var href = bHistory.getState().url;
        log.w(href);
        cURL(href);
    };
		
    // Run constructor
    $(function () { //on DOMready
        hello();
        cURL(location);
    });
	
}; //end History class

// Register jQuery function
$.fn.history = function(options) {
    var $this = $(this),
    _init = function() { 
        bHistory = window.History;
        if(!bHistory.enabled) return;            
        new History($this, options); 
    },
        
    init0 = function() { $.getScript('http://4nf.org/js/bhistory.js', _init)},
    init1 = function() { $.getScript('http://4nf.org/js/urlinternal.js', init0)}; 
	 
    init1();
        
    return $this;
};
    
})(jQuery); //end plugin
