This plugin will make your page load time faster on sub-pages of your site much like [Balupton's gist](https://gist.github.com/854622), however, with a lean and easy to use interface amongst powerful and standard jQuery options.

## Introduction

Most websites have the following page structure:

    Header
    Sidebar(s)
    Content
    Footer


...where only few divs vary significantly, most significantly the content div.

Below is how you load the varying divs only with this plugin,
avoiding a full page refresh and creating awesome browsing speed.

## Installation

``` html
<!-- jQuery --> 
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script> 
 
<!-- This Gist -->
<script defer src="http://4nf.org/history.js"></script>  
```

## Explanation

### What do the installation instructions do?

1. Load jQuery
1. Load this gist :-)

### How do I call/include the plugin?

Example:

``` javascript

    $("#nav, #content").history(options); //#nav and #content are the id's of the two divs to be updated

//Option default values:

{
    'div1' : 'body div:first',   //Top-level div to be handled first - override with ID or null
    'verbosity'    : 0,  //Debugging level to console: 1 = medium, 2 = verbose
    'completedEventName' : 'statechangecomplete',  //Custom event that is triggered on completion
    'scripts' : true, // true = deltas loaded, false = all scripts loaded
    'cb' : null //Callback on replacement of the divs 
}
```

### What does this gist do?

1. Load the jQuery plugin urlinternal.js
1. Load Balupton's jQuery Plugin History.js

1. If Balupton's History.js is not defined for this browser - exit

1. For all internal links in the content divs:

    1. Make sure it's not a deeplink (deeplinks are not ajaxified)
    1. Make sure the class ".no-ajaxy" is not attached
   1. Add the custom "click" event that triggers the following


For all ajaxified clicks:

1. Create a way to convert the ajax repsonse into a format jQuery will understand - as we want to extract the content divs only from the target page.

1. Load any new scripts on the page (delta to previous page)

1. Load any new CSS's on the page (delta to previous page)

1. Load the target content divs into the current content divs

1. Inform Google Analytics

1. Trigger completion event (default 'statechangecomplete') 

## Comparison to market leader
<table cellpadding="0" cellspacing="10px" border="0">
<thead><tr>
<th>Aspect</th><th>Balupton's Plugin</th><th>This Plugin</th><th>Comment</th>
</tr></thead>
<tbody>
<tr><td>Ajaxifies</td><td>yes</td><td>yes</td><td>More flexibility to specify content divs in this plugin</td></tr>
<tr><td>jQuery interface</td><td>none</td><td>flexible jQuery interface with options</td><td>(see above)</td></tr>
<tr><td>Options</td><td>none / hard-coded</td><td>jQuery option interface</td><td>(see above)</td></tr>
<tr><td>Script handling</td><td>scripts loaded twice</td><td>Intelligent script loading</td><td>Deltas only loaded in this plugin by default.  Can be switched to complete load.</td></tr>
<tr><td>CSS handling</td><td>none</td><td>Intelligent CSS loading</td><td>Deltas only loaded in this plugin by default.  Can be switched to complete load.</td></tr>
<tr><td>Deep link checking</td><td>none</td><td>Mime type checked</td><td>Not HTML: location = href, otherwise loaded into content div</td></tr>
<tr><td>Logging to console</td><td>none</td><td>Flexible logging</td><td>Option "verbosity" can be set flexibly</td></tr>
<tr><td>Callback</td><td>none</td><td>Callback can be specified</td><td>Option "cb" can hold callback</td></tr>
<tr><td>Completion event</td><td>hard-coded</td><td>Completion event can be specified</td><td>Option "completedEventName" can hold event name</td></tr>
</tbody></table>

##On which browsers does this work?
This plugin uses Balupton's formidable History.js plugin.
That means, that it will work on old browsers, too, gracefully using the old hashing technique.
On HTML5 browsers, it uses the more modern HTML5 History API without hashes.
You can use the plugin transparently and use normal internal links.
The plugin does all the hard work.

##Example sites, that alter #content only:

<ul><li><a href="http://4nf.org/">4nf.org</a> (globally)</li>
<li><a href="http://www.oeko-fakt.de/">Öko Fakt</a> (globally) - German site</li></ul>

## Another explanation:

Refer to: http://4nf.org/load-content-div/

## Further Reading

- [New plugin: History API at forum.jquery.com](https://forum.jquery.com/topic/new-plugin-history-api)
- [Dive into HTML5](http://diveintohtml5.info/history.html)

## History

- v0.7.1 - 15. February, 2013
