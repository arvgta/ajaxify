/**
 * history.js
 *
 * History API Plugin
 *
 * Author: Arvind Gupta
 *
 */

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

// The getScripts plugin
(function ($) {
// The Scripts class
var Scripts = function() { 
    this.a = function($this, cb) { var s = '';
        if($this.length == 0) { cb && cb(); return; }
        $this.each(function(i){
            s += 'addsrc* = function() { $.getScript("*", *).fail(function(jqxhr, settings, exception) {alert(exception);}); }'.replace('*', i)
                .replace('*', $(this).attr('src'))
                .replace('*', i == $this.length - 1 ? 'cb' : 'addsrc' + (i + 1));
            s += i == $this.length - 1 ? ';' : ',';
        });
        
        s = 'var ' + s + '\n' + 'addsrc0();';
        
        $.log(s);
        try { eval(s); } catch(e) {alert(e);};
    };
}; //end Scripts class
 
// Register jQuery function
$.fn.getScripts = function(cb) {
    var $this = $(this);
    $.fn.getScripts.o = $.fn.getScripts.o ? $.fn.getScripts.o : new Scripts();
    $.fn.getScripts.o.a($this, cb);
    return $this;
};

})(jQuery); //end getScripts plugin
 
// The setupClicks plugin
(function ($) {
// The Links class
var Links = function(options) { var //Private
    parseLink = function(l) { l.hash = ''; //Balupton History can't handle hashes yet
        if($.isUrlInternal(l.href) && !$(l).find('.no-ajaxy').length) 
            addClicker(l);
    },
		
    addClicker = function(l) { 
        $(l).click(function(e) { 
            History.pushState(null, l.title||null, l.href);
            e.preventDefault(); 
            return false
        }); 
    };
    
    setupClicks = function($this1) {
        $this1.find('a').each(function() { 
            parseLink(this); 
        });
    };
    
    this.a = function($this) {
        $this.all('fn(*)', setupClicks);
    };
}; //end Links class
 
// Register jQuery function
$.fn.setupClicks = function(options) {
    var $this = $(this);
    init = function() { 
        $.fn.setupClicks.o = $.fn.setupClicks.o ? $.fn.setupClicks.o : new Links(options);
        $.fn.setupClicks.o.a($this);
    }
    
    $.getScript('http://4nf.org/js/urlinternal.js', init);
    
    return $this;
};

})(jQuery); //end setupClicks plugin

// The getPage plugin
(function ($) {
// The Page class
var Page = function() { var $page;
    this.a = function($this, t, p) {
        if(!t) return $page;
        
        if(t.indexOf('/') != -1) {
            var xhr = $.get(t, function(h) {
                if(!h || xhr.getResponseHeader("Content-Type").indexOf('text/html') == -1) {
                    location = t; //not HTML
                    
                    return false;
                }

                var result = String(h)
                    .replace(/<\!DOCTYPE[^>]*>/i, '')
                    .replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,
                        '<div class="document-$1"$2')
                    .replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>')
                ;
                
                $page = $(result);
                p && p();
                
                return true;
            });
            
            return true;
        }
        
        if(t == '-') {
            var pF = function(s) { return $page.find('#' + s.attr('id')); };
            $this.all('*.html(fn(*))', pF);
            $this.all('*.find(".document-link, .document-script").remove()');
            
            return $this;
        }
        
        return $page.find('.document-' + t);
    };
}; //end Page class
 
// Register jQuery function
$.fn.getPage = function(t, p) {
    var $this = $(this);
    $.fn.getPage.o = $.fn.getPage.o ? $.fn.getPage.o : new Page();
    return $.fn.getPage.o.a($this, t, p);
};

})(jQuery); //end getPage plugin

