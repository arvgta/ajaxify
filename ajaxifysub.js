all | (t, fn) $this.each(function() { t = t.split("*").join("$(this)"); t += ";"; eval(t); })
log | con = window.console | { verbosity: 0 } | (m) l < verbosity && con && con.log(m)
isHtml | (x) d=x.getResponseHeader("Content-Type"); r=d&&(d.indexOf("text/html")+1||d.indexOf("text/xml")+1)
replD | (h) r=String(h).replace(docType, "").replace(tagso, div12).replace(tagsc,"</div>")
