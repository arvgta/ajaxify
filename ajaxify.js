String.prototype.iO = function(s) { return this.toString().indexOf(s) + 1; };

(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery); 

var l=0, pass=0, api=window.history && window.history.pushState && window.history.replaceState;
var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 =  '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />', scri='<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]', scrr = 'script[src*="!"]';



(function ($) {
    var Log = function (options) {
        var con = window.console;
        var settings = $.extend({
            verbosity: 0
        }, options);
        var verbosity = settings["verbosity"];
        this.a = function (m) {
            l < verbosity && con && con.log(m);
        };
    };
    $.log = function (m, options) {
        if (!$.log.o) $.log.o = new Log(options);
        return $.log.o.a(m);
    };
})(jQuery);

(function ($) {
    var Cache = function () {
        var d = false;
        this.a = function (o) {
            if (!o) {
                return d;
            }
            if (typeof o === "string") {
                return d = $.pages($.memory(o));
            }
            if (typeof o === "object") {
                return d = o;
            };
        };
    };
    $.cache = function (o) {
        if (!$.cache.o) $.cache.o = new Cache();
        return $.cache.o.a(o);
    };
})(jQuery);

(function ($) {
    var Memory = function (options) {
        var d = false;
        var settings = $.extend({
            memoryoff: false
        }, options);
        var memoryoff = settings["memoryoff"];
        this.a = function (h) {
            d = memoryoff;
            if (!h || d == true) return false;
            if (d == false) return h;
            if (d.iO(", ")) {
                d = d.split(", ");
                r = h;
                if (d.iO(h)) return false;
            }
            return h == d ? false : h;
        };
    };
    $.memory = function (h, options) {
        if (!$.memory.o) $.memory.o = new Memory(options);
        return $.memory.o.a(h);
    };
})(jQuery);

(function ($) {
    var Pages = function () {
        var d = [];
        this.a = function (h) {
            if (typeof h === "string") {
                for (var i = 0; i < d.length; i++)
                    if (d[i][0] == h) return d[i][1];
            }
            if (typeof h === "object") {
                d.push(h);
            }
            if (typeof h === "boolean") {
                return false;
            };
        };
    };
    $.pages = function (h) {
        if (!$.pages.o) $.pages.o = new Pages();
        return $.pages.o.a(h);
    };
})(jQuery);

(function ($) {
    var GetPage = function () {
        this.a = function (o, p, p2) {
            if (!o) {
                return $.cache();
            }
            if (o.iO("/")) {
                return _lPage(o, p, p2);
            }
            if (o === "+") {
                return _lPage(p, p2, false, true);
            }
            if (o === "-") {
                return _lSel(p, p2);
            }
            return $.cache().find(".ajy-" + o);
        };

        function _lSel(p, $t) {
            pass++;
            _lDivs($t);
            $.scripts(p);
            $.scripts("a");
            return $.scripts("c")
        };

        function _lPage(h, p, post, pre) {
            if (h.iO("#")) h = h.split("#")[0];
            if (post || !$.cache(h)) return _lAjax(h, p, post, pre);
            p && p();
        };

        function _lDivs($t) {
            if ($.cache()) _all($t, "fn(*)", function (s) {
                s.html($.cache().find("#" + s.attr("id")).html());
            })
        };

        function _all($t, t, fn) {
            $t.each(function () {
                t = t.split("*").join("$(this)");
                t += ";";
                eval(t);
            })
        };

        function _lAjax(hin, p, post, pre) {
            var xhr = $.ajax({
                url: hin,
                type: post ? "POST" : "GET",
                data: post ? post.data : null,
                success: function (h) {
                    if (!h || !_isHtml(xhr)) {
                        if (!pre) location = hin;
                    }
                    $.cache($(_parseHTML(h)));
                    $.pages([hin, $.cache()]);
                    p && p();
                }
            })
        };

        function _isHtml(x) {
            var d;
            return (d = x.getResponseHeader("Content-Type")), d && (d.iO("text/html") || d.iO("text/xml"));
        };

        function _parseHTML(h) {
            return $.trim(_replD(h));
        };

        function _replD(h) {
            return String(h).replace(docType, "").replace(tagso, div12).replace(tagsc, "</div>");
        };
    };
    $.getPage = function (o, p, p2) {
        if (!$.getPage.o) $.getPage.o = new GetPage();
        return $.getPage.o.a(o, p, p2);
    };
})(jQuery);

