var h=()=>{},p=JSON.stringify,u=JSON.parse,r=window,O=document,C=(n,t)=>{let i=t??{width:600,height:400},s=r.screenLeft!=null?r.screenLeft:screen.left,e=r.screenTop!=null?r.screenTop:screen.top,o=r.innerWidth,a=r.innerHeight,c=O.documentElement,d=o||(c.clientWidth?c.clientWidth:screen.width),b=a||(c.clientHeight?c.clientHeight:screen.height),f=s+(i.xMove??0),v=e+(i.yMove??0);(i.centered??!0)&&(f+=d/2-i.width/2,v+=b/2-i.height/2);let x=i.target??"_blank",l=r.open(n,x,`width=${i.width}, height=${i.height} top=${v}, left=${f}, ${i.options??"resize=yes"}`);return l!=null&&l.focus&&l.focus(),l},T=n=>new URL(n).origin,j=(n,t)=>{if(n.origin!=t)throw new Error(`Invalid message origin: ${n.origin}, allowed: ${t}`)},m=(n,t,i)=>{r.addEventListener("message",s=>{j(s,t);let e=u(s.data);e&&e.i===n&&i(s.source,e)},!1)},g=(n,t,i,s,e)=>{let o={i,j:e,type:s};n==null||n.postMessage(p(o),t)},y=class{constructor(t,i="1",s){this.id=i;this.origin=T(t),setTimeout(()=>{this.child||(this.child=C(t,s))},250),m(this.id,this.origin,(e,o)=>{var a,c,d;o.type==="msg"&&((a=this.onMessage)==null||a.call(this,u(o.j))),o.type==="child-open"&&((c=this.onChildOpen)==null||c.call(this)),e&&this.child==null&&o.type==="ping"&&(this.child=e,(d=this.onChildAttach)==null||d.call(this),g(this.child,this.origin,i,"host-attach",""))}),setInterval(()=>{var e;if(this.child&&this.child.closed){(e=this.onChildClose)==null||e.call(this),this.child=null;return}},100)}origin;child;onMessage=h;onChildOpen=h;onChildAttach=h;onChildClose=h;isOpen(){return!!this.child&&this.child.closed==!1}post(t){g(this.child,this.origin,this.id,"msg",p(t))}},M=class{constructor(t="1"){this.id=t;setTimeout(()=>this.init(),0)}origin;parent=r.opener;onMessage=h;onParentOpen=h;onParentAttach=h;onParentClose=h;isOpen(){return!!this.parent&&this.parent.closed==!1}init(){var t;this.parent&&(this.origin=T(O.referrer),m(this.id,this.origin,(i,s)=>{var e,o;s.type==="msg"?(e=this.onMessage)==null||e.call(this,u(s.j)):s.type==="host-attach"&&((o=this.onParentAttach)==null||o.call(this))}),setInterval(()=>{var i;if(this.parent&&this.parent.closed){(i=this.onParentClose)==null||i.call(this),this.parent=null;return}g(this.parent,this.origin,this.id,"ping","")},100),(t=this.onParentOpen)==null||t.call(this),g(this.parent,this.origin,this.id,"child-open",""))}post(t){g(this.parent,this.origin,this.id,"msg",p(t))}};export{M as WindowDialog,y as WindowHost,C as newDialog};