// The Scripts plugin
(function ($) {

// The Scripts class
var Scripts = function(options) { var //Private
    delta, $script, $scripts = {}, $scriptsO = {}, scriptsNo,
    
    settings = $.extend({
        'scripts'    : true
    }, options),

    det = function() {
        var links = $().getPage('link');
            jss = $().getPage('script');
            
        var csss = links.filter(function() { 
                return $(this).attr('rel').indexOf('stylesheet') != -1; }),
            srcs = jss.filter(function() { 
                return $(this).attr('src'); }),
            txts = jss.filter(function() { 
                return !($(this).attr('src')); });
            
        $scripts.c = csss;
        $scripts.s = srcs;
        $scripts.t = txts;
    }, 
    
    findText = function(m, t) { var r = false, $scriptsOM, att;
        if(!$scriptsO) return r;
        
        switch(m) {
             case 'c': $scriptsOM = $scriptsO.c; att = 'href'; break;
             case 's': $scriptsOM = $scriptsO.s; att = 'src'; break;
             case 't': $scriptsOM = $scriptsO.t; break;
             default: return r;
        }
         
        if(!$scriptsOM) return r;
        
        $scriptsOM.each(function(){ var $s = $(this);
            if( (m == 't') ? ($s.html() == t) : ($s.attr(att) == t) ) r = true;
        }); 
            
        return r;
    },
    
    addcsss = function() { $.log('Entering addcss');
        $scripts.c.each(function(){ var href = $(this).attr('href');
            if(!delta || !findText('c', href)) {
                $('head link').last().after(
                     '<link rel="stylesheet" type="text/css" href="' + href + '" />');
                $.log('CSS : ' + href);
            }
            
            return true; 
        });
    },
    
    addtxts = function() { $.log('Entering addtxts'); 
        $scripts.t.each(function(){ var txt = $(this).html();
            if(!delta || !findText('t', txt)) {
                $.log('inline script : ' + txt);
                eval(txt);
            }
            
            return true;
        });
        
        $scriptsO.c = $scriptsO.c ? $scriptsO.c.add($scripts.c) : $scripts.c;
        $scriptsO.s = $scriptsO.s ? $scriptsO.s.add($scripts.s) : $scripts.s;
        $scriptsO.t = $scripts.t;
    },
    
    addsrcs = function() { $.log('Entering addsrcs'); 
        $scripts.s.filter(function(){ return(!delta || !findText('s', $(this).attr('src'))); })
            .getScripts(addtxts);
    },
    
    add = function() { $.log('Entering scripts.add()');
        addcsss();
        addsrcs();
    };
        
    //Protected
    this.a = function() {
        det();
        add();
    };
    
    delta = settings['scripts'];
    
}; //end Scripts class

// Register jQuery function
$.scripts = function(options) {
    $.scripts.o = $.scripts.o ? $.scripts.o : new Scripts(options);
    $.scripts.o.a();
};

})(jQuery); //end Scripts plugin

// The Ajaxify plugin
(function ($) { var

// The Ajaxify class
Ajaxify = function($this, options) { var //Private
    settings = $.extend({
        'first' : 'body',
        'verbosity'    : 0,
        'completedEventName' : 'statechangecomplete',
        'scripts' : true,
        'cb' : null
    }, options),        
        
    //Helper functions
    hello = function() {
        $.log('Entering ajaxify...', 1, settings);
    },
        
    _callback = function() { var cb = settings['cb'];
        $this; if(cb) cb();
        $(window).trigger(settings['completedEventName']);
    },
    
    informGA = function() {
        typeof window._gaq !== 'undefined'  &&
        window._gaq.push(['_trackPageview',
            History.getState().url.replace(History.getRootUrl(), '')]);
    },
       
    cPage = function() { //Build up new page
        $this.getPage('-').setupClicks();
        document.title = $().getPage('title').text();
        $.scripts(settings);
        informGA();
        _callback();
    },
		
    stateChange = function(){
        $.log('Statechange: ');
        var href = History.getState().url;
        $.log(href);
        $().getPage(href, cPage);
    };
		
    // Run constructor
    $(function () { //on DOMready
        hello();
        var s = settings['first'];
        s = s ? $(s) : $this;
        s.setupClicks();
        window.onstatechange = stateChange;
    });
	
}; //end Ajaxify class

// Register jQuery function
$.fn.ajaxify = function(options) {
    var $this = $(this),
    init = function() {
        if(!History.enabled) return;     
        new Ajaxify($this, options);
    };
        
    $.getScript('http://4nf.org/js/bhistory.js', init);

    return $this;
};
    
})(jQuery); //end Ajaxify plugin
