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
    this.a = function($this, t, fn, obj) {
        $this.each(function(i) {
            t = t.split('*').join('$(this)');
            t += ';';
            eval(t);
        });
    };
}; //end All class

// Register jQuery function
$.fn.all = function(t, fn, obj) {
    var $this = $(this);
    $.fn.all.o = $.fn.all.o ? $.fn.all.o : new All();
    $.fn.all.o.a($this, t, fn, obj);
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
                
                result = $.trim(result);
                $page = $($.parseHTML ? $.parseHTML(result) : result);
                p && p();
                
                return true;
            });
            
            return true;
        }
		
		if(t == '-') {
            var pF = function(s) { return $page.find('#' + s.attr('id')); };
            $this.all('*.html(fn(*).html())', pF);
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

// The addScript plugin
(function ($) {

// The Script class
var Script = function(options) { var //Private
    
    insert = function($Script, PK) {
        if(PK == 'href') {
            $('head').append(
                 '<link rel="stylesheet" type="text/css" ' + PK + '="' + $Script + '" />');
        } else {
            $('head').append(
                 '<script type="text/javascript" ' + PK + '="' + $Script + '" />');
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
    this.a = function($newScripts, PK) { $.log("Entering Scripts a()");
        if(!settings['deltas']) {  //No deltas -> just add all CSSs
            $newScripts.each(function(){
                $.addScript($(this).attr(PK), 'i', PK);
            });
            
            return; //Quick return - no tampering of private variables
        }
        
        //Delta loading start - delta was true
        $scriptsN = [];
        //$scriptsN[0] = [null, 2];  //inital null member - initalise to 'old'
        
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
$.addScripts = function(newScripts, pk, options) {
    if(pk == 'href') { 
        $.addScripts.h = newScripts ? $.addScripts.h : new Scripts(options);
        if(newScripts) $.addScripts.h.a(newScripts, pk);
    } else {
        $.addScripts.s = newScripts ? $.addScripts.s : new Scripts(options);
        if(newScripts) $.addScripts.s.a(newScripts, pk);
    }
};

})(jQuery); //end addScripts plugin

// The Scripts plugin
(function ($) {

// The Scripts class
var Scripts = function(options) { var //Private
    delta, $script, $scripts = {}, $scriptsO = {}, pass = 0,
    
    settings = $.extend({
        'scripts'    : true
    }, options),
    
    det = function() { $.log('Entering det');
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
    
    findText = function(t) { var r = false;
        if(!$scriptsO.t) return r;
        
        $scriptsO.t.each(function(){ var $s = $(this);
            if($s.html() == t) r = true;
        }); 
            
        return r;
    },
    
    addtxts = function() { $.log('Entering addtxts'); 
        $scripts.t.each(function(){ var txt = $(this).html();
            if((!delta || !findText(txt)) && txt.indexOf('ajaxify(')==-1) {
                $.log('inline script : ' + txt);
                eval(txt);
            }
            
            return true;
        });
    },
    
    add = function() { $.log('Entering scripts.add()');
        $.addScripts($scripts.c, 'href');
        $.addScripts($scripts.s, 'src');
        addtxts();
    };
        
    //Protected
    this.a = function() {
        det();
        if(pass++) add(); else { $.addScripts($scripts.c, 'href'); $.addScripts($scripts.s, 'src'); }   
        $scriptsO.t = null;
    };
    
    delta = settings['scripts'];
    $.addScripts(null, 'href', settings);
    $.addScripts(null, 'src', settings); 
    
    
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
        selector: "a:not(.no-ajaxy)",
        requestKey: "pronto",
        requestDelay: 0,
        scripts: true,
        cb: null
    }, options),  

    //Helper functions
    hello = function() {
        $.log('Entering ajaxify...', 1, settings);
    },
        
    cPage = function() { //Handle scripts on page
        $.scripts(settings);
        if(settings['cb']) settings['cb']();
    },
    
    initPage = function(){
        $.log('Statechange: ');
        var href = location.href;
        $.log(href);
        $().getPage(href, cPage);
    };
    
    // Run constructor
    $(function () { //on DOMready
       hello();
	   
       $this.pronto(settings);
       $(window).on("pronto.render", initPage);
	
       initPage();
    });
	
}; //end Ajaxify class

// Register jQuery function
$.fn.ajaxify = function(options) {
    $this = $(this);
    var init = function() {
        new Ajaxify($this, options);
    };
    
    $.getScript('http://4nf.org/js/pronto.js', init);
	return $this;
};
    
})(jQuery); //end Ajaxify plugin
