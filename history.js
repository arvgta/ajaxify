/**
 * history.js
 *
 * History API Plugin
 *
 * Author: Arvind Gupta
 *
 * Please adhere to the jQuery license
 */ 

(function ($) {
    // The History class
    var History = function ($this, fn, options) {

        // Local variables
        var settings, div;
   
        /**
         * The constructor. Will be called automatically
         */
        var __construct = function () {           
          
            // List of all available settings with default values
            settings = $.extend({
                'verbosity'    : 0
            }, options);

            if (settings['verbosity'] >= 1) {
                window.console && console.log('Entering History...');
            }
            
            var init = function () {
                 if(settings['div1']) 
				     div = $(settings['div1']);
				 else
				     div = $this;
				 
				 setupClicks();
                
                 window.onpopstate = function () {
                     getDiv(window.location);
                 };
            };
            
            $.getScript('http://4nf.org/js/urlinternal.js', init);
            
            
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
                history.pushState(null, null, link.href);
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
                        var eDiv = $(documentHtml(htmlTotal)).find('#' + $this.attr('id'));
                        
                        if (settings['verbosity'] >= 1) {
                             window.console && console.log('getDiv(\'' + href + '\') - getFileContents succeeded');
                         } 

                        $('#' + $this.attr('id')).replaceWith(outerHTML($(eDiv)));
                        
                        if (settings['verbosity'] >= 1) {
                             window.console && console.log('replaceWith() - succeeded');
                         }
                         
                        if(fn) fn(); //callback to client function                         
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
