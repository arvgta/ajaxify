/**
 * history.js
 *
 * History API Plugin
 *
 * Author: Arvind Gupta
 *
 */ 
 
(function ($) {
    // The History class
    var History = function($this, options) { var
      //Private 
        settings = $.extend({
            'div1' : 'body div:first',
            'verbosity'    : 0,
            'completedEventName' : 'statechangecomplete',
            'scripts' : true,
            'cb' : null
        }, options),        
        
        //Getters
        gId = function() { return $thisId1; },
        gD = function() { return $(gId()); },
        gS1 = function() { return settings['div1']; },

        //Local variables
        $thisId1 = gS1(), 
        scriptsd = settings['scripts'],
        cb = settings['cb'],		
        bHistory = window.History, 
        $data, $scripts, $scriptsO,
        
        //Helper functions
        documentHtml = function(html) {
            var result = String(html)
                .replace(/<\!DOCTYPE[^>]*>/i, '')
                .replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,
                    '<div class="document-$1"$2')
                 .replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>')
            ;

            return $(result);
        },
		
        hello = function() { log('Entering History, div : ' + gId(), 0); },
        
        detScripts = function() { 
            var d = $data.find('.document-script, .document-link'); 
            $scripts = (d.length ? d.detach() : d); 
        },
        
        _callback = function(f) { 
            $this; if(cb) cb(); 
            if(f) $(window).trigger(settings['completedEventName']);
        }, 

        log = function(m, v) { if(!v) v = 1; settings['verbosity'] >= v && window.console && console.log(m); },
        informGA = function() { typeof window._gaq !== 'undefined'  && window._gaq.push(['_trackPageview', bHistory.getState().url.replace(bHistory.getRootUrl(), '')]); },

        setupClicks = function(h) { 
            log('setupClicks() on div ID : ' + gId()); 
            if(h) gD().replaceWith(h); //If HTML is passed replace div
            
            //Re-ajaxify content div
            gD().find('a').each(function() { 
                parseLink(this); }
            ); 
            
            log('setupClicks succeeded!'); 
        },
		
        parseLink = function(l) { log('parseLink(\'' + l.href + '\')'); 
            if($.isUrlInternal(l.href) && !$(l).find('.no-ajaxy').length) 
                addClicker(l);
        },
		
        addClicker = function(l) { log('addClicker(\'' + l.href + '\')'); 
            l.addEventListener("click", 
                function(e) { bHistory.pushState(null, null, l.href); e.preventDefault(); }, false); 
        },
		
        updateTitle = function() { document.title = $data.find('.document-title:first').text(); 
		    document.getElementsByTagName('title')[0].innerHTML = 
                document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
        },
		
        findScriptText = function(t) { var r = false;
            $scriptsO.each(function(){ var $s = $(this); 
                if($s.text() == t || $s.attr('src') == t || $s.attr('href') == t ) r = true; 
            });
            
            return r;
        },
		
        addScripts = function() { var contentNode = gD().get(0);
            $scripts.each(function(){
                var $script = $(this), scriptText = $script.text(), scriptHref = $script.attr('href'), scriptSrc = $script.attr('src'), scriptNode = document.createElement('script');
                             
                if(scriptHref) { 
                     if(!scriptsd || !findScriptText(scriptHref)) { log('CSS : ' + scriptHref, 2);
                         $('head link').last().after('<link rel="stylesheet" type="text/css" href="' + scriptHref + '" />');
                     }
                }
                else {
                    if(scriptSrc) {
                        if(!scriptsd || !findScriptText(scriptSrc)) { log('script src : ' + scriptSrc, 2);
                            scriptNode.src = scriptSrc;
                            contentNode.appendChild(scriptNode);
                        }
                    } 
                    else {
                        if(!scriptsd || !findScriptText(scriptText)) { log('inline script : ' + scriptText, 2);
                            scriptNode.appendChild(document.createTextNode(scriptText));
                            contentNode.appendChild(scriptNode);
                        }
                    }
                }
            });
        },
        
        handleScripts = function(f) {
             detScripts();
             if(f) addScripts();
             $scriptsO = $scripts;
        },
        
        allDivs = function(h) {
            $this.each(function(){ 
                  $thisId1 = '#' + $(this).attr('id'); 
                  h();
            }); 
        },
        
        fnDiv = function() { //Replace div
            setupClicks($data.find(gId()));
        },
		
        cDivs = function(h, f) { //Replace all divs
            $data = documentHtml(h);
            if(f) allDivs(fnDiv);
            handleScripts(f);            
 
            if(!f) { 
                if(gS1()) setupClicks(); 
                else allDivs(setupClicks);              
            } else {  
                updateTitle(); informGA();
            }
                      
            _callback(f);		
        },
        
        stateChange = function(){
            var href = bHistory.getState().url;
			
            log('statechange - \'' + href + '\'');
                        
            var xhr = $.ajax({
                url: href,
                success: function(h) { 
                    if(xhr.getResponseHeader("Content-Type").indexOf('text/html') != -1) cDivs(h, 1);
                    else location = href; //not HTML                  
                }
            });
        };
		
        // Run constructor
        $(function () { //on DOMready
            hello();
            
            if(!bHistory.enabled) return;
           
            // Hook into State Changes
            window.onstatechange = stateChange;
        
            $.ajax({
                url: location,
                success: function(h) { cDivs(h); }
            });
            
        }); //end on DOMready
	
    }; //end History class

    // Register jQuery function
    $.fn.history = function(options) {
        var $this = $(this),
            _init = function() { new History($this, options); },
            init0 = function() { $.getScript('http://4nf.org/js/bhistory.js', _init)},
            init1 = function() { $.getScript('http://4nf.org/js/urlinternal.js', init0)}; 
		 
            init1();
        
        return $this;
    };
})(jQuery);
