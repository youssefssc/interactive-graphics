(this.webpackJsonpdemo=this.webpackJsonpdemo||[]).push([[0],{27:function(e,t,c){},33:function(e,t,c){},34:function(e,t,c){},35:function(e,t,c){"use strict";c.r(t);var n=c(1),r=c(0),i=c.n(r),a=c(20),s=c.n(a),j=(c(27),c(10)),u=c(2),l=function(){return Object(n.jsxs)("section",{children:[Object(n.jsx)("h2",{children:" Interactive Graphics "}),Object(n.jsxs)("ul",{children:[Object(n.jsx)("li",{children:Object(n.jsx)(j.b,{to:"/animatedCircles",children:" Animated Circles"})}),Object(n.jsx)("li",{children:Object(n.jsx)(j.b,{to:"/zoomableStack",children:"Zoomable Stack"})})]})]})},b=c(18),o=c(7),O=c(9),d=function(e){return Array(e).fill(0).map((function(){return Math.floor(10*Math.random())}))},h=d(10),f=function(e){var t=e.index,c=e.isShowing,i=Object(r.useRef)(!1);Object(r.useEffect)((function(){i.current=c}),[c]);var a=Object(O.b)({config:{duration:800},r:c?2:0,opacity:c?1:0});return Object(n.jsx)(O.a.circle,Object(b.a)(Object(b.a)({},a),{},{cx:5*t+20,cy:"10",fill:c?i.current?"lightgrey":"aquamarine":"pink"}))},x=function(){var e=Object(r.useState)(h),t=Object(o.a)(e,2),c=t[0],i=t[1];return function(e,t){var c=Object(r.useRef)();Object(r.useEffect)((function(){c.current=e}),[e]),Object(r.useEffect)((function(){if(null!==t){var e=setInterval((function(){c.current()}),t);return function(){return clearInterval(e)}}}),[t])}((function(){i(d(6))}),2e3),Object(n.jsx)("svg",{viewBox:"0 0 100 20",children:h.map((function(e){return Object(n.jsx)(f,{index:e,isShowing:c.includes(e)},e.key)}))})},m=c(5),v={"WHOIS Records":1e3,"CDN Assets":800,"SSL Certs":700,"DNS Lookups":500,"Small Cat 1":300,"Small Cat 2":200,"Small Cat 3":100,"Smallest Cat":50},p=(c(33),function(e){var t=e.title,c=e.value,i=e.index,a=e.height,s=e.isShowing,j=Object(r.useRef)(!1);Object(r.useEffect)((function(){j.current=s}),[s]);var u=Object(O.b)({config:{duration:300},opacity:s?1:0,height:s?a:0,backgroundColor:a<30?"#333":i%2===0?"#abcccf":"#f1faeb",width:400});return Object(n.jsx)(O.a.div,{className:"box",style:u,children:a>30&&Object(n.jsxs)("span",{children:[" ",Object(n.jsx)("b",{children:t})," ",c]})})}),g=function(){var e=Object(r.useState)(v),t=Object(o.a)(e,2),c=t[0],i=t[1],a=Object(r.useState)(100),s=Object(o.a)(a,2),j=s[0],u=s[1],l=Math.min.apply(Math,Object(m.a)(Object.values(v))),b=Math.max.apply(Math,Object(m.a)(Object.values(v))),O=function(e,t){Object.keys(c).includes(e);return t/Object.values(c).reduce((function(e,t){return e+t}))*500};return Object(n.jsxs)("div",{className:"container",children:[Object(n.jsxs)("div",{className:"zoom",children:[Object(n.jsx)("input",{className:"input-range",orient:"vertical",type:"range",step:"1",min:"1",max:"100",value:j,onChange:function(e){var t=e.target.value;u(t);var c=t/100*b+l,n=Object.fromEntries(Object.entries(v).filter((function(e){var t=Object(o.a)(e,2);t[0];return t[1]<c})));return i(n),n}}),Object(n.jsxs)("p",{children:["zoom level",Object(n.jsx)("br",{}),100-j]})]}),Object(n.jsx)("div",{className:"stack",children:Object.entries(v).map((function(e,t){var r=Object(o.a)(e,2),i=r[0],a=r[1];return Object(n.jsx)(p,{index:t,value:a,title:i,height:O(i,a),isShowing:Object.keys(c).includes(i)},i)}))})]})},S=(c(34),function(){return Object(n.jsx)("nav",{children:Object(n.jsx)(j.b,{to:"/",children:" \u2190 Back"})})}),C=function(){return Object(n.jsx)(j.a,{children:Object(n.jsx)("div",{className:"App",children:Object(n.jsxs)(u.c,{children:[Object(n.jsx)(u.a,{exact:!0,path:"/",children:Object(n.jsx)(l,{})}),Object(n.jsx)(u.a,{path:"/animatedCircles",children:Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)(S,{}),Object(n.jsx)(x,{})]})}),Object(n.jsx)(u.a,{path:"/zoomableStack",children:Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)(S,{}),Object(n.jsx)(g,{})]})})]})})})},k=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,36)).then((function(t){var c=t.getCLS,n=t.getFID,r=t.getFCP,i=t.getLCP,a=t.getTTFB;c(e),n(e),r(e),i(e),a(e)}))};s.a.render(Object(n.jsx)(i.a.StrictMode,{children:Object(n.jsx)(C,{})}),document.getElementById("root")),k()}},[[35,1,2]]]);
//# sourceMappingURL=main.2932eabe.chunk.js.map