(function ($) {
    var Ajaxify = function (options) {
        var settings = $.extend({
            cb: 0,
            pluginon: true,
            fn: $.getPage
        }, options);
        var cb = settings["cb"],
            pluginon = settings["pluginon"],
            fn = settings["fn"];
        this.a = function ($this) {
            $(function () {
                if (_init(settings)) {
                    $this.pronto(settings);
                    $.getPage(location.href, $.scripts);
                }
            });;
        };

        function _init(s) {
            if (!api || !pluginon) return false;
            $.scripts("i", s);
            $.cache(0, s);
            $.memory(0, s);
            return true
        };
    };
    $.fn.ajaxify = function (options) {
        var $this = $(this);
        if (!$.fn.ajaxify.o) $.fn.ajaxify.o = new Ajaxify(options);
        return $.fn.ajaxify.o.a($this);
    };
})(jQuery);

(function ($) {
    var Scripts = function (options) {
        var $s = $();
        var settings = $.extend({
            canonical: true,
            inline: true,
            inlinehints: false
        }, options);
        var canonical = settings["canonical"],
            inline = settings["inline"],
            inlinehints = settings["inlinehints"];
        this.a = function (o) {
            if (o === "i") {
                return true;
            }
            if (o === "a") {
                return _alltxts($s.t);
            }
            if (o === "c") {
                if (canonical && $s.can) return $s.can.attr("href");
                else return false;
            }
            $.detScripts($s);
            _addScripts(o, $s, settings);
        };

        function _alltxts($s) {
            $s.each(function () {
                var d = $(this).html();
                if (!d.iO(").ajaxify(") && (inline || $(this).hasClass("ajaxy") || _inline(d))) _addtext(d);
                r = true;
            });
        };

        function _addtext(t) {
            try {
                $.globalEval(t);
            } catch (e) {
                alert(e);
            };
        };

        function _inline(txt) {
            var d = inlinehints;
            if (d) {
                d = d.split(", ");
                for (var i = 0; i < d.length; i++)
                    if (txt.iO(d[i])) return true;
            }
        };

        function _addScripts(same, $s, st) {
            $s.c.addAll(same, "href", st);
            $s.s.addAll(same, "src", st);
        };
    };
    $.scripts = function (o, options) {
        if (!$.scripts.o) $.scripts.o = new Scripts(options);
        return $.scripts.o.a(o);
    };
})(jQuery);

(function ($) {
    var DetScripts = function () {
        var head, lk, j;
        this.a = function ($s) {
            head = $.getPage("head");
            lk = head.find(".ajy-link");
            j = $.getPage("script");
            $s.c = _rel(lk, "stylesheet");
            $s.can = _rel(lk, "canonical");
            $s.s = j.filter(function () {
                return $(this).attr("src");
            });
            $s.t = j.filter(function () {
                return !($(this).attr("src"));
            });
        };

        function _rel(lk, v) {
            return $(lk).filter(function () {
                return $(this).attr("rel").iO(v);
            })
        };
    };
    $.detScripts = function ($s) {
        if (!$.detScripts.o) $.detScripts.o = new DetScripts();
        return $.detScripts.o.a($s);
    };
})(jQuery);

