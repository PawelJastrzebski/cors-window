var c=()=>{},u=JSON.stringify,f=JSON.parse,$=n=>{try{return f(n)}catch{return null}},r=window,j=document,O=n=>{try{return new URL(n).origin}catch{return`Invalid URL: ${n}`}},E=(n,t)=>{if(n.origin!=t)throw new Error(`Invalid message origin: ${n.origin}, allowed: ${t}`)},m=(n,t,e)=>{r.addEventListener("message",i=>{let s=$(i.data);s&&s.type&&s.i===n&&(E(i,t),e(i.source,s))},!1)},d=(n,t,e,i,s)=>{let o={i:e,j:s,type:i};n==null||n.postMessage(u(o),t)},g=class{constructor(t,e="1"){this.id=e;this.origin=O(t),m(this.id,this.origin,(i,s)=>{var o,l,h;s.type==="msg"&&((o=this.onMessage)==null||o.call(this,f(s.j))),s.type==="child-open"&&((l=this.onChildOpen)==null||l.call(this)),i&&this.child==null&&s.type==="ping"&&(this.child=i,(h=this.onChildAttach)==null||h.call(this),d(this.child,this.origin,e,"host-attach",""))}),setInterval(()=>{var i;if(this.child&&this.child.closed){(i=this.onChildClose)==null||i.call(this),this.child=null;return}},100)}origin;child;onMessage=c;onChildOpen=c;onChildAttach=c;onChildClose=c;isOpen(){return!!this.child&&this.child.closed==!1}post(t){d(this.child,this.origin,this.id,"msg",u(t))}},p=class{constructor(t="1",e){this.id=t;this.parent=e,setTimeout(()=>this.init(),0)}origin;parent;onMessage=c;onParentOpen=c;onParentAttach=c;onParentClose=c;isOpen(){return!!this.parent&&this.parent.closed==!1}init(){var t;this.parent&&(this.origin=O(j.referrer),m(this.id,this.origin,(e,i)=>{var s,o;i.type==="msg"?(s=this.onMessage)==null||s.call(this,f(i.j)):i.type==="host-attach"&&((o=this.onParentAttach)==null||o.call(this))}),setInterval(()=>{var e;if(this.parent&&this.parent.closed){(e=this.onParentClose)==null||e.call(this),this.parent=null;return}d(this.parent,this.origin,this.id,"ping","")},100),(t=this.onParentOpen)==null||t.call(this),d(this.parent,this.origin,this.id,"child-open",""))}post(t){d(this.parent,this.origin,this.id,"msg",u(t))}},L=(n,t)=>{let e=t??{width:600,height:400},i=r.screenLeft!=null?r.screenLeft:screen.left,s=r.screenTop!=null?r.screenTop:screen.top,o=r.innerWidth,l=r.innerHeight,h=j.documentElement,w=o||(h.clientWidth?h.clientWidth:screen.width),C=l||(h.clientHeight?h.clientHeight:screen.height),y=i+(e.xMove??0),b=s+(e.yMove??0);(e.centered??!0)&&(y+=w/2-e.width/2,b+=C/2-e.height/2);let W=e.target??"_blank",a=r.open(n,W,`width=${e.width}, height=${e.height} top=${b}, left=${y}, ${e.options??"resize=yes"}`);return a!=null&&a.focus&&a.focus(),a},T=class extends g{constructor(t,e="1"){super(t.src,e+"_i"),!this.child&&(this.child=t.contentWindow)}},v=class extends p{constructor(t="1"){super(t+"_i",r.top)}},x=class extends g{constructor(t,e="1",i){super(t,e+"_d"),setTimeout(()=>{this.child||(this.child=L(t,i))},250)}},M=class extends p{constructor(t="1"){super(t+"_d",r.opener)}};export{x as DialogHost,M as DialogWindow,T as IframeHost,v as IframeWindow,L as newDialog};
