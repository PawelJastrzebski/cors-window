var u=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var _=(n,t)=>{for(var e in t)u(n,e,{get:t[e],enumerable:!0})},D=(n,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of P(t))!S.call(n,s)&&s!==e&&u(n,s,{get:()=>t[s],enumerable:!(i=L(t,s))||i.enumerable});return n};var I=n=>D(u({},"__esModule",{value:!0}),n);var H={};_(H,{DialogHost:()=>b,DialogWindow:()=>T,IframeHost:()=>f,IframeWindow:()=>y,newDialog:()=>C});module.exports=I(H);var c=()=>{},v=JSON.stringify,x=JSON.parse,J=n=>{try{return x(n)}catch{return null}},r=window,O=document,m=n=>{try{return new URL(n).origin}catch{return`Invalid URL: ${n}`}},A=(n,t)=>{if(n.origin!=t)throw new Error(`Invalid message origin: ${n.origin}, allowed: ${t}`)},w=(n,t,e)=>{r.addEventListener("message",i=>{let s=J(i.data);s&&s.type&&s.i===n&&(A(i,t),e(i.source,s))},!1)},d=(n,t,e,i,s)=>{let o={i:e,j:s,type:i};n==null||n.postMessage(v(o),t)},g=class{constructor(t,e="1"){this.id=e;this.origin=m(t),w(this.id,this.origin,(i,s)=>{var o,l,h;s.type==="msg"&&((o=this.onMessage)==null||o.call(this,x(s.j))),s.type==="child-open"&&((l=this.onChildOpen)==null||l.call(this)),i&&this.child==null&&s.type==="ping"&&(this.child=i,(h=this.onChildAttach)==null||h.call(this),d(this.child,this.origin,e,"host-attach",""))}),setInterval(()=>{var i;if(this.child&&this.child.closed){(i=this.onChildClose)==null||i.call(this),this.child=null;return}},100)}origin;child;onMessage=c;onChildOpen=c;onChildAttach=c;onChildClose=c;isOpen(){return!!this.child&&this.child.closed==!1}post(t){d(this.child,this.origin,this.id,"msg",v(t))}},p=class{constructor(t="1",e){this.id=t;this.parent=e,setTimeout(()=>this.init(),0)}origin;parent;onMessage=c;onParentOpen=c;onParentAttach=c;onParentClose=c;isOpen(){return!!this.parent&&this.parent.closed==!1}init(){var t;this.parent&&(this.origin=m(O.referrer),w(this.id,this.origin,(e,i)=>{var s,o;i.type==="msg"?(s=this.onMessage)==null||s.call(this,x(i.j)):i.type==="host-attach"&&((o=this.onParentAttach)==null||o.call(this))}),setInterval(()=>{var e;if(this.parent&&this.parent.closed){(e=this.onParentClose)==null||e.call(this),this.parent=null;return}d(this.parent,this.origin,this.id,"ping","")},100),(t=this.onParentOpen)==null||t.call(this),d(this.parent,this.origin,this.id,"child-open",""))}post(t){d(this.parent,this.origin,this.id,"msg",v(t))}},C=(n,t)=>{let e=t??{width:600,height:400},i=r.screenLeft!=null?r.screenLeft:screen.left,s=r.screenTop!=null?r.screenTop:screen.top,o=r.innerWidth,l=r.innerHeight,h=O.documentElement,W=o||(h.clientWidth?h.clientWidth:screen.width),$=l||(h.clientHeight?h.clientHeight:screen.height),M=i+(e.xMove??0),j=s+(e.yMove??0);(e.centered??!0)&&(M+=W/2-e.width/2,j+=$/2-e.height/2);let E=e.target??"_blank",a=r.open(n,E,`width=${e.width}, height=${e.height} top=${j}, left=${M}, ${e.options??"resize=yes"}`);return a!=null&&a.focus&&a.focus(),a},f=class extends g{constructor(t,e="1"){super(t.src,e+"_i"),!this.child&&(this.child=t.contentWindow)}},y=class extends p{constructor(t="1"){super(t+"_i",r.top)}},b=class extends g{constructor(t,e="1",i){super(t,e+"_d"),setTimeout(()=>{this.child||(this.child=C(t,i))},250)}},T=class extends p{constructor(t="1"){super(t+"_d",r.opener)}};0&&(module.exports={DialogHost,DialogWindow,IframeHost,IframeWindow,newDialog});
