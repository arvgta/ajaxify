all(t, fn) $this.each(function() { t = t.split("*").join("$(this)"); t += ";"; eval(t); })
log(m) | con = window.console | { verbosity: 0 } |  l < verbosity && con && con.log(m)
isHtml(x) d=x.getResponseHeader("Content-Type"); r=d&&(d.indexOf("text/html")+1||d.indexOf("text/xml")+1)
replD(h) r=String(h).replace(docType, "").replace(tagso, div12).replace(tagsc,"</div>")
_parseHTML(h) r=$.trim($.replD(h)
pages(h) string : for(var i=0; i<d.length; i++) if(d[i][0]==h) r=d[i][1]; object : d.push(h);
memory(h) | { memoryoff: false } |  d=memoryoff; if(!h || d==true) r=null; else if(d==false) r=h; \
else if(d.indexOf(", ")+1) { d=d.split(", "); for(var i=0, r=h; i<d.length; i++) \
if(h==d[i]) r=null;} else r=h==d?null:h
