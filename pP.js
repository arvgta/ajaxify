/**"pP" module - Stands for "Push Plugin" - sub-plugin factory - working draft
 *
 * Now a rather big function
 *
 * Todo: this could be a jQuery plugin itself?
 */
 
var l=0; //Module global debugging level - used in frmB and $.log, therefore, I see no alternative to using it...
function showArgs(a) { s=''; for(var i=0; i<a.length; i++) s+=(a[i]!=undefined && typeof a[i]!='function' && typeof a[i]!='object' && (typeof a[i]!='string' || a[i].length <= 100) ? a[i] : typeof a[i]) + ' | '; return s }
function frmB(b, name, args) { if(name!='log' && !(b.indexOf('$.log(')+1)) return 'var r=false; l++; $.log(l+" | ' + name + ' | ' + args + ' | " + showArgs(arguments));' + b + "; l--; return r;"; else return b; }
function frmR(b) { return b.replace(/® /g, 'return ').replace(/®/g, 'return l--, ').replace(/ f{ /g, 'function(){') }
 
function pU(href) {  $.ajax({ url: href, async: false, crossDomain: true, dataType: 'text', success: function(d) { pP(d.replace(/\r\n/g, '\n')); }}); }
 
function pP(dna) {

if(dna.indexOf('\n')+1) {
    var d=dna.split('\n');
    for(var i=0; i<d.length;i++) pP(d[i]);
    return;
}

if(dna.indexOf('<-')+1) { var s=dna.split('<-');
   //alert(s[1]);
   dna = s[0] + eval(s[1] + ';'); 
   pP(dna);
   return;
}
 
if(dna.indexOf(' | ')==-1) { dna = '_' + dna;
    var lb = dna.indexOf(')'), head = dna.substr(0, lb+1), fb = head.indexOf('('), name = head.substr(0, fb), args = head.substr(fb+1, head.length-fb-2), tail = dna.substr(lb+2, dna.length-lb-2);
    try { $.globalEval('function ' + head + '{ var d = []; ' + frmB(frmR(tail), name, args) + ';};'); } catch(e) { alert('$.globalEval fun : ' + head); };
    return;
}
 
var bp = '(function ($) { var Name = function(options){ \
Private this.a = function(args) {aBody;}; }; \
$.fnn = function(arg0) {var r; var $this = $(this); \
$.fnn.o = $.fnn.o ? $.fnn.o : new Name(options); \
r = $.fnn.o.a(args); return $this;}; \
})(jQuery);',

dnas = dna.split(' | '), name = dnas[0], Name = name.substr(0, 1).toUpperCase() + name.substr(1, name.length - 1), Settings, Private, Mode, Mode2, Args, Args0, ABody;
Private = 'var d = [];';
for(var i = 1; i < dnas.length; i++) {
	    var dnap = dnas[i];
        
  	    if(dnap.substr(0, 1) == '{') {
		    dnap = dnap.substr(2, dnap.length - 3);
			Settings = 'settings = $.extend({' + dnap + '}, options);';
			Settings += '\n';
			var sa = dnap.indexOf(', ') + 1 ? dnap.split(', ') : [dnap]; 
			for(var j = 0; j < sa.length; j++) { 
			    var si = sa[j];
				var sn = si.split(':')[0].replace('"', '').replace('"', ''); 
				Settings +=  (sn + ' = settings["' + sn + '"];\n');
			}
		}
		
		else if(dnap.substr(0, 1) == '(') {
		    var del = dnap.indexOf(')'); 
		    Args = dnap.substr(1, del - 1);
            Args = Args.indexOf('$this') + 1 ? Args : (Args ? '$this, ' + Args : '$this');
            Args0 = Args.replace('$this, ', ''); Args0 = Args == '$this' ? '' : Args0;
            if(Settings) Args0 += Args0 == '' ? 'options' : ', options';	
            ABody = dnap.substr(del + 2, dnap.length - del - 2);
            ABody = frmR(ABody);
            Mode = ABody.indexOf('$this') + 1;
            Mode2 = ABody.indexOf('return') + 1 || ABody.indexOf('r=') + 1;
            if(ABody.indexOf(' : ') + 1) { 
                 var ABodies = ABody.split(' : ');
                 var Arg0 = Args0.indexOf(', ') + 1 ? Args0.split(', ')[0] : Args0;
                 ABody = '';
                 for(var i = 0; i < ABodies.length - 1; i++) { var tBody = ABodies[i]; 
                     var tBody1 = ABodies[i + 1]; 
                     var tNewBody = tBody1.substr(0, tBody1.lastIndexOf(';'));
                     var sc = tBody.lastIndexOf(';');
                     tBody = sc + 1 ? tBody.substr(sc + 2, tBody.length - sc - 2) : tBody;
                     if(tBody.length == 1) {
                         ABody += 'if('+Arg0+' ==="'+tBody+'") {...}\n';
                     }
                     else { 
                         ABody += 'if(typeof '+Arg0+' ==="'+tBody+'") {...}\n';
                     }
                     ABody = ABody.replace('...', frmB(tNewBody, name, Args));
                 }
            }
            else {
                 ABody = frmB(ABody, name, Args);
           }
       }
		
       else { 
            Private += 'var ' + dnap + ';'; 
       }
    }
	
    if(Settings) { Settings = 'var ' + Settings; Private += Settings; } else bp = bp.replace(/options/g, '');
    if(Mode) { 
        bp = bp.replace(/fnn/g, 'fn.'+name);
        if(Mode2) bp = bp.replace(' return $this', ' return r');
    } 		
    else { 
        bp = bp.replace(/fnn/g, name).replace('var $this = $(this); ', 'var $this = "";').replace(' return $this', ' return r');
    }
    
    bp = bp.replace('aBody', ABody).replace(/name/g, name).replace(/Name/g, Name).replace('Private', Private).replace(/args/g, Args).replace('arg0', Args0);
   	
    //alert(bp);
    try { $.globalEval(bp); } catch(e) { alert(e); }
} 
 
pP('log | con = window.console | { verbosity: 0 } | (m) l < verbosity && con && con.log(m)');