(function ($) {
    var AddAll = function (options) {
        var $scriptsO, $scriptsN, $sCssO = [],
            $sCssN = [],
            $sO = [],
            $sN = [];
        var settings = $.extend({
            deltas: true
        }, options);
        var deltas = settings["deltas"];
        this.a = function ($this, same, PK) {
            if (PK == "href") {
                $scriptsO = $sCssO;
                $scriptsN = $sCssN;
            } else {
                $scriptsO = $sO;
                $scriptsN = $sN;
            } if (_allScripts($this, PK)) return true;
            if (pass) _classAlways($this, PK);
            if (same) return _sameScripts($scriptsN, PK);
            $scriptsN = [];
            _newArray($this, $scriptsN, $scriptsO, PK);
            if (pass) {
                _findCommon($scriptsO, $scriptsN);
                _freeOld($scriptsO, PK);
                _sameScripts($scriptsN, PK);
                $scriptsO = $scriptsN.slice();
            }
            if (PK == "href") {
                $sCssO = $scriptsO;
                $sCssN = $scriptsN;
            } else {
                $sO = $scriptsO;
                $sN = $scriptsN;
            };
        };

        function _allScripts($t, PK) {
            if (deltas) return false;
            $t.each(function () {
                _iScript($(this)[0], PK);
            });
            return true;
        };

        function _classAlways($t, PK) {
            $t.each(function () {
                if ($(this).attr("data-class") == "always") {
                    _iScript($(this).attr(PK), PK);
                    $(this).remove();
                }
            })
        };

        function _sameScripts(s, PK) {
            for (var i = 0; i < s.length; i++)
                if (s[i][1] == 0) _iScript(s[i][0], PK);
        };

        function _iScript($S, PK) {
            $("head").append((PK == "href" ? linki : scri).replace("*", $S));
        };

        function _newArray($t, sN, sO, PK) {
            var d;
            $t.each(function () {
                d = [$(this).attr(PK), 0];
                sN.push(d);
                if (!pass) sO.push(d);
            })
        };

        function _findCommon(s, sN) {
            for (var i = 0; i < s.length; i++) {
                s[i][1] = 2;
                if (_findScript(s[i][0], sN)) s[i][1] = 1;
            }
        };

        function _findScript($S, s) {
            if ($S)
                for (var i = 0; i < s.length; i++)
                    if (s[i][0] == $S) {
                        s[i][1] = 1;
                        return true;
                    }
        };

        function _freeOld(s, PK) {
            for (var i = 0; i < s.length; i++)
                if (s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK);
        };

        function _removeScript($S, PK) {
            $((PK == "href" ? linkr : scrr).replace("!", $S)).remove();
        };
    };
    $.fn.addAll = function (same, PK, options) {
        var $this = $(this);
        if (!$.fn.addAll.o) $.fn.addAll.o = new AddAll(options);
        return $.fn.addAll.o.a($this, same, PK);
    };
})(jQuery);

