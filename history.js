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
    var History = function ($this, fn, options) {

        // Local variables and helper functions
        var settings, div, History, $scriptsO,
   
        documentHtml = function(html){
                var result = String(html)
                    .replace(/<\!DOCTYPE[^>]*>/i, '')
                    .replace(/<(html|head|body|title|meta|script)([\s\>])/gi,
                         '<div class="document-$1"$2')
                    .replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
                ;

                return result;
        },
		
        outerHTML = function(e) {
            return $(e).clone().wrap('<html>').parent().html();
        },
		
        fetchDiv1 = function() {
            return settings['div1'] ? $(settings['div1']) : $('#' + $this.attr('id'));
        };

		/**
         * The constructor. Will be called automatically
         */
        var __construct = function () {

            // List of all available settings with default values
            settings = $.extend({
                'verbosity'    : 0,
                'div1' : 'body div:first',
				'completedEventName' : 'statechangecomplete',
				'scrollTo' : false
            }, options);

            if (settings['verbosity'] >= 1) {
                window.console && console.log('Entering History...');
            }
            
            var init = function () {

                if(settings['scrollTo']) {
                     $.getScript('http://4nf.org/js/scrollto.js');   
                }
				
                History = window.History;

                // Check to see if History.js is enabled for our Browser
                if ( !History.enabled ) {
                    return;
                }
				 
                div = fetchDiv1();
					
                if(fn) { 
                    var hn = fn(outerHTML(div));
                    if(hn) div.replaceWith(hn);
                    div = fetchDiv1();
					
                    if (settings['verbosity'] >= 1) {
                        window.console && console.log('Master div contents: ' + div.html());
                    }
                }

                setupClicks();
				 
                $.ajax({
                    url: location,
                    success: function(htmlO) {
                    
                        // Fetch the scripts
                        $scriptsO = $(documentHtml(htmlO)).find('.document-script');
                        if ( $scriptsO.length ) {
                             $scriptsO.detach();
                        }
                    }
                });
            }; //end init
            
            var init0 = function () {
                 $.getScript('http://4nf.org/js/bhistory.js', init);
            };
			
            $.getScript('http://4nf.org/js/urlinternal.js', init0);
            
            
        }; //end construct
    
        /**
         *
         */
        var setupClicks = function () {
            if (settings['verbosity'] >= 1) {
                window.console && console.log('setupClicks()');
            }
            
            div.find('a').each(function () {
                parseLink(this);
            });
        };

        /**
         *
         */
        var parseLink = function (l) {
            if (settings['verbosity'] >= 1) {
                window.console && console.log('parseLink(\'' + l.href + '\')');
            }

            // Link has href attribute?
            var v=l.href,v2;
            if(!v) return;

            v=v.split('//')[1];
            if(!v) return;

            v2=v.substring(v.lastIndexOf('/') + 1);
            if(v2.indexOf('.')!=-1) return; //Do not handle deep-links!

            // Make sure, link is internal
            if(!($.isUrlInternal(l.href))) return;
			
			// Check whether not-ajaxify is specified
			if($(l).find('.no-ajaxy').length) return;

            addClicker(l);
        };

        /**
         * Add event listener to link
         */
        var addClicker = function (link) {
            if (settings['verbosity'] >= 1) {
                window.console && console.log('addClicker(\'' + link.href + '\')');
            }

            link.addEventListener("click", function (e) {
                History.pushState(null, null, link.href);
                e.preventDefault();
            }, false);
        };

        /**
         *
         */
        // Hook into State Changes
        window.onstatechange = function(){
            // Prepare Variables
            var State = History.getState(),
            href = State.url;
			
            if (settings['verbosity'] >= 1) {
                window.console && console.log('statechange - \'' + href + '\'');
            }
                        
            var findScriptText = function(t) {
                var r = false;
			
                $scriptsO.each(function(){
                    var $script = $(this);
                    if($script.text() == t || $script.attr('src') == t) r = true;
                });
				 
                return r;
            };
			
            $.ajax({
                url: href,
                success: function(htmlTotal) {
                        
                //Replace content div
						
                var $data = $(documentHtml(htmlTotal)), 
                    eDiv = $data.find('#' + $this.attr('id'));
                        
                if (settings['verbosity'] >= 1) {
                    window.console && console.log('getDiv(\'' + href + '\') - getFileContents succeeded');
                } 

                
				if(fn) eDiv = fn(outerHTML(eDiv));
				if(eDiv) $('#' + $this.attr('id')).replaceWith(eDiv);
				
				if (settings['verbosity'] >= 1) {
                    window.console && console.log('replaceWith() - succeeded');
                }
				
                //Re-ajaxify content div
                div = $('#' + $this.attr('id'));
                setupClicks();
						
                //Update title
                document.title = $data.find('.document-title:first').text();
                try {
                    document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
                }
                catch ( Exception ) { }
						 
                // Fetch the scripts
                var $scripts = $data.find('.document-script');
                if ( $scripts.length ) {
                    $scripts.detach();
                }
						 
                // Add the scripts
                var contentNode = $('#' + $this.attr('id')).get(0);
						 
                $scripts.each(function(){
                    var $script = $(this), scriptText = $script.text(), scriptSrc = $script.attr('src'), scriptNode = document.createElement('script');
                             
                    if(scriptSrc) {
                        if(!findScriptText(scriptSrc)) {
                            scriptNode.src = scriptSrc;
                            contentNode.appendChild(scriptNode);
                        }
                    }
                    else {
                        if(!findScriptText(scriptText)) {
                            scriptNode.appendChild(document.createTextNode(scriptText));
                            contentNode.appendChild(scriptNode);
                        }
                    }
                });
						 
                $scriptsO = $scripts;
						 
                //Scroll To if enabled
                if(settings['scrollTo']) {
                    scrollOptions = {
                        duration: 800,
                        easing:'swing'
                    };

                    $body = $(document.body);
                    if ( $body.ScrollTo||false ) { 
                        $body.ScrollTo(scrollOptions); 
                    }
                }
                         
                // Inform Google Analytics of the change
                if ( typeof window._gaq !== 'undefined' ) {
                    window._gaq.push(['_trackPageview', History.getState().url.replace(History.getRootUrl(), '')]);
                }
                         
                //Trigger event and call callback if given
                $window=$(window);
                $cEventName=settings['completedEventName'];

                $window.trigger($cEventName);
                } //end success
            }); //end ajax

        }; //end onstatechange 
		
    // Run constructor
    __construct();
	
}; //end History class

    // Register jQuery function
    $.fn.history = function (fn, options) {
        return this.each(function(){
            var $this = $(this);
                new History($this, fn, options);
            });
    };
})(jQuery);
