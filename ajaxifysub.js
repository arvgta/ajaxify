all(t, fn) $this.each( f{ t = t.split("*").join("$(this)"); t += ";"; eval(t); })
log(m) | con = window.console | { verbosity: 0 } | l < verbosity && con && con.log(m)
isHtml(x) ®(d=x.getResponseHeader("Content-Type")), d&&(d.indexOf("text/html")+1||d.indexOf("text/xml")+1)
replD(h) ®String(h).replace(docType, "").replace(tagso, div12).replace(tagsc,"</div>")
