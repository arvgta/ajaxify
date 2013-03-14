/**
 * history.js
 *
 * History API Plugin
 *
 * Author: Arvind Gupta
 *
 */

(function ($) { var 

bHistory, //Balupton History.js object

Log = function() { var con = window.console;
    this.w = function(m, v) {
        if(!v) v = 1;
        this.verbosity >= v && con && con.log(m);
    }
},

log = new Log(), //instantiate plugin-global Log object

// The Page class
Page = function() { var $data; //Private
    //Protected
    this.gTitle = function() { return $data.find('.document-title:first').text(); };
    this.gClasses = function() { return $data.find('.document-script, .document-link'); }
    this.find = function(i) { return $data.find(i).html(); };
    
    this.load = function(html) { 
        var result = String(html)
            .replace(/<\!DOCTYPE[^>]*>/i, '')
            .replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,
                '<div class="document-$1"$2')
            .replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>')
        ;
        
        $data = $(result); 
    };
}, //end Page class

page = new Page(), //instantiate plugin-global Page object

// The Scripts class
Scripts = function(delta) { var //Private
    cNode, $script, $scripts, $scriptsO,

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
            
        cNode.appendChild(node);
        
        return true;
    },
		
    add = function(div) { cNode = div.get(0);
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
    this.handle = function(f, div) {
        det();
        if(f) add(div);
        $scriptsO = $scripts;
    };
}, //end Scripts class

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
    cb = settings['cb'],
    scripts = new Scripts(settings['scripts']);    
            
    //Helper functions
    hello = function() { 
        log.verbosity = settings['verbosity'];
        log.w('Entering History, selection : ' + gId(), 0); 
    },
        
    _callback = function(f) {
        $this; if(cb) cb(); 
        if(f) $(window).trigger(settings['completedEventName']);
    }, 
    
    informGA = function() { typeof window._gaq !== 'undefined'  && window._gaq.push(['_trackPageview', bHistory.getState().url.replace(bHistory.getRootUrl(), '')]); },

    setupClicks = function(h) { 
        log.w('setupClicks() on selection : ' + gId()); 
        if(h) gD().html(h); //If HTML is passed replace div
           
        //Re-ajaxify content div
        (h ? $(gS1()) : gD()).find('a').each(function() { 
            parseLink(this); 
        }); 
            
        log.w('setupClicks succeeded!'); 
    },
		
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
    },
		
    updateTitle = function() { 
        document.title = page.gTitle(); 
        document.getElementsByTagName('title')[0].innerHTML = 
            document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
    },
		
    allDivs = function(h) {
        $this.each(function(){ 
            $thisId1 = '#' + $(this).attr('id'); 
            h();
        }); 
    },
        
    fnDiv = function() { //Replace div
        setupClicks(page.find(gId()));
    },
		
    cDivs = function(h, f) { //Replace all divs
        page.load(h);
        if(f) allDivs(fnDiv);
        scripts.handle(f, gD());            
 
        if(!f) { 
            if(gS1()) setupClicks(); 
            else allDivs(setupClicks);              
        } else {  
            updateTitle(); 
            informGA();
        }
                      
        _callback(f);		
    },
        
    stateChange = function(){
        log.w('Statechange: ');
        var href = bHistory.getState().url;
            
        log.w(href);
                        
        var xhr = $.get(href, function(h) { 
            if(h && xhr.getResponseHeader("Content-Type").indexOf('text/html') != -1) cDivs(h, 1);
            else location = href; //not HTML                  
        });
    };
		
    // Run constructor
    $(function () { //on DOMready
        hello();
            
        $.get(location, function(h) { 
            cDivs(h);
            window.onstatechange = stateChange;
        });
    }); //end on DOMready
	
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
