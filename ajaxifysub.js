addAll(PK) ®addAll.replace(/PK/g, PK)
all | (t, fn) $this.each( f{ t = t.split("*").join("$(this)"); t += ";"; eval(t); })
isHtml(x) ®(d=x.getResponseHeader("Content-Type")), d&&(d.indexOf("text/html")+1||d.indexOf("text/xml")+1)
replD(h) ®String(h).replace(docType, "").replace(tagso, div12).replace(tagsc,"</div>")
parseHTML(h) ®$.trim(_replD(h))
pages | (h) string : for(var i=0; i<d.length; i++) if(d[i][0]==h) ®d[i][1]; object : d.push(h);
memory | { memoryoff: false } | (h) d=memoryoff; if(!h || d==true) ®null; if(d==false) ®h; if(d.indexOf(", ")+1) { d=d.split(", "); for(var i=0, r=h; i<d.length; i++) if(h==d[i]) ®null;} ®h==d?null:h
cache1 | (o, h) ? : ®d; + : d = $.memory(h); d = d?$.pages(d):null; ! : d = h;
lDivs | () $this.all("fn(*)", function(s) { s.html($.cache1("?").find("#" + s.attr("id")).html()); });
lAjax | (hin, p, post) var xhr = $.ajax({url: hin, type: post?"POST":"GET", data:post?post.data:null, success: function(h) { if(!h || !_isHtml(xhr)) { location = hin; } $.cache1("!",  $(_parseHTML(h))); $.cache1("?").find(".ignore").remove(); $.pages([hin, $.cache1("?")]); p && p(); } })
lPage(hin, p, post) if(hin.indexOf("#")+1) hin=hin.split("#")[0]; $.cache1("+", post?null:hin); if(!$.cache1("?")) ®$.lAjax(hin, p, post); p && p();
getPage | (t, p, post) if(!t) ®$.cache1("?"); if(t.indexOf("/") != -1) ®_lPage(t, p, post); if(t == "+") _lPage(p); else { if(t.charAt(0) == "#") { $.cache1("?").find(t).html(p); t = "-"; } if(t == "-") ®$this.lDivs(); ®$.cache1("?").find(".ajy-" + t); }
insertScript($S, PK) $("head").append((PK=="href"?linki: scri).replace("*", $S))
removeScript($S, PK) $((PK=="href"?linkr:scrr).replace("!", $S)).remove()
findScript($S, $Scripts) if($S) for(var i=0; i<$Scripts.length; i++) if($Scripts[i][0] == $S) { $Scripts[i][1] = 1; ®true; }
allScripts | (PK, deltas) if(!deltas) { $this.each( f{ _insertScript($(this)[0], PK); }); ®true; }
classAlways | (PK) $this.each( f{ if($(this).attr("data-class") == "always") { _insertScript($(this).attr(PK), PK); $(this).remove(); } })
sameScripts(sN, PK) for(var i=0; i<sN.length; i++) if(sN[i][1] == 0) _insertScript(sN[i][0], PK)
newArray | (sN, sO, PK, pass) $this.each( f{ sN.push([$(this).attr(PK), 0]); if(!pass) sO.push([$(this).attr(PK), 0]); })
findCommon(s, sN) for(var i=0; i<s.length; i++) { s[i][1] = 2; if(_findScript(s[i][0], sN)) s[i][1] = 1 }
freeOld(s, PK) for(var i=0; i<s.length; i++) if(s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK)
realNew(s, PK) for(var i=0; i<s.length; i++) if(s[i][1] == 0) _insertScript(s[i][0], PK)
addHrefs <- _addAll("href")
addSrcs <- _addAll("src")
detScripts(same, $s) if(!same) { var links = $().getPage("link"), jss = $().getPage("script"); $s.c = links.filter( f{ ® $(this).attr("rel").indexOf("stylesheet")!=-1; }); $s.s = jss.filter( f{ ® $(this).attr("src"); }); $s.t = jss.filter( f{ ® !($(this).attr("src")); }) };
inline(txt, s) d = s["inlinehints"]; if(d) { d = d.split(", "); for(var i=0; i<d.length; i++) if(txt.indexOf(d[i])+1) ®true; }
addtxts | (s) $this.each( f{ d = $(this).html(); if(d.indexOf(").ajaxify(")==-1 && (s["inline"] || $(this).hasClass("ajaxy") || _inline(d, s))) { try { $.globalEval(d); } catch(e) { alert(e); } } r=true; });
addScripts(same, $s, st) $s.c.addHrefs(same, st); $s.s.addSrcs(same, st); $s.t.addtxts(st);
scripts | $scripts = $(), pass = 0 | { "deltas": true } | (same) _detScripts(same, $scripts); if(pass++) _addScripts(same, $scripts, settings); else { $scripts.c.addHrefs(same, settings); $scripts.s.addSrcs(same, settings);}
cPage | { cb: null } | (o) undefined : $.scripts(null, settings); if(cb) cb(); boolean : $.scripts(o, settings); string : ;
initPage(e) $.cPage(e && e.same)
initAjaxify(s) d = window.history && window.history.pushState && window.history.replaceState; if(d && s["pluginon"]) { $.memory(null, s); $.cPage("", s); ®true}
ajaxify | { selector: "a:not(.no-ajaxy)", requestKey: "pronto", requestDelay: 0, verbosity: 0, deltas: true, inline: false, memoryoff: false, cb: null, pluginon: true } | () $( f{ $.log("Entering ajaxify...", settings); if(_initAjaxify(settings)) { $this.pronto(settings); $(window).on("pronto.render", _initPage); $().getPage(location.href, $.cPage);}});
