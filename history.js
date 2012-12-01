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

        // Local variables
        var settings, div, History;
   
        /**
         * The constructor. Will be called automatically
         */
        var __construct = function () {           
          
            // List of all available settings with default values
            settings = $.extend({
                'verbosity'    : 0,
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
				 
                if(settings['div1']) 
                    div = $(settings['div1']);
                else
                    div = $this;
				 
                setupClicks();
                
                window.onstatechange  = function () { //instead of popstate
                    getDiv(window.location);
                };
            };
            
            var init0 = function () {
                 $.getScript('http://4nf.org/js/bhistory.js', init);
            };
			
            $.getScript('http://4nf.org/js/urlinternal.js', init0);
            
            
        };
    
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
                getDiv(link.href);
            }, false);
        };

        /**
         *
         */
        var getDiv = function (href) {
            if (settings['verbosity'] >= 1) {
                window.console && console.log('getDiv(\'' + href + '\')');
            }
                        
            var outerHTML = function(e) {
                return $(e).clone().wrap('<html>').parent().html();
            };
            
            var documentHtml = function(html){
                var result = String(html)
                    .replace(/<\!DOCTYPE[^>]*>/i, '')
                    .replace(/<(html|head|body|title|meta|script)([\s\>])/gi,
                         '<div class="document-$1"$2')
                    .replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
                ;


                return result;
            };
            
            $.ajax({
                    url: href,
                    success: function(htmlTotal) {
                        
                        //Replace content div
						
                        var $data=$(documentHtml(htmlTotal)), 
                            eDiv = $data.find('#' + $this.attr('id'));
                        
                        if (settings['verbosity'] >= 1) {
                             window.console && console.log('getDiv(\'' + href + '\') - getFileContents succeeded');
                         } 

                        $('#' + $this.attr('id')).replaceWith(outerHTML($(eDiv)));
                        
                        if (settings['verbosity'] >= 1) {
                             window.console && console.log('replaceWith() - succeeded');
                         }
						 
                         //Update title
                         document.title = $data.find('.document-title:first').text();
                         try {
                             document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
                         }
                         catch ( Exception ) { }
						 
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

                         if(fn) $window.one($cEventName, fn);
                         $window.trigger($cEventName);  
                    }
                });
                
        };


        // Run constructor
        __construct();
    };

    // Register jQuery function
    $.fn.history = function (fn, options) {
		    return this.each(function(){
                var $this = $(this);
                new History($this, fn, options);
            });
    };
})(jQuery);