(function ($) {
    var Pronto = function (options) {
        var $window = $(window),
            currentURL = '',
            requestTimer = null,
            post = null,
            $gthis, fm;
        var settings = $.extend({
            selector: "a:not(.no-ajaxy)",
            requestKey: "pronto",
            requestDelay: 0,
            forms: true,
            turbo: true,
            previewoff: true,
            fn: false
        }, options);
        var selector = settings["selector"],
            requestKey = settings["requestKey"],
            requestDelay = settings["requestDelay"],
            forms = settings["forms"],
            turbo = settings["turbo"],
            previewoff = settings["previewoff"],
            fn = settings["fn"];
        this.a = function ($this) {
            $gthis = $this;
            _init_p();
            return $this;
        };

        function _init_p() {
            settings.$body = $("body");
            currentURL = window.location.href;
            _saveState();
            $window.on("popstate", _onPop);
            if (turbo) $(selector).hoverIntent(_prefetch, _drain);
            settings.$body.on("click.pronto", selector, _click);
            _ajaxify_forms();
        };

        function _drain() {};

        function _prefetch(e) {
            post = null;
            var link = e.currentTarget;
            if (_diffHost(link)) return false;
            if (currentURL == link.href) return false;
            var req2 = function () {
                if (previewoff === true) return false;
                if (!_isInDivs(link) && (previewoff === false || !$(link).closest(previewoff).length)) _click(e, true);
            };
            fn('+', link.href, req2);
        };

        function _isInDivs(link) {
            var isInDivs = false;
            $gthis.each(function () {
                try {
                    if ($(link).parents("#" + $(this).attr("id")).length > 0) isInDivs = true;
                } catch (e) {
                    alert(e);
                }
            });
            return isInDivs;
        };

        function _b(m, n) {
            if (m.indexOf("?") > 0) {
                m = m.substring(0, m.indexOf("?"));
            }
            return m + "?" + n;
        };

        function _k() {
            var o = fm.serialize();
            var n = $("input[name][type=submit]", fm);
            if (n.length == 0) return o;
            var p = n.attr("name") + "=" + n.val();
            if (o.length > 0) {
                o += "&" + p;
            } else {
                o = p;
            }
            return o;
        };

        function _ajaxify_forms() {
            if (!forms) return false;
            $('form').submit(function (q) {
                fm = $(q.target);
                if (!fm.is("form")) {
                    fm = fm.filter("input[type=submit]").parents("form:first");
                    if (fm.length == 0) {
                        return true;
                    }
                }
                var p = _k();
                var q = "get",
                    m = fm.attr("method");
                if (m.length > 0 && m.toLowerCase() == "post") q = "post";
                var h, a = fm.attr("action");
                if (a != null && a.length > 0) h = a;
                else h = currentURL; if (q == "get") h = _b(h, p);
                else {
                    post = {};
                    post.data = p;
                }
                $window.trigger("pronto.submit", h);
                _request(h);
                return false;
            })
        };

        function _click(e, mode) {
            var link = e.currentTarget;
            post = null;
            if (_exoticKey(e) || _diffHost(link)) return;
            if (_hashChange(link)) {
                _saveState();
                return true;
            }
            e.preventDefault();
            e.stopPropagation();
            if (currentURL == link.href) {
                _saveState();
            } else _request(link.href, mode);
        };

        function _request(url, mode) {
            $window.trigger("pronto.request");
            var reqr = function () {
                _render(url, true, mode);
            };
            fn(url, reqr, post);
        };

        function _render(url, doPush, mode) {
            if (requestTimer !== null) {
                clearTimeout(requestTimer);
                requestTimer = null;
            }
            requestTimer = setTimeout(function () {
                _doRender(url, doPush, mode)
            }, requestDelay)
        };

        function _saveState() {
            history.replaceState({
                url: currentURL
            }, "state-" + currentURL, currentURL)
        };

        function _onPop(e) {
            var data = e.originalEvent.state;
            if (data !== null && data.url !== currentURL) {
                $window.trigger("pronto.request");
                var req3 = function () {
                    _render(data.url, false, false);
                };
                fn(data.url, req3);
            }
        };

        function _doPush(url, doPush) {
            currentURL = url;
            if (doPush) {
                history.pushState({
                    url: currentURL
                }, "state-" + currentURL, currentURL);
            } else {
                _saveState();
            }
        };

        function _doRender(url, doPush, mode) {
            var canURL;
            $window.trigger("pronto.load");
            _gaCaptureView(url);
            _saveState();
            $('title').html(fn('title').html());
            canURL = fn('-', post, $gthis);
            if (canURL && canURL != url && !url.iO('#') && !url.iO('?')) url = canURL;
            _ajaxify_forms();
            if (url.iO('#') && !mode) {
                $('html, body').animate({
                    scrollTop: $('#' + url.split('#')[1]).offset().top
                }, 500);
            }
            _doPush(url, doPush);
            $window.trigger("pronto.render")
        };

        function _gaCaptureView(url) {
            if (typeof window.ga !== 'undefined') window.ga('send', 'pageview', url);
        };

        function _diffHost(link) {
            return (window.location.protocol !== link.protocol || window.location.host !== link.host);
        };

        function _exoticKey(e) {
            return (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
        };

        function _hashChange(link) {
            return (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#');
        };
    };
    $.fn.pronto = function (options) {
        var $this = $(this);
        if (!$.fn.pronto.o) $.fn.pronto.o = new Pronto(options);
        return $.fn.pronto.o.a($this);
    };
})(jQuery);

jQuery.log("Ajaxify loaded...", {verbosity: 8});